
# Iteration utilities {#Iteration-utilities}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.Stateful' href='#Base.Iterators.Stateful'>#</a>&nbsp;<b><u>Base.Iterators.Stateful</u></b> &mdash; <i>Type</i>.




```julia
Stateful(itr)
```


There are several different ways to think about this iterator wrapper:
1. It provides a mutable wrapper around an iterator and its iteration state.
  
2. It turns an iterator-like abstraction into a `Channel`-like abstraction.
  
3. It&#39;s an iterator that mutates to become its own rest iterator whenever an item is produced.
  

`Stateful` provides the regular iterator interface. Like other mutable iterators (e.g. [`Base.Channel`](/base/parallel#Base.Channel)), if iteration is stopped early (e.g. by a [`break`](/base/base#break) in a [`for`](/base/base#for) loop), iteration can be resumed from the same spot by continuing to iterate over the same iterator object (in contrast, an immutable iterator would restart from the beginning).

**Examples**

```julia
julia> a = Iterators.Stateful("abcdef");

julia> isempty(a)
false

julia> popfirst!(a)
'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)

julia> collect(Iterators.take(a, 3))
3-element Vector{Char}:
 'b': ASCII/Unicode U+0062 (category Ll: Letter, lowercase)
 'c': ASCII/Unicode U+0063 (category Ll: Letter, lowercase)
 'd': ASCII/Unicode U+0064 (category Ll: Letter, lowercase)

julia> collect(a)
2-element Vector{Char}:
 'e': ASCII/Unicode U+0065 (category Ll: Letter, lowercase)
 'f': ASCII/Unicode U+0066 (category Ll: Letter, lowercase)

julia> Iterators.reset!(a); popfirst!(a)
'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)

julia> Iterators.reset!(a, "hello"); popfirst!(a)
'h': ASCII/Unicode U+0068 (category Ll: Letter, lowercase)
```


```julia
julia> a = Iterators.Stateful([1,1,1,2,3,4]);

julia> for x in a; x == 1 || break; end

julia> peek(a)
3

julia> sum(a) # Sum the remaining elements
7
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L1386-L1443)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.zip' href='#Base.Iterators.zip'>#</a>&nbsp;<b><u>Base.Iterators.zip</u></b> &mdash; <i>Function</i>.




```julia
zip(iters...)
```


Run multiple iterators at the same time, until any of them is exhausted. The value type of the `zip` iterator is a tuple of values of its subiterators.

::: tip Note

`zip` orders the calls to its subiterators in such a way that stateful iterators will not advance when another iterator finishes in the current iteration.

:::

::: tip Note

`zip()` with no arguments yields an infinite iterator of empty tuples.

:::

See also: [`enumerate`](/base/iterators#Base.Iterators.enumerate), [`Base.splat`](/base/base#Base.splat).

**Examples**

```julia
julia> a = 1:5
1:5

julia> b = ["e","d","b","c","a"]
5-element Vector{String}:
 "e"
 "d"
 "b"
 "c"
 "a"

julia> c = zip(a,b)
zip(1:5, ["e", "d", "b", "c", "a"])

julia> length(c)
5

julia> first(c)
(1, "e")
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L333-L371)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.enumerate' href='#Base.Iterators.enumerate'>#</a>&nbsp;<b><u>Base.Iterators.enumerate</u></b> &mdash; <i>Function</i>.




```julia
enumerate(iter)
```


An iterator that yields `(i, x)` where `i` is a counter starting at 1, and `x` is the `i`th value from the given iterator. It&#39;s useful when you need not only the values `x` over which you are iterating, but also the number of iterations so far.

Note that `i` may not be valid for indexing `iter`, or may index a different element. This will happen if `iter` has indices that do not start at 1, and may happen for strings, dictionaries, etc. See the `pairs(IndexLinear(), iter)` method if you want to ensure that `i` is an index.

**Examples**

```julia
julia> a = ["a", "b", "c"];

julia> for (index, value) in enumerate(a)
           println("$index $value")
       end
1 a
2 b
3 c

julia> str = "naïve";

julia> for (i, val) in enumerate(str)
           print("i = ", i, ", val = ", val, ", ")
           try @show(str[i]) catch e println(e) end
       end
i = 1, val = n, str[i] = 'n'
i = 2, val = a, str[i] = 'a'
i = 3, val = ï, str[i] = 'ï'
i = 4, val = v, StringIndexError("naïve", 4)
i = 5, val = e, str[i] = 'v'
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L161-L197)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.rest' href='#Base.Iterators.rest'>#</a>&nbsp;<b><u>Base.Iterators.rest</u></b> &mdash; <i>Function</i>.




```julia
rest(iter, state)
```


An iterator that yields the same elements as `iter`, but starting at the given `state`.

See also: [`Iterators.drop`](/base/iterators#Base.Iterators.drop), [`Iterators.peel`](/base/iterators#Base.Iterators.peel), [`Base.rest`](/base/collections#Base.rest).

**Examples**

```julia
julia> collect(Iterators.rest([1,2,3,4], 2))
3-element Vector{Int64}:
 2
 3
 4
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L634-L649)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.countfrom' href='#Base.Iterators.countfrom'>#</a>&nbsp;<b><u>Base.Iterators.countfrom</u></b> &mdash; <i>Function</i>.




