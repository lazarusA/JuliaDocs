


# Sparse Arrays {#Sparse-Arrays}



Julia has support for sparse vectors and [sparse matrices](https://en.wikipedia.org/wiki/Sparse_matrix) in the `SparseArrays` stdlib module. Sparse arrays are arrays that contain enough zeros that storing them in a special data structure leads to savings in space and execution time, compared to dense arrays.

External packages which implement different sparse storage types, multidimensional sparse arrays, and more can be found in [Noteworthy External Sparse Packages](/stdlib/SparseArrays#Noteworthy-External-Sparse-Packages)

## Compressed Sparse Column (CSC) Sparse Matrix Storage {#man-csc}

In Julia, sparse matrices are stored in the [Compressed Sparse Column (CSC) format](https://en.wikipedia.org/wiki/Sparse_matrix#Compressed_sparse_column_.28CSC_or_CCS.29). Julia sparse matrices have the type [`SparseMatrixCSC{Tv,Ti}`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC), where `Tv` is the type of the stored values, and `Ti` is the integer type for storing column pointers and row indices. The internal representation of `SparseMatrixCSC` is as follows:

```julia
struct SparseMatrixCSC{Tv,Ti<:Integer} <: AbstractSparseMatrixCSC{Tv,Ti}
    m::Int                  # Number of rows
    n::Int                  # Number of columns
    colptr::Vector{Ti}      # Column j is in colptr[j]:(colptr[j+1]-1)
    rowval::Vector{Ti}      # Row indices of stored values
    nzval::Vector{Tv}       # Stored values, typically nonzeros
end
```


The compressed sparse column storage makes it easy and quick to access the elements in the column of a sparse matrix, whereas accessing the sparse matrix by rows is considerably slower. Operations such as insertion of previously unstored entries one at a time in the CSC structure tend to be slow. This is because all elements of the sparse matrix that are beyond the point of insertion have to be moved one place over.

All operations on sparse matrices are carefully implemented to exploit the CSC data structure for performance, and to avoid expensive operations.

If you have data in CSC format from a different application or library, and wish to import it in Julia, make sure that you use 1-based indexing. The row indices in every column need to be sorted, and if they are not, the matrix will display incorrectly.  If your `SparseMatrixCSC` object contains unsorted row indices, one quick way to sort them is by doing a double transpose. Since the transpose operation is lazy, make a copy to materialize each transpose.

In some applications, it is convenient to store explicit zero values in a `SparseMatrixCSC`. These _are_ accepted by functions in `Base` (but there is no guarantee that they will be preserved in mutating operations). Such explicitly stored zeros are treated as structural nonzeros by many routines. The [`nnz`](/stdlib/SparseArrays#SparseArrays.nnz) function returns the number of elements explicitly stored in the sparse data structure, including non-structural zeros. In order to count the exact number of numerical nonzeros, use [`count(!iszero, x)`](/base/collections#Base.count), which inspects every stored element of a sparse matrix. [`dropzeros`](/stdlib/SparseArrays#SparseArrays.dropzeros), and the in-place [`dropzeros!`](/stdlib/SparseArrays#SparseArrays.dropzeros!), can be used to remove stored zeros from the sparse matrix.

```julia
julia> A = sparse([1, 1, 2, 3], [1, 3, 2, 3], [0, 1, 2, 0])
3×3 SparseMatrixCSC{Int64, Int64} with 4 stored entries:
 0  ⋅  1
 ⋅  2  ⋅
 ⋅  ⋅  0

julia> dropzeros(A)
3×3 SparseMatrixCSC{Int64, Int64} with 2 stored entries:
 ⋅  ⋅  1
 ⋅  2  ⋅
 ⋅  ⋅  ⋅
```


## Sparse Vector Storage {#Sparse-Vector-Storage}

Sparse vectors are stored in a close analog to compressed sparse column format for sparse matrices. In Julia, sparse vectors have the type [`SparseVector{Tv,Ti}`](/stdlib/SparseArrays#SparseArrays.SparseVector) where `Tv` is the type of the stored values and `Ti` the integer type for the indices. The internal representation is as follows:

```julia
struct SparseVector{Tv,Ti<:Integer} <: AbstractSparseVector{Tv,Ti}
    n::Int              # Length of the sparse vector
    nzind::Vector{Ti}   # Indices of stored values
    nzval::Vector{Tv}   # Stored values, typically nonzeros
end
```


As for [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC), the `SparseVector` type can also contain explicitly stored zeros. (See [Sparse Matrix Storage](/stdlib/SparseArrays#man-csc).).

## Sparse Vector and Matrix Constructors {#Sparse-Vector-and-Matrix-Constructors}

The simplest way to create a sparse array is to use a function equivalent to the [`zeros`](/base/arrays#Base.zeros) function that Julia provides for working with dense arrays. To produce a sparse array instead, you can use the same name with an `sp` prefix:

```julia
julia> spzeros(3)
3-element SparseVector{Float64, Int64} with 0 stored entries
```


The [`sparse`](/stdlib/SparseArrays#SparseArrays.sparse) function is often a handy way to construct sparse arrays. For example, to construct a sparse matrix we can input a vector `I` of row indices, a vector `J` of column indices, and a vector `V` of stored values (this is also known as the [COO (coordinate) format](https://en.wikipedia.org/wiki/Sparse_matrix#Coordinate_list_.28COO.29)). `sparse(I,J,V)` then constructs a sparse matrix such that `S[I[k], J[k]] = V[k]`. The equivalent sparse vector constructor is [`sparsevec`](/stdlib/SparseArrays#SparseArrays.sparsevec), which takes the (row) index vector `I` and the vector `V` with the stored values and constructs a sparse vector `R` such that `R[I[k]] = V[k]`.

```julia
julia> I = [1, 4, 3, 5]; J = [4, 7, 18, 9]; V = [1, 2, -5, 3];

julia> S = sparse(I,J,V)
5×18 SparseMatrixCSC{Int64, Int64} with 4 stored entries:
⎡⠀⠈⠀⠀⠀⠀⠀⠀⢀⎤
⎣⠀⠀⠀⠂⡀⠀⠀⠀⠀⎦

julia> R = sparsevec(I,V)
5-element SparseVector{Int64, Int64} with 4 stored entries:
  [1]  =  1
  [3]  =  -5
  [4]  =  2
  [5]  =  3
```


The inverse of the [`sparse`](/stdlib/SparseArrays#SparseArrays.sparse) and [`sparsevec`](/stdlib/SparseArrays#SparseArrays.sparsevec) functions is [`findnz`](/stdlib/SparseArrays#SparseArrays.findnz), which retrieves the inputs used to create the sparse array (including stored entries equal to zero). [`findall(!iszero, x)`](/base/arrays#Base.findall-Tuple{Any}) returns the Cartesian indices of non-zero entries in `x` (not including stored entries equal to zero).

```julia
julia> findnz(S)
([1, 4, 5, 3], [4, 7, 9, 18], [1, 2, 3, -5])

julia> findall(!iszero, S)
4-element Vector{CartesianIndex{2}}:
 CartesianIndex(1, 4)
 CartesianIndex(4, 7)
 CartesianIndex(5, 9)
 CartesianIndex(3, 18)

julia> findnz(R)
([1, 3, 4, 5], [1, -5, 2, 3])

julia> findall(!iszero, R)
4-element Vector{Int64}:
 1
 3
 4
 5
```


Another way to create a sparse array is to convert a dense array into a sparse array using the [`sparse`](/stdlib/SparseArrays#SparseArrays.sparse) function:

```julia
julia> sparse(Matrix(1.0I, 5, 5))
5×5 SparseMatrixCSC{Float64, Int64} with 5 stored entries:
 1.0   ⋅    ⋅    ⋅    ⋅
  ⋅   1.0   ⋅    ⋅    ⋅
  ⋅    ⋅   1.0   ⋅    ⋅
  ⋅    ⋅    ⋅   1.0   ⋅
  ⋅    ⋅    ⋅    ⋅   1.0

julia> sparse([1.0, 0.0, 1.0])
3-element SparseVector{Float64, Int64} with 2 stored entries:
  [1]  =  1.0
  [3]  =  1.0
```


You can go in the other direction using the [`Array`](/base/arrays#Core.Array) constructor. The [`issparse`](/stdlib/SparseArrays#SparseArrays.issparse) function can be used to query if a matrix is sparse.

```julia
julia> issparse(spzeros(5))
true
```


## Sparse matrix operations {#Sparse-matrix-operations}

Arithmetic operations on sparse matrices also work as they do on dense matrices. Indexing of, assignment into, and concatenation of sparse matrices work in the same way as dense matrices. Indexing operations, especially assignment, are expensive, when carried out one element at a time. In many cases it may be better to convert the sparse matrix into `(I,J,V)` format using [`findnz`](/stdlib/SparseArrays#SparseArrays.findnz), manipulate the values or the structure in the dense vectors `(I,J,V)`, and then reconstruct the sparse matrix.

## Correspondence of dense and sparse methods {#Correspondence-of-dense-and-sparse-methods}

The following table gives a correspondence between built-in methods on sparse matrices and their corresponding methods on dense matrix types. In general, methods that generate sparse matrices differ from their dense counterparts in that the resulting matrix follows the same sparsity pattern as a given sparse matrix `S`, or that the resulting sparse matrix has density `d`, i.e. each matrix element has a probability `d` of being non-zero.

Details can be found in the [Sparse Vectors and Matrices](/stdlib/SparseArrays#stdlib-sparse-arrays) section of the standard library reference.

| Sparse                                                            | Dense                                         | Description                                                                                                                                          |
|:----------------------------------------------------------------- |:--------------------------------------------- |:---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`spzeros(m,n)`](/stdlib/SparseArrays#SparseArrays.spzeros)       | [`zeros(m,n)`](/base/arrays#Base.zeros)       | Creates a _m_-by-_n_ matrix of zeros. ([`spzeros(m,n)`](/stdlib/SparseArrays#SparseArrays.spzeros) is empty.)                                        |
| [`sparse(I,n,n)`](/stdlib/SparseArrays#SparseArrays.sparse)       | [`Matrix(I,n,n)`](/base/arrays#Base.Matrix)   | Creates a _n_-by-_n_ identity matrix.                                                                                                                |
| [`sparse(A)`](/stdlib/SparseArrays#SparseArrays.sparse)           | [`Array(S)`](/base/arrays#Core.Array)         | Interconverts between dense and sparse formats.                                                                                                      |
| [`sprand(m,n,d)`](/stdlib/SparseArrays#SparseArrays.sprand)       | [`rand(m,n)`](/stdlib/Random#Base.rand)       | Creates a _m_-by-_n_ random matrix (of density _d_) with iid non-zero elements distributed uniformly on the half-open interval $[0, 1)$.             |
| [`sprandn(m,n,d)`](/stdlib/SparseArrays#SparseArrays.sprandn)     | [`randn(m,n)`](/stdlib/Random#Base.randn)     | Creates a _m_-by-_n_ random matrix (of density _d_) with iid non-zero elements distributed according to the standard normal (Gaussian) distribution. |
| [`sprandn(rng,m,n,d)`](/stdlib/SparseArrays#SparseArrays.sprandn) | [`randn(rng,m,n)`](/stdlib/Random#Base.randn) | Creates a _m_-by-_n_ random matrix (of density _d_) with iid non-zero elements generated with the `rng` random number generator                      |


# SparseArrays API {#stdlib-sparse-arrays}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.AbstractSparseArray' href='#SparseArrays.AbstractSparseArray'>#</a>&nbsp;<b><u>SparseArrays.AbstractSparseArray</u></b> &mdash; <i>Type</i>.




```julia
AbstractSparseArray{Tv,Ti,N}
```


Supertype for `N`-dimensional sparse arrays (or array-like types) with elements of type `Tv` and index type `Ti`. [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC), [`SparseVector`](/stdlib/SparseArrays#SparseArrays.SparseVector) and `SuiteSparse.CHOLMOD.Sparse` are subtypes of this.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/abstractsparse.jl#L3-L9)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.AbstractSparseVector' href='#SparseArrays.AbstractSparseVector'>#</a>&nbsp;<b><u>SparseArrays.AbstractSparseVector</u></b> &mdash; <i>Type</i>.




```julia
AbstractSparseVector{Tv,Ti}
```


Supertype for one-dimensional sparse arrays (or array-like types) with elements of type `Tv` and index type `Ti`. Alias for `AbstractSparseArray{Tv,Ti,1}`.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/abstractsparse.jl#L12-L17)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.AbstractSparseMatrix' href='#SparseArrays.AbstractSparseMatrix'>#</a>&nbsp;<b><u>SparseArrays.AbstractSparseMatrix</u></b> &mdash; <i>Type</i>.




```julia
AbstractSparseMatrix{Tv,Ti}
```


Supertype for two-dimensional sparse arrays (or array-like types) with elements of type `Tv` and index type `Ti`. Alias for `AbstractSparseArray{Tv,Ti,2}`.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/abstractsparse.jl#L27-L32)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.SparseVector' href='#SparseArrays.SparseVector'>#</a>&nbsp;<b><u>SparseArrays.SparseVector</u></b> &mdash; <i>Type</i>.




```julia
SparseVector{Tv,Ti<:Integer} <: AbstractSparseVector{Tv,Ti}
```


Vector type for storing sparse vectors. Can be created by passing the length of the vector, a _sorted_ vector of non-zero indices, and a vector of non-zero values.

For instance, the vector `[5, 6, 0, 7]` can be represented as

```julia
SparseVector(4, [1, 2, 4], [5, 6, 7])
```


This indicates that the element at index 1 is 5, at index 2 is 6, at index 3 is `zero(Int)`, and at index 4 is 7.

It may be more convenient to create sparse vectors directly from dense vectors using `sparse` as

```julia
sparse([5, 6, 0, 7])
```


yields the same sparse vector.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L13-L35)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.SparseMatrixCSC' href='#SparseArrays.SparseMatrixCSC'>#</a>&nbsp;<b><u>SparseArrays.SparseMatrixCSC</u></b> &mdash; <i>Type</i>.




```julia
SparseMatrixCSC{Tv,Ti<:Integer} <: AbstractSparseMatrixCSC{Tv,Ti}
```


Matrix type for storing sparse matrices in the [Compressed Sparse Column](/stdlib/SparseArrays#man-csc) format. The standard way of constructing SparseMatrixCSC is through the [`sparse`](/stdlib/SparseArrays#SparseArrays.sparse) function. See also [`spzeros`](/stdlib/SparseArrays#SparseArrays.spzeros), [`spdiagm`](/stdlib/SparseArrays#SparseArrays.spdiagm) and [`sprand`](/stdlib/SparseArrays#SparseArrays.sprand).


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L11-L18)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sparse' href='#SparseArrays.sparse'>#</a>&nbsp;<b><u>SparseArrays.sparse</u></b> &mdash; <i>Function</i>.




```julia
sparse(A)
```


Convert an AbstractMatrix `A` into a sparse matrix.

**Examples**

```julia
julia> A = Matrix(1.0I, 3, 3)
3×3 Matrix{Float64}:
 1.0  0.0  0.0
 0.0  1.0  0.0
 0.0  0.0  1.0

julia> sparse(A)
3×3 SparseMatrixCSC{Float64, Int64} with 3 stored entries:
 1.0   ⋅    ⋅
  ⋅   1.0   ⋅
  ⋅    ⋅   1.0
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L994-L1013)



```julia
sparse(I, J, V,[ m, n, combine])
```


Create a sparse matrix `S` of dimensions `m x n` such that `S[I[k], J[k]] = V[k]`. The `combine` function is used to combine duplicates. If `m` and `n` are not specified, they are set to `maximum(I)` and `maximum(J)` respectively. If the `combine` function is not supplied, `combine` defaults to `+` unless the elements of `V` are Booleans in which case `combine` defaults to `|`. All elements of `I` must satisfy `1 <= I[k] <= m`, and all elements of `J` must satisfy `1 <= J[k] <= n`. Numerical zeros in (`I`, `J`, `V`) are retained as structural nonzeros; to drop numerical zeros, use [`dropzeros!`](/stdlib/SparseArrays#SparseArrays.dropzeros!).

For additional documentation and an expert driver, see `SparseArrays.sparse!`.

**Examples**

```julia
julia> Is = [1; 2; 3];

julia> Js = [1; 2; 3];

julia> Vs = [1; 2; 3];

julia> sparse(Is, Js, Vs)
3×3 SparseMatrixCSC{Int64, Int64} with 3 stored entries:
 1  ⋅  ⋅
 ⋅  2  ⋅
 ⋅  ⋅  3
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1028-L1055)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sparse!' href='#SparseArrays.sparse!'>#</a>&nbsp;<b><u>SparseArrays.sparse!</u></b> &mdash; <i>Function</i>.




```julia
sparse!(I::AbstractVector{Ti}, J::AbstractVector{Ti}, V::AbstractVector{Tv},
        m::Integer, n::Integer, combine, klasttouch::Vector{Ti},
        csrrowptr::Vector{Ti}, csrcolval::Vector{Ti}, csrnzval::Vector{Tv},
        [csccolptr::Vector{Ti}], [cscrowval::Vector{Ti}, cscnzval::Vector{Tv}] ) where {Tv,Ti<:Integer}
```


Parent of and expert driver for [`sparse`](/stdlib/SparseArrays#SparseArrays.sparse); see [`sparse`](/stdlib/SparseArrays#SparseArrays.sparse) for basic usage. This method allows the user to provide preallocated storage for `sparse`&#39;s intermediate objects and result as described below. This capability enables more efficient successive construction of [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC)s from coordinate representations, and also enables extraction of an unsorted-column representation of the result&#39;s transpose at no additional cost.

This method consists of three major steps: (1) Counting-sort the provided coordinate representation into an unsorted-row CSR form including repeated entries. (2) Sweep through the CSR form, simultaneously calculating the desired CSC form&#39;s column-pointer array, detecting repeated entries, and repacking the CSR form with repeated entries combined; this stage yields an unsorted-row CSR form with no repeated entries. (3) Counting-sort the preceding CSR form into a fully-sorted CSC form with no repeated entries.

Input arrays `csrrowptr`, `csrcolval`, and `csrnzval` constitute storage for the intermediate CSR forms and require `length(csrrowptr) >= m + 1`, `length(csrcolval) >= length(I)`, and `length(csrnzval >= length(I))`. Input array `klasttouch`, workspace for the second stage, requires `length(klasttouch) >= n`. Optional input arrays `csccolptr`, `cscrowval`, and `cscnzval` constitute storage for the returned CSC form `S`. If necessary, these are resized automatically to satisfy `length(csccolptr) = n + 1`, `length(cscrowval) = nnz(S)` and `length(cscnzval) = nnz(S)`; hence, if `nnz(S)` is unknown at the outset, passing in empty vectors of the appropriate type (`Vector{Ti}()` and `Vector{Tv}()` respectively) suffices, or calling the `sparse!` method neglecting `cscrowval` and `cscnzval`.

On return, `csrrowptr`, `csrcolval`, and `csrnzval` contain an unsorted-column representation of the result&#39;s transpose.

You may reuse the input arrays&#39; storage (`I`, `J`, `V`) for the output arrays (`csccolptr`, `cscrowval`, `cscnzval`). For example, you may call `sparse!(I, J, V, csrrowptr, csrcolval, csrnzval, I, J, V)`. Note that they will be resized to satisfy the conditions above.

For the sake of efficiency, this method performs no argument checking beyond `1 <= I[k] <= m` and `1 <= J[k] <= n`. Use with care. Testing with `--check-bounds=yes` is wise.

This method runs in `O(m, n, length(I))` time. The HALFPERM algorithm described in F. Gustavson, &quot;Two fast algorithms for sparse matrices: multiplication and permuted transposition,&quot; ACM TOMS 4(3), 250-269 (1978) inspired this method&#39;s use of a pair of counting sorts.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1100-L1147)



```julia
SparseArrays.sparse!(I, J, V, [m, n, combine]) -> SparseMatrixCSC
```


Variant of `sparse!` that re-uses the input vectors (`I`, `J`, `V`) for the final matrix storage. After construction the input vectors will alias the matrix buffers; `S.colptr === I`, `S.rowval === J`, and `S.nzval === V` holds, and they will be `resize!`d as necessary.

Note that some work buffers will still be allocated. Specifically, this method is a convenience wrapper around `sparse!(I, J, V, m, n, combine, klasttouch, csrrowptr, csrcolval, csrnzval, csccolptr, cscrowval, cscnzval)` where this method allocates `klasttouch`, `csrrowptr`, `csrcolval`, and `csrnzval` of appropriate size, but reuses `I`, `J`, and `V` for `csccolptr`, `cscrowval`, and `cscnzval`.

Arguments `m`, `n`, and `combine` defaults to `maximum(I)`, `maximum(J)`, and `+`, respectively.

::: tip Julia 1.10

This method requires Julia version 1.10 or later.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1290-L1308)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sparsevec' href='#SparseArrays.sparsevec'>#</a>&nbsp;<b><u>SparseArrays.sparsevec</u></b> &mdash; <i>Function</i>.




```julia
sparsevec(I, V, [m, combine])
```


Create a sparse vector `S` of length `m` such that `S[I[k]] = V[k]`. Duplicates are combined using the `combine` function, which defaults to `+` if no `combine` argument is provided, unless the elements of `V` are Booleans in which case `combine` defaults to `|`.

**Examples**

```julia
julia> II = [1, 3, 3, 5]; V = [0.1, 0.2, 0.3, 0.2];

julia> sparsevec(II, V)
5-element SparseVector{Float64, Int64} with 3 stored entries:
  [1]  =  0.1
  [3]  =  0.5
  [5]  =  0.2

julia> sparsevec(II, V, 8, -)
8-element SparseVector{Float64, Int64} with 3 stored entries:
  [1]  =  0.1
  [3]  =  -0.1
  [5]  =  0.2

julia> sparsevec([1, 3, 1, 2, 2], [true, true, false, false, false])
3-element SparseVector{Bool, Int64} with 3 stored entries:
  [1]  =  1
  [2]  =  0
  [3]  =  1
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L295-L325)



```julia
sparsevec(d::Dict, [m])
```


Create a sparse vector of length `m` where the nonzero indices are keys from the dictionary, and the nonzero values are the values from the dictionary.

**Examples**

```julia
julia> sparsevec(Dict(1 => 3, 2 => 2))
2-element SparseVector{Int64, Int64} with 2 stored entries:
  [1]  =  3
  [2]  =  2
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L373-L386)



```julia
sparsevec(A)
```


Convert a vector `A` into a sparse vector of length `m`.

**Examples**

```julia
julia> sparsevec([1.0, 2.0, 0.0, 0.0, 3.0, 0.0])
6-element SparseVector{Float64, Int64} with 3 stored entries:
  [1]  =  1.0
  [2]  =  2.0
  [5]  =  3.0
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L509-L522)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.similar-Tuple{SparseArrays.AbstractSparseMatrixCSC, Type}' href='#Base.similar-Tuple{SparseArrays.AbstractSparseMatrixCSC, Type}'>#</a>&nbsp;<b><u>Base.similar</u></b> &mdash; <i>Method</i>.




```julia
similar(A::AbstractSparseMatrixCSC{Tv,Ti}, [::Type{TvNew}, ::Type{TiNew}, m::Integer, n::Integer]) where {Tv,Ti}
```


Create an uninitialized mutable array with the given element type, index type, and size, based upon the given source `SparseMatrixCSC`. The new sparse matrix maintains the structure of the original sparse matrix, except in the case where dimensions of the output matrix are different from the output.

The output matrix has zeros in the same locations as the input, but uninitialized values for the nonzero locations.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L706-L717)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.issparse' href='#SparseArrays.issparse'>#</a>&nbsp;<b><u>SparseArrays.issparse</u></b> &mdash; <i>Function</i>.




```julia
issparse(S)
```


Returns `true` if `S` is sparse, and `false` otherwise.

**Examples**

```julia
julia> sv = sparsevec([1, 4], [2.3, 2.2], 10)
10-element SparseVector{Float64, Int64} with 2 stored entries:
  [1]  =  2.3
  [4]  =  2.2

julia> issparse(sv)
true

julia> issparse(Array(sv))
false
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/abstractsparse.jl#L45-L63)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.nnz' href='#SparseArrays.nnz'>#</a>&nbsp;<b><u>SparseArrays.nnz</u></b> &mdash; <i>Function</i>.




```julia
nnz(A)
```


Returns the number of stored (filled) elements in a sparse array.

**Examples**

```julia
julia> A = sparse(2I, 3, 3)
3×3 SparseMatrixCSC{Int64, Int64} with 3 stored entries:
 2  ⋅  ⋅
 ⋅  2  ⋅
 ⋅  ⋅  2

julia> nnz(A)
3
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L201-L217)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.findnz' href='#SparseArrays.findnz'>#</a>&nbsp;<b><u>SparseArrays.findnz</u></b> &mdash; <i>Function</i>.




```julia
findnz(A::SparseMatrixCSC)
```


Return a tuple `(I, J, V)` where `I` and `J` are the row and column indices of the stored (&quot;structurally non-zero&quot;) values in sparse matrix `A`, and `V` is a vector of the values.

**Examples**

```julia
julia> A = sparse([1 2 0; 0 0 3; 0 4 0])
3×3 SparseMatrixCSC{Int64, Int64} with 4 stored entries:
 1  2  ⋅
 ⋅  ⋅  3
 ⋅  4  ⋅

julia> findnz(A)
([1, 1, 3, 2], [1, 2, 2, 3], [1, 2, 4, 3])
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/abstractsparse.jl#L112-L129)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.spzeros' href='#SparseArrays.spzeros'>#</a>&nbsp;<b><u>SparseArrays.spzeros</u></b> &mdash; <i>Function</i>.




```julia
spzeros([type,]m[,n])
```


Create a sparse vector of length `m` or sparse matrix of size `m x n`. This sparse array will not contain any nonzero values. No storage will be allocated for nonzero values during construction. The type defaults to [`Float64`](/base/numbers#Core.Float64) if not specified.

**Examples**

```julia
julia> spzeros(3, 3)
3×3 SparseMatrixCSC{Float64, Int64} with 0 stored entries:
  ⋅    ⋅    ⋅
  ⋅    ⋅    ⋅
  ⋅    ⋅    ⋅

julia> spzeros(Float32, 4)
4-element SparseVector{Float32, Int64} with 0 stored entries
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L2079-L2098)



```julia
spzeros([type], I::AbstractVector, J::AbstractVector, [m, n])
```


Create a sparse matrix `S` of dimensions `m x n` with structural zeros at `S[I[k], J[k]]`.

This method can be used to construct the sparsity pattern of the matrix, and is more efficient than using e.g. `sparse(I, J, zeros(length(I)))`.

For additional documentation and an expert driver, see `SparseArrays.spzeros!`.

::: tip Julia 1.10

This methods requires Julia version 1.10 or later.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L2112-L2124)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.spzeros!' href='#SparseArrays.spzeros!'>#</a>&nbsp;<b><u>SparseArrays.spzeros!</u></b> &mdash; <i>Function</i>.




```julia
spzeros!(::Type{Tv}, I::AbstractVector{Ti}, J::AbstractVector{Ti}, m::Integer, n::Integer,
         klasttouch::Vector{Ti}, csrrowptr::Vector{Ti}, csrcolval::Vector{Ti},
         [csccolptr::Vector{Ti}], [cscrowval::Vector{Ti}, cscnzval::Vector{Tv}]) where {Tv,Ti<:Integer}
```


Parent of and expert driver for `spzeros(I, J)` allowing user to provide preallocated storage for intermediate objects. This method is to `spzeros` what `SparseArrays.sparse!` is to `sparse`. See documentation for `SparseArrays.sparse!` for details and required buffer lengths.

::: tip Julia 1.10

This methods requires Julia version 1.10 or later.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L2141-L2153)



```julia
SparseArrays.spzeros!(::Type{Tv}, I, J, [m, n]) -> SparseMatrixCSC{Tv}
```


Variant of `spzeros!` that re-uses the input vectors `I` and `J` for the final matrix storage. After construction the input vectors will alias the matrix buffers; `S.colptr === I` and `S.rowval === J` holds, and they will be `resize!`d as necessary.

Note that some work buffers will still be allocated. Specifically, this method is a convenience wrapper around `spzeros!(Tv, I, J, m, n, klasttouch, csrrowptr, csrcolval, csccolptr, cscrowval)` where this method allocates `klasttouch`, `csrrowptr`, and `csrcolval` of appropriate size, but reuses `I` and `J` for `csccolptr` and `cscrowval`.

Arguments `m` and `n` defaults to `maximum(I)` and `maximum(J)`.

::: tip Julia 1.10

This method requires Julia version 1.10 or later.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L2164-L2180)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.spdiagm' href='#SparseArrays.spdiagm'>#</a>&nbsp;<b><u>SparseArrays.spdiagm</u></b> &mdash; <i>Function</i>.




```julia
spdiagm(kv::Pair{<:Integer,<:AbstractVector}...)
spdiagm(m::Integer, n::Integer, kv::Pair{<:Integer,<:AbstractVector}...)
```


Construct a sparse diagonal matrix from `Pair`s of vectors and diagonals. Each vector `kv.second` will be placed on the `kv.first` diagonal.  By default, the matrix is square and its size is inferred from `kv`, but a non-square size `m`×`n` (padded with zeros as needed) can be specified by passing `m,n` as the first arguments.

**Examples**

```julia
julia> spdiagm(-1 => [1,2,3,4], 1 => [4,3,2,1])
5×5 SparseMatrixCSC{Int64, Int64} with 8 stored entries:
 ⋅  4  ⋅  ⋅  ⋅
 1  ⋅  3  ⋅  ⋅
 ⋅  2  ⋅  2  ⋅
 ⋅  ⋅  3  ⋅  1
 ⋅  ⋅  ⋅  4  ⋅
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L4201-L4221)



```julia
spdiagm(v::AbstractVector)
spdiagm(m::Integer, n::Integer, v::AbstractVector)
```


Construct a sparse matrix with elements of the vector as diagonal elements. By default (no given `m` and `n`), the matrix is square and its size is given by `length(v)`, but a non-square size `m`×`n` can be specified by passing `m` and `n` as the first arguments.

::: tip Julia 1.6

These functions require at least Julia 1.6.

:::

**Examples**

```julia
julia> spdiagm([1,2,3])
3×3 SparseMatrixCSC{Int64, Int64} with 3 stored entries:
 1  ⋅  ⋅
 ⋅  2  ⋅
 ⋅  ⋅  3

julia> spdiagm(sparse([1,0,3]))
3×3 SparseMatrixCSC{Int64, Int64} with 2 stored entries:
 1  ⋅  ⋅
 ⋅  ⋅  ⋅
 ⋅  ⋅  3
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L4225-L4251)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sparse_hcat' href='#SparseArrays.sparse_hcat'>#</a>&nbsp;<b><u>SparseArrays.sparse_hcat</u></b> &mdash; <i>Function</i>.




```julia
sparse_hcat(A...)
```


Concatenate along dimension 2. Return a SparseMatrixCSC object.

::: tip Julia 1.8

This method was added in Julia 1.8. It mimics previous concatenation behavior, where the concatenation with specialized &quot;sparse&quot; matrix types from LinearAlgebra.jl automatically yielded sparse output even in the absence of any SparseArray argument.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L1314-L1323)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sparse_vcat' href='#SparseArrays.sparse_vcat'>#</a>&nbsp;<b><u>SparseArrays.sparse_vcat</u></b> &mdash; <i>Function</i>.




```julia
sparse_vcat(A...)
```


Concatenate along dimension 1. Return a SparseMatrixCSC object.

::: tip Julia 1.8

This method was added in Julia 1.8. It mimics previous concatenation behavior, where the concatenation with specialized &quot;sparse&quot; matrix types from LinearAlgebra.jl automatically yielded sparse output even in the absence of any SparseArray argument.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L1329-L1338)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sparse_hvcat' href='#SparseArrays.sparse_hvcat'>#</a>&nbsp;<b><u>SparseArrays.sparse_hvcat</u></b> &mdash; <i>Function</i>.




```julia
sparse_hvcat(rows::Tuple{Vararg{Int}}, values...)
```


Sparse horizontal and vertical concatenation in one call. This function is called for block matrix syntax. The first argument specifies the number of arguments to concatenate in each block row.

::: tip Julia 1.8

This method was added in Julia 1.8. It mimics previous concatenation behavior, where the concatenation with specialized &quot;sparse&quot; matrix types from LinearAlgebra.jl automatically yielded sparse output even in the absence of any SparseArray argument.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L1344-L1355)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.blockdiag' href='#SparseArrays.blockdiag'>#</a>&nbsp;<b><u>SparseArrays.blockdiag</u></b> &mdash; <i>Function</i>.




```julia
blockdiag(A...)
```


Concatenate matrices block-diagonally. Currently only implemented for sparse matrices.

**Examples**

```julia
julia> blockdiag(sparse(2I, 3, 3), sparse(4I, 2, 2))
5×5 SparseMatrixCSC{Int64, Int64} with 5 stored entries:
 2  ⋅  ⋅  ⋅  ⋅
 ⋅  2  ⋅  ⋅  ⋅
 ⋅  ⋅  2  ⋅  ⋅
 ⋅  ⋅  ⋅  4  ⋅
 ⋅  ⋅  ⋅  ⋅  4
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L3974-L3989)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sprand' href='#SparseArrays.sprand'>#</a>&nbsp;<b><u>SparseArrays.sprand</u></b> &mdash; <i>Function</i>.




```julia
sprand([rng],[T::Type],m,[n],p::AbstractFloat)
sprand([rng],m,[n],p::AbstractFloat,[rfn=rand])
```


Create a random length `m` sparse vector or `m` by `n` sparse matrix, in which the probability of any element being nonzero is independently given by `p` (and hence the mean density of nonzeros is also exactly `p`). The optional `rng` argument specifies a random number generator, see [Random Numbers](/stdlib/Random#Random-Numbers). The optional `T` argument specifies the element type, which defaults to `Float64`.

By default, nonzero values are sampled from a uniform distribution using the [`rand`](/stdlib/Random#Base.rand) function, i.e. by `rand(T)`, or `rand(rng, T)` if `rng` is supplied; for the default `T=Float64`, this corresponds to nonzero values sampled uniformly in `[0,1)`.

You can sample nonzero values from a different distribution by passing a custom `rfn` function instead of `rand`.   This should be a function `rfn(k)` that returns an array of `k` random numbers sampled from the desired distribution; alternatively, if `rng` is supplied, it should instead be a function `rfn(rng, k)`.

**Examples**

```julia
julia> sprand(Bool, 2, 2, 0.5)
2×2 SparseMatrixCSC{Bool, Int64} with 2 stored entries:
 1  1
 ⋅  ⋅

julia> sprand(Float64, 3, 0.75)
3-element SparseVector{Float64, Int64} with 2 stored entries:
  [1]  =  0.795547
  [2]  =  0.49425
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1992-L2024)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.sprandn' href='#SparseArrays.sprandn'>#</a>&nbsp;<b><u>SparseArrays.sprandn</u></b> &mdash; <i>Function</i>.




```julia
sprandn([rng][,Type],m[,n],p::AbstractFloat)
```


Create a random sparse vector of length `m` or sparse matrix of size `m` by `n` with the specified (independent) probability `p` of any entry being nonzero, where nonzero values are sampled from the normal distribution. The optional `rng` argument specifies a random number generator, see [Random Numbers](/stdlib/Random#Random-Numbers).

::: tip Julia 1.1

Specifying the output element type `Type` requires at least Julia 1.1.

:::

**Examples**

```julia
julia> sprandn(2, 2, 0.75)
2×2 SparseMatrixCSC{Float64, Int64} with 3 stored entries:
 -1.20577     ⋅
  0.311817  -0.234641
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L2049-L2067)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.nonzeros' href='#SparseArrays.nonzeros'>#</a>&nbsp;<b><u>SparseArrays.nonzeros</u></b> &mdash; <i>Function</i>.




```julia
nonzeros(A)
```


Return a vector of the structural nonzero values in sparse array `A`. This includes zeros that are explicitly stored in the sparse array. The returned vector points directly to the internal nonzero storage of `A`, and any modifications to the returned vector will mutate `A` as well. See [`rowvals`](/stdlib/SparseArrays#SparseArrays.rowvals) and [`nzrange`](/stdlib/SparseArrays#SparseArrays.nzrange).

**Examples**

```julia
julia> A = sparse(2I, 3, 3)
3×3 SparseMatrixCSC{Int64, Int64} with 3 stored entries:
 2  ⋅  ⋅
 ⋅  2  ⋅
 ⋅  ⋅  2

julia> nonzeros(A)
3-element Vector{Int64}:
 2
 2
 2
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L230-L253)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.rowvals' href='#SparseArrays.rowvals'>#</a>&nbsp;<b><u>SparseArrays.rowvals</u></b> &mdash; <i>Function</i>.




```julia
rowvals(A::AbstractSparseMatrixCSC)
```


Return a vector of the row indices of `A`. Any modifications to the returned vector will mutate `A` as well. Providing access to how the row indices are stored internally can be useful in conjunction with iterating over structural nonzero values. See also [`nonzeros`](/stdlib/SparseArrays#SparseArrays.nonzeros) and [`nzrange`](/stdlib/SparseArrays#SparseArrays.nzrange).

**Examples**

```julia
julia> A = sparse(2I, 3, 3)
3×3 SparseMatrixCSC{Int64, Int64} with 3 stored entries:
 2  ⋅  ⋅
 ⋅  2  ⋅
 ⋅  ⋅  2

julia> rowvals(A)
3-element Vector{Int64}:
 1
 2
 3
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L259-L281)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.nzrange' href='#SparseArrays.nzrange'>#</a>&nbsp;<b><u>SparseArrays.nzrange</u></b> &mdash; <i>Function</i>.




```julia
nzrange(A::AbstractSparseMatrixCSC, col::Integer)
```


Return the range of indices to the structural nonzero values of a sparse matrix column. In conjunction with [`nonzeros`](/stdlib/SparseArrays#SparseArrays.nonzeros) and [`rowvals`](/stdlib/SparseArrays#SparseArrays.rowvals), this allows for convenient iterating over a sparse matrix :

```
A = sparse(I,J,V)
rows = rowvals(A)
vals = nonzeros(A)
m, n = size(A)
for j = 1:n
   for i in nzrange(A, j)
      row = rows[i]
      val = vals[i]
      # perform sparse wizardry...
   end
end
```


::: warning Warning

Adding or removing nonzero elements to the matrix may invalidate the `nzrange`, one should not mutate the matrix while iterating.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L287-L308)



```julia
nzrange(x::SparseVectorUnion, col)
```


Give the range of indices to the structural nonzero values of a sparse vector. The column index `col` is ignored (assumed to be `1`).


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L122-L127)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.droptol!' href='#SparseArrays.droptol!'>#</a>&nbsp;<b><u>SparseArrays.droptol!</u></b> &mdash; <i>Function</i>.




```julia
droptol!(A::AbstractSparseMatrixCSC, tol)
```


Removes stored values from `A` whose absolute value is less than or equal to `tol`.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1856-L1860)



```julia
droptol!(x::AbstractCompressedVector, tol)
```


Removes stored values from `x` whose absolute value is less than or equal to `tol`.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L2295-L2299)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.dropzeros!' href='#SparseArrays.dropzeros!'>#</a>&nbsp;<b><u>SparseArrays.dropzeros!</u></b> &mdash; <i>Function</i>.




```julia
dropzeros!(x::AbstractCompressedVector)
```


Removes stored numerical zeros from `x`.

For an out-of-place version, see [`dropzeros`](/stdlib/SparseArrays#SparseArrays.dropzeros). For algorithmic information, see `fkeep!`.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L2302-L2309)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.dropzeros' href='#SparseArrays.dropzeros'>#</a>&nbsp;<b><u>SparseArrays.dropzeros</u></b> &mdash; <i>Function</i>.




```julia
dropzeros(A::AbstractSparseMatrixCSC;)
```


Generates a copy of `A` and removes stored numerical zeros from that copy.

For an in-place version and algorithmic information, see [`dropzeros!`](/stdlib/SparseArrays#SparseArrays.dropzeros!).

**Examples**

```julia
julia> A = sparse([1, 2, 3], [1, 2, 3], [1.0, 0.0, 1.0])
3×3 SparseMatrixCSC{Float64, Int64} with 3 stored entries:
 1.0   ⋅    ⋅
  ⋅   0.0   ⋅
  ⋅    ⋅   1.0

julia> dropzeros(A)
3×3 SparseMatrixCSC{Float64, Int64} with 2 stored entries:
 1.0   ⋅    ⋅
  ⋅    ⋅    ⋅
  ⋅    ⋅   1.0
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1875-L1896)



```julia
dropzeros(x::AbstractCompressedVector)
```


Generates a copy of `x` and removes numerical zeros from that copy.

For an in-place version and algorithmic information, see [`dropzeros!`](/stdlib/SparseArrays#SparseArrays.dropzeros!).

**Examples**

```julia
julia> A = sparsevec([1, 2, 3], [1.0, 0.0, 1.0])
3-element SparseVector{Float64, Int64} with 3 stored entries:
  [1]  =  1.0
  [2]  =  0.0
  [3]  =  1.0

julia> dropzeros(A)
3-element SparseVector{Float64, Int64} with 2 stored entries:
  [1]  =  1.0
  [3]  =  1.0
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsevector.jl#L2313-L2333)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.permute' href='#SparseArrays.permute'>#</a>&nbsp;<b><u>SparseArrays.permute</u></b> &mdash; <i>Function</i>.




```julia
permute(A::AbstractSparseMatrixCSC{Tv,Ti}, p::AbstractVector{<:Integer},
        q::AbstractVector{<:Integer}) where {Tv,Ti}
```


Bilaterally permute `A`, returning `PAQ` (`A[p,q]`). Column-permutation `q`&#39;s length must match `A`&#39;s column count (`length(q) == size(A, 2)`). Row-permutation `p`&#39;s length must match `A`&#39;s row count (`length(p) == size(A, 1)`).

For expert drivers and additional information, see [`permute!`](/base/arrays#Base.permute!-Tuple{Any,%20AbstractVector}).

**Examples**

```julia
julia> A = spdiagm(0 => [1, 2, 3, 4], 1 => [5, 6, 7])
4×4 SparseMatrixCSC{Int64, Int64} with 7 stored entries:
 1  5  ⋅  ⋅
 ⋅  2  6  ⋅
 ⋅  ⋅  3  7
 ⋅  ⋅  ⋅  4

julia> permute(A, [4, 3, 2, 1], [1, 2, 3, 4])
4×4 SparseMatrixCSC{Int64, Int64} with 7 stored entries:
 ⋅  ⋅  ⋅  4
 ⋅  ⋅  3  7
 ⋅  2  6  ⋅
 1  5  ⋅  ⋅

julia> permute(A, [1, 2, 3, 4], [4, 3, 2, 1])
4×4 SparseMatrixCSC{Int64, Int64} with 7 stored entries:
 ⋅  ⋅  5  1
 ⋅  6  2  ⋅
 7  3  ⋅  ⋅
 4  ⋅  ⋅  ⋅
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1715-L1748)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.permute!-Union{Tuple{Tq}, Tuple{Tp}, Tuple{Ti}, Tuple{Tv}, Tuple{SparseMatrixCSC{Tv, Ti}, SparseMatrixCSC{Tv, Ti}, AbstractVector{Tp}, AbstractVector{Tq}}} where {Tv, Ti, Tp<:Integer, Tq<:Integer}' href='#Base.permute!-Union{Tuple{Tq}, Tuple{Tp}, Tuple{Ti}, Tuple{Tv}, Tuple{SparseMatrixCSC{Tv, Ti}, SparseMatrixCSC{Tv, Ti}, AbstractVector{Tp}, AbstractVector{Tq}}} where {Tv, Ti, Tp<:Integer, Tq<:Integer}'>#</a>&nbsp;<b><u>Base.permute!</u></b> &mdash; <i>Method</i>.




```julia
permute!(X::AbstractSparseMatrixCSC{Tv,Ti}, A::AbstractSparseMatrixCSC{Tv,Ti},
         p::AbstractVector{<:Integer}, q::AbstractVector{<:Integer},
         [C::AbstractSparseMatrixCSC{Tv,Ti}]) where {Tv,Ti}
```


Bilaterally permute `A`, storing result `PAQ` (`A[p,q]`) in `X`. Stores intermediate result `(AQ)^T` (`transpose(A[:,q])`) in optional argument `C` if present. Requires that none of `X`, `A`, and, if present, `C` alias each other; to store result `PAQ` back into `A`, use the following method lacking `X`:

```
permute!(A::AbstractSparseMatrixCSC{Tv,Ti}, p::AbstractVector{<:Integer},
         q::AbstractVector{<:Integer}[, C::AbstractSparseMatrixCSC{Tv,Ti},
         [workcolptr::Vector{Ti}]]) where {Tv,Ti}
```


`X`&#39;s dimensions must match those of `A` (`size(X, 1) == size(A, 1)` and `size(X, 2) == size(A, 2)`), and `X` must have enough storage to accommodate all allocated entries in `A` (`length(rowvals(X)) >= nnz(A)` and `length(nonzeros(X)) >= nnz(A)`). Column-permutation `q`&#39;s length must match `A`&#39;s column count (`length(q) == size(A, 2)`). Row-permutation `p`&#39;s length must match `A`&#39;s row count (`length(p) == size(A, 1)`).

`C`&#39;s dimensions must match those of `transpose(A)` (`size(C, 1) == size(A, 2)` and `size(C, 2) == size(A, 1)`), and `C` must have enough storage to accommodate all allocated entries in `A` (`length(rowvals(C)) >= nnz(A)` and `length(nonzeros(C)) >= nnz(A)`).

For additional (algorithmic) information, and for versions of these methods that forgo argument checking, see (unexported) parent methods `unchecked_noalias_permute!` and `unchecked_aliasing_permute!`.

See also [`permute`](/stdlib/SparseArrays#SparseArrays.permute).


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1637-L1666)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.halfperm!' href='#SparseArrays.halfperm!'>#</a>&nbsp;<b><u>SparseArrays.halfperm!</u></b> &mdash; <i>Function</i>.




```julia
halfperm!(X::AbstractSparseMatrixCSC{Tv,Ti}, A::AbstractSparseMatrixCSC{TvA,Ti},
          q::AbstractVector{<:Integer}, f::Function = identity) where {Tv,TvA,Ti}
```


Column-permute and transpose `A`, simultaneously applying `f` to each entry of `A`, storing the result `(f(A)Q)^T` (`map(f, transpose(A[:,q]))`) in `X`.

Element type `Tv` of `X` must match `f(::TvA)`, where `TvA` is the element type of `A`. `X`&#39;s dimensions must match those of `transpose(A)` (`size(X, 1) == size(A, 2)` and `size(X, 2) == size(A, 1)`), and `X` must have enough storage to accommodate all allocated entries in `A` (`length(rowvals(X)) >= nnz(A)` and `length(nonzeros(X)) >= nnz(A)`). Column-permutation `q`&#39;s length must match `A`&#39;s column count (`length(q) == size(A, 2)`).

This method is the parent of several methods performing transposition and permutation operations on [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC)s. As this method performs no argument checking, prefer the safer child methods (`[c]transpose[!]`, `permute[!]`) to direct use.

This method implements the `HALFPERM` algorithm described in F. Gustavson, &quot;Two fast algorithms for sparse matrices: multiplication and permuted transposition,&quot; ACM TOMS 4(3), 250-269 (1978). The algorithm runs in `O(size(A, 1), size(A, 2), nnz(A))` time and requires no space beyond that passed in.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1334-L1355)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SparseArrays.ftranspose!' href='#SparseArrays.ftranspose!'>#</a>&nbsp;<b><u>SparseArrays.ftranspose!</u></b> &mdash; <i>Function</i>.




```julia
ftranspose!(X::AbstractSparseMatrixCSC{Tv,Ti}, A::AbstractSparseMatrixCSC{Tv,Ti}, f::Function) where {Tv,Ti}
```


Transpose `A` and store it in `X` while applying the function `f` to the non-zero elements. Does not remove the zeros created by `f`. `size(X)` must be equal to `size(transpose(A))`. No additional memory is allocated other than resizing the rowval and nzval of `X`, if needed.

See `halfperm!`


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1403-L1411)

</div>
<br>



# Noteworthy External Sparse Packages {#Noteworthy-External-Sparse-Packages}

Several other Julia packages provide sparse matrix implementations that should be mentioned:
1. [SuiteSparseGraphBLAS.jl](https://github.com/JuliaSparse/SuiteSparseGraphBLAS.jl) is a wrapper over the fast, multithreaded SuiteSparse:GraphBLAS C library. On CPU this is typically the fastest option, often significantly outperforming MKLSparse.
  
1. [CUDA.jl](https://github.com/JuliaGPU/CUDA.jl) exposes the [CUSPARSE](https://docs.nvidia.com/cuda/cusparse/index.html) library for GPU sparse matrix operations.
  
1. [SparseMatricesCSR.jl](https://github.com/gridap/SparseMatricesCSR.jl) provides a Julia native implementation of the Compressed Sparse Rows (CSR) format.
  
1. [MKLSparse.jl](https://github.com/JuliaSparse/MKLSparse.jl) accelerates SparseArrays sparse-dense matrix operations using Intel&#39;s MKL library.
  
1. [SparseArrayKit.jl](https://github.com/Jutho/SparseArrayKit.jl) available for multidimensional sparse arrays.
  
1. [LuxurySparse.jl](https://github.com/QuantumBFS/LuxurySparse.jl) provides static sparse array formats, as well as a coordinate format.
  
1. [ExtendableSparse.jl](https://github.com/j-fu/ExtendableSparse.jl) enables fast insertion into sparse matrices using a lazy approach to new stored indices.
  
1. [Finch.jl](https://github.com/willow-ahrens/Finch.jl) supports extensive multidimensional sparse array formats and operations through a mini tensor language and compiler, all in native Julia. Support for COO, CSF, CSR, CSC and more, as well as operations like broadcast, reduce, etc. and custom operations.
  
