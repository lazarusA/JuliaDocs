
# Numbers {#lib-numbers}

## Standard Numeric Types {#Standard-Numeric-Types}

A type tree for all subtypes of `Number` in `Base` is shown below. Abstract types have been marked, the rest are concrete types.

```
Number  (Abstract Type)
├─ Complex
└─ Real  (Abstract Type)
   ├─ AbstractFloat  (Abstract Type)
   │  ├─ Float16
   │  ├─ Float32
   │  ├─ Float64
   │  └─ BigFloat
   ├─ Integer  (Abstract Type)
   │  ├─ Bool
   │  ├─ Signed  (Abstract Type)
   │  │  ├─ Int8
   │  │  ├─ Int16
   │  │  ├─ Int32
   │  │  ├─ Int64
   │  │  ├─ Int128
   │  │  └─ BigInt
   │  └─ Unsigned  (Abstract Type)
   │     ├─ UInt8
   │     ├─ UInt16
   │     ├─ UInt32
   │     ├─ UInt64
   │     └─ UInt128
   ├─ Rational
   └─ AbstractIrrational  (Abstract Type)
      └─ Irrational
```


### Abstract number types {#Abstract-number-types}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Number' href='#Core.Number'>#</a>&nbsp;<b><u>Core.Number</u></b> &mdash; <i>Type</i>.




```julia
Number
```


Abstract supertype for all number types.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2012-L2016)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Real' href='#Core.Real'>#</a>&nbsp;<b><u>Core.Real</u></b> &mdash; <i>Type</i>.




```julia
Real <: Number
```


Abstract supertype for all real numbers.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2019-L2023)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.AbstractFloat' href='#Core.AbstractFloat'>#</a>&nbsp;<b><u>Core.AbstractFloat</u></b> &mdash; <i>Type</i>.




```julia
AbstractFloat <: Real
```


Abstract supertype for all floating point numbers.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2026-L2030)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Integer' href='#Core.Integer'>#</a>&nbsp;<b><u>Core.Integer</u></b> &mdash; <i>Type</i>.




```julia
Integer <: Real
```


