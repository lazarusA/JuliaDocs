
# Functions {#man-functions}

In Julia, a function is an object that maps a tuple of argument values to a return value. Julia functions are not pure mathematical functions, because they can alter and be affected by the global state of the program. The basic syntax for defining functions in Julia is:

```julia
julia> function f(x, y)
           x + y
       end
f (generic function with 1 method)
```


This function accepts two arguments `x` and `y` and returns the value of the last expression evaluated, which is `x + y`.

There is a second, more terse syntax for defining a function in Julia. The traditional function declaration syntax demonstrated above is equivalent to the following compact &quot;assignment form&quot;:

```julia
julia> f(x, y) = x + y
f (generic function with 1 method)
```


In the assignment form, the body of the function must be a single expression, although it can be a compound expression (see [Compound Expressions](/manual/control-flow#man-compound-expressions)). Short, simple function definitions are common in Julia. The short function syntax is accordingly quite idiomatic, considerably reducing both typing and visual noise.

A function is called using the traditional parenthesis syntax:

```julia
julia> f(2, 3)
5
```


Without parentheses, the expression `f` refers to the function object, and can be passed around like any other value:

```julia
julia> g = f;

julia> g(2, 3)
5
```


As with variables, Unicode can also be used for function names:

```julia
julia> ∑(x, y) = x + y
∑ (generic function with 1 method)

julia> ∑(2, 3)
5
```


## Argument Passing Behavior {#man-argument-passing}

Julia function arguments follow a convention sometimes called &quot;pass-by-sharing&quot;, which means that values are not copied when they are passed to functions. Function arguments themselves act as new variable _bindings_ (new &quot;names&quot; that can refer to values), much like [assignments](/manual/variables#man-assignment-expressions) `argument_name = argument_value`, so that the objects they refer to are identical to the passed values. Modifications to mutable values (such as `Array`s) made within a function will be visible to the caller. (This is the same behavior found in Scheme, most Lisps, Python, Ruby and Perl, among other dynamic languages.)

For example, in the function

```julia
function f(x, y)
    x[1] = 42    # mutates x
    y = 7 + y    # new binding for y, no mutation
    return y
end
```


The statement `x[1] = 42` _mutates_ the object `x`, and hence this change _will_ be visible in the array passed by the caller for this argument.   On the other hand, the assignment `y = 7 + y` changes the _binding_ (&quot;name&quot;) `y` to refer to a new value `7 + y`, rather than mutating the _original_ object referred to by `y`, and hence does _not_ change the corresponding argument passed by the caller.   This can be seen if we call `f(x, y)`:

```julia
julia> a = [4, 5, 6]
3-element Vector{Int64}:
 4
 5
 6

julia> b = 3
3

julia> f(a, b) # returns 7 + b == 10
10

julia> a  # a[1] is changed to 42 by f
3-element Vector{Int64}:
 42
  5
  6

julia> b  # not changed
3
```


As a common convention in Julia (not a syntactic requirement), such a function would [typically be named `f!(x, y)`](/base/punctuation#man-punctuation) rather than `f(x, y)`, as a visual reminder at the call site that at least one of the arguments (often the first one) is being mutated.

::: warning Shared memory between arguments

The behavior of a mutating function can be unexpected when a mutated argument shares memory with another argument, a situation known as aliasing (e.g. when one is a view of the other). Unless the function docstring explicitly indicates that aliasing produces the expected result, it is the responsibility of the caller to ensure proper behavior on such inputs.

:::

## Argument-type declarations {#Argument-type-declarations}

You can declare the types of function arguments by appending `::TypeName` to the argument name, as usual for [Type Declarations](/manual/types#Type-Declarations) in Julia. For example, the following function computes [Fibonacci numbers](https://en.wikipedia.org/wiki/Fibonacci_number) recursively:

```
fib(n::Integer) = n ≤ 2 ? one(n) : fib(n-1) + fib(n-2)
```


and the `::Integer` specification means that it will only be callable when `n` is a subtype of the [abstract](/manual/types#man-abstract-types) `Integer` type.

Argument-type declarations **normally have no impact on performance**: regardless of what argument types (if any) are declared, Julia compiles a specialized version of the function for the actual argument types passed by the caller.   For example, calling `fib(1)` will trigger the compilation of specialized version of `fib` optimized specifically for `Int` arguments, which is then re-used if `fib(7)` or `fib(15)` are called.  (There are rare exceptions when an argument-type declaration can trigger additional compiler specializations; see: [Be aware of when Julia avoids specializing](/manual/performance-tips#Be-aware-of-when-Julia-avoids-specializing).)  The most common reasons to declare argument types in Julia are, instead:
- **Dispatch:** As explained in [Methods](/manual/methods#Methods), you can have different versions (&quot;methods&quot;) of a function for different argument types, in which case the argument types are used to determine which implementation is called for which arguments.  For example, you might implement a completely different algorithm `fib(x::Number) = ...` that works for any `Number` type by using [Binet&#39;s formula](https://en.wikipedia.org/wiki/Fibonacci_number#Binet%27s_formula) to extend it to non-integer values.
  
- **Correctness:** Type declarations can be useful if your function only returns correct results for certain argument types.  For example, if we omitted argument types and wrote `fib(n) = n ≤ 2 ? one(n) : fib(n-1) + fib(n-2)`, then `fib(1.5)` would silently give us the nonsensical answer `1.0`.
  
- **Clarity:** Type declarations can serve as a form of documentation about the expected arguments.
  

However, it is a **common mistake to overly restrict the argument types**, which can unnecessarily limit the applicability of the function and prevent it from being re-used in circumstances you did not anticipate.    For example, the `fib(n::Integer)` function above works equally well for `Int` arguments (machine integers) and `BigInt` arbitrary-precision integers (see [BigFloats and BigInts](/base/numbers#BigFloats-and-BigInts)), which is especially useful because Fibonacci numbers grow exponentially rapidly and will quickly overflow any fixed-precision type like `Int` (see [Overflow behavior](/manual/integers-and-floating-point-numbers#Overflow-behavior)).  If we had declared our function as `fib(n::Int)`, however, the application to `BigInt` would have been prevented for no reason.   In general, you should use the most general applicable abstract types for arguments, and **when in doubt, omit the argument types**.  You can always add argument-type specifications later if they become necessary, and you don&#39;t sacrifice performance or functionality by omitting them.

## The `return` Keyword {#The-return-Keyword}

The value returned by a function is the value of the last expression evaluated, which, by default, is the last expression in the body of the function definition. In the example function, `f`, from the previous section this is the value of the expression `x + y`. As an alternative, as in many other languages, the `return` keyword causes a function to return immediately, providing an expression whose value is returned:

```julia
function g(x, y)
    return x * y
    x + y
end
```


Since function definitions can be entered into interactive sessions, it is easy to compare these definitions:

```julia
julia> f(x, y) = x + y
f (generic function with 1 method)

julia> function g(x, y)
           return x * y
           x + y
       end
g (generic function with 1 method)

julia> f(2, 3)
5

julia> g(2, 3)
6
```


Of course, in a purely linear function body like `g`, the usage of `return` is pointless since the expression `x + y` is never evaluated and we could simply make `x * y` the last expression in the function and omit the `return`. In conjunction with other control flow, however, `return` is of real use. Here, for example, is a function that computes the hypotenuse length of a right triangle with sides of length `x` and `y`, avoiding overflow:

```julia
julia> function hypot(x, y)
           x = abs(x)
           y = abs(y)
           if x > y
               r = y/x
               return x*sqrt(1 + r*r)
           end
           if y == 0
               return x
           end
           r = x/y
           return y*sqrt(1 + r*r)
       end
hypot (generic function with 1 method)

julia> hypot(3, 4)
5.0
```


There are three possible points of return from this function, returning the values of three different expressions, depending on the values of `x` and `y`. The `return` on the last line could be omitted since it is the last expression.

### Return type {#man-functions-return-type}

A return type can be specified in the function declaration using the `::` operator. This converts the return value to the specified type.

```julia
julia> function g(x, y)::Int8
           return x * y
       end;

julia> typeof(g(1, 2))
Int8
```


This function will always return an `Int8` regardless of the types of `x` and `y`. See [Type Declarations](/manual/types#Type-Declarations) for more on return types.

Return type declarations are **rarely used** in Julia: in general, you should instead write &quot;type-stable&quot; functions in which Julia&#39;s compiler can automatically infer the return type.  For more information, see the [Performance Tips](/manual/performance-tips#man-performance-tips) chapter.

### Returning nothing {#Returning-nothing}

For functions that do not need to return a value (functions used only for some side effects), the Julia convention is to return the value [`nothing`](/base/constants#Core.nothing):

```julia
function printx(x)
    println("x = $x")
    return nothing
end
```


This is a _convention_ in the sense that `nothing` is not a Julia keyword but only a singleton object of type `Nothing`. Also, you may notice that the `printx` function example above is contrived, because `println` already returns `nothing`, so that the `return` line is redundant.

There are two possible shortened forms for the `return nothing` expression. On the one hand, the `return` keyword implicitly returns `nothing`, so it can be used alone. On the other hand, since functions implicitly return their last expression evaluated, `nothing` can be used alone when it&#39;s the last expression. The preference for the expression `return nothing` as opposed to `return` or `nothing` alone is a matter of coding style.

## Operators Are Functions {#Operators-Are-Functions}

In Julia, most operators are just functions with support for special syntax. (The exceptions are operators with special evaluation semantics like `&&` and `||`. These operators cannot be functions since [Short-Circuit Evaluation](/manual/control-flow#Short-Circuit-Evaluation) requires that their operands are not evaluated before evaluation of the operator.) Accordingly, you can also apply them using parenthesized argument lists, just as you would any other function:

```julia
julia> 1 + 2 + 3
6

julia> +(1, 2, 3)
6
```


The infix form is exactly equivalent to the function application form – in fact the former is parsed to produce the function call internally. This also means that you can assign and pass around operators such as [`+`](/base/math#Base.:+) and [`*`](/base/math#Base.:*-Tuple{Any,%20Vararg{Any}}) just like you would with other function values:

```julia
julia> f = +;

julia> f(1, 2, 3)
6
```


Under the name `f`, the function does not support infix notation, however.

## Operators With Special Names {#Operators-With-Special-Names}

A few special expressions correspond to calls to functions with non-obvious names. These are:

| Expression            | Calls                                           |
|:--------------------- |:----------------------------------------------- |
| `[A B C ...]`         | [`hcat`](/base/arrays#Base.hcat)                |
| `[A; B; C; ...]`      | [`vcat`](/base/arrays#Base.vcat)                |
| `[A B; C D; ...]`     | [`hvcat`](/base/arrays#Base.hvcat)              |
| `[A; B;; C; D;; ...]` | [`hvncat`](/base/arrays#Base.hvncat)            |
| `A'`                  | [`adjoint`](/stdlib/LinearAlgebra#Base.adjoint) |
| `A[i]`                | [`getindex`](/base/collections#Base.getindex)   |
| `A[i] = x`            | [`setindex!`](/base/collections#Base.setindex!) |
| `A.n`                 | [`getproperty`](/base/base#Base.getproperty)    |
| `A.n = x`             | [`setproperty!`](/base/base#Base.setproperty!)  |


Note that expressions similar to `[A; B;; C; D;; ...]` but with more than two consecutive `;` also correspond to `hvncat` calls.

## Anonymous Functions {#man-anonymous-functions}

Functions in Julia are [first-class objects](https://en.wikipedia.org/wiki/First-class_citizen): they can be assigned to variables, and called using the standard function call syntax from the variable they have been assigned to. They can be used as arguments, and they can be returned as values. They can also be created anonymously, without being given a name, using either of these syntaxes:

```julia
julia> x -> x^2 + 2x - 1
#1 (generic function with 1 method)

julia> function (x)
           x^2 + 2x - 1
       end
#3 (generic function with 1 method)
```


Each statement creates a function taking one argument `x` and returning the value of the polynomial `x^2 + 2x - 1` at that value. Notice that the result is a generic function, but with a compiler-generated name based on consecutive numbering.

The primary use for anonymous functions is passing them to functions which take other functions as arguments. A classic example is [`map`](/base/collections#Base.map), which applies a function to each value of an array and returns a new array containing the resulting values:

```julia
julia> map(round, [1.2, 3.5, 1.7])
3-element Vector{Float64}:
 1.0
 4.0
 2.0
```


This is fine if a named function effecting the transform already exists to pass as the first argument to [`map`](/base/collections#Base.map). Often, however, a ready-to-use, named function does not exist. In these situations, the anonymous function construct allows easy creation of a single-use function object without needing a name:

```julia
julia> map(x -> x^2 + 2x - 1, [1, 3, -1])
3-element Vector{Int64}:
  2
 14
 -2
```


An anonymous function accepting multiple arguments can be written using the syntax `(x,y,z)->2x+y-z`.

Argument-type declarations for anonymous functions work as for named functions, for example `x::Integer->2x`. The return type of an anonymous function cannot be specified.

A zero-argument anonymous function can be written as `()->2+2`. The idea of a function with no arguments may seem strange, but is useful in cases where a result cannot (or should not) be precomputed. For example, Julia has a zero-argument [`time`](/base/base#Base.Libc.time-Tuple{}) function that returns the current time in seconds, and thus `seconds = ()->round(Int, time())` is an anonymous function that returns this time rounded to the nearest integer assigned to the variable `seconds`. Each time this anonymous function is called as `seconds()` the current time will be calculated and returned.

## Tuples {#Tuples}

Julia has a built-in data structure called a _tuple_ that is closely related to function arguments and return values. A tuple is a fixed-length container that can hold any values, but cannot be modified (it is _immutable_). Tuples are constructed with commas and parentheses, and can be accessed via indexing:

```julia
julia> (1, 1+1)
(1, 2)

julia> (1,)
(1,)

julia> x = (0.0, "hello", 6*7)
(0.0, "hello", 42)

julia> x[2]
"hello"
```


Notice that a length-1 tuple must be written with a comma, `(1,)`, since `(1)` would just be a parenthesized value. `()` represents the empty (length-0) tuple.

## Named Tuples {#Named-Tuples}

The components of tuples can optionally be named, in which case a _named tuple_ is constructed:

```julia
julia> x = (a=2, b=1+2)
(a = 2, b = 3)

julia> x[1]
2

julia> x.a
2
```


The fields of named tuples can be accessed by name using dot syntax (`x.a`) in addition to the regular indexing syntax (`x[1]` or `x[:a]`).

## Destructuring Assignment and Multiple Return Values {#destructuring-assignment}

A comma-separated list of variables (optionally wrapped in parentheses) can appear on the left side of an assignment: the value on the right side is _destructured_ by iterating over and assigning to each variable in turn:

```julia
julia> (a, b, c) = 1:3
1:3

julia> b
2
```


The value on the right should be an iterator (see [Iteration interface](/manual/interfaces#man-interface-iteration)) at least as long as the number of variables on the left (any excess elements of the iterator are ignored).

This can be used to return multiple values from functions by returning a tuple or other iterable value. For example, the following function returns two values:

```julia
julia> function foo(a, b)
           a+b, a*b
       end
foo (generic function with 1 method)
```


If you call it in an interactive session without assigning the return value anywhere, you will see the tuple returned:

```julia
julia> foo(2, 3)
(5, 6)
```


Destructuring assignment extracts each value into a variable:

```julia
julia> x, y = foo(2, 3)
(5, 6)

julia> x
5

julia> y
6
```


Another common use is for swapping variables:

```julia
julia> y, x = x, y
(5, 6)

julia> x
6

julia> y
5
```


If only a subset of the elements of the iterator are required, a common convention is to assign ignored elements to a variable consisting of only underscores `_` (which is an otherwise invalid variable name, see [Allowed Variable Names](/manual/variables#man-allowed-variable-names)):

```julia
julia> _, _, _, d = 1:10
1:10

julia> d
4
```


Other valid left-hand side expressions can be used as elements of the assignment list, which will call [`setindex!`](/base/collections#Base.setindex!) or [`setproperty!`](/base/base#Base.setproperty!), or recursively destructure individual elements of the iterator:

```julia
julia> X = zeros(3);

julia> X[1], (a, b) = (1, (2, 3))
(1, (2, 3))

julia> X
3-element Vector{Float64}:
 1.0
 0.0
 0.0

julia> a
2

julia> b
3
```


::: tip Julia 1.6

`...` with assignment requires Julia 1.6

:::

If the last symbol in the assignment list is suffixed by `...` (known as _slurping_), then it will be assigned a collection or lazy iterator of the remaining elements of the right-hand side iterator:

```julia
julia> a, b... = "hello"
"hello"

julia> a
'h': ASCII/Unicode U+0068 (category Ll: Letter, lowercase)

julia> b
"ello"

julia> a, b... = Iterators.map(abs2, 1:4)
Base.Generator{UnitRange{Int64}, typeof(abs2)}(abs2, 1:4)

julia> a
1

julia> b
Base.Iterators.Rest{Base.Generator{UnitRange{Int64}, typeof(abs2)}, Int64}(Base.Generator{UnitRange{Int64}, typeof(abs2)}(abs2, 1:4), 1)
```


See [`Base.rest`](/base/collections#Base.rest) for details on the precise handling and customization for specific iterators.

::: tip Julia 1.9

`...` in non-final position of an assignment requires Julia 1.9

:::

Slurping in assignments can also occur in any other position. As opposed to slurping the end of a collection however, this will always be eager.

```julia
julia> a, b..., c = 1:5
1:5

julia> a
1

julia> b
3-element Vector{Int64}:
 2
 3
 4

julia> c
5

julia> front..., tail = "Hi!"
"Hi!"

julia> front
"Hi"

julia> tail
'!': ASCII/Unicode U+0021 (category Po: Punctuation, other)
```


This is implemented in terms of the function [`Base.split_rest`](/base/collections#Base.split_rest).

Note that for variadic function definitions, slurping is still only allowed in final position. This does not apply to [single argument destructuring](/manual/functions#man-argument-destructuring) though, as that does not affect method dispatch:

```julia
julia> f(x..., y) = x
ERROR: syntax: invalid "..." on non-final argument
Stacktrace:
[...]

julia> f((x..., y)) = x
f (generic function with 1 method)

julia> f((1, 2, 3))
(1, 2)
```


## Property destructuring {#Property-destructuring}

Instead of destructuring based on iteration, the right side of assignments can also be destructured using property names. This follows the syntax for NamedTuples, and works by assigning to each variable on the left a property of the right side of the assignment with the same name using `getproperty`:

```julia
julia> (; b, a) = (a=1, b=2, c=3)
(a = 1, b = 2, c = 3)

julia> a
1

julia> b
2
```


## Argument destructuring {#man-argument-destructuring}

The destructuring feature can also be used within a function argument. If a function argument name is written as a tuple (e.g. `(x, y)`) instead of just a symbol, then an assignment `(x, y) = argument` will be inserted for you:

```julia
julia> minmax(x, y) = (y < x) ? (y, x) : (x, y)

julia> gap((min, max)) = max - min

julia> gap(minmax(10, 2))
8
```


Notice the extra set of parentheses in the definition of `gap`. Without those, `gap` would be a two-argument function, and this example would not work.

Similarly, property destructuring can also be used for function arguments:

```julia
julia> foo((; x, y)) = x + y
foo (generic function with 1 method)

julia> foo((x=1, y=2))
3

julia> struct A
           x
           y
       end

julia> foo(A(3, 4))
7
```


For anonymous functions, destructuring a single argument requires an extra comma:

```
julia> map(((x, y),) -> x + y, [(1, 2), (3, 4)])
2-element Array{Int64,1}:
 3
 7
```


## Varargs Functions {#Varargs-Functions}

It is often convenient to be able to write functions taking an arbitrary number of arguments. Such functions are traditionally known as &quot;varargs&quot; functions, which is short for &quot;variable number of arguments&quot;. You can define a varargs function by following the last positional argument with an ellipsis:

```julia
julia> bar(a, b, x...) = (a, b, x)
bar (generic function with 1 method)
```


The variables `a` and `b` are bound to the first two argument values as usual, and the variable `x` is bound to an iterable collection of the zero or more values passed to `bar` after its first two arguments:

```julia
julia> bar(1, 2)
(1, 2, ())

julia> bar(1, 2, 3)
(1, 2, (3,))

julia> bar(1, 2, 3, 4)
(1, 2, (3, 4))

julia> bar(1, 2, 3, 4, 5, 6)
(1, 2, (3, 4, 5, 6))
```


In all these cases, `x` is bound to a tuple of the trailing values passed to `bar`.

It is possible to constrain the number of values passed as a variable argument; this will be discussed later in [Parametrically-constrained Varargs methods](/manual/methods#Parametrically-constrained-Varargs-methods).

On the flip side, it is often handy to &quot;splat&quot; the values contained in an iterable collection into a function call as individual arguments. To do this, one also uses `...` but in the function call instead:

```julia
julia> x = (3, 4)
(3, 4)

julia> bar(1, 2, x...)
(1, 2, (3, 4))
```


In this case a tuple of values is spliced into a varargs call precisely where the variable number of arguments go. This need not be the case, however:

```julia
julia> x = (2, 3, 4)
(2, 3, 4)

julia> bar(1, x...)
(1, 2, (3, 4))

julia> x = (1, 2, 3, 4)
(1, 2, 3, 4)

julia> bar(x...)
(1, 2, (3, 4))
```


Furthermore, the iterable object splatted into a function call need not be a tuple:

```julia
julia> x = [3, 4]
2-element Vector{Int64}:
 3
 4

julia> bar(1, 2, x...)
(1, 2, (3, 4))

julia> x = [1, 2, 3, 4]
4-element Vector{Int64}:
 1
 2
 3
 4

julia> bar(x...)
(1, 2, (3, 4))
```


Also, the function that arguments are splatted into need not be a varargs function (although it often is):

```julia
julia> baz(a, b) = a + b;

julia> args = [1, 2]
2-element Vector{Int64}:
 1
 2

julia> baz(args...)
3

julia> args = [1, 2, 3]
3-element Vector{Int64}:
 1
 2
 3

julia> baz(args...)
ERROR: MethodError: no method matching baz(::Int64, ::Int64, ::Int64)
The function `baz` exists, but no method is defined for this combination of argument types.

Closest candidates are:
  baz(::Any, ::Any)
   @ Main none:1

Stacktrace:
[...]
```


As you can see, if the wrong number of elements are in the splatted container, then the function call will fail, just as it would if too many arguments were given explicitly.

## Optional Arguments {#Optional-Arguments}

It is often possible to provide sensible default values for function arguments. This can save users from having to pass every argument on every call. For example, the function [`Date(y, [m, d])`](/stdlib/Dates#Dates.Date) from `Dates` module constructs a `Date` type for a given year `y`, month `m` and day `d`. However, `m` and `d` arguments are optional and their default value is `1`. This behavior can be expressed concisely as:

```julia
julia> using Dates

julia> function date(y::Int64, m::Int64=1, d::Int64=1)
           err = Dates.validargs(Date, y, m, d)
           err === nothing || throw(err)
           return Date(Dates.UTD(Dates.totaldays(y, m, d)))
       end
date (generic function with 3 methods)
```


Observe, that this definition calls another method of the `Date` function that takes one argument of type `UTInstant{Day}`.

With this definition, the function can be called with either one, two or three arguments, and `1` is automatically passed when only one or two of the arguments are specified:

```julia
julia> date(2000, 12, 12)
2000-12-12

julia> date(2000, 12)
2000-12-01

julia> date(2000)
2000-01-01
```


Optional arguments are actually just a convenient syntax for writing multiple method definitions with different numbers of arguments (see [Note on Optional and keyword Arguments](/manual/methods#Note-on-Optional-and-keyword-Arguments)). This can be checked for our `date` function example by calling the `methods` function:

```julia
julia> methods(date)
# 3 methods for generic function "date":
[1] date(y::Int64) in Main at REPL[1]:1
[2] date(y::Int64, m::Int64) in Main at REPL[1]:1
[3] date(y::Int64, m::Int64, d::Int64) in Main at REPL[1]:1
```


## Keyword Arguments {#Keyword-Arguments}

Some functions need a large number of arguments, or have a large number of behaviors. Remembering how to call such functions can be difficult. Keyword arguments can make these complex interfaces easier to use and extend by allowing arguments to be identified by name instead of only by position.

For example, consider a function `plot` that plots a line. This function might have many options, for controlling line style, width, color, and so on. If it accepts keyword arguments, a possible call might look like `plot(x, y, width=2)`, where we have chosen to specify only line width. Notice that this serves two purposes. The call is easier to read, since we can label an argument with its meaning. It also becomes possible to pass any subset of a large number of arguments, in any order.

Functions with keyword arguments are defined using a semicolon in the signature:

```julia
function plot(x, y; style="solid", width=1, color="black")
    ###
end
```


When the function is called, the semicolon is optional: one can either call `plot(x, y, width=2)` or `plot(x, y; width=2)`, but the former style is more common. An explicit semicolon is required only for passing varargs or computed keywords as described below.

Keyword argument default values are evaluated only when necessary (when a corresponding keyword argument is not passed), and in left-to-right order. Therefore default expressions may refer to prior keyword arguments.

The types of keyword arguments can be made explicit as follows:

```julia
function f(; x::Int=1)
    ###
end
```


Keyword arguments can also be used in varargs functions:

```julia
function plot(x...; style="solid")
    ###
end
```


Extra keyword arguments can be collected using `...`, as in varargs functions:

```julia
function f(x; y=0, kwargs...)
    ###
end
```


Inside `f`, `kwargs` will be an immutable key-value iterator over a named tuple. Named tuples (as well as dictionaries with keys of `Symbol`, and other iterators yielding two-value collections with symbol as first values) can be passed as keyword arguments using a semicolon in a call, e.g. `f(x, z=1; kwargs...)`.

If a keyword argument is not assigned a default value in the method definition, then it is _required_: an [`UndefKeywordError`](/base/base#Core.UndefKeywordError) exception will be thrown if the caller does not assign it a value:

```julia
function f(x; y)
    ###
end
f(3, y=5) # ok, y is assigned
f(3)      # throws UndefKeywordError(:y)
```


One can also pass `key => value` expressions after a semicolon. For example, `plot(x, y; :width => 2)` is equivalent to `plot(x, y, width=2)`. This is useful in situations where the keyword name is computed at runtime.

When a bare identifier or dot expression occurs after a semicolon, the keyword argument name is implied by the identifier or field name. For example `plot(x, y; width)` is equivalent to `plot(x, y; width=width)` and `plot(x, y; options.width)` is equivalent to `plot(x, y; width=options.width)`.

The nature of keyword arguments makes it possible to specify the same argument more than once. For example, in the call `plot(x, y; options..., width=2)` it is possible that the `options` structure also contains a value for `width`. In such a case the rightmost occurrence takes precedence; in this example, `width` is certain to have the value `2`. However, explicitly specifying the same keyword argument multiple times, for example `plot(x, y, width=2, width=3)`, is not allowed and results in a syntax error.

## Evaluation Scope of Default Values {#Evaluation-Scope-of-Default-Values}

When optional and keyword argument default expressions are evaluated, only _previous_ arguments are in scope. For example, given this definition:

```julia
function f(x, a=b, b=1)
    ###
end
```


the `b` in `a=b` refers to a `b` in an outer scope, not the subsequent argument `b`.

## Do-Block Syntax for Function Arguments {#Do-Block-Syntax-for-Function-Arguments}

Passing functions as arguments to other functions is a powerful technique, but the syntax for it is not always convenient. Such calls are especially awkward to write when the function argument requires multiple lines. As an example, consider calling [`map`](/base/collections#Base.map) on a function with several cases:

```julia
map(x->begin
           if x < 0 && iseven(x)
               return 0
           elseif x == 0
               return 1
           else
               return x
           end
       end,
    [A, B, C])
```


Julia provides a reserved word `do` for rewriting this code more clearly:

```julia
map([A, B, C]) do x
    if x < 0 && iseven(x)
        return 0
    elseif x == 0
        return 1
    else
        return x
    end
end
```


The `do x` syntax creates an anonymous function with argument `x` and passes the anonymous function as the first argument to the &quot;outer&quot; function - [`map`](/base/collections#Base.map) in this example. Similarly, `do a,b` would create a two-argument anonymous function. Note that `do (a,b)` would create a one-argument anonymous function, whose argument is a tuple to be deconstructed. A plain `do` would declare that what follows is an anonymous function of the form `() -> ...`.

How these arguments are initialized depends on the &quot;outer&quot; function; here, [`map`](/base/collections#Base.map) will sequentially set `x` to `A`, `B`, `C`, calling the anonymous function on each, just as would happen in the syntax `map(func, [A, B, C])`.

This syntax makes it easier to use functions to effectively extend the language, since calls look like normal code blocks. There are many possible uses quite different from [`map`](/base/collections#Base.map), such as managing system state. For example, there is a version of [`open`](/base/io-network#Base.open) that runs code ensuring that the opened file is eventually closed:

```julia
open("outfile", "w") do io
    write(io, data)
end
```


This is accomplished by the following definition:

```julia
function open(f::Function, args...)
    io = open(args...)
    try
        f(io)
    finally
        close(io)
    end
end
```


Here, [`open`](/base/io-network#Base.open) first opens the file for writing and then passes the resulting output stream to the anonymous function you defined in the `do ... end` block. After your function exits, [`open`](/base/io-network#Base.open) will make sure that the stream is properly closed, regardless of whether your function exited normally or threw an exception. (The `try/finally` construct will be described in [Control Flow](/manual/control-flow#Control-Flow).)

With the `do` block syntax, it helps to check the documentation or implementation to know how the arguments of the user function are initialized.

A `do` block, like any other inner function, can &quot;capture&quot; variables from its enclosing scope. For example, the variable `data` in the above example of `open...do` is captured from the outer scope. Captured variables can create performance challenges as discussed in [performance tips](/manual/performance-tips#man-performance-captured).

## Function composition and piping {#Function-composition-and-piping}

Functions in Julia can be combined by composing or piping (chaining) them together.

Function composition is when you combine functions together and apply the resulting composition to arguments. You use the function composition operator (`∘`) to compose the functions, so `(f ∘ g)(args...; kw...)` is the same as `f(g(args...; kw...))`.

You can type the composition operator at the REPL and suitably-configured editors using `\circ<tab>`.

For example, the `sqrt` and `+` functions can be composed like this:

```julia
julia> (sqrt ∘ +)(3, 6)
3.0
```


This adds the numbers first, then finds the square root of the result.

The next example composes three functions and maps the result over an array of strings:

```julia
julia> map(first ∘ reverse ∘ uppercase, split("you can compose functions like this"))
6-element Vector{Char}:
 'U': ASCII/Unicode U+0055 (category Lu: Letter, uppercase)
 'N': ASCII/Unicode U+004E (category Lu: Letter, uppercase)
 'E': ASCII/Unicode U+0045 (category Lu: Letter, uppercase)
 'S': ASCII/Unicode U+0053 (category Lu: Letter, uppercase)
 'E': ASCII/Unicode U+0045 (category Lu: Letter, uppercase)
 'S': ASCII/Unicode U+0053 (category Lu: Letter, uppercase)
```


Function chaining (sometimes called &quot;piping&quot; or &quot;using a pipe&quot; to send data to a subsequent function) is when you apply a function to the previous function&#39;s output:

```julia
julia> 1:10 |> sum |> sqrt
7.416198487095663
```


Here, the total produced by `sum` is passed to the `sqrt` function. The equivalent composition would be:

```julia
julia> (sqrt ∘ sum)(1:10)
7.416198487095663
```


The pipe operator can also be used with broadcasting, as `.|>`, to provide a useful combination of the chaining/piping and dot vectorization syntax (described below).

```julia
julia> ["a", "list", "of", "strings"] .|> [uppercase, reverse, titlecase, length]
4-element Vector{Any}:
  "A"
  "tsil"
  "Of"
 7
```


When combining pipes with anonymous functions, parentheses must be used if subsequent pipes are not to be parsed as part of the anonymous function&#39;s body. Compare:

```julia
julia> 1:3 .|> (x -> x^2) |> sum |> sqrt
3.7416573867739413

julia> 1:3 .|> x -> x^2 |> sum |> sqrt
3-element Vector{Float64}:
 1.0
 2.0
 3.0
```


## Dot Syntax for Vectorizing Functions {#man-vectorized}

In technical-computing languages, it is common to have &quot;vectorized&quot; versions of functions, which simply apply a given function `f(x)` to each element of an array `A` to yield a new array via `f(A)`. This kind of syntax is convenient for data processing, but in other languages vectorization is also often required for performance: if loops are slow, the &quot;vectorized&quot; version of a function can call fast library code written in a low-level language. In Julia, vectorized functions are _not_ required for performance, and indeed it is often beneficial to write your own loops (see [Performance Tips](/manual/performance-tips#man-performance-tips)), but they can still be convenient. Therefore, _any_ Julia function `f` can be applied elementwise to any array (or other collection) with the syntax `f.(A)`. For example, `sin` can be applied to all elements in the vector `A` like so:

```julia
julia> A = [1.0, 2.0, 3.0]
3-element Vector{Float64}:
 1.0
 2.0
 3.0

julia> sin.(A)
3-element Vector{Float64}:
 0.8414709848078965
 0.9092974268256817
 0.1411200080598672
```


Of course, you can omit the dot if you write a specialized &quot;vector&quot; method of `f`, e.g. via `f(A::AbstractArray) = map(f, A)`, and this is just as efficient as `f.(A)`. The advantage of the `f.(A)` syntax is that which functions are vectorizable need not be decided upon in advance by the library writer.

More generally, `f.(args...)` is actually equivalent to `broadcast(f, args...)`, which allows you to operate on multiple arrays (even of different shapes), or a mix of arrays and scalars (see [Broadcasting](/manual/arrays#Broadcasting)). For example, if you have `f(x, y) = 3x + 4y`, then `f.(pi, A)` will return a new array consisting of `f(pi,a)` for each `a` in `A`, and `f.(vector1, vector2)` will return a new vector consisting of `f(vector1[i], vector2[i])` for each index `i` (throwing an exception if the vectors have different length).

```julia
julia> f(x, y) = 3x + 4y;

julia> A = [1.0, 2.0, 3.0];

julia> B = [4.0, 5.0, 6.0];

julia> f.(pi, A)
3-element Vector{Float64}:
 13.42477796076938
 17.42477796076938
 21.42477796076938

julia> f.(A, B)
3-element Vector{Float64}:
 19.0
 26.0
 33.0
```


Keyword arguments are not broadcasted over, but are simply passed through to each call of the function.  For example, `round.(x, digits=3)` is equivalent to `broadcast(x -> round(x, digits=3), x)`.

Moreover, _nested_ `f.(args...)` calls are _fused_ into a single `broadcast` loop. For example, `sin.(cos.(X))` is equivalent to `broadcast(x -> sin(cos(x)), X)`, similar to `[sin(cos(x)) for x in X]`: there is only a single loop over `X`, and a single array is allocated for the result. [In contrast, `sin(cos(X))` in a typical &quot;vectorized&quot; language would first allocate one temporary array for `tmp=cos(X)`, and then compute `sin(tmp)` in a separate loop, allocating a second array.] This loop fusion is not a compiler optimization that may or may not occur, it is a _syntactic guarantee_ whenever nested `f.(args...)` calls are encountered. Technically, the fusion stops as soon as a &quot;non-dot&quot; function call is encountered; for example, in `sin.(sort(cos.(X)))` the `sin` and `cos` loops cannot be merged because of the intervening `sort` function.

Finally, the maximum efficiency is typically achieved when the output array of a vectorized operation is _pre-allocated_, so that repeated calls do not allocate new arrays over and over again for the results (see [Pre-allocating outputs](/base/math#Base.:--Tuple{Any,%20Any})). A convenient syntax for this is `X .= ...`, which is equivalent to `broadcast!(identity, X, ...)` except that, as above, the `broadcast!` loop is fused with any nested &quot;dot&quot; calls. For example, `X .= sin.(Y)` is equivalent to `broadcast!(sin, X, Y)`, overwriting `X` with `sin.(Y)` in-place. If the left-hand side is an array-indexing expression, e.g. `X[begin+1:end] .= sin.(Y)`, then it translates to `broadcast!` on a `view`, e.g. `broadcast!(sin, view(X, firstindex(X)+1:lastindex(X)), Y)`, so that the left-hand side is updated in-place.

Since adding dots to many operations and function calls in an expression can be tedious and lead to code that is difficult to read, the macro [`@.`](/base/arrays#Base.Broadcast.@__dot__) is provided to convert _every_ function call, operation, and assignment in an expression into the &quot;dotted&quot; version.

```julia
julia> Y = [1.0, 2.0, 3.0, 4.0];

julia> X = similar(Y); # pre-allocate output array

julia> @. X = sin(cos(Y)) # equivalent to X .= sin.(cos.(Y))
4-element Vector{Float64}:
  0.5143952585235492
 -0.4042391538522658
 -0.8360218615377305
 -0.6080830096407656
```


Binary (or unary) operators like `.+` are handled with the same mechanism: they are equivalent to `broadcast` calls and are fused with other nested &quot;dot&quot; calls.  `X .+= Y` etcetera is equivalent to `X .= X .+ Y` and results in a fused in-place assignment;  see also [dot operators](/manual/mathematical-operations#man-dot-operators).

You can also combine dot operations with function chaining using [`|>`](/base/base#Base.:|>), as in this example:

```julia
julia> 1:5 .|> [x->x^2, inv, x->2*x, -, isodd]
5-element Vector{Real}:
    1
    0.5
    6
   -4
 true
```


All functions in the fused broadcast are always called for every element of the result. Thus `X .+ σ .* randn.()` will add a mask of independent and identically sampled random values to each element of the array `X`, but `X .+ σ .* randn()` will add the _same_ random sample to each element. In cases where the fused computation is constant along one or more axes of the broadcast iteration, it may be possible to leverage a space-time tradeoff and allocate intermediate values to reduce the number of computations. See more at [performance tips](/manual/performance-tips#man-performance-unfuse).

## Further Reading {#Further-Reading}

We should mention here that this is far from a complete picture of defining functions. Julia has a sophisticated type system and allows multiple dispatch on argument types. None of the examples given here provide any type annotations on their arguments, meaning that they are applicable to all types of arguments. The type system is described in [Types](/manual/types#man-types) and defining a function in terms of methods chosen by multiple dispatch on run-time argument types is described in [Methods](/manual/methods#Methods).
