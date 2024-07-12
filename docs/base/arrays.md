
# Arrays {#lib-arrays}

## Constructors and Types {#Constructors-and-Types}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.AbstractArray' href='#Core.AbstractArray'>#</a>&nbsp;<b><u>Core.AbstractArray</u></b> &mdash; <i>Type</i>.




```julia
AbstractArray{T,N}
```


Supertype for `N`-dimensional arrays (or array-like types) with elements of type `T`. [`Array`](/base/arrays#Core.Array) and other types are subtypes of this. See the manual section on the [`AbstractArray` interface](/manual/interfaces#man-interface-array).

See also: [`AbstractVector`](/base/arrays#Base.AbstractVector), [`AbstractMatrix`](/base/arrays#Base.AbstractMatrix), [`eltype`](/base/collections#Base.eltype), [`ndims`](/base/arrays#Base.ndims).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L5-L13)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractVector' href='#Base.AbstractVector'>#</a>&nbsp;<b><u>Base.AbstractVector</u></b> &mdash; <i>Type</i>.




```julia
AbstractVector{T}
```


Supertype for one-dimensional arrays (or array-like types) with elements of type `T`. Alias for [`AbstractArray{T,1}`](/base/arrays#Core.AbstractArray).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L17-L22)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractMatrix' href='#Base.AbstractMatrix'>#</a>&nbsp;<b><u>Base.AbstractMatrix</u></b> &mdash; <i>Type</i>.




```julia
AbstractMatrix{T}
```


Supertype for two-dimensional arrays (or array-like types) with elements of type `T`. Alias for [`AbstractArray{T,2}`](/base/arrays#Core.AbstractArray).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L25-L30)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractVecOrMat' href='#Base.AbstractVecOrMat'>#</a>&nbsp;<b><u>Base.AbstractVecOrMat</u></b> &mdash; <i>Type</i>.




```julia
AbstractVecOrMat{T}
```


Union type of [`AbstractVector{T}`](/base/arrays#Base.AbstractVector) and [`AbstractMatrix{T}`](/base/arrays#Base.AbstractMatrix).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L33-L37)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Array' href='#Core.Array'>#</a>&nbsp;<b><u>Core.Array</u></b> &mdash; <i>Type</i>.




```julia
Array{T,N} <: AbstractArray{T,N}
```


`N`-dimensional dense array with elements of type `T`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L45-L49)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Array-Tuple{UndefInitializer, Any}' href='#Core.Array-Tuple{UndefInitializer, Any}'>#</a>&nbsp;<b><u>Core.Array</u></b> &mdash; <i>Method</i>.




```julia
Array{T}(undef, dims)
Array{T,N}(undef, dims)
```


Construct an uninitialized `N`-dimensional [`Array`](/base/arrays#Core.Array) containing elements of type `T`. `N` can either be supplied explicitly, as in `Array{T,N}(undef, dims)`, or be determined by the length or number of `dims`. `dims` may be a tuple or a series of integer arguments corresponding to the lengths in each dimension. If the rank `N` is supplied explicitly, then it must match the length or number of `dims`. Here [`undef`](/base/arrays#Core.undef) is the [`UndefInitializer`](/base/arrays#Core.UndefInitializer).

**Examples**

```julia
julia> A = Array{Float64, 2}(undef, 2, 3) # N given explicitly
2×3 Matrix{Float64}:
 6.90198e-310  6.90198e-310  6.90198e-310
 6.90198e-310  6.90198e-310  0.0

julia> B = Array{Float64}(undef, 4) # N determined by the input
4-element Vector{Float64}:
   2.360075077e-314
 NaN
   2.2671131793e-314
   2.299821756e-314

julia> similar(B, 2, 4, 1) # use typeof(B), and the given size
2×4×1 Array{Float64, 3}:
[:, :, 1] =
 2.26703e-314  2.26708e-314  0.0           2.80997e-314
 0.0           2.26703e-314  2.26708e-314  0.0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2808-L2840)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Array-Tuple{Nothing, Any}' href='#Core.Array-Tuple{Nothing, Any}'>#</a>&nbsp;<b><u>Core.Array</u></b> &mdash; <i>Method</i>.




```julia
Array{T}(nothing, dims)
Array{T,N}(nothing, dims)
```


Construct an `N`-dimensional [`Array`](/base/arrays#Core.Array) containing elements of type `T`, initialized with [`nothing`](/base/constants#Core.nothing) entries. Element type `T` must be able to hold these values, i.e. `Nothing <: T`.

**Examples**

```julia
julia> Array{Union{Nothing, String}}(nothing, 2)
2-element Vector{Union{Nothing, String}}:
 nothing
 nothing

julia> Array{Union{Nothing, Int}}(nothing, 2, 3)
2×3 Matrix{Union{Nothing, Int64}}:
 nothing  nothing  nothing
 nothing  nothing  nothing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2843-L2863)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Array-Tuple{Missing, Any}' href='#Core.Array-Tuple{Missing, Any}'>#</a>&nbsp;<b><u>Core.Array</u></b> &mdash; <i>Method</i>.




```julia
Array{T}(missing, dims)
Array{T,N}(missing, dims)
```


Construct an `N`-dimensional [`Array`](/base/arrays#Core.Array) containing elements of type `T`, initialized with [`missing`](/manual/missing#missing) entries. Element type `T` must be able to hold these values, i.e. `Missing <: T`.

**Examples**

```julia
julia> Array{Union{Missing, String}}(missing, 2)
2-element Vector{Union{Missing, String}}:
 missing
 missing

julia> Array{Union{Missing, Int}}(missing, 2, 3)
2×3 Matrix{Union{Missing, Int64}}:
 missing  missing  missing
 missing  missing  missing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2867-L2887)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UndefInitializer' href='#Core.UndefInitializer'>#</a>&nbsp;<b><u>Core.UndefInitializer</u></b> &mdash; <i>Type</i>.




```julia
UndefInitializer
```


Singleton type used in array initialization, indicating the array-constructor-caller would like an uninitialized array. See also [`undef`](/base/arrays#Core.undef), an alias for `UndefInitializer()`.

**Examples**

```julia
julia> Array{Float64, 1}(UndefInitializer(), 3)
3-element Array{Float64, 1}:
 2.2752528595e-314
 2.202942107e-314
 2.275252907e-314
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2890-L2905)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.undef' href='#Core.undef'>#</a>&nbsp;<b><u>Core.undef</u></b> &mdash; <i>Constant</i>.




```julia
undef
```


Alias for `UndefInitializer()`, which constructs an instance of the singleton type [`UndefInitializer`](/base/arrays#Core.UndefInitializer), used in array initialization to indicate the array-constructor-caller would like an uninitialized array.

See also: [`missing`](/manual/missing#missing), [`similar`](/base/arrays#Base.similar).

**Examples**

```julia
julia> Array{Float64, 1}(undef, 3)
3-element Vector{Float64}:
 2.2752528595e-314
 2.202942107e-314
 2.275252907e-314
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2908-L2925)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Vector' href='#Base.Vector'>#</a>&nbsp;<b><u>Base.Vector</u></b> &mdash; <i>Type</i>.




```julia
Vector{T} <: AbstractVector{T}
```


One-dimensional dense array with elements of type `T`, often used to represent a mathematical vector. Alias for [`Array{T,1}`](/base/arrays#Core.Array).

See also [`empty`](/base/arrays#Base.empty), [`similar`](/base/arrays#Base.similar) and [`zero`](/base/numbers#Base.zero) for creating vectors.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L52-L59)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Vector-Tuple{UndefInitializer, Any}' href='#Base.Vector-Tuple{UndefInitializer, Any}'>#</a>&nbsp;<b><u>Base.Vector</u></b> &mdash; <i>Method</i>.




```julia
Vector{T}(undef, n)
```


Construct an uninitialized [`Vector{T}`](/base/arrays#Base.Vector) of length `n`.

**Examples**

```julia
julia> Vector{Float64}(undef, 3)
3-element Array{Float64, 1}:
 6.90966e-310
 6.90966e-310
 6.90966e-310
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2704-L2717)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Vector-Tuple{Nothing, Any}' href='#Base.Vector-Tuple{Nothing, Any}'>#</a>&nbsp;<b><u>Base.Vector</u></b> &mdash; <i>Method</i>.




```julia
Vector{T}(nothing, m)
```


Construct a [`Vector{T}`](/base/arrays#Base.Vector) of length `m`, initialized with [`nothing`](/base/constants#Core.nothing) entries. Element type `T` must be able to hold these values, i.e. `Nothing <: T`.

**Examples**

```julia
julia> Vector{Union{Nothing, String}}(nothing, 2)
2-element Vector{Union{Nothing, String}}:
 nothing
 nothing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2720-L2734)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Vector-Tuple{Missing, Any}' href='#Base.Vector-Tuple{Missing, Any}'>#</a>&nbsp;<b><u>Base.Vector</u></b> &mdash; <i>Method</i>.




```julia
Vector{T}(missing, m)
```


Construct a [`Vector{T}`](/base/arrays#Base.Vector) of length `m`, initialized with [`missing`](/manual/missing#missing) entries. Element type `T` must be able to hold these values, i.e. `Missing <: T`.

**Examples**

```julia
julia> Vector{Union{Missing, String}}(missing, 2)
2-element Vector{Union{Missing, String}}:
 missing
 missing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2737-L2751)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Matrix' href='#Base.Matrix'>#</a>&nbsp;<b><u>Base.Matrix</u></b> &mdash; <i>Type</i>.




```julia
Matrix{T} <: AbstractMatrix{T}
```


Two-dimensional dense array with elements of type `T`, often used to represent a mathematical matrix. Alias for [`Array{T,2}`](/base/arrays#Core.Array).

See also [`fill`](/base/arrays#Base.fill), [`zeros`](/base/arrays#Base.zeros), [`undef`](/base/arrays#Core.undef) and [`similar`](/base/arrays#Base.similar) for creating matrices.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L62-L70)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Matrix-Tuple{UndefInitializer, Any, Any}' href='#Base.Matrix-Tuple{UndefInitializer, Any, Any}'>#</a>&nbsp;<b><u>Base.Matrix</u></b> &mdash; <i>Method</i>.




```julia
Matrix{T}(undef, m, n)
```


Construct an uninitialized [`Matrix{T}`](/base/arrays#Base.Matrix) of size `m`×`n`.

**Examples**

```julia
julia> Matrix{Float64}(undef, 2, 3)
2×3 Array{Float64, 2}:
 2.36365e-314  2.28473e-314    5.0e-324
 2.26704e-314  2.26711e-314  NaN

julia> similar(ans, Int32, 2, 2)
2×2 Matrix{Int32}:
 490537216  1277177453
         1  1936748399
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2754-L2771)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Matrix-Tuple{Nothing, Any, Any}' href='#Base.Matrix-Tuple{Nothing, Any, Any}'>#</a>&nbsp;<b><u>Base.Matrix</u></b> &mdash; <i>Method</i>.




```julia
Matrix{T}(nothing, m, n)
```


Construct a [`Matrix{T}`](/base/arrays#Base.Matrix) of size `m`×`n`, initialized with [`nothing`](/base/constants#Core.nothing) entries. Element type `T` must be able to hold these values, i.e. `Nothing <: T`.

**Examples**

```julia
julia> Matrix{Union{Nothing, String}}(nothing, 2, 3)
2×3 Matrix{Union{Nothing, String}}:
 nothing  nothing  nothing
 nothing  nothing  nothing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2774-L2788)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Matrix-Tuple{Missing, Any, Any}' href='#Base.Matrix-Tuple{Missing, Any, Any}'>#</a>&nbsp;<b><u>Base.Matrix</u></b> &mdash; <i>Method</i>.




```julia
Matrix{T}(missing, m, n)
```


Construct a [`Matrix{T}`](/base/arrays#Base.Matrix) of size `m`×`n`, initialized with [`missing`](/manual/missing#missing) entries. Element type `T` must be able to hold these values, i.e. `Missing <: T`.

**Examples**

```julia
julia> Matrix{Union{Missing, String}}(missing, 2, 3)
2×3 Matrix{Union{Missing, String}}:
 missing  missing  missing
 missing  missing  missing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2791-L2805)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.VecOrMat' href='#Base.VecOrMat'>#</a>&nbsp;<b><u>Base.VecOrMat</u></b> &mdash; <i>Type</i>.




```julia
VecOrMat{T}
```


Union type of [`Vector{T}`](/base/arrays#Base.Vector) and [`Matrix{T}`](/base/arrays#Base.Matrix) which allows functions to accept either a Matrix or a Vector.

**Examples**

```julia
julia> Vector{Float64} <: VecOrMat{Float64}
true

julia> Matrix{Float64} <: VecOrMat{Float64}
true

julia> Array{Float64, 3} <: VecOrMat{Float64}
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L73-L89)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.DenseArray' href='#Core.DenseArray'>#</a>&nbsp;<b><u>Core.DenseArray</u></b> &mdash; <i>Type</i>.




```julia
DenseArray{T, N} <: AbstractArray{T,N}
```


`N`-dimensional dense array with elements of type `T`. The elements of a dense array are stored contiguously in memory.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L92-L97)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.DenseVector' href='#Base.DenseVector'>#</a>&nbsp;<b><u>Base.DenseVector</u></b> &mdash; <i>Type</i>.




```julia
DenseVector{T}
```


One-dimensional [`DenseArray`](/base/arrays#Core.DenseArray) with elements of type `T`. Alias for `DenseArray{T,1}`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L100-L104)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.DenseMatrix' href='#Base.DenseMatrix'>#</a>&nbsp;<b><u>Base.DenseMatrix</u></b> &mdash; <i>Type</i>.




```julia
DenseMatrix{T}
```


Two-dimensional [`DenseArray`](/base/arrays#Core.DenseArray) with elements of type `T`. Alias for `DenseArray{T,2}`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L107-L111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.DenseVecOrMat' href='#Base.DenseVecOrMat'>#</a>&nbsp;<b><u>Base.DenseVecOrMat</u></b> &mdash; <i>Type</i>.




```julia
DenseVecOrMat{T}
```


Union type of [`DenseVector{T}`](/base/arrays#Base.DenseVector) and [`DenseMatrix{T}`](/base/arrays#Base.DenseMatrix).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L114-L118)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StridedArray' href='#Base.StridedArray'>#</a>&nbsp;<b><u>Base.StridedArray</u></b> &mdash; <i>Type</i>.




```julia
StridedArray{T, N}
```


A hard-coded [`Union`](/base/base#Core.Union) of common array types that follow the [strided array interface](/manual/interfaces#man-interface-strided-arrays), with elements of type `T` and `N` dimensions.

If `A` is a `StridedArray`, then its elements are stored in memory with offsets, which may vary between dimensions but are constant within a dimension. For example, `A` could have stride 2 in dimension 1, and stride 3 in dimension 2. Incrementing `A` along dimension `d` jumps in memory by [`stride(A, d)`] slots. Strided arrays are particularly important and useful because they can sometimes be passed directly as pointers to foreign language libraries like BLAS.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3476-L3488)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StridedVector' href='#Base.StridedVector'>#</a>&nbsp;<b><u>Base.StridedVector</u></b> &mdash; <i>Type</i>.




```julia
StridedVector{T}
```


One dimensional [`StridedArray`](/base/arrays#Base.StridedArray) with elements of type `T`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3491-L3495)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StridedMatrix' href='#Base.StridedMatrix'>#</a>&nbsp;<b><u>Base.StridedMatrix</u></b> &mdash; <i>Type</i>.




```julia
StridedMatrix{T}
```


Two dimensional [`StridedArray`](/base/arrays#Base.StridedArray) with elements of type `T`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3498-L3502)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StridedVecOrMat' href='#Base.StridedVecOrMat'>#</a>&nbsp;<b><u>Base.StridedVecOrMat</u></b> &mdash; <i>Type</i>.




```julia
StridedVecOrMat{T}
```


Union type of [`StridedVector`](/base/arrays#Base.StridedVector) and [`StridedMatrix`](/base/arrays#Base.StridedMatrix) with elements of type `T`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3505-L3509)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Memory' href='#Core.Memory'>#</a>&nbsp;<b><u>Core.Memory</u></b> &mdash; <i>Type</i>.




```julia
Memory{T} == GenericMemory{:not_atomic, T, Core.CPU}
```


One-dimensional dense array with elements of type `T`.

::: tip Julia 1.11

This type requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/genericmemory.jl#L15-L22)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.MemoryRef' href='#Core.MemoryRef'>#</a>&nbsp;<b><u>Core.MemoryRef</u></b> &mdash; <i>Type</i>.




```julia
MemoryRef(memory)
```


Construct a MemoryRef from a memory object. This does not fail, but the resulting memory may point out-of-bounds if the memory is empty.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2685-L2690)



```julia
MemoryRef(::Memory, index::Integer)
MemoryRef(::MemoryRef, index::Integer)
```


Construct a MemoryRef from a memory object and an offset index (1-based) which can also be negative. This always returns an inbounds object, and will throw an error if that is not possible (because the index would result in a shift out-of-bounds of the underlying memory).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2693-L2701)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Slices' href='#Base.Slices'>#</a>&nbsp;<b><u>Base.Slices</u></b> &mdash; <i>Type</i>.




```julia
Slices{P,SM,AX,S,N} <: AbstractSlices{S,N}
```


An `AbstractArray` of slices into a parent array over specified dimension(s), returning views that select all the data from the other dimension(s).

These should typically be constructed by [`eachslice`](/base/arrays#Base.eachslice), [`eachcol`](/base/arrays#Base.eachcol) or [`eachrow`](/base/arrays#Base.eachrow).

[`parent(s::Slices)`](/base/arrays#Base.parent) will return the parent array.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/slicearray.jl#L11-L21)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.RowSlices' href='#Base.RowSlices'>#</a>&nbsp;<b><u>Base.RowSlices</u></b> &mdash; <i>Type</i>.




```julia
RowSlices{M,AX,S}
```


A special case of [`Slices`](/base/arrays#Base.Slices) that is a vector of row slices of a matrix, as constructed by [`eachrow`](/base/arrays#Base.eachrow).

[`parent`](/base/arrays#Base.parent) can be used to get the underlying matrix.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/slicearray.jl#L207-L214)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ColumnSlices' href='#Base.ColumnSlices'>#</a>&nbsp;<b><u>Base.ColumnSlices</u></b> &mdash; <i>Type</i>.




```julia
ColumnSlices{M,AX,S}
```


A special case of [`Slices`](/base/arrays#Base.Slices) that is a vector of column slices of a matrix, as constructed by [`eachcol`](/base/arrays#Base.eachcol).

[`parent`](/base/arrays#Base.parent) can be used to get the underlying matrix.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/slicearray.jl#L217-L224)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.getindex-Tuple{Type, Vararg{Any}}' href='#Base.getindex-Tuple{Type, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.getindex</u></b> &mdash; <i>Method</i>.




```julia
getindex(type[, elements...])
```


Construct a 1-d array of the specified type. This is usually called with the syntax `Type[]`. Element values can be specified using `Type[a,b,c,...]`.

**Examples**

```julia
julia> Int8[1, 2, 3]
3-element Vector{Int8}:
 1
 2
 3

julia> getindex(Int8, 1, 2, 3)
3-element Vector{Int8}:
 1
 2
 3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L365-L385)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.zeros' href='#Base.zeros'>#</a>&nbsp;<b><u>Base.zeros</u></b> &mdash; <i>Function</i>.




```julia
zeros([T=Float64,] dims::Tuple)
zeros([T=Float64,] dims...)
```


Create an `Array`, with element type `T`, of all zeros with size specified by `dims`. See also [`fill`](/base/arrays#Base.fill), [`ones`](/base/arrays#Base.ones), [`zero`](/base/numbers#Base.zero).

**Examples**

```julia
julia> zeros(1)
1-element Vector{Float64}:
 0.0

julia> zeros(Int8, 2, 3)
2×3 Matrix{Int8}:
 0  0  0
 0  0  0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L530-L548)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ones' href='#Base.ones'>#</a>&nbsp;<b><u>Base.ones</u></b> &mdash; <i>Function</i>.




```julia
ones([T=Float64,] dims::Tuple)
ones([T=Float64,] dims...)
```


Create an `Array`, with element type `T`, of all ones with size specified by `dims`. See also [`fill`](/base/arrays#Base.fill), [`zeros`](/base/arrays#Base.zeros).

**Examples**

```julia
julia> ones(1,2)
1×2 Matrix{Float64}:
 1.0  1.0

julia> ones(ComplexF64, 2, 3)
2×3 Matrix{ComplexF64}:
 1.0+0.0im  1.0+0.0im  1.0+0.0im
 1.0+0.0im  1.0+0.0im  1.0+0.0im
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L551-L569)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.BitArray' href='#Base.BitArray'>#</a>&nbsp;<b><u>Base.BitArray</u></b> &mdash; <i>Type</i>.




```julia
BitArray{N} <: AbstractArray{Bool, N}
```


Space-efficient `N`-dimensional boolean array, using just one bit for each boolean value.

`BitArray`s pack up to 64 values into every 8 bytes, resulting in an 8x space efficiency over `Array{Bool, N}` and allowing some operations to work on 64 values at once.

By default, Julia returns `BitArrays` from [broadcasting](/manual/arrays#Broadcasting) operations that generate boolean elements (including dotted-comparisons like `.==`) as well as from the functions [`trues`](/base/arrays#Base.trues) and [`falses`](/base/arrays#Base.falses).

::: tip Note

Due to its packed storage format, concurrent access to the elements of a `BitArray` where at least one of them is a write is not thread-safe.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/bitarray.jl#L7-L23)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.BitArray-Tuple{UndefInitializer, Vararg{Integer}}' href='#Base.BitArray-Tuple{UndefInitializer, Vararg{Integer}}'>#</a>&nbsp;<b><u>Base.BitArray</u></b> &mdash; <i>Method</i>.




```julia
BitArray(undef, dims::Integer...)
BitArray{N}(undef, dims::NTuple{N,Int})
```


Construct an undef [`BitArray`](/base/arrays#Base.BitArray) with the given dimensions. Behaves identically to the [`Array`](/base/arrays#Core.Array) constructor. See [`undef`](/base/arrays#Core.undef).

**Examples**

```julia
julia> BitArray(undef, 2, 2)
2×2 BitMatrix:
 0  0
 0  0

julia> BitArray(undef, (3, 1))
3×1 BitMatrix:
 0
 0
 0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/bitarray.jl#L48-L68)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.BitArray-Tuple{Any}' href='#Base.BitArray-Tuple{Any}'>#</a>&nbsp;<b><u>Base.BitArray</u></b> &mdash; <i>Method</i>.




```julia
BitArray(itr)
```


Construct a [`BitArray`](/base/arrays#Base.BitArray) generated by the given iterable object. The shape is inferred from the `itr` object.

**Examples**

```julia
julia> BitArray([1 0; 0 1])
2×2 BitMatrix:
 1  0
 0  1

julia> BitArray(x+y == 3 for x = 1:2, y = 1:3)
2×3 BitMatrix:
 0  1  0
 1  0  0

julia> BitArray(x+y == 3 for x = 1:2 for y = 1:3)
6-element BitVector:
 0
 1
 0
 1
 0
 0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/bitarray.jl#L551-L578)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.trues' href='#Base.trues'>#</a>&nbsp;<b><u>Base.trues</u></b> &mdash; <i>Function</i>.




```julia
trues(dims)
```


Create a `BitArray` with all values set to `true`.

**Examples**

```julia
julia> trues(2,3)
2×3 BitMatrix:
 1  1  1
 1  1  1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/bitarray.jl#L409-L421)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.falses' href='#Base.falses'>#</a>&nbsp;<b><u>Base.falses</u></b> &mdash; <i>Function</i>.




```julia
falses(dims)
```


Create a `BitArray` with all values set to `false`.

**Examples**

```julia
julia> falses(2,3)
2×3 BitMatrix:
 0  0  0
 0  0  0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/bitarray.jl#L390-L402)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fill' href='#Base.fill'>#</a>&nbsp;<b><u>Base.fill</u></b> &mdash; <i>Function</i>.




```julia
fill(value, dims::Tuple)
fill(value, dims...)
```


Create an array of size `dims` with every location set to `value`.

For example, `fill(1.0, (5,5))` returns a 5×5 array of floats, with `1.0` in every location of the array.

The dimension lengths `dims` may be specified as either a tuple or a sequence of arguments. An `N`-length tuple or `N` arguments following the `value` specify an `N`-dimensional array. Thus, a common idiom for creating a zero-dimensional array with its only location set to `x` is `fill(x)`.

Every location of the returned array is set to (and is thus [`===`](/base/base#Core.:===) to) the `value` that was passed; this means that if the `value` is itself modified, all elements of the `fill`ed array will reflect that modification because they&#39;re _still_ that very `value`. This is of no concern with `fill(1.0, (5,5))` as the `value` `1.0` is immutable and cannot itself be modified, but can be unexpected with mutable values like — most commonly — arrays.  For example, `fill([], 3)` places _the very same_ empty array in all three locations of the returned vector:

```julia
julia> v = fill([], 3)
3-element Vector{Vector{Any}}:
 []
 []
 []

julia> v[1] === v[2] === v[3]
true

julia> value = v[1]
Any[]

julia> push!(value, 867_5309)
1-element Vector{Any}:
 8675309

julia> v
3-element Vector{Vector{Any}}:
 [8675309]
 [8675309]
 [8675309]
```


To create an array of many independent inner arrays, use a [comprehension](/manual/arrays#man-comprehensions) instead. This creates a new and distinct array on each iteration of the loop:

```julia
julia> v2 = [[] for _ in 1:3]
3-element Vector{Vector{Any}}:
 []
 []
 []

julia> v2[1] === v2[2] === v2[3]
false

julia> push!(v2[1], 8675309)
1-element Vector{Any}:
 8675309

julia> v2
3-element Vector{Vector{Any}}:
 [8675309]
 []
 []
```


See also: [`fill!`](/base/arrays#Base.fill!), [`zeros`](/base/arrays#Base.zeros), [`ones`](/base/arrays#Base.ones), [`similar`](/base/arrays#Base.similar).

**Examples**

```julia
julia> fill(1.0, (2,3))
2×3 Matrix{Float64}:
 1.0  1.0  1.0
 1.0  1.0  1.0

julia> fill(42)
0-dimensional Array{Int64, 0}:
42

julia> A = fill(zeros(2), 2) # sets both elements to the same [0.0, 0.0] vector
2-element Vector{Vector{Float64}}:
 [0.0, 0.0]
 [0.0, 0.0]

julia> A[1][1] = 42; # modifies the filled value to be [42.0, 0.0]

julia> A # both A[1] and A[2] are the very same vector
2-element Vector{Vector{Float64}}:
 [42.0, 0.0]
 [42.0, 0.0]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L426-L521)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fill!' href='#Base.fill!'>#</a>&nbsp;<b><u>Base.fill!</u></b> &mdash; <i>Function</i>.




```julia
fill!(A, x)
```


Fill array `A` with the value `x`. If `x` is an object reference, all elements will refer to the same object. `fill!(A, Foo())` will return `A` filled with the result of evaluating `Foo()` once.

**Examples**

```julia
julia> A = zeros(2,3)
2×3 Matrix{Float64}:
 0.0  0.0  0.0
 0.0  0.0  0.0

julia> fill!(A, 2.)
2×3 Matrix{Float64}:
 2.0  2.0  2.0
 2.0  2.0  2.0

julia> a = [1, 1, 1]; A = fill!(Vector{Vector{Int}}(undef, 3), a); a[1] = 2; A
3-element Vector{Vector{Int64}}:
 [2, 1, 1]
 [2, 1, 1]
 [2, 1, 1]

julia> x = 0; f() = (global x += 1; x); fill!(Vector{Int}(undef, 3), f())
3-element Vector{Int64}:
 1
 1
 1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/multidimensional.jl#L1101-L1132)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.empty' href='#Base.empty'>#</a>&nbsp;<b><u>Base.empty</u></b> &mdash; <i>Function</i>.




```julia
empty(x::Tuple)
```


Return an empty tuple, `()`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/tuple.jl#L686-L690)



```julia
empty(v::AbstractVector, [eltype])
```


Create an empty vector similar to `v`, optionally changing the `eltype`.

See also: [`empty!`](/base/collections#Base.empty!), [`isempty`](/base/collections#Base.isempty), [`isassigned`](/base/arrays#Base.isassigned).

**Examples**

```julia
julia> empty([1.0, 2.0, 3.0])
Float64[]

julia> empty([1.0, 2.0, 3.0], String)
String[]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L870-L886)



```julia
empty(a::AbstractDict, [index_type=keytype(a)], [value_type=valtype(a)])
```


Create an empty `AbstractDict` container which can accept indices of type `index_type` and values of type `value_type`. The second and third arguments are optional and default to the input&#39;s `keytype` and `valtype`, respectively. (If only one of the two types is specified, it is assumed to be the `value_type`, and the `index_type` we default to `keytype(a)`).

Custom `AbstractDict` subtypes may choose which specific dictionary type is best suited to return for the given index and value types, by specializing on the three-argument signature. The default is to return an empty `Dict`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractdict.jl#L178-L189)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.similar' href='#Base.similar'>#</a>&nbsp;<b><u>Base.similar</u></b> &mdash; <i>Function</i>.




```julia
similar(A::AbstractSparseMatrixCSC{Tv,Ti}, [::Type{TvNew}, ::Type{TiNew}, m::Integer, n::Integer]) where {Tv,Ti}
```


Create an uninitialized mutable array with the given element type, index type, and size, based upon the given source `SparseMatrixCSC`. The new sparse matrix maintains the structure of the original sparse matrix, except in the case where dimensions of the output matrix are different from the output.

The output matrix has zeros in the same locations as the input, but uninitialized values for the nonzero locations.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/SparseArrays-e61663ad0a79a48906b0b12d53506e731a614ab8/src/sparsematrix.jl#L708-L719)



```julia
similar(array, [element_type=eltype(array)], [dims=size(array)])
```


Create an uninitialized mutable array with the given element type and size, based upon the given source array. The second and third arguments are both optional, defaulting to the given array&#39;s `eltype` and `size`. The dimensions may be specified either as a single tuple argument or as a series of integer arguments.

Custom AbstractArray subtypes may choose which specific array type is best-suited to return for the given element type and dimensionality. If they do not specialize this method, the default is an `Array{element_type}(undef, dims...)`.

For example, `similar(1:10, 1, 4)` returns an uninitialized `Array{Int,2}` since ranges are neither mutable nor support 2 dimensions:

```julia
julia> similar(1:10, 1, 4)
1×4 Matrix{Int64}:
 4419743872  4374413872  4419743888  0
```


Conversely, `similar(trues(10,10), 2)` returns an uninitialized `BitVector` with two elements since `BitArray`s are both mutable and can support 1-dimensional arrays:

```julia
julia> similar(trues(10,10), 2)
2-element BitVector:
 0
 0
```


Since `BitArray`s can only store elements of type [`Bool`](/base/numbers#Core.Bool), however, if you request a different element type it will create a regular `Array` instead:

```julia
julia> similar(falses(10), Float64, 2, 4)
2×4 Matrix{Float64}:
 2.18425e-314  2.18425e-314  2.18425e-314  2.18425e-314
 2.18425e-314  2.18425e-314  2.18425e-314  2.18425e-314
```


See also: [`undef`](/base/arrays#Core.undef), [`isassigned`](/base/arrays#Base.isassigned).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L777-L819)



```julia
similar(storagetype, axes)
```


Create an uninitialized mutable array analogous to that specified by `storagetype`, but with `axes` specified by the last argument.

**Examples**:

```
similar(Array{Int}, axes(A))
```


creates an array that &quot;acts like&quot; an `Array{Int}` (and might indeed be backed by one), but which is indexed identically to `A`. If `A` has conventional indexing, this will be identical to `Array{Int}(undef, size(A))`, but if `A` has unconventional indexing then the indices of the result will match `A`.

```
similar(BitArray, (axes(A, 2),))
```


would create a 1-dimensional logical array whose indices match those of the columns of `A`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L844-L865)

</div>
<br>

## Basic functions {#Basic-functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ndims' href='#Base.ndims'>#</a>&nbsp;<b><u>Base.ndims</u></b> &mdash; <i>Function</i>.




```julia
ndims(A::AbstractArray) -> Integer
```


Return the number of dimensions of `A`.

See also: [`size`](/base/arrays#Base.size), [`axes`](/base/arrays#Base.axes-Tuple{Any}).

**Examples**

```julia
julia> A = fill(1, (3,4,5));

julia> ndims(A)
3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L259-L273)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.size' href='#Base.size'>#</a>&nbsp;<b><u>Base.size</u></b> &mdash; <i>Function</i>.




```julia
size(A::AbstractArray, [dim])
```


Return a tuple containing the dimensions of `A`. Optionally you can specify a dimension to just get the length of that dimension.

Note that `size` may not be defined for arrays with non-standard indices, in which case [`axes`](/base/arrays#Base.axes-Tuple{Any}) may be useful. See the manual chapter on [arrays with custom indices](/devdocs/offset-arrays#man-custom-indices).

See also: [`length`](/base/collections#Base.length), [`ndims`](/base/arrays#Base.ndims), [`eachindex`](/base/arrays#Base.eachindex), [`sizeof`](/base/base#Base.sizeof-Tuple{Type}).

**Examples**

```julia
julia> A = fill(1, (2,3,4));

julia> size(A)
(2, 3, 4)

julia> size(A, 2)
3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L20-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.axes-Tuple{Any}' href='#Base.axes-Tuple{Any}'>#</a>&nbsp;<b><u>Base.axes</u></b> &mdash; <i>Method</i>.




```julia
axes(A)
```


Return the tuple of valid indices for array `A`.

See also: [`size`](/base/arrays#Base.size), [`keys`](/base/collections#Base.keys), [`eachindex`](/base/arrays#Base.eachindex).

**Examples**

```julia
julia> A = fill(1, (5,6,7));

julia> axes(A)
(Base.OneTo(5), Base.OneTo(6), Base.OneTo(7))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L80-L95)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.axes-Tuple{AbstractArray, Any}' href='#Base.axes-Tuple{AbstractArray, Any}'>#</a>&nbsp;<b><u>Base.axes</u></b> &mdash; <i>Method</i>.




```julia
axes(A, d)
```


Return the valid range of indices for array `A` along dimension `d`.

See also [`size`](/base/arrays#Base.size), and the manual chapter on [arrays with custom indices](/devdocs/offset-arrays#man-custom-indices).

**Examples**

```julia
julia> A = fill(1, (5,6,7));

julia> axes(A, 2)
Base.OneTo(6)

julia> axes(A, 4) == 1:1  # all dimensions d > ndims(A) have size 1
true
```


**Usage note**

Each of the indices has to be an `AbstractUnitRange{<:Integer}`, but at the same time can be a type that uses custom indices. So, for example, if you need a subset, use generalized indexing constructs like `begin`/`end` or [`firstindex`](/base/collections#Base.firstindex)/[`lastindex`](/base/collections#Base.lastindex):

```julia
ix = axes(v, 1)
ix[2:end]          # will work for eg Vector, but may fail in general
ix[(begin+1):end]  # works for generalized indexes
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L44-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.length-Tuple{AbstractArray}' href='#Base.length-Tuple{AbstractArray}'>#</a>&nbsp;<b><u>Base.length</u></b> &mdash; <i>Method</i>.




```julia
length(A::AbstractArray)
```


Return the number of elements in the array, defaults to `prod(size(A))`.

**Examples**

```julia
julia> length([1, 2, 3, 4])
4

julia> length([1 2; 3 4])
4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L301-L314)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.keys-Tuple{AbstractArray}' href='#Base.keys-Tuple{AbstractArray}'>#</a>&nbsp;<b><u>Base.keys</u></b> &mdash; <i>Method</i>.




```julia
keys(a::AbstractArray)
```


Return an efficient array describing all valid indices for `a` arranged in the shape of `a` itself.

The keys of 1-dimensional arrays (vectors) are integers, whereas all other N-dimensional arrays use [`CartesianIndex`](/base/arrays#Base.IteratorsMD.CartesianIndex) to describe their locations.  Often the special array types [`LinearIndices`](/base/arrays#Base.LinearIndices) and [`CartesianIndices`](/base/arrays#Base.IteratorsMD.CartesianIndices) are used to efficiently represent these arrays of integers and `CartesianIndex`es, respectively.

Note that the `keys` of an array might not be the most efficient index type; for maximum performance use  [`eachindex`](/base/arrays#Base.eachindex) instead.

**Examples**

```julia
julia> keys([4, 5, 6])
3-element LinearIndices{1, Tuple{Base.OneTo{Int64}}}:
 1
 2
 3

julia> keys([4 5; 6 7])
CartesianIndices((2, 2))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L140-L164)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachindex' href='#Base.eachindex'>#</a>&nbsp;<b><u>Base.eachindex</u></b> &mdash; <i>Function</i>.




```julia
eachindex(A...)
eachindex(::IndexStyle, A::AbstractArray...)
```


Create an iterable object for visiting each index of an `AbstractArray` `A` in an efficient manner. For array types that have opted into fast linear indexing (like `Array`), this is simply the range `1:length(A)` if they use 1-based indexing. For array types that have not opted into fast linear indexing, a specialized Cartesian range is typically returned to efficiently index into the array with indices specified for every dimension.

In general `eachindex` accepts arbitrary iterables, including strings and dictionaries, and returns an iterator object supporting arbitrary index types (e.g. unevenly spaced or non-integer indices).

If `A` is `AbstractArray` it is possible to explicitly specify the style of the indices that should be returned by `eachindex` by passing a value having `IndexStyle` type as its first argument (typically `IndexLinear()` if linear indices are required or `IndexCartesian()` if Cartesian range is wanted).

If you supply more than one `AbstractArray` argument, `eachindex` will create an iterable object that is fast for all arguments (typically a [`UnitRange`](/base/collections#Base.UnitRange) if all inputs have fast linear indexing, a [`CartesianIndices`](/base/arrays#Base.IteratorsMD.CartesianIndices) otherwise). If the arrays have different sizes and/or dimensionalities, a `DimensionMismatch` exception will be thrown.

See also [`pairs`](/base/collections#Base.pairs)`(A)` to iterate over indices and values together, and [`axes`](/base/arrays#Base.axes-Tuple{Any})`(A, 2)` for valid indices along one dimension.

**Examples**

```julia
julia> A = [10 20; 30 40];

julia> for i in eachindex(A) # linear indexing
           println("A[", i, "] == ", A[i])
       end
A[1] == 10
A[2] == 30
A[3] == 20
A[4] == 40

julia> for i in eachindex(view(A, 1:2, 1:1)) # Cartesian indexing
           println(i)
       end
CartesianIndex(1, 1)
CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L331-L377)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IndexStyle' href='#Base.IndexStyle'>#</a>&nbsp;<b><u>Base.IndexStyle</u></b> &mdash; <i>Type</i>.




```julia
IndexStyle(A)
IndexStyle(typeof(A))
```


`IndexStyle` specifies the &quot;native indexing style&quot; for array `A`. When you define a new [`AbstractArray`](/base/arrays#Core.AbstractArray) type, you can choose to implement either linear indexing (with [`IndexLinear`](/base/arrays#Base.IndexLinear)) or cartesian indexing. If you decide to only implement linear indexing, then you must set this trait for your array type:

```
Base.IndexStyle(::Type{<:MyArray}) = IndexLinear()
```


The default is [`IndexCartesian()`](/base/arrays#Base.IndexCartesian).

Julia&#39;s internal indexing machinery will automatically (and invisibly) recompute all indexing operations into the preferred style. This allows users to access elements of your array using any indexing style, even when explicit methods have not been provided.

If you define both styles of indexing for your `AbstractArray`, this trait can be used to select the most performant indexing style. Some methods check this trait on their inputs, and dispatch to different algorithms depending on the most efficient access pattern. In particular, [`eachindex`](/base/arrays#Base.eachindex) creates an iterator whose type depends on the setting of this trait.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/indices.jl#L68-L93)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IndexLinear' href='#Base.IndexLinear'>#</a>&nbsp;<b><u>Base.IndexLinear</u></b> &mdash; <i>Type</i>.




```julia
IndexLinear()
```


Subtype of [`IndexStyle`](/base/arrays#Base.IndexStyle) used to describe arrays which are optimally indexed by one linear index.

A linear indexing style uses one integer index to describe the position in the array (even if it&#39;s a multidimensional array) and column-major ordering is used to efficiently access the elements. This means that requesting [`eachindex`](/base/arrays#Base.eachindex) from an array that is `IndexLinear` will return a simple one-dimensional range, even if it is multidimensional.

A custom array that reports its `IndexStyle` as `IndexLinear` only needs to implement indexing (and indexed assignment) with a single `Int` index; all other indexing expressions — including multidimensional accesses — will be recomputed to the linear index.  For example, if `A` were a `2×3` custom matrix with linear indexing, and we referenced `A[1, 3]`, this would be recomputed to the equivalent linear index and call `A[5]` since `1 + 2*(3 - 1) = 5`.

See also [`IndexCartesian`](/base/arrays#Base.IndexCartesian).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/indices.jl#L16-L36)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IndexCartesian' href='#Base.IndexCartesian'>#</a>&nbsp;<b><u>Base.IndexCartesian</u></b> &mdash; <i>Type</i>.




```julia
IndexCartesian()
```


Subtype of [`IndexStyle`](/base/arrays#Base.IndexStyle) used to describe arrays which are optimally indexed by a Cartesian index. This is the default for new custom [`AbstractArray`](/base/arrays#Core.AbstractArray) subtypes.

A Cartesian indexing style uses multiple integer indices to describe the position in a multidimensional array, with exactly one index per dimension. This means that requesting [`eachindex`](/base/arrays#Base.eachindex) from an array that is `IndexCartesian` will return a range of [`CartesianIndices`](/base/arrays#Base.IteratorsMD.CartesianIndices).

A `N`-dimensional custom array that reports its `IndexStyle` as `IndexCartesian` needs to implement indexing (and indexed assignment) with exactly `N` `Int` indices; all other indexing expressions — including linear indexing — will be recomputed to the equivalent Cartesian location.  For example, if `A` were a `2×3` custom matrix with cartesian indexing, and we referenced `A[5]`, this would be recomputed to the equivalent Cartesian index and call `A[1, 3]` since `5 = 1 + 2*(3 - 1)`.

It is significantly more expensive to compute Cartesian indices from a linear index than it is to go the other way.  The former operation requires division — a very costly operation — whereas the latter only uses multiplication and addition and is essentially free. This asymmetry means it is far more costly to use linear indexing with an `IndexCartesian` array than it is to use Cartesian indexing with an `IndexLinear` array.

See also [`IndexLinear`](/base/arrays#Base.IndexLinear).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/indices.jl#L39-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.conj!' href='#Base.conj!'>#</a>&nbsp;<b><u>Base.conj!</u></b> &mdash; <i>Function</i>.




```julia
conj!(A)
```


Transform an array to its complex conjugate in-place.

See also [`conj`](/base/math#Base.conj).

**Examples**

```julia
julia> A = [1+im 2-im; 2+2im 3+im]
2×2 Matrix{Complex{Int64}}:
 1+1im  2-1im
 2+2im  3+1im

julia> conj!(A);

julia> A
2×2 Matrix{Complex{Int64}}:
 1-1im  2+1im
 2-2im  3-1im
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarraymath.jl#L98-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.stride' href='#Base.stride'>#</a>&nbsp;<b><u>Base.stride</u></b> &mdash; <i>Function</i>.




```julia
stride(A, k::Integer)
```


Return the distance in memory (in number of elements) between adjacent elements in dimension `k`.

See also: [`strides`](/base/arrays#Base.strides).

**Examples**

```julia
julia> A = fill(1, (3,4,5));

julia> stride(A,2)
3

julia> stride(A,3)
12
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L576-L593)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.strides' href='#Base.strides'>#</a>&nbsp;<b><u>Base.strides</u></b> &mdash; <i>Function</i>.




```julia
strides(A)
```


Return a tuple of the memory strides in each dimension.

See also: [`stride`](/base/arrays#Base.stride).

**Examples**

```julia
julia> A = fill(1, (3,4,5));

julia> strides(A)
(1, 3, 12)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L559-L573)

</div>
<br>

## Broadcast and vectorization {#Broadcast-and-vectorization}

See also the [dot syntax for vectorizing functions](/manual/functions#man-vectorized); for example, `f.(args...)` implicitly calls `broadcast(f, args...)`. Rather than relying on &quot;vectorized&quot; methods of functions like `sin` to operate on arrays, you should use `sin.(a)` to vectorize via `broadcast`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.broadcast' href='#Base.Broadcast.broadcast'>#</a>&nbsp;<b><u>Base.Broadcast.broadcast</u></b> &mdash; <i>Function</i>.




```julia
broadcast(f, As...)
```


Broadcast the function `f` over the arrays, tuples, collections, [`Ref`](/base/c#Core.Ref)s and/or scalars `As`.

Broadcasting applies the function `f` over the elements of the container arguments and the scalars themselves in `As`. Singleton and missing dimensions are expanded to match the extents of the other arguments by virtually repeating the value. By default, only a limited number of types are considered scalars, including `Number`s, `String`s, `Symbol`s, `Type`s, `Function`s and some common singletons like [`missing`](/manual/missing#missing) and [`nothing`](/base/constants#Core.nothing). All other arguments are iterated over or indexed into elementwise.

The resulting container type is established by the following rules:
- If all the arguments are scalars or zero-dimensional arrays, it returns an unwrapped scalar.
  
- If at least one argument is a tuple and all others are scalars or zero-dimensional arrays, it returns a tuple.
  
- All other combinations of arguments default to returning an `Array`, but custom container types can define their own implementation and promotion-like rules to customize the result when they appear as arguments.
  

A special syntax exists for broadcasting: `f.(args...)` is equivalent to `broadcast(f, args...)`, and nested `f.(g.(args...))` calls are fused into a single broadcast loop.

**Examples**

```julia
julia> A = [1, 2, 3, 4, 5]
5-element Vector{Int64}:
 1
 2
 3
 4
 5

julia> B = [1 2; 3 4; 5 6; 7 8; 9 10]
5×2 Matrix{Int64}:
 1   2
 3   4
 5   6
 7   8
 9  10

julia> broadcast(+, A, B)
5×2 Matrix{Int64}:
  2   3
  5   6
  8   9
 11  12
 14  15

julia> parse.(Int, ["1", "2"])
2-element Vector{Int64}:
 1
 2

julia> abs.((1, -2))
(1, 2)

julia> broadcast(+, 1.0, (0, -2.0))
(1.0, -1.0)

julia> (+).([[0,2], [1,3]], Ref{Vector{Int}}([1,-1]))
2-element Vector{Vector{Int64}}:
 [1, 1]
 [2, 2]

julia> string.(("one","two","three","four"), ": ", 1:4)
4-element Vector{String}:
 "one: 1"
 "two: 2"
 "three: 3"
 "four: 4"

```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L734-L809)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.broadcast!' href='#Base.Broadcast.broadcast!'>#</a>&nbsp;<b><u>Base.Broadcast.broadcast!</u></b> &mdash; <i>Function</i>.




```julia
broadcast!(f, dest, As...)
```


Like [`broadcast`](/base/arrays#Base.Broadcast.broadcast), but store the result of `broadcast(f, As...)` in the `dest` array. Note that `dest` is only used to store the result, and does not supply arguments to `f` unless it is also listed in the `As`, as in `broadcast!(f, A, A, B)` to perform `A[:] = broadcast(f, A, B)`.

**Examples**

```julia
julia> A = [1.0; 0.0]; B = [0.0; 0.0];

julia> broadcast!(+, B, A, (0, -2.0));

julia> B
2-element Vector{Float64}:
  1.0
 -2.0

julia> A
2-element Vector{Float64}:
 1.0
 0.0

julia> broadcast!(+, A, A, (0, -2.0));

julia> A
2-element Vector{Float64}:
  1.0
 -2.0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L816-L848)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.@__dot__' href='#Base.Broadcast.@__dot__'>#</a>&nbsp;<b><u>Base.Broadcast.@__dot__</u></b> &mdash; <i>Macro</i>.




```julia
@. expr
```


Convert every function call or operator in `expr` into a &quot;dot call&quot; (e.g. convert `f(x)` to `f.(x)`), and convert every assignment in `expr` to a &quot;dot assignment&quot; (e.g. convert `+=` to `.+=`).

If you want to _avoid_ adding dots for selected function calls in `expr`, splice those function calls in with `$`.  For example, `@. sqrt(abs($sort(x)))` is equivalent to `sqrt.(abs.(sort(x)))` (no dot for `sort`).

(`@.` is equivalent to a call to `@__dot__`.)

**Examples**

```julia
julia> x = 1.0:3.0; y = similar(x);

julia> @. y = x + 3 * sin(x)
3-element Vector{Float64}:
 3.5244129544236893
 4.727892280477045
 3.4233600241796016
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L1278-L1302)

</div>
<br>

For specializing broadcast on custom types, see
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.BroadcastStyle' href='#Base.Broadcast.BroadcastStyle'>#</a>&nbsp;<b><u>Base.Broadcast.BroadcastStyle</u></b> &mdash; <i>Type</i>.




`BroadcastStyle` is an abstract type and trait-function used to determine behavior of objects under broadcasting. `BroadcastStyle(typeof(x))` returns the style associated with `x`. To customize the broadcasting behavior of a type, one can declare a style by defining a type/method pair

```
struct MyContainerStyle <: BroadcastStyle end
Base.BroadcastStyle(::Type{<:MyContainer}) = MyContainerStyle()
```


One then writes method(s) (at least [`similar`](/base/arrays#Base.similar)) operating on `Broadcasted{MyContainerStyle}`. There are also several pre-defined subtypes of `BroadcastStyle` that you may be able to leverage; see the [Interfaces chapter](/manual/interfaces#man-interfaces-broadcasting) for more information.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L21-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.AbstractArrayStyle' href='#Base.Broadcast.AbstractArrayStyle'>#</a>&nbsp;<b><u>Base.Broadcast.AbstractArrayStyle</u></b> &mdash; <i>Type</i>.




`Broadcast.AbstractArrayStyle{N} <: BroadcastStyle` is the abstract supertype for any style associated with an `AbstractArray` type. The `N` parameter is the dimensionality, which can be handy for AbstractArray types that only support specific dimensionalities:

```
struct SparseMatrixStyle <: Broadcast.AbstractArrayStyle{2} end
Base.BroadcastStyle(::Type{<:SparseMatrixCSC}) = SparseMatrixStyle()
```


For `AbstractArray` types that support arbitrary dimensionality, `N` can be set to `Any`:

```
struct MyArrayStyle <: Broadcast.AbstractArrayStyle{Any} end
Base.BroadcastStyle(::Type{<:MyArray}) = MyArrayStyle()
```


In cases where you want to be able to mix multiple `AbstractArrayStyle`s and keep track of dimensionality, your style needs to support a [`Val`](/base/base#Base.Val) constructor:

```
struct MyArrayStyleDim{N} <: Broadcast.AbstractArrayStyle{N} end
(::Type{<:MyArrayStyleDim})(::Val{N}) where N = MyArrayStyleDim{N}()
```


Note that if two or more `AbstractArrayStyle` subtypes conflict, broadcasting machinery will fall back to producing `Array`s. If this is undesirable, you may need to define binary [`BroadcastStyle`](/base/arrays#Base.Broadcast.BroadcastStyle) rules to control the output type.

See also [`Broadcast.DefaultArrayStyle`](/base/arrays#Base.Broadcast.DefaultArrayStyle).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L51-L76)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.ArrayStyle' href='#Base.Broadcast.ArrayStyle'>#</a>&nbsp;<b><u>Base.Broadcast.ArrayStyle</u></b> &mdash; <i>Type</i>.




`Broadcast.ArrayStyle{MyArrayType}()` is a [`BroadcastStyle`](/base/arrays#Base.Broadcast.BroadcastStyle) indicating that an object behaves as an array for broadcasting. It presents a simple way to construct [`Broadcast.AbstractArrayStyle`](/base/arrays#Base.Broadcast.AbstractArrayStyle)s for specific `AbstractArray` container types. Broadcast styles created this way lose track of dimensionality; if keeping track is important for your type, you should create your own custom [`Broadcast.AbstractArrayStyle`](/base/arrays#Base.Broadcast.AbstractArrayStyle).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L79-L85)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.DefaultArrayStyle' href='#Base.Broadcast.DefaultArrayStyle'>#</a>&nbsp;<b><u>Base.Broadcast.DefaultArrayStyle</u></b> &mdash; <i>Type</i>.




`Broadcast.DefaultArrayStyle{N}()` is a [`BroadcastStyle`](/base/arrays#Base.Broadcast.BroadcastStyle) indicating that an object behaves as an `N`-dimensional array for broadcasting. Specifically, `DefaultArrayStyle` is used for any `AbstractArray` type that hasn&#39;t defined a specialized style, and in the absence of overrides from other `broadcast` arguments the resulting output type is `Array`. When there are multiple inputs to `broadcast`, `DefaultArrayStyle` &quot;loses&quot; to any other [`Broadcast.ArrayStyle`](/base/arrays#Base.Broadcast.ArrayStyle).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L89-L96)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.broadcastable' href='#Base.Broadcast.broadcastable'>#</a>&nbsp;<b><u>Base.Broadcast.broadcastable</u></b> &mdash; <i>Function</i>.




```julia
Broadcast.broadcastable(x)
```


Return either `x` or an object like `x` such that it supports [`axes`](/base/arrays#Base.axes-Tuple{Any}), indexing, and its type supports [`ndims`](/base/arrays#Base.ndims).

If `x` supports iteration, the returned value should have the same `axes` and indexing behaviors as [`collect(x)`](/base/collections#Base.collect-Tuple{Any}).

If `x` is not an `AbstractArray` but it supports `axes`, indexing, and its type supports `ndims`, then `broadcastable(::typeof(x))` may be implemented to just return itself. Further, if `x` defines its own [`BroadcastStyle`](/base/arrays#Base.Broadcast.BroadcastStyle), then it must define its `broadcastable` method to return itself for the custom style to have any effect.

**Examples**

```julia
julia> Broadcast.broadcastable([1,2,3]) # like `identity` since arrays already support axes and indexing
3-element Vector{Int64}:
 1
 2
 3

julia> Broadcast.broadcastable(Int) # Types don't support axes, indexing, or iteration but are commonly used as scalars
Base.RefValue{Type{Int64}}(Int64)

julia> Broadcast.broadcastable("hello") # Strings break convention of matching iteration and act like a scalar instead
Base.RefValue{String}("hello")
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L680-L707)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.combine_axes' href='#Base.Broadcast.combine_axes'>#</a>&nbsp;<b><u>Base.Broadcast.combine_axes</u></b> &mdash; <i>Function</i>.




```julia
combine_axes(As...) -> Tuple
```


Determine the result axes for broadcasting across all values in `As`.

```julia
julia> Broadcast.combine_axes([1], [1 2; 3 4; 5 6])
(Base.OneTo(3), Base.OneTo(2))

julia> Broadcast.combine_axes(1, 1, 1)
()
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L483-L495)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.combine_styles' href='#Base.Broadcast.combine_styles'>#</a>&nbsp;<b><u>Base.Broadcast.combine_styles</u></b> &mdash; <i>Function</i>.




```julia
combine_styles(cs...) -> BroadcastStyle
```


Decides which `BroadcastStyle` to use for any number of value arguments. Uses [`BroadcastStyle`](/base/arrays#Base.Broadcast.BroadcastStyle) to get the style for each argument, and uses [`result_style`](/base/arrays#Base.Broadcast.result_style) to combine styles.

**Examples**

```julia
julia> Broadcast.combine_styles([1], [1 2; 3 4])
Base.Broadcast.DefaultArrayStyle{2}()
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L409-L422)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast.result_style' href='#Base.Broadcast.result_style'>#</a>&nbsp;<b><u>Base.Broadcast.result_style</u></b> &mdash; <i>Function</i>.




```julia
result_style(s1::BroadcastStyle[, s2::BroadcastStyle]) -> BroadcastStyle
```


Takes one or two `BroadcastStyle`s and combines them using [`BroadcastStyle`](/base/arrays#Base.Broadcast.BroadcastStyle) to determine a common `BroadcastStyle`.

**Examples**

```julia
julia> Broadcast.result_style(Broadcast.DefaultArrayStyle{0}(), Broadcast.DefaultArrayStyle{3}())
Base.Broadcast.DefaultArrayStyle{3}()

julia> Broadcast.result_style(Broadcast.Unknown(), Broadcast.DefaultArrayStyle{1}())
Base.Broadcast.DefaultArrayStyle{1}()
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L434-L449)

</div>
<br>

## Indexing and assignment {#Indexing-and-assignment}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.getindex-Tuple{AbstractArray, Vararg{Any}}' href='#Base.getindex-Tuple{AbstractArray, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.getindex</u></b> &mdash; <i>Method</i>.




```julia
getindex(A, inds...)
```


Return a subset of array `A` as selected by the indices `inds`.

Each index may be any [supported index type](/manual/arrays#man-supported-index-types), such as an [`Integer`](/base/numbers#Core.Integer), [`CartesianIndex`](/base/arrays#Base.IteratorsMD.CartesianIndex), [range](/base/collections#Base.AbstractRange), or [array](/manual/arrays#man-multi-dim-arrays) of supported indices. A [:](/base/arrays#Base.Colon) may be used to select all elements along a specific dimension, and a boolean array (e.g. an `Array{Bool}` or a [`BitArray`](/base/arrays#Base.BitArray)) may be used to filter for elements where the corresponding index is `true`.

When `inds` selects multiple elements, this function returns a newly allocated array. To index multiple elements without making a copy, use [`view`](/base/arrays#Base.view) instead.

See the manual section on [array indexing](/manual/arrays#man-array-indexing) for details.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> getindex(A, 1)
1

julia> getindex(A, [2, 1])
2-element Vector{Int64}:
 3
 1

julia> getindex(A, 2:4)
3-element Vector{Int64}:
 3
 2
 4

julia> getindex(A, 2, 1)
3

julia> getindex(A, CartesianIndex(2, 1))
3

julia> getindex(A, :, 2)
2-element Vector{Int64}:
 2
 4

julia> getindex(A, 2, :)
2-element Vector{Int64}:
 3
 4

julia> getindex(A, A .> 2)
2-element Vector{Int64}:
 3
 4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L1276-L1333)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setindex!-Tuple{AbstractArray, Any, Vararg{Any}}' href='#Base.setindex!-Tuple{AbstractArray, Any, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.setindex!</u></b> &mdash; <i>Method</i>.




```julia
setindex!(A, X, inds...)
A[inds...] = X
```


Store values from array `X` within some subset of `A` as specified by `inds`. The syntax `A[inds...] = X` is equivalent to `(setindex!(A, X, inds...); X)`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = zeros(2,2);

julia> setindex!(A, [10, 20], [1, 2]);

julia> A[[3, 4]] = [30, 40];

julia> A
2×2 Matrix{Float64}:
 10.0  30.0
 20.0  40.0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L1412-L1434)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nextind' href='#Base.nextind'>#</a>&nbsp;<b><u>Base.nextind</u></b> &mdash; <i>Function</i>.




```julia
nextind(A, i)
```


Return the index after `i` in `A`. The returned index is often equivalent to `i
- 1`for an integer`i`. This function can be useful for generic code.
  

::: warning Warning

The returned index might be out of bounds. Consider using [`checkbounds`](/base/arrays#Base.checkbounds).

:::

See also: [`prevind`](/base/arrays#Base.prevind).

**Examples**

```julia
julia> x = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> nextind(x, 1) # valid result
2

julia> nextind(x, 4) # invalid result
5

julia> nextind(x, CartesianIndex(1, 1)) # valid result
CartesianIndex(2, 1)

julia> nextind(x, CartesianIndex(2, 2)) # invalid result
CartesianIndex(1, 3)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/tuple.jl#L111-L142)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.prevind' href='#Base.prevind'>#</a>&nbsp;<b><u>Base.prevind</u></b> &mdash; <i>Function</i>.




```julia
prevind(A, i)
```


Return the index before `i` in `A`. The returned index is often equivalent to `i
- 1`for an integer`i`. This function can be useful for generic code.
  

::: warning Warning

The returned index might be out of bounds. Consider using [`checkbounds`](/base/arrays#Base.checkbounds).

:::

See also: [`nextind`](/base/arrays#Base.nextind).

**Examples**

```julia
julia> x = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> prevind(x, 4) # valid result
3

julia> prevind(x, 1) # invalid result
0

julia> prevind(x, CartesianIndex(2, 2)) # valid result
CartesianIndex(1, 2)

julia> prevind(x, CartesianIndex(1, 1)) # invalid result
CartesianIndex(2, 0)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/tuple.jl#L77-L108)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copyto!-Tuple{AbstractArray, CartesianIndices, AbstractArray, CartesianIndices}' href='#Base.copyto!-Tuple{AbstractArray, CartesianIndices, AbstractArray, CartesianIndices}'>#</a>&nbsp;<b><u>Base.copyto!</u></b> &mdash; <i>Method</i>.




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



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/multidimensional.jl#L1169-L1193)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copy!' href='#Base.copy!'>#</a>&nbsp;<b><u>Base.copy!</u></b> &mdash; <i>Function</i>.




```julia
copy!(dst, src) -> dst
```


In-place [`copy`](/base/base#Base.copy) of `src` into `dst`, discarding any pre-existing elements in `dst`. If `dst` and `src` are of the same type, `dst == src` should hold after the call. If `dst` and `src` are vector types, they must have equal offset. If `dst` and `src` are multidimensional arrays, they must have equal [`axes`](/base/arrays#Base.axes-Tuple{Any}).

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

See also [`copyto!`](/base/c#Base.copyto!).

::: tip Note

When operating on vector types, if `dst` and `src` are not of the same length, `dst` is resized to `length(src)` prior to the `copy`.

:::

::: tip Julia 1.1

This method requires at least Julia 1.1. In Julia 1.0 this method is available from the `Future` standard library as `Future.copy!`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L893-L914)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isassigned' href='#Base.isassigned'>#</a>&nbsp;<b><u>Base.isassigned</u></b> &mdash; <i>Function</i>.




```julia
isassigned(array, i) -> Bool
```


Test whether the given array has a value associated with index `i`. Return `false` if the index is out of bounds, or has an undefined reference.

**Examples**

```julia
julia> isassigned(rand(3, 3), 5)
true

julia> isassigned(rand(3, 3), 3 * 3 + 1)
false

julia> mutable struct Foo end

julia> v = similar(rand(3), Foo)
3-element Vector{Foo}:
 #undef
 #undef
 #undef

julia> isassigned(v, 1)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L941-L966)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Colon' href='#Base.Colon'>#</a>&nbsp;<b><u>Base.Colon</u></b> &mdash; <i>Type</i>.




```julia
Colon()
```


Colons (:) are used to signify indexing entire objects or dimensions at once.

Very few operations are defined on Colons directly; instead they are converted by [`to_indices`](/base/arrays#Base.to_indices) to an internal vector type (`Base.Slice`) to represent the collection of indices they span before being used.

The singleton instance of `Colon` is also a function used to construct ranges; see [`:`](/base/math#Base.::).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L975-L986)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IteratorsMD.CartesianIndex' href='#Base.IteratorsMD.CartesianIndex'>#</a>&nbsp;<b><u>Base.IteratorsMD.CartesianIndex</u></b> &mdash; <i>Type</i>.




```julia
CartesianIndex(i, j, k...)   -> I
CartesianIndex((i, j, k...)) -> I
```


Create a multidimensional index `I`, which can be used for indexing a multidimensional array `A`.  In particular, `A[I]` is equivalent to `A[i,j,k...]`.  One can freely mix integer and `CartesianIndex` indices; for example, `A[Ipre, i, Ipost]` (where `Ipre` and `Ipost` are `CartesianIndex` indices and `i` is an `Int`) can be a useful expression when writing algorithms that work along a single dimension of an array of arbitrary dimensionality.

A `CartesianIndex` is sometimes produced by [`eachindex`](/base/arrays#Base.eachindex), and always when iterating with an explicit [`CartesianIndices`](/base/arrays#Base.IteratorsMD.CartesianIndices).

An `I::CartesianIndex` is treated as a &quot;scalar&quot; (not a container) for `broadcast`.   In order to iterate over the components of a `CartesianIndex`, convert it to a tuple with `Tuple(I)`.

**Examples**

```julia
julia> A = reshape(Vector(1:16), (2, 2, 2, 2))
2×2×2×2 Array{Int64, 4}:
[:, :, 1, 1] =
 1  3
 2  4

[:, :, 2, 1] =
 5  7
 6  8

[:, :, 1, 2] =
  9  11
 10  12

[:, :, 2, 2] =
 13  15
 14  16

julia> A[CartesianIndex((1, 1, 1, 1))]
1

julia> A[CartesianIndex((1, 1, 1, 2))]
9

julia> A[CartesianIndex((1, 1, 2, 1))]
5
```


::: tip Julia 1.10

Using a `CartesianIndex` as a &quot;scalar&quot; for `broadcast` requires Julia 1.10; in previous releases, use `Ref(I)`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/multidimensional.jl#L19-L72)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IteratorsMD.CartesianIndices' href='#Base.IteratorsMD.CartesianIndices'>#</a>&nbsp;<b><u>Base.IteratorsMD.CartesianIndices</u></b> &mdash; <i>Type</i>.




```julia
CartesianIndices(sz::Dims) -> R
CartesianIndices((istart:[istep:]istop, jstart:[jstep:]jstop, ...)) -> R
```


Define a region `R` spanning a multidimensional rectangular range of integer indices. These are most commonly encountered in the context of iteration, where `for I in R ... end` will return [`CartesianIndex`](/base/arrays#Base.IteratorsMD.CartesianIndex) indices `I` equivalent to the nested loops

```
for j = jstart:jstep:jstop
    for i = istart:istep:istop
        ...
    end
end
```


Consequently these can be useful for writing algorithms that work in arbitrary dimensions.

```
CartesianIndices(A::AbstractArray) -> R
```


As a convenience, constructing a `CartesianIndices` from an array makes a range of its indices.

::: tip Julia 1.6

The step range method `CartesianIndices((istart:istep:istop, jstart:[jstep:]jstop, ...))` requires at least Julia 1.6.

:::

**Examples**

```julia
julia> foreach(println, CartesianIndices((2, 2, 2)))
CartesianIndex(1, 1, 1)
CartesianIndex(2, 1, 1)
CartesianIndex(1, 2, 1)
CartesianIndex(2, 2, 1)
CartesianIndex(1, 1, 2)
CartesianIndex(2, 1, 2)
CartesianIndex(1, 2, 2)
CartesianIndex(2, 2, 2)

julia> CartesianIndices(fill(1, (2,3)))
CartesianIndices((2, 3))
```


**Conversion between linear and cartesian indices**

Linear index to cartesian index conversion exploits the fact that a `CartesianIndices` is an `AbstractArray` and can be indexed linearly:

```julia
julia> cartesian = CartesianIndices((1:3, 1:2))
CartesianIndices((1:3, 1:2))

julia> cartesian[4]
CartesianIndex(1, 2)

julia> cartesian = CartesianIndices((1:2:5, 1:2))
CartesianIndices((1:2:5, 1:2))

julia> cartesian[2, 2]
CartesianIndex(3, 2)
```


**Broadcasting**

`CartesianIndices` support broadcasting arithmetic (+ and -) with a `CartesianIndex`.

::: tip Julia 1.1

Broadcasting of CartesianIndices requires at least Julia 1.1.

:::

```julia
julia> CIs = CartesianIndices((2:3, 5:6))
CartesianIndices((2:3, 5:6))

julia> CI = CartesianIndex(3, 4)
CartesianIndex(3, 4)

julia> CIs .+ CI
CartesianIndices((5:6, 9:10))
```


For cartesian to linear index conversion, see [`LinearIndices`](/base/arrays#Base.LinearIndices).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/multidimensional.jl#L186-L267)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Dims' href='#Base.Dims'>#</a>&nbsp;<b><u>Base.Dims</u></b> &mdash; <i>Type</i>.




```julia
Dims{N}
```


An `NTuple` of `N` `Int`s used to represent the dimensions of an [`AbstractArray`](/base/arrays#Core.AbstractArray).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/indices.jl#L3-L8)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.LinearIndices' href='#Base.LinearIndices'>#</a>&nbsp;<b><u>Base.LinearIndices</u></b> &mdash; <i>Type</i>.




```julia
LinearIndices(A::AbstractArray)
```


Return a `LinearIndices` array with the same shape and [`axes`](/base/arrays#Base.axes-Tuple{Any}) as `A`, holding the linear index of each entry in `A`. Indexing this array with cartesian indices allows mapping them to linear indices.

For arrays with conventional indexing (indices start at 1), or any multidimensional array, linear indices range from 1 to `length(A)`. However, for `AbstractVector`s linear indices are `axes(A, 1)`, and therefore do not start at 1 for vectors with unconventional indexing.

Calling this function is the &quot;safe&quot; way to write algorithms that exploit linear indexing.

**Examples**

```julia
julia> A = fill(1, (5,6,7));

julia> b = LinearIndices(A);

julia> extrema(b)
(1, 210)
```


```
LinearIndices(inds::CartesianIndices) -> R
LinearIndices(sz::Dims) -> R
LinearIndices((istart:istop, jstart:jstop, ...)) -> R
```


Return a `LinearIndices` array with the specified shape or [`axes`](/base/arrays#Base.axes-Tuple{Any}).

**Examples**

The main purpose of this constructor is intuitive conversion from cartesian to linear indexing:

```julia
julia> linear = LinearIndices((1:3, 1:2))
3×2 LinearIndices{2, Tuple{UnitRange{Int64}, UnitRange{Int64}}}:
 1  4
 2  5
 3  6

julia> linear[1,2]
4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/indices.jl#L478-L524)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.to_indices' href='#Base.to_indices'>#</a>&nbsp;<b><u>Base.to_indices</u></b> &mdash; <i>Function</i>.




```julia
to_indices(A, I::Tuple)
```


Convert the tuple `I` to a tuple of indices for use in indexing into array `A`.

The returned tuple must only contain either `Int`s or `AbstractArray`s of scalar indices that are supported by array `A`. It will error upon encountering a novel index type that it does not know how to process.

For simple index types, it defers to the unexported `Base.to_index(A, i)` to process each index `i`. While this internal function is not intended to be called directly, `Base.to_index` may be extended by custom array or index types to provide custom indexing behaviors.

More complicated index types may require more context about the dimension into which they index. To support those cases, `to_indices(A, I)` calls `to_indices(A, axes(A), I)`, which then recursively walks through both the given tuple of indices and the dimensional indices of `A` in tandem. As such, not all index types are guaranteed to propagate to `Base.to_index`.

**Examples**

```julia
julia> A = zeros(1,2,3,4);

julia> to_indices(A, (1,1,2,2))
(1, 1, 2, 2)

julia> to_indices(A, (1,1,2,20)) # no bounds checking
(1, 1, 2, 20)

julia> to_indices(A, (CartesianIndex((1,)), 2, CartesianIndex((3,4)))) # exotic index
(1, 2, 3, 4)

julia> to_indices(A, ([1,1], 1:2, 3, 4))
([1, 1], 1:2, 3, 4)

julia> to_indices(A, (1,2)) # no shape checking
(1, 2)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/indices.jl#L319-L358)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.checkbounds' href='#Base.checkbounds'>#</a>&nbsp;<b><u>Base.checkbounds</u></b> &mdash; <i>Function</i>.




```julia
checkbounds(Bool, A, I...)
```


Return `true` if the specified indices `I` are in bounds for the given array `A`. Subtypes of `AbstractArray` should specialize this method if they need to provide custom bounds checking behaviors; however, in many cases one can rely on `A`&#39;s indices and [`checkindex`](/base/arrays#Base.checkindex).

See also [`checkindex`](/base/arrays#Base.checkindex).

**Examples**

```julia
julia> A = rand(3, 3);

julia> checkbounds(Bool, A, 2)
true

julia> checkbounds(Bool, A, 3, 4)
false

julia> checkbounds(Bool, A, 1:3)
true

julia> checkbounds(Bool, A, 1:3, 2:4)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L652-L678)



```julia
checkbounds(A, I...)
```


Throw an error if the specified indices `I` are not in bounds for the given array `A`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L692-L696)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.checkindex' href='#Base.checkindex'>#</a>&nbsp;<b><u>Base.checkindex</u></b> &mdash; <i>Function</i>.




```julia
checkindex(Bool, inds::AbstractUnitRange, index)
```


Return `true` if the given `index` is within the bounds of `inds`. Custom types that would like to behave as indices for all arrays can extend this method in order to provide a specialized bounds checking implementation.

See also [`checkbounds`](/base/arrays#Base.checkbounds).

**Examples**

```julia
julia> checkindex(Bool, 1:20, 8)
true

julia> checkindex(Bool, 1:20, 21)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L732-L750)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.elsize' href='#Base.elsize'>#</a>&nbsp;<b><u>Base.elsize</u></b> &mdash; <i>Function</i>.




```julia
elsize(type)
```


Compute the memory stride in bytes between consecutive elements of [`eltype`](/base/collections#Base.eltype) stored inside the given `type`, if the array elements are stored densely with a uniform linear stride.

**Examples**

```julia
julia> Base.elsize(rand(Float32, 10))
4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L244-L256)

</div>
<br>

## Views (SubArrays and other view types) {#Views-(SubArrays-and-other-view-types)}

A “view” is a data structure that acts like an array (it is a subtype of `AbstractArray`), but the underlying data is actually part of another array.

For example, if `x` is an array and `v = @view x[1:10]`, then `v` acts like a 10-element array, but its data is actually accessing the first 10 elements of `x`. Writing to a view, e.g. `v[3] = 2`, writes directly to the underlying array `x` (in this case modifying `x[3]`).

Slicing operations like `x[1:10]` create a copy by default in Julia. `@view x[1:10]` changes it to make a view. The `@views` macro can be used on a whole block of code (e.g. `@views function foo() .... end` or `@views begin ... end`) to change all the slicing operations in that block to use views. Sometimes making a copy of the data is faster and sometimes using a view is faster, as described in the [performance tips](/manual/performance-tips#man-performance-views).
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.view' href='#Base.view'>#</a>&nbsp;<b><u>Base.view</u></b> &mdash; <i>Function</i>.




```julia
view(m::GenericMemory{M, T}, inds::Union{UnitRange, OneTo})
```


Create a vector `v::Vector{T}` backed by the specified indices of `m`. It is only safe to resize `v` if `m` is subseqently not used.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/genericmemory.jl#L301-L306)



```julia
view(A, inds...)
```


Like [`getindex`](/base/collections#Base.getindex), but returns a lightweight array that lazily references (or is effectively a _view_ into) the parent array `A` at the given index or indices `inds` instead of eagerly extracting elements or constructing a copied subset. Calling [`getindex`](/base/collections#Base.getindex) or [`setindex!`](/base/collections#Base.setindex!) on the returned value (often a [`SubArray`](/base/arrays#Base.SubArray)) computes the indices to access or modify the parent array on the fly.  The behavior is undefined if the shape of the parent array is changed after `view` is called because there is no bound check for the parent array; e.g., it may cause a segmentation fault.

Some immutable parent arrays (like ranges) may choose to simply recompute a new array in some circumstances instead of returning a `SubArray` if doing so is efficient and provides compatible semantics.

::: tip Julia 1.6

In Julia 1.6 or later, `view` can be called on an `AbstractString`, returning a `SubString`.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> b = view(A, :, 1)
2-element view(::Matrix{Int64}, :, 1) with eltype Int64:
 1
 3

julia> fill!(b, 0)
2-element view(::Matrix{Int64}, :, 1) with eltype Int64:
 0
 0

julia> A # Note A has changed even though we modified b
2×2 Matrix{Int64}:
 0  2
 0  4

julia> view(2:5, 2:3) # returns a range as type is immutable
3:4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/subarray.jl#L165-L210)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@view' href='#Base.@view'>#</a>&nbsp;<b><u>Base.@view</u></b> &mdash; <i>Macro</i>.




```julia
@view A[inds...]
```


Transform the indexing expression `A[inds...]` into the equivalent [`view`](/base/arrays#Base.view) call.

This can only be applied directly to a single indexing expression and is particularly helpful for expressions that include the special `begin` or `end` indexing syntaxes like `A[begin, 2:end-1]` (as those are not supported by the normal [`view`](/base/arrays#Base.view) function).

Note that `@view` cannot be used as the target of a regular assignment (e.g., `@view(A[1, 2:end]) = ...`), nor would the un-decorated [indexed assignment](/manual/arrays#man-indexed-assignment) (`A[1, 2:end] = ...`) or broadcasted indexed assignment (`A[1, 2:end] .= ...`) make a copy.  It can be useful, however, for _updating_ broadcasted assignments like `@view(A[1, 2:end]) .+= 1` because this is a simple syntax for `@view(A[1, 2:end]) .= @view(A[1, 2:end]) + 1`, and the indexing expression on the right-hand side would otherwise make a copy without the `@view`.

See also [`@views`](/base/arrays#Base.@views) to switch an entire block of code to use views for non-scalar indexing.

::: tip Julia 1.5

Using `begin` in an indexing expression to refer to the first index requires at least Julia 1.5.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> b = @view A[:, 1]
2-element view(::Matrix{Int64}, :, 1) with eltype Int64:
 1
 3

julia> fill!(b, 0)
2-element view(::Matrix{Int64}, :, 1) with eltype Int64:
 0
 0

julia> A
2×2 Matrix{Int64}:
 0  2
 0  4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/views.jl#L77-L124)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@views' href='#Base.@views'>#</a>&nbsp;<b><u>Base.@views</u></b> &mdash; <i>Macro</i>.




```julia
@views expression
```


Convert every array-slicing operation in the given expression (which may be a `begin`/`end` block, loop, function, etc.) to return a view. Scalar indices, non-array types, and explicit [`getindex`](/base/collections#Base.getindex) calls (as opposed to `array[...]`) are unaffected.

Similarly, `@views` converts string slices into [`SubString`](/base/strings#Base.SubString) views.

::: tip Note

The `@views` macro only affects `array[...]` expressions that appear explicitly in the given `expression`, not array slicing that occurs in functions called by that code.

:::

::: tip Julia 1.5

Using `begin` in an indexing expression to refer to the first index was implemented in Julia 1.4, but was only supported by `@views` starting in Julia 1.5.

:::

**Examples**

```julia
julia> A = zeros(3, 3);

julia> @views for row in 1:3
           b = A[row, :] # b is a view, not a copy
           b .= row      # assign every element to the row index
       end

julia> A
3×3 Matrix{Float64}:
 1.0  1.0  1.0
 2.0  2.0  2.0
 3.0  3.0  3.0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/views.jl#L211-L246)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.parent' href='#Base.parent'>#</a>&nbsp;<b><u>Base.parent</u></b> &mdash; <i>Function</i>.




```julia
parent(A)
```


Return the underlying parent object of the view. This parent of objects of types `SubArray`, `SubString`, `ReshapedArray` or `LinearAlgebra.Transpose` is what was passed as an argument to `view`, `reshape`, `transpose`, etc. during object creation. If the input is not a wrapped object, return the input itself. If the input is wrapped multiple times, only the outermost wrapper will be removed.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> V = view(A, 1:2, :)
2×2 view(::Matrix{Int64}, 1:2, :) with eltype Int64:
 1  2
 3  4

julia> parent(V)
2×2 Matrix{Int64}:
 1  2
 3  4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L1479-L1504)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.parentindices' href='#Base.parentindices'>#</a>&nbsp;<b><u>Base.parentindices</u></b> &mdash; <i>Function</i>.




```julia
parentindices(A)
```


Return the indices in the [`parent`](/base/arrays#Base.parent) which correspond to the view `A`.

**Examples**

```julia
julia> A = [1 2; 3 4];

julia> V = view(A, 1, :)
2-element view(::Matrix{Int64}, 1, :) with eltype Int64:
 1
 2

julia> parentindices(V)
(1, Base.Slice(Base.OneTo(2)))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/subarray.jl#L83-L100)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.selectdim' href='#Base.selectdim'>#</a>&nbsp;<b><u>Base.selectdim</u></b> &mdash; <i>Function</i>.




```julia
selectdim(A, d::Integer, i)
```


Return a view of all the data of `A` where the index for dimension `d` equals `i`.

Equivalent to `view(A,:,:,...,i,:,:,...)` where `i` is in position `d`.

See also: [`eachslice`](/base/arrays#Base.eachslice).

**Examples**

```julia
julia> A = [1 2 3 4; 5 6 7 8]
2×4 Matrix{Int64}:
 1  2  3  4
 5  6  7  8

julia> selectdim(A, 2, 3)
2-element view(::Matrix{Int64}, :, 3) with eltype Int64:
 3
 7

julia> selectdim(A, 2, 3:4)
2×2 view(::Matrix{Int64}, :, 3:4) with eltype Int64:
 3  4
 7  8
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarraymath.jl#L226-L252)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reinterpret' href='#Base.reinterpret'>#</a>&nbsp;<b><u>Base.reinterpret</u></b> &mdash; <i>Function</i>.




```julia
reinterpret(::Type{Out}, x::In)
```


Change the type-interpretation of the binary data in the isbits value `x` to that of the isbits type `Out`. The size (ignoring padding) of `Out` has to be the same as that of the type of `x`. For example, `reinterpret(Float32, UInt32(7))` interprets the 4 bytes corresponding to `UInt32(7)` as a [`Float32`](/base/numbers#Core.Float32). Note that `reinterpret(In, reinterpret(Out, x)) === x`

```julia
julia> reinterpret(Float32, UInt32(7))
1.0f-44

julia> reinterpret(NTuple{2, UInt8}, 0x1234)
(0x34, 0x12)

julia> reinterpret(UInt16, (0x34, 0x12))
0x1234

julia> reinterpret(Tuple{UInt16, UInt8}, (0x01, 0x0203))
(0x0301, 0x02)
```


::: tip Note

The treatment of padding differs from reinterpret(::DataType, ::AbstractArray).

:::

::: warning Warning

Use caution if some combinations of bits in `Out` are not considered valid and would otherwise be prevented by the type&#39;s constructors and methods. Unexpected behavior may result without additional validation.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L672-L705)



```julia
reinterpret(T::DataType, A::AbstractArray)
```


Construct a view of the array with the same binary data as the given array, but with `T` as element type.

This function also works on &quot;lazy&quot; array whose elements are not computed until they are explicitly retrieved. For instance, `reinterpret` on the range `1:6` works similarly as on the dense vector `collect(1:6)`:

```julia
julia> reinterpret(Float32, UInt32[1 2 3 4 5])
1×5 reinterpret(Float32, ::Matrix{UInt32}):
 1.0f-45  3.0f-45  4.0f-45  6.0f-45  7.0f-45

julia> reinterpret(Complex{Int}, 1:6)
3-element reinterpret(Complex{Int64}, ::UnitRange{Int64}):
 1 + 2im
 3 + 4im
 5 + 6im
```


If the location of padding bits does not line up between `T` and `eltype(A)`, the resulting array will be read-only or write-only, to prevent invalid bits from being written to or read from, respectively.

```julia
julia> a = reinterpret(Tuple{UInt8, UInt32}, UInt32[1, 2])
1-element reinterpret(Tuple{UInt8, UInt32}, ::Vector{UInt32}):
 (0x01, 0x00000002)

julia> a[1] = 3
ERROR: Padding of type Tuple{UInt8, UInt32} is not compatible with type UInt32.

julia> b = reinterpret(UInt32, Tuple{UInt8, UInt32}[(0x01, 0x00000002)]); # showing will error

julia> b[1]
ERROR: Padding of type UInt32 is not compatible with type Tuple{UInt8, UInt32}.
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reinterpretarray.jl#L29-L66)



```julia
reinterpret(reshape, T, A::AbstractArray{S}) -> B
```


Change the type-interpretation of `A` while consuming or adding a &quot;channel dimension.&quot;

If `sizeof(T) = n*sizeof(S)` for `n>1`, `A`&#39;s first dimension must be of size `n` and `B` lacks `A`&#39;s first dimension. Conversely, if `sizeof(S) = n*sizeof(T)` for `n>1`, `B` gets a new first dimension of size `n`. The dimensionality is unchanged if `sizeof(T) == sizeof(S)`.

::: tip Julia 1.6

This method requires at least Julia 1.6.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> reinterpret(reshape, Complex{Int}, A)    # the result is a vector
2-element reinterpret(reshape, Complex{Int64}, ::Matrix{Int64}) with eltype Complex{Int64}:
 1 + 3im
 2 + 4im

julia> a = [(1,2,3), (4,5,6)]
2-element Vector{Tuple{Int64, Int64, Int64}}:
 (1, 2, 3)
 (4, 5, 6)

julia> reinterpret(reshape, Int, a)             # the result is a matrix
3×2 reinterpret(reshape, Int64, ::Vector{Tuple{Int64, Int64, Int64}}) with eltype Int64:
 1  4
 2  5
 3  6
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reinterpretarray.jl#L137-L173)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reshape' href='#Base.reshape'>#</a>&nbsp;<b><u>Base.reshape</u></b> &mdash; <i>Function</i>.




```julia
reshape(A, dims...) -> AbstractArray
reshape(A, dims) -> AbstractArray
```


Return an array with the same data as `A`, but with different dimension sizes or number of dimensions. The two arrays share the same underlying data, so that the result is mutable if and only if `A` is mutable, and setting elements of one alters the values of the other.

The new dimensions may be specified either as a list of arguments or as a shape tuple. At most one dimension may be specified with a `:`, in which case its length is computed such that its product with all the specified dimensions is equal to the length of the original array `A`. The total number of elements must not change.

**Examples**

```julia
julia> A = Vector(1:16)
16-element Vector{Int64}:
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16

julia> reshape(A, (4, 4))
4×4 Matrix{Int64}:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> reshape(A, 2, :)
2×8 Matrix{Int64}:
 1  3  5  7   9  11  13  15
 2  4  6  8  10  12  14  16

julia> reshape(1:6, 2, 3)
2×3 reshape(::UnitRange{Int64}, 2, 3) with eltype Int64:
 1  3  5
 2  4  6
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reshapedarray.jl#L64-L117)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.dropdims' href='#Base.dropdims'>#</a>&nbsp;<b><u>Base.dropdims</u></b> &mdash; <i>Function</i>.




```julia
dropdims(A; dims)
```


Return an array with the same data as `A`, but with the dimensions specified by `dims` removed. `size(A,d)` must equal 1 for every `d` in `dims`, and repeated dimensions or numbers outside `1:ndims(A)` are forbidden.

The result shares the same underlying data as `A`, such that the result is mutable if and only if `A` is mutable, and setting elements of one alters the values of the other.

See also: [`reshape`](/base/arrays#Base.reshape), [`vec`](/base/arrays#Base.vec).

**Examples**

```julia
julia> a = reshape(Vector(1:4),(2,2,1,1))
2×2×1×1 Array{Int64, 4}:
[:, :, 1, 1] =
 1  3
 2  4

julia> b = dropdims(a; dims=3)
2×2×1 Array{Int64, 3}:
[:, :, 1] =
 1  3
 2  4

julia> b[1,1,1] = 5; a
2×2×1×1 Array{Int64, 4}:
[:, :, 1, 1] =
 5  3
 2  4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarraymath.jl#L48-L81)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.vec' href='#Base.vec'>#</a>&nbsp;<b><u>Base.vec</u></b> &mdash; <i>Function</i>.




```julia
vec(a::AbstractArray) -> AbstractVector
```


Reshape the array `a` as a one-dimensional column vector. Return `a` if it is already an `AbstractVector`. The resulting array shares the same underlying data as `a`, so it will only be mutable if `a` is mutable, in which case modifying one will also modify the other.

**Examples**

```julia
julia> a = [1 2 3; 4 5 6]
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> vec(a)
6-element Vector{Int64}:
 1
 4
 2
 5
 3
 6

julia> vec(1:3)
1:3
```


See also [`reshape`](/base/arrays#Base.reshape), [`dropdims`](/base/arrays#Base.dropdims).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarraymath.jl#L11-L40)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.SubArray' href='#Base.SubArray'>#</a>&nbsp;<b><u>Base.SubArray</u></b> &mdash; <i>Type</i>.




```julia
SubArray{T,N,P,I,L} <: AbstractArray{T,N}
```


`N`-dimensional view into a parent array (of type `P`) with an element type `T`, restricted by a tuple of indices (of type `I`). `L` is true for types that support fast linear indexing, and `false` otherwise.

Construct `SubArray`s using the [`view`](/base/arrays#Base.view) function.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/subarray.jl#L7-L13)

</div>
<br>

## Concatenation and permutation {#Concatenation-and-permutation}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cat' href='#Base.cat'>#</a>&nbsp;<b><u>Base.cat</u></b> &mdash; <i>Function</i>.




```julia
cat(A...; dims)
```


Concatenate the input arrays along the dimensions specified in `dims`.

Along a dimension `d in dims`, the size of the output array is `sum(size(a,d) for a in A)`. Along other dimensions, all input arrays should have the same size, which will also be the size of the output array along those dimensions.

If `dims` is a single number, the different arrays are tightly packed along that dimension. If `dims` is an iterable containing several dimensions, the positions along these dimensions are increased simultaneously for each input array, filling with zero elsewhere. This allows one to construct block-diagonal matrices as `cat(matrices...; dims=(1,2))`, and their higher-dimensional analogues.

The special case `dims=1` is [`vcat`](/base/arrays#Base.vcat), and `dims=2` is [`hcat`](/base/arrays#Base.hcat). See also [`hvcat`](/base/arrays#Base.hvcat), [`hvncat`](/base/arrays#Base.hvncat), [`stack`](/base/arrays#Base.stack), [`repeat`](/base/arrays#Base.repeat).

The keyword also accepts `Val(dims)`.

::: tip Julia 1.8

For multiple dimensions `dims = Val(::Tuple)` was added in Julia 1.8.

:::

**Examples**

Concatenate two arrays in different dimensions:

```julia
julia> a = [1 2 3]
1×3 Matrix{Int64}:
 1  2  3

julia> b = [4 5 6]
1×3 Matrix{Int64}:
 4  5  6

julia> cat(a, b; dims=1)
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> cat(a, b; dims=2)
1×6 Matrix{Int64}:
 1  2  3  4  5  6

julia> cat(a, b; dims=(1, 2))
2×6 Matrix{Int64}:
 1  2  3  0  0  0
 0  0  0  4  5  6
```


**Extended Help**

Concatenate 3D arrays:

```julia
julia> a = ones(2, 2, 3);

julia> b = ones(2, 2, 4);

julia> c = cat(a, b; dims=3);

julia> size(c) == (2, 2, 7)
true
```


Concatenate arrays of different sizes:

```julia
julia> cat([1 2; 3 4], [pi, pi], fill(10, 2,3,1); dims=2)  # same as hcat
2×6×1 Array{Float64, 3}:
[:, :, 1] =
 1.0  2.0  3.14159  10.0  10.0  10.0
 3.0  4.0  3.14159  10.0  10.0  10.0
```


Construct a block diagonal matrix:

```
julia> cat(true, trues(2,2), trues(4)', dims=(1,2))  # block-diagonal
4×7 Matrix{Bool}:
 1  0  0  0  0  0  0
 0  1  1  0  0  0  0
 0  1  1  0  0  0  0
 0  0  0  1  1  1  1
```


```
julia> cat(1, [2], [3;;]; dims=Val(2))
1×3 Matrix{Int64}:
 1  2  3
```


::: tip Note

`cat` does not join two strings, you may want to use `*`.

:::

```julia
julia> a = "aaa";

julia> b = "bbb";

julia> cat(a, b; dims=1)
2-element Vector{String}:
 "aaa"
 "bbb"

julia> cat(a, b; dims=2)
1×2 Matrix{String}:
 "aaa"  "bbb"

julia> a * b
"aaabbb"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L1996-L2106)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.vcat' href='#Base.vcat'>#</a>&nbsp;<b><u>Base.vcat</u></b> &mdash; <i>Function</i>.




```julia
vcat(A...)
```


Concatenate arrays or numbers vertically. Equivalent to [`cat`](/base/arrays#Base.cat)`(A...; dims=1)`, and to the syntax `[a; b; c]`.

To concatenate a large vector of arrays, `reduce(vcat, A)` calls an efficient method when `A isa AbstractVector{<:AbstractVecOrMat}`, rather than working pairwise.

See also [`hcat`](/base/arrays#Base.hcat), [`Iterators.flatten`](/base/iterators#Base.Iterators.flatten), [`stack`](/base/arrays#Base.stack).

**Examples**

```julia
julia> v = vcat([1,2], [3,4])
4-element Vector{Int64}:
 1
 2
 3
 4

julia> v == vcat(1, 2, [3,4])  # accepts numbers
true

julia> v == [1; 2; [3,4]]  # syntax for the same operation
true

julia> summary(ComplexF64[1; 2; [3,4]])  # syntax for supplying the element type
"4-element Vector{ComplexF64}"

julia> vcat(range(1, 2, length=3))  # collects lazy ranges
3-element Vector{Float64}:
 1.0
 1.5
 2.0

julia> two = ([10, 20, 30]', Float64[4 5 6; 7 8 9])  # row vector and a matrix
([10 20 30], [4.0 5.0 6.0; 7.0 8.0 9.0])

julia> vcat(two...)
3×3 Matrix{Float64}:
 10.0  20.0  30.0
  4.0   5.0   6.0
  7.0   8.0   9.0

julia> vs = [[1, 2], [3, 4], [5, 6]];

julia> reduce(vcat, vs)  # more efficient than vcat(vs...)
6-element Vector{Int64}:
 1
 2
 3
 4
 5
 6

julia> ans == collect(Iterators.flatten(vs))
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L1882-L1940)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hcat' href='#Base.hcat'>#</a>&nbsp;<b><u>Base.hcat</u></b> &mdash; <i>Function</i>.




```julia
hcat(A...)
```


Concatenate arrays or numbers horizontally. Equivalent to [`cat`](/base/arrays#Base.cat)`(A...; dims=2)`, and to the syntax `[a b c]` or `[a;; b;; c]`.

For a large vector of arrays, `reduce(hcat, A)` calls an efficient method when `A isa AbstractVector{<:AbstractVecOrMat}`. For a vector of vectors, this can also be written [`stack`](/base/arrays#Base.stack)`(A)`.

See also [`vcat`](/base/arrays#Base.vcat), [`hvcat`](/base/arrays#Base.hvcat).

**Examples**

```julia
julia> hcat([1,2], [3,4], [5,6])
2×3 Matrix{Int64}:
 1  3  5
 2  4  6

julia> hcat(1, 2, [30 40], [5, 6, 7]')  # accepts numbers
1×7 Matrix{Int64}:
 1  2  30  40  5  6  7

julia> ans == [1 2 [30 40] [5, 6, 7]']  # syntax for the same operation
true

julia> Float32[1 2 [30 40] [5, 6, 7]']  # syntax for supplying the eltype
1×7 Matrix{Float32}:
 1.0  2.0  30.0  40.0  5.0  6.0  7.0

julia> ms = [zeros(2,2), [1 2; 3 4], [50 60; 70 80]];

julia> reduce(hcat, ms)  # more efficient than hcat(ms...)
2×6 Matrix{Float64}:
 0.0  0.0  1.0  2.0  50.0  60.0
 0.0  0.0  3.0  4.0  70.0  80.0

julia> stack(ms) |> summary  # disagrees on a vector of matrices
"2×2×3 Array{Float64, 3}"

julia> hcat(Int[], Int[], Int[])  # empty vectors, each of size (0,)
0×3 Matrix{Int64}

julia> hcat([1.1, 9.9], Matrix(undef, 2, 0))  # hcat with empty 2×0 Matrix
2×1 Matrix{Any}:
 1.1
 9.9
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L1942-L1990)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hvcat' href='#Base.hvcat'>#</a>&nbsp;<b><u>Base.hvcat</u></b> &mdash; <i>Function</i>.




```julia
hvcat(blocks_per_row::Union{Tuple{Vararg{Int}}, Int}, values...)
```


Horizontal and vertical concatenation in one call. This function is called for block matrix syntax. The first argument specifies the number of arguments to concatenate in each block row. If the first argument is a single integer `n`, then all block rows are assumed to have `n` block columns.

**Examples**

```julia
julia> a, b, c, d, e, f = 1, 2, 3, 4, 5, 6
(1, 2, 3, 4, 5, 6)

julia> [a b c; d e f]
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> hvcat((3,3), a,b,c,d,e,f)
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> [a b; c d; e f]
3×2 Matrix{Int64}:
 1  2
 3  4
 5  6

julia> hvcat((2,2,2), a,b,c,d,e,f)
3×2 Matrix{Int64}:
 1  2
 3  4
 5  6
julia> hvcat((2,2,2), a,b,c,d,e,f) == hvcat(2, a,b,c,d,e,f)
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L2144-L2181)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hvncat' href='#Base.hvncat'>#</a>&nbsp;<b><u>Base.hvncat</u></b> &mdash; <i>Function</i>.




```julia
hvncat(dim::Int, row_first, values...)
hvncat(dims::Tuple{Vararg{Int}}, row_first, values...)
hvncat(shape::Tuple{Vararg{Tuple}}, row_first, values...)
```


Horizontal, vertical, and n-dimensional concatenation of many `values` in one call.

This function is called for block matrix syntax. The first argument either specifies the shape of the concatenation, similar to `hvcat`, as a tuple of tuples, or the dimensions that specify the key number of elements along each axis, and is used to determine the output dimensions. The `dims` form is more performant, and is used by default when the concatenation operation has the same number of elements along each axis (e.g., [a b; c d;;; e f ; g h]). The `shape` form is used when the number of elements along each axis is unbalanced (e.g., [a b ; c]). Unbalanced syntax needs additional validation overhead. The `dim` form is an optimization for concatenation along just one dimension. `row_first` indicates how `values` are ordered. The meaning of the first and second elements of `shape` are also swapped based on `row_first`.

**Examples**

```julia
julia> a, b, c, d, e, f = 1, 2, 3, 4, 5, 6
(1, 2, 3, 4, 5, 6)

julia> [a b c;;; d e f]
1×3×2 Array{Int64, 3}:
[:, :, 1] =
 1  2  3

[:, :, 2] =
 4  5  6

julia> hvncat((2,1,3), false, a,b,c,d,e,f)
2×1×3 Array{Int64, 3}:
[:, :, 1] =
 1
 2

[:, :, 2] =
 3
 4

[:, :, 3] =
 5
 6

julia> [a b;;; c d;;; e f]
1×2×3 Array{Int64, 3}:
[:, :, 1] =
 1  2

[:, :, 2] =
 3  4

[:, :, 3] =
 5  6

julia> hvncat(((3, 3), (3, 3), (6,)), true, a, b, c, d, e, f)
1×3×2 Array{Int64, 3}:
[:, :, 1] =
 1  2  3

[:, :, 2] =
 4  5  6
```


**Examples for construction of the arguments**

```
[a b c ; d e f ;;;
 g h i ; j k l ;;;
 m n o ; p q r ;;;
 s t u ; v w x]
⇒ dims = (2, 3, 4)

[a b ; c ;;; d ;;;;]
 ___   _     _
 2     1     1 = elements in each row (2, 1, 1)
 _______     _
 3           1 = elements in each column (3, 1)
 _____________
 4             = elements in each 3d slice (4,)
 _____________
 4             = elements in each 4d slice (4,)
⇒ shape = ((2, 1, 1), (3, 1), (4,), (4,)) with `row_first` = true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L2297-L2381)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.stack' href='#Base.stack'>#</a>&nbsp;<b><u>Base.stack</u></b> &mdash; <i>Function</i>.




```julia
stack(iter; [dims])
```


Combine a collection of arrays (or other iterable objects) of equal size into one larger array, by arranging them along one or more new dimensions.

By default the axes of the elements are placed first, giving `size(result) = (size(first(iter))..., size(iter)...)`. This has the same order of elements as [`Iterators.flatten`](/base/iterators#Base.Iterators.flatten)`(iter)`.

With keyword `dims::Integer`, instead the `i`th element of `iter` becomes the slice [`selectdim`](/base/arrays#Base.selectdim)`(result, dims, i)`, so that `size(result, dims) == length(iter)`. In this case `stack` reverses the action of [`eachslice`](/base/arrays#Base.eachslice) with the same `dims`.

The various [`cat`](/base/arrays#Base.cat) functions also combine arrays. However, these all extend the arrays&#39; existing (possibly trivial) dimensions, rather than placing the arrays along new dimensions. They also accept arrays as separate arguments, rather than a single collection.

::: tip Julia 1.9

This function requires at least Julia 1.9.

:::

**Examples**

```julia
julia> vecs = (1:2, [30, 40], Float32[500, 600]);

julia> mat = stack(vecs)
2×3 Matrix{Float32}:
 1.0  30.0  500.0
 2.0  40.0  600.0

julia> mat == hcat(vecs...) == reduce(hcat, collect(vecs))
true

julia> vec(mat) == vcat(vecs...) == reduce(vcat, collect(vecs))
true

julia> stack(zip(1:4, 10:99))  # accepts any iterators of iterators
2×4 Matrix{Int64}:
  1   2   3   4
 10  11  12  13

julia> vec(ans) == collect(Iterators.flatten(zip(1:4, 10:99)))
true

julia> stack(vecs; dims=1)  # unlike any cat function, 1st axis of vecs[1] is 2nd axis of result
3×2 Matrix{Float32}:
   1.0    2.0
  30.0   40.0
 500.0  600.0

julia> x = rand(3,4);

julia> x == stack(eachcol(x)) == stack(eachrow(x), dims=1)  # inverse of eachslice
true
```


Higher-dimensional examples:

```julia
julia> A = rand(5, 7, 11);

julia> E = eachslice(A, dims=2);  # a vector of matrices

julia> (element = size(first(E)), container = size(E))
(element = (5, 11), container = (7,))

julia> stack(E) |> size
(5, 11, 7)

julia> stack(E) == stack(E; dims=3) == cat(E...; dims=3)
true

julia> A == stack(E; dims=2)
true

julia> M = (fill(10i+j, 2, 3) for i in 1:5, j in 1:7);

julia> (element = size(first(M)), container = size(M))
(element = (2, 3), container = (5, 7))

julia> stack(M) |> size  # keeps all dimensions
(2, 3, 5, 7)

julia> stack(M; dims=1) |> size  # vec(container) along dims=1
(35, 2, 3)

julia> hvcat(5, M...) |> size  # hvcat puts matrices next to each other
(14, 15)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L2790-L2880)



```julia
stack(f, args...; [dims])
```


Apply a function to each element of a collection, and `stack` the result. Or to several collections, [`zip`](/base/iterators#Base.Iterators.zip)ped together.

The function should return arrays (or tuples, or other iterators) all of the same size. These become slices of the result, each separated along `dims` (if given) or by default along the last dimensions.

See also [`mapslices`](/base/arrays#Base.mapslices), [`eachcol`](/base/arrays#Base.eachcol).

**Examples**

```julia
julia> stack(c -> (c, c-32), "julia")
2×5 Matrix{Char}:
 'j'  'u'  'l'  'i'  'a'
 'J'  'U'  'L'  'I'  'A'

julia> stack(eachrow([1 2 3; 4 5 6]), (10, 100); dims=1) do row, n
         vcat(row, row .* n, row ./ n)
       end
2×9 Matrix{Float64}:
 1.0  2.0  3.0   10.0   20.0   30.0  0.1   0.2   0.3
 4.0  5.0  6.0  400.0  500.0  600.0  0.04  0.05  0.06
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L2883-L2909)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.vect' href='#Base.vect'>#</a>&nbsp;<b><u>Base.vect</u></b> &mdash; <i>Function</i>.




```julia
vect(X...)
```


Create a [`Vector`](/base/arrays#Base.Vector) with element type computed from the `promote_typeof` of the argument, containing the argument list.

**Examples**

```julia
julia> a = Base.vect(UInt8(1), 2.5, 1//2)
3-element Vector{Float64}:
 1.0
 2.5
 0.5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L168-L182)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.circshift' href='#Base.circshift'>#</a>&nbsp;<b><u>Base.circshift</u></b> &mdash; <i>Function</i>.




```julia
circshift(A, shifts)
```


Circularly shift, i.e. rotate, the data in `A`. The second argument is a tuple or vector giving the amount to shift in each dimension, or an integer to shift only in the first dimension.

The generated code is most efficient when the shift amounts are known at compile-time, i.e., compile-time constants.

See also: [`circshift!`](/base/arrays#Base.circshift!), [`circcopy!`](/base/arrays#Base.circcopy!), [`bitrotate`](/base/math#Base.bitrotate), [`<<`](/base/math#Base.:<<).

**Examples**

```julia
julia> b = reshape(Vector(1:16), (4,4))
4×4 Matrix{Int64}:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> circshift(b, (0,2))
4×4 Matrix{Int64}:
  9  13  1  5
 10  14  2  6
 11  15  3  7
 12  16  4  8

julia> circshift(b, (-1,0))
4×4 Matrix{Int64}:
 2  6  10  14
 3  7  11  15
 4  8  12  16
 1  5   9  13

julia> a = BitArray([true, true, false, false, true])
5-element BitVector:
 1
 1
 0
 0
 1

julia> circshift(a, 1)
5-element BitVector:
 1
 1
 1
 0
 0

julia> circshift(a, -1)
5-element BitVector:
 1
 0
 0
 1
 1

julia> x = (1, 2, 3, 4, 5)
(1, 2, 3, 4, 5)

julia> circshift(x, 4)
(2, 3, 4, 5, 1)

julia> z = (1, 'a', -7.0, 3)
(1, 'a', -7.0, 3)

julia> circshift(z, -1)
('a', -7.0, 3, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarraymath.jl#L265-L336)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.circshift!' href='#Base.circshift!'>#</a>&nbsp;<b><u>Base.circshift!</u></b> &mdash; <i>Function</i>.




```julia
circshift!(dest, src, shifts)
```


Circularly shift, i.e. rotate, the data in `src`, storing the result in `dest`. `shifts` specifies the amount to shift in each dimension.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

See also [`circshift`](/base/arrays#Base.circshift).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/multidimensional.jl#L1198-L1207)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.circcopy!' href='#Base.circcopy!'>#</a>&nbsp;<b><u>Base.circcopy!</u></b> &mdash; <i>Function</i>.




```julia
circcopy!(dest, src)
```


Copy `src` to `dest`, indexing each dimension modulo its length. `src` and `dest` must have the same size, but can be offset in their indices; any offset results in a (circular) wraparound. If the arrays have overlapping indices, then on the domain of the overlap `dest` agrees with `src`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

See also: [`circshift`](/base/arrays#Base.circshift).

**Examples**

```julia
julia> src = reshape(Vector(1:16), (4,4))
4×4 Array{Int64,2}:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> dest = OffsetArray{Int}(undef, (0:3,2:5))

julia> circcopy!(dest, src)
OffsetArrays.OffsetArray{Int64,2,Array{Int64,2}} with indices 0:3×2:5:
 8  12  16  4
 5   9  13  1
 6  10  14  2
 7  11  15  3

julia> dest[1:3,2:4] == src[1:3,2:4]
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/multidimensional.jl#L1253-L1287)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findall-Tuple{Any}' href='#Base.findall-Tuple{Any}'>#</a>&nbsp;<b><u>Base.findall</u></b> &mdash; <i>Method</i>.




```julia
findall(A)
```


Return a vector `I` of the `true` indices or keys of `A`. If there are no such elements of `A`, return an empty array. To search for other kinds of values, pass a predicate as the first argument.

Indices or keys are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

See also: [`findfirst`](/base/arrays#Base.findfirst-Tuple{Any}), [`searchsorted`](/base/sort#Base.Sort.searchsorted).

**Examples**

```julia
julia> A = [true, false, false, true]
4-element Vector{Bool}:
 1
 0
 0
 1

julia> findall(A)
2-element Vector{Int64}:
 1
 4

julia> A = [true false; false true]
2×2 Matrix{Bool}:
 1  0
 0  1

julia> findall(A)
2-element Vector{CartesianIndex{2}}:
 CartesianIndex(1, 1)
 CartesianIndex(2, 2)

julia> findall(falses(3))
Int64[]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2640-L2679)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findall-Tuple{Function, Any}' href='#Base.findall-Tuple{Function, Any}'>#</a>&nbsp;<b><u>Base.findall</u></b> &mdash; <i>Method</i>.




```julia
findall(f::Function, A)
```


Return a vector `I` of the indices or keys of `A` where `f(A[I])` returns `true`. If there are no such elements of `A`, return an empty array.

Indices or keys are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

**Examples**

```julia
julia> x = [1, 3, 4]
3-element Vector{Int64}:
 1
 3
 4

julia> findall(isodd, x)
2-element Vector{Int64}:
 1
 2

julia> A = [1 2 0; 3 4 0]
2×3 Matrix{Int64}:
 1  2  0
 3  4  0
julia> findall(isodd, A)
2-element Vector{CartesianIndex{2}}:
 CartesianIndex(1, 1)
 CartesianIndex(2, 1)

julia> findall(!iszero, A)
4-element Vector{CartesianIndex{2}}:
 CartesianIndex(1, 1)
 CartesianIndex(2, 1)
 CartesianIndex(1, 2)
 CartesianIndex(2, 2)

julia> d = Dict(:A => 10, :B => -1, :C => 0)
Dict{Symbol, Int64} with 3 entries:
  :A => 10
  :B => -1
  :C => 0

julia> findall(≥(0), d)
2-element Vector{Symbol}:
 :A
 :C

```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2580-L2630)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findfirst-Tuple{Any}' href='#Base.findfirst-Tuple{Any}'>#</a>&nbsp;<b><u>Base.findfirst</u></b> &mdash; <i>Method</i>.




```julia
findfirst(A)
```


Return the index or key of the first `true` value in `A`. Return `nothing` if no such value is found. To search for other kinds of values, pass a predicate as the first argument.

Indices or keys are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

See also: [`findall`](/base/arrays#Base.findall-Tuple{Any}), [`findnext`](/base/arrays#Base.findnext-Tuple{Any,%20Integer}), [`findlast`](/base/arrays#Base.findlast-Tuple{Any}), [`searchsortedfirst`](/base/sort#Base.Sort.searchsortedfirst).

**Examples**

```julia
julia> A = [false, false, true, false]
4-element Vector{Bool}:
 0
 0
 1
 0

julia> findfirst(A)
3

julia> findfirst(falses(3)) # returns nothing, but not printed in the REPL

julia> A = [false false; true false]
2×2 Matrix{Bool}:
 0  0
 1  0

julia> findfirst(A)
CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2268-L2302)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findfirst-Tuple{Function, Any}' href='#Base.findfirst-Tuple{Function, Any}'>#</a>&nbsp;<b><u>Base.findfirst</u></b> &mdash; <i>Method</i>.




```julia
findfirst(predicate::Function, A)
```


Return the index or key of the first element of `A` for which `predicate` returns `true`. Return `nothing` if there is no such element.

Indices or keys are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

**Examples**

```julia
julia> A = [1, 4, 2, 2]
4-element Vector{Int64}:
 1
 4
 2
 2

julia> findfirst(iseven, A)
2

julia> findfirst(x -> x>10, A) # returns nothing, but not printed in the REPL

julia> findfirst(isequal(4), A)
2

julia> A = [1 4; 2 2]
2×2 Matrix{Int64}:
 1  4
 2  2

julia> findfirst(iseven, A)
CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2350-L2384)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findlast-Tuple{Any}' href='#Base.findlast-Tuple{Any}'>#</a>&nbsp;<b><u>Base.findlast</u></b> &mdash; <i>Method</i>.




```julia
findlast(A)
```


Return the index or key of the last `true` value in `A`. Return `nothing` if there is no `true` value in `A`.

Indices or keys are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

See also: [`findfirst`](/base/arrays#Base.findfirst-Tuple{Any}), [`findprev`](/base/arrays#Base.findprev-Tuple{Any,%20Integer}), [`findall`](/base/arrays#Base.findall-Tuple{Any}).

**Examples**

```julia
julia> A = [true, false, true, false]
4-element Vector{Bool}:
 1
 0
 1
 0

julia> findlast(A)
3

julia> A = falses(2,2);

julia> findlast(A) # returns nothing, but not printed in the REPL

julia> A = [true false; true false]
2×2 Matrix{Bool}:
 1  0
 1  0

julia> findlast(A)
CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2446-L2481)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findlast-Tuple{Function, Any}' href='#Base.findlast-Tuple{Function, Any}'>#</a>&nbsp;<b><u>Base.findlast</u></b> &mdash; <i>Method</i>.




```julia
findlast(predicate::Function, A)
```


Return the index or key of the last element of `A` for which `predicate` returns `true`. Return `nothing` if there is no such element.

Indices or keys are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

**Examples**

```julia
julia> A = [1, 2, 3, 4]
4-element Vector{Int64}:
 1
 2
 3
 4

julia> findlast(isodd, A)
3

julia> findlast(x -> x > 5, A) # returns nothing, but not printed in the REPL

julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> findlast(isodd, A)
CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2537-L2568)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findnext-Tuple{Any, Integer}' href='#Base.findnext-Tuple{Any, Integer}'>#</a>&nbsp;<b><u>Base.findnext</u></b> &mdash; <i>Method</i>.




```julia
findnext(A, i)
```


Find the next index after or including `i` of a `true` element of `A`, or `nothing` if not found.

Indices are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

**Examples**

```julia
julia> A = [false, false, true, false]
4-element Vector{Bool}:
 0
 0
 1
 0

julia> findnext(A, 1)
3

julia> findnext(A, 4) # returns nothing, but not printed in the REPL

julia> A = [false false; true false]
2×2 Matrix{Bool}:
 0  0
 1  0

julia> findnext(A, CartesianIndex(1, 1))
CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2234-L2265)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findnext-Tuple{Function, Any, Integer}' href='#Base.findnext-Tuple{Function, Any, Integer}'>#</a>&nbsp;<b><u>Base.findnext</u></b> &mdash; <i>Method</i>.




```julia
findnext(predicate::Function, A, i)
```


Find the next index after or including `i` of an element of `A` for which `predicate` returns `true`, or `nothing` if not found. This works for Arrays, Strings, and most other collections that support [`getindex`](/base/collections#Base.getindex), [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}), and [`nextind`](/base/arrays#Base.nextind).

Indices are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

**Examples**

```julia
julia> A = [1, 4, 2, 2];

julia> findnext(isodd, A, 1)
1

julia> findnext(isodd, A, 2) # returns nothing, but not printed in the REPL

julia> A = [1 4; 2 2];

julia> findnext(isodd, A, CartesianIndex(1, 1))
CartesianIndex(1, 1)

julia> findnext(isspace, "a b c", 3)
4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2308-L2336)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findprev-Tuple{Any, Integer}' href='#Base.findprev-Tuple{Any, Integer}'>#</a>&nbsp;<b><u>Base.findprev</u></b> &mdash; <i>Method</i>.




```julia
findprev(A, i)
```


Find the previous index before or including `i` of a `true` element of `A`, or `nothing` if not found.

Indices are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

See also: [`findnext`](/base/arrays#Base.findnext-Tuple{Any,%20Integer}), [`findfirst`](/base/arrays#Base.findfirst-Tuple{Any}), [`findall`](/base/arrays#Base.findall-Tuple{Any}).

**Examples**

```julia
julia> A = [false, false, true, true]
4-element Vector{Bool}:
 0
 0
 1
 1

julia> findprev(A, 3)
3

julia> findprev(A, 1) # returns nothing, but not printed in the REPL

julia> A = [false false; true true]
2×2 Matrix{Bool}:
 0  0
 1  1

julia> findprev(A, CartesianIndex(2, 1))
CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2410-L2443)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findprev-Tuple{Function, Any, Integer}' href='#Base.findprev-Tuple{Function, Any, Integer}'>#</a>&nbsp;<b><u>Base.findprev</u></b> &mdash; <i>Method</i>.




```julia
findprev(predicate::Function, A, i)
```


Find the previous index before or including `i` of an element of `A` for which `predicate` returns `true`, or `nothing` if not found. This works for Arrays, Strings, and most other collections that support [`getindex`](/base/collections#Base.getindex), [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}), and [`nextind`](/base/arrays#Base.nextind).

Indices are of the same type as those returned by [`keys(A)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(A)`](/base/collections#Base.pairs).

**Examples**

```julia
julia> A = [4, 6, 1, 2]
4-element Vector{Int64}:
 4
 6
 1
 2

julia> findprev(isodd, A, 1) # returns nothing, but not printed in the REPL

julia> findprev(isodd, A, 3)
3

julia> A = [4 6; 1 2]
2×2 Matrix{Int64}:
 4  6
 1  2

julia> findprev(isodd, A, CartesianIndex(1, 2))
CartesianIndex(2, 1)

julia> findprev(isspace, "a b c", 3)
2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2487-L2523)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.permutedims' href='#Base.permutedims'>#</a>&nbsp;<b><u>Base.permutedims</u></b> &mdash; <i>Function</i>.




```julia
permutedims(A::AbstractArray, perm)
permutedims(A::AbstractMatrix)
```


Permute the dimensions (axes) of array `A`. `perm` is a tuple or vector of `ndims(A)` integers specifying the permutation.

If `A` is a 2d array ([`AbstractMatrix`](/base/arrays#Base.AbstractMatrix)), then `perm` defaults to `(2,1)`, swapping the two axes of `A` (the rows and columns of the matrix).   This differs from [`transpose`](/stdlib/LinearAlgebra#Base.transpose) in that the operation is not recursive, which is especially useful for arrays of non-numeric values (where the recursive `transpose` would throw an error) and/or 2d arrays that do not represent linear operators.

For 1d arrays, see [`permutedims(v::AbstractVector)`](/base/arrays#Base.permutedims), which returns a 1-row “matrix”.

See also [`permutedims!`](/base/arrays#Base.permutedims!), [`PermutedDimsArray`](/base/arrays#Base.PermutedDimsArrays.PermutedDimsArray), [`transpose`](/stdlib/LinearAlgebra#Base.transpose), [`invperm`](/base/arrays#Base.invperm).

**Examples**

**2d arrays:**

Unlike `transpose`, `permutedims` can be used to swap rows and columns of 2d arrays of arbitrary non-numeric elements, such as strings:

```julia
julia> A = ["a" "b" "c"
            "d" "e" "f"]
2×3 Matrix{String}:
 "a"  "b"  "c"
 "d"  "e"  "f"

julia> permutedims(A)
3×2 Matrix{String}:
 "a"  "d"
 "b"  "e"
 "c"  "f"
```


And `permutedims` produces results that differ from `transpose` for matrices whose elements are themselves numeric matrices:

```julia
julia> a = [1 2; 3 4];

julia> b = [5 6; 7 8];

julia> c = [9 10; 11 12];

julia> d = [13 14; 15 16];

julia> X = [[a] [b]; [c] [d]]
2×2 Matrix{Matrix{Int64}}:
 [1 2; 3 4]     [5 6; 7 8]
 [9 10; 11 12]  [13 14; 15 16]

julia> permutedims(X)
2×2 Matrix{Matrix{Int64}}:
 [1 2; 3 4]  [9 10; 11 12]
 [5 6; 7 8]  [13 14; 15 16]

julia> transpose(X)
2×2 transpose(::Matrix{Matrix{Int64}}) with eltype Transpose{Int64, Matrix{Int64}}:
 [1 3; 2 4]  [9 11; 10 12]
 [5 7; 6 8]  [13 15; 14 16]
```


**Multi-dimensional arrays**

```julia
julia> A = reshape(Vector(1:8), (2,2,2))
2×2×2 Array{Int64, 3}:
[:, :, 1] =
 1  3
 2  4

[:, :, 2] =
 5  7
 6  8

julia> perm = (3, 1, 2); # put the last dimension first

julia> B = permutedims(A, perm)
2×2×2 Array{Int64, 3}:
[:, :, 1] =
 1  2
 5  6

[:, :, 2] =
 3  4
 7  8

julia> A == permutedims(B, invperm(perm)) # the inverse permutation
true
```


For each dimension `i` of `B = permutedims(A, perm)`, its corresponding dimension of `A` will be `perm[i]`. This means the equality `size(B, i) == size(A, perm[i])` holds.

```julia
julia> A = randn(5, 7, 11, 13);

julia> perm = [4, 1, 3, 2];

julia> B = permutedims(A, perm);

julia> size(B)
(13, 5, 11, 7)

julia> size(A)[perm] == ans
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/permuteddimsarray.jl#L88-L195)



```julia
permutedims(v::AbstractVector)
```


Reshape vector `v` into a `1 × length(v)` row matrix. Differs from [`transpose`](/stdlib/LinearAlgebra#Base.transpose) in that the operation is not recursive, which is especially useful for arrays of non-numeric values (where the recursive `transpose` might throw an error).

**Examples**

Unlike `transpose`, `permutedims` can be used on vectors of arbitrary non-numeric elements, such as strings:

```julia
julia> permutedims(["a", "b", "c"])
1×3 Matrix{String}:
 "a"  "b"  "c"
```


For vectors of numbers, `permutedims(v)` works much like `transpose(v)` except that the return type differs (it uses [`reshape`](/base/arrays#Base.reshape) rather than a `LinearAlgebra.Transpose` view, though both share memory with the original array `v`):

```julia
julia> v = [1, 2, 3, 4]
4-element Vector{Int64}:
 1
 2
 3
 4

julia> p = permutedims(v)
1×4 Matrix{Int64}:
 1  2  3  4

julia> r = transpose(v)
1×4 transpose(::Vector{Int64}) with eltype Int64:
 1  2  3  4

julia> p == r
true

julia> typeof(r)
Transpose{Int64, Vector{Int64}}

julia> p[1] = 5; r[2] = 6; # mutating p or r also changes v

julia> v # shares memory with both p and r
4-element Vector{Int64}:
 5
 6
 3
 4
```


However, `permutedims` produces results that differ from `transpose` for vectors whose elements are themselves numeric matrices:

```julia
julia> V = [[[1 2; 3 4]]; [[5 6; 7 8]]]
2-element Vector{Matrix{Int64}}:
 [1 2; 3 4]
 [5 6; 7 8]

julia> permutedims(V)
1×2 Matrix{Matrix{Int64}}:
 [1 2; 3 4]  [5 6; 7 8]

julia> transpose(V)
1×2 transpose(::Vector{Matrix{Int64}}) with eltype Transpose{Int64, Matrix{Int64}}:
 [1 3; 2 4]  [5 7; 6 8]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/permuteddimsarray.jl#L203-L270)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.permutedims!' href='#Base.permutedims!'>#</a>&nbsp;<b><u>Base.permutedims!</u></b> &mdash; <i>Function</i>.




```julia
permutedims!(dest, src, perm)
```


Permute the dimensions of array `src` and store the result in the array `dest`. `perm` is a vector specifying a permutation of length `ndims(src)`. The preallocated array `dest` should have `size(dest) == size(src)[perm]` and is completely overwritten. No in-place permutation is supported and unexpected results will happen if `src` and `dest` have overlapping memory regions.

See also [`permutedims`](/base/arrays#Base.permutedims).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/permuteddimsarray.jl#L273-L283)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.PermutedDimsArrays.PermutedDimsArray' href='#Base.PermutedDimsArrays.PermutedDimsArray'>#</a>&nbsp;<b><u>Base.PermutedDimsArrays.PermutedDimsArray</u></b> &mdash; <i>Type</i>.




```julia
PermutedDimsArray(A, perm) -> B
```


Given an AbstractArray `A`, create a view `B` such that the dimensions appear to be permuted. Similar to `permutedims`, except that no copying occurs (`B` shares storage with `A`).

See also [`permutedims`](/base/arrays#Base.permutedims), [`invperm`](/base/arrays#Base.invperm).

**Examples**

```julia
julia> A = rand(3,5,4);

julia> B = PermutedDimsArray(A, (3,1,2));

julia> size(B)
(4, 3, 5)

julia> B[3,1,2] == A[1,2,3]
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/permuteddimsarray.jl#L20-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.promote_shape' href='#Base.promote_shape'>#</a>&nbsp;<b><u>Base.promote_shape</u></b> &mdash; <i>Function</i>.




```julia
promote_shape(s1, s2)
```


Check two array shapes for compatibility, allowing trailing singleton dimensions, and return whichever shape has more dimensions.

**Examples**

```julia
julia> a = fill(1, (3,4,1,1,1));

julia> b = fill(1, (3,4));

julia> promote_shape(a,b)
(Base.OneTo(3), Base.OneTo(4), Base.OneTo(1), Base.OneTo(1), Base.OneTo(1))

julia> promote_shape((2,3,1,4), (2, 3, 1, 4, 1))
(2, 3, 1, 4, 1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/indices.jl#L155-L173)

</div>
<br>

## Array functions {#Array-functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.accumulate' href='#Base.accumulate'>#</a>&nbsp;<b><u>Base.accumulate</u></b> &mdash; <i>Function</i>.




```julia
accumulate(op, A; dims::Integer, [init])
```


Cumulative operation `op` along the dimension `dims` of `A` (providing `dims` is optional for vectors). An initial value `init` may optionally be provided by a keyword argument. See also [`accumulate!`](/base/arrays#Base.accumulate!) to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow).

For common operations there are specialized variants of `accumulate`, see [`cumsum`](/base/arrays#Base.cumsum), [`cumprod`](/base/arrays#Base.cumprod). For a lazy version, see [`Iterators.accumulate`](/base/iterators#Base.Iterators.accumulate).

::: tip Julia 1.5

`accumulate` on a non-array iterator requires at least Julia 1.5.

:::

**Examples**

```julia
julia> accumulate(+, [1,2,3])
3-element Vector{Int64}:
 1
 3
 6

julia> accumulate(min, (1, -2, 3, -4, 5), init=0)
(0, -2, -2, -4, -4)

julia> accumulate(/, (2, 4, Inf), init=100)
(50.0, 12.5, 0.0)

julia> accumulate(=>, i^2 for i in 1:3)
3-element Vector{Any}:
          1
        1 => 4
 (1 => 4) => 9

julia> accumulate(+, fill(1, 3, 4))
3×4 Matrix{Int64}:
 1  4  7  10
 2  5  8  11
 3  6  9  12

julia> accumulate(+, fill(1, 2, 5), dims=2, init=100.0)
2×5 Matrix{Float64}:
 101.0  102.0  103.0  104.0  105.0
 101.0  102.0  103.0  104.0  105.0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L231-L277)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.accumulate!' href='#Base.accumulate!'>#</a>&nbsp;<b><u>Base.accumulate!</u></b> &mdash; <i>Function</i>.




```julia
accumulate!(op, B, A; [dims], [init])
```


Cumulative operation `op` on `A` along the dimension `dims`, storing the result in `B`. Providing `dims` is optional for vectors.  If the keyword argument `init` is given, its value is used to instantiate the accumulation.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

See also [`accumulate`](/base/arrays#Base.accumulate), [`cumsum!`](/base/arrays#Base.cumsum!), [`cumprod!`](/base/arrays#Base.cumprod!).

**Examples**

```julia
julia> x = [1, 0, 2, 0, 3];

julia> y = rand(5);

julia> accumulate!(+, y, x);

julia> y
5-element Vector{Float64}:
 1.0
 1.0
 3.0
 3.0
 6.0

julia> A = [1 2 3; 4 5 6];

julia> B = similar(A);

julia> accumulate!(-, B, A, dims=1)
2×3 Matrix{Int64}:
  1   2   3
 -3  -3  -3

julia> accumulate!(*, B, A, dims=2, init=10)
2×3 Matrix{Int64}:
 10   20    60
 40  200  1200
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L302-L343)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cumprod' href='#Base.cumprod'>#</a>&nbsp;<b><u>Base.cumprod</u></b> &mdash; <i>Function</i>.




```julia
cumprod(A; dims::Integer)
```


Cumulative product along the dimension `dim`. See also [`cumprod!`](/base/arrays#Base.cumprod!) to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow).

**Examples**

```julia
julia> a = Int8[1 2 3; 4 5 6];

julia> cumprod(a, dims=1)
2×3 Matrix{Int64}:
 1   2   3
 4  10  18

julia> cumprod(a, dims=2)
2×3 Matrix{Int64}:
 1   2    6
 4  20  120
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L171-L192)



```julia
cumprod(itr)
```


Cumulative product of an iterator.

See also [`cumprod!`](/base/arrays#Base.cumprod!), [`accumulate`](/base/arrays#Base.accumulate), [`cumsum`](/base/arrays#Base.cumsum).

::: tip Julia 1.5

`cumprod` on a non-array iterator requires at least Julia 1.5.

:::

**Examples**

```julia
julia> cumprod(fill(1//2, 3))
3-element Vector{Rational{Int64}}:
 1//2
 1//4
 1//8

julia> cumprod((1, 2, 1, 3, 1))
(1, 2, 2, 6, 6)

julia> cumprod("julia")
5-element Vector{String}:
 "j"
 "ju"
 "jul"
 "juli"
 "julia"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L197-L226)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cumprod!' href='#Base.cumprod!'>#</a>&nbsp;<b><u>Base.cumprod!</u></b> &mdash; <i>Function</i>.




```julia
cumprod!(B, A; dims::Integer)
```


Cumulative product of `A` along the dimension `dims`, storing the result in `B`. See also [`cumprod`](/base/arrays#Base.cumprod).

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L150-L157)



```julia
cumprod!(y::AbstractVector, x::AbstractVector)
```


Cumulative product of a vector `x`, storing the result in `y`. See also [`cumprod`](/base/arrays#Base.cumprod).

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L161-L168)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cumsum' href='#Base.cumsum'>#</a>&nbsp;<b><u>Base.cumsum</u></b> &mdash; <i>Function</i>.




```julia
cumsum(A; dims::Integer)
```


Cumulative sum along the dimension `dims`. See also [`cumsum!`](/base/arrays#Base.cumsum!) to use a preallocated output array, both for performance and to control the precision of the output (e.g. to avoid overflow).

**Examples**

```julia
julia> a = [1 2 3; 4 5 6]
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> cumsum(a, dims=1)
2×3 Matrix{Int64}:
 1  2  3
 5  7  9

julia> cumsum(a, dims=2)
2×3 Matrix{Int64}:
 1  3   6
 4  9  15
```


::: tip Note

The return array&#39;s `eltype` is `Int` for signed integers of less than system word size  and `UInt` for unsigned integers of less than system word size. To preserve `eltype` of arrays with small signed or unsigned integer `accumulate(+, A)` should be used.

```julia
julia> cumsum(Int8[100, 28])
2-element Vector{Int64}:
 100
 128

julia> accumulate(+,Int8[100, 28])
2-element Vector{Int8}:
  100
 -128
```


In the former case, the integers are widened to system word size and therefore the result is `Int64[100, 128]`. In the latter case, no such widening happens and integer overflow results in `Int8[100, -128]`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L66-L112)



```julia
cumsum(itr)
```


Cumulative sum of an iterator.

See also [`accumulate`](/base/arrays#Base.accumulate) to apply functions other than `+`.

::: tip Julia 1.5

`cumsum` on a non-array iterator requires at least Julia 1.5.

:::

**Examples**

```julia
julia> cumsum(1:3)
3-element Vector{Int64}:
 1
 3
 6

julia> cumsum((true, false, true, false, true))
(1, 1, 2, 2, 3)

julia> cumsum(fill(1, 2) for i in 1:3)
3-element Vector{Vector{Int64}}:
 [1, 1]
 [2, 2]
 [3, 3]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L118-L145)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cumsum!' href='#Base.cumsum!'>#</a>&nbsp;<b><u>Base.cumsum!</u></b> &mdash; <i>Function</i>.




```julia
cumsum!(B, A; dims::Integer)
```


Cumulative sum of `A` along the dimension `dims`, storing the result in `B`. See also [`cumsum`](/base/arrays#Base.cumsum).

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/accumulate.jl#L41-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.diff' href='#Base.diff'>#</a>&nbsp;<b><u>Base.diff</u></b> &mdash; <i>Function</i>.




```julia
diff(A::AbstractVector)
diff(A::AbstractArray; dims::Integer)
```


Finite difference operator on a vector or a multidimensional array `A`. In the latter case the dimension to operate on needs to be specified with the `dims` keyword argument.

::: tip Julia 1.1

`diff` for arrays with dimension higher than 2 requires at least Julia 1.1.

:::

**Examples**

```julia
julia> a = [2 4; 6 16]
2×2 Matrix{Int64}:
 2   4
 6  16

julia> diff(a, dims=2)
2×1 Matrix{Int64}:
  2
 10

julia> diff(vec(a))
3-element Vector{Int64}:
  4
 -2
 12
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/multidimensional.jl#L1003-L1032)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.repeat' href='#Base.repeat'>#</a>&nbsp;<b><u>Base.repeat</u></b> &mdash; <i>Function</i>.




```julia
repeat(A::AbstractArray, counts::Integer...)
```


Construct an array by repeating array `A` a given number of times in each dimension, specified by `counts`.

See also: [`fill`](/base/arrays#Base.fill), [`Iterators.repeated`](/base/iterators#Base.Iterators.repeated), [`Iterators.cycle`](/base/iterators#Base.Iterators.cycle).

**Examples**

```julia
julia> repeat([1, 2, 3], 2)
6-element Vector{Int64}:
 1
 2
 3
 1
 2
 3

julia> repeat([1, 2, 3], 2, 3)
6×3 Matrix{Int64}:
 1  1  1
 2  2  2
 3  3  3
 1  1  1
 2  2  2
 3  3  3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarraymath.jl#L343-L370)



```julia
repeat(A::AbstractArray; inner=ntuple(Returns(1), ndims(A)), outer=ntuple(Returns(1), ndims(A)))
```


Construct an array by repeating the entries of `A`. The i-th element of `inner` specifies the number of times that the individual entries of the i-th dimension of `A` should be repeated. The i-th element of `outer` specifies the number of times that a slice along the i-th dimension of `A` should be repeated. If `inner` or `outer` are omitted, no repetition is performed.

**Examples**

```julia
julia> repeat(1:2, inner=2)
4-element Vector{Int64}:
 1
 1
 2
 2

julia> repeat(1:2, outer=2)
4-element Vector{Int64}:
 1
 2
 1
 2

julia> repeat([1 2; 3 4], inner=(2, 1), outer=(1, 3))
4×6 Matrix{Int64}:
 1  2  1  2  1  2
 1  2  1  2  1  2
 3  4  3  4  3  4
 3  4  3  4  3  4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarraymath.jl#L375-L407)



```julia
repeat(s::AbstractString, r::Integer)
```


Repeat a string `r` times. This can be written as `s^r`.

See also [`^`](/base/strings#Base.:^-Tuple{Union{AbstractChar,%20AbstractString},%20Integer}).

**Examples**

```julia
julia> repeat("ha", 3)
"hahaha"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/strings/basic.jl#L751-L763)



```julia
repeat(c::AbstractChar, r::Integer) -> String
```


Repeat a character `r` times. This can equivalently be accomplished by calling [`c^r`](/base/strings#Base.:^-Tuple{Union{AbstractChar,%20AbstractString},%20Integer}).

**Examples**

```julia
julia> repeat('A', 3)
"AAA"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/strings/string.jl#L563-L574)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rot180' href='#Base.rot180'>#</a>&nbsp;<b><u>Base.rot180</u></b> &mdash; <i>Function</i>.




```julia
rot180(A)
```


Rotate matrix `A` 180 degrees.

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> rot180(a)
2×2 Matrix{Int64}:
 4  3
 2  1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L158-L175)



```julia
rot180(A, k)
```


Rotate matrix `A` 180 degrees an integer `k` number of times. If `k` is even, this is equivalent to a `copy`.

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> rot180(a,1)
2×2 Matrix{Int64}:
 4  3
 2  1

julia> rot180(a,2)
2×2 Matrix{Int64}:
 1  2
 3  4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L260-L283)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rotl90' href='#Base.rotl90'>#</a>&nbsp;<b><u>Base.rotl90</u></b> &mdash; <i>Function</i>.




```julia
rotl90(A)
```


Rotate matrix `A` left 90 degrees.

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> rotl90(a)
2×2 Matrix{Int64}:
 2  4
 1  3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L103-L120)



```julia
rotl90(A, k)
```


Left-rotate matrix `A` 90 degrees counterclockwise an integer `k` number of times. If `k` is a multiple of four (including zero), this is equivalent to a `copy`.

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> rotl90(a,1)
2×2 Matrix{Int64}:
 2  4
 1  3

julia> rotl90(a,2)
2×2 Matrix{Int64}:
 4  3
 2  1

julia> rotl90(a,3)
2×2 Matrix{Int64}:
 3  1
 4  2

julia> rotl90(a,4)
2×2 Matrix{Int64}:
 1  2
 3  4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L185-L218)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rotr90' href='#Base.rotr90'>#</a>&nbsp;<b><u>Base.rotr90</u></b> &mdash; <i>Function</i>.




```julia
rotr90(A)
```


Rotate matrix `A` right 90 degrees.

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> rotr90(a)
2×2 Matrix{Int64}:
 3  1
 4  2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L131-L148)



```julia
rotr90(A, k)
```


Right-rotate matrix `A` 90 degrees clockwise an integer `k` number of times. If `k` is a multiple of four (including zero), this is equivalent to a `copy`.

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> rotr90(a,1)
2×2 Matrix{Int64}:
 3  1
 4  2

julia> rotr90(a,2)
2×2 Matrix{Int64}:
 4  3
 2  1

julia> rotr90(a,3)
2×2 Matrix{Int64}:
 2  4
 1  3

julia> rotr90(a,4)
2×2 Matrix{Int64}:
 1  2
 3  4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L225-L258)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mapslices' href='#Base.mapslices'>#</a>&nbsp;<b><u>Base.mapslices</u></b> &mdash; <i>Function</i>.




```julia
mapslices(f, A; dims)
```


Transform the given dimensions of array `A` by applying a function `f` on each slice of the form `A[..., :, ..., :, ...]`, with a colon at each `d` in `dims`. The results are concatenated along the remaining dimensions.

For example, if `dims = [1,2]` and `A` is 4-dimensional, then `f` is called on `x = A[:,:,i,j]` for all `i` and `j`, and `f(x)` becomes `R[:,:,i,j]` in the result `R`.

See also [`eachcol`](/base/arrays#Base.eachcol) or [`eachslice`](/base/arrays#Base.eachslice), used with [`map`](/base/collections#Base.map) or [`stack`](/base/arrays#Base.stack).

**Examples**

```julia
julia> A = reshape(1:30,(2,5,3))
2×5×3 reshape(::UnitRange{Int64}, 2, 5, 3) with eltype Int64:
[:, :, 1] =
 1  3  5  7   9
 2  4  6  8  10

[:, :, 2] =
 11  13  15  17  19
 12  14  16  18  20

[:, :, 3] =
 21  23  25  27  29
 22  24  26  28  30

julia> f(x::Matrix) = fill(x[1,1], 1,4);  # returns a 1×4 matrix

julia> B = mapslices(f, A, dims=(1,2))
1×4×3 Array{Int64, 3}:
[:, :, 1] =
 1  1  1  1

[:, :, 2] =
 11  11  11  11

[:, :, 3] =
 21  21  21  21

julia> f2(x::AbstractMatrix) = fill(x[1,1], 1,4);

julia> B == stack(f2, eachslice(A, dims=3))
true

julia> g(x) = x[begin] // x[end-1];  # returns a number

julia> mapslices(g, A, dims=[1,3])
1×5×1 Array{Rational{Int64}, 3}:
[:, :, 1] =
 1//21  3//23  1//5  7//27  9//29

julia> map(g, eachslice(A, dims=2))
5-element Vector{Rational{Int64}}:
 1//21
 3//23
 1//5
 7//27
 9//29

julia> mapslices(sum, A; dims=(1,3)) == sum(A; dims=(1,3))
true
```


Notice that in `eachslice(A; dims=2)`, the specified dimension is the one _without_ a colon in the slice. This is `view(A,:,i,:)`, whereas `mapslices(f, A; dims=(1,3))` uses `A[:,i,:]`. The function `f` may mutate values in the slice without affecting `A`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractarray.jl#L3218-L3287)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachrow' href='#Base.eachrow'>#</a>&nbsp;<b><u>Base.eachrow</u></b> &mdash; <i>Function</i>.




```julia
eachrow(A::AbstractVecOrMat) <: AbstractVector
```


Create a [`RowSlices`](/base/arrays#Base.RowSlices) object that is a vector of rows of matrix or vector `A`. Row slices are returned as `AbstractVector` views of `A`.

For the inverse, see [`stack`](/base/arrays#Base.stack)`(rows; dims=1)`.

See also [`eachcol`](/base/arrays#Base.eachcol), [`eachslice`](/base/arrays#Base.eachslice) and [`mapslices`](/base/arrays#Base.mapslices).

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

::: tip Julia 1.9

Prior to Julia 1.9, this returned an iterator.

:::

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> s = eachrow(a)
2-element RowSlices{Matrix{Int64}, Tuple{Base.OneTo{Int64}}, SubArray{Int64, 1, Matrix{Int64}, Tuple{Int64, Base.Slice{Base.OneTo{Int64}}}, true}}:
 [1, 2]
 [3, 4]

julia> s[1]
2-element view(::Matrix{Int64}, 1, :) with eltype Int64:
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/slicearray.jl#L131-L165)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachcol' href='#Base.eachcol'>#</a>&nbsp;<b><u>Base.eachcol</u></b> &mdash; <i>Function</i>.




```julia
eachcol(A::AbstractVecOrMat) <: AbstractVector
```


Create a [`ColumnSlices`](/base/arrays#Base.ColumnSlices) object that is a vector of columns of matrix or vector `A`. Column slices are returned as `AbstractVector` views of `A`.

For the inverse, see [`stack`](/base/arrays#Base.stack)`(cols)` or `reduce(`[`hcat`](/base/arrays#Base.hcat)`, cols)`.

See also [`eachrow`](/base/arrays#Base.eachrow), [`eachslice`](/base/arrays#Base.eachslice) and [`mapslices`](/base/arrays#Base.mapslices).

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

::: tip Julia 1.9

Prior to Julia 1.9, this returned an iterator.

:::

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> s = eachcol(a)
2-element ColumnSlices{Matrix{Int64}, Tuple{Base.OneTo{Int64}}, SubArray{Int64, 1, Matrix{Int64}, Tuple{Base.Slice{Base.OneTo{Int64}}, Int64}, true}}:
 [1, 3]
 [2, 4]

julia> s[1]
2-element view(::Matrix{Int64}, :, 1) with eltype Int64:
 1
 3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/slicearray.jl#L169-L203)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachslice' href='#Base.eachslice'>#</a>&nbsp;<b><u>Base.eachslice</u></b> &mdash; <i>Function</i>.




```julia
eachslice(A::AbstractArray; dims, drop=true)
```


Create a [`Slices`](/base/arrays#Base.Slices) object that is an array of slices over dimensions `dims` of `A`, returning views that select all the data from the other dimensions in `A`. `dims` can either be an integer or a tuple of integers.

If `drop = true` (the default), the outer `Slices` will drop the inner dimensions, and the ordering of the dimensions will match those in `dims`. If `drop = false`, then the `Slices` will have the same dimensionality as the underlying array, with inner dimensions having size 1.

See [`stack`](/base/arrays#Base.stack)`(slices; dims)` for the inverse of `eachslice(A; dims::Integer)`.

See also [`eachrow`](/base/arrays#Base.eachrow), [`eachcol`](/base/arrays#Base.eachcol), [`mapslices`](/base/arrays#Base.mapslices) and [`selectdim`](/base/arrays#Base.selectdim).

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

::: tip Julia 1.9

Prior to Julia 1.9, this returned an iterator, and only a single dimension `dims` was supported.

:::

**Examples**

```julia
julia> m = [1 2 3; 4 5 6; 7 8 9]
3×3 Matrix{Int64}:
 1  2  3
 4  5  6
 7  8  9

julia> s = eachslice(m, dims=1)
3-element RowSlices{Matrix{Int64}, Tuple{Base.OneTo{Int64}}, SubArray{Int64, 1, Matrix{Int64}, Tuple{Int64, Base.Slice{Base.OneTo{Int64}}}, true}}:
 [1, 2, 3]
 [4, 5, 6]
 [7, 8, 9]

julia> s[1]
3-element view(::Matrix{Int64}, 1, :) with eltype Int64:
 1
 2
 3

julia> eachslice(m, dims=1, drop=false)
3×1 Slices{Matrix{Int64}, Tuple{Int64, Colon}, Tuple{Base.OneTo{Int64}, Base.OneTo{Int64}}, SubArray{Int64, 1, Matrix{Int64}, Tuple{Int64, Base.Slice{Base.OneTo{Int64}}}, true}, 2}:
 [1, 2, 3]
 [4, 5, 6]
 [7, 8, 9]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/slicearray.jl#L77-L126)

</div>
<br>

## Combinatorics
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.invperm' href='#Base.invperm'>#</a>&nbsp;<b><u>Base.invperm</u></b> &mdash; <i>Function</i>.




```julia
invperm(v)
```


Return the inverse permutation of `v`. If `B = A[v]`, then `A == B[invperm(v)]`.

See also [`sortperm`](/base/sort#Base.sortperm), [`invpermute!`](/base/arrays#Base.invpermute!), [`isperm`](/base/arrays#Base.isperm), [`permutedims`](/base/arrays#Base.permutedims).

**Examples**

```julia
julia> p = (2, 3, 1);

julia> invperm(p)
(3, 1, 2)

julia> v = [2; 4; 3; 1];

julia> invperm(v)
4-element Vector{Int64}:
 4
 1
 3
 2

julia> A = ['a','b','c','d'];

julia> B = A[v]
4-element Vector{Char}:
 'b': ASCII/Unicode U+0062 (category Ll: Letter, lowercase)
 'd': ASCII/Unicode U+0064 (category Ll: Letter, lowercase)
 'c': ASCII/Unicode U+0063 (category Ll: Letter, lowercase)
 'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)

julia> B[invperm(v)]
4-element Vector{Char}:
 'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)
 'b': ASCII/Unicode U+0062 (category Ll: Letter, lowercase)
 'c': ASCII/Unicode U+0063 (category Ll: Letter, lowercase)
 'd': ASCII/Unicode U+0064 (category Ll: Letter, lowercase)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/combinatorics.jl#L246-L286)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isperm' href='#Base.isperm'>#</a>&nbsp;<b><u>Base.isperm</u></b> &mdash; <i>Function</i>.




```julia
isperm(v) -> Bool
```


Return `true` if `v` is a valid permutation.

**Examples**

```julia
julia> isperm([1; 2])
true

julia> isperm([1; 3])
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/combinatorics.jl#L62-L75)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.permute!-Tuple{Any, AbstractVector}' href='#Base.permute!-Tuple{Any, AbstractVector}'>#</a>&nbsp;<b><u>Base.permute!</u></b> &mdash; <i>Method</i>.




```julia
permute!(v, p)
```


Permute vector `v` in-place, according to permutation `p`. No checking is done to verify that `p` is a permutation.

To return a new permutation, use `v[p]`. This is generally faster than `permute!(v, p)`; it is even faster to write into a pre-allocated output array with `u .= @view v[p]`. (Even though `permute!` overwrites `v` in-place, it internally requires some allocation to keep track of which elements have been moved.)

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

See also [`invpermute!`](/base/arrays#Base.invpermute!).

**Examples**

```julia
julia> A = [1, 1, 3, 4];

julia> perm = [2, 4, 3, 1];

julia> permute!(A, perm);

julia> A
4-element Vector{Int64}:
 1
 4
 3
 1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/combinatorics.jl#L184-L214)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.invpermute!' href='#Base.invpermute!'>#</a>&nbsp;<b><u>Base.invpermute!</u></b> &mdash; <i>Function</i>.




```julia
invpermute!(v, p)
```


Like [`permute!`](/base/arrays#Base.permute!-Tuple{Any,%20AbstractVector}), but the inverse of the given permutation is applied.

Note that if you have a pre-allocated output array (e.g. `u = similar(v)`), it is quicker to instead employ `u[p] = v`.  (`invpermute!` internally allocates a copy of the data.)

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = [1, 1, 3, 4];

julia> perm = [2, 4, 3, 1];

julia> invpermute!(A, perm);

julia> A
4-element Vector{Int64}:
 4
 1
 3
 1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/combinatorics.jl#L217-L243)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reverse-Tuple{AbstractVector}' href='#Base.reverse-Tuple{AbstractVector}'>#</a>&nbsp;<b><u>Base.reverse</u></b> &mdash; <i>Method</i>.




```julia
reverse(A; dims=:)
```


Reverse `A` along dimension `dims`, which can be an integer (a single dimension), a tuple of integers (a tuple of dimensions) or `:` (reverse along all the dimensions, the default).  See also [`reverse!`](/base/arrays#Base.reverse!) for in-place reversal.

**Examples**

```julia
julia> b = Int64[1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> reverse(b, dims=2)
2×2 Matrix{Int64}:
 2  1
 4  3

julia> reverse(b)
2×2 Matrix{Int64}:
 4  3
 2  1
```


::: tip Julia 1.6

Prior to Julia 1.6, only single-integer `dims` are supported in `reverse`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L30-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reverseind' href='#Base.reverseind'>#</a>&nbsp;<b><u>Base.reverseind</u></b> &mdash; <i>Function</i>.




```julia
reverseind(v, i)
```


Given an index `i` in [`reverse(v)`](/base/arrays#Base.reverse-Tuple{AbstractVector}), return the corresponding index in `v` so that `v[reverseind(v,i)] == reverse(v)[i]`. (This can be nontrivial in cases where `v` contains non-ASCII characters.)

**Examples**

```julia
julia> s = "Julia🚀"
"Julia🚀"

julia> r = reverse(s)
"🚀ailuJ"

julia> for i in eachindex(s)
           print(r[reverseind(r, i)])
       end
Julia🚀
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/strings/basic.jl#L728-L748)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reverse!' href='#Base.reverse!'>#</a>&nbsp;<b><u>Base.reverse!</u></b> &mdash; <i>Function</i>.




```julia
reverse!(v [, start=firstindex(v) [, stop=lastindex(v) ]]) -> v
```


In-place version of [`reverse`](/base/arrays#Base.reverse-Tuple{AbstractVector}).

**Examples**

```julia
julia> A = Vector(1:5)
5-element Vector{Int64}:
 1
 2
 3
 4
 5

julia> reverse!(A);

julia> A
5-element Vector{Int64}:
 5
 4
 3
 2
 1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L2153-L2178)



```julia
reverse!(A; dims=:)
```


Like [`reverse`](/base/arrays#Base.reverse-Tuple{AbstractVector}), but operates in-place in `A`.

::: tip Julia 1.6

Multidimensional `reverse!` requires Julia 1.6.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/arraymath.jl#L62-L69)

</div>
<br>