Abstract supertype for all integers (e.g. [`Signed`](/base/numbers#Core.Signed), [`Unsigned`](/base/numbers#Core.Unsigned), and [`Bool`](/base/numbers#Core.Bool)).

See also [`isinteger`](/base/numbers#Base.isinteger), [`trunc`](/base/math#Base.trunc), [`div`](/base/math#Base.div).

**Examples**

```
julia> 42 isa Integer
true

julia> 1.0 isa Integer
false

julia> isinteger(1.0)
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2033-L2051)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Signed' href='#Core.Signed'>#</a>&nbsp;<b><u>Core.Signed</u></b> &mdash; <i>Type</i>.




```julia
Signed <: Integer
```


Abstract supertype for all signed integers.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2054-L2058)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Unsigned' href='#Core.Unsigned'>#</a>&nbsp;<b><u>Core.Unsigned</u></b> &mdash; <i>Type</i>.




```julia
Unsigned <: Integer
```


Abstract supertype for all unsigned integers.

Built-in unsigned integers are printed in hexadecimal, with prefix `0x`, and can be entered in the same way.

**Examples**

```
julia> typemax(UInt8)
0xff

julia> Int(0x00d)
13

julia> unsigned(true)
0x0000000000000001
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2061-L2080)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractIrrational' href='#Base.AbstractIrrational'>#</a>&nbsp;<b><u>Base.AbstractIrrational</u></b> &mdash; <i>Type</i>.




```julia
AbstractIrrational <: Real
```


Number type representing an exact irrational value, which is automatically rounded to the correct precision in arithmetic operations with other numeric quantities.

Subtypes `MyIrrational <: AbstractIrrational` should implement at least `==(::MyIrrational, ::MyIrrational)`, `hash(x::MyIrrational, h::UInt)`, and `convert(::Type{F}, x::MyIrrational) where {F <: Union{BigFloat,Float32,Float64}}`.

If a subtype is used to represent values that may occasionally be rational (e.g. a square-root type that represents `√n` for integers `n` will give a rational result when `n` is a perfect square), then it should also implement `isinteger`, `iszero`, `isone`, and `==` with `Real` values (since all of these default to `false` for `AbstractIrrational` types), as well as defining [`hash`](/base/base#Base.hash) to equal that of the corresponding `Rational`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/irrationals.jl#L5-L18)

</div>
<br>

### Concrete number types {#Concrete-number-types}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Float16' href='#Core.Float16'>#</a>&nbsp;<b><u>Core.Float16</u></b> &mdash; <i>Type</i>.




```julia
Float16 <: AbstractFloat <: Real
```


16-bit floating point number type (IEEE 754 standard). Binary format is 1 sign, 5 exponent, 10 fraction bits.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2162-L2167)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Float32' href='#Core.Float32'>#</a>&nbsp;<b><u>Core.Float32</u></b> &mdash; <i>Type</i>.




```julia
Float32 <: AbstractFloat <: Real
```


32-bit floating point number type (IEEE 754 standard). Binary format is 1 sign, 8 exponent, 23 fraction bits.

The exponent for scientific notation should be entered as lower-case `f`, thus `2f3 === 2.0f0 * 10^3 === Float32(2_000)`. For array literals and comprehensions, the element type can be specified before the square brackets: `Float32[1,4,9] == Float32[i^2 for i in 1:3]`.

See also [`Inf32`](/base/numbers#Base.Inf32), [`NaN32`](/base/numbers#Base.NaN32), [`Float16`](/base/numbers#Core.Float16), [`exponent`](/base/numbers#Base.Math.exponent), [`frexp`](/base/math#Base.Math.frexp).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2147-L2159)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Float64' href='#Core.Float64'>#</a>&nbsp;<b><u>Core.Float64</u></b> &mdash; <i>Type</i>.




```julia
Float64 <: AbstractFloat <: Real
```


64-bit floating point number type (IEEE 754 standard). Binary format is 1 sign, 11 exponent, 52 fraction bits. See [`bitstring`](/base/numbers#Base.bitstring), [`signbit`](/base/math#Base.signbit), [`exponent`](/base/numbers#Base.Math.exponent), [`frexp`](/base/math#Base.Math.frexp), and [`significand`](/base/numbers#Base.Math.significand) to access various bits.

This is the default for floating point literals, `1.0 isa Float64`, and for many operations such as `1/2, 2pi, log(2), range(0,90,length=4)`. Unlike integers, this default does not change with `Sys.WORD_SIZE`.

The exponent for scientific notation can be entered as `e` or `E`, thus `2e3 === 2.0E3 === 2.0 * 10^3`. Doing so is strongly preferred over `10^n` because integers overflow, thus `2.0 * 10^19 < 0` but `2e19 > 0`.

See also [`Inf`](/base/numbers#Base.Inf), [`NaN`](/base/numbers#Base.NaN), [`floatmax`](/base/base#Base.floatmax), [`Float32`](/base/numbers#Core.Float32), [`Complex`](/base/numbers#Base.Complex).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2127-L2144)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MPFR.BigFloat' href='#Base.MPFR.BigFloat'>#</a>&nbsp;<b><u>Base.MPFR.BigFloat</u></b> &mdash; <i>Type</i>.




```julia
BigFloat <: AbstractFloat
```


Arbitrary precision floating point number type.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mpfr.jl#L123-L127)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Bool' href='#Core.Bool'>#</a>&nbsp;<b><u>Core.Bool</u></b> &mdash; <i>Type</i>.




```julia
Bool <: Integer
```


Boolean type, containing the values `true` and `false`.

`Bool` is a kind of number: `false` is numerically equal to `0` and `true` is numerically equal to `1`. Moreover, `false` acts as a multiplicative &quot;strong zero&quot; against [`NaN`](/base/numbers#Base.NaN) and [`Inf`](/base/numbers#Base.Inf):

```julia
julia> [true, false] == [1, 0]
true

julia> 42.0 + true
43.0

julia> 0 .* (NaN, Inf, -Inf)
(NaN, NaN, NaN)

julia> false .* (NaN, Inf, -Inf)
(0.0, 0.0, -0.0)
```


Branches via [`if`](/base/base#if) and other conditionals only accept `Bool`. There are no &quot;truthy&quot; values in Julia.

Comparisons typically return `Bool`, and broadcasted comparisons may return [`BitArray`](/base/arrays#Base.BitArray) instead of an `Array{Bool}`.

```julia
julia> [1 2 3 4 5] .< pi
1×5 BitMatrix:
 1  1  1  0  0

julia> map(>(pi), [1 2 3 4 5])
1×5 Matrix{Bool}:
 0  0  0  1  1
```


See also [`trues`](/base/arrays#Base.trues), [`falses`](/base/arrays#Base.falses), [`ifelse`](/base/base#Base.ifelse).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2083-L2124)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Int8' href='#Core.Int8'>#</a>&nbsp;<b><u>Core.Int8</u></b> &mdash; <i>Type</i>.




```julia
Int8 <: Signed <: Integer
```


8-bit signed integer type.

Represents numbers `n ∈ -128:127`. Note that such integers overflow without warning, thus `typemax(Int8) + Int8(1) < 0`.

See also [`Int`](/base/numbers#Core.Int64), [`widen`](/base/base#Base.widen), [`BigInt`](/base/numbers#Base.GMP.BigInt).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2176-L2185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UInt8' href='#Core.UInt8'>#</a>&nbsp;<b><u>Core.UInt8</u></b> &mdash; <i>Type</i>.




```julia
UInt8 <: Unsigned <: Integer
```


8-bit unsigned integer type.

Printed in hexadecimal, thus 0x07 == 7.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2188-L2194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Int16' href='#Core.Int16'>#</a>&nbsp;<b><u>Core.Int16</u></b> &mdash; <i>Type</i>.




```julia
Int16 <: Signed <: Integer
```


16-bit signed integer type.

Represents numbers `n ∈ -32768:32767`. Note that such integers overflow without warning, thus `typemax(Int16) + Int16(1) < 0`.

See also [`Int`](/base/numbers#Core.Int64), [`widen`](/base/base#Base.widen), [`BigInt`](/base/numbers#Base.GMP.BigInt).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2176-L2185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UInt16' href='#Core.UInt16'>#</a>&nbsp;<b><u>Core.UInt16</u></b> &mdash; <i>Type</i>.




```julia
UInt16 <: Unsigned <: Integer
```


16-bit unsigned integer type.

Printed in hexadecimal, thus 0x000f == 15.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2188-L2194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Int32' href='#Core.Int32'>#</a>&nbsp;<b><u>Core.Int32</u></b> &mdash; <i>Type</i>.




```julia
Int32 <: Signed <: Integer
```


32-bit signed integer type.

Note that such integers overflow without warning, thus `typemax(Int32) + Int32(1) < 0`.

See also [`Int`](/base/numbers#Core.Int64), [`widen`](/base/base#Base.widen), [`BigInt`](/base/numbers#Base.GMP.BigInt).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2176-L2185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UInt32' href='#Core.UInt32'>#</a>&nbsp;<b><u>Core.UInt32</u></b> &mdash; <i>Type</i>.




```julia
UInt32 <: Unsigned <: Integer
```


32-bit unsigned integer type.

Printed in hexadecimal, thus 0x0000001f == 31.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2188-L2194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Int64' href='#Core.Int64'>#</a>&nbsp;<b><u>Core.Int64</u></b> &mdash; <i>Type</i>.




```julia
Int64 <: Signed <: Integer
```


64-bit signed integer type.

Note that such integers overflow without warning, thus `typemax(Int64) + Int64(1) < 0`.

See also [`Int`](/base/numbers#Core.Int64), [`widen`](/base/base#Base.widen), [`BigInt`](/base/numbers#Base.GMP.BigInt).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2176-L2185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UInt64' href='#Core.UInt64'>#</a>&nbsp;<b><u>Core.UInt64</u></b> &mdash; <i>Type</i>.




```julia
UInt64 <: Unsigned <: Integer
```


64-bit unsigned integer type.

Printed in hexadecimal, thus 0x000000000000003f == 63.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2188-L2194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Int128' href='#Core.Int128'>#</a>&nbsp;<b><u>Core.Int128</u></b> &mdash; <i>Type</i>.




```julia
Int128 <: Signed <: Integer
```


128-bit signed integer type.

Note that such integers overflow without warning, thus `typemax(Int128) + Int128(1) < 0`.

See also [`Int`](/base/numbers#Core.Int64), [`widen`](/base/base#Base.widen), [`BigInt`](/base/numbers#Base.GMP.BigInt).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2176-L2185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UInt128' href='#Core.UInt128'>#</a>&nbsp;<b><u>Core.UInt128</u></b> &mdash; <i>Type</i>.




```julia
UInt128 <: Unsigned <: Integer
```


128-bit unsigned integer type.

Printed in hexadecimal, thus 0x0000000000000000000000000000007f == 127.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2188-L2194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Int' href='#Core.Int'>#</a>&nbsp;<b><u>Core.Int</u></b> &mdash; <i>Type</i>.




```julia
Int
```


Sys.WORD_SIZE-bit signed integer type, `Int <: Signed <: Integer <: Real`.

This is the default type of most integer literals and is an alias for either `Int32` or `Int64`, depending on `Sys.WORD_SIZE`. It is the type returned by functions such as [`length`](/base/collections#Base.length), and the standard type for indexing arrays.

Note that integers overflow without warning, thus `typemax(Int) + 1 < 0` and `10^19 < 0`. Overflow can be avoided by using [`BigInt`](/base/numbers#Base.GMP.BigInt). Very large integer literals will use a wider type, for instance `10_000_000_000_000_000_000 isa Int128`.

Integer division is [`div`](/base/math#Base.div) alias `÷`, whereas [`/`](/base/math#Base.:/) acting on integers returns [`Float64`](/base/numbers#Core.Float64).

See also [`Int64`](/base/numbers#Core.Int64), [`widen`](/base/base#Base.widen), [`typemax`](/base/base#Base.typemax), [`bitstring`](/base/numbers#Base.bitstring).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2199-L2216)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UInt' href='#Core.UInt'>#</a>&nbsp;<b><u>Core.UInt</u></b> &mdash; <i>Type</i>.




```julia
UInt
```


Sys.WORD_SIZE-bit unsigned integer type, `UInt <: Unsigned <: Integer`.

Like [`Int`](/base/numbers#Core.Int), the alias `UInt` may point to either `UInt32` or `UInt64`, according to the value of `Sys.WORD_SIZE` on a given computer.

Printed and parsed in hexadecimal: `UInt(15) === 0x000000000000000f`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L2219-L2228)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GMP.BigInt' href='#Base.GMP.BigInt'>#</a>&nbsp;<b><u>Base.GMP.BigInt</u></b> &mdash; <i>Type</i>.




```julia
BigInt <: Signed
```


Arbitrary precision integer type.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/gmp.jl#L54-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Complex' href='#Base.Complex'>#</a>&nbsp;<b><u>Base.Complex</u></b> &mdash; <i>Type</i>.




```julia
Complex{T<:Real} <: Number
```


Complex number type with real and imaginary part of type `T`.

`ComplexF16`, `ComplexF32` and `ComplexF64` are aliases for `Complex{Float16}`, `Complex{Float32}` and `Complex{Float64}` respectively.

See also: [`Real`](/base/numbers#Core.Real), [`complex`](/base/numbers#Base.complex-Tuple{Complex}), [`real`](/base/math#Base.real).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/complex.jl#L3-L12)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rational' href='#Base.Rational'>#</a>&nbsp;<b><u>Base.Rational</u></b> &mdash; <i>Type</i>.




```julia
Rational{T<:Integer} <: Real
```


Rational number type, with numerator and denominator of type `T`. Rationals are checked for overflow.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/rational.jl#L3-L8)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Irrational' href='#Base.Irrational'>#</a>&nbsp;<b><u>Base.Irrational</u></b> &mdash; <i>Type</i>.




```julia
Irrational{sym} <: AbstractIrrational
```


Number type representing an exact irrational value denoted by the symbol `sym`, such as [`π`](/base/numbers#Base.MathConstants.pi), [`ℯ`](/base/numbers#Base.MathConstants.ℯ) and [`γ`](/base/numbers#Base.MathConstants.eulergamma).

See also [`AbstractIrrational`](/base/numbers#Base.AbstractIrrational).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/irrationals.jl#L21-L28)

</div>
<br>

## Data Formats {#Data-Formats}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.digits' href='#Base.digits'>#</a>&nbsp;<b><u>Base.digits</u></b> &mdash; <i>Function</i>.




```julia
digits([T<:Integer], n::Integer; base::T = 10, pad::Integer = 1)
```


Return an array with element type `T` (default `Int`) of the digits of `n` in the given base, optionally padded with zeros to a specified size. More significant digits are at higher indices, such that `n == sum(digits[k]*base^(k-1) for k=1:length(digits))`.

See also [`ndigits`](/base/math#Base.ndigits), [`digits!`](/base/numbers#Base.digits!), and for base 2 also [`bitstring`](/base/numbers#Base.bitstring), [`count_ones`](/base/numbers#Base.count_ones).

**Examples**

```julia
julia> digits(10)
2-element Vector{Int64}:
 0
 1

julia> digits(10, base = 2)
4-element Vector{Int64}:
 0
 1
 0
 1

julia> digits(-256, base = 10, pad = 5)
5-element Vector{Int64}:
 -6
 -5
 -2
  0
  0

julia> n = rand(-999:999);

julia> n == evalpoly(13, digits(n, base = 13))
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/intfuncs.jl#L976-L1013)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.digits!' href='#Base.digits!'>#</a>&nbsp;<b><u>Base.digits!</u></b> &mdash; <i>Function</i>.




```julia
digits!(array, n::Integer; base::Integer = 10)
```


Fills an array of the digits of `n` in the given base. More significant digits are at higher indices. If the array length is insufficient, the least significant digits are filled up to the array length. If the array length is excessive, the excess portion is filled with zeros.

**Examples**

```julia
julia> digits!([2, 2, 2, 2], 10, base = 2)
4-element Vector{Int64}:
 0
 1
 0
 1

julia> digits!([2, 2, 2, 2, 2, 2], 10, base = 2)
6-element Vector{Int64}:
 0
 1
 0
 1
 0
 0
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/intfuncs.jl#L1030-L1055)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.bitstring' href='#Base.bitstring'>#</a>&nbsp;<b><u>Base.bitstring</u></b> &mdash; <i>Function</i>.




```julia
bitstring(n)
```


A string giving the literal bit representation of a primitive type (in bigendian order, i.e. most-significant bit first).

See also [`count_ones`](/base/numbers#Base.count_ones), [`count_zeros`](/base/numbers#Base.count_zeros), [`digits`](/base/numbers#Base.digits).

**Examples**

```julia
julia> bitstring(Int32(4))
"00000000000000000000000000000100"

julia> bitstring(2.2)
"0100000000000001100110011001100110011001100110011001100110011010"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/intfuncs.jl#L941-L957)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.parse' href='#Base.parse'>#</a>&nbsp;<b><u>Base.parse</u></b> &mdash; <i>Function</i>.




```julia
parse(::Type{SimpleColor}, rgb::String)
```


An analogue of `tryparse(SimpleColor, rgb::String)` (which see), that raises an error instead of returning `nothing`.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L69-L74)



```julia
parse(::Type{Platform}, triplet::AbstractString)
```


Parses a string platform triplet back into a `Platform` object.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/binaryplatforms.jl#L697-L701)



```julia
parse(type, str; base)
```


Parse a string as a number. For `Integer` types, a base can be specified (the default is 10). For floating-point types, the string is parsed as a decimal floating-point number.  `Complex` types are parsed from decimal strings of the form `"R±Iim"` as a `Complex(R,I)` of the requested type; `"i"` or `"j"` can also be used instead of `"im"`, and `"R"` or `"Iim"` are also permitted. If the string does not contain a valid number, an error is raised.

::: tip Julia 1.1

`parse(Bool, str)` requires at least Julia 1.1.

:::

**Examples**

```julia
julia> parse(Int, "1234")
1234

julia> parse(Int, "1234", base = 5)
194

julia> parse(Int, "afc", base = 16)
2812

julia> parse(Float64, "1.2e-3")
0.0012

julia> parse(Complex{Float64}, "3.2e-1 + 4.5im")
0.32 + 4.5im
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/parse.jl#L7-L37)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.tryparse' href='#Base.tryparse'>#</a>&nbsp;<b><u>Base.tryparse</u></b> &mdash; <i>Function</i>.




```julia
tryparse(::Type{SimpleColor}, rgb::String)
```


Attempt to parse `rgb` as a `SimpleColor`. If `rgb` starts with `#` and has a length of 7, it is converted into a `RGBTuple`-backed `SimpleColor`. If `rgb` starts with `a`-`z`, `rgb` is interpreted as a color name and converted to a `Symbol`-backed `SimpleColor`.

Otherwise, `nothing` is returned.

**Examples**

```julia
julia> tryparse(SimpleColor, "blue")
SimpleColor(blue)

julia> tryparse(SimpleColor, "#9558b2")
SimpleColor(#9558b2)

julia> tryparse(SimpleColor, "#nocolor")
```



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L34-L55)



```julia
tryparse(type, str; base)
```


Like [`parse`](/base/numbers#Base.parse), but returns either a value of the requested type, or [`nothing`](/base/constants#Core.nothing) if the string does not contain a valid number.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/parse.jl#L242-L247)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.big' href='#Base.big'>#</a>&nbsp;<b><u>Base.big</u></b> &mdash; <i>Function</i>.




```julia
big(x)
```


Convert a number to a maximum precision representation (typically [`BigInt`](/base/numbers#Base.GMP.BigInt) or `BigFloat`). See [`BigFloat`](/base/numbers#Base.MPFR.BigFloat-Tuple{Any,%20RoundingMode}) for information about some pitfalls with floating-point numbers.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/gmp.jl#L479-L485)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.signed' href='#Base.signed'>#</a>&nbsp;<b><u>Base.signed</u></b> &mdash; <i>Function</i>.




```julia
signed(T::Integer)
```


Convert an integer bitstype to the signed type of the same size.

**Examples**

```julia
julia> signed(UInt16)
Int16
julia> signed(UInt64)
Int64
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L61-L72)



```julia
signed(x)
```


Convert a number to a signed integer. If the argument is unsigned, it is reinterpreted as signed without checking for overflow.

See also: [`unsigned`](/base/numbers#Base.unsigned), [`sign`](/base/math#Base.sign), [`signbit`](/base/math#Base.signbit).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L218-L225)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsigned' href='#Base.unsigned'>#</a>&nbsp;<b><u>Base.unsigned</u></b> &mdash; <i>Function</i>.




```julia
unsigned(T::Integer)
```


Convert an integer bitstype to the unsigned type of the same size.

**Examples**

```julia
julia> unsigned(Int16)
UInt16
julia> unsigned(UInt64)
UInt64
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L48-L59)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.float-Tuple{Any}' href='#Base.float-Tuple{Any}'>#</a>&nbsp;<b><u>Base.float</u></b> &mdash; <i>Method</i>.




```julia
float(x)
```


Convert a number or array to a floating point data type.

See also: [`complex`](/base/numbers#Base.complex-Tuple{Complex}), [`oftype`](/base/base#Base.oftype), [`convert`](/base/base#Base.convert).

**Examples**

```julia
julia> float(1:1000)
1.0:1.0:1000.0

julia> float(typemax(Int32))
2.147483647e9
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L358-L373)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.significand' href='#Base.Math.significand'>#</a>&nbsp;<b><u>Base.Math.significand</u></b> &mdash; <i>Function</i>.




```julia
significand(x)
```


Extract the significand (a.k.a. mantissa) of a floating-point number. If `x` is a non-zero finite number, then the result will be a number of the same type and sign as `x`, and whose absolute value is on the interval $[1,2)$. Otherwise `x` is returned.

See also [`frexp`](/base/math#Base.Math.frexp), [`exponent`](/base/numbers#Base.Math.exponent).

**Examples**

```julia
julia> significand(15.2)
1.9

julia> significand(-15.2)
-1.9

julia> significand(-15.2) * 2^3
-15.2

julia> significand(-Inf), significand(Inf), significand(NaN)
(-Inf, Inf, NaN)
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/math.jl#L1095-L1119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.exponent' href='#Base.Math.exponent'>#</a>&nbsp;<b><u>Base.Math.exponent</u></b> &mdash; <i>Function</i>.




```julia
exponent(x::Real) -> Int
```


Return the largest integer `y` such that `2^y ≤ abs(x)`. For a normalized floating-point number `x`, this corresponds to the exponent of `x`.

Throws a `DomainError` when `x` is zero, infinite, or [`NaN`](/base/numbers#Base.NaN). For any other non-subnormal floating-point number `x`, this corresponds to the exponent bits of `x`.

See also [`signbit`](/base/math#Base.signbit), [`significand`](/base/numbers#Base.Math.significand), [`frexp`](/base/math#Base.Math.frexp), [`issubnormal`](/base/numbers#Base.issubnormal), [`log2`](/base/math#Base.log2), [`ldexp`](/base/math#Base.Math.ldexp).

**Examples**

```julia
julia> exponent(8)
3

julia> exponent(6.5)
2

julia> exponent(-1//4)
-2

julia> exponent(3.142e-4)
-12

julia> exponent(floatmin(Float32)), exponent(nextfloat(0.0f0))
(-126, -149)

julia> exponent(0.0)
ERROR: DomainError with 0.0:
Cannot be ±0.0.
[...]
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/math.jl#L1033-L1065)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.complex-Tuple{Complex}' href='#Base.complex-Tuple{Complex}'>#</a>&nbsp;<b><u>Base.complex</u></b> &mdash; <i>Method</i>.




```julia
complex(r, [i])
```


Convert real numbers or arrays to complex. `i` defaults to zero.

**Examples**

```julia
julia> complex(7)
7 + 0im

julia> complex([1, 2, 3])
3-element Vector{Complex{Int64}}:
 1 + 0im
 2 + 0im
 3 + 0im
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/complex.jl#L156-L172)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.bswap' href='#Base.bswap'>#</a>&nbsp;<b><u>Base.bswap</u></b> &mdash; <i>Function</i>.




```julia
bswap(n)
```


Reverse the byte order of `n`.

(See also [`ntoh`](/base/io-network#Base.ntoh) and [`hton`](/base/io-network#Base.hton) to convert between the current native byte order and big-endian order.)

**Examples**

```julia
julia> a = bswap(0x10203040)
0x40302010

julia> bswap(a)
0x10203040

julia> string(1, base = 2)
"1"

julia> string(bswap(1), base = 2)
"100000000000000000000000000000000000000000000000000000000"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L375-L396)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hex2bytes' href='#Base.hex2bytes'>#</a>&nbsp;<b><u>Base.hex2bytes</u></b> &mdash; <i>Function</i>.




```julia
hex2bytes(itr)
```


Given an iterable `itr` of ASCII codes for a sequence of hexadecimal digits, returns a `Vector{UInt8}` of bytes  corresponding to the binary representation: each successive pair of hexadecimal digits in `itr` gives the value of one byte in the return vector.

The length of `itr` must be even, and the returned array has half of the length of `itr`. See also [`hex2bytes!`](/base/numbers#Base.hex2bytes!) for an in-place version, and [`bytes2hex`](/base/numbers#Base.bytes2hex) for the inverse.

::: tip Julia 1.7

Calling `hex2bytes` with iterators producing `UInt8` values requires Julia 1.7 or later. In earlier versions, you can `collect` the iterator before calling `hex2bytes`.

:::

**Examples**

```julia
julia> s = string(12345, base = 16)
"3039"

julia> hex2bytes(s)
2-element Vector{UInt8}:
 0x30
 0x39

julia> a = b"01abEF"
6-element Base.CodeUnits{UInt8, String}:
 0x30
 0x31
 0x61
 0x62
 0x45
 0x46

julia> hex2bytes(a)
3-element Vector{UInt8}:
 0x01
 0xab
 0xef
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/strings/util.jl#L944-L984)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hex2bytes!' href='#Base.hex2bytes!'>#</a>&nbsp;<b><u>Base.hex2bytes!</u></b> &mdash; <i>Function</i>.




```julia
hex2bytes!(dest::AbstractVector{UInt8}, itr)
```


Convert an iterable `itr` of bytes representing a hexadecimal string to its binary representation, similar to [`hex2bytes`](/base/numbers#Base.hex2bytes) except that the output is written in-place to `dest`. The length of `dest` must be half the length of `itr`.

::: tip Julia 1.7

Calling hex2bytes! with iterators producing UInt8 requires version 1.7. In earlier versions, you can collect the iterable before calling instead.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/strings/util.jl#L996-L1007)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.bytes2hex' href='#Base.bytes2hex'>#</a>&nbsp;<b><u>Base.bytes2hex</u></b> &mdash; <i>Function</i>.




```julia
bytes2hex(itr) -> String
bytes2hex(io::IO, itr)
```


Convert an iterator `itr` of bytes to its hexadecimal string representation, either returning a `String` via `bytes2hex(itr)` or writing the string to an `io` stream via `bytes2hex(io, itr)`.  The hexadecimal characters are all lowercase.

::: tip Julia 1.7

Calling `bytes2hex` with arbitrary iterators producing `UInt8` values requires Julia 1.7 or later. In earlier versions, you can `collect` the iterator before calling `bytes2hex`.

:::

**Examples**

```julia
julia> a = string(12345, base = 16)
"3039"

julia> b = hex2bytes(a)
2-element Vector{UInt8}:
 0x30
 0x39

julia> bytes2hex(b)
"3039"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/strings/util.jl#L1033-L1059)

</div>
<br>

## General Number Functions and Constants {#General-Number-Functions-and-Constants}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.one' href='#Base.one'>#</a>&nbsp;<b><u>Base.one</u></b> &mdash; <i>Function</i>.




```julia
one(x)
one(T::Type)
```


Return a multiplicative identity for `x`: a value such that `one(x)*x == x*one(x) == x`. If the multiplicative identity can be deduced from the type alone, then a type may be given as an argument to `one` (e.g. `one(Int)` will work because the multiplicative identity is the same for all instances of `Int`, but `one(Matrix{Int})` is not defined because matrices of different shapes have different multiplicative identities.)

If possible, `one(x)` returns a value of the same type as `x`, and `one(T)` returns a value of type `T`.  However, this may not be the case for types representing dimensionful quantities (e.g. time in days), since the multiplicative identity must be dimensionless.  In that case, `one(x)` should return an identity value of the same precision (and shape, for matrices) as `x`.

If you want a quantity that is of the same type as `x`, or of type `T`, even if `x` is dimensionful, use [`oneunit`](/base/numbers#Base.oneunit) instead.

See also the [`identity`](/base/base#Base.identity) function, and `I` in [`LinearAlgebra`](/stdlib/LinearAlgebra#man-linalg) for the identity matrix.

**Examples**

```julia
julia> one(3.7)
1.0

julia> one(Int)
1

julia> import Dates; one(Dates.Day(1))
1
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/number.jl#L317-L354)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.oneunit' href='#Base.oneunit'>#</a>&nbsp;<b><u>Base.oneunit</u></b> &mdash; <i>Function</i>.




```julia
oneunit(x::T)
oneunit(T::Type)
```


Return `T(one(x))`, where `T` is either the type of the argument, or the argument itself in cases where the `oneunit` can be deduced from the type alone. This differs from [`one`](/base/numbers#Base.one) for dimensionful quantities: `one` is dimensionless (a multiplicative identity) while `oneunit` is dimensionful (of the same type as `x`, or of type `T`).

**Examples**

```julia
julia> oneunit(3.7)
1.0

julia> import Dates; oneunit(Dates.Day)
1 day
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/number.jl#L361-L379)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.zero' href='#Base.zero'>#</a>&nbsp;<b><u>Base.zero</u></b> &mdash; <i>Function</i>.




```julia
zero(x)
zero(::Type)
```


Get the additive identity element for `x`. If the additive identity can be deduced from the type alone, then a type may be given as an argument to `zero`.

For example, `zero(Int)` will work because the additive identity is the same for all instances of `Int`, but `zero(Vector{Int})` is not defined because vectors of different lengths have different additive identities.

See also [`iszero`](/base/numbers#Base.iszero), [`one`](/base/numbers#Base.one), [`oneunit`](/base/numbers#Base.oneunit), [`oftype`](/base/base#Base.oftype).

**Examples**

```julia
julia> zero(1)
0

julia> zero(big"2.0")
0.0

julia> zero(rand(2,2))
2×2 Matrix{Float64}:
 0.0  0.0
 0.0  0.0
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/number.jl#L286-L312)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.im' href='#Base.im'>#</a>&nbsp;<b><u>Base.im</u></b> &mdash; <i>Constant</i>.




```julia
im
```


The imaginary unit.

See also: [`imag`](/base/math#Base.imag), [`angle`](/base/math#Base.angle), [`complex`](/base/numbers#Base.complex-Tuple{Complex}).

**Examples**

```julia
julia> im * im
-1 + 0im

julia> (2.0 + 3im)^2
-5.0 + 12.0im
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/complex.jl#L20-L35)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MathConstants.pi' href='#Base.MathConstants.pi'>#</a>&nbsp;<b><u>Base.MathConstants.pi</u></b> &mdash; <i>Constant</i>.




```julia
π
pi
```


The constant pi.

Unicode `π` can be typed by writing `\pi` then pressing tab in the Julia REPL, and in many editors.

See also: [`sinpi`](/base/math#Base.Math.sinpi), [`sincospi`](/base/math#Base.Math.sincospi), [`deg2rad`](/base/math#Base.Math.deg2rad).

**Examples**

```julia
julia> pi
π = 3.1415926535897...

julia> 1/2pi
0.15915494309189535
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mathconstants.jl#L20-L38)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MathConstants.ℯ' href='#Base.MathConstants.ℯ'>#</a>&nbsp;<b><u>Base.MathConstants.ℯ</u></b> &mdash; <i>Constant</i>.




```julia
ℯ
e
```


The constant ℯ.

Unicode `ℯ` can be typed by writing `\euler` and pressing tab in the Julia REPL, and in many editors.

See also: [`exp`](/base/math#Base.exp-Tuple{Float64}), [`cis`](/base/math#Base.cis), [`cispi`](/base/math#Base.cispi).

**Examples**

```julia
julia> ℯ
ℯ = 2.7182818284590...

julia> log(ℯ)
1

julia> ℯ^(im)π ≈ -1
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mathconstants.jl#L41-L62)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MathConstants.catalan' href='#Base.MathConstants.catalan'>#</a>&nbsp;<b><u>Base.MathConstants.catalan</u></b> &mdash; <i>Constant</i>.




```julia
catalan
```


Catalan&#39;s constant.

**Examples**

```julia
julia> Base.MathConstants.catalan
catalan = 0.9159655941772...

julia> sum(log(x)/(1+x^2) for x in 1:0.01:10^6) * 0.01
0.9159466120554123
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mathconstants.jl#L101-L114)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MathConstants.eulergamma' href='#Base.MathConstants.eulergamma'>#</a>&nbsp;<b><u>Base.MathConstants.eulergamma</u></b> &mdash; <i>Constant</i>.




```julia
γ
eulergamma
```


Euler&#39;s constant.

**Examples**

```julia
julia> Base.MathConstants.eulergamma
γ = 0.5772156649015...

julia> dx = 10^-6;

julia> sum(-exp(-x) * log(x) for x in dx:dx:100) * dx
0.5772078382499133
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mathconstants.jl#L65-L81)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MathConstants.golden' href='#Base.MathConstants.golden'>#</a>&nbsp;<b><u>Base.MathConstants.golden</u></b> &mdash; <i>Constant</i>.




```julia
φ
golden
```


The golden ratio.

**Examples**

```julia
julia> Base.MathConstants.golden
φ = 1.6180339887498...

julia> (2ans - 1)^2 ≈ 5
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mathconstants.jl#L84-L98)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Inf' href='#Base.Inf'>#</a>&nbsp;<b><u>Base.Inf</u></b> &mdash; <i>Constant</i>.




```julia
Inf, Inf64
```


Positive infinity of type [`Float64`](/base/numbers#Core.Float64).

See also: [`isfinite`](/base/numbers#Base.isfinite), [`typemax`](/base/base#Base.typemax), [`NaN`](/base/numbers#Base.NaN), [`Inf32`](/base/numbers#Base.Inf32).

**Examples**

```julia
julia> π/0
Inf

julia> +1.0 / -0.0
-Inf

julia> ℯ^-Inf
0.0
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L39-L57)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Inf64' href='#Base.Inf64'>#</a>&nbsp;<b><u>Base.Inf64</u></b> &mdash; <i>Constant</i>.




```julia
Inf, Inf64
```


Positive infinity of type [`Float64`](/base/numbers#Core.Float64).

See also: [`isfinite`](/base/numbers#Base.isfinite), [`typemax`](/base/base#Base.typemax), [`NaN`](/base/numbers#Base.NaN), [`Inf32`](/base/numbers#Base.Inf32).

**Examples**

```julia
julia> π/0
Inf

julia> +1.0 / -0.0
-Inf

julia> ℯ^-Inf
0.0
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L39-L57)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Inf32' href='#Base.Inf32'>#</a>&nbsp;<b><u>Base.Inf32</u></b> &mdash; <i>Constant</i>.




```julia
Inf32
```


Positive infinity of type [`Float32`](/base/numbers#Core.Float32).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L21-L25)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Inf16' href='#Base.Inf16'>#</a>&nbsp;<b><u>Base.Inf16</u></b> &mdash; <i>Constant</i>.




```julia
Inf16
```


Positive infinity of type [`Float16`](/base/numbers#Core.Float16).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L7-L11)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.NaN' href='#Base.NaN'>#</a>&nbsp;<b><u>Base.NaN</u></b> &mdash; <i>Constant</i>.




```julia
NaN, NaN64
```


A not-a-number value of type [`Float64`](/base/numbers#Core.Float64).

See also: [`isnan`](/base/numbers#Base.isnan), [`missing`](/manual/missing#missing), [`NaN32`](/base/numbers#Base.NaN32), [`Inf`](/base/numbers#Base.Inf).

**Examples**

```julia
julia> 0/0
NaN

julia> Inf - Inf
NaN

julia> NaN == NaN, isequal(NaN, NaN), isnan(NaN)
(false, true, true)
```


::: tip Note

Always use [`isnan`](/base/numbers#Base.isnan) or [`isequal`](/base/base#Base.isequal) for checking for `NaN`. Using `x === NaN` may give unexpected results:

```julia
julia> reinterpret(UInt32, NaN32)
0x7fc00000

julia> NaN32p1 = reinterpret(Float32, 0x7fc00001)
NaN32

julia> NaN32p1 === NaN32, isequal(NaN32p1, NaN32), isnan(NaN32p1)
(false, true, true)
```


:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L61-L93)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.NaN64' href='#Base.NaN64'>#</a>&nbsp;<b><u>Base.NaN64</u></b> &mdash; <i>Constant</i>.




```julia
NaN, NaN64
```


A not-a-number value of type [`Float64`](/base/numbers#Core.Float64).

See also: [`isnan`](/base/numbers#Base.isnan), [`missing`](/manual/missing#missing), [`NaN32`](/base/numbers#Base.NaN32), [`Inf`](/base/numbers#Base.Inf).

**Examples**

```julia
julia> 0/0
NaN

julia> Inf - Inf
NaN

julia> NaN == NaN, isequal(NaN, NaN), isnan(NaN)
(false, true, true)
```


::: tip Note

Always use [`isnan`](/base/numbers#Base.isnan) or [`isequal`](/base/base#Base.isequal) for checking for `NaN`. Using `x === NaN` may give unexpected results:

```julia
julia> reinterpret(UInt32, NaN32)
0x7fc00000

julia> NaN32p1 = reinterpret(Float32, 0x7fc00001)
NaN32

julia> NaN32p1 === NaN32, isequal(NaN32p1, NaN32), isnan(NaN32p1)
(false, true, true)
```


:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L61-L93)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.NaN32' href='#Base.NaN32'>#</a>&nbsp;<b><u>Base.NaN32</u></b> &mdash; <i>Constant</i>.




```julia
NaN32
```


A not-a-number value of type [`Float32`](/base/numbers#Core.Float32).

See also: [`NaN`](/base/numbers#Base.NaN).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L27-L33)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.NaN16' href='#Base.NaN16'>#</a>&nbsp;<b><u>Base.NaN16</u></b> &mdash; <i>Constant</i>.




```julia
NaN16
```


A not-a-number value of type [`Float16`](/base/numbers#Core.Float16).

See also: [`NaN`](/base/numbers#Base.NaN).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L13-L19)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.issubnormal' href='#Base.issubnormal'>#</a>&nbsp;<b><u>Base.issubnormal</u></b> &mdash; <i>Function</i>.




```julia
issubnormal(f) -> Bool
```


Test whether a floating point number is subnormal.

An IEEE floating point number is [subnormal](https://en.wikipedia.org/wiki/Subnormal_number) when its exponent bits are zero and its significand is not zero.

**Examples**

```julia
julia> floatmin(Float32)
1.1754944f-38

julia> issubnormal(1.0f-37)
false

julia> issubnormal(1.0f-38)
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L989-L1008)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isfinite' href='#Base.isfinite'>#</a>&nbsp;<b><u>Base.isfinite</u></b> &mdash; <i>Function</i>.




```julia
isfinite(f) -> Bool
```


Test whether a number is finite.

**Examples**

```julia
julia> isfinite(5)
true

julia> isfinite(NaN32)
false
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/number.jl#L64-L77)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isinf' href='#Base.isinf'>#</a>&nbsp;<b><u>Base.isinf</u></b> &mdash; <i>Function</i>.




```julia
isinf(f) -> Bool
```


Test whether a number is infinite.

See also: [`Inf`](/base/numbers#Base.Inf), [`iszero`](/base/numbers#Base.iszero), [`isfinite`](/base/numbers#Base.isfinite), [`isnan`](/base/numbers#Base.isnan).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L696-L702)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isnan' href='#Base.isnan'>#</a>&nbsp;<b><u>Base.isnan</u></b> &mdash; <i>Function</i>.




```julia
isnan(f) -> Bool
```


Test whether a number value is a NaN, an indeterminate value which is neither an infinity nor a finite number (&quot;not a number&quot;).

See also: [`iszero`](/base/numbers#Base.iszero), [`isone`](/base/numbers#Base.isone), [`isinf`](/base/numbers#Base.isinf), [`ismissing`](/base/base#Base.ismissing).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L681-L688)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.iszero' href='#Base.iszero'>#</a>&nbsp;<b><u>Base.iszero</u></b> &mdash; <i>Function</i>.




```julia
iszero(x)
```


Return `true` if `x == zero(x)`; if `x` is an array, this checks whether all of the elements of `x` are zero.

See also: [`isone`](/base/numbers#Base.isone), [`isinteger`](/base/numbers#Base.isinteger), [`isfinite`](/base/numbers#Base.isfinite), [`isnan`](/base/numbers#Base.isnan).

**Examples**

```julia
julia> iszero(0.0)
true

julia> iszero([1, 9, 0])
false

julia> iszero([false, 0, 0])
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/number.jl#L22-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isone' href='#Base.isone'>#</a>&nbsp;<b><u>Base.isone</u></b> &mdash; <i>Function</i>.




```julia
isone(x)
```


Return `true` if `x == one(x)`; if `x` is an array, this checks whether `x` is an identity matrix.

**Examples**

```julia
julia> isone(1.0)
true

julia> isone([1 0; 0 2])
false

julia> isone([1 0; 0 true])
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/number.jl#L44-L61)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nextfloat' href='#Base.nextfloat'>#</a>&nbsp;<b><u>Base.nextfloat</u></b> &mdash; <i>Function</i>.




```julia
nextfloat(x::AbstractFloat, n::Integer)
```


The result of `n` iterative applications of `nextfloat` to `x` if `n >= 0`, or `-n` applications of [`prevfloat`](/base/numbers#Base.prevfloat) if `n < 0`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L869-L874)



```julia
nextfloat(x::AbstractFloat)
```


Return the smallest floating point number `y` of the same type as `x` such `x < y`. If no such `y` exists (e.g. if `x` is `Inf` or `NaN`), then return `x`.

See also: [`prevfloat`](/base/numbers#Base.prevfloat), [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}), [`issubnormal`](/base/numbers#Base.issubnormal).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L913-L920)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.prevfloat' href='#Base.prevfloat'>#</a>&nbsp;<b><u>Base.prevfloat</u></b> &mdash; <i>Function</i>.




```julia
prevfloat(x::AbstractFloat, n::Integer)
```


The result of `n` iterative applications of `prevfloat` to `x` if `n >= 0`, or `-n` applications of [`nextfloat`](/base/numbers#Base.nextfloat) if `n < 0`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L923-L928)



```julia
prevfloat(x::AbstractFloat)
```


Return the largest floating point number `y` of the same type as `x` such `y < x`. If no such `y` exists (e.g. if `x` is `-Inf` or `NaN`), then return `x`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L931-L936)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isinteger' href='#Base.isinteger'>#</a>&nbsp;<b><u>Base.isinteger</u></b> &mdash; <i>Function</i>.




```julia
isinteger(x) -> Bool
```


Test whether `x` is numerically equal to some integer.

**Examples**

```julia
julia> isinteger(4.0)
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/number.jl#L9-L19)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isreal' href='#Base.isreal'>#</a>&nbsp;<b><u>Base.isreal</u></b> &mdash; <i>Function</i>.




```julia
isreal(x) -> Bool
```


Test whether `x` or all its elements are numerically equal to some real number including infinities and NaNs. `isreal(x)` is true if `isequal(x, real(x))` is true.

**Examples**

```julia
julia> isreal(5.)
true

julia> isreal(1 - 3im)
false

julia> isreal(Inf + 0im)
true

julia> isreal([4.; complex(0,1)])
false
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/complex.jl#L125-L146)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Float32-Tuple{Any}' href='#Core.Float32-Tuple{Any}'>#</a>&nbsp;<b><u>Core.Float32</u></b> &mdash; <i>Method</i>.




```julia
Float32(x [, mode::RoundingMode])
```


Create a `Float32` from `x`. If `x` is not exactly representable then `mode` determines how `x` is rounded.

**Examples**

```julia
julia> Float32(1/3, RoundDown)
0.3333333f0

julia> Float32(1/3, RoundUp)
0.33333334f0
```


See [`RoundingMode`](/base/math#Base.Rounding.RoundingMode) for available rounding modes.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L1660-L1676)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Float64-Tuple{Any}' href='#Core.Float64-Tuple{Any}'>#</a>&nbsp;<b><u>Core.Float64</u></b> &mdash; <i>Method</i>.




```julia
Float64(x [, mode::RoundingMode])
```


Create a `Float64` from `x`. If `x` is not exactly representable then `mode` determines how `x` is rounded.

**Examples**

```julia
julia> Float64(pi, RoundDown)
3.141592653589793

julia> Float64(pi, RoundUp)
3.1415926535897936
```


See [`RoundingMode`](/base/math#Base.Rounding.RoundingMode) for available rounding modes.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/docs/basedocs.jl#L1679-L1695)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.rounding' href='#Base.Rounding.rounding'>#</a>&nbsp;<b><u>Base.Rounding.rounding</u></b> &mdash; <i>Function</i>.




```julia
rounding(T)
```


Get the current floating point rounding mode for type `T`, controlling the rounding of basic arithmetic functions ([`+`](/base/math#Base.:+), [`-`](/base/math#Base.:--Tuple{Any}), [`*`](/base/math#Base.:*-Tuple{Any,%20Vararg{Any}}), [`/`](/base/math#Base.:/) and [`sqrt`](/base/math#Base.sqrt-Tuple{Number})) and type conversion.

See [`RoundingMode`](/base/math#Base.Rounding.RoundingMode) for available modes.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/rounding.jl#L208-L216)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.setrounding-Tuple{Type, Any}' href='#Base.Rounding.setrounding-Tuple{Type, Any}'>#</a>&nbsp;<b><u>Base.Rounding.setrounding</u></b> &mdash; <i>Method</i>.




```julia
setrounding(T, mode)
```


Set the rounding mode of floating point type `T`, controlling the rounding of basic arithmetic functions ([`+`](/base/math#Base.:+), [`-`](/base/math#Base.:--Tuple{Any}), [`*`](/base/math#Base.:*-Tuple{Any,%20Vararg{Any}}), [`/`](/base/math#Base.:/) and [`sqrt`](/base/math#Base.sqrt-Tuple{Number})) and type conversion. Other numerical functions may give incorrect or invalid values when using rounding modes other than the default [`RoundNearest`](/base/math#Base.Rounding.RoundNearest).

Note that this is currently only supported for `T == BigFloat`.

::: warning Warning

This function is not thread-safe. It will affect code running on all threads, but its behavior is undefined if called concurrently with computations that use the setting.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/rounding.jl#L189-L205)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.setrounding-Tuple{Function, Type, RoundingMode}' href='#Base.Rounding.setrounding-Tuple{Function, Type, RoundingMode}'>#</a>&nbsp;<b><u>Base.Rounding.setrounding</u></b> &mdash; <i>Method</i>.




```julia
setrounding(f::Function, T, mode)
```


Change the rounding mode of floating point type `T` for the duration of `f`. It is logically equivalent to:

```
old = rounding(T)
setrounding(T, mode)
f()
setrounding(T, old)
```


See [`RoundingMode`](/base/math#Base.Rounding.RoundingMode) for available rounding modes.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/rounding.jl#L224-L236)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.get_zero_subnormals' href='#Base.Rounding.get_zero_subnormals'>#</a>&nbsp;<b><u>Base.Rounding.get_zero_subnormals</u></b> &mdash; <i>Function</i>.




```julia
get_zero_subnormals() -> Bool
```


Return `false` if operations on subnormal floating-point values (&quot;denormals&quot;) obey rules for IEEE arithmetic, and `true` if they might be converted to zeros.

::: warning Warning

This function only affects the current thread.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/rounding.jl#L304-L313)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.set_zero_subnormals' href='#Base.Rounding.set_zero_subnormals'>#</a>&nbsp;<b><u>Base.Rounding.set_zero_subnormals</u></b> &mdash; <i>Function</i>.




```julia
set_zero_subnormals(yes::Bool) -> Bool
```


If `yes` is `false`, subsequent floating-point operations follow rules for IEEE arithmetic on subnormal values (&quot;denormals&quot;). Otherwise, floating-point operations are permitted (but not required) to convert subnormal inputs or outputs to zero. Returns `true` unless `yes==true` but the hardware does not support zeroing of subnormal numbers.

`set_zero_subnormals(true)` can speed up some computations on some hardware. However, it can break identities such as `(x-y==0) == (x==y)`.

::: warning Warning

This function only affects the current thread.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/rounding.jl#L287-L301)

</div>
<br>

### Integers {#Integers}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.count_ones' href='#Base.count_ones'>#</a>&nbsp;<b><u>Base.count_ones</u></b> &mdash; <i>Function</i>.




```julia
count_ones(x::Integer) -> Integer
```


Number of ones in the binary representation of `x`.

**Examples**

```julia
julia> count_ones(7)
3

julia> count_ones(Int32(-1))
32
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L401-L414)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.count_zeros' href='#Base.count_zeros'>#</a>&nbsp;<b><u>Base.count_zeros</u></b> &mdash; <i>Function</i>.




```julia
count_zeros(x::Integer) -> Integer
```


Number of zeros in the binary representation of `x`.

**Examples**

```julia
julia> count_zeros(Int32(2 ^ 16 - 1))
16

julia> count_zeros(-1)
0
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L443-L456)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.leading_zeros' href='#Base.leading_zeros'>#</a>&nbsp;<b><u>Base.leading_zeros</u></b> &mdash; <i>Function</i>.




```julia
leading_zeros(x::Integer) -> Integer
```


Number of zeros leading the binary representation of `x`.

**Examples**

```julia
julia> leading_zeros(Int32(1))
31
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L417-L427)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.leading_ones' href='#Base.leading_ones'>#</a>&nbsp;<b><u>Base.leading_ones</u></b> &mdash; <i>Function</i>.




```julia
leading_ones(x::Integer) -> Integer
```


Number of ones leading the binary representation of `x`.

**Examples**

```julia
julia> leading_ones(UInt32(2 ^ 32 - 2))
31
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L459-L469)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.trailing_zeros' href='#Base.trailing_zeros'>#</a>&nbsp;<b><u>Base.trailing_zeros</u></b> &mdash; <i>Function</i>.




```julia
trailing_zeros(x::Integer) -> Integer
```


Number of zeros trailing the binary representation of `x`.

**Examples**

```julia
julia> trailing_zeros(2)
1
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L430-L440)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.trailing_ones' href='#Base.trailing_ones'>#</a>&nbsp;<b><u>Base.trailing_ones</u></b> &mdash; <i>Function</i>.




```julia
trailing_ones(x::Integer) -> Integer
```


Number of ones trailing the binary representation of `x`.

**Examples**

```julia
julia> trailing_ones(3)
2
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L472-L482)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isodd' href='#Base.isodd'>#</a>&nbsp;<b><u>Base.isodd</u></b> &mdash; <i>Function</i>.




```julia
isodd(x::Number) -> Bool
```


Return `true` if `x` is an odd integer (that is, an integer not divisible by 2), and `false` otherwise.

::: tip Julia 1.7

Non-`Integer` arguments require Julia 1.7 or later.

:::

**Examples**

```julia
julia> isodd(9)
true

julia> isodd(10)
false
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L99-L115)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.iseven' href='#Base.iseven'>#</a>&nbsp;<b><u>Base.iseven</u></b> &mdash; <i>Function</i>.




```julia
iseven(x::Number) -> Bool
```


Return `true` if `x` is an even integer (that is, an integer divisible by 2), and `false` otherwise.

::: tip Julia 1.7

Non-`Integer` arguments require Julia 1.7 or later.

:::

**Examples**

```julia
julia> iseven(9)
false

julia> iseven(10)
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L119-L135)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.@int128_str' href='#Core.@int128_str'>#</a>&nbsp;<b><u>Core.@int128_str</u></b> &mdash; <i>Macro</i>.




```julia
@int128_str str
```


Parse `str` as an [`Int128`](/base/numbers#Core.Int128). Throw an `ArgumentError` if the string is not a valid integer.

**Examples**

```julia
julia> int128"123456789123"
123456789123

julia> int128"123456789123.4"
ERROR: LoadError: ArgumentError: invalid base 10 digit '.' in "123456789123.4"
[...]
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L634-L649)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.@uint128_str' href='#Core.@uint128_str'>#</a>&nbsp;<b><u>Core.@uint128_str</u></b> &mdash; <i>Macro</i>.




```julia
@uint128_str str
```


Parse `str` as an [`UInt128`](/base/numbers#Core.UInt128). Throw an `ArgumentError` if the string is not a valid integer.

**Examples**

```
julia> uint128"123456789123"
0x00000000000000000000001cbe991a83

julia> uint128"-123456789123"
ERROR: LoadError: ArgumentError: invalid base 10 digit '-' in "-123456789123"
[...]
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L654-L669)

</div>
<br>

## BigFloats and BigInts {#BigFloats-and-BigInts}

The [`BigFloat`](/base/numbers#Base.MPFR.BigFloat) and [`BigInt`](/base/numbers#Base.GMP.BigInt) types implements arbitrary-precision floating point and integer arithmetic, respectively. For [`BigFloat`](/base/numbers#Base.MPFR.BigFloat) the [GNU MPFR library](https://www.mpfr.org/) is used, and for [`BigInt`](/base/numbers#Base.GMP.BigInt) the [GNU Multiple Precision Arithmetic Library (GMP)](https://gmplib.org) is used.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MPFR.BigFloat-Tuple{Any, RoundingMode}' href='#Base.MPFR.BigFloat-Tuple{Any, RoundingMode}'>#</a>&nbsp;<b><u>Base.MPFR.BigFloat</u></b> &mdash; <i>Method</i>.




```julia
BigFloat(x::Union{Real, AbstractString} [, rounding::RoundingMode=rounding(BigFloat)]; [precision::Integer=precision(BigFloat)])
```


Create an arbitrary precision floating point number from `x`, with precision `precision`. The `rounding` argument specifies the direction in which the result should be rounded if the conversion cannot be done exactly. If not provided, these are set by the current global values.

`BigFloat(x::Real)` is the same as `convert(BigFloat,x)`, except if `x` itself is already `BigFloat`, in which case it will return a value with the precision set to the current global precision; `convert` will always return `x`.

`BigFloat(x::AbstractString)` is identical to [`parse`](/base/numbers#Base.parse). This is provided for convenience since decimal literals are converted to `Float64` when parsed, so `BigFloat(2.1)` may not yield what you expect.

See also:
- [`@big_str`](/base/numbers#Core.@big_str)
  
- [`rounding`](/base/numbers#Base.Rounding.rounding) and [`setrounding`](/base/numbers#Base.Rounding.setrounding-Tuple{Type,%20Any})
  
- [`precision`](/base/numbers#Base.precision) and [`setprecision`](/base/numbers#Base.MPFR.setprecision)
  

::: tip Julia 1.1

`precision` as a keyword argument requires at least Julia 1.1. In Julia 1.0 `precision` is the second positional argument (`BigFloat(x, precision)`).

:::

**Examples**

```julia
julia> BigFloat(2.1) # 2.1 here is a Float64
2.100000000000000088817841970012523233890533447265625

julia> BigFloat("2.1") # the closest BigFloat to 2.1
2.099999999999999999999999999999999999999999999999999999999999999999999999999986

julia> BigFloat("2.1", RoundUp)
2.100000000000000000000000000000000000000000000000000000000000000000000000000021

julia> BigFloat("2.1", RoundUp, precision=128)
2.100000000000000000000000000000000000007
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mpfr.jl#L186-L224)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.precision' href='#Base.precision'>#</a>&nbsp;<b><u>Base.precision</u></b> &mdash; <i>Function</i>.




```julia
precision(num::AbstractFloat; base::Integer=2)
precision(T::Type; base::Integer=2)
```


Get the precision of a floating point number, as defined by the effective number of bits in the significand, or the precision of a floating-point type `T` (its current default, if `T` is a variable-precision type like [`BigFloat`](/base/numbers#Base.MPFR.BigFloat)).

If `base` is specified, then it returns the maximum corresponding number of significand digits in that base.

::: tip Julia 1.8

The `base` keyword requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/float.jl#L841-L854)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MPFR.setprecision' href='#Base.MPFR.setprecision'>#</a>&nbsp;<b><u>Base.MPFR.setprecision</u></b> &mdash; <i>Function</i>.




```julia
setprecision([T=BigFloat,] precision::Int; base=2)
```


Set the precision (in bits, by default) to be used for `T` arithmetic. If `base` is specified, then the precision is the minimum required to give at least `precision` digits in the given `base`.

::: warning Warning

This function is not thread-safe. It will affect code running on all threads, but its behavior is undefined if called concurrently with computations that use the setting.

:::

::: tip Julia 1.8

The `base` keyword requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mpfr.jl#L976-L991)



```julia
setprecision(f::Function, [T=BigFloat,] precision::Integer; base=2)
```


Change the `T` arithmetic precision (in the given `base`) for the duration of `f`. It is logically equivalent to:

```
old = precision(BigFloat)
setprecision(BigFloat, precision)
f()
setprecision(BigFloat, old)
```


Often used as `setprecision(T, precision) do ... end`

Note: `nextfloat()`, `prevfloat()` do not use the precision mentioned by `setprecision`.

::: tip Julia 1.8

The `base` keyword requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/mpfr.jl#L1092-L1110)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GMP.BigInt-Tuple{Any}' href='#Base.GMP.BigInt-Tuple{Any}'>#</a>&nbsp;<b><u>Base.GMP.BigInt</u></b> &mdash; <i>Method</i>.




```julia
BigInt(x)
```


Create an arbitrary precision integer. `x` may be an `Int` (or anything that can be converted to an `Int`). The usual mathematical operators are defined for this type, and results are promoted to a [`BigInt`](/base/numbers#Base.GMP.BigInt).

Instances can be constructed from strings via [`parse`](/base/numbers#Base.parse), or using the `big` string literal.

**Examples**

```julia
julia> parse(BigInt, "42")
42

julia> big"313"
313

julia> BigInt(10)^19
10000000000000000000
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/gmp.jl#L71-L92)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.@big_str' href='#Core.@big_str'>#</a>&nbsp;<b><u>Core.@big_str</u></b> &mdash; <i>Macro</i>.




```julia
@big_str str
```


Parse a string into a [`BigInt`](/base/numbers#Base.GMP.BigInt) or [`BigFloat`](/base/numbers#Base.MPFR.BigFloat), and throw an `ArgumentError` if the string is not a valid number. For integers `_` is allowed in the string as a separator.

**Examples**

```julia
julia> big"123_456"
123456

julia> big"7891.5"
7891.5

julia> big"_"
ERROR: ArgumentError: invalid number format _ for BigInt or BigFloat
[...]
```


::: warning Warning

Using `@big_str` for constructing [`BigFloat`](/base/numbers#Base.MPFR.BigFloat) values may not result in the behavior that might be naively expected: as a macro, `@big_str` obeys the global precision ([`setprecision`](/base/numbers#Base.MPFR.setprecision)) and rounding mode ([`setrounding`](/base/numbers#Base.Rounding.setrounding-Tuple{Type,%20Any})) settings as they are at _load time_. Thus, a function like `() -> precision(big"0.3")` returns a constant whose value depends on the value of the precision at the point when the function is defined, **not** at the precision at the time when the function is called.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/int.jl#L674-L702)

</div>
<br>
