
# Core.Builtins {#lib-builtins}

## Builtin Function APIs {#Builtin-Function-APIs}

The following Builtin function APIs are considered unstable, but provide the basic definitions for what defines the abilities and behaviors of a Julia program. They are typically accessed through a higher level generic API.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryref' href='#Core.memoryref'>#</a>&nbsp;<b><u>Core.memoryref</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryref(::GenericMemory)
Core.memoryref(::GenericMemoryRef, index::Int, [boundscheck::Bool])
```


Return a `GenericMemoryRef` for a `GenericMemory`. See [`MemoryRef`](/base/arrays#Core.MemoryRef).

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L25-L33)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryrefoffset' href='#Core.memoryrefoffset'>#</a>&nbsp;<b><u>Core.memoryrefoffset</u></b> &mdash; <i>Function</i>.




```julia
Core..memoryrefoffset(::GenericMemoryRef)
```


Return the offset index that was used to construct the `MemoryRef`. See [`Core.memoryref`](/devdocs/builtins#Core.memoryref).

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L36-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryrefget' href='#Core.memoryrefget'>#</a>&nbsp;<b><u>Core.memoryrefget</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryrefget(::GenericMemoryRef, ordering::Symbol, boundscheck::Bool)
```


Return the value stored at the `MemoryRef`, throwing a `BoundsError` if the `Memory` is empty. See `ref[]`. The memory ordering specified must be compatible with the `isatomic` parameter.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L46-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryrefset!' href='#Core.memoryrefset!'>#</a>&nbsp;<b><u>Core.memoryrefset!</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryrefset!(::GenericMemoryRef, value, ordering::Symbol, boundscheck::Bool)
```


Store the value to the `MemoryRef`, throwing a `BoundsError` if the `Memory` is empty. See `ref[] = value`. The memory ordering specified must be compatible with the `isatomic` parameter.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L57-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryref_isassigned' href='#Core.memoryref_isassigned'>#</a>&nbsp;<b><u>Core.memoryref_isassigned</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryref_isassigned(::GenericMemoryRef, ordering::Symbol, boundscheck::Bool)
```


Return whether there is a value stored at the `MemoryRef`, returning false if the `Memory` is empty. See [`isassigned(::Base.RefValue)`](/base/c#Base.isassigned-Tuple{Base.RefValue}), [`Core.memoryrefget`](/devdocs/builtins#Core.memoryrefget). The memory ordering specified must be compatible with the `isatomic` parameter.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L68-L77)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryrefswap!' href='#Core.memoryrefswap!'>#</a>&nbsp;<b><u>Core.memoryrefswap!</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryrefswap!(::GenericMemoryRef, value, ordering::Symbol, boundscheck::Bool)
```


Atomically perform the operations to simultaneously get and set a `MemoryRef` value.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`swapproperty!`](/base/base#Base.swapproperty!) and [`Core.memoryrefset!`](/devdocs/builtins#Core.memoryrefset!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L80-L89)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryrefmodify!' href='#Core.memoryrefmodify!'>#</a>&nbsp;<b><u>Core.memoryrefmodify!</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryrefmodify!(::GenericMemoryRef, op, value, ordering::Symbol, boundscheck::Bool) -> Pair
```


Atomically perform the operations to get and set a `MemoryRef` value after applying the function `op`.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`modifyproperty!`](/base/base#Base.modifyproperty!) and [`Core.memoryrefset!`](/devdocs/builtins#Core.memoryrefset!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L92-L102)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryrefreplace!' href='#Core.memoryrefreplace!'>#</a>&nbsp;<b><u>Core.memoryrefreplace!</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryrefreplace!(::GenericMemoryRef, expected, desired,
                       success_order::Symbol, fail_order::Symbol=success_order, boundscheck::Bool) -> (; old, success::Bool)
```


Atomically perform the operations to get and conditionally set a `MemoryRef` value.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`replaceproperty!`](/base/base#Base.replaceproperty!) and [`Core.memoryrefset!`](/devdocs/builtins#Core.memoryrefset!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L105-L115)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.memoryrefsetonce!' href='#Core.memoryrefsetonce!'>#</a>&nbsp;<b><u>Core.memoryrefsetonce!</u></b> &mdash; <i>Function</i>.




```julia
Core.memoryrefsetonce!(::GenericMemoryRef, value,
                       success_order::Symbol, fail_order::Symbol=success_order, boundscheck::Bool) -> success::Bool
