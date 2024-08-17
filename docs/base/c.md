
# C Interface {#C-Interface}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@ccall' href='#Base.@ccall'>#</a>&nbsp;<b><u>Base.@ccall</u></b> &mdash; <i>Macro</i>.




```julia
@ccall library.function_name(argvalue1::argtype1, ...)::returntype
@ccall function_name(argvalue1::argtype1, ...)::returntype
@ccall $function_pointer(argvalue1::argtype1, ...)::returntype
```


Call a function in a C-exported shared library, specified by `library.function_name`, where `library` is a string constant or literal. The library may be omitted, in which case the `function_name` is resolved in the current process. Alternatively, `@ccall` may also be used to call a function pointer `$function_pointer`, such as one returned by `dlsym`.

Each `argvalue` to `@ccall` is converted to the corresponding `argtype`, by automatic insertion of calls to `unsafe_convert(argtype, cconvert(argtype, argvalue))`. (See also the documentation for [`unsafe_convert`](/base/c#Base.unsafe_convert) and [`cconvert`](/base/c#Base.cconvert) for further details.) In most cases, this simply results in a call to `convert(argtype, argvalue)`.

**Examples**

```
@ccall strlen(s::Cstring)::Csize_t
```


This calls the C standard library function:

```
size_t strlen(char *)
```


with a Julia variable named `s`. See also `ccall`.

Varargs are supported with the following convention:

```
@ccall printf("%s = %d"::Cstring ; "foo"::Cstring, foo::Cint)::Cint
```


The semicolon is used to separate required arguments (of which there must be at least one) from variadic arguments.

Example using an external library:

```
# C signature of g_uri_escape_string:
# char *g_uri_escape_string(const char *unescaped, const char *reserved_chars_allowed, gboolean allow_utf8);

const glib = "libglib-2.0"
@ccall glib.g_uri_escape_string(my_uri::Cstring, ":/"::Cstring, true::Cint)::Cstring
```


The string literal could also be used directly before the function name, if desired `"libglib-2.0".g_uri_escape_string(...`


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L360-L407)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ccall' href='#ccall'>#</a>&nbsp;<b><u>ccall</u></b> &mdash; <i>Keyword</i>.




```julia
ccall((function_name, library), returntype, (argtype1, ...), argvalue1, ...)
ccall(function_name, returntype, (argtype1, ...), argvalue1, ...)
ccall(function_pointer, returntype, (argtype1, ...), argvalue1, ...)
```


Call a function in a C-exported shared library, specified by the tuple `(function_name, library)`, where each component is either a string or symbol. Instead of specifying a library, one can also use a `function_name` symbol or string, which is resolved in the current process. Alternatively, `ccall` may also be used to call a function pointer `function_pointer`, such as one returned by `dlsym`.

Note that the argument type tuple must be a literal tuple, and not a tuple-valued variable or expression.

Each `argvalue` to the `ccall` will be converted to the corresponding `argtype`, by automatic insertion of calls to `unsafe_convert(argtype, cconvert(argtype, argvalue))`. (See also the documentation for [`unsafe_convert`](/base/c#Base.unsafe_convert) and [`cconvert`](/base/c#Base.cconvert) for further details.) In most cases, this simply results in a call to `convert(argtype, argvalue)`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/docs/basedocs.jl#L1328-L1346)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics.cglobal' href='#Core.Intrinsics.cglobal'>#</a>&nbsp;<b><u>Core.Intrinsics.cglobal</u></b> &mdash; <i>Function</i>.




```julia
cglobal((symbol, library) [, type=Cvoid])
```


Obtain a pointer to a global variable in a C-exported shared library, specified exactly as in [`ccall`](/base/c#ccall). Returns a `Ptr{Type}`, defaulting to `Ptr{Cvoid}` if no `Type` argument is supplied. The values can be read or written by [`unsafe_load`](/base/c#Base.unsafe_load) or [`unsafe_store!`](/base/c#Base.unsafe_store!), respectively.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L7-L16)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@cfunction' href='#Base.@cfunction'>#</a>&nbsp;<b><u>Base.@cfunction</u></b> &mdash; <i>Macro</i>.




```julia
@cfunction(callable, ReturnType, (ArgumentTypes...,)) -> Ptr{Cvoid}
@cfunction($callable, ReturnType, (ArgumentTypes...,)) -> CFunction
```


Generate a C-callable function pointer from the Julia function `callable` for the given type signature. To pass the return value to a `ccall`, use the argument type `Ptr{Cvoid}` in the signature.

Note that the argument type tuple must be a literal tuple, and not a tuple-valued variable or expression (although it can include a splat expression). And that these arguments will be evaluated in global scope during compile-time (not deferred until runtime). Adding a &#39;$&#39; in front of the function argument changes this to instead create a runtime closure over the local variable `callable` (this is not supported on all architectures).

See [manual section on ccall and cfunction usage](/manual/calling-c-and-fortran-code#Calling-C-and-Fortran-Code).

**Examples**

```julia
julia> function foo(x::Int, y::Int)
           return x + y
       end

julia> @cfunction(foo, Int, (Int, Int))
Ptr{Cvoid} @0x000000001b82fcd0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L38-L63)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.CFunction' href='#Base.CFunction'>#</a>&nbsp;<b><u>Base.CFunction</u></b> &mdash; <i>Type</i>.




```julia
CFunction struct
```


Garbage-collection handle for the return value from `@cfunction` when the first argument is annotated with &#39;$&#39;. Like all `cfunction` handles, it should be passed to `ccall` as a `Ptr{Cvoid}`, and will be converted automatically at the call site to the appropriate type.

See [`@cfunction`](/base/c#Base.@cfunction).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L19-L28)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_convert' href='#Base.unsafe_convert'>#</a>&nbsp;<b><u>Base.unsafe_convert</u></b> &mdash; <i>Function</i>.




```julia
unsafe_convert(T, x)
```


Convert `x` to a C argument of type `T` where the input `x` must be the return value of `cconvert(T, ...)`.

In cases where [`convert`](/base/base#Base.convert) would need to take a Julia object and turn it into a `Ptr`, this function should be used to define and perform that conversion.

Be careful to ensure that a Julia reference to `x` exists as long as the result of this function will be used. Accordingly, the argument `x` to this function should never be an expression, only a variable name or field reference. For example, `x=a.b.c` is acceptable, but `x=[a,b,c]` is not.

The `unsafe` prefix on this function indicates that using the result of this function after the `x` argument to this function is no longer accessible to the program may cause undefined behavior, including program corruption or segfaults, at any later time.

See also [`cconvert`](/base/c#Base.cconvert)


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L34-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cconvert' href='#Base.cconvert'>#</a>&nbsp;<b><u>Base.cconvert</u></b> &mdash; <i>Function</i>.




```julia
cconvert(T,x)
```


Convert `x` to a value to be passed to C code as type `T`, typically by calling `convert(T, x)`.

In cases where `x` cannot be safely converted to `T`, unlike [`convert`](/base/base#Base.convert), `cconvert` may return an object of a type different from `T`, which however is suitable for [`unsafe_convert`](/base/c#Base.unsafe_convert) to handle. The result of this function should be kept valid (for the GC) until the result of [`unsafe_convert`](/base/c#Base.unsafe_convert) is not needed anymore. This can be used to allocate memory that will be accessed by the `ccall`. If multiple objects need to be allocated, a tuple of the objects can be used as return value.

Neither `convert` nor `cconvert` should take a Julia object and turn it into a `Ptr`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L664-L677)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_load' href='#Base.unsafe_load'>#</a>&nbsp;<b><u>Base.unsafe_load</u></b> &mdash; <i>Function</i>.




```julia
unsafe_load(p::Ptr{T}, i::Integer=1)
unsafe_load(p::Ptr{T}, order::Symbol)
unsafe_load(p::Ptr{T}, i::Integer, order::Symbol)
```


Load a value of type `T` from the address of the `i`th element (1-indexed) starting at `p`. This is equivalent to the C expression `p[i-1]`. Optionally, an atomic memory ordering can be provided.

The `unsafe` prefix on this function indicates that no validation is performed on the pointer `p` to ensure that it is valid. Like C, the programmer is responsible for ensuring that referenced memory is not freed or garbage collected while invoking this function. Incorrect usage may segfault your program or return garbage answers. Unlike C, dereferencing memory region allocated as different type may be valid provided that the types are compatible.

::: tip Julia 1.10

The `order` argument is available as of Julia 1.10.

:::

See also: [`atomic`](/base/multi-threading#atomic)


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L133-L152)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_store!' href='#Base.unsafe_store!'>#</a>&nbsp;<b><u>Base.unsafe_store!</u></b> &mdash; <i>Function</i>.




```julia
unsafe_store!(p::Ptr{T}, x, i::Integer=1)
unsafe_store!(p::Ptr{T}, x, order::Symbol)
unsafe_store!(p::Ptr{T}, x, i::Integer, order::Symbol)
```


Store a value of type `T` to the address of the `i`th element (1-indexed) starting at `p`. This is equivalent to the C expression `p[i-1] = x`. Optionally, an atomic memory ordering can be provided.

The `unsafe` prefix on this function indicates that no validation is performed on the pointer `p` to ensure that it is valid. Like C, the programmer is responsible for ensuring that referenced memory is not freed or garbage collected while invoking this function. Incorrect usage may segfault your program. Unlike C, storing memory region allocated as different type may be valid provided that that the types are compatible.

::: tip Julia 1.10

The `order` argument is available as of Julia 1.10.

:::

See also: [`atomic`](/base/multi-threading#atomic)


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L159-L178)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_modify!' href='#Base.unsafe_modify!'>#</a>&nbsp;<b><u>Base.unsafe_modify!</u></b> &mdash; <i>Function</i>.




```julia
unsafe_modify!(p::Ptr{T}, op, x, [order::Symbol]) -> Pair
```


These atomically perform the operations to get and set a memory address after applying the function `op`. If supported by the hardware (for example, atomic increment), this may be optimized to the appropriate hardware instruction, otherwise its execution will be similar to:

```
y = unsafe_load(p)
z = op(y, x)
unsafe_store!(p, z)
return y => z
```


The `unsafe` prefix on this function indicates that no validation is performed on the pointer `p` to ensure that it is valid. Like C, the programmer is responsible for ensuring that referenced memory is not freed or garbage collected while invoking this function. Incorrect usage may segfault your program.

::: tip Julia 1.10

This function requires at least Julia 1.10.

:::

See also: [`modifyproperty!`](/base/base#Base.modifyproperty!), [`atomic`](/base/multi-threading#atomic)


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L186-L208)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_replace!' href='#Base.unsafe_replace!'>#</a>&nbsp;<b><u>Base.unsafe_replace!</u></b> &mdash; <i>Function</i>.




```julia
unsafe_replace!(p::Ptr{T}, expected, desired,
               [success_order::Symbol[, fail_order::Symbol=success_order]]) -> (; old, success::Bool)
```


These atomically perform the operations to get and conditionally set a memory address to a given value. If supported by the hardware, this may be optimized to the appropriate hardware instruction, otherwise its execution will be similar to:

```
y = unsafe_load(p, fail_order)
ok = y === expected
if ok
    unsafe_store!(p, desired, success_order)
end
return (; old = y, success = ok)
```


The `unsafe` prefix on this function indicates that no validation is performed on the pointer `p` to ensure that it is valid. Like C, the programmer is responsible for ensuring that referenced memory is not freed or garbage collected while invoking this function. Incorrect usage may segfault your program.

::: tip Julia 1.10

This function requires at least Julia 1.10.

:::

See also: [`replaceproperty!`](/base/base#Base.replaceproperty!), [`atomic`](/base/multi-threading#atomic)


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L213-L237)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_swap!' href='#Base.unsafe_swap!'>#</a>&nbsp;<b><u>Base.unsafe_swap!</u></b> &mdash; <i>Function</i>.




```julia
unsafe_swap!(p::Ptr{T}, x, [order::Symbol])
```


These atomically perform the operations to simultaneously get and set a memory address. If supported by the hardware, this may be optimized to the appropriate hardware instruction, otherwise its execution will be similar to:

```
y = unsafe_load(p)
unsafe_store!(p, x)
return y
```


The `unsafe` prefix on this function indicates that no validation is performed on the pointer `p` to ensure that it is valid. Like C, the programmer is responsible for ensuring that referenced memory is not freed or garbage collected while invoking this function. Incorrect usage may segfault your program.

::: tip Julia 1.10

This function requires at least Julia 1.10.

:::

See also: [`swapproperty!`](/base/base#Base.swapproperty!), [`atomic`](/base/multi-threading#atomic)


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L247-L267)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_copyto!-Union{Tuple{T}, Tuple{Ptr{T}, Ptr{T}, Any}} where T' href='#Base.unsafe_copyto!-Union{Tuple{T}, Tuple{Ptr{T}, Ptr{T}, Any}} where T'>#</a>&nbsp;<b><u>Base.unsafe_copyto!</u></b> &mdash; <i>Method</i>.




```julia
unsafe_copyto!(dest::Ptr{T}, src::Ptr{T}, N)
```


Copy `N` elements from a source pointer to a destination, with no checking. The size of an element is determined by the type of the pointers.

The `unsafe` prefix on this function indicates that no validation is performed on the pointers `dest` and `src` to ensure that they are valid. Incorrect usage may corrupt or segfault your program, in the same manner as C.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L255-L264)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_copyto!-Tuple{Array, Any, Array, Any, Any}' href='#Base.unsafe_copyto!-Tuple{Array, Any, Array, Any, Any}'>#</a>&nbsp;<b><u>Base.unsafe_copyto!</u></b> &mdash; <i>Method</i>.




```julia
unsafe_copyto!(dest::Array, doffs, src::Array, soffs, n)
```


Copy `n` elements from a source array to a destination, starting at the linear index `soffs` in the source and `doffs` in the destination (1-indexed).

The `unsafe` prefix on this function indicates that no validation is performed to ensure that n is inbounds on either array. Incorrect usage may corrupt or segfault your program, in the same manner as C.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L272-L281)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copyto!' href='#Base.copyto!'>#</a>&nbsp;<b><u>Base.copyto!</u></b> &mdash; <i>Function</i>.




```julia
copyto!(B::AbstractMatrix, ir_dest::AbstractUnitRange, jr_dest::AbstractUnitRange,
        tM::AbstractChar,
        M::AbstractVecOrMat, ir_src::AbstractUnitRange, jr_src::AbstractUnitRange) -> B
```


Efficiently copy elements of matrix `M` to `B` conditioned on the character parameter `tM` as follows:

|  `tM` | Destination           | Source                         |
| -----:|:--------------------- |:------------------------------ |
| `'N'` | `B[ir_dest, jr_dest]` | `M[ir_src, jr_src]`            |
| `'T'` | `B[ir_dest, jr_dest]` | `transpose(M)[ir_src, jr_src]` |
| `'C'` | `B[ir_dest, jr_dest]` | `adjoint(M)[ir_src, jr_src]`   |


The elements `B[ir_dest, jr_dest]` are overwritten. Furthermore, the index range parameters must satisfy `length(ir_dest) == length(ir_src)` and `length(jr_dest) == length(jr_src)`.

See also [`copy_transpose!`](/stdlib/LinearAlgebra#LinearAlgebra.copy_transpose!) and [`copy_adjoint!`](/stdlib/LinearAlgebra#LinearAlgebra.copy_adjoint!).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/stdlib/LinearAlgebra/src/matmul.jl#L750-L769)



```julia
copyto!(dest::AbstractMatrix, src::UniformScaling)
```


Copies a [`UniformScaling`](/stdlib/LinearAlgebra#LinearAlgebra.UniformScaling) onto a matrix.

::: tip Julia 1.1

In Julia 1.0 this method only supported a square destination matrix. Julia 1.1. added support for a rectangular matrix.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/stdlib/LinearAlgebra/src/uniformscaling.jl#L371-L379)



```julia
copyto!(dest, doffs, src, soffs, n)
```


Copy `n` elements from collection `src` starting at the linear index `soffs`, to array `dest` starting at the index `doffs`. Return `dest`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L288-L293)



```julia
copyto!(dest::AbstractArray, src) -> dest
```


Copy all elements from collection `src` to array `dest`, whose length must be greater than or equal to the length `n` of `src`. The first `n` elements of `dest` are overwritten, the other elements are left untouched.

See also [`copy!`](/base/arrays#Base.copy!), [`copy`](/base/base#Base.copy).

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> x = [1., 0., 3., 0., 5.];

julia> y = zeros(7);

julia> copyto!(y, x);

julia> y
7-element Vector{Float64}:
 1.0
 0.0
 3.0
 0.0
 5.0
 0.0
 0.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L1029-L1058)



```julia
copyto!(dest, Rdest::CartesianIndices, src, Rsrc::CartesianIndices) -> dest
```


Copy the block of `src` in the range of `Rsrc` to the block of `dest` in the range of `Rdest`. The sizes of the two regions must match.

**Examples**

```julia
julia> A = zeros(5, 5);

julia> B = [1 2; 3 4];

julia> Ainds = CartesianIndices((2:3, 2:3));

julia> Binds = CartesianIndices(B);

julia> copyto!(A, Ainds, B, Binds)
5×5 Matrix{Float64}:
 0.0  0.0  0.0  0.0  0.0
 0.0  1.0  2.0  0.0  0.0
 0.0  3.0  4.0  0.0  0.0
 0.0  0.0  0.0  0.0  0.0
 0.0  0.0  0.0  0.0  0.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/multidimensional.jl#L1212-L1236)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pointer' href='#Base.pointer'>#</a>&nbsp;<b><u>Base.pointer</u></b> &mdash; <i>Function</i>.




```julia
pointer(array [, index])
```


Get the native address of an array or string, optionally at a given location `index`.

This function is &quot;unsafe&quot;. Be careful to ensure that a Julia reference to `array` exists as long as this pointer will be used. The [`GC.@preserve`](/base/base#Base.GC.@preserve) macro should be used to protect the `array` argument from garbage collection within a given block of code.

Calling [`Ref(array[, index])`](/base/c#Core.Ref) is generally preferable to this function as it guarantees validity.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/cstring.jl#L41-L52)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_wrap-Union{Tuple{N}, Tuple{T}, Tuple{Union{Type{Array}, Type{Array{T}}, Type{Array{T, N}}}, Ptr{T}, NTuple{N, Int64}}} where {T, N}' href='#Base.unsafe_wrap-Union{Tuple{N}, Tuple{T}, Tuple{Union{Type{Array}, Type{Array{T}}, Type{Array{T, N}}}, Ptr{T}, NTuple{N, Int64}}} where {T, N}'>#</a>&nbsp;<b><u>Base.unsafe_wrap</u></b> &mdash; <i>Method</i>.




```julia
unsafe_wrap(Array, pointer::Ptr{T}, dims; own = false)
```


Wrap a Julia `Array` object around the data at the address given by `pointer`, without making a copy.  The pointer element type `T` determines the array element type. `dims` is either an integer (for a 1d array) or a tuple of the array dimensions. `own` optionally specifies whether Julia should take ownership of the memory, calling `free` on the pointer when the array is no longer referenced.

This function is labeled &quot;unsafe&quot; because it will crash if `pointer` is not a valid memory address to data of the requested length. Unlike [`unsafe_load`](/base/c#Base.unsafe_load) and [`unsafe_store!`](/base/c#Base.unsafe_store!), the programmer is responsible also for ensuring that the underlying data is not accessed through two arrays of different element type, similar to the strict aliasing rule in C.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L93-L107)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pointer_from_objref' href='#Base.pointer_from_objref'>#</a>&nbsp;<b><u>Base.pointer_from_objref</u></b> &mdash; <i>Function</i>.




```julia
pointer_from_objref(x)
```


Get the memory address of a Julia object as a `Ptr`. The existence of the resulting `Ptr` will not protect the object from garbage collection, so you must ensure that the object remains referenced for the whole time that the `Ptr` will be used.

This function may not be called on immutable objects, since they do not have stable memory addresses.

See also [`unsafe_pointer_to_objref`](/base/c#Base.unsafe_pointer_to_objref).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L289-L300)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_pointer_to_objref' href='#Base.unsafe_pointer_to_objref'>#</a>&nbsp;<b><u>Base.unsafe_pointer_to_objref</u></b> &mdash; <i>Function</i>.




```julia
unsafe_pointer_to_objref(p::Ptr)
```


Convert a `Ptr` to an object reference. Assumes the pointer refers to a valid heap-allocated Julia object. If this is not the case, undefined behavior results, hence this function is considered &quot;unsafe&quot; and should be used with care.

See also [`pointer_from_objref`](/base/c#Base.pointer_from_objref).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L278-L286)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.disable_sigint' href='#Base.disable_sigint'>#</a>&nbsp;<b><u>Base.disable_sigint</u></b> &mdash; <i>Function</i>.




```julia
disable_sigint(f::Function)
```


Disable Ctrl-C handler during execution of a function on the current task, for calling external code that may call julia code that is not interrupt safe. Intended to be called using `do` block syntax as follows:

```
disable_sigint() do
    # interrupt-unsafe code
    ...
end
```


This is not needed on worker threads (`Threads.threadid() != 1`) since the `InterruptException` will only be delivered to the master thread. External functions that do not call julia code or julia runtime automatically disable sigint during their execution.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L148-L164)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reenable_sigint' href='#Base.reenable_sigint'>#</a>&nbsp;<b><u>Base.reenable_sigint</u></b> &mdash; <i>Function</i>.




```julia
reenable_sigint(f::Function)
```


Re-enable Ctrl-C handler during execution of a function. Temporarily reverses the effect of [`disable_sigint`](/base/c#Base.disable_sigint).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L173-L178)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.exit_on_sigint' href='#Base.exit_on_sigint'>#</a>&nbsp;<b><u>Base.exit_on_sigint</u></b> &mdash; <i>Function</i>.




```julia
exit_on_sigint(on::Bool)
```


Set `exit_on_sigint` flag of the julia runtime.  If `false`, Ctrl-C (SIGINT) is capturable as [`InterruptException`](/base/base#Core.InterruptException) in `try` block. This is the default behavior in REPL, any code run via `-e` and `-E` and in Julia script run with `-i` option.

If `true`, `InterruptException` is not thrown by Ctrl-C.  Running code upon such event requires [`atexit`](/base/base#Base.atexit).  This is the default behavior in Julia script run without `-i` option.

::: tip Julia 1.5

Function `exit_on_sigint` requires at least Julia 1.5.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L187-L201)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.systemerror' href='#Base.systemerror'>#</a>&nbsp;<b><u>Base.systemerror</u></b> &mdash; <i>Function</i>.




```julia
systemerror(sysfunc[, errno::Cint=Libc.errno()])
systemerror(sysfunc, iftrue::Bool)
```


Raises a `SystemError` for `errno` with the descriptive string `sysfunc` if `iftrue` is `true`


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/error.jl#L178-L183)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.windowserror' href='#Base.windowserror'>#</a>&nbsp;<b><u>Base.windowserror</u></b> &mdash; <i>Function</i>.




```julia
windowserror(sysfunc[, code::UInt32=Libc.GetLastError()])
windowserror(sysfunc, iftrue::Bool)
```


Like [`systemerror`](/base/c#Base.systemerror), but for Windows API functions that use [`GetLastError`](/base/libc#Base.Libc.GetLastError) to return an error code instead of setting [`errno`](/base/libc#Base.Libc.errno).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/error.jl#L192-L198)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Ptr' href='#Core.Ptr'>#</a>&nbsp;<b><u>Core.Ptr</u></b> &mdash; <i>Type</i>.




```julia
Ptr{T}
```


A memory address referring to data of type `T`.  However, there is no guarantee that the memory is actually valid, or that it actually represents data of the specified type.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pointer.jl#L3-L8)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Ref' href='#Core.Ref'>#</a>&nbsp;<b><u>Core.Ref</u></b> &mdash; <i>Type</i>.




```julia
Ref{T}
```


An object that safely references data of type `T`. This type is guaranteed to point to valid, Julia-allocated memory of the correct type. The underlying data is protected from freeing by the garbage collector as long as the `Ref` itself is referenced.

In Julia, `Ref` objects are dereferenced (loaded or stored) with `[]`.

Creation of a `Ref` to a value `x` of type `T` is usually written `Ref(x)`. Additionally, for creating interior pointers to containers (such as Array or Ptr), it can be written `Ref(a, i)` for creating a reference to the `i`-th element of `a`.

`Ref{T}()` creates a reference to a value of type `T` without initialization. For a bitstype `T`, the value will be whatever currently resides in the memory allocated. For a non-bitstype `T`, the reference will be undefined and attempting to dereference it will result in an error, &quot;UndefRefError: access to undefined reference&quot;.

To check if a `Ref` is an undefined reference, use [`isassigned(ref::RefValue)`](/base/c#Base.isassigned-Tuple{Base.RefValue}). For example, `isassigned(Ref{T}())` is `false` if `T` is not a bitstype. If `T` is a bitstype, `isassigned(Ref{T}())` will always be true.

When passed as a `ccall` argument (either as a `Ptr` or `Ref` type), a `Ref` object will be converted to a native pointer to the data it references. For most `T`, or when converted to a `Ptr{Cvoid}`, this is a pointer to the object data. When `T` is an `isbits` type, this value may be safely mutated, otherwise mutation is strictly undefined behavior.

As a special case, setting `T = Any` will instead cause the creation of a pointer to the reference itself when converted to a `Ptr{Any}` (a `jl_value_t const* const*` if T is immutable, else a `jl_value_t *const *`). When converted to a `Ptr{Cvoid}`, it will still return a pointer to the data region as for any other `T`.

A `C_NULL` instance of `Ptr` can be passed to a `ccall` `Ref` argument to initialize it.

**Use in broadcasting**

`Ref` is sometimes used in broadcasting in order to treat the referenced values as a scalar.

**Examples**

```julia
julia> r = Ref(5) # Create a Ref with an initial value
Base.RefValue{Int64}(5)

julia> r[] # Getting a value from a Ref
5

julia> r[] = 7 # Storing a new value in a Ref
7

julia> r # The Ref now contains 7
Base.RefValue{Int64}(7)

julia> isa.(Ref([1,2,3]), [Array, Dict, Int]) # Treat reference values as scalar during broadcasting
3-element BitVector:
 1
 0
 0

julia> Ref{Function}()  # Undefined reference to a non-bitstype, Function
Base.RefValue{Function}(#undef)

julia> try
           Ref{Function}()[] # Dereferencing an undefined reference will result in an error
       catch e
           println(e)
       end
UndefRefError()

julia> Ref{Int64}()[]; # A reference to a bitstype refers to an undetermined value if not given

julia> isassigned(Ref{Int64}()) # A reference to a bitstype is always assigned
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/refpointer.jl#L3-L78)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isassigned-Tuple{Base.RefValue}' href='#Base.isassigned-Tuple{Base.RefValue}'>#</a>&nbsp;<b><u>Base.isassigned</u></b> &mdash; <i>Method</i>.




```julia
isassigned(ref::RefValue) -> Bool
```


Test whether the given [`Ref`](/base/c#Core.Ref) is associated with a value. This is always true for a [`Ref`](/base/c#Core.Ref) of a bitstype object. Return `false` if the reference is undefined.

**Examples**

```julia
julia> ref = Ref{Function}()
Base.RefValue{Function}(#undef)

julia> isassigned(ref)
false

julia> ref[] = (foobar(x) = x)
foobar (generic function with 1 method)

julia> isassigned(ref)
true

julia> isassigned(Ref{Int}())
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/refvalue.jl#L11-L35)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cchar' href='#Base.Cchar'>#</a>&nbsp;<b><u>Base.Cchar</u></b> &mdash; <i>Type</i>.




```julia
Cchar
```


Equivalent to the native `char` c-type.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L86-L90)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cuchar' href='#Base.Cuchar'>#</a>&nbsp;<b><u>Base.Cuchar</u></b> &mdash; <i>Type</i>.




```julia
Cuchar
```


Equivalent to the native `unsigned char` c-type ([`UInt8`](/base/numbers#Core.UInt8)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L6-L10)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cshort' href='#Base.Cshort'>#</a>&nbsp;<b><u>Base.Cshort</u></b> &mdash; <i>Type</i>.




```julia
Cshort
```


Equivalent to the native `signed short` c-type ([`Int16`](/base/numbers#Core.Int16)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L14-L18)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cstring' href='#Base.Cstring'>#</a>&nbsp;<b><u>Base.Cstring</u></b> &mdash; <i>Type</i>.




```julia
Cstring
```


A C-style string composed of the native character type [`Cchar`](/base/c#Base.Cchar)s. `Cstring`s are NUL-terminated. For C-style strings composed of the native wide character type, see [`Cwstring`](/base/c#Base.Cwstring). For more information about string interoperability with C, see the [manual](/manual/calling-c-and-fortran-code#man-bits-types).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/cstring.jl#L18-L27)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cushort' href='#Base.Cushort'>#</a>&nbsp;<b><u>Base.Cushort</u></b> &mdash; <i>Type</i>.




```julia
Cushort
```


Equivalent to the native `unsigned short` c-type ([`UInt16`](/base/numbers#Core.UInt16)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L22-L26)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cint' href='#Base.Cint'>#</a>&nbsp;<b><u>Base.Cint</u></b> &mdash; <i>Type</i>.




```julia
Cint
```


Equivalent to the native `signed int` c-type ([`Int32`](/base/numbers#Core.Int32)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L30-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cuint' href='#Base.Cuint'>#</a>&nbsp;<b><u>Base.Cuint</u></b> &mdash; <i>Type</i>.




```julia
Cuint
```


Equivalent to the native `unsigned int` c-type ([`UInt32`](/base/numbers#Core.UInt32)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L38-L42)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Clong' href='#Base.Clong'>#</a>&nbsp;<b><u>Base.Clong</u></b> &mdash; <i>Type</i>.




```julia
Clong
```


Equivalent to the native `signed long` c-type.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L104-L108)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Culong' href='#Base.Culong'>#</a>&nbsp;<b><u>Base.Culong</u></b> &mdash; <i>Type</i>.




```julia
Culong
```


Equivalent to the native `unsigned long` c-type.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L111-L115)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Clonglong' href='#Base.Clonglong'>#</a>&nbsp;<b><u>Base.Clonglong</u></b> &mdash; <i>Type</i>.




```julia
Clonglong
```


Equivalent to the native `signed long long` c-type ([`Int64`](/base/numbers#Core.Int64)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L86-L90)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Culonglong' href='#Base.Culonglong'>#</a>&nbsp;<b><u>Base.Culonglong</u></b> &mdash; <i>Type</i>.




```julia
Culonglong
```


Equivalent to the native `unsigned long long` c-type ([`UInt64`](/base/numbers#Core.UInt64)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L94-L98)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cintmax_t' href='#Base.Cintmax_t'>#</a>&nbsp;<b><u>Base.Cintmax_t</u></b> &mdash; <i>Type</i>.




```julia
Cintmax_t
```


Equivalent to the native `intmax_t` c-type ([`Int64`](/base/numbers#Core.Int64)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L70-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cuintmax_t' href='#Base.Cuintmax_t'>#</a>&nbsp;<b><u>Base.Cuintmax_t</u></b> &mdash; <i>Type</i>.




```julia
Cuintmax_t
```


Equivalent to the native `uintmax_t` c-type ([`UInt64`](/base/numbers#Core.UInt64)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L78-L82)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Csize_t' href='#Base.Csize_t'>#</a>&nbsp;<b><u>Base.Csize_t</u></b> &mdash; <i>Type</i>.




```julia
Csize_t
```


Equivalent to the native `size_t` c-type (`UInt`).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L54-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cssize_t' href='#Base.Cssize_t'>#</a>&nbsp;<b><u>Base.Cssize_t</u></b> &mdash; <i>Type</i>.




```julia
Cssize_t
```


Equivalent to the native `ssize_t` c-type.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L62-L66)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cptrdiff_t' href='#Base.Cptrdiff_t'>#</a>&nbsp;<b><u>Base.Cptrdiff_t</u></b> &mdash; <i>Type</i>.




```julia
Cptrdiff_t
```


Equivalent to the native `ptrdiff_t` c-type (`Int`).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L46-L50)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cwchar_t' href='#Base.Cwchar_t'>#</a>&nbsp;<b><u>Base.Cwchar_t</u></b> &mdash; <i>Type</i>.




```julia
Cwchar_t
```


Equivalent to the native `wchar_t` c-type ([`Int32`](/base/numbers#Core.Int32)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/c.jl#L118-L122)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cwstring' href='#Base.Cwstring'>#</a>&nbsp;<b><u>Base.Cwstring</u></b> &mdash; <i>Type</i>.




```julia
Cwstring
```


A C-style string composed of the native wide character type [`Cwchar_t`](/base/c#Base.Cwchar_t)s. `Cwstring`s are NUL-terminated. For C-style strings composed of the native character type, see [`Cstring`](/base/c#Base.Cstring). For more information about string interoperability with C, see the [manual](/manual/calling-c-and-fortran-code#man-bits-types).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/cstring.jl#L5-L15)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cfloat' href='#Base.Cfloat'>#</a>&nbsp;<b><u>Base.Cfloat</u></b> &mdash; <i>Type</i>.




```julia
Cfloat
```


Equivalent to the native `float` c-type ([`Float32`](/base/numbers#Core.Float32)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L102-L106)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cdouble' href='#Base.Cdouble'>#</a>&nbsp;<b><u>Base.Cdouble</u></b> &mdash; <i>Type</i>.




```julia
Cdouble
```


Equivalent to the native `double` c-type ([`Float64`](/base/numbers#Core.Float64)).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/ctypes.jl#L110-L114)

</div>
<br>

# LLVM Interface {#LLVM-Interface}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Intrinsics.llvmcall' href='#Core.Intrinsics.llvmcall'>#</a>&nbsp;<b><u>Core.Intrinsics.llvmcall</u></b> &mdash; <i>Function</i>.




```julia
llvmcall(fun_ir::String, returntype, Tuple{argtype1, ...}, argvalue1, ...)
llvmcall((mod_ir::String, entry_fn::String), returntype, Tuple{argtype1, ...}, argvalue1, ...)
llvmcall((mod_bc::Vector{UInt8}, entry_fn::String), returntype, Tuple{argtype1, ...}, argvalue1, ...)
```


Call the LLVM code provided in the first argument. There are several ways to specify this first argument:
- as a literal string, representing function-level IR (similar to an LLVM `define` block), with arguments are available as consecutive unnamed SSA variables (%0, %1, etc.);
  
- as a 2-element tuple, containing a string of module IR and a string representing the name of the entry-point function to call;
  
- as a 2-element tuple, but with the module provided as an `Vector{UInt8}` with bitcode.
  

Note that contrary to `ccall`, the argument types must be specified as a tuple type, and not a tuple of types. All types, as well as the LLVM code, should be specified as literals, and not as variables or expressions (it may be necessary to use `@eval` to generate these literals).

[Opaque pointers](https://llvm.org/docs/OpaquePointers.html) (written as `ptr`) are not allowed in the LLVM code.

See [`test/llvmcall.jl`](https://github.com/JuliaLang/julia/blob/v1.12.0-DEV.1056/test/llvmcall.jl) for usage examples.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/docs/basedocs.jl#L1349-L1373)

</div>
<br>
