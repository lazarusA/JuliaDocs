
# `EscapeAnalysis` {#EscapeAnalysis}

`Core.Compiler.EscapeAnalysis` is a compiler utility module that aims to analyze escape information of [Julia&#39;s SSA-form IR](/devdocs/ssair#Julia-SSA-form-IR) a.k.a. `IRCode`.

This escape analysis aims to:
- leverage Julia&#39;s high-level semantics, especially reason about escapes and aliasing via inter-procedural calls
  
- be versatile enough to be used for various optimizations including [alias-aware SROA](https://github.com/JuliaLang/julia/pull/43888), [early `finalize` insertion](https://github.com/JuliaLang/julia/pull/44056), [copy-free `ImmutableArray` construction](https://github.com/JuliaLang/julia/pull/42465), stack allocation of mutable objects, and so on.
  
- achieve a simple implementation based on a fully backward data-flow analysis implementation as well as a new lattice design that combines orthogonal lattice properties
  

## Try it out! {#Try-it-out!}

You can give a try to the escape analysis by loading the `EAUtils.jl` utility script that defines the convenience entries `code_escapes` and `@code_escapes` for testing and debugging purposes:

```julia
julia> let JULIA_DIR = normpath(Sys.BINDIR, "..", "share", "julia")
           # load `EscapeAnalysis` module to define the core analysis code
           include(normpath(JULIA_DIR, "base", "compiler", "ssair", "EscapeAnalysis", "EscapeAnalysis.jl"))
           using .EscapeAnalysis
           # load `EAUtils` module to define the utilities
           include(normpath(JULIA_DIR, "test", "compiler", "EscapeAnalysis", "EAUtils.jl"))
           using .EAUtils
       end

julia> mutable struct SafeRef{T}
           x::T
       end

julia> Base.getindex(x::SafeRef) = x.x;

julia> Base.setindex!(x::SafeRef, v) = x.x = v;

julia> Base.isassigned(x::SafeRef) = true;

julia> get′(x) = isassigned(x) ? x[] : throw(x);

julia> result = code_escapes((String,String,String,String)) do s1, s2, s3, s4
           r1 = Ref(s1)
           r2 = Ref(s2)
           r3 = SafeRef(s3)
           try
               s1 = get′(r1)
               ret = sizeof(s1)
           catch err
               global GV = err # will definitely escape `r1`
           end
           s2 = get′(r2)       # still `r2` doesn't escape fully
           s3 = get′(r3)       # still `r3` doesn't escape fully
           s4 = sizeof(s4)     # the argument `s4` doesn't escape here
           return s2, s3, s4
       end
#1(X s1::String, ↑ s2::String, ↑ s3::String, ✓ s4::String) in Main at REPL[7]:2
X  1 ── %1  = %new(Base.RefValue{String}, _2)::Base.RefValue{String}
*′ │    %2  = %new(Base.RefValue{String}, _3)::Base.RefValue{String}
✓′ └─── %3  = %new(Main.SafeRef{String}, _4)::Main.SafeRef{String}
✓′ 2 ── %4  = ϒ (%3)::Main.SafeRef{String}
*′ │    %5  = ϒ (%2)::Base.RefValue{String}
✓  │    %6  = ϒ (_5)::String
◌  └─── %7  = enter #8
◌  3 ── %8  = Base.isdefined(%1, :x)::Bool
◌  └───       goto #5 if not %8
X  4 ──       Base.getfield(%1, :x)::String
◌  └───       goto #6
◌  5 ──       Main.throw(%1)::Union{}
◌  └───       unreachable
◌  6 ──       $(Expr(:leave, :(%7)))
◌  7 ──       goto #11
✓′ 8 ┄─ %16 = φᶜ (%4)::Main.SafeRef{String}
*′ │    %17 = φᶜ (%5)::Base.RefValue{String}
✓  │    %18 = φᶜ (%6)::String
X  └─── %19 = $(Expr(:the_exception))::Any
◌  9 ──       nothing::Nothing
◌  10 ─       (Main.GV = %19)::Any
◌  └───       $(Expr(:pop_exception, :(%7)))::Core.Const(nothing)
✓′ 11 ┄ %23 = φ (#7 => %3, #10 => %16)::Main.SafeRef{String}
*′ │    %24 = φ (#7 => %2, #10 => %17)::Base.RefValue{String}
✓  │    %25 = φ (#7 => _5, #10 => %18)::String
◌  │    %26 = Base.isdefined(%24, :x)::Bool
◌  └───       goto #13 if not %26
↑  12 ─ %28 = Base.getfield(%24, :x)::String
◌  └───       goto #14
◌  13 ─       Main.throw(%24)::Union{}
◌  └───       unreachable
↑  14 ─ %32 = Base.getfield(%23, :x)::String
◌  │    %33 = Core.sizeof(%25)::Int64
↑′ │    %34 = Core.tuple(%28, %32, %33)::Tuple{String, String, Int64}
◌  └───       return %34
```


The symbols on the side of each call argument and SSA statements represent the following meaning:
- `◌` (plain): this value is not analyzed because escape information of it won&#39;t be used anyway (when the object is `isbitstype` for example)
  
- `✓` (green or cyan): this value never escapes (`has_no_escape(result.state[x])` holds), colored blue if it has arg escape also (`has_arg_escape(result.state[x])` holds)
  
- `↑` (blue or yellow): this value can escape to the caller via return (`has_return_escape(result.state[x])` holds), colored yellow if it has unhandled thrown escape also (`has_thrown_escape(result.state[x])` holds)
  
- `X` (red): this value can escape to somewhere the escape analysis can&#39;t reason about like escapes to a global memory (`has_all_escape(result.state[x])` holds)
  
- `*` (bold): this value&#39;s escape state is between the `ReturnEscape` and `AllEscape` in the partial order of [`EscapeInfo`](/devdocs/EscapeAnalysis#Core.Compiler.EscapeAnalysis.EscapeInfo), colored yellow if it has unhandled thrown escape also (`has_thrown_escape(result.state[x])` holds)
  
- `′`: this value has additional object field / array element information in its `AliasInfo` property
  

Escape information of each call argument and SSA value can be inspected programmatically as like:

```julia
julia> result.state[Core.Argument(3)] # get EscapeInfo of `s2`
ReturnEscape

julia> result.state[Core.SSAValue(3)] # get EscapeInfo of `r3`
NoEscape′
```


## Analysis Design {#Analysis-Design}

### Lattice Design {#Lattice-Design}

`EscapeAnalysis` is implemented as a [data-flow analysis](https://en.wikipedia.org/wiki/Data-flow_analysis) that works on a lattice of [`x::EscapeInfo`](/devdocs/EscapeAnalysis#Core.Compiler.EscapeAnalysis.EscapeInfo), which is composed of the following properties:
- `x.Analyzed::Bool`: not formally part of the lattice, only indicates `x` has not been analyzed or not
  
- `x.ReturnEscape::BitSet`: records SSA statements where `x` can escape to the caller via return
  
- `x.ThrownEscape::BitSet`: records SSA statements where `x` can be thrown as exception (used for the [exception handling](/devdocs/EscapeAnalysis#EA-Exception-Handling) described below)
  
- `x.AliasInfo`: maintains all possible values that can be aliased to fields or array elements of `x` (used for the [alias analysis](/devdocs/EscapeAnalysis#EA-Alias-Analysis) described below)
  
- `x.ArgEscape::Int` (not implemented yet): indicates it will escape to the caller through `setfield!` on argument(s)
  

These attributes can be combined to create a partial lattice that has a finite height, given the invariant that an input program has a finite number of statements, which is assured by Julia&#39;s semantics. The clever part of this lattice design is that it enables a simpler implementation of lattice operations by allowing them to handle each lattice property separately[^LatticeDesign].

### Backward Escape Propagation {#Backward-Escape-Propagation}

This escape analysis implementation is based on the data-flow algorithm described in the paper[^MM02]. The analysis works on the lattice of `EscapeInfo` and transitions lattice elements from the bottom to the top until every lattice element gets converged to a fixed point by maintaining a (conceptual) working set that contains program counters corresponding to remaining SSA statements to be analyzed. The analysis manages a single global state that tracks `EscapeInfo` of each argument and SSA statement, but also note that some flow-sensitivity is encoded as program counters recorded in `EscapeInfo`&#39;s `ReturnEscape` property, which can be combined with domination analysis later to reason about flow-sensitivity if necessary.

One distinctive design of this escape analysis is that it is fully _backward_, i.e. escape information flows _from usages to definitions_. For example, in the code snippet below, EA first analyzes the statement `return %1` and imposes `ReturnEscape` on `%1` (corresponding to `obj`), and then it analyzes `%1 = %new(Base.RefValue{String, _2}))` and propagates the `ReturnEscape` imposed on `%1` to the call argument `_2` (corresponding to `s`):

```julia
julia> code_escapes((String,)) do s
           obj = Ref(s)
           return obj
       end
#3(↑ s::String) in Main at REPL[1]:2
↑′ 1 ─ %1 = %new(Base.RefValue{String}, _2)::Base.RefValue{String}
◌  └──      return %1
```


The key observation here is that this backward analysis allows escape information to flow naturally along the use-def chain rather than control-flow[^BackandForth]. As a result this scheme enables a simple implementation of escape analysis, e.g. `PhiNode` for example can be handled simply by propagating escape information imposed on a `PhiNode` to its predecessor values:

```julia
julia> code_escapes((Bool, String, String)) do cnd, s, t
           if cnd
               obj = Ref(s)
           else
               obj = Ref(t)
           end
           return obj
       end
#5(✓ cnd::Bool, ↑ s::String, ↑ t::String) in Main at REPL[1]:2
◌  1 ─      goto #3 if not _2
↑′ 2 ─ %2 = %new(Base.RefValue{String}, _3)::Base.RefValue{String}
◌  └──      goto #4
↑′ 3 ─ %4 = %new(Base.RefValue{String}, _4)::Base.RefValue{String}
↑′ 4 ┄ %5 = φ (#2 => %2, #3 => %4)::Base.RefValue{String}
◌  └──      return %5
```


### Alias Analysis {#EA-Alias-Analysis}

`EscapeAnalysis` implements a backward field analysis in order to reason about escapes imposed on object fields with certain accuracy, and `x::EscapeInfo`&#39;s `x.AliasInfo` property exists for this purpose. It records all possible values that can be aliased to fields of `x` at &quot;usage&quot; sites, and then the escape information of that recorded values are propagated to the actual field values later at &quot;definition&quot; sites. More specifically, the analysis records a value that may be aliased to a field of object by analyzing `getfield` call, and then it propagates its escape information to the field when analyzing `%new(...)` expression or `setfield!` call[^Dynamism].

```julia
julia> code_escapes((String,)) do s
           obj = SafeRef("init")
           obj[] = s
           v = obj[]
           return v
       end
#7(↑ s::String) in Main at REPL[1]:2
◌  1 ─     return _2
```


In the example above, `ReturnEscape` imposed on `%3` (corresponding to `v`) is _not_ directly propagated to `%1` (corresponding to `obj`) but rather that `ReturnEscape` is only propagated to `_2` (corresponding to `s`). Here `%3` is recorded in `%1`&#39;s `AliasInfo` property as it can be aliased to the first field of `%1`, and then when analyzing `Base.setfield!(%1, :x, _2)::String`, that escape information is propagated to `_2` but not to `%1`.

So `EscapeAnalysis` tracks which IR elements can be aliased across a `getfield`-`%new`/`setfield!` chain in order to analyze escapes of object fields, but actually this alias analysis needs to be generalized to handle other IR elements as well. This is because in Julia IR the same object is sometimes represented by different IR elements and so we should make sure that those different IR elements that actually can represent the same object share the same escape information. IR elements that return the same object as their operand(s), such as `PiNode` and `typeassert`, can cause that IR-level aliasing and thus requires escape information imposed on any of such aliased values to be shared between them. More interestingly, it is also needed for correctly reasoning about mutations on `PhiNode`. Let&#39;s consider the following example:

```julia
julia> code_escapes((Bool, String,)) do cond, x
           if cond
               ϕ2 = ϕ1 = SafeRef("foo")
           else
               ϕ2 = ϕ1 = SafeRef("bar")
           end
           ϕ2[] = x
           y = ϕ1[]
           return y
       end
#9(✓ cond::Bool, ↑ x::String) in Main at REPL[1]:2
◌  1 ─      goto #3 if not _2
✓′ 2 ─ %2 = %new(Main.SafeRef{String}, "foo")::Main.SafeRef{String}
◌  └──      goto #4
✓′ 3 ─ %4 = %new(Main.SafeRef{String}, "bar")::Main.SafeRef{String}
✓′ 4 ┄ %5 = φ (#2 => %2, #3 => %4)::Main.SafeRef{String}
✓′ │   %6 = φ (#2 => %2, #3 => %4)::Main.SafeRef{String}
◌  │        Base.setfield!(%5, :x, _3)::String
↑  │   %8 = Base.getfield(%6, :x)::String
◌  └──      return %8
```


`ϕ1 = %5` and `ϕ2 = %6` are aliased and thus `ReturnEscape` imposed on `%8 = Base.getfield(%6, :x)::String` (corresponding to `y = ϕ1[]`) needs to be propagated to `Base.setfield!(%5, :x, _3)::String` (corresponding to `ϕ2[] = x`). In order for such escape information to be propagated correctly, the analysis should recognize that the _predecessors_ of `ϕ1` and `ϕ2` can be aliased as well and equalize their escape information.

One interesting property of such aliasing information is that it is not known at &quot;usage&quot; site but can only be derived at &quot;definition&quot; site (as aliasing is conceptually equivalent to assignment), and thus it doesn&#39;t naturally fit in a backward analysis. In order to efficiently propagate escape information between related values, EscapeAnalysis.jl uses an approach inspired by the escape analysis algorithm explained in an old JVM paper[^JVM05]. That is, in addition to managing escape lattice elements, the analysis also maintains an &quot;equi&quot;-alias set, a disjoint set of aliased arguments and SSA statements. The alias set manages values that can be aliased to each other and allows escape information imposed on any of such aliased values to be equalized between them.

### Array Analysis {#EA-Array-Analysis}

The alias analysis for object fields described above can also be generalized to analyze array operations. `EscapeAnalysis` implements handlings for various primitive array operations so that it can propagate escapes via `arrayref`-`arrayset` use-def chain and does not escape allocated arrays too conservatively:

```julia
julia> code_escapes((String,)) do s
           ary = Any[]
           push!(ary, SafeRef(s))
           return ary[1], length(ary)
       end
#11(X s::String) in Main at REPL[1]:2
X  1 ── %1  = Core.getproperty(Memory{Any}, :instance)::Memory{Any}
X  │    %2  = Core.memoryref(%1)::MemoryRef{Any}
X  │    %3  = %new(Vector{Any}, %2, (0,))::Vector{Any}
X  │    %4  = %new(Main.SafeRef{String}, _2)::Main.SafeRef{String}
X  │    %5  = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %6  = Base.getfield(%5, :mem)::Memory{Any}
X  │    %7  = Base.getfield(%6, :length)::Int64
X  │    %8  = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %9  = $(Expr(:boundscheck, true))::Bool
X  │    %10 = Base.getfield(%8, 1, %9)::Int64
◌  │    %11 = Base.add_int(%10, 1)::Int64
◌  │    %12 = Base.memoryrefoffset(%5)::Int64
X  │    %13 = Core.tuple(%11)::Tuple{Int64}
◌  │          Base.setfield!(%3, :size, %13)::Tuple{Int64}
◌  │    %15 = Base.add_int(%12, %11)::Int64
◌  │    %16 = Base.sub_int(%15, 1)::Int64
◌  │    %17 = Base.slt_int(%7, %16)::Bool
◌  └───       goto #3 if not %17
X  2 ── %19 = %new(Base.var"#133#134"{Vector{Any}, Int64, Int64, Int64, Int64, Int64, Memory{Any}, MemoryRef{Any}}, %3, %16, %12, %11, %10, %7, %6, %5)::Base.var"#133#134"{Vector{Any}, Int64, Int64, Int64, Int64, Int64, Memory{Any}, MemoryRef{Any}}
✓  └───       invoke %19()::MemoryRef{Any}
◌  3 ┄─       goto #4
X  4 ── %22 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %23 = $(Expr(:boundscheck, true))::Bool
X  │    %24 = Base.getfield(%22, 1, %23)::Int64
X  │    %25 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %26 = Base.memoryref(%25, %24, false)::MemoryRef{Any}
X  │          Base.memoryrefset!(%26, %4, :not_atomic, false)::Main.SafeRef{String}
◌  └───       goto #5
◌  5 ── %29 = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #9 if not %29
◌  6 ── %31 = Base.sub_int(1, 1)::Int64
◌  │    %32 = Base.bitcast(Base.UInt, %31)::UInt64
X  │    %33 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %34 = $(Expr(:boundscheck, true))::Bool
X  │    %35 = Base.getfield(%33, 1, %34)::Int64
◌  │    %36 = Base.bitcast(Base.UInt, %35)::UInt64
◌  │    %37 = Base.ult_int(%32, %36)::Bool
◌  └───       goto #8 if not %37
◌  7 ──       goto #9
◌  8 ── %40 = Core.tuple(1)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %40::Tuple{Int64})::Union{}
◌  └───       unreachable
X  9 ┄─ %43 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %44 = Base.memoryref(%43, 1, false)::MemoryRef{Any}
X  │    %45 = Base.memoryrefget(%44, :not_atomic, false)::Any
◌  └───       goto #10
X  10 ─ %47 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %48 = $(Expr(:boundscheck, true))::Bool
X  │    %49 = Base.getfield(%47, 1, %48)::Int64
↑′ │    %50 = Core.tuple(%45, %49)::Tuple{Any, Int64}
◌  └───       return %50
```


In the above example `EscapeAnalysis` understands that `%20` and `%2` (corresponding to the allocated object `SafeRef(s)`) are aliased via the `arrayset`-`arrayref` chain and imposes `ReturnEscape` on them, but not impose it on the allocated array `%1` (corresponding to `ary`). `EscapeAnalysis` still imposes `ThrownEscape` on `ary` since it also needs to account for potential escapes via `BoundsError`, but also note that such unhandled `ThrownEscape` can often be ignored when optimizing the `ary` allocation.

Furthermore, in cases when array index information as well as array dimensions can be known _precisely_, `EscapeAnalysis` is able to even reason about &quot;per-element&quot; aliasing via `arrayref`-`arrayset` chain, as `EscapeAnalysis` does &quot;per-field&quot; alias analysis for objects:

```julia
julia> code_escapes((String,String)) do s, t
           ary = Vector{Any}(undef, 2)
           ary[1] = SafeRef(s)
           ary[2] = SafeRef(t)
           return ary[1], length(ary)
       end
#13(X s::String, X t::String) in Main at REPL[1]:2
X  1 ── %1  = $(Expr(:foreigncall, :(:jl_alloc_genericmemory), Ref{Memory{Any}}, svec(Any, Int64), 0, :(:ccall), Memory{Any}, 2, 2))::Memory{Any}
X  │    %2  = Core.memoryref(%1)::MemoryRef{Any}
X  │    %3  = %new(Vector{Any}, %2, (2,))::Vector{Any}
X  │    %4  = %new(Main.SafeRef{String}, _2)::Main.SafeRef{String}
◌  │    %5  = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #5 if not %5
◌  2 ── %7  = Base.sub_int(1, 1)::Int64
◌  │    %8  = Base.bitcast(Base.UInt, %7)::UInt64
X  │    %9  = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %10 = $(Expr(:boundscheck, true))::Bool
X  │    %11 = Base.getfield(%9, 1, %10)::Int64
◌  │    %12 = Base.bitcast(Base.UInt, %11)::UInt64
◌  │    %13 = Base.ult_int(%8, %12)::Bool
◌  └───       goto #4 if not %13
◌  3 ──       goto #5
◌  4 ── %16 = Core.tuple(1)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %16::Tuple{Int64})::Union{}
◌  └───       unreachable
X  5 ┄─ %19 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %20 = Base.memoryref(%19, 1, false)::MemoryRef{Any}
X  │          Base.memoryrefset!(%20, %4, :not_atomic, false)::Main.SafeRef{String}
◌  └───       goto #6
X  6 ── %23 = %new(Main.SafeRef{String}, _3)::Main.SafeRef{String}
◌  │    %24 = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #10 if not %24
◌  7 ── %26 = Base.sub_int(2, 1)::Int64
◌  │    %27 = Base.bitcast(Base.UInt, %26)::UInt64
X  │    %28 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %29 = $(Expr(:boundscheck, true))::Bool
X  │    %30 = Base.getfield(%28, 1, %29)::Int64
◌  │    %31 = Base.bitcast(Base.UInt, %30)::UInt64
◌  │    %32 = Base.ult_int(%27, %31)::Bool
◌  └───       goto #9 if not %32
◌  8 ──       goto #10
◌  9 ── %35 = Core.tuple(2)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %35::Tuple{Int64})::Union{}
◌  └───       unreachable
X  10 ┄ %38 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %39 = Base.memoryref(%38, 2, false)::MemoryRef{Any}
X  │          Base.memoryrefset!(%39, %23, :not_atomic, false)::Main.SafeRef{String}
◌  └───       goto #11
◌  11 ─ %42 = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #15 if not %42
◌  12 ─ %44 = Base.sub_int(1, 1)::Int64
◌  │    %45 = Base.bitcast(Base.UInt, %44)::UInt64
X  │    %46 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %47 = $(Expr(:boundscheck, true))::Bool
X  │    %48 = Base.getfield(%46, 1, %47)::Int64
◌  │    %49 = Base.bitcast(Base.UInt, %48)::UInt64
◌  │    %50 = Base.ult_int(%45, %49)::Bool
◌  └───       goto #14 if not %50
◌  13 ─       goto #15
◌  14 ─ %53 = Core.tuple(1)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %53::Tuple{Int64})::Union{}
◌  └───       unreachable
X  15 ┄ %56 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %57 = Base.memoryref(%56, 1, false)::MemoryRef{Any}
X  │    %58 = Base.memoryrefget(%57, :not_atomic, false)::Any
◌  └───       goto #16
X  16 ─ %60 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %61 = $(Expr(:boundscheck, true))::Bool
X  │    %62 = Base.getfield(%60, 1, %61)::Int64
↑′ │    %63 = Core.tuple(%58, %62)::Tuple{Any, Int64}
◌  └───       return %63
```


Note that `ReturnEscape` is only imposed on `%2` (corresponding to `SafeRef(s)`) but not on `%4` (corresponding to `SafeRef(t)`). This is because the allocated array&#39;s dimension and indices involved with all `arrayref`/`arrayset` operations are available as constant information and `EscapeAnalysis` can understand that `%6` is aliased to `%2` but never be aliased to `%4`. In this kind of case, the succeeding optimization passes will be able to replace `Base.arrayref(true, %1, 1)::Any` with `%2` (a.k.a. &quot;load-forwarding&quot;) and eventually eliminate the allocation of array `%1` entirely (a.k.a. &quot;scalar-replacement&quot;).

When compared to object field analysis, where an access to object field can be analyzed trivially using type information derived by inference, array dimension isn&#39;t encoded as type information and so we need an additional analysis to derive that information. `EscapeAnalysis` at this moment first does an additional simple linear scan to analyze dimensions of allocated arrays before firing up the main analysis routine so that the succeeding escape analysis can precisely analyze operations on those arrays.

However, such precise &quot;per-element&quot; alias analysis is often hard. Essentially, the main difficulty inherit to array is that array dimension and index are often non-constant:
- loop often produces loop-variant, non-constant array indices
  
- (specific to vectors) array resizing changes array dimension and invalidates its constant-ness
  

Let&#39;s discuss those difficulties with concrete examples.

In the following example, `EscapeAnalysis` fails the precise alias analysis since the index at the `Base.arrayset(false, %4, %8, %6)::Vector{Any}` is not (trivially) constant. Especially `Any[nothing, nothing]` forms a loop and calls that `arrayset` operation in a loop, where `%6` is represented as a ϕ-node value (whose value is control-flow dependent). As a result, `ReturnEscape` ends up imposed on both `%23` (corresponding to `SafeRef(s)`) and `%25` (corresponding to `SafeRef(t)`), although ideally we want it to be imposed only on `%23` but not on `%25`:

```julia
julia> code_escapes((String,String)) do s, t
           ary = Any[nothing, nothing]
           ary[1] = SafeRef(s)
           ary[2] = SafeRef(t)
           return ary[1], length(ary)
       end
#15(X s::String, X t::String) in Main at REPL[1]:2
X  1 ── %1  = $(Expr(:foreigncall, :(:jl_alloc_genericmemory), Ref{Memory{Any}}, svec(Any, Int64), 0, :(:ccall), Memory{Any}, 2, 2))::Memory{Any}
X  │    %2  = Core.memoryref(%1)::MemoryRef{Any}
X  └─── %3  = %new(Vector{Any}, %2, (2,))::Vector{Any}
◌  2 ┄─ %4  = φ (#1 => 1, #6 => %14)::Int64
◌  │    %5  = φ (#1 => 1, #6 => %15)::Int64
X  │    %6  = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %7  = Base.memoryref(%6, %4, false)::MemoryRef{Any}
◌  │          Base.memoryrefset!(%7, nothing, :not_atomic, false)::Nothing
◌  │    %9  = (%5 === 2)::Bool
◌  └───       goto #4 if not %9
◌  3 ──       goto #5
◌  4 ── %12 = Base.add_int(%5, 1)::Int64
◌  └───       goto #5
◌  5 ┄─ %14 = φ (#4 => %12)::Int64
◌  │    %15 = φ (#4 => %12)::Int64
◌  │    %16 = φ (#3 => true, #4 => false)::Bool
◌  │    %17 = Base.not_int(%16)::Bool
◌  └───       goto #7 if not %17
◌  6 ──       goto #2
◌  7 ──       goto #8
X  8 ── %21 = %new(Main.SafeRef{String}, _2)::Main.SafeRef{String}
◌  │    %22 = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #12 if not %22
◌  9 ── %24 = Base.sub_int(1, 1)::Int64
◌  │    %25 = Base.bitcast(Base.UInt, %24)::UInt64
X  │    %26 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %27 = $(Expr(:boundscheck, true))::Bool
X  │    %28 = Base.getfield(%26, 1, %27)::Int64
◌  │    %29 = Base.bitcast(Base.UInt, %28)::UInt64
◌  │    %30 = Base.ult_int(%25, %29)::Bool
◌  └───       goto #11 if not %30
◌  10 ─       goto #12
◌  11 ─ %33 = Core.tuple(1)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %33::Tuple{Int64})::Union{}
◌  └───       unreachable
X  12 ┄ %36 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %37 = Base.memoryref(%36, 1, false)::MemoryRef{Any}
X  │          Base.memoryrefset!(%37, %21, :not_atomic, false)::Main.SafeRef{String}
◌  └───       goto #13
X  13 ─ %40 = %new(Main.SafeRef{String}, _3)::Main.SafeRef{String}
◌  │    %41 = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #17 if not %41
◌  14 ─ %43 = Base.sub_int(2, 1)::Int64
◌  │    %44 = Base.bitcast(Base.UInt, %43)::UInt64
X  │    %45 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %46 = $(Expr(:boundscheck, true))::Bool
X  │    %47 = Base.getfield(%45, 1, %46)::Int64
◌  │    %48 = Base.bitcast(Base.UInt, %47)::UInt64
◌  │    %49 = Base.ult_int(%44, %48)::Bool
◌  └───       goto #16 if not %49
◌  15 ─       goto #17
◌  16 ─ %52 = Core.tuple(2)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %52::Tuple{Int64})::Union{}
◌  └───       unreachable
X  17 ┄ %55 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %56 = Base.memoryref(%55, 2, false)::MemoryRef{Any}
X  │          Base.memoryrefset!(%56, %40, :not_atomic, false)::Main.SafeRef{String}
◌  └───       goto #18
◌  18 ─ %59 = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #22 if not %59
◌  19 ─ %61 = Base.sub_int(1, 1)::Int64
◌  │    %62 = Base.bitcast(Base.UInt, %61)::UInt64
X  │    %63 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %64 = $(Expr(:boundscheck, true))::Bool
X  │    %65 = Base.getfield(%63, 1, %64)::Int64
◌  │    %66 = Base.bitcast(Base.UInt, %65)::UInt64
◌  │    %67 = Base.ult_int(%62, %66)::Bool
◌  └───       goto #21 if not %67
◌  20 ─       goto #22
◌  21 ─ %70 = Core.tuple(1)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %70::Tuple{Int64})::Union{}
◌  └───       unreachable
X  22 ┄ %73 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %74 = Base.memoryref(%73, 1, false)::MemoryRef{Any}
X  │    %75 = Base.memoryrefget(%74, :not_atomic, false)::Any
◌  └───       goto #23
X  23 ─ %77 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %78 = $(Expr(:boundscheck, true))::Bool
X  │    %79 = Base.getfield(%77, 1, %78)::Int64
↑′ │    %80 = Core.tuple(%75, %79)::Tuple{Any, Int64}
◌  └───       return %80
```


The next example illustrates how vector resizing makes precise alias analysis hard. The essential difficulty is that the dimension of allocated array `%1` is first initialized as `0`, but it changes by the two `:jl_array_grow_end` calls afterwards. `EscapeAnalysis` currently simply gives up precise alias analysis whenever it encounters any array resizing operations and so `ReturnEscape` is imposed on both `%2` (corresponding to `SafeRef(s)`) and `%20` (corresponding to `SafeRef(t)`):

```julia
julia> code_escapes((String,String)) do s, t
           ary = Any[]
           push!(ary, SafeRef(s))
           push!(ary, SafeRef(t))
           ary[1], length(ary)
       end
#17(X s::String, X t::String) in Main at REPL[1]:2
X  1 ── %1  = Core.getproperty(Memory{Any}, :instance)::Memory{Any}
X  │    %2  = Core.memoryref(%1)::MemoryRef{Any}
X  │    %3  = %new(Vector{Any}, %2, (0,))::Vector{Any}
X  │    %4  = %new(Main.SafeRef{String}, _2)::Main.SafeRef{String}
X  │    %5  = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %6  = Base.getfield(%5, :mem)::Memory{Any}
X  │    %7  = Base.getfield(%6, :length)::Int64
X  │    %8  = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %9  = $(Expr(:boundscheck, true))::Bool
X  │    %10 = Base.getfield(%8, 1, %9)::Int64
◌  │    %11 = Base.add_int(%10, 1)::Int64
◌  │    %12 = Base.memoryrefoffset(%5)::Int64
X  │    %13 = Core.tuple(%11)::Tuple{Int64}
◌  │          Base.setfield!(%3, :size, %13)::Tuple{Int64}
◌  │    %15 = Base.add_int(%12, %11)::Int64
◌  │    %16 = Base.sub_int(%15, 1)::Int64
◌  │    %17 = Base.slt_int(%7, %16)::Bool
◌  └───       goto #3 if not %17
X  2 ── %19 = %new(Base.var"#133#134"{Vector{Any}, Int64, Int64, Int64, Int64, Int64, Memory{Any}, MemoryRef{Any}}, %3, %16, %12, %11, %10, %7, %6, %5)::Base.var"#133#134"{Vector{Any}, Int64, Int64, Int64, Int64, Int64, Memory{Any}, MemoryRef{Any}}
✓  └───       invoke %19()::MemoryRef{Any}
◌  3 ┄─       goto #4
X  4 ── %22 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %23 = $(Expr(:boundscheck, true))::Bool
X  │    %24 = Base.getfield(%22, 1, %23)::Int64
X  │    %25 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %26 = Base.memoryref(%25, %24, false)::MemoryRef{Any}
X  │          Base.memoryrefset!(%26, %4, :not_atomic, false)::Main.SafeRef{String}
◌  └───       goto #5
X  5 ── %29 = %new(Main.SafeRef{String}, _3)::Main.SafeRef{String}
X  │    %30 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %31 = Base.getfield(%30, :mem)::Memory{Any}
X  │    %32 = Base.getfield(%31, :length)::Int64
X  │    %33 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %34 = $(Expr(:boundscheck, true))::Bool
X  │    %35 = Base.getfield(%33, 1, %34)::Int64
◌  │    %36 = Base.add_int(%35, 1)::Int64
◌  │    %37 = Base.memoryrefoffset(%30)::Int64
X  │    %38 = Core.tuple(%36)::Tuple{Int64}
◌  │          Base.setfield!(%3, :size, %38)::Tuple{Int64}
◌  │    %40 = Base.add_int(%37, %36)::Int64
◌  │    %41 = Base.sub_int(%40, 1)::Int64
◌  │    %42 = Base.slt_int(%32, %41)::Bool
◌  └───       goto #7 if not %42
X  6 ── %44 = %new(Base.var"#133#134"{Vector{Any}, Int64, Int64, Int64, Int64, Int64, Memory{Any}, MemoryRef{Any}}, %3, %41, %37, %36, %35, %32, %31, %30)::Base.var"#133#134"{Vector{Any}, Int64, Int64, Int64, Int64, Int64, Memory{Any}, MemoryRef{Any}}
✓  └───       invoke %44()::MemoryRef{Any}
◌  7 ┄─       goto #8
X  8 ── %47 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %48 = $(Expr(:boundscheck, true))::Bool
X  │    %49 = Base.getfield(%47, 1, %48)::Int64
X  │    %50 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %51 = Base.memoryref(%50, %49, false)::MemoryRef{Any}
X  │          Base.memoryrefset!(%51, %29, :not_atomic, false)::Main.SafeRef{String}
◌  └───       goto #9
◌  9 ── %54 = $(Expr(:boundscheck, true))::Bool
◌  └───       goto #13 if not %54
◌  10 ─ %56 = Base.sub_int(1, 1)::Int64
◌  │    %57 = Base.bitcast(Base.UInt, %56)::UInt64
X  │    %58 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %59 = $(Expr(:boundscheck, true))::Bool
X  │    %60 = Base.getfield(%58, 1, %59)::Int64
◌  │    %61 = Base.bitcast(Base.UInt, %60)::UInt64
◌  │    %62 = Base.ult_int(%57, %61)::Bool
◌  └───       goto #12 if not %62
◌  11 ─       goto #13
◌  12 ─ %65 = Core.tuple(1)::Tuple{Int64}
✓  │          invoke Base.throw_boundserror(%3::Vector{Any}, %65::Tuple{Int64})::Union{}
◌  └───       unreachable
X  13 ┄ %68 = Base.getfield(%3, :ref)::MemoryRef{Any}
X  │    %69 = Base.memoryref(%68, 1, false)::MemoryRef{Any}
X  │    %70 = Base.memoryrefget(%69, :not_atomic, false)::Any
◌  └───       goto #14
X  14 ─ %72 = Base.getfield(%3, :size)::Tuple{Int64}
◌  │    %73 = $(Expr(:boundscheck, true))::Bool
X  │    %74 = Base.getfield(%72, 1, %73)::Int64
↑′ │    %75 = Core.tuple(%70, %74)::Tuple{Any, Int64}
◌  └───       return %75
```


In order to address these difficulties, we need inference to be aware of array dimensions and propagate array dimensions in a flow-sensitive way[^ArrayDimension], as well as come up with nice representation of loop-variant values.

`EscapeAnalysis` at this moment quickly switches to the more imprecise analysis that doesn&#39;t track precise index information in cases when array dimensions or indices are trivially non constant. The switch can naturally be implemented as a lattice join operation of `EscapeInfo.AliasInfo` property in the data-flow analysis framework.

### Exception Handling {#EA-Exception-Handling}

It would be also worth noting how `EscapeAnalysis` handles possible escapes via exceptions. Naively it seems enough to propagate escape information imposed on `:the_exception` object to all values that may be thrown in a corresponding `try` block. But there are actually several other ways to access to the exception object in Julia, such as `Base.current_exceptions` and `rethrow`. For example, escape analysis needs to account for potential escape of `r` in the example below:

```julia
julia> const GR = Ref{Any}();

julia> @noinline function rethrow_escape!()
           try
               rethrow()
           catch err
               GR[] = err
           end
       end;

julia> get′(x) = isassigned(x) ? x[] : throw(x);

julia> code_escapes() do
           r = Ref{String}()
           local t
           try
               t = get′(r)
           catch err
               t = typeof(err)   # `err` (which `r` aliases to) doesn't escape here
               rethrow_escape!() # but `r` escapes here
           end
           return t
       end
#19() in Main at REPL[4]:2
X  1 ─ %1  = %new(Base.RefValue{String})::Base.RefValue{String}
◌  2 ─ %2  = enter #8
◌  3 ─ %3  = Base.isdefined(%1, :x)::Bool
◌  └──       goto #5 if not %3
X  4 ─ %5  = Base.getfield(%1, :x)::String
◌  └──       goto #6
◌  5 ─       Main.throw(%1)::Union{}
◌  └──       unreachable
◌  6 ─       $(Expr(:leave, :(%2)))
◌  7 ─       goto #9
✓  8 ┄ %11 = $(Expr(:the_exception))::Any
X  │   %12 = Main.typeof(%11)::DataType
✓  │         invoke Main.rethrow_escape!()::Any
◌  └──       $(Expr(:pop_exception, :(%2)))::Core.Const(nothing)
X  9 ┄ %15 = φ (#7 => %5, #8 => %12)::Union{DataType, String}
◌  └──       return %15
```


It requires a global analysis in order to correctly reason about all possible escapes via existing exception interfaces. For now we always propagate the topmost escape information to all potentially thrown objects conservatively, since such an additional analysis might not be worthwhile to do given that exception handling and error path usually don&#39;t need to be very performance sensitive, and also optimizations of error paths might be very ineffective anyway since they are often even &quot;unoptimized&quot; intentionally for latency reasons.

`x::EscapeInfo`&#39;s `x.ThrownEscape` property records SSA statements where `x` can be thrown as an exception. Using this information `EscapeAnalysis` can propagate possible escapes via exceptions limitedly to only those may be thrown in each `try` region:

```julia
julia> result = code_escapes((String,String)) do s1, s2
           r1 = Ref(s1)
           r2 = Ref(s2)
           local ret
           try
               s1 = get′(r1)
               ret = sizeof(s1)
           catch err
               global GV = err # will definitely escape `r1`
           end
           s2 = get′(r2)       # still `r2` doesn't escape fully
           return s2
       end
#21(X s1::String, ↑ s2::String) in Main at REPL[1]:2
X  1 ── %1  = %new(Base.RefValue{String}, _2)::Base.RefValue{String}
*′ └─── %2  = %new(Base.RefValue{String}, _3)::Base.RefValue{String}
*′ 2 ── %3  = ϒ (%2)::Base.RefValue{String}
◌  └─── %4  = enter #8
◌  3 ── %5  = Base.isdefined(%1, :x)::Bool
◌  └───       goto #5 if not %5
X  4 ──       Base.getfield(%1, :x)::String
◌  └───       goto #6
◌  5 ──       Main.throw(%1)::Union{}
◌  └───       unreachable
◌  6 ──       $(Expr(:leave, :(%4)))
◌  7 ──       goto #11
*′ 8 ┄─ %13 = φᶜ (%3)::Base.RefValue{String}
X  └─── %14 = $(Expr(:the_exception))::Any
◌  9 ──       nothing::Nothing
◌  10 ─       (Main.GV = %14)::Any
◌  └───       $(Expr(:pop_exception, :(%4)))::Core.Const(nothing)
*′ 11 ┄ %18 = φ (#7 => %2, #10 => %13)::Base.RefValue{String}
◌  │    %19 = Base.isdefined(%18, :x)::Bool
◌  └───       goto #13 if not %19
↑  12 ─ %21 = Base.getfield(%18, :x)::String
◌  └───       goto #14
◌  13 ─       Main.throw(%18)::Union{}
◌  └───       unreachable
◌  14 ─       return %21
```


## Analysis Usage {#Analysis-Usage}

`analyze_escapes` is the entry point to analyze escape information of SSA-IR elements.

Most optimizations like SROA (`sroa_pass!`) are more effective when applied to an optimized source that the inlining pass (`ssa_inlining_pass!`) has simplified by resolving inter-procedural calls and expanding callee sources. Accordingly, `analyze_escapes` is also able to analyze post-inlining IR and collect escape information that is useful for certain memory-related optimizations.

However, since certain optimization passes like inlining can change control flows and eliminate dead code, they can break the inter-procedural validity of escape information. In particularity, in order to collect inter-procedurally valid escape information, we need to analyze a pre-inlining IR.

Because of this reason, `analyze_escapes` can analyze `IRCode` at any Julia-level optimization stage, and especially, it is supposed to be used at the following two stages:
- `IPO EA`: analyze pre-inlining IR to generate IPO-valid escape information cache
  
- `Local EA`: analyze post-inlining IR to collect locally-valid escape information
  

Escape information derived by `IPO EA` is transformed to the `ArgEscapeCache` data structure and cached globally. By passing an appropriate `get_escape_cache` callback to `analyze_escapes`, the escape analysis can improve analysis accuracy by utilizing cached inter-procedural information of non-inlined callees that has been derived by previous `IPO EA`. More interestingly, it is also valid to use `IPO EA` escape information for type inference, e.g., inference accuracy can be improved by forming `Const`/`PartialStruct`/`MustAlias` of mutable object.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Compiler.EscapeAnalysis.analyze_escapes' href='#Core.Compiler.EscapeAnalysis.analyze_escapes'>#</a>&nbsp;<b><u>Core.Compiler.EscapeAnalysis.analyze_escapes</u></b> &mdash; <i>Function</i>.




```julia
analyze_escapes(ir::IRCode, nargs::Int, get_escape_cache) -> estate::EscapeState
```


Analyzes escape information in `ir`:
- `nargs`: the number of actual arguments of the analyzed call
  
- `get_escape_cache(::MethodInstance) -> Union{Bool,ArgEscapeCache}`: retrieves cached argument escape information
  


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/compiler/ssair/EscapeAnalysis/EscapeAnalysis.jl#L608-L615)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Compiler.EscapeAnalysis.EscapeState' href='#Core.Compiler.EscapeAnalysis.EscapeState'>#</a>&nbsp;<b><u>Core.Compiler.EscapeAnalysis.EscapeState</u></b> &mdash; <i>Type</i>.




```julia
estate::EscapeState
```


Extended lattice that maps arguments and SSA values to escape information represented as [`EscapeInfo`](/devdocs/EscapeAnalysis#Core.Compiler.EscapeAnalysis.EscapeInfo). Escape information imposed on SSA IR element `x` can be retrieved by `estate[x]`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/compiler/ssair/EscapeAnalysis/EscapeAnalysis.jl#L440-L445)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Compiler.EscapeAnalysis.EscapeInfo' href='#Core.Compiler.EscapeAnalysis.EscapeInfo'>#</a>&nbsp;<b><u>Core.Compiler.EscapeAnalysis.EscapeInfo</u></b> &mdash; <i>Type</i>.




```julia
x::EscapeInfo
```


A lattice for escape information, which holds the following properties:
- `x.Analyzed::Bool`: not formally part of the lattice, only indicates whether `x` has been analyzed
  
- `x.ReturnEscape::Bool`: indicates `x` can escape to the caller via return
  
- `x.ThrownEscape::BitSet`: records SSA statement numbers where `x` can be thrown as exception:
  - `isempty(x.ThrownEscape)`: `x` will never be thrown in this call frame (the bottom)
    
  - `pc ∈ x.ThrownEscape`: `x` may be thrown at the SSA statement at `pc`
    
  - `-1 ∈ x.ThrownEscape`: `x` may be thrown at arbitrary points of this call frame (the top)
    
  This information will be used by `escape_exception!` to propagate potential escapes via exception.
  
- `x.AliasInfo::Union{Bool,IndexableFields,IndexableElements,Unindexable}`: maintains all possible values that can be aliased to fields or array elements of `x`:
  - `x.AliasInfo === false` indicates the fields/elements of `x` aren&#39;t analyzed yet
    
  - `x.AliasInfo === true` indicates the fields/elements of `x` can&#39;t be analyzed, e.g. the type of `x` is not known or is not concrete and thus its fields/elements can&#39;t be known precisely
    
  - `x.AliasInfo::IndexableFields` records all the possible values that can be aliased to fields of object `x` with precise index information
    
  - `x.AliasInfo::IndexableElements` records all the possible values that can be aliased to elements of array `x` with precise index information
    
  - `x.AliasInfo::Unindexable` records all the possible values that can be aliased to fields/elements of `x` without precise index information
    
  
- `x.Liveness::BitSet`: records SSA statement numbers where `x` should be live, e.g. to be used as a call argument, to be returned to a caller, or preserved for `:foreigncall`:
  - `isempty(x.Liveness)`: `x` is never be used in this call frame (the bottom)
    
  - `0 ∈ x.Liveness` also has the special meaning that it&#39;s a call argument of the currently analyzed call frame (and thus it&#39;s visible from the caller immediately).
    
  - `pc ∈ x.Liveness`: `x` may be used at the SSA statement at `pc`
    
  - `-1 ∈ x.Liveness`: `x` may be used at arbitrary points of this call frame (the top)
    
  

There are utility constructors to create common `EscapeInfo`s, e.g.,
- `NoEscape()`: the bottom(-like) element of this lattice, meaning it won&#39;t escape to anywhere
  
- `AllEscape()`: the topmost element of this lattice, meaning it will escape to everywhere
  

`analyze_escapes` will transition these elements from the bottom to the top, in the same direction as Julia&#39;s native type inference routine. An abstract state will be initialized with the bottom(-like) elements:
- the call arguments are initialized as `ArgEscape()`, whose `Liveness` property includes `0` to indicate that it is passed as a call argument and visible from a caller immediately
  
- the other states are initialized as `NotAnalyzed()`, which is a special lattice element that is slightly lower than `NoEscape`, but at the same time doesn&#39;t represent any meaning other than it&#39;s not analyzed yet (thus it&#39;s not formally part of the lattice)
  


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/compiler/ssair/EscapeAnalysis/EscapeAnalysis.jl#L41-L81)

</div>
<br>


---


[^LatticeDesign]: Our type inference implementation takes the alternative approach, where each lattice property is represented by a special lattice element type object. It turns out that it started to complicate implementations of the lattice operations mainly because it often requires conversion rules between each lattice element type object. And we are working on [overhauling our type inference lattice implementation](https://github.com/JuliaLang/julia/pull/42596) with `EscapeInfo`-like lattice design.


[^MM02]: _A Graph-Free approach to Data-Flow Analysis_.      Markas Mohnen, 2002, April.      [https://api.semanticscholar.org/CorpusID:28519618](https://api.semanticscholar.org/CorpusID:28519618).


[^BackandForth]: Our type inference algorithm in contrast is implemented as a forward analysis, because type information usually flows from &quot;definition&quot; to &quot;usage&quot; and it is more natural and effective to propagate such information in a forward way.


[^Dynamism]: In some cases, however, object fields can&#39;t be analyzed precisely. For example, object may escape to somewhere `EscapeAnalysis` can&#39;t account for possible memory effects on it, or fields of the objects simply can&#39;t be known because of the lack of type information. In such cases `AliasInfo` property is raised to the topmost element within its own lattice order, and it causes succeeding field analysis to be conservative and escape information imposed on fields of an unanalyzable object to be propagated to the object itself.


[^JVM05]: _Escape Analysis in the Context of Dynamic Compilation and Deoptimization_.       Thomas Kotzmann and Hanspeter Mössenböck, 2005, June.       [https://dl.acm.org/doi/10.1145/1064979.1064996](https://dl.acm.org/doi/10.1145/1064979.1064996).


[^ArrayDimension]: Otherwise we will need yet another forward data-flow analysis on top of the escape analysis.

