
# Scoped Values {#scoped-values}

Scoped values provide an implementation of dynamic scoping in Julia.

::: tip Lexical scoping vs dynamic scoping

[Lexical scoping](/manual/variables-and-scoping#scope-of-variables) is the default behavior in Julia. Under lexical scoping the scope of a variable is determined by the lexical (textual) structure of a program. Under dynamic scoping a variable is bound to the most recent assigned value during the program&#39;s execution.

:::

The state of a scoped value is dependent on the execution path of the program. This means that for a scoped value you may observe multiple different values concurrently.

::: tip Julia 1.11

Scoped values were introduced in Julia 1.11. In Julia 1.8+ a compatible implementation is available from the package ScopedValues.jl.

:::

In its simplest form you can create a [`ScopedValue`](/base/scopedvalues#Base.ScopedValues.ScopedValue) with a default value and then use [`with`](/base/scopedvalues#Base.ScopedValues.with) or [`@with`](/base/scopedvalues#Base.ScopedValues.@with) to enter a new dynamic scope. The new scope will inherit all values from the parent scope (and recursively from all outer scopes) with the provided scoped value taking priority over previous definitions.

Let&#39;s first look at an example of **lexical** scope. A `let` statement begins a new lexical scope within which the outer definition of `x` is shadowed by it&#39;s inner definition.

```julia
x = 1
let x = 5
    @show x # 5
end
@show x # 1
```


In the following example, since Julia uses lexical scope, the variable `x` in the body of `f` refers to the `x` defined in the global scope, and entering a `let` scope does not change the value `f` observes.

```julia
x = 1
f() = @show x
let x = 5
    f() # 1
end
f() # 1
```


Now using a `ScopedValue` we can use **dynamic** scoping.

```julia
using Base.ScopedValues

x = ScopedValue(1)
f() = @show x[]
with(x=>5) do
    f() # 5
end
f() # 1
```


Note that the observed value of the `ScopedValue` is dependent on the execution path of the program.

It often makes sense to use a `const` variable to point to a scoped value, and you can set the value of multiple `ScopedValue`s with one call to `with`.

```julia
using Base.ScopedValues

f() = @show a[]
g() = @show b[]

const a = ScopedValue(1)
const b = ScopedValue(2)

f() # a[] = 1
g() # b[] = 2

# Enter a new dynamic scope and set value.
with(a => 3) do
    f() # a[] = 3
    g() # b[] = 2
    with(a => 4, b => 5) do
        f() # a[] = 4
        g() # b[] = 5
    end
    f() # a[] = 3
    g() # b[] = 2
end

f() # a[] = 1
g() # b[] = 2
```


`ScopedValues` provides a macro version of `with`. The expression `@with var=>val expr` evaluates `expr` in a new dynamic scope with `var` set to `val`. `@with var=>val expr` is equivalent to `with(var=>val) do expr end`. However, `with` requires a zero-argument closure or function, which results in an extra call-frame. As an example, consider the following function `f`:

```julia
using Base.ScopedValues
const a = ScopedValue(1)
f(x) = a[] + x
```


If you wish to run `f` in a dynamic scope with `a` set to `2`, then you can use `with`:

```julia
with(() -> f(10), a=>2)
```


However, this requires wrapping `f` in a zero-argument function. If you wish to avoid the extra call-frame, then you can use the `@with` macro:

```julia
@with a=>2 f(10)
```


::: tip Note

Dynamic scopes are inherited by [`Task`](/base/parallel#Core.Task)s, at the moment of task creation. Dynamic scopes are **not** propagated through `Distributed.jl` operations.

:::

In the example below we open a new dynamic scope before launching a task. The parent task and the two child tasks observe independent values of the same scoped value at the same time.

```julia
using Base.ScopedValues
import Base.Threads: @spawn

const scoped_val = ScopedValue(1)
@sync begin
    with(scoped_val => 2)
        @spawn @show scoped_val[] # 2
    end
    with(scoped_val => 3)
        @spawn @show scoped_val[] # 3
    end
    @show scoped_val[] # 1
end
```


Scoped values are constant throughout a scope, but you can store mutable state in a scoped value. Just keep in mind that the usual caveats for global variables apply in the context of concurrent programming.

Care is also required when storing references to mutable state in scoped values. You might want to explicitly [unshare mutable state](/base/scopedvalues#unshare_mutable_state) when entering a new dynamic scope.

```julia
using Base.ScopedValues
import Base.Threads: @spawn

const sval_dict = ScopedValue(Dict())

# Example of using a mutable value wrongly
@sync begin
    # `Dict` is not thread-safe the usage below is invalid
    @spawn (sval_dict[][:a] = 3)
    @spawn (sval_dict[][:b] = 3)
end

@sync begin
    # If we instead pass a unique dictionary to each
    # task we can access the dictionaries race free.
    with(sval_dict => Dict()) do
        @spawn (sval_dict[][:a] = 3)
    end
    with(sval_dict => Dict()) do
        @spawn (sval_dict[][:b] = 3)
    end
end
```


## Example {#Example}

In the example below we use a scoped value to implement a permission check in a web-application. After determining the permissions of the request, a new dynamic scope is entered and the scoped value `LEVEL` is set. Other parts of the application can query the scoped value and will receive the appropriate value. Other alternatives like task-local storage and global variables are not well suited for this kind of propagation; our only alternative would have been to thread a value through the entire call-chain.

```julia
using Base.ScopedValues

const LEVEL = ScopedValue(:GUEST)

function serve(request, response)
    level = isAdmin(request) ? :ADMIN : :GUEST
    with(LEVEL => level) do
        Threads.@spawn handle(request, response)
    end
end

function open(connection::Database)
    level = LEVEL[]
    if level !== :ADMIN
        error("Access disallowed")
    end
    # ... open connection
end

function handle(request, response)
    # ...
    open(Database(#=...=#))
    # ...
end
```


## Idioms {#Idioms}

### Unshare mutable state {#unshare_mutable_state}

```julia
using Base.ScopedValues
import Base.Threads: @spawn

const sval_dict = ScopedValue(Dict())

# If you want to add new values to the dict, instead of replacing
# it, unshare the values explicitly. In this example we use `merge`
# to unshare the state of the dictionary in parent scope.
@sync begin
    with(sval_dict => merge(sval_dict[], Dict(:a => 10))) do
        @spawn @show sval_dict[][:a]
    end
    @spawn sval_dict[][:a] = 3 # Not a race since they are unshared.
end
```


### Scoped values as globals {#Scoped-values-as-globals}

In order to access the value of a scoped value, the scoped value itself has to be in (lexical) scope. This means most often you likely want to use scoped values as constant globals.

```julia
using Base.ScopedValues
const sval = ScopedValue(1)
```


Indeed one can think of scoped values as hidden function arguments.

This does not preclude their use as non-globals.

```julia
using Base.ScopedValues
import Base.Threads: @spawn

function main()
    role = ScopedValue(:client)

    function launch()
        #...
        role[]
    end

    @with role => :server @spawn launch()
    launch()
end
```


But it might have been simpler to just directly pass the function argument in these cases.

### Very many ScopedValues {#Very-many-ScopedValues}

If you find yourself creating many `ScopedValue`&#39;s for one given module, it may be better to use a dedicated struct to hold them.

```julia
using Base.ScopedValues

Base.@kwdef struct Configuration
    color::Bool = false
    verbose::Bool = false
end

const CONFIG = ScopedValue(Configuration(color=true))

@with CONFIG => Configuration(color=CONFIG[].color, verbose=true) begin
    @show CONFIG[].color # true
    @show CONFIG[].verbose # true
end
```


## API docs {#API-docs}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ScopedValues.ScopedValue' href='#Base.ScopedValues.ScopedValue'>#</a>&nbsp;<b><u>Base.ScopedValues.ScopedValue</u></b> &mdash; <i>Type</i>.




```julia
ScopedValue(x)
```


Create a container that propagates values across dynamic scopes. Use [`with`](/base/scopedvalues#Base.ScopedValues.with) to create and enter a new dynamic scope.

Values can only be set when entering a new dynamic scope, and the value referred to will be constant during the execution of a dynamic scope.

Dynamic scopes are propagated across tasks.

**Examples**

```julia
julia> using Base.ScopedValues;

julia> const sval = ScopedValue(1);

julia> sval[]
1

julia> with(sval => 2) do
           sval[]
       end
2

julia> sval[]
1
```


::: tip Julia 1.11

Scoped values were introduced in Julia 1.11. In Julia 1.8+ a compatible implementation is available from the package ScopedValues.jl.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/scopedvalues.jl#L8-L42)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ScopedValues.with' href='#Base.ScopedValues.with'>#</a>&nbsp;<b><u>Base.ScopedValues.with</u></b> &mdash; <i>Function</i>.




```julia
with(f, (var::ScopedValue{T} => val)...)
```


Execute `f` in a new dynamic scope with `var` set to `val`. `val` will be converted to type `T`.

See also: [`ScopedValues.@with`](/base/scopedvalues#Base.ScopedValues.@with), [`ScopedValues.ScopedValue`](/base/scopedvalues#Base.ScopedValues.ScopedValue), [`ScopedValues.get`](/base/scopedvalues#Base.ScopedValues.get).

**Examples**

```julia
julia> using Base.ScopedValues

julia> a = ScopedValue(1);

julia> f(x) = a[] + x;

julia> f(10)
11

julia> with(a=>2) do
           f(10)
       end
12

julia> f(10)
11

julia> b = ScopedValue(2);

julia> g(x) = a[] + b[] + x;

julia> with(a=>10, b=>20) do
           g(30)
       end
60

julia> with(() -> a[] * b[], a=>3, b=>4)
12
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/scopedvalues.jl#L226-L265)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ScopedValues.@with' href='#Base.ScopedValues.@with'>#</a>&nbsp;<b><u>Base.ScopedValues.@with</u></b> &mdash; <i>Macro</i>.




```julia
@with (var::ScopedValue{T} => val)... expr
```


Macro version of `with`. The expression `@with var=>val expr` evaluates `expr` in a new dynamic scope with `var` set to `val`. `val` will be converted to type `T`. `@with var=>val expr` is equivalent to `with(var=>val) do expr end`, but `@with` avoids creating a closure.

See also: [`ScopedValues.with`](/base/scopedvalues#Base.ScopedValues.with), [`ScopedValues.ScopedValue`](/base/scopedvalues#Base.ScopedValues.ScopedValue), [`ScopedValues.get`](/base/scopedvalues#Base.ScopedValues.get).

**Examples**

```julia
julia> using Base.ScopedValues

julia> const a = ScopedValue(1);

julia> f(x) = a[] + x;

julia> @with a=>2 f(10)
12

julia> @with a=>3 begin
           x = 100
           f(x)
       end
103
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/scopedvalues.jl#L184-L211)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isassigned-Tuple{Base.ScopedValues.ScopedValue}' href='#Base.isassigned-Tuple{Base.ScopedValues.ScopedValue}'>#</a>&nbsp;<b><u>Base.isassigned</u></b> &mdash; <i>Method</i>.




```julia
isassigned(val::ScopedValue)
```


Test whether a `ScopedValue` has an assigned value.

See also: [`ScopedValues.with`](/base/scopedvalues#Base.ScopedValues.with), [`ScopedValues.@with`](/base/scopedvalues#Base.ScopedValues.@with), [`ScopedValues.get`](/base/scopedvalues#Base.ScopedValues.get).

**Examples**

```julia
julia> using Base.ScopedValues

julia> a = ScopedValue(1); b = ScopedValue{Int}();

julia> isassigned(a)
true

julia> isassigned(b)
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/scopedvalues.jl#L55-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ScopedValues.get' href='#Base.ScopedValues.get'>#</a>&nbsp;<b><u>Base.ScopedValues.get</u></b> &mdash; <i>Function</i>.




```julia
get(val::ScopedValue{T})::Union{Nothing, Some{T}}
```


If the scoped value isn&#39;t set and doesn&#39;t have a default value, return `nothing`. Otherwise returns `Some{T}` with the current value.

See also: [`ScopedValues.with`](/base/scopedvalues#Base.ScopedValues.with), [`ScopedValues.@with`](/base/scopedvalues#Base.ScopedValues.@with), [`ScopedValues.ScopedValue`](/base/scopedvalues#Base.ScopedValues.ScopedValue).

**Examples**

```julia
julia> using Base.ScopedValues

julia> a = ScopedValue(42); b = ScopedValue{Int}();

julia> ScopedValues.get(a)
Some(42)

julia> isnothing(ScopedValues.get(b))
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/scopedvalues.jl#L127-L148)

</div>
<br>

## Implementation notes and performance {#Implementation-notes-and-performance}

`Scope`s use a persistent dictionary. Lookup and insertion is `O(log(32, n))`, upon dynamic scope entry a small amount of data is copied and the unchanged data is shared among other scopes.

The `Scope` object itself is not user-facing and may be changed in a future version of Julia.

## Design inspiration {#Design-inspiration}

This design was heavily inspired by [JEPS-429](https://openjdk.org/jeps/429), which in turn was inspired by dynamically scoped free variables in many Lisp dialects. In particular Interlisp-D and its deep binding strategy.

A prior design discussed was context variables ala [PEPS-567](https://peps.python.org/pep-0567/) and implemented in Julia as [ContextVariablesX.jl](https://github.com/tkf/ContextVariablesX.jl).
