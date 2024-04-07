


# Linear Algebra {#man-linalg}



In addition to (and as part of) its support for multi-dimensional arrays, Julia provides native implementations of many common and useful linear algebra operations which can be loaded with `using LinearAlgebra`. Basic operations, such as [`tr`](/stdlib/LinearAlgebra#LinearAlgebra.tr), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), and [`inv`](/base/math#Base.inv-Tuple{Number}) are all supported:

```julia
julia> A = [1 2 3; 4 1 6; 7 8 1]
3×3 Matrix{Int64}:
 1  2  3
 4  1  6
 7  8  1

julia> tr(A)
3

julia> det(A)
104.0

julia> inv(A)
3×3 Matrix{Float64}:
 -0.451923   0.211538    0.0865385
  0.365385  -0.192308    0.0576923
  0.240385   0.0576923  -0.0673077
```


As well as other useful operations, such as finding eigenvalues or eigenvectors:

```julia
julia> A = [-4. -17.; 2. 2.]
2×2 Matrix{Float64}:
 -4.0  -17.0
  2.0    2.0

julia> eigvals(A)
2-element Vector{ComplexF64}:
 -1.0 - 5.0im
 -1.0 + 5.0im

julia> eigvecs(A)
2×2 Matrix{ComplexF64}:
  0.945905-0.0im        0.945905+0.0im
 -0.166924+0.278207im  -0.166924-0.278207im
```


In addition, Julia provides many [factorizations](/stdlib/LinearAlgebra#man-linalg-factorizations) which can be used to speed up problems such as linear solve or matrix exponentiation by pre-factorizing a matrix into a form more amenable (for performance or memory reasons) to the problem. See the documentation on [`factorize`](/stdlib/LinearAlgebra#LinearAlgebra.factorize) for more information. As an example:

```julia
julia> A = [1.5 2 -4; 3 -1 -6; -10 2.3 4]
3×3 Matrix{Float64}:
   1.5   2.0  -4.0
   3.0  -1.0  -6.0
 -10.0   2.3   4.0

julia> factorize(A)
LU{Float64, Matrix{Float64}, Vector{Int64}}
L factor:
3×3 Matrix{Float64}:
  1.0    0.0       0.0
 -0.15   1.0       0.0
 -0.3   -0.132196  1.0
U factor:
3×3 Matrix{Float64}:
 -10.0  2.3     4.0
   0.0  2.345  -3.4
   0.0  0.0    -5.24947
```


Since `A` is not Hermitian, symmetric, triangular, tridiagonal, or bidiagonal, an LU factorization may be the best we can do. Compare with:

```julia
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Matrix{Float64}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> factorize(B)
BunchKaufman{Float64, Matrix{Float64}, Vector{Int64}}
D factor:
3×3 Tridiagonal{Float64, Vector{Float64}}:
 -1.64286   0.0   ⋅
  0.0      -2.8  0.0
   ⋅        0.0  5.0
U factor:
3×3 UnitUpperTriangular{Float64, Matrix{Float64}}:
 1.0  0.142857  -0.8
  ⋅   1.0       -0.6
  ⋅    ⋅         1.0
permutation:
3-element Vector{Int64}:
 1
 2
 3
```


Here, Julia was able to detect that `B` is in fact symmetric, and used a more appropriate factorization. Often it&#39;s possible to write more efficient code for a matrix that is known to have certain properties e.g. it is symmetric, or tridiagonal. Julia provides some special types so that you can &quot;tag&quot; matrices as having these properties. For instance:

```julia
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Matrix{Float64}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> sB = Symmetric(B)
3×3 Symmetric{Float64, Matrix{Float64}}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0
```


`sB` has been tagged as a matrix that&#39;s (real) symmetric, so for later operations we might perform on it, such as eigenfactorization or computing matrix-vector products, efficiencies can be found by only referencing half of it. For example:

```julia
julia> B = [1.5 2 -4; 2 -1 -3; -4 -3 5]
3×3 Matrix{Float64}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> sB = Symmetric(B)
3×3 Symmetric{Float64, Matrix{Float64}}:
  1.5   2.0  -4.0
  2.0  -1.0  -3.0
 -4.0  -3.0   5.0

julia> x = [1; 2; 3]
3-element Vector{Int64}:
 1
 2
 3

julia> sB\x
3-element Vector{Float64}:
 -1.7391304347826084
 -1.1086956521739126
 -1.4565217391304346
```


The `\` operation here performs the linear solution. The left-division operator is pretty powerful and it&#39;s easy to write compact, readable code that is flexible enough to solve all sorts of systems of linear equations.

## Special matrices {#Special-matrices}

[Matrices with special symmetries and structures](https://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=3274) arise often in linear algebra and are frequently associated with various matrix factorizations. Julia features a rich collection of special matrix types, which allow for fast computation with specialized routines that are specially developed for particular matrix types.

The following tables summarize the types of special matrices that have been implemented in Julia, as well as whether hooks to various optimized methods for them in LAPACK are available.

| Type                                                                             | Description                                                                                   |
|:-------------------------------------------------------------------------------- |:--------------------------------------------------------------------------------------------- |
| [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric)                     | [Symmetric matrix](https://en.wikipedia.org/wiki/Symmetric_matrix)                            |
| [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian)                     | [Hermitian matrix](https://en.wikipedia.org/wiki/Hermitian_matrix)                            |
| [`UpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UpperTriangular)         | Upper [triangular matrix](https://en.wikipedia.org/wiki/Triangular_matrix)                    |
| [`UnitUpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UnitUpperTriangular) | Upper [triangular matrix](https://en.wikipedia.org/wiki/Triangular_matrix) with unit diagonal |
| [`LowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.LowerTriangular)         | Lower [triangular matrix](https://en.wikipedia.org/wiki/Triangular_matrix)                    |
| [`UnitLowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UnitLowerTriangular) | Lower [triangular matrix](https://en.wikipedia.org/wiki/Triangular_matrix) with unit diagonal |
| [`UpperHessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.UpperHessenberg)         | Upper [Hessenberg matrix](https://en.wikipedia.org/wiki/Hessenberg_matrix)                    |
| [`Tridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Tridiagonal)                 | [Tridiagonal matrix](https://en.wikipedia.org/wiki/Tridiagonal_matrix)                        |
| [`SymTridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.SymTridiagonal)           | Symmetric tridiagonal matrix                                                                  |
| [`Bidiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Bidiagonal)                   | Upper/lower [bidiagonal matrix](https://en.wikipedia.org/wiki/Bidiagonal_matrix)              |
| [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal)                       | [Diagonal matrix](https://en.wikipedia.org/wiki/Diagonal_matrix)                              |
| [`UniformScaling`](/stdlib/LinearAlgebra#LinearAlgebra.UniformScaling)           | [Uniform scaling operator](https://en.wikipedia.org/wiki/Uniform_scaling)                     |


### Elementary operations {#Elementary-operations}

| Matrix type                                                                      | `+` | `-` | `*` | `\` | Other functions with optimized methods                                                                                                                                                          |
|:-------------------------------------------------------------------------------- |:--- |:--- |:--- |:--- |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric)                     |     |     |     | MV  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`sqrt`](/base/math#Base.sqrt-Tuple{Number}), [`cbrt`](/base/math#Base.Math.cbrt-Tuple{AbstractFloat}), [`exp`](/base/math#Base.exp-Tuple{Float64}) |
| [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian)                     |     |     |     | MV  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`sqrt`](/base/math#Base.sqrt-Tuple{Number}), [`cbrt`](/base/math#Base.Math.cbrt-Tuple{AbstractFloat}), [`exp`](/base/math#Base.exp-Tuple{Float64}) |
| [`UpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UpperTriangular)         |     |     | MV  | MV  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet)                                            |
| [`UnitUpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UnitUpperTriangular) |     |     | MV  | MV  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet)                                            |
| [`LowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.LowerTriangular)         |     |     | MV  | MV  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet)                                            |
| [`UnitLowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UnitLowerTriangular) |     |     | MV  | MV  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet)                                            |
| [`UpperHessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.UpperHessenberg)         |     |     |     | MM  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det)                                                                                                    |
| [`SymTridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.SymTridiagonal)           | M   | M   | MS  | MV  | [`eigmax`](/stdlib/LinearAlgebra#LinearAlgebra.eigmax), [`eigmin`](/stdlib/LinearAlgebra#LinearAlgebra.eigmin)                                                                                  |
| [`Tridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Tridiagonal)                 | M   | M   | MS  | MV  |                                                                                                                                                                                                 |
| [`Bidiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Bidiagonal)                   | M   | M   | MS  | MV  |                                                                                                                                                                                                 |
| [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal)                       | M   | M   | MV  | MV  | [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet), [`/`](/base/math#Base.:/)                 |
| [`UniformScaling`](/stdlib/LinearAlgebra#LinearAlgebra.UniformScaling)           | M   | M   | MVS | MVS | [`/`](/base/math#Base.:/)                                                                                                                                                                       |


Legend:

| Key        | Description                                                   |
|:---------- |:------------------------------------------------------------- |
| M (matrix) | An optimized method for matrix-matrix operations is available |
| V (vector) | An optimized method for matrix-vector operations is available |
| S (scalar) | An optimized method for matrix-scalar operations is available |


### Matrix factorizations {#Matrix-factorizations}

| Matrix type                                                                      | LAPACK | [`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen) | [`eigvals`](/stdlib/LinearAlgebra#LinearAlgebra.eigvals) | [`eigvecs`](/stdlib/LinearAlgebra#LinearAlgebra.eigvecs) | [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd) | [`svdvals`](/stdlib/LinearAlgebra#LinearAlgebra.svdvals) |
|:-------------------------------------------------------------------------------- |:------ |:---------------------------------------------------- |:-------------------------------------------------------- |:-------------------------------------------------------- |:------------------------------------------------ |:-------------------------------------------------------- |
| [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric)                     | SY     |                                                      | ARI                                                      |                                                          |                                                  |                                                          |
| [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian)                     | HE     |                                                      | ARI                                                      |                                                          |                                                  |                                                          |
| [`UpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UpperTriangular)         | TR     | A                                                    | A                                                        | A                                                        |                                                  |                                                          |
| [`UnitUpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UnitUpperTriangular) | TR     | A                                                    | A                                                        | A                                                        |                                                  |                                                          |
| [`LowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.LowerTriangular)         | TR     | A                                                    | A                                                        | A                                                        |                                                  |                                                          |
| [`UnitLowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UnitLowerTriangular) | TR     | A                                                    | A                                                        | A                                                        |                                                  |                                                          |
| [`SymTridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.SymTridiagonal)           | ST     | A                                                    | ARI                                                      | AV                                                       |                                                  |                                                          |
| [`Tridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Tridiagonal)                 | GT     |                                                      |                                                          |                                                          |                                                  |                                                          |
| [`Bidiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Bidiagonal)                   | BD     |                                                      |                                                          |                                                          | A                                                | A                                                        |
| [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal)                       | DI     |                                                      | A                                                        |                                                          |                                                  |                                                          |


Legend:

| Key          | Description                                                                                                                     | Example              |
|:------------ |:------------------------------------------------------------------------------------------------------------------------------- |:-------------------- |
| A (all)      | An optimized method to find all the characteristic values and/or vectors is available                                           | e.g. `eigvals(M)`    |
| R (range)    | An optimized method to find the `il`th through the `ih`th characteristic values are available                                   | `eigvals(M, il, ih)` |
| I (interval) | An optimized method to find the characteristic values in the interval [`vl`, `vh`] is available                                 | `eigvals(M, vl, vh)` |
| V (vectors)  | An optimized method to find the characteristic vectors corresponding to the characteristic values `x=[x1, x2,...]` is available | `eigvecs(M, x)`      |


### The uniform scaling operator {#The-uniform-scaling-operator}

A [`UniformScaling`](/stdlib/LinearAlgebra#LinearAlgebra.UniformScaling) operator represents a scalar times the identity operator, `λ*I`. The identity operator `I` is defined as a constant and is an instance of `UniformScaling`. The size of these operators are generic and match the other matrix in the binary operations [`+`](/base/math#Base.:+), [`-`](/base/math#Base.:--Tuple{Any}), [`*`](/base/math#Base.:*-Tuple{Any,%20Vararg{Any}}) and [`\`](/base/math#Base.:\-Tuple{Any,%20Any}). For `A+I` and `A-I` this means that `A` must be square. Multiplication with the identity operator `I` is a noop (except for checking that the scaling factor is one) and therefore almost without overhead.

To see the `UniformScaling` operator in action:

```julia
julia> U = UniformScaling(2);

julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> a + U
2×2 Matrix{Int64}:
 3  2
 3  6

julia> a * U
2×2 Matrix{Int64}:
 2  4
 6  8

julia> [a U]
2×4 Matrix{Int64}:
 1  2  2  0
 3  4  0  2

julia> b = [1 2 3; 4 5 6]
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> b - U
ERROR: DimensionMismatch: matrix is not square: dimensions are (2, 3)
Stacktrace:
[...]
```


If you need to solve many systems of the form `(A+μI)x = b` for the same `A` and different `μ`, it might be beneficial to first compute the Hessenberg factorization `F` of `A` via the [`hessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.hessenberg) function. Given `F`, Julia employs an efficient algorithm for `(F+μ*I) \ b` (equivalent to `(A+μ*I)x \ b`) and related operations like determinants.

## Matrix factorizations {#man-linalg-factorizations}

[Matrix factorizations (a.k.a. matrix decompositions)](https://en.wikipedia.org/wiki/Matrix_decomposition) compute the factorization of a matrix into a product of matrices, and are one of the central concepts in (numerical) linear algebra.

The following table summarizes the types of matrix factorizations that have been implemented in Julia. Details of their associated methods can be found in the [Standard functions](/stdlib/LinearAlgebra#Standard-functions) section of the Linear Algebra documentation.

| Type               | Description                                                                                                                       |
|:------------------ |:--------------------------------------------------------------------------------------------------------------------------------- |
| `BunchKaufman`     | Bunch-Kaufman factorization                                                                                                       |
| `Cholesky`         | [Cholesky factorization](https://en.wikipedia.org/wiki/Cholesky_decomposition)                                                    |
| `CholeskyPivoted`  | [Pivoted](https://en.wikipedia.org/wiki/Pivot_element) Cholesky factorization                                                     |
| `LDLt`             | [LDL(T) factorization](https://en.wikipedia.org/wiki/Cholesky_decomposition#LDL_decomposition)                                    |
| `LU`               | [LU factorization](https://en.wikipedia.org/wiki/LU_decomposition)                                                                |
| `QR`               | [QR factorization](https://en.wikipedia.org/wiki/QR_decomposition)                                                                |
| `QRCompactWY`      | Compact WY form of the QR factorization                                                                                           |
| `QRPivoted`        | Pivoted [QR factorization](https://en.wikipedia.org/wiki/QR_decomposition)                                                        |
| `LQ`               | [QR factorization](https://en.wikipedia.org/wiki/QR_decomposition) of `transpose(A)`                                              |
| `Hessenberg`       | [Hessenberg decomposition](https://mathworld.wolfram.com/HessenbergDecomposition.html)                                            |
| `Eigen`            | [Spectral decomposition](https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix)                                            |
| `GeneralizedEigen` | [Generalized spectral decomposition](https://en.wikipedia.org/wiki/Eigendecomposition_of_a_matrix#Generalized_eigenvalue_problem) |
| `SVD`              | [Singular value decomposition](https://en.wikipedia.org/wiki/Singular_value_decomposition)                                        |
| `GeneralizedSVD`   | [Generalized SVD](https://en.wikipedia.org/wiki/Generalized_singular_value_decomposition#Higher_order_version)                    |
| `Schur`            | [Schur decomposition](https://en.wikipedia.org/wiki/Schur_decomposition)                                                          |
| `GeneralizedSchur` | [Generalized Schur decomposition](https://en.wikipedia.org/wiki/Schur_decomposition#Generalized_Schur_decomposition)              |


Adjoints and transposes of [`Factorization`](/stdlib/LinearAlgebra#LinearAlgebra.Factorization) objects are lazily wrapped in `AdjointFactorization` and `TransposeFactorization` objects, respectively. Generically, transpose of real `Factorization`s are wrapped as `AdjointFactorization`.

## Orthogonal matrices (`AbstractQ`) {#man-linalg-abstractq}

Some matrix factorizations generate orthogonal/unitary &quot;matrix&quot; factors. These factorizations include QR-related factorizations obtained from calls to [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr), i.e., `QR`, `QRCompactWY` and `QRPivoted`, the Hessenberg factorization obtained from calls to [`hessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.hessenberg), and the LQ factorization obtained from [`lq`](/stdlib/LinearAlgebra#LinearAlgebra.lq). While these orthogonal/unitary factors admit a matrix representation, their internal representation is, for performance and memory reasons, different. Hence, they should be rather viewed as matrix-backed, function-based linear operators. In particular, reading, for instance, a column of its matrix representation requires running &quot;matrix&quot;-vector multiplication code, rather than simply reading out data from memory (possibly filling parts of the vector with structural zeros). Another clear distinction from other, non-triangular matrix types is that the underlying multiplication code allows for in-place modification during multiplication. Furthermore, objects of specific `AbstractQ` subtypes as those created via [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr), [`hessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.hessenberg) and [`lq`](/stdlib/LinearAlgebra#LinearAlgebra.lq) can behave like a square or a rectangular matrix depending on context:

```julia
julia> using LinearAlgebra

julia> Q = qr(rand(3,2)).Q
3×3 LinearAlgebra.QRCompactWYQ{Float64, Matrix{Float64}, Matrix{Float64}}

julia> Matrix(Q)
3×2 Matrix{Float64}:
 -0.320597   0.865734
 -0.765834  -0.475694
 -0.557419   0.155628

julia> Q*I
3×3 Matrix{Float64}:
 -0.320597   0.865734  -0.384346
 -0.765834  -0.475694  -0.432683
 -0.557419   0.155628   0.815514

julia> Q*ones(2)
3-element Vector{Float64}:
  0.5451367118802273
 -1.241527373086654
 -0.40179067589600226

julia> Q*ones(3)
3-element Vector{Float64}:
  0.16079054743832022
 -1.674209978965636
  0.41372375588835797

julia> ones(1,2) * Q'
1×3 Matrix{Float64}:
 0.545137  -1.24153  -0.401791

julia> ones(1,3) * Q'
1×3 Matrix{Float64}:
 0.160791  -1.67421  0.413724
```


Due to this distinction from dense or structured matrices, the abstract `AbstractQ` type does not subtype `AbstractMatrix`, but instead has its own type hierarchy. Custom types that subtype `AbstractQ` can rely on generic fallbacks if the following interface is satisfied. For example, for

```julia
struct MyQ{T} <: LinearAlgebra.AbstractQ{T}
    # required fields
end
```


provide overloads for

```julia
Base.size(Q::MyQ) # size of corresponding square matrix representation
Base.convert(::Type{AbstractQ{T}}, Q::MyQ) # eltype promotion [optional]
LinearAlgebra.lmul!(Q::MyQ, x::AbstractVecOrMat) # left-multiplication
LinearAlgebra.rmul!(A::AbstractMatrix, Q::MyQ) # right-multiplication
```


If `eltype` promotion is not of interest, the `convert` method is unnecessary, since by default `convert(::Type{AbstractQ{T}}, Q::AbstractQ{T})` returns `Q` itself. Adjoints of `AbstractQ`-typed objects are lazily wrapped in an `AdjointQ` wrapper type, which requires its own `LinearAlgebra.lmul!` and `LinearAlgebra.rmul!` methods. Given this set of methods, any `Q::MyQ` can be used like a matrix, preferably in a multiplicative context: multiplication via `*` with scalars, vectors and matrices from left and right, obtaining a matrix representation of `Q` via `Matrix(Q)` (or `Q*I`) and indexing into the matrix representation all work. In contrast, addition and subtraction as well as more generally broadcasting over elements in the matrix representation fail because that would be highly inefficient. For such use cases, consider computing the matrix representation up front and cache it for future reuse.

## Pivoting Strategies {#man-linalg-pivoting-strategies}

Several of Julia&#39;s [matrix factorizations](/stdlib/LinearAlgebra#man-linalg-factorizations) support [pivoting](https://en.wikipedia.org/wiki/Pivot_element), which can be used to improve their numerical stability. In fact, some matrix factorizations, such as the LU factorization, may fail without pivoting.

In pivoting, first, a [pivot element](https://en.wikipedia.org/wiki/Pivot_element) with good numerical properties is chosen based on a pivoting strategy. Next, the rows and columns of the original matrix are permuted to bring the chosen element in place for subsequent computation. Furthermore, the process is repeated for each stage of the factorization.

Consequently, besides the conventional matrix factors, the outputs of pivoted factorization schemes also include permutation matrices.

In the following, the pivoting strategies implemented in Julia are briefly described. Note that not all matrix factorizations may support them. Consult the documentation of the respective [matrix factorization](/stdlib/LinearAlgebra#man-linalg-factorizations) for details on the supported pivoting strategies.

See also [`LinearAlgebra.ZeroPivotException`](/stdlib/LinearAlgebra#LinearAlgebra.ZeroPivotException).
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.NoPivot' href='#LinearAlgebra.NoPivot'>#</a>&nbsp;<b><u>LinearAlgebra.NoPivot</u></b> &mdash; <i>Type</i>.




```julia
NoPivot
```


Pivoting is not performed. Matrix factorizations such as the LU factorization may fail without pivoting, and may also be numerically unstable for floating-point matrices in the face of roundoff error. This pivot strategy is mainly useful for pedagogical purposes.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L197-L203)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.RowNonZero' href='#LinearAlgebra.RowNonZero'>#</a>&nbsp;<b><u>LinearAlgebra.RowNonZero</u></b> &mdash; <i>Type</i>.




```julia
RowNonZero
```


First non-zero element in the remaining rows is chosen as the pivot element.

Beware that for floating-point matrices, the resulting LU algorithm is numerically unstable — this strategy is mainly useful for comparison to hand calculations (which typically use this strategy) or for other algebraic types (e.g. rational numbers) not susceptible to roundoff errors.   Otherwise, the default `RowMaximum` pivoting strategy should be generally preferred in Gaussian elimination.

Note that the [element type](/base/collections#Base.eltype) of the matrix must admit an [`iszero`](/base/numbers#Base.iszero) method.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L206-L218)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.RowMaximum' href='#LinearAlgebra.RowMaximum'>#</a>&nbsp;<b><u>LinearAlgebra.RowMaximum</u></b> &mdash; <i>Type</i>.




```julia
RowMaximum
```


The maximum-magnitude element in the remaining rows is chosen as the pivot element. This is the default strategy for LU factorization of floating-point matrices, and is sometimes referred to as the &quot;partial pivoting&quot; algorithm.

Note that the [element type](/base/collections#Base.eltype) of the matrix must admit an [`abs`](/base/math#Base.abs) method, whose result type must admit a [`<`](/base/math#Base.:<) method.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L221-L230)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ColumnNorm' href='#LinearAlgebra.ColumnNorm'>#</a>&nbsp;<b><u>LinearAlgebra.ColumnNorm</u></b> &mdash; <i>Type</i>.




```julia
ColumnNorm
```


The column with the maximum norm is used for subsequent computation.  This is used for pivoted QR factorization.

Note that the [element type](/base/collections#Base.eltype) of the matrix must admit [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm) and [`abs`](/base/math#Base.abs) methods, whose respective result types must admit a [`<`](/base/math#Base.:<) method.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L233-L241)

</div>
<br>

## Standard functions {#Standard-functions}

Linear algebra functions in Julia are largely implemented by calling functions from [LAPACK](https://www.netlib.org/lapack/). Sparse matrix factorizations call functions from [SuiteSparse](http://suitesparse.com). Other sparse solvers are available as Julia packages.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:*-Tuple{AbstractMatrix, AbstractMatrix}' href='#Base.:*-Tuple{AbstractMatrix, AbstractMatrix}'>#</a>&nbsp;<b><u>Base.:*</u></b> &mdash; <i>Method</i>.




```julia
*(A::AbstractMatrix, B::AbstractMatrix)
```


Matrix multiplication.

**Examples**

```julia
julia> [1 1; 0 1] * [1 0; 1 1]
2×2 Matrix{Int64}:
 2  1
 1  1
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L99-L111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:*-Tuple{AbstractMatrix, AbstractMatrix, AbstractVector}' href='#Base.:*-Tuple{AbstractMatrix, AbstractMatrix, AbstractVector}'>#</a>&nbsp;<b><u>Base.:*</u></b> &mdash; <i>Method</i>.




```julia
*(A, B::AbstractMatrix, C)
A * B * C * D
```


Chained multiplication of 3 or 4 matrices is done in the most efficient sequence, based on the sizes of the arrays. That is, the number of scalar multiplications needed for `(A * B) * C` (with 3 dense matrices) is compared to that for `A * (B * C)` to choose which of these to execute.

If the last factor is a vector, or the first a transposed vector, then it is efficient to deal with these first. In particular `x' * B * y` means `(x' * B) * y` for an ordinary column-major `B::Matrix`. Unlike `dot(x, B, y)`, this allocates an intermediate array.

If the first or last factor is a number, this will be fused with the matrix multiplication, using 5-arg [`mul!`](/stdlib/LinearAlgebra#LinearAlgebra.mul!).

See also [`muladd`](/base/math#Base.muladd), [`dot`](/stdlib/LinearAlgebra#LinearAlgebra.dot).

::: tip Julia 1.7

These optimisations require at least Julia 1.7.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L1057-L1078)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:\-Tuple{AbstractMatrix, AbstractVecOrMat}' href='#Base.:\-Tuple{AbstractMatrix, AbstractVecOrMat}'>#</a>&nbsp;<b><u>Base.:\</u></b> &mdash; <i>Method</i>.




```julia
\(A, B)
```


Matrix division using a polyalgorithm. For input matrices `A` and `B`, the result `X` is such that `A*X == B` when `A` is square. The solver that is used depends upon the structure of `A`.  If `A` is upper or lower triangular (or diagonal), no factorization of `A` is required and the system is solved with either forward or backward substitution. For non-triangular square matrices, an LU factorization is used.

For rectangular `A` the result is the minimum-norm least squares solution computed by a pivoted QR factorization of `A` and a rank estimate of `A` based on the R factor.

When `A` is sparse, a similar polyalgorithm is used. For indefinite matrices, the `LDLt` factorization does not use pivoting during the numerical factorization and therefore the procedure can fail even for invertible matrices.

See also: [`factorize`](/stdlib/LinearAlgebra#LinearAlgebra.factorize), [`pinv`](/stdlib/LinearAlgebra#LinearAlgebra.pinv).

**Examples**

```julia
julia> A = [1 0; 1 -2]; B = [32; -4];

julia> X = A \ B
2-element Vector{Float64}:
 32.0
 18.0

julia> A * X == B
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1087-L1117)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:/-Tuple{AbstractVecOrMat, AbstractVecOrMat}' href='#Base.:/-Tuple{AbstractVecOrMat, AbstractVecOrMat}'>#</a>&nbsp;<b><u>Base.:/</u></b> &mdash; <i>Method</i>.




```julia
A / B
```


Matrix right-division: `A / B` is equivalent to `(B' \ A')'` where [`\`](/base/math#Base.:\-Tuple{Any,%20Any}) is the left-division operator. For square matrices, the result `X` is such that `A == X*B`.

See also: [`rdiv!`](/stdlib/LinearAlgebra#LinearAlgebra.rdiv!).

**Examples**

```julia
julia> A = Float64[1 4 5; 3 9 2]; B = Float64[1 4 2; 3 4 2; 8 7 1];

julia> X = A / B
2×3 Matrix{Float64}:
 -0.65   3.75  -1.2
  3.25  -2.75   1.0

julia> isapprox(A, X*B)
true

julia> isapprox(X, A*pinv(B))
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1138-L1161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.SingularException' href='#LinearAlgebra.SingularException'>#</a>&nbsp;<b><u>LinearAlgebra.SingularException</u></b> &mdash; <i>Type</i>.




```julia
SingularException
```


Exception thrown when the input matrix has one or more zero-valued eigenvalues, and is not invertible. A linear solve involving such a matrix cannot be computed. The `info` field indicates the location of (one of) the singular value(s).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/exceptions.jl#L20-L26)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.PosDefException' href='#LinearAlgebra.PosDefException'>#</a>&nbsp;<b><u>LinearAlgebra.PosDefException</u></b> &mdash; <i>Type</i>.




```julia
PosDefException
```


Exception thrown when the input matrix was not [positive definite](https://en.wikipedia.org/wiki/Definiteness_of_a_matrix). Some linear algebra functions and factorizations are only applicable to positive definite matrices. The `info` field indicates the location of (one of) the eigenvalue(s) which is (are) less than/equal to 0.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/exceptions.jl#L31-L37)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ZeroPivotException' href='#LinearAlgebra.ZeroPivotException'>#</a>&nbsp;<b><u>LinearAlgebra.ZeroPivotException</u></b> &mdash; <i>Type</i>.




```julia
ZeroPivotException <: Exception
```


Exception thrown when a matrix factorization/solve encounters a zero in a pivot (diagonal) position and cannot proceed.  This may _not_ mean that the matrix is singular: it may be fruitful to switch to a different factorization such as pivoted LU that can re-order variables to eliminate spurious zero pivots. The `info` field indicates the location of (one of) the zero pivot(s).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/exceptions.jl#L62-L70)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.RankDeficientException' href='#LinearAlgebra.RankDeficientException'>#</a>&nbsp;<b><u>LinearAlgebra.RankDeficientException</u></b> &mdash; <i>Type</i>.




```julia
RankDeficientException
```


Exception thrown when the input matrix is [rank deficient](https://en.wikipedia.org/wiki/Rank_(linear_algebra)). Some linear algebra functions, such as the Cholesky decomposition, are only applicable to matrices that are not rank deficient. The `info` field indicates the computed rank of the matrix.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/exceptions.jl#L51-L57)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACKException' href='#LinearAlgebra.LAPACKException'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACKException</u></b> &mdash; <i>Type</i>.




```julia
LAPACKException
```


Generic LAPACK exception thrown either during direct calls to the [LAPACK functions](/stdlib/LinearAlgebra#man-linalg-lapack-functions) or during calls to other functions that use the LAPACK functions internally but lack specialized error handling. The `info` field contains additional information on the underlying error and depends on the LAPACK function that was invoked.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/exceptions.jl#L9-L15)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.dot' href='#LinearAlgebra.dot'>#</a>&nbsp;<b><u>LinearAlgebra.dot</u></b> &mdash; <i>Function</i>.




```julia
dot(x, y)
x ⋅ y
```


Compute the dot product between two vectors. For complex vectors, the first vector is conjugated.

`dot` also works on arbitrary iterable objects, including arrays of any dimension, as long as `dot` is defined on the elements.

`dot` is semantically equivalent to `sum(dot(vx,vy) for (vx,vy) in zip(x, y))`, with the added restriction that the arguments must have equal lengths.

`x ⋅ y` (where `⋅` can be typed by tab-completing `\cdot` in the REPL) is a synonym for `dot(x, y)`.

**Examples**

```julia
julia> dot([1; 1], [2; 3])
5

julia> dot([im; im], [1; 1])
0 - 2im

julia> dot(1:5, 2:6)
70

julia> x = fill(2., (5,5));

julia> y = fill(3., (5,5));

julia> dot(x, y)
150.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L816-L850)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.dot-Tuple{Any, Any, Any}' href='#LinearAlgebra.dot-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.dot</u></b> &mdash; <i>Method</i>.




```julia
dot(x, A, y)
```


Compute the generalized dot product `dot(x, A*y)` between two vectors `x` and `y`, without storing the intermediate result of `A*y`. As for the two-argument [`dot(_,_)`](/stdlib/LinearAlgebra#LinearAlgebra.dot), this acts recursively. Moreover, for complex vectors, the first vector is conjugated.

::: tip Julia 1.4

Three-argument `dot` requires at least Julia 1.4.

:::

**Examples**

```julia
julia> dot([1; 1], [1 2; 3 4], [2; 3])
26

julia> dot(1:5, reshape(1:25, 5, 5), 2:6)
4850

julia> ⋅(1:5, reshape(1:25, 5, 5), 2:6) == dot(1:5, reshape(1:25, 5, 5), 2:6)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L906-L928)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.cross' href='#LinearAlgebra.cross'>#</a>&nbsp;<b><u>LinearAlgebra.cross</u></b> &mdash; <i>Function</i>.




```julia
cross(x, y)
×(x,y)
```


Compute the cross product of two 3-vectors.

**Examples**

```julia
julia> a = [0;1;0]
3-element Vector{Int64}:
 0
 1
 0

julia> b = [0;0;1]
3-element Vector{Int64}:
 0
 0
 1

julia> cross(a,b)
3-element Vector{Int64}:
 1
 0
 0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L289-L315)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.axpy!' href='#LinearAlgebra.axpy!'>#</a>&nbsp;<b><u>LinearAlgebra.axpy!</u></b> &mdash; <i>Function</i>.




```julia
axpy!(α, x::AbstractArray, y::AbstractArray)
```


Overwrite `y` with `x * α + y` and return `y`. If `x` and `y` have the same axes, it&#39;s equivalent with `y .+= x .* a`.

**Examples**

```julia
julia> x = [1; 2; 3];

julia> y = [4; 5; 6];

julia> axpy!(2, x, y)
3-element Vector{Int64}:
  6
  9
 12
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1445-L1463)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.axpby!' href='#LinearAlgebra.axpby!'>#</a>&nbsp;<b><u>LinearAlgebra.axpby!</u></b> &mdash; <i>Function</i>.




```julia
axpby!(α, x::AbstractArray, β, y::AbstractArray)
```


Overwrite `y` with `x * α + y * β` and return `y`. If `x` and `y` have the same axes, it&#39;s equivalent with `y .= x .* a .+ y .* β`.

**Examples**

```julia
julia> x = [1; 2; 3];

julia> y = [4; 5; 6];

julia> axpby!(2, x, 2, y)
3-element Vector{Int64}:
 10
 14
 18
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1491-L1509)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.rotate!' href='#LinearAlgebra.rotate!'>#</a>&nbsp;<b><u>LinearAlgebra.rotate!</u></b> &mdash; <i>Function</i>.




```julia
rotate!(x, y, c, s)
```


Overwrite `x` with `c*x + s*y` and `y` with `-conj(s)*x + c*y`. Returns `x` and `y`.

::: tip Julia 1.5

`rotate!` requires at least Julia 1.5.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1539-L1547)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.reflect!' href='#LinearAlgebra.reflect!'>#</a>&nbsp;<b><u>LinearAlgebra.reflect!</u></b> &mdash; <i>Function</i>.




```julia
reflect!(x, y, c, s)
```


Overwrite `x` with `c*x + s*y` and `y` with `conj(s)*x - c*y`. Returns `x` and `y`.

::: tip Julia 1.5

`reflect!` requires at least Julia 1.5.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1562-L1570)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.factorize' href='#LinearAlgebra.factorize'>#</a>&nbsp;<b><u>LinearAlgebra.factorize</u></b> &mdash; <i>Function</i>.




```julia
factorize(A)
```


Compute a convenient factorization of `A`, based upon the type of the input matrix. `factorize` checks `A` to see if it is symmetric/triangular/etc. if `A` is passed as a generic matrix. `factorize` checks every element of `A` to verify/rule out each property. It will short-circuit as soon as it can rule out symmetry/triangular structure. The return value can be reused for efficient solving of multiple systems. For example: `A=factorize(A); x=A\b; y=A\C`.

| Properties of `A`          | type of factorization                                                                  |
|:-------------------------- |:-------------------------------------------------------------------------------------- |
| Positive-definite          | Cholesky (see [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky))              |
| Dense Symmetric/Hermitian  | Bunch-Kaufman (see [`bunchkaufman`](/stdlib/LinearAlgebra#LinearAlgebra.bunchkaufman)) |
| Sparse Symmetric/Hermitian | LDLt (see [`ldlt`](/stdlib/LinearAlgebra#LinearAlgebra.ldlt))                          |
| Triangular                 | Triangular                                                                             |
| Diagonal                   | Diagonal                                                                               |
| Bidiagonal                 | Bidiagonal                                                                             |
| Tridiagonal                | LU (see [`lu`](/stdlib/LinearAlgebra#LinearAlgebra.lu))                                |
| Symmetric real tridiagonal | LDLt (see [`ldlt`](/stdlib/LinearAlgebra#LinearAlgebra.ldlt))                          |
| General square             | LU (see [`lu`](/stdlib/LinearAlgebra#LinearAlgebra.lu))                                |
| General non-square         | QR (see [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr))                                |


If `factorize` is called on a Hermitian positive-definite matrix, for instance, then `factorize` will return a Cholesky factorization.

**Examples**

```julia
julia> A = Array(Bidiagonal(fill(1.0, (5, 5)), :U))
5×5 Matrix{Float64}:
 1.0  1.0  0.0  0.0  0.0
 0.0  1.0  1.0  0.0  0.0
 0.0  0.0  1.0  1.0  0.0
 0.0  0.0  0.0  1.0  1.0
 0.0  0.0  0.0  0.0  1.0

julia> factorize(A) # factorize will check to see that A is already factorized
5×5 Bidiagonal{Float64, Vector{Float64}}:
 1.0  1.0   ⋅    ⋅    ⋅
  ⋅   1.0  1.0   ⋅    ⋅
  ⋅    ⋅   1.0  1.0   ⋅
  ⋅    ⋅    ⋅   1.0  1.0
  ⋅    ⋅    ⋅    ⋅   1.0
```


This returns a `5×5 Bidiagonal{Float64}`, which can now be passed to other linear algebra functions (e.g. eigensolvers) which will use specialized methods for `Bidiagonal` types.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1372-L1418)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Diagonal' href='#LinearAlgebra.Diagonal'>#</a>&nbsp;<b><u>LinearAlgebra.Diagonal</u></b> &mdash; <i>Type</i>.




```julia
Diagonal(V::AbstractVector)
```


Construct a lazy matrix with `V` as its diagonal.

See also [`UniformScaling`](/stdlib/LinearAlgebra#LinearAlgebra.UniformScaling) for the lazy identity matrix `I`, [`diagm`](/stdlib/LinearAlgebra#LinearAlgebra.diagm) to make a dense matrix, and [`diag`](/stdlib/LinearAlgebra#LinearAlgebra.diag) to extract diagonal elements.

**Examples**

```julia
julia> d = Diagonal([1, 10, 100])
3×3 Diagonal{Int64, Vector{Int64}}:
 1   ⋅    ⋅
 ⋅  10    ⋅
 ⋅   ⋅  100

julia> diagm([7, 13])
2×2 Matrix{Int64}:
 7   0
 0  13

julia> ans + I
2×2 Matrix{Int64}:
 8   0
 0  14

julia> I(2)
2×2 Diagonal{Bool, Vector{Bool}}:
 1  ⋅
 ⋅  1
```


::: tip Note

A one-column matrix is not treated like a vector, but instead calls the method `Diagonal(A::AbstractMatrix)` which extracts 1-element `diag(A)`:

:::

```julia
julia> A = transpose([7.0 13.0])
2×1 transpose(::Matrix{Float64}) with eltype Float64:
  7.0
 13.0

julia> Diagonal(A)
1×1 Diagonal{Float64, Vector{Float64}}:
 7.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/diagonal.jl#L23-L69)



```julia
Diagonal(A::AbstractMatrix)
```


Construct a matrix from the principal diagonal of `A`. The input matrix `A` may be rectangular, but the output will be square.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> D = Diagonal(A)
2×2 Diagonal{Int64, Vector{Int64}}:
 1  ⋅
 ⋅  4

julia> A = [1 2 3; 4 5 6]
2×3 Matrix{Int64}:
 1  2  3
 4  5  6

julia> Diagonal(A)
2×2 Diagonal{Int64, Vector{Int64}}:
 1  ⋅
 ⋅  5
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/diagonal.jl#L72-L101)



```julia
Diagonal{T}(undef, n)
```


Construct an uninitialized `Diagonal{T}` of length `n`. See `undef`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/diagonal.jl#L129-L133)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Bidiagonal' href='#LinearAlgebra.Bidiagonal'>#</a>&nbsp;<b><u>LinearAlgebra.Bidiagonal</u></b> &mdash; <i>Type</i>.




```julia
Bidiagonal(dv::V, ev::V, uplo::Symbol) where V <: AbstractVector
```


Constructs an upper (`uplo=:U`) or lower (`uplo=:L`) bidiagonal matrix using the given diagonal (`dv`) and off-diagonal (`ev`) vectors. The result is of type `Bidiagonal` and provides efficient specialized linear solvers, but may be converted into a regular matrix with [`convert(Array, _)`](/base/base#Base.convert) (or `Array(_)` for short). The length of `ev` must be one less than the length of `dv`.

**Examples**

```julia
julia> dv = [1, 2, 3, 4]
4-element Vector{Int64}:
 1
 2
 3
 4

julia> ev = [7, 8, 9]
3-element Vector{Int64}:
 7
 8
 9

julia> Bu = Bidiagonal(dv, ev, :U) # ev is on the first superdiagonal
4×4 Bidiagonal{Int64, Vector{Int64}}:
 1  7  ⋅  ⋅
 ⋅  2  8  ⋅
 ⋅  ⋅  3  9
 ⋅  ⋅  ⋅  4

julia> Bl = Bidiagonal(dv, ev, :L) # ev is on the first subdiagonal
4×4 Bidiagonal{Int64, Vector{Int64}}:
 1  ⋅  ⋅  ⋅
 7  2  ⋅  ⋅
 ⋅  8  3  ⋅
 ⋅  ⋅  9  4
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/bidiag.jl#L29-L67)



```julia
Bidiagonal(A, uplo::Symbol)
```


Construct a `Bidiagonal` matrix from the main diagonal of `A` and its first super- (if `uplo=:U`) or sub-diagonal (if `uplo=:L`).

**Examples**

```julia
julia> A = [1 1 1 1; 2 2 2 2; 3 3 3 3; 4 4 4 4]
4×4 Matrix{Int64}:
 1  1  1  1
 2  2  2  2
 3  3  3  3
 4  4  4  4

julia> Bidiagonal(A, :U) # contains the main diagonal and first superdiagonal of A
4×4 Bidiagonal{Int64, Vector{Int64}}:
 1  1  ⋅  ⋅
 ⋅  2  2  ⋅
 ⋅  ⋅  3  3
 ⋅  ⋅  ⋅  4

julia> Bidiagonal(A, :L) # contains the main diagonal and first subdiagonal of A
4×4 Bidiagonal{Int64, Vector{Int64}}:
 1  ⋅  ⋅  ⋅
 2  2  ⋅  ⋅
 ⋅  3  3  ⋅
 ⋅  ⋅  4  4
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/bidiag.jl#L82-L111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.SymTridiagonal' href='#LinearAlgebra.SymTridiagonal'>#</a>&nbsp;<b><u>LinearAlgebra.SymTridiagonal</u></b> &mdash; <i>Type</i>.




```julia
SymTridiagonal(dv::V, ev::V) where V <: AbstractVector
```


Construct a symmetric tridiagonal matrix from the diagonal (`dv`) and first sub/super-diagonal (`ev`), respectively. The result is of type `SymTridiagonal` and provides efficient specialized eigensolvers, but may be converted into a regular matrix with [`convert(Array, _)`](/base/base#Base.convert) (or `Array(_)` for short).

For `SymTridiagonal` block matrices, the elements of `dv` are symmetrized. The argument `ev` is interpreted as the superdiagonal. Blocks from the subdiagonal are (materialized) transpose of the corresponding superdiagonal blocks.

**Examples**

```julia
julia> dv = [1, 2, 3, 4]
4-element Vector{Int64}:
 1
 2
 3
 4

julia> ev = [7, 8, 9]
3-element Vector{Int64}:
 7
 8
 9

julia> SymTridiagonal(dv, ev)
4×4 SymTridiagonal{Int64, Vector{Int64}}:
 1  7  ⋅  ⋅
 7  2  8  ⋅
 ⋅  8  3  9
 ⋅  ⋅  9  4

julia> A = SymTridiagonal(fill([1 2; 3 4], 3), fill([1 2; 3 4], 2));

julia> A[1,1]
2×2 Symmetric{Int64, Matrix{Int64}}:
 1  2
 2  4

julia> A[1,2]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> A[2,1]
2×2 Matrix{Int64}:
 1  3
 2  4
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/tridiag.jl#L18-L69)



```julia
SymTridiagonal(A::AbstractMatrix)
```


Construct a symmetric tridiagonal matrix from the diagonal and first superdiagonal of the symmetric matrix `A`.

**Examples**

```julia
julia> A = [1 2 3; 2 4 5; 3 5 6]
3×3 Matrix{Int64}:
 1  2  3
 2  4  5
 3  5  6

julia> SymTridiagonal(A)
3×3 SymTridiagonal{Int64, Vector{Int64}}:
 1  2  ⋅
 2  4  5
 ⋅  5  6

julia> B = reshape([[1 2; 2 3], [1 2; 3 4], [1 3; 2 4], [1 2; 2 3]], 2, 2);

julia> SymTridiagonal(B)
2×2 SymTridiagonal{Matrix{Int64}, Vector{Matrix{Int64}}}:
 [1 2; 2 3]  [1 3; 2 4]
 [1 2; 3 4]  [1 2; 2 3]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/tridiag.jl#L82-L109)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Tridiagonal' href='#LinearAlgebra.Tridiagonal'>#</a>&nbsp;<b><u>LinearAlgebra.Tridiagonal</u></b> &mdash; <i>Type</i>.




```julia
Tridiagonal(dl::V, d::V, du::V) where V <: AbstractVector
```


Construct a tridiagonal matrix from the first subdiagonal, diagonal, and first superdiagonal, respectively. The result is of type `Tridiagonal` and provides efficient specialized linear solvers, but may be converted into a regular matrix with [`convert(Array, _)`](/base/base#Base.convert) (or `Array(_)` for short). The lengths of `dl` and `du` must be one less than the length of `d`.

::: tip Note

The subdiagonal `dl` and the superdiagonal `du` must not be aliased to each other. If aliasing is detected, the constructor will use a copy of `du` as its argument.

:::

**Examples**

```julia
julia> dl = [1, 2, 3];

julia> du = [4, 5, 6];

julia> d = [7, 8, 9, 0];

julia> Tridiagonal(dl, d, du)
4×4 Tridiagonal{Int64, Vector{Int64}}:
 7  4  ⋅  ⋅
 1  8  5  ⋅
 ⋅  2  9  6
 ⋅  ⋅  3  0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/tridiag.jl#L495-L523)



```julia
Tridiagonal(A)
```


Construct a tridiagonal matrix from the first sub-diagonal, diagonal and first super-diagonal of the matrix `A`.

**Examples**

```julia
julia> A = [1 2 3 4; 1 2 3 4; 1 2 3 4; 1 2 3 4]
4×4 Matrix{Int64}:
 1  2  3  4
 1  2  3  4
 1  2  3  4
 1  2  3  4

julia> Tridiagonal(A)
4×4 Tridiagonal{Int64, Vector{Int64}}:
 1  2  ⋅  ⋅
 1  2  3  ⋅
 ⋅  2  3  4
 ⋅  ⋅  3  4
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/tridiag.jl#L543-L565)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Symmetric' href='#LinearAlgebra.Symmetric'>#</a>&nbsp;<b><u>LinearAlgebra.Symmetric</u></b> &mdash; <i>Type</i>.




```julia
Symmetric(A, uplo=:U)
```


Construct a `Symmetric` view of the upper (if `uplo = :U`) or lower (if `uplo = :L`) triangle of the matrix `A`.

`Symmetric` views are mainly useful for real-symmetric matrices, for which specialized algorithms (e.g. for eigenproblems) are enabled for `Symmetric` types. More generally, see also [`Hermitian(A)`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) for Hermitian matrices `A == A'`, which is effectively equivalent to `Symmetric` for real matrices but is also useful for complex matrices.  (Whereas complex `Symmetric` matrices are supported but have few if any specialized algorithms.)

To compute the symmetric part of a real matrix, or more generally the Hermitian part `(A + A') / 2` of a real or complex matrix `A`, use [`hermitianpart`](/stdlib/LinearAlgebra#LinearAlgebra.hermitianpart).

**Examples**

```julia
julia> A = [1 2 3; 4 5 6; 7 8 9]
3×3 Matrix{Int64}:
 1  2  3
 4  5  6
 7  8  9

julia> Supper = Symmetric(A)
3×3 Symmetric{Int64, Matrix{Int64}}:
 1  2  3
 2  5  6
 3  6  9

julia> Slower = Symmetric(A, :L)
3×3 Symmetric{Int64, Matrix{Int64}}:
 1  4  7
 4  5  8
 7  8  9

julia> hermitianpart(A)
3×3 Hermitian{Float64, Matrix{Float64}}:
 1.0  3.0  5.0
 3.0  5.0  7.0
 5.0  7.0  9.0
```


Note that `Supper` will not be equal to `Slower` unless `A` is itself symmetric (e.g. if `A == transpose(A)`).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetric.jl#L14-L59)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Hermitian' href='#LinearAlgebra.Hermitian'>#</a>&nbsp;<b><u>LinearAlgebra.Hermitian</u></b> &mdash; <i>Type</i>.




```julia
Hermitian(A, uplo=:U)
```


Construct a `Hermitian` view of the upper (if `uplo = :U`) or lower (if `uplo = :L`) triangle of the matrix `A`.

To compute the Hermitian part of `A`, use [`hermitianpart`](/stdlib/LinearAlgebra#LinearAlgebra.hermitianpart).

**Examples**

```julia
julia> A = [1 2+2im 3-3im; 4 5 6-6im; 7 8+8im 9]
3×3 Matrix{Complex{Int64}}:
 1+0im  2+2im  3-3im
 4+0im  5+0im  6-6im
 7+0im  8+8im  9+0im

julia> Hupper = Hermitian(A)
3×3 Hermitian{Complex{Int64}, Matrix{Complex{Int64}}}:
 1+0im  2+2im  3-3im
 2-2im  5+0im  6-6im
 3+3im  6+6im  9+0im

julia> Hlower = Hermitian(A, :L)
3×3 Hermitian{Complex{Int64}, Matrix{Complex{Int64}}}:
 1+0im  4+0im  7+0im
 4+0im  5+0im  8-8im
 7+0im  8+8im  9+0im

julia> hermitianpart(A)
3×3 Hermitian{ComplexF64, Matrix{ComplexF64}}:
 1.0+0.0im  3.0+1.0im  5.0-1.5im
 3.0-1.0im  5.0+0.0im  7.0-7.0im
 5.0+1.5im  7.0+7.0im  9.0+0.0im
```


Note that `Hupper` will not be equal to `Hlower` unless `A` is itself Hermitian (e.g. if `A == adjoint(A)`).

All non-real parts of the diagonal will be ignored.

```julia
Hermitian(fill(complex(1,1), 1, 1)) == fill(1, 1, 1)
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetric.jl#L107-L149)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LowerTriangular' href='#LinearAlgebra.LowerTriangular'>#</a>&nbsp;<b><u>LinearAlgebra.LowerTriangular</u></b> &mdash; <i>Type</i>.




```julia
LowerTriangular(A::AbstractMatrix)
```


Construct a `LowerTriangular` view of the matrix `A`.

**Examples**

```julia
julia> A = [1.0 2.0 3.0; 4.0 5.0 6.0; 7.0 8.0 9.0]
3×3 Matrix{Float64}:
 1.0  2.0  3.0
 4.0  5.0  6.0
 7.0  8.0  9.0

julia> LowerTriangular(A)
3×3 LowerTriangular{Float64, Matrix{Float64}}:
 1.0   ⋅    ⋅
 4.0  5.0   ⋅
 7.0  8.0  9.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/triangular.jl#L63-L82)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.UpperTriangular' href='#LinearAlgebra.UpperTriangular'>#</a>&nbsp;<b><u>LinearAlgebra.UpperTriangular</u></b> &mdash; <i>Type</i>.




```julia
UpperTriangular(A::AbstractMatrix)
```


Construct an `UpperTriangular` view of the matrix `A`.

**Examples**

```julia
julia> A = [1.0 2.0 3.0; 4.0 5.0 6.0; 7.0 8.0 9.0]
3×3 Matrix{Float64}:
 1.0  2.0  3.0
 4.0  5.0  6.0
 7.0  8.0  9.0

julia> UpperTriangular(A)
3×3 UpperTriangular{Float64, Matrix{Float64}}:
 1.0  2.0  3.0
  ⋅   5.0  6.0
  ⋅    ⋅   9.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/triangular.jl#L84-L103)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.UnitLowerTriangular' href='#LinearAlgebra.UnitLowerTriangular'>#</a>&nbsp;<b><u>LinearAlgebra.UnitLowerTriangular</u></b> &mdash; <i>Type</i>.




```julia
UnitLowerTriangular(A::AbstractMatrix)
```


Construct a `UnitLowerTriangular` view of the matrix `A`. Such a view has the [`oneunit`](/base/numbers#Base.oneunit) of the [`eltype`](/base/collections#Base.eltype) of `A` on its diagonal.

**Examples**

```julia
julia> A = [1.0 2.0 3.0; 4.0 5.0 6.0; 7.0 8.0 9.0]
3×3 Matrix{Float64}:
 1.0  2.0  3.0
 4.0  5.0  6.0
 7.0  8.0  9.0

julia> UnitLowerTriangular(A)
3×3 UnitLowerTriangular{Float64, Matrix{Float64}}:
 1.0   ⋅    ⋅
 4.0  1.0   ⋅
 7.0  8.0  1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/triangular.jl#L105-L126)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.UnitUpperTriangular' href='#LinearAlgebra.UnitUpperTriangular'>#</a>&nbsp;<b><u>LinearAlgebra.UnitUpperTriangular</u></b> &mdash; <i>Type</i>.




```julia
UnitUpperTriangular(A::AbstractMatrix)
```


Construct an `UnitUpperTriangular` view of the matrix `A`. Such a view has the [`oneunit`](/base/numbers#Base.oneunit) of the [`eltype`](/base/collections#Base.eltype) of `A` on its diagonal.

**Examples**

```julia
julia> A = [1.0 2.0 3.0; 4.0 5.0 6.0; 7.0 8.0 9.0]
3×3 Matrix{Float64}:
 1.0  2.0  3.0
 4.0  5.0  6.0
 7.0  8.0  9.0

julia> UnitUpperTriangular(A)
3×3 UnitUpperTriangular{Float64, Matrix{Float64}}:
 1.0  2.0  3.0
  ⋅   1.0  6.0
  ⋅    ⋅   1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/triangular.jl#L128-L149)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.UpperHessenberg' href='#LinearAlgebra.UpperHessenberg'>#</a>&nbsp;<b><u>LinearAlgebra.UpperHessenberg</u></b> &mdash; <i>Type</i>.




```julia
UpperHessenberg(A::AbstractMatrix)
```


Construct an `UpperHessenberg` view of the matrix `A`. Entries of `A` below the first subdiagonal are ignored.

::: tip Julia 1.3

This type was added in Julia 1.3.

:::

Efficient algorithms are implemented for `H \ b`, `det(H)`, and similar.

See also the [`hessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.hessenberg) function to factor any matrix into a similar upper-Hessenberg matrix.

If `F::Hessenberg` is the factorization object, the unitary matrix can be accessed with `F.Q` and the Hessenberg matrix with `F.H`. When `Q` is extracted, the resulting type is the `HessenbergQ` object, and may be converted to a regular matrix with [`convert(Array, _)`](/base/base#Base.convert) (or `Array(_)` for short).

Iterating the decomposition produces the factors `F.Q` and `F.H`.

**Examples**

```julia
julia> A = [1 2 3 4; 5 6 7 8; 9 10 11 12; 13 14 15 16]
4×4 Matrix{Int64}:
  1   2   3   4
  5   6   7   8
  9  10  11  12
 13  14  15  16

julia> UpperHessenberg(A)
4×4 UpperHessenberg{Int64, Matrix{Int64}}:
 1   2   3   4
 5   6   7   8
 ⋅  10  11  12
 ⋅   ⋅  15  16
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/hessenberg.jl#L6-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.UniformScaling' href='#LinearAlgebra.UniformScaling'>#</a>&nbsp;<b><u>LinearAlgebra.UniformScaling</u></b> &mdash; <i>Type</i>.




```julia
UniformScaling{T<:Number}
```


Generically sized uniform scaling operator defined as a scalar times the identity operator, `λ*I`. Although without an explicit `size`, it acts similarly to a matrix in many cases and includes support for some indexing. See also [`I`](/stdlib/LinearAlgebra#LinearAlgebra.I).

::: tip Julia 1.6

Indexing using ranges is available as of Julia 1.6.

:::

**Examples**

```julia
julia> J = UniformScaling(2.)
UniformScaling{Float64}
2.0*I

julia> A = [1. 2.; 3. 4.]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> J*A
2×2 Matrix{Float64}:
 2.0  4.0
 6.0  8.0

julia> J[1:2, 1:2]
2×2 Matrix{Float64}:
 2.0  0.0
 0.0  2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/uniformscaling.jl#L6-L38)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.I' href='#LinearAlgebra.I'>#</a>&nbsp;<b><u>LinearAlgebra.I</u></b> &mdash; <i>Constant</i>.




```julia
I
```


An object of type [`UniformScaling`](/stdlib/LinearAlgebra#LinearAlgebra.UniformScaling), representing an identity matrix of any size.

**Examples**

```julia
julia> fill(1, (5,6)) * I == fill(1, (5,6))
true

julia> [1 2im 3; 1im 2 3] * I
2×3 Matrix{Complex{Int64}}:
 1+0im  0+2im  3+0im
 0+1im  2+0im  3+0im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/uniformscaling.jl#L43-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.UniformScaling-Tuple{Integer}' href='#LinearAlgebra.UniformScaling-Tuple{Integer}'>#</a>&nbsp;<b><u>LinearAlgebra.UniformScaling</u></b> &mdash; <i>Method</i>.




```julia
(I::UniformScaling)(n::Integer)
```


Construct a `Diagonal` matrix from a `UniformScaling`.

::: tip Julia 1.2

This method is available as of Julia 1.2.

:::

**Examples**

```julia
julia> I(3)
3×3 Diagonal{Bool, Vector{Bool}}:
 1  ⋅  ⋅
 ⋅  1  ⋅
 ⋅  ⋅  1

julia> (0.7*I)(3)
3×3 Diagonal{Float64, Vector{Float64}}:
 0.7   ⋅    ⋅
  ⋅   0.7   ⋅
  ⋅    ⋅   0.7
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/uniformscaling.jl#L61-L83)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Factorization' href='#LinearAlgebra.Factorization'>#</a>&nbsp;<b><u>LinearAlgebra.Factorization</u></b> &mdash; <i>Type</i>.




```julia
LinearAlgebra.Factorization
```


Abstract type for [matrix factorizations](https://en.wikipedia.org/wiki/Matrix_decomposition) a.k.a. matrix decompositions. See [online documentation](/stdlib/LinearAlgebra#man-linalg-factorizations) for a list of available matrix factorizations.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/factorization.jl#L4-L11)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LU' href='#LinearAlgebra.LU'>#</a>&nbsp;<b><u>LinearAlgebra.LU</u></b> &mdash; <i>Type</i>.




```julia
LU <: Factorization
```


Matrix factorization type of the `LU` factorization of a square matrix `A`. This is the return type of [`lu`](/stdlib/LinearAlgebra#LinearAlgebra.lu), the corresponding matrix factorization function.

The individual components of the factorization `F::LU` can be accessed via [`getproperty`](/base/base#Base.getproperty):

| Component | Description                              |
|:--------- |:---------------------------------------- |
| `F.L`     | `L` (unit lower triangular) part of `LU` |
| `F.U`     | `U` (upper triangular) part of `LU`      |
| `F.p`     | (right) permutation `Vector`             |
| `F.P`     | (right) permutation `Matrix`             |


Iterating the factorization produces the components `F.L`, `F.U`, and `F.p`.

**Examples**

```julia
julia> A = [4 3; 6 3]
2×2 Matrix{Int64}:
 4  3
 6  3

julia> F = lu(A)
LU{Float64, Matrix{Float64}, Vector{Int64}}
L factor:
2×2 Matrix{Float64}:
 1.0       0.0
 0.666667  1.0
U factor:
2×2 Matrix{Float64}:
 6.0  3.0
 0.0  1.0

julia> F.L * F.U == A[F.p, :]
true

julia> l, u, p = lu(A); # destructuring via iteration

julia> l == F.L && u == F.U && p == F.p
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lu.jl#L6-L50)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lu' href='#LinearAlgebra.lu'>#</a>&nbsp;<b><u>LinearAlgebra.lu</u></b> &mdash; <i>Function</i>.




```julia
lu(A::AbstractSparseMatrixCSC; check = true, q = nothing, control = get_umfpack_control()) -> F::UmfpackLU
```


Compute the LU factorization of a sparse matrix `A`.

For sparse `A` with real or complex element type, the return type of `F` is `UmfpackLU{Tv, Ti}`, with `Tv` = [`Float64`](/base/numbers#Core.Float64) or `ComplexF64` respectively and `Ti` is an integer type ([`Int32`](/base/numbers#Core.Int32) or [`Int64`](/base/numbers#Core.Int64)).

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

The permutation `q` can either be a permutation vector or `nothing`. If no permutation vector is provided or `q` is `nothing`, UMFPACK&#39;s default is used. If the permutation is not zero-based, a zero-based copy is made.

The `control` vector defaults to the Julia SparseArrays package&#39;s default configuration for UMFPACK (NB: this is modified from the UMFPACK defaults to disable iterative refinement), but can be changed by passing a vector of length `UMFPACK_CONTROL`, see the UMFPACK manual for possible configurations.  For example to reenable iterative refinement:

```
umfpack_control = SparseArrays.UMFPACK.get_umfpack_control(Float64, Int64) # read Julia default configuration for a Float64 sparse matrix
SparseArrays.UMFPACK.show_umf_ctrl(umfpack_control) # optional - display values
umfpack_control[SparseArrays.UMFPACK.JL_UMFPACK_IRSTEP] = 2.0 # reenable iterative refinement (2 is UMFPACK default max iterative refinement steps)

Alu = lu(A; control = umfpack_control)
x = Alu \ b   # solve Ax = b, including UMFPACK iterative refinement
```


The individual components of the factorization `F` can be accessed by indexing:

| Component | Description                         |
|:--------- |:----------------------------------- |
| `L`       | `L` (lower triangular) part of `LU` |
| `U`       | `U` (upper triangular) part of `LU` |
| `p`       | right permutation `Vector`          |
| `q`       | left permutation `Vector`           |
| `Rs`      | `Vector` of scaling factors         |
| `:`       | `(L,U,p,q,Rs)` components           |


The relation between `F` and `A` is

`F.L*F.U == (F.Rs .* A)[F.p, F.q]`

`F` further supports the following functions:
- [`\`](/base/math#Base.:\-Tuple{Any,%20Any})
  
- [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det)
  

See also [`lu!`](/stdlib/LinearAlgebra#LinearAlgebra.lu!)

::: tip Note

`lu(A::AbstractSparseMatrixCSC)` uses the UMFPACK[^ACM832] library that is part of [SuiteSparse](https://github.com/DrTimothyAldenDavis/SuiteSparse). As this library only supports sparse matrices with [`Float64`](/base/numbers#Core.Float64) or `ComplexF64` elements, `lu` converts `A` into a copy that is of type `SparseMatrixCSC{Float64}` or `SparseMatrixCSC{ComplexF64}` as appropriate.

:::

[^ACM832]: Davis, Timothy A. (2004b). Algorithm 832: UMFPACK V4.3–-an Unsymmetric-Pattern Multifrontal Method. ACM Trans. Math. Softw., 30(2), 196–199. [doi:10.1145/992200.992206](https://doi.org/10.1145/992200.992206)



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/umfpack.jl#L325-L383)



```julia
lu(A, pivot = RowMaximum(); check = true, allowsingular = false) -> F::LU
```


Compute the LU factorization of `A`.

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

By default, with `check = true`, an error is also thrown when the decomposition produces valid factors, but the upper-triangular factor `U` is rank-deficient. This may be changed by passing `allowsingular = true`.

In most cases, if `A` is a subtype `S` of `AbstractMatrix{T}` with an element type `T` supporting `+`, `-`, `*` and `/`, the return type is `LU{T,S{T}}`.

In general, LU factorization involves a permutation of the rows of the matrix (corresponding to the `F.p` output described below), known as &quot;pivoting&quot; (because it corresponds to choosing which row contains the &quot;pivot&quot;, the diagonal entry of `F.U`). One of the following pivoting strategies can be selected via the optional `pivot` argument:
- `RowMaximum()` (default): the standard pivoting strategy; the pivot corresponds to the element of maximum absolute value among the remaining, to be factorized rows. This pivoting strategy requires the element type to also support [`abs`](/base/math#Base.abs) and [`<`](/base/math#Base.:<). (This is generally the only numerically stable option for floating-point matrices.)
  
- `RowNonZero()`: the pivot corresponds to the first non-zero element among the remaining, to be factorized rows.  (This corresponds to the typical choice in hand calculations, and is also useful for more general algebraic number types that support [`iszero`](/base/numbers#Base.iszero) but not `abs` or `<`.)
  
- `NoPivot()`: pivoting turned off (will fail if a zero entry is encountered in a pivot position, even when `allowsingular = true`).
  

The individual components of the factorization `F` can be accessed via [`getproperty`](/base/base#Base.getproperty):

| Component | Description                         |
|:--------- |:----------------------------------- |
| `F.L`     | `L` (lower triangular) part of `LU` |
| `F.U`     | `U` (upper triangular) part of `LU` |
| `F.p`     | (right) permutation `Vector`        |
| `F.P`     | (right) permutation `Matrix`        |


Iterating the factorization produces the components `F.L`, `F.U`, and `F.p`.

The relationship between `F` and `A` is

`F.L*F.U == A[F.p, :]`

`F` further supports the following functions:

| Supported function                                           | `LU` | `LU{T,Tridiagonal{T}}` |
|:------------------------------------------------------------ |:---- |:---------------------- |
| [`/`](/base/math#Base.:/)                                    | ✓    |                        |
| [`\`](/base/math#Base.:\-Tuple{Any,%20Any})                  | ✓    | ✓                      |
| [`inv`](/base/math#Base.inv-Tuple{Number})                   | ✓    | ✓                      |
| [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det)             | ✓    | ✓                      |
| [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet)       | ✓    | ✓                      |
| [`logabsdet`](/stdlib/LinearAlgebra#LinearAlgebra.logabsdet) | ✓    | ✓                      |
| [`size`](/base/arrays#Base.size)                             | ✓    | ✓                      |


::: tip Julia 1.11

The `allowsingular` keyword argument was added in Julia 1.11.

:::

**Examples**

```julia
julia> A = [4 3; 6 3]
2×2 Matrix{Int64}:
 4  3
 6  3

julia> F = lu(A)
LU{Float64, Matrix{Float64}, Vector{Int64}}
L factor:
2×2 Matrix{Float64}:
 1.0       0.0
 0.666667  1.0
U factor:
2×2 Matrix{Float64}:
 6.0  3.0
 0.0  1.0

julia> F.L * F.U == A[F.p, :]
true

julia> l, u, p = lu(A); # destructuring via iteration

julia> l == F.L && u == F.U && p == F.p
true

julia> lu([1 2; 1 2], allowsingular = true)
LU{Float64, Matrix{Float64}, Vector{Int64}}
L factor:
2×2 Matrix{Float64}:
 1.0  0.0
 1.0  1.0
U factor (rank-deficient):
2×2 Matrix{Float64}:
 1.0  2.0
 0.0  0.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lu.jl#L235-L335)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lu!' href='#LinearAlgebra.lu!'>#</a>&nbsp;<b><u>LinearAlgebra.lu!</u></b> &mdash; <i>Function</i>.




```julia
lu!(F::UmfpackLU, A::AbstractSparseMatrixCSC; check=true, reuse_symbolic=true, q=nothing) -> F::UmfpackLU
```


Compute the LU factorization of a sparse matrix `A`, reusing the symbolic factorization of an already existing LU factorization stored in `F`. Unless `reuse_symbolic` is set to false, the sparse matrix `A` must have an identical nonzero pattern as the matrix used to create the LU factorization `F`, otherwise an error is thrown. If the size of `A` and `F` differ, all vectors will be resized accordingly.

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

The permutation `q` can either be a permutation vector or `nothing`. If no permutation vector is provided or `q` is `nothing`, UMFPACK&#39;s default is used. If the permutation is not zero based, a zero based copy is made.

See also [`lu`](/stdlib/LinearAlgebra#LinearAlgebra.lu)

::: tip Note

`lu!(F::UmfpackLU, A::AbstractSparseMatrixCSC)` uses the UMFPACK library that is part of SuiteSparse. As this library only supports sparse matrices with [`Float64`](/base/numbers#Core.Float64) or `ComplexF64` elements, `lu!` will automatically convert the types to those set by the LU factorization or `SparseMatrixCSC{ComplexF64}` as appropriate.

:::

::: tip Julia 1.5

`lu!` for `UmfpackLU` requires at least Julia 1.5.

:::

**Examples**

```julia
julia> A = sparse(Float64[1.0 2.0; 0.0 3.0]);

julia> F = lu(A);

julia> B = sparse(Float64[1.0 1.0; 0.0 1.0]);

julia> lu!(F, B);

julia> F \ ones(2)
2-element Vector{Float64}:
 0.0
 1.0
```



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/umfpack.jl#L415-L459)



```julia
lu!(A, pivot = RowMaximum(); check = true, allowsingular = false) -> LU
```


`lu!` is the same as [`lu`](/stdlib/LinearAlgebra#LinearAlgebra.lu), but saves space by overwriting the input `A`, instead of creating a copy. An [`InexactError`](/base/base#Core.InexactError) exception is thrown if the factorization produces a number not representable by the element type of `A`, e.g. for integer types.

::: tip Julia 1.11

The `allowsingular` keyword argument was added in Julia 1.11.

:::

**Examples**

```julia
julia> A = [4. 3.; 6. 3.]
2×2 Matrix{Float64}:
 4.0  3.0
 6.0  3.0

julia> F = lu!(A)
LU{Float64, Matrix{Float64}, Vector{Int64}}
L factor:
2×2 Matrix{Float64}:
 1.0       0.0
 0.666667  1.0
U factor:
2×2 Matrix{Float64}:
 6.0  3.0
 0.0  1.0

julia> iA = [4 3; 6 3]
2×2 Matrix{Int64}:
 4  3
 6  3

julia> lu!(iA)
ERROR: InexactError: Int64(0.6666666666666666)
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lu.jl#L105-L144)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Cholesky' href='#LinearAlgebra.Cholesky'>#</a>&nbsp;<b><u>LinearAlgebra.Cholesky</u></b> &mdash; <i>Type</i>.




```julia
Cholesky <: Factorization
```


Matrix factorization type of the Cholesky factorization of a dense symmetric/Hermitian positive definite matrix `A`. This is the return type of [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky), the corresponding matrix factorization function.

The triangular Cholesky factor can be obtained from the factorization `F::Cholesky` via `F.L` and `F.U`, where `A ≈ F.U' * F.U ≈ F.L * F.L'`.

The following functions are available for `Cholesky` objects: [`size`](/base/arrays#Base.size), [`\`](/base/math#Base.:\-Tuple{Any,%20Any}), [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet) and [`isposdef`](/stdlib/LinearAlgebra#LinearAlgebra.isposdef).

Iterating the decomposition produces the components `L` and `U`.

**Examples**

```julia
julia> A = [4. 12. -16.; 12. 37. -43.; -16. -43. 98.]
3×3 Matrix{Float64}:
   4.0   12.0  -16.0
  12.0   37.0  -43.0
 -16.0  -43.0   98.0

julia> C = cholesky(A)
Cholesky{Float64, Matrix{Float64}}
U factor:
3×3 UpperTriangular{Float64, Matrix{Float64}}:
 2.0  6.0  -8.0
  ⋅   1.0   5.0
  ⋅    ⋅    3.0

julia> C.U
3×3 UpperTriangular{Float64, Matrix{Float64}}:
 2.0  6.0  -8.0
  ⋅   1.0   5.0
  ⋅    ⋅    3.0

julia> C.L
3×3 LowerTriangular{Float64, Matrix{Float64}}:
  2.0   ⋅    ⋅
  6.0  1.0   ⋅
 -8.0  5.0  3.0

julia> C.L * C.U == A
true

julia> l, u = C; # destructuring via iteration

julia> l == C.L && u == C.U
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L30-L81)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.CholeskyPivoted' href='#LinearAlgebra.CholeskyPivoted'>#</a>&nbsp;<b><u>LinearAlgebra.CholeskyPivoted</u></b> &mdash; <i>Type</i>.




```julia
CholeskyPivoted
```


Matrix factorization type of the pivoted Cholesky factorization of a dense symmetric/Hermitian positive semi-definite matrix `A`. This is the return type of [`cholesky(_, ::RowMaximum)`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky), the corresponding matrix factorization function.

The triangular Cholesky factor can be obtained from the factorization `F::CholeskyPivoted` via `F.L` and `F.U`, and the permutation via `F.p`, where `A[F.p, F.p] ≈ Ur' * Ur ≈ Lr * Lr'` with `Ur = F.U[1:F.rank, :]` and `Lr = F.L[:, 1:F.rank]`, or alternatively `A ≈ Up' * Up ≈ Lp * Lp'` with `Up = F.U[1:F.rank, invperm(F.p)]` and `Lp = F.L[invperm(F.p), 1:F.rank]`.

The following functions are available for `CholeskyPivoted` objects: [`size`](/base/arrays#Base.size), [`\`](/base/math#Base.:\-Tuple{Any,%20Any}), [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), and [`rank`](/stdlib/LinearAlgebra#LinearAlgebra.rank).

Iterating the decomposition produces the components `L` and `U`.

**Examples**

```julia
julia> X = [1.0, 2.0, 3.0, 4.0];

julia> A = X * X';

julia> C = cholesky(A, RowMaximum(), check = false)
CholeskyPivoted{Float64, Matrix{Float64}, Vector{Int64}}
U factor with rank 1:
4×4 UpperTriangular{Float64, Matrix{Float64}}:
 4.0  2.0  3.0  1.0
  ⋅   0.0  6.0  2.0
  ⋅    ⋅   9.0  3.0
  ⋅    ⋅    ⋅   1.0
permutation:
4-element Vector{Int64}:
 4
 2
 3
 1

julia> C.U[1:C.rank, :]' * C.U[1:C.rank, :] ≈ A[C.p, C.p]
true

julia> l, u = C; # destructuring via iteration

julia> l == C.L && u == C.U
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L105-L152)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.cholesky' href='#LinearAlgebra.cholesky'>#</a>&nbsp;<b><u>LinearAlgebra.cholesky</u></b> &mdash; <i>Function</i>.




```julia
cholesky(A, NoPivot(); check = true) -> Cholesky
```


Compute the Cholesky factorization of a dense symmetric positive definite matrix `A` and return a [`Cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.Cholesky) factorization. The matrix `A` can either be a [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric) or [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) [`AbstractMatrix`](/base/arrays#Base.AbstractMatrix) or a _perfectly_ symmetric or Hermitian `AbstractMatrix`.

The triangular Cholesky factor can be obtained from the factorization `F` via `F.L` and `F.U`, where `A ≈ F.U' * F.U ≈ F.L * F.L'`.

The following functions are available for `Cholesky` objects: [`size`](/base/arrays#Base.size), [`\`](/base/math#Base.:\-Tuple{Any,%20Any}), [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet) and [`isposdef`](/stdlib/LinearAlgebra#LinearAlgebra.isposdef).

If you have a matrix `A` that is slightly non-Hermitian due to roundoff errors in its construction, wrap it in `Hermitian(A)` before passing it to `cholesky` in order to treat it as perfectly Hermitian.

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

**Examples**

```julia
julia> A = [4. 12. -16.; 12. 37. -43.; -16. -43. 98.]
3×3 Matrix{Float64}:
   4.0   12.0  -16.0
  12.0   37.0  -43.0
 -16.0  -43.0   98.0

julia> C = cholesky(A)
Cholesky{Float64, Matrix{Float64}}
U factor:
3×3 UpperTriangular{Float64, Matrix{Float64}}:
 2.0  6.0  -8.0
  ⋅   1.0   5.0
  ⋅    ⋅    3.0

julia> C.U
3×3 UpperTriangular{Float64, Matrix{Float64}}:
 2.0  6.0  -8.0
  ⋅   1.0   5.0
  ⋅    ⋅    3.0

julia> C.L
3×3 LowerTriangular{Float64, Matrix{Float64}}:
  2.0   ⋅    ⋅
  6.0  1.0   ⋅
 -8.0  5.0  3.0

julia> C.L * C.U == A
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L349-L400)



```julia
cholesky(A, RowMaximum(); tol = 0.0, check = true) -> CholeskyPivoted
```


Compute the pivoted Cholesky factorization of a dense symmetric positive semi-definite matrix `A` and return a [`CholeskyPivoted`](/stdlib/LinearAlgebra#LinearAlgebra.CholeskyPivoted) factorization. The matrix `A` can either be a [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric) or [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) [`AbstractMatrix`](/base/arrays#Base.AbstractMatrix) or a _perfectly_ symmetric or Hermitian `AbstractMatrix`.

The triangular Cholesky factor can be obtained from the factorization `F` via `F.L` and `F.U`, and the permutation via `F.p`, where `A[F.p, F.p] ≈ Ur' * Ur ≈ Lr * Lr'` with `Ur = F.U[1:F.rank, :]` and `Lr = F.L[:, 1:F.rank]`, or alternatively `A ≈ Up' * Up ≈ Lp * Lp'` with `Up = F.U[1:F.rank, invperm(F.p)]` and `Lp = F.L[invperm(F.p), 1:F.rank]`.

The following functions are available for `CholeskyPivoted` objects: [`size`](/base/arrays#Base.size), [`\`](/base/math#Base.:\-Tuple{Any,%20Any}), [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), and [`rank`](/stdlib/LinearAlgebra#LinearAlgebra.rank).

The argument `tol` determines the tolerance for determining the rank. For negative values, the tolerance is equal to `eps()*size(A,1)*maximum(diag(A))`.

If you have a matrix `A` that is slightly non-Hermitian due to roundoff errors in its construction, wrap it in `Hermitian(A)` before passing it to `cholesky` in order to treat it as perfectly Hermitian.

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

**Examples**

```julia
julia> X = [1.0, 2.0, 3.0, 4.0];

julia> A = X * X';

julia> C = cholesky(A, RowMaximum(), check = false)
CholeskyPivoted{Float64, Matrix{Float64}, Vector{Int64}}
U factor with rank 1:
4×4 UpperTriangular{Float64, Matrix{Float64}}:
 4.0  2.0  3.0  1.0
  ⋅   0.0  6.0  2.0
  ⋅    ⋅   9.0  3.0
  ⋅    ⋅    ⋅   1.0
permutation:
4-element Vector{Int64}:
 4
 2
 3
 1

julia> C.U[1:C.rank, :]' * C.U[1:C.rank, :] ≈ A[C.p, C.p]
true

julia> l, u = C; # destructuring via iteration

julia> l == C.L && u == C.U
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L414-L468)



```julia
cholesky(A::SparseMatrixCSC; shift = 0.0, check = true, perm = nothing) -> CHOLMOD.Factor
```


Compute the Cholesky factorization of a sparse positive definite matrix `A`. `A` must be a [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC) or a [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric)/[`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) view of a `SparseMatrixCSC`. Note that even if `A` doesn&#39;t have the type tag, it must still be symmetric or Hermitian. If `perm` is not given, a fill-reducing permutation is used. `F = cholesky(A)` is most frequently used to solve systems of equations with `F\b`, but also the methods [`diag`](/stdlib/LinearAlgebra#LinearAlgebra.diag), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), and [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet) are defined for `F`. You can also extract individual factors from `F`, using `F.L`. However, since pivoting is on by default, the factorization is internally represented as `A == P'*L*L'*P` with a permutation matrix `P`; using just `L` without accounting for `P` will give incorrect answers. To include the effects of permutation, it&#39;s typically preferable to extract &quot;combined&quot; factors like `PtL = F.PtL` (the equivalent of `P'*L`) and `LtP = F.UP` (the equivalent of `L'*P`).

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

Setting the optional `shift` keyword argument computes the factorization of `A+shift*I` instead of `A`. If the `perm` argument is provided, it should be a permutation of `1:size(A,1)` giving the ordering to use (instead of CHOLMOD&#39;s default AMD ordering).

**Examples**

In the following example, the fill-reducing permutation used is `[3, 2, 1]`. If `perm` is set to `1:3` to enforce no permutation, the number of nonzero elements in the factor is 6.

```julia
julia> A = [2 1 1; 1 2 0; 1 0 2]
3×3 Matrix{Int64}:
 2  1  1
 1  2  0
 1  0  2

julia> C = cholesky(sparse(A))
SparseArrays.CHOLMOD.Factor{Float64, Int64}
type:    LLt
method:  simplicial
maxnnz:  5
nnz:     5
success: true

julia> C.p
3-element Vector{Int64}:
 3
 2
 1

julia> L = sparse(C.L);

julia> Matrix(L)
3×3 Matrix{Float64}:
 1.41421   0.0       0.0
 0.0       1.41421   0.0
 0.707107  0.707107  1.0

julia> L * L' ≈ A[C.p, C.p]
true

julia> P = sparse(1:3, C.p, ones(3))
3×3 SparseMatrixCSC{Float64, Int64} with 3 stored entries:
  ⋅    ⋅   1.0
  ⋅   1.0   ⋅
 1.0   ⋅    ⋅

julia> P' * L * L' * P ≈ A
true

julia> C = cholesky(sparse(A), perm=1:3)
SparseArrays.CHOLMOD.Factor{Float64, Int64}
type:    LLt
method:  simplicial
maxnnz:  6
nnz:     6
success: true

julia> L = sparse(C.L);

julia> Matrix(L)
3×3 Matrix{Float64}:
 1.41421    0.0       0.0
 0.707107   1.22474   0.0
 0.707107  -0.408248  1.1547

julia> L * L' ≈ A
true
```


::: tip Note

This method uses the CHOLMOD[^ACM887][^DavisHager2009] library from [SuiteSparse](https://github.com/DrTimothyAldenDavis/SuiteSparse). CHOLMOD only supports real or complex types in single or double precision.  Input matrices not of those element types will be  converted to these types as appropriate.

Many other functions from CHOLMOD are wrapped but not exported from the `Base.SparseArrays.CHOLMOD` module.

:::

[^ACM887]: Chen, Y., Davis, T. A., Hager, W. W., &amp; Rajamanickam, S. (2008). Algorithm 887: CHOLMOD, Supernodal Sparse Cholesky Factorization and Update/Downdate. ACM Trans. Math. Softw., 35(3). [doi:10.1145/1391989.1391995](https://doi.org/10.1145/1391989.1391995)


[^DavisHager2009]: Davis, Timothy A., &amp; Hager, W. W. (2009). Dynamic Supernodes in Sparse Cholesky Update/Downdate and Triangular Solves. ACM Trans. Math. Softw., 35(4). [doi:10.1145/1462173.1462176](https://doi.org/10.1145/1462173.1462176)



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1494-L1600)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.cholesky!' href='#LinearAlgebra.cholesky!'>#</a>&nbsp;<b><u>LinearAlgebra.cholesky!</u></b> &mdash; <i>Function</i>.




```julia
cholesky!(A::AbstractMatrix, NoPivot(); check = true) -> Cholesky
```


The same as [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky), but saves space by overwriting the input `A`, instead of creating a copy. An [`InexactError`](/base/base#Core.InexactError) exception is thrown if the factorization produces a number not representable by the element type of `A`, e.g. for integer types.

**Examples**

```julia
julia> A = [1 2; 2 50]
2×2 Matrix{Int64}:
 1   2
 2  50

julia> cholesky!(A)
ERROR: InexactError: Int64(6.782329983125268)
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L274-L294)



```julia
cholesky!(A::AbstractMatrix, RowMaximum(); tol = 0.0, check = true) -> CholeskyPivoted
```


The same as [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky), but saves space by overwriting the input `A`, instead of creating a copy. An [`InexactError`](/base/base#Core.InexactError) exception is thrown if the factorization produces a number not representable by the element type of `A`, e.g. for integer types.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L325-L332)



```julia
cholesky!(F::CHOLMOD.Factor, A::SparseMatrixCSC; shift = 0.0, check = true) -> CHOLMOD.Factor
```


Compute the Cholesky ($LL'$) factorization of `A`, reusing the symbolic factorization `F`. `A` must be a [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC) or a [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric)/ [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) view of a `SparseMatrixCSC`. Note that even if `A` doesn&#39;t have the type tag, it must still be symmetric or Hermitian.

See also [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky).

::: tip Note

This method uses the CHOLMOD library from SuiteSparse, which only supports real or complex types in single or double precision.  Input matrices not of those element types will be converted to these types as appropriate.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1458-L1473)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lowrankupdate' href='#LinearAlgebra.lowrankupdate'>#</a>&nbsp;<b><u>LinearAlgebra.lowrankupdate</u></b> &mdash; <i>Function</i>.




```julia
lowrankupdate(C::Cholesky, v::AbstractVector) -> CC::Cholesky
```


Update a Cholesky factorization `C` with the vector `v`. If `A = C.U'C.U` then `CC = cholesky(C.U'C.U + v*v')` but the computation of `CC` only uses `O(n^2)` operations.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L821-L827)



```julia
lowrankupdate(F::CHOLMOD.Factor, C::AbstractArray) -> FF::CHOLMOD.Factor
```


Get an `LDLt` Factorization of `A + C*C'` given an `LDLt` or `LLt` factorization `F` of `A`.

The returned factor is always an `LDLt` factorization.

See also [`lowrankupdate!`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankupdate!), [`lowrankdowndate`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankdowndate), [`lowrankdowndate!`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankdowndate!).


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1759-L1767)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lowrankdowndate' href='#LinearAlgebra.lowrankdowndate'>#</a>&nbsp;<b><u>LinearAlgebra.lowrankdowndate</u></b> &mdash; <i>Function</i>.




```julia
lowrankdowndate(C::Cholesky, v::AbstractVector) -> CC::Cholesky
```


Downdate a Cholesky factorization `C` with the vector `v`. If `A = C.U'C.U` then `CC = cholesky(C.U'C.U - v*v')` but the computation of `CC` only uses `O(n^2)` operations.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L830-L836)



```julia
lowrankdowndate(F::CHOLMOD.Factor, C::AbstractArray) -> FF::CHOLMOD.Factor
```


Get an `LDLt` Factorization of `A + C*C'` given an `LDLt` or `LLt` factorization `F` of `A`.

The returned factor is always an `LDLt` factorization.

See also [`lowrankdowndate!`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankdowndate!), [`lowrankupdate`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankupdate), [`lowrankupdate!`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankupdate!).


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1774-L1782)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lowrankupdate!' href='#LinearAlgebra.lowrankupdate!'>#</a>&nbsp;<b><u>LinearAlgebra.lowrankupdate!</u></b> &mdash; <i>Function</i>.




```julia
lowrankupdate!(C::Cholesky, v::AbstractVector) -> CC::Cholesky
```


Update a Cholesky factorization `C` with the vector `v`. If `A = C.U'C.U` then `CC = cholesky(C.U'C.U + v*v')` but the computation of `CC` only uses `O(n^2)` operations. The input factorization `C` is updated in place such that on exit `C == CC`. The vector `v` is destroyed during the computation.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L722-L729)



```julia
lowrankupdate!(F::CHOLMOD.Factor, C::AbstractArray)
```


Update an `LDLt` or `LLt` Factorization `F` of `A` to a factorization of `A + C*C'`.

`LLt` factorizations are converted to `LDLt`.

See also [`lowrankupdate`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankupdate), [`lowrankdowndate`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankdowndate), [`lowrankdowndate!`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankdowndate!).


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1729-L1737)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lowrankdowndate!' href='#LinearAlgebra.lowrankdowndate!'>#</a>&nbsp;<b><u>LinearAlgebra.lowrankdowndate!</u></b> &mdash; <i>Function</i>.




```julia
lowrankdowndate!(C::Cholesky, v::AbstractVector) -> CC::Cholesky
```


Downdate a Cholesky factorization `C` with the vector `v`. If `A = C.U'C.U` then `CC = cholesky(C.U'C.U - v*v')` but the computation of `CC` only uses `O(n^2)` operations. The input factorization `C` is updated in place such that on exit `C == CC`. The vector `v` is destroyed during the computation.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/cholesky.jl#L768-L775)



```julia
lowrankdowndate!(F::CHOLMOD.Factor, C::AbstractArray)
```


Update an `LDLt` or `LLt` Factorization `F` of `A` to a factorization of `A - C*C'`.

`LLt` factorizations are converted to `LDLt`.

See also [`lowrankdowndate`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankdowndate), [`lowrankupdate`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankupdate), [`lowrankupdate!`](/stdlib/LinearAlgebra#LinearAlgebra.lowrankupdate!).


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1744-L1752)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LDLt' href='#LinearAlgebra.LDLt'>#</a>&nbsp;<b><u>LinearAlgebra.LDLt</u></b> &mdash; <i>Type</i>.




```julia
LDLt <: Factorization
```


Matrix factorization type of the `LDLt` factorization of a real [`SymTridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.SymTridiagonal) matrix `S` such that `S = L*Diagonal(d)*L'`, where `L` is a [`UnitLowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UnitLowerTriangular) matrix and `d` is a vector. The main use of an `LDLt` factorization `F = ldlt(S)` is to solve the linear system of equations `Sx = b` with `F\b`. This is the return type of [`ldlt`](/stdlib/LinearAlgebra#LinearAlgebra.ldlt), the corresponding matrix factorization function.

The individual components of the factorization `F::LDLt` can be accessed via `getproperty`:

| Component | Description                                 |
|:---------:|:------------------------------------------- |
|   `F.L`   | `L` (unit lower triangular) part of `LDLt`  |
|   `F.D`   | `D` (diagonal) part of `LDLt`               |
|  `F.Lt`   | `Lt` (unit upper triangular) part of `LDLt` |
|   `F.d`   | diagonal values of `D` as a `Vector`        |


**Examples**

```julia
julia> S = SymTridiagonal([3., 4., 5.], [1., 2.])
3×3 SymTridiagonal{Float64, Vector{Float64}}:
 3.0  1.0   ⋅
 1.0  4.0  2.0
  ⋅   2.0  5.0

julia> F = ldlt(S)
LDLt{Float64, SymTridiagonal{Float64, Vector{Float64}}}
L factor:
3×3 UnitLowerTriangular{Float64, SymTridiagonal{Float64, Vector{Float64}}}:
 1.0        ⋅         ⋅
 0.333333  1.0        ⋅
 0.0       0.545455  1.0
D factor:
3×3 Diagonal{Float64, Vector{Float64}}:
 3.0   ⋅        ⋅
  ⋅   3.66667   ⋅
  ⋅    ⋅       3.90909
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/ldlt.jl#L3-L42)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ldlt' href='#LinearAlgebra.ldlt'>#</a>&nbsp;<b><u>LinearAlgebra.ldlt</u></b> &mdash; <i>Function</i>.




```julia
ldlt(S::SymTridiagonal) -> LDLt
```


Compute an `LDLt` (i.e., $LDL^T$) factorization of the real symmetric tridiagonal matrix `S` such that `S = L*Diagonal(d)*L'` where `L` is a unit lower triangular matrix and `d` is a vector. The main use of an `LDLt` factorization `F = ldlt(S)` is to solve the linear system of equations `Sx = b` with `F\b`.

See also [`bunchkaufman`](/stdlib/LinearAlgebra#LinearAlgebra.bunchkaufman) for a similar, but pivoted, factorization of arbitrary symmetric or Hermitian matrices.

**Examples**

```julia
julia> S = SymTridiagonal([3., 4., 5.], [1., 2.])
3×3 SymTridiagonal{Float64, Vector{Float64}}:
 3.0  1.0   ⋅
 1.0  4.0  2.0
  ⋅   2.0  5.0

julia> ldltS = ldlt(S);

julia> b = [6., 7., 8.];

julia> ldltS \ b
3-element Vector{Float64}:
 1.7906976744186047
 0.627906976744186
 1.3488372093023255

julia> S \ b
3-element Vector{Float64}:
 1.7906976744186047
 0.627906976744186
 1.3488372093023255
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/ldlt.jl#L129-L162)



```julia
ldlt(A::SparseMatrixCSC; shift = 0.0, check = true, perm=nothing) -> CHOLMOD.Factor
```


Compute the $LDL'$ factorization of a sparse matrix `A`. `A` must be a [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC) or a [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric)/[`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) view of a `SparseMatrixCSC`. Note that even if `A` doesn&#39;t have the type tag, it must still be symmetric or Hermitian. A fill-reducing permutation is used. `F = ldlt(A)` is most frequently used to solve systems of equations `A*x = b` with `F\b`. The returned factorization object `F` also supports the methods [`diag`](/stdlib/LinearAlgebra#LinearAlgebra.diag), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet), and [`inv`](/base/math#Base.inv-Tuple{Number}). You can extract individual factors from `F` using `F.L`. However, since pivoting is on by default, the factorization is internally represented as `A == P'*L*D*L'*P` with a permutation matrix `P`; using just `L` without accounting for `P` will give incorrect answers. To include the effects of permutation, it is typically preferable to extract &quot;combined&quot; factors like `PtL = F.PtL` (the equivalent of `P'*L`) and `LtP = F.UP` (the equivalent of `L'*P`). The complete list of supported factors is `:L, :PtL, :D, :UP, :U, :LD, :DU, :PtLD, :DUP`.

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

Setting the optional `shift` keyword argument computes the factorization of `A+shift*I` instead of `A`. If the `perm` argument is provided, it should be a permutation of `1:size(A,1)` giving the ordering to use (instead of CHOLMOD&#39;s default AMD ordering).

::: tip Note

This method uses the CHOLMOD[^ACM887][^DavisHager2009] library from [SuiteSparse](https://github.com/DrTimothyAldenDavis/SuiteSparse). CHOLMOD only supports real or complex types in single or double precision.  Input matrices not of those element types will be converted to these types as appropriate.

Many other functions from CHOLMOD are wrapped but not exported from the `Base.SparseArrays.CHOLMOD` module.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1667-L1704)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ldlt!' href='#LinearAlgebra.ldlt!'>#</a>&nbsp;<b><u>LinearAlgebra.ldlt!</u></b> &mdash; <i>Function</i>.




```julia
ldlt!(S::SymTridiagonal) -> LDLt
```


Same as [`ldlt`](/stdlib/LinearAlgebra#LinearAlgebra.ldlt), but saves space by overwriting the input `S`, instead of creating a copy.

**Examples**

```julia
julia> S = SymTridiagonal([3., 4., 5.], [1., 2.])
3×3 SymTridiagonal{Float64, Vector{Float64}}:
 3.0  1.0   ⋅
 1.0  4.0  2.0
  ⋅   2.0  5.0

julia> ldltS = ldlt!(S);

julia> ldltS === S
false

julia> S
3×3 SymTridiagonal{Float64, Vector{Float64}}:
 3.0       0.333333   ⋅
 0.333333  3.66667   0.545455
  ⋅        0.545455  3.90909
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/ldlt.jl#L92-L116)



```julia
ldlt!(F::CHOLMOD.Factor, A::SparseMatrixCSC; shift = 0.0, check = true) -> CHOLMOD.Factor
```


Compute the $LDL'$ factorization of `A`, reusing the symbolic factorization `F`. `A` must be a [`SparseMatrixCSC`](/stdlib/SparseArrays#SparseArrays.SparseMatrixCSC) or a [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric)/[`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) view of a `SparseMatrixCSC`. Note that even if `A` doesn&#39;t have the type tag, it must still be symmetric or Hermitian.

See also [`ldlt`](/stdlib/LinearAlgebra#LinearAlgebra.ldlt).

::: tip Note

This method uses the CHOLMOD library from [SuiteSparse](https://github.com/DrTimothyAldenDavis/SuiteSparse),  which only supports real or complex types in single or double precision.  Input matrices not of those element types will be converted to these types as appropriate.

:::


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/cholmod.jl#L1625-L1640)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.QR' href='#LinearAlgebra.QR'>#</a>&nbsp;<b><u>LinearAlgebra.QR</u></b> &mdash; <i>Type</i>.




```julia
QR <: Factorization
```


A QR matrix factorization stored in a packed format, typically obtained from [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr). If $A$ is an `m`×`n` matrix, then

$$A = Q R$$

where $Q$ is an orthogonal/unitary matrix and $R$ is upper triangular. The matrix $Q$ is stored as a sequence of Householder reflectors $v_i$ and coefficients $\tau_i$ where:

$$Q = \prod_{i=1}^{\min(m,n)} (I - \tau_i v_i v_i^T).$$

Iterating the decomposition produces the components `Q` and `R`.

The object has two fields:
- `factors` is an `m`×`n` matrix.
  - The upper triangular part contains the elements of $R$, that is `R = triu(F.factors)` for a `QR` object `F`.
    
  - The subdiagonal part contains the reflectors $v_i$ stored in a packed format where $v_i$ is the $i$th column of the matrix `V = I + tril(F.factors, -1)`.
    
  
- `τ` is a vector  of length `min(m,n)` containing the coefficients $au_i$.
  


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/qr.jl#L4-L35)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.QRCompactWY' href='#LinearAlgebra.QRCompactWY'>#</a>&nbsp;<b><u>LinearAlgebra.QRCompactWY</u></b> &mdash; <i>Type</i>.




```julia
QRCompactWY <: Factorization
```


A QR matrix factorization stored in a compact blocked format, typically obtained from [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr). If $A$ is an `m`×`n` matrix, then

$$A = Q R$$

where $Q$ is an orthogonal/unitary matrix and $R$ is upper triangular. It is similar to the [`QR`](/stdlib/LinearAlgebra#LinearAlgebra.QR) format except that the orthogonal/unitary matrix $Q$ is stored in _Compact WY_ format [^Schreiber1989].  For the block size $n_b$, it is stored as a `m`×`n` lower trapezoidal matrix $V$ and a matrix $T = (T_1 \; T_2 \; ... \; T_{b-1} \; T_b')$ composed of $b = \lceil \min(m,n) / n_b \rceil$ upper triangular matrices $T_j$ of size $n_b$×$n_b$ ($j = 1, ..., b-1$) and an upper trapezoidal $n_b$×$\min(m,n) - (b-1) n_b$ matrix $T_b'$ ($j=b$) whose upper square part denoted with $T_b$ satisfying

$$Q = \prod_{i=1}^{\min(m,n)} (I - \tau_i v_i v_i^T)
= \prod_{j=1}^{b} (I - V_j T_j V_j^T)$$

such that $v_i$ is the $i$th column of $V$, $\tau_i$ is the $i$th element of `[diag(T_1); diag(T_2); …; diag(T_b)]`, and $(V_1 \; V_2 \; ... \; V_b)$ is the left `m`×`min(m, n)` block of $V$.  When constructed using [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr), the block size is given by $n_b = \min(m, n, 36)$.

Iterating the decomposition produces the components `Q` and `R`.

The object has two fields:
- `factors`, as in the [`QR`](/stdlib/LinearAlgebra#LinearAlgebra.QR) type, is an `m`×`n` matrix.
  - The upper triangular part contains the elements of $R$, that is `R = triu(F.factors)` for a `QR` object `F`.
    
  - The subdiagonal part contains the reflectors $v_i$ stored in a packed format such that `V = I + tril(F.factors, -1)`.
    
  
- `T` is a $n_b$-by-$\min(m,n)$ matrix as described above. The subdiagonal elements for each triangular matrix $T_j$ are ignored.
  

::: tip Note

This format should not to be confused with the older _WY_ representation [^Bischof1987].

:::

[^Bischof1987]: C Bischof and C Van Loan, &quot;The WY representation for products of Householder matrices&quot;, SIAM J Sci Stat Comput 8 (1987), s2-s13. [doi:10.1137/0908009](https://doi.org/10.1137/0908009)


[^Schreiber1989]: R Schreiber and C Van Loan, &quot;A storage-efficient WY representation for products of Householder transformations&quot;, SIAM J Sci Stat Comput 10 (1989), 53-57. [doi:10.1137/0910005](https://doi.org/10.1137/0910005)



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/qr.jl#L59-L112)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.QRPivoted' href='#LinearAlgebra.QRPivoted'>#</a>&nbsp;<b><u>LinearAlgebra.QRPivoted</u></b> &mdash; <i>Type</i>.




```julia
QRPivoted <: Factorization
```


A QR matrix factorization with column pivoting in a packed format, typically obtained from [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr). If $A$ is an `m`×`n` matrix, then

$$A P = Q R$$

where $P$ is a permutation matrix, $Q$ is an orthogonal/unitary matrix and $R$ is upper triangular. The matrix $Q$ is stored as a sequence of Householder reflectors:

$$Q = \prod_{i=1}^{\min(m,n)} (I - \tau_i v_i v_i^T).$$

Iterating the decomposition produces the components `Q`, `R`, and `p`.

The object has three fields:
- `factors` is an `m`×`n` matrix.
  - The upper triangular part contains the elements of $R$, that is `R = triu(F.factors)` for a `QR` object `F`.
    
  - The subdiagonal part contains the reflectors $v_i$ stored in a packed format where $v_i$ is the $i$th column of the matrix `V = I + tril(F.factors, -1)`.
    
  
- `τ` is a vector of length `min(m,n)` containing the coefficients $au_i$.
  
- `jpvt` is an integer vector of length `n` corresponding to the permutation $P$.
  


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/qr.jl#L169-L201)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.qr' href='#LinearAlgebra.qr'>#</a>&nbsp;<b><u>LinearAlgebra.qr</u></b> &mdash; <i>Function</i>.




```julia
qr(A::SparseMatrixCSC; tol=_default_tol(A), ordering=ORDERING_DEFAULT) -> QRSparse
```


Compute the `QR` factorization of a sparse matrix `A`. Fill-reducing row and column permutations are used such that `F.R = F.Q'*A[F.prow,F.pcol]`. The main application of this type is to solve least squares or underdetermined problems with [`\`](/base/math#Base.:\-Tuple{Any,%20Any}). The function calls the C library SPQR[^ACM933].

::: tip Note

`qr(A::SparseMatrixCSC)` uses the SPQR library that is part of [SuiteSparse](https://github.com/DrTimothyAldenDavis/SuiteSparse). As this library only supports sparse matrices with [`Float64`](/base/numbers#Core.Float64) or `ComplexF64` elements, as of Julia v1.4 `qr` converts `A` into a copy that is of type `SparseMatrixCSC{Float64}` or `SparseMatrixCSC{ComplexF64}` as appropriate.

:::

**Examples**

```julia
julia> A = sparse([1,2,3,4], [1,1,2,2], [1.0,1.0,1.0,1.0])
4×2 SparseMatrixCSC{Float64, Int64} with 4 stored entries:
 1.0   ⋅
 1.0   ⋅
  ⋅   1.0
  ⋅   1.0

julia> qr(A)
SparseArrays.SPQR.QRSparse{Float64, Int64}
Q factor:
4×4 SparseArrays.SPQR.QRSparseQ{Float64, Int64}
R factor:
2×2 SparseMatrixCSC{Float64, Int64} with 2 stored entries:
 -1.41421    ⋅
   ⋅       -1.41421
Row permutation:
4-element Vector{Int64}:
 1
 3
 4
 2
Column permutation:
2-element Vector{Int64}:
 1
 2
```


[^ACM933]: Foster, L. V., &amp; Davis, T. A. (2013). Algorithm 933: Reliable Calculation of Numerical Rank, Null Space Bases, Pseudoinverse Solutions, and Basic Solutions Using SuitesparseQR. ACM Trans. Math. Softw., 40(1). [doi:10.1145/2513109.2513116](https://doi.org/10.1145/2513109.2513116)



[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/spqr.jl#L151-L194)



```julia
qr(A, pivot = NoPivot(); blocksize) -> F
```


Compute the QR factorization of the matrix `A`: an orthogonal (or unitary if `A` is complex-valued) matrix `Q`, and an upper triangular matrix `R` such that

$$A = Q R$$

The returned object `F` stores the factorization in a packed format:
- if `pivot == ColumnNorm()` then `F` is a [`QRPivoted`](/stdlib/LinearAlgebra#LinearAlgebra.QRPivoted) object,
  
- otherwise if the element type of `A` is a BLAS type ([`Float32`](/base/numbers#Core.Float32), [`Float64`](/base/numbers#Core.Float64), `ComplexF32` or `ComplexF64`), then `F` is a [`QRCompactWY`](/stdlib/LinearAlgebra#LinearAlgebra.QRCompactWY) object,
  
- otherwise `F` is a [`QR`](/stdlib/LinearAlgebra#LinearAlgebra.QR) object.
  

The individual components of the decomposition `F` can be retrieved via property accessors:
- `F.Q`: the orthogonal/unitary matrix `Q`
  
- `F.R`: the upper triangular matrix `R`
  
- `F.p`: the permutation vector of the pivot ([`QRPivoted`](/stdlib/LinearAlgebra#LinearAlgebra.QRPivoted) only)
  
- `F.P`: the permutation matrix of the pivot ([`QRPivoted`](/stdlib/LinearAlgebra#LinearAlgebra.QRPivoted) only)
  

::: tip Note

Each reference to the upper triangular factor via `F.R` allocates a new array. It is therefore advisable to cache that array, say, by `R = F.R` and continue working with `R`.

:::

Iterating the decomposition produces the components `Q`, `R`, and if extant `p`.

The following functions are available for the `QR` objects: [`inv`](/base/math#Base.inv-Tuple{Number}), [`size`](/base/arrays#Base.size), and [`\`](/base/math#Base.:\-Tuple{Any,%20Any}). When `A` is rectangular, `\` will return a least squares solution and if the solution is not unique, the one with smallest norm is returned. When `A` is not full rank, factorization with (column) pivoting is required to obtain a minimum norm solution.

Multiplication with respect to either full/square or non-full/square `Q` is allowed, i.e. both `F.Q*F.R` and `F.Q*A` are supported. A `Q` matrix can be converted into a regular matrix with [`Matrix`](/base/arrays#Base.Matrix). This operation returns the &quot;thin&quot; Q factor, i.e., if `A` is `m`×`n` with `m>=n`, then `Matrix(F.Q)` yields an `m`×`n` matrix with orthonormal columns.  To retrieve the &quot;full&quot; Q factor, an `m`×`m` orthogonal matrix, use `F.Q*I` or `collect(F.Q)`. If `m<=n`, then `Matrix(F.Q)` yields an `m`×`m` orthogonal matrix.

The block size for QR decomposition can be specified by keyword argument `blocksize :: Integer` when `pivot == NoPivot()` and `A isa StridedMatrix{<:BlasFloat}`. It is ignored when `blocksize > minimum(size(A))`. See [`QRCompactWY`](/stdlib/LinearAlgebra#LinearAlgebra.QRCompactWY).

::: tip Julia 1.4

The `blocksize` keyword argument requires Julia 1.4 or later.

:::

**Examples**

```julia
julia> A = [3.0 -6.0; 4.0 -8.0; 0.0 1.0]
3×2 Matrix{Float64}:
 3.0  -6.0
 4.0  -8.0
 0.0   1.0

julia> F = qr(A)
LinearAlgebra.QRCompactWY{Float64, Matrix{Float64}, Matrix{Float64}}
Q factor: 3×3 LinearAlgebra.QRCompactWYQ{Float64, Matrix{Float64}, Matrix{Float64}}
R factor:
2×2 Matrix{Float64}:
 -5.0  10.0
  0.0  -1.0

julia> F.Q * F.R == A
true
```


::: tip Note

`qr` returns multiple types because LAPACK uses several representations that minimize the memory storage requirements of products of Householder elementary reflectors, so that the `Q` and `R` matrices can be stored compactly rather as two separate dense matrices.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/qr.jl#L343-L421)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.qr!' href='#LinearAlgebra.qr!'>#</a>&nbsp;<b><u>LinearAlgebra.qr!</u></b> &mdash; <i>Function</i>.




```julia
qr!(A, pivot = NoPivot(); blocksize)
```


`qr!` is the same as [`qr`](/stdlib/LinearAlgebra#LinearAlgebra.qr) when `A` is a subtype of [`AbstractMatrix`](/base/arrays#Base.AbstractMatrix), but saves space by overwriting the input `A`, instead of creating a copy. An [`InexactError`](/base/base#Core.InexactError) exception is thrown if the factorization produces a number not representable by the element type of `A`, e.g. for integer types.

::: tip Julia 1.4

The `blocksize` keyword argument requires Julia 1.4 or later.

:::

**Examples**

```julia
julia> a = [1. 2.; 3. 4.]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> qr!(a)
LinearAlgebra.QRCompactWY{Float64, Matrix{Float64}, Matrix{Float64}}
Q factor: 2×2 LinearAlgebra.QRCompactWYQ{Float64, Matrix{Float64}, Matrix{Float64}}
R factor:
2×2 Matrix{Float64}:
 -3.16228  -4.42719
  0.0      -0.632456

julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> qr!(a)
ERROR: InexactError: Int64(3.1622776601683795)
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/qr.jl#L297-L333)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LQ' href='#LinearAlgebra.LQ'>#</a>&nbsp;<b><u>LinearAlgebra.LQ</u></b> &mdash; <i>Type</i>.




```julia
LQ <: Factorization
```


Matrix factorization type of the `LQ` factorization of a matrix `A`. The `LQ` decomposition is the [`QR`](/stdlib/LinearAlgebra#LinearAlgebra.QR) decomposition of `transpose(A)`. This is the return type of [`lq`](/stdlib/LinearAlgebra#LinearAlgebra.lq), the corresponding matrix factorization function.

If `S::LQ` is the factorization object, the lower triangular component can be obtained via `S.L`, and the orthogonal/unitary component via `S.Q`, such that `A ≈ S.L*S.Q`.

Iterating the decomposition produces the components `S.L` and `S.Q`.

**Examples**

```julia
julia> A = [5. 7.; -2. -4.]
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> S = lq(A)
LQ{Float64, Matrix{Float64}, Vector{Float64}}
L factor:
2×2 Matrix{Float64}:
 -8.60233   0.0
  4.41741  -0.697486
Q factor: 2×2 LinearAlgebra.LQPackedQ{Float64, Matrix{Float64}, Vector{Float64}}

julia> S.L * S.Q
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> l, q = S; # destructuring via iteration

julia> l == S.L &&  q == S.Q
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lq.jl#L4-L42)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lq' href='#LinearAlgebra.lq'>#</a>&nbsp;<b><u>LinearAlgebra.lq</u></b> &mdash; <i>Function</i>.




```julia
lq(A) -> S::LQ
```


Compute the LQ decomposition of `A`. The decomposition&#39;s lower triangular component can be obtained from the [`LQ`](/stdlib/LinearAlgebra#LinearAlgebra.LQ) object `S` via `S.L`, and the orthogonal/unitary component via `S.Q`, such that `A ≈ S.L*S.Q`.

Iterating the decomposition produces the components `S.L` and `S.Q`.

The LQ decomposition is the QR decomposition of `transpose(A)`, and it is useful in order to compute the minimum-norm solution `lq(A) \ b` to an underdetermined system of equations (`A` has more columns than rows, but has full row rank).

**Examples**

```julia
julia> A = [5. 7.; -2. -4.]
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> S = lq(A)
LQ{Float64, Matrix{Float64}, Vector{Float64}}
L factor:
2×2 Matrix{Float64}:
 -8.60233   0.0
  4.41741  -0.697486
Q factor: 2×2 LinearAlgebra.LQPackedQ{Float64, Matrix{Float64}, Vector{Float64}}

julia> S.L * S.Q
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> l, q = S; # destructuring via iteration

julia> l == S.L &&  q == S.Q
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lq.jl#L73-L111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lq!' href='#LinearAlgebra.lq!'>#</a>&nbsp;<b><u>LinearAlgebra.lq!</u></b> &mdash; <i>Function</i>.




```julia
lq!(A) -> LQ
```


Compute the [`LQ`](/stdlib/LinearAlgebra#LinearAlgebra.LQ) factorization of `A`, using the input matrix as a workspace. See also [`lq`](/stdlib/LinearAlgebra#LinearAlgebra.lq).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lq.jl#L65-L70)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BunchKaufman' href='#LinearAlgebra.BunchKaufman'>#</a>&nbsp;<b><u>LinearAlgebra.BunchKaufman</u></b> &mdash; <i>Type</i>.




```julia
BunchKaufman <: Factorization
```


Matrix factorization type of the Bunch-Kaufman factorization of a symmetric or Hermitian matrix `A` as `P'UDU'P` or `P'LDL'P`, depending on whether the upper (the default) or the lower triangle is stored in `A`. If `A` is complex symmetric then `U'` and `L'` denote the unconjugated transposes, i.e. `transpose(U)` and `transpose(L)`, respectively. This is the return type of [`bunchkaufman`](/stdlib/LinearAlgebra#LinearAlgebra.bunchkaufman), the corresponding matrix factorization function.

If `S::BunchKaufman` is the factorization object, the components can be obtained via `S.D`, `S.U` or `S.L` as appropriate given `S.uplo`, and `S.p`.

Iterating the decomposition produces the components `S.D`, `S.U` or `S.L` as appropriate given `S.uplo`, and `S.p`.

**Examples**

```julia
julia> A = Float64.([1 2; 2 3])
2×2 Matrix{Float64}:
 1.0  2.0
 2.0  3.0

julia> S = bunchkaufman(A) # A gets wrapped internally by Symmetric(A)
BunchKaufman{Float64, Matrix{Float64}, Vector{Int64}}
D factor:
2×2 Tridiagonal{Float64, Vector{Float64}}:
 -0.333333  0.0
  0.0       3.0
U factor:
2×2 UnitUpperTriangular{Float64, Matrix{Float64}}:
 1.0  0.666667
  ⋅   1.0
permutation:
2-element Vector{Int64}:
 1
 2

julia> d, u, p = S; # destructuring via iteration

julia> d == S.D && u == S.U && p == S.p
true

julia> S = bunchkaufman(Symmetric(A, :L))
BunchKaufman{Float64, Matrix{Float64}, Vector{Int64}}
D factor:
2×2 Tridiagonal{Float64, Vector{Float64}}:
 3.0   0.0
 0.0  -0.333333
L factor:
2×2 UnitLowerTriangular{Float64, Matrix{Float64}}:
 1.0        ⋅
 0.666667  1.0
permutation:
2-element Vector{Int64}:
 2
 1
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/bunchkaufman.jl#L16-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.bunchkaufman' href='#LinearAlgebra.bunchkaufman'>#</a>&nbsp;<b><u>LinearAlgebra.bunchkaufman</u></b> &mdash; <i>Function</i>.




```julia
bunchkaufman(A, rook::Bool=false; check = true) -> S::BunchKaufman
```


Compute the Bunch-Kaufman [^Bunch1977] factorization of a symmetric or Hermitian matrix `A` as `P'*U*D*U'*P` or `P'*L*D*L'*P`, depending on which triangle is stored in `A`, and return a [`BunchKaufman`](/stdlib/LinearAlgebra#LinearAlgebra.BunchKaufman) object. Note that if `A` is complex symmetric then `U'` and `L'` denote the unconjugated transposes, i.e. `transpose(U)` and `transpose(L)`.

Iterating the decomposition produces the components `S.D`, `S.U` or `S.L` as appropriate given `S.uplo`, and `S.p`.

If `rook` is `true`, rook pivoting is used. If `rook` is false, rook pivoting is not used.

When `check = true`, an error is thrown if the decomposition fails. When `check = false`, responsibility for checking the decomposition&#39;s validity (via [`issuccess`](/stdlib/LinearAlgebra#LinearAlgebra.issuccess)) lies with the user.

The following functions are available for `BunchKaufman` objects: [`size`](/base/arrays#Base.size), `\`, [`inv`](/base/math#Base.inv-Tuple{Number}), [`issymmetric`](/stdlib/LinearAlgebra#LinearAlgebra.issymmetric), [`ishermitian`](/stdlib/LinearAlgebra#LinearAlgebra.ishermitian), [`getindex`](/base/collections#Base.getindex).

[^Bunch1977]: J R Bunch and L Kaufman, Some stable methods for calculating inertia and solving symmetric linear systems, Mathematics of Computation 31:137 (1977), 163-179. [url](https://www.ams.org/journals/mcom/1977-31-137/S0025-5718-1977-0428694-0/).


**Examples**

```julia
julia> A = Float64.([1 2; 2 3])
2×2 Matrix{Float64}:
 1.0  2.0
 2.0  3.0

julia> S = bunchkaufman(A) # A gets wrapped internally by Symmetric(A)
BunchKaufman{Float64, Matrix{Float64}, Vector{Int64}}
D factor:
2×2 Tridiagonal{Float64, Vector{Float64}}:
 -0.333333  0.0
  0.0       3.0
U factor:
2×2 UnitUpperTriangular{Float64, Matrix{Float64}}:
 1.0  0.666667
  ⋅   1.0
permutation:
2-element Vector{Int64}:
 1
 2

julia> d, u, p = S; # destructuring via iteration

julia> d == S.D && u == S.U && p == S.p
true

julia> S.U*S.D*S.U' - S.P*A*S.P'
2×2 Matrix{Float64}:
 0.0  0.0
 0.0  0.0

julia> S = bunchkaufman(Symmetric(A, :L))
BunchKaufman{Float64, Matrix{Float64}, Vector{Int64}}
D factor:
2×2 Tridiagonal{Float64, Vector{Float64}}:
 3.0   0.0
 0.0  -0.333333
L factor:
2×2 UnitLowerTriangular{Float64, Matrix{Float64}}:
 1.0        ⋅
 0.666667  1.0
permutation:
2-element Vector{Int64}:
 2
 1

julia> S.L*S.D*S.L' - A[S.p, S.p]
2×2 Matrix{Float64}:
 0.0  0.0
 0.0  0.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/bunchkaufman.jl#L130-L207)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.bunchkaufman!' href='#LinearAlgebra.bunchkaufman!'>#</a>&nbsp;<b><u>LinearAlgebra.bunchkaufman!</u></b> &mdash; <i>Function</i>.




```julia
bunchkaufman!(A, rook::Bool=false; check = true) -> BunchKaufman
```


`bunchkaufman!` is the same as [`bunchkaufman`](/stdlib/LinearAlgebra#LinearAlgebra.bunchkaufman), but saves space by overwriting the input `A`, instead of creating a copy.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/bunchkaufman.jl#L102-L107)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Eigen' href='#LinearAlgebra.Eigen'>#</a>&nbsp;<b><u>LinearAlgebra.Eigen</u></b> &mdash; <i>Type</i>.




```julia
Eigen <: Factorization
```


Matrix factorization type of the eigenvalue/spectral decomposition of a square matrix `A`. This is the return type of [`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen), the corresponding matrix factorization function.

If `F::Eigen` is the factorization object, the eigenvalues can be obtained via `F.values` and the eigenvectors as the columns of the matrix `F.vectors`. (The `k`th eigenvector can be obtained from the slice `F.vectors[:, k]`.)

Iterating the decomposition produces the components `F.values` and `F.vectors`.

**Examples**

```julia
julia> F = eigen([1.0 0.0 0.0; 0.0 3.0 0.0; 0.0 0.0 18.0])
Eigen{Float64, Float64, Matrix{Float64}, Vector{Float64}}
values:
3-element Vector{Float64}:
  1.0
  3.0
 18.0
vectors:
3×3 Matrix{Float64}:
 1.0  0.0  0.0
 0.0  1.0  0.0
 0.0  0.0  1.0

julia> F.values
3-element Vector{Float64}:
  1.0
  3.0
 18.0

julia> F.vectors
3×3 Matrix{Float64}:
 1.0  0.0  0.0
 0.0  1.0  0.0
 0.0  0.0  1.0

julia> vals, vecs = F; # destructuring via iteration

julia> vals == F.values && vecs == F.vectors
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L4-L49)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.GeneralizedEigen' href='#LinearAlgebra.GeneralizedEigen'>#</a>&nbsp;<b><u>LinearAlgebra.GeneralizedEigen</u></b> &mdash; <i>Type</i>.




```julia
GeneralizedEigen <: Factorization
```


Matrix factorization type of the generalized eigenvalue/spectral decomposition of `A` and `B`. This is the return type of [`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen), the corresponding matrix factorization function, when called with two matrix arguments.

If `F::GeneralizedEigen` is the factorization object, the eigenvalues can be obtained via `F.values` and the eigenvectors as the columns of the matrix `F.vectors`. (The `k`th eigenvector can be obtained from the slice `F.vectors[:, k]`.)

Iterating the decomposition produces the components `F.values` and `F.vectors`.

**Examples**

```julia
julia> A = [1 0; 0 -1]
2×2 Matrix{Int64}:
 1   0
 0  -1

julia> B = [0 1; 1 0]
2×2 Matrix{Int64}:
 0  1
 1  0

julia> F = eigen(A, B)
GeneralizedEigen{ComplexF64, ComplexF64, Matrix{ComplexF64}, Vector{ComplexF64}}
values:
2-element Vector{ComplexF64}:
 0.0 - 1.0im
 0.0 + 1.0im
vectors:
2×2 Matrix{ComplexF64}:
  0.0+1.0im   0.0-1.0im
 -1.0+0.0im  -1.0-0.0im

julia> F.values
2-element Vector{ComplexF64}:
 0.0 - 1.0im
 0.0 + 1.0im

julia> F.vectors
2×2 Matrix{ComplexF64}:
  0.0+1.0im   0.0-1.0im
 -1.0+0.0im  -1.0-0.0im

julia> vals, vecs = F; # destructuring via iteration

julia> vals == F.values && vecs == F.vectors
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L60-L111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.eigvals' href='#LinearAlgebra.eigvals'>#</a>&nbsp;<b><u>LinearAlgebra.eigvals</u></b> &mdash; <i>Function</i>.




```julia
eigvals(A; permute::Bool=true, scale::Bool=true, sortby) -> values
```


Return the eigenvalues of `A`.

For general non-symmetric matrices it is possible to specify how the matrix is balanced before the eigenvalue calculation. The `permute`, `scale`, and `sortby` keywords are the same as for [`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen).

**Examples**

```julia
julia> diag_matrix = [1 0; 0 4]
2×2 Matrix{Int64}:
 1  0
 0  4

julia> eigvals(diag_matrix)
2-element Vector{Float64}:
 1.0
 4.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L321-L342)



For a scalar input, `eigvals` will return a scalar.

**Examples**

```julia
julia> eigvals(-2)
-2
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L346-L354)



```julia
eigvals(A, B) -> values
```


Compute the generalized eigenvalues of `A` and `B`.

**Examples**

```julia
julia> A = [1 0; 0 -1]
2×2 Matrix{Int64}:
 1   0
 0  -1

julia> B = [0 1; 1 0]
2×2 Matrix{Int64}:
 0  1
 1  0

julia> eigvals(A,B)
2-element Vector{ComplexF64}:
 0.0 - 1.0im
 0.0 + 1.0im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L599-L621)



```julia
eigvals(A::Union{SymTridiagonal, Hermitian, Symmetric}, irange::UnitRange) -> values
```


Return the eigenvalues of `A`. It is possible to calculate only a subset of the eigenvalues by specifying a [`UnitRange`](/base/collections#Base.UnitRange) `irange` covering indices of the sorted eigenvalues, e.g. the 2nd to 8th eigenvalues.

**Examples**

```julia
julia> A = SymTridiagonal([1.; 2.; 1.], [2.; 3.])
3×3 SymTridiagonal{Float64, Vector{Float64}}:
 1.0  2.0   ⋅
 2.0  2.0  3.0
  ⋅   3.0  1.0

julia> eigvals(A, 2:2)
1-element Vector{Float64}:
 0.9999999999999996

julia> eigvals(A)
3-element Vector{Float64}:
 -2.1400549446402604
  1.0000000000000002
  5.140054944640259
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetriceigen.jl#L86-L111)



```julia
eigvals(A::Union{SymTridiagonal, Hermitian, Symmetric}, vl::Real, vu::Real) -> values
```


Return the eigenvalues of `A`. It is possible to calculate only a subset of the eigenvalues by specifying a pair `vl` and `vu` for the lower and upper boundaries of the eigenvalues.

**Examples**

```julia
julia> A = SymTridiagonal([1.; 2.; 1.], [2.; 3.])
3×3 SymTridiagonal{Float64, Vector{Float64}}:
 1.0  2.0   ⋅
 2.0  2.0  3.0
  ⋅   3.0  1.0

julia> eigvals(A, -1, 2)
1-element Vector{Float64}:
 1.0000000000000009

julia> eigvals(A)
3-element Vector{Float64}:
 -2.1400549446402604
  1.0000000000000002
  5.140054944640259
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetriceigen.jl#L126-L150)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.eigvals!' href='#LinearAlgebra.eigvals!'>#</a>&nbsp;<b><u>LinearAlgebra.eigvals!</u></b> &mdash; <i>Function</i>.




```julia
eigvals!(A; permute::Bool=true, scale::Bool=true, sortby) -> values
```


Same as [`eigvals`](/stdlib/LinearAlgebra#LinearAlgebra.eigvals), but saves space by overwriting the input `A`, instead of creating a copy. The `permute`, `scale`, and `sortby` keywords are the same as for [`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen).

::: tip Note

The input matrix `A` will not contain its eigenvalues after `eigvals!` is called on it - `A` is used as a workspace.

:::

**Examples**

```julia
julia> A = [1. 2.; 3. 4.]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> eigvals!(A)
2-element Vector{Float64}:
 -0.3722813232690143
  5.372281323269014

julia> A
2×2 Matrix{Float64}:
 -0.372281  -1.0
  0.0        5.37228
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L280-L307)



```julia
eigvals!(A, B; sortby) -> values
```


Same as [`eigvals`](/stdlib/LinearAlgebra#LinearAlgebra.eigvals), but saves space by overwriting the input `A` (and `B`), instead of creating copies.

::: tip Note

The input matrices `A` and `B` will not contain their eigenvalues after `eigvals!` is called. They are used as workspaces.

:::

**Examples**

```julia
julia> A = [1. 0.; 0. -1.]
2×2 Matrix{Float64}:
 1.0   0.0
 0.0  -1.0

julia> B = [0. 1.; 1. 0.]
2×2 Matrix{Float64}:
 0.0  1.0
 1.0  0.0

julia> eigvals!(A, B)
2-element Vector{ComplexF64}:
 0.0 - 1.0im
 0.0 + 1.0im

julia> A
2×2 Matrix{Float64}:
 -0.0  -1.0
  1.0  -0.0

julia> B
2×2 Matrix{Float64}:
 1.0  0.0
 0.0  1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L542-L579)



```julia
eigvals!(A::Union{SymTridiagonal, Hermitian, Symmetric}, irange::UnitRange) -> values
```


Same as [`eigvals`](/stdlib/LinearAlgebra#LinearAlgebra.eigvals), but saves space by overwriting the input `A`, instead of creating a copy. `irange` is a range of eigenvalue _indices_ to search for - for instance, the 2nd to 8th eigenvalues.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetriceigen.jl#L77-L82)



```julia
eigvals!(A::Union{SymTridiagonal, Hermitian, Symmetric}, vl::Real, vu::Real) -> values
```


Same as [`eigvals`](/stdlib/LinearAlgebra#LinearAlgebra.eigvals), but saves space by overwriting the input `A`, instead of creating a copy. `vl` is the lower bound of the interval to search for eigenvalues, and `vu` is the upper bound.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetriceigen.jl#L117-L122)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.eigmax' href='#LinearAlgebra.eigmax'>#</a>&nbsp;<b><u>LinearAlgebra.eigmax</u></b> &mdash; <i>Function</i>.




```julia
eigmax(A; permute::Bool=true, scale::Bool=true)
```


Return the largest eigenvalue of `A`. The option `permute=true` permutes the matrix to become closer to upper triangular, and `scale=true` scales the matrix by its diagonal elements to make rows and columns more equal in norm. Note that if the eigenvalues of `A` are complex, this method will fail, since complex numbers cannot be sorted.

**Examples**

```julia
julia> A = [0 im; -im 0]
2×2 Matrix{Complex{Int64}}:
 0+0im  0+1im
 0-1im  0+0im

julia> eigmax(A)
1.0

julia> A = [0 im; -1 0]
2×2 Matrix{Complex{Int64}}:
  0+0im  0+1im
 -1+0im  0+0im

julia> eigmax(A)
ERROR: DomainError with Complex{Int64}[0+0im 0+1im; -1+0im 0+0im]:
`A` cannot have complex eigenvalues.
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L357-L389)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.eigmin' href='#LinearAlgebra.eigmin'>#</a>&nbsp;<b><u>LinearAlgebra.eigmin</u></b> &mdash; <i>Function</i>.




```julia
eigmin(A; permute::Bool=true, scale::Bool=true)
```


Return the smallest eigenvalue of `A`. The option `permute=true` permutes the matrix to become closer to upper triangular, and `scale=true` scales the matrix by its diagonal elements to make rows and columns more equal in norm. Note that if the eigenvalues of `A` are complex, this method will fail, since complex numbers cannot be sorted.

**Examples**

```julia
julia> A = [0 im; -im 0]
2×2 Matrix{Complex{Int64}}:
 0+0im  0+1im
 0-1im  0+0im

julia> eigmin(A)
-1.0

julia> A = [0 im; -1 0]
2×2 Matrix{Complex{Int64}}:
  0+0im  0+1im
 -1+0im  0+0im

julia> eigmin(A)
ERROR: DomainError with Complex{Int64}[0+0im 0+1im; -1+0im 0+0im]:
`A` cannot have complex eigenvalues.
Stacktrace:
[...]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L398-L430)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.eigvecs' href='#LinearAlgebra.eigvecs'>#</a>&nbsp;<b><u>LinearAlgebra.eigvecs</u></b> &mdash; <i>Function</i>.




```julia
eigvecs(A::SymTridiagonal[, eigvals]) -> Matrix
```


Return a matrix `M` whose columns are the eigenvectors of `A`. (The `k`th eigenvector can be obtained from the slice `M[:, k]`.)

If the optional vector of eigenvalues `eigvals` is specified, `eigvecs` returns the specific corresponding eigenvectors.

**Examples**

```julia
julia> A = SymTridiagonal([1.; 2.; 1.], [2.; 3.])
3×3 SymTridiagonal{Float64, Vector{Float64}}:
 1.0  2.0   ⋅
 2.0  2.0  3.0
  ⋅   3.0  1.0

julia> eigvals(A)
3-element Vector{Float64}:
 -2.1400549446402604
  1.0000000000000002
  5.140054944640259

julia> eigvecs(A)
3×3 Matrix{Float64}:
  0.418304  -0.83205      0.364299
 -0.656749  -7.39009e-16  0.754109
  0.627457   0.5547       0.546448

julia> eigvecs(A, [1.])
3×1 Matrix{Float64}:
  0.8320502943378438
  4.263514128092366e-17
 -0.5547001962252291
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/tridiag.jl#L290-L325)



```julia
eigvecs(A; permute::Bool=true, scale::Bool=true, `sortby`) -> Matrix
```


Return a matrix `M` whose columns are the eigenvectors of `A`. (The `k`th eigenvector can be obtained from the slice `M[:, k]`.) The `permute`, `scale`, and `sortby` keywords are the same as for [`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen).

**Examples**

```julia
julia> eigvecs([1.0 0.0 0.0; 0.0 3.0 0.0; 0.0 0.0 18.0])
3×3 Matrix{Float64}:
 1.0  0.0  0.0
 0.0  1.0  0.0
 0.0  0.0  1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L258-L273)



```julia
eigvecs(A, B) -> Matrix
```


Return a matrix `M` whose columns are the generalized eigenvectors of `A` and `B`. (The `k`th eigenvector can be obtained from the slice `M[:, k]`.)

**Examples**

```julia
julia> A = [1 0; 0 -1]
2×2 Matrix{Int64}:
 1   0
 0  -1

julia> B = [0 1; 1 0]
2×2 Matrix{Int64}:
 0  1
 1  0

julia> eigvecs(A, B)
2×2 Matrix{ComplexF64}:
  0.0+1.0im   0.0-1.0im
 -1.0+0.0im  -1.0-0.0im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L627-L650)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.eigen' href='#LinearAlgebra.eigen'>#</a>&nbsp;<b><u>LinearAlgebra.eigen</u></b> &mdash; <i>Function</i>.




```julia
eigen(A; permute::Bool=true, scale::Bool=true, sortby) -> Eigen
```


Compute the eigenvalue decomposition of `A`, returning an [`Eigen`](/stdlib/LinearAlgebra#LinearAlgebra.Eigen) factorization object `F` which contains the eigenvalues in `F.values` and the eigenvectors in the columns of the matrix `F.vectors`. This corresponds to solving an eigenvalue problem of the form `Ax =  λx`, where `A` is a matrix, `x` is an eigenvector, and `λ` is an eigenvalue. (The `k`th eigenvector can be obtained from the slice `F.vectors[:, k]`.)

Iterating the decomposition produces the components `F.values` and `F.vectors`.

The following functions are available for `Eigen` objects: [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), and [`isposdef`](/stdlib/LinearAlgebra#LinearAlgebra.isposdef).

For general nonsymmetric matrices it is possible to specify how the matrix is balanced before the eigenvector calculation. The option `permute=true` permutes the matrix to become closer to upper triangular, and `scale=true` scales the matrix by its diagonal elements to make rows and columns more equal in norm. The default is `true` for both options.

By default, the eigenvalues and vectors are sorted lexicographically by `(real(λ),imag(λ))`. A different comparison function `by(λ)` can be passed to `sortby`, or you can pass `sortby=nothing` to leave the eigenvalues in an arbitrary order.   Some special matrix types (e.g. [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal) or [`SymTridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.SymTridiagonal)) may implement their own sorting convention and not accept a `sortby` keyword.

**Examples**

```julia
julia> F = eigen([1.0 0.0 0.0; 0.0 3.0 0.0; 0.0 0.0 18.0])
Eigen{Float64, Float64, Matrix{Float64}, Vector{Float64}}
values:
3-element Vector{Float64}:
  1.0
  3.0
 18.0
vectors:
3×3 Matrix{Float64}:
 1.0  0.0  0.0
 0.0  1.0  0.0
 0.0  0.0  1.0

julia> F.values
3-element Vector{Float64}:
  1.0
  3.0
 18.0

julia> F.vectors
3×3 Matrix{Float64}:
 1.0  0.0  0.0
 0.0  1.0  0.0
 0.0  0.0  1.0

julia> vals, vecs = F; # destructuring via iteration

julia> vals == F.values && vecs == F.vectors
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L181-L237)



```julia
eigen(A, B; sortby) -> GeneralizedEigen
```


Compute the generalized eigenvalue decomposition of `A` and `B`, returning a [`GeneralizedEigen`](/stdlib/LinearAlgebra#LinearAlgebra.GeneralizedEigen) factorization object `F` which contains the generalized eigenvalues in `F.values` and the generalized eigenvectors in the columns of the matrix `F.vectors`. This corresponds to solving a generalized eigenvalue problem of the form `Ax =  λBx`, where `A, B` are matrices, `x` is an eigenvector, and `λ` is an eigenvalue. (The `k`th generalized eigenvector can be obtained from the slice `F.vectors[:, k]`.)

Iterating the decomposition produces the components `F.values` and `F.vectors`.

By default, the eigenvalues and vectors are sorted lexicographically by `(real(λ),imag(λ))`. A different comparison function `by(λ)` can be passed to `sortby`, or you can pass `sortby=nothing` to leave the eigenvalues in an arbitrary order.

**Examples**

```julia
julia> A = [1 0; 0 -1]
2×2 Matrix{Int64}:
 1   0
 0  -1

julia> B = [0 1; 1 0]
2×2 Matrix{Int64}:
 0  1
 1  0

julia> F = eigen(A, B);

julia> F.values
2-element Vector{ComplexF64}:
 0.0 - 1.0im
 0.0 + 1.0im

julia> F.vectors
2×2 Matrix{ComplexF64}:
  0.0+1.0im   0.0-1.0im
 -1.0+0.0im  -1.0-0.0im

julia> vals, vecs = F; # destructuring via iteration

julia> vals == F.values && vecs == F.vectors
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L481-L526)



```julia
eigen(A::Union{SymTridiagonal, Hermitian, Symmetric}, irange::UnitRange) -> Eigen
```


Compute the eigenvalue decomposition of `A`, returning an [`Eigen`](/stdlib/LinearAlgebra#LinearAlgebra.Eigen) factorization object `F` which contains the eigenvalues in `F.values` and the eigenvectors in the columns of the matrix `F.vectors`. (The `k`th eigenvector can be obtained from the slice `F.vectors[:, k]`.)

Iterating the decomposition produces the components `F.values` and `F.vectors`.

The following functions are available for `Eigen` objects: [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), and [`isposdef`](/stdlib/LinearAlgebra#LinearAlgebra.isposdef).

The [`UnitRange`](/base/collections#Base.UnitRange) `irange` specifies indices of the sorted eigenvalues to search for.

::: tip Note

If `irange` is not `1:n`, where `n` is the dimension of `A`, then the returned factorization will be a _truncated_ factorization.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetriceigen.jl#L19-L35)



```julia
eigen(A::Union{SymTridiagonal, Hermitian, Symmetric}, vl::Real, vu::Real) -> Eigen
```


Compute the eigenvalue decomposition of `A`, returning an [`Eigen`](/stdlib/LinearAlgebra#LinearAlgebra.Eigen) factorization object `F` which contains the eigenvalues in `F.values` and the eigenvectors in the columns of the matrix `F.vectors`. (The `k`th eigenvector can be obtained from the slice `F.vectors[:, k]`.)

Iterating the decomposition produces the components `F.values` and `F.vectors`.

The following functions are available for `Eigen` objects: [`inv`](/base/math#Base.inv-Tuple{Number}), [`det`](/stdlib/LinearAlgebra#LinearAlgebra.det), and [`isposdef`](/stdlib/LinearAlgebra#LinearAlgebra.isposdef).

`vl` is the lower bound of the window of eigenvalues to search for, and `vu` is the upper bound.

::: tip Note

If [`vl`, `vu`] does not contain all eigenvalues of `A`, then the returned factorization will be a _truncated_ factorization.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetriceigen.jl#L44-L60)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.eigen!' href='#LinearAlgebra.eigen!'>#</a>&nbsp;<b><u>LinearAlgebra.eigen!</u></b> &mdash; <i>Function</i>.




```julia
eigen!(A; permute, scale, sortby)
eigen!(A, B; sortby)
```


Same as [`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen), but saves space by overwriting the input `A` (and `B`), instead of creating a copy.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/eigen.jl#L142-L148)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Hessenberg' href='#LinearAlgebra.Hessenberg'>#</a>&nbsp;<b><u>LinearAlgebra.Hessenberg</u></b> &mdash; <i>Type</i>.




```julia
Hessenberg <: Factorization
```


A `Hessenberg` object represents the Hessenberg factorization `QHQ'` of a square matrix, or a shift `Q(H+μI)Q'` thereof, which is produced by the [`hessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.hessenberg) function.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/hessenberg.jl#L374-L379)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.hessenberg' href='#LinearAlgebra.hessenberg'>#</a>&nbsp;<b><u>LinearAlgebra.hessenberg</u></b> &mdash; <i>Function</i>.




```julia
hessenberg(A) -> Hessenberg
```


Compute the Hessenberg decomposition of `A` and return a `Hessenberg` object. If `F` is the factorization object, the unitary matrix can be accessed with `F.Q` (of type `LinearAlgebra.HessenbergQ`) and the Hessenberg matrix with `F.H` (of type [`UpperHessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.UpperHessenberg)), either of which may be converted to a regular matrix with `Matrix(F.H)` or `Matrix(F.Q)`.

If `A` is [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) or real-[`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric), then the Hessenberg decomposition produces a real-symmetric tridiagonal matrix and `F.H` is of type [`SymTridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.SymTridiagonal).

Note that the shifted factorization `A+μI = Q (H+μI) Q'` can be constructed efficiently by `F + μ*I` using the [`UniformScaling`](/stdlib/LinearAlgebra#LinearAlgebra.UniformScaling) object [`I`](/stdlib/LinearAlgebra#LinearAlgebra.I), which creates a new `Hessenberg` object with shared storage and a modified shift.   The shift of a given `F` is obtained by `F.μ`. This is useful because multiple shifted solves `(F + μ*I) \ b` (for different `μ` and/or `b`) can be performed efficiently once `F` is created.

Iterating the decomposition produces the factors `F.Q, F.H, F.μ`.

**Examples**

```julia
julia> A = [4. 9. 7.; 4. 4. 1.; 4. 3. 2.]
3×3 Matrix{Float64}:
 4.0  9.0  7.0
 4.0  4.0  1.0
 4.0  3.0  2.0

julia> F = hessenberg(A)
Hessenberg{Float64, UpperHessenberg{Float64, Matrix{Float64}}, Matrix{Float64}, Vector{Float64}, Bool}
Q factor: 3×3 LinearAlgebra.HessenbergQ{Float64, Matrix{Float64}, Vector{Float64}, false}
H factor:
3×3 UpperHessenberg{Float64, Matrix{Float64}}:
  4.0      -11.3137       -1.41421
 -5.65685    5.0           2.0
   ⋅        -8.88178e-16   1.0

julia> F.Q * F.H * F.Q'
3×3 Matrix{Float64}:
 4.0  9.0  7.0
 4.0  4.0  1.0
 4.0  3.0  2.0

julia> q, h = F; # destructuring via iteration

julia> q == F.Q && h == F.H
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/hessenberg.jl#L422-L471)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.hessenberg!' href='#LinearAlgebra.hessenberg!'>#</a>&nbsp;<b><u>LinearAlgebra.hessenberg!</u></b> &mdash; <i>Function</i>.




```julia
hessenberg!(A) -> Hessenberg
```


`hessenberg!` is the same as [`hessenberg`](/stdlib/LinearAlgebra#LinearAlgebra.hessenberg), but saves space by overwriting the input `A`, instead of creating a copy.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/hessenberg.jl#L414-L419)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Schur' href='#LinearAlgebra.Schur'>#</a>&nbsp;<b><u>LinearAlgebra.Schur</u></b> &mdash; <i>Type</i>.




```julia
Schur <: Factorization
```


Matrix factorization type of the Schur factorization of a matrix `A`. This is the return type of [`schur(_)`](/stdlib/LinearAlgebra#LinearAlgebra.schur), the corresponding matrix factorization function.

If `F::Schur` is the factorization object, the (quasi) triangular Schur factor can be obtained via either `F.Schur` or `F.T` and the orthogonal/unitary Schur vectors via `F.vectors` or `F.Z` such that `A = F.vectors * F.Schur * F.vectors'`. The eigenvalues of `A` can be obtained with `F.values`.

Iterating the decomposition produces the components `F.T`, `F.Z`, and `F.values`.

**Examples**

```julia
julia> A = [5. 7.; -2. -4.]
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> F = schur(A)
Schur{Float64, Matrix{Float64}, Vector{Float64}}
T factor:
2×2 Matrix{Float64}:
 3.0   9.0
 0.0  -2.0
Z factor:
2×2 Matrix{Float64}:
  0.961524  0.274721
 -0.274721  0.961524
eigenvalues:
2-element Vector{Float64}:
  3.0
 -2.0

julia> F.vectors * F.Schur * F.vectors'
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> t, z, vals = F; # destructuring via iteration

julia> t == F.T && z == F.Z && vals == F.values
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L4-L49)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.GeneralizedSchur' href='#LinearAlgebra.GeneralizedSchur'>#</a>&nbsp;<b><u>LinearAlgebra.GeneralizedSchur</u></b> &mdash; <i>Type</i>.




```julia
GeneralizedSchur <: Factorization
```


Matrix factorization type of the generalized Schur factorization of two matrices `A` and `B`. This is the return type of [`schur(_, _)`](/stdlib/LinearAlgebra#LinearAlgebra.schur), the corresponding matrix factorization function.

If `F::GeneralizedSchur` is the factorization object, the (quasi) triangular Schur factors can be obtained via `F.S` and `F.T`, the left unitary/orthogonal Schur vectors via `F.left` or `F.Q`, and the right unitary/orthogonal Schur vectors can be obtained with `F.right` or `F.Z` such that `A=F.left*F.S*F.right'` and `B=F.left*F.T*F.right'`. The generalized eigenvalues of `A` and `B` can be obtained with `F.α./F.β`.

Iterating the decomposition produces the components `F.S`, `F.T`, `F.Q`, `F.Z`, `F.α`, and `F.β`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L293-L309)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.schur' href='#LinearAlgebra.schur'>#</a>&nbsp;<b><u>LinearAlgebra.schur</u></b> &mdash; <i>Function</i>.




```julia
schur(A) -> F::Schur
```


Computes the Schur factorization of the matrix `A`. The (quasi) triangular Schur factor can be obtained from the `Schur` object `F` with either `F.Schur` or `F.T` and the orthogonal/unitary Schur vectors can be obtained with `F.vectors` or `F.Z` such that `A = F.vectors * F.Schur * F.vectors'`. The eigenvalues of `A` can be obtained with `F.values`.

For real `A`, the Schur factorization is &quot;quasitriangular&quot;, which means that it is upper-triangular except with 2×2 diagonal blocks for any conjugate pair of complex eigenvalues; this allows the factorization to be purely real even when there are complex eigenvalues.  To obtain the (complex) purely upper-triangular Schur factorization from a real quasitriangular factorization, you can use `Schur{Complex}(schur(A))`.

Iterating the decomposition produces the components `F.T`, `F.Z`, and `F.values`.

**Examples**

```julia
julia> A = [5. 7.; -2. -4.]
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> F = schur(A)
Schur{Float64, Matrix{Float64}, Vector{Float64}}
T factor:
2×2 Matrix{Float64}:
 3.0   9.0
 0.0  -2.0
Z factor:
2×2 Matrix{Float64}:
  0.961524  0.274721
 -0.274721  0.961524
eigenvalues:
2-element Vector{Float64}:
  3.0
 -2.0

julia> F.vectors * F.Schur * F.vectors'
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> t, z, vals = F; # destructuring via iteration

julia> t == F.T && z == F.Z && vals == F.values
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L107-L156)



```julia
schur(A, B) -> F::GeneralizedSchur
```


Computes the Generalized Schur (or QZ) factorization of the matrices `A` and `B`. The (quasi) triangular Schur factors can be obtained from the `Schur` object `F` with `F.S` and `F.T`, the left unitary/orthogonal Schur vectors can be obtained with `F.left` or `F.Q` and the right unitary/orthogonal Schur vectors can be obtained with `F.right` or `F.Z` such that `A=F.left*F.S*F.right'` and `B=F.left*F.T*F.right'`. The generalized eigenvalues of `A` and `B` can be obtained with `F.α./F.β`.

Iterating the decomposition produces the components `F.S`, `F.T`, `F.Q`, `F.Z`, `F.α`, and `F.β`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L356-L368)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.schur!' href='#LinearAlgebra.schur!'>#</a>&nbsp;<b><u>LinearAlgebra.schur!</u></b> &mdash; <i>Function</i>.




```julia
schur!(A) -> F::Schur
```


Same as [`schur`](/stdlib/LinearAlgebra#LinearAlgebra.schur) but uses the input argument `A` as workspace.

**Examples**

```julia
julia> A = [5. 7.; -2. -4.]
2×2 Matrix{Float64}:
  5.0   7.0
 -2.0  -4.0

julia> F = schur!(A)
Schur{Float64, Matrix{Float64}, Vector{Float64}}
T factor:
2×2 Matrix{Float64}:
 3.0   9.0
 0.0  -2.0
Z factor:
2×2 Matrix{Float64}:
  0.961524  0.274721
 -0.274721  0.961524
eigenvalues:
2-element Vector{Float64}:
  3.0
 -2.0

julia> A
2×2 Matrix{Float64}:
 3.0   9.0
 0.0  -2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L70-L102)



```julia
schur!(A::StridedMatrix, B::StridedMatrix) -> F::GeneralizedSchur
```


Same as [`schur`](/stdlib/LinearAlgebra#LinearAlgebra.schur) but uses the input matrices `A` and `B` as workspace.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L343-L347)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ordschur' href='#LinearAlgebra.ordschur'>#</a>&nbsp;<b><u>LinearAlgebra.ordschur</u></b> &mdash; <i>Function</i>.




```julia
ordschur(F::Schur, select::Union{Vector{Bool},BitVector}) -> F::Schur
```


Reorders the Schur factorization `F` of a matrix `A = Z*T*Z'` according to the logical array `select` returning the reordered factorization `F` object. The selected eigenvalues appear in the leading diagonal of `F.Schur` and the corresponding leading columns of `F.vectors` form an orthogonal/unitary basis of the corresponding right invariant subspace. In the real case, a complex conjugate pair of eigenvalues must be either both included or both excluded via `select`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L280-L289)



```julia
ordschur(F::GeneralizedSchur, select::Union{Vector{Bool},BitVector}) -> F::GeneralizedSchur
```


Reorders the Generalized Schur factorization `F` of a matrix pair `(A, B) = (Q*S*Z', Q*T*Z')` according to the logical array `select` and returns a GeneralizedSchur object `F`. The selected eigenvalues appear in the leading diagonal of both `F.S` and `F.T`, and the left and right orthogonal/unitary Schur vectors are also reordered such that `(A, B) = F.Q*(F.S, F.T)*F.Z'` still holds and the generalized eigenvalues of `A` and `B` can still be obtained with `F.α./F.β`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L394-L403)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ordschur!' href='#LinearAlgebra.ordschur!'>#</a>&nbsp;<b><u>LinearAlgebra.ordschur!</u></b> &mdash; <i>Function</i>.




```julia
ordschur!(F::Schur, select::Union{Vector{Bool},BitVector}) -> F::Schur
```


Same as [`ordschur`](/stdlib/LinearAlgebra#LinearAlgebra.ordschur) but overwrites the factorization `F`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L263-L267)



```julia
ordschur!(F::GeneralizedSchur, select::Union{Vector{Bool},BitVector}) -> F::GeneralizedSchur
```


Same as `ordschur` but overwrites the factorization `F`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/schur.jl#L374-L378)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.SVD' href='#LinearAlgebra.SVD'>#</a>&nbsp;<b><u>LinearAlgebra.SVD</u></b> &mdash; <i>Type</i>.




```julia
SVD <: Factorization
```


Matrix factorization type of the singular value decomposition (SVD) of a matrix `A`. This is the return type of [`svd(_)`](/stdlib/LinearAlgebra#LinearAlgebra.svd), the corresponding matrix factorization function.

If `F::SVD` is the factorization object, `U`, `S`, `V` and `Vt` can be obtained via `F.U`, `F.S`, `F.V` and `F.Vt`, such that `A = U * Diagonal(S) * Vt`. The singular values in `S` are sorted in descending order.

Iterating the decomposition produces the components `U`, `S`, and `V`.

**Examples**

```julia
julia> A = [1. 0. 0. 0. 2.; 0. 0. 3. 0. 0.; 0. 0. 0. 0. 0.; 0. 2. 0. 0. 0.]
4×5 Matrix{Float64}:
 1.0  0.0  0.0  0.0  2.0
 0.0  0.0  3.0  0.0  0.0
 0.0  0.0  0.0  0.0  0.0
 0.0  2.0  0.0  0.0  0.0

julia> F = svd(A)
SVD{Float64, Float64, Matrix{Float64}, Vector{Float64}}
U factor:
4×4 Matrix{Float64}:
 0.0  1.0   0.0  0.0
 1.0  0.0   0.0  0.0
 0.0  0.0   0.0  1.0
 0.0  0.0  -1.0  0.0
singular values:
4-element Vector{Float64}:
 3.0
 2.23606797749979
 2.0
 0.0
Vt factor:
4×5 Matrix{Float64}:
 -0.0        0.0  1.0  -0.0  0.0
  0.447214   0.0  0.0   0.0  0.894427
  0.0       -1.0  0.0   0.0  0.0
  0.0        0.0  0.0   1.0  0.0

julia> F.U * Diagonal(F.S) * F.Vt
4×5 Matrix{Float64}:
 1.0  0.0  0.0  0.0  2.0
 0.0  0.0  3.0  0.0  0.0
 0.0  0.0  0.0  0.0  0.0
 0.0  2.0  0.0  0.0  0.0

julia> u, s, v = F; # destructuring via iteration

julia> u == F.U && s == F.S && v == F.V
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L4-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.GeneralizedSVD' href='#LinearAlgebra.GeneralizedSVD'>#</a>&nbsp;<b><u>LinearAlgebra.GeneralizedSVD</u></b> &mdash; <i>Type</i>.




```julia
GeneralizedSVD <: Factorization
```


Matrix factorization type of the generalized singular value decomposition (SVD) of two matrices `A` and `B`, such that `A = F.U*F.D1*F.R0*F.Q'` and `B = F.V*F.D2*F.R0*F.Q'`. This is the return type of [`svd(_, _)`](/stdlib/LinearAlgebra#LinearAlgebra.svd), the corresponding matrix factorization function.

For an M-by-N matrix `A` and P-by-N matrix `B`,
- `U` is a M-by-M orthogonal matrix,
  
- `V` is a P-by-P orthogonal matrix,
  
- `Q` is a N-by-N orthogonal matrix,
  
- `D1` is a M-by-(K+L) diagonal matrix with 1s in the first K entries,
  
- `D2` is a P-by-(K+L) matrix whose top right L-by-L block is diagonal,
  
- `R0` is a (K+L)-by-N matrix whose rightmost (K+L)-by-(K+L) block is          nonsingular upper block triangular,
  

`K+L` is the effective numerical rank of the matrix `[A; B]`.

Iterating the decomposition produces the components `U`, `V`, `Q`, `D1`, `D2`, and `R0`.

The entries of `F.D1` and `F.D2` are related, as explained in the LAPACK documentation for the [generalized SVD](https://www.netlib.org/lapack/lug/node36.html) and the [xGGSVD3](https://www.netlib.org/lapack/explore-html/d6/db3/dggsvd3_8f.html) routine which is called underneath (in LAPACK 3.6.0 and newer).

**Examples**

```julia
julia> A = [1. 0.; 0. -1.]
2×2 Matrix{Float64}:
 1.0   0.0
 0.0  -1.0

julia> B = [0. 1.; 1. 0.]
2×2 Matrix{Float64}:
 0.0  1.0
 1.0  0.0

julia> F = svd(A, B)
GeneralizedSVD{Float64, Matrix{Float64}, Float64, Vector{Float64}}
U factor:
2×2 Matrix{Float64}:
 1.0  0.0
 0.0  1.0
V factor:
2×2 Matrix{Float64}:
 -0.0  -1.0
  1.0   0.0
Q factor:
2×2 Matrix{Float64}:
 1.0  0.0
 0.0  1.0
D1 factor:
2×2 Matrix{Float64}:
 0.707107  0.0
 0.0       0.707107
D2 factor:
2×2 Matrix{Float64}:
 0.707107  0.0
 0.0       0.707107
R0 factor:
2×2 Matrix{Float64}:
 1.41421   0.0
 0.0      -1.41421

julia> F.U*F.D1*F.R0*F.Q'
2×2 Matrix{Float64}:
 1.0   0.0
 0.0  -1.0

julia> F.V*F.D2*F.R0*F.Q'
2×2 Matrix{Float64}:
 -0.0  1.0
  1.0  0.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L281-L358)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.svd' href='#LinearAlgebra.svd'>#</a>&nbsp;<b><u>LinearAlgebra.svd</u></b> &mdash; <i>Function</i>.




```julia
svd(A; full::Bool = false, alg::Algorithm = default_svd_alg(A)) -> SVD
```


Compute the singular value decomposition (SVD) of `A` and return an `SVD` object.

`U`, `S`, `V` and `Vt` can be obtained from the factorization `F` with `F.U`, `F.S`, `F.V` and `F.Vt`, such that `A = U * Diagonal(S) * Vt`. The algorithm produces `Vt` and hence `Vt` is more efficient to extract than `V`. The singular values in `S` are sorted in descending order.

Iterating the decomposition produces the components `U`, `S`, and `V`.

If `full = false` (default), a &quot;thin&quot; SVD is returned. For an $M \times N$ matrix `A`, in the full factorization `U` is $M \times M$ and `V` is $N \times N$, while in the thin factorization `U` is $M \times K$ and `V` is $N \times K$, where $K = \min(M,N)$ is the number of singular values.

If `alg = DivideAndConquer()` a divide-and-conquer algorithm is used to calculate the SVD. Another (typically slower but more accurate) option is `alg = QRIteration()`.

::: tip Julia 1.3

The `alg` keyword argument requires Julia 1.3 or later.

:::

**Examples**

```julia
julia> A = rand(4,3);

julia> F = svd(A); # Store the Factorization Object

julia> A ≈ F.U * Diagonal(F.S) * F.Vt
true

julia> U, S, V = F; # destructuring via iteration

julia> A ≈ U * Diagonal(S) * V'
true

julia> Uonly, = svd(A); # Store U only

julia> Uonly == U
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L134-L177)



```julia
svd(A, B) -> GeneralizedSVD
```


Compute the generalized SVD of `A` and `B`, returning a `GeneralizedSVD` factorization object `F` such that `[A;B] = [F.U * F.D1; F.V * F.D2] * F.R0 * F.Q'`
- `U` is a M-by-M orthogonal matrix,
  
- `V` is a P-by-P orthogonal matrix,
  
- `Q` is a N-by-N orthogonal matrix,
  
- `D1` is a M-by-(K+L) diagonal matrix with 1s in the first K entries,
  
- `D2` is a P-by-(K+L) matrix whose top right L-by-L block is diagonal,
  
- `R0` is a (K+L)-by-N matrix whose rightmost (K+L)-by-(K+L) block is          nonsingular upper block triangular,
  

`K+L` is the effective numerical rank of the matrix `[A; B]`.

Iterating the decomposition produces the components `U`, `V`, `Q`, `D1`, `D2`, and `R0`.

The generalized SVD is used in applications such as when one wants to compare how much belongs to `A` vs. how much belongs to `B`, as in human vs yeast genome, or signal vs noise, or between clusters vs within clusters. (See Edelman and Wang for discussion: https://arxiv.org/abs/1901.00485)

It decomposes `[A; B]` into `[UC; VS]H`, where `[UC; VS]` is a natural orthogonal basis for the column space of `[A; B]`, and `H = RQ'` is a natural non-orthogonal basis for the rowspace of `[A;B]`, where the top rows are most closely attributed to the `A` matrix, and the bottom to the `B` matrix. The multi-cosine/sine matrices `C` and `S` provide a multi-measure of how much `A` vs how much `B`, and `U` and `V` provide directions in which these are measured.

**Examples**

```julia
julia> A = randn(3,2); B=randn(4,2);

julia> F = svd(A, B);

julia> U,V,Q,C,S,R = F;

julia> H = R*Q';

julia> [A; B] ≈ [U*C; V*S]*H
true

julia> [A; B] ≈ [F.U*F.D1; F.V*F.D2]*F.R0*F.Q'
true

julia> Uonly, = svd(A,B);

julia> U == Uonly
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L407-L457)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.svd!' href='#LinearAlgebra.svd!'>#</a>&nbsp;<b><u>LinearAlgebra.svd!</u></b> &mdash; <i>Function</i>.




```julia
svd!(A; full::Bool = false, alg::Algorithm = default_svd_alg(A)) -> SVD
```


`svd!` is the same as [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd), but saves space by overwriting the input `A`, instead of creating a copy. See documentation of [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd) for details.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L94-L99)



```julia
svd!(A, B) -> GeneralizedSVD
```


`svd!` is the same as [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd), but modifies the arguments `A` and `B` in-place, instead of making copies. See documentation of [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd) for details.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L389-L394)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.svdvals' href='#LinearAlgebra.svdvals'>#</a>&nbsp;<b><u>LinearAlgebra.svdvals</u></b> &mdash; <i>Function</i>.




```julia
svdvals(A)
```


Return the singular values of `A` in descending order.

**Examples**

```julia
julia> A = [1. 0. 0. 0. 2.; 0. 0. 3. 0. 0.; 0. 0. 0. 0. 0.; 0. 2. 0. 0. 0.]
4×5 Matrix{Float64}:
 1.0  0.0  0.0  0.0  2.0
 0.0  0.0  3.0  0.0  0.0
 0.0  0.0  0.0  0.0  0.0
 0.0  2.0  0.0  0.0  0.0

julia> svdvals(A)
4-element Vector{Float64}:
 3.0
 2.23606797749979
 2.0
 0.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L220-L241)



```julia
svdvals(A, B)
```


Return the generalized singular values from the generalized singular value decomposition of `A` and `B`. See also [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd).

**Examples**

```julia
julia> A = [1. 0.; 0. -1.]
2×2 Matrix{Float64}:
 1.0   0.0
 0.0  -1.0

julia> B = [0. 1.; 1. 0.]
2×2 Matrix{Float64}:
 0.0  1.0
 1.0  0.0

julia> svdvals(A, B)
2-element Vector{Float64}:
 1.0
 1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L543-L566)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.svdvals!' href='#LinearAlgebra.svdvals!'>#</a>&nbsp;<b><u>LinearAlgebra.svdvals!</u></b> &mdash; <i>Function</i>.




```julia
svdvals!(A)
```


Return the singular values of `A`, saving space by overwriting the input. See also [`svdvals`](/stdlib/LinearAlgebra#LinearAlgebra.svdvals) and [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L211-L216)



```julia
svdvals!(A, B)
```


Return the generalized singular values from the generalized singular value decomposition of `A` and `B`, saving space by overwriting `A` and `B`. See also [`svd`](/stdlib/LinearAlgebra#LinearAlgebra.svd) and [`svdvals`](/stdlib/LinearAlgebra#LinearAlgebra.svdvals).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/svd.jl#L526-L532)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Givens' href='#LinearAlgebra.Givens'>#</a>&nbsp;<b><u>LinearAlgebra.Givens</u></b> &mdash; <i>Type</i>.




```julia
LinearAlgebra.Givens(i1,i2,c,s) -> G
```


A Givens rotation linear operator. The fields `c` and `s` represent the cosine and sine of the rotation angle, respectively. The `Givens` type supports left multiplication `G*A` and conjugated transpose right multiplication `A*G'`. The type doesn&#39;t have a `size` and can therefore be multiplied with matrices of arbitrary size as long as `i2<=size(A,2)` for `G*A` or `i2<=size(A,1)` for `A*G'`.

See also [`givens`](/stdlib/LinearAlgebra#LinearAlgebra.givens).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/givens.jl#L26-L36)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.givens' href='#LinearAlgebra.givens'>#</a>&nbsp;<b><u>LinearAlgebra.givens</u></b> &mdash; <i>Function</i>.




```julia
givens(f::T, g::T, i1::Integer, i2::Integer) where {T} -> (G::Givens, r::T)
```


Computes the Givens rotation `G` and scalar `r` such that for any vector `x` where

```
x[i1] = f
x[i2] = g
```


the result of the multiplication

```
y = G*x
```


has the property that

```
y[i1] = r
y[i2] = 0
```


See also [`LinearAlgebra.Givens`](/stdlib/LinearAlgebra#LinearAlgebra.Givens).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/givens.jl#L267-L287)



```julia
givens(A::AbstractArray, i1::Integer, i2::Integer, j::Integer) -> (G::Givens, r)
```


Computes the Givens rotation `G` and scalar `r` such that the result of the multiplication

```
B = G*A
```


has the property that

```
B[i1,j] = r
B[i2,j] = 0
```


See also [`LinearAlgebra.Givens`](/stdlib/LinearAlgebra#LinearAlgebra.Givens).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/givens.jl#L299-L313)



```julia
givens(x::AbstractVector, i1::Integer, i2::Integer) -> (G::Givens, r)
```


Computes the Givens rotation `G` and scalar `r` such that the result of the multiplication

```
B = G*x
```


has the property that

```
B[i1] = r
B[i2] = 0
```


See also [`LinearAlgebra.Givens`](/stdlib/LinearAlgebra#LinearAlgebra.Givens).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/givens.jl#L318-L332)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.triu' href='#LinearAlgebra.triu'>#</a>&nbsp;<b><u>LinearAlgebra.triu</u></b> &mdash; <i>Function</i>.




```julia
triu(M)
```


Upper triangle of a matrix.

**Examples**

```julia
julia> a = fill(1.0, (4,4))
4×4 Matrix{Float64}:
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0

julia> triu(a)
4×4 Matrix{Float64}:
 1.0  1.0  1.0  1.0
 0.0  1.0  1.0  1.0
 0.0  0.0  1.0  1.0
 0.0  0.0  0.0  1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L325-L346)



```julia
triu(M, k::Integer)
```


Return the upper triangle of `M` starting from the `k`th superdiagonal.

**Examples**

```julia
julia> a = fill(1.0, (4,4))
4×4 Matrix{Float64}:
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0

julia> triu(a,3)
4×4 Matrix{Float64}:
 0.0  0.0  0.0  1.0
 0.0  0.0  0.0  0.0
 0.0  0.0  0.0  0.0
 0.0  0.0  0.0  0.0

julia> triu(a,-3)
4×4 Matrix{Float64}:
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L373-L401)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.triu!' href='#LinearAlgebra.triu!'>#</a>&nbsp;<b><u>LinearAlgebra.triu!</u></b> &mdash; <i>Function</i>.




```julia
triu!(M)
```


Upper triangle of a matrix, overwriting `M` in the process. See also [`triu`](/stdlib/LinearAlgebra#LinearAlgebra.triu).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L435-L440)



```julia
triu!(M, k::Integer)
```


Return the upper triangle of `M` starting from the `k`th superdiagonal, overwriting `M` in the process.

**Examples**

```julia
julia> M = [1 2 3 4 5; 1 2 3 4 5; 1 2 3 4 5; 1 2 3 4 5; 1 2 3 4 5]
5×5 Matrix{Int64}:
 1  2  3  4  5
 1  2  3  4  5
 1  2  3  4  5
 1  2  3  4  5
 1  2  3  4  5

julia> triu!(M, 1)
5×5 Matrix{Int64}:
 0  2  3  4  5
 0  0  3  4  5
 0  0  0  4  5
 0  0  0  0  5
 0  0  0  0  0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L114-L138)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.tril' href='#LinearAlgebra.tril'>#</a>&nbsp;<b><u>LinearAlgebra.tril</u></b> &mdash; <i>Function</i>.




```julia
tril(M)
```


Lower triangle of a matrix.

**Examples**

```julia
julia> a = fill(1.0, (4,4))
4×4 Matrix{Float64}:
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0

julia> tril(a)
4×4 Matrix{Float64}:
 1.0  0.0  0.0  0.0
 1.0  1.0  0.0  0.0
 1.0  1.0  1.0  0.0
 1.0  1.0  1.0  1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L349-L370)



```julia
tril(M, k::Integer)
```


Return the lower triangle of `M` starting from the `k`th superdiagonal.

**Examples**

```julia
julia> a = fill(1.0, (4,4))
4×4 Matrix{Float64}:
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0

julia> tril(a,3)
4×4 Matrix{Float64}:
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0
 1.0  1.0  1.0  1.0

julia> tril(a,-3)
4×4 Matrix{Float64}:
 0.0  0.0  0.0  0.0
 0.0  0.0  0.0  0.0
 0.0  0.0  0.0  0.0
 1.0  0.0  0.0  0.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L404-L432)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.tril!' href='#LinearAlgebra.tril!'>#</a>&nbsp;<b><u>LinearAlgebra.tril!</u></b> &mdash; <i>Function</i>.




```julia
tril!(M)
```


Lower triangle of a matrix, overwriting `M` in the process. See also [`tril`](/stdlib/LinearAlgebra#LinearAlgebra.tril).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L443-L448)



```julia
tril!(M, k::Integer)
```


Return the lower triangle of `M` starting from the `k`th superdiagonal, overwriting `M` in the process.

**Examples**

```julia
julia> M = [1 2 3 4 5; 1 2 3 4 5; 1 2 3 4 5; 1 2 3 4 5; 1 2 3 4 5]
5×5 Matrix{Int64}:
 1  2  3  4  5
 1  2  3  4  5
 1  2  3  4  5
 1  2  3  4  5
 1  2  3  4  5

julia> tril!(M, 2)
5×5 Matrix{Int64}:
 1  2  3  0  0
 1  2  3  4  0
 1  2  3  4  5
 1  2  3  4  5
 1  2  3  4  5
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L152-L176)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.diagind' href='#LinearAlgebra.diagind'>#</a>&nbsp;<b><u>LinearAlgebra.diagind</u></b> &mdash; <i>Function</i>.




```julia
diagind(M::AbstractMatrix, k::Integer = 0, indstyle::IndexStyle = IndexLinear())
diagind(M::AbstractMatrix, indstyle::IndexStyle = IndexLinear())
```


An `AbstractRange` giving the indices of the `k`th diagonal of the matrix `M`. Optionally, an index style may be specified which determines the type of the range returned. If `indstyle isa IndexLinear` (default), this returns an `AbstractRange{Integer}`. On the other hand, if `indstyle isa IndexCartesian`, this returns an `AbstractRange{CartesianIndex{2}}`.

If `k` is not provided, it is assumed to be `0` (corresponding to the main diagonal).

See also: [`diag`](/stdlib/LinearAlgebra#LinearAlgebra.diag), [`diagm`](/stdlib/LinearAlgebra#LinearAlgebra.diagm), [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal).

**Examples**

```julia
julia> A = [1 2 3; 4 5 6; 7 8 9]
3×3 Matrix{Int64}:
 1  2  3
 4  5  6
 7  8  9

julia> diagind(A, -1)
2:4:6

julia> diagind(A, IndexCartesian())
StepRangeLen(CartesianIndex(1, 1), CartesianIndex(1, 1), 3)
```


::: tip Julia 1.11

Specifying an `IndexStyle` requires at least Julia 1.11.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L218-L248)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.diag' href='#LinearAlgebra.diag'>#</a>&nbsp;<b><u>LinearAlgebra.diag</u></b> &mdash; <i>Function</i>.




```julia
diag(M, k::Integer=0)
```


The `k`th diagonal of a matrix, as a vector.

See also [`diagm`](/stdlib/LinearAlgebra#LinearAlgebra.diagm), [`diagind`](/stdlib/LinearAlgebra#LinearAlgebra.diagind), [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal), [`isdiag`](/stdlib/LinearAlgebra#LinearAlgebra.isdiag).

**Examples**

```julia
julia> A = [1 2 3; 4 5 6; 7 8 9]
3×3 Matrix{Int64}:
 1  2  3
 4  5  6
 7  8  9

julia> diag(A,1)
2-element Vector{Int64}:
 2
 6
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L256-L276)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.diagm' href='#LinearAlgebra.diagm'>#</a>&nbsp;<b><u>LinearAlgebra.diagm</u></b> &mdash; <i>Function</i>.




```julia
diagm(kv::Pair{<:Integer,<:AbstractVector}...)
diagm(m::Integer, n::Integer, kv::Pair{<:Integer,<:AbstractVector}...)
```


Construct a matrix from `Pair`s of diagonals and vectors. Vector `kv.second` will be placed on the `kv.first` diagonal. By default the matrix is square and its size is inferred from `kv`, but a non-square size `m`×`n` (padded with zeros as needed) can be specified by passing `m,n` as the first arguments. For repeated diagonal indices `kv.first` the values in the corresponding vectors `kv.second` will be added.

`diagm` constructs a full matrix; if you want storage-efficient versions with fast arithmetic, see [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal), [`Bidiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Bidiagonal) [`Tridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Tridiagonal) and [`SymTridiagonal`](/stdlib/LinearAlgebra#LinearAlgebra.SymTridiagonal).

**Examples**

```julia
julia> diagm(1 => [1,2,3])
4×4 Matrix{Int64}:
 0  1  0  0
 0  0  2  0
 0  0  0  3
 0  0  0  0

julia> diagm(1 => [1,2,3], -1 => [4,5])
4×4 Matrix{Int64}:
 0  1  0  0
 4  0  2  0
 0  5  0  3
 0  0  0  0

julia> diagm(1 => [1,2,3], 1 => [1,2,3])
4×4 Matrix{Int64}:
 0  2  0  0
 0  0  4  0
 0  0  0  6
 0  0  0  0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L279-L318)



```julia
diagm(v::AbstractVector)
diagm(m::Integer, n::Integer, v::AbstractVector)
```


Construct a matrix with elements of the vector as diagonal elements. By default, the matrix is square and its size is given by `length(v)`, but a non-square size `m`×`n` can be specified by passing `m,n` as the first arguments.

**Examples**

```julia
julia> diagm([1,2,3])
3×3 Matrix{Int64}:
 1  0  0
 0  2  0
 0  0  3
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L351-L368)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.rank' href='#LinearAlgebra.rank'>#</a>&nbsp;<b><u>LinearAlgebra.rank</u></b> &mdash; <i>Function</i>.




```julia
rank(::QRSparse{Tv,Ti}) -> Ti
```


Return the rank of the QR factorization


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/spqr.jl#L369-L373)



```julia
rank(S::SparseMatrixCSC{Tv,Ti}; [tol::Real]) -> Ti
```


Calculate rank of `S` by calculating its QR factorization. Values smaller than `tol` are considered as zero. See SPQR&#39;s manual.


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/solvers/spqr.jl#L376-L380)



```julia
rank(A::AbstractMatrix; atol::Real=0, rtol::Real=atol>0 ? 0 : n*ϵ)
rank(A::AbstractMatrix, rtol::Real)
```


Compute the numerical rank of a matrix by counting how many outputs of `svdvals(A)` are greater than `max(atol, rtol*σ₁)` where `σ₁` is `A`&#39;s largest calculated singular value. `atol` and `rtol` are the absolute and relative tolerances, respectively. The default relative tolerance is `n*ϵ`, where `n` is the size of the smallest dimension of `A`, and `ϵ` is the [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}) of the element type of `A`.

::: tip Note

Numerical rank can be a sensitive and imprecise characterization of ill-conditioned matrices with singular values that are close to the threshold tolerance `max(atol, rtol*σ₁)`. In such cases, slight perturbations to the singular-value computation or to the matrix can change the result of `rank` by pushing one or more singular values across the threshold. These variations can even occur due to changes in floating-point errors between different Julia versions, architectures, compilers, or operating systems.

:::

::: tip Julia 1.1

The `atol` and `rtol` keyword arguments requires at least Julia 1.1. In Julia 1.0 `rtol` is available as a positional argument, but this will be deprecated in Julia 2.0.

:::

**Examples**

```julia
julia> rank(Matrix(I, 3, 3))
3

julia> rank(diagm(0 => [1, 0, 2]))
2

julia> rank(diagm(0 => [1, 0.001, 2]), rtol=0.1)
2

julia> rank(diagm(0 => [1, 0.001, 2]), rtol=0.00001)
3

julia> rank(diagm(0 => [1, 0.001, 2]), atol=1.5)
1
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L954-L996)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.norm' href='#LinearAlgebra.norm'>#</a>&nbsp;<b><u>LinearAlgebra.norm</u></b> &mdash; <i>Function</i>.




```julia
norm(A, p::Real=2)
```


For any iterable container `A` (including arrays of any dimension) of numbers (or any element type for which `norm` is defined), compute the `p`-norm (defaulting to `p=2`) as if `A` were a vector of the corresponding length.

The `p`-norm is defined as

$$\|A\|_p = \left( \sum_{i=1}^n | a_i | ^p \right)^{1/p}$$

with $a_i$ the entries of $A$, $| a_i |$ the [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm) of $a_i$, and $n$ the length of $A$. Since the `p`-norm is computed using the [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm)s of the entries of `A`, the `p`-norm of a vector of vectors is not compatible with the interpretation of it as a block vector in general if `p != 2`.

`p` can assume any numeric value (even though not all values produce a mathematically valid vector norm). In particular, `norm(A, Inf)` returns the largest value in `abs.(A)`, whereas `norm(A, -Inf)` returns the smallest. If `A` is a matrix and `p=2`, then this is equivalent to the Frobenius norm.

The second argument `p` is not necessarily a part of the interface for `norm`, i.e. a custom type may only implement `norm(A)` without second argument.

Use [`opnorm`](/stdlib/LinearAlgebra#LinearAlgebra.opnorm) to compute the operator norm of a matrix.

**Examples**

```julia
julia> v = [3, -2, 6]
3-element Vector{Int64}:
  3
 -2
  6

julia> norm(v)
7.0

julia> norm(v, 1)
11.0

julia> norm(v, Inf)
6.0

julia> norm([1 2 3; 4 5 6; 7 8 9])
16.881943016134134

julia> norm([1 2 3 4 5 6 7 8 9])
16.881943016134134

julia> norm(1:9)
16.881943016134134

julia> norm(hcat(v,v), 1) == norm(vcat(v,v), 1) != norm([v,v], 1)
true

julia> norm(hcat(v,v), 2) == norm(vcat(v,v), 2) == norm([v,v], 2)
true

julia> norm(hcat(v,v), Inf) == norm(vcat(v,v), Inf) != norm([v,v], Inf)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L539-L600)



```julia
norm(x::Number, p::Real=2)
```


For numbers, return $\left( |x|^p \right)^{1/p}$.

**Examples**

```julia
julia> norm(2, 1)
2.0

julia> norm(-2, 1)
2.0

julia> norm(2, 2)
2.0

julia> norm(-2, 2)
2.0

julia> norm(2, Inf)
2.0

julia> norm(-2, Inf)
2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L618-L643)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.opnorm' href='#LinearAlgebra.opnorm'>#</a>&nbsp;<b><u>LinearAlgebra.opnorm</u></b> &mdash; <i>Function</i>.




```julia
opnorm(A::AbstractMatrix, p::Real=2)
```


Compute the operator norm (or matrix norm) induced by the vector `p`-norm, where valid values of `p` are `1`, `2`, or `Inf`. (Note that for sparse matrices, `p=2` is currently not implemented.) Use [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm) to compute the Frobenius norm.

When `p=1`, the operator norm is the maximum absolute column sum of `A`:

$$\|A\|_1 = \max_{1 ≤ j ≤ n} \sum_{i=1}^m | a_{ij} |$$

with $a_{ij}$ the entries of $A$, and $m$ and $n$ its dimensions.

When `p=2`, the operator norm is the spectral norm, equal to the largest singular value of `A`.

When `p=Inf`, the operator norm is the maximum absolute row sum of `A`:

$$\|A\|_\infty = \max_{1 ≤ i ≤ m} \sum _{j=1}^n | a_{ij} |$$

**Examples**

```julia
julia> A = [1 -2 -3; 2 3 -1]
2×3 Matrix{Int64}:
 1  -2  -3
 2   3  -1

julia> opnorm(A, Inf)
6.0

julia> opnorm(A, 1)
5.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L707-L742)



```julia
opnorm(x::Number, p::Real=2)
```


For numbers, return $\left( |x|^p \right)^{1/p}$. This is equivalent to [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L755-L760)



```julia
opnorm(A::Adjoint{<:Any,<:AbstractVector}, q::Real=2)
opnorm(A::Transpose{<:Any,<:AbstractVector}, q::Real=2)
```


For Adjoint/Transpose-wrapped vectors, return the operator $q$-norm of `A`, which is equivalent to the `p`-norm with value `p = q/(q-1)`. They coincide at `p = q = 2`. Use [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm) to compute the `p` norm of `A` as a vector.

The difference in norm between a vector space and its dual arises to preserve the relationship between duality and the dot product, and the result is consistent with the operator `p`-norm of a `1 × n` matrix.

**Examples**

```julia
julia> v = [1; im];

julia> vc = v';

julia> opnorm(vc, 1)
1.0

julia> norm(vc, 1)
2.0

julia> norm(v, 1)
2.0

julia> opnorm(vc, 2)
1.4142135623730951

julia> norm(vc, 2)
1.4142135623730951

julia> norm(v, 2)
1.4142135623730951

julia> opnorm(vc, Inf)
2.0

julia> norm(vc, Inf)
1.0

julia> norm(v, Inf)
1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L763-L808)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.normalize!' href='#LinearAlgebra.normalize!'>#</a>&nbsp;<b><u>LinearAlgebra.normalize!</u></b> &mdash; <i>Function</i>.




```julia
normalize!(a::AbstractArray, p::Real=2)
```


Normalize the array `a` in-place so that its `p`-norm equals unity, i.e. `norm(a, p) == 1`. See also [`normalize`](/stdlib/LinearAlgebra#LinearAlgebra.normalize) and [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1825-L1831)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.normalize' href='#LinearAlgebra.normalize'>#</a>&nbsp;<b><u>LinearAlgebra.normalize</u></b> &mdash; <i>Function</i>.




```julia
normalize(a, p::Real=2)
```


Normalize `a` so that its `p`-norm equals unity, i.e. `norm(a, p) == 1`. For scalars, this is similar to sign(a), except normalize(0) = NaN. See also [`normalize!`](/stdlib/LinearAlgebra#LinearAlgebra.normalize!), [`norm`](/stdlib/LinearAlgebra#LinearAlgebra.norm), and [`sign`](/base/math#Base.sign).

**Examples**

```julia
julia> a = [1,2,4];

julia> b = normalize(a)
3-element Vector{Float64}:
 0.2182178902359924
 0.4364357804719848
 0.8728715609439696

julia> norm(b)
1.0

julia> c = normalize(a, 1)
3-element Vector{Float64}:
 0.14285714285714285
 0.2857142857142857
 0.5714285714285714

julia> norm(c, 1)
1.0

julia> a = [1 2 4 ; 1 2 4]
2×3 Matrix{Int64}:
 1  2  4
 1  2  4

julia> norm(a)
6.48074069840786

julia> normalize(a)
2×3 Matrix{Float64}:
 0.154303  0.308607  0.617213
 0.154303  0.308607  0.617213

julia> normalize(3, 1)
1.0

julia> normalize(-8, 1)
-1.0

julia> normalize(0, 1)
NaN
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1851-L1903)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.cond' href='#LinearAlgebra.cond'>#</a>&nbsp;<b><u>LinearAlgebra.cond</u></b> &mdash; <i>Function</i>.




```julia
cond(M, p::Real=2)
```


Condition number of the matrix `M`, computed using the operator `p`-norm. Valid values for `p` are `1`, `2` (default), or `Inf`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1624-L1629)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.condskeel' href='#LinearAlgebra.condskeel'>#</a>&nbsp;<b><u>LinearAlgebra.condskeel</u></b> &mdash; <i>Function</i>.




```julia
condskeel(M, [x, p::Real=Inf])
```


$$\kappa_S(M, p) = \left\Vert \left\vert M \right\vert \left\vert M^{-1} \right\vert \right\Vert_p \\
\kappa_S(M, x, p) = \frac{\left\Vert \left\vert M \right\vert \left\vert M^{-1} \right\vert \left\vert x \right\vert \right\Vert_p}{\left \Vert x \right \Vert_p}$$

Skeel condition number $\kappa_S$ of the matrix `M`, optionally with respect to the vector `x`, as computed using the operator `p`-norm. $\left\vert M \right\vert$ denotes the matrix of (entry wise) absolute values of $M$; $\left\vert M \right\vert_{ij} = \left\vert M_{ij} \right\vert$. Valid values for `p` are `1`, `2` and `Inf` (default).

This quantity is also known in the literature as the Bauer condition number, relative condition number, or componentwise relative condition number.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1176-L1192)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.tr' href='#LinearAlgebra.tr'>#</a>&nbsp;<b><u>LinearAlgebra.tr</u></b> &mdash; <i>Function</i>.




```julia
tr(M)
```


Matrix trace. Sums the diagonal elements of `M`.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> tr(A)
5
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1005-L1020)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.det' href='#LinearAlgebra.det'>#</a>&nbsp;<b><u>LinearAlgebra.det</u></b> &mdash; <i>Function</i>.




```julia
det(M)
```


Matrix determinant.

See also: [`logdet`](/stdlib/LinearAlgebra#LinearAlgebra.logdet) and [`logabsdet`](/stdlib/LinearAlgebra#LinearAlgebra.logabsdet).

**Examples**

```julia
julia> M = [1 0; 2 2]
2×2 Matrix{Int64}:
 1  0
 2  2

julia> det(M)
2.0
```


Note that, in general, `det` computes a floating-point approximation of the determinant, even for integer matrices, typically via Gaussian elimination. Julia includes an exact algorithm for integer determinants (the Bareiss algorithm), but only uses it by default for `BigInt` matrices (since determinants quickly overflow any fixed integer precision):

```julia
julia> det(BigInt[1 0; 2 2]) # exact integer determinant
2
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1628-L1654)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.logdet' href='#LinearAlgebra.logdet'>#</a>&nbsp;<b><u>LinearAlgebra.logdet</u></b> &mdash; <i>Function</i>.




```julia
logdet(M)
```


Logarithm of matrix determinant. Equivalent to `log(det(M))`, but may provide increased accuracy and avoids overflow/underflow.

**Examples**

```julia
julia> M = [1 0; 2 2]
2×2 Matrix{Int64}:
 1  0
 2  2

julia> logdet(M)
0.6931471805599453

julia> logdet(Matrix(I, 3, 3))
0.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1706-L1725)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.logabsdet' href='#LinearAlgebra.logabsdet'>#</a>&nbsp;<b><u>LinearAlgebra.logabsdet</u></b> &mdash; <i>Function</i>.




```julia
logabsdet(M)
```


Log of absolute value of matrix determinant. Equivalent to `(log(abs(det(M))), sign(det(M)))`, but may provide increased accuracy and/or speed.

**Examples**

```julia
julia> A = [-1. 0.; 0. 1.]
2×2 Matrix{Float64}:
 -1.0  0.0
  0.0  1.0

julia> det(A)
-1.0

julia> logabsdet(A)
(0.0, -1.0)

julia> B = [2. 0.; 0. 1.]
2×2 Matrix{Float64}:
 2.0  0.0
 0.0  1.0

julia> det(B)
2.0

julia> logabsdet(B)
(0.6931471805599453, 1.0)
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1667-L1697)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.inv-Tuple{AbstractMatrix}' href='#Base.inv-Tuple{AbstractMatrix}'>#</a>&nbsp;<b><u>Base.inv</u></b> &mdash; <i>Method</i>.




```julia
inv(M)
```


Matrix inverse. Computes matrix `N` such that `M * N = I`, where `I` is the identity matrix. Computed by solving the left-division `N = M \ I`.

**Examples**

```julia
julia> M = [2 5; 1 3]
2×2 Matrix{Int64}:
 2  5
 1  3

julia> N = inv(M)
2×2 Matrix{Float64}:
  3.0  -5.0
 -1.0   2.0

julia> M*N == N*M == Matrix(I, 2, 2)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1032-L1055)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.pinv' href='#LinearAlgebra.pinv'>#</a>&nbsp;<b><u>LinearAlgebra.pinv</u></b> &mdash; <i>Function</i>.




```julia
pinv(M; atol::Real=0, rtol::Real=atol>0 ? 0 : n*ϵ)
pinv(M, rtol::Real) = pinv(M; rtol=rtol) # to be deprecated in Julia 2.0
```


Computes the Moore-Penrose pseudoinverse.

For matrices `M` with floating point elements, it is convenient to compute the pseudoinverse by inverting only singular values greater than `max(atol, rtol*σ₁)` where `σ₁` is the largest singular value of `M`.

The optimal choice of absolute (`atol`) and relative tolerance (`rtol`) varies both with the value of `M` and the intended application of the pseudoinverse. The default relative tolerance is `n*ϵ`, where `n` is the size of the smallest dimension of `M`, and `ϵ` is the [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}) of the element type of `M`.

For inverting dense ill-conditioned matrices in a least-squares sense, `rtol = sqrt(eps(real(float(oneunit(eltype(M))))))` is recommended.

For more information, see [^issue8859], [^B96], [^S84], [^KY88].

**Examples**

```julia
julia> M = [1.5 1.3; 1.2 1.9]
2×2 Matrix{Float64}:
 1.5  1.3
 1.2  1.9

julia> N = pinv(M)
2×2 Matrix{Float64}:
  1.47287   -1.00775
 -0.930233   1.16279

julia> M * N
2×2 Matrix{Float64}:
 1.0          -2.22045e-16
 4.44089e-16   1.0
```


[^issue8859]: Issue 8859, &quot;Fix least squares&quot;, [https://github.com/JuliaLang/julia/pull/8859](https://github.com/JuliaLang/julia/pull/8859)


[^B96]: Åke Björck, &quot;Numerical Methods for Least Squares Problems&quot;,  SIAM Press, Philadelphia, 1996, &quot;Other Titles in Applied Mathematics&quot;, Vol. 51. [doi:10.1137/1.9781611971484](http://epubs.siam.org/doi/book/10.1137/1.9781611971484)


[^S84]: G. W. Stewart, &quot;Rank Degeneracy&quot;, SIAM Journal on Scientific and Statistical Computing, 5(2), 1984, 403-413. [doi:10.1137/0905030](http://epubs.siam.org/doi/abs/10.1137/0905030)


[^KY88]: Konstantinos Konstantinides and Kung Yao, &quot;Statistical analysis of effective singular values in matrix rank determination&quot;, IEEE Transactions on Acoustics, Speech and Signal Processing, 36(5), 1988, 757-763. [doi:10.1109/29.1585](https://doi.org/10.1109/29.1585)



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1499-L1544)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.nullspace' href='#LinearAlgebra.nullspace'>#</a>&nbsp;<b><u>LinearAlgebra.nullspace</u></b> &mdash; <i>Function</i>.




```julia
nullspace(M; atol::Real=0, rtol::Real=atol>0 ? 0 : n*ϵ)
nullspace(M, rtol::Real) = nullspace(M; rtol=rtol) # to be deprecated in Julia 2.0
```


Computes a basis for the nullspace of `M` by including the singular vectors of `M` whose singular values have magnitudes smaller than `max(atol, rtol*σ₁)`, where `σ₁` is `M`&#39;s largest singular value.

By default, the relative tolerance `rtol` is `n*ϵ`, where `n` is the size of the smallest dimension of `M`, and `ϵ` is the [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}) of the element type of `M`.

**Examples**

```julia
julia> M = [1 0 0; 0 1 0; 0 0 0]
3×3 Matrix{Int64}:
 1  0  0
 0  1  0
 0  0  0

julia> nullspace(M)
3×1 Matrix{Float64}:
 0.0
 0.0
 1.0

julia> nullspace(M, rtol=3)
3×3 Matrix{Float64}:
 0.0  1.0  0.0
 1.0  0.0  0.0
 0.0  0.0  1.0

julia> nullspace(M, atol=0.95)
3×1 Matrix{Float64}:
 0.0
 0.0
 1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1576-L1614)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.kron' href='#Base.kron'>#</a>&nbsp;<b><u>Base.kron</u></b> &mdash; <i>Function</i>.




```julia
kron(A, B)
```


Computes the Kronecker product of two vectors, matrices or numbers.

For real vectors `v` and `w`, the Kronecker product is related to the outer product by `kron(v,w) == vec(w * transpose(v))` or `w * transpose(v) == reshape(kron(v,w), (length(w), length(v)))`. Note how the ordering of `v` and `w` differs on the left and right of these expressions (due to column-major storage). For complex vectors, the outer product `w * v'` also differs by conjugation of `v`.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> B = [im 1; 1 -im]
2×2 Matrix{Complex{Int64}}:
 0+1im  1+0im
 1+0im  0-1im

julia> kron(A, B)
4×4 Matrix{Complex{Int64}}:
 0+1im  1+0im  0+2im  2+0im
 1+0im  0-1im  2+0im  0-2im
 0+3im  3+0im  0+4im  4+0im
 3+0im  0-3im  4+0im  0-4im

julia> v = [1, 2]; w = [3, 4, 5];

julia> w*transpose(v)
3×2 Matrix{Int64}:
 3   6
 4   8
 5  10

julia> reshape(kron(v,w), (length(w), length(v)))
3×2 Matrix{Int64}:
 3   6
 4   8
 5  10
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L447-L492)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.kron!' href='#Base.kron!'>#</a>&nbsp;<b><u>Base.kron!</u></b> &mdash; <i>Function</i>.




```julia
kron!(C, A, B)
```


Computes the Kronecker product of `A` and `B` and stores the result in `C`, overwriting the existing content of `C`. This is the in-place version of [`kron`](/stdlib/LinearAlgebra#Base.kron).

::: tip Julia 1.6

This function requires Julia 1.6 or later.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L385-L393)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.exp-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Union{Float32, Float64, ComplexF64, ComplexF32}}' href='#Base.exp-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Union{Float32, Float64, ComplexF64, ComplexF32}}'>#</a>&nbsp;<b><u>Base.exp</u></b> &mdash; <i>Method</i>.




```julia
exp(A::AbstractMatrix)
```


Compute the matrix exponential of `A`, defined by

$$e^A = \sum_{n=0}^{\infty} \frac{A^n}{n!}.$$

For symmetric or Hermitian `A`, an eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used, otherwise the scaling and squaring algorithm (see [^H05]) is chosen.

[^H05]: Nicholas J. Higham, &quot;The squaring and scaling method for the matrix exponential revisited&quot;, SIAM Journal on Matrix Analysis and Applications, 26(4), 2005, 1179-1193. [doi:10.1137/090768539](https://doi.org/10.1137/090768539)


**Examples**

```julia
julia> A = Matrix(1.0I, 2, 2)
2×2 Matrix{Float64}:
 1.0  0.0
 0.0  1.0

julia> exp(A)
2×2 Matrix{Float64}:
 2.71828  0.0
 0.0      2.71828
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L595-L621)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cis-Tuple{AbstractMatrix}' href='#Base.cis-Tuple{AbstractMatrix}'>#</a>&nbsp;<b><u>Base.cis</u></b> &mdash; <i>Method</i>.




```julia
cis(A::AbstractMatrix)
```


More efficient method for `exp(im*A)` of square matrix `A` (especially if `A` is `Hermitian` or real-`Symmetric`).

See also [`cispi`](/base/math#Base.cispi), [`sincos`](/base/math#Base.Math.sincos-Tuple{Float64}), [`exp`](/base/math#Base.exp-Tuple{Float64}).

::: tip Julia 1.7

Support for using `cis` with matrices was added in Julia 1.7.

:::

**Examples**

```julia
julia> cis([π 0; 0 π]) ≈ -I
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L626-L642)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:^-Tuple{AbstractMatrix, Number}' href='#Base.:^-Tuple{AbstractMatrix, Number}'>#</a>&nbsp;<b><u>Base.:^</u></b> &mdash; <i>Method</i>.




```julia
^(A::AbstractMatrix, p::Number)
```


Matrix power, equivalent to $\exp(p\log(A))$

**Examples**

```julia
julia> [1 2; 0 3]^3
2×2 Matrix{Int64}:
 1  26
 0  27
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L578-L590)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:^-Tuple{Number, AbstractMatrix}' href='#Base.:^-Tuple{Number, AbstractMatrix}'>#</a>&nbsp;<b><u>Base.:^</u></b> &mdash; <i>Method</i>.




```julia
^(b::Number, A::AbstractMatrix)
```


Matrix exponential, equivalent to $\exp(\log(b)A)$.

::: tip Julia 1.1

Support for raising `Irrational` numbers (like `ℯ`) to a matrix was added in Julia 1.1.

:::

**Examples**

```julia
julia> 2^[1 2; 0 3]
2×2 Matrix{Float64}:
 2.0  6.0
 0.0  8.0

julia> ℯ^[1 2; 0 3]
2×2 Matrix{Float64}:
 2.71828  17.3673
 0.0      20.0855
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L649-L670)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.log-Tuple{StridedMatrix{T} where T}' href='#Base.log-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.log</u></b> &mdash; <i>Method</i>.




```julia
log(A::AbstractMatrix)
```


If `A` has no negative real eigenvalue, compute the principal matrix logarithm of `A`, i.e. the unique matrix $X$ such that $e^X = A$ and $-\pi < Im(\lambda) < \pi$ for all the eigenvalues $\lambda$ of $X$. If `A` has nonpositive eigenvalues, a nonprincipal matrix function is returned whenever possible.

If `A` is symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used, if `A` is triangular an improved version of the inverse scaling and squaring method is employed (see [^AH12] and [^AHR13]). If `A` is real with no negative eigenvalues, then the real Schur form is computed. Otherwise, the complex Schur form is computed. Then the upper (quasi-)triangular algorithm in [^AHR13] is used on the upper (quasi-)triangular factor.

[^AH12]: Awad H. Al-Mohy and Nicholas J. Higham, &quot;Improved inverse  scaling and squaring algorithms for the matrix logarithm&quot;, SIAM Journal on Scientific Computing, 34(4), 2012, C153-C169. [doi:10.1137/110852553](https://doi.org/10.1137/110852553)


[^AHR13]: Awad H. Al-Mohy, Nicholas J. Higham and Samuel D. Relton, &quot;Computing the Fréchet derivative of the matrix logarithm and estimating the condition number&quot;, SIAM Journal on Scientific Computing, 35(4), 2013, C394-C410. [doi:10.1137/120885991](https://doi.org/10.1137/120885991)


**Examples**

```julia
julia> A = Matrix(2.7182818*I, 2, 2)
2×2 Matrix{Float64}:
 2.71828  0.0
 0.0      2.71828

julia> log(A)
2×2 Matrix{Float64}:
 1.0  0.0
 0.0  1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L794-L825)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sqrt-Tuple{StridedMatrix{T} where T}' href='#Base.sqrt-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.sqrt</u></b> &mdash; <i>Method</i>.




```julia
sqrt(x)
```


Return $\sqrt{x}$.

Throw a [`DomainError`](/base/base#Core.DomainError) for negative [`Real`](/base/numbers#Core.Real) arguments. Use [`Complex`](/base/numbers#Base.Complex) negative arguments instead to obtain a [`Complex`](/base/numbers#Base.Complex) result.

The prefix operator `√` is equivalent to `sqrt`.

::: tip Branch cut

`sqrt` has a branch cut along the negative real axis; `-0.0im` is taken to be below the axis.

:::

See also: [`hypot`](/base/math#Base.Math.hypot).

**Examples**

```julia
julia> sqrt(big(81))
9.0

julia> sqrt(big(-81))
ERROR: DomainError with -81.0:
NaN result for non-NaN input.
Stacktrace:
 [1] sqrt(::BigFloat) at ./mpfr.jl:501
[...]

julia> sqrt(big(complex(-81)))
0.0 + 9.0im

julia> sqrt(-81 - 0.0im)  # -0.0im is below the branch cut
0.0 - 9.0im

julia> .√(1:4)
4-element Vector{Float64}:
 1.0
 1.4142135623730951
 1.7320508075688772
 2.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L723-L764)



```julia
sqrt(A::AbstractMatrix)
```


If `A` has no negative real eigenvalues, compute the principal matrix square root of `A`, that is the unique matrix $X$ with eigenvalues having positive real part such that $X^2 = A$. Otherwise, a nonprincipal square root is returned.

If `A` is real-symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to compute the square root.   For such matrices, eigenvalues λ that appear to be slightly negative due to roundoff errors are treated as if they were zero. More precisely, matrices with all eigenvalues `≥ -rtol*(max |λ|)` are treated as semidefinite (yielding a Hermitian square root), with negative eigenvalues taken to be zero. `rtol` is a keyword argument to `sqrt` (in the Hermitian/real-symmetric case only) that defaults to machine precision scaled by `size(A,1)`.

Otherwise, the square root is determined by means of the Björck-Hammarling method [^BH83], which computes the complex Schur form ([`schur`](/stdlib/LinearAlgebra#LinearAlgebra.schur)) and then the complex square root of the triangular factor. If a real square root exists, then an extension of this method [^H87] that computes the real Schur form and then the real square root of the quasi-triangular factor is instead used.

[^BH83]: Åke Björck and Sven Hammarling, &quot;A Schur method for the square root of a matrix&quot;, Linear Algebra and its Applications, 52-53, 1983, 127-140. [doi:10.1016/0024-3795(83)80010-X](https://doi.org/10.1016/0024-3795(83)80010-X)


[^H87]: Nicholas J. Higham, &quot;Computing real square roots of a real matrix&quot;, Linear Algebra and its Applications, 88-89, 1987, 405-430. [doi:10.1016/0024-3795(87)90118-2](https://doi.org/10.1016/0024-3795(87)90118-2)


**Examples**

```julia
julia> A = [4 0; 0 4]
2×2 Matrix{Int64}:
 4  0
 0  4

julia> sqrt(A)
2×2 Matrix{Float64}:
 2.0  0.0
 0.0  2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L857-L902)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cbrt-Tuple{AbstractMatrix{<:Real}}' href='#Base.Math.cbrt-Tuple{AbstractMatrix{<:Real}}'>#</a>&nbsp;<b><u>Base.Math.cbrt</u></b> &mdash; <i>Method</i>.




```julia
cbrt(A::AbstractMatrix{<:Real})
```


Computes the real-valued cube root of a real-valued matrix `A`. If `T = cbrt(A)`, then we have `T*T*T ≈ A`, see example given below.

If `A` is symmetric, i.e., of type `HermOrSym{<:Real}`, then ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to find the cube root. Otherwise, a specialized version of the p-th root algorithm [^S03] is utilized, which exploits the real-valued Schur decomposition ([`schur`](/stdlib/LinearAlgebra#LinearAlgebra.schur)) to compute the cube root.

[^S03]: Matthew I. Smith, &quot;A Schur Algorithm for Computing Matrix pth Roots&quot;, SIAM Journal on Matrix Analysis and Applications, vol. 24, 2003, pp. 971–989. [doi:10.1137/S0895479801392697](https://doi.org/10.1137/s0895479801392697)


**Examples**

```julia
julia> A = [0.927524 -0.15857; -1.3677 -1.01172]
2×2 Matrix{Float64}:
  0.927524  -0.15857
 -1.3677    -1.01172

julia> T = cbrt(A)
2×2 Matrix{Float64}:
  0.910077  -0.151019
 -1.30257   -0.936818

julia> T*T*T ≈ A
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L938-L970)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cos-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}' href='#Base.cos-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}'>#</a>&nbsp;<b><u>Base.cos</u></b> &mdash; <i>Method</i>.




```julia
cos(A::AbstractMatrix)
```


Compute the matrix cosine of a square matrix `A`.

If `A` is symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to compute the cosine. Otherwise, the cosine is determined by calling [`exp`](/base/math#Base.exp-Tuple{Float64}).

**Examples**

```julia
julia> cos(fill(1.0, (2,2)))
2×2 Matrix{Float64}:
  0.291927  -0.708073
 -0.708073   0.291927
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L999-L1014)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sin-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}' href='#Base.sin-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}'>#</a>&nbsp;<b><u>Base.sin</u></b> &mdash; <i>Method</i>.




```julia
sin(A::AbstractMatrix)
```


Compute the matrix sine of a square matrix `A`.

If `A` is symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to compute the sine. Otherwise, the sine is determined by calling [`exp`](/base/math#Base.exp-Tuple{Float64}).

**Examples**

```julia
julia> sin(fill(1.0, (2,2)))
2×2 Matrix{Float64}:
 0.454649  0.454649
 0.454649  0.454649
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1032-L1047)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sincos-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}' href='#Base.Math.sincos-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}'>#</a>&nbsp;<b><u>Base.Math.sincos</u></b> &mdash; <i>Method</i>.




```julia
sincos(A::AbstractMatrix)
```


Compute the matrix sine and cosine of a square matrix `A`.

**Examples**

```julia
julia> S, C = sincos(fill(1.0, (2,2)));

julia> S
2×2 Matrix{Float64}:
 0.454649  0.454649
 0.454649  0.454649

julia> C
2×2 Matrix{Float64}:
  0.291927  -0.708073
 -0.708073   0.291927
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1069-L1088)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.tan-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}' href='#Base.tan-Tuple{StridedMatrix{var"#s44"} where var"#s44"<:Real}'>#</a>&nbsp;<b><u>Base.tan</u></b> &mdash; <i>Method</i>.




```julia
tan(A::AbstractMatrix)
```


Compute the matrix tangent of a square matrix `A`.

If `A` is symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to compute the tangent. Otherwise, the tangent is determined by calling [`exp`](/base/math#Base.exp-Tuple{Float64}).

**Examples**

```julia
julia> tan(fill(1.0, (2,2)))
2×2 Matrix{Float64}:
 -1.09252  -1.09252
 -1.09252  -1.09252
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1118-L1133)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sec-Tuple{StridedMatrix{T} where T}' href='#Base.Math.sec-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.sec</u></b> &mdash; <i>Method</i>.




```julia
sec(A::AbstractMatrix)
```


Compute the matrix secant of a square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1344-L1348)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.csc-Tuple{StridedMatrix{T} where T}' href='#Base.Math.csc-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.csc</u></b> &mdash; <i>Method</i>.




```julia
csc(A::AbstractMatrix)
```


Compute the matrix cosecant of a square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1344-L1348)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cot-Tuple{StridedMatrix{T} where T}' href='#Base.Math.cot-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.cot</u></b> &mdash; <i>Method</i>.




```julia
cot(A::AbstractMatrix)
```


Compute the matrix cotangent of a square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1344-L1348)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cosh-Tuple{StridedMatrix{T} where T}' href='#Base.cosh-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.cosh</u></b> &mdash; <i>Method</i>.




```julia
cosh(A::AbstractMatrix)
```


Compute the matrix hyperbolic cosine of a square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1143-L1147)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sinh-Tuple{StridedMatrix{T} where T}' href='#Base.sinh-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.sinh</u></b> &mdash; <i>Method</i>.




```julia
sinh(A::AbstractMatrix)
```


Compute the matrix hyperbolic sine of a square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1157-L1161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.tanh-Tuple{StridedMatrix{T} where T}' href='#Base.tanh-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.tanh</u></b> &mdash; <i>Method</i>.




```julia
tanh(A::AbstractMatrix)
```


Compute the matrix hyperbolic tangent of a square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1171-L1175)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sech-Tuple{StridedMatrix{T} where T}' href='#Base.Math.sech-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.sech</u></b> &mdash; <i>Method</i>.




```julia
sech(A::AbstractMatrix)
```


Compute the matrix hyperbolic secant of square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1349-L1353)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.csch-Tuple{StridedMatrix{T} where T}' href='#Base.Math.csch-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.csch</u></b> &mdash; <i>Method</i>.




```julia
csch(A::AbstractMatrix)
```


Compute the matrix hyperbolic cosecant of square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1349-L1353)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.coth-Tuple{StridedMatrix{T} where T}' href='#Base.Math.coth-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.coth</u></b> &mdash; <i>Method</i>.




```julia
coth(A::AbstractMatrix)
```


Compute the matrix hyperbolic cotangent of square matrix `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1349-L1353)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.acos-Tuple{StridedMatrix{T} where T}' href='#Base.acos-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.acos</u></b> &mdash; <i>Method</i>.




```julia
acos(A::AbstractMatrix)
```


Compute the inverse matrix cosine of a square matrix `A`.

If `A` is symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to compute the inverse cosine. Otherwise, the inverse cosine is determined by using [`log`](/base/math#Base.log-Tuple{Number}) and [`sqrt`](/base/math#Base.sqrt-Tuple{Number}).  For the theory and logarithmic formulas used to compute this function, see [^AH16_1].

[^AH16_1]: Mary Aprahamian and Nicholas J. Higham, &quot;Matrix Inverse Trigonometric and Inverse Hyperbolic Functions: Theory and Algorithms&quot;, MIMS EPrint: 2016.4. [https://doi.org/10.1137/16M1057577](https://doi.org/10.1137/16M1057577)


**Examples**

```julia
julia> acos(cos([0.5 0.1; -0.2 0.3]))
2×2 Matrix{ComplexF64}:
  0.5-8.32667e-17im  0.1+0.0im
 -0.2+2.63678e-16im  0.3-3.46945e-16im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1191-L1210)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.asin-Tuple{StridedMatrix{T} where T}' href='#Base.asin-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.asin</u></b> &mdash; <i>Method</i>.




```julia
asin(A::AbstractMatrix)
```


Compute the inverse matrix sine of a square matrix `A`.

If `A` is symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to compute the inverse sine. Otherwise, the inverse sine is determined by using [`log`](/base/math#Base.log-Tuple{Number}) and [`sqrt`](/base/math#Base.sqrt-Tuple{Number}).  For the theory and logarithmic formulas used to compute this function, see [^AH16_2].

[^AH16_2]: Mary Aprahamian and Nicholas J. Higham, &quot;Matrix Inverse Trigonometric and Inverse Hyperbolic Functions: Theory and Algorithms&quot;, MIMS EPrint: 2016.4. [https://doi.org/10.1137/16M1057577](https://doi.org/10.1137/16M1057577)


**Examples**

```julia
julia> asin(sin([0.5 0.1; -0.2 0.3]))
2×2 Matrix{ComplexF64}:
  0.5-4.16334e-17im  0.1-5.55112e-17im
 -0.2+9.71445e-17im  0.3-1.249e-16im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1222-L1241)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.atan-Tuple{StridedMatrix{T} where T}' href='#Base.atan-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.atan</u></b> &mdash; <i>Method</i>.




```julia
atan(A::AbstractMatrix)
```


Compute the inverse matrix tangent of a square matrix `A`.

If `A` is symmetric or Hermitian, its eigendecomposition ([`eigen`](/stdlib/LinearAlgebra#LinearAlgebra.eigen)) is used to compute the inverse tangent. Otherwise, the inverse tangent is determined by using [`log`](/base/math#Base.log-Tuple{Number}).  For the theory and logarithmic formulas used to compute this function, see [^AH16_3].

[^AH16_3]: Mary Aprahamian and Nicholas J. Higham, &quot;Matrix Inverse Trigonometric and Inverse Hyperbolic Functions: Theory and Algorithms&quot;, MIMS EPrint: 2016.4. [https://doi.org/10.1137/16M1057577](https://doi.org/10.1137/16M1057577)


**Examples**

```julia
julia> atan(tan([0.5 0.1; -0.2 0.3]))
2×2 Matrix{ComplexF64}:
  0.5+1.38778e-17im  0.1-2.77556e-17im
 -0.2+6.93889e-17im  0.3-4.16334e-17im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1253-L1272)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.asec-Tuple{StridedMatrix{T} where T}' href='#Base.Math.asec-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.asec</u></b> &mdash; <i>Method</i>.




```julia
asec(A::AbstractMatrix)
```


Compute the inverse matrix secant of `A`. 


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1363-L1365)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acsc-Tuple{StridedMatrix{T} where T}' href='#Base.Math.acsc-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.acsc</u></b> &mdash; <i>Method</i>.




```julia
acsc(A::AbstractMatrix)
```


Compute the inverse matrix cosecant of `A`. 


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1363-L1365)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acot-Tuple{StridedMatrix{T} where T}' href='#Base.Math.acot-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.acot</u></b> &mdash; <i>Method</i>.




```julia
acot(A::AbstractMatrix)
```


Compute the inverse matrix cotangent of `A`. 


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1363-L1365)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.acosh-Tuple{StridedMatrix{T} where T}' href='#Base.acosh-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.acosh</u></b> &mdash; <i>Method</i>.




```julia
acosh(A::AbstractMatrix)
```


Compute the inverse hyperbolic matrix cosine of a square matrix `A`.  For the theory and logarithmic formulas used to compute this function, see [^AH16_4].

[^AH16_4]: Mary Aprahamian and Nicholas J. Higham, &quot;Matrix Inverse Trigonometric and Inverse Hyperbolic Functions: Theory and Algorithms&quot;, MIMS EPrint: 2016.4. [https://doi.org/10.1137/16M1057577](https://doi.org/10.1137/16M1057577)



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1283-L1290)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.asinh-Tuple{StridedMatrix{T} where T}' href='#Base.asinh-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.asinh</u></b> &mdash; <i>Method</i>.




```julia
asinh(A::AbstractMatrix)
```


Compute the inverse hyperbolic matrix sine of a square matrix `A`.  For the theory and logarithmic formulas used to compute this function, see [^AH16_5].

[^AH16_5]: Mary Aprahamian and Nicholas J. Higham, &quot;Matrix Inverse Trigonometric and Inverse Hyperbolic Functions: Theory and Algorithms&quot;, MIMS EPrint: 2016.4. [https://doi.org/10.1137/16M1057577](https://doi.org/10.1137/16M1057577)



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1302-L1309)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.atanh-Tuple{StridedMatrix{T} where T}' href='#Base.atanh-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.atanh</u></b> &mdash; <i>Method</i>.




```julia
atanh(A::AbstractMatrix)
```


Compute the inverse hyperbolic matrix tangent of a square matrix `A`.  For the theory and logarithmic formulas used to compute this function, see [^AH16_6].

[^AH16_6]: Mary Aprahamian and Nicholas J. Higham, &quot;Matrix Inverse Trigonometric and Inverse Hyperbolic Functions: Theory and Algorithms&quot;, MIMS EPrint: 2016.4. [https://doi.org/10.1137/16M1057577](https://doi.org/10.1137/16M1057577)



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1320-L1327)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.asech-Tuple{StridedMatrix{T} where T}' href='#Base.Math.asech-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.asech</u></b> &mdash; <i>Method</i>.




```julia
asech(A::AbstractMatrix)
```


Compute the inverse matrix hyperbolic secant of `A`. 


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1366-L1368)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acsch-Tuple{StridedMatrix{T} where T}' href='#Base.Math.acsch-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.acsch</u></b> &mdash; <i>Method</i>.




```julia
acsch(A::AbstractMatrix)
```


Compute the inverse matrix hyperbolic cosecant of `A`. 


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1366-L1368)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acoth-Tuple{StridedMatrix{T} where T}' href='#Base.Math.acoth-Tuple{StridedMatrix{T} where T}'>#</a>&nbsp;<b><u>Base.Math.acoth</u></b> &mdash; <i>Method</i>.




```julia
acoth(A::AbstractMatrix)
```


Compute the inverse matrix hyperbolic cotangent of `A`. 


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1366-L1368)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lyap' href='#LinearAlgebra.lyap'>#</a>&nbsp;<b><u>LinearAlgebra.lyap</u></b> &mdash; <i>Function</i>.




```julia
lyap(A, C)
```


Computes the solution `X` to the continuous Lyapunov equation `AX + XA' + C = 0`, where no eigenvalue of `A` has a zero real part and no two eigenvalues are negative complex conjugates of each other.

**Examples**

```julia
julia> A = [3. 4.; 5. 6]
2×2 Matrix{Float64}:
 3.0  4.0
 5.0  6.0

julia> B = [1. 1.; 1. 2.]
2×2 Matrix{Float64}:
 1.0  1.0
 1.0  2.0

julia> X = lyap(A, B)
2×2 Matrix{Float64}:
  0.5  -0.5
 -0.5   0.25

julia> A*X + X*A' ≈ -B
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1732-L1759)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.sylvester' href='#LinearAlgebra.sylvester'>#</a>&nbsp;<b><u>LinearAlgebra.sylvester</u></b> &mdash; <i>Function</i>.




```julia
sylvester(A, B, C)
```


Computes the solution `X` to the Sylvester equation `AX + XB + C = 0`, where `A`, `B` and `C` have compatible dimensions and `A` and `-B` have no eigenvalues with equal real part.

**Examples**

```julia
julia> A = [3. 4.; 5. 6]
2×2 Matrix{Float64}:
 3.0  4.0
 5.0  6.0

julia> B = [1. 1.; 1. 2.]
2×2 Matrix{Float64}:
 1.0  1.0
 1.0  2.0

julia> C = [1. 2.; -2. 1]
2×2 Matrix{Float64}:
  1.0  2.0
 -2.0  1.0

julia> X = sylvester(A, B, C)
2×2 Matrix{Float64}:
 -4.46667   1.93333
  3.73333  -1.8

julia> A*X + X*B ≈ -C
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L1655-L1686)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.issuccess' href='#LinearAlgebra.issuccess'>#</a>&nbsp;<b><u>LinearAlgebra.issuccess</u></b> &mdash; <i>Function</i>.




```julia
issuccess(F::Factorization)
```


Test that a factorization of a matrix succeeded.

::: tip Julia 1.6

`issuccess(::CholeskyPivoted)` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> F = cholesky([1 0; 0 1]);

julia> issuccess(F)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/factorization.jl#L72-L88)



```julia
issuccess(F::LU; allowsingular = false)
```


Test that the LU factorization of a matrix succeeded. By default a factorization that produces a valid but rank-deficient U factor is considered a failure. This can be changed by passing `allowsingular = true`.

::: tip Julia 1.11

The `allowsingular` keyword argument was added in Julia 1.11.

:::

**Examples**

```julia
julia> F = lu([1 2; 1 2], check = false);

julia> issuccess(F)
false

julia> issuccess(F, allowsingular = true)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lu.jl#L398-L419)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.issymmetric' href='#LinearAlgebra.issymmetric'>#</a>&nbsp;<b><u>LinearAlgebra.issymmetric</u></b> &mdash; <i>Function</i>.




```julia
issymmetric(A) -> Bool
```


Test whether a matrix is symmetric.

**Examples**

```julia
julia> a = [1 2; 2 -1]
2×2 Matrix{Int64}:
 1   2
 2  -1

julia> issymmetric(a)
true

julia> b = [1 im; -im 1]
2×2 Matrix{Complex{Int64}}:
 1+0im  0+1im
 0-1im  1+0im

julia> issymmetric(b)
false
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1199-L1222)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.isposdef' href='#LinearAlgebra.isposdef'>#</a>&nbsp;<b><u>LinearAlgebra.isposdef</u></b> &mdash; <i>Function</i>.




```julia
isposdef(A) -> Bool
```


Test whether a matrix is positive definite (and Hermitian) by trying to perform a Cholesky factorization of `A`.

See also [`isposdef!`](/stdlib/LinearAlgebra#LinearAlgebra.isposdef!), [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky).

**Examples**

```julia
julia> A = [1 2; 2 50]
2×2 Matrix{Int64}:
 1   2
 2  50

julia> isposdef(A)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L73-L91)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.isposdef!' href='#LinearAlgebra.isposdef!'>#</a>&nbsp;<b><u>LinearAlgebra.isposdef!</u></b> &mdash; <i>Function</i>.




```julia
isposdef!(A) -> Bool
```


Test whether a matrix is positive definite (and Hermitian) by trying to perform a Cholesky factorization of `A`, overwriting `A` in the process. See also [`isposdef`](/stdlib/LinearAlgebra#LinearAlgebra.isposdef).

**Examples**

```julia
julia> A = [1. 2.; 2. 50.];

julia> isposdef!(A)
true

julia> A
2×2 Matrix{Float64}:
 1.0  2.0
 2.0  6.78233
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/dense.jl#L50-L69)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.istril' href='#LinearAlgebra.istril'>#</a>&nbsp;<b><u>LinearAlgebra.istril</u></b> &mdash; <i>Function</i>.




```julia
istril(A::AbstractMatrix, k::Integer = 0) -> Bool
```


Test whether `A` is lower triangular starting from the `k`th superdiagonal.

**Examples**

```julia
julia> a = [1 2; 2 -1]
2×2 Matrix{Int64}:
 1   2
 2  -1

julia> istril(a)
false

julia> istril(a, 1)
true

julia> c = [1 1 0; 1 1 1; 1 1 1]
3×3 Matrix{Int64}:
 1  1  0
 1  1  1
 1  1  1

julia> istril(c)
false

julia> istril(c, 1)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1322-L1352)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.istriu' href='#LinearAlgebra.istriu'>#</a>&nbsp;<b><u>LinearAlgebra.istriu</u></b> &mdash; <i>Function</i>.




```julia
istriu(A::AbstractMatrix, k::Integer = 0) -> Bool
```


Test whether `A` is upper triangular starting from the `k`th superdiagonal.

**Examples**

```julia
julia> a = [1 2; 2 -1]
2×2 Matrix{Int64}:
 1   2
 2  -1

julia> istriu(a)
false

julia> istriu(a, -1)
true

julia> c = [1 1 1; 1 1 1; 0 1 1]
3×3 Matrix{Int64}:
 1  1  1
 1  1  1
 0  1  1

julia> istriu(c)
false

julia> istriu(c, -1)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1277-L1307)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.isdiag' href='#LinearAlgebra.isdiag'>#</a>&nbsp;<b><u>LinearAlgebra.isdiag</u></b> &mdash; <i>Function</i>.




```julia
isdiag(A) -> Bool
```


Test whether a matrix is diagonal in the sense that `iszero(A[i,j])` is true unless `i == j`. Note that it is not necessary for `A` to be square; if you would also like to check that, you need to check that `size(A, 1) == size(A, 2)`.

**Examples**

```julia
julia> a = [1 2; 2 -1]
2×2 Matrix{Int64}:
 1   2
 2  -1

julia> isdiag(a)
false

julia> b = [im 0; 0 -im]
2×2 Matrix{Complex{Int64}}:
 0+1im  0+0im
 0+0im  0-1im

julia> isdiag(b)
true

julia> c = [1 0 0; 0 2 0]
2×3 Matrix{Int64}:
 1  0  0
 0  2  0

julia> isdiag(c)
true

julia> d = [1 0 0; 0 2 3]
2×3 Matrix{Int64}:
 1  0  0
 0  2  3

julia> isdiag(d)
false
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1400-L1441)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ishermitian' href='#LinearAlgebra.ishermitian'>#</a>&nbsp;<b><u>LinearAlgebra.ishermitian</u></b> &mdash; <i>Function</i>.




```julia
ishermitian(A) -> Bool
```


Test whether a matrix is Hermitian.

**Examples**

```julia
julia> a = [1 2; 2 -1]
2×2 Matrix{Int64}:
 1   2
 2  -1

julia> ishermitian(a)
true

julia> b = [1 im; -im 1]
2×2 Matrix{Complex{Int64}}:
 1+0im  0+1im
 0-1im  1+0im

julia> ishermitian(b)
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L1238-L1261)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.transpose' href='#Base.transpose'>#</a>&nbsp;<b><u>Base.transpose</u></b> &mdash; <i>Function</i>.




```julia
transpose(A)
```


Lazy transpose. Mutating the returned object should appropriately mutate `A`. Often, but not always, yields `Transpose(A)`, where `Transpose` is a lazy transpose wrapper. Note that this operation is recursive.

This operation is intended for linear algebra usage - for general data manipulation see [`permutedims`](/base/arrays#Base.permutedims), which is non-recursive.

**Examples**

```julia
julia> A = [3 2; 0 0]
2×2 Matrix{Int64}:
 3  2
 0  0

julia> B = transpose(A)
2×2 transpose(::Matrix{Int64}) with eltype Int64:
 3  0
 2  0

julia> B isa Transpose
true

julia> transpose(B) === A # the transpose of a transpose unwraps the parent
true

julia> Transpose(B) # however, the constructor always wraps its argument
2×2 transpose(transpose(::Matrix{Int64})) with eltype Int64:
 3  2
 0  0

julia> B[1,2] = 4; # modifying B will modify A automatically

julia> A
2×2 Matrix{Int64}:
 3  2
 4  0
```


For complex matrices, the `adjoint` operation is equivalent to a conjugate-transpose.

```julia
julia> A = reshape([Complex(x, x) for x in 1:4], 2, 2)
2×2 Matrix{Complex{Int64}}:
 1+1im  3+3im
 2+2im  4+4im

julia> adjoint(A) == conj(transpose(A))
true
```


The `transpose` of an `AbstractVector` is a row-vector:

```julia
julia> v = [1,2,3]
3-element Vector{Int64}:
 1
 2
 3

julia> transpose(v) # returns a row-vector
1×3 transpose(::Vector{Int64}) with eltype Int64:
 1  2  3

julia> transpose(v) * v # compute the dot product
14
```


For a matrix of matrices, the individual blocks are recursively operated on:

```julia
julia> C = [1 3; 2 4]
2×2 Matrix{Int64}:
 1  3
 2  4

julia> D = reshape([C, 2C, 3C, 4C], 2, 2) # construct a block matrix
2×2 Matrix{Matrix{Int64}}:
 [1 3; 2 4]  [3 9; 6 12]
 [2 6; 4 8]  [4 12; 8 16]

julia> transpose(D) # blocks are recursively transposed
2×2 transpose(::Matrix{Matrix{Int64}}) with eltype Transpose{Int64, Matrix{Int64}}:
 [1 2; 3 4]   [2 4; 6 8]
 [3 6; 9 12]  [4 8; 12 16]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/adjtrans.jl#L191-L276)



```julia
transpose(F::Factorization)
```


Lazy transpose of the factorization `F`. By default, returns a [`TransposeFactorization`](/stdlib/LinearAlgebra#LinearAlgebra.TransposeFactorization), except for `Factorization`s with real `eltype`, in which case returns an [`AdjointFactorization`](/stdlib/LinearAlgebra#LinearAlgebra.AdjointFactorization).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/factorization.jl#L53-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.transpose!' href='#LinearAlgebra.transpose!'>#</a>&nbsp;<b><u>LinearAlgebra.transpose!</u></b> &mdash; <i>Function</i>.




```julia
transpose!(X::AbstractSparseMatrixCSC{Tv,Ti}, A::AbstractSparseMatrixCSC{Tv,Ti}) where {Tv,Ti}
```


Transpose the matrix `A` and stores it in the matrix `X`. `size(X)` must be equal to `size(transpose(A))`. No additional memory is allocated other than resizing the rowval and nzval of `X`, if needed.

See `halfperm!`


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1424-L1432)



```julia
transpose!(dest,src)
```


Transpose array `src` and store the result in the preallocated array `dest`, which should have a size corresponding to `(size(src,2),size(src,1))`. No in-place transposition is supported and unexpected results will happen if `src` and `dest` have overlapping memory regions.

**Examples**

```julia
julia> A = [3+2im 9+2im; 8+7im  4+6im]
2×2 Matrix{Complex{Int64}}:
 3+2im  9+2im
 8+7im  4+6im

julia> B = zeros(Complex{Int64}, 2, 2)
2×2 Matrix{Complex{Int64}}:
 0+0im  0+0im
 0+0im  0+0im

julia> transpose!(B, A);

julia> B
2×2 Matrix{Complex{Int64}}:
 3+2im  8+7im
 9+2im  4+6im

julia> A
2×2 Matrix{Complex{Int64}}:
 3+2im  9+2im
 8+7im  4+6im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/transpose.jl#L8-L40)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Transpose' href='#LinearAlgebra.Transpose'>#</a>&nbsp;<b><u>LinearAlgebra.Transpose</u></b> &mdash; <i>Type</i>.




```julia
Transpose
```


Lazy wrapper type for a transpose view of the underlying linear algebra object, usually an `AbstractVector`/`AbstractMatrix`. Usually, the `Transpose` constructor should not be called directly, use [`transpose`](/stdlib/LinearAlgebra#Base.transpose) instead. To materialize the view use [`copy`](/base/base#Base.copy).

This type is intended for linear algebra usage - for general data manipulation see [`permutedims`](/base/arrays#Base.permutedims).

**Examples**

```julia
julia> A = [2 3; 0 0]
2×2 Matrix{Int64}:
 2  3
 0  0

julia> Transpose(A)
2×2 transpose(::Matrix{Int64}) with eltype Int64:
 2  0
 3  0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/adjtrans.jl#L35-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.TransposeFactorization' href='#LinearAlgebra.TransposeFactorization'>#</a>&nbsp;<b><u>LinearAlgebra.TransposeFactorization</u></b> &mdash; <i>Type</i>.




```julia
TransposeFactorization
```


Lazy wrapper type for the transpose of the underlying `Factorization` object. Usually, the `TransposeFactorization` constructor should not be called directly, use [`transpose(:: Factorization)`](/stdlib/LinearAlgebra#Base.transpose) instead.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/factorization.jl#L27-L33)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.adjoint' href='#Base.adjoint'>#</a>&nbsp;<b><u>Base.adjoint</u></b> &mdash; <i>Function</i>.




```julia
A'
adjoint(A)
```


Lazy adjoint (conjugate transposition). Note that `adjoint` is applied recursively to elements.

For number types, `adjoint` returns the complex conjugate, and therefore it is equivalent to the identity function for real numbers.

This operation is intended for linear algebra usage - for general data manipulation see [`permutedims`](/base/arrays#Base.permutedims).

**Examples**

```julia
julia> A = [3+2im 9+2im; 0  0]
2×2 Matrix{Complex{Int64}}:
 3+2im  9+2im
 0+0im  0+0im

julia> B = A' # equivalently adjoint(A)
2×2 adjoint(::Matrix{Complex{Int64}}) with eltype Complex{Int64}:
 3-2im  0+0im
 9-2im  0+0im

julia> B isa Adjoint
true

julia> adjoint(B) === A # the adjoint of an adjoint unwraps the parent
true

julia> Adjoint(B) # however, the constructor always wraps its argument
2×2 adjoint(adjoint(::Matrix{Complex{Int64}})) with eltype Complex{Int64}:
 3+2im  9+2im
 0+0im  0+0im

julia> B[1,2] = 4 + 5im; # modifying B will modify A automatically

julia> A
2×2 Matrix{Complex{Int64}}:
 3+2im  9+2im
 4-5im  0+0im
```


For real matrices, the `adjoint` operation is equivalent to a `transpose`.

```julia
julia> A = reshape([x for x in 1:4], 2, 2)
2×2 Matrix{Int64}:
 1  3
 2  4

julia> A'
2×2 adjoint(::Matrix{Int64}) with eltype Int64:
 1  2
 3  4

julia> adjoint(A) == transpose(A)
true
```


The adjoint of an `AbstractVector` is a row-vector:

```julia
julia> x = [3, 4im]
2-element Vector{Complex{Int64}}:
 3 + 0im
 0 + 4im

julia> x'
1×2 adjoint(::Vector{Complex{Int64}}) with eltype Complex{Int64}:
 3+0im  0-4im

julia> x'x # compute the dot product, equivalently x' * x
25 + 0im
```


For a matrix of matrices, the individual blocks are recursively operated on:

```julia
julia> A = reshape([x + im*x for x in 1:4], 2, 2)
2×2 Matrix{Complex{Int64}}:
 1+1im  3+3im
 2+2im  4+4im

julia> C = reshape([A, 2A, 3A, 4A], 2, 2)
2×2 Matrix{Matrix{Complex{Int64}}}:
 [1+1im 3+3im; 2+2im 4+4im]  [3+3im 9+9im; 6+6im 12+12im]
 [2+2im 6+6im; 4+4im 8+8im]  [4+4im 12+12im; 8+8im 16+16im]

julia> C'
2×2 adjoint(::Matrix{Matrix{Complex{Int64}}}) with eltype Adjoint{Complex{Int64}, Matrix{Complex{Int64}}}:
 [1-1im 2-2im; 3-3im 4-4im]    [2-2im 4-4im; 6-6im 8-8im]
 [3-3im 6-6im; 9-9im 12-12im]  [4-4im 8-8im; 12-12im 16-16im]
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/adjtrans.jl#L95-L188)



```julia
adjoint(F::Factorization)
```


Lazy adjoint of the factorization `F`. By default, returns an [`AdjointFactorization`](/stdlib/LinearAlgebra#LinearAlgebra.AdjointFactorization) wrapper.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/factorization.jl#L46-L51)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.adjoint!' href='#LinearAlgebra.adjoint!'>#</a>&nbsp;<b><u>LinearAlgebra.adjoint!</u></b> &mdash; <i>Function</i>.




```julia
adjoint!(X::AbstractSparseMatrixCSC{Tv,Ti}, A::AbstractSparseMatrixCSC{Tv,Ti}) where {Tv,Ti}
```


Transpose the matrix `A` and stores the adjoint of the elements in the matrix `X`. `size(X)` must be equal to `size(transpose(A))`. No additional memory is allocated other than resizing the rowval and nzval of `X`, if needed.

See `halfperm!`


[source](https://github.com/JuliaSparse/SparseArrays.jl/blob/cb602d7b7cf46057ddc87d23cda2bdd168a548ac/src/sparsematrix.jl#L1435-L1443)



```julia
adjoint!(dest,src)
```


Conjugate transpose array `src` and store the result in the preallocated array `dest`, which should have a size corresponding to `(size(src,2),size(src,1))`. No in-place transposition is supported and unexpected results will happen if `src` and `dest` have overlapping memory regions.

**Examples**

```julia
julia> A = [3+2im 9+2im; 8+7im  4+6im]
2×2 Matrix{Complex{Int64}}:
 3+2im  9+2im
 8+7im  4+6im

julia> B = zeros(Complex{Int64}, 2, 2)
2×2 Matrix{Complex{Int64}}:
 0+0im  0+0im
 0+0im  0+0im

julia> adjoint!(B, A);

julia> B
2×2 Matrix{Complex{Int64}}:
 3-2im  8-7im
 9-2im  4-6im

julia> A
2×2 Matrix{Complex{Int64}}:
 3+2im  9+2im
 8+7im  4+6im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/transpose.jl#L43-L75)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.Adjoint' href='#LinearAlgebra.Adjoint'>#</a>&nbsp;<b><u>LinearAlgebra.Adjoint</u></b> &mdash; <i>Type</i>.




```julia
Adjoint
```


Lazy wrapper type for an adjoint view of the underlying linear algebra object, usually an `AbstractVector`/`AbstractMatrix`. Usually, the `Adjoint` constructor should not be called directly, use [`adjoint`](/stdlib/LinearAlgebra#Base.adjoint) instead. To materialize the view use [`copy`](/base/base#Base.copy).

This type is intended for linear algebra usage - for general data manipulation see [`permutedims`](/base/arrays#Base.permutedims).

**Examples**

```julia
julia> A = [3+2im 9+2im; 0 0]
2×2 Matrix{Complex{Int64}}:
 3+2im  9+2im
 0+0im  0+0im

julia> Adjoint(A)
2×2 adjoint(::Matrix{Complex{Int64}}) with eltype Complex{Int64}:
 3-2im  0+0im
 9-2im  0+0im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/adjtrans.jl#L8-L31)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.AdjointFactorization' href='#LinearAlgebra.AdjointFactorization'>#</a>&nbsp;<b><u>LinearAlgebra.AdjointFactorization</u></b> &mdash; <i>Type</i>.




```julia
AdjointFactorization
```


Lazy wrapper type for the adjoint of the underlying `Factorization` object. Usually, the `AdjointFactorization` constructor should not be called directly, use [`adjoint(:: Factorization)`](/stdlib/LinearAlgebra#Base.adjoint) instead.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/factorization.jl#L14-L20)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copy-Tuple{Union{Adjoint, Transpose}}' href='#Base.copy-Tuple{Union{Adjoint, Transpose}}'>#</a>&nbsp;<b><u>Base.copy</u></b> &mdash; <i>Method</i>.




```julia
copy(A::Transpose)
copy(A::Adjoint)
```


Eagerly evaluate the lazy matrix transpose/adjoint. Note that the transposition is applied recursively to elements.

This operation is intended for linear algebra usage - for general data manipulation see [`permutedims`](/base/arrays#Base.permutedims), which is non-recursive.

**Examples**

```julia
julia> A = [1 2im; -3im 4]
2×2 Matrix{Complex{Int64}}:
 1+0im  0+2im
 0-3im  4+0im

julia> T = transpose(A)
2×2 transpose(::Matrix{Complex{Int64}}) with eltype Complex{Int64}:
 1+0im  0-3im
 0+2im  4+0im

julia> copy(T)
2×2 Matrix{Complex{Int64}}:
 1+0im  0-3im
 0+2im  4+0im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/transpose.jl#L148-L175)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.stride1' href='#LinearAlgebra.stride1'>#</a>&nbsp;<b><u>LinearAlgebra.stride1</u></b> &mdash; <i>Function</i>.




```julia
stride1(A) -> Int
```


Return the distance between successive array elements in dimension 1 in units of element size.

**Examples**

```julia
julia> A = [1,2,3,4]
4-element Vector{Int64}:
 1
 2
 3
 4

julia> LinearAlgebra.stride1(A)
1

julia> B = view(A, 2:2:4)
2-element view(::Vector{Int64}, 2:2:4) with eltype Int64:
 2
 4

julia> LinearAlgebra.stride1(B)
2
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L247-L273)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.checksquare' href='#LinearAlgebra.checksquare'>#</a>&nbsp;<b><u>LinearAlgebra.checksquare</u></b> &mdash; <i>Function</i>.




```julia
LinearAlgebra.checksquare(A)
```


Check that a matrix is square, then return its common dimension. For multiple arguments, return a vector.

**Examples**

```julia
julia> A = fill(1, (4,4)); B = fill(1, (5,5));

julia> LinearAlgebra.checksquare(A, B)
2-element Vector{Int64}:
 4
 5
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L282-L297)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.peakflops' href='#LinearAlgebra.peakflops'>#</a>&nbsp;<b><u>LinearAlgebra.peakflops</u></b> &mdash; <i>Function</i>.




```julia
LinearAlgebra.peakflops(n::Integer=4096; eltype::DataType=Float64, ntrials::Integer=3, parallel::Bool=false)
```


`peakflops` computes the peak flop rate of the computer by using double precision [`gemm!`](/stdlib/LinearAlgebra#LinearAlgebra.BLAS.gemm!). By default, if no arguments are specified, it multiplies two `Float64` matrices of size `n x n`, where `n = 4096`. If the underlying BLAS is using multiple threads, higher flop rates are realized. The number of BLAS threads can be set with [`BLAS.set_num_threads(n)`](/stdlib/LinearAlgebra#LinearAlgebra.BLAS.set_num_threads).

If the keyword argument `eltype` is provided, `peakflops` will construct matrices with elements of type `eltype` for calculating the peak flop rate.

By default, `peakflops` will use the best timing from 3 trials. If the `ntrials` keyword argument is provided, `peakflops` will use those many trials for picking the best timing.

If the keyword argument `parallel` is set to `true`, `peakflops` is run in parallel on all the worker processors. The flop rate of the entire parallel computer is returned. When running in parallel, only 1 BLAS thread is used. The argument `n` still refers to the size of the problem that is solved on each processor.

::: tip Julia 1.1

This function requires at least Julia 1.1. In Julia 1.0 it is available from the standard library `InteractiveUtils`.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L664-L687)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.hermitianpart' href='#LinearAlgebra.hermitianpart'>#</a>&nbsp;<b><u>LinearAlgebra.hermitianpart</u></b> &mdash; <i>Function</i>.




```julia
hermitianpart(A, uplo=:U) -> Hermitian
```


Return the Hermitian part of the square matrix `A`, defined as `(A + A') / 2`, as a [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) matrix. For real matrices `A`, this is also known as the symmetric part of `A`; it is also sometimes called the &quot;operator real part&quot;. The optional argument `uplo` controls the corresponding argument of the [`Hermitian`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian) view. For real matrices, the latter is equivalent to a [`Symmetric`](/stdlib/LinearAlgebra#LinearAlgebra.Symmetric) view.

See also [`hermitianpart!`](/stdlib/LinearAlgebra#LinearAlgebra.hermitianpart!) for the corresponding in-place operation.

::: tip Julia 1.10

This function requires Julia 1.10 or later.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetric.jl#L846-L859)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.hermitianpart!' href='#LinearAlgebra.hermitianpart!'>#</a>&nbsp;<b><u>LinearAlgebra.hermitianpart!</u></b> &mdash; <i>Function</i>.




```julia
hermitianpart!(A, uplo=:U) -> Hermitian
```


Overwrite the square matrix `A` in-place with its Hermitian part `(A + A') / 2`, and return [`Hermitian(A, uplo)`](/stdlib/LinearAlgebra#LinearAlgebra.Hermitian). For real matrices `A`, this is also known as the symmetric part of `A`.

See also [`hermitianpart`](/stdlib/LinearAlgebra#LinearAlgebra.hermitianpart) for the corresponding out-of-place operation.

::: tip Julia 1.10

This function requires Julia 1.10 or later.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/symmetric.jl#L862-L873)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.copy_adjoint!' href='#LinearAlgebra.copy_adjoint!'>#</a>&nbsp;<b><u>LinearAlgebra.copy_adjoint!</u></b> &mdash; <i>Function</i>.




```julia
copy_adjoint!(B::AbstractVecOrMat, ir_dest::AbstractRange{Int}, jr_dest::AbstractRange{Int},
                A::AbstractVecOrMat, ir_src::AbstractRange{Int}, jr_src::AbstractRange{Int}) -> B
```


Efficiently copy elements of matrix `A` to `B` with adjunction as follows:

```
B[ir_dest, jr_dest] = adjoint(A)[jr_src, ir_src]
```


The elements `B[ir_dest, jr_dest]` are overwritten. Furthermore, the index range parameters must satisfy `length(ir_dest) == length(jr_src)` and `length(jr_dest) == length(ir_src)`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/transpose.jl#L197-L208)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.copy_transpose!' href='#LinearAlgebra.copy_transpose!'>#</a>&nbsp;<b><u>LinearAlgebra.copy_transpose!</u></b> &mdash; <i>Function</i>.




```julia
copy_transpose!(B::AbstractVecOrMat, ir_dest::AbstractRange{Int}, jr_dest::AbstractRange{Int},
                A::AbstractVecOrMat, ir_src::AbstractRange{Int}, jr_src::AbstractRange{Int}) -> B
```


Efficiently copy elements of matrix `A` to `B` with transposition as follows:

```
B[ir_dest, jr_dest] = transpose(A)[jr_src, ir_src]
```


The elements `B[ir_dest, jr_dest]` are overwritten. Furthermore, the index range parameters must satisfy `length(ir_dest) == length(jr_src)` and `length(jr_dest) == length(ir_src)`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/transpose.jl#L181-L192)



```julia
copy_transpose!(B::AbstractMatrix, ir_dest::AbstractUnitRange, jr_dest::AbstractUnitRange,
                tM::AbstractChar,
                M::AbstractVecOrMat, ir_src::AbstractUnitRange, jr_src::AbstractUnitRange) -> B
```


Efficiently copy elements of matrix `M` to `B` conditioned on the character parameter `tM` as follows:

|  `tM` | Destination           | Source                         |
| -----:|:--------------------- |:------------------------------ |
| `'N'` | `B[ir_dest, jr_dest]` | `transpose(M)[jr_src, ir_src]` |
| `'T'` | `B[ir_dest, jr_dest]` | `M[jr_src, ir_src]`            |
| `'C'` | `B[ir_dest, jr_dest]` | `conj(M)[jr_src, ir_src]`      |


The elements `B[ir_dest, jr_dest]` are overwritten. Furthermore, the index range parameters must satisfy `length(ir_dest) == length(jr_src)` and `length(jr_dest) == length(ir_src)`.

See also [`copyto!`](/base/c#Base.copyto!) and [`copy_adjoint!`](/stdlib/LinearAlgebra#LinearAlgebra.copy_adjoint!).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L716-L735)

</div>
<br>

## Low-level matrix operations {#Low-level-matrix-operations}

In many cases there are in-place versions of matrix operations that allow you to supply a pre-allocated output vector or matrix.  This is useful when optimizing critical code in order to avoid the overhead of repeated allocations. These in-place operations are suffixed with `!` below (e.g. `mul!`) according to the usual Julia convention.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.mul!' href='#LinearAlgebra.mul!'>#</a>&nbsp;<b><u>LinearAlgebra.mul!</u></b> &mdash; <i>Function</i>.




```julia
mul!(Y, A, B) -> Y
```


Calculates the matrix-matrix or matrix-vector product $A B$ and stores the result in `Y`, overwriting the existing value of `Y`. Note that `Y` must not be aliased with either `A` or `B`.

**Examples**

```julia
julia> A = [1.0 2.0; 3.0 4.0]; B = [1.0 1.0; 1.0 1.0]; Y = similar(B);

julia> mul!(Y, A, B) === Y
true

julia> Y
2×2 Matrix{Float64}:
 3.0  3.0
 7.0  7.0

julia> Y == A * B
true
```


**Implementation**

For custom matrix and vector types, it is recommended to implement 5-argument `mul!` rather than implementing 3-argument `mul!` directly if possible.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L225-L252)



```julia
mul!(C, A, B, α, β) -> C
```


Combined inplace matrix-matrix or matrix-vector multiply-add $A B α + C β$. The result is stored in `C` by overwriting it.  Note that `C` must not be aliased with either `A` or `B`.

::: tip Julia 1.3

Five-argument `mul!` requires at least Julia 1.3.

:::

**Examples**

```julia
julia> A = [1.0 2.0; 3.0 4.0]; B = [1.0 1.0; 1.0 1.0]; C = [1.0 2.0; 3.0 4.0];

julia> α, β = 100.0, 10.0;

julia> mul!(C, A, B, α, β) === C
true

julia> C
2×2 Matrix{Float64}:
 310.0  320.0
 730.0  740.0

julia> C_original = [1.0 2.0; 3.0 4.0]; # A copy of the original value of C

julia> C == A * B * α + C_original * β
true
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L255-L284)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.lmul!' href='#LinearAlgebra.lmul!'>#</a>&nbsp;<b><u>LinearAlgebra.lmul!</u></b> &mdash; <i>Function</i>.




```julia
lmul!(a::Number, B::AbstractArray)
```


Scale an array `B` by a scalar `a` overwriting `B` in-place.  Use [`rmul!`](/stdlib/LinearAlgebra#LinearAlgebra.rmul!) to multiply scalar from right.  The scaling operation respects the semantics of the multiplication [`*`](/base/math#Base.:*-Tuple{Any,%20Vararg{Any}}) between `a` and an element of `B`.  In particular, this also applies to multiplication involving non-finite numbers such as `NaN` and `±Inf`.

::: tip Julia 1.1

Prior to Julia 1.1, `NaN` and `±Inf` entries in `B` were treated inconsistently.

:::

**Examples**

```julia
julia> B = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> lmul!(2, B)
2×2 Matrix{Int64}:
 2  4
 6  8

julia> lmul!(0.0, [Inf])
1-element Vector{Float64}:
 NaN
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L195-L224)



```julia
lmul!(A, B)
```


Calculate the matrix-matrix product $AB$, overwriting `B`, and return the result. Here, `A` must be of special matrix type, like, e.g., [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal), [`UpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UpperTriangular) or [`LowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.LowerTriangular), or of some orthogonal type, see [`QR`](/stdlib/LinearAlgebra#LinearAlgebra.QR).

**Examples**

```julia
julia> B = [0 1; 1 0];

julia> A = UpperTriangular([1 2; 0 3]);

julia> lmul!(A, B);

julia> B
2×2 Matrix{Int64}:
 2  1
 3  0

julia> B = [1.0 2.0; 3.0 4.0];

julia> F = qr([0 1; -1 0]);

julia> lmul!(F.Q, B)
2×2 Matrix{Float64}:
 3.0  4.0
 1.0  2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L330-L360)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.rmul!' href='#LinearAlgebra.rmul!'>#</a>&nbsp;<b><u>LinearAlgebra.rmul!</u></b> &mdash; <i>Function</i>.




```julia
rmul!(A::AbstractArray, b::Number)
```


Scale an array `A` by a scalar `b` overwriting `A` in-place.  Use [`lmul!`](/stdlib/LinearAlgebra#LinearAlgebra.lmul!) to multiply scalar from left.  The scaling operation respects the semantics of the multiplication [`*`](/base/math#Base.:*-Tuple{Any,%20Vararg{Any}}) between an element of `A` and `b`.  In particular, this also applies to multiplication involving non-finite numbers such as `NaN` and `±Inf`.

::: tip Julia 1.1

Prior to Julia 1.1, `NaN` and `±Inf` entries in `A` were treated inconsistently.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> rmul!(A, 2)
2×2 Matrix{Int64}:
 2  4
 6  8

julia> rmul!([NaN], 0.0)
1-element Vector{Float64}:
 NaN
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L157-L186)



```julia
rmul!(A, B)
```


Calculate the matrix-matrix product $AB$, overwriting `A`, and return the result. Here, `B` must be of special matrix type, like, e.g., [`Diagonal`](/stdlib/LinearAlgebra#LinearAlgebra.Diagonal), [`UpperTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.UpperTriangular) or [`LowerTriangular`](/stdlib/LinearAlgebra#LinearAlgebra.LowerTriangular), or of some orthogonal type, see [`QR`](/stdlib/LinearAlgebra#LinearAlgebra.QR).

**Examples**

```julia
julia> A = [0 1; 1 0];

julia> B = UpperTriangular([1 2; 0 3]);

julia> rmul!(A, B);

julia> A
2×2 Matrix{Int64}:
 0  3
 1  2

julia> A = [1.0 2.0; 3.0 4.0];

julia> F = qr([0 1; -1 0]);

julia> rmul!(A, F.Q)
2×2 Matrix{Float64}:
 2.0  1.0
 4.0  3.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L297-L327)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.ldiv!' href='#LinearAlgebra.ldiv!'>#</a>&nbsp;<b><u>LinearAlgebra.ldiv!</u></b> &mdash; <i>Function</i>.




```julia
ldiv!(Y, A, B) -> Y
```


Compute `A \ B` in-place and store the result in `Y`, returning the result.

The argument `A` should _not_ be a matrix.  Rather, instead of matrices it should be a factorization object (e.g. produced by [`factorize`](/stdlib/LinearAlgebra#LinearAlgebra.factorize) or [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky)). The reason for this is that factorization itself is both expensive and typically allocates memory (although it can also be done in-place via, e.g., [`lu!`](/stdlib/LinearAlgebra#LinearAlgebra.lu!)), and performance-critical situations requiring `ldiv!` usually also require fine-grained control over the factorization of `A`.

::: tip Note

Certain structured matrix types, such as `Diagonal` and `UpperTriangular`, are permitted, as these are already in a factorized form

:::

**Examples**

```julia
julia> A = [1 2.2 4; 3.1 0.2 3; 4 1 2];

julia> X = [1; 2.5; 3];

julia> Y = zero(X);

julia> ldiv!(Y, qr(A), X);

julia> Y
3-element Vector{Float64}:
  0.7128099173553719
 -0.051652892561983674
  0.10020661157024757

julia> A\X
3-element Vector{Float64}:
  0.7128099173553719
 -0.05165289256198333
  0.10020661157024785
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L335-L373)



```julia
ldiv!(A, B)
```


Compute `A \ B` in-place and overwriting `B` to store the result.

The argument `A` should _not_ be a matrix.  Rather, instead of matrices it should be a factorization object (e.g. produced by [`factorize`](/stdlib/LinearAlgebra#LinearAlgebra.factorize) or [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky)). The reason for this is that factorization itself is both expensive and typically allocates memory (although it can also be done in-place via, e.g., [`lu!`](/stdlib/LinearAlgebra#LinearAlgebra.lu!)), and performance-critical situations requiring `ldiv!` usually also require fine-grained control over the factorization of `A`.

::: tip Note

Certain structured matrix types, such as `Diagonal` and `UpperTriangular`, are permitted, as these are already in a factorized form

:::

**Examples**

```julia
julia> A = [1 2.2 4; 3.1 0.2 3; 4 1 2];

julia> X = [1; 2.5; 3];

julia> Y = copy(X);

julia> ldiv!(qr(A), X);

julia> X
3-element Vector{Float64}:
  0.7128099173553719
 -0.051652892561983674
  0.10020661157024757

julia> A\Y
3-element Vector{Float64}:
  0.7128099173553719
 -0.05165289256198333
  0.10020661157024785
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L376-L414)



```julia
ldiv!(a::Number, B::AbstractArray)
```


Divide each entry in an array `B` by a scalar `a` overwriting `B` in-place.  Use [`rdiv!`](/stdlib/LinearAlgebra#LinearAlgebra.rdiv!) to divide scalar from right.

**Examples**

```julia
julia> B = [1.0 2.0; 3.0 4.0]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> ldiv!(2.0, B)
2×2 Matrix{Float64}:
 0.5  1.0
 1.5  2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L258-L276)



```julia
ldiv!(A::Tridiagonal, B::AbstractVecOrMat) -> B
```


Compute `A \ B` in-place by Gaussian elimination with partial pivoting and store the result in `B`, returning the result. In the process, the diagonals of `A` are overwritten as well.

::: tip Julia 1.11

`ldiv!` for `Tridiagonal` left-hand sides requires at least Julia 1.11.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/tridiag.jl#L918-L926)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.rdiv!' href='#LinearAlgebra.rdiv!'>#</a>&nbsp;<b><u>LinearAlgebra.rdiv!</u></b> &mdash; <i>Function</i>.




```julia
rdiv!(A, B)
```


Compute `A / B` in-place and overwriting `A` to store the result.

The argument `B` should _not_ be a matrix.  Rather, instead of matrices it should be a factorization object (e.g. produced by [`factorize`](/stdlib/LinearAlgebra#LinearAlgebra.factorize) or [`cholesky`](/stdlib/LinearAlgebra#LinearAlgebra.cholesky)). The reason for this is that factorization itself is both expensive and typically allocates memory (although it can also be done in-place via, e.g., [`lu!`](/stdlib/LinearAlgebra#LinearAlgebra.lu!)), and performance-critical situations requiring `rdiv!` usually also require fine-grained control over the factorization of `B`.

::: tip Note

Certain structured matrix types, such as `Diagonal` and `UpperTriangular`, are permitted, as these are already in a factorized form

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/LinearAlgebra.jl#L418-L433)



```julia
rdiv!(A::AbstractArray, b::Number)
```


Divide each entry in an array `A` by a scalar `b` overwriting `A` in-place.  Use [`ldiv!`](/stdlib/LinearAlgebra#LinearAlgebra.ldiv!) to divide scalar from left.

**Examples**

```julia
julia> A = [1.0 2.0; 3.0 4.0]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> rdiv!(A, 2.0)
2×2 Matrix{Float64}:
 0.5  1.0
 1.5  2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/generic.jl#L232-L250)

</div>
<br>

## BLAS functions {#BLAS-functions}

In Julia (as in much of scientific computation), dense linear-algebra operations are based on the [LAPACK library](https://www.netlib.org/lapack/), which in turn is built on top of basic linear-algebra building-blocks known as the [BLAS](https://www.netlib.org/blas/). There are highly optimized implementations of BLAS available for every computer architecture, and sometimes in high-performance linear algebra routines it is useful to call the BLAS functions directly.

`LinearAlgebra.BLAS` provides wrappers for some of the BLAS functions. Those BLAS functions that overwrite one of the input arrays have names ending in `'!'`.  Usually, a BLAS function has four methods defined, for [`Float32`](/base/numbers#Core.Float32), [`Float64`](/base/numbers#Core.Float64), [`ComplexF32`](/base/numbers#Base.Complex), and [`ComplexF64`](/base/numbers#Base.Complex) arrays.

### BLAS character arguments {#stdlib-blas-chars}

Many BLAS functions accept arguments that determine whether to transpose an argument (`trans`), which triangle of a matrix to reference (`uplo` or `ul`), whether the diagonal of a triangular matrix can be assumed to be all ones (`dA`) or which side of a matrix multiplication the input argument belongs on (`side`). The possibilities are:

#### Multiplication order {#stdlib-blas-side}

| `side` | Meaning                                                             |
|:------ |:------------------------------------------------------------------- |
| `'L'`  | The argument goes on the _left_ side of a matrix-matrix operation.  |
| `'R'`  | The argument goes on the _right_ side of a matrix-matrix operation. |


#### Triangle referencing {#stdlib-blas-uplo}

| `uplo`/`ul` | Meaning                                               |
|:----------- |:----------------------------------------------------- |
| `'U'`       | Only the _upper_ triangle of the matrix will be used. |
| `'L'`       | Only the _lower_ triangle of the matrix will be used. |


#### Transposition operation {#stdlib-blas-trans}

| `trans`/`tX` | Meaning                                                 |
|:------------ |:------------------------------------------------------- |
| `'N'`        | The input matrix `X` is not transposed or conjugated.   |
| `'T'`        | The input matrix `X` will be transposed.                |
| `'C'`        | The input matrix `X` will be conjugated and transposed. |


#### Unit diagonal {#stdlib-blas-diag}

| `diag`/`dX` | Meaning                                                   |
|:----------- |:--------------------------------------------------------- |
| `'N'`       | The diagonal values of the matrix `X` will be read.       |
| `'U'`       | The diagonal of the matrix `X` is assumed to be all ones. |

<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS' href='#LinearAlgebra.BLAS'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS</u></b> &mdash; <i>Module</i>.




Interface to BLAS subroutines.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L3-L5)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.set_num_threads' href='#LinearAlgebra.BLAS.set_num_threads'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.set_num_threads</u></b> &mdash; <i>Function</i>.




```julia
set_num_threads(n::Integer)
set_num_threads(::Nothing)
```


Set the number of threads the BLAS library should use equal to `n::Integer`.

Also accepts `nothing`, in which case julia tries to guess the default number of threads. Passing `nothing` is discouraged and mainly exists for historical reasons.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L123-L131)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.get_num_threads' href='#LinearAlgebra.BLAS.get_num_threads'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.get_num_threads</u></b> &mdash; <i>Function</i>.




```julia
get_num_threads()
```


Get the number of threads the BLAS library is using.

::: tip Julia 1.6

`get_num_threads` requires at least Julia 1.6.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L143-L150)

</div>
<br>

BLAS functions can be divided into three groups, also called three levels, depending on when they were first proposed, the type of input parameters, and the complexity of the operation.

### Level 1 BLAS functions {#Level-1-BLAS-functions}

The level 1 BLAS functions were first proposed in [(Lawson, 1979)][Lawson-1979] and define operations between scalars and vectors.

[Lawson-1979]: https://dl.acm.org/doi/10.1145/355841.355847
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.rot!' href='#LinearAlgebra.BLAS.rot!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.rot!</u></b> &mdash; <i>Function</i>.




```julia
rot!(n, X, incx, Y, incy, c, s)
```


Overwrite `X` with `c*X + s*Y` and `Y` with `-conj(s)*X + c*Y` for the first `n` elements of array `X` with stride `incx` and first `n` elements of array `Y` with stride `incy`. Returns `X` and `Y`.

::: tip Julia 1.5

`rot!` requires at least Julia 1.5.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L218-L226)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.scal!' href='#LinearAlgebra.BLAS.scal!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.scal!</u></b> &mdash; <i>Function</i>.




```julia
scal!(n, a, X, incx)
scal!(a, X)
```


Overwrite `X` with `a*X` for the first `n` elements of array `X` with stride `incx`. Returns `X`.

If `n` and `incx` are not provided, `length(X)` and `stride(X,1)` are used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L248-L255)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.scal' href='#LinearAlgebra.BLAS.scal'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.scal</u></b> &mdash; <i>Function</i>.




```julia
scal(n, a, X, incx)
scal(a, X)
```


Return `X` scaled by `a` for the first `n` elements of array `X` with stride `incx`.

If `n` and `incx` are not provided, `length(X)` and `stride(X,1)` are used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L258-L265)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.blascopy!' href='#LinearAlgebra.BLAS.blascopy!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.blascopy!</u></b> &mdash; <i>Function</i>.




```julia
blascopy!(n, X, incx, Y, incy)
```


Copy `n` elements of array `X` with stride `incx` to array `Y` with stride `incy`. Returns `Y`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L193-L197)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.dot' href='#LinearAlgebra.BLAS.dot'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.dot</u></b> &mdash; <i>Function</i>.




```julia
dot(n, X, incx, Y, incy)
```


Dot product of two vectors consisting of `n` elements of array `X` with stride `incx` and `n` elements of array `Y` with stride `incy`.

**Examples**

```julia
julia> BLAS.dot(10, fill(1.0, 10), 1, fill(1.0, 20), 2)
10.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L293-L304)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.dotu' href='#LinearAlgebra.BLAS.dotu'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.dotu</u></b> &mdash; <i>Function</i>.




```julia
dotu(n, X, incx, Y, incy)
```


Dot function for two complex vectors consisting of `n` elements of array `X` with stride `incx` and `n` elements of array `Y` with stride `incy`.

**Examples**

```julia
julia> BLAS.dotu(10, fill(1.0im, 10), 1, fill(1.0+im, 20), 2)
-10.0 + 10.0im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L322-L333)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.dotc' href='#LinearAlgebra.BLAS.dotc'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.dotc</u></b> &mdash; <i>Function</i>.




```julia
dotc(n, X, incx, U, incy)
```


Dot function for two complex vectors, consisting of `n` elements of array `X` with stride `incx` and `n` elements of array `U` with stride `incy`, conjugating the first vector.

**Examples**

```julia
julia> BLAS.dotc(10, fill(1.0im, 10), 1, fill(1.0+im, 20), 2)
10.0 - 10.0im
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L307-L319)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.nrm2' href='#LinearAlgebra.BLAS.nrm2'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.nrm2</u></b> &mdash; <i>Function</i>.




```julia
nrm2(n, X, incx)
```


2-norm of a vector consisting of `n` elements of array `X` with stride `incx`.

**Examples**

```julia
julia> BLAS.nrm2(4, fill(1.0, 8), 2)
2.0

julia> BLAS.nrm2(1, fill(1.0, 8), 2)
1.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L403-L416)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.asum' href='#LinearAlgebra.BLAS.asum'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.asum</u></b> &mdash; <i>Function</i>.




```julia
asum(n, X, incx)
```


Sum of the magnitudes of the first `n` elements of array `X` with stride `incx`.

For a real array, the magnitude is the absolute value. For a complex array, the magnitude is the sum of the absolute value of the real part and the absolute value of the imaginary part.

**Examples**

```julia
julia> BLAS.asum(5, fill(1.0im, 10), 2)
5.0

julia> BLAS.asum(2, fill(1.0im, 10), 5)
2.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L440-L457)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.iamax' href='#LinearAlgebra.BLAS.iamax'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.iamax</u></b> &mdash; <i>Function</i>.




```julia
iamax(n, dx, incx)
iamax(dx)
```


Find the index of the element of `dx` with the maximum absolute value. `n` is the length of `dx`, and `incx` is the stride. If `n` and `incx` are not provided, they assume default values of `n=length(dx)` and `incx=stride1(dx)`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L620-L626)

</div>
<br>

### Level 2 BLAS functions {#Level-2-BLAS-functions}

The level 2 BLAS functions were published in [(Dongarra, 1988)][Dongarra-1988], and define matrix-vector operations.

[Dongarra-1988]: https://dl.acm.org/doi/10.1145/42288.42291

**return a vector**
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemv!' href='#LinearAlgebra.BLAS.gemv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemv!</u></b> &mdash; <i>Function</i>.




```julia
gemv!(tA, alpha, A, x, beta, y)
```


Update the vector `y` as `alpha*A*x + beta*y` or `alpha*A'x + beta*y` according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). `alpha` and `beta` are scalars. Return the updated `y`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L686-L692)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemv-NTuple{4, Any}' href='#LinearAlgebra.BLAS.gemv-NTuple{4, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemv</u></b> &mdash; <i>Method</i>.




```julia
gemv(tA, alpha, A, x)
```


Return `alpha*A*x` or `alpha*A'x` according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). `alpha` is a scalar.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L695-L700)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemv-Tuple{Any, Any, Any}' href='#LinearAlgebra.BLAS.gemv-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemv</u></b> &mdash; <i>Method</i>.




```julia
gemv(tA, A, x)
```


Return `A*x` or `A'x` according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L703-L707)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gbmv!' href='#LinearAlgebra.BLAS.gbmv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gbmv!</u></b> &mdash; <i>Function</i>.




```julia
gbmv!(trans, m, kl, ku, alpha, A, x, beta, y)
```


Update vector `y` as `alpha*A*x + beta*y` or `alpha*A'*x + beta*y` according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans). The matrix `A` is a general band matrix of dimension `m` by `size(A,2)` with `kl` sub-diagonals and `ku` super-diagonals. `alpha` and `beta` are scalars. Return the updated `y`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L712-L718)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gbmv' href='#LinearAlgebra.BLAS.gbmv'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gbmv</u></b> &mdash; <i>Function</i>.




```julia
gbmv(trans, m, kl, ku, alpha, A, x)
```


Return `alpha*A*x` or `alpha*A'*x` according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans). The matrix `A` is a general band matrix of dimension `m` by `size(A,2)` with `kl` sub-diagonals and `ku` super-diagonals, and `alpha` is a scalar.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L721-L727)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.hemv!' href='#LinearAlgebra.BLAS.hemv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.hemv!</u></b> &mdash; <i>Function</i>.




```julia
hemv!(ul, alpha, A, x, beta, y)
```


Update the vector `y` as `alpha*A*x + beta*y`. `A` is assumed to be Hermitian. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. `alpha` and `beta` are scalars. Return the updated `y`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L849-L855)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.hemv-NTuple{4, Any}' href='#LinearAlgebra.BLAS.hemv-NTuple{4, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.hemv</u></b> &mdash; <i>Method</i>.




```julia
hemv(ul, alpha, A, x)
```


Return `alpha*A*x`. `A` is assumed to be Hermitian. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. `alpha` is a scalar.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L896-L902)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.hemv-Tuple{Any, Any, Any}' href='#LinearAlgebra.BLAS.hemv-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.hemv</u></b> &mdash; <i>Method</i>.




```julia
hemv(ul, A, x)
```


Return `A*x`. `A` is assumed to be Hermitian. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L905-L910)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.hpmv!' href='#LinearAlgebra.BLAS.hpmv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.hpmv!</u></b> &mdash; <i>Function</i>.




```julia
hpmv!(uplo, α, AP, x, β, y)
```


Update vector `y` as `α*A*x + β*y`, where `A` is a Hermitian matrix provided in packed format `AP`.

With `uplo = 'U'`, the array AP must contain the upper triangular part of the Hermitian matrix packed sequentially, column by column, so that `AP[1]` contains `A[1, 1]`, `AP[2]` and `AP[3]` contain `A[1, 2]` and `A[2, 2]` respectively, and so on.

With `uplo = 'L'`, the array AP must contain the lower triangular part of the Hermitian matrix packed sequentially, column by column, so that `AP[1]` contains `A[1, 1]`, `AP[2]` and `AP[3]` contain `A[2, 1]` and `A[3, 1]` respectively, and so on.

The scalar inputs `α` and `β` must be complex or real numbers.

The array inputs `x`, `y` and `AP` must all be of `ComplexF32` or `ComplexF64` type.

Return the updated `y`.

::: tip Julia 1.5

`hpmv!` requires at least Julia 1.5.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L979-L1003)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.symv!' href='#LinearAlgebra.BLAS.symv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.symv!</u></b> &mdash; <i>Function</i>.




```julia
symv!(ul, alpha, A, x, beta, y)
```


Update the vector `y` as `alpha*A*x + beta*y`. `A` is assumed to be symmetric. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. `alpha` and `beta` are scalars. Return the updated `y`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L773-L779)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.symv-NTuple{4, Any}' href='#LinearAlgebra.BLAS.symv-NTuple{4, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.symv</u></b> &mdash; <i>Method</i>.




```julia
symv(ul, alpha, A, x)
```


Return `alpha*A*x`. `A` is assumed to be symmetric. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. `alpha` is a scalar.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L831-L837)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.symv-Tuple{Any, Any, Any}' href='#LinearAlgebra.BLAS.symv-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.symv</u></b> &mdash; <i>Method</i>.




```julia
symv(ul, A, x)
```


Return `A*x`. `A` is assumed to be symmetric. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L840-L845)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.sbmv!' href='#LinearAlgebra.BLAS.sbmv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.sbmv!</u></b> &mdash; <i>Function</i>.




```julia
sbmv!(uplo, k, alpha, A, x, beta, y)
```


Update vector `y` as `alpha*A*x + beta*y` where `A` is a symmetric band matrix of order `size(A,2)` with `k` super-diagonals stored in the argument `A`. The storage layout for `A` is described the reference BLAS module, level-2 BLAS at [https://www.netlib.org/lapack/explore-html/](https://www.netlib.org/lapack/explore-html/). Only the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.

Return the updated `y`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1060-L1070)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.sbmv-NTuple{5, Any}' href='#LinearAlgebra.BLAS.sbmv-NTuple{5, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.sbmv</u></b> &mdash; <i>Method</i>.




```julia
sbmv(uplo, k, alpha, A, x)
```


Return `alpha*A*x` where `A` is a symmetric band matrix of order `size(A,2)` with `k` super-diagonals stored in the argument `A`. Only the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1042-L1048)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.sbmv-NTuple{4, Any}' href='#LinearAlgebra.BLAS.sbmv-NTuple{4, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.sbmv</u></b> &mdash; <i>Method</i>.




```julia
sbmv(uplo, k, A, x)
```


Return `A*x` where `A` is a symmetric band matrix of order `size(A,2)` with `k` super-diagonals stored in the argument `A`. Only the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1051-L1057)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.spmv!' href='#LinearAlgebra.BLAS.spmv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.spmv!</u></b> &mdash; <i>Function</i>.




```julia
spmv!(uplo, α, AP, x, β, y)
```


Update vector `y` as `α*A*x + β*y`, where `A` is a symmetric matrix provided in packed format `AP`.

With `uplo = 'U'`, the array AP must contain the upper triangular part of the symmetric matrix packed sequentially, column by column, so that `AP[1]` contains `A[1, 1]`, `AP[2]` and `AP[3]` contain `A[1, 2]` and `A[2, 2]` respectively, and so on.

With `uplo = 'L'`, the array AP must contain the lower triangular part of the symmetric matrix packed sequentially, column by column, so that `AP[1]` contains `A[1, 1]`, `AP[2]` and `AP[3]` contain `A[2, 1]` and `A[3, 1]` respectively, and so on.

The scalar inputs `α` and `β` must be real.

The array inputs `x`, `y` and `AP` must all be of `Float32` or `Float64` type.

Return the updated `y`.

::: tip Julia 1.5

`spmv!` requires at least Julia 1.5.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1139-L1163)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trmv!' href='#LinearAlgebra.BLAS.trmv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trmv!</u></b> &mdash; <i>Function</i>.




```julia
trmv!(ul, tA, dA, A, b)
```


Return `op(A)*b`, where `op` is determined by [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones. The multiplication occurs in-place on `b`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1285-L1293)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trmv' href='#LinearAlgebra.BLAS.trmv'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trmv</u></b> &mdash; <i>Function</i>.




```julia
trmv(ul, tA, dA, A, b)
```


Return `op(A)*b`, where `op` is determined by [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1275-L1282)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trsv!' href='#LinearAlgebra.BLAS.trsv!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trsv!</u></b> &mdash; <i>Function</i>.




```julia
trsv!(ul, tA, dA, A, b)
```


Overwrite `b` with the solution to `A*x = b` or one of the other two variants determined by [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo). [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones. Return the updated `b`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1332-L1340)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trsv' href='#LinearAlgebra.BLAS.trsv'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trsv</u></b> &mdash; <i>Function</i>.




```julia
trsv(ul, tA, dA, A, b)
```


Return the solution to `A*x = b` or one of the other two variants determined by [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo). [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1343-L1350)

</div>
<br>

**return a matrix**
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.ger!' href='#LinearAlgebra.BLAS.ger!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.ger!</u></b> &mdash; <i>Function</i>.




```julia
ger!(alpha, x, y, A)
```


Rank-1 update of the matrix `A` with vectors `x` and `y` as `alpha*x*y' + A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1389-L1393)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.her!' href='#LinearAlgebra.BLAS.her!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.her!</u></b> &mdash; <i>Function</i>.




```julia
her!(uplo, alpha, x, A)
```


Methods for complex arrays only. Rank-1 update of the Hermitian matrix `A` with vector `x` as `alpha*x*x' + A`. [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) controls which triangle of `A` is updated. Returns `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1488-L1494)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.syr!' href='#LinearAlgebra.BLAS.syr!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.syr!</u></b> &mdash; <i>Function</i>.




```julia
syr!(uplo, alpha, x, A)
```


Rank-1 update of the symmetric matrix `A` with vector `x` as `alpha*x*transpose(x) + A`. [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) controls which triangle of `A` is updated. Returns `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1456-L1461)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.spr!' href='#LinearAlgebra.BLAS.spr!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.spr!</u></b> &mdash; <i>Function</i>.




```julia
spr!(uplo, α, x, AP)
```


Update matrix `A` as `A+α*x*x'`, where `A` is a symmetric matrix provided in packed format `AP` and `x` is a vector.

With `uplo = 'U'`, the array AP must contain the upper triangular part of the symmetric matrix packed sequentially, column by column, so that `AP[1]` contains `A[1, 1]`, `AP[2]` and `AP[3]` contain `A[1, 2]` and `A[2, 2]` respectively, and so on.

With `uplo = 'L'`, the array AP must contain the lower triangular part of the symmetric matrix packed sequentially, column by column, so that `AP[1]` contains `A[1, 1]`, `AP[2]` and `AP[3]` contain `A[2, 1]` and `A[3, 1]` respectively, and so on.

The scalar input `α` must be real.

The array inputs `x` and `AP` must all be of `Float32` or `Float64` type. Return the updated `AP`.

::: tip Julia 1.8

`spr!` requires at least Julia 1.8.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1211-L1234)

</div>
<br>

### Level 3 BLAS functions {#Level-3-BLAS-functions}

The level 3 BLAS functions were published in [(Dongarra, 1990)][Dongarra-1990], and define matrix-matrix operations.

[Dongarra-1990]: https://dl.acm.org/doi/10.1145/77626.79170
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemmt!' href='#LinearAlgebra.BLAS.gemmt!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemmt!</u></b> &mdash; <i>Function</i>.




```julia
gemmt!(uplo, tA, tB, alpha, A, B, beta, C)
```


Update the lower or upper triangular part specified by [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) of `C` as `alpha*A*B + beta*C` or the other variants according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and `tB`. Return the updated `C`.

::: tip Julia 1.11

`gemmt!` requires at least Julia 1.11.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1520-L1529)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemmt-NTuple{6, Any}' href='#LinearAlgebra.BLAS.gemmt-NTuple{6, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemmt</u></b> &mdash; <i>Method</i>.




```julia
gemmt(uplo, tA, tB, alpha, A, B)
```


Return the lower or upper triangular part specified by [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) of `A*B` or the other three variants according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and `tB`.

::: tip Julia 1.11

`gemmt` requires at least Julia 1.11.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1582-L1589)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemmt-NTuple{5, Any}' href='#LinearAlgebra.BLAS.gemmt-NTuple{5, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemmt</u></b> &mdash; <i>Method</i>.




```julia
gemmt(uplo, tA, tB, A, B)
```


Return the lower or upper triangular part specified by [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) of `A*B` or the other three variants according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and `tB`.

::: tip Julia 1.11

`gemmt` requires at least Julia 1.11.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1592-L1599)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemm!' href='#LinearAlgebra.BLAS.gemm!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemm!</u></b> &mdash; <i>Function</i>.




```julia
gemm!(tA, tB, alpha, A, B, beta, C)
```


Update `C` as `alpha*A*B + beta*C` or the other three variants according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and `tB`. Return the updated `C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1602-L1607)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemm-NTuple{5, Any}' href='#LinearAlgebra.BLAS.gemm-NTuple{5, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemm</u></b> &mdash; <i>Method</i>.




```julia
gemm(tA, tB, alpha, A, B)
```


Return `alpha*A*B` or the other three variants according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and `tB`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1662-L1666)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.gemm-NTuple{4, Any}' href='#LinearAlgebra.BLAS.gemm-NTuple{4, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.gemm</u></b> &mdash; <i>Method</i>.




```julia
gemm(tA, tB, A, B)
```


Return `A*B` or the other three variants according to [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans) and `tB`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1669-L1673)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.symm!' href='#LinearAlgebra.BLAS.symm!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.symm!</u></b> &mdash; <i>Function</i>.




```julia
symm!(side, ul, alpha, A, B, beta, C)
```


Update `C` as `alpha*A*B + beta*C` or `alpha*B*A + beta*C` according to [`side`](/stdlib/LinearAlgebra#stdlib-blas-side). `A` is assumed to be symmetric. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. Return the updated `C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1760-L1766)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.symm-NTuple{5, Any}' href='#LinearAlgebra.BLAS.symm-NTuple{5, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.symm</u></b> &mdash; <i>Method</i>.




```julia
symm(side, ul, alpha, A, B)
```


Return `alpha*A*B` or `alpha*B*A` according to [`side`](/stdlib/LinearAlgebra#stdlib-blas-side). `A` is assumed to be symmetric. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1742-L1748)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.symm-NTuple{4, Any}' href='#LinearAlgebra.BLAS.symm-NTuple{4, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.symm</u></b> &mdash; <i>Method</i>.




```julia
symm(side, ul, A, B)
```


Return `A*B` or `B*A` according to [`side`](/stdlib/LinearAlgebra#stdlib-blas-side). `A` is assumed to be symmetric. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1751-L1757)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.hemm!' href='#LinearAlgebra.BLAS.hemm!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.hemm!</u></b> &mdash; <i>Function</i>.




```julia
hemm!(side, ul, alpha, A, B, beta, C)
```


Update `C` as `alpha*A*B + beta*C` or `alpha*B*A + beta*C` according to [`side`](/stdlib/LinearAlgebra#stdlib-blas-side). `A` is assumed to be Hermitian. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. Return the updated `C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1849-L1855)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.hemm-NTuple{5, Any}' href='#LinearAlgebra.BLAS.hemm-NTuple{5, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.hemm</u></b> &mdash; <i>Method</i>.




```julia
hemm(side, ul, alpha, A, B)
```


Return `alpha*A*B` or `alpha*B*A` according to [`side`](/stdlib/LinearAlgebra#stdlib-blas-side). `A` is assumed to be Hermitian. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1832-L1838)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.hemm-NTuple{4, Any}' href='#LinearAlgebra.BLAS.hemm-NTuple{4, Any}'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.hemm</u></b> &mdash; <i>Method</i>.




```julia
hemm(side, ul, A, B)
```


Return `A*B` or `B*A` according to [`side`](/stdlib/LinearAlgebra#stdlib-blas-side). `A` is assumed to be Hermitian. Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1841-L1846)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.syrk!' href='#LinearAlgebra.BLAS.syrk!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.syrk!</u></b> &mdash; <i>Function</i>.




```julia
syrk!(uplo, trans, alpha, A, beta, C)
```


Rank-k update of the symmetric matrix `C` as `alpha*A*transpose(A) + beta*C` or `alpha*transpose(A)*A + beta*C` according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `C` is used. Return `C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1860-L1866)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.syrk' href='#LinearAlgebra.BLAS.syrk'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.syrk</u></b> &mdash; <i>Function</i>.




```julia
syrk(uplo, trans, alpha, A)
```


Return either the upper triangle or the lower triangle of `A`, according to [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo), of `alpha*A*transpose(A)` or `alpha*transpose(A)*A`, according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1869-L1876)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.herk!' href='#LinearAlgebra.BLAS.herk!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.herk!</u></b> &mdash; <i>Function</i>.




```julia
herk!(uplo, trans, alpha, A, beta, C)
```


Methods for complex arrays only. Rank-k update of the Hermitian matrix `C` as `alpha*A*A' + beta*C` or `alpha*A'*A + beta*C` according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `C` is updated. Returns `C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1920-L1926)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.herk' href='#LinearAlgebra.BLAS.herk'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.herk</u></b> &mdash; <i>Function</i>.




```julia
herk(uplo, trans, alpha, A)
```


Methods for complex arrays only. Returns the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `alpha*A*A'` or `alpha*A'*A`, according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L1929-L1934)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.syr2k!' href='#LinearAlgebra.BLAS.syr2k!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.syr2k!</u></b> &mdash; <i>Function</i>.




```julia
syr2k!(uplo, trans, alpha, A, B, beta, C)
```


Rank-2k update of the symmetric matrix `C` as `alpha*A*transpose(B) + alpha*B*transpose(A) + beta*C` or `alpha*transpose(A)*B + alpha*transpose(B)*A + beta*C` according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `C` is used. Returns `C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2017-L2025)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.syr2k' href='#LinearAlgebra.BLAS.syr2k'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.syr2k</u></b> &mdash; <i>Function</i>.




```julia
syr2k(uplo, trans, alpha, A, B)
```


Returns the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `alpha*A*transpose(B) + alpha*B*transpose(A)` or `alpha*transpose(A)*B + alpha*transpose(B)*A`, according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2028-L2035)



```julia
syr2k(uplo, trans, A, B)
```


Return the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A*transpose(B) + B*transpose(A)` or `transpose(A)*B + transpose(B)*A`, according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2041-L2046)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.her2k!' href='#LinearAlgebra.BLAS.her2k!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.her2k!</u></b> &mdash; <i>Function</i>.




```julia
her2k!(uplo, trans, alpha, A, B, beta, C)
```


Rank-2k update of the Hermitian matrix `C` as `alpha*A*B' + alpha*B*A' + beta*C` or `alpha*A'*B + alpha*B'*A + beta*C` according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans). The scalar `beta` has to be real. Only the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `C` is used. Return `C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2091-L2098)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.her2k' href='#LinearAlgebra.BLAS.her2k'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.her2k</u></b> &mdash; <i>Function</i>.




```julia
her2k(uplo, trans, alpha, A, B)
```


Return the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `alpha*A*B' + alpha*B*A'` or `alpha*A'*B + alpha*B'*A`, according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2101-L2106)



```julia
her2k(uplo, trans, A, B)
```


Return the [`uplo`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A*B' + B*A'` or `A'*B + B'*A`, according to [`trans`](/stdlib/LinearAlgebra#stdlib-blas-trans).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2109-L2114)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trmm!' href='#LinearAlgebra.BLAS.trmm!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trmm!</u></b> &mdash; <i>Function</i>.




```julia
trmm!(side, ul, tA, dA, alpha, A, B)
```


Update `B` as `alpha*A*B` or one of the other three variants determined by [`side`](/stdlib/LinearAlgebra#stdlib-blas-side) and [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones. Return the updated `B`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2119-L2128)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trmm' href='#LinearAlgebra.BLAS.trmm'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trmm</u></b> &mdash; <i>Function</i>.




```julia
trmm(side, ul, tA, dA, alpha, A, B)
```


Return `alpha*A*B` or one of the other three variants determined by [`side`](/stdlib/LinearAlgebra#stdlib-blas-side) and [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2131-L2139)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trsm!' href='#LinearAlgebra.BLAS.trsm!'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trsm!</u></b> &mdash; <i>Function</i>.




```julia
trsm!(side, ul, tA, dA, alpha, A, B)
```


Overwrite `B` with the solution to `A*X = alpha*B` or one of the other three variants determined by [`side`](/stdlib/LinearAlgebra#stdlib-blas-side) and [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones. Returns the updated `B`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2142-L2151)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.BLAS.trsm' href='#LinearAlgebra.BLAS.trsm'>#</a>&nbsp;<b><u>LinearAlgebra.BLAS.trsm</u></b> &mdash; <i>Function</i>.




```julia
trsm(side, ul, tA, dA, alpha, A, B)
```


Return the solution to `A*X = alpha*B` or one of the other three variants determined by determined by [`side`](/stdlib/LinearAlgebra#stdlib-blas-side) and [`tA`](/stdlib/LinearAlgebra#stdlib-blas-trans). Only the [`ul`](/stdlib/LinearAlgebra#stdlib-blas-uplo) triangle of `A` is used. [`dA`](/stdlib/LinearAlgebra#stdlib-blas-diag) determines if the diagonal values are read or are assumed to be all ones.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/blas.jl#L2154-L2162)

</div>
<br>

## LAPACK functions {#man-linalg-lapack-functions}

`LinearAlgebra.LAPACK` provides wrappers for some of the LAPACK functions for linear algebra.  Those functions that overwrite one of the input arrays have names ending in `'!'`.

Usually a function has 4 methods defined, one each for [`Float64`](/base/numbers#Core.Float64), [`Float32`](/base/numbers#Core.Float32), `ComplexF64` and `ComplexF32` arrays.

Note that the LAPACK API provided by Julia can and will change in the future. Since this API is not user-facing, there is no commitment to support/deprecate this specific set of functions in future releases.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK' href='#LinearAlgebra.LAPACK'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK</u></b> &mdash; <i>Module</i>.




Interfaces to LAPACK subroutines.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L4-L6)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gbtrf!' href='#LinearAlgebra.LAPACK.gbtrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gbtrf!</u></b> &mdash; <i>Function</i>.




```julia
gbtrf!(kl, ku, m, AB) -> (AB, ipiv)
```


Compute the LU factorization of a banded matrix `AB`. `kl` is the first subdiagonal containing a nonzero band, `ku` is the last superdiagonal containing one, and `m` is the first dimension of the matrix `AB`. Returns the LU factorization in-place and `ipiv`, the vector of pivots used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L195-L202)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gbtrs!' href='#LinearAlgebra.LAPACK.gbtrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gbtrs!</u></b> &mdash; <i>Function</i>.




```julia
gbtrs!(trans, kl, ku, m, AB, ipiv, B)
```


Solve the equation `AB * X = B`. `trans` determines the orientation of `AB`. It may be `N` (no transpose), `T` (transpose), or `C` (conjugate transpose). `kl` is the first subdiagonal containing a nonzero band, `ku` is the last superdiagonal containing one, and `m` is the first dimension of the matrix `AB`. `ipiv` is the vector of pivots returned from `gbtrf!`. Returns the vector or matrix `X`, overwriting `B` in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L205-L213)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gebal!' href='#LinearAlgebra.LAPACK.gebal!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gebal!</u></b> &mdash; <i>Function</i>.




```julia
gebal!(job, A) -> (ilo, ihi, scale)
```


Balance the matrix `A` before computing its eigensystem or Schur factorization. `job` can be one of `N` (`A` will not be permuted or scaled), `P` (`A` will only be permuted), `S` (`A` will only be scaled), or `B` (`A` will be both permuted and scaled). Modifies `A` in-place and returns `ilo`, `ihi`, and `scale`. If permuting was turned on, `A[i,j] = 0` if `j > i` and `1 < j < ilo` or `j > ihi`. `scale` contains information about the scaling/permutations performed.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L275-L284)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gebak!' href='#LinearAlgebra.LAPACK.gebak!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gebak!</u></b> &mdash; <i>Function</i>.




```julia
gebak!(job, side, ilo, ihi, scale, V)
```


Transform the eigenvectors `V` of a matrix balanced using `gebal!` to the unscaled/unpermuted eigenvectors of the original matrix. Modifies `V` in-place. `side` can be `L` (left eigenvectors are transformed) or `R` (right eigenvectors are transformed).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L287-L294)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gebrd!' href='#LinearAlgebra.LAPACK.gebrd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gebrd!</u></b> &mdash; <i>Function</i>.




```julia
gebrd!(A) -> (A, d, e, tauq, taup)
```


Reduce `A` in-place to bidiagonal form `A = QBP'`. Returns `A`, containing the bidiagonal matrix `B`; `d`, containing the diagonal elements of `B`; `e`, containing the off-diagonal elements of `B`; `tauq`, containing the elementary reflectors representing `Q`; and `taup`, containing the elementary reflectors representing `P`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L593-L601)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gelqf!' href='#LinearAlgebra.LAPACK.gelqf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gelqf!</u></b> &mdash; <i>Function</i>.




```julia
gelqf!(A, tau)
```


Compute the `LQ` factorization of `A`, `A = LQ`. `tau` contains scalars which parameterize the elementary reflectors of the factorization. `tau` must have length greater than or equal to the smallest dimension of `A`.

Returns `A` and `tau` modified in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L604-L613)



```julia
gelqf!(A) -> (A, tau)
```


Compute the `LQ` factorization of `A`, `A = LQ`.

Returns `A`, modified in-place, and `tau`, which contains scalars which parameterize the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L712-L719)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.geqlf!' href='#LinearAlgebra.LAPACK.geqlf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.geqlf!</u></b> &mdash; <i>Function</i>.




```julia
geqlf!(A, tau)
```


Compute the `QL` factorization of `A`, `A = QL`. `tau` contains scalars which parameterize the elementary reflectors of the factorization. `tau` must have length greater than or equal to the smallest dimension of `A`.

Returns `A` and `tau` modified in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L616-L624)



```julia
geqlf!(A) -> (A, tau)
```


Compute the `QL` factorization of `A`, `A = QL`.

Returns `A`, modified in-place, and `tau`, which contains scalars which parameterize the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L722-L729)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.geqrf!' href='#LinearAlgebra.LAPACK.geqrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.geqrf!</u></b> &mdash; <i>Function</i>.




```julia
geqrf!(A, tau)
```


Compute the `QR` factorization of `A`, `A = QR`. `tau` contains scalars which parameterize the elementary reflectors of the factorization. `tau` must have length greater than or equal to the smallest dimension of `A`.

Returns `A` and `tau` modified in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L681-L689)



```julia
geqrf!(A) -> (A, tau)
```


Compute the `QR` factorization of `A`, `A = QR`.

Returns `A`, modified in-place, and `tau`, which contains scalars which parameterize the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L754-L761)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.geqp3!' href='#LinearAlgebra.LAPACK.geqp3!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.geqp3!</u></b> &mdash; <i>Function</i>.




```julia
geqp3!(A, [jpvt, tau]) -> (A, tau, jpvt)
```


Compute the pivoted `QR` factorization of `A`, `AP = QR` using BLAS level 3. `P` is a pivoting matrix, represented by `jpvt`. `tau` stores the elementary reflectors. The arguments `jpvt` and `tau` are optional and allow for passing preallocated arrays. When passed, `jpvt` must have length greater than or equal to `n` if `A` is an `(m x n)` matrix and `tau` must have length greater than or equal to the smallest dimension of `A`. On entry, if `jpvt[j]` does not equal zero then the `j`th column of `A` is permuted to the front of `AP`.

`A`, `jpvt`, and `tau` are modified in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L627-L640)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gerqf!' href='#LinearAlgebra.LAPACK.gerqf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gerqf!</u></b> &mdash; <i>Function</i>.




```julia
gerqf!(A, tau)
```


Compute the `RQ` factorization of `A`, `A = RQ`. `tau` contains scalars which parameterize the elementary reflectors of the factorization. `tau` must have length greater than or equal to the smallest dimension of `A`.

Returns `A` and `tau` modified in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L692-L700)



```julia
gerqf!(A) -> (A, tau)
```


Compute the `RQ` factorization of `A`, `A = RQ`.

Returns `A`, modified in-place, and `tau`, which contains scalars which parameterize the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L764-L771)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.geqrt!' href='#LinearAlgebra.LAPACK.geqrt!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.geqrt!</u></b> &mdash; <i>Function</i>.




```julia
geqrt!(A, T)
```


Compute the blocked `QR` factorization of `A`, `A = QR`. `T` contains upper triangular block reflectors which parameterize the elementary reflectors of the factorization. The first dimension of `T` sets the block size and it must be between 1 and `n`. The second dimension of `T` must equal the smallest dimension of `A`.

Returns `A` and `T` modified in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L655-L665)



```julia
geqrt!(A, nb) -> (A, T)
```


Compute the blocked `QR` factorization of `A`, `A = QR`. `nb` sets the block size and it must be between 1 and `n`, the second dimension of `A`.

Returns `A`, modified in-place, and `T`, which contains upper triangular block reflectors which parameterize the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L732-L741)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.geqrt3!' href='#LinearAlgebra.LAPACK.geqrt3!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.geqrt3!</u></b> &mdash; <i>Function</i>.




```julia
geqrt3!(A, T)
```


Recursively computes the blocked `QR` factorization of `A`, `A = QR`. `T` contains upper triangular block reflectors which parameterize the elementary reflectors of the factorization.  The first dimension of `T` sets the block size and it must be between 1 and `n`. The second dimension of `T` must equal the smallest dimension of `A`.

Returns `A` and `T` modified in-place.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L668-L678)



```julia
geqrt3!(A) -> (A, T)
```


Recursively computes the blocked `QR` factorization of `A`, `A = QR`.

Returns `A`, modified in-place, and `T`, which contains upper triangular block reflectors which parameterize the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L744-L751)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.getrf!' href='#LinearAlgebra.LAPACK.getrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.getrf!</u></b> &mdash; <i>Function</i>.




```julia
getrf!(A, ipiv) -> (A, ipiv, info)
```


Compute the pivoted `LU` factorization of `A`, `A = LU`. `ipiv` contains the pivoting information and `info` a code which indicates success (`info = 0`), a singular value in `U` (`info = i`, in which case `U[i,i]` is singular), or an error code (`info < 0`).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L703-L709)



```julia
getrf!(A) -> (A, ipiv, info)
```


Compute the pivoted `LU` factorization of `A`, `A = LU`.

Returns `A`, modified in-place, `ipiv`, the pivoting information, and an `info` code which indicates success (`info = 0`), a singular value in `U` (`info = i`, in which case `U[i,i]` is singular), or an error code (`info < 0`).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L774-L782)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.tzrzf!' href='#LinearAlgebra.LAPACK.tzrzf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.tzrzf!</u></b> &mdash; <i>Function</i>.




```julia
tzrzf!(A) -> (A, tau)
```


Transforms the upper trapezoidal matrix `A` to upper triangular form in-place. Returns `A` and `tau`, the scalar parameters for the elementary reflectors of the transformation.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L950-L956)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ormrz!' href='#LinearAlgebra.LAPACK.ormrz!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ormrz!</u></b> &mdash; <i>Function</i>.




```julia
ormrz!(side, trans, A, tau, C)
```


Multiplies the matrix `C` by `Q` from the transformation supplied by `tzrzf!`. Depending on `side` or `trans` the multiplication can be left-sided (`side = L, Q*C`) or right-sided (`side = R, C*Q`) and `Q` can be unmodified (`trans = N`), transposed (`trans = T`), or conjugate transposed (`trans = C`). Returns matrix `C` which is modified in-place with the result of the multiplication.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L938-L947)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gels!' href='#LinearAlgebra.LAPACK.gels!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gels!</u></b> &mdash; <i>Function</i>.




```julia
gels!(trans, A, B) -> (F, B, ssr)
```


Solves the linear equation `A * X = B`, `transpose(A) * X = B`, or `adjoint(A) * X = B` using a QR or LQ factorization. Modifies the matrix/vector `B` in place with the solution. `A` is overwritten with its `QR` or `LQ` factorization. `trans` may be one of `N` (no modification), `T` (transpose), or `C` (conjugate transpose). `gels!` searches for the minimum norm/least squares solution. `A` may be under or over determined. The solution is returned in `B`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1093-L1102)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gesv!' href='#LinearAlgebra.LAPACK.gesv!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gesv!</u></b> &mdash; <i>Function</i>.




```julia
gesv!(A, B) -> (B, A, ipiv)
```


Solves the linear equation `A * X = B` where `A` is a square matrix using the `LU` factorization of `A`. `A` is overwritten with its `LU` factorization and `B` is overwritten with the solution `X`. `ipiv` contains the pivoting information for the `LU` factorization of `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1105-L1112)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.getrs!' href='#LinearAlgebra.LAPACK.getrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.getrs!</u></b> &mdash; <i>Function</i>.




```julia
getrs!(trans, A, ipiv, B)
```


Solves the linear equation `A * X = B`, `transpose(A) * X = B`, or `adjoint(A) * X = B` for square `A`. Modifies the matrix/vector `B` in place with the solution. `A` is the `LU` factorization from `getrf!`, with `ipiv` the pivoting information. `trans` may be one of `N` (no modification), `T` (transpose), or `C` (conjugate transpose).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1115-L1123)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.getri!' href='#LinearAlgebra.LAPACK.getri!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.getri!</u></b> &mdash; <i>Function</i>.




```julia
getri!(A, ipiv)
```


Computes the inverse of `A`, using its `LU` factorization found by `getrf!`. `ipiv` is the pivot information output and `A` contains the `LU` factorization of `getrf!`. `A` is overwritten with its inverse.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1126-L1133)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gesvx!' href='#LinearAlgebra.LAPACK.gesvx!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gesvx!</u></b> &mdash; <i>Function</i>.




```julia
gesvx!(fact, trans, A, AF, ipiv, equed, R, C, B) -> (X, equed, R, C, B, rcond, ferr, berr, work)
```


Solves the linear equation `A * X = B` (`trans = N`), `transpose(A) * X = B` (`trans = T`), or `adjoint(A) * X = B` (`trans = C`) using the `LU` factorization of `A`. `fact` may be `E`, in which case `A` will be equilibrated and copied to `AF`; `F`, in which case `AF` and `ipiv` from a previous `LU` factorization are inputs; or `N`, in which case `A` will be copied to `AF` and then factored. If `fact = F`, `equed` may be `N`, meaning `A` has not been equilibrated; `R`, meaning `A` was multiplied by `Diagonal(R)` from the left; `C`, meaning `A` was multiplied by `Diagonal(C)` from the right; or `B`, meaning `A` was multiplied by `Diagonal(R)` from the left and `Diagonal(C)` from the right. If `fact = F` and `equed = R` or `B` the elements of `R` must all be positive. If `fact = F` and `equed = C` or `B` the elements of `C` must all be positive.

Returns the solution `X`; `equed`, which is an output if `fact` is not `N`, and describes the equilibration that was performed; `R`, the row equilibration diagonal; `C`, the column equilibration diagonal; `B`, which may be overwritten with its equilibrated form `Diagonal(R)*B` (if `trans = N` and `equed = R,B`) or `Diagonal(C)*B` (if `trans = T,C` and `equed = C,B`); `rcond`, the reciprocal condition number of `A` after equilbrating; `ferr`, the forward error bound for each solution vector in `X`; `berr`, the forward error bound for each solution vector in `X`; and `work`, the reciprocal pivot growth factor.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1282-L1305)



```julia
gesvx!(A, B)
```


The no-equilibration, no-transpose simplification of `gesvx!`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1309-L1313)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gelsd!' href='#LinearAlgebra.LAPACK.gelsd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gelsd!</u></b> &mdash; <i>Function</i>.




```julia
gelsd!(A, B, rcond) -> (B, rnk)
```


Computes the least norm solution of `A * X = B` by finding the `SVD` factorization of `A`, then dividing-and-conquering the problem. `B` is overwritten with the solution `X`. Singular values below `rcond` will be treated as zero. Returns the solution in `B` and the effective rank of `A` in `rnk`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1508-L1516)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gelsy!' href='#LinearAlgebra.LAPACK.gelsy!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gelsy!</u></b> &mdash; <i>Function</i>.




```julia
gelsy!(A, B, rcond) -> (B, rnk)
```


Computes the least norm solution of `A * X = B` by finding the full `QR` factorization of `A`, then dividing-and-conquering the problem. `B` is overwritten with the solution `X`. Singular values below `rcond` will be treated as zero. Returns the solution in `B` and the effective rank of `A` in `rnk`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1519-L1527)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gglse!' href='#LinearAlgebra.LAPACK.gglse!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gglse!</u></b> &mdash; <i>Function</i>.




```julia
gglse!(A, c, B, d) -> (X,res)
```


Solves the equation `A * x = c` where `x` is subject to the equality constraint `B * x = d`. Uses the formula `||c - A*x||^2 = 0` to solve. Returns `X` and the residual sum-of-squares.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1581-L1587)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.geev!' href='#LinearAlgebra.LAPACK.geev!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.geev!</u></b> &mdash; <i>Function</i>.




```julia
geev!(jobvl, jobvr, A) -> (W, VL, VR)
```


Finds the eigensystem of `A`. If `jobvl = N`, the left eigenvectors of `A` aren&#39;t computed. If `jobvr = N`, the right eigenvectors of `A` aren&#39;t computed. If `jobvl = V` or `jobvr = V`, the corresponding eigenvectors are computed. Returns the eigenvalues in `W`, the right eigenvectors in `VR`, and the left eigenvectors in `VL`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1892-L1900)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gesdd!' href='#LinearAlgebra.LAPACK.gesdd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gesdd!</u></b> &mdash; <i>Function</i>.




```julia
gesdd!(job, A) -> (U, S, VT)
```


Finds the singular value decomposition of `A`, `A = U * S * V'`, using a divide and conquer approach. If `job = A`, all the columns of `U` and the rows of `V'` are computed. If `job = N`, no columns of `U` or rows of `V'` are computed. If `job = O`, `A` is overwritten with the columns of (thin) `U` and the rows of (thin) `V'`. If `job = S`, the columns of (thin) `U` and the rows of (thin) `V'` are computed and returned separately.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1903-L1912)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gesvd!' href='#LinearAlgebra.LAPACK.gesvd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gesvd!</u></b> &mdash; <i>Function</i>.




```julia
gesvd!(jobu, jobvt, A) -> (U, S, VT)
```


Finds the singular value decomposition of `A`, `A = U * S * V'`. If `jobu = A`, all the columns of `U` are computed. If `jobvt = A` all the rows of `V'` are computed. If `jobu = N`, no columns of `U` are computed. If `jobvt = N` no rows of `V'` are computed. If `jobu = O`, `A` is overwritten with the columns of (thin) `U`. If `jobvt = O`, `A` is overwritten with the rows of (thin) `V'`. If `jobu = S`, the columns of (thin) `U` are computed and returned separately. If `jobvt = S` the rows of (thin) `V'` are computed and returned separately. `jobu` and `jobvt` can&#39;t both be `O`.

Returns `U`, `S`, and `Vt`, where `S` are the singular values of `A`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1915-L1928)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ggsvd!' href='#LinearAlgebra.LAPACK.ggsvd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ggsvd!</u></b> &mdash; <i>Function</i>.




```julia
ggsvd!(jobu, jobv, jobq, A, B) -> (U, V, Q, alpha, beta, k, l, R)
```


Finds the generalized singular value decomposition of `A` and `B`, `U'*A*Q = D1*R` and `V'*B*Q = D2*R`. `D1` has `alpha` on its diagonal and `D2` has `beta` on its diagonal. If `jobu = U`, the orthogonal/unitary matrix `U` is computed. If `jobv = V` the orthogonal/unitary matrix `V` is computed. If `jobq = Q`, the orthogonal/unitary matrix `Q` is computed. If `jobu`, `jobv` or `jobq` is `N`, that matrix is not computed. This function is only available in LAPACK versions prior to 3.6.0.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L1931-L1941)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ggsvd3!' href='#LinearAlgebra.LAPACK.ggsvd3!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ggsvd3!</u></b> &mdash; <i>Function</i>.




```julia
ggsvd3!(jobu, jobv, jobq, A, B) -> (U, V, Q, alpha, beta, k, l, R)
```


Finds the generalized singular value decomposition of `A` and `B`, `U'*A*Q = D1*R` and `V'*B*Q = D2*R`. `D1` has `alpha` on its diagonal and `D2` has `beta` on its diagonal. If `jobu = U`, the orthogonal/unitary matrix `U` is computed. If `jobv = V` the orthogonal/unitary matrix `V` is computed. If `jobq = Q`, the orthogonal/unitary matrix `Q` is computed. If `jobu`, `jobv`, or `jobq` is `N`, that matrix is not computed. This function requires LAPACK 3.6.0.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L2070-L2079)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.geevx!' href='#LinearAlgebra.LAPACK.geevx!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.geevx!</u></b> &mdash; <i>Function</i>.




```julia
geevx!(balanc, jobvl, jobvr, sense, A) -> (A, w, VL, VR, ilo, ihi, scale, abnrm, rconde, rcondv)
```


Finds the eigensystem of `A` with matrix balancing. If `jobvl = N`, the left eigenvectors of `A` aren&#39;t computed. If `jobvr = N`, the right eigenvectors of `A` aren&#39;t computed. If `jobvl = V` or `jobvr = V`, the corresponding eigenvectors are computed. If `balanc = N`, no balancing is performed. If `balanc = P`, `A` is permuted but not scaled. If `balanc = S`, `A` is scaled but not permuted. If `balanc = B`, `A` is permuted and scaled. If `sense = N`, no reciprocal condition numbers are computed. If `sense = E`, reciprocal condition numbers are computed for the eigenvalues only. If `sense = V`, reciprocal condition numbers are computed for the right eigenvectors only. If `sense = B`, reciprocal condition numbers are computed for the right eigenvectors and the eigenvectors. If `sense = E,B`, the right and left eigenvectors must be computed.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L2520-L2536)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ggev!' href='#LinearAlgebra.LAPACK.ggev!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ggev!</u></b> &mdash; <i>Function</i>.




```julia
ggev!(jobvl, jobvr, A, B) -> (alpha, beta, vl, vr)
```


Finds the generalized eigendecomposition of `A` and `B`. If `jobvl = N`, the left eigenvectors aren&#39;t computed. If `jobvr = N`, the right eigenvectors aren&#39;t computed. If `jobvl = V` or `jobvr = V`, the corresponding eigenvectors are computed.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L2539-L2546)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ggev3!' href='#LinearAlgebra.LAPACK.ggev3!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ggev3!</u></b> &mdash; <i>Function</i>.




```julia
ggev3!(jobvl, jobvr, A, B) -> (alpha, beta, vl, vr)
```


Finds the generalized eigendecomposition of `A` and `B` using a blocked algorithm. If `jobvl = N`, the left eigenvectors aren&#39;t computed. If `jobvr = N`, the right eigenvectors aren&#39;t computed. If `jobvl = V` or `jobvr = V`, the corresponding eigenvectors are computed.  This function requires LAPACK 3.6.0.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L2549-L2557)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gtsv!' href='#LinearAlgebra.LAPACK.gtsv!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gtsv!</u></b> &mdash; <i>Function</i>.




```julia
gtsv!(dl, d, du, B)
```


Solves the equation `A * X = B` where `A` is a tridiagonal matrix with `dl` on the subdiagonal, `d` on the diagonal, and `du` on the superdiagonal.

Overwrites `B` with the solution `X` and returns it.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L2731-L2739)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gttrf!' href='#LinearAlgebra.LAPACK.gttrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gttrf!</u></b> &mdash; <i>Function</i>.




```julia
gttrf!(dl, d, du) -> (dl, d, du, du2, ipiv)
```


Finds the `LU` factorization of a tridiagonal matrix with `dl` on the subdiagonal, `d` on the diagonal, and `du` on the superdiagonal.

Modifies `dl`, `d`, and `du` in-place and returns them and the second superdiagonal `du2` and the pivoting vector `ipiv`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L2742-L2750)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gttrs!' href='#LinearAlgebra.LAPACK.gttrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gttrs!</u></b> &mdash; <i>Function</i>.




```julia
gttrs!(trans, dl, d, du, du2, ipiv, B)
```


Solves the equation `A * X = B` (`trans = N`), `transpose(A) * X = B` (`trans = T`), or `adjoint(A) * X = B` (`trans = C`) using the `LU` factorization computed by `gttrf!`. `B` is overwritten with the solution `X`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L2753-L2759)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.orglq!' href='#LinearAlgebra.LAPACK.orglq!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.orglq!</u></b> &mdash; <i>Function</i>.




```julia
orglq!(A, tau, k = length(tau))
```


Explicitly finds the matrix `Q` of a `LQ` factorization after calling `gelqf!` on `A`. Uses the output of `gelqf!`. `A` is overwritten by `Q`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3160-L3165)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.orgqr!' href='#LinearAlgebra.LAPACK.orgqr!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.orgqr!</u></b> &mdash; <i>Function</i>.




```julia
orgqr!(A, tau, k = length(tau))
```


Explicitly finds the matrix `Q` of a `QR` factorization after calling `geqrf!` on `A`. Uses the output of `geqrf!`. `A` is overwritten by `Q`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3168-L3173)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.orgql!' href='#LinearAlgebra.LAPACK.orgql!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.orgql!</u></b> &mdash; <i>Function</i>.




```julia
orgql!(A, tau, k = length(tau))
```


Explicitly finds the matrix `Q` of a `QL` factorization after calling `geqlf!` on `A`. Uses the output of `geqlf!`. `A` is overwritten by `Q`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3176-L3181)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.orgrq!' href='#LinearAlgebra.LAPACK.orgrq!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.orgrq!</u></b> &mdash; <i>Function</i>.




```julia
orgrq!(A, tau, k = length(tau))
```


Explicitly finds the matrix `Q` of a `RQ` factorization after calling `gerqf!` on `A`. Uses the output of `gerqf!`. `A` is overwritten by `Q`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3184-L3189)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ormlq!' href='#LinearAlgebra.LAPACK.ormlq!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ormlq!</u></b> &mdash; <i>Function</i>.




```julia
ormlq!(side, trans, A, tau, C)
```


Computes `Q * C` (`trans = N`), `transpose(Q) * C` (`trans = T`), `adjoint(Q) * C` (`trans = C`) for `side = L` or the equivalent right-sided multiplication for `side = R` using `Q` from a `LQ` factorization of `A` computed using `gelqf!`. `C` is overwritten.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3192-L3199)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ormqr!' href='#LinearAlgebra.LAPACK.ormqr!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ormqr!</u></b> &mdash; <i>Function</i>.




```julia
ormqr!(side, trans, A, tau, C)
```


Computes `Q * C` (`trans = N`), `transpose(Q) * C` (`trans = T`), `adjoint(Q) * C` (`trans = C`) for `side = L` or the equivalent right-sided multiplication for `side = R` using `Q` from a `QR` factorization of `A` computed using `geqrf!`. `C` is overwritten.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3202-L3209)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ormql!' href='#LinearAlgebra.LAPACK.ormql!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ormql!</u></b> &mdash; <i>Function</i>.




```julia
ormql!(side, trans, A, tau, C)
```


Computes `Q * C` (`trans = N`), `transpose(Q) * C` (`trans = T`), `adjoint(Q) * C` (`trans = C`) for `side = L` or the equivalent right-sided multiplication for `side = R` using `Q` from a `QL` factorization of `A` computed using `geqlf!`. `C` is overwritten.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3212-L3219)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ormrq!' href='#LinearAlgebra.LAPACK.ormrq!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ormrq!</u></b> &mdash; <i>Function</i>.




```julia
ormrq!(side, trans, A, tau, C)
```


Computes `Q * C` (`trans = N`), `transpose(Q) * C` (`trans = T`), `adjoint(Q) * C` (`trans = C`) for `side = L` or the equivalent right-sided multiplication for `side = R` using `Q` from a `RQ` factorization of `A` computed using `gerqf!`. `C` is overwritten.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3222-L3229)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gemqrt!' href='#LinearAlgebra.LAPACK.gemqrt!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gemqrt!</u></b> &mdash; <i>Function</i>.




```julia
gemqrt!(side, trans, V, T, C)
```


Computes `Q * C` (`trans = N`), `transpose(Q) * C` (`trans = T`), `adjoint(Q) * C` (`trans = C`) for `side = L` or the equivalent right-sided multiplication for `side = R` using `Q` from a `QR` factorization of `A` computed using `geqrt!`. `C` is overwritten.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3232-L3239)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.posv!' href='#LinearAlgebra.LAPACK.posv!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.posv!</u></b> &mdash; <i>Function</i>.




```julia
posv!(uplo, A, B) -> (A, B)
```


Finds the solution to `A * X = B` where `A` is a symmetric or Hermitian positive definite matrix. If `uplo = U` the upper Cholesky decomposition of `A` is computed. If `uplo = L` the lower Cholesky decomposition of `A` is computed. `A` is overwritten by its Cholesky decomposition. `B` is overwritten with the solution `X`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3375-L3383)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.potrf!' href='#LinearAlgebra.LAPACK.potrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.potrf!</u></b> &mdash; <i>Function</i>.




```julia
potrf!(uplo, A)
```


Computes the Cholesky (upper if `uplo = U`, lower if `uplo = L`) decomposition of positive-definite matrix `A`. `A` is overwritten and returned with an info code.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3386-L3392)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.potri!' href='#LinearAlgebra.LAPACK.potri!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.potri!</u></b> &mdash; <i>Function</i>.




```julia
potri!(uplo, A)
```


Computes the inverse of positive-definite matrix `A` after calling `potrf!` to find its (upper if `uplo = U`, lower if `uplo = L`) Cholesky decomposition.

`A` is overwritten by its inverse and returned.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3395-L3403)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.potrs!' href='#LinearAlgebra.LAPACK.potrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.potrs!</u></b> &mdash; <i>Function</i>.




```julia
potrs!(uplo, A, B)
```


Finds the solution to `A * X = B` where `A` is a symmetric or Hermitian positive definite matrix whose Cholesky decomposition was computed by `potrf!`. If `uplo = U` the upper Cholesky decomposition of `A` was computed. If `uplo = L` the lower Cholesky decomposition of `A` was computed. `B` is overwritten with the solution `X`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3406-L3414)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.pstrf!' href='#LinearAlgebra.LAPACK.pstrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.pstrf!</u></b> &mdash; <i>Function</i>.




```julia
pstrf!(uplo, A, tol) -> (A, piv, rank, info)
```


Computes the (upper if `uplo = U`, lower if `uplo = L`) pivoted Cholesky decomposition of positive-definite matrix `A` with a user-set tolerance `tol`. `A` is overwritten by its Cholesky decomposition.

Returns `A`, the pivots `piv`, the rank of `A`, and an `info` code. If `info = 0`, the factorization succeeded. If `info = i > 0`, then `A` is indefinite or rank-deficient.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3417-L3427)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.ptsv!' href='#LinearAlgebra.LAPACK.ptsv!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.ptsv!</u></b> &mdash; <i>Function</i>.




```julia
ptsv!(D, E, B)
```


Solves `A * X = B` for positive-definite tridiagonal `A`. `D` is the diagonal of `A` and `E` is the off-diagonal. `B` is overwritten with the solution `X` and returned.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3484-L3490)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.pttrf!' href='#LinearAlgebra.LAPACK.pttrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.pttrf!</u></b> &mdash; <i>Function</i>.




```julia
pttrf!(D, E)
```


Computes the LDLt factorization of a positive-definite tridiagonal matrix with `D` as diagonal and `E` as off-diagonal. `D` and `E` are overwritten and returned.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3493-L3499)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.pttrs!' href='#LinearAlgebra.LAPACK.pttrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.pttrs!</u></b> &mdash; <i>Function</i>.




```julia
pttrs!(D, E, B)
```


Solves `A * X = B` for positive-definite tridiagonal `A` with diagonal `D` and off-diagonal `E` after computing `A`&#39;s LDLt factorization using `pttrf!`. `B` is overwritten with the solution `X`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3566-L3572)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trtri!' href='#LinearAlgebra.LAPACK.trtri!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trtri!</u></b> &mdash; <i>Function</i>.




```julia
trtri!(uplo, diag, A)
```


Finds the inverse of (upper if `uplo = U`, lower if `uplo = L`) triangular matrix `A`. If `diag = N`, `A` has non-unit diagonal elements. If `diag = U`, all diagonal elements of `A` are one. `A` is overwritten with its inverse.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3636-L3643)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trtrs!' href='#LinearAlgebra.LAPACK.trtrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trtrs!</u></b> &mdash; <i>Function</i>.




```julia
trtrs!(uplo, trans, diag, A, B)
```


Solves `A * X = B` (`trans = N`), `transpose(A) * X = B` (`trans = T`), or `adjoint(A) * X = B` (`trans = C`) for (upper if `uplo = U`, lower if `uplo = L`) triangular matrix `A`. If `diag = N`, `A` has non-unit diagonal elements. If `diag = U`, all diagonal elements of `A` are one. `B` is overwritten with the solution `X`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3646-L3654)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trcon!' href='#LinearAlgebra.LAPACK.trcon!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trcon!</u></b> &mdash; <i>Function</i>.




```julia
trcon!(norm, uplo, diag, A)
```


Finds the reciprocal condition number of (upper if `uplo = U`, lower if `uplo = L`) triangular matrix `A`. If `diag = N`, `A` has non-unit diagonal elements. If `diag = U`, all diagonal elements of `A` are one. If `norm = I`, the condition number is found in the infinity norm. If `norm = O` or `1`, the condition number is found in the one norm.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3931-L3939)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trevc!' href='#LinearAlgebra.LAPACK.trevc!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trevc!</u></b> &mdash; <i>Function</i>.




```julia
trevc!(side, howmny, select, T, VL = similar(T), VR = similar(T))
```


Finds the eigensystem of an upper triangular matrix `T`. If `side = R`, the right eigenvectors are computed. If `side = L`, the left eigenvectors are computed. If `side = B`, both sets are computed. If `howmny = A`, all eigenvectors are found. If `howmny = B`, all eigenvectors are found and backtransformed using `VL` and `VR`. If `howmny = S`, only the eigenvectors corresponding to the values in `select` are computed.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3942-L3952)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trrfs!' href='#LinearAlgebra.LAPACK.trrfs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trrfs!</u></b> &mdash; <i>Function</i>.




```julia
trrfs!(uplo, trans, diag, A, B, X, Ferr, Berr) -> (Ferr, Berr)
```


Estimates the error in the solution to `A * X = B` (`trans = N`), `transpose(A) * X = B` (`trans = T`), `adjoint(A) * X = B` (`trans = C`) for `side = L`, or the equivalent equations a right-handed `side = R` `X * A` after computing `X` using `trtrs!`. If `uplo = U`, `A` is upper triangular. If `uplo = L`, `A` is lower triangular. If `diag = N`, `A` has non-unit diagonal elements. If `diag = U`, all diagonal elements of `A` are one. `Ferr` and `Berr` are optional inputs. `Ferr` is the forward error and `Berr` is the backward error, each component-wise.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L3956-L3967)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.stev!' href='#LinearAlgebra.LAPACK.stev!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.stev!</u></b> &mdash; <i>Function</i>.




```julia
stev!(job, dv, ev) -> (dv, Zmat)
```


Computes the eigensystem for a symmetric tridiagonal matrix with `dv` as diagonal and `ev` as off-diagonal. If `job = N` only the eigenvalues are found and returned in `dv`. If `job = V` then the eigenvectors are also found and returned in `Zmat`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L4150-L4157)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.stebz!' href='#LinearAlgebra.LAPACK.stebz!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.stebz!</u></b> &mdash; <i>Function</i>.




```julia
stebz!(range, order, vl, vu, il, iu, abstol, dv, ev) -> (dv, iblock, isplit)
```


Computes the eigenvalues for a symmetric tridiagonal matrix with `dv` as diagonal and `ev` as off-diagonal. If `range = A`, all the eigenvalues are found. If `range = V`, the eigenvalues in the half-open interval `(vl, vu]` are found. If `range = I`, the eigenvalues with indices between `il` and `iu` are found. If `order = B`, eigvalues are ordered within a block. If `order = E`, they are ordered across all the blocks. `abstol` can be set as a tolerance for convergence.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L4160-L4170)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.stegr!' href='#LinearAlgebra.LAPACK.stegr!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.stegr!</u></b> &mdash; <i>Function</i>.




```julia
stegr!(jobz, range, dv, ev, vl, vu, il, iu) -> (w, Z)
```


Computes the eigenvalues (`jobz = N`) or eigenvalues and eigenvectors (`jobz = V`) for a symmetric tridiagonal matrix with `dv` as diagonal and `ev` as off-diagonal. If `range = A`, all the eigenvalues are found. If `range = V`, the eigenvalues in the half-open interval `(vl, vu]` are found. If `range = I`, the eigenvalues with indices between `il` and `iu` are found. The eigenvalues are returned in `w` and the eigenvectors in `Z`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L4173-L4183)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.stein!' href='#LinearAlgebra.LAPACK.stein!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.stein!</u></b> &mdash; <i>Function</i>.




```julia
stein!(dv, ev_in, w_in, iblock_in, isplit_in)
```


Computes the eigenvectors for a symmetric tridiagonal matrix with `dv` as diagonal and `ev_in` as off-diagonal. `w_in` specifies the input eigenvalues for which to find corresponding eigenvectors. `iblock_in` specifies the submatrices corresponding to the eigenvalues in `w_in`. `isplit_in` specifies the splitting points between the submatrix blocks.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L4186-L4194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.syconv!' href='#LinearAlgebra.LAPACK.syconv!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.syconv!</u></b> &mdash; <i>Function</i>.




```julia
syconv!(uplo, A, ipiv) -> (A, work)
```


Converts a symmetric matrix `A` (which has been factorized into a triangular matrix) into two matrices `L` and `D`. If `uplo = U`, `A` is upper triangular. If `uplo = L`, it is lower triangular. `ipiv` is the pivot vector from the triangular factorization. `A` is overwritten by `L` and `D`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5189-L5197)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.sysv!' href='#LinearAlgebra.LAPACK.sysv!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.sysv!</u></b> &mdash; <i>Function</i>.




```julia
sysv!(uplo, A, B) -> (B, A, ipiv)
```


Finds the solution to `A * X = B` for symmetric matrix `A`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored. `B` is overwritten by the solution `X`. `A` is overwritten by its Bunch-Kaufman factorization. `ipiv` contains pivoting information about the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5200-L5208)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.sytrf!' href='#LinearAlgebra.LAPACK.sytrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.sytrf!</u></b> &mdash; <i>Function</i>.




```julia
sytrf!(uplo, A) -> (A, ipiv, info)
```


Computes the Bunch-Kaufman factorization of a symmetric matrix `A`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored.

Returns `A`, overwritten by the factorization, a pivot vector `ipiv`, and the error code `info` which is a non-negative integer. If `info` is positive the matrix is singular and the diagonal part of the factorization is exactly zero at position `info`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5211-L5222)



```julia
sytrf!(uplo, A, ipiv) -> (A, ipiv, info)
```


Computes the Bunch-Kaufman factorization of a symmetric matrix `A`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored.

Returns `A`, overwritten by the factorization, the pivot vector `ipiv`, and the error code `info` which is a non-negative integer. If `info` is positive the matrix is singular and the diagonal part of the factorization is exactly zero at position `info`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5225-L5236)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.sytri!' href='#LinearAlgebra.LAPACK.sytri!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.sytri!</u></b> &mdash; <i>Function</i>.




```julia
sytri!(uplo, A, ipiv)
```


Computes the inverse of a symmetric matrix `A` using the results of `sytrf!`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored. `A` is overwritten by its inverse.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5239-L5245)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.sytrs!' href='#LinearAlgebra.LAPACK.sytrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.sytrs!</u></b> &mdash; <i>Function</i>.




```julia
sytrs!(uplo, A, ipiv, B)
```


Solves the equation `A * X = B` for a symmetric matrix `A` using the results of `sytrf!`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored. `B` is overwritten by the solution `X`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5248-L5255)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.hesv!' href='#LinearAlgebra.LAPACK.hesv!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.hesv!</u></b> &mdash; <i>Function</i>.




```julia
hesv!(uplo, A, B) -> (B, A, ipiv)
```


Finds the solution to `A * X = B` for Hermitian matrix `A`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored. `B` is overwritten by the solution `X`. `A` is overwritten by its Bunch-Kaufman factorization. `ipiv` contains pivoting information about the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5259-L5267)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.hetrf!' href='#LinearAlgebra.LAPACK.hetrf!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.hetrf!</u></b> &mdash; <i>Function</i>.




```julia
hetrf!(uplo, A) -> (A, ipiv, info)
```


Computes the Bunch-Kaufman factorization of a Hermitian matrix `A`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored.

Returns `A`, overwritten by the factorization, a pivot vector `ipiv`, and the error code `info` which is a non-negative integer. If `info` is positive the matrix is singular and the diagonal part of the factorization is exactly zero at position `info`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5270-L5281)



```julia
hetrf!(uplo, A, ipiv) -> (A, ipiv, info)
```


Computes the Bunch-Kaufman factorization of a Hermitian matrix `A`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored.

Returns `A`, overwritten by the factorization, the pivot vector `ipiv`, and the error code `info` which is a non-negative integer. If `info` is positive the matrix is singular and the diagonal part of the factorization is exactly zero at position `info`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5284-L5295)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.hetri!' href='#LinearAlgebra.LAPACK.hetri!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.hetri!</u></b> &mdash; <i>Function</i>.




```julia
hetri!(uplo, A, ipiv)
```


Computes the inverse of a Hermitian matrix `A` using the results of `sytrf!`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored. `A` is overwritten by its inverse.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5298-L5304)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.hetrs!' href='#LinearAlgebra.LAPACK.hetrs!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.hetrs!</u></b> &mdash; <i>Function</i>.




```julia
hetrs!(uplo, A, ipiv, B)
```


Solves the equation `A * X = B` for a Hermitian matrix `A` using the results of `sytrf!`. If `uplo = U`, the upper half of `A` is stored. If `uplo = L`, the lower half is stored. `B` is overwritten by the solution `X`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5307-L5314)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.syev!' href='#LinearAlgebra.LAPACK.syev!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.syev!</u></b> &mdash; <i>Function</i>.




```julia
syev!(jobz, uplo, A)
```


Finds the eigenvalues (`jobz = N`) or eigenvalues and eigenvectors (`jobz = V`) of a symmetric matrix `A`. If `uplo = U`, the upper triangle of `A` is used. If `uplo = L`, the lower triangle of `A` is used.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5734-L5740)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.syevr!' href='#LinearAlgebra.LAPACK.syevr!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.syevr!</u></b> &mdash; <i>Function</i>.




```julia
syevr!(jobz, range, uplo, A, vl, vu, il, iu, abstol) -> (W, Z)
```


Finds the eigenvalues (`jobz = N`) or eigenvalues and eigenvectors (`jobz = V`) of a symmetric matrix `A`. If `uplo = U`, the upper triangle of `A` is used. If `uplo = L`, the lower triangle of `A` is used. If `range = A`, all the eigenvalues are found. If `range = V`, the eigenvalues in the half-open interval `(vl, vu]` are found. If `range = I`, the eigenvalues with indices between `il` and `iu` are found. `abstol` can be set as a tolerance for convergence.

The eigenvalues are returned in `W` and the eigenvectors in `Z`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5743-L5755)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.syevd!' href='#LinearAlgebra.LAPACK.syevd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.syevd!</u></b> &mdash; <i>Function</i>.




```julia
syevd!(jobz, uplo, A)
```


Finds the eigenvalues (`jobz = N`) or eigenvalues and eigenvectors (`jobz = V`) of a symmetric matrix `A`. If `uplo = U`, the upper triangle of `A` is used. If `uplo = L`, the lower triangle of `A` is used.

Use the divide-and-conquer method, instead of the QR iteration used by `syev!` or multiple relatively robust representations used by `syevr!`. See James W. Demmel et al, SIAM J. Sci. Comput. 30, 3, 1508 (2008) for a comparison of the accuracy and performatce of different methods.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5759-L5770)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.sygvd!' href='#LinearAlgebra.LAPACK.sygvd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.sygvd!</u></b> &mdash; <i>Function</i>.




```julia
sygvd!(itype, jobz, uplo, A, B) -> (w, A, B)
```


Finds the generalized eigenvalues (`jobz = N`) or eigenvalues and eigenvectors (`jobz = V`) of a symmetric matrix `A` and symmetric positive-definite matrix `B`. If `uplo = U`, the upper triangles of `A` and `B` are used. If `uplo = L`, the lower triangles of `A` and `B` are used. If `itype = 1`, the problem to solve is `A * x = lambda * B * x`. If `itype = 2`, the problem to solve is `A * B * x = lambda * x`. If `itype = 3`, the problem to solve is `B * A * x = lambda * x`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5773-L5784)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.bdsqr!' href='#LinearAlgebra.LAPACK.bdsqr!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.bdsqr!</u></b> &mdash; <i>Function</i>.




```julia
bdsqr!(uplo, d, e_, Vt, U, C) -> (d, Vt, U, C)
```


Computes the singular value decomposition of a bidiagonal matrix with `d` on the diagonal and `e_` on the off-diagonal. If `uplo = U`, `e_` is the superdiagonal. If `uplo = L`, `e_` is the subdiagonal. Can optionally also compute the product `Q' * C`.

Returns the singular values in `d`, and the matrix `C` overwritten with `Q' * C`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5837-L5846)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.bdsdc!' href='#LinearAlgebra.LAPACK.bdsdc!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.bdsdc!</u></b> &mdash; <i>Function</i>.




```julia
bdsdc!(uplo, compq, d, e_) -> (d, e, u, vt, q, iq)
```


Computes the singular value decomposition of a bidiagonal matrix with `d` on the diagonal and `e_` on the off-diagonal using a divide and conqueq method. If `uplo = U`, `e_` is the superdiagonal. If `uplo = L`, `e_` is the subdiagonal. If `compq = N`, only the singular values are found. If `compq = I`, the singular values and vectors are found. If `compq = P`, the singular values and vectors are found in compact form. Only works for real types.

Returns the singular values in `d`, and if `compq = P`, the compact singular vectors in `iq`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5908-L5920)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gecon!' href='#LinearAlgebra.LAPACK.gecon!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gecon!</u></b> &mdash; <i>Function</i>.




```julia
gecon!(normtype, A, anorm)
```


Finds the reciprocal condition number of matrix `A`. If `normtype = I`, the condition number is found in the infinity norm. If `normtype = O` or `1`, the condition number is found in the one norm. `A` must be the result of `getrf!` and `anorm` is the norm of `A` in the relevant norm.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L5995-L6002)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gehrd!' href='#LinearAlgebra.LAPACK.gehrd!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gehrd!</u></b> &mdash; <i>Function</i>.




```julia
gehrd!(ilo, ihi, A) -> (A, tau)
```


Converts a matrix `A` to Hessenberg form. If `A` is balanced with `gebal!` then `ilo` and `ihi` are the outputs of `gebal!`. Otherwise they should be `ilo = 1` and `ihi = size(A,2)`. `tau` contains the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L6046-L6053)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.orghr!' href='#LinearAlgebra.LAPACK.orghr!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.orghr!</u></b> &mdash; <i>Function</i>.




```julia
orghr!(ilo, ihi, A, tau)
```


Explicitly finds `Q`, the orthogonal/unitary matrix from `gehrd!`. `ilo`, `ihi`, `A`, and `tau` must correspond to the input/output to `gehrd!`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L6096-L6101)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gees!' href='#LinearAlgebra.LAPACK.gees!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gees!</u></b> &mdash; <i>Function</i>.




```julia
gees!(jobvs, A) -> (A, vs, w)
```


Computes the eigenvalues (`jobvs = N`) or the eigenvalues and Schur vectors (`jobvs = V`) of matrix `A`. `A` is overwritten by its Schur form.

Returns `A`, `vs` containing the Schur vectors, and `w`, containing the eigenvalues.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L6719-L6727)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gges!' href='#LinearAlgebra.LAPACK.gges!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gges!</u></b> &mdash; <i>Function</i>.




```julia
gges!(jobvsl, jobvsr, A, B) -> (A, B, alpha, beta, vsl, vsr)
```


Computes the generalized eigenvalues, generalized Schur form, left Schur vectors (`jobsvl = V`), or right Schur vectors (`jobvsr = V`) of `A` and `B`.

The generalized eigenvalues are returned in `alpha` and `beta`. The left Schur vectors are returned in `vsl` and the right Schur vectors are returned in `vsr`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L6731-L6740)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.gges3!' href='#LinearAlgebra.LAPACK.gges3!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.gges3!</u></b> &mdash; <i>Function</i>.




```julia
gges3!(jobvsl, jobvsr, A, B) -> (A, B, alpha, beta, vsl, vsr)
```


Computes the generalized eigenvalues, generalized Schur form, left Schur vectors (`jobsvl = V`), or right Schur vectors (`jobvsr = V`) of `A` and `B` using a blocked algorithm. This function requires LAPACK 3.6.0.

The generalized eigenvalues are returned in `alpha` and `beta`. The left Schur vectors are returned in `vsl` and the right Schur vectors are returned in `vsr`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L6743-L6752)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trexc!' href='#LinearAlgebra.LAPACK.trexc!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trexc!</u></b> &mdash; <i>Function</i>.




```julia
trexc!(compq, ifst, ilst, T, Q) -> (T, Q)
trexc!(ifst, ilst, T, Q) -> (T, Q)
```


Reorder the Schur factorization `T` of a matrix, such that the diagonal block of `T` with row index `ifst` is moved to row index `ilst`. If `compq = V`, the Schur vectors `Q` are reordered. If `compq = N` they are not modified. The 4-arg method calls the 5-arg method with `compq = V`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L7063-L7071)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trsen!' href='#LinearAlgebra.LAPACK.trsen!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trsen!</u></b> &mdash; <i>Function</i>.




```julia
trsen!(job, compq, select, T, Q) -> (T, Q, w, s, sep)
trsen!(select, T, Q) -> (T, Q, w, s, sep)
```


Reorder the Schur factorization of a matrix and optionally finds reciprocal condition numbers. If `job = N`, no condition numbers are found. If `job = E`, only the condition number for this cluster of eigenvalues is found. If `job = V`, only the condition number for the invariant subspace is found. If `job = B` then the condition numbers for the cluster and subspace are found. If `compq = V` the Schur vectors `Q` are updated. If `compq = N` the Schur vectors are not modified. `select` determines which eigenvalues are in the cluster. The 3-arg method calls the 5-arg method with `job = N` and `compq = V`.

Returns `T`, `Q`, reordered eigenvalues in `w`, the condition number of the cluster of eigenvalues `s`, and the condition number of the invariant subspace `sep`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L7074-L7091)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.tgsen!' href='#LinearAlgebra.LAPACK.tgsen!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.tgsen!</u></b> &mdash; <i>Function</i>.




```julia
tgsen!(select, S, T, Q, Z) -> (S, T, alpha, beta, Q, Z)
```


Reorders the vectors of a generalized Schur decomposition. `select` specifies the eigenvalues in each cluster.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L7094-L7099)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.trsyl!' href='#LinearAlgebra.LAPACK.trsyl!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.trsyl!</u></b> &mdash; <i>Function</i>.




```julia
trsyl!(transa, transb, A, B, C, isgn=1) -> (C, scale)
```


Solves the Sylvester matrix equation `A * X +/- X * B = scale*C` where `A` and `B` are both quasi-upper triangular. If `transa = N`, `A` is not modified. If `transa = T`, `A` is transposed. If `transa = C`, `A` is conjugate transposed. Similarly for `transb` and `B`. If `isgn = 1`, the equation `A * X + X * B = scale * C` is solved. If `isgn = -1`, the equation `A * X - X * B = scale * C` is solved.

Returns `X` (overwriting `C`) and `scale`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L7136-L7147)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='LinearAlgebra.LAPACK.hseqr!' href='#LinearAlgebra.LAPACK.hseqr!'>#</a>&nbsp;<b><u>LinearAlgebra.LAPACK.hseqr!</u></b> &mdash; <i>Function</i>.




```julia
hseqr!(job, compz, ilo, ihi, H, Z) -> (H, Z, w)
```


Computes all eigenvalues and (optionally) the Schur factorization of a matrix reduced to Hessenberg form. If `H` is balanced with `gebal!` then `ilo` and `ihi` are the outputs of `gebal!`. Otherwise they should be `ilo = 1` and `ihi = size(H,2)`. `tau` contains the elementary reflectors of the factorization.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/lapack.jl#L6248-L6256)

</div>
<br>


