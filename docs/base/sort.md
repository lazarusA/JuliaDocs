
# Sorting and Related Functions {#Sorting-and-Related-Functions}

Julia has an extensive, flexible API for sorting and interacting with already-sorted arrays of values. By default, Julia picks reasonable algorithms and sorts in ascending order:

```julia
julia> sort([2,3,1])
3-element Vector{Int64}:
 1
 2
 3
```


You can sort in reverse order as well:

```julia
julia> sort([2,3,1], rev=true)
3-element Vector{Int64}:
 3
 2
 1
```


`sort` constructs a sorted copy leaving its input unchanged. Use the &quot;bang&quot; version of the sort function to mutate an existing array:

```julia
julia> a = [2,3,1];

julia> sort!(a);

julia> a
3-element Vector{Int64}:
 1
 2
 3
```


Instead of directly sorting an array, you can compute a permutation of the array&#39;s indices that puts the array into sorted order:

```julia
julia> v = randn(5)
5-element Array{Float64,1}:
  0.297288
  0.382396
 -0.597634
 -0.0104452
 -0.839027

julia> p = sortperm(v)
5-element Array{Int64,1}:
 5
 3
 4
 1
 2

julia> v[p]
5-element Array{Float64,1}:
 -0.839027
 -0.597634
 -0.0104452
  0.297288
  0.382396
```


Arrays can be sorted according to an arbitrary transformation of their values:

```julia
julia> sort(v, by=abs)
5-element Array{Float64,1}:
 -0.0104452
  0.297288
  0.382396
 -0.597634
 -0.839027
```


Or in reverse order by a transformation:

```julia
julia> sort(v, by=abs, rev=true)
5-element Array{Float64,1}:
 -0.839027
 -0.597634
  0.382396
  0.297288
 -0.0104452
```


If needed, the sorting algorithm can be chosen:

```julia
julia> sort(v, alg=InsertionSort)
5-element Array{Float64,1}:
 -0.839027
 -0.597634
 -0.0104452
  0.297288
  0.382396
```


