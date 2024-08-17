
# Collections and Data Structures {#Collections-and-Data-Structures}

## Iteration {#lib-collections-iteration}

Sequential iteration is implemented by the [`iterate`](/base/collections#Base.iterate) function. The general `for` loop:

```julia
for i in iter   # or  "for i = iter"
    # body
end
```


is translated into:

```julia
next = iterate(iter)
while next !== nothing
    (i, state) = next
    # body
    next = iterate(iter, state)
end
```


The `state` object may be anything, and should be chosen appropriately for each iterable type. See the [manual section on the iteration interface](/manual/interfaces#man-interface-iteration) for more details about defining a custom iterable type.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.iterate' href='#Base.iterate'>#</a>&nbsp;<b><u>Base.iterate</u></b> &mdash; <i>Function</i>.




```julia
iterate(iter [, state]) -> Union{Nothing, Tuple{Any, Any}}
```


Advance the iterator to obtain the next element. If no elements remain, `nothing` should be returned. Otherwise, a 2-tuple of the next element and the new iteration state should be returned.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L1233-L1239)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IteratorSize' href='#Base.IteratorSize'>#</a>&nbsp;<b><u>Base.IteratorSize</u></b> &mdash; <i>Type</i>.




```julia
IteratorSize(itertype::Type) -> IteratorSize
```


Given the type of an iterator, return one of the following values:
- `SizeUnknown()` if the length (number of elements) cannot be determined in advance.
  
- `HasLength()` if there is a fixed, finite length.
  
- `HasShape{N}()` if there is a known length plus a notion of multidimensional shape (as for an array).  In this case `N` should give the number of dimensions, and the [`axes`](/base/arrays#Base.axes-Tuple{Any}) function is valid  for the iterator.
  
- `IsInfinite()` if the iterator yields values forever.
  

The default value (for iterators that do not define this function) is `HasLength()`. This means that most iterators are assumed to implement [`length`](/base/collections#Base.length).

This trait is generally used to select between algorithms that pre-allocate space for their result, and algorithms that resize their result incrementally.

```julia
julia> Base.IteratorSize(1:5)
Base.HasShape{1}()

julia> Base.IteratorSize((2,3))
Base.HasLength()
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/generator.jl#L68-L93)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IteratorEltype' href='#Base.IteratorEltype'>#</a>&nbsp;<b><u>Base.IteratorEltype</u></b> &mdash; <i>Type</i>.




```julia
IteratorEltype(itertype::Type) -> IteratorEltype
```


Given the type of an iterator, return one of the following values:
- `EltypeUnknown()` if the type of elements yielded by the iterator is not known in advance.
  
- `HasEltype()` if the element type is known, and [`eltype`](/base/collections#Base.eltype) would return a meaningful value.
  

`HasEltype()` is the default, since iterators are assumed to implement [`eltype`](/base/collections#Base.eltype).

This trait is generally used to select between algorithms that pre-allocate a specific type of result, and algorithms that pick a result type based on the types of yielded values.

```julia
julia> Base.IteratorEltype(1:5)
Base.HasEltype()
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/generator.jl#L109-L127)

</div>
<br>

Fully implemented by:
- [`AbstractRange`](/base/collections#Base.AbstractRange)
  
- [`UnitRange`](/base/collections#Base.UnitRange)
  
- [`Tuple`](/base/base#Core.Tuple)
  
- [`Number`](/base/numbers#Core.Number)
  
- [`AbstractArray`](/base/arrays#Core.AbstractArray)
  
- [`BitSet`](/base/collections#Base.BitSet)
  
- [`IdDict`](/base/collections#Base.IdDict)
  
- [`Dict`](/base/collections#Base.Dict)
  
- [`WeakKeyDict`](/base/collections#Base.WeakKeyDict)
  
- `EachLine`
  
- [`AbstractString`](/base/strings#Core.AbstractString)
  
- [`Set`](/base/collections#Base.Set)
  
- [`Pair`](/base/collections#Core.Pair)
  
- [`NamedTuple`](/base/base#Core.NamedTuple)
  

## Constructors and Types {#Constructors-and-Types}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractRange' href='#Base.AbstractRange'>#</a>&nbsp;<b><u>Base.AbstractRange</u></b> &mdash; <i>Type</i>.




```julia
AbstractRange{T} <: AbstractVector{T}
```


Supertype for linear ranges with elements of type `T`. [`UnitRange`](/base/collections#Base.UnitRange), [`LinRange`](/base/collections#Base.LinRange) and other types are subtypes of this.

All subtypes must define [`step`](/base/collections#Base.step). Thus [`LogRange`](/base/math#Base.LogRange) is not a subtype of `AbstractRange`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L262-L270)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.OrdinalRange' href='#Base.OrdinalRange'>#</a>&nbsp;<b><u>Base.OrdinalRange</u></b> &mdash; <i>Type</i>.




```julia
OrdinalRange{T, S} <: AbstractRange{T}
```


Supertype for ordinal ranges with elements of type `T` with spacing(s) of type `S`. The steps should be always-exact multiples of [`oneunit`](/base/numbers#Base.oneunit), and `T` should be a &quot;discrete&quot; type, which cannot have values smaller than `oneunit`. For example, `Integer` or `Date` types would qualify, whereas `Float64` would not (since this type can represent values smaller than `oneunit(Float64)`. [`UnitRange`](/base/collections#Base.UnitRange), [`StepRange`](/base/collections#Base.StepRange), and other types are subtypes of this.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L280-L290)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractUnitRange' href='#Base.AbstractUnitRange'>#</a>&nbsp;<b><u>Base.AbstractUnitRange</u></b> &mdash; <i>Type</i>.




```julia
AbstractUnitRange{T} <: OrdinalRange{T, T}
```


Supertype for ranges with a step size of [`oneunit(T)`](/base/numbers#Base.oneunit) with elements of type `T`. [`UnitRange`](/base/collections#Base.UnitRange) and other types are subtypes of this.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L293-L298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StepRange' href='#Base.StepRange'>#</a>&nbsp;<b><u>Base.StepRange</u></b> &mdash; <i>Type</i>.




```julia
StepRange{T, S} <: OrdinalRange{T, S}
```


Ranges with elements of type `T` with spacing of type `S`. The step between each element is constant, and the range is defined in terms of a `start` and `stop` of type `T` and a `step` of type `S`. Neither `T` nor `S` should be floating point types. The syntax `a:b:c` with `b != 0` and `a`, `b`, and `c` all integers creates a `StepRange`.

**Examples**

```julia
julia> collect(StepRange(1, Int8(2), 10))
5-element Vector{Int64}:
 1
 3
 5
 7
 9

julia> typeof(StepRange(1, Int8(2), 10))
StepRange{Int64, Int8}

julia> typeof(1:3:6)
StepRange{Int64, Int64}
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L301-L326)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.UnitRange' href='#Base.UnitRange'>#</a>&nbsp;<b><u>Base.UnitRange</u></b> &mdash; <i>Type</i>.




```julia
UnitRange{T<:Real}
```


A range parameterized by a `start` and `stop` of type `T`, filled with elements spaced by `1` from `start` until `stop` is exceeded. The syntax `a:b` with `a` and `b` both `Integer`s creates a `UnitRange`.

**Examples**

```julia
julia> collect(UnitRange(2.3, 5.2))
3-element Vector{Float64}:
 2.3
 3.3
 4.3

julia> typeof(1:10)
UnitRange{Int64}
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L393-L411)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.LinRange' href='#Base.LinRange'>#</a>&nbsp;<b><u>Base.LinRange</u></b> &mdash; <i>Type</i>.




```julia
LinRange{T,L}
```


A range with `len` linearly spaced elements between its `start` and `stop`. The size of the spacing is controlled by `len`, which must be an `Integer`.

**Examples**

```julia
julia> LinRange(1.5, 5.5, 9)
9-element LinRange{Float64, Int64}:
 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5
```


Compared to using [`range`](/base/math#Base.range), directly constructing a `LinRange` should have less overhead but won&#39;t try to correct for floating point errors:

```julia
julia> collect(range(-0.1, 0.3, length=5))
5-element Vector{Float64}:
 -0.1
  0.0
  0.1
  0.2
  0.3

julia> collect(LinRange(-0.1, 0.3, 5))
5-element Vector{Float64}:
 -0.1
 -1.3877787807814457e-17
  0.09999999999999999
  0.19999999999999998
  0.3
```


See also [`Logrange`](/base/math#Base.LogRange) for logarithmically spaced points.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L531-L566)

</div>
<br>

## General Collections {#General-Collections}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isempty' href='#Base.isempty'>#</a>&nbsp;<b><u>Base.isempty</u></b> &mdash; <i>Function</i>.




```julia
isempty(collection) -> Bool
```


Determine whether a collection is empty (has no elements).

::: warning Warning

`isempty(itr)` may consume the next element of a stateful iterator `itr` unless an appropriate [`Base.isdone(itr)`](/base/collections#Base.isdone) method is defined. Stateful iterators _should_ implement `isdone`, but you may want to avoid using `isempty` when writing generic code which should support any iterator type.

:::

**Examples**

```julia
julia> isempty([])
true

julia> isempty([1 2 3])
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L1095-L1116)



```julia
isempty(condition)
```


Return `true` if no tasks are waiting on the condition, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/condition.jl#L172-L176)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isdone' href='#Base.isdone'>#</a>&nbsp;<b><u>Base.isdone</u></b> &mdash; <i>Function</i>.




```julia
isdone(itr, [state]) -> Union{Bool, Missing}
```


This function provides a fast-path hint for iterator completion. This is useful for stateful iterators that want to avoid having elements consumed if they are not going to be exposed to the user (e.g. when checking for done-ness in `isempty` or `zip`).

Stateful iterators that want to opt into this feature should define an `isdone` method that returns true/false depending on whether the iterator is done or not. Stateless iterators need not implement this function.

If the result is `missing`, callers may go ahead and compute `iterate(x, state) === nothing` to compute a definite answer.

See also [`iterate`](/base/collections#Base.iterate), [`isempty`](/base/collections#Base.isempty)


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L1214-L1230)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.empty!' href='#Base.empty!'>#</a>&nbsp;<b><u>Base.empty!</u></b> &mdash; <i>Function</i>.




```julia
empty!(collection) -> collection
```


Remove all elements from a `collection`.

**Examples**

```julia
julia> A = Dict("a" => 1, "b" => 2)
Dict{String, Int64} with 2 entries:
  "b" => 2
  "a" => 1

julia> empty!(A);

julia> A
Dict{String, Int64}()
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L202-L219)



```julia
empty!(c::Channel)
```


Empty a Channel `c` by calling `empty!` on the internal buffer. Return the empty channel.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L221-L226)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.length' href='#Base.length'>#</a>&nbsp;<b><u>Base.length</u></b> &mdash; <i>Function</i>.




```julia
length(collection) -> Integer
```


Return the number of elements in the collection.

Use [`lastindex`](/base/collections#Base.lastindex) to get the last valid index of an indexable collection.

See also: [`size`](/base/arrays#Base.size), [`ndims`](/base/arrays#Base.ndims), [`eachindex`](/base/arrays#Base.eachindex).

**Examples**

```julia
julia> length(1:5)
5

julia> length([1, 2, 3, 4])
4

julia> length([1 2; 3 4])
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L278-L298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.checked_length' href='#Base.checked_length'>#</a>&nbsp;<b><u>Base.checked_length</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_length(r)
```


Calculates `length(r)`, but may check for overflow errors where applicable when the result doesn&#39;t fit into `Union{Integer(eltype(r)),Int}`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/checked.jl#L374-L379)

</div>
<br>

Fully implemented by:
- [`AbstractRange`](/base/collections#Base.AbstractRange)
  
- [`UnitRange`](/base/collections#Base.UnitRange)
  
- [`Tuple`](/base/base#Core.Tuple)
  
- [`Number`](/base/numbers#Core.Number)
  
- [`AbstractArray`](/base/arrays#Core.AbstractArray)
  
- [`BitSet`](/base/collections#Base.BitSet)
  
- [`IdDict`](/base/collections#Base.IdDict)
  
- [`Dict`](/base/collections#Base.Dict)
  
- [`WeakKeyDict`](/base/collections#Base.WeakKeyDict)
  
- [`AbstractString`](/base/strings#Core.AbstractString)
  
- [`Set`](/base/collections#Base.Set)
  
- [`NamedTuple`](/base/base#Core.NamedTuple)
  

## Iterable Collections {#Iterable-Collections}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.in' href='#Base.in'>#</a>&nbsp;<b><u>Base.in</u></b> &mdash; <i>Function</i>.




```julia
in(item, collection) -> Bool
∈(item, collection) -> Bool
```


Determine whether an item is in the given collection, in the sense that it is [`==`](/base/math#Base.:==) to one of the values generated by iterating over the collection. Can equivalently be used with infix syntax:

```
item in collection
item ∈ collection
```


Return a `Bool` value, except if `item` is [`missing`](/manual/missing#missing) or `collection` contains `missing` but not `item`, in which case `missing` is returned ([three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic), matching the behavior of [`any`](/base/collections#Base.any-Tuple{Any}) and [`==`](/base/math#Base.:==)). Some collections follow a slightly different definition. For example, [`Set`](/base/collections#Base.Set)s check whether the item [`isequal`](/base/base#Base.isequal) to one of the elements; [`Dict`](/base/collections#Base.Dict)s look for `key=>value` pairs, and the `key` is compared using [`isequal`](/base/base#Base.isequal).

To test for the presence of a key in a dictionary, use [`haskey`](/base/collections#Base.haskey) or `k in keys(dict)`. For the collections mentioned above, the result is always a `Bool`.

When broadcasting with `in.(items, collection)` or `items .∈ collection`, both `items` and `collection` are broadcasted over, which is often not what is intended. For example, if both arguments are vectors (and the dimensions match), the result is a vector indicating whether each value in collection `items` is `in` the value at the corresponding position in `collection`. To get a vector indicating whether each value in `items` is in `collection`, wrap `collection` in a tuple or a `Ref` like this: `in.(items, Ref(collection))` or `items .∈ Ref(collection)`.

See also: [`∉`](/base/collections#Base.:∉), [`insorted`](/base/sort#Base.Sort.insorted), [`contains`](/base/strings#Base.contains), [`occursin`](/base/strings#Base.occursin), [`issubset`](/base/collections#Base.issubset).

**Examples**

```julia
julia> a = 1:3:20
1:3:19

julia> 4 in a
true

julia> 5 in a
false

julia> missing in [1, 2]
missing

julia> 1 in [2, missing]
missing

julia> 1 in [1, missing]
true

julia> missing in Set([1, 2])
false

julia> (1=>missing) in Dict(1=>10, 2=>20)
missing

julia> [1, 2] .∈ [2, 3]
2-element BitVector:
 0
 0

julia> [1, 2] .∈ ([2, 3],)
2-element BitVector:
 0
 1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/operators.jl#L1423-L1493)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:∉' href='#Base.:∉'>#</a>&nbsp;<b><u>Base.:∉</u></b> &mdash; <i>Function</i>.




```julia
∉(item, collection) -> Bool
∌(collection, item) -> Bool
```


Negation of `∈` and `∋`, i.e. checks that `item` is not in `collection`.

When broadcasting with `items .∉ collection`, both `items` and `collection` are broadcasted over, which is often not what is intended. For example, if both arguments are vectors (and the dimensions match), the result is a vector indicating whether each value in collection `items` is not in the value at the corresponding position in `collection`. To get a vector indicating whether each value in `items` is not in `collection`, wrap `collection` in a tuple or a `Ref` like this: `items .∉ Ref(collection)`.

**Examples**

```julia
julia> 1 ∉ 2:4
true

julia> 1 ∉ 1:3
false

julia> [1, 2] .∉ [2, 3]
2-element BitVector:
 1
 1

julia> [1, 2] .∉ ([2, 3],)
2-element BitVector:
 1
 0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/operators.jl#L1496-L1528)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hasfastin' href='#Base.hasfastin'>#</a>&nbsp;<b><u>Base.hasfastin</u></b> &mdash; <i>Function</i>.




```julia
Base.hasfastin(T)
```


Determine whether the computation `x ∈ collection` where `collection::T` can be considered as a &quot;fast&quot; operation (typically constant or logarithmic complexity). The definition `hasfastin(x) = hasfastin(typeof(x))` is provided for convenience so that instances can be passed instead of types. However the form that accepts a type argument should be defined for new types.

The default for `hasfastin(T)` is `true` for subtypes of [`AbstractSet`](/base/collections#Base.AbstractSet), [`AbstractDict`](/base/collections#Base.AbstractDict) and [`AbstractRange`](/base/collections#Base.AbstractRange) and `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L348-L360)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eltype' href='#Base.eltype'>#</a>&nbsp;<b><u>Base.eltype</u></b> &mdash; <i>Function</i>.




```julia
eltype(type)
```


Determine the type of the elements generated by iterating a collection of the given `type`. For dictionary types, this will be a `Pair{KeyType,ValType}`. The definition `eltype(x) = eltype(typeof(x))` is provided for convenience so that instances can be passed instead of types. However the form that accepts a type argument should be defined for new types.

See also: [`keytype`](/base/collections#Base.keytype), [`typeof`](/base/base#Core.typeof).

**Examples**

```julia
julia> eltype(fill(1f0, (2,2)))
Float32

julia> eltype(fill(0x1, (2,2)))
UInt8
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L219-L238)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.indexin' href='#Base.indexin'>#</a>&nbsp;<b><u>Base.indexin</u></b> &mdash; <i>Function</i>.




```julia
indexin(a, b)
```


Return an array containing the first index in `b` for each value in `a` that is a member of `b`. The output array contains `nothing` wherever `a` is not a member of `b`.

See also: [`sortperm`](/base/sort#Base.sortperm), [`findfirst`](/base/arrays#Base.findfirst-Tuple{Any}).

**Examples**

```julia
julia> a = ['a', 'b', 'c', 'b', 'd', 'a'];

julia> b = ['a', 'b', 'c'];

julia> indexin(a, b)
6-element Vector{Union{Nothing, Int64}}:
 1
 2
 3
 2
  nothing
 1

julia> indexin(b, a)
3-element Vector{Union{Nothing, Int64}}:
 1
 2
 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L2719-L2749)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unique' href='#Base.unique'>#</a>&nbsp;<b><u>Base.unique</u></b> &mdash; <i>Function</i>.




```julia
unique(itr)
```


Return an array containing only the unique elements of collection `itr`, as determined by [`isequal`](/base/base#Base.isequal) and [`hash`](/base/base#Base.hash), in the order that the first of each set of equivalent elements originally appears. The element type of the input is preserved.

See also: [`unique!`](/base/collections#Base.unique!), [`allunique`](/base/collections#Base.allunique), [`allequal`](/base/collections#Base.allequal).

**Examples**

```julia
julia> unique([1, 2, 6, 2])
3-element Vector{Int64}:
 1
 2
 6

julia> unique(Real[1, 1.0, 2])
2-element Vector{Real}:
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L200-L223)



```julia
unique(f, itr)
```


Return an array containing one value from `itr` for each unique value produced by `f` applied to elements of `itr`.

**Examples**

```julia
julia> unique(x -> x^2, [1, -1, 3, -3, 4])
3-element Vector{Int64}:
 1
 3
 4
```


This functionality can also be used to extract the _indices_ of the first occurrences of unique elements in an array:

```julia
julia> a = [3.1, 4.2, 5.3, 3.1, 3.1, 3.1, 4.2, 1.7];

julia> i = unique(i -> a[i], eachindex(a))
4-element Vector{Int64}:
 1
 2
 3
 8

julia> a[i]
4-element Vector{Float64}:
 3.1
 4.2
 5.3
 1.7

julia> a[i] == unique(a)
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L264-L300)



```julia
unique(A::AbstractArray; dims::Int)
```


Return unique regions of `A` along dimension `dims`.

**Examples**

```julia
julia> A = map(isodd, reshape(Vector(1:8), (2,2,2)))
2×2×2 Array{Bool, 3}:
[:, :, 1] =
 1  1
 0  0

[:, :, 2] =
 1  1
 0  0

julia> unique(A)
2-element Vector{Bool}:
 1
 0

julia> unique(A, dims=2)
2×1×2 Array{Bool, 3}:
[:, :, 1] =
 1
 0

[:, :, 2] =
 1
 0

julia> unique(A, dims=3)
2×2×1 Array{Bool, 3}:
[:, :, 1] =
 1  1
 0  0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/multidimensional.jl#L1719-L1757)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unique!' href='#Base.unique!'>#</a>&nbsp;<b><u>Base.unique!</u></b> &mdash; <i>Function</i>.




```julia
unique!(f, A::AbstractVector)
```


Selects one value from `A` for each unique value produced by `f` applied to elements of `A`, then return the modified A.

::: tip Julia 1.1

This method is available as of Julia 1.1.

:::

**Examples**

```julia
julia> unique!(x -> x^2, [1, -1, 3, -3, 4])
3-element Vector{Int64}:
 1
 3
 4

julia> unique!(n -> n%3, [5, 1, 8, 9, 3, 4, 10, 7, 2, 6])
3-element Vector{Int64}:
 5
 1
 9

julia> unique!(iseven, [2, 3, 5, 7, 9])
2-element Vector{Int64}:
 2
 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L344-L372)



```julia
unique!(A::AbstractVector)
```


Remove duplicate items as determined by [`isequal`](/base/base#Base.isequal) and [`hash`](/base/base#Base.hash), then return the modified `A`. `unique!` will return the elements of `A` in the order that they occur. If you do not care about the order of the returned data, then calling `(sort!(A); unique!(A))` will be much more efficient as long as the elements of `A` can be sorted.

**Examples**

```julia
julia> unique!([1, 1, 1])
1-element Vector{Int64}:
 1

julia> A = [7, 3, 2, 3, 7, 5];

julia> unique!(A)
4-element Vector{Int64}:
 7
 3
 2
 5

julia> B = [7, 6, 42, 6, 7, 42];

julia> sort!(B);  # unique! is able to process sorted data much more efficiently.

julia> unique!(B)
3-element Vector{Int64}:
  6
  7
 42
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L436-L469)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.allunique' href='#Base.allunique'>#</a>&nbsp;<b><u>Base.allunique</u></b> &mdash; <i>Function</i>.




```julia
allunique(itr) -> Bool
allunique(f, itr) -> Bool
```


Return `true` if all values from `itr` are distinct when compared with [`isequal`](/base/base#Base.isequal). Or if all of `[f(x) for x in itr]` are distinct, for the second method.

Note that `allunique(f, itr)` may call `f` fewer than `length(itr)` times. The precise number of calls is regarded as an implementation detail.

`allunique` may use a specialized implementation when the input is sorted.

See also: [`unique`](/base/collections#Base.unique), [`issorted`](/base/sort#Base.issorted), [`allequal`](/base/collections#Base.allequal).

::: tip Julia 1.11

The method `allunique(f, itr)` requires at least Julia 1.11.

:::

**Examples**

```julia
julia> allunique([1, 2, 3])
true

julia> allunique([1, 2, 1, 2])
false

julia> allunique(Real[1, 1.0, 2])
false

julia> allunique([NaN, 2.0, NaN, 4.0])
false

julia> allunique(abs, [1, -1, 2])
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L480-L514)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.allequal' href='#Base.allequal'>#</a>&nbsp;<b><u>Base.allequal</u></b> &mdash; <i>Function</i>.




```julia
allequal(itr) -> Bool
allequal(f, itr) -> Bool
```


Return `true` if all values from `itr` are equal when compared with [`isequal`](/base/base#Base.isequal). Or if all of `[f(x) for x in itr]` are equal, for the second method.

Note that `allequal(f, itr)` may call `f` fewer than `length(itr)` times. The precise number of calls is regarded as an implementation detail.

See also: [`unique`](/base/collections#Base.unique), [`allunique`](/base/collections#Base.allunique).

::: tip Julia 1.8

The `allequal` function requires at least Julia 1.8.

:::

::: tip Julia 1.11

The method `allequal(f, itr)` requires at least Julia 1.11.

:::

**Examples**

```julia
julia> allequal([])
true

julia> allequal([1])
true

julia> allequal([1, 1])
true

julia> allequal([1, 2])
false

julia> allequal(Dict(:a => 1, :b => 1))
false

julia> allequal(abs2, [1, -1])
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L604-L642)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reduce-Tuple{Any, Any}' href='#Base.reduce-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.reduce</u></b> &mdash; <i>Method</i>.




```julia
reduce(op, itr; [init])
```


Reduce the given collection `itr` with the given binary operator `op`. If provided, the initial value `init` must be a neutral element for `op` that will be returned for empty collections. It is unspecified whether `init` is used for non-empty collections.

For empty collections, providing `init` will be necessary, except for some special cases (e.g. when `op` is one of `+`, `*`, `max`, `min`, `&`, `|`) when Julia can determine the neutral element of `op`.

Reductions for certain commonly-used operators may have special implementations, and should be used instead: [`maximum`](/base/collections#Base.maximum)`(itr)`, [`minimum`](/base/collections#Base.minimum)`(itr)`, [`sum`](/base/collections#Base.sum)`(itr)`, [`prod`](/base/collections#Base.prod)`(itr)`, [`any`](/base/collections#Base.any-Tuple{Any})`(itr)`, [`all`](/base/collections#Base.all-Tuple{Any})`(itr)`. There are efficient methods for concatenating certain arrays of arrays by calling `reduce(`[`vcat`](/base/arrays#Base.vcat)`, arr)` or `reduce(`[`hcat`](/base/arrays#Base.hcat)`, arr)`.

The associativity of the reduction is implementation dependent. This means that you can&#39;t use non-associative operations like `-` because it is undefined whether `reduce(-,[1,2,3])` should be evaluated as `(1-2)-3` or `1-(2-3)`. Use [`foldl`](/base/collections#Base.foldl-Tuple{Any,%20Any}) or [`foldr`](/base/collections#Base.foldr-Tuple{Any,%20Any}) instead for guaranteed left or right associativity.

Some operations accumulate error. Parallelism will be easier if the reduction can be executed in groups. Future versions of Julia might change the algorithm. Note that the elements are not reordered if you use an ordered collection.

**Examples**

```julia
julia> reduce(*, [2; 3; 4])
24

julia> reduce(*, Int[]; init=1)
1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L444-L478)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reduce-Tuple{Any, AbstractArray}' href='#Base.reduce-Tuple{Any, AbstractArray}'>#</a>&nbsp;<b><u>Base.reduce</u></b> &mdash; <i>Method</i>.




```julia
reduce(f, A::AbstractArray; dims=:, [init])
```


Reduce 2-argument function `f` along dimensions of `A`. `dims` is a vector specifying the dimensions to reduce, and the keyword argument `init` is the initial value to use in the reductions. For `+`, `*`, `max` and `min` the `init` argument is optional.

The associativity of the reduction is implementation-dependent; if you need a particular associativity, e.g. left-to-right, you should write your own loop or consider using [`foldl`](/base/collections#Base.foldl-Tuple{Any,%20Any}) or [`foldr`](/base/collections#Base.foldr-Tuple{Any,%20Any}). See documentation for [`reduce`](/base/collections#Base.reduce-Tuple{Any,%20Any}).

**Examples**

```julia
julia> a = reshape(Vector(1:16), (4,4))
4×4 Matrix{Int64}:
 1  5   9  13
 2  6  10  14
 3  7  11  15
 4  8  12  16

julia> reduce(max, a, dims=2)
4×1 Matrix{Int64}:
 13
 14
 15
 16

julia> reduce(max, a, dims=1)
1×4 Matrix{Int64}:
 4  8  12  16
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L342-L373)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.foldl-Tuple{Any, Any}' href='#Base.foldl-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.foldl</u></b> &mdash; <i>Method</i>.




```julia
foldl(op, itr; [init])
```


Like [`reduce`](/base/collections#Base.reduce-Tuple{Any,%20Any}), but with guaranteed left associativity. If provided, the keyword argument `init` will be used exactly once. In general, it will be necessary to provide `init` to work with empty collections.

See also [`mapfoldl`](/base/collections#Base.mapfoldl-Tuple{Any,%20Any,%20Any}), [`foldr`](/base/collections#Base.foldr-Tuple{Any,%20Any}), [`accumulate`](/base/arrays#Base.accumulate).

**Examples**

```julia
julia> foldl(=>, 1:4)
((1 => 2) => 3) => 4

julia> foldl(=>, 1:4; init=0)
(((0 => 1) => 2) => 3) => 4

julia> accumulate(=>, (1,2,3,4))
(1, 1 => 2, (1 => 2) => 3, ((1 => 2) => 3) => 4)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L169-L189)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.foldr-Tuple{Any, Any}' href='#Base.foldr-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.foldr</u></b> &mdash; <i>Method</i>.




```julia
foldr(op, itr; [init])
```


Like [`reduce`](/base/collections#Base.reduce-Tuple{Any,%20Any}), but with guaranteed right associativity. If provided, the keyword argument `init` will be used exactly once. In general, it will be necessary to provide `init` to work with empty collections.

**Examples**

```julia
julia> foldr(=>, 1:4)
1 => (2 => (3 => 4))

julia> foldr(=>, 1:4; init=0)
1 => (2 => (3 => (4 => 0)))
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L218-L233)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.maximum' href='#Base.maximum'>#</a>&nbsp;<b><u>Base.maximum</u></b> &mdash; <i>Function</i>.




```julia
maximum(f, itr; [init])
```


Return the largest result of calling function `f` on each element of `itr`.

The value returned for empty `itr` can be specified by `init`. It must be a neutral element for `max` (i.e. which is less than or equal to any other element) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> maximum(length, ["Julion", "Julia", "Jule"])
6

julia> maximum(length, []; init=-1)
-1

julia> maximum(sin, Real[]; init=-1.0)  # good, since output of sin is >= -1
-1.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L669-L693)



```julia
maximum(itr; [init])
```


Return the largest element in a collection.

The value returned for empty `itr` can be specified by `init`. It must be a neutral element for `max` (i.e. which is less than or equal to any other element) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> maximum(-20.5:10)
9.5

julia> maximum([1,2,3])
3

julia> maximum(())
ERROR: ArgumentError: reducing over an empty collection is not allowed; consider supplying `init` to the reducer
Stacktrace:
[...]

julia> maximum((); init=-Inf)
-Inf
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L723-L752)



```julia
maximum(A::AbstractArray; dims)
```


Compute the maximum value of an array over the given dimensions. See also the [`max(a,b)`](/base/math#Base.max) function to take the maximum of two or more arguments, which can be applied elementwise to arrays via `max.(a,b)`.

See also: [`maximum!`](/base/collections#Base.maximum!), [`extrema`](/base/collections#Base.extrema), [`findmax`](/base/collections#Base.findmax), [`argmax`](/base/collections#Base.argmax).

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> maximum(A, dims=1)
1×2 Matrix{Int64}:
 3  4

julia> maximum(A, dims=2)
2×1 Matrix{Int64}:
 2
 4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L595-L620)



```julia
maximum(f, A::AbstractArray; dims)
```


Compute the maximum value by calling the function `f` on each element of an array over the given dimensions.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> maximum(abs2, A, dims=1)
1×2 Matrix{Int64}:
 9  16

julia> maximum(abs2, A, dims=2)
2×1 Matrix{Int64}:
  4
 16
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L623-L645)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.maximum!' href='#Base.maximum!'>#</a>&nbsp;<b><u>Base.maximum!</u></b> &mdash; <i>Function</i>.




```julia
maximum!(r, A)
```


Compute the maximum value of `A` over the singleton dimensions of `r`, and write results to `r`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> maximum!([1; 1], A)
2-element Vector{Int64}:
 2
 4

julia> maximum!([1 1], A)
1×2 Matrix{Int64}:
 3  4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L648-L671)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.minimum' href='#Base.minimum'>#</a>&nbsp;<b><u>Base.minimum</u></b> &mdash; <i>Function</i>.




```julia
minimum(f, itr; [init])
```


Return the smallest result of calling function `f` on each element of `itr`.

The value returned for empty `itr` can be specified by `init`. It must be a neutral element for `min` (i.e. which is greater than or equal to any other element) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> minimum(length, ["Julion", "Julia", "Jule"])
4

julia> minimum(length, []; init=typemax(Int64))
9223372036854775807

julia> minimum(sin, Real[]; init=1.0)  # good, since output of sin is <= 1
1.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L696-L720)



```julia
minimum(itr; [init])
```


Return the smallest element in a collection.

The value returned for empty `itr` can be specified by `init`. It must be a neutral element for `min` (i.e. which is greater than or equal to any other element) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> minimum(-20.5:10)
-20.5

julia> minimum([1,2,3])
1

julia> minimum([])
ERROR: ArgumentError: reducing over an empty collection is not allowed; consider supplying `init` to the reducer
Stacktrace:
[...]

julia> minimum([]; init=Inf)
Inf
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L755-L784)



```julia
minimum(A::AbstractArray; dims)
```


Compute the minimum value of an array over the given dimensions. See also the [`min(a,b)`](/base/math#Base.min) function to take the minimum of two or more arguments, which can be applied elementwise to arrays via `min.(a,b)`.

See also: [`minimum!`](/base/collections#Base.minimum!), [`extrema`](/base/collections#Base.extrema), [`findmin`](/base/collections#Base.findmin), [`argmin`](/base/collections#Base.argmin).

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> minimum(A, dims=1)
1×2 Matrix{Int64}:
 1  2

julia> minimum(A, dims=2)
2×1 Matrix{Int64}:
 1
 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L674-L699)



```julia
minimum(f, A::AbstractArray; dims)
```


Compute the minimum value by calling the function `f` on each element of an array over the given dimensions.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> minimum(abs2, A, dims=1)
1×2 Matrix{Int64}:
 1  4

julia> minimum(abs2, A, dims=2)
2×1 Matrix{Int64}:
 1
 9
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L702-L724)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.minimum!' href='#Base.minimum!'>#</a>&nbsp;<b><u>Base.minimum!</u></b> &mdash; <i>Function</i>.




```julia
minimum!(r, A)
```


Compute the minimum value of `A` over the singleton dimensions of `r`, and write results to `r`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> minimum!([1; 1], A)
2-element Vector{Int64}:
 1
 3

julia> minimum!([1 1], A)
1×2 Matrix{Int64}:
 1  2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L727-L750)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.extrema' href='#Base.extrema'>#</a>&nbsp;<b><u>Base.extrema</u></b> &mdash; <i>Function</i>.




```julia
extrema(itr; [init]) -> (mn, mx)
```


Compute both the minimum `mn` and maximum `mx` element in a single pass, and return them as a 2-tuple.

The value returned for empty `itr` can be specified by `init`. It must be a 2-tuple whose first and second elements are neutral elements for `min` and `max` respectively (i.e. which are greater/less than or equal to any other element). As a consequence, when `itr` is empty the returned `(mn, mx)` tuple will satisfy `mn ≥ mx`. When `init` is specified it may be used even for non-empty `itr`.

::: tip Julia 1.8

Keyword argument `init` requires Julia 1.8 or later.

:::

**Examples**

```julia
julia> extrema(2:10)
(2, 10)

julia> extrema([9,pi,4.5])
(3.141592653589793, 9.0)

julia> extrema([]; init = (Inf, -Inf))
(Inf, -Inf)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L787-L813)



```julia
extrema(f, itr; [init]) -> (mn, mx)
```


Compute both the minimum `mn` and maximum `mx` of `f` applied to each element in `itr` and return them as a 2-tuple. Only one pass is made over `itr`.

The value returned for empty `itr` can be specified by `init`. It must be a 2-tuple whose first and second elements are neutral elements for `min` and `max` respectively (i.e. which are greater/less than or equal to any other element). It is used for non-empty collections. Note: it implies that, for empty `itr`, the returned value `(mn, mx)` satisfies `mn ≥ mx` even though for non-empty `itr` it  satisfies `mn ≤ mx`.  This is a &quot;paradoxical&quot; but yet expected result.

::: tip Julia 1.2

This method requires Julia 1.2 or later.

:::

::: tip Julia 1.8

Keyword argument `init` requires Julia 1.8 or later.

:::

**Examples**

```julia
julia> extrema(sin, 0:π)
(0.0, 0.9092974268256817)

julia> extrema(sin, Real[]; init = (1.0, -1.0))  # good, since -1 ≤ sin(::Real) ≤ 1
(1.0, -1.0)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L816-L843)



```julia
extrema(A::AbstractArray; dims) -> Array{Tuple}
```


Compute the minimum and maximum elements of an array over the given dimensions.

See also: [`minimum`](/base/collections#Base.minimum), [`maximum`](/base/collections#Base.maximum), [`extrema!`](/base/collections#Base.extrema!).

**Examples**

```julia
julia> A = reshape(Vector(1:2:16), (2,2,2))
2×2×2 Array{Int64, 3}:
[:, :, 1] =
 1  5
 3  7

[:, :, 2] =
  9  13
 11  15

julia> extrema(A, dims = (1,2))
1×1×2 Array{Tuple{Int64, Int64}, 3}:
[:, :, 1] =
 (1, 7)

[:, :, 2] =
 (9, 15)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L753-L780)



```julia
extrema(f, A::AbstractArray; dims) -> Array{Tuple}
```


Compute the minimum and maximum of `f` applied to each element in the given dimensions of `A`.

::: tip Julia 1.2

This method requires Julia 1.2 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L783-L791)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.extrema!' href='#Base.extrema!'>#</a>&nbsp;<b><u>Base.extrema!</u></b> &mdash; <i>Function</i>.




```julia
extrema!(r, A)
```


Compute the minimum and maximum value of `A` over the singleton dimensions of `r`, and write results to `r`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

::: tip Julia 1.8

This method requires Julia 1.8 or later.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> extrema!([(1, 1); (1, 1)], A)
2-element Vector{Tuple{Int64, Int64}}:
 (1, 2)
 (3, 4)

julia> extrema!([(1, 1);; (1, 1)], A)
1×2 Matrix{Tuple{Int64, Int64}}:
 (1, 3)  (2, 4)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L794-L820)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.argmax' href='#Base.argmax'>#</a>&nbsp;<b><u>Base.argmax</u></b> &mdash; <i>Function</i>.




```julia
argmax(r::AbstractRange)
```


Ranges can have multiple maximal elements. In that case `argmax` will return a maximal index, but not necessarily the first one.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L879-L885)



```julia
argmax(f, domain)
```


Return a value `x` from `domain` for which `f(x)` is maximised. If there are multiple maximal values for `f(x)` then the first one will be found.

`domain` must be a non-empty iterable.

Values are compared with `isless`.

::: tip Julia 1.7

This method requires Julia 1.7 or later.

:::

See also [`argmin`](/base/collections#Base.argmin), [`findmax`](/base/collections#Base.findmax).

**Examples**

```julia
julia> argmax(abs, -10:5)
-10

julia> argmax(cos, 0:π/2:2π)
0.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L995-L1018)



```julia
argmax(itr)
```


Return the index or key of the maximal element in a collection. If there are multiple maximal elements, then the first one will be returned.

The collection must not be empty.

Indices are of the same type as those returned by [`keys(itr)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(itr)`](/base/collections#Base.pairs).

Values are compared with `isless`.

See also: [`argmin`](/base/collections#Base.argmin), [`findmax`](/base/collections#Base.findmax).

**Examples**

```julia
julia> argmax([8, 0.1, -9, pi])
1

julia> argmax([1, 7, 7, 6])
2

julia> argmax([1, 7, 7, NaN])
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1021-L1047)



```julia
argmax(A; dims) -> indices
```


For an array input, return the indices of the maximum elements over the given dimensions. `NaN` is treated as greater than all other values except `missing`.

**Examples**

```julia
julia> A = [1.0 2; 3 4]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> argmax(A, dims=1)
1×2 Matrix{CartesianIndex{2}}:
 CartesianIndex(2, 1)  CartesianIndex(2, 2)

julia> argmax(A, dims=2)
2×1 Matrix{CartesianIndex{2}}:
 CartesianIndex(1, 2)
 CartesianIndex(2, 2)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1247-L1269)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.argmin' href='#Base.argmin'>#</a>&nbsp;<b><u>Base.argmin</u></b> &mdash; <i>Function</i>.




```julia
argmin(r::AbstractRange)
```


Ranges can have multiple minimal elements. In that case `argmin` will return a minimal index, but not necessarily the first one.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L862-L868)



```julia
argmin(f, domain)
```


Return a value `x` from `domain` for which `f(x)` is minimised. If there are multiple minimal values for `f(x)` then the first one will be found.

`domain` must be a non-empty iterable.

`NaN` is treated as less than all other values except `missing`.

::: tip Julia 1.7

This method requires Julia 1.7 or later.

:::

See also [`argmax`](/base/collections#Base.argmax), [`findmin`](/base/collections#Base.findmin).

**Examples**

```julia
julia> argmin(sign, -10:5)
-10

julia> argmin(x -> -x^3 + x^2 - 10, -5:5)
5

julia> argmin(acos, 0:0.1:1)
1.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1050-L1076)



```julia
argmin(itr)
```


Return the index or key of the minimal element in a collection. If there are multiple minimal elements, then the first one will be returned.

The collection must not be empty.

Indices are of the same type as those returned by [`keys(itr)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(itr)`](/base/collections#Base.pairs).

`NaN` is treated as less than all other values except `missing`.

See also: [`argmax`](/base/collections#Base.argmax), [`findmin`](/base/collections#Base.findmin).

**Examples**

```julia
julia> argmin([8, 0.1, -9, pi])
3

julia> argmin([7, 1, 1, 6])
2

julia> argmin([7, 1, 1, NaN])
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1079-L1105)



```julia
argmin(A; dims) -> indices
```


For an array input, return the indices of the minimum elements over the given dimensions. `NaN` is treated as less than all other values except `missing`.

**Examples**

```julia
julia> A = [1.0 2; 3 4]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> argmin(A, dims=1)
1×2 Matrix{CartesianIndex{2}}:
 CartesianIndex(1, 1)  CartesianIndex(1, 2)

julia> argmin(A, dims=2)
2×1 Matrix{CartesianIndex{2}}:
 CartesianIndex(1, 1)
 CartesianIndex(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1222-L1244)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findmax' href='#Base.findmax'>#</a>&nbsp;<b><u>Base.findmax</u></b> &mdash; <i>Function</i>.




```julia
findmax(f, domain) -> (f(x), index)
```


Return a pair of a value in the codomain (outputs of `f`) and the index or key of the corresponding value in the `domain` (inputs to `f`) such that `f(x)` is maximised. If there are multiple maximal points, then the first one will be returned.

`domain` must be a non-empty iterable supporting [`keys`](/base/collections#Base.keys). Indices are of the same type as those returned by [`keys(domain)`](/base/arrays#Base.keys-Tuple{AbstractArray}).

Values are compared with `isless`.

::: tip Julia 1.7

This method requires Julia 1.7 or later.

:::

**Examples**

```julia
julia> findmax(identity, 5:9)
(9, 5)

julia> findmax(-, 1:10)
(-1, 1)

julia> findmax(first, [(1, :a), (3, :b), (3, :c)])
(3, 2)

julia> findmax(cos, 0:π/2:2π)
(1.0, 1)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L866-L896)



```julia
findmax(itr) -> (x, index)
```


Return the maximal element of the collection `itr` and its index or key. If there are multiple maximal elements, then the first one will be returned. Values are compared with `isless`.

Indices are of the same type as those returned by [`keys(itr)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(itr)`](/base/collections#Base.pairs).

See also: [`findmin`](/base/collections#Base.findmin), [`argmax`](/base/collections#Base.argmax), [`maximum`](/base/collections#Base.maximum).

**Examples**

```julia
julia> findmax([8, 0.1, -9, pi])
(8.0, 1)

julia> findmax([1, 7, 7, 6])
(7, 2)

julia> findmax([1, 7, 7, NaN])
(NaN, 4)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L901-L925)



```julia
findmax(A; dims) -> (maxval, index)
```


For an array input, returns the value and index of the maximum over the given dimensions. `NaN` is treated as greater than all other values except `missing`.

**Examples**

```julia
julia> A = [1.0 2; 3 4]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> findmax(A, dims=1)
([3.0 4.0], CartesianIndex{2}[CartesianIndex(2, 1) CartesianIndex(2, 2)])

julia> findmax(A, dims=2)
([2.0; 4.0;;], CartesianIndex{2}[CartesianIndex(1, 2); CartesianIndex(2, 2);;])
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1151-L1170)



```julia
findmax(f, A; dims) -> (f(x), index)
```


For an array input, returns the value in the codomain and index of the corresponding value which maximize `f` over the given dimensions.

**Examples**

```julia
julia> A = [-1.0 1; -0.5 2]
2×2 Matrix{Float64}:
 -1.0  1.0
 -0.5  2.0

julia> findmax(abs2, A, dims=1)
([1.0 4.0], CartesianIndex{2}[CartesianIndex(1, 1) CartesianIndex(2, 2)])

julia> findmax(abs2, A, dims=2)
([1.0; 4.0;;], CartesianIndex{2}[CartesianIndex(1, 1); CartesianIndex(2, 2);;])
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1174-L1193)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findmin' href='#Base.findmin'>#</a>&nbsp;<b><u>Base.findmin</u></b> &mdash; <i>Function</i>.




```julia
findmin(f, domain) -> (f(x), index)
```


Return a pair of a value in the codomain (outputs of `f`) and the index or key of the corresponding value in the `domain` (inputs to `f`) such that `f(x)` is minimised. If there are multiple minimal points, then the first one will be returned.

`domain` must be a non-empty iterable.

Indices are of the same type as those returned by [`keys(domain)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(domain)`](/base/collections#Base.pairs).

`NaN` is treated as less than all other values except `missing`.

::: tip Julia 1.7

This method requires Julia 1.7 or later.

:::

**Examples**

```julia
julia> findmin(identity, 5:9)
(5, 1)

julia> findmin(-, 1:10)
(-10, 10)

julia> findmin(first, [(2, :a), (2, :b), (3, :c)])
(2, 1)

julia> findmin(cos, 0:π/2:2π)
(-1.0, 3)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L929-L962)



```julia
findmin(itr) -> (x, index)
```


Return the minimal element of the collection `itr` and its index or key. If there are multiple minimal elements, then the first one will be returned. `NaN` is treated as less than all other values except `missing`.

Indices are of the same type as those returned by [`keys(itr)`](/base/arrays#Base.keys-Tuple{AbstractArray}) and [`pairs(itr)`](/base/collections#Base.pairs).

See also: [`findmax`](/base/collections#Base.findmax), [`argmin`](/base/collections#Base.argmin), [`minimum`](/base/collections#Base.minimum).

**Examples**

```julia
julia> findmin([8, 0.1, -9, pi])
(-9.0, 3)

julia> findmin([1, 7, 7, 6])
(1, 1)

julia> findmin([1, 7, 7, NaN])
(NaN, 4)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L967-L991)



```julia
findmin(A; dims) -> (minval, index)
```


For an array input, returns the value and index of the minimum over the given dimensions. `NaN` is treated as less than all other values except `missing`.

**Examples**

```julia
julia> A = [1.0 2; 3 4]
2×2 Matrix{Float64}:
 1.0  2.0
 3.0  4.0

julia> findmin(A, dims=1)
([1.0 2.0], CartesianIndex{2}[CartesianIndex(1, 1) CartesianIndex(1, 2)])

julia> findmin(A, dims=2)
([1.0; 3.0;;], CartesianIndex{2}[CartesianIndex(1, 1); CartesianIndex(2, 1);;])
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1078-L1097)



```julia
findmin(f, A; dims) -> (f(x), index)
```


For an array input, returns the value in the codomain and index of the corresponding value which minimize `f` over the given dimensions.

**Examples**

```julia
julia> A = [-1.0 1; -0.5 2]
2×2 Matrix{Float64}:
 -1.0  1.0
 -0.5  2.0

julia> findmin(abs2, A, dims=1)
([0.25 1.0], CartesianIndex{2}[CartesianIndex(2, 1) CartesianIndex(1, 2)])

julia> findmin(abs2, A, dims=2)
([1.0; 0.25;;], CartesianIndex{2}[CartesianIndex(1, 1); CartesianIndex(2, 1);;])
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1101-L1120)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findmax!' href='#Base.findmax!'>#</a>&nbsp;<b><u>Base.findmax!</u></b> &mdash; <i>Function</i>.




```julia
findmax!(rval, rind, A) -> (maxval, index)
```


Find the maximum of `A` and the corresponding linear index along singleton dimensions of `rval` and `rind`, and store the results in `rval` and `rind`. `NaN` is treated as greater than all other values except `missing`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1137-L1145)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findmin!' href='#Base.findmin!'>#</a>&nbsp;<b><u>Base.findmin!</u></b> &mdash; <i>Function</i>.




```julia
findmin!(rval, rind, A) -> (minval, index)
```


Find the minimum of `A` and the corresponding linear index along singleton dimensions of `rval` and `rind`, and store the results in `rval` and `rind`. `NaN` is treated as less than all other values except `missing`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L1064-L1072)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sum' href='#Base.sum'>#</a>&nbsp;<b><u>Base.sum</u></b> &mdash; <i>Function</i>.




```julia
sum(f, itr; [init])
```


Sum the results of calling function `f` on each element of `itr`.

The return type is `Int` for signed integers of less than system word size, and `UInt` for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.

The value returned for empty `itr` can be specified by `init`. It must be the additive identity (i.e. zero) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> sum(abs2, [2; 3; 4])
29
```


Note the important difference between `sum(A)` and `reduce(+, A)` for arrays with small integer eltype:

```julia
julia> sum(Int8[100, 28])
128

julia> reduce(+, Int8[100, 28])
-128
```


In the former case, the integers are widened to system word size and therefore the result is 128. In the latter case, no such widening happens and integer overflow results in -128.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L487-L523)



```julia
sum(itr; [init])
```


Return the sum of all elements in a collection.

The return type is `Int` for signed integers of less than system word size, and `UInt` for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.

The value returned for empty `itr` can be specified by `init`. It must be the additive identity (i.e. zero) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

See also: [`reduce`](/base/collections#Base.reduce-Tuple{Any,%20Any}), [`mapreduce`](/base/collections#Base.mapreduce-Tuple{Any,%20Any,%20Any}), [`count`](/base/collections#Base.count), [`union`](/base/collections#Base.union).

**Examples**

```julia
julia> sum(1:20)
210

julia> sum(1:20; init = 0.0)
210.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L526-L552)



```julia
sum(A::AbstractArray; dims)
```


Sum elements of an array over the given dimensions.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> sum(A, dims=1)
1×2 Matrix{Int64}:
 4  6

julia> sum(A, dims=2)
2×1 Matrix{Int64}:
 3
 7
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L445-L466)



```julia
sum(f, A::AbstractArray; dims)
```


Sum the results of calling function `f` on each element of an array over the given dimensions.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> sum(abs2, A, dims=1)
1×2 Matrix{Int64}:
 10  20

julia> sum(abs2, A, dims=2)
2×1 Matrix{Int64}:
  5
 25
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L469-L491)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sum!' href='#Base.sum!'>#</a>&nbsp;<b><u>Base.sum!</u></b> &mdash; <i>Function</i>.




```julia
sum!(r, A)
```


Sum elements of `A` over the singleton dimensions of `r`, and write results to `r`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> sum!([1; 1], A)
2-element Vector{Int64}:
 3
 7

julia> sum!([1 1], A)
1×2 Matrix{Int64}:
 4  6
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L494-L517)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.prod' href='#Base.prod'>#</a>&nbsp;<b><u>Base.prod</u></b> &mdash; <i>Function</i>.




```julia
prod(f, itr; [init])
```


Return the product of `f` applied to each element of `itr`.

The return type is `Int` for signed integers of less than system word size, and `UInt` for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.

The value returned for empty `itr` can be specified by `init`. It must be the multiplicative identity (i.e. one) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> prod(abs2, [2; 3; 4])
576
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L558-L579)



```julia
prod(itr; [init])
```


Return the product of all elements of a collection.

The return type is `Int` for signed integers of less than system word size, and `UInt` for unsigned integers of less than system word size.  For all other arguments, a common return type is found to which all arguments are promoted.

The value returned for empty `itr` can be specified by `init`. It must be the multiplicative identity (i.e. one) as it is unspecified whether `init` is used for non-empty collections.

::: tip Julia 1.6

Keyword argument `init` requires Julia 1.6 or later.

:::

See also: [`reduce`](/base/collections#Base.reduce-Tuple{Any,%20Any}), [`cumprod`](/base/arrays#Base.cumprod), [`any`](/base/collections#Base.any-Tuple{Any}).

**Examples**

```julia
julia> prod(1:5)
120

julia> prod(1:5; init = 1.0)
120.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L582-L608)



```julia
prod(A::AbstractArray; dims)
```


Multiply elements of an array over the given dimensions.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> prod(A, dims=1)
1×2 Matrix{Int64}:
 3  8

julia> prod(A, dims=2)
2×1 Matrix{Int64}:
  2
 12
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L520-L541)



```julia
prod(f, A::AbstractArray; dims)
```


Multiply the results of calling the function `f` on each element of an array over the given dimensions.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> prod(abs2, A, dims=1)
1×2 Matrix{Int64}:
 9  64

julia> prod(abs2, A, dims=2)
2×1 Matrix{Int64}:
   4
 144
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L544-L566)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.prod!' href='#Base.prod!'>#</a>&nbsp;<b><u>Base.prod!</u></b> &mdash; <i>Function</i>.




```julia
prod!(r, A)
```


Multiply elements of `A` over the singleton dimensions of `r`, and write results to `r`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> prod!([1; 1], A)
2-element Vector{Int64}:
  2
 12

julia> prod!([1 1], A)
1×2 Matrix{Int64}:
 3  8
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L569-L592)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.any-Tuple{Any}' href='#Base.any-Tuple{Any}'>#</a>&nbsp;<b><u>Base.any</u></b> &mdash; <i>Method</i>.




```julia
any(itr) -> Bool
```


Test whether any elements of a boolean collection are `true`, returning `true` as soon as the first `true` value in `itr` is encountered (short-circuiting). To short-circuit on `false`, use [`all`](/base/collections#Base.all-Tuple{Any}).

If the input contains [`missing`](/manual/missing#missing) values, return `missing` if all non-missing values are `false` (or equivalently, if the input contains no `true` value), following [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic).

See also: [`all`](/base/collections#Base.all-Tuple{Any}), [`count`](/base/collections#Base.count), [`sum`](/base/collections#Base.sum), [`|`](/base/math#Base.:|), [`||`](/base/math#||).

**Examples**

```julia
julia> a = [true,false,false,true]
4-element Vector{Bool}:
 1
 0
 0
 1

julia> any(a)
true

julia> any((println(i); v) for (i, v) in enumerate(a))
1
true

julia> any([missing, true])
true

julia> any([false, missing])
missing
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1110-L1145)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.any-Tuple{AbstractArray, Any}' href='#Base.any-Tuple{AbstractArray, Any}'>#</a>&nbsp;<b><u>Base.any</u></b> &mdash; <i>Method</i>.




```julia
any(p, itr) -> Bool
```


Determine whether predicate `p` returns `true` for any elements of `itr`, returning `true` as soon as the first item in `itr` for which `p` returns `true` is encountered (short-circuiting). To short-circuit on `false`, use [`all`](/base/collections#Base.all-Tuple{Any}).

If the input contains [`missing`](/manual/missing#missing) values, return `missing` if all non-missing values are `false` (or equivalently, if the input contains no `true` value), following [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic).

**Examples**

```julia
julia> any(i->(4<=i<=6), [3,5,7])
true

julia> any(i -> (println(i); i > 3), 1:10)
1
2
3
4
true

julia> any(i -> i > 0, [1, missing])
true

julia> any(i -> i > 0, [-1, missing])
missing

julia> any(i -> i > 0, [-1, 0])
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1187-L1219)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.any!' href='#Base.any!'>#</a>&nbsp;<b><u>Base.any!</u></b> &mdash; <i>Function</i>.




```julia
any!(r, A)
```


Test whether any values in `A` along the singleton dimensions of `r` are `true`, and write results to `r`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = [true false; true false]
2×2 Matrix{Bool}:
 1  0
 1  0

julia> any!([1; 1], A)
2-element Vector{Int64}:
 1
 1

julia> any!([1 1], A)
1×2 Matrix{Int64}:
 1  0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L945-L969)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.all-Tuple{Any}' href='#Base.all-Tuple{Any}'>#</a>&nbsp;<b><u>Base.all</u></b> &mdash; <i>Method</i>.




```julia
all(itr) -> Bool
```


Test whether all elements of a boolean collection are `true`, returning `false` as soon as the first `false` value in `itr` is encountered (short-circuiting). To short-circuit on `true`, use [`any`](/base/collections#Base.any-Tuple{Any}).

If the input contains [`missing`](/manual/missing#missing) values, return `missing` if all non-missing values are `true` (or equivalently, if the input contains no `false` value), following [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic).

See also: [`all!`](/base/collections#Base.all!), [`any`](/base/collections#Base.any-Tuple{Any}), [`count`](/base/collections#Base.count), [`&`](/base/math#Base.:&), [`&&`](/base/math#&&), [`allunique`](/base/collections#Base.allunique).

**Examples**

```julia
julia> a = [true,false,false,true]
4-element Vector{Bool}:
 1
 0
 0
 1

julia> all(a)
false

julia> all((println(i); v) for (i, v) in enumerate(a))
1
2
false

julia> all([missing, false])
false

julia> all([true, missing])
missing
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1148-L1184)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.all-Tuple{AbstractArray, Any}' href='#Base.all-Tuple{AbstractArray, Any}'>#</a>&nbsp;<b><u>Base.all</u></b> &mdash; <i>Method</i>.




```julia
all(p, itr) -> Bool
```


Determine whether predicate `p` returns `true` for all elements of `itr`, returning `false` as soon as the first item in `itr` for which `p` returns `false` is encountered (short-circuiting). To short-circuit on `true`, use [`any`](/base/collections#Base.any-Tuple{Any}).

If the input contains [`missing`](/manual/missing#missing) values, return `missing` if all non-missing values are `true` (or equivalently, if the input contains no `false` value), following [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic).

**Examples**

```julia
julia> all(i->(4<=i<=6), [4,5,6])
true

julia> all(i -> (println(i); i < 3), 1:10)
1
2
3
false

julia> all(i -> i > 0, [1, missing])
missing

julia> all(i -> i > 0, [-1, missing])
false

julia> all(i -> i > 0, [1, 2])
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1261-L1292)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.all!' href='#Base.all!'>#</a>&nbsp;<b><u>Base.all!</u></b> &mdash; <i>Function</i>.




```julia
all!(r, A)
```


Test whether all values in `A` along the singleton dimensions of `r` are `true`, and write results to `r`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> A = [true false; true false]
2×2 Matrix{Bool}:
 1  0
 1  0

julia> all!([1; 1], A)
2-element Vector{Int64}:
 0
 0

julia> all!([1 1], A)
1×2 Matrix{Int64}:
 1  0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L871-L894)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.count' href='#Base.count'>#</a>&nbsp;<b><u>Base.count</u></b> &mdash; <i>Function</i>.




```julia
count([f=identity,] itr; init=0) -> Integer
```


Count the number of elements in `itr` for which the function `f` returns `true`. If `f` is omitted, count the number of `true` elements in `itr` (which should be a collection of boolean values). `init` optionally specifies the value to start counting from and therefore also determines the output type.

::: tip Julia 1.6

`init` keyword was added in Julia 1.6.

:::

See also: [`any`](/base/collections#Base.any-Tuple{Any}), [`sum`](/base/collections#Base.sum).

**Examples**

```julia
julia> count(i->(4<=i<=6), [2,3,4,5,6])
3

julia> count([true, false, true, true])
3

julia> count(>(3), 1:7, init=0x03)
0x07
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L1340-L1364)



```julia
count(
    pattern::Union{AbstractChar,AbstractString,AbstractPattern},
    string::AbstractString;
    overlap::Bool = false,
)
```


Return the number of matches for `pattern` in `string`. This is equivalent to calling `length(findall(pattern, string))` but more efficient.

If `overlap=true`, the matching sequences are allowed to overlap indices in the original string, otherwise they must be from disjoint character ranges.

::: tip Julia 1.3

This method requires at least Julia 1.3.

:::

::: tip Julia 1.7

Using a character as the pattern requires at least Julia 1.7.

:::

**Examples**

```julia
julia> count('a', "JuliaLang")
2

julia> count(r"a(.)a", "cabacabac", overlap=true)
3

julia> count(r"a(.)a", "cabacabac")
2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L531-L561)



```julia
count([f=identity,] A::AbstractArray; dims=:)
```


Count the number of elements in `A` for which `f` returns `true` over the given dimensions.

::: tip Julia 1.5

`dims` keyword was added in Julia 1.5.

:::

::: tip Julia 1.6

`init` keyword was added in Julia 1.6.

:::

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> count(<=(2), A, dims=1)
1×2 Matrix{Int64}:
 1  1

julia> count(<=(2), A, dims=2)
2×1 Matrix{Int64}:
 2
 0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reducedim.jl#L378-L406)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.foreach' href='#Base.foreach'>#</a>&nbsp;<b><u>Base.foreach</u></b> &mdash; <i>Function</i>.




```julia
foreach(f, c...) -> Nothing
```


Call function `f` on each element of iterable `c`. For multiple iterable arguments, `f` is called elementwise, and iteration stops when any iterator is finished.

`foreach` should be used instead of [`map`](/base/collections#Base.map) when the results of `f` are not needed, for example in `foreach(println, array)`.

**Examples**

```julia
julia> tri = 1:3:7; res = Int[];

julia> foreach(x -> push!(res, x^2), tri)

julia> res
3-element Vector{Int64}:
  1
 16
 49

julia> foreach((x, y) -> println(x, " with ", y), tri, 'a':'z')
1 with a
4 with b
7 with c
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L3188-L3215)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.map' href='#Base.map'>#</a>&nbsp;<b><u>Base.map</u></b> &mdash; <i>Function</i>.




```julia
map(f, c...) -> collection
```


Transform collection `c` by applying `f` to each element. For multiple collection arguments, apply `f` elementwise, and stop when any of them is exhausted.

The element type of the result is determined in the same manner as in [`collect`](/base/collections#Base.collect-Tuple{Any}).

See also [`map!`](/base/collections#Base.map!), [`foreach`](/base/collections#Base.foreach), [`mapreduce`](/base/collections#Base.mapreduce-Tuple{Any,%20Any,%20Any}), [`mapslices`](/base/arrays#Base.mapslices), [`zip`](/base/iterators#Base.Iterators.zip), [`Iterators.map`](/base/iterators#Base.Iterators.map).

**Examples**

```julia
julia> map(x -> x * 2, [1, 2, 3])
3-element Vector{Int64}:
 2
 4
 6

julia> map(+, [1, 2, 3], [10, 20, 30, 400, 5000])
3-element Vector{Int64}:
 11
 22
 33
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L3405-L3429)



```julia
map(f, A::AbstractArray...) -> N-array
```


When acting on multi-dimensional arrays of the same [`ndims`](/base/arrays#Base.ndims), they must all have the same [`axes`](/base/arrays#Base.axes-Tuple{Any}), and the answer will too.

See also [`broadcast`](/base/arrays#Base.Broadcast.broadcast), which allows mismatched sizes.

**Examples**

```
julia> map(//, [1 2; 3 4], [4 3; 2 1])
2×2 Matrix{Rational{Int64}}:
 1//4  2//3
 3//2  4//1

julia> map(+, [1 2; 3 4], zeros(2,1))
ERROR: DimensionMismatch

julia> map(+, [1 2; 3 4], [1,10,100,1000], zeros(3,1))  # iterates until 3rd is exhausted
3-element Vector{Float64}:
   2.0
  13.0
 102.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L3501-L3525)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.map!' href='#Base.map!'>#</a>&nbsp;<b><u>Base.map!</u></b> &mdash; <i>Function</i>.




```julia
map!(function, destination, collection...)
```


Like [`map`](/base/collections#Base.map), but stores the result in `destination` rather than a new collection. `destination` must be at least as large as the smallest collection.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

See also: [`map`](/base/collections#Base.map), [`foreach`](/base/collections#Base.foreach), [`zip`](/base/iterators#Base.Iterators.zip), [`copyto!`](/base/c#Base.copyto!).

**Examples**

```julia
julia> a = zeros(3);

julia> map!(x -> x * 2, a, [1, 2, 3]);

julia> a
3-element Vector{Float64}:
 2.0
 4.0
 6.0

julia> map!(+, zeros(Int, 5), 100:999, 1:3)
5-element Vector{Int64}:
 101
 103
 105
   0
   0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L3464-L3494)



```julia
map!(f, values(dict::AbstractDict))
```


Modifies `dict` by transforming each value from `val` to `f(val)`. Note that the type of `dict` cannot be changed: if `f(val)` is not an instance of the value type of `dict` then it will be converted to the value type if possible and otherwise raise an error.

::: tip Julia 1.2

`map!(f, values(dict::AbstractDict))` requires Julia 1.2 or later.

:::

**Examples**

```julia
julia> d = Dict(:a => 1, :b => 2)
Dict{Symbol, Int64} with 2 entries:
  :a => 1
  :b => 2

julia> map!(v -> v-1, values(d))
ValueIterator for a Dict{Symbol, Int64} with 2 entries. Values:
  0
  1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L644-L666)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mapreduce-Tuple{Any, Any, Any}' href='#Base.mapreduce-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>Base.mapreduce</u></b> &mdash; <i>Method</i>.




```julia
mapreduce(f, op, itrs...; [init])
```


Apply function `f` to each element(s) in `itrs`, and then reduce the result using the binary function `op`. If provided, `init` must be a neutral element for `op` that will be returned for empty collections. It is unspecified whether `init` is used for non-empty collections. In general, it will be necessary to provide `init` to work with empty collections.

[`mapreduce`](/base/collections#Base.mapreduce-Tuple{Any,%20Any,%20Any}) is functionally equivalent to calling `reduce(op, map(f, itr); init=init)`, but will in general execute faster since no intermediate collection needs to be created. See documentation for [`reduce`](/base/collections#Base.reduce-Tuple{Any,%20Any}) and [`map`](/base/collections#Base.map).

::: tip Julia 1.2

`mapreduce` with multiple iterators requires Julia 1.2 or later.

:::

**Examples**

```julia
julia> mapreduce(x->x^2, +, [1:3;]) # == 1 + 4 + 9
14
```


The associativity of the reduction is implementation-dependent. Additionally, some implementations may reuse the return value of `f` for elements that appear multiple times in `itr`. Use [`mapfoldl`](/base/collections#Base.mapfoldl-Tuple{Any,%20Any,%20Any}) or [`mapfoldr`](/base/collections#Base.mapfoldr-Tuple{Any,%20Any,%20Any}) instead for guaranteed left or right associativity and invocation of `f` for every value.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L272-L298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mapfoldl-Tuple{Any, Any, Any}' href='#Base.mapfoldl-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>Base.mapfoldl</u></b> &mdash; <i>Method</i>.




```julia
mapfoldl(f, op, itr; [init])
```


Like [`mapreduce`](/base/collections#Base.mapreduce-Tuple{Any,%20Any,%20Any}), but with guaranteed left associativity, as in [`foldl`](/base/collections#Base.foldl-Tuple{Any,%20Any}). If provided, the keyword argument `init` will be used exactly once. In general, it will be necessary to provide `init` to work with empty collections.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L160-L166)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mapfoldr-Tuple{Any, Any, Any}' href='#Base.mapfoldr-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>Base.mapfoldr</u></b> &mdash; <i>Method</i>.




```julia
mapfoldr(f, op, itr; [init])
```


Like [`mapreduce`](/base/collections#Base.mapreduce-Tuple{Any,%20Any,%20Any}), but with guaranteed right associativity, as in [`foldr`](/base/collections#Base.foldr-Tuple{Any,%20Any}). If provided, the keyword argument `init` will be used exactly once. In general, it will be necessary to provide `init` to work with empty collections.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/reduce.jl#L208-L214)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.first' href='#Base.first'>#</a>&nbsp;<b><u>Base.first</u></b> &mdash; <i>Function</i>.




```julia
first(coll)
```


Get the first element of an iterable collection. Return the start point of an [`AbstractRange`](/base/collections#Base.AbstractRange) even if it is empty.

See also: [`only`](/base/iterators#Base.Iterators.only), [`firstindex`](/base/collections#Base.firstindex), [`last`](/base/collections#Base.last).

**Examples**

```julia
julia> first(2:2:10)
2

julia> first([1; 2; 3; 4])
1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L454-L470)



```julia
first(itr, n::Integer)
```


Get the first `n` elements of the iterable collection `itr`, or fewer elements if `itr` is not long enough.

See also: [`startswith`](/base/strings#Base.startswith), [`Iterators.take`](/base/iterators#Base.Iterators.take).

::: tip Julia 1.6

This method requires at least Julia 1.6.

:::

**Examples**

```julia
julia> first(["foo", "bar", "qux"], 2)
2-element Vector{String}:
 "foo"
 "bar"

julia> first(1:6, 10)
1:6

julia> first(Bool[], 1)
Bool[]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L477-L501)



```julia
first(s::AbstractString, n::Integer)
```


Get a string consisting of the first `n` characters of `s`.

**Examples**

```julia
julia> first("∀ϵ≠0: ϵ²>0", 0)
""

julia> first("∀ϵ≠0: ϵ²>0", 1)
"∀"

julia> first("∀ϵ≠0: ϵ²>0", 3)
"∀ϵ≠"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L689-L705)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.last' href='#Base.last'>#</a>&nbsp;<b><u>Base.last</u></b> &mdash; <i>Function</i>.




```julia
last(coll)
```


Get the last element of an ordered collection, if it can be computed in O(1) time. This is accomplished by calling [`lastindex`](/base/collections#Base.lastindex) to get the last index. Return the end point of an [`AbstractRange`](/base/collections#Base.AbstractRange) even if it is empty.

See also [`first`](/base/collections#Base.first), [`endswith`](/base/strings#Base.endswith).

**Examples**

```julia
julia> last(1:2:10)
9

julia> last([1; 2; 3; 4])
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L509-L526)



```julia
last(itr, n::Integer)
```


Get the last `n` elements of the iterable collection `itr`, or fewer elements if `itr` is not long enough.

::: tip Julia 1.6

This method requires at least Julia 1.6.

:::

**Examples**

```julia
julia> last(["foo", "bar", "qux"], 2)
2-element Vector{String}:
 "bar"
 "qux"

julia> last(1:6, 10)
1:6

julia> last(Float64[], 1)
Float64[]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L529-L551)



```julia
last(s::AbstractString, n::Integer)
```


Get a string consisting of the last `n` characters of `s`.

**Examples**

```julia
julia> last("∀ϵ≠0: ϵ²>0", 0)
""

julia> last("∀ϵ≠0: ϵ²>0", 1)
"0"

julia> last("∀ϵ≠0: ϵ²>0", 3)
"²>0"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L708-L724)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.front' href='#Base.front'>#</a>&nbsp;<b><u>Base.front</u></b> &mdash; <i>Function</i>.




```julia
front(x::Tuple)::Tuple
```


Return a `Tuple` consisting of all but the last component of `x`.

See also: [`first`](/base/collections#Base.first), [`tail`](/base/collections#Base.tail).

**Examples**

```julia
julia> Base.front((1,2,3))
(1, 2)

julia> Base.front(())
ERROR: ArgumentError: Cannot call front on an empty tuple.
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/tuple.jl#L325-L340)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.tail' href='#Base.tail'>#</a>&nbsp;<b><u>Base.tail</u></b> &mdash; <i>Function</i>.




```julia
tail(x::Tuple)::Tuple
```


Return a `Tuple` consisting of all but the first component of `x`.

See also: [`front`](/base/collections#Base.front), [`rest`](/base/collections#Base.rest), [`first`](/base/collections#Base.first), [`Iterators.peel`](/base/iterators#Base.Iterators.peel).

**Examples**

```julia
julia> Base.tail((1,2,3))
(2, 3)

julia> Base.tail(())
ERROR: ArgumentError: Cannot call tail on an empty tuple.
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L499-L514)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.step' href='#Base.step'>#</a>&nbsp;<b><u>Base.step</u></b> &mdash; <i>Function</i>.




```julia
step(r)
```


Get the step size of an [`AbstractRange`](/base/collections#Base.AbstractRange) object.

**Examples**

```julia
julia> step(1:10)
1

julia> step(1:2:10)
2

julia> step(2.5:0.3:10.9)
0.3

julia> step(range(2.5, stop=10.9, length=85))
0.1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/range.jl#L692-L711)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.collect-Tuple{Any}' href='#Base.collect-Tuple{Any}'>#</a>&nbsp;<b><u>Base.collect</u></b> &mdash; <i>Method</i>.




```julia
collect(iterator)
```


Return an `Array` of all items in a collection or iterator. For dictionaries, returns a `Vector` of `key=>value` [Pair](/base/collections#Core.Pair)s. If the argument is array-like or is an iterator with the [`HasShape`](/base/collections#Base.IteratorSize) trait, the result will have the same shape and number of dimensions as the argument.

Used by [comprehensions](/manual/arrays#man-comprehensions) to turn a [generator expression](/manual/arrays#man-generators) into an `Array`. Thus, _on generators_, the square-brackets notation may be used instead of calling `collect`, see second example.

The element type of the returned array is based on the types of the values collected. However, if the iterator is empty then the element type of the returned (empty) array is determined by type inference.

**Examples**

Collect items from a `UnitRange{Int64}` collection:

```julia
julia> collect(1:3)
3-element Vector{Int64}:
 1
 2
 3
```


Collect items from a generator (same output as `[x^2 for x in 1:3]`):

```julia
julia> collect(x^2 for x in 1:3)
3-element Vector{Int64}:
 1
 4
 9
```


Collecting an empty iterator where the result type depends on type inference:

```julia
julia> [rand(Bool) ? 1 : missing for _ in []]
Union{Missing, Int64}[]
```


When the iterator is non-empty, the result type depends only on values:

```julia
julia> [rand(Bool) ? 1 : missing for _ in [""]]
1-element Vector{Int64}:
 1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L662-L713)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.collect-Tuple{Type, Any}' href='#Base.collect-Tuple{Type, Any}'>#</a>&nbsp;<b><u>Base.collect</u></b> &mdash; <i>Method</i>.




```julia
collect(element_type, collection)
```


Return an `Array` with the given element type of all items in a collection or iterable. The result has the same shape and number of dimensions as `collection`.

**Examples**

```julia
julia> collect(Float64, 1:2:5)
3-element Vector{Float64}:
 1.0
 3.0
 5.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L612-L626)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.filter' href='#Base.filter'>#</a>&nbsp;<b><u>Base.filter</u></b> &mdash; <i>Function</i>.




```julia
filter(f, a)
```


Return a copy of collection `a`, removing elements for which `f` is `false`. The function `f` is passed one argument.

::: tip Julia 1.4

Support for `a` as a tuple requires at least Julia 1.4.

:::

See also: [`filter!`](/base/collections#Base.filter!), [`Iterators.filter`](/base/iterators#Base.Iterators.filter).

**Examples**

```julia
julia> a = 1:10
1:10

julia> filter(isodd, a)
5-element Vector{Int64}:
 1
 3
 5
 7
 9
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L2852-L2876)



```julia
filter(f)
```


Create a function that filters its arguments with function `f` using [`filter`](/base/collections#Base.filter), i.e. a function equivalent to `x -> filter(f, x)`.

The returned function is of type `Base.Fix1{typeof(filter)}`, which can be used to implement specialized methods.

**Examples**

```julia
julia> (1, 2, Inf, 4, NaN, 6) |> filter(isfinite)
(1, 2, 4, 6)

julia> map(filter(iseven), [1:3, 2:4, 3:5])
3-element Vector{Vector{Int64}}:
 [2]
 [2, 4]
 [4]
```


::: tip Julia 1.9

This method requires at least Julia 1.9.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L2939-L2961)



```julia
filter(f, d::AbstractDict)
```


Return a copy of `d`, removing elements for which `f` is `false`. The function `f` is passed `key=>value` pairs.

**Examples**

```julia
julia> d = Dict(1=>"a", 2=>"b")
Dict{Int64, String} with 2 entries:
  2 => "b"
  1 => "a"

julia> filter(p->isodd(p.first), d)
Dict{Int64, String} with 1 entry:
  1 => "a"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L455-L472)



```julia
filter(f, itr::SkipMissing{<:AbstractArray})
```


Return a vector similar to the array wrapped by the given `SkipMissing` iterator but with all missing elements and those for which `f` returns `false` removed.

::: tip Julia 1.2

This method requires Julia 1.2 or later.

:::

**Examples**

```julia
julia> x = [1 2; missing 4]
2×2 Matrix{Union{Missing, Int64}}:
 1         2
  missing  4

julia> filter(isodd, skipmissing(x))
1-element Vector{Int64}:
 1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/missing.jl#L364-L384)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.filter!' href='#Base.filter!'>#</a>&nbsp;<b><u>Base.filter!</u></b> &mdash; <i>Function</i>.




```julia
filter!(f, a)
```


Update collection `a`, removing elements for which `f` is `false`. The function `f` is passed one argument.

**Examples**

```julia
julia> filter!(isodd, Vector(1:10))
5-element Vector{Int64}:
 1
 3
 5
 7
 9
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L2906-L2922)



```julia
filter!(f, d::AbstractDict)
```


Update `d`, removing elements for which `f` is `false`. The function `f` is passed `key=>value` pairs.

**Examples**

```julia
julia> d = Dict(1=>"a", 2=>"b", 3=>"c")
Dict{Int64, String} with 3 entries:
  2 => "b"
  3 => "c"
  1 => "a"

julia> filter!(p->isodd(p.first), d)
Dict{Int64, String} with 2 entries:
  3 => "c"
  1 => "a"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L413-L432)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.replace-Tuple{Any, Vararg{Pair}}' href='#Base.replace-Tuple{Any, Vararg{Pair}}'>#</a>&nbsp;<b><u>Base.replace</u></b> &mdash; <i>Method</i>.




```julia
replace(A, old_new::Pair...; [count::Integer])
```


Return a copy of collection `A` where, for each pair `old=>new` in `old_new`, all occurrences of `old` are replaced by `new`. Equality is determined using [`isequal`](/base/base#Base.isequal). If `count` is specified, then replace at most `count` occurrences in total.

The element type of the result is chosen using promotion (see [`promote_type`](/base/base#Base.promote_type)) based on the element type of `A` and on the types of the `new` values in pairs. If `count` is omitted and the element type of `A` is a `Union`, the element type of the result will not include singleton types which are replaced with values of a different type: for example, `Union{T,Missing}` will become `T` if `missing` is replaced.

See also [`replace!`](/base/collections#Base.replace!), [`splice!`](/base/collections#Base.splice!), [`delete!`](/base/collections#Base.delete!), [`insert!`](/base/collections#Base.insert!).

::: tip Julia 1.7

Version 1.7 is required to replace elements of a `Tuple`.

:::

**Examples**

```julia
julia> replace([1, 2, 1, 3], 1=>0, 2=>4, count=2)
4-element Vector{Int64}:
 0
 4
 1
 3

julia> replace([1, missing], missing=>0)
2-element Vector{Int64}:
 1
 0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L780-L814)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.replace-Tuple{Union{Function, Type}, Any}' href='#Base.replace-Tuple{Union{Function, Type}, Any}'>#</a>&nbsp;<b><u>Base.replace</u></b> &mdash; <i>Method</i>.




```julia
replace(new::Union{Function, Type}, A; [count::Integer])
```


Return a copy of `A` where each value `x` in `A` is replaced by `new(x)`. If `count` is specified, then replace at most `count` values in total (replacements being defined as `new(x) !== x`).

::: tip Julia 1.7

Version 1.7 is required to replace elements of a `Tuple`.

:::

**Examples**

```julia
julia> replace(x -> isodd(x) ? 2x : x, [1, 2, 3, 4])
4-element Vector{Int64}:
 2
 2
 6
 4

julia> replace(Dict(1=>2, 3=>4)) do kv
           first(kv) < 3 ? first(kv)=>3 : kv
       end
Dict{Int64, Int64} with 2 entries:
  3 => 4
  1 => 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L841-L867)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.replace!' href='#Base.replace!'>#</a>&nbsp;<b><u>Base.replace!</u></b> &mdash; <i>Function</i>.




```julia
replace!(A, old_new::Pair...; [count::Integer])
```


For each pair `old=>new` in `old_new`, replace all occurrences of `old` in collection `A` by `new`. Equality is determined using [`isequal`](/base/base#Base.isequal). If `count` is specified, then replace at most `count` occurrences in total. See also [`replace`](/base/collections#Base.replace-Tuple{Any,%20Vararg{Pair}}).

**Examples**

```julia
julia> replace!([1, 2, 1, 3], 1=>0, 2=>4, count=2)
4-element Vector{Int64}:
 0
 4
 1
 3

julia> replace!(Set([1, 2, 3]), 1=>0)
Set{Int64} with 3 elements:
  0
  2
  3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L710-L734)



```julia
replace!(new::Union{Function, Type}, A; [count::Integer])
```


Replace each element `x` in collection `A` by `new(x)`. If `count` is specified, then replace at most `count` values in total (replacements being defined as `new(x) !== x`).

**Examples**

```julia
julia> replace!(x -> isodd(x) ? 2x : x, [1, 2, 3, 4])
4-element Vector{Int64}:
 2
 2
 6
 4

julia> replace!(Dict(1=>2, 3=>4)) do kv
           first(kv) < 3 ? first(kv)=>3 : kv
       end
Dict{Int64, Int64} with 2 entries:
  3 => 4
  1 => 3

julia> replace!(x->2x, Set([3, 6]))
Set{Int64} with 2 elements:
  6
  12
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L748-L776)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rest' href='#Base.rest'>#</a>&nbsp;<b><u>Base.rest</u></b> &mdash; <i>Function</i>.




```julia
Base.rest(collection[, itr_state])
```


Generic function for taking the tail of `collection`, starting from a specific iteration state `itr_state`. Return a `Tuple`, if `collection` itself is a `Tuple`, a subtype of `AbstractVector`, if `collection` is an `AbstractArray`, a subtype of `AbstractString` if `collection` is an `AbstractString`, and an arbitrary iterator, falling back to `Iterators.rest(collection[, itr_state])`, otherwise.

Can be overloaded for user-defined collection types to customize the behavior of [slurping in assignments](/manual/functions#destructuring-assignment) in final position, like `a, b... = collection`.

::: tip Julia 1.6

`Base.rest` requires at least Julia 1.6.

:::

See also: [`first`](/base/collections#Base.first), [`Iterators.rest`](/base/iterators#Base.Iterators.rest), [`Base.split_rest`](/base/collections#Base.split_rest).

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> first, state = iterate(a)
(1, 2)

julia> first, Base.rest(a, state)
(1, [3, 2, 4])
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/tuple.jl#L173-L203)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.split_rest' href='#Base.split_rest'>#</a>&nbsp;<b><u>Base.split_rest</u></b> &mdash; <i>Function</i>.




```julia
Base.split_rest(collection, n::Int[, itr_state]) -> (rest_but_n, last_n)
```


Generic function for splitting the tail of `collection`, starting from a specific iteration state `itr_state`. Returns a tuple of two new collections. The first one contains all elements of the tail but the `n` last ones, which make up the second collection.

The type of the first collection generally follows that of [`Base.rest`](/base/collections#Base.rest), except that the fallback case is not lazy, but is collected eagerly into a vector.

Can be overloaded for user-defined collection types to customize the behavior of [slurping in assignments](/manual/functions#destructuring-assignment) in non-final position, like `a, b..., c = collection`.

::: tip Julia 1.9

`Base.split_rest` requires at least Julia 1.9.

:::

See also: [`Base.rest`](/base/collections#Base.rest).

**Examples**

```julia
julia> a = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> first, state = iterate(a)
(1, 2)

julia> first, Base.split_rest(a, 1, state)
(1, ([3, 2], [4]))
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/tuple.jl#L211-L242)

</div>
<br>

## Indexable Collections {#Indexable-Collections}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.getindex' href='#Base.getindex'>#</a>&nbsp;<b><u>Base.getindex</u></b> &mdash; <i>Function</i>.




```julia
getindex(collection, key...)
```


Retrieve the value(s) stored at the given key or index within a collection. The syntax `a[i,j,...]` is converted by the compiler to `getindex(a, i, j, ...)`.

See also [`get`](/base/collections#Base.get), [`keys`](/base/collections#Base.keys), [`eachindex`](/base/arrays#Base.eachindex).

**Examples**

```julia
julia> A = Dict("a" => 1, "b" => 2)
Dict{String, Int64} with 2 entries:
  "b" => 2
  "a" => 1

julia> getindex(A, "a")
1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L904-L922)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setindex!' href='#Base.setindex!'>#</a>&nbsp;<b><u>Base.setindex!</u></b> &mdash; <i>Function</i>.




```julia
setindex!(collection, value, key...)
```


Store the given value at the given key or index within a collection. The syntax `a[i,j,...] = x` is converted by the compiler to `(setindex!(a, x, i, j, ...); x)`.

**Examples**

```julia
julia> a = Dict("a"=>1)
Dict{String, Int64} with 1 entry:
  "a" => 1

julia> setindex!(a, 2, "b")
Dict{String, Int64} with 2 entries:
  "b" => 2
  "a" => 1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L962-L979)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.firstindex' href='#Base.firstindex'>#</a>&nbsp;<b><u>Base.firstindex</u></b> &mdash; <i>Function</i>.




```julia
firstindex(collection) -> Integer
firstindex(collection, d) -> Integer
```


Return the first index of `collection`. If `d` is given, return the first index of `collection` along dimension `d`.

The syntaxes `A[begin]` and `A[1, begin]` lower to `A[firstindex(A)]` and `A[1, firstindex(A, 2)]`, respectively.

See also: [`first`](/base/collections#Base.first), [`axes`](/base/arrays#Base.axes-Tuple{Any}), [`lastindex`](/base/collections#Base.lastindex), [`nextind`](/base/arrays#Base.nextind).

**Examples**

```julia
julia> firstindex([1,2,4])
1

julia> firstindex(rand(3,4,5), 2)
1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L429-L448)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.lastindex' href='#Base.lastindex'>#</a>&nbsp;<b><u>Base.lastindex</u></b> &mdash; <i>Function</i>.




```julia
lastindex(collection) -> Integer
lastindex(collection, d) -> Integer
```


Return the last index of `collection`. If `d` is given, return the last index of `collection` along dimension `d`.

The syntaxes `A[end]` and `A[end, end]` lower to `A[lastindex(A)]` and `A[lastindex(A, 1), lastindex(A, 2)]`, respectively.

See also: [`axes`](/base/arrays#Base.axes-Tuple{Any}), [`firstindex`](/base/collections#Base.firstindex), [`eachindex`](/base/arrays#Base.eachindex), [`prevind`](/base/arrays#Base.prevind).

**Examples**

```julia
julia> lastindex([1,2,4])
3

julia> lastindex(rand(3,4,5), 2)
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L406-L425)

</div>
<br>

Fully implemented by:
- [`Array`](/base/arrays#Core.Array)
  
- [`BitArray`](/base/arrays#Base.BitArray)
  
- [`AbstractArray`](/base/arrays#Core.AbstractArray)
  
- `SubArray`
  

Partially implemented by:
- [`AbstractRange`](/base/collections#Base.AbstractRange)
  
- [`UnitRange`](/base/collections#Base.UnitRange)
  
- [`Tuple`](/base/base#Core.Tuple)
  
- [`AbstractString`](/base/strings#Core.AbstractString)
  
- [`Dict`](/base/collections#Base.Dict)
  
- [`IdDict`](/base/collections#Base.IdDict)
  
- [`WeakKeyDict`](/base/collections#Base.WeakKeyDict)
  
- [`NamedTuple`](/base/base#Core.NamedTuple)
  

## Dictionaries

[`Dict`](/base/collections#Base.Dict) is the standard dictionary. Its implementation uses [`hash`](/base/base#Base.hash) as the hashing function for the key, and [`isequal`](/base/base#Base.isequal) to determine equality. Define these two functions for custom types to override how they are stored in a hash table.

[`IdDict`](/base/collections#Base.IdDict) is a special hash table where the keys are always object identities.

[`WeakKeyDict`](/base/collections#Base.WeakKeyDict) is a hash table implementation where the keys are weak references to objects, and thus may be garbage collected even when referenced in a hash table. Like `Dict` it uses `hash` for hashing and `isequal` for equality, unlike `Dict` it does not convert keys on insertion.

[`Dict`](/base/collections#Base.Dict)s can be created by passing pair objects constructed with `=>` to a [`Dict`](/base/collections#Base.Dict) constructor: `Dict("A"=>1, "B"=>2)`. This call will attempt to infer type information from the keys and values (i.e. this example creates a `Dict{String, Int64}`). To explicitly specify types use the syntax `Dict{KeyType,ValueType}(...)`. For example, `Dict{String,Int32}("A"=>1, "B"=>2)`.

Dictionaries may also be created with generators. For example, `Dict(i => f(i) for i = 1:10)`.

Given a dictionary `D`, the syntax `D[x]` returns the value of key `x` (if it exists) or throws an error, and `D[x] = y` stores the key-value pair `x => y` in `D` (replacing any existing value for the key `x`). Multiple arguments to `D[...]` are converted to tuples; for example, the syntax `D[x,y]`  is equivalent to `D[(x,y)]`, i.e. it refers to the value keyed by the tuple `(x,y)`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractDict' href='#Base.AbstractDict'>#</a>&nbsp;<b><u>Base.AbstractDict</u></b> &mdash; <i>Type</i>.




```julia
AbstractDict{K, V}
```


Supertype for dictionary-like types with keys of type `K` and values of type `V`. [`Dict`](/base/collections#Base.Dict), [`IdDict`](/base/collections#Base.IdDict) and other types are subtypes of this. An `AbstractDict{K, V}` should be an iterator of `Pair{K, V}`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L28-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Dict' href='#Base.Dict'>#</a>&nbsp;<b><u>Base.Dict</u></b> &mdash; <i>Type</i>.




```julia
Dict([itr])
```


`Dict{K,V}()` constructs a hash table with keys of type `K` and values of type `V`. Keys are compared with [`isequal`](/base/base#Base.isequal) and hashed with [`hash`](/base/base#Base.hash).

Given a single iterable argument, constructs a [`Dict`](/base/collections#Base.Dict) whose key-value pairs are taken from 2-tuples `(key,value)` generated by the argument.

**Examples**

```julia
julia> Dict([("A", 1), ("B", 2)])
Dict{String, Int64} with 2 entries:
  "B" => 2
  "A" => 1
```


Alternatively, a sequence of pair arguments may be passed.

```julia
julia> Dict("A"=>1, "B"=>2)
Dict{String, Int64} with 2 entries:
  "B" => 2
  "A" => 1
```


::: warning Warning

Keys are allowed to be mutable, but if you do mutate stored keys, the hash table may become internally inconsistent, in which case the `Dict` will not work properly. [`IdDict`](/base/collections#Base.IdDict) can be an alternative if you need to mutate keys.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L31-L64)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IdDict' href='#Base.IdDict'>#</a>&nbsp;<b><u>Base.IdDict</u></b> &mdash; <i>Type</i>.




```julia
IdDict([itr])
```


`IdDict{K,V}()` constructs a hash table using [`objectid`](/base/base#Base.objectid) as hash and `===` as equality with keys of type `K` and values of type `V`. See [`Dict`](/base/collections#Base.Dict) for further help and [`IdSet`](/base/collections#Base.IdSet) for the set version of this.

In the example below, the `Dict` keys are all `isequal` and therefore get hashed the same, so they get overwritten. The `IdDict` hashes by object-id, and thus preserves the 3 different keys.

**Examples**

```julia
julia> Dict(true => "yes", 1 => "no", 1.0 => "maybe")
Dict{Real, String} with 1 entry:
  1.0 => "maybe"

julia> IdDict(true => "yes", 1 => "no", 1.0 => "maybe")
IdDict{Any, String} with 3 entries:
  true => "yes"
  1.0  => "maybe"
  1    => "no"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/iddict.jl#L3-L26)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.WeakKeyDict' href='#Base.WeakKeyDict'>#</a>&nbsp;<b><u>Base.WeakKeyDict</u></b> &mdash; <i>Type</i>.




```julia
WeakKeyDict([itr])
```


`WeakKeyDict()` constructs a hash table where the keys are weak references to objects which may be garbage collected even when referenced in a hash table.

See [`Dict`](/base/collections#Base.Dict) for further help.  Note, unlike [`Dict`](/base/collections#Base.Dict), `WeakKeyDict` does not convert keys on insertion, as this would imply the key object was unreferenced anywhere before insertion.

See also [`WeakRef`](/base/base#Core.WeakRef).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/weakkeydict.jl#L5-L17)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ImmutableDict' href='#Base.ImmutableDict'>#</a>&nbsp;<b><u>Base.ImmutableDict</u></b> &mdash; <i>Type</i>.




```julia
ImmutableDict
```


`ImmutableDict` is a dictionary implemented as an immutable linked list, which is optimal for small dictionaries that are constructed over many individual insertions. Note that it is not possible to remove a value, although it can be partially overridden and hidden by inserting a new value with the same key.

```
ImmutableDict(KV::Pair)
```


Create a new entry in the `ImmutableDict` for a `key => value` pair
- use `(key => value) in dict` to see if this particular combination is in the properties set
  
- use `get(dict, key, default)` to retrieve the most recent value for a particular key
  


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L778-L793)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.PersistentDict' href='#Base.PersistentDict'>#</a>&nbsp;<b><u>Base.PersistentDict</u></b> &mdash; <i>Type</i>.




```julia
PersistentDict
```


`PersistentDict` is a dictionary implemented as an hash array mapped trie, which is optimal for situations where you need persistence, each operation returns a new dictionary separate from the previous one, but the underlying implementation is space-efficient and may share storage across multiple separate dictionaries.

::: tip Note

It behaves like an IdDict.

:::

```julia
PersistentDict(KV::Pair)
```


**Examples**

```julia
julia> dict = Base.PersistentDict(:a=>1)
Base.PersistentDict{Symbol, Int64} with 1 entry:
  :a => 1

julia> dict2 = Base.delete(dict, :a)
Base.PersistentDict{Symbol, Int64}()

julia> dict3 = Base.PersistentDict(dict, :a=>2)
Base.PersistentDict{Symbol, Int64} with 1 entry:
  :a => 2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L898-L928)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.haskey' href='#Base.haskey'>#</a>&nbsp;<b><u>Base.haskey</u></b> &mdash; <i>Function</i>.




```julia
haskey(collection, key) -> Bool
```


Determine whether a collection has a mapping for a given `key`.

**Examples**

```julia
julia> D = Dict('a'=>2, 'b'=>3)
Dict{Char, Int64} with 2 entries:
  'a' => 2
  'b' => 3

julia> haskey(D, 'a')
true

julia> haskey(D, 'c')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L529-L547)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.get' href='#Base.get'>#</a>&nbsp;<b><u>Base.get</u></b> &mdash; <i>Function</i>.




```julia
get(collection, key, default)
```


Return the value stored for the given key, or the given default value if no mapping for the key is present.

::: tip Julia 1.7

For tuples and numbers, this function requires at least Julia 1.7.

:::

**Examples**

```julia
julia> d = Dict("a"=>1, "b"=>2);

julia> get(d, "a", 3)
1

julia> get(d, "c", 3)
3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L480-L499)



```julia
get(f::Union{Function, Type}, collection, key)
```


Return the value stored for the given key, or if no mapping for the key is present, return `f()`.  Use [`get!`](/base/collections#Base.get!) to also store the default value in the dictionary.

This is intended to be called using `do` block syntax

```julia
get(dict, key) do
    # default value calculated here
    time()
end
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L507-L521)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.get!' href='#Base.get!'>#</a>&nbsp;<b><u>Base.get!</u></b> &mdash; <i>Function</i>.




```julia
get!(collection, key, default)
```


Return the value stored for the given key, or if no mapping for the key is present, store `key => default`, and return `default`.

**Examples**

```julia
julia> d = Dict("a"=>1, "b"=>2, "c"=>3);

julia> get!(d, "a", 5)
1

julia> get!(d, "d", 4)
4

julia> d
Dict{String, Int64} with 4 entries:
  "c" => 3
  "b" => 2
  "a" => 1
  "d" => 4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L385-L408)



```julia
get!(f::Union{Function, Type}, collection, key)
```


Return the value stored for the given key, or if no mapping for the key is present, store `key => f()`, and return `f()`.

This is intended to be called using `do` block syntax.

**Examples**

```julia
julia> squares = Dict{Int, Int}();

julia> function get_square!(d, i)
           get!(d, i) do
               i^2
           end
       end
get_square! (generic function with 1 method)

julia> get_square!(squares, 2)
4

julia> squares
Dict{Int64, Int64} with 1 entry:
  2 => 4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L411-L437)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.getkey' href='#Base.getkey'>#</a>&nbsp;<b><u>Base.getkey</u></b> &mdash; <i>Function</i>.




```julia
getkey(collection, key, default)
```


Return the key matching argument `key` if one exists in `collection`, otherwise return `default`.

**Examples**

```julia
julia> D = Dict('a'=>2, 'b'=>3)
Dict{Char, Int64} with 2 entries:
  'a' => 2
  'b' => 3

julia> getkey(D, 'a', 1)
'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)

julia> getkey(D, 'd', 'a')
'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L551-L569)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.delete!' href='#Base.delete!'>#</a>&nbsp;<b><u>Base.delete!</u></b> &mdash; <i>Function</i>.




```julia
delete!(collection, key)
```


Delete the mapping for the given key in a collection, if any, and return the collection.

**Examples**

```julia
julia> d = Dict("a"=>1, "b"=>2)
Dict{String, Int64} with 2 entries:
  "b" => 2
  "a" => 1

julia> delete!(d, "b")
Dict{String, Int64} with 1 entry:
  "a" => 1

julia> delete!(d, "b") # d is left unchanged
Dict{String, Int64} with 1 entry:
  "a" => 1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L651-L671)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pop!-Tuple{Any, Any, Any}' href='#Base.pop!-Tuple{Any, Any, Any}'>#</a>&nbsp;<b><u>Base.pop!</u></b> &mdash; <i>Method</i>.




```julia
pop!(collection, key[, default])
```


Delete and return the mapping for `key` if it exists in `collection`, otherwise return `default`, or throw an error if `default` is not specified.

**Examples**

```julia
julia> d = Dict("a"=>1, "b"=>2, "c"=>3);

julia> pop!(d, "a")
1

julia> pop!(d, "d")
ERROR: KeyError: key "d" not found
Stacktrace:
[...]

julia> pop!(d, "e", 4)
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L586-L607)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.keys' href='#Base.keys'>#</a>&nbsp;<b><u>Base.keys</u></b> &mdash; <i>Function</i>.




```julia
keys(iterator)
```


For an iterator or collection that has keys and values (e.g. arrays and dictionaries), return an iterator over the keys.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L75-L80)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.values' href='#Base.values'>#</a>&nbsp;<b><u>Base.values</u></b> &mdash; <i>Function</i>.




```julia
values(iterator)
```


For an iterator or collection that has keys and values, return an iterator over the values. This function simply returns its argument by default, since the elements of a general iterator are normally considered its &quot;values&quot;.

**Examples**

```julia
julia> d = Dict("a"=>1, "b"=>2);

julia> values(d)
ValueIterator for a Dict{String, Int64} with 2 entries. Values:
  2
  1

julia> values([2])
1-element Vector{Int64}:
 2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L1123-L1144)



```julia
values(a::AbstractDict)
```


Return an iterator over all values in a collection. `collect(values(a))` returns an array of values. When the values are stored internally in a hash table, as is the case for `Dict`, the order in which they are returned may vary. But `keys(a)` and `values(a)` both iterate `a` and return the elements in the same order.

**Examples**

```julia
julia> D = Dict('a'=>2, 'b'=>3)
Dict{Char, Int64} with 2 entries:
  'a' => 2
  'b' => 3

julia> collect(values(D))
2-element Vector{Int64}:
 2
 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L109-L132)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pairs' href='#Base.pairs'>#</a>&nbsp;<b><u>Base.pairs</u></b> &mdash; <i>Function</i>.




```julia
pairs(IndexLinear(), A)
pairs(IndexCartesian(), A)
pairs(IndexStyle(A), A)
```


An iterator that accesses each element of the array `A`, returning `i => x`, where `i` is the index for the element and `x = A[i]`. Identical to `pairs(A)`, except that the style of index can be selected. Also similar to `enumerate(A)`, except `i` will be a valid index for `A`, while `enumerate` always counts from 1 regardless of the indices of `A`.

Specifying [`IndexLinear()`](/base/arrays#Base.IndexLinear) ensures that `i` will be an integer; specifying [`IndexCartesian()`](/base/arrays#Base.IndexCartesian) ensures that `i` will be a [`Base.CartesianIndex`](/base/arrays#Base.IteratorsMD.CartesianIndex); specifying `IndexStyle(A)` chooses whichever has been defined as the native indexing style for array `A`.

Mutation of the bounds of the underlying array will invalidate this iterator.

**Examples**

```julia
julia> A = ["a" "d"; "b" "e"; "c" "f"];

julia> for (index, value) in pairs(IndexStyle(A), A)
           println("$index $value")
       end
1 a
2 b
3 c
4 d
5 e
6 f

julia> S = view(A, 1:2, :);

julia> for (index, value) in pairs(IndexStyle(S), S)
           println("$index $value")
       end
CartesianIndex(1, 1) a
CartesianIndex(2, 1) b
CartesianIndex(1, 2) d
CartesianIndex(2, 2) e
```


See also [`IndexStyle`](/base/arrays#Base.IndexStyle), [`axes`](/base/arrays#Base.axes-Tuple{Any}).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/iterators.jl#L226-L271)



```julia
pairs(collection)
```


Return an iterator over `key => value` pairs for any collection that maps a set of keys to a set of values. This includes arrays, where the keys are the array indices.

**Examples**

```julia
julia> a = Dict(zip(["a", "b", "c"], [1, 2, 3]))
Dict{String, Int64} with 3 entries:
  "c" => 3
  "b" => 2
  "a" => 1

julia> pairs(a)
Dict{String, Int64} with 3 entries:
  "c" => 3
  "b" => 2
  "a" => 1

julia> foreach(println, pairs(["a", "b", "c"]))
1 => "a"
2 => "b"
3 => "c"

julia> (;a=1, b=2, c=3) |> pairs |> collect
3-element Vector{Pair{Symbol, Int64}}:
 :a => 1
 :b => 2
 :c => 3

julia> (;a=1, b=2, c=3) |> collect
3-element Vector{Int64}:
 1
 2
 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L135-L173)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.merge' href='#Base.merge'>#</a>&nbsp;<b><u>Base.merge</u></b> &mdash; <i>Function</i>.




```julia
merge(initial::Face, others::Face...)
```


Merge the properties of the `initial` face and `others`, with later faces taking priority.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/f6035eb97b516862b16e36cab2ecc6ea8adc3d7c/src/faces.jl#L490-L495)



```julia
merge(d::AbstractDict, others::AbstractDict...)
```


Construct a merged collection from the given collections. If necessary, the types of the resulting collection will be promoted to accommodate the types of the merged collections. If the same key is present in another collection, the value for that key will be the value it has in the last collection listed. See also [`mergewith`](/base/collections#Base.mergewith) for custom handling of values with the same key.

**Examples**

```julia
julia> a = Dict("foo" => 0.0, "bar" => 42.0)
Dict{String, Float64} with 2 entries:
  "bar" => 42.0
  "foo" => 0.0

julia> b = Dict("baz" => 17, "bar" => 4711)
Dict{String, Int64} with 2 entries:
  "bar" => 4711
  "baz" => 17

julia> merge(a, b)
Dict{String, Float64} with 3 entries:
  "bar" => 4711.0
  "baz" => 17.0
  "foo" => 0.0

julia> merge(b, a)
Dict{String, Float64} with 3 entries:
  "bar" => 42.0
  "baz" => 17.0
  "foo" => 0.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L321-L354)



```julia
merge(a::NamedTuple, bs::NamedTuple...)
```


Construct a new named tuple by merging two or more existing ones, in a left-associative manner. Merging proceeds left-to-right, between pairs of named tuples, and so the order of fields present in both the leftmost and rightmost named tuples take the same position as they are found in the leftmost named tuple. However, values are taken from matching fields in the rightmost named tuple that contains that field. Fields present in only the rightmost named tuple of a pair are appended at the end. A fallback is implemented for when only a single named tuple is supplied, with signature `merge(a::NamedTuple)`.

::: tip Julia 1.1

Merging 3 or more `NamedTuple` requires at least Julia 1.1.

:::

**Examples**

```julia
julia> merge((a=1, b=2, c=3), (b=4, d=5))
(a = 1, b = 4, c = 3, d = 5)
```


```julia
julia> merge((a=1, b=2), (b=3, c=(d=1,)), (c=(d=2,),))
(a = 1, b = 3, c = (d = 2,))
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/namedtuple.jl#L309-L333)



```julia
merge(a::NamedTuple, iterable)
```


Interpret an iterable of key-value pairs as a named tuple, and perform a merge.

```julia
julia> merge((a=1, b=2, c=3), [:b=>4, :d=>5])
(a = 1, b = 4, c = 3, d = 5)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/namedtuple.jl#L357-L366)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mergewith' href='#Base.mergewith'>#</a>&nbsp;<b><u>Base.mergewith</u></b> &mdash; <i>Function</i>.




```julia
mergewith(combine, d::AbstractDict, others::AbstractDict...)
mergewith(combine)
merge(combine, d::AbstractDict, others::AbstractDict...)
```


Construct a merged collection from the given collections. If necessary, the types of the resulting collection will be promoted to accommodate the types of the merged collections. Values with the same key will be combined using the combiner function.  The curried form `mergewith(combine)` returns the function `(args...) -> mergewith(combine, args...)`.

Method `merge(combine::Union{Function,Type}, args...)` as an alias of `mergewith(combine, args...)` is still available for backward compatibility.

::: tip Julia 1.5

`mergewith` requires Julia 1.5 or later.

:::

**Examples**

```julia
julia> a = Dict("foo" => 0.0, "bar" => 42.0)
Dict{String, Float64} with 2 entries:
  "bar" => 42.0
  "foo" => 0.0

julia> b = Dict("baz" => 17, "bar" => 4711)
Dict{String, Int64} with 2 entries:
  "bar" => 4711
  "baz" => 17

julia> mergewith(+, a, b)
Dict{String, Float64} with 3 entries:
  "bar" => 4753.0
  "baz" => 17.0
  "foo" => 0.0

julia> ans == mergewith(+)(a, b)
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L358-L396)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.merge!' href='#Base.merge!'>#</a>&nbsp;<b><u>Base.merge!</u></b> &mdash; <i>Function</i>.




```julia
merge!(d::AbstractDict, others::AbstractDict...)
```


Update collection with pairs from the other collections. See also [`merge`](/base/collections#Base.merge).

**Examples**

```julia
julia> d1 = Dict(1 => 2, 3 => 4);

julia> d2 = Dict(1 => 4, 4 => 5);

julia> merge!(d1, d2);

julia> d1
Dict{Int64, Int64} with 3 entries:
  4 => 5
  3 => 4
  1 => 4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L199-L219)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mergewith!' href='#Base.mergewith!'>#</a>&nbsp;<b><u>Base.mergewith!</u></b> &mdash; <i>Function</i>.




```julia
mergewith!(combine, d::AbstractDict, others::AbstractDict...) -> d
mergewith!(combine)
merge!(combine, d::AbstractDict, others::AbstractDict...) -> d
```


Update collection with pairs from the other collections. Values with the same key will be combined using the combiner function.  The curried form `mergewith!(combine)` returns the function `(args...) -> mergewith!(combine, args...)`.

Method `merge!(combine::Union{Function,Type}, args...)` as an alias of `mergewith!(combine, args...)` is still available for backward compatibility.

::: tip Julia 1.5

`mergewith!` requires Julia 1.5 or later.

:::

**Examples**

```julia
julia> d1 = Dict(1 => 2, 3 => 4);

julia> d2 = Dict(1 => 4, 4 => 5);

julia> mergewith!(+, d1, d2);

julia> d1
Dict{Int64, Int64} with 3 entries:
  4 => 5
  3 => 4
  1 => 6

julia> mergewith!(-, d1, d1);

julia> d1
Dict{Int64, Int64} with 3 entries:
  4 => 0
  3 => 0
  1 => 0

julia> foldl(mergewith!(+), [d1, d2]; init=Dict{Int64, Int64}())
Dict{Int64, Int64} with 3 entries:
  4 => 5
  3 => 0
  1 => 4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L232-L277)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sizehint!' href='#Base.sizehint!'>#</a>&nbsp;<b><u>Base.sizehint!</u></b> &mdash; <i>Function</i>.




```julia
sizehint!(s, n; first::Bool=false, shrink::Bool=true) -> s
```


Suggest that collection `s` reserve capacity for at least `n` elements. That is, if you expect that you&#39;re going to have to push a lot of values onto `s`, you can avoid the cost of incremental reallocation by doing it once up front; this can improve performance.

If `first` is `true`, then any additional space is reserved before the start of the collection. This way, subsequent calls to `pushfirst!` (instead of `push!`) may become faster. Supplying this keyword may result in an error if the collection is not ordered or if `pushfirst!` is not supported for this collection.

If `shrink=true` (the default), the collection&#39;s capacity may be reduced if its current capacity is greater than `n`.

See also [`resize!`](/base/collections#Base.resize!).

**Notes on the performance model**

For types that support `sizehint!`,
1. `push!` and `append!` methods generally may (but are not required to) preallocate extra storage. For types implemented in `Base`, they typically do, using a heuristic optimized for a general use case.
  
2. `sizehint!` may control this preallocation. Again, it typically does this for types in `Base`.
  
3. `empty!` is nearly costless (and O(1)) for types that support this kind of preallocation.
  

::: tip Julia 1.11

The `shrink` and `first` arguments were added in Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1466-L1499)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.keytype' href='#Base.keytype'>#</a>&nbsp;<b><u>Base.keytype</u></b> &mdash; <i>Function</i>.




```julia
keytype(T::Type{<:AbstractArray})
keytype(A::AbstractArray)
```


Return the key type of an array. This is equal to the [`eltype`](/base/collections#Base.eltype) of the result of `keys(...)`, and is provided mainly for compatibility with the dictionary interface.

**Examples**

```julia
julia> keytype([1, 2, 3]) == Int
true

julia> keytype([1 2; 3 4])
CartesianIndex{2}
```


::: tip Julia 1.2

For arrays, this function requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L168-L187)



```julia
keytype(type)
```


Get the key type of a dictionary type. Behaves similarly to [`eltype`](/base/collections#Base.eltype).

**Examples**

```julia
julia> keytype(Dict(Int32(1) => "foo"))
Int32
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L293-L303)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.valtype' href='#Base.valtype'>#</a>&nbsp;<b><u>Base.valtype</u></b> &mdash; <i>Function</i>.




```julia
valtype(T::Type{<:AbstractArray})
valtype(A::AbstractArray)
```


Return the value type of an array. This is identical to [`eltype`](/base/collections#Base.eltype) and is provided mainly for compatibility with the dictionary interface.

**Examples**

```julia
julia> valtype(["one", "two", "three"])
String
```


::: tip Julia 1.2

For arrays, this function requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractarray.jl#L197-L212)



```julia
valtype(type)
```


Get the value type of a dictionary type. Behaves similarly to [`eltype`](/base/collections#Base.eltype).

**Examples**

```julia
julia> valtype(Dict(Int32(1) => "foo"))
String
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractdict.jl#L307-L317)

</div>
<br>

Fully implemented by:
- [`Dict`](/base/collections#Base.Dict)
  
- [`IdDict`](/base/collections#Base.IdDict)
  
- [`WeakKeyDict`](/base/collections#Base.WeakKeyDict)
  

Partially implemented by:
- [`Set`](/base/collections#Base.Set)
  
- [`BitSet`](/base/collections#Base.BitSet)
  
- [`IdSet`](/base/collections#Base.IdSet)
  
- [`EnvDict`](/base/base#Base.EnvDict)
  
- [`Array`](/base/arrays#Core.Array)
  
- [`BitArray`](/base/arrays#Base.BitArray)
  
- [`ImmutableDict`](/base/collections#Base.ImmutableDict)
  
- [`PersistentDict`](/base/collections#Base.PersistentDict)
  
- [`Iterators.Pairs`](/base/collections#Base.Pairs)
  

## Set-Like Collections {#Set-Like-Collections}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractSet' href='#Base.AbstractSet'>#</a>&nbsp;<b><u>Base.AbstractSet</u></b> &mdash; <i>Type</i>.




```julia
AbstractSet{T}
```


Supertype for set-like types whose elements are of type `T`. [`Set`](/base/collections#Base.Set), [`BitSet`](/base/collections#Base.BitSet) and other types are subtypes of this.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L20-L25)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Set' href='#Base.Set'>#</a>&nbsp;<b><u>Base.Set</u></b> &mdash; <i>Type</i>.




```julia
Set{T} <: AbstractSet{T}
```


`Set`s are mutable containers that provide fast membership testing.

`Set`s have efficient implementations of set operations such as `in`, `union` and `intersect`. Elements in a `Set` are unique, as determined by the elements&#39; definition of `isequal`. The order of elements in a `Set` is an implementation detail and cannot be relied on.

See also: [`AbstractSet`](/base/collections#Base.AbstractSet), [`BitSet`](/base/collections#Base.BitSet), [`Dict`](/base/collections#Base.Dict), [`push!`](/base/collections#Base.push!), [`empty!`](/base/collections#Base.empty!), [`union!`](/base/collections#Base.union!), [`in`](/base/collections#Base.in), [`isequal`](/base/base#Base.isequal)

**Examples**

```julia
julia> s = Set("aaBca")
Set{Char} with 3 elements:
  'a'
  'c'
  'B'

julia> push!(s, 'b')
Set{Char} with 4 elements:
  'a'
  'b'
  'B'
  'c'

julia> s = Set([NaN, 0.0, 1.0, 2.0]);

julia> -0.0 in s # isequal(0.0, -0.0) is false
false

julia> NaN in s # isequal(NaN, NaN) is true
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L3-L38)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.BitSet' href='#Base.BitSet'>#</a>&nbsp;<b><u>Base.BitSet</u></b> &mdash; <i>Type</i>.




```julia
BitSet([itr])
```


Construct a sorted set of `Int`s generated by the given iterable object, or an empty set. Implemented as a bit string, and therefore designed for dense integer sets. If the set will be sparse (for example, holding a few very large integers), use [`Set`](/base/collections#Base.Set) instead.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/bitset.jl#L25-L32)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IdSet' href='#Base.IdSet'>#</a>&nbsp;<b><u>Base.IdSet</u></b> &mdash; <i>Type</i>.




```julia
IdSet{T}([itr])
IdSet()
```


IdSet{T}() constructs a set (see [`Set`](/base/collections#Base.Set)) using `===` as equality with values of type `T`.

In the example below, the values are all `isequal` so they get overwritten in the ordinary `Set`. The `IdSet` compares by `===` and so preserves the 3 different values.

**Examples**

```julia
julia> Set(Any[true, 1, 1.0])
Set{Any} with 1 element:
  1.0

julia> IdSet{Any}(Any[true, 1, 1.0])
IdSet{Any} with 3 elements:
  1.0
  1
  true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/idset.jl#L3-L25)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.union' href='#Base.union'>#</a>&nbsp;<b><u>Base.union</u></b> &mdash; <i>Function</i>.




```julia
union(s, itrs...)
∪(s, itrs...)
```


Construct an object containing all distinct elements from all of the arguments.

The first argument controls what kind of container is returned. If this is an array, it maintains the order in which elements first appear.

Unicode `∪` can be typed by writing `\cup` then pressing tab in the Julia REPL, and in many editors. This is an infix operator, allowing `s ∪ itr`.

See also [`unique`](/base/collections#Base.unique), [`intersect`](/base/collections#Base.intersect), [`isdisjoint`](/base/collections#Base.isdisjoint), [`vcat`](/base/arrays#Base.vcat), [`Iterators.flatten`](/base/iterators#Base.Iterators.flatten).

**Examples**

```julia
julia> union([1, 2], [3])
3-element Vector{Int64}:
 1
 2
 3

julia> union([4 2 3 4 4], 1:3, 3.0)
4-element Vector{Float64}:
 4.0
 2.0
 3.0
 1.0

julia> (0, 0.0) ∪ (-0.0, NaN)
3-element Vector{Real}:
   0
  -0.0
 NaN

julia> union(Set([1, 2]), 2:3)
Set{Int64} with 3 elements:
  2
  3
  1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L13-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.union!' href='#Base.union!'>#</a>&nbsp;<b><u>Base.union!</u></b> &mdash; <i>Function</i>.




```julia
union!(s::Union{AbstractSet,AbstractVector}, itrs...)
```


Construct the [`union`](/base/collections#Base.union) of passed in sets and overwrite `s` with the result. Maintain order with arrays.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> a = Set([3, 4, 5]);

julia> union!(a, 1:2:7);

julia> a
Set{Int64} with 5 elements:
  5
  4
  7
  3
  1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L62-L84)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.intersect' href='#Base.intersect'>#</a>&nbsp;<b><u>Base.intersect</u></b> &mdash; <i>Function</i>.




```julia
intersect(s, itrs...)
∩(s, itrs...)
```


Construct the set containing those elements which appear in all of the arguments.

The first argument controls what kind of container is returned. If this is an array, it maintains the order in which elements first appear.

Unicode `∩` can be typed by writing `\cap` then pressing tab in the Julia REPL, and in many editors. This is an infix operator, allowing `s ∩ itr`.

See also [`setdiff`](/base/collections#Base.setdiff), [`isdisjoint`](/base/collections#Base.isdisjoint), [`issubset`](/base/collections#Base.issubset), [`issetequal`](/base/collections#Base.issetequal).

::: tip Julia 1.8

As of Julia 1.8 intersect returns a result with the eltype of the type-promoted eltypes of the two inputs

:::

**Examples**

```julia
julia> intersect([1, 2, 3], [3, 4, 5])
1-element Vector{Int64}:
 3

julia> intersect([1, 4, 4, 5, 6], [6, 4, 6, 7, 8])
2-element Vector{Int64}:
 4
 6

julia> intersect(1:16, 7:99)
7:16

julia> (0, 0.0) ∩ (-0.0, 0)
1-element Vector{Real}:
 0

julia> intersect(Set([1, 2]), BitSet([2, 3]), 1.0:10.0)
Set{Float64} with 1 element:
  2.0
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L112-L152)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setdiff' href='#Base.setdiff'>#</a>&nbsp;<b><u>Base.setdiff</u></b> &mdash; <i>Function</i>.




```julia
setdiff(s, itrs...)
```


Construct the set of elements in `s` but not in any of the iterables in `itrs`. Maintain order with arrays.

See also [`setdiff!`](/base/collections#Base.setdiff!), [`union`](/base/collections#Base.union) and [`intersect`](/base/collections#Base.intersect).

**Examples**

```julia
julia> setdiff([1,2,3], [3,4,5])
2-element Vector{Int64}:
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L200-L215)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setdiff!' href='#Base.setdiff!'>#</a>&nbsp;<b><u>Base.setdiff!</u></b> &mdash; <i>Function</i>.




```julia
setdiff!(s, itrs...)
```


Remove from set `s` (in-place) each element of each iterable from `itrs`. Maintain order with arrays.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

**Examples**

```julia
julia> a = Set([1, 3, 4, 5]);

julia> setdiff!(a, 1:2:6);

julia> a
Set{Int64} with 1 element:
  4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L219-L237)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.symdiff' href='#Base.symdiff'>#</a>&nbsp;<b><u>Base.symdiff</u></b> &mdash; <i>Function</i>.




```julia
symdiff(s, itrs...)
```


Construct the symmetric difference of elements in the passed in sets. When `s` is not an `AbstractSet`, the order is maintained.

See also [`symdiff!`](/base/collections#Base.symdiff!), [`setdiff`](/base/collections#Base.setdiff), [`union`](/base/collections#Base.union) and [`intersect`](/base/collections#Base.intersect).

**Examples**

```julia
julia> symdiff([1,2,3], [3,4,5], [4,5,6])
3-element Vector{Int64}:
 1
 2
 6

julia> symdiff([1,2,1], [2, 1, 2])
Int64[]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L252-L271)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.symdiff!' href='#Base.symdiff!'>#</a>&nbsp;<b><u>Base.symdiff!</u></b> &mdash; <i>Function</i>.




```julia
symdiff!(s::Union{AbstractSet,AbstractVector}, itrs...)
```


Construct the symmetric difference of the passed in sets, and overwrite `s` with the result. When `s` is an array, the order is maintained. Note that in this case the multiplicity of elements matters.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L275-L283)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.intersect!' href='#Base.intersect!'>#</a>&nbsp;<b><u>Base.intersect!</u></b> &mdash; <i>Function</i>.




```julia
intersect!(s::Union{AbstractSet,AbstractVector}, itrs...)
```


Intersect all passed in sets and overwrite `s` with the result. Maintain order with arrays.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L182-L189)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.issubset' href='#Base.issubset'>#</a>&nbsp;<b><u>Base.issubset</u></b> &mdash; <i>Function</i>.




```julia
issubset(a, b) -> Bool
⊆(a, b) -> Bool
⊇(b, a) -> Bool
```


Determine whether every element of `a` is also in `b`, using [`in`](/base/collections#Base.in).

See also [`⊊`](/base/collections#Base.:⊊), [`⊈`](/base/collections#Base.:⊈), [`∩`](/base/collections#Base.intersect), [`∪`](/base/collections#Base.union), [`contains`](/base/strings#Base.contains).

**Examples**

```julia
julia> issubset([1, 2], [1, 2, 3])
true

julia> [1, 2, 3] ⊆ [1, 2]
false

julia> [1, 2, 3] ⊇ [1, 2]
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L304-L324)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.in!' href='#Base.in!'>#</a>&nbsp;<b><u>Base.in!</u></b> &mdash; <i>Function</i>.




```julia
in!(x, s::AbstractSet) -> Bool
```


If `x` is in `s`, return `true`. If not, push `x` into `s` and return `false`. This is equivalent to `in(x, s) ? true : (push!(s, x); false)`, but may have a more efficient implementation.

See also: [`in`](/base/collections#Base.in), [`push!`](/base/collections#Base.push!), [`Set`](/base/collections#Base.Set)

::: tip Julia 1.11

This function requires at least 1.11.

:::

**Examples**

```julia
julia> s = Set{Any}([1, 2, 3]); in!(4, s)
false

julia> length(s)
4

julia> in!(0x04, s)
true

julia> s
Set{Any} with 4 elements:
  4
  2
  3
  1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/set.jl#L94-L124)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:⊈' href='#Base.:⊈'>#</a>&nbsp;<b><u>Base.:⊈</u></b> &mdash; <i>Function</i>.




```julia
⊈(a, b) -> Bool
⊉(b, a) -> Bool
```


Negation of `⊆` and `⊇`, i.e. checks that `a` is not a subset of `b`.

See also [`issubset`](/base/collections#Base.issubset) (`⊆`), [`⊊`](/base/collections#Base.:⊊).

**Examples**

```julia
julia> (1, 2) ⊈ (2, 3)
true

julia> (1, 2) ⊈ (1, 2, 3)
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L448-L464)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:⊊' href='#Base.:⊊'>#</a>&nbsp;<b><u>Base.:⊊</u></b> &mdash; <i>Function</i>.




```julia
⊊(a, b) -> Bool
⊋(b, a) -> Bool
```


Determines if `a` is a subset of, but not equal to, `b`.

See also [`issubset`](/base/collections#Base.issubset) (`⊆`), [`⊈`](/base/collections#Base.:⊈).

**Examples**

```julia
julia> (1, 2) ⊊ (1, 2, 3)
true

julia> (1, 2) ⊊ (1, 2)
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L396-L412)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.issetequal' href='#Base.issetequal'>#</a>&nbsp;<b><u>Base.issetequal</u></b> &mdash; <i>Function</i>.




```julia
issetequal(a, b) -> Bool
```


Determine whether `a` and `b` have the same elements. Equivalent to `a ⊆ b && b ⊆ a` but more efficient when possible.

See also: [`isdisjoint`](/base/collections#Base.isdisjoint), [`union`](/base/collections#Base.union).

**Examples**

```julia
julia> issetequal([1, 2], [1, 2, 3])
false

julia> issetequal([1, 2], [2, 1])
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L498-L514)



```julia
issetequal(x)
```


Create a function that compares its argument to `x` using [`issetequal`](/base/collections#Base.issetequal), i.e. a function equivalent to `y -> issetequal(y, x)`. The returned function is of type `Base.Fix2{typeof(issetequal)}`, which can be used to implement specialized methods.

::: tip Julia 1.11

This functionality requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L532-L542)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isdisjoint' href='#Base.isdisjoint'>#</a>&nbsp;<b><u>Base.isdisjoint</u></b> &mdash; <i>Function</i>.




```julia
isdisjoint(a, b) -> Bool
```


Determine whether the collections `a` and `b` are disjoint. Equivalent to `isempty(a ∩ b)` but more efficient when possible.

See also: [`intersect`](/base/collections#Base.intersect), [`isempty`](/base/collections#Base.isempty), [`issetequal`](/base/collections#Base.issetequal).

::: tip Julia 1.5

This function requires at least Julia 1.5.

:::

**Examples**

```julia
julia> isdisjoint([1, 2], [2, 3, 4])
false

julia> isdisjoint([3, 1], [2, 4])
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L546-L565)



```julia
isdisjoint(x)
```


Create a function that compares its argument to `x` using [`isdisjoint`](/base/collections#Base.isdisjoint), i.e. a function equivalent to `y -> isdisjoint(y, x)`. The returned function is of type `Base.Fix2{typeof(isdisjoint)}`, which can be used to implement specialized methods.

::: tip Julia 1.11

This functionality requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/abstractset.jl#L591-L601)

</div>
<br>

Fully implemented by:
- [`Set`](/base/collections#Base.Set)
  
- [`BitSet`](/base/collections#Base.BitSet)
  
- [`IdSet`](/base/collections#Base.IdSet)
  

Partially implemented by:
- [`Array`](/base/arrays#Core.Array)
  

## Dequeues
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.push!' href='#Base.push!'>#</a>&nbsp;<b><u>Base.push!</u></b> &mdash; <i>Function</i>.




```julia
push!(collection, items...) -> collection
```


Insert one or more `items` in `collection`. If `collection` is an ordered container, the items are inserted at the end (in the given order).

**Examples**

```julia
julia> push!([1, 2, 3], 4, 5, 6)
6-element Vector{Int64}:
 1
 2
 3
 4
 5
 6
```


If `collection` is ordered, use [`append!`](/base/collections#Base.append!) to add all the elements of another collection to it. The result of the preceding example is equivalent to `append!([1, 2, 3], [4, 5, 6])`. For `AbstractSet` objects, [`union!`](/base/collections#Base.union!) can be used instead.

See [`sizehint!`](/base/collections#Base.sizehint!) for notes about the performance model.

See also [`pushfirst!`](/base/collections#Base.pushfirst!).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1236-L1261)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pop!' href='#Base.pop!'>#</a>&nbsp;<b><u>Base.pop!</u></b> &mdash; <i>Function</i>.




```julia
pop!(collection) -> item
```


Remove an item in `collection` and return it. If `collection` is an ordered container, the last item is returned; for unordered containers, an arbitrary element is returned.

See also: [`popfirst!`](/base/collections#Base.popfirst!), [`popat!`](/base/collections#Base.popat!), [`delete!`](/base/collections#Base.delete!), [`deleteat!`](/base/collections#Base.deleteat!), [`splice!`](/base/collections#Base.splice!), and [`push!`](/base/collections#Base.push!).

**Examples**

```julia
julia> A=[1, 2, 3]
3-element Vector{Int64}:
 1
 2
 3

julia> pop!(A)
3

julia> A
2-element Vector{Int64}:
 1
 2

julia> S = Set([1, 2])
Set{Int64} with 2 elements:
  2
  1

julia> pop!(S)
2

julia> S
Set{Int64} with 1 element:
  1

julia> pop!(Dict(1=>2))
1 => 2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1544-L1584)



```julia
pop!(collection, key[, default])
```


Delete and return the mapping for `key` if it exists in `collection`, otherwise return `default`, or throw an error if `default` is not specified.

**Examples**

```julia
julia> d = Dict("a"=>1, "b"=>2, "c"=>3);

julia> pop!(d, "a")
1

julia> pop!(d, "d")
ERROR: KeyError: key "d" not found
Stacktrace:
[...]

julia> pop!(d, "e", 4)
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/dict.jl#L586-L607)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.popat!' href='#Base.popat!'>#</a>&nbsp;<b><u>Base.popat!</u></b> &mdash; <i>Function</i>.




```julia
popat!(a::Vector, i::Integer, [default])
```


Remove the item at the given `i` and return it. Subsequent items are shifted to fill the resulting gap. When `i` is not a valid index for `a`, return `default`, or throw an error if `default` is not specified.

See also: [`pop!`](/base/collections#Base.pop!), [`popfirst!`](/base/collections#Base.popfirst!), [`deleteat!`](/base/collections#Base.deleteat!), [`splice!`](/base/collections#Base.splice!).

::: tip Julia 1.5

This function is available as of Julia 1.5.

:::

**Examples**

```julia
julia> a = [4, 3, 2, 1]; popat!(a, 2)
3

julia> a
3-element Vector{Int64}:
 4
 2
 1

julia> popat!(a, 4, missing)
missing

julia> popat!(a, 4)
ERROR: BoundsError: attempt to access 3-element Vector{Int64} at index [4]
[...]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1594-L1625)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pushfirst!' href='#Base.pushfirst!'>#</a>&nbsp;<b><u>Base.pushfirst!</u></b> &mdash; <i>Function</i>.




```julia
pushfirst!(collection, items...) -> collection
```


Insert one or more `items` at the beginning of `collection`.

This function is called `unshift` in many other programming languages.

**Examples**

```julia
julia> pushfirst!([1, 2, 3, 4], 5, 6)
6-element Vector{Int64}:
 5
 6
 1
 2
 3
 4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1642-L1660)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.popfirst!' href='#Base.popfirst!'>#</a>&nbsp;<b><u>Base.popfirst!</u></b> &mdash; <i>Function</i>.




```julia
popfirst!(collection) -> item
```


Remove the first `item` from `collection`.

This function is called `shift` in many other programming languages.

See also: [`pop!`](/base/collections#Base.pop!), [`popat!`](/base/collections#Base.popat!), [`delete!`](/base/collections#Base.delete!).

**Examples**

```julia
julia> A = [1, 2, 3, 4, 5, 6]
6-element Vector{Int64}:
 1
 2
 3
 4
 5
 6

julia> popfirst!(A)
1

julia> A
5-element Vector{Int64}:
 2
 3
 4
 5
 6
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1685-L1716)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.insert!' href='#Base.insert!'>#</a>&nbsp;<b><u>Base.insert!</u></b> &mdash; <i>Function</i>.




```julia
insert!(a::Vector, index::Integer, item)
```


Insert an `item` into `a` at the given `index`. `index` is the index of `item` in the resulting `a`.

See also: [`push!`](/base/collections#Base.push!), [`replace`](/base/collections#Base.replace-Tuple{Any,%20Vararg{Pair}}), [`popat!`](/base/collections#Base.popat!), [`splice!`](/base/collections#Base.splice!).

**Examples**

```julia
julia> insert!(Any[1:6;], 3, "here")
7-element Vector{Any}:
 1
 2
  "here"
 3
 4
 5
 6
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1726-L1746)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.deleteat!' href='#Base.deleteat!'>#</a>&nbsp;<b><u>Base.deleteat!</u></b> &mdash; <i>Function</i>.




```julia
deleteat!(a::Vector, i::Integer)
```


Remove the item at the given `i` and return the modified `a`. Subsequent items are shifted to fill the resulting gap.

See also: [`keepat!`](/base/collections#Base.keepat!), [`delete!`](/base/collections#Base.delete!), [`popat!`](/base/collections#Base.popat!), [`splice!`](/base/collections#Base.splice!).

**Examples**

```julia
julia> deleteat!([6, 5, 4, 3, 2, 1], 2)
5-element Vector{Int64}:
 6
 4
 3
 2
 1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1757-L1775)



```julia
deleteat!(a::Vector, inds)
```


Remove the items at the indices given by `inds`, and return the modified `a`. Subsequent items are shifted to fill the resulting gap.

`inds` can be either an iterator or a collection of sorted and unique integer indices, or a boolean vector of the same length as `a` with `true` indicating entries to delete.

**Examples**

```julia
julia> deleteat!([6, 5, 4, 3, 2, 1], 1:2:5)
3-element Vector{Int64}:
 5
 3
 1

julia> deleteat!([6, 5, 4, 3, 2, 1], [true, false, true, false, true, false])
3-element Vector{Int64}:
 5
 3
 1

julia> deleteat!([6, 5, 4, 3, 2, 1], (2, 2))
ERROR: ArgumentError: indices must be unique and sorted
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1794-L1822)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.keepat!' href='#Base.keepat!'>#</a>&nbsp;<b><u>Base.keepat!</u></b> &mdash; <i>Function</i>.




```julia
keepat!(a::Vector, inds)
keepat!(a::BitVector, inds)
```


Remove the items at all the indices which are not given by `inds`, and return the modified `a`. Items which are kept are shifted to fill the resulting gaps.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

`inds` must be an iterator of sorted and unique integer indices. See also [`deleteat!`](/base/collections#Base.deleteat!).

::: tip Julia 1.7

This function is available as of Julia 1.7.

:::

**Examples**

```julia
julia> keepat!([6, 5, 4, 3, 2, 1], 1:2:5)
3-element Vector{Int64}:
 6
 4
 2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L2966-L2990)



```julia
keepat!(a::Vector, m::AbstractVector{Bool})
keepat!(a::BitVector, m::AbstractVector{Bool})
```


The in-place version of logical indexing `a = a[m]`. That is, `keepat!(a, m)` on vectors of equal length `a` and `m` will remove all elements from `a` for which `m` at the corresponding index is `false`.

**Examples**

```julia
julia> a = [:a, :b, :c];

julia> keepat!(a, [true, false, true])
2-element Vector{Symbol}:
 :a
 :c

julia> a
2-element Vector{Symbol}:
 :a
 :c
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L2993-L3015)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.splice!' href='#Base.splice!'>#</a>&nbsp;<b><u>Base.splice!</u></b> &mdash; <i>Function</i>.




```julia
splice!(a::Vector, index::Integer, [replacement]) -> item
```


Remove the item at the given index, and return the removed item. Subsequent items are shifted left to fill the resulting gap. If specified, replacement values from an ordered collection will be spliced in place of the removed item.

See also: [`replace`](/base/collections#Base.replace-Tuple{Any,%20Vararg{Pair}}), [`delete!`](/base/collections#Base.delete!), [`deleteat!`](/base/collections#Base.deleteat!), [`pop!`](/base/collections#Base.pop!), [`popat!`](/base/collections#Base.popat!).

**Examples**

```julia
julia> A = [6, 5, 4, 3, 2, 1]; splice!(A, 5)
2

julia> A
5-element Vector{Int64}:
 6
 5
 4
 3
 1

julia> splice!(A, 5, -1)
1

julia> A
5-element Vector{Int64}:
  6
  5
  4
  3
 -1

julia> splice!(A, 1, [-1, -2, -3])
6

julia> A
7-element Vector{Int64}:
 -1
 -2
 -3
  5
  4
  3
 -1
```


To insert `replacement` before an index `n` without removing any items, use `splice!(collection, n:n-1, replacement)`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1897-L1947)



```julia
splice!(a::Vector, indices, [replacement]) -> items
```


Remove items at specified indices, and return a collection containing the removed items. Subsequent items are shifted left to fill the resulting gaps. If specified, replacement values from an ordered collection will be spliced in place of the removed items; in this case, `indices` must be a `AbstractUnitRange`.

To insert `replacement` before an index `n` without removing any items, use `splice!(collection, n:n-1, replacement)`.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::

::: tip Julia 1.5

Prior to Julia 1.5, `indices` must always be a `UnitRange`.

:::

::: tip Julia 1.8

Prior to Julia 1.8, `indices` must be a `UnitRange` if splicing in replacement values.

:::

**Examples**

```julia
julia> A = [-1, -2, -3, 5, 4, 3, -1]; splice!(A, 4:3, 2)
Int64[]

julia> A
8-element Vector{Int64}:
 -1
 -2
 -3
  2
  5
  4
  3
 -1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1966-L2002)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.resize!' href='#Base.resize!'>#</a>&nbsp;<b><u>Base.resize!</u></b> &mdash; <i>Function</i>.




```julia
resize!(a::Vector, n::Integer) -> Vector
```


Resize `a` to contain `n` elements. If `n` is smaller than the current collection length, the first `n` elements will be retained. If `n` is larger, the new elements are not guaranteed to be initialized.

**Examples**

```julia
julia> resize!([6, 5, 4, 3, 2, 1], 3)
3-element Vector{Int64}:
 6
 5
 4

julia> a = resize!([6, 5, 4, 3, 2, 1], 8);

julia> length(a)
8

julia> a[1:6]
6-element Vector{Int64}:
 6
 5
 4
 3
 2
 1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1423-L1452)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.append!' href='#Base.append!'>#</a>&nbsp;<b><u>Base.append!</u></b> &mdash; <i>Function</i>.




```julia
append!(collection, collections...) -> collection.
```


For an ordered container `collection`, add the elements of each `collections` to the end of it.

::: tip Julia 1.6

Specifying multiple collections to be appended requires at least Julia 1.6.

:::

**Examples**

```julia
julia> append!([1], [2, 3])
3-element Vector{Int64}:
 1
 2
 3

julia> append!([1, 2, 3], [4, 5], [6])
6-element Vector{Int64}:
 1
 2
 3
 4
 5
 6
```


Use [`push!`](/base/collections#Base.push!) to add individual items to `collection` which are not already themselves in another collection. The result of the preceding example is equivalent to `push!([1, 2, 3], 4, 5, 6)`.

See [`sizehint!`](/base/collections#Base.sizehint!) for notes about the performance model.

See also [`vcat`](/base/arrays#Base.vcat) for vectors, [`union!`](/base/collections#Base.union!) for sets, and [`prepend!`](/base/collections#Base.prepend!) and [`pushfirst!`](/base/collections#Base.pushfirst!) for the opposite order.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1289-L1324)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.prepend!' href='#Base.prepend!'>#</a>&nbsp;<b><u>Base.prepend!</u></b> &mdash; <i>Function</i>.




```julia
prepend!(a::Vector, collections...) -> collection
```


Insert the elements of each `collections` to the beginning of `a`.

When `collections` specifies multiple collections, order is maintained: elements of `collections[1]` will appear leftmost in `a`, and so on.

::: tip Julia 1.6

Specifying multiple collections to be prepended requires at least Julia 1.6.

:::

**Examples**

```julia
julia> prepend!([3], [1, 2])
3-element Vector{Int64}:
 1
 2
 3

julia> prepend!([6], [1, 2], [3, 4, 5])
6-element Vector{Int64}:
 1
 2
 3
 4
 5
 6
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/array.jl#L1355-L1383)

</div>
<br>

Fully implemented by:
- `Vector` (a.k.a. 1-dimensional [`Array`](/base/arrays#Core.Array))
  
- `BitVector` (a.k.a. 1-dimensional [`BitArray`](/base/arrays#Base.BitArray))
  

## Utility Collections {#Utility-Collections}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Pair' href='#Core.Pair'>#</a>&nbsp;<b><u>Core.Pair</u></b> &mdash; <i>Type</i>.




```julia
Pair(x, y)
x => y
```


Construct a `Pair` object with type `Pair{typeof(x), typeof(y)}`. The elements are stored in the fields `first` and `second`. They can also be accessed via iteration (but a `Pair` is treated as a single &quot;scalar&quot; for broadcasting operations).

See also [`Dict`](/base/collections#Base.Dict).

**Examples**

```julia
julia> p = "foo" => 7
"foo" => 7

julia> typeof(p)
Pair{String, Int64}

julia> p.first
"foo"

julia> for x in p
           println(x)
       end
foo
7

julia> replace.(["xops", "oxps"], "x" => "o")
2-element Vector{String}:
 "oops"
 "oops"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/pair.jl#L5-L37)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Pairs' href='#Base.Pairs'>#</a>&nbsp;<b><u>Base.Pairs</u></b> &mdash; <i>Type</i>.




```julia
Base.Pairs(values, keys) <: AbstractDict{eltype(keys), eltype(values)}
```


Transforms an indexable container into a Dictionary-view of the same data. Modifying the key-space of the underlying data may invalidate this object.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/essentials.jl#L489-L494)

</div>
<br>