```julia
countfrom(start=1, step=1)
```


An iterator that counts forever, starting at `start` and incrementing by `step`.

**Examples**

```julia
julia> for v in Iterators.countfrom(5, 2)
           v > 10 && break
           println(v)
       end
5
7
9
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L702-L717)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.take' href='#Base.Iterators.take'>#</a>&nbsp;<b><u>Base.Iterators.take</u></b> &mdash; <i>Function</i>.




```julia
take(iter, n)
```


An iterator that generates at most the first `n` elements of `iter`.

See also: [`drop`](/base/iterators#Base.Iterators.drop), [`peel`](/base/iterators#Base.Iterators.peel), [`first`](/base/collections#Base.first), [`Base.take!`](/base/io-network#Base.take!-Tuple{Base.GenericIOBuffer}).

**Examples**

```julia
julia> a = 1:2:11
1:2:11

julia> collect(a)
6-element Vector{Int64}:
  1
  3
  5
  7
  9
 11

julia> collect(Iterators.take(a,3))
3-element Vector{Int64}:
 1
 3
 5
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L741-L768)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.takewhile' href='#Base.Iterators.takewhile'>#</a>&nbsp;<b><u>Base.Iterators.takewhile</u></b> &mdash; <i>Function</i>.




```julia
takewhile(pred, iter)
```


An iterator that generates element from `iter` as long as predicate `pred` is true, afterwards, drops every element.

::: tip Julia 1.4

This function requires at least Julia 1.4.

:::

**Examples**

```julia
julia> s = collect(1:5)
5-element Vector{Int64}:
 1
 2
 3
 4
 5

julia> collect(Iterators.takewhile(<(3),s))
2-element Vector{Int64}:
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L856-L881)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.drop' href='#Base.Iterators.drop'>#</a>&nbsp;<b><u>Base.Iterators.drop</u></b> &mdash; <i>Function</i>.




```julia
drop(iter, n)
```


An iterator that generates all but the first `n` elements of `iter`.

**Examples**

```julia
julia> a = 1:2:11
1:2:11

julia> collect(a)
6-element Vector{Int64}:
  1
  3
  5
  7
  9
 11

julia> collect(Iterators.drop(a,4))
2-element Vector{Int64}:
  9
 11
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L800-L824)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.dropwhile' href='#Base.Iterators.dropwhile'>#</a>&nbsp;<b><u>Base.Iterators.dropwhile</u></b> &mdash; <i>Function</i>.




```julia
dropwhile(pred, iter)
```


An iterator that drops element from `iter` as long as predicate `pred` is true, afterwards, returns every element.

::: tip Julia 1.4

This function requires at least Julia 1.4.

:::

**Examples**

