
# Strings {#lib-strings}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.AbstractString' href='#Core.AbstractString'>#</a>&nbsp;<b><u>Core.AbstractString</u></b> &mdash; <i>Type</i>.




The `AbstractString` type is the supertype of all string implementations in Julia. Strings are encodings of sequences of [Unicode](https://unicode.org/) code points as represented by the `AbstractChar` type. Julia makes a few assumptions about strings:
- Strings are encoded in terms of fixed-size &quot;code units&quot;
  - Code units can be extracted with `codeunit(s, i)`
    
  - The first code unit has index `1`
    
  - The last code unit has index `ncodeunits(s)`
    
  - Any index `i` such that `1 ≤ i ≤ ncodeunits(s)` is in bounds
    
  
- String indexing is done in terms of these code units:
  - Characters are extracted by `s[i]` with a valid string index `i`
    
  - Each `AbstractChar` in a string is encoded by one or more code units
    
  - Only the index of the first code unit of an `AbstractChar` is a valid index
    
  - The encoding of an `AbstractChar` is independent of what precedes or follows it
    
  - String encodings are [self-synchronizing](https://en.wikipedia.org/wiki/Self-synchronizing_code) – i.e. `isvalid(s, i)` is O(1)
    
  

Some string functions that extract code units, characters or substrings from strings error if you pass them out-of-bounds or invalid string indices. This includes `codeunit(s, i)` and `s[i]`. Functions that do string index arithmetic take a more relaxed approach to indexing and give you the closest valid string index when in-bounds, or when out-of-bounds, behave as if there were an infinite number of characters padding each side of the string. Usually these imaginary padding characters have code unit length `1` but string types may choose different &quot;imaginary&quot; character sizes as makes sense for their implementations (e.g. substrings may pass index arithmetic through to the underlying string they provide a view into). Relaxed indexing functions include those intended for index arithmetic: `thisind`, `nextind` and `prevind`. This model allows index arithmetic to work with out-of-bounds indices as intermediate values so long as one never uses them to retrieve a character, which often helps avoid needing to code around edge cases.

See also [`codeunit`](/base/strings#Base.codeunit), [`ncodeunits`](/base/strings#Base.ncodeunits-Tuple{AbstractString}), [`thisind`](/base/strings#Base.thisind), [`nextind`](/base/arrays#Base.nextind), [`prevind`](/base/arrays#Base.prevind).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L3-L38)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.AbstractChar' href='#Core.AbstractChar'>#</a>&nbsp;<b><u>Core.AbstractChar</u></b> &mdash; <i>Type</i>.




The `AbstractChar` type is the supertype of all character implementations in Julia. A character represents a Unicode code point, and can be converted to an integer via the [`codepoint`](/base/strings#Base.codepoint) function in order to obtain the numerical value of the code point, or constructed from the same integer. These numerical values determine how characters are compared with `<` and `==`, for example.  New `T <: AbstractChar` types should define a `codepoint(::T)` method and a `T(::UInt32)` constructor, at minimum.

A given `AbstractChar` subtype may be capable of representing only a subset of Unicode, in which case conversion from an unsupported `UInt32` value may throw an error. Conversely, the built-in [`Char`](/base/strings#Core.Char) type represents a _superset_ of Unicode (in order to losslessly encode invalid byte streams), in which case conversion of a non-Unicode value _to_ `UInt32` throws an error. The [`isvalid`](/base/strings#Base.isvalid-Tuple{Any}) function can be used to check which codepoints are representable in a given `AbstractChar` type.

Internally, an `AbstractChar` type may use a variety of encodings.  Conversion via `codepoint(char)` will not reveal this encoding because it always returns the Unicode value of the character. `print(io, c)` of any `c::AbstractChar` produces an encoding determined by `io` (UTF-8 for all built-in `IO` types), via conversion to `Char` if necessary.

`write(io, c)`, in contrast, may emit an encoding depending on `typeof(c)`, and `read(io, typeof(c))` should read the same encoding as `write`. New `AbstractChar` types must provide their own implementations of `write` and `read`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/char.jl#L3-L30)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Char' href='#Core.Char'>#</a>&nbsp;<b><u>Core.Char</u></b> &mdash; <i>Type</i>.




```julia
Char(c::Union{Number,AbstractChar})
```


`Char` is a 32-bit [`AbstractChar`](/base/strings#Core.AbstractChar) type that is the default representation of characters in Julia. `Char` is the type used for character literals like `'x'` and it is also the element type of [`String`](/base/strings#Core.String-Tuple{AbstractString}).

In order to losslessly represent arbitrary byte streams stored in a `String`, a `Char` value may store information that cannot be converted to a Unicode codepoint — converting such a `Char` to `UInt32` will throw an error. The [`isvalid(c::Char)`](/base/strings#Base.isvalid-Tuple{Any}) function can be used to query whether `c` represents a valid Unicode character.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/char.jl#L33-L45)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.codepoint' href='#Base.codepoint'>#</a>&nbsp;<b><u>Base.codepoint</u></b> &mdash; <i>Function</i>.




```julia
codepoint(c::AbstractChar) -> Integer
```


Return the Unicode codepoint (an unsigned integer) corresponding to the character `c` (or throw an exception if `c` does not represent a valid character). For `Char`, this is a `UInt32` value, but `AbstractChar` types that represent only a subset of Unicode may return a different-sized integer (e.g. `UInt8`).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/char.jl#L74-L82)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.length-Tuple{AbstractString}' href='#Base.length-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.length</u></b> &mdash; <i>Method</i>.




```julia
length(s::AbstractString) -> Int
length(s::AbstractString, i::Integer, j::Integer) -> Int
```


Return the number of characters in string `s` from indices `i` through `j`.

This is computed as the number of code unit indices from `i` to `j` which are valid character indices. With only a single string argument, this computes the number of characters in the entire string. With `i` and `j` arguments it computes the number of indices between `i` and `j` inclusive that are valid indices in the string `s`. In addition to in-bounds values, `i` may take the out-of-bounds value `ncodeunits(s) + 1` and `j` may take the out-of-bounds value `0`.

::: tip Note

The time complexity of this operation is linear in general. That is, it will take the time proportional to the number of bytes or characters in the string because it counts the value on the fly. This is in contrast to the method for arrays, which is a constant-time operation.

:::

See also [`isvalid`](/base/strings#Base.isvalid-Tuple{Any}), [`ncodeunits`](/base/strings#Base.ncodeunits-Tuple{AbstractString}), [`lastindex`](/base/collections#Base.lastindex), [`thisind`](/base/strings#Base.thisind), [`nextind`](/base/arrays#Base.nextind), [`prevind`](/base/arrays#Base.prevind).

**Examples**

```julia
julia> length("jμΛIα")
5
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L374-L402)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sizeof-Tuple{AbstractString}' href='#Base.sizeof-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.sizeof</u></b> &mdash; <i>Method</i>.




```julia
sizeof(str::AbstractString)
```


Size, in bytes, of the string `str`. Equal to the number of code units in `str` multiplied by the size, in bytes, of one code unit in `str`.

**Examples**

```julia
julia> sizeof("")
0

julia> sizeof("∀")
3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L161-L175)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:*-Tuple{Union{AbstractChar, AbstractString}, Vararg{Union{AbstractChar, AbstractString}}}' href='#Base.:*-Tuple{Union{AbstractChar, AbstractString}, Vararg{Union{AbstractChar, AbstractString}}}'>#</a>&nbsp;<b><u>Base.:*</u></b> &mdash; <i>Method</i>.




```julia
*(s::Union{AbstractString, AbstractChar}, t::Union{AbstractString, AbstractChar}...) -> AbstractString
```


Concatenate strings and/or characters, producing a [`String`](/base/strings#Core.String-Tuple{AbstractString}) or [`AnnotatedString`](/base/strings#Base.AnnotatedString) (as appropriate). This is equivalent to calling the [`string`](/base/strings#Base.string) or [`annotatedstring`](/base/strings#Base.annotatedstring) function on the arguments. Concatenation of built-in string types always produces a value of type `String` but other string types may choose to return a string of a different type as appropriate.

**Examples**

```julia
julia> "Hello " * "world"
"Hello world"

julia> 'j' * "ulia"
"julia"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L242-L259)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:^-Tuple{Union{AbstractChar, AbstractString}, Integer}' href='#Base.:^-Tuple{Union{AbstractChar, AbstractString}, Integer}'>#</a>&nbsp;<b><u>Base.:^</u></b> &mdash; <i>Method</i>.




```julia
^(s::Union{AbstractString,AbstractChar}, n::Integer) -> AbstractString
```


Repeat a string or character `n` times. This can also be written as `repeat(s, n)`.

See also [`repeat`](/base/arrays#Base.repeat).

**Examples**

```julia
julia> "Test "^3
"Test Test Test "
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L765-L777)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.string' href='#Base.string'>#</a>&nbsp;<b><u>Base.string</u></b> &mdash; <i>Function</i>.




```julia
string(n::Integer; base::Integer = 10, pad::Integer = 1)
```


Convert an integer `n` to a string in the given `base`, optionally specifying a number of digits to pad to.

See also [`digits`](/base/numbers#Base.digits), [`bitstring`](/base/numbers#Base.bitstring), [`count_zeros`](/base/numbers#Base.count_zeros).

**Examples**

```julia
julia> string(5, base = 13, pad = 4)
"0005"

julia> string(-13, base = 5, pad = 4)
"-0023"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/intfuncs.jl#L903-L919)



```julia
string(xs...)
```


Create a string from any values using the [`print`](/base/io-network#Base.print) function.

`string` should usually not be defined directly. Instead, define a method `print(io::IO, x::MyType)`. If `string(x)` for a certain type needs to be highly efficient, then it may make sense to add a method to `string` and define `print(io::IO, x::MyType) = print(io, string(x))` to ensure the functions are consistent.

See also: [`String`](/base/strings#Core.String-Tuple{AbstractString}), [`repr`](/base/io-network#Base.repr-Tuple{MIME,%20Any}), [`sprint`](/base/io-network#Base.sprint), [`show`](/base/base#Base.@show).

**Examples**

```julia
julia> string("a", 1, true)
"a1true"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L170-L188)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.repeat-Tuple{AbstractString, Integer}' href='#Base.repeat-Tuple{AbstractString, Integer}'>#</a>&nbsp;<b><u>Base.repeat</u></b> &mdash; <i>Method</i>.




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



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L750-L762)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.repeat-Tuple{AbstractChar, Integer}' href='#Base.repeat-Tuple{AbstractChar, Integer}'>#</a>&nbsp;<b><u>Base.repeat</u></b> &mdash; <i>Method</i>.




```julia
repeat(c::AbstractChar, r::Integer) -> String
```


Repeat a character `r` times. This can equivalently be accomplished by calling [`c^r`](/base/strings#Base.:^-Tuple{Union{AbstractChar,%20AbstractString},%20Integer}).

**Examples**

```julia
julia> repeat('A', 3)
"AAA"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/string.jl#L558-L569)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.repr-Tuple{Any}' href='#Base.repr-Tuple{Any}'>#</a>&nbsp;<b><u>Base.repr</u></b> &mdash; <i>Method</i>.




```julia
repr(x; context=nothing)
```


Create a string from any value using the 2-argument `show(io, x)` function. You should not add methods to `repr`; define a [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}) method instead.

The optional keyword argument `context` can be set to a `:key=>value` pair, a tuple of `:key=>value` pairs, or an `IO` or [`IOContext`](/base/io-network#Base.IOContext) object whose attributes are used for the I/O stream passed to `show`.

Note that `repr(x)` is usually similar to how the value of `x` would be entered in Julia.  See also [`repr(MIME("text/plain"), x)`](/base/io-network#Base.repr-Tuple{MIME,%20Any}) to instead return a &quot;pretty-printed&quot; version of `x` designed more for human consumption, equivalent to the REPL display of `x`, using the 3-argument `show(io, mime, x)`.

::: tip Julia 1.7

Passing a tuple to keyword `context` requires Julia 1.7 or later.

:::

**Examples**

```julia
julia> repr(1)
"1"

julia> repr(zeros(3))
"[0.0, 0.0, 0.0]"

julia> repr(big(1/3))
"0.333333333333333314829616256247390992939472198486328125"

julia> repr(big(1/3), context=:compact => true)
"0.333333"

```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L252-L285)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.String-Tuple{AbstractString}' href='#Core.String-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Core.String</u></b> &mdash; <i>Method</i>.




```julia
String(s::AbstractString)
```


Create a new `String` from an existing `AbstractString`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/string.jl#L109-L113)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.SubString' href='#Base.SubString'>#</a>&nbsp;<b><u>Base.SubString</u></b> &mdash; <i>Type</i>.




```julia
SubString(s::AbstractString, i::Integer, j::Integer=lastindex(s))
SubString(s::AbstractString, r::UnitRange{<:Integer})
```


Like [`getindex`](/base/collections#Base.getindex), but returns a view into the parent string `s` within range `i:j` or `r` respectively instead of making a copy.

The [`@views`](/base/arrays#Base.@views) macro converts any string slices `s[i:j]` into substrings `SubString(s, i, j)` in a block of code.

**Examples**

```julia
julia> SubString("abc", 1, 2)
"ab"

julia> SubString("abc", 1:2)
"ab"

julia> SubString("abc", 2)
"bc"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/substring.jl#L3-L24)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.LazyString' href='#Base.LazyString'>#</a>&nbsp;<b><u>Base.LazyString</u></b> &mdash; <i>Type</i>.




```julia
LazyString <: AbstractString
```


A lazy representation of string interpolation. This is useful when a string needs to be constructed in a context where performing the actual interpolation and string construction is unnecessary or undesirable (e.g. in error paths of functions).

This type is designed to be cheap to construct at runtime, trying to offload as much work as possible to either the macro or later printing operations.

**Examples**

```julia
julia> n = 5; str = LazyString("n is ", n)
"n is 5"
```


See also [`@lazy_str`](/base/strings#Base.@lazy_str).

::: tip Julia 1.8

`LazyString` requires Julia 1.8 or later.

:::

**Extended help**

**Safety properties for concurrent programs**

A lazy string itself does not introduce any concurrency problems even if it is printed in multiple Julia tasks.  However, if `print` methods on a captured value can have a concurrency issue when invoked without synchronizations, printing the lazy string may cause an issue.  Furthermore, the `print` methods on the captured values may be invoked multiple times, though only exactly one result will be returned.

::: tip Julia 1.9

`LazyString` is safe in the above sense in Julia 1.9 and later.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/lazy.jl#L1-L35)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@lazy_str' href='#Base.@lazy_str'>#</a>&nbsp;<b><u>Base.@lazy_str</u></b> &mdash; <i>Macro</i>.




```julia
lazy"str"
```


Create a [`LazyString`](/base/strings#Base.LazyString) using regular string interpolation syntax. Note that interpolations are _evaluated_ at LazyString construction time, but _printing_ is delayed until the first access to the string.

See [`LazyString`](/base/strings#Base.LazyString) documentation for the safety properties for concurrent programs.

**Examples**

```
julia> n = 5; str = lazy"n is $n"
"n is 5"

julia> typeof(str)
LazyString
```


::: tip Julia 1.8

`lazy"str"` requires Julia 1.8 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/lazy.jl#L44-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AnnotatedString' href='#Base.AnnotatedString'>#</a>&nbsp;<b><u>Base.AnnotatedString</u></b> &mdash; <i>Type</i>.




```julia
AnnotatedString{S <: AbstractString} <: AbstractString
```


A string with metadata, in the form of annotated regions.

More specifically, this is a simple wrapper around any other [`AbstractString`](/base/strings#Core.AbstractString) that allows for regions of the wrapped string to be annotated with labeled values.

```text
                           C
                    ┌──────┸─────────┐
  "this is an example annotated string"
  └──┰────────┼─────┘         │
     A        └─────┰─────────┘
                    B
```


The above diagram represents a `AnnotatedString` where three ranges have been annotated (labeled `A`, `B`, and `C`). Each annotation holds a label (`Symbol`) and a value (`Any`), paired together as a `Pair{Symbol, <:Any}`.

Labels do not need to be unique, the same region can hold multiple annotations with the same label.

Code written for `AnnotatedString`s in general should conserve the following properties:
- Which characters an annotation is applied to
  
- The order in which annotations are applied to each character
  

Additional semantics may be introduced by specific uses of `AnnotatedString`s.

A corollary of these rules is that adjacent, consecutively placed, annotations with identical labels and values are equivalent to a single annotation spanning the combined range.

See also [`AnnotatedChar`](/base/strings#Base.AnnotatedChar), [`annotatedstring`](/base/strings#Base.annotatedstring), [`annotations`](/base/strings#Base.annotations), and [`annotate!`](/base/strings#Base.annotate!).

::: warning Warning

While the constructors are part of the Base public API, the fields of `AnnotatedString` are not. This is to allow for potential future changes in the implementation of this type. Instead use the [`annotations`](/base/strings#Base.annotations), and [`annotate!`](/base/strings#Base.annotate!) getter/setter functions.

:::

**Constructors**

```julia
AnnotatedString(s::S<:AbstractString) -> AnnotatedString{S}
AnnotatedString(s::S<:AbstractString, annotations::Vector{Tuple{UnitRange{Int}, Pair{Symbol, <:Any}}})
```


A AnnotatedString can also be created with [`annotatedstring`](/base/strings#Base.annotatedstring), which acts much like [`string`](/base/strings#Base.string) but preserves any annotations present in the arguments.

**Examples**

```julia
julia> AnnotatedString("this is an example annotated string",
                    [(1:18, :A => 1), (12:28, :B => 2), (18:35, :C => 3)])
"this is an example annotated string"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/annotated.jl#L3-L66)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AnnotatedChar' href='#Base.AnnotatedChar'>#</a>&nbsp;<b><u>Base.AnnotatedChar</u></b> &mdash; <i>Type</i>.




```julia
AnnotatedChar{S <: AbstractChar} <: AbstractChar
```


A Char with annotations.

More specifically, this is a simple wrapper around any other [`AbstractChar`](/base/strings#Core.AbstractChar), which holds a list of arbitrary labeled annotations (`Pair{Symbol, <:Any}`) with the wrapped character.

See also: [`AnnotatedString`](/base/strings#Base.AnnotatedString), [`annotatedstring`](/base/strings#Base.annotatedstring), `annotations`, and `annotate!`.

::: warning Warning

While the constructors are part of the Base public API, the fields of `AnnotatedChar` are not. This it to allow for potential future changes in the implementation of this type. Instead use the [`annotations`](/base/strings#Base.annotations), and [`annotate!`](/base/strings#Base.annotate!) getter/setter functions.

:::

**Constructors**

```julia
AnnotatedChar(s::S) -> AnnotatedChar{S}
AnnotatedChar(s::S, annotations::Vector{Pair{Symbol, <:Any}})
```


**Examples**

```julia
julia> AnnotatedChar('j', :label => 1)
'j': ASCII/Unicode U+006A (category Ll: Letter, lowercase)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/annotated.jl#L72-L104)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.annotatedstring' href='#Base.annotatedstring'>#</a>&nbsp;<b><u>Base.annotatedstring</u></b> &mdash; <i>Function</i>.




```julia
annotatedstring(values...)
```


Create a `AnnotatedString` from any number of `values` using their [`print`](/base/io-network#Base.print)ed representation.

This acts like [`string`](/base/strings#Base.string), but takes care to preserve any annotations present (in the form of [`AnnotatedString`](/base/strings#Base.AnnotatedString) or [`AnnotatedChar`](/base/strings#Base.AnnotatedChar) values).

See also [`AnnotatedString`](/base/strings#Base.AnnotatedString) and [`AnnotatedChar`](/base/strings#Base.AnnotatedChar).

**Examples**

```julia
julia> annotatedstring("now a AnnotatedString")
"now a AnnotatedString"

julia> annotatedstring(AnnotatedString("annotated", [(1:9, :label => 1)]), ", and unannotated")
"annotated, and unannotated"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/annotated.jl#L224-L244)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.annotations' href='#Base.annotations'>#</a>&nbsp;<b><u>Base.annotations</u></b> &mdash; <i>Function</i>.




```julia
annotations(str::Union{AnnotatedString, SubString{AnnotatedString}},
            [position::Union{Integer, UnitRange}]) ->
    Vector{Tuple{UnitRange{Int}, Pair{Symbol, Any}}}
```


Get all annotations that apply to `str`. Should `position` be provided, only annotations that overlap with `position` will be returned.

Annotations are provided together with the regions they apply to, in the form of a vector of region–annotation tuples.

In accordance with the semantics documented in [`AnnotatedString`](/base/strings#Base.AnnotatedString), the order of annotations returned matches the order in which they were applied.

See also: `annotate!`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/annotated.jl#L373-L388)



```julia
annotations(chr::AnnotatedChar) -> Vector{Pair{Symbol, Any}}
```


Get all annotations of `chr`, in the form of a vector of annotation pairs.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/annotated.jl#L411-L415)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.annotate!' href='#Base.annotate!'>#</a>&nbsp;<b><u>Base.annotate!</u></b> &mdash; <i>Function</i>.




```julia
annotate!(str::AnnotatedString, [range::UnitRange{Int}], label::Symbol => value)
annotate!(str::SubString{AnnotatedString}, [range::UnitRange{Int}], label::Symbol => value)
```


Annotate a `range` of `str` (or the entire string) with a labeled value (`label` =&gt; `value`). To remove existing `label` annotations, use a value of `nothing`.

The order in which annotations are applied to `str` is semantically meaningful, as described in [`AnnotatedString`](/base/strings#Base.AnnotatedString).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/annotated.jl#L343-L352)



```julia
annotate!(char::AnnotatedChar, label::Symbol => value)
```


Annotate `char` with the pair `label => value`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/annotated.jl#L365-L369)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.transcode' href='#Base.transcode'>#</a>&nbsp;<b><u>Base.transcode</u></b> &mdash; <i>Function</i>.




```julia
transcode(T, src)
```


Convert string data between Unicode encodings. `src` is either a `String` or a `Vector{UIntXX}` of UTF-XX code units, where `XX` is 8, 16, or 32. `T` indicates the encoding of the return value: `String` to return a (UTF-8 encoded) `String` or `UIntXX` to return a `Vector{UIntXX}` of UTF-`XX` data. (The alias [`Cwchar_t`](/base/c#Base.Cwchar_t) can also be used as the integer type, for converting `wchar_t*` strings used by external C libraries.)

The `transcode` function succeeds as long as the input data can be reasonably represented in the target encoding; it always succeeds for conversions between UTF-XX encodings, even for invalid Unicode data.

Only conversion to/from UTF-8 is currently supported.

**Examples**

```julia
julia> str = "αβγ"
"αβγ"

julia> transcode(UInt16, str)
3-element Vector{UInt16}:
 0x03b1
 0x03b2
 0x03b3

julia> transcode(String, transcode(UInt16, str))
"αβγ"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/cstring.jl#L129-L160)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_string' href='#Base.unsafe_string'>#</a>&nbsp;<b><u>Base.unsafe_string</u></b> &mdash; <i>Function</i>.




```julia
unsafe_string(p::Ptr{UInt8}, [length::Integer])
```


Copy a string from the address of a C-style (NUL-terminated) string encoded as UTF-8. (The pointer can be safely freed afterwards.) If `length` is specified (the length of the data in bytes), the string does not have to be NUL-terminated.

This function is labeled &quot;unsafe&quot; because it will crash if `p` is not a valid memory address to data of the requested length.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/string.jl#L86-L95)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ncodeunits-Tuple{AbstractString}' href='#Base.ncodeunits-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.ncodeunits</u></b> &mdash; <i>Method</i>.




```julia
ncodeunits(s::AbstractString) -> Int
```


Return the number of code units in a string. Indices that are in bounds to access this string must satisfy `1 ≤ i ≤ ncodeunits(s)`. Not all such indices are valid – they may not be the start of a character, but they will return a code unit value when calling `codeunit(s,i)`.

**Examples**

```julia
julia> ncodeunits("The Julia Language")
18

julia> ncodeunits("∫eˣ")
6

julia> ncodeunits('∫'), ncodeunits('e'), ncodeunits('ˣ')
(3, 1, 2)
```


See also [`codeunit`](/base/strings#Base.codeunit), [`checkbounds`](/base/arrays#Base.checkbounds), [`sizeof`](/base/base#Base.sizeof-Tuple{Type}), [`length`](/base/collections#Base.length), [`lastindex`](/base/collections#Base.lastindex).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L43-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.codeunit' href='#Base.codeunit'>#</a>&nbsp;<b><u>Base.codeunit</u></b> &mdash; <i>Function</i>.




```julia
codeunit(s::AbstractString) -> Type{<:Union{UInt8, UInt16, UInt32}}
```


Return the code unit type of the given string object. For ASCII, Latin-1, or UTF-8 encoded strings, this would be `UInt8`; for UCS-2 and UTF-16 it would be `UInt16`; for UTF-32 it would be `UInt32`. The code unit type need not be limited to these three types, but it&#39;s hard to think of widely used string encodings that don&#39;t use one of these units. `codeunit(s)` is the same as `typeof(codeunit(s,1))` when `s` is a non-empty string.

See also [`ncodeunits`](/base/strings#Base.ncodeunits-Tuple{AbstractString}).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L68-L79)



```julia
codeunit(s::AbstractString, i::Integer) -> Union{UInt8, UInt16, UInt32}
```


Return the code unit value in the string `s` at index `i`. Note that

```
codeunit(s, i) :: codeunit(s)
```


I.e. the value returned by `codeunit(s, i)` is of the type returned by `codeunit(s)`.

**Examples**

```julia
julia> a = codeunit("Hello", 2)
0x65

julia> typeof(a)
UInt8
```


See also [`ncodeunits`](/base/strings#Base.ncodeunits-Tuple{AbstractString}), [`checkbounds`](/base/arrays#Base.checkbounds).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L84-L104)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.codeunits' href='#Base.codeunits'>#</a>&nbsp;<b><u>Base.codeunits</u></b> &mdash; <i>Function</i>.




```julia
codeunits(s::AbstractString)
```


Obtain a vector-like object containing the code units of a string. Returns a `CodeUnits` wrapper by default, but `codeunits` may optionally be defined for new string types if necessary.

**Examples**

```julia
julia> codeunits("Juλia")
6-element Base.CodeUnits{UInt8, String}:
 0x4a
 0x75
 0xce
 0xbb
 0x69
 0x61
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L811-L829)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ascii' href='#Base.ascii'>#</a>&nbsp;<b><u>Base.ascii</u></b> &mdash; <i>Function</i>.




```julia
ascii(s::AbstractString)
```


Convert a string to `String` type and check that it contains only ASCII data, otherwise throwing an `ArgumentError` indicating the position of the first non-ASCII byte.

See also the [`isascii`](/base/strings#Base.isascii) predicate to filter or replace non-ASCII characters.

**Examples**

```julia
julia> ascii("abcdeγfgh")
ERROR: ArgumentError: invalid ASCII at index 6 in "abcdeγfgh"
Stacktrace:
[...]

julia> ascii("abcdefgh")
"abcdefgh"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L1236-L1254)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Regex' href='#Base.Regex'>#</a>&nbsp;<b><u>Base.Regex</u></b> &mdash; <i>Type</i>.




```julia
Regex(pattern[, flags]) <: AbstractPattern
```


A type representing a regular expression. `Regex` objects can be used to match strings with [`match`](/base/strings#Base.match).

`Regex` objects can be created using the [`@r_str`](/base/strings#Base.@r_str) string macro. The `Regex(pattern[, flags])` constructor is usually used if the `pattern` string needs to be interpolated. See the documentation of the string macro for details on flags.

::: tip Note

To escape interpolated variables use `\Q` and `\E` (e.g. `Regex("\\Q$x\\E")`)

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L10-L22)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@r_str' href='#Base.@r_str'>#</a>&nbsp;<b><u>Base.@r_str</u></b> &mdash; <i>Macro</i>.




```julia
@r_str -> Regex
```


Construct a regex, such as `r"^[a-z]*$"`, without interpolation and unescaping (except for quotation mark `"` which still has to be escaped). The regex also accepts one or more flags, listed after the ending quote, to change its behaviour:
- `i` enables case-insensitive matching
  
- `m` treats the `^` and `$` tokens as matching the start and end of individual lines, as opposed to the whole string.
  
- `s` allows the `.` modifier to match newlines.
  
- `x` enables &quot;free-spacing mode&quot;: whitespace between regex tokens is ignored except when escaped with `\`,  and `#` in the regex is treated as starting a comment (which is ignored to the line ending).
  
- `a` enables ASCII mode (disables `UTF` and `UCP` modes). By default `\B`, `\b`, `\D`, `\d`, `\S`, `\s`, `\W`, `\w`, etc. match based on Unicode character properties. With this option, these sequences only match ASCII characters. This includes `\u` also, which will emit the specified character value directly as a single byte, and not attempt to encode it into UTF-8. Importantly, this option allows matching against invalid UTF-8 strings, by treating both matcher and target as simple bytes (as if they were ISO/IEC 8859-1 / Latin-1 bytes) instead of as character encodings. In this case, this option is often combined with `s`. This option can be further refined by starting the pattern with (_UCP) or (_UTF).
  

See [`Regex`](/base/strings#Base.Regex) if interpolation is needed.

**Examples**

```julia
julia> match(r"a+.*b+.*?d$"ism, "Goodbye,\nOh, angry,\nBad world\n")
RegexMatch("angry,\nBad world")
```


This regex has the first three flags enabled.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L91-L122)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.SubstitutionString' href='#Base.SubstitutionString'>#</a>&nbsp;<b><u>Base.SubstitutionString</u></b> &mdash; <i>Type</i>.




```julia
SubstitutionString(substr) <: AbstractString
```


Stores the given string `substr` as a `SubstitutionString`, for use in regular expression substitutions. Most commonly constructed using the [`@s_str`](/base/strings#Base.@s_str) macro.

**Examples**

```julia
julia> SubstitutionString("Hello \\g<name>, it's \\1")
s"Hello \g<name>, it's \1"

julia> subst = s"Hello \g<name>, it's \1"
s"Hello \g<name>, it's \1"

julia> typeof(subst)
SubstitutionString{String}
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L576-L593)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@s_str' href='#Base.@s_str'>#</a>&nbsp;<b><u>Base.@s_str</u></b> &mdash; <i>Macro</i>.




```julia
@s_str -> SubstitutionString
```


Construct a substitution string, used for regular expression substitutions.  Within the string, sequences of the form `\N` refer to the Nth capture group in the regex, and `\g<groupname>` refers to a named capture group with name `groupname`.

**Examples**

```julia
julia> msg = "#Hello# from Julia";

julia> replace(msg, r"#(.+)# from (?<from>\w+)" => s"FROM: \g<from>; MESSAGE: \1")
"FROM: Julia; MESSAGE: Hello"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L610-L624)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@raw_str' href='#Base.@raw_str'>#</a>&nbsp;<b><u>Base.@raw_str</u></b> &mdash; <i>Macro</i>.




```julia
@raw_str -> String
```


Create a raw string without interpolation and unescaping. The exception is that quotation marks still must be escaped. Backslashes escape both quotation marks and other backslashes, but only when a sequence of backslashes precedes a quote character. Thus, 2n backslashes followed by a quote encodes n backslashes and the end of the literal while 2n+1 backslashes followed by a quote encodes n backslashes followed by a quote character.

**Examples**

```julia
julia> println(raw"\ $x")
\ $x

julia> println(raw"\"")
"

julia> println(raw"\\\"")
\"

julia> println(raw"\\x \\\"")
\\x \"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L596-L620)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@b_str' href='#Base.@b_str'>#</a>&nbsp;<b><u>Base.@b_str</u></b> &mdash; <i>Macro</i>.




```julia
@b_str
```


Create an immutable byte (`UInt8`) vector using string syntax.

**Examples**

```julia
julia> v = b"12\x01\x02"
4-element Base.CodeUnits{UInt8, String}:
 0x31
 0x32
 0x01
 0x02

julia> v[2]
0x32
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L573-L590)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Docs.@html_str' href='#Base.Docs.@html_str'>#</a>&nbsp;<b><u>Base.Docs.@html_str</u></b> &mdash; <i>Macro</i>.




```julia
@html_str -> Docs.HTML
```


Create an `HTML` object from a literal string.

**Examples**

```julia
julia> html"Julia"
HTML{String}("Julia")
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/docs/utils.jl#L44-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Docs.@text_str' href='#Base.Docs.@text_str'>#</a>&nbsp;<b><u>Base.Docs.@text_str</u></b> &mdash; <i>Macro</i>.




```julia
@text_str -> Docs.Text
```


Create a `Text` object from a literal string.

**Examples**

```julia
julia> text"Julia"
Julia
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/docs/utils.jl#L98-L108)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isvalid-Tuple{Any}' href='#Base.isvalid-Tuple{Any}'>#</a>&nbsp;<b><u>Base.isvalid</u></b> &mdash; <i>Method</i>.




```julia
isvalid(value) -> Bool
```


Return `true` if the given value is valid for its type, which currently can be either `AbstractChar` or `String` or `SubString{String}`.

**Examples**

```julia
julia> isvalid(Char(0xd800))
false

julia> isvalid(SubString(String(UInt8[0xfe,0x80,0x80,0x80,0x80,0x80]),1,2))
false

julia> isvalid(Char(0xd799))
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L13-L30)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isvalid-Tuple{Any, Any}' href='#Base.isvalid-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.isvalid</u></b> &mdash; <i>Method</i>.




```julia
isvalid(T, value) -> Bool
```


Return `true` if the given value is valid for that type. Types currently can be either `AbstractChar` or `String`. Values for `AbstractChar` can be of type `AbstractChar` or [`UInt32`](/base/numbers#Core.UInt32). Values for `String` can be of that type, `SubString{String}`, `Vector{UInt8}`, or a contiguous subarray thereof.

**Examples**

```julia
julia> isvalid(Char, 0xd800)
false

julia> isvalid(String, SubString("thisisvalid",1,5))
true

julia> isvalid(Char, 0xd799)
true
```


::: tip Julia 1.6

Support for subarray values was added in Julia 1.6.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L33-L55)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isvalid-Tuple{AbstractString, Integer}' href='#Base.isvalid-Tuple{AbstractString, Integer}'>#</a>&nbsp;<b><u>Base.isvalid</u></b> &mdash; <i>Method</i>.




```julia
isvalid(s::AbstractString, i::Integer) -> Bool
```


Predicate indicating whether the given index is the start of the encoding of a character in `s` or not. If `isvalid(s, i)` is true then `s[i]` will return the character whose encoding starts at that index, if it&#39;s false, then `s[i]` will raise an invalid index error or a bounds error depending on if `i` is in bounds. In order for `isvalid(s, i)` to be an O(1) function, the encoding of `s` must be [self-synchronizing](https://en.wikipedia.org/wiki/Self-synchronizing_code). This is a basic assumption of Julia&#39;s generic string support.

See also [`getindex`](/base/collections#Base.getindex), [`iterate`](/base/collections#Base.iterate), [`thisind`](/base/strings#Base.thisind), [`nextind`](/base/arrays#Base.nextind), [`prevind`](/base/arrays#Base.prevind), [`length`](/base/collections#Base.length).

**Examples**

```julia
julia> str = "αβγdef";

julia> isvalid(str, 1)
true

julia> str[1]
'α': Unicode U+03B1 (category Ll: Letter, lowercase)

julia> isvalid(str, 2)
false

julia> str[2]
ERROR: StringIndexError: invalid index [2], valid nearby indices [1]=>'α', [3]=>'β'
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L108-L140)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.match' href='#Base.match'>#</a>&nbsp;<b><u>Base.match</u></b> &mdash; <i>Function</i>.




```julia
match(r::Regex, s::AbstractString[, idx::Integer[, addopts]])
```


Search for the first match of the regular expression `r` in `s` and return a [`RegexMatch`](/base/strings#Base.RegexMatch) object containing the match, or nothing if the match failed. The optional `idx` argument specifies an index at which to start the search. The matching substring can be retrieved by accessing `m.match`, the captured sequences can be retrieved by accessing `m.captures`. The resulting [`RegexMatch`](/base/strings#Base.RegexMatch) object can be used to construct other collections: e.g. `Tuple(m)`, `NamedTuple(m)`.

::: tip Julia 1.11

Constructing NamedTuples and Dicts requires Julia 1.11

:::

**Examples**

```julia
julia> rx = r"a(.)a"
r"a(.)a"

julia> m = match(rx, "cabac")
RegexMatch("aba", 1="b")

julia> m.captures
1-element Vector{Union{Nothing, SubString{String}}}:
 "b"

julia> m.match
"aba"

julia> match(rx, "cabac", 3) === nothing
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L394-L424)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachmatch' href='#Base.eachmatch'>#</a>&nbsp;<b><u>Base.eachmatch</u></b> &mdash; <i>Function</i>.




```julia
eachmatch(r::Regex, s::AbstractString; overlap::Bool=false)
```


Search for all matches of the regular expression `r` in `s` and return an iterator over the matches. If `overlap` is `true`, the matching sequences are allowed to overlap indices in the original string, otherwise they must be from distinct character ranges.

**Examples**

```julia
julia> rx = r"a.a"
r"a.a"

julia> m = eachmatch(rx, "a1a2a3a")
Base.RegexMatchIterator{String}(r"a.a", "a1a2a3a", false)

julia> collect(m)
2-element Vector{RegexMatch}:
 RegexMatch("a1a")
 RegexMatch("a3a")

julia> collect(eachmatch(rx, "a1a2a3a", overlap = true))
3-element Vector{RegexMatch}:
 RegexMatch("a1a")
 RegexMatch("a2a")
 RegexMatch("a3a")
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L766-L792)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.RegexMatch' href='#Base.RegexMatch'>#</a>&nbsp;<b><u>Base.RegexMatch</u></b> &mdash; <i>Type</i>.




```julia
RegexMatch <: AbstractMatch
```


A type representing a single match to a [`Regex`](/base/strings#Base.Regex) found in a string. Typically created from the [`match`](/base/strings#Base.match) function.

The `match` field stores the substring of the entire matched string. The `captures` field stores the substrings for each capture group, indexed by number. To index by capture group name, the entire match object should be indexed instead, as shown in the examples. The location of the start of the match is stored in the `offset` field. The `offsets` field stores the locations of the start of each capture group, with 0 denoting a group that was not captured.

This type can be used as an iterator over the capture groups of the `Regex`, yielding the substrings captured in each group. Because of this, the captures of a match can be destructured. If a group was not captured, `nothing` will be yielded instead of a substring.

Methods that accept a `RegexMatch` object are defined for [`iterate`](/base/collections#Base.iterate), [`length`](/base/collections#Base.length), [`eltype`](/base/collections#Base.eltype), [`keys`](/base/strings#Base.keys-Tuple{RegexMatch}), [`haskey`](/base/collections#Base.haskey), and [`getindex`](/base/collections#Base.getindex), where keys are the names or numbers of a capture group. See [`keys`](/base/strings#Base.keys-Tuple{RegexMatch}) for more information.

`Tuple(m)`, `NamedTuple(m)`, and `Dict(m)` can be used to construct more flexible collection types from `RegexMatch` objects.

::: tip Julia 1.11

Constructing NamedTuples and Dicts from RegexMatches requires Julia 1.11

:::

**Examples**

```julia
julia> m = match(r"(?<hour>\d+):(?<minute>\d+)(am|pm)?", "11:30 in the morning")
RegexMatch("11:30", hour="11", minute="30", 3=nothing)

julia> m.match
"11:30"

julia> m.captures
3-element Vector{Union{Nothing, SubString{String}}}:
 "11"
 "30"
 nothing


julia> m["minute"]
"30"

julia> hr, min, ampm = m; # destructure capture groups by iteration

julia> hr
"11"

julia> Dict(m)
Dict{Any, Union{Nothing, SubString{String}}} with 3 entries:
  "hour"   => "11"
  3        => nothing
  "minute" => "30"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L167-L225)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.keys-Tuple{RegexMatch}' href='#Base.keys-Tuple{RegexMatch}'>#</a>&nbsp;<b><u>Base.keys</u></b> &mdash; <i>Method</i>.




```julia
keys(m::RegexMatch) -> Vector
```


Return a vector of keys for all capture groups of the underlying regex. A key is included even if the capture group fails to match. That is, `idx` will be in the return value even if `m[idx] == nothing`.

Unnamed capture groups will have integer keys corresponding to their index. Named capture groups will have string keys.

::: tip Julia 1.7

This method was added in Julia 1.7

:::

**Examples**

```julia
julia> keys(match(r"(?<hour>\d+):(?<minute>\d+)(am|pm)?", "11:30"))
3-element Vector{Any}:
  "hour"
  "minute"
 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L238-L259)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isless-Tuple{AbstractString, AbstractString}' href='#Base.isless-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Base.isless</u></b> &mdash; <i>Method</i>.




```julia
isless(a::AbstractString, b::AbstractString) -> Bool
```


Test whether string `a` comes before string `b` in alphabetical order (technically, in lexicographical order by Unicode code points).

**Examples**

```julia
julia> isless("a", "b")
true

julia> isless("β", "α")
false

julia> isless("a", "a")
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L340-L357)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:==-Tuple{AbstractString, AbstractString}' href='#Base.:==-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Base.:==</u></b> &mdash; <i>Method</i>.




```julia
==(a::AbstractString, b::AbstractString) -> Bool
```


Test whether two strings are equal character by character (technically, Unicode code point by code point). Should either string be a [`AnnotatedString`](/base/strings#Base.AnnotatedString) the string properties must match too.

**Examples**

```julia
julia> "abc" == "abc"
true

julia> "abc" == "αβγ"
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L322-L337)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cmp-Tuple{AbstractString, AbstractString}' href='#Base.cmp-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Base.cmp</u></b> &mdash; <i>Method</i>.




```julia
cmp(a::AbstractString, b::AbstractString) -> Int
```


Compare two strings. Return `0` if both strings have the same length and the character at each index is the same in both strings. Return `-1` if `a` is a prefix of `b`, or if `a` comes before `b` in alphabetical order. Return `1` if `b` is a prefix of `a`, or if `b` comes before `a` in alphabetical order (technically, lexicographical order by Unicode code points).

**Examples**

```julia
julia> cmp("abc", "abc")
0

julia> cmp("ab", "abc")
-1

julia> cmp("abc", "ab")
1

julia> cmp("ab", "ac")
-1

julia> cmp("ac", "ab")
1

julia> cmp("α", "a")
1

julia> cmp("b", "β")
-1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L278-L310)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.lpad' href='#Base.lpad'>#</a>&nbsp;<b><u>Base.lpad</u></b> &mdash; <i>Function</i>.




```julia
lpad(s, n::Integer, p::Union{AbstractChar,AbstractString}=' ') -> String
```


Stringify `s` and pad the resulting string on the left with `p` to make it `n` characters (in [`textwidth`](/base/strings#Base.Unicode.textwidth)) long. If `s` is already `n` characters long, an equal string is returned. Pad with spaces by default.

**Examples**

```julia
julia> lpad("March", 10)
"     March"
```


::: tip Julia 1.7

In Julia 1.7, this function was changed to use `textwidth` rather than a raw character (codepoint) count.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L452-L466)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rpad' href='#Base.rpad'>#</a>&nbsp;<b><u>Base.rpad</u></b> &mdash; <i>Function</i>.




```julia
rpad(s, n::Integer, p::Union{AbstractChar,AbstractString}=' ') -> String
```


Stringify `s` and pad the resulting string on the right with `p` to make it `n` characters (in [`textwidth`](/base/strings#Base.Unicode.textwidth)) long. If `s` is already `n` characters long, an equal string is returned. Pad with spaces by default.

**Examples**

```julia
julia> rpad("March", 20)
"March               "
```


::: tip Julia 1.7

In Julia 1.7, this function was changed to use `textwidth` rather than a raw character (codepoint) count.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L484-L498)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ltruncate' href='#Base.ltruncate'>#</a>&nbsp;<b><u>Base.ltruncate</u></b> &mdash; <i>Function</i>.




```julia
ltruncate(str::AbstractString, maxwidth::Integer, replacement::Union{AbstractString,AbstractChar} = '…')
```


Truncate `str` to at most `maxwidth` columns (as estimated by [`textwidth`](/base/strings#Base.Unicode.textwidth)), replacing the first characters with `replacement` if necessary. The default replacement string is &quot;…&quot;.

**Examples**

```julia
julia> s = ltruncate("🍕🍕 I love 🍕", 10)
"…I love 🍕"

julia> textwidth(s)
10

julia> ltruncate("foo", 3)
"foo"
```


::: tip Julia 1.12

This function was added in Julia 1.12.

:::

See also [`rtruncate`](/base/strings#Base.rtruncate) and [`ctruncate`](/base/strings#Base.ctruncate).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L549-L571)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rtruncate' href='#Base.rtruncate'>#</a>&nbsp;<b><u>Base.rtruncate</u></b> &mdash; <i>Function</i>.




```julia
rtruncate(str::AbstractString, maxwidth::Integer, replacement::Union{AbstractString,AbstractChar} = '…')
```


Truncate `str` to at most `maxwidth` columns (as estimated by [`textwidth`](/base/strings#Base.Unicode.textwidth)), replacing the last characters with `replacement` if necessary. The default replacement string is &quot;…&quot;.

**Examples**

```julia
julia> s = rtruncate("🍕🍕 I love 🍕", 10)
"🍕🍕 I lo…"

julia> textwidth(s)
10

julia> rtruncate("foo", 3)
"foo"
```


::: tip Julia 1.12

This function was added in Julia 1.12.

:::

See also [`ltruncate`](/base/strings#Base.ltruncate) and [`ctruncate`](/base/strings#Base.ctruncate).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L516-L538)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ctruncate' href='#Base.ctruncate'>#</a>&nbsp;<b><u>Base.ctruncate</u></b> &mdash; <i>Function</i>.




```julia
ctruncate(str::AbstractString, maxwidth::Integer, replacement::Union{AbstractString,AbstractChar} = '…'; prefer_left::Bool = true)
```


Truncate `str` to at most `maxwidth` columns (as estimated by [`textwidth`](/base/strings#Base.Unicode.textwidth)), replacing the middle characters with `replacement` if necessary. The default replacement string is &quot;…&quot;. By default, the truncation prefers keeping chars on the left, but this can be changed by setting `prefer_left` to `false`.

**Examples**

```julia
julia> s = ctruncate("🍕🍕 I love 🍕", 10)
"🍕🍕 …e 🍕"

julia> textwidth(s)
10

julia> ctruncate("foo", 3)
"foo"
```


::: tip Julia 1.12

This function was added in Julia 1.12.

:::

See also [`ltruncate`](/base/strings#Base.ltruncate) and [`rtruncate`](/base/strings#Base.rtruncate).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L582-L605)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findfirst-Tuple{AbstractString, AbstractString}' href='#Base.findfirst-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Base.findfirst</u></b> &mdash; <i>Method</i>.




```julia
findfirst(pattern::AbstractString, string::AbstractString)
findfirst(pattern::AbstractPattern, string::String)
```


Find the first occurrence of `pattern` in `string`. Equivalent to [`findnext(pattern, string, firstindex(s))`](/base/arrays#Base.findnext-Tuple{Any,%20Integer}).

**Examples**

```julia
julia> findfirst("z", "Hello to the world") # returns nothing, but not printed in the REPL

julia> findfirst("Julia", "JuliaLang")
1:5
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L154-L168)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findnext-Tuple{AbstractString, AbstractString, Integer}' href='#Base.findnext-Tuple{AbstractString, AbstractString, Integer}'>#</a>&nbsp;<b><u>Base.findnext</u></b> &mdash; <i>Method</i>.




```julia
findnext(pattern::AbstractString, string::AbstractString, start::Integer)
findnext(pattern::AbstractPattern, string::String, start::Integer)
```


Find the next occurrence of `pattern` in `string` starting at position `start`. `pattern` can be either a string, or a regular expression, in which case `string` must be of type `String`.

The return value is a range of indices where the matching sequence is found, such that `s[findnext(x, s, i)] == x`:

`findnext("substring", string, i)` == `start:stop` such that `string[start:stop] == "substring"` and `i <= start`, or `nothing` if unmatched.

**Examples**

```julia
julia> findnext("z", "Hello to the world", 1) === nothing
true

julia> findnext("o", "Hello to the world", 6)
8:8

julia> findnext("Lang", "JuliaLang", 2)
6:9
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L342-L367)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findnext-Tuple{AbstractChar, AbstractString, Integer}' href='#Base.findnext-Tuple{AbstractChar, AbstractString, Integer}'>#</a>&nbsp;<b><u>Base.findnext</u></b> &mdash; <i>Method</i>.




```julia
findnext(ch::AbstractChar, string::AbstractString, start::Integer)
```


Find the next occurrence of character `ch` in `string` starting at position `start`.

::: tip Julia 1.3

This method requires at least Julia 1.3.

:::

**Examples**

```julia
julia> findnext('z', "Hello to the world", 1) === nothing
true

julia> findnext('o', "Hello to the world", 6)
8
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L370-L386)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findlast-Tuple{AbstractString, AbstractString}' href='#Base.findlast-Tuple{AbstractString, AbstractString}'>#</a>&nbsp;<b><u>Base.findlast</u></b> &mdash; <i>Method</i>.




```julia
findlast(pattern::AbstractString, string::AbstractString)
```


Find the last occurrence of `pattern` in `string`. Equivalent to [`findprev(pattern, string, lastindex(string))`](/base/arrays#Base.findprev-Tuple{Any,%20Integer}).

**Examples**

```julia
julia> findlast("o", "Hello to the world")
15:15

julia> findfirst("Julia", "JuliaLang")
1:5
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L414-L428)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findlast-Tuple{AbstractChar, AbstractString}' href='#Base.findlast-Tuple{AbstractChar, AbstractString}'>#</a>&nbsp;<b><u>Base.findlast</u></b> &mdash; <i>Method</i>.




```julia
findlast(ch::AbstractChar, string::AbstractString)
```


Find the last occurrence of character `ch` in `string`.

::: tip Julia 1.3

This method requires at least Julia 1.3.

:::

**Examples**

```julia
julia> findlast('p', "happy")
4

julia> findlast('z', "happy") === nothing
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L449-L465)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.findprev-Tuple{AbstractString, AbstractString, Integer}' href='#Base.findprev-Tuple{AbstractString, AbstractString, Integer}'>#</a>&nbsp;<b><u>Base.findprev</u></b> &mdash; <i>Method</i>.




```julia
findprev(pattern::AbstractString, string::AbstractString, start::Integer)
```


Find the previous occurrence of `pattern` in `string` starting at position `start`.

The return value is a range of indices where the matching sequence is found, such that `s[findprev(x, s, i)] == x`:

`findprev("substring", string, i)` == `start:stop` such that `string[start:stop] == "substring"` and `stop <= i`, or `nothing` if unmatched.

**Examples**

```julia
julia> findprev("z", "Hello to the world", 18) === nothing
true

julia> findprev("o", "Hello to the world", 18)
15:15

julia> findprev("Julia", "JuliaLang", 6)
1:5
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L660-L682)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.occursin' href='#Base.occursin'>#</a>&nbsp;<b><u>Base.occursin</u></b> &mdash; <i>Function</i>.




```julia
occursin(needle::Union{AbstractString,AbstractPattern,AbstractChar}, haystack::AbstractString)
```


Determine whether the first argument is a substring of the second. If `needle` is a regular expression, checks whether `haystack` contains a match.

**Examples**

```julia
julia> occursin("Julia", "JuliaLang is pretty cool!")
true

julia> occursin('a', "JuliaLang is pretty cool!")
true

julia> occursin(r"a.a", "aba")
true

julia> occursin(r"a.a", "abba")
false
```


See also [`contains`](/base/strings#Base.contains).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L725-L747)



```julia
occursin(haystack)
```


Create a function that checks whether its argument occurs in `haystack`, i.e. a function equivalent to `needle -> occursin(needle, haystack)`.

The returned function is of type `Base.Fix2{typeof(occursin)}`.

::: tip Julia 1.6

This method requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> search_f = occursin("JuliaLang is a programming language");

julia> search_f("JuliaLang")
true

julia> search_f("Python")
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/search.jl#L751-L772)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reverse-Tuple{Union{SubString{String}, String}}' href='#Base.reverse-Tuple{Union{SubString{String}, String}}'>#</a>&nbsp;<b><u>Base.reverse</u></b> &mdash; <i>Method</i>.




```julia
reverse(s::AbstractString) -> AbstractString
```


Reverses a string. Technically, this function reverses the codepoints in a string and its main utility is for reversed-order string processing, especially for reversed regular-expression searches. See also [`reverseind`](/base/arrays#Base.reverseind) to convert indices in `s` to indices in `reverse(s)` and vice-versa, and `graphemes` from module `Unicode` to operate on user-visible &quot;characters&quot; (graphemes) rather than codepoints. See also [`Iterators.reverse`](/base/iterators#Base.Iterators.reverse) for reverse-order iteration without making a copy. Custom string types must implement the `reverse` function themselves and should typically return a string with the same type and encoding. If they return a string with a different encoding, they must also override `reverseind` for that string type to satisfy `s[reverseind(s,i)] == reverse(s)[i]`.

**Examples**

```julia
julia> reverse("JuliaLang")
"gnaLailuJ"
```


::: tip Note

The examples below may be rendered differently on different systems. The comments indicate how they&#39;re supposed to be rendered

:::

Combining characters can lead to surprising results:

```julia
julia> reverse("ax̂e") # hat is above x in the input, above e in the output
"êxa"

julia> using Unicode

julia> join(reverse(collect(graphemes("ax̂e")))) # reverses graphemes; hat is above x in both in- and output
"ex̂a"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/substring.jl#L145-L180)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.replace-Tuple{IO, AbstractString, Vararg{Pair}}' href='#Base.replace-Tuple{IO, AbstractString, Vararg{Pair}}'>#</a>&nbsp;<b><u>Base.replace</u></b> &mdash; <i>Method</i>.




```julia
replace([io::IO], s::AbstractString, pat=>r, [pat2=>r2, ...]; [count::Integer])
```


Search for the given pattern `pat` in `s`, and replace each occurrence with `r`. If `count` is provided, replace at most `count` occurrences. `pat` may be a single character, a vector or a set of characters, a string, or a regular expression. If `r` is a function, each occurrence is replaced with `r(s)` where `s` is the matched substring (when `pat` is a `AbstractPattern` or `AbstractString`) or character (when `pat` is an `AbstractChar` or a collection of `AbstractChar`). If `pat` is a regular expression and `r` is a [`SubstitutionString`](/base/strings#Base.SubstitutionString), then capture group references in `r` are replaced with the corresponding matched text. To remove instances of `pat` from `string`, set `r` to the empty `String` (`""`).

The return value is a new string after the replacements.  If the `io::IO` argument is supplied, the transformed string is instead written to `io` (returning `io`). (For example, this can be used in conjunction with an [`IOBuffer`](/base/io-network#Base.IOBuffer) to re-use a pre-allocated buffer array in-place.)

Multiple patterns can be specified, and they will be applied left-to-right simultaneously, so only one pattern will be applied to any character, and the patterns will only be applied to the input text, not the replacements.

::: tip Julia 1.7

Support for multiple patterns requires version 1.7.

:::

::: tip Julia 1.10

The `io::IO` argument requires version 1.10.

:::

**Examples**

```julia
julia> replace("Python is a programming language.", "Python" => "Julia")
"Julia is a programming language."

julia> replace("The quick foxes run quickly.", "quick" => "slow", count=1)
"The slow foxes run quickly."

julia> replace("The quick foxes run quickly.", "quick" => "", count=1)
"The  foxes run quickly."

julia> replace("The quick foxes run quickly.", r"fox(es)?" => s"bus\1")
"The quick buses run quickly."

julia> replace("abcabc", "a" => "b", "b" => "c", r".+" => "a")
"bca"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L1034-L1080)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachsplit' href='#Base.eachsplit'>#</a>&nbsp;<b><u>Base.eachsplit</u></b> &mdash; <i>Function</i>.




```julia
eachsplit(str::AbstractString, dlm; limit::Integer=0, keepempty::Bool=true)
eachsplit(str::AbstractString; limit::Integer=0, keepempty::Bool=false)
```


Split `str` on occurrences of the delimiter(s) `dlm` and return an iterator over the substrings.  `dlm` can be any of the formats allowed by [`findnext`](/base/arrays#Base.findnext-Tuple{Any,%20Integer})&#39;s first argument (i.e. as a string, regular expression or a function), or as a single character or collection of characters.

If `dlm` is omitted, it defaults to [`isspace`](/base/strings#Base.Unicode.isspace).

The optional keyword arguments are:
- `limit`: the maximum size of the result. `limit=0` implies no maximum (default)
  
- `keepempty`: whether empty fields should be kept in the result. Default is `false` without a `dlm` argument, `true` with a `dlm` argument.
  

See also [`split`](/base/strings#Base.split).

::: tip Julia 1.8

The `eachsplit` function requires at least Julia 1.8.

:::

**Examples**

```julia
julia> a = "Ma.rch"
"Ma.rch"

julia> b = eachsplit(a, ".")
Base.SplitIterator{String, String}("Ma.rch", ".", 0, true)

julia> collect(b)
2-element Vector{SubString{String}}:
 "Ma"
 "rch"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L664-L698)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachrsplit' href='#Base.eachrsplit'>#</a>&nbsp;<b><u>Base.eachrsplit</u></b> &mdash; <i>Function</i>.




```julia
eachrsplit(str::AbstractString, dlm; limit::Integer=0, keepempty::Bool=true)
eachrsplit(str::AbstractString; limit::Integer=0, keepempty::Bool=false)
```


Return an iterator over `SubString`s of `str`, produced when splitting on the delimiter(s) `dlm`, and yielded in reverse order (from right to left). `dlm` can be any of the formats allowed by [`findprev`](/base/arrays#Base.findprev-Tuple{Any,%20Integer})&#39;s first argument (i.e. a string, a single character or a function), or a collection of characters.

If `dlm` is omitted, it defaults to [`isspace`](/base/strings#Base.Unicode.isspace), and `keepempty` default to `false`.

The optional keyword arguments are:
- If `limit > 0`, the iterator will split at most `limit - 1` times before returning the rest of the string unsplit. `limit < 1` implies no cap to splits (default).
  
- `keepempty`: whether empty fields should be returned when iterating Default is `false` without a `dlm` argument, `true` with a `dlm` argument.
  

Note that unlike [`split`](/base/strings#Base.split), [`rsplit`](/base/strings#Base.rsplit) and [`eachsplit`](/base/strings#Base.eachsplit), this function iterates the substrings right to left as they occur in the input.

See also [`eachsplit`](/base/strings#Base.eachsplit), [`rsplit`](/base/strings#Base.rsplit).

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

**Examples**

```julia
julia> a = "Ma.r.ch";

julia> collect(eachrsplit(a, ".")) == ["ch", "r", "Ma"]
true

julia> collect(eachrsplit(a, "."; limit=2)) == ["ch", "Ma.r"]
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L761-L796)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.split' href='#Base.split'>#</a>&nbsp;<b><u>Base.split</u></b> &mdash; <i>Function</i>.




```julia
split(str::AbstractString, dlm; limit::Integer=0, keepempty::Bool=true)
split(str::AbstractString; limit::Integer=0, keepempty::Bool=false)
```


Split `str` into an array of substrings on occurrences of the delimiter(s) `dlm`.  `dlm` can be any of the formats allowed by [`findnext`](/base/arrays#Base.findnext-Tuple{Any,%20Integer})&#39;s first argument (i.e. as a string, regular expression or a function), or as a single character or collection of characters.

If `dlm` is omitted, it defaults to [`isspace`](/base/strings#Base.Unicode.isspace).

The optional keyword arguments are:
- `limit`: the maximum size of the result. `limit=0` implies no maximum (default)
  
- `keepempty`: whether empty fields should be kept in the result. Default is `false` without a `dlm` argument, `true` with a `dlm` argument.
  

See also [`rsplit`](/base/strings#Base.rsplit), [`eachsplit`](/base/strings#Base.eachsplit).

**Examples**

```julia
julia> a = "Ma.rch"
"Ma.rch"

julia> split(a, ".")
2-element Vector{SubString{String}}:
 "Ma"
 "rch"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L856-L884)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rsplit' href='#Base.rsplit'>#</a>&nbsp;<b><u>Base.rsplit</u></b> &mdash; <i>Function</i>.




```julia
rsplit(s::AbstractString; limit::Integer=0, keepempty::Bool=false)
rsplit(s::AbstractString, chars; limit::Integer=0, keepempty::Bool=true)
```


Similar to [`split`](/base/strings#Base.split), but starting from the end of the string.

**Examples**

```julia
julia> a = "M.a.r.c.h"
"M.a.r.c.h"

julia> rsplit(a, ".")
5-element Vector{SubString{String}}:
 "M"
 "a"
 "r"
 "c"
 "h"

julia> rsplit(a, "."; limit=1)
1-element Vector{SubString{String}}:
 "M.a.r.c.h"

julia> rsplit(a, "."; limit=2)
2-element Vector{SubString{String}}:
 "M.a.r.c"
 "h"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L895-L923)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.strip' href='#Base.strip'>#</a>&nbsp;<b><u>Base.strip</u></b> &mdash; <i>Function</i>.




```julia
strip([pred=isspace,] str::AbstractString) -> SubString
strip(str::AbstractString, chars) -> SubString
```


Remove leading and trailing characters from `str`, either those specified by `chars` or those for which the function `pred` returns `true`.

The default behaviour is to remove leading and trailing whitespace and delimiters: see [`isspace`](/base/strings#Base.Unicode.isspace) for precise details.

The optional `chars` argument specifies which characters to remove: it can be a single character, vector or set of characters.

See also [`lstrip`](/base/strings#Base.lstrip) and [`rstrip`](/base/strings#Base.rstrip).

::: tip Julia 1.2

The method which accepts a predicate function requires Julia 1.2 or later.

:::

**Examples**

```julia
julia> strip("{3, 5}\n", ['{', '}', '\n'])
"3, 5"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L421-L444)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.lstrip' href='#Base.lstrip'>#</a>&nbsp;<b><u>Base.lstrip</u></b> &mdash; <i>Function</i>.




```julia
lstrip([pred=isspace,] str::AbstractString) -> SubString
lstrip(str::AbstractString, chars) -> SubString
```


Remove leading characters from `str`, either those specified by `chars` or those for which the function `pred` returns `true`.

The default behaviour is to remove leading whitespace and delimiters: see [`isspace`](/base/strings#Base.Unicode.isspace) for precise details.

The optional `chars` argument specifies which characters to remove: it can be a single character, or a vector or set of characters.

See also [`strip`](/base/strings#Base.strip) and [`rstrip`](/base/strings#Base.rstrip).

**Examples**

```julia
julia> a = lpad("March", 20)
"               March"

julia> lstrip(a)
"March"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L351-L374)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rstrip' href='#Base.rstrip'>#</a>&nbsp;<b><u>Base.rstrip</u></b> &mdash; <i>Function</i>.




```julia
rstrip([pred=isspace,] str::AbstractString) -> SubString
rstrip(str::AbstractString, chars) -> SubString
```


Remove trailing characters from `str`, either those specified by `chars` or those for which the function `pred` returns `true`.

The default behaviour is to remove trailing whitespace and delimiters: see [`isspace`](/base/strings#Base.Unicode.isspace) for precise details.

The optional `chars` argument specifies which characters to remove: it can be a single character, or a vector or set of characters.

See also [`strip`](/base/strings#Base.strip) and [`lstrip`](/base/strings#Base.lstrip).

**Examples**

```julia
julia> a = rpad("March", 20)
"March               "

julia> rstrip(a)
"March"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L386-L409)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.startswith' href='#Base.startswith'>#</a>&nbsp;<b><u>Base.startswith</u></b> &mdash; <i>Function</i>.




```julia
startswith(s::AbstractString, prefix::Union{AbstractString,Base.Chars})
```


Return `true` if `s` starts with `prefix`, which can be a string, a character, or a tuple/vector/set of characters. If `prefix` is a tuple/vector/set of characters, test whether the first character of `s` belongs to that set.

See also [`endswith`](/base/strings#Base.endswith), [`contains`](/base/strings#Base.contains).

**Examples**

```julia
julia> startswith("JuliaLang", "Julia")
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L16-L30)



```julia
startswith(io::IO, prefix::Union{AbstractString,Base.Chars})
```


Check if an `IO` object starts with a prefix, which can be either a string, a character, or a tuple/vector/set of characters.  See also [`peek`](/base/io-network#Base.peek).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L81-L86)



```julia
startswith(prefix)
```


Create a function that checks whether its argument starts with `prefix`, i.e. a function equivalent to `y -> startswith(y, prefix)`.

The returned function is of type `Base.Fix2{typeof(startswith)}`, which can be used to implement specialized methods.

::: tip Julia 1.5

The single argument `startswith(prefix)` requires at least Julia 1.5.

:::

**Examples**

```julia
julia> startswith("Julia")("JuliaLang")
true

julia> startswith("Julia")("Ends with Julia")
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L166-L186)



```julia
startswith(s::AbstractString, prefix::Regex)
```


Return `true` if `s` starts with the regex pattern, `prefix`.

::: tip Note

`startswith` does not compile the anchoring into the regular expression, but instead passes the anchoring as `match_option` to PCRE. If compile time is amortized, `occursin(r"^...", s)` is faster than `startswith(s, r"...")`.

:::

See also [`occursin`](/base/strings#Base.occursin) and [`endswith`](/base/strings#Base.endswith).

::: tip Julia 1.2

This method requires at least Julia 1.2.

:::

**Examples**

```julia
julia> startswith("JuliaLang", r"Julia|Romeo")
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L316-L337)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.endswith' href='#Base.endswith'>#</a>&nbsp;<b><u>Base.endswith</u></b> &mdash; <i>Function</i>.




```julia
endswith(s::AbstractString, suffix::Union{AbstractString,Base.Chars})
```


Return `true` if `s` ends with `suffix`, which can be a string, a character, or a tuple/vector/set of characters. If `suffix` is a tuple/vector/set of characters, test whether the last character of `s` belongs to that set.

See also [`startswith`](/base/strings#Base.startswith), [`contains`](/base/strings#Base.contains).

**Examples**

```julia
julia> endswith("Sunday", "day")
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L42-L56)



```julia
endswith(suffix)
```


Create a function that checks whether its argument ends with `suffix`, i.e. a function equivalent to `y -> endswith(y, suffix)`.

The returned function is of type `Base.Fix2{typeof(endswith)}`, which can be used to implement specialized methods.

::: tip Julia 1.5

The single argument `endswith(suffix)` requires at least Julia 1.5.

:::

**Examples**

```julia
julia> endswith("Julia")("Ends with Julia")
true

julia> endswith("Julia")("JuliaLang")
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L143-L163)



```julia
endswith(s::AbstractString, suffix::Regex)
```


Return `true` if `s` ends with the regex pattern, `suffix`.

::: tip Note

`endswith` does not compile the anchoring into the regular expression, but instead passes the anchoring as `match_option` to PCRE. If compile time is amortized, `occursin(r"...$", s)` is faster than `endswith(s, r"...")`.

:::

See also [`occursin`](/base/strings#Base.occursin) and [`startswith`](/base/strings#Base.startswith).

::: tip Julia 1.2

This method requires at least Julia 1.2.

:::

**Examples**

```julia
julia> endswith("JuliaLang", r"Lang|Roberts")
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/regex.jl#L348-L369)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.contains' href='#Base.contains'>#</a>&nbsp;<b><u>Base.contains</u></b> &mdash; <i>Function</i>.




```julia
contains(haystack::AbstractString, needle)
```


Return `true` if `haystack` contains `needle`. This is the same as `occursin(needle, haystack)`, but is provided for consistency with `startswith(haystack, needle)` and `endswith(haystack, needle)`.

See also [`occursin`](/base/strings#Base.occursin), [`in`](/base/collections#Base.in), [`issubset`](/base/collections#Base.issubset).

**Examples**

```julia
julia> contains("JuliaLang is pretty cool!", "Julia")
true

julia> contains("JuliaLang is pretty cool!", 'a')
true

julia> contains("aba", r"a.a")
true

julia> contains("abba", r"a.a")
false
```


::: tip Julia 1.5

The `contains` function requires at least Julia 1.5.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L114-L140)



```julia
contains(needle)
```


Create a function that checks whether its argument contains `needle`, i.e. a function equivalent to `haystack -> contains(haystack, needle)`.

The returned function is of type `Base.Fix2{typeof(contains)}`, which can be used to implement specialized methods.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L189-L197)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.first-Tuple{AbstractString, Integer}' href='#Base.first-Tuple{AbstractString, Integer}'>#</a>&nbsp;<b><u>Base.first</u></b> &mdash; <i>Method</i>.




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
<a id='Base.last-Tuple{AbstractString, Integer}' href='#Base.last-Tuple{AbstractString, Integer}'>#</a>&nbsp;<b><u>Base.last</u></b> &mdash; <i>Method</i>.




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
<a id='Base.Unicode.uppercase' href='#Base.Unicode.uppercase'>#</a>&nbsp;<b><u>Base.Unicode.uppercase</u></b> &mdash; <i>Function</i>.




```julia
uppercase(c::AbstractChar)
```


Convert `c` to uppercase.

See also [`lowercase`](/base/strings#Base.Unicode.lowercase), [`titlecase`](/base/strings#Base.Unicode.titlecase).

**Examples**

```julia
julia> uppercase('a')
'A': ASCII/Unicode U+0041 (category Lu: Letter, uppercase)

julia> uppercase('ê')
'Ê': Unicode U+00CA (category Lu: Letter, uppercase)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L308-L323)



```julia
uppercase(s::AbstractString)
```


Return `s` with all characters converted to uppercase.

See also [`lowercase`](/base/strings#Base.Unicode.lowercase), [`titlecase`](/base/strings#Base.Unicode.titlecase), [`uppercasefirst`](/base/strings#Base.Unicode.uppercasefirst).

**Examples**

```julia
julia> uppercase("Julia")
"JULIA"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L616-L628)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.lowercase' href='#Base.Unicode.lowercase'>#</a>&nbsp;<b><u>Base.Unicode.lowercase</u></b> &mdash; <i>Function</i>.




```julia
lowercase(c::AbstractChar)
```


Convert `c` to lowercase.

See also [`uppercase`](/base/strings#Base.Unicode.uppercase), [`titlecase`](/base/strings#Base.Unicode.titlecase).

**Examples**

```julia
julia> lowercase('A')
'a': ASCII/Unicode U+0061 (category Ll: Letter, lowercase)

julia> lowercase('Ö')
'ö': Unicode U+00F6 (category Ll: Letter, lowercase)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L287-L302)



```julia
lowercase(s::AbstractString)
```


Return `s` with all characters converted to lowercase.

See also [`uppercase`](/base/strings#Base.Unicode.uppercase), [`titlecase`](/base/strings#Base.Unicode.titlecase), [`lowercasefirst`](/base/strings#Base.Unicode.lowercasefirst).

**Examples**

```julia
julia> lowercase("STRINGS AND THINGS")
"strings and things"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L632-L644)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.titlecase' href='#Base.Unicode.titlecase'>#</a>&nbsp;<b><u>Base.Unicode.titlecase</u></b> &mdash; <i>Function</i>.




```julia
titlecase(c::AbstractChar)
```


Convert `c` to titlecase. This may differ from uppercase for digraphs, compare the example below.

See also [`uppercase`](/base/strings#Base.Unicode.uppercase), [`lowercase`](/base/strings#Base.Unicode.lowercase).

**Examples**

```julia
julia> titlecase('a')
'A': ASCII/Unicode U+0041 (category Lu: Letter, uppercase)

julia> titlecase('ǆ')
'ǅ': Unicode U+01C5 (category Lt: Letter, titlecase)

julia> uppercase('ǆ')
'Ǆ': Unicode U+01C4 (category Lu: Letter, uppercase)
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L329-L348)



```julia
titlecase(s::AbstractString; [wordsep::Function], strict::Bool=true) -> String
```


Capitalize the first character of each word in `s`; if `strict` is true, every other character is converted to lowercase, otherwise they are left unchanged. By default, all non-letters beginning a new grapheme are considered as word separators; a predicate can be passed as the `wordsep` keyword to determine which characters should be considered as word separators. See also [`uppercasefirst`](/base/strings#Base.Unicode.uppercasefirst) to capitalize only the first character in `s`.

See also [`uppercase`](/base/strings#Base.Unicode.uppercase), [`lowercase`](/base/strings#Base.Unicode.lowercase), [`uppercasefirst`](/base/strings#Base.Unicode.uppercasefirst).

**Examples**

```julia
julia> titlecase("the JULIA programming language")
"The Julia Programming Language"

julia> titlecase("ISS - international space station", strict=false)
"ISS - International Space Station"

julia> titlecase("a-a b-b", wordsep = c->c==' ')
"A-a B-b"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L648-L673)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.uppercasefirst' href='#Base.Unicode.uppercasefirst'>#</a>&nbsp;<b><u>Base.Unicode.uppercasefirst</u></b> &mdash; <i>Function</i>.




```julia
uppercasefirst(s::AbstractString) -> String
```


Return `s` with the first character converted to uppercase (technically &quot;title case&quot; for Unicode). See also [`titlecase`](/base/strings#Base.Unicode.titlecase) to capitalize the first character of every word in `s`.

See also [`lowercasefirst`](/base/strings#Base.Unicode.lowercasefirst), [`uppercase`](/base/strings#Base.Unicode.uppercase), [`lowercase`](/base/strings#Base.Unicode.lowercase), [`titlecase`](/base/strings#Base.Unicode.titlecase).

**Examples**

```julia
julia> uppercasefirst("python")
"Python"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L712-L727)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.lowercasefirst' href='#Base.Unicode.lowercasefirst'>#</a>&nbsp;<b><u>Base.Unicode.lowercasefirst</u></b> &mdash; <i>Function</i>.




```julia
lowercasefirst(s::AbstractString)
```


Return `s` with the first character converted to lowercase.

See also [`uppercasefirst`](/base/strings#Base.Unicode.uppercasefirst), [`uppercase`](/base/strings#Base.Unicode.uppercase), [`lowercase`](/base/strings#Base.Unicode.lowercase), [`titlecase`](/base/strings#Base.Unicode.titlecase).

**Examples**

```julia
julia> lowercasefirst("Julia")
"julia"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L747-L760)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.join' href='#Base.join'>#</a>&nbsp;<b><u>Base.join</u></b> &mdash; <i>Function</i>.




```julia
join([io::IO,] iterator [, delim [, last]])
```


Join any `iterator` into a single string, inserting the given delimiter (if any) between adjacent items.  If `last` is given, it will be used instead of `delim` between the last two items.  Each item of `iterator` is converted to a string via `print(io::IOBuffer, x)`. If `io` is given, the result is written to `io` rather than returned as a `String`.

**Examples**

```julia
julia> join(["apples", "bananas", "pineapples"], ", ", " and ")
"apples, bananas and pineapples"

julia> join([1,2,3,4,5])
"12345"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L313-L329)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.chop' href='#Base.chop'>#</a>&nbsp;<b><u>Base.chop</u></b> &mdash; <i>Function</i>.




```julia
chop(s::AbstractString; head::Integer = 0, tail::Integer = 1)
```


Remove the first `head` and the last `tail` characters from `s`. The call `chop(s)` removes the last character from `s`. If it is requested to remove more characters than `length(s)` then an empty string is returned.

See also [`chomp`](/base/strings#Base.chomp), [`startswith`](/base/strings#Base.startswith), [`first`](/base/collections#Base.first).

**Examples**

```julia
julia> a = "March"
"March"

julia> chop(a)
"Marc"

julia> chop(a, head = 1, tail = 2)
"ar"

julia> chop(a, head = 5, tail = 5)
""
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L200-L224)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.chopprefix' href='#Base.chopprefix'>#</a>&nbsp;<b><u>Base.chopprefix</u></b> &mdash; <i>Function</i>.




```julia
chopprefix(s::AbstractString, prefix::Union{AbstractString,Regex}) -> SubString
```


Remove the prefix `prefix` from `s`. If `s` does not start with `prefix`, a string equal to `s` is returned.

See also [`chopsuffix`](/base/strings#Base.chopsuffix).

::: tip Julia 1.8

This function is available as of Julia 1.8.

:::

**Examples**

```julia
julia> chopprefix("Hamburger", "Ham")
"burger"

julia> chopprefix("Hamburger", "hotdog")
"Hamburger"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L235-L253)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.chopsuffix' href='#Base.chopsuffix'>#</a>&nbsp;<b><u>Base.chopsuffix</u></b> &mdash; <i>Function</i>.




```julia
chopsuffix(s::AbstractString, suffix::Union{AbstractString,Regex}) -> SubString
```


Remove the suffix `suffix` from `s`. If `s` does not end with `suffix`, a string equal to `s` is returned.

See also [`chopprefix`](/base/strings#Base.chopprefix).

::: tip Julia 1.8

This function is available as of Julia 1.8.

:::

**Examples**

```julia
julia> chopsuffix("Hamburger", "er")
"Hamburg"

julia> chopsuffix("Hamburger", "hotdog")
"Hamburger"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L276-L294)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.chomp' href='#Base.chomp'>#</a>&nbsp;<b><u>Base.chomp</u></b> &mdash; <i>Function</i>.




```julia
chomp(s::AbstractString) -> SubString
```


Remove a single trailing newline from a string.

See also [`chop`](/base/strings#Base.chop).

**Examples**

```julia
julia> chomp("Hello\n")
"Hello"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/util.jl#L320-L332)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.thisind' href='#Base.thisind'>#</a>&nbsp;<b><u>Base.thisind</u></b> &mdash; <i>Function</i>.




```julia
thisind(s::AbstractString, i::Integer) -> Int
```


If `i` is in bounds in `s` return the index of the start of the character whose encoding code unit `i` is part of. In other words, if `i` is the start of a character, return `i`; if `i` is not the start of a character, rewind until the start of a character and return that index. If `i` is equal to 0 or `ncodeunits(s)+1` return `i`. In all other cases throw `BoundsError`.

**Examples**

```julia
julia> thisind("α", 0)
0

julia> thisind("α", 1)
1

julia> thisind("α", 2)
1

julia> thisind("α", 3)
3

julia> thisind("α", 4)
ERROR: BoundsError: attempt to access 2-codeunit String at index [4]
[...]

julia> thisind("α", -1)
ERROR: BoundsError: attempt to access 2-codeunit String at index [-1]
[...]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L420-L451)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nextind-Tuple{AbstractString, Integer, Integer}' href='#Base.nextind-Tuple{AbstractString, Integer, Integer}'>#</a>&nbsp;<b><u>Base.nextind</u></b> &mdash; <i>Method</i>.




```julia
nextind(str::AbstractString, i::Integer, n::Integer=1) -> Int
```

- Case `n == 1`
  If `i` is in bounds in `s` return the index of the start of the character whose encoding starts after index `i`. In other words, if `i` is the start of a character, return the start of the next character; if `i` is not the start of a character, move forward until the start of a character and return that index. If `i` is equal to `0` return `1`. If `i` is in bounds but greater or equal to `lastindex(str)` return `ncodeunits(str)+1`. Otherwise throw `BoundsError`.
  
- Case `n > 1`
  Behaves like applying `n` times `nextind` for `n==1`. The only difference is that if `n` is so large that applying `nextind` would reach `ncodeunits(str)+1` then each remaining iteration increases the returned value by `1`. This means that in this case `nextind` can return a value greater than `ncodeunits(str)+1`.
  
- Case `n == 0`
  Return `i` only if `i` is a valid index in `s` or is equal to `0`. Otherwise `StringIndexError` or `BoundsError` is thrown.
  

**Examples**

```julia
julia> nextind("α", 0)
1

julia> nextind("α", 1)
3

julia> nextind("α", 3)
ERROR: BoundsError: attempt to access 2-codeunit String at index [3]
[...]

julia> nextind("α", 0, 2)
3

julia> nextind("α", 1, 2)
4
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L523-L566)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.prevind-Tuple{AbstractString, Integer, Integer}' href='#Base.prevind-Tuple{AbstractString, Integer, Integer}'>#</a>&nbsp;<b><u>Base.prevind</u></b> &mdash; <i>Method</i>.




```julia
prevind(str::AbstractString, i::Integer, n::Integer=1) -> Int
```

- Case `n == 1`
  If `i` is in bounds in `s` return the index of the start of the character whose encoding starts before index `i`. In other words, if `i` is the start of a character, return the start of the previous character; if `i` is not the start of a character, rewind until the start of a character and return that index. If `i` is equal to `1` return `0`. If `i` is equal to `ncodeunits(str)+1` return `lastindex(str)`. Otherwise throw `BoundsError`.
  
- Case `n > 1`
  Behaves like applying `n` times `prevind` for `n==1`. The only difference is that if `n` is so large that applying `prevind` would reach `0` then each remaining iteration decreases the returned value by `1`. This means that in this case `prevind` can return a negative value.
  
- Case `n == 0`
  Return `i` only if `i` is a valid index in `str` or is equal to `ncodeunits(str)+1`. Otherwise `StringIndexError` or `BoundsError` is thrown.
  

**Examples**

```julia
julia> prevind("α", 3)
1

julia> prevind("α", 1)
0

julia> prevind("α", 0)
ERROR: BoundsError: attempt to access 2-codeunit String at index [0]
[...]

julia> prevind("α", 2, 2)
0

julia> prevind("α", 2, 3)
-1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L464-L507)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.textwidth' href='#Base.Unicode.textwidth'>#</a>&nbsp;<b><u>Base.Unicode.textwidth</u></b> &mdash; <i>Function</i>.




```julia
textwidth(c)
```


Give the number of columns needed to print a character.

**Examples**

```julia
julia> textwidth('α')
1

julia> textwidth('⛵')
2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L244-L257)



```julia
textwidth(s::AbstractString)
```


Give the number of columns needed to print a string.

**Examples**

```julia
julia> textwidth("March")
5
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L272-L282)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isascii' href='#Base.isascii'>#</a>&nbsp;<b><u>Base.isascii</u></b> &mdash; <i>Function</i>.




```julia
isascii(c::Union{AbstractChar,AbstractString}) -> Bool
```


Test whether a character belongs to the ASCII character set, or whether this is true for all elements of a string.

**Examples**

```julia
julia> isascii('a')
true

julia> isascii('α')
false

julia> isascii("abc")
true

julia> isascii("αβγ")
false
```


For example, `isascii` can be used as a predicate function for [`filter`](/base/collections#Base.filter) or [`replace`](/base/collections#Base.replace-Tuple{Any,%20Vararg{Pair}}) to remove or replace non-ASCII characters, respectively:

```julia
julia> filter(isascii, "abcdeγfgh") # discard non-ASCII chars
"abcdefgh"

julia> replace("abcdeγfgh", !isascii=>' ') # replace non-ASCII chars with spaces
"abcde fgh"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L595-L624)



```julia
isascii(cu::AbstractVector{CU}) where {CU <: Integer} -> Bool
```


Test whether all values in the vector belong to the ASCII character set (0x00 to 0x7f). This function is intended to be used by other string implementations that need a fast ASCII check.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/basic.jl#L646-L651)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.iscntrl' href='#Base.Unicode.iscntrl'>#</a>&nbsp;<b><u>Base.Unicode.iscntrl</u></b> &mdash; <i>Function</i>.




```julia
iscntrl(c::AbstractChar) -> Bool
```


Tests whether a character is a control character. Control characters are the non-printing characters of the Latin-1 subset of Unicode.

**Examples**

```julia
julia> iscntrl('\x01')
true

julia> iscntrl('a')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L514-L528)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.isdigit' href='#Base.Unicode.isdigit'>#</a>&nbsp;<b><u>Base.Unicode.isdigit</u></b> &mdash; <i>Function</i>.




```julia
isdigit(c::AbstractChar) -> Bool
```


Tests whether a character is an ASCII decimal digit (`0`-`9`).

See also: [`isletter`](/base/strings#Base.Unicode.isletter).

**Examples**

```julia
julia> isdigit('❤')
false

julia> isdigit('9')
true

julia> isdigit('α')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L441-L459)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.isletter' href='#Base.Unicode.isletter'>#</a>&nbsp;<b><u>Base.Unicode.isletter</u></b> &mdash; <i>Function</i>.




```julia
isletter(c::AbstractChar) -> Bool
```


Test whether a character is a letter. A character is classified as a letter if it belongs to the Unicode general category Letter, i.e. a character whose category code begins with &#39;L&#39;.

See also: [`isdigit`](/base/strings#Base.Unicode.isdigit).

**Examples**

```julia
julia> isletter('❤')
false

julia> isletter('α')
true

julia> isletter('9')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L462-L482)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.islowercase' href='#Base.Unicode.islowercase'>#</a>&nbsp;<b><u>Base.Unicode.islowercase</u></b> &mdash; <i>Function</i>.




```julia
islowercase(c::AbstractChar) -> Bool
```


Tests whether a character is a lowercase letter (according to the Unicode standard&#39;s `Lowercase` derived property).

See also [`isuppercase`](/base/strings#Base.Unicode.isuppercase).

**Examples**

```julia
julia> islowercase('α')
true

julia> islowercase('Γ')
false

julia> islowercase('❤')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L378-L397)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.isnumeric' href='#Base.Unicode.isnumeric'>#</a>&nbsp;<b><u>Base.Unicode.isnumeric</u></b> &mdash; <i>Function</i>.




```julia
isnumeric(c::AbstractChar) -> Bool
```


Tests whether a character is numeric. A character is classified as numeric if it belongs to the Unicode general category Number, i.e. a character whose category code begins with &#39;N&#39;.

Note that this broad category includes characters such as ¾ and ௰. Use [`isdigit`](/base/strings#Base.Unicode.isdigit) to check whether a character is a decimal digit between 0 and 9.

**Examples**

```julia
julia> isnumeric('௰')
true

julia> isnumeric('9')
true

julia> isnumeric('α')
false

julia> isnumeric('❤')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L485-L509)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.isprint' href='#Base.Unicode.isprint'>#</a>&nbsp;<b><u>Base.Unicode.isprint</u></b> &mdash; <i>Function</i>.




```julia
isprint(c::AbstractChar) -> Bool
```


Tests whether a character is printable, including spaces, but not a control character.

**Examples**

```julia
julia> isprint('\x01')
false

julia> isprint('A')
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L579-L592)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.ispunct' href='#Base.Unicode.ispunct'>#</a>&nbsp;<b><u>Base.Unicode.ispunct</u></b> &mdash; <i>Function</i>.




```julia
ispunct(c::AbstractChar) -> Bool
```


Tests whether a character belongs to the Unicode general category Punctuation, i.e. a character whose category code begins with &#39;P&#39;.

**Examples**

```julia
julia> ispunct('α')
false

julia> ispunct('/')
true

julia> ispunct(';')
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L531-L548)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.isspace' href='#Base.Unicode.isspace'>#</a>&nbsp;<b><u>Base.Unicode.isspace</u></b> &mdash; <i>Function</i>.




```julia
isspace(c::AbstractChar) -> Bool
```


Tests whether a character is any whitespace character. Includes ASCII characters &#39;\t&#39;, &#39;\n&#39;, &#39;\v&#39;, &#39;\f&#39;, &#39;\r&#39;, and &#39; &#39;, Latin-1 character U+0085, and characters in Unicode category Zs.

**Examples**

```julia
julia> isspace('\n')
true

julia> isspace('\r')
true

julia> isspace(' ')
true

julia> isspace('\x20')
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L553-L574)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.isuppercase' href='#Base.Unicode.isuppercase'>#</a>&nbsp;<b><u>Base.Unicode.isuppercase</u></b> &mdash; <i>Function</i>.




```julia
isuppercase(c::AbstractChar) -> Bool
```


Tests whether a character is an uppercase letter (according to the Unicode standard&#39;s `Uppercase` derived property).

See also [`islowercase`](/base/strings#Base.Unicode.islowercase).

**Examples**

```julia
julia> isuppercase('γ')
false

julia> isuppercase('Γ')
true

julia> isuppercase('❤')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L403-L422)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Unicode.isxdigit' href='#Base.Unicode.isxdigit'>#</a>&nbsp;<b><u>Base.Unicode.isxdigit</u></b> &mdash; <i>Function</i>.




```julia
isxdigit(c::AbstractChar) -> Bool
```


Test whether a character is a valid hexadecimal digit. Note that this does not include `x` (as in the standard `0x` prefix).

**Examples**

```julia
julia> isxdigit('a')
true

julia> isxdigit('x')
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/unicode.jl#L597-L611)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.escape_string' href='#Base.escape_string'>#</a>&nbsp;<b><u>Base.escape_string</u></b> &mdash; <i>Function</i>.




```julia
escape_string(str::AbstractString[, esc]; keep=(), ascii=false, fullhex=false)::AbstractString
escape_string(io, str::AbstractString[, esc]; keep=())::Nothing
```


General escaping of traditional C and Unicode escape sequences. The first form returns the escaped string, the second prints the result to `io`.

Backslashes (`\`) are escaped with a double-backslash (`"\\"`). Non-printable characters are escaped either with their standard C escape codes, `"\0"` for NUL (if unambiguous), unicode code point (`"\u"` prefix) or hex (`"\x"` prefix).

The optional `esc` argument specifies any additional characters that should also be escaped by a prepending backslash (`"` is also escaped by default in the first form).

The argument `keep` specifies a collection of characters which are to be kept as they are. Notice that `esc` has precedence here.

The argument `ascii` can be set to `true` to escape all non-ASCII characters, whereas the default `ascii=false` outputs printable Unicode characters as-is. (`keep` takes precedence over `ascii`.)

The argument `fullhex` can be set to `true` to require all `\u` escapes to be printed with 4 hex digits, and `\U` escapes to be printed with 8 hex digits, whereas by default (`fullhex=false`) they are printed with fewer digits if possible (omitting leading zeros).

See also [`unescape_string`](/base/strings#Base.unescape_string) for the reverse operation.

::: tip Julia 1.7

The `keep` argument is available as of Julia 1.7.

:::

::: tip Julia 1.12

The `ascii` and `fullhex` arguments require Julia 1.12.

:::

**Examples**

```julia
julia> escape_string("aaa\nbbb")
"aaa\\nbbb"

julia> escape_string("aaa\nbbb"; keep = '\n')
"aaa\nbbb"

julia> escape_string("\xfe\xff") # invalid utf-8
"\\xfe\\xff"

julia> escape_string(string('\u2135','\0')) # unambiguous
"ℵ\\0"

julia> escape_string(string('\u2135','\0','0')) # \0 would be ambiguous
"ℵ\\x000"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L385-L436)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.escape_raw_string' href='#Base.escape_raw_string'>#</a>&nbsp;<b><u>Base.escape_raw_string</u></b> &mdash; <i>Function</i>.




```julia
escape_raw_string(s::AbstractString, delim='"') -> AbstractString
escape_raw_string(io, s::AbstractString, delim='"')
```


Escape a string in the manner used for parsing raw string literals. For each double-quote (`"`) character in input string `s` (or `delim` if specified), this function counts the number _n_ of preceding backslash (`\`) characters, and then increases there the number of backslashes from _n_ to 2_n_+1 (even for _n_ = 0). It also doubles a sequence of backslashes at the end of the string.

This escaping convention is used in raw strings and other non-standard string literals. (It also happens to be the escaping convention expected by the Microsoft C/C++ compiler runtime when it parses a command-line string into the argv[] array.)

See also [`Base.escape_string()`](/base/strings#Base.escape_string).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L623-L640)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unescape_string' href='#Base.unescape_string'>#</a>&nbsp;<b><u>Base.unescape_string</u></b> &mdash; <i>Function</i>.




```julia
unescape_string(str::AbstractString, keep = ())::AbstractString
unescape_string(io, s::AbstractString, keep = ())::Nothing
```


General unescaping of traditional C and Unicode escape sequences. The first form returns the escaped string, the second prints the result to `io`. The argument `keep` specifies a collection of characters which (along with backlashes) are to be kept as they are.

The following escape sequences are recognised:
- Escaped backslash (`\\`)
  
- Escaped double-quote (`\"`)
  
- Standard C escape sequences (`\a`, `\b`, `\t`, `\n`, `\v`, `\f`, `\r`, `\e`)
  
- Unicode BMP code points (`\u` with 1-4 trailing hex digits)
  
- All Unicode code points (`\U` with 1-8 trailing hex digits; max value = 0010ffff)
  
- Hex bytes (`\x` with 1-2 trailing hex digits)
  
- Octal bytes (`\` with 1-3 trailing octal digits)
  

See also [`escape_string`](/base/strings#Base.escape_string).

**Examples**

```julia
julia> unescape_string("aaa\\nbbb") # C escape sequence
"aaa\nbbb"

julia> unescape_string("\\u03c0") # unicode
"π"

julia> unescape_string("\\101") # octal
"A"

julia> unescape_string("aaa \\g \\n", ['g']) # using `keep` argument
"aaa \\g \n"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/strings/io.jl#L478-L512)

</div>
<br>
