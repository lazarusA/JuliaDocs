
# Mathematics {#Mathematics}

## Mathematical Operators {#math-ops}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:--Tuple{Any}' href='#Base.:--Tuple{Any}'>#</a>&nbsp;<b><u>Base.:-</u></b> &mdash; <i>Method</i>.




```julia
-(x)
```


Unary minus operator.

See also: [`abs`](/base/math#Base.abs), [`flipsign`](/base/math#Base.flipsign).

**Examples**

```julia
julia> -1
-1

julia> -(2)
-2

julia> -[1 2; 3 4]
2×2 Matrix{Int64}:
 -1  -2
 -3  -4

julia> -(true)  # promotes to Int
-1

julia> -(0x003)
0xfffd
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L2950-L2976)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:+' href='#Base.:+'>#</a>&nbsp;<b><u>Base.:+</u></b> &mdash; <i>Function</i>.




```julia
dt::Date + t::Time -> DateTime
```


The addition of a `Date` with a `Time` produces a `DateTime`. The hour, minute, second, and millisecond parts of the `Time` are used along with the year, month, and day of the `Date` to create the new `DateTime`. Non-zero microseconds or nanoseconds in the `Time` type will result in an `InexactError` being thrown.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Dates/src/arithmetic.jl#L14-L20)



```julia
+(x, y...)
```


Addition operator.

Infix `x+y+z+...` calls this function with all arguments, i.e. `+(x, y, z, ...)`, which by default then calls `(x+y) + z + ...` starting from the left.

Note that overflow is possible for most integer types, including the default `Int`, when adding large numbers.

**Examples**

```julia
julia> 1 + 20 + 4
25

julia> +(1, 20, 4)
25

julia> [1,2] + [3,4]
2-element Vector{Int64}:
 4
 6

julia> typemax(Int) + 1 < 0
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L2920-L2947)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:--Tuple{Any, Any}' href='#Base.:--Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.:-</u></b> &mdash; <i>Method</i>.




```julia
-(x, y)
```


Subtraction operator.

**Examples**

```julia
julia> 2 - 3
-1

julia> -(2, 4.5)
-2.5
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L2979-L2992)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:*-Tuple{Any, Vararg{Any}}' href='#Base.:*-Tuple{Any, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.:*</u></b> &mdash; <i>Method</i>.




```julia
*(x, y...)
```


Multiplication operator.

Infix `x*y*z*...` calls this function with all arguments, i.e. `*(x, y, z, ...)`, which by default then calls `(x*y) * z * ...` starting from the left.

Juxtaposition such as `2pi` also calls `*(2, pi)`. Note that this operation has higher precedence than a literal `*`. Note also that juxtaposition &quot;0x...&quot; (integer zero times a variable whose name starts with `x`) is forbidden as it clashes with unsigned integer literals: `0x01 isa UInt8`.

Note that overflow is possible for most integer types, including the default `Int`, when multiplying large numbers.

**Examples**

```julia
julia> 2 * 7 * 8
112

julia> *(2, 7, 8)
112

julia> [2 0; 0 3] * [1, 10]  # matrix * vector
2-element Vector{Int64}:
  2
 30

julia> 1/2pi, 1/2*pi  # juxtaposition has higher precedence
(0.15915494309189535, 1.5707963267948966)

julia> x = [1, 2]; x'x  # adjoint vector * vector
5
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L2995-L3030)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:/' href='#Base.:/'>#</a>&nbsp;<b><u>Base.:/</u></b> &mdash; <i>Function</i>.




```julia
/(x, y)
```


Right division operator: multiplication of `x` by the inverse of `y` on the right.

Gives floating-point results for integer arguments. See [`÷`](/base/math#Base.div) for integer division, or [`//`](/base/math#Base.://) for [`Rational`](/base/numbers#Base.Rational) results.

**Examples**

```julia
julia> 1/2
0.5

julia> 4/2
2.0

julia> 4.5/2
2.25
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L3033-L3052)



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
<a id='Base.:\-Tuple{Any, Any}' href='#Base.:\-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.:\</u></b> &mdash; <i>Method</i>.




```julia
\(x, y)
```


Left division operator: multiplication of `y` by the inverse of `x` on the left. Gives floating-point results for integer arguments.

**Examples**

```julia
julia> 3 \ 6
2.0

julia> inv(3) * 6
2.0

julia> A = [4 3; 2 1]; x = [5, 6];

julia> A \ x
2-element Vector{Float64}:
  6.5
 -7.0

julia> inv(A) * x
2-element Vector{Float64}:
  6.5
 -7.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L643-L669)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:^-Tuple{Number, Number}' href='#Base.:^-Tuple{Number, Number}'>#</a>&nbsp;<b><u>Base.:^</u></b> &mdash; <i>Method</i>.




```julia
^(x, y)
```


Exponentiation operator.