```julia
julia> s = collect(1:5)
5-element Vector{Int64}:
 1
 2
 3
 4
 5

julia> collect(Iterators.dropwhile(<(3),s))
3-element Vector{Int64}:
 3
 4
 5
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L903-L929)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.cycle' href='#Base.Iterators.cycle'>#</a>&nbsp;<b><u>Base.Iterators.cycle</u></b> &mdash; <i>Function</i>.




```julia
cycle(iter[, n::Int])
```


An iterator that cycles through `iter` forever. If `n` is specified, then it cycles through `iter` that many times. When `iter` is empty, so are `cycle(iter)` and `cycle(iter, n)`.

`Iterators.cycle(iter, n)` is the lazy equivalent of [`Base.repeat`](/base/arrays#Base.repeat)`(vector, n)`, while [`Iterators.repeated`](/base/iterators#Base.Iterators.repeated)`(iter, n)` is the lazy [`Base.fill`](/base/arrays#Base.fill)`(item, n)`.

::: tip Julia 1.11

The method `cycle(iter, n)` was added in Julia 1.11.

:::

**Examples**

```julia
julia> for (i, v) in enumerate(Iterators.cycle("hello"))
           print(v)
           i > 10 && break
       end
hellohelloh

julia> foreach(print, Iterators.cycle(['j', 'u', 'l', 'i', 'a'], 3))
juliajuliajulia

julia> repeat([1,2,3], 4) == collect(Iterators.cycle([1,2,3], 4))
true

julia> fill([1,2,3], 4) == collect(Iterators.repeated([1,2,3], 4))
true
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L953-L983)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.repeated' href='#Base.Iterators.repeated'>#</a>&nbsp;<b><u>Base.Iterators.repeated</u></b> &mdash; <i>Function</i>.




```julia
repeated(x[, n::Int])
```


An iterator that generates the value `x` forever. If `n` is specified, generates `x` that many times (equivalent to `take(repeated(x), n)`).

See also [`fill`](/base/arrays#Base.fill), and compare [`Iterators.cycle`](/base/iterators#Base.Iterators.cycle).

**Examples**

```julia
julia> a = Iterators.repeated([1 2], 4);

julia> collect(a)
4-element Vector{Matrix{Int64}}:
 [1 2]
 [1 2]
 [1 2]
 [1 2]

julia> ans == fill([1 2], 4)
true

julia> Iterators.cycle([1 2], 4) |> collect |> println
[1, 2, 1, 2, 1, 2, 1, 2]
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L1010-L1035)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.product' href='#Base.Iterators.product'>#</a>&nbsp;<b><u>Base.Iterators.product</u></b> &mdash; <i>Function</i>.




```julia
product(iters...)
```


Return an iterator over the product of several iterators. Each generated element is a tuple whose `i`th element comes from the `i`th argument iterator. The first iterator changes the fastest.

See also: [`zip`](/base/iterators#Base.Iterators.zip), [`Iterators.flatten`](/base/iterators#Base.Iterators.flatten).

**Examples**

```julia
julia> collect(Iterators.product(1:2, 3:5))
2×3 Matrix{Tuple{Int64, Int64}}:
 (1, 3)  (1, 4)  (1, 5)
 (2, 3)  (2, 4)  (2, 5)

julia> ans == [(x,y) for x in 1:2, y in 3:5]  # collects a generator involving Iterators.product
true
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L1053-L1072)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.flatten' href='#Base.Iterators.flatten'>#</a>&nbsp;<b><u>Base.Iterators.flatten</u></b> &mdash; <i>Function</i>.




```julia
flatten(iter)
```


Given an iterator that yields iterators, return an iterator that yields the elements of those iterators. Put differently, the elements of the argument iterator are concatenated.

**Examples**