```


Atomically perform the operations to set a `MemoryRef` to a given value, only if it was previously not set.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`setpropertyonce!`](/base/base#Base.replaceproperty!) and [`Core.memoryrefset!`](/devdocs/builtins#Core.memoryrefset!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L118-L129)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics.atomic_pointerref' href='#Core.Intrinsics.atomic_pointerref'>#</a>&nbsp;<b><u>Core.Intrinsics.atomic_pointerref</u></b> &mdash; <i>Function</i>.




```julia
Core.Intrinsics.atomic_pointerref(pointer::Ptr{T}, order::Symbol) --> T
```


::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::

See [`unsafe_load`](/base/c#Base.unsafe_load).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L132-L139)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics.atomic_pointerset' href='#Core.Intrinsics.atomic_pointerset'>#</a>&nbsp;<b><u>Core.Intrinsics.atomic_pointerset</u></b> &mdash; <i>Function</i>.




```julia
Core.Intrinsics.atomic_pointerset(pointer::Ptr{T}, new::T, order::Symbol) --> pointer
```


::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::

See [`unsafe_store!`](/base/c#Base.unsafe_store!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L142-L149)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics.atomic_pointerswap' href='#Core.Intrinsics.atomic_pointerswap'>#</a>&nbsp;<b><u>Core.Intrinsics.atomic_pointerswap</u></b> &mdash; <i>Function</i>.




```julia
Core.Intrinsics.atomic_pointerswap(pointer::Ptr{T}, new::T, order::Symbol) --> old
```


::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::

See [`unsafe_swap!`](/base/c#Base.unsafe_swap!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L152-L159)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics.atomic_pointermodify' href='#Core.Intrinsics.atomic_pointermodify'>#</a>&nbsp;<b><u>Core.Intrinsics.atomic_pointermodify</u></b> &mdash; <i>Function</i>.




```julia
Core.Intrinsics.atomic_pointermodify(pointer::Ptr{T}, function::(old::T,arg::S)->T, arg::S, order::Symbol) --> old
```


::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::

See [`unsafe_modify!`](/base/c#Base.unsafe_modify!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L162-L169)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics.atomic_pointerreplace' href='#Core.Intrinsics.atomic_pointerreplace'>#</a>&nbsp;<b><u>Core.Intrinsics.atomic_pointerreplace</u></b> &mdash; <i>Function</i>.




```julia
Core.Intrinsics.atomic_pointerreplace(pointer::Ptr{T}, expected::Any, new::T, success_order::Symbol, failure_order::Symbol) --> (old, cmp)
```


::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::

See [`unsafe_replace!`](/base/c#Base.unsafe_replace!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L172-L179)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.get_binding_type' href='#Core.get_binding_type'>#</a>&nbsp;<b><u>Core.get_binding_type</u></b> &mdash; <i>Function</i>.




```julia
Core.get_binding_type(module::Module, name::Symbol)
```


Retrieve the declared type of the binding `name` from the module `module`.

::: tip Julia 1.9

This function requires Julia 1.9 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2514-L2521)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.set_binding_type!' href='#Core.set_binding_type!'>#</a>&nbsp;<b><u>Core.set_binding_type!</u></b> &mdash; <i>Function</i>.




```julia
Core.set_binding_type!(module::Module, name::Symbol, [type::Type])
```


Set the declared type of the binding `name` in the module `module` to `type`. Error if the binding already has a type that is not equivalent to `type`. If the `type` argument is absent, set the binding type to `Any` if unset, but do not error.

::: tip Julia 1.9

This function requires Julia 1.9 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2524-L2533)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.IntrinsicFunction' href='#Core.IntrinsicFunction'>#</a>&nbsp;<b><u>Core.IntrinsicFunction</u></b> &mdash; <i>Type</i>.




```julia
Core.IntrinsicFunction <: Core.Builtin <: Function
```


The `Core.IntrinsicFunction` function define some basic primitives for what defines the abilities and behaviors of a Julia program


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L10-L15)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics' href='#Core.Intrinsics'>#</a>&nbsp;<b><u>Core.Intrinsics</u></b> &mdash; <i>Module</i>.




```julia
Core.Intrinsics
```


The `Core.Intrinsics` module holds the `Core.IntrinsicFunction` objects.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L18-L22)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.IR' href='#Core.IR'>#</a>&nbsp;<b><u>Core.IR</u></b> &mdash; <i>Module</i>.




```julia
Core.IR
```


The `Core.IR` module exports the IR object model.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/intrinsicsdocs.jl#L3-L7)

</div>
<br>