If `x` and `y` are integers, the result may overflow. To enter numbers in scientific notation, use [`Float64`](/base/numbers#Core.Float64) literals such as `1.2e3` rather than `1.2 * 10^3`.

If `y` is an `Int` literal (e.g. `2` in `x^2` or `-3` in `x^-3`), the Julia code `x^y` is transformed by the compiler to `Base.literal_pow(^, x, Val(y))`, to enable compile-time specialization on the value of the exponent. (As a default fallback we have `Base.literal_pow(^, x, Val(y)) = ^(x,y)`, where usually `^ == Base.^` unless `^` has been defined in the calling namespace.) If `y` is a negative integer literal, then `Base.literal_pow` transforms the operation to `inv(x)^-y` by default, where `-y` is positive.

See also [`exp2`](/base/math#Base.exp2), [`<<`](/base/math#Base.:<<).

**Examples**

```julia
julia> 3^5
243

julia> 3^-1  # uses Base.literal_pow
0.3333333333333333

julia> p = -1;

julia> 3^p
ERROR: DomainError with -1:
Cannot raise an integer x to a negative power -1.
[...]

julia> 3.0^p
0.3333333333333333

julia> 10^19 > 0  # integer overflow
false

julia> big(10)^19 == 1e19
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/promotion.jl#L434-L477)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fma' href='#Base.fma'>#</a>&nbsp;<b><u>Base.fma</u></b> &mdash; <i>Function</i>.




```julia
fma(x, y, z)
```


Computes `x*y+z` without rounding the intermediate result `x*y`. On some systems this is significantly more expensive than `x*y+z`. `fma` is used to improve accuracy in certain algorithms. See [`muladd`](/base/math#Base.muladd).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/floatfuncs.jl#L269-L275)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.muladd' href='#Base.muladd'>#</a>&nbsp;<b><u>Base.muladd</u></b> &mdash; <i>Function</i>.




```julia
muladd(x, y, z)
```


Combined multiply-add: computes `x*y+z`, but allowing the add and multiply to be merged with each other or with surrounding operations for performance. For example, this may be implemented as an [`fma`](/base/math#Base.fma) if the hardware supports it efficiently. The result can be different on different machines and can also be different on the same machine due to constant propagation or other optimizations. See [`fma`](/base/math#Base.fma).

**Examples**

```julia
julia> muladd(3, 2, 1)
7

julia> 3 * 2 + 1
7
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L1565-L1584)



```julia
muladd(A, y, z)
```


Combined multiply-add, `A*y .+ z`, for matrix-matrix or matrix-vector multiplication. The result is always the same size as `A*y`, but `z` may be smaller, or a scalar.

::: tip Julia 1.6

These methods require Julia 1.6 or later.

:::

**Examples**

```julia
julia> A=[1.0 2.0; 3.0 4.0]; B=[1.0 1.0; 1.0 1.0]; z=[0, 100];

julia> muladd(A, B, z)
2×2 Matrix{Float64}:
   3.0    3.0
 107.0  107.0
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/LinearAlgebra/src/matmul.jl#L160-L178)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.inv-Tuple{Number}' href='#Base.inv-Tuple{Number}'>#</a>&nbsp;<b><u>Base.inv</u></b> &mdash; <i>Method</i>.




```julia
inv(x)
```


Return the multiplicative inverse of `x`, such that `x*inv(x)` or `inv(x)*x` yields [`one(x)`](/base/numbers#Base.one) (the multiplicative identity) up to roundoff errors.

If `x` is a number, this is essentially the same as `one(x)/x`, but for some types `inv(x)` may be slightly more efficient.

**Examples**

```julia
julia> inv(2)
0.5

julia> inv(1 + 2im)
0.2 - 0.4im

julia> inv(1 + 2im) * (1 + 2im)
1.0 + 0.0im

julia> inv(2//3)
3//2
```


::: tip Julia 1.2

`inv(::Missing)` requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/number.jl#L228-L254)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.div' href='#Base.div'>#</a>&nbsp;<b><u>Base.div</u></b> &mdash; <i>Function</i>.




```julia
div(x, y)
÷(x, y)
```


The quotient from Euclidean (integer) division. Generally equivalent to a mathematical operation x/y without a fractional part.

See also: [`cld`](/base/math#Base.cld), [`fld`](/base/math#Base.fld), [`rem`](/base/math#Base.rem), [`divrem`](/base/math#Base.divrem).

**Examples**

```julia
julia> 9 ÷ 4
2

julia> -5 ÷ 3
-1

julia> 5.0 ÷ 2
2.0

julia> div.(-5:5, 3)'
1×11 adjoint(::Vector{Int64}) with eltype Int64:
 -1  -1  -1  0  0  0  0  0  1  1  1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L821-L845)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.div-Tuple{Any, Any, RoundingMode}' href='#Base.div-Tuple{Any, Any, RoundingMode}'>#</a>&nbsp;<b><u>Base.div</u></b> &mdash; <i>Method</i>.




```julia
div(x, y, r::RoundingMode=RoundToZero)
```


The quotient from Euclidean (integer) division. Computes `x / y`, rounded to an integer according to the rounding mode `r`. In other words, the quantity

```
round(x / y, r)
```


without any intermediate rounding.

::: tip Julia 1.4

The three-argument method taking a `RoundingMode` requires Julia 1.4 or later.

:::

See also [`fld`](/base/math#Base.fld) and [`cld`](/base/math#Base.cld), which are special cases of this function.

::: tip Julia 1.9

`RoundFromZero` requires at least Julia 1.9.

:::

**Examples:**

```julia
julia> div(4, 3, RoundToZero) # Matches div(4, 3)
1
julia> div(4, 3, RoundDown) # Matches fld(4, 3)
1
julia> div(4, 3, RoundUp) # Matches cld(4, 3)
2
julia> div(5, 2, RoundNearest)
2
julia> div(5, 2, RoundNearestTiesAway)
3
julia> div(-5, 2, RoundNearest)
-2
julia> div(-5, 2, RoundNearestTiesAway)
-3
julia> div(-5, 2, RoundNearestTiesUp)
-2
julia> div(4, 3, RoundFromZero)
2
julia> div(-4, 3, RoundFromZero)
-2
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/div.jl#L5-L46)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fld' href='#Base.fld'>#</a>&nbsp;<b><u>Base.fld</u></b> &mdash; <i>Function</i>.




```julia
fld(x, y)
```


Largest integer less than or equal to `x / y`. Equivalent to `div(x, y, RoundDown)`.

See also [`div`](/base/math#Base.div), [`cld`](/base/math#Base.cld), [`fld1`](/base/math#Base.fld1).

**Examples**

```julia
julia> fld(7.3, 5.5)
1.0

julia> fld.(-5:5, 3)'
1×11 adjoint(::Vector{Int64}) with eltype Int64:
 -2  -2  -1  -1  -1  0  0  0  1  1  1
```


Because `fld(x, y)` implements strictly correct floored rounding based on the true value of floating-point numbers, unintuitive situations can arise. For example:

```julia
julia> fld(6.0, 0.1)
59.0
julia> 6.0 / 0.1
60.0
julia> 6.0 / big(0.1)
59.99999999999999666933092612453056361837965690217069245739573412231113406246995
```


What is happening here is that the true value of the floating-point number written as `0.1` is slightly larger than the numerical value 1/10 while `6.0` represents the number 6 precisely. Therefore the true value of `6.0 / 0.1` is slightly less than 60. When doing division, this is rounded to precisely `60.0`, but `fld(6.0, 0.1)` always takes the floor of the true value, so the result is `59.0`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/div.jl#L109-L140)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cld' href='#Base.cld'>#</a>&nbsp;<b><u>Base.cld</u></b> &mdash; <i>Function</i>.




```julia
cld(x, y)
```


Smallest integer larger than or equal to `x / y`. Equivalent to `div(x, y, RoundUp)`.

See also [`div`](/base/math#Base.div), [`fld`](/base/math#Base.fld).

**Examples**

```julia
julia> cld(5.5, 2.2)
3.0

julia> cld.(-5:5, 3)'
1×11 adjoint(::Vector{Int64}) with eltype Int64:
 -1  -1  -1  0  0  0  1  1  1  2  2
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/div.jl#L143-L159)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mod' href='#Base.mod'>#</a>&nbsp;<b><u>Base.mod</u></b> &mdash; <i>Function</i>.




```julia
mod(x::Integer, r::AbstractUnitRange)
```


Find `y` in the range `r` such that $x ≡ y (mod n)$, where `n = length(r)`, i.e. `y = mod(x - first(r), n) + first(r)`.

See also [`mod1`](/base/math#Base.mod1).

**Examples**

```julia
julia> mod(0, Base.OneTo(3))  # mod1(0, 3)
3

julia> mod(3, 0:2)  # mod(3, 3)
0
```


::: tip Julia 1.3

This method requires at least Julia 1.3.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/range.jl#L1482-L1501)



```julia
mod(x, y)
rem(x, y, RoundDown)
```


The reduction of `x` modulo `y`, or equivalently, the remainder of `x` after floored division by `y`, i.e. `x - y*fld(x,y)` if computed without intermediate rounding.

The result will have the same sign as `y`, and magnitude less than `abs(y)` (with some exceptions, see note below).

::: tip Note

When used with floating point values, the exact result may not be representable by the type, and so rounding error may occur. In particular, if the exact result is very close to `y`, then it may be rounded to `y`.

:::

See also: [`rem`](/base/math#Base.rem), [`div`](/base/math#Base.div), [`fld`](/base/math#Base.fld), [`mod1`](/base/math#Base.mod1), [`invmod`](/base/math#Base.invmod).

```julia
julia> mod(8, 3)
2

julia> mod(9, 3)
0

julia> mod(8.9, 3)
2.9000000000000004

julia> mod(eps(), 3)
2.220446049250313e-16

julia> mod(-eps(), 3)
3.0

julia> mod.(-5:5, 3)'
1×11 adjoint(::Vector{Int64}) with eltype Int64:
 1  2  0  1  2  0  1  2  0  1  2
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/int.jl#L246-L284)



```julia
rem(x::Integer, T::Type{<:Integer}) -> T
mod(x::Integer, T::Type{<:Integer}) -> T
%(x::Integer, T::Type{<:Integer}) -> T
```


Find `y::T` such that `x` ≡ `y` (mod n), where n is the number of integers representable in `T`, and `y` is an integer in `[typemin(T),typemax(T)]`. If `T` can represent any integer (e.g. `T == BigInt`), then this operation corresponds to a conversion to `T`.

**Examples**

```julia
julia> x = 129 % Int8
-127

julia> typeof(x)
Int8

julia> x = 129 % BigInt
129

julia> typeof(x)
BigInt
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/int.jl#L595-L619)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rem' href='#Base.rem'>#</a>&nbsp;<b><u>Base.rem</u></b> &mdash; <i>Function</i>.




```julia
rem(x, y)
%(x, y)
```


Remainder from Euclidean division, returning a value of the same sign as `x`, and smaller in magnitude than `y`. This value is always exact.

See also: [`div`](/base/math#Base.div), [`mod`](/base/math#Base.mod), [`mod1`](/base/math#Base.mod1), [`divrem`](/base/math#Base.divrem).

**Examples**

```julia
julia> x = 15; y = 4;

julia> x % y
3

julia> x == div(x, y) * y + rem(x, y)
true

julia> rem.(-5:5, 3)'
1×11 adjoint(::Vector{Int64}) with eltype Int64:
 -2  -1  0  -2  -1  0  1  2  0  1  2
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L794-L817)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rem-Tuple{Any, Any, RoundingMode}' href='#Base.rem-Tuple{Any, Any, RoundingMode}'>#</a>&nbsp;<b><u>Base.rem</u></b> &mdash; <i>Method</i>.




```julia
rem(x, y, r::RoundingMode=RoundToZero)
```


Compute the remainder of `x` after integer division by `y`, with the quotient rounded according to the rounding mode `r`. In other words, the quantity

```
x - y * round(x / y, r)
```


without any intermediate rounding.
- if `r == RoundNearest`, then the result is exact, and in the interval $[-|y| / 2, |y| / 2]$. See also [`RoundNearest`](/base/math#Base.Rounding.RoundNearest).
  
- if `r == RoundToZero` (default), then the result is exact, and in the interval $[0, |y|)$ if `x` is positive, or $(-|y|, 0]$ otherwise. See also [`RoundToZero`](/base/math#Base.Rounding.RoundToZero).
  
- if `r == RoundDown`, then the result is in the interval $[0, y)$ if `y` is positive, or $(y, 0]$ otherwise. The result may not be exact if `x` and `y` have different signs, and `abs(x) < abs(y)`. See also [`RoundDown`](/base/math#Base.Rounding.RoundDown).
  
- if `r == RoundUp`, then the result is in the interval $(-y, 0]$ if `y` is positive, or $[0, -y)$ otherwise. The result may not be exact if `x` and `y` have the same sign, and `abs(x) < abs(y)`. See also [`RoundUp`](/base/math#Base.Rounding.RoundUp).
  
- if `r == RoundFromZero`, then the result is in the interval $(-y, 0]$ if `y` is positive, or $[0, -y)$ otherwise. The result may not be exact if `x` and `y` have the same sign, and `abs(x) < abs(y)`. See also [`RoundFromZero`](/base/math#Base.Rounding.RoundFromZero).
  

::: tip Julia 1.9

`RoundFromZero` requires at least Julia 1.9.

:::

**Examples:**

```julia
julia> x = 9; y = 4;

julia> x % y  # same as rem(x, y)
1

julia> x ÷ y  # same as div(x, y)
2

julia> x == div(x, y) * y + rem(x, y)
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/div.jl#L51-L95)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.rem2pi' href='#Base.Math.rem2pi'>#</a>&nbsp;<b><u>Base.Math.rem2pi</u></b> &mdash; <i>Function</i>.




```julia
rem2pi(x, r::RoundingMode)
```


Compute the remainder of `x` after integer division by `2π`, with the quotient rounded according to the rounding mode `r`. In other words, the quantity

```
x - 2π*round(x/(2π),r)
```


without any intermediate rounding. This internally uses a high precision approximation of 2π, and so will give a more accurate result than `rem(x,2π,r)`
- if `r == RoundNearest`, then the result is in the interval $[-π, π]$. This will generally be the most accurate result. See also [`RoundNearest`](/base/math#Base.Rounding.RoundNearest).
  
- if `r == RoundToZero`, then the result is in the interval $[0, 2π]$ if `x` is positive,. or $[-2π, 0]$ otherwise. See also [`RoundToZero`](/base/math#Base.Rounding.RoundToZero).
  
- if `r == RoundDown`, then the result is in the interval $[0, 2π]$. See also [`RoundDown`](/base/math#Base.Rounding.RoundDown).
  
- if `r == RoundUp`, then the result is in the interval $[-2π, 0]$. See also [`RoundUp`](/base/math#Base.Rounding.RoundUp).
  

**Examples**

```julia
julia> rem2pi(7pi/4, RoundNearest)
-0.7853981633974485

julia> rem2pi(7pi/4, RoundDown)
5.497787143782138
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L1378-L1408)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.mod2pi' href='#Base.Math.mod2pi'>#</a>&nbsp;<b><u>Base.Math.mod2pi</u></b> &mdash; <i>Function</i>.




```julia
mod2pi(x)
```


Modulus after division by `2π`, returning in the range $[0,2π)$.

This function computes a floating point representation of the modulus after division by numerically exact `2π`, and is therefore not exactly the same as `mod(x,2π)`, which would compute the modulus of `x` relative to division by the floating-point number `2π`.

::: tip Note

Depending on the format of the input value, the closest representable value to 2π may be less than 2π. For example, the expression `mod2pi(2π)` will not return `0`, because the intermediate value of `2*π` is a `Float64` and `2*Float64(π) < 2*big(π)`. See [`rem2pi`](/base/math#Base.Math.rem2pi) for more refined control of this behavior.

:::

**Examples**

```julia
julia> mod2pi(9*pi/4)
0.7853981633974481
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L1540-L1560)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.divrem' href='#Base.divrem'>#</a>&nbsp;<b><u>Base.divrem</u></b> &mdash; <i>Function</i>.




```julia
divrem(x, y, r::RoundingMode=RoundToZero)
```


The quotient and remainder from Euclidean division. Equivalent to `(div(x, y, r), rem(x, y, r))`. Equivalently, with the default value of `r`, this call is equivalent to `(x ÷ y, x % y)`.

See also: [`fldmod`](/base/math#Base.fldmod), [`cld`](/base/math#Base.cld).

**Examples**

```julia
julia> divrem(3, 7)
(0, 3)

julia> divrem(7, 3)
(2, 1)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/div.jl#L163-L180)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fldmod' href='#Base.fldmod'>#</a>&nbsp;<b><u>Base.fldmod</u></b> &mdash; <i>Function</i>.




```julia
fldmod(x, y)
```


The floored quotient and modulus after division. A convenience wrapper for `divrem(x, y, RoundDown)`. Equivalent to `(fld(x, y), mod(x, y))`.

See also: [`fld`](/base/math#Base.fld), [`cld`](/base/math#Base.cld), [`fldmod1`](/base/math#Base.fldmod1).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/div.jl#L268-L275)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fld1' href='#Base.fld1'>#</a>&nbsp;<b><u>Base.fld1</u></b> &mdash; <i>Function</i>.




```julia
fld1(x, y)
```


Flooring division, returning a value consistent with `mod1(x,y)`

See also [`mod1`](/base/math#Base.mod1), [`fldmod1`](/base/math#Base.fldmod1).

**Examples**

```julia
julia> x = 15; y = 4;

julia> fld1(x, y)
4

julia> x == fld(x, y) * y + mod(x, y)
true

julia> x == (fld1(x, y) - 1) * y + mod1(x, y)
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L878-L898)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mod1' href='#Base.mod1'>#</a>&nbsp;<b><u>Base.mod1</u></b> &mdash; <i>Function</i>.




```julia
mod1(x, y)
```


Modulus after flooring division, returning a value `r` such that `mod(r, y) == mod(x, y)` in the range $(0, y]$ for positive `y` and in the range $[y,0)$ for negative `y`.

With integer arguments and positive `y`, this is equal to `mod(x, 1:y)`, and hence natural for 1-based indexing. By comparison, `mod(x, y) == mod(x, 0:y-1)` is natural for computations with offsets or strides.

See also [`mod`](/base/math#Base.mod), [`fld1`](/base/math#Base.fld1), [`fldmod1`](/base/math#Base.fldmod1).

**Examples**

```julia
julia> mod1(4, 2)
2

julia> mod1.(-5:5, 3)'
1×11 adjoint(::Vector{Int64}) with eltype Int64:
 1  2  3  1  2  3  1  2  3  1  2

julia> mod1.([-0.1, 0, 0.1, 1, 2, 2.9, 3, 3.1]', 3)
1×8 Matrix{Float64}:
 2.9  3.0  0.1  1.0  2.0  2.9  3.0  0.1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L849-L874)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fldmod1' href='#Base.fldmod1'>#</a>&nbsp;<b><u>Base.fldmod1</u></b> &mdash; <i>Function</i>.




```julia
fldmod1(x, y)
```


Return `(fld1(x,y), mod1(x,y))`.

See also [`fld1`](/base/math#Base.fld1), [`mod1`](/base/math#Base.mod1).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L905-L911)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.://' href='#Base.://'>#</a>&nbsp;<b><u>Base.://</u></b> &mdash; <i>Function</i>.




```julia
//(num, den)
```


Divide two integers or rational numbers, giving a [`Rational`](/base/numbers#Base.Rational) result. More generally, `//` can be used for exact rational division of other numeric types with integer or rational components, such as complex numbers with integer components.

Note that floating-point ([`AbstractFloat`](/base/numbers#Core.AbstractFloat)) arguments are not permitted by `//` (even if the values are rational). The arguments must be subtypes of [`Integer`](/base/numbers#Core.Integer), `Rational`, or composites thereof.

**Examples**

```julia
julia> 3 // 5
3//5

julia> (3 // 5) // (2 // 1)
3//10

julia> (1+2im) // (3+4im)
11//25 + 2//25*im

julia> 1.0 // 2
ERROR: MethodError: no method matching //(::Float64, ::Int64)
[...]
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rational.jl#L57-L83)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rationalize' href='#Base.rationalize'>#</a>&nbsp;<b><u>Base.rationalize</u></b> &mdash; <i>Function</i>.




```julia
rationalize([T<:Integer=Int,] x; tol::Real=eps(x))
```


Approximate floating point number `x` as a [`Rational`](/base/numbers#Base.Rational) number with components of the given integer type. The result will differ from `x` by no more than `tol`.

**Examples**

```julia
julia> rationalize(5.6)
28//5

julia> a = rationalize(BigInt, 10.3)
103//10

julia> typeof(numerator(a))
BigInt
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rational.jl#L188-L205)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.numerator' href='#Base.numerator'>#</a>&nbsp;<b><u>Base.numerator</u></b> &mdash; <i>Function</i>.




```julia
numerator(x)
```


Numerator of the rational representation of `x`.

**Examples**

```julia
julia> numerator(2//3)
2

julia> numerator(4)
4
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rational.jl#L282-L295)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.denominator' href='#Base.denominator'>#</a>&nbsp;<b><u>Base.denominator</u></b> &mdash; <i>Function</i>.




```julia
denominator(x)
```


Denominator of the rational representation of `x`.

**Examples**

```julia
julia> denominator(2//3)
3

julia> denominator(4)
1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rational.jl#L299-L312)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:<<' href='#Base.:<<'>#</a>&nbsp;<b><u>Base.:<<</u></b> &mdash; <i>Function</i>.




```julia
<<(x, n)
```


Left bit shift operator, `x << n`. For `n >= 0`, the result is `x` shifted left by `n` bits, filling with `0`s. This is equivalent to `x * 2^n`. For `n < 0`, this is equivalent to `x >> -n`.

**Examples**

```julia
julia> Int8(3) << 2
12

julia> bitstring(Int8(3))
"00000011"

julia> bitstring(Int8(12))
"00001100"
```


See also [`>>`](/base/math#Base.:>>), [`>>>`](/base/math#Base.:>>>), [`exp2`](/base/math#Base.exp2), [`ldexp`](/base/math#Base.Math.ldexp).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L676-L695)



```julia
<<(B::BitVector, n) -> BitVector
```


Left bit shift operator, `B << n`. For `n >= 0`, the result is `B` with elements shifted `n` positions backwards, filling with `false` values. If `n < 0`, elements are shifted forwards. Equivalent to `B >> -n`.

**Examples**

```julia
julia> B = BitVector([true, false, true, false, false])
5-element BitVector:
 1
 0
 1
 0
 0

julia> B << 1
5-element BitVector:
 0
 1
 0
 0
 0

julia> B << -1
5-element BitVector:
 0
 1
 0
 1
 0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/bitarray.jl#L1378-L1412)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:>>' href='#Base.:>>'>#</a>&nbsp;<b><u>Base.:>></u></b> &mdash; <i>Function</i>.




```julia
>>(x, n)
```


Right bit shift operator, `x >> n`. For `n >= 0`, the result is `x` shifted right by `n` bits, filling with `0`s if `x >= 0`, `1`s if `x < 0`, preserving the sign of `x`. This is equivalent to `fld(x, 2^n)`. For `n < 0`, this is equivalent to `x << -n`.

**Examples**

```julia
julia> Int8(13) >> 2
3

julia> bitstring(Int8(13))
"00001101"

julia> bitstring(Int8(3))
"00000011"

julia> Int8(-14) >> 2
-4

julia> bitstring(Int8(-14))
"11110010"

julia> bitstring(Int8(-4))
"11111100"
```


See also [`>>>`](/base/math#Base.:>>>), [`<<`](/base/math#Base.:<<).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L711-L740)



```julia
>>(B::BitVector, n) -> BitVector
```


Right bit shift operator, `B >> n`. For `n >= 0`, the result is `B` with elements shifted `n` positions forward, filling with `false` values. If `n < 0`, elements are shifted backwards. Equivalent to `B << -n`.

**Examples**

```julia
julia> B = BitVector([true, false, true, false, false])
5-element BitVector:
 1
 0
 1
 0
 0

julia> B >> 1
5-element BitVector:
 0
 1
 0
 1
 0

julia> B >> -1
5-element BitVector:
 0
 1
 0
 0
 0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/bitarray.jl#L1340-L1374)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:>>>' href='#Base.:>>>'>#</a>&nbsp;<b><u>Base.:>>></u></b> &mdash; <i>Function</i>.




```julia
>>>(x, n)
```


Unsigned right bit shift operator, `x >>> n`. For `n >= 0`, the result is `x` shifted right by `n` bits, filling with `0`s. For `n < 0`, this is equivalent to `x << -n`.

For [`Unsigned`](/base/numbers#Core.Unsigned) integer types, this is equivalent to [`>>`](/base/math#Base.:>>). For [`Signed`](/base/numbers#Core.Signed) integer types, this is equivalent to `signed(unsigned(x) >> n)`.

**Examples**

```julia
julia> Int8(-14) >>> 2
60

julia> bitstring(Int8(-14))
"11110010"

julia> bitstring(Int8(60))
"00111100"
```


[`BigInt`](/base/numbers#Base.GMP.BigInt)s are treated as if having infinite size, so no filling is required and this is equivalent to [`>>`](/base/math#Base.:>>).

See also [`>>`](/base/math#Base.:>>), [`<<`](/base/math#Base.:<<).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L752-L778)



```julia
>>>(B::BitVector, n) -> BitVector
```


Unsigned right bitshift operator, `B >>> n`. Equivalent to `B >> n`. See [`>>`](/base/math#Base.:>>) for details and examples.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/bitarray.jl#L1415-L1420)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.bitrotate' href='#Base.bitrotate'>#</a>&nbsp;<b><u>Base.bitrotate</u></b> &mdash; <i>Function</i>.




```julia
bitrotate(x::Base.BitInteger, k::Integer)
```


`bitrotate(x, k)` implements bitwise rotation. It returns the value of `x` with its bits rotated left `k` times. A negative value of `k` will rotate to the right instead.

::: tip Julia 1.5

This function requires Julia 1.5 or later.

:::

See also: [`<<`](/base/math#Base.:<<), [`circshift`](/base/arrays#Base.circshift), [`BitArray`](/base/arrays#Base.BitArray).

```julia
julia> bitrotate(UInt8(114), 2)
0xc9

julia> bitstring(bitrotate(0b01110010, 2))
"11001001"

julia> bitstring(bitrotate(0b01110010, -2))
"10011100"

julia> bitstring(bitrotate(0b01110010, 8))
"01110010"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/int.jl#L561-L586)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.::' href='#Base.::'>#</a>&nbsp;<b><u>Base.::</u></b> &mdash; <i>Function</i>.




```julia
:expr
```


Quote an expression `expr`, returning the abstract syntax tree (AST) of `expr`. The AST may be of type `Expr`, `Symbol`, or a literal value. The syntax `:identifier` evaluates to a `Symbol`.

See also: [`Expr`](/base/base#Core.Expr), [`Symbol`](/base/base#Core.Symbol), [`Meta.parse`](/base/base#Base.Meta.parse-Tuple{AbstractString,%20Int64})

**Examples**

```julia
julia> expr = :(a = b + 2*x)
:(a = b + 2x)

julia> sym = :some_identifier
:some_identifier

julia> value = :0xff
0xff

julia> typeof((expr, sym, value))
Tuple{Expr, Symbol, UInt8}
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L727-L750)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.range' href='#Base.range'>#</a>&nbsp;<b><u>Base.range</u></b> &mdash; <i>Function</i>.




```julia
range(start, stop, length)
range(start, stop; length, step)
range(start; length, stop, step)
range(;start, length, stop, step)
```


Construct a specialized array with evenly spaced elements and optimized storage (an [`AbstractRange`](/base/collections#Base.AbstractRange)) from the arguments. Mathematically a range is uniquely determined by any three of `start`, `step`, `stop` and `length`. Valid invocations of range are:
- Call `range` with any three of `start`, `step`, `stop`, `length`.
  
- Call `range` with two of `start`, `stop`, `length`. In this case `step` will be assumed to be positive one. If both arguments are Integers, a [`UnitRange`](/base/collections#Base.UnitRange) will be returned.
  
- Call `range` with one of `stop` or `length`. `start` and `step` will be assumed to be positive one.
  

To construct a descending range, specify a negative step size, e.g. `range(5, 1; step = -1)` =&gt; [5,4,3,2,1]. Otherwise, a `stop` value less than the `start` value, with the default `step` of `+1`, constructs an empty range. Empty ranges are normalized such that the `stop` is one less than the `start`, e.g. `range(5, 1) == 5:4`.

See Extended Help for additional details on the returned type. See also [`logrange`](/base/math#Base.logrange) for logarithmically spaced points.

**Examples**

```julia
julia> range(1, length=100)
1:100

julia> range(1, stop=100)
1:100

julia> range(1, step=5, length=100)
1:5:496

julia> range(1, step=5, stop=100)
1:5:96

julia> range(1, 10, length=101)
1.0:0.09:10.0

julia> range(1, 100, step=5)
1:5:96

julia> range(stop=10, length=5)
6:10

julia> range(stop=10, step=1, length=5)
6:1:10

julia> range(start=1, step=1, stop=10)
1:1:10

julia> range(; length = 10)
Base.OneTo(10)

julia> range(; stop = 6)
Base.OneTo(6)

julia> range(; stop = 6.5)
1.0:1.0:6.0
```


If `length` is not specified and `stop - start` is not an integer multiple of `step`, a range that ends before `stop` will be produced.

```julia
julia> range(1, 3.5, step=2)
1.0:2.0:3.0
```


Special care is taken to ensure intermediate values are computed rationally. To avoid this induced overhead, see the [`LinRange`](/base/collections#Base.LinRange) constructor.

::: tip Julia 1.1

`stop` as a positional argument requires at least Julia 1.1.

:::

::: tip Julia 1.7

The versions without keyword arguments and `start` as a keyword argument require at least Julia 1.7.

:::

::: tip Julia 1.8

The versions with `stop` as a sole keyword argument, or `length` as a sole keyword argument require at least Julia 1.8.

:::

**Extended Help**

`range` will produce a `Base.OneTo` when the arguments are Integers and
- Only `length` is provided
  
- Only `stop` is provided
  

`range` will produce a `UnitRange` when the arguments are Integers and
- Only `start`  and `stop` are provided
  
- Only `length` and `stop` are provided
  

A `UnitRange` is not produced if `step` is provided even if specified as one.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/range.jl#L61-L152)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.OneTo' href='#Base.OneTo'>#</a>&nbsp;<b><u>Base.OneTo</u></b> &mdash; <i>Type</i>.




```julia
Base.OneTo(n)
```


Define an `AbstractUnitRange` that behaves like `1:n`, with the added distinction that the lower limit is guaranteed (by the type system) to be 1.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/range.jl#L454-L460)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StepRangeLen' href='#Base.StepRangeLen'>#</a>&nbsp;<b><u>Base.StepRangeLen</u></b> &mdash; <i>Type</i>.




```julia
StepRangeLen(         ref::R, step::S, len, [offset=1]) where {  R,S}
StepRangeLen{T,R,S}(  ref::R, step::S, len, [offset=1]) where {T,R,S}
StepRangeLen{T,R,S,L}(ref::R, step::S, len, [offset=1]) where {T,R,S,L}
```


A range `r` where `r[i]` produces values of type `T` (in the first form, `T` is deduced automatically), parameterized by a `ref`erence value, a `step`, and the `len`gth. By default `ref` is the starting value `r[1]`, but alternatively you can supply it as the value of `r[offset]` for some other index `1 <= offset <= len`. The syntax `a:b` or `a:b:c`, where any of `a`, `b`, or `c` are floating-point numbers, creates a `StepRangeLen`.

::: tip Julia 1.7

The 4th type parameter `L` requires at least Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/range.jl#L487-L502)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.logrange' href='#Base.logrange'>#</a>&nbsp;<b><u>Base.logrange</u></b> &mdash; <i>Function</i>.




```julia
logrange(start, stop, length)
logrange(start, stop; length)
```


Construct a specialized array whose elements are spaced logarithmically between the given endpoints. That is, the ratio of successive elements is a constant, calculated from the length.

This is similar to `geomspace` in Python. Unlike `PowerRange` in Mathematica, you specify the number of elements not the ratio. Unlike `logspace` in Python and Matlab, the `start` and `stop` arguments are always the first and last elements of the result, not powers applied to some base.

**Examples**

```julia
julia> logrange(10, 4000, length=3)
3-element Base.LogRange{Float64, Base.TwicePrecision{Float64}}:
 10.0, 200.0, 4000.0

julia> ans[2] ≈ sqrt(10 * 4000)  # middle element is the geometric mean
true

julia> range(10, 40, length=3)[2] ≈ (10 + 40)/2  # arithmetic mean
true

julia> logrange(1f0, 32f0, 11)
11-element Base.LogRange{Float32, Float64}:
 1.0, 1.41421, 2.0, 2.82843, 4.0, 5.65685, 8.0, 11.3137, 16.0, 22.6274, 32.0

julia> logrange(1, 1000, length=4) ≈ 10 .^ (0:3)
true
```


See the [`LogRange`](/base/math#Base.LogRange) type for further details.

See also [`range`](/base/math#Base.range) for linearly spaced points.

::: tip Julia 1.11

This function requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/range.jl#L1506-L1545)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.LogRange' href='#Base.LogRange'>#</a>&nbsp;<b><u>Base.LogRange</u></b> &mdash; <i>Type</i>.




```julia
LogRange{T}(start, stop, len) <: AbstractVector{T}
```


A range whose elements are spaced logarithmically between `start` and `stop`, with spacing controlled by `len`. Returned by [`logrange`](/base/math#Base.logrange).

Like [`LinRange`](/base/collections#Base.LinRange), the first and last elements will be exactly those provided, but intermediate values may have small floating-point errors. These are calculated using the logs of the endpoints, which are stored on construction, often in higher precision than `T`.

**Examples**

```julia
julia> logrange(1, 4, length=5)
5-element Base.LogRange{Float64, Base.TwicePrecision{Float64}}:
 1.0, 1.41421, 2.0, 2.82843, 4.0

julia> Base.LogRange{Float16}(1, 4, 5)
5-element Base.LogRange{Float16, Float64}:
 1.0, 1.414, 2.0, 2.828, 4.0

julia> logrange(1e-310, 1e-300, 11)[1:2:end]
6-element Vector{Float64}:
 1.0e-310
 9.999999999999974e-309
 9.999999999999981e-307
 9.999999999999988e-305
 9.999999999999994e-303
 1.0e-300

julia> prevfloat(1e-308, 5) == ans[2]
true
```


Note that integer eltype `T` is not allowed. Use for instance `round.(Int, xs)`, or explicit powers of some integer base:

```julia
julia> xs = logrange(1, 512, 4)
4-element Base.LogRange{Float64, Base.TwicePrecision{Float64}}:
 1.0, 8.0, 64.0, 512.0

julia> 2 .^ (0:3:9) |> println
[1, 8, 64, 512]
```


::: tip Julia 1.11

This type requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/range.jl#L1550-L1598)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:==' href='#Base.:=='>#</a>&nbsp;<b><u>Base.:==</u></b> &mdash; <i>Function</i>.




```julia
==(x, y)
```


Generic equality operator. Falls back to [`===`](/base/base#Core.:===). Should be implemented for all types with a notion of equality, based on the abstract value that an instance represents. For example, all numeric types are compared by numeric value, ignoring type. Strings are compared as sequences of characters, ignoring encoding. Collections of the same type generally compare their key sets, and if those are `==`, then compare the values for each of those keys, returning true if all such pairs are `==`. Other properties are typically not taken into account (such as the exact type).

This operator follows IEEE semantics for floating-point numbers: `0.0 == -0.0` and `NaN != NaN`.

The result is of type `Bool`, except when one of the operands is [`missing`](/manual/missing#missing), in which case `missing` is returned ([three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic)). Collections generally implement three-valued logic akin to [`all`](/base/collections#Base.all-Tuple{Any}), returning missing if any operands contain missing values and all other pairs are equal. Use [`isequal`](/base/base#Base.isequal) or [`===`](/base/base#Core.:===) to always get a `Bool` result.

**Implementation**

New numeric types should implement this function for two arguments of the new type, and handle comparison to other types via promotion rules where possible.

[`isequal`](/base/base#Base.isequal) falls back to `==`, so new methods of `==` will be used by the [`Dict`](/base/collections#Base.Dict) type to compare keys. If your type will be used as a dictionary key, it should therefore also implement [`hash`](/base/base#Base.hash).

If some type defines `==`, [`isequal`](/base/base#Base.isequal), and [`isless`](/base/base#Base.isless) then it should also implement [`<`](/base/math#Base.:<) to ensure consistency of comparisons.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L84-L115)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:!=' href='#Base.:!='>#</a>&nbsp;<b><u>Base.:!=</u></b> &mdash; <i>Function</i>.




```julia
!=(x, y)
≠(x,y)
```


Not-equals comparison operator. Always gives the opposite answer as [`==`](/base/math#Base.:==).

**Implementation**

New types should generally not implement this, and rely on the fallback definition `!=(x,y) = !(x==y)` instead.

**Examples**

```julia
julia> 3 != 2
true

julia> "foo" ≠ "foo"
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L294-L312)



```julia
!=(x)
```


Create a function that compares its argument to `x` using [`!=`](/base/math#Base.:!=), i.e. a function equivalent to `y -> y != x`. The returned function is of type `Base.Fix2{typeof(!=)}`, which can be used to implement specialized methods.

::: tip Julia 1.2

This functionality requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L1204-L1214)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:!==' href='#Base.:!=='>#</a>&nbsp;<b><u>Base.:!==</u></b> &mdash; <i>Function</i>.




```julia
!==(x, y)
≢(x,y)
```


Always gives the opposite answer as [`===`](/base/base#Core.:===).

**Examples**

```julia
julia> a = [1, 2]; b = [1, 2];

julia> a ≢ b
true

julia> a ≢ a
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L343-L359)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:<' href='#Base.:<'>#</a>&nbsp;<b><u>Base.:<</u></b> &mdash; <i>Function</i>.




```julia
<(x, y)
```


Less-than comparison operator. Falls back to [`isless`](/base/base#Base.isless). Because of the behavior of floating-point NaN values, this operator implements a partial order.

**Implementation**

New types with a canonical partial order should implement this function for two arguments of the new type. Types with a canonical total order should implement [`isless`](/base/base#Base.isless) instead.

See also [`isunordered`](/base/base#Base.isunordered).

**Examples**

```julia
julia> 'a' < 'b'
true

julia> "abc" < "abd"
true

julia> 5 < 3
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L363-L388)



```julia
<(x)
```


Create a function that compares its argument to `x` using [`<`](/base/math#Base.:<), i.e. a function equivalent to `y -> y < x`. The returned function is of type `Base.Fix2{typeof(<)}`, which can be used to implement specialized methods.

::: tip Julia 1.2

This functionality requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L1256-L1266)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:<=' href='#Base.:<='>#</a>&nbsp;<b><u>Base.:<=</u></b> &mdash; <i>Function</i>.




```julia
<=(x, y)
≤(x,y)
```


Less-than-or-equals comparison operator. Falls back to `(x < y) | (x == y)`.

**Examples**

```julia
julia> 'a' <= 'b'
true

julia> 7 ≤ 7 ≤ 9
true

julia> "abc" ≤ "abc"
true

julia> 5 <= 3
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L417-L437)



```julia
<=(x)
```


Create a function that compares its argument to `x` using [`<=`](/base/math#Base.:<=), i.e. a function equivalent to `y -> y <= x`. The returned function is of type `Base.Fix2{typeof(<=)}`, which can be used to implement specialized methods.

::: tip Julia 1.2

This functionality requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L1230-L1240)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:>' href='#Base.:>'>#</a>&nbsp;<b><u>Base.:></u></b> &mdash; <i>Function</i>.




```julia
>(x, y)
```


Greater-than comparison operator. Falls back to `y < x`.

**Implementation**

Generally, new types should implement [`<`](/base/math#Base.:<) instead of this function, and rely on the fallback definition `>(x, y) = y < x`.

**Examples**

```julia
julia> 'a' > 'b'
false

julia> 7 > 3 > 1
true

julia> "abc" > "abd"
false

julia> 5 > 3
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L391-L414)



```julia
>(x)
```


Create a function that compares its argument to `x` using [`>`](/base/math#Base.:>), i.e. a function equivalent to `y -> y > x`. The returned function is of type `Base.Fix2{typeof(>)}`, which can be used to implement specialized methods.

::: tip Julia 1.2

This functionality requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L1243-L1253)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:>=' href='#Base.:>='>#</a>&nbsp;<b><u>Base.:>=</u></b> &mdash; <i>Function</i>.




```julia
>=(x, y)
≥(x,y)
```


Greater-than-or-equals comparison operator. Falls back to `y <= x`.

**Examples**

```julia
julia> 'a' >= 'b'
false

julia> 7 ≥ 7 ≥ 3
true

julia> "abc" ≥ "abc"
true

julia> 5 >= 3
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L441-L461)



```julia
>=(x)
```


Create a function that compares its argument to `x` using [`>=`](/base/math#Base.:>=), i.e. a function equivalent to `y -> y >= x`. The returned function is of type `Base.Fix2{typeof(>=)}`, which can be used to implement specialized methods.

::: tip Julia 1.2

This functionality requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L1217-L1227)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cmp' href='#Base.cmp'>#</a>&nbsp;<b><u>Base.cmp</u></b> &mdash; <i>Function</i>.




```julia
cmp(x,y)
```


Return -1, 0, or 1 depending on whether `x` is less than, equal to, or greater than `y`, respectively. Uses the total order implemented by `isless`.

**Examples**

```julia
julia> cmp(1, 2)
-1

julia> cmp(2, 1)
1

julia> cmp(2+im, 3-im)
ERROR: MethodError: no method matching isless(::Complex{Int64}, ::Complex{Int64})
[...]
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L469-L487)



```julia
cmp(<, x, y)
```


Return -1, 0, or 1 depending on whether `x` is less than, equal to, or greater than `y`, respectively. The first argument specifies a less-than comparison function to use.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L490-L495)



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



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/strings/basic.jl#L279-L311)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:~' href='#Base.:~'>#</a>&nbsp;<b><u>Base.:~</u></b> &mdash; <i>Function</i>.




```julia
~(x)
```


Bitwise not.

See also: [`!`](/base/math#Base.:!), [`&`](/base/math#Base.:&), [`|`](/base/math#Base.:|).

**Examples**

```julia
julia> ~4
-5

julia> ~10
-11

julia> ~true
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/int.jl#L302-L320)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:&' href='#Base.:&'>#</a>&nbsp;<b><u>Base.:&</u></b> &mdash; <i>Function</i>.




```julia
x & y
```


Bitwise and. Implements [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic), returning [`missing`](/manual/missing#missing) if one operand is `missing` and the other is `true`. Add parentheses for function application form: `(&)(x, y)`.

See also: [`|`](/base/math#Base.:|), [`xor`](/base/math#Base.xor), [`&&`](/base/math#&&).

**Examples**

```julia
julia> 4 & 10
0

julia> 4 & 12
4

julia> true & missing
missing

julia> false & missing
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/int.jl#L323-L346)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:|' href='#Base.:|'>#</a>&nbsp;<b><u>Base.:|</u></b> &mdash; <i>Function</i>.




```julia
x | y
```


Bitwise or. Implements [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic), returning [`missing`](/manual/missing#missing) if one operand is `missing` and the other is `false`.

See also: [`&`](/base/math#Base.:&), [`xor`](/base/math#Base.xor), [`||`](/base/math#||).

**Examples**

```julia
julia> 4 | 10
14

julia> 4 | 1
5

julia> true | missing
true

julia> false | missing
missing
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/int.jl#L349-L371)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.xor' href='#Base.xor'>#</a>&nbsp;<b><u>Base.xor</u></b> &mdash; <i>Function</i>.




```julia
xor(x, y)
⊻(x, y)
```


Bitwise exclusive or of `x` and `y`. Implements [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic), returning [`missing`](/manual/missing#missing) if one of the arguments is `missing`.

The infix operation `a ⊻ b` is a synonym for `xor(a,b)`, and `⊻` can be typed by tab-completing `\xor` or `\veebar` in the Julia REPL.

**Examples**

```julia
julia> xor(true, false)
true

julia> xor(true, true)
false

julia> xor(true, missing)
missing

julia> false ⊻ false
false

julia> [true; true; false] .⊻ [true; false; false]
3-element BitVector:
 0
 1
 0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/bool.jl#L41-L72)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nand' href='#Base.nand'>#</a>&nbsp;<b><u>Base.nand</u></b> &mdash; <i>Function</i>.




```julia
nand(x, y)
⊼(x, y)
```


Bitwise nand (not and) of `x` and `y`. Implements [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic), returning [`missing`](/manual/missing#missing) if one of the arguments is `missing`.

The infix operation `a ⊼ b` is a synonym for `nand(a,b)`, and `⊼` can be typed by tab-completing `\nand` or `\barwedge` in the Julia REPL.

**Examples**

```julia
julia> nand(true, false)
true

julia> nand(true, true)
false

julia> nand(true, missing)
missing

julia> false ⊼ false
true

julia> [true; true; false] .⊼ [true; false; false]
3-element BitVector:
 0
 1
 1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/bool.jl#L75-L106)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nor' href='#Base.nor'>#</a>&nbsp;<b><u>Base.nor</u></b> &mdash; <i>Function</i>.




```julia
nor(x, y)
⊽(x, y)
```


Bitwise nor (not or) of `x` and `y`. Implements [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic), returning [`missing`](/manual/missing#missing) if one of the arguments is `missing` and the other is not `true`.

The infix operation `a ⊽ b` is a synonym for `nor(a,b)`, and `⊽` can be typed by tab-completing `\nor` or `\barvee` in the Julia REPL.

**Examples**

```julia
julia> nor(true, false)
false

julia> nor(true, true)
false

julia> nor(true, missing)
false

julia> false ⊽ false
true

julia> false ⊽ missing
missing

julia> [true; true; false] .⊽ [true; false; false]
3-element BitVector:
 0
 0
 1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/bool.jl#L109-L144)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:!' href='#Base.:!'>#</a>&nbsp;<b><u>Base.:!</u></b> &mdash; <i>Function</i>.




```julia
!(x)
```


Boolean not. Implements [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic), returning [`missing`](/manual/missing#missing) if `x` is `missing`.

See also [`~`](/base/math#Base.:~) for bitwise not.

**Examples**

```julia
julia> !true
false

julia> !false
true

julia> !missing
missing

julia> .![true false true]
1×3 BitMatrix:
 0  1  0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/bool.jl#L11-L34)



```julia
!f::Function
```


Predicate function negation: when the argument of `!` is a function, it returns a composed function which computes the boolean negation of `f`.

See also [`∘`](/base/base#Base.:∘).

**Examples**

```julia
julia> str = "∀ ε > 0, ∃ δ > 0: |x-y| < δ ⇒ |f(x)-f(y)| < ε"
"∀ ε > 0, ∃ δ > 0: |x-y| < δ ⇒ |f(x)-f(y)| < ε"

julia> filter(isletter, str)
"εδxyδfxfyε"

julia> filter(!isletter, str)
"∀  > 0, ∃  > 0: |-| <  ⇒ |()-()| < "
```


::: tip Julia 1.9

Starting with Julia 1.9, `!f` returns a [`ComposedFunction`](/base/base#Base.ComposedFunction) instead of an anonymous function.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L1121-L1142)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='&&' href='#&&'>#</a>&nbsp;<b><u>&&</u></b> &mdash; <i>Keyword</i>.




```julia
x && y
```


Short-circuiting boolean AND.

See also [`&`](/base/math#Base.:&), the ternary operator `? :`, and the manual section on [control flow](/manual/control-flow#man-conditional-evaluation).

**Examples**

```julia
julia> x = 3;

julia> x > 1 && x < 10 && x isa Int
true

julia> x < 0 && error("expected positive x")
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L1258-L1275)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='||' href='#||'>#</a>&nbsp;<b><u>||</u></b> &mdash; <i>Keyword</i>.




```julia
x || y
```


Short-circuiting boolean OR.

See also: [`|`](/base/math#Base.:|), [`xor`](/base/math#Base.xor), [`&&`](/base/math#&&).

**Examples**

```julia
julia> pi < 3 || ℯ < 3
true

julia> false || true || println("neither is true!")
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/docs/basedocs.jl#L1278-L1293)

</div>
<br>

## Mathematical Functions {#Mathematical-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isapprox' href='#Base.isapprox'>#</a>&nbsp;<b><u>Base.isapprox</u></b> &mdash; <i>Function</i>.




```julia
isapprox(x, y; atol::Real=0, rtol::Real=atol>0 ? 0 : √eps, nans::Bool=false[, norm::Function])
```


Inexact equality comparison. Two numbers compare equal if their relative distance _or_ their absolute distance is within tolerance bounds: `isapprox` returns `true` if `norm(x-y) <= max(atol, rtol*max(norm(x), norm(y)))`. The default `atol` (absolute tolerance) is zero and the default `rtol` (relative tolerance) depends on the types of `x` and `y`. The keyword argument `nans` determines whether or not NaN values are considered equal (defaults to false).

For real or complex floating-point values, if an `atol > 0` is not specified, `rtol` defaults to the square root of [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}) of the type of `x` or `y`, whichever is bigger (least precise). This corresponds to requiring equality of about half of the significant digits. Otherwise, e.g. for integer arguments or if an `atol > 0` is supplied, `rtol` defaults to zero.

The `norm` keyword defaults to `abs` for numeric `(x,y)` and to `LinearAlgebra.norm` for arrays (where an alternative `norm` choice is sometimes useful). When `x` and `y` are arrays, if `norm(x-y)` is not finite (i.e. `±Inf` or `NaN`), the comparison falls back to checking whether all elements of `x` and `y` are approximately equal component-wise.

The binary operator `≈` is equivalent to `isapprox` with the default arguments, and `x ≉ y` is equivalent to `!isapprox(x,y)`.

Note that `x ≈ 0` (i.e., comparing to zero with the default tolerances) is equivalent to `x == 0` since the default `atol` is `0`.  In such cases, you should either supply an appropriate `atol` (or use `norm(x) ≤ atol`) or rearrange your code (e.g. use `x ≈ y` rather than `x - y ≈ 0`).   It is not possible to pick a nonzero `atol` automatically because it depends on the overall scaling (the &quot;units&quot;) of your problem: for example, in `x - y ≈ 0`, `atol=1e-9` is an absurdly small tolerance if `x` is the [radius of the Earth](https://en.wikipedia.org/wiki/Earth_radius) in meters, but an absurdly large tolerance if `x` is the [radius of a Hydrogen atom](https://en.wikipedia.org/wiki/Bohr_radius) in meters.

::: tip Julia 1.6

Passing the `norm` keyword argument when comparing numeric (non-array) arguments requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> isapprox(0.1, 0.15; atol=0.05)
true

julia> isapprox(0.1, 0.15; rtol=0.34)
true

julia> isapprox(0.1, 0.15; rtol=0.33)
false

julia> 0.1 + 1e-10 ≈ 0.1
true

julia> 1e-10 ≈ 0
false

julia> isapprox(1e-10, 0, atol=1e-8)
true

julia> isapprox([10.0^9, 1.0], [10.0^9, 2.0]) # using `norm`
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/floatfuncs.jl#L159-L219)



```julia
isapprox(x; kwargs...) / ≈(x; kwargs...)
```


Create a function that compares its argument to `x` using `≈`, i.e. a function equivalent to `y -> y ≈ x`.

The keyword arguments supported here are the same as those in the 2-argument `isapprox`.

::: tip Julia 1.5

This method requires Julia 1.5 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/floatfuncs.jl#L239-L248)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sin-Tuple{Number}' href='#Base.sin-Tuple{Number}'>#</a>&nbsp;<b><u>Base.sin</u></b> &mdash; <i>Method</i>.




```julia
sin(x::T) where {T <: Number} -> float(T)
```


Compute sine of `x`, where `x` is in radians.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

See also [`sind`](/base/math#Base.Math.sind), [`sinpi`](/base/math#Base.Math.sinpi), [`sincos`](/base/math#Base.Math.sincos-Tuple{Float64}), [`cis`](/base/math#Base.cis), [`asin`](/base/math#Base.asin-Tuple{Number}).

**Examples**

```julia
julia> round.(sin.(range(0, 2pi, length=9)'), digits=3)
1×9 Matrix{Float64}:
 0.0  0.707  1.0  0.707  0.0  -0.707  -1.0  -0.707  -0.0

julia> sind(45)
0.7071067811865476

julia> sinpi(1/4)
0.7071067811865475

julia> round.(sincos(pi/6), digits=3)
(0.5, 0.866)

julia> round(cis(pi/6), digits=3)
0.866 + 0.5im

julia> round(exp(im*pi/6), digits=3)
0.866 + 0.5im
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L499-L529)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cos-Tuple{Number}' href='#Base.cos-Tuple{Number}'>#</a>&nbsp;<b><u>Base.cos</u></b> &mdash; <i>Method</i>.




```julia
cos(x::T) where {T <: Number} -> float(T)
```


Compute cosine of `x`, where `x` is in radians.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

See also [`cosd`](/base/math#Base.Math.cosd), [`cospi`](/base/math#Base.Math.cospi), [`sincos`](/base/math#Base.Math.sincos-Tuple{Float64}), [`cis`](/base/math#Base.cis).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L532-L540)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sincos-Tuple{Float64}' href='#Base.Math.sincos-Tuple{Float64}'>#</a>&nbsp;<b><u>Base.Math.sincos</u></b> &mdash; <i>Method</i>.




```julia
sincos(x::T) where T -> float(T)
```


Simultaneously compute the sine and cosine of `x`, where `x` is in radians, returning a tuple `(sine, cosine)`.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `(T(NaN), T(NaN))` if `isnan(x)`.

See also [`cis`](/base/math#Base.cis), [`sincospi`](/base/math#Base.Math.sincospi), [`sincosd`](/base/math#Base.Math.sincosd).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L167-L176)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.tan-Tuple{Number}' href='#Base.tan-Tuple{Number}'>#</a>&nbsp;<b><u>Base.tan</u></b> &mdash; <i>Method</i>.




```julia
tan(x::T) where {T <: Number} -> float(T)
```


Compute tangent of `x`, where `x` is in radians.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

See also [`tanh`](/base/math#Base.tanh-Tuple{Number}).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L543-L551)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sind' href='#Base.Math.sind'>#</a>&nbsp;<b><u>Base.Math.sind</u></b> &mdash; <i>Function</i>.




```julia
sind(x::T) where T -> float(T)
```


Compute sine of `x`, where `x` is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1288-L1298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cosd' href='#Base.Math.cosd'>#</a>&nbsp;<b><u>Base.Math.cosd</u></b> &mdash; <i>Function</i>.




```julia
cosd(x::T) where T -> float(T)
```


Compute cosine of `x`, where `x` is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1288-L1298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.tand' href='#Base.Math.tand'>#</a>&nbsp;<b><u>Base.Math.tand</u></b> &mdash; <i>Function</i>.




```julia
tand(x::T) where T -> float(T)
```


Compute tangent of `x`, where `x` is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1288-L1298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sincosd' href='#Base.Math.sincosd'>#</a>&nbsp;<b><u>Base.Math.sincosd</u></b> &mdash; <i>Function</i>.




```julia
sincosd(x::T) where T -> float(T)
```


Simultaneously compute the sine and cosine of `x`, where `x` is in degrees.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `(T(NaN), T(NaN))` tuple if `isnan(x)`.

::: tip Julia 1.3

This function requires at least Julia 1.3.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1268-L1277)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sinpi' href='#Base.Math.sinpi'>#</a>&nbsp;<b><u>Base.Math.sinpi</u></b> &mdash; <i>Function</i>.




```julia
sinpi(x::T) where T -> float(T)
```


Compute $\sin(\pi x)$ more accurately than `sin(pi*x)`, especially for large `x`.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

See also [`sind`](/base/math#Base.Math.sind), [`cospi`](/base/math#Base.Math.cospi), [`sincospi`](/base/math#Base.Math.sincospi).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L787-L795)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cospi' href='#Base.Math.cospi'>#</a>&nbsp;<b><u>Base.Math.cospi</u></b> &mdash; <i>Function</i>.




```julia
cospi(x::T) where T -> float(T)
```


Compute $\cos(\pi x)$ more accurately than `cos(pi*x)`, especially for large `x`.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.

See also: [`cispi`](/base/math#Base.cispi), [`sincosd`](/base/math#Base.Math.sincosd), [`cospi`](/base/math#Base.Math.cospi).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L820-L828)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sincospi' href='#Base.Math.sincospi'>#</a>&nbsp;<b><u>Base.Math.sincospi</u></b> &mdash; <i>Function</i>.




```julia
sincospi(x::T) where T -> float(T)
```


Simultaneously compute [`sinpi(x)`](/base/math#Base.Math.sinpi) and [`cospi(x)`](/base/math#Base.Math.cospi) (the sine and cosine of `π*x`, where `x` is in radians), returning a tuple `(sine, cosine)`.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `(T(NaN), T(NaN))` tuple if `isnan(x)`.

::: tip Julia 1.6

This function requires Julia 1.6 or later.

:::

See also: [`cispi`](/base/math#Base.cispi), [`sincosd`](/base/math#Base.Math.sincosd), [`sinpi`](/base/math#Base.Math.sinpi).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L852-L864)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sinh-Tuple{Number}' href='#Base.sinh-Tuple{Number}'>#</a>&nbsp;<b><u>Base.sinh</u></b> &mdash; <i>Method</i>.




```julia
sinh(x)
```


Compute hyperbolic sine of `x`.

See also [`sin`](/base/math#Base.sin-Tuple{Number}).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L407-L413)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cosh-Tuple{Number}' href='#Base.cosh-Tuple{Number}'>#</a>&nbsp;<b><u>Base.cosh</u></b> &mdash; <i>Method</i>.




```julia
cosh(x)
```


Compute hyperbolic cosine of `x`.

See also [`cos`](/base/math#Base.cos-Tuple{Number}).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L416-L422)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.tanh-Tuple{Number}' href='#Base.tanh-Tuple{Number}'>#</a>&nbsp;<b><u>Base.tanh</u></b> &mdash; <i>Method</i>.




```julia
tanh(x)
```


Compute hyperbolic tangent of `x`.

See also [`tan`](/base/math#Base.tan-Tuple{Number}), [`atanh`](/base/math#Base.atanh-Tuple{Number}).

**Examples**

```julia
julia> tanh.(-3:3f0)  # Here 3f0 isa Float32
7-element Vector{Float32}:
 -0.9950548
 -0.9640276
 -0.7615942
  0.0
  0.7615942
  0.9640276
  0.9950548

julia> tan.(im .* (1:3))
3-element Vector{ComplexF64}:
 0.0 + 0.7615941559557649im
 0.0 + 0.9640275800758169im
 0.0 + 0.9950547536867306im
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L425-L451)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.asin-Tuple{Number}' href='#Base.asin-Tuple{Number}'>#</a>&nbsp;<b><u>Base.asin</u></b> &mdash; <i>Method</i>.




```julia
asin(x::T) where {T <: Number} -> float(T)
```


Compute the inverse sine of `x`, where the output is in radians.

Return a `T(NaN)` if `isnan(x)`.

See also [`asind`](/base/math#Base.Math.asind) for output in degrees.

**Examples**

```julia
julia> asin.((0, 1/2, 1))
(0.0, 0.5235987755982989, 1.5707963267948966)

julia> asind.((0, 1/2, 1))
(0.0, 30.000000000000004, 90.0)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L554-L571)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.acos-Tuple{Number}' href='#Base.acos-Tuple{Number}'>#</a>&nbsp;<b><u>Base.acos</u></b> &mdash; <i>Method</i>.




```julia
acos(x::T) where {T <: Number} -> float(T)
```


Compute the inverse cosine of `x`, where the output is in radians

Return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L574-L580)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.atan-Tuple{Number}' href='#Base.atan-Tuple{Number}'>#</a>&nbsp;<b><u>Base.atan</u></b> &mdash; <i>Method</i>.




```julia
atan(y)
atan(y, x)
```


Compute the inverse tangent of `y` or `y/x`, respectively.

For one real argument, this is the angle in radians between the positive _x_-axis and the point (1, _y_), returning a value in the interval $[-\pi/2, \pi/2]$.

For two arguments, this is the angle in radians between the positive _x_-axis and the point (_x_, _y_), returning a value in the interval $[-\pi, \pi]$. This corresponds to a standard [`atan2`](https://en.wikipedia.org/wiki/Atan2) function. Note that by convention `atan(0.0,x)` is defined as $\pi$ and `atan(-0.0,x)` is defined as $-\pi$ when `x < 0`.

See also [`atand`](/base/math#Base.Math.atand) for degrees.

**Examples**

```julia
julia> rad2deg(atan(-1/√3))
-30.000000000000004

julia> rad2deg(atan(-1, √3))
-30.000000000000004

julia> rad2deg(atan(1, -√3))
150.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L454-L482)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.asind' href='#Base.Math.asind'>#</a>&nbsp;<b><u>Base.Math.asind</u></b> &mdash; <i>Function</i>.




```julia
asind(x)
```


Compute the inverse sine of `x`, where the output is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1309-L1317)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acosd' href='#Base.Math.acosd'>#</a>&nbsp;<b><u>Base.Math.acosd</u></b> &mdash; <i>Function</i>.




```julia
acosd(x)
```


Compute the inverse cosine of `x`, where the output is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1309-L1317)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.atand' href='#Base.Math.atand'>#</a>&nbsp;<b><u>Base.Math.atand</u></b> &mdash; <i>Function</i>.




```julia
atand(y::T) where T -> float(T)
atand(y::T, x::S) where {T,S} -> promote_type(T,S)
atand(y::AbstractMatrix{T}) where T -> AbstractMatrix{Complex{float(T)}}
```


Compute the inverse tangent of `y` or `y/x`, respectively, where the output is in degrees.

Return a `NaN` if `isnan(y)` or `isnan(x)`. The returned `NaN` is either a `T` in the single argument version, or a `promote_type(T,S)` in the two argument version.

::: tip Julia 1.7

The one-argument method supports square matrix arguments as of Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1322-L1334)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sec-Tuple{Number}' href='#Base.Math.sec-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.sec</u></b> &mdash; <i>Method</i>.




```julia
sec(x::T) where {T <: Number} -> float(T)
```


Compute the secant of `x`, where `x` is in radians.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1147-L1153)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.csc-Tuple{Number}' href='#Base.Math.csc-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.csc</u></b> &mdash; <i>Method</i>.




```julia
csc(x::T) where {T <: Number} -> float(T)
```


Compute the cosecant of `x`, where `x` is in radians.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1147-L1153)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cot-Tuple{Number}' href='#Base.Math.cot-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.cot</u></b> &mdash; <i>Method</i>.




```julia
cot(x::T) where {T <: Number} -> float(T)
```


Compute the cotangent of `x`, where `x` is in radians.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1147-L1153)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.secd' href='#Base.Math.secd'>#</a>&nbsp;<b><u>Base.Math.secd</u></b> &mdash; <i>Function</i>.




```julia
secd(x::T) where {T <: Number} -> float(T)
```


Compute the secant of `x`, where `x` is in degrees.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1161-L1167)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cscd' href='#Base.Math.cscd'>#</a>&nbsp;<b><u>Base.Math.cscd</u></b> &mdash; <i>Function</i>.




```julia
cscd(x::T) where {T <: Number} -> float(T)
```


Compute the cosecant of `x`, where `x` is in degrees.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1161-L1167)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cotd' href='#Base.Math.cotd'>#</a>&nbsp;<b><u>Base.Math.cotd</u></b> &mdash; <i>Function</i>.




```julia
cotd(x::T) where {T <: Number} -> float(T)
```


Compute the cotangent of `x`, where `x` is in degrees.

Throw a [`DomainError`](/base/base#Core.DomainError) if `isinf(x)`, return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1161-L1167)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.asec-Tuple{Number}' href='#Base.Math.asec-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.asec</u></b> &mdash; <i>Method</i>.




```julia
asec(x::T) where {T <: Number} -> float(T)
```


Compute the inverse secant of `x`, where the output is in radians.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1177-L1181)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acsc-Tuple{Number}' href='#Base.Math.acsc-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.acsc</u></b> &mdash; <i>Method</i>.




```julia
acsc(x::T) where {T <: Number} -> float(T)
```


Compute the inverse cosecant of `x`, where the output is in radians.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1177-L1181)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acot-Tuple{Number}' href='#Base.Math.acot-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.acot</u></b> &mdash; <i>Method</i>.




```julia
acot(x::T) where {T <: Number} -> float(T)
```


Compute the inverse cotangent of `x`, where the output is in radians.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1177-L1181)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.asecd' href='#Base.Math.asecd'>#</a>&nbsp;<b><u>Base.Math.asecd</u></b> &mdash; <i>Function</i>.




```julia
asecd(x)
```


Compute the inverse secant of `x`, where the output is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1309-L1317)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acscd' href='#Base.Math.acscd'>#</a>&nbsp;<b><u>Base.Math.acscd</u></b> &mdash; <i>Function</i>.




```julia
acscd(x)
```


Compute the inverse cosecant of `x`, where the output is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1309-L1317)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acotd' href='#Base.Math.acotd'>#</a>&nbsp;<b><u>Base.Math.acotd</u></b> &mdash; <i>Function</i>.




```julia
acotd(x)
```


Compute the inverse cotangent of `x`, where the output is in degrees. If `x` is a matrix, `x` needs to be a square matrix.

::: tip Julia 1.7

Matrix arguments require Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1309-L1317)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sech-Tuple{Number}' href='#Base.Math.sech-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.sech</u></b> &mdash; <i>Method</i>.




```julia
sech(x::T) where {T <: Number} -> float(T)
```


Compute the hyperbolic secant of `x`.

Return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1154-L1160)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.csch-Tuple{Number}' href='#Base.Math.csch-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.csch</u></b> &mdash; <i>Method</i>.




```julia
csch(x::T) where {T <: Number} -> float(T)
```


Compute the hyperbolic cosecant of `x`.

Return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1154-L1160)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.coth-Tuple{Number}' href='#Base.Math.coth-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.coth</u></b> &mdash; <i>Method</i>.




```julia
coth(x::T) where {T <: Number} -> float(T)
```


Compute the hyperbolic cotangent of `x`.

Return a `T(NaN)` if `isnan(x)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1154-L1160)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.asinh-Tuple{Number}' href='#Base.asinh-Tuple{Number}'>#</a>&nbsp;<b><u>Base.asinh</u></b> &mdash; <i>Method</i>.




```julia
asinh(x)
```


Compute the inverse hyperbolic sine of `x`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L485-L489)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.acosh-Tuple{Number}' href='#Base.acosh-Tuple{Number}'>#</a>&nbsp;<b><u>Base.acosh</u></b> &mdash; <i>Method</i>.




```julia
acosh(x)
```


Compute the inverse hyperbolic cosine of `x`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L583-L587)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.atanh-Tuple{Number}' href='#Base.atanh-Tuple{Number}'>#</a>&nbsp;<b><u>Base.atanh</u></b> &mdash; <i>Method</i>.




```julia
atanh(x)
```


Compute the inverse hyperbolic tangent of `x`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L590-L594)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.asech-Tuple{Number}' href='#Base.Math.asech-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.asech</u></b> &mdash; <i>Method</i>.




```julia
asech(x::T) where {T <: Number} -> float(T)
```


Compute the inverse hyperbolic secant of `x`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1182-L1186)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acsch-Tuple{Number}' href='#Base.Math.acsch-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.acsch</u></b> &mdash; <i>Method</i>.




```julia
acsch(x::T) where {T <: Number} -> float(T)
```


Compute the inverse hyperbolic cosecant of `x`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1182-L1186)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.acoth-Tuple{Number}' href='#Base.Math.acoth-Tuple{Number}'>#</a>&nbsp;<b><u>Base.Math.acoth</u></b> &mdash; <i>Method</i>.




```julia
acoth(x::T) where {T <: Number} -> float(T)
```


Compute the inverse hyperbolic cotangent of `x`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1182-L1186)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.sinc' href='#Base.Math.sinc'>#</a>&nbsp;<b><u>Base.Math.sinc</u></b> &mdash; <i>Function</i>.




```julia
sinc(x::T) where {T <: Number} -> float(T)
```


Compute normalized sinc function $\operatorname{sinc}(x) = \sin(\pi x) / (\pi x)$ if $x \neq 0$, and $1$ if $x = 0$.

Return a `T(NaN)` if `isnan(x)`.

See also [`cosc`](/base/math#Base.Math.cosc), its derivative.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1077-L1085)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cosc' href='#Base.Math.cosc'>#</a>&nbsp;<b><u>Base.Math.cosc</u></b> &mdash; <i>Function</i>.




```julia
cosc(x::T) where {T <: Number} -> float(T)
```


Compute $\cos(\pi x) / x - \sin(\pi x) / (\pi x^2)$ if $x \neq 0$, and $0$ if $x = 0$. This is the derivative of `sinc(x)`.

Return a `T(NaN)` if `isnan(x)`.

See also [`sinc`](/base/math#Base.Math.sinc).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/trig.jl#L1096-L1105)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.deg2rad' href='#Base.Math.deg2rad'>#</a>&nbsp;<b><u>Base.Math.deg2rad</u></b> &mdash; <i>Function</i>.




```julia
deg2rad(x)
```


Convert `x` from degrees to radians.

See also [`rad2deg`](/base/math#Base.Math.rad2deg), [`sind`](/base/math#Base.Math.sind), [`pi`](/base/numbers#Base.MathConstants.pi).

**Examples**

```julia
julia> deg2rad(90)
1.5707963267948966
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L338-L350)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.rad2deg' href='#Base.Math.rad2deg'>#</a>&nbsp;<b><u>Base.Math.rad2deg</u></b> &mdash; <i>Function</i>.




```julia
rad2deg(x)
```


Convert `x` from radians to degrees.

See also [`deg2rad`](/base/math#Base.Math.deg2rad).

**Examples**

```julia
julia> rad2deg(pi)
180.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L323-L335)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.hypot' href='#Base.Math.hypot'>#</a>&nbsp;<b><u>Base.Math.hypot</u></b> &mdash; <i>Function</i>.




```julia
hypot(x, y)
```


Compute the hypotenuse $\sqrt{|x|^2+|y|^2}$ avoiding overflow and underflow.

This code is an implementation of the algorithm described in: An Improved Algorithm for `hypot(a,b)` by Carlos F. Borges The article is available online at arXiv at the link   https://arxiv.org/abs/1904.09481

```
hypot(x...)
```


Compute the hypotenuse $\sqrt{\sum |x_i|^2}$ avoiding overflow and underflow.

See also `norm` in the [`LinearAlgebra`](/stdlib/LinearAlgebra#man-linalg) standard library.

**Examples**

```julia
julia> a = Int64(10)^10;

julia> hypot(a, a)
1.4142135623730951e10

julia> √(a^2 + a^2) # a^2 overflows
ERROR: DomainError with -2.914184810805068e18:
sqrt was called with a negative real argument but will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]

julia> hypot(3, 4im)
5.0

julia> hypot(-5.7)
5.7

julia> hypot(3, 4im, 12.0)
13.0

julia> using LinearAlgebra

julia> norm([a, a, a, a]) == hypot(a, a, a, a)
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L774-L818)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.log-Tuple{Number}' href='#Base.log-Tuple{Number}'>#</a>&nbsp;<b><u>Base.log</u></b> &mdash; <i>Method</i>.




```julia
log(x)
```


Compute the natural logarithm of `x`.

Throw a [`DomainError`](/base/base#Core.DomainError) for negative [`Real`](/base/numbers#Core.Real) arguments. Use [`Complex`](/base/numbers#Base.Complex) arguments to obtain [`Complex`](/base/numbers#Base.Complex) results.

::: tip Branch cut

`log` has a branch cut along the negative real axis; `-0.0im` is taken to be below the axis.

:::

See also [`ℯ`](/base/numbers#Base.MathConstants.ℯ), [`log1p`](/base/math#Base.log1p), [`log2`](/base/math#Base.log2), [`log10`](/base/math#Base.log10).

**Examples**

```julia
julia> log(2)
0.6931471805599453

julia> log(-3)
ERROR: DomainError with -3.0:
log was called with a negative real argument but will only return a complex result if called with a complex argument. Try log(Complex(x)).
Stacktrace:
 [1] throw_complex_domainerror(::Symbol, ::Float64) at ./math.jl:31
[...]

julia> log(-3 + 0im)
1.0986122886681098 + 3.141592653589793im

julia> log(-3 - 0.0im)
1.0986122886681098 - 3.141592653589793im

julia> log.(exp.(-1:1))
3-element Vector{Float64}:
 -1.0
  0.0
  1.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L597-L635)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.log-Tuple{Number, Number}' href='#Base.log-Tuple{Number, Number}'>#</a>&nbsp;<b><u>Base.log</u></b> &mdash; <i>Method</i>.




```julia
log(b,x)
```


Compute the base `b` logarithm of `x`. Throw a [`DomainError`](/base/base#Core.DomainError) for negative [`Real`](/base/numbers#Core.Real) arguments.

**Examples**

```julia
julia> log(4,8)
1.5

julia> log(4,2)
0.5

julia> log(-2, 3)
ERROR: DomainError with -2.0:
log was called with a negative real argument but will only return a complex result if called with a complex argument. Try log(Complex(x)).
Stacktrace:
 [1] throw_complex_domainerror(::Symbol, ::Float64) at ./math.jl:31
[...]

julia> log(2, -3)
ERROR: DomainError with -3.0:
log was called with a negative real argument but will only return a complex result if called with a complex argument. Try log(Complex(x)).
Stacktrace:
 [1] throw_complex_domainerror(::Symbol, ::Float64) at ./math.jl:31
[...]
```


::: tip Note

If `b` is a power of 2 or 10, [`log2`](/base/math#Base.log2) or [`log10`](/base/math#Base.log10) should be used, as these will typically be faster and more accurate. For example,

```julia
julia> log(100,1000000)
2.9999999999999996

julia> log10(1000000)/2
3.0
```


:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L359-L399)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.log2' href='#Base.log2'>#</a>&nbsp;<b><u>Base.log2</u></b> &mdash; <i>Function</i>.




```julia
log2(x)
```


Compute the logarithm of `x` to base 2. Throw a [`DomainError`](/base/base#Core.DomainError) for negative [`Real`](/base/numbers#Core.Real) arguments.

See also: [`exp2`](/base/math#Base.exp2), [`ldexp`](/base/math#Base.Math.ldexp), [`ispow2`](/base/math#Base.ispow2).

**Examples**

```julia
julia> log2(4)
2.0

julia> log2(10)
3.321928094887362

julia> log2(-2)
ERROR: DomainError with -2.0:
log2 was called with a negative real argument but will only return a complex result if called with a complex argument. Try log2(Complex(x)).
Stacktrace:
 [1] throw_complex_domainerror(f::Symbol, x::Float64) at ./math.jl:31
[...]

julia> log2.(2.0 .^ (-1:1))
3-element Vector{Float64}:
 -1.0
  0.0
  1.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L638-L667)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.log10' href='#Base.log10'>#</a>&nbsp;<b><u>Base.log10</u></b> &mdash; <i>Function</i>.




```julia
log10(x)
```


Compute the logarithm of `x` to base 10. Throw a [`DomainError`](/base/base#Core.DomainError) for negative [`Real`](/base/numbers#Core.Real) arguments.

**Examples**

```julia
julia> log10(100)
2.0

julia> log10(2)
0.3010299956639812

julia> log10(-2)
ERROR: DomainError with -2.0:
log10 was called with a negative real argument but will only return a complex result if called with a complex argument. Try log10(Complex(x)).
Stacktrace:
 [1] throw_complex_domainerror(f::Symbol, x::Float64) at ./math.jl:31
[...]
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L670-L691)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.log1p' href='#Base.log1p'>#</a>&nbsp;<b><u>Base.log1p</u></b> &mdash; <i>Function</i>.




```julia
log1p(x)
```


Accurate natural logarithm of `1+x`. Throw a [`DomainError`](/base/base#Core.DomainError) for [`Real`](/base/numbers#Core.Real) arguments less than -1.

**Examples**

```julia
julia> log1p(-0.5)
-0.6931471805599453

julia> log1p(0)
0.0

julia> log1p(-2)
ERROR: DomainError with -2.0:
log1p was called with a real argument < -1 but will only return a complex result if called with a complex argument. Try log1p(Complex(x)).
Stacktrace:
 [1] throw_complex_domainerror(::Symbol, ::Float64) at ./math.jl:31
[...]
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L694-L715)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.frexp' href='#Base.Math.frexp'>#</a>&nbsp;<b><u>Base.Math.frexp</u></b> &mdash; <i>Function</i>.




```julia
frexp(val)
```


Return `(x,exp)` such that `x` has a magnitude in the interval $[1/2, 1)$ or 0, and `val` is equal to $x \times 2^{exp}$.

See also [`significand`](/base/numbers#Base.Math.significand), [`exponent`](/base/numbers#Base.Math.exponent), [`ldexp`](/base/math#Base.Math.ldexp).

**Examples**

```julia
julia> frexp(6.0)
(0.75, 3)

julia> significand(6.0), exponent(6.0)  # interval [1, 2) instead
(1.5, 2)

julia> frexp(0.0), frexp(NaN), frexp(-Inf)  # exponent would give an error
((0.0, 0), (NaN, 0), (-Inf, 0))
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L1128-L1147)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.exp-Tuple{Float64}' href='#Base.exp-Tuple{Float64}'>#</a>&nbsp;<b><u>Base.exp</u></b> &mdash; <i>Method</i>.




```julia
exp(x)
```


Compute the natural base exponential of `x`, in other words $ℯ^x$.

See also [`exp2`](/base/math#Base.exp2), [`exp10`](/base/math#Base.exp10) and [`cis`](/base/math#Base.cis).

**Examples**

```julia
julia> exp(1.0)
2.718281828459045

julia> exp(im * pi) ≈ cis(pi)
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/exp.jl#L332-L347)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.exp2' href='#Base.exp2'>#</a>&nbsp;<b><u>Base.exp2</u></b> &mdash; <i>Function</i>.




```julia
exp2(x)
```


Compute the base 2 exponential of `x`, in other words $2^x$.

See also [`ldexp`](/base/math#Base.Math.ldexp), [`<<`](/base/math#Base.:<<).

**Examples**

```julia
julia> exp2(5)
32.0

julia> 2^5
32

julia> exp2(63) > typemax(Int)
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/exp.jl#L349-L367)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.exp10' href='#Base.exp10'>#</a>&nbsp;<b><u>Base.exp10</u></b> &mdash; <i>Function</i>.




```julia
exp10(x)
```


Compute the base 10 exponential of `x`, in other words $10^x$.

**Examples**

```julia
julia> exp10(2)
100.0

julia> 10^2
100
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/exp.jl#L370-L383)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.ldexp' href='#Base.Math.ldexp'>#</a>&nbsp;<b><u>Base.Math.ldexp</u></b> &mdash; <i>Function</i>.




```julia
ldexp(x, n)
```


Compute $x \times 2^n$.

See also [`frexp`](/base/math#Base.Math.frexp), [`exponent`](/base/numbers#Base.Math.exponent).

**Examples**

```julia
julia> ldexp(5.0, 2)
20.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L969-L981)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.modf' href='#Base.Math.modf'>#</a>&nbsp;<b><u>Base.Math.modf</u></b> &mdash; <i>Function</i>.




```julia
modf(x)
```


Return a tuple `(fpart, ipart)` of the fractional and integral parts of a number. Both parts have the same sign as the argument.

**Examples**

```julia
julia> modf(3.5)
(0.5, 3.0)

julia> modf(-3.5)
(-0.5, -3.0)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L1234-L1248)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.expm1' href='#Base.expm1'>#</a>&nbsp;<b><u>Base.expm1</u></b> &mdash; <i>Function</i>.




```julia
expm1(x)
```


Accurately compute $e^x-1$. It avoids the loss of precision involved in the direct evaluation of exp(x)-1 for small values of x.

**Examples**

```julia
julia> expm1(1e-16)
1.0e-16

julia> exp(1e-16) - 1
0.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/exp.jl#L488-L501)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.round' href='#Base.round'>#</a>&nbsp;<b><u>Base.round</u></b> &mdash; <i>Function</i>.




```julia
round([T,] x, [r::RoundingMode])
round(x, [r::RoundingMode]; digits::Integer=0, base = 10)
round(x, [r::RoundingMode]; sigdigits::Integer, base = 10)
```


Rounds the number `x`.

Without keyword arguments, `x` is rounded to an integer value, returning a value of type `T`, or of the same type of `x` if no `T` is provided. An [`InexactError`](/base/base#Core.InexactError) will be thrown if the value is not representable by `T`, similar to [`convert`](/base/base#Base.convert).

If the `digits` keyword argument is provided, it rounds to the specified number of digits after the decimal place (or before if negative), in base `base`.

If the `sigdigits` keyword argument is provided, it rounds to the specified number of significant digits, in base `base`.

The [`RoundingMode`](/base/math#Base.Rounding.RoundingMode) `r` controls the direction of the rounding; the default is [`RoundNearest`](/base/math#Base.Rounding.RoundNearest), which rounds to the nearest integer, with ties (fractional values of 0.5) being rounded to the nearest even integer. Note that `round` may give incorrect results if the global rounding mode is changed (see [`rounding`](/base/numbers#Base.Rounding.rounding)).

**Examples**

```julia
julia> round(1.7)
2.0

julia> round(Int, 1.7)
2

julia> round(1.5)
2.0

julia> round(2.5)
2.0

julia> round(pi; digits=2)
3.14

julia> round(pi; digits=3, base=2)
3.125

julia> round(123.456; sigdigits=2)
120.0

julia> round(357.913; sigdigits=4, base=2)
352.0
```


::: tip Note

Rounding to specified digits in bases other than 2 can be inexact when operating on binary floating point numbers. For example, the [`Float64`](/base/numbers#Core.Float64) value represented by `1.15` is actually _less_ than 1.15, yet will be rounded to 1.2. For example:

```julia
julia> x = 1.15
1.15

julia> big(1.15)
1.149999999999999911182158029987476766109466552734375

julia> x < 115//100
true

julia> round(x, digits=1)
1.2
```


:::

**Extensions**

To extend `round` to new numeric types, it is typically sufficient to define `Base.round(x::NewType, r::RoundingMode)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L319-L391)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundingMode' href='#Base.Rounding.RoundingMode'>#</a>&nbsp;<b><u>Base.Rounding.RoundingMode</u></b> &mdash; <i>Type</i>.




```julia
RoundingMode
```


A type used for controlling the rounding mode of floating point operations (via [`rounding`](/base/numbers#Base.Rounding.rounding)/[`setrounding`](/base/numbers#Base.Rounding.setrounding-Tuple{Type,%20Any}) functions), or as optional arguments for rounding to the nearest integer (via the [`round`](/base/math#Base.round) function).

Currently supported rounding modes are:
- [`RoundNearest`](/base/math#Base.Rounding.RoundNearest) (default)
  
- [`RoundNearestTiesAway`](/base/math#Base.Rounding.RoundNearestTiesAway)
  
- [`RoundNearestTiesUp`](/base/math#Base.Rounding.RoundNearestTiesUp)
  
- [`RoundToZero`](/base/math#Base.Rounding.RoundToZero)
  
- [`RoundFromZero`](/base/math#Base.Rounding.RoundFromZero)
  
- [`RoundUp`](/base/math#Base.Rounding.RoundUp)
  
- [`RoundDown`](/base/math#Base.Rounding.RoundDown)
  

::: tip Julia 1.9

`RoundFromZero` requires at least Julia 1.9. Prior versions support `RoundFromZero` for `BigFloat`s only.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L26-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundNearest' href='#Base.Rounding.RoundNearest'>#</a>&nbsp;<b><u>Base.Rounding.RoundNearest</u></b> &mdash; <i>Constant</i>.




```julia
RoundNearest
```


The default rounding mode. Rounds to the nearest integer, with ties (fractional values of 0.5) being rounded to the nearest even integer.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L50-L55)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundNearestTiesAway' href='#Base.Rounding.RoundNearestTiesAway'>#</a>&nbsp;<b><u>Base.Rounding.RoundNearestTiesAway</u></b> &mdash; <i>Constant</i>.




```julia
RoundNearestTiesAway
```


Rounds to nearest integer, with ties rounded away from zero (C/C++ [`round`](/base/math#Base.round) behaviour).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L96-L101)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundNearestTiesUp' href='#Base.Rounding.RoundNearestTiesUp'>#</a>&nbsp;<b><u>Base.Rounding.RoundNearestTiesUp</u></b> &mdash; <i>Constant</i>.




```julia
RoundNearestTiesUp
```


Rounds to nearest integer, with ties rounded toward positive infinity (Java/JavaScript [`round`](/base/math#Base.round) behaviour).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L104-L109)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundToZero' href='#Base.Rounding.RoundToZero'>#</a>&nbsp;<b><u>Base.Rounding.RoundToZero</u></b> &mdash; <i>Constant</i>.




```julia
RoundToZero
```


[`round`](/base/math#Base.round) using this rounding mode is an alias for [`trunc`](/base/math#Base.trunc).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L58-L62)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundFromZero' href='#Base.Rounding.RoundFromZero'>#</a>&nbsp;<b><u>Base.Rounding.RoundFromZero</u></b> &mdash; <i>Constant</i>.




```julia
RoundFromZero
```


Rounds away from zero.

::: tip Julia 1.9

`RoundFromZero` requires at least Julia 1.9. Prior versions support `RoundFromZero` for `BigFloat`s only.

:::

**Examples**

```julia
julia> BigFloat("1.0000000000000001", 5, RoundFromZero)
1.06
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L79-L93)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundUp' href='#Base.Rounding.RoundUp'>#</a>&nbsp;<b><u>Base.Rounding.RoundUp</u></b> &mdash; <i>Constant</i>.




```julia
RoundUp
```


[`round`](/base/math#Base.round) using this rounding mode is an alias for [`ceil`](/base/math#Base.ceil).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L65-L69)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Rounding.RoundDown' href='#Base.Rounding.RoundDown'>#</a>&nbsp;<b><u>Base.Rounding.RoundDown</u></b> &mdash; <i>Constant</i>.




```julia
RoundDown
```


[`round`](/base/math#Base.round) using this rounding mode is an alias for [`floor`](/base/math#Base.floor).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L72-L76)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.round-Tuple{Complex{<:AbstractFloat}, RoundingMode, RoundingMode}' href='#Base.round-Tuple{Complex{<:AbstractFloat}, RoundingMode, RoundingMode}'>#</a>&nbsp;<b><u>Base.round</u></b> &mdash; <i>Method</i>.




```julia
round(z::Complex[, RoundingModeReal, [RoundingModeImaginary]])
round(z::Complex[, RoundingModeReal, [RoundingModeImaginary]]; digits=0, base=10)
round(z::Complex[, RoundingModeReal, [RoundingModeImaginary]]; sigdigits, base=10)
```


Return the nearest integral value of the same type as the complex-valued `z` to `z`, breaking ties using the specified [`RoundingMode`](/base/math#Base.Rounding.RoundingMode)s. The first [`RoundingMode`](/base/math#Base.Rounding.RoundingMode) is used for rounding the real components while the second is used for rounding the imaginary components.

`RoundingModeReal` and `RoundingModeImaginary` default to [`RoundNearest`](/base/math#Base.Rounding.RoundNearest), which rounds to the nearest integer, with ties (fractional values of 0.5) being rounded to the nearest even integer.

**Examples**

```julia
julia> round(3.14 + 4.5im)
3.0 + 4.0im

julia> round(3.14 + 4.5im, RoundUp, RoundNearestTiesUp)
4.0 + 5.0im

julia> round(3.14159 + 4.512im; digits = 1)
3.1 + 4.5im

julia> round(3.14159 + 4.512im; sigdigits = 3)
3.14 + 4.51im
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L1085-L1114)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ceil' href='#Base.ceil'>#</a>&nbsp;<b><u>Base.ceil</u></b> &mdash; <i>Function</i>.




```julia
ceil([T,] x)
ceil(x; digits::Integer= [, base = 10])
ceil(x; sigdigits::Integer= [, base = 10])
```


`ceil(x)` returns the nearest integral value of the same type as `x` that is greater than or equal to `x`.

`ceil(T, x)` converts the result to type `T`, throwing an `InexactError` if the ceiled value is not representable as a `T`.

Keywords `digits`, `sigdigits` and `base` work as for [`round`](/base/math#Base.round).

To support `ceil` for a new type, define `Base.round(x::NewType, ::RoundingMode{:Up})`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L442-L456)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.floor' href='#Base.floor'>#</a>&nbsp;<b><u>Base.floor</u></b> &mdash; <i>Function</i>.




```julia
floor([T,] x)
floor(x; digits::Integer= [, base = 10])
floor(x; sigdigits::Integer= [, base = 10])
```


`floor(x)` returns the nearest integral value of the same type as `x` that is less than or equal to `x`.

`floor(T, x)` converts the result to type `T`, throwing an `InexactError` if the floored value is not representable a `T`.

Keywords `digits`, `sigdigits` and `base` work as for [`round`](/base/math#Base.round).

To support `floor` for a new type, define `Base.round(x::NewType, ::RoundingMode{:Down})`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L425-L439)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.trunc' href='#Base.trunc'>#</a>&nbsp;<b><u>Base.trunc</u></b> &mdash; <i>Function</i>.




```julia
trunc([T,] x)
trunc(x; digits::Integer= [, base = 10])
trunc(x; sigdigits::Integer= [, base = 10])
```


`trunc(x)` returns the nearest integral value of the same type as `x` whose absolute value is less than or equal to the absolute value of `x`.

`trunc(T, x)` converts the result to type `T`, throwing an `InexactError` if the truncated value is not representable a `T`.

Keywords `digits`, `sigdigits` and `base` work as for [`round`](/base/math#Base.round).

To support `trunc` for a new type, define `Base.round(x::NewType, ::RoundingMode{:ToZero})`.

See also: [`%`](/base/math#Base.rem), [`floor`](/base/math#Base.floor), [`unsigned`](/base/numbers#Base.unsigned), [`unsafe_trunc`](/base/math#Base.unsafe_trunc).

**Examples**

```julia
julia> trunc(2.22)
2.0

julia> trunc(-2.22, digits=1)
-2.2

julia> trunc(Int, -2.22)
-2
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/rounding.jl#L394-L422)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_trunc' href='#Base.unsafe_trunc'>#</a>&nbsp;<b><u>Base.unsafe_trunc</u></b> &mdash; <i>Function</i>.




```julia
unsafe_trunc(T, x)
```


Return the nearest integral value of type `T` whose absolute value is less than or equal to the absolute value of `x`. If the value is not representable by `T`, an arbitrary value will be returned. See also [`trunc`](/base/math#Base.trunc).

**Examples**

```julia
julia> unsafe_trunc(Int, -2.2)
-2

julia> unsafe_trunc(Int, NaN)
-9223372036854775808
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/float.jl#L395-L411)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.min' href='#Base.min'>#</a>&nbsp;<b><u>Base.min</u></b> &mdash; <i>Function</i>.




```julia
min(x, y, ...)
```


Return the minimum of the arguments, with respect to [`isless`](/base/base#Base.isless). If any of the arguments is [`missing`](/manual/missing#missing), return `missing`. See also the [`minimum`](/base/collections#Base.minimum) function to take the minimum element from a collection.

**Examples**

```julia
julia> min(2, 5, 1)
1

julia> min(4, missing, 6)
missing
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L519-L534)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.max' href='#Base.max'>#</a>&nbsp;<b><u>Base.max</u></b> &mdash; <i>Function</i>.




```julia
max(x, y, ...)
```


Return the maximum of the arguments, with respect to [`isless`](/base/base#Base.isless). If any of the arguments is [`missing`](/manual/missing#missing), return `missing`. See also the [`maximum`](/base/collections#Base.maximum) function to take the maximum element from a collection.

**Examples**

```julia
julia> max(2, 5, 1)
5

julia> max(5, missing, 6)
missing
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L501-L516)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.minmax' href='#Base.minmax'>#</a>&nbsp;<b><u>Base.minmax</u></b> &mdash; <i>Function</i>.




```julia
minmax(x, y)
```


Return `(min(x,y), max(x,y))`.

See also [`extrema`](/base/collections#Base.extrema) that returns `(minimum(x), maximum(x))`.

**Examples**

```julia
julia> minmax('c','b')
('b', 'c')
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/operators.jl#L537-L549)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.clamp' href='#Base.Math.clamp'>#</a>&nbsp;<b><u>Base.Math.clamp</u></b> &mdash; <i>Function</i>.




```julia
clamp(x, lo, hi)
```


Return `x` if `lo <= x <= hi`. If `x > hi`, return `hi`. If `x < lo`, return `lo`. Arguments are promoted to a common type.

See also [`clamp!`](/base/math#Base.Math.clamp!), [`min`](/base/math#Base.min), [`max`](/base/math#Base.max).

::: tip Julia 1.3

`missing` as the first argument requires at least Julia 1.3.

:::

**Examples**

```julia
julia> clamp.([pi, 1.0, big(10)], 2.0, 9.0)
3-element Vector{BigFloat}:
 3.141592653589793238462643383279502884197169399375105820974944592307816406286198
 2.0
 9.0

julia> clamp.([11, 8, 5], 10, 6)  # an example where lo > hi
3-element Vector{Int64}:
  6
  6
 10
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L72-L97)



```julia
clamp(x, T)::T
```


Clamp `x` between `typemin(T)` and `typemax(T)` and convert the result to type `T`.

See also [`trunc`](/base/math#Base.trunc).

**Examples**

```julia
julia> clamp(200, Int8)
127

julia> clamp(-200, Int8)
-128

julia> trunc(Int, 4pi^2)
39
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L104-L122)



```julia
clamp(x::Integer, r::AbstractUnitRange)
```


Clamp `x` to lie within range `r`.

::: tip Julia 1.6

This method requires at least Julia 1.6.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L155-L162)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.clamp!' href='#Base.Math.clamp!'>#</a>&nbsp;<b><u>Base.Math.clamp!</u></b> &mdash; <i>Function</i>.




```julia
clamp!(array::AbstractArray, lo, hi)
```


Restrict values in `array` to the specified range, in-place. See also [`clamp`](/base/math#Base.Math.clamp).

::: tip Julia 1.3

`missing` entries in `array` require at least Julia 1.3.

:::

**Examples**

```julia
julia> row = collect(-4:4)';

julia> clamp!(row, 0, Inf)
1×9 adjoint(::Vector{Int64}) with eltype Int64:
 0  0  0  0  0  1  2  3  4

julia> clamp.((-4:4)', 0, Inf)
1×9 Matrix{Float64}:
 0.0  0.0  0.0  0.0  0.0  1.0  2.0  3.0  4.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L126-L147)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.abs' href='#Base.abs'>#</a>&nbsp;<b><u>Base.abs</u></b> &mdash; <i>Function</i>.




```julia
abs(x)
```


The absolute value of `x`.

When `abs` is applied to signed integers, overflow may occur, resulting in the return of a negative value. This overflow occurs only when `abs` is applied to the minimum representable value of a signed integer. That is, when `x == typemin(typeof(x))`, `abs(x) == x < 0`, not `-x` as might be expected.

See also: [`abs2`](/base/math#Base.abs2), [`unsigned`](/base/numbers#Base.unsigned), [`sign`](/base/math#Base.sign).

**Examples**

```julia
julia> abs(-3)
3

julia> abs(1 + im)
1.4142135623730951

julia> abs.(Int8[-128 -127 -126 0 126 127])  # overflow at typemin(Int8)
1×6 Matrix{Int8}:
 -128  127  126  0  126  127

julia> maximum(abs, [1, -2, 3, -4])
4
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/int.jl#L156-L184)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked' href='#Base.Checked'>#</a>&nbsp;<b><u>Base.Checked</u></b> &mdash; <i>Module</i>.




```julia
Checked
```


The Checked module provides arithmetic functions for the built-in signed and unsigned Integer types which throw an error when an overflow occurs. They are named like `checked_sub`, `checked_div`, etc. In addition, `add_with_overflow`, `sub_with_overflow`, `mul_with_overflow` return both the unchecked results and a boolean value denoting the presence of an overflow.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L5-L12)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_abs' href='#Base.Checked.checked_abs'>#</a>&nbsp;<b><u>Base.Checked.checked_abs</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_abs(x)
```


Calculates `abs(x)`, checking for overflow errors where applicable. For example, standard two&#39;s complement signed integers (e.g. `Int`) cannot represent `abs(typemin(Int))`, thus leading to an overflow.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L113-L121)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_neg' href='#Base.Checked.checked_neg'>#</a>&nbsp;<b><u>Base.Checked.checked_neg</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_neg(x)
```


Calculates `-x`, checking for overflow errors where applicable. For example, standard two&#39;s complement signed integers (e.g. `Int`) cannot represent `-typemin(Int)`, thus leading to an overflow.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L85-L93)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_add' href='#Base.Checked.checked_add'>#</a>&nbsp;<b><u>Base.Checked.checked_add</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_add(x, y)
```


Calculates `x+y`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L165-L171)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_sub' href='#Base.Checked.checked_sub'>#</a>&nbsp;<b><u>Base.Checked.checked_sub</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_sub(x, y)
```


Calculates `x-y`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L222-L228)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_mul' href='#Base.Checked.checked_mul'>#</a>&nbsp;<b><u>Base.Checked.checked_mul</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_mul(x, y)
```


Calculates `x*y`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L287-L293)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_div' href='#Base.Checked.checked_div'>#</a>&nbsp;<b><u>Base.Checked.checked_div</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_div(x, y)
```


Calculates `div(x,y)`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L316-L322)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_rem' href='#Base.Checked.checked_rem'>#</a>&nbsp;<b><u>Base.Checked.checked_rem</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_rem(x, y)
```


Calculates `x%y`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L325-L331)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_fld' href='#Base.Checked.checked_fld'>#</a>&nbsp;<b><u>Base.Checked.checked_fld</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_fld(x, y)
```


Calculates `fld(x,y)`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L334-L340)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_mod' href='#Base.Checked.checked_mod'>#</a>&nbsp;<b><u>Base.Checked.checked_mod</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_mod(x, y)
```


Calculates `mod(x,y)`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L343-L349)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_cld' href='#Base.Checked.checked_cld'>#</a>&nbsp;<b><u>Base.Checked.checked_cld</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_cld(x, y)
```


Calculates `cld(x,y)`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L352-L358)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.checked_pow' href='#Base.Checked.checked_pow'>#</a>&nbsp;<b><u>Base.Checked.checked_pow</u></b> &mdash; <i>Function</i>.




```julia
Base.checked_pow(x, y)
```


Calculates `^(x,y)`, checking for overflow errors where applicable.

The overflow protection may impose a perceptible performance penalty.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L361-L367)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.add_with_overflow' href='#Base.Checked.add_with_overflow'>#</a>&nbsp;<b><u>Base.Checked.add_with_overflow</u></b> &mdash; <i>Function</i>.




```julia
Base.add_with_overflow(x, y) -> (r, f)
```


Calculates `r = x+y`, with the flag `f` indicating whether overflow has occurred.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L135-L139)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.sub_with_overflow' href='#Base.Checked.sub_with_overflow'>#</a>&nbsp;<b><u>Base.Checked.sub_with_overflow</u></b> &mdash; <i>Function</i>.




```julia
Base.sub_with_overflow(x, y) -> (r, f)
```


Calculates `r = x-y`, with the flag `f` indicating whether overflow has occurred.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L197-L201)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Checked.mul_with_overflow' href='#Base.Checked.mul_with_overflow'>#</a>&nbsp;<b><u>Base.Checked.mul_with_overflow</u></b> &mdash; <i>Function</i>.




```julia
Base.mul_with_overflow(x, y) -> (r, f)
```


Calculates `r = x*y`, with the flag `f` indicating whether overflow has occurred.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/checked.jl#L237-L241)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.abs2' href='#Base.abs2'>#</a>&nbsp;<b><u>Base.abs2</u></b> &mdash; <i>Function</i>.




```julia
abs2(x)
```


Squared absolute value of `x`.

This can be faster than `abs(x)^2`, especially for complex numbers where `abs(x)` requires a square root via [`hypot`](/base/math#Base.Math.hypot).

See also [`abs`](/base/math#Base.abs), [`conj`](/base/math#Base.conj), [`real`](/base/math#Base.real).

**Examples**

```julia
julia> abs2(-3)
9

julia> abs2(3.0 + 4.0im)
25.0

julia> sum(abs2, [1+2im, 3+4im])  # LinearAlgebra.norm(x)^2
30
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/number.jl#L166-L187)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copysign' href='#Base.copysign'>#</a>&nbsp;<b><u>Base.copysign</u></b> &mdash; <i>Function</i>.




```julia
copysign(x, y) -> z
```


Return `z` which has the magnitude of `x` and the same sign as `y`.

**Examples**

```julia
julia> copysign(1, -2)
-1

julia> copysign(-1, 2)
1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/number.jl#L207-L220)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sign' href='#Base.sign'>#</a>&nbsp;<b><u>Base.sign</u></b> &mdash; <i>Function</i>.




```julia
sign(x)
```


Return zero if `x==0` and $x/|x|$ otherwise (i.e., ±1 for real `x`).

See also [`signbit`](/base/math#Base.signbit), [`zero`](/base/numbers#Base.zero), [`copysign`](/base/math#Base.copysign), [`flipsign`](/base/math#Base.flipsign).

**Examples**

```julia
julia> sign(-4.0)
-1.0

julia> sign(99)
1

julia> sign(-0.0)
-0.0

julia> sign(0 + im)
0.0 + 1.0im
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/number.jl#L139-L160)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.signbit' href='#Base.signbit'>#</a>&nbsp;<b><u>Base.signbit</u></b> &mdash; <i>Function</i>.




```julia
signbit(x)
```


Return `true` if the value of the sign of `x` is negative, otherwise `false`.

See also [`sign`](/base/math#Base.sign) and [`copysign`](/base/math#Base.copysign).

**Examples**

```julia
julia> signbit(-4)
true

julia> signbit(5)
false

julia> signbit(5.5)
false

julia> signbit(-4.1)
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/number.jl#L115-L136)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.flipsign' href='#Base.flipsign'>#</a>&nbsp;<b><u>Base.flipsign</u></b> &mdash; <i>Function</i>.




```julia
flipsign(x, y)
```


Return `x` with its sign flipped if `y` is negative. For example `abs(x) = flipsign(x,x)`.

**Examples**

```julia
julia> flipsign(5, 3)
5

julia> flipsign(5, -3)
-5
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/number.jl#L191-L204)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sqrt-Tuple{Number}' href='#Base.sqrt-Tuple{Number}'>#</a>&nbsp;<b><u>Base.sqrt</u></b> &mdash; <i>Method</i>.




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

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isqrt' href='#Base.isqrt'>#</a>&nbsp;<b><u>Base.isqrt</u></b> &mdash; <i>Function</i>.




```julia
isqrt(n::Integer)
```


Integer square root: the largest integer `m` such that `m*m <= n`.

```julia
julia> isqrt(5)
2
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L1088-L1097)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.cbrt-Tuple{AbstractFloat}' href='#Base.Math.cbrt-Tuple{AbstractFloat}'>#</a>&nbsp;<b><u>Base.Math.cbrt</u></b> &mdash; <i>Method</i>.




```julia
cbrt(x::Real)
```


Return the cube root of `x`, i.e. $x^{1/3}$. Negative values are accepted (returning the negative real root when $x < 0$).

The prefix operator `∛` is equivalent to `cbrt`.

**Examples**

```julia
julia> cbrt(big(27))
3.0

julia> cbrt(big(-27))
-3.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/special/cbrt.jl#L17-L33)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.real' href='#Base.real'>#</a>&nbsp;<b><u>Base.real</u></b> &mdash; <i>Function</i>.




```julia
real(z)
```


Return the real part of the complex number `z`.

See also: [`imag`](/base/math#Base.imag), [`reim`](/base/math#Base.reim), [`complex`](/base/numbers#Base.complex-Tuple{Complex}), [`isreal`](/base/numbers#Base.isreal), [`Real`](/base/numbers#Core.Real).

**Examples**

```julia
julia> real(1 + 3im)
1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L59-L71)



```julia
real(T::Type)
```


Return the type that represents the real part of a value of type `T`. e.g: for `T == Complex{R}`, returns `R`. Equivalent to `typeof(real(zero(T)))`.

**Examples**

```julia
julia> real(Complex{Int})
Int64

julia> real(Float64)
Float64
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L104-L119)



```julia
real(A::AbstractArray)
```


Return an array containing the real part of each entry in array `A`.

Equivalent to `real.(A)`, except that when `eltype(A) <: Real` `A` is returned without copying, and that when `A` has zero dimensions, a 0-dimensional array is returned (rather than a scalar).

**Examples**

```julia
julia> real([1, 2im, 3 + 4im])
3-element Vector{Int64}:
 1
 0
 3

julia> real(fill(2 - im))
0-dimensional Array{Int64, 0}:
2
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/abstractarraymath.jl#L149-L170)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.imag' href='#Base.imag'>#</a>&nbsp;<b><u>Base.imag</u></b> &mdash; <i>Function</i>.




```julia
imag(z)
```


Return the imaginary part of the complex number `z`.

See also: [`conj`](/base/math#Base.conj), [`reim`](/base/math#Base.reim), [`adjoint`](/stdlib/LinearAlgebra#Base.adjoint), [`angle`](/base/math#Base.angle).

**Examples**

```julia
julia> imag(1 + 3im)
3
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L74-L86)



```julia
imag(A::AbstractArray)
```


Return an array containing the imaginary part of each entry in array `A`.

Equivalent to `imag.(A)`, except that when `A` has zero dimensions, a 0-dimensional array is returned (rather than a scalar).

**Examples**

```julia
julia> imag([1, 2im, 3 + 4im])
3-element Vector{Int64}:
 0
 2
 4

julia> imag(fill(2 - im))
0-dimensional Array{Int64, 0}:
-1
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/abstractarraymath.jl#L174-L194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reim' href='#Base.reim'>#</a>&nbsp;<b><u>Base.reim</u></b> &mdash; <i>Function</i>.




```julia
reim(z)
```


Return a tuple of the real and imaginary parts of the complex number `z`.

**Examples**

```julia
julia> reim(1 + 3im)
(1, 3)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L91-L101)



```julia
reim(A::AbstractArray)
```


Return a tuple of two arrays containing respectively the real and the imaginary part of each entry in `A`.

Equivalent to `(real.(A), imag.(A))`, except that when `eltype(A) <: Real` `A` is returned without copying to represent the real part, and that when `A` has zero dimensions, a 0-dimensional array is returned (rather than a scalar).

**Examples**

```julia
julia> reim([1, 2im, 3 + 4im])
([1, 0, 3], [0, 2, 4])

julia> reim(fill(2 - im))
(fill(2), fill(-1))
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/abstractarraymath.jl#L198-L216)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.conj' href='#Base.conj'>#</a>&nbsp;<b><u>Base.conj</u></b> &mdash; <i>Function</i>.




```julia
conj(z)
```


Compute the complex conjugate of a complex number `z`.

See also: [`angle`](/base/math#Base.angle), [`adjoint`](/stdlib/LinearAlgebra#Base.adjoint).

**Examples**

```julia
julia> conj(1 + 3im)
1 - 3im
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L272-L284)



```julia
conj(A::AbstractArray)
```


Return an array containing the complex conjugate of each entry in array `A`.

Equivalent to `conj.(A)`, except that when `eltype(A) <: Real` `A` is returned without copying, and that when `A` has zero dimensions, a 0-dimensional array is returned (rather than a scalar).

**Examples**

```julia
julia> conj([1, 2im, 3 + 4im])
3-element Vector{Complex{Int64}}:
 1 + 0im
 0 - 2im
 3 - 4im

julia> conj(fill(2 - im))
0-dimensional Array{Complex{Int64}, 0}:
2 + 1im
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/abstractarraymath.jl#L124-L145)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.angle' href='#Base.angle'>#</a>&nbsp;<b><u>Base.angle</u></b> &mdash; <i>Function</i>.




```julia
angle(z)
```


Compute the phase angle in radians of a complex number `z`.

Returns a number `-pi ≤ angle(z) ≤ pi`, and is thus discontinuous along the negative real axis.

See also: [`atan`](/base/math#Base.atan-Tuple{Number}), [`cis`](/base/math#Base.cis), [`rad2deg`](/base/math#Base.Math.rad2deg).

**Examples**

```julia
julia> rad2deg(angle(1 + im))
45.0

julia> rad2deg(angle(1 - im))
-45.0

julia> rad2deg(angle(-1 + 1e-20im))
180.0

julia> rad2deg(angle(-1 - 1e-20im))
-180.0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L623-L647)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cis' href='#Base.cis'>#</a>&nbsp;<b><u>Base.cis</u></b> &mdash; <i>Function</i>.




```julia
cis(x)
```


More efficient method for `exp(im*x)` by using Euler&#39;s formula: $\cos(x) + i \sin(x) = \exp(i x)$.

See also [`cispi`](/base/math#Base.cispi), [`sincos`](/base/math#Base.Math.sincos-Tuple{Float64}), [`exp`](/base/math#Base.exp-Tuple{Float64}), [`angle`](/base/math#Base.angle).

**Examples**

```julia
julia> cis(π) ≈ -1
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L570-L582)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.cispi' href='#Base.cispi'>#</a>&nbsp;<b><u>Base.cispi</u></b> &mdash; <i>Function</i>.




```julia
cispi(x)
```


More accurate method for `cis(pi*x)` (especially for large `x`).

See also [`cis`](/base/math#Base.cis), [`sincospi`](/base/math#Base.Math.sincospi), [`exp`](/base/math#Base.exp-Tuple{Float64}), [`angle`](/base/math#Base.angle).

**Examples**

```julia
julia> cispi(10000)
1.0 + 0.0im

julia> cispi(0.25 + 1im)
0.030556854645954562 + 0.03055685464595456im
```


::: tip Julia 1.6

This function requires Julia 1.6 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/complex.jl#L595-L613)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.binomial' href='#Base.binomial'>#</a>&nbsp;<b><u>Base.binomial</u></b> &mdash; <i>Function</i>.




```julia
binomial(n::Integer, k::Integer)
```


The _binomial coefficient_ $\binom{n}{k}$, being the coefficient of the $k$th term in the polynomial expansion of $(1+x)^n$.

If $n$ is non-negative, then it is the number of ways to choose `k` out of `n` items:

$$\binom{n}{k} = \frac{n!}{k! (n-k)!}$$

where $n!$ is the [`factorial`](/base/math#Base.factorial) function.

If $n$ is negative, then it is defined in terms of the identity

$$\binom{n}{k} = (-1)^k \binom{k-n-1}{k}$$

See also [`factorial`](/base/math#Base.factorial).

**Examples**

```julia
julia> binomial(5, 3)
10

julia> factorial(5) ÷ (factorial(5-3) * factorial(3))
10

julia> binomial(-5, 3)
-35
```


**External links**
- [Binomial coefficient](https://en.wikipedia.org/wiki/Binomial_coefficient) on Wikipedia.
  


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L1144-L1177)



```julia
binomial(x::Number, k::Integer)
```


The generalized binomial coefficient, defined for `k ≥ 0` by the polynomial

$$\frac{1}{k!} \prod_{j=0}^{k-1} (x - j)$$

When `k < 0` it returns zero.

For the case of integer `x`, this is equivalent to the ordinary integer binomial coefficient

$$\binom{n}{k} = \frac{n!}{k! (n-k)!}$$

Further generalizations to non-integer `k` are mathematically possible, but involve the Gamma function and/or the beta function, which are not provided by the Julia standard library but are available in external packages such as [SpecialFunctions.jl](https://github.com/JuliaMath/SpecialFunctions.jl).

**External links**
- [Binomial coefficient](https://en.wikipedia.org/wiki/Binomial_coefficient) on Wikipedia.
  


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L1207-L1230)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.factorial' href='#Base.factorial'>#</a>&nbsp;<b><u>Base.factorial</u></b> &mdash; <i>Function</i>.




```julia
factorial(n::Integer)
```


Factorial of `n`. If `n` is an [`Integer`](/base/numbers#Core.Integer), the factorial is computed as an integer (promoted to at least 64 bits). Note that this may overflow if `n` is not small, but you can use `factorial(big(n))` to compute the result exactly in arbitrary precision.

See also [`binomial`](/base/math#Base.binomial).

**Examples**

```julia
julia> factorial(6)
720

julia> factorial(21)
ERROR: OverflowError: 21 is too large to look up in the table; consider using `factorial(big(21))` instead
Stacktrace:
[...]

julia> factorial(big(21))
51090942171709440000
```


**External links**
- [Factorial](https://en.wikipedia.org/wiki/Factorial) on Wikipedia.
  


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L1109-L1134)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.gcd' href='#Base.gcd'>#</a>&nbsp;<b><u>Base.gcd</u></b> &mdash; <i>Function</i>.




```julia
gcd(x, y...)
```


Greatest common (positive) divisor (or zero if all arguments are zero). The arguments may be integer and rational numbers.

::: tip Julia 1.4

Rational arguments require Julia 1.4 or later.

:::

**Examples**

```julia
julia> gcd(6, 9)
3

julia> gcd(6, -9)
3

julia> gcd(6, 0)
6

julia> gcd(0, 0)
0

julia> gcd(1//3, 2//3)
1//3

julia> gcd(1//3, -2//3)
1//3

julia> gcd(1//3, 2)
1//3

julia> gcd(0, 0, 10, 15)
5
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L5-L40)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.lcm' href='#Base.lcm'>#</a>&nbsp;<b><u>Base.lcm</u></b> &mdash; <i>Function</i>.




```julia
lcm(x, y...)
```


Least common (positive) multiple (or zero if any argument is zero). The arguments may be integer and rational numbers.

::: tip Julia 1.4

Rational arguments require Julia 1.4 or later.

:::

**Examples**

```julia
julia> lcm(2, 3)
6

julia> lcm(-2, 3)
6

julia> lcm(0, 3)
0

julia> lcm(0, 0)
0

julia> lcm(1//3, 2//3)
2//3

julia> lcm(1//3, -2//3)
2//3

julia> lcm(1//3, 2)
2//1

julia> lcm(1, 3, 5, 7)
105
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L94-L129)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.gcdx' href='#Base.gcdx'>#</a>&nbsp;<b><u>Base.gcdx</u></b> &mdash; <i>Function</i>.




```julia
gcdx(a, b)
```


Computes the greatest common (positive) divisor of `a` and `b` and their Bézout coefficients, i.e. the integer coefficients `u` and `v` that satisfy $ua+vb = d = gcd(a, b)$. $gcdx(a, b)$ returns $(d, u, v)$.

The arguments may be integer and rational numbers.

::: tip Julia 1.4

Rational arguments require Julia 1.4 or later.

:::

**Examples**

```julia
julia> gcdx(12, 42)
(6, -3, 1)

julia> gcdx(240, 46)
(2, -9, 47)
```


::: tip Note

Bézout coefficients are _not_ uniquely defined. `gcdx` returns the minimal Bézout coefficients that are computed by the extended Euclidean algorithm. (Ref: D. Knuth, TAoCP, 2/e, p. 325, Algorithm X.) For signed integers, these coefficients `u` and `v` are minimal in the sense that $|u| < |b/d|$ and $|v| < |a/d|$. Furthermore, the signs of `u` and `v` are chosen so that `d` is positive. For unsigned integers, the coefficients `u` and `v` might be near their `typemax`, and the identity then holds only via the unsigned integers&#39; modulo arithmetic.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L167-L198)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ispow2' href='#Base.ispow2'>#</a>&nbsp;<b><u>Base.ispow2</u></b> &mdash; <i>Function</i>.




```julia
ispow2(n::Number) -> Bool
```


Test whether `n` is an integer power of two.

See also [`count_ones`](/base/numbers#Base.count_ones), [`prevpow`](/base/math#Base.prevpow), [`nextpow`](/base/math#Base.nextpow).

**Examples**

```julia
julia> ispow2(4)
true

julia> ispow2(5)
false

julia> ispow2(4.5)
false

julia> ispow2(0.25)
true

julia> ispow2(1//8)
true
```


::: tip Julia 1.6

Support for non-`Integer` arguments was added in Julia 1.6.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L463-L490)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nextpow' href='#Base.nextpow'>#</a>&nbsp;<b><u>Base.nextpow</u></b> &mdash; <i>Function</i>.




```julia
nextpow(a, x)
```


The smallest `a^n` not less than `x`, where `n` is a non-negative integer. `a` must be greater than 1, and `x` must be greater than 0.

See also [`prevpow`](/base/math#Base.prevpow).

**Examples**

```julia
julia> nextpow(2, 7)
8

julia> nextpow(2, 9)
16

julia> nextpow(5, 20)
25

julia> nextpow(4, 16)
16
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L495-L517)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.prevpow' href='#Base.prevpow'>#</a>&nbsp;<b><u>Base.prevpow</u></b> &mdash; <i>Function</i>.




```julia
prevpow(a, x)
```


The largest `a^n` not greater than `x`, where `n` is a non-negative integer. `a` must be greater than 1, and `x` must not be less than 1.

See also [`nextpow`](/base/math#Base.nextpow), [`isqrt`](/base/math#Base.isqrt).

**Examples**

```julia
julia> prevpow(2, 7)
4

julia> prevpow(2, 9)
8

julia> prevpow(5, 20)
5

julia> prevpow(4, 16)
16
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L539-L561)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nextprod' href='#Base.nextprod'>#</a>&nbsp;<b><u>Base.nextprod</u></b> &mdash; <i>Function</i>.




```julia
nextprod(factors::Union{Tuple,AbstractVector}, n)
```


Next integer greater than or equal to `n` that can be written as $\prod k_i^{p_i}$ for integers $p_1$, $p_2$, etcetera, for factors $k_i$ in `factors`.

**Examples**

```julia
julia> nextprod((2, 3), 105)
108

julia> 2^2 * 3^3
108
```


::: tip Julia 1.6

The method that accepts a tuple requires Julia 1.6 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/combinatorics.jl#L313-L330)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.invmod' href='#Base.invmod'>#</a>&nbsp;<b><u>Base.invmod</u></b> &mdash; <i>Function</i>.




```julia
invmod(n::Integer, m::Integer)
```


Take the inverse of `n` modulo `m`: `y` such that $n y = 1 \pmod m$, and $div(y,m) = 0$. This will throw an error if $m = 0$, or if $gcd(n,m) \neq 1$.

**Examples**

```julia
julia> invmod(2, 5)
3

julia> invmod(2, 3)
2

julia> invmod(5, 6)
5
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L220-L238)



```julia
invmod(n::Integer, T) where {T <: Base.BitInteger}
invmod(n::T) where {T <: Base.BitInteger}
```


Compute the modular inverse of `n` in the integer ring of type `T`, i.e. modulo `2^N` where `N = 8*sizeof(T)` (e.g. `N = 32` for `Int32`). In other words these methods satisfy the following identities:

```
n * invmod(n) == 1
(n * invmod(n, T)) % T == 1
(n % T) * invmod(n, T) == 1
```


Note that `*` here is modular multiplication in the integer ring, `T`.

Specifying the modulus implied by an integer type as an explicit value is often inconvenient since the modulus is by definition too big to be represented by the type.

The modular inverse is computed much more efficiently than the general case using the algorithm described in https://arxiv.org/pdf/2204.04342.pdf.

::: tip Julia 1.11

The `invmod(n)` and `invmod(n, T)` methods require Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L260-L283)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.powermod' href='#Base.powermod'>#</a>&nbsp;<b><u>Base.powermod</u></b> &mdash; <i>Function</i>.




```julia
powermod(x::Integer, p::Integer, m)
```


Compute $x^p \pmod m$.

**Examples**

```julia
julia> powermod(2, 6, 5)
4

julia> mod(2^6, 5)
4

julia> powermod(5, 2, 20)
5

julia> powermod(5, 2, 19)
6

julia> powermod(5, 3, 19)
11
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L399-L421)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ndigits' href='#Base.ndigits'>#</a>&nbsp;<b><u>Base.ndigits</u></b> &mdash; <i>Function</i>.




```julia
ndigits(n::Integer; base::Integer=10, pad::Integer=1)
```


Compute the number of digits in integer `n` written in base `base` (`base` must not be in `[-1, 0, 1]`), optionally padded with zeros to a specified size (the result will never be less than `pad`).

See also [`digits`](/base/numbers#Base.digits), [`count_ones`](/base/numbers#Base.count_ones).

**Examples**

```julia
julia> ndigits(0)
1

julia> ndigits(12345)
5

julia> ndigits(1022, base=16)
3

julia> string(1022, base=16)
"3fe"

julia> ndigits(123, pad=5)
5

julia> ndigits(-123)
3
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/intfuncs.jl#L708-L737)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.add_sum' href='#Base.add_sum'>#</a>&nbsp;<b><u>Base.add_sum</u></b> &mdash; <i>Function</i>.




```julia
Base.add_sum(x, y)
```


The reduction operator used in `sum`. The main difference from [`+`](/base/math#Base.:+) is that small integers are promoted to `Int`/`UInt`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/reduce.jl#L10-L15)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.widemul' href='#Base.widemul'>#</a>&nbsp;<b><u>Base.widemul</u></b> &mdash; <i>Function</i>.




```julia
widemul(x, y)
```


Multiply `x` and `y`, giving the result as a larger type.

See also [`promote`](/base/base#Base.promote), [`Base.add_sum`](/base/math#Base.add_sum).

**Examples**

```julia
julia> widemul(Float32(3.0), 4.0) isa BigFloat
true

julia> typemax(Int8) * typemax(Int8)
1

julia> widemul(typemax(Int8), typemax(Int8))  # == 127^2
16129
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/number.jl#L258-L276)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.evalpoly' href='#Base.Math.evalpoly'>#</a>&nbsp;<b><u>Base.Math.evalpoly</u></b> &mdash; <i>Function</i>.




```julia
evalpoly(x, p)
```


Evaluate the polynomial $\sum_k x^{k-1} p[k]$ for the coefficients `p[1]`, `p[2]`, ...; that is, the coefficients are given in ascending order by power of `x`. Loops are unrolled at compile time if the number of coefficients is statically known, i.e. when `p` is a `Tuple`. This function generates efficient code using Horner&#39;s method if `x` is real, or using a Goertzel-like [^DK62] algorithm if `x` is complex.

[^DK62]: Donald Knuth, Art of Computer Programming, Volume 2: Seminumerical Algorithms, Sec. 4.6.4.


::: tip Julia 1.4

This function requires Julia 1.4 or later.

:::

**Examples**

```julia
julia> evalpoly(2, (1, 2, 3))
17
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L165-L185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Math.@evalpoly' href='#Base.Math.@evalpoly'>#</a>&nbsp;<b><u>Base.Math.@evalpoly</u></b> &mdash; <i>Macro</i>.




```julia
@evalpoly(z, c...)
```


Evaluate the polynomial $\sum_k z^{k-1} c[k]$ for the coefficients `c[1]`, `c[2]`, ...; that is, the coefficients are given in ascending order by power of `z`.  This macro expands to efficient inline code that uses either Horner&#39;s method or, for complex `z`, a more efficient Goertzel-like algorithm.

See also [`evalpoly`](/base/math#Base.Math.evalpoly).

**Examples**

```julia
julia> @evalpoly(3, 1, 0, 1)
10

julia> @evalpoly(2, 1, 0, 1)
5

julia> @evalpoly(2, 1, 1, 1)
7
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/math.jl#L278-L299)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.FastMath.@fastmath' href='#Base.FastMath.@fastmath'>#</a>&nbsp;<b><u>Base.FastMath.@fastmath</u></b> &mdash; <i>Macro</i>.




```julia
@fastmath expr
```


Execute a transformed version of the expression, which calls functions that may violate strict IEEE semantics. This allows the fastest possible operation, but results are undefined – be careful when doing this, as it may change numerical results.

This sets the [LLVM Fast-Math flags](https://llvm.org/docs/LangRef.html#fast-math-flags), and corresponds to the `-ffast-math` option in clang. See [the notes on performance annotations](/manual/performance-tips#man-performance-annotations) for more details.

**Examples**

```julia
julia> @fastmath 1+2
3

julia> @fastmath(sin(3))
0.1411200080598672
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/fastmath.jl#L134-L154)

</div>
<br>

## Customizable binary operators {#Customizable-binary-operators}

Some unicode characters can be used to define new binary operators that support infix notation. For example `⊗(x,y) = kron(x,y)` defines the `⊗` (otimes) function to be the Kronecker product, and one can call it as binary operator using infix syntax: `C = A ⊗ B` as well as with the usual prefix syntax `C = ⊗(A,B)`.

Other characters that support such extensions include \odot `⊙` and \oplus `⊕`

The complete list is in the parser code: [https://github.com/JuliaLang/julia/blob/master/src/julia-parser.scm](https://github.com/JuliaLang/julia/blob/master/src/julia-parser.scm)

Those that are parsed like `*` (in terms of precedence) include `* / ÷ % & ⋅ ∘ × |\\| ∩ ∧ ⊗ ⊘ ⊙ ⊚ ⊛ ⊠ ⊡ ⊓ ∗ ∙ ∤ ⅋ ≀ ⊼ ⋄ ⋆ ⋇ ⋉ ⋊ ⋋ ⋌ ⋏ ⋒ ⟑ ⦸ ⦼ ⦾ ⦿ ⧶ ⧷ ⨇ ⨰ ⨱ ⨲ ⨳ ⨴ ⨵ ⨶ ⨷ ⨸ ⨻ ⨼ ⨽ ⩀ ⩃ ⩄ ⩋ ⩍ ⩎ ⩑ ⩓ ⩕ ⩘ ⩚ ⩜ ⩞ ⩟ ⩠ ⫛ ⊍ ▷ ⨝ ⟕ ⟖ ⟗` and those that are parsed like `+` include `+ - |\|| ⊕ ⊖ ⊞ ⊟ |++| ∪ ∨ ⊔ ± ∓ ∔ ∸ ≏ ⊎ ⊻ ⊽ ⋎ ⋓ ⟇ ⧺ ⧻ ⨈ ⨢ ⨣ ⨤ ⨥ ⨦ ⨧ ⨨ ⨩ ⨪ ⨫ ⨬ ⨭ ⨮ ⨹ ⨺ ⩁ ⩂ ⩅ ⩊ ⩌ ⩏ ⩐ ⩒ ⩔ ⩖ ⩗ ⩛ ⩝ ⩡ ⩢ ⩣` There are many others that are related to arrows, comparisons, and powers.