```julia
julia> collect(Iterators.flatten((1:2, 8:9)))
4-element Vector{Int64}:
 1
 2
 8
 9

julia> [(x,y) for x in 0:1 for y in 'a':'c']  # collects generators involving Iterators.flatten
6-element Vector{Tuple{Int64, Char}}:
 (0, 'a')
 (0, 'b')
 (0, 'c')
 (1, 'a')
 (1, 'b')
 (1, 'c')
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L1187-L1212)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.flatmap' href='#Base.Iterators.flatmap'>#</a>&nbsp;<b><u>Base.Iterators.flatmap</u></b> &mdash; <i>Function</i>.




```julia
Iterators.flatmap(f, iterators...)
```


Equivalent to `flatten(map(f, iterators...))`.

See also [`Iterators.flatten`](/base/iterators#Base.Iterators.flatten), [`Iterators.map`](/base/iterators#Base.Iterators.map).

::: tip Julia 1.9

This function was added in Julia 1.9.

:::

**Examples**

```julia
julia> Iterators.flatmap(n -> -n:2:n, 1:3) |> collect
9-element Vector{Int64}:
 -1
  1
 -2
  0
  2
 -3
 -1
  1
  3

julia> stack(n -> -n:2:n, 1:3)
ERROR: DimensionMismatch: stack expects uniform slices, got axes(x) == (1:3,) while first had (1:2,)
[...]

julia> Iterators.flatmap(n -> (-n, 10n), 1:2) |> collect
4-element Vector{Int64}:
 -1
 10
 -2
 20

julia> ans == vec(stack(n -> (-n, 10n), 1:2))
true
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L1263-L1301)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.partition' href='#Base.Iterators.partition'>#</a>&nbsp;<b><u>Base.Iterators.partition</u></b> &mdash; <i>Function</i>.




```julia
partition(collection, n)
```


Iterate over a collection `n` elements at a time.

**Examples**

```julia
julia> collect(Iterators.partition([1,2,3,4,5], 2))
3-element Vector{SubArray{Int64, 1, Vector{Int64}, Tuple{UnitRange{Int64}}, true}}:
 [1, 2]
 [3, 4]
 [5]
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L1305-L1318)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.map' href='#Base.Iterators.map'>#</a>&nbsp;<b><u>Base.Iterators.map</u></b> &mdash; <i>Function</i>.




```julia
Iterators.map(f, iterators...)
```


Create a lazy mapping.  This is another syntax for writing `(f(args...) for args in zip(iterators...))`.

::: tip Julia 1.6

This function requires at least Julia 1.6.

:::

**Examples**

```julia
julia> collect(Iterators.map(x -> x^2, 1:3))
3-element Vector{Int64}:
 1
 4
 9
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L45-L62)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.filter' href='#Base.Iterators.filter'>#</a>&nbsp;<b><u>Base.Iterators.filter</u></b> &mdash; <i>Function</i>.




```julia
Iterators.filter(flt, itr)
```


Given a predicate function `flt` and an iterable object `itr`, return an iterable object which upon iteration yields the elements `x` of `itr` that satisfy `flt(x)`. The order of the original iterator is preserved.

This function is _lazy_; that is, it is guaranteed to return in $Θ(1)$ time and use $Θ(1)$ additional space, and `flt` will not be called by an invocation of `filter`. Calls to `flt` will be made when iterating over the returned iterable object. These calls are not cached and repeated calls will be made when reiterating.

::: warning Warning

Subsequent _lazy_ transformations on the iterator returned from `filter`, such as those performed by `Iterators.reverse` or `cycle`, will also delay calls to `flt` until collecting or iterating over the returned iterable object. If the filter predicate is nondeterministic or its return values depend on the order of iteration over the elements of `itr`, composition with lazy transformations may result in surprising behavior. If this is undesirable, either ensure that `flt` is a pure function or collect intermediate `filter` iterators before further transformations.

:::

