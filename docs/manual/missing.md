
# Missing Values {#missing}

Julia provides support for representing missing values in the statistical sense. This is for situations where no value is available for a variable in an observation, but a valid value theoretically exists. Missing values are represented via the [`missing`](/manual/missing#missing) object, which is the singleton instance of the type [`Missing`](/base/base#Base.Missing). `missing` is equivalent to [`NULL` in SQL](https://en.wikipedia.org/wiki/NULL_(SQL)) and [`NA` in R](https://cran.r-project.org/doc/manuals/r-release/R-lang.html#NA-handling), and behaves like them in most situations.

## Propagation of Missing Values {#Propagation-of-Missing-Values}

`missing` values _propagate_ automatically when passed to standard mathematical operators and functions. For these functions, uncertainty about the value of one of the operands induces uncertainty about the result. In practice, this means a math operation involving a `missing` value generally returns `missing`:

```julia
julia> missing + 1
missing

julia> "a" * missing
missing

julia> abs(missing)
missing
```


Since `missing` is a normal Julia object, this propagation rule only works for functions which have opted in to implement this behavior. This can be achieved by:
- adding a specific method defined for arguments of type `Missing`,
  
- accepting arguments of this type, and passing them to functions which propagate them (like standard math operators).
  

Packages should consider whether it makes sense to propagate missing values when defining new functions, and define methods appropriately if this is the case. Passing a `missing` value to a function which does not have a method accepting arguments of type `Missing` throws a [`MethodError`](/base/base#Core.MethodError), just like for any other type.

Functions that do not propagate `missing` values can be made to do so by wrapping them in the `passmissing` function provided by the [Missings.jl](https://github.com/JuliaData/Missings.jl) package. For example, `f(x)` becomes `passmissing(f)(x)`.

## Equality and Comparison Operators {#Equality-and-Comparison-Operators}

Standard equality and comparison operators follow the propagation rule presented above: if any of the operands is `missing`, the result is `missing`. Here are a few examples:

```julia
julia> missing == 1
missing

julia> missing == missing
missing

julia> missing < 1
missing

julia> 2 >= missing
missing
```


In particular, note that `missing == missing` returns `missing`, so `==` cannot be used to test whether a value is missing. To test whether `x` is `missing`, use [`ismissing(x)`](/base/base#Base.ismissing).

Special comparison operators [`isequal`](/base/base#Base.isequal) and [`===`](/base/base#Core.:===) are exceptions to the propagation rule. They will always return a `Bool` value, even in the presence of `missing` values, considering `missing` as equal to `missing` and as different from any other value. They can therefore be used to test whether a value is `missing`:

```julia
julia> missing === 1
false

julia> isequal(missing, 1)
false

julia> missing === missing
true

julia> isequal(missing, missing)
true
```


The [`isless`](/base/base#Base.isless) operator is another exception: `missing` is considered as greater than any other value. This operator is used by [`sort!`](/base/sort#Base.sort!), which therefore places `missing` values after all other values:

```julia
julia> isless(1, missing)
true

julia> isless(missing, Inf)
false

julia> isless(missing, missing)
false
```


## Logical operators {#Logical-operators}

Logical (or boolean) operators [`|`](/base/math#Base.:|), [`&`](/base/math#Base.:&) and [`xor`](/base/math#Base.xor) are another special case since they only propagate `missing` values when it is logically required. For these operators, whether or not the result is uncertain, depends on the particular operation. This follows the well-established rules of [_three-valued logic_](https://en.wikipedia.org/wiki/Three-valued_logic) which are implemented by e.g. `NULL` in SQL and `NA` in R. This abstract definition corresponds to a relatively natural behavior which is best explained via concrete examples.

Let us illustrate this principle with the logical &quot;or&quot; operator [`|`](/base/math#Base.:|). Following the rules of boolean logic, if one of the operands is `true`, the value of the other operand does not have an influence on the result, which will always be `true`:

```julia
julia> true | true
true

julia> true | false
true

julia> false | true
true
```


Based on this observation, we can conclude if one of the operands is `true` and the other `missing`, we know that the result is `true` in spite of the uncertainty about the actual value of one of the operands. If we had been able to observe the actual value of the second operand, it could only be `true` or `false`, and in both cases the result would be `true`. Therefore, in this particular case, missingness does _not_ propagate:

```julia
julia> true | missing
true

julia> missing | true
true
```


On the contrary, if one of the operands is `false`, the result could be either `true` or `false` depending on the value of the other operand. Therefore, if that operand is `missing`, the result has to be `missing` too:

```julia
julia> false | true
true

julia> true | false
true

julia> false | false
false

julia> false | missing
missing

julia> missing | false
missing
```


The behavior of the logical &quot;and&quot; operator [`&`](/base/math#Base.:&) is similar to that of the `|` operator, with the difference that missingness does not propagate when one of the operands is `false`. For example, when that is the case of the first operand:

```julia
julia> false & false
false

julia> false & true
false

julia> false & missing
false
```


On the other hand, missingness propagates when one of the operands is `true`, for example the first one:

```julia
julia> true & true
true

julia> true & false
false

julia> true & missing
missing
```


Finally, the &quot;exclusive or&quot; logical operator [`xor`](/base/math#Base.xor) always propagates `missing` values, since both operands always have an effect on the result. Also note that the negation operator [`!`](/base/math#Base.:!) returns `missing` when the operand is `missing`, just like other unary operators.

## Control Flow and Short-Circuiting Operators {#Control-Flow-and-Short-Circuiting-Operators}

Control flow operators including [`if`](/base/base#if), [`while`](/base/base#while) and the [ternary operator](/manual/control-flow#man-conditional-evaluation) `x ? y : z` do not allow for missing values. This is because of the uncertainty about whether the actual value would be `true` or `false` if we could observe it. This implies we do not know how the program should behave. In this case, a [`TypeError`](/base/base#Core.TypeError) is thrown as soon as a `missing` value is encountered in this context:

```julia
julia> if missing
           println("here")
       end
ERROR: TypeError: non-boolean (Missing) used in boolean context
```


For the same reason, contrary to logical operators presented above, the short-circuiting boolean operators [`&&`](/base/math#&&) and [`||`](/base/math#||) do not allow for `missing` values in situations where the value of the operand determines whether the next operand is evaluated or not. For example:

```julia
julia> missing || false
ERROR: TypeError: non-boolean (Missing) used in boolean context

julia> missing && false
ERROR: TypeError: non-boolean (Missing) used in boolean context

julia> true && missing && false
ERROR: TypeError: non-boolean (Missing) used in boolean context
```


In contrast, there is no error thrown when the result can be determined without the `missing` values. This is the case when the code short-circuits before evaluating the `missing` operand, and when the `missing` operand is the last one:

```julia
julia> true && missing
missing

julia> false && missing
false
```


## Arrays With Missing Values {#Arrays-With-Missing-Values}

Arrays containing missing values can be created like other arrays:

```julia
julia> [1, missing]
2-element Vector{Union{Missing, Int64}}:
 1
  missing
```


As this example shows, the element type of such arrays is `Union{Missing, T}`, with `T` the type of the non-missing values. This reflects the fact that array entries can be either of type `T` (here, `Int64`) or of type `Missing`. This kind of array uses an efficient memory storage equivalent to an `Array{T}` holding the actual values combined with an `Array{UInt8}` indicating the type of the entry (i.e. whether it is `Missing` or `T`).

Arrays allowing for missing values can be constructed with the standard syntax. Use `Array{Union{Missing, T}}(missing, dims)` to create arrays filled with missing values:

```julia
julia> Array{Union{Missing, String}}(missing, 2, 3)
2×3 Matrix{Union{Missing, String}}:
 missing  missing  missing
 missing  missing  missing
```


::: tip Note

Using `undef` or `similar` may currently give an array filled with `missing`, but this is not the correct way to obtain such an array. Use a `missing` constructor as shown above instead.

:::

An array with element type allowing `missing` entries (e.g. `Vector{Union{Missing, T}}`) which does not contain any `missing` entries can be converted to an array type that does not allow for `missing` entries (e.g. `Vector{T}`) using [`convert`](/base/base#Base.convert). If the array contains `missing` values, a `MethodError` is thrown during conversion:

```julia
julia> x = Union{Missing, String}["a", "b"]
2-element Vector{Union{Missing, String}}:
 "a"
 "b"

julia> convert(Array{String}, x)
2-element Vector{String}:
 "a"
 "b"

julia> y = Union{Missing, String}[missing, "b"]
2-element Vector{Union{Missing, String}}:
 missing
 "b"

julia> convert(Array{String}, y)
ERROR: MethodError: Cannot `convert` an object of type Missing to an object of type String
```


## Skipping Missing Values {#Skipping-Missing-Values}

Since `missing` values propagate with standard mathematical operators, reduction functions return `missing` when called on arrays which contain missing values:

```julia
julia> sum([1, missing])
missing
```


In this situation, use the [`skipmissing`](/base/base#Base.skipmissing) function to skip missing values:

```julia
julia> sum(skipmissing([1, missing]))
1
```


This convenience function returns an iterator which filters out `missing` values efficiently. It can therefore be used with any function which supports iterators:

```julia
julia> x = skipmissing([3, missing, 2, 1])
skipmissing(Union{Missing, Int64}[3, missing, 2, 1])

julia> maximum(x)
3

julia> sum(x)
6

julia> mapreduce(sqrt, +, x)
4.146264369941973
```


Objects created by calling `skipmissing` on an array can be indexed using indices from the parent array. Indices corresponding to missing values are not valid for these objects, and an error is thrown when trying to use them (they are also skipped by `keys` and `eachindex`):

```julia
julia> x[1]
3

julia> x[2]
ERROR: MissingException: the value at index (2,) is missing
[...]
```


This allows functions which operate on indices to work in combination with `skipmissing`. This is notably the case for search and find functions. These functions return indices valid for the object returned by `skipmissing`, and are also the indices of the matching entries _in the parent array_:

```julia
julia> findall(==(1), x)
1-element Vector{Int64}:
 4

julia> findfirst(!iszero, x)
1

julia> argmax(x)
1
```


Use [`collect`](/base/collections#Base.collect-Tuple{Any}) to extract non-`missing` values and store them in an array:

```julia
julia> collect(x)
3-element Vector{Int64}:
 3
 2
 1
```


## Logical Operations on Arrays {#Logical-Operations-on-Arrays}

The three-valued logic described above for logical operators is also used by logical functions applied to arrays. Thus, array equality tests using the [`==`](/base/math#Base.:==) operator return `missing` whenever the result cannot be determined without knowing the actual value of the `missing` entry. In practice, this means `missing` is returned if all non-missing values of the compared arrays are equal, but one or both arrays contain missing values (possibly at different positions):

```julia
julia> [1, missing] == [2, missing]
false

julia> [1, missing] == [1, missing]
missing

julia> [1, 2, missing] == [1, missing, 2]
missing
```


As for single values, use [`isequal`](/base/base#Base.isequal) to treat `missing` values as equal to other `missing` values, but different from non-missing values:

```julia
julia> isequal([1, missing], [1, missing])
true

julia> isequal([1, 2, missing], [1, missing, 2])
false
```


Functions [`any`](/base/collections#Base.any-Tuple{Any}) and [`all`](/base/collections#Base.all-Tuple{Any}) also follow the rules of three-valued logic. Thus, returning `missing` when the result cannot be determined:

```julia
julia> all([true, missing])
missing

julia> all([false, missing])
false

julia> any([true, missing])
true

julia> any([false, missing])
missing
```