All the sorting and order related functions rely on a &quot;less than&quot; relation defining a [strict weak order](https://en.wikipedia.org/wiki/Weak_ordering#Strict_weak_orderings) on the values to be manipulated. The `isless` function is invoked by default, but the relation can be specified via the `lt` keyword, a function that takes two array elements and returns `true` if and only if the first argument is &quot;less than&quot; the second. See [`sort!`](/base/sort#Base.sort!) and [Alternate Orderings](/base/sort#Alternate-Orderings) for more information.

## Sorting Functions {#Sorting-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sort!' href='#Base.sort!'>#</a>&nbsp;<b><u>Base.sort!</u></b> &mdash; <i>Function</i>.




```julia
sort!(v; alg::Base.Sort.Algorithm=Base.Sort.defalg(v), lt=isless, by=identity, rev::Bool=false, order::Base.Order.Ordering=Base.Order.Forward)
```


Sort the vector `v` in place. A stable algorithm is used by default: the ordering of elements that compare equal is preserved. A specific algorithm can be selected via the `alg` keyword (see [Sorting Algorithms](/base/sort#Sorting-Algorithms) for available algorithms).

Elements are first transformed with the function `by` and then compared according to either the function `lt` or the ordering `order`. Finally, the resulting order is reversed if `rev=true` (this preserves forward stability: elements that compare equal are not reversed). The current implementation applies the `by` transformation before each comparison rather than once per element.

Passing an `lt` other than `isless` along with an `order` other than [`Base.Order.Forward`](/base/sort#Base.Order.Forward) or [`Base.Order.Reverse`](/base/sort#Base.Order.Reverse) is not permitted, otherwise all options are independent and can be used together in all possible combinations. Note that `order` can also include a &quot;by&quot; transformation, in which case it is applied after that defined with the `by` keyword. For more information on `order` values see the documentation on [Alternate Orderings](/base/sort#Alternate-Orderings).

Relations between two elements are defined as follows (with &quot;less&quot; and &quot;greater&quot; exchanged when `rev=true`):
- `x` is less than `y` if `lt(by(x), by(y))` (or `Base.Order.lt(order, by(x), by(y))`) yields true.
  
- `x` is greater than `y` if `y` is less than `x`.
  
- `x` and `y` are equivalent if neither is less than the other (&quot;incomparable&quot; is sometimes used as a synonym for &quot;equivalent&quot;).
  

The result of `sort!` is sorted in the sense that every element is greater than or equivalent to the previous one.

The `lt` function must define a strict weak order, that is, it must be
- irreflexive: `lt(x, x)` always yields `false`,
  
- asymmetric: if `lt(x, y)` yields `true` then `lt(y, x)` yields `false`,
  
- transitive: `lt(x, y) && lt(y, z)` implies `lt(x, z)`,
  
- transitive in equivalence: `!lt(x, y) && !lt(y, x)` and `!lt(y, z) && !lt(z, y)` together imply `!lt(x, z) && !lt(z, x)`. In words: if `x` and `y` are equivalent and `y` and `z` are equivalent then `x` and `z` must be equivalent.
  

For example `<` is a valid `lt` function for `Int` values but `≤` is not: it violates irreflexivity. For `Float64` values even `<` is invalid as it violates the fourth condition: `1.0` and `NaN` are equivalent and so are `NaN` and `2.0` but `1.0` and `2.0` are not equivalent.

See also [`sort`](/base/sort#Base.sort), [`sortperm`](/base/sort#Base.sortperm), [`sortslices`](/base/sort#Base.sortslices), [`partialsort!`](/base/sort#Base.Sort.partialsort!), [`partialsortperm`](/base/sort#Base.Sort.partialsortperm), [`issorted`](/base/sort#Base.issorted), [`searchsorted`](/base/sort#Base.Sort.searchsorted), [`insorted`](/base/sort#Base.Sort.insorted), [`Base.Order.ord`](/base/sort#Base.Order.ord).

**Examples**

```julia
julia> v = [3, 1, 2]; sort!(v); v
3-element Vector{Int64}:
 1
 2
 3

julia> v = [3, 1, 2]; sort!(v, rev = true); v
3-element Vector{Int64}:
 3
 2
 1

julia> v = [(1, "c"), (3, "a"), (2, "b")]; sort!(v, by = x -> x[1]); v
3-element Vector{Tuple{Int64, String}}:
 (1, "c")
 (2, "b")
 (3, "a")

julia> v = [(1, "c"), (3, "a"), (2, "b")]; sort!(v, by = x -> x[2]); v
3-element Vector{Tuple{Int64, String}}:
 (3, "a")
 (2, "b")
 (1, "c")

julia> sort(0:3, by=x->x-2, order=Base.Order.By(abs)) # same as sort(0:3, by=abs(x->x-2))
4-element Vector{Int64}:
 2
 1
 3
 0

julia> sort([2, NaN, 1, NaN, 3]) # correct sort with default lt=isless
5-element Vector{Float64}:
   1.0
   2.0
   3.0
 NaN
 NaN

julia> sort([2, NaN, 1, NaN, 3], lt=<) # wrong sort due to invalid lt. This behavior is undefined.
5-element Vector{Float64}:
   2.0
 NaN
   1.0
 NaN
   3.0
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L1595-L1696)



```julia
sort!(A; dims::Integer, alg::Base.Sort.Algorithm=Base.Sort.defalg(A), lt=isless, by=identity, rev::Bool=false, order::Base.Order.Ordering=Base.Order.Forward)
```


Sort the multidimensional array `A` along dimension `dims`. See the one-dimensional version of [`sort!`](/base/sort#Base.sort!) for a description of possible keyword arguments.

To sort slices of an array, refer to [`sortslices`](/base/sort#Base.sortslices).

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

**Examples**

```julia
julia> A = [4 3; 1 2]
2×2 Matrix{Int64}:
 4  3
 1  2

julia> sort!(A, dims = 1); A
2×2 Matrix{Int64}:
 1  2
 4  3

julia> sort!(A, dims = 2); A
2×2 Matrix{Int64}:
 1  2
 3  4
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L2069-L2098)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sort' href='#Base.sort'>#</a>&nbsp;<b><u>Base.sort</u></b> &mdash; <i>Function</i>.




```julia
sort(v; alg::Base.Sort.Algorithm=Base.Sort.defalg(v), lt=isless, by=identity, rev::Bool=false, order::Base.Order.Ordering=Base.Order.Forward)
```


Variant of [`sort!`](/base/sort#Base.sort!) that returns a sorted copy of `v` leaving `v` itself unmodified.

**Examples**

```julia
julia> v = [3, 1, 2];

julia> sort(v)
3-element Vector{Int64}:
 1
 2
 3

julia> v
3-element Vector{Int64}:
 3
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L1708-L1729)



```julia
sort(A; dims::Integer, alg::Base.Sort.Algorithm=Base.Sort.defalg(A), lt=isless, by=identity, rev::Bool=false, order::Base.Order.Ordering=Base.Order.Forward)
```


Sort a multidimensional array `A` along the given dimension. See [`sort!`](/base/sort#Base.sort!) for a description of possible keyword arguments.

To sort slices of an array, refer to [`sortslices`](/base/sort#Base.sortslices).

**Examples**

```julia
julia> A = [4 3; 1 2]
2×2 Matrix{Int64}:
 4  3
 1  2

julia> sort(A, dims = 1)
2×2 Matrix{Int64}:
 1  2
 4  3

julia> sort(A, dims = 2)
2×2 Matrix{Int64}:
 3  4
 1  2
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L1997-L2023)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sortperm' href='#Base.sortperm'>#</a>&nbsp;<b><u>Base.sortperm</u></b> &mdash; <i>Function</i>.




```julia
sortperm(A; alg::Base.Sort.Algorithm=Base.Sort.DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Base.Order.Ordering=Base.Order.Forward, [dims::Integer])
```


Return a permutation vector or array `I` that puts `A[I]` in sorted order along the given dimension. If `A` has more than one dimension, then the `dims` keyword argument must be specified. The order is specified using the same keywords as [`sort!`](/base/sort#Base.sort!). The permutation is guaranteed to be stable even if the sorting algorithm is unstable: the indices of equal elements will appear in ascending order.

See also [`sortperm!`](/base/sort#Base.Sort.sortperm!), [`partialsortperm`](/base/sort#Base.Sort.partialsortperm), [`invperm`](/base/arrays#Base.invperm), [`indexin`](/base/collections#Base.indexin). To sort slices of an array, refer to [`sortslices`](/base/sort#Base.sortslices).

::: tip Julia 1.9

The method accepting `dims` requires at least Julia 1.9.

:::

**Examples**

```julia
julia> v = [3, 1, 2];

julia> p = sortperm(v)
3-element Vector{Int64}:
 2
 3
 1

julia> v[p]
3-element Vector{Int64}:
 1
 2
 3

julia> A = [8 7; 5 6]
2×2 Matrix{Int64}:
 8  7
 5  6

julia> sortperm(A, dims = 1)
2×2 Matrix{Int64}:
 2  4
 1  3

julia> sortperm(A, dims = 2)
2×2 Matrix{Int64}:
 3  1
 2  4
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L1831-L1877)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.InsertionSort' href='#Base.Sort.InsertionSort'>#</a>&nbsp;<b><u>Base.Sort.InsertionSort</u></b> &mdash; <i>Constant</i>.




```julia
InsertionSort
```


Use the insertion sort algorithm.

Insertion sort traverses the collection one element at a time, inserting each element into its correct, sorted position in the output vector.

Characteristics:
- _stable_: preserves the ordering of elements that compare equal
  

(e.g. &quot;a&quot; and &quot;A&quot; in a sort of letters that ignores case).
- _in-place_ in memory.
  
- _quadratic performance_ in the number of elements to be sorted:
  

it is well-suited to small collections but should not be used for large ones.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L799-L813)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.MergeSort' href='#Base.Sort.MergeSort'>#</a>&nbsp;<b><u>Base.Sort.MergeSort</u></b> &mdash; <i>Constant</i>.




```julia
MergeSort
```


Indicate that a sorting function should use the merge sort algorithm. Merge sort divides the collection into subcollections and repeatedly merges them, sorting each subcollection at each step, until the entire collection has been recombined in sorted form.

Characteristics:
- _stable_: preserves the ordering of elements that compare equal (e.g. &quot;a&quot; and &quot;A&quot; in a sort of letters that ignores case).
  
- _not in-place_ in memory.
  
- _divide-and-conquer_ sort strategy.
  
- _good performance_ for large collections but typically not quite as fast as [`QuickSort`](/base/sort#Base.Sort.QuickSort).
  


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L2288-L2305)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.QuickSort' href='#Base.Sort.QuickSort'>#</a>&nbsp;<b><u>Base.Sort.QuickSort</u></b> &mdash; <i>Constant</i>.




```julia
QuickSort
```


Indicate that a sorting function should use the quick sort algorithm, which is _not_ stable.

Characteristics:
- _not stable_: does not preserve the ordering of elements that compare equal (e.g. &quot;a&quot; and &quot;A&quot; in a sort of letters that ignores case).
  
- _in-place_ in memory.
  
- _divide-and-conquer_: sort strategy similar to [`MergeSort`](/base/sort#Base.Sort.MergeSort).
  
- _good performance_ for large collections.
  


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L2272-L2285)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.PartialQuickSort' href='#Base.Sort.PartialQuickSort'>#</a>&nbsp;<b><u>Base.Sort.PartialQuickSort</u></b> &mdash; <i>Type</i>.




```julia
PartialQuickSort{T <: Union{Integer,OrdinalRange}}
```


Indicate that a sorting function should use the partial quick sort algorithm. `PartialQuickSort(k)` is like `QuickSort`, but is only required to find and sort the elements that would end up in `v[k]` were `v` fully sorted.

Characteristics:
- _not stable_: does not preserve the ordering of elements that compare equal (e.g. &quot;a&quot; and &quot;A&quot; in a sort of letters that ignores case).
  
- _in-place_ in memory.
  
- _divide-and-conquer_: sort strategy similar to [`MergeSort`](/base/sort#Base.Sort.MergeSort).
  

Note that `PartialQuickSort(k)` does not necessarily sort the whole array. For example,

```julia
julia> x = rand(100);

julia> k = 50:100;

julia> s1 = sort(x; alg=QuickSort);

julia> s2 = sort(x; alg=PartialQuickSort(k));

julia> map(issorted, (s1, s2))
(true, false)

julia> map(x->issorted(x[k]), (s1, s2))
(true, true)

julia> s1[k] == s2[k]
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L2233-L2267)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.sortperm!' href='#Base.Sort.sortperm!'>#</a>&nbsp;<b><u>Base.Sort.sortperm!</u></b> &mdash; <i>Function</i>.




```julia
sortperm!(ix, A; alg::Base.Sort.Algorithm=Base.Sort.DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Base.Order.Ordering=Base.Order.Forward, [dims::Integer])
```


Like [`sortperm`](/base/sort#Base.sortperm), but accepts a preallocated index vector or array `ix` with the same `axes` as `A`. `ix` is initialized to contain the values `LinearIndices(A)`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

::: tip Julia 1.9

The method accepting `dims` requires at least Julia 1.9.

:::

**Examples**

```julia
julia> v = [3, 1, 2]; p = zeros(Int, 3);

julia> sortperm!(p, v); p
3-element Vector{Int64}:
 2
 3
 1

julia> v[p]
3-element Vector{Int64}:
 1
 2
 3

julia> A = [8 7; 5 6]; p = zeros(Int,2, 2);

julia> sortperm!(p, A; dims=1); p
2×2 Matrix{Int64}:
 2  4
 1  3

julia> sortperm!(p, A; dims=2); p
2×2 Matrix{Int64}:
 3  1
 2  4
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L1909-L1948)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sortslices' href='#Base.sortslices'>#</a>&nbsp;<b><u>Base.sortslices</u></b> &mdash; <i>Function</i>.




```julia
sortslices(A; dims, alg::Algorithm=DEFAULT_UNSTABLE, lt=isless, by=identity, rev::Bool=false, order::Ordering=Forward)
```


Sort slices of an array `A`. The required keyword argument `dims` must be either an integer or a tuple of integers. It specifies the dimension(s) over which the slices are sorted.

E.g., if `A` is a matrix, `dims=1` will sort rows, `dims=2` will sort columns. Note that the default comparison function on one dimensional slices sorts lexicographically.

For the remaining keyword arguments, see the documentation of [`sort!`](/base/sort#Base.sort!).

**Examples**

```julia
julia> sortslices([7 3 5; -1 6 4; 9 -2 8], dims=1) # Sort rows
3×3 Matrix{Int64}:
 -1   6  4
  7   3  5
  9  -2  8

julia> sortslices([7 3 5; -1 6 4; 9 -2 8], dims=1, lt=(x,y)->isless(x[2],y[2]))
3×3 Matrix{Int64}:
  9  -2  8
  7   3  5
 -1   6  4

julia> sortslices([7 3 5; -1 6 4; 9 -2 8], dims=1, rev=true)
3×3 Matrix{Int64}:
  9  -2  8
  7   3  5
 -1   6  4

julia> sortslices([7 3 5; 6 -1 -4; 9 -2 8], dims=2) # Sort columns
3×3 Matrix{Int64}:
  3   5  7
 -1  -4  6
 -2   8  9

julia> sortslices([7 3 5; 6 -1 -4; 9 -2 8], dims=2, alg=InsertionSort, lt=(x,y)->isless(x[2],y[2]))
3×3 Matrix{Int64}:
  5   3  7
 -4  -1  6
  8  -2  9

julia> sortslices([7 3 5; 6 -1 -4; 9 -2 8], dims=2, rev=true)
3×3 Matrix{Int64}:
 7   5   3
 6  -4  -1
 9   8  -2
```


**Higher dimensions**

`sortslices` extends naturally to higher dimensions. E.g., if `A` is a a 2x2x2 array, `sortslices(A, dims=3)` will sort slices within the 3rd dimension, passing the 2x2 slices `A[:, :, 1]` and `A[:, :, 2]` to the comparison function. Note that while there is no default order on higher-dimensional slices, you may use the `by` or `lt` keyword argument to specify such an order.

If `dims` is a tuple, the order of the dimensions in `dims` is relevant and specifies the linear order of the slices. E.g., if `A` is three dimensional and `dims` is `(1, 2)`, the orderings of the first two dimensions are re-arranged such that the slices (of the remaining third dimension) are sorted. If `dims` is `(2, 1)` instead, the same slices will be taken, but the result order will be row-major instead.

**Higher dimensional examples**

```
julia> A = [4 3; 2 1 ;;; 'A' 'B'; 'C' 'D']
2×2×2 Array{Any, 3}:
[:, :, 1] =
 4  3
 2  1

[:, :, 2] =
 'A'  'B'
 'C'  'D'

julia> sortslices(A, dims=(1,2))
2×2×2 Array{Any, 3}:
[:, :, 1] =
 1  3
 2  4

[:, :, 2] =
 'D'  'B'
 'C'  'A'

julia> sortslices(A, dims=(2,1))
2×2×2 Array{Any, 3}:
[:, :, 1] =
 1  2
 3  4

[:, :, 2] =
 'D'  'C'
 'B'  'A'

julia> sortslices(reshape([5; 4; 3; 2; 1], (1,1,5)), dims=3, by=x->x[1,1])
1×1×5 Array{Int64, 3}:
[:, :, 1] =
 1

[:, :, 2] =
 2

[:, :, 3] =
 3

[:, :, 4] =
 4

[:, :, 5] =
 5
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/multidimensional.jl#L1809-L1925)

</div>
<br>

## Order-Related Functions {#Order-Related-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.issorted' href='#Base.issorted'>#</a>&nbsp;<b><u>Base.issorted</u></b> &mdash; <i>Function</i>.




```julia
issorted(v, lt=isless, by=identity, rev::Bool=false, order::Base.Order.Ordering=Base.Order.Forward)
```


Test whether a collection is in sorted order. The keywords modify what order is considered sorted, as described in the [`sort!`](/base/sort#Base.sort!) documentation.

**Examples**

```julia
julia> issorted([1, 2, 3])
true

julia> issorted([(1, "b"), (2, "a")], by = x -> x[1])
true

julia> issorted([(1, "b"), (2, "a")], by = x -> x[2])
false

julia> issorted([(1, "b"), (2, "a")], by = x -> x[2], rev=true)
true

julia> issorted([1, 2, -2, 3], by=abs)
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L64-L87)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.searchsorted' href='#Base.Sort.searchsorted'>#</a>&nbsp;<b><u>Base.Sort.searchsorted</u></b> &mdash; <i>Function</i>.




```julia
searchsorted(v, x; by=identity, lt=isless, rev=false)
```


Return the range of indices in `v` where values are equivalent to `x`, or an empty range located at the insertion point if `v` does not contain values equivalent to `x`. The vector `v` must be sorted according to the order defined by the keywords. Refer to [`sort!`](/base/sort#Base.sort!) for the meaning of the keywords and the definition of equivalence. Note that the `by` function is applied to the searched value `x` as well as the values in `v`.

The range is generally found using binary search, but there are optimized implementations for some inputs.

See also: [`searchsortedfirst`](/base/sort#Base.Sort.searchsortedfirst), [`sort!`](/base/sort#Base.sort!), [`insorted`](/base/sort#Base.Sort.insorted), [`findall`](/base/arrays#Base.findall-Tuple{Any}).

**Examples**

```julia
julia> searchsorted([1, 2, 4, 5, 5, 7], 4) # single match
3:3

julia> searchsorted([1, 2, 4, 5, 5, 7], 5) # multiple matches
4:5

julia> searchsorted([1, 2, 4, 5, 5, 7], 3) # no match, insert in the middle
3:2

julia> searchsorted([1, 2, 4, 5, 5, 7], 9) # no match, insert at end
7:6

julia> searchsorted([1, 2, 4, 5, 5, 7], 0) # no match, insert at start
1:0

julia> searchsorted([1=>"one", 2=>"two", 2=>"two", 4=>"four"], 2=>"two", by=first) # compare the keys of the pairs
2:3
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L308-L343)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.searchsortedfirst' href='#Base.Sort.searchsortedfirst'>#</a>&nbsp;<b><u>Base.Sort.searchsortedfirst</u></b> &mdash; <i>Function</i>.




```julia
searchsortedfirst(v, x; by=identity, lt=isless, rev=false)
```


Return the index of the first value in `v` that is not ordered before `x`. If all values in `v` are ordered before `x`, return `lastindex(v) + 1`.

The vector `v` must be sorted according to the order defined by the keywords. `insert!`ing `x` at the returned index will maintain the sorted order. Refer to [`sort!`](/base/sort#Base.sort!) for the meaning and use of the keywords. Note that the `by` function is applied to the searched value `x` as well as the values in `v`.

The index is generally found using binary search, but there are optimized implementations for some inputs.

See also: [`searchsortedlast`](/base/sort#Base.Sort.searchsortedlast), [`searchsorted`](/base/sort#Base.Sort.searchsorted), [`findfirst`](/base/arrays#Base.findfirst-Tuple{Any}).

**Examples**

```julia
julia> searchsortedfirst([1, 2, 4, 5, 5, 7], 4) # single match
3

julia> searchsortedfirst([1, 2, 4, 5, 5, 7], 5) # multiple matches
4

julia> searchsortedfirst([1, 2, 4, 5, 5, 7], 3) # no match, insert in the middle
3

julia> searchsortedfirst([1, 2, 4, 5, 5, 7], 9) # no match, insert at end
7

julia> searchsortedfirst([1, 2, 4, 5, 5, 7], 0) # no match, insert at start
1

julia> searchsortedfirst([1=>"one", 2=>"two", 4=>"four"], 3=>"three", by=first) # compare the keys of the pairs
3
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L345-L382)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.searchsortedlast' href='#Base.Sort.searchsortedlast'>#</a>&nbsp;<b><u>Base.Sort.searchsortedlast</u></b> &mdash; <i>Function</i>.




```julia
searchsortedlast(v, x; by=identity, lt=isless, rev=false)
```


Return the index of the last value in `v` that is not ordered after `x`. If all values in `v` are ordered after `x`, return `firstindex(v) - 1`.

The vector `v` must be sorted according to the order defined by the keywords. `insert!`ing `x` immediately after the returned index will maintain the sorted order. Refer to [`sort!`](/base/sort#Base.sort!) for the meaning and use of the keywords. Note that the `by` function is applied to the searched value `x` as well as the values in `v`.

The index is generally found using binary search, but there are optimized implementations for some inputs

**Examples**

```julia
julia> searchsortedlast([1, 2, 4, 5, 5, 7], 4) # single match
3

julia> searchsortedlast([1, 2, 4, 5, 5, 7], 5) # multiple matches
5

julia> searchsortedlast([1, 2, 4, 5, 5, 7], 3) # no match, insert in the middle
2

julia> searchsortedlast([1, 2, 4, 5, 5, 7], 9) # no match, insert at end
6

julia> searchsortedlast([1, 2, 4, 5, 5, 7], 0) # no match, insert at start
0

julia> searchsortedlast([1=>"one", 2=>"two", 4=>"four"], 3=>"three", by=first) # compare the keys of the pairs
2
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L384-L419)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.insorted' href='#Base.Sort.insorted'>#</a>&nbsp;<b><u>Base.Sort.insorted</u></b> &mdash; <i>Function</i>.




```julia
insorted(x, v; by=identity, lt=isless, rev=false) -> Bool
```


Determine whether a vector `v` contains any value equivalent to `x`. The vector `v` must be sorted according to the order defined by the keywords. Refer to [`sort!`](/base/sort#Base.sort!) for the meaning of the keywords and the definition of equivalence. Note that the `by` function is applied to the searched value `x` as well as the values in `v`.

The check is generally done using binary search, but there are optimized implementations for some inputs.

See also [`in`](/base/collections#Base.in).

**Examples**

```julia
julia> insorted(4, [1, 2, 4, 5, 5, 7]) # single match
true

julia> insorted(5, [1, 2, 4, 5, 5, 7]) # multiple matches
true

julia> insorted(3, [1, 2, 4, 5, 5, 7]) # no match
false

julia> insorted(9, [1, 2, 4, 5, 5, 7]) # no match
false

julia> insorted(0, [1, 2, 4, 5, 5, 7]) # no match
false

julia> insorted(2=>"TWO", [1=>"one", 2=>"two", 4=>"four"], by=first) # compare the keys of the pairs
true
```


::: tip Julia 1.6

`insorted` was added in Julia 1.6.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L421-L458)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.partialsort!' href='#Base.Sort.partialsort!'>#</a>&nbsp;<b><u>Base.Sort.partialsort!</u></b> &mdash; <i>Function</i>.




```julia
partialsort!(v, k; by=identity, lt=isless, rev=false)
```


Partially sort the vector `v` in place so that the value at index `k` (or range of adjacent values if `k` is a range) occurs at the position where it would appear if the array were fully sorted. If `k` is a single index, that value is returned; if `k` is a range, an array of values at those indices is returned. Note that `partialsort!` may not fully sort the input array.

For the keyword arguments, see the documentation of [`sort!`](/base/sort#Base.sort!).

**Examples**

```julia
julia> a = [1, 2, 4, 3, 4]
5-element Vector{Int64}:
 1
 2
 4
 3
 4

julia> partialsort!(a, 4)
4

julia> a
5-element Vector{Int64}:
 1
 2
 3
 4
 4

julia> a = [1, 2, 4, 3, 4]
5-element Vector{Int64}:
 1
 2
 4
 3
 4

julia> partialsort!(a, 4, rev=true)
2

julia> a
5-element Vector{Int64}:
 4
 4
 3
 2
 1
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L108-L160)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.partialsort' href='#Base.Sort.partialsort'>#</a>&nbsp;<b><u>Base.Sort.partialsort</u></b> &mdash; <i>Function</i>.




```julia
partialsort(v, k, by=identity, lt=isless, rev=false)
```


Variant of [`partialsort!`](/base/sort#Base.Sort.partialsort!) that copies `v` before partially sorting it, thereby returning the same thing as `partialsort!` but leaving `v` unmodified.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L165-L170)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.partialsortperm' href='#Base.Sort.partialsortperm'>#</a>&nbsp;<b><u>Base.Sort.partialsortperm</u></b> &mdash; <i>Function</i>.




```julia
partialsortperm(v, k; by=identity, lt=isless, rev=false)
```


Return a partial permutation `I` of the vector `v`, so that `v[I]` returns values of a fully sorted version of `v` at index `k`. If `k` is a range, a vector of indices is returned; if `k` is an integer, a single index is returned. The order is specified using the same keywords as `sort!`. The permutation is stable: the indices of equal elements will appear in ascending order.

This function is equivalent to, but more efficient than, calling `sortperm(...)[k]`.

**Examples**

```julia
julia> v = [3, 1, 2, 1];

julia> v[partialsortperm(v, 1)]
1

julia> p = partialsortperm(v, 1:3)
3-element view(::Vector{Int64}, 1:3) with eltype Int64:
 2
 4
 3

julia> v[p]
3-element Vector{Int64}:
 1
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L1734-L1764)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sort.partialsortperm!' href='#Base.Sort.partialsortperm!'>#</a>&nbsp;<b><u>Base.Sort.partialsortperm!</u></b> &mdash; <i>Function</i>.




```julia
partialsortperm!(ix, v, k; by=identity, lt=isless, rev=false)
```


Like [`partialsortperm`](/base/sort#Base.Sort.partialsortperm), but accepts a preallocated index vector `ix` the same size as `v`, which is used to store (a permutation of) the indices of `v`.

`ix` is initialized to contain the indices of `v`.

(Typically, the indices of `v` will be `1:length(v)`, although if `v` has an alternative array type with non-one-based indices, such as an `OffsetArray`, `ix` must share those same indices)

Upon return, `ix` is guaranteed to have the indices `k` in their sorted positions, such that

```julia
partialsortperm!(ix, v, k);
v[ix[k]] == partialsort(v, k)
```


The return value is the `k`th element of `ix` if `k` is an integer, or view into `ix` if `k` is a range.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> v = [3, 1, 2, 1];

julia> ix = Vector{Int}(undef, 4);

julia> partialsortperm!(ix, v, 1)
2

julia> ix = [1:4;];

julia> partialsortperm!(ix, v, 2:3)
2-element view(::Vector{Int64}, 2:3) with eltype Int64:
 4
 3
```


```

```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/sort.jl#L1768-L1807)

</div>
<br>

## Sorting Algorithms {#Sorting-Algorithms}

There are currently four sorting algorithms publicly available in base Julia:
- [`InsertionSort`](/base/sort#Base.Sort.InsertionSort)
  
- [`QuickSort`](/base/sort#Base.Sort.QuickSort)
  
- [`PartialQuickSort(k)`](/base/sort#Base.Sort.PartialQuickSort)
  
- [`MergeSort`](/base/sort#Base.Sort.MergeSort)
  

By default, the `sort` family of functions uses stable sorting algorithms that are fast on most inputs. The exact algorithm choice is an implementation detail to allow for future performance improvements. Currently, a hybrid of `RadixSort`, `ScratchQuickSort`, `InsertionSort`, and `CountingSort` is used based on input type, size, and composition. Implementation details are subject to change but currently available in the extended help of `??Base.DEFAULT_STABLE` and the docstrings of internal sorting algorithms listed there.

You can explicitly specify your preferred algorithm with the `alg` keyword (e.g. `sort!(v, alg=PartialQuickSort(10:20))`) or reconfigure the default sorting algorithm for custom types by adding a specialized method to the `Base.Sort.defalg` function. For example, [InlineStrings.jl](https://github.com/JuliaStrings/InlineStrings.jl/blob/v1.3.2/src/InlineStrings.jl#L903) defines the following method:

```julia
Base.Sort.defalg(::AbstractArray{<:Union{SmallInlineStrings, Missing}}) = InlineStringSort
```


::: tip Julia 1.9

The default sorting algorithm (returned by `Base.Sort.defalg`) is guaranteed to be stable since Julia 1.9. Previous versions had unstable edge cases when sorting numeric arrays.

:::

## Alternate Orderings {#Alternate-Orderings}

By default, `sort`, `searchsorted`, and related functions use [`isless`](/base/base#Base.isless) to compare two elements in order to determine which should come first. The [`Base.Order.Ordering`](/base/sort#Base.Order.Ordering) abstract type provides a mechanism for defining alternate orderings on the same set of elements: when calling a sorting function like `sort!`, an instance of `Ordering` can be provided with the keyword argument `order`.

Instances of `Ordering` define an order through the [`Base.Order.lt`](/base/sort#Base.Order.lt) function, which works as a generalization of `isless`. This function&#39;s behavior on custom `Ordering`s must satisfy all the conditions of a [strict weak order](https://en.wikipedia.org/wiki/Weak_ordering#Strict_weak_orderings). See [`sort!`](/base/sort#Base.sort!) for details and examples of valid and invalid `lt` functions.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.Ordering' href='#Base.Order.Ordering'>#</a>&nbsp;<b><u>Base.Order.Ordering</u></b> &mdash; <i>Type</i>.




```julia
Base.Order.Ordering
```


Abstract type which represents a strict weak order on some set of elements. See [`sort!`](/base/sort#Base.sort!) for more.

Use [`Base.Order.lt`](/base/sort#Base.Order.lt) to compare two elements according to the ordering.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L21-L28)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.lt' href='#Base.Order.lt'>#</a>&nbsp;<b><u>Base.Order.lt</u></b> &mdash; <i>Function</i>.




```julia
lt(o::Ordering, a, b) -> Bool
```


Test whether `a` is less than `b` according to the ordering `o`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L113-L117)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.ord' href='#Base.Order.ord'>#</a>&nbsp;<b><u>Base.Order.ord</u></b> &mdash; <i>Function</i>.




```julia
ord(lt, by, rev::Union{Bool, Nothing}, order::Ordering=Forward)
```


Construct an [`Ordering`](/base/sort#Base.Order.Ordering) object from the same arguments used by [`sort!`](/base/sort#Base.sort!). Elements are first transformed by the function `by` (which may be [`identity`](/base/base#Base.identity)) and are then compared according to either the function `lt` or an existing ordering `order`. `lt` should be [`isless`](/base/base#Base.isless) or a function that obeys the same rules as the `lt` parameter of [`sort!`](/base/sort#Base.sort!). Finally, the resulting order is reversed if `rev=true`.

Passing an `lt` other than `isless` along with an `order` other than [`Base.Order.Forward`](/base/sort#Base.Order.Forward) or [`Base.Order.Reverse`](/base/sort#Base.Order.Reverse) is not permitted, otherwise all options are independent and can be used together in all possible combinations.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L139-L154)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.Forward' href='#Base.Order.Forward'>#</a>&nbsp;<b><u>Base.Order.Forward</u></b> &mdash; <i>Constant</i>.




```julia
Base.Order.Forward
```


Default ordering according to [`isless`](/base/base#Base.isless).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L60-L64)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.ReverseOrdering' href='#Base.Order.ReverseOrdering'>#</a>&nbsp;<b><u>Base.Order.ReverseOrdering</u></b> &mdash; <i>Type</i>.




```julia
ReverseOrdering(fwd::Ordering=Forward)
```


A wrapper which reverses an ordering.

For a given `Ordering` `o`, the following holds for all  `a`, `b`:

```
lt(ReverseOrdering(o), a, b) == lt(o, b, a)
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L33-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.Reverse' href='#Base.Order.Reverse'>#</a>&nbsp;<b><u>Base.Order.Reverse</u></b> &mdash; <i>Constant</i>.




```julia
Base.Order.Reverse
```


Reverse ordering according to [`isless`](/base/base#Base.isless).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L67-L71)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.By' href='#Base.Order.By'>#</a>&nbsp;<b><u>Base.Order.By</u></b> &mdash; <i>Type</i>.




```julia
By(by, order::Ordering=Forward)
```


`Ordering` which applies `order` to elements after they have been transformed by the function `by`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L74-L79)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.Lt' href='#Base.Order.Lt'>#</a>&nbsp;<b><u>Base.Order.Lt</u></b> &mdash; <i>Type</i>.




```julia
Lt(lt)
```


`Ordering` that calls `lt(a, b)` to compare elements. `lt` must obey the same rules as the `lt` parameter of [`sort!`](/base/sort#Base.sort!).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L88-L93)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Order.Perm' href='#Base.Order.Perm'>#</a>&nbsp;<b><u>Base.Order.Perm</u></b> &mdash; <i>Type</i>.




```julia
Perm(order::Ordering, data::AbstractVector)
```


`Ordering` on the indices of `data` where `i` is less than `j` if `data[i]` is less than `data[j]` according to `order`. In the case that `data[i]` and `data[j]` are equal, `i` and `j` are compared by numeric value.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/ordering.jl#L98-L104)

</div>
<br>