See [`Base.filter`](/base/collections#Base.filter) for an eager implementation of filtering for arrays.

**Examples**

```julia
julia> f = Iterators.filter(isodd, [1, 2, 3, 4, 5])
Base.Iterators.Filter{typeof(isodd), Vector{Int64}}(isodd, [1, 2, 3, 4, 5])

julia> foreach(println, f)
1
3
5

julia> [x for x in [1, 2, 3, 4, 5] if isodd(x)]  # collects a generator over Iterators.filter
3-element Vector{Int64}:
 1
 3
 5
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L500-L540)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.accumulate' href='#Base.Iterators.accumulate'>#</a>&nbsp;<b><u>Base.Iterators.accumulate</u></b> &mdash; <i>Function</i>.




```julia
Iterators.accumulate(f, itr; [init])
```


Given a 2-argument function `f` and an iterator `itr`, return a new iterator that successively applies `f` to the previous value and the next element of `itr`.

This is effectively a lazy version of [`Base.accumulate`](/base/arrays#Base.accumulate).

::: tip Julia 1.5

Keyword argument `init` is added in Julia 1.5.

:::

**Examples**

```julia
julia> a = Iterators.accumulate(+, [1,2,3,4]);

julia> foreach(println, a)
1
3
6
10

julia> b = Iterators.accumulate(/, (2, 5, 2, 5); init = 100);

julia> collect(b)
4-element Vector{Float64}:
 50.0
 10.0
  5.0
  1.0
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L569-L600)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.reverse' href='#Base.Iterators.reverse'>#</a>&nbsp;<b><u>Base.Iterators.reverse</u></b> &mdash; <i>Function</i>.




```julia
Iterators.reverse(itr)
```


Given an iterator `itr`, then `reverse(itr)` is an iterator over the same collection but in the reverse order. This iterator is &quot;lazy&quot; in that it does not make a copy of the collection in order to reverse it; see [`Base.reverse`](/base/arrays#Base.reverse-Tuple{AbstractVector}) for an eager implementation.

(By default, this returns an `Iterators.Reverse` object wrapping `itr`, which is iterable if the corresponding [`iterate`](/base/collections#Base.iterate) methods are defined, but some `itr` types may implement more specialized `Iterators.reverse` behaviors.)

Not all iterator types `T` support reverse-order iteration.  If `T` doesn&#39;t, then iterating over `Iterators.reverse(itr::T)` will throw a [`MethodError`](/base/base#Core.MethodError) because of the missing `iterate` methods for `Iterators.Reverse{T}`. (To implement these methods, the original iterator `itr::T` can be obtained from an `r::Iterators.Reverse{T}` object by `r.itr`; more generally, one can use `Iterators.reverse(r)`.)

**Examples**

```julia
julia> foreach(println, Iterators.reverse(1:5))
5
4
3
2
1
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L88-L117)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.only' href='#Base.Iterators.only'>#</a>&nbsp;<b><u>Base.Iterators.only</u></b> &mdash; <i>Function</i>.




```julia
only(x)
```


Return the one and only element of collection `x`, or throw an [`ArgumentError`](/base/base#Core.ArgumentError) if the collection has zero or multiple elements.

See also [`first`](/base/collections#Base.first), [`last`](/base/collections#Base.last).

::: tip Julia 1.4

This method requires at least Julia 1.4.

:::

**Examples**

```julia
julia> only(["a"])
"a"

julia> only("a")
'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)

julia> only(())
ERROR: ArgumentError: Tuple contains 0 elements, must contain exactly 1 element
Stacktrace:
[...]

julia> only(('a', 'b'))
ERROR: ArgumentError: Tuple contains 2 elements, must contain exactly 1 element
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L1513-L1542)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators.peel' href='#Base.Iterators.peel'>#</a>&nbsp;<b><u>Base.Iterators.peel</u></b> &mdash; <i>Function</i>.




```julia
peel(iter)
```


Returns the first element and an iterator over the remaining elements.

If the iterator is empty return `nothing` (like `iterate`).

::: tip Julia 1.7

Prior versions throw a BoundsError if the iterator is empty.

:::

See also: [`Iterators.drop`](/base/iterators#Base.Iterators.drop), [`Iterators.take`](/base/iterators#Base.Iterators.take).

**Examples**

```julia
julia> (a, rest) = Iterators.peel("abc");

julia> a
'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)

julia> collect(rest)
2-element Vector{Char}:
 'b': ASCII/Unicode U+0062 (category Ll: Letter, lowercase)
 'c': ASCII/Unicode U+0063 (category Ll: Letter, lowercase)
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/iterators.jl#L654-L678)

</div>
<br>
