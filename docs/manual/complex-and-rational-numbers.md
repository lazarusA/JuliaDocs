
# Complex and Rational Numbers {#Complex-and-Rational-Numbers}

Julia includes predefined types for both complex and rational numbers, and supports all the standard [Mathematical Operations and Elementary Functions](/manual/mathematical-operations#Mathematical-Operations-and-Elementary-Functions) on them. [Conversion and Promotion](/manual/conversion-and-promotion#conversion-and-promotion) are defined so that operations on any combination of predefined numeric types, whether primitive or composite, behave as expected.

## Complex Numbers {#Complex-Numbers}

The global constant [`im`](/base/numbers#Base.im) is bound to the complex number _i_, representing the principal square root of -1. (Using mathematicians&#39; `i` or engineers&#39; `j` for this global constant was rejected since they are such popular index variable names.) Since Julia allows numeric literals to be [juxtaposed with identifiers as coefficients](/manual/integers-and-floating-point-numbers#man-numeric-literal-coefficients), this binding suffices to provide convenient syntax for complex numbers, similar to the traditional mathematical notation:

```julia
julia> 1+2im
1 + 2im
```


You can perform all the standard arithmetic operations with complex numbers:

```julia
julia> (1 + 2im)*(2 - 3im)
8 + 1im

julia> (1 + 2im)/(1 - 2im)
-0.6 + 0.8im

julia> (1 + 2im) + (1 - 2im)
2 + 0im

julia> (-3 + 2im) - (5 - 1im)
-8 + 3im

julia> (-1 + 2im)^2
-3 - 4im

julia> (-1 + 2im)^2.5
2.729624464784009 - 6.9606644595719im

julia> (-1 + 2im)^(1 + 1im)
-0.27910381075826657 + 0.08708053414102428im

julia> 3(2 - 5im)
6 - 15im

julia> 3(2 - 5im)^2
-63 - 60im

julia> 3(2 - 5im)^-1.0
0.20689655172413793 + 0.5172413793103449im
```


The promotion mechanism ensures that combinations of operands of different types just work:

```julia
julia> 2(1 - 1im)
2 - 2im

julia> (2 + 3im) - 1
1 + 3im

julia> (1 + 2im) + 0.5
1.5 + 2.0im

julia> (2 + 3im) - 0.5im
2.0 + 2.5im

julia> 0.75(1 + 2im)
0.75 + 1.5im

julia> (2 + 3im) / 2
1.0 + 1.5im

julia> (1 - 3im) / (2 + 2im)
-0.5 - 1.0im

julia> 2im^2
-2 + 0im

julia> 1 + 3/4im
1.0 - 0.75im
```


Note that `3/4im == 3/(4*im) == -(3/4*im)`, since a literal coefficient binds more tightly than division.

Standard functions to manipulate complex values are provided:

```julia
julia> z = 1 + 2im
1 + 2im

julia> real(1 + 2im) # real part of z
1

julia> imag(1 + 2im) # imaginary part of z
2

julia> conj(1 + 2im) # complex conjugate of z
1 - 2im

julia> abs(1 + 2im) # absolute value of z
2.23606797749979

julia> abs2(1 + 2im) # squared absolute value
5

julia> angle(1 + 2im) # phase angle in radians
1.1071487177940904
```


As usual, the absolute value ([`abs`](/base/math#Base.abs)) of a complex number is its distance from zero. [`abs2`](/base/math#Base.abs2) gives the square of the absolute value, and is of particular use for complex numbers since it avoids taking a square root. [`angle`](/base/math#Base.angle) returns the phase angle in radians (also known as the _argument_ or _arg_ function). The full gamut of other [Elementary Functions](/manual/mathematical-operations#Elementary-Functions) is also defined for complex numbers:

```julia
julia> sqrt(1im)
0.7071067811865476 + 0.7071067811865475im

julia> sqrt(1 + 2im)
1.272019649514069 + 0.7861513777574233im

julia> cos(1 + 2im)
2.0327230070196656 - 3.0518977991517997im

julia> exp(1 + 2im)
-1.1312043837568135 + 2.4717266720048188im

julia> sinh(1 + 2im)
-0.4890562590412937 + 1.4031192506220405im
```


Note that mathematical functions typically return real values when applied to real numbers and complex values when applied to complex numbers. For example, [`sqrt`](/base/math#Base.sqrt-Tuple{Number}) behaves differently when applied to `-1` versus `-1 + 0im` even though `-1 == -1 + 0im`:

```julia
julia> sqrt(-1)
ERROR: DomainError with -1.0:
sqrt was called with a negative real argument but will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]

julia> sqrt(-1 + 0im)
0.0 + 1.0im
```


The [literal numeric coefficient notation](/manual/integers-and-floating-point-numbers#man-numeric-literal-coefficients) does not work when constructing a complex number from variables. Instead, the multiplication must be explicitly written out:

```julia
julia> a = 1; b = 2; a + b*im
1 + 2im
```


However, this is _not_ recommended. Instead, use the more efficient [`complex`](/base/numbers#Base.complex-Tuple{Complex}) function to construct a complex value directly from its real and imaginary parts:

```julia
julia> a = 1; b = 2; complex(a, b)
1 + 2im
```


This construction avoids the multiplication and addition operations.

[`Inf`](/base/numbers#Base.Inf) and [`NaN`](/base/numbers#Base.NaN) propagate through complex numbers in the real and imaginary parts of a complex number as described in the [Special floating-point values](/manual/integers-and-floating-point-numbers#Special-floating-point-values) section:

```julia
julia> 1 + Inf*im
1.0 + Inf*im

julia> 1 + NaN*im
1.0 + NaN*im
```


## Rational Numbers {#Rational-Numbers}

Julia has a rational number type to represent exact ratios of integers. Rationals are constructed using the [`//`](/base/math#Base.://) operator:

```julia
julia> 2//3
2//3
```


If the numerator and denominator of a rational have common factors, they are reduced to lowest terms such that the denominator is non-negative:

```julia
julia> 6//9
2//3

julia> -4//8
-1//2

julia> 5//-15
-1//3

julia> -4//-12
1//3
```


This normalized form for a ratio of integers is unique, so equality of rational values can be tested by checking for equality of the numerator and denominator. The standardized numerator and denominator of a rational value can be extracted using the [`numerator`](/base/math#Base.numerator) and [`denominator`](/base/math#Base.denominator) functions:

```julia
julia> numerator(2//3)
2

julia> denominator(2//3)
3
```


Direct comparison of the numerator and denominator is generally not necessary, since the standard arithmetic and comparison operations are defined for rational values:

```julia
julia> 2//3 == 6//9
true

julia> 2//3 == 9//27
false

julia> 3//7 < 1//2
true

julia> 3//4 > 2//3
true

julia> 2//4 + 1//6
2//3

julia> 5//12 - 1//4
1//6

julia> 5//8 * 3//12
5//32

julia> 6//5 / 10//7
21//25
```


Rationals can easily be converted to floating-point numbers:

```julia
julia> float(3//4)
0.75
```


Conversion from rational to floating-point respects the following identity for any integral values of `a` and `b`, with the exception of the two cases `b == 0` and `a == 0 && b < 0`:

```julia
julia> a = 1; b = 2;

julia> isequal(float(a//b), a/b)
true
```


Constructing infinite rational values is acceptable:

```julia
julia> 5//0
1//0

julia> x = -3//0
-1//0

julia> typeof(x)
Rational{Int64}
```


Trying to construct a [`NaN`](/base/numbers#Base.NaN) rational value, however, is invalid:

```julia
julia> 0//0
ERROR: ArgumentError: invalid rational: zero(Int64)//zero(Int64)
Stacktrace:
[...]
```


As usual, the promotion system makes interactions with other numeric types effortless:

```julia
julia> 3//5 + 1
8//5

julia> 3//5 - 0.5
0.09999999999999998

julia> 2//7 * (1 + 2im)
2//7 + 4//7*im

julia> 2//7 * (1.5 + 2im)
0.42857142857142855 + 0.5714285714285714im

julia> 3//2 / (1 + 2im)
3//10 - 3//5*im

julia> 1//2 + 2im
1//2 + 2//1*im

julia> 1 + 2//3im
1//1 - 2//3*im

julia> 0.5 == 1//2
true

julia> 0.33 == 1//3
false

julia> 0.33 < 1//3
true

julia> 1//3 - 0.33
0.0033333333333332993
```

