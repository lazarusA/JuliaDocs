
# Base.Cartesian {#Base.Cartesian}

The (non-exported) Cartesian module provides macros that facilitate writing multidimensional algorithms. Most often you can write such algorithms with [straightforward techniques](https://julialang.org/blog/2016/02/iteration); however, there are a few cases where `Base.Cartesian` is still useful or necessary.

## Principles of usage {#Principles-of-usage}

A simple example of usage is:

```julia
@nloops 3 i A begin
    s += @nref 3 A i
end
```


which generates the following code:

```julia
for i_3 = axes(A, 3)
    for i_2 = axes(A, 2)
        for i_1 = axes(A, 1)
            s += A[i_1, i_2, i_3]
        end
    end
end
```


In general, Cartesian allows you to write generic code that contains repetitive elements, like the nested loops in this example.  Other applications include repeated expressions (e.g., loop unwinding) or creating function calls with variable numbers of arguments without using the &quot;splat&quot; construct (`i...`).

## Basic syntax {#Basic-syntax}

The (basic) syntax of `@nloops` is as follows:
- The first argument must be an integer (_not_ a variable) specifying the number of loops.
  
- The second argument is the symbol-prefix used for the iterator variable. Here we used `i`, and variables `i_1, i_2, i_3` were generated.
  
- The third argument specifies the range for each iterator variable. If you use a variable (symbol) here, it&#39;s taken as `axes(A, dim)`. More flexibly, you can use the anonymous-function expression syntax described below.
  
- The last argument is the body of the loop. Here, that&#39;s what appears between the `begin...end`.
  

There are some additional features of `@nloops` described in the [reference section](/devdocs/cartesian#dev-cartesian-reference).

`@nref` follows a similar pattern, generating `A[i_1,i_2,i_3]` from `@nref 3 A i`. The general practice is to read from left to right, which is why `@nloops` is `@nloops 3 i A expr` (as in `for i_2 = axes(A, 2)`, where `i_2` is to the left and the range is to the right) whereas `@nref` is `@nref 3 A i` (as in `A[i_1,i_2,i_3]`, where the array comes first).

If you&#39;re developing code with Cartesian, you may find that debugging is easier when you examine the generated code, using `@macroexpand`:



```julia
julia> @macroexpand @nref 2 A i
:(A[i_1, i_2])
```




### Supplying the number of expressions {#Supplying-the-number-of-expressions}

The first argument to both of these macros is the number of expressions, which must be an integer. When you&#39;re writing a function that you intend to work in multiple dimensions, this may not be something you want to hard-code. The recommended approach is to use a `@generated function`.  Here&#39;s an example:

```julia
@generated function mysum(A::Array{T,N}) where {T,N}
    quote
        s = zero(T)
        @nloops $N i A begin
            s += @nref $N A i
        end
        s
    end
end
```


Naturally, you can also prepare expressions or perform calculations before the `quote` block.

### Anonymous-function expressions as macro arguments {#Anonymous-function-expressions-as-macro-arguments}

Perhaps the single most powerful feature in `Cartesian` is the ability to supply anonymous-function expressions that get evaluated at parsing time.  Let&#39;s consider a simple example:

```julia
@nexprs 2 j->(i_j = 1)
```


`@nexprs` generates `n` expressions that follow a pattern. This code would generate the following statements:

```julia
i_1 = 1
i_2 = 1
```


In each generated statement, an &quot;isolated&quot; `j` (the variable of the anonymous function) gets replaced by values in the range `1:2`. Generally speaking, Cartesian employs a LaTeX-like syntax.  This allows you to do math on the index `j`.  Here&#39;s an example computing the strides of an array:

```julia
s_1 = 1
@nexprs 3 j->(s_{j+1} = s_j * size(A, j))
```


would generate expressions

```julia
s_1 = 1
s_2 = s_1 * size(A, 1)
s_3 = s_2 * size(A, 2)
s_4 = s_3 * size(A, 3)
```


Anonymous-function expressions have many uses in practice.

#### Macro reference {#dev-cartesian-reference}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@nloops' href='#Base.Cartesian.@nloops'>#</a>&nbsp;<b><u>Base.Cartesian.@nloops</u></b> &mdash; <i>Macro</i>.




```julia
@nloops N itersym rangeexpr bodyexpr
@nloops N itersym rangeexpr preexpr bodyexpr
@nloops N itersym rangeexpr preexpr postexpr bodyexpr
```


Generate `N` nested loops, using `itersym` as the prefix for the iteration variables. `rangeexpr` may be an anonymous-function expression, or a simple symbol `var` in which case the range is `axes(var, d)` for dimension `d`.

Optionally, you can provide &quot;pre&quot; and &quot;post&quot; expressions. These get executed first and last, respectively, in the body of each loop. For example:

```
@nloops 2 i A d -> j_d = min(i_d, 5) begin
    s += @nref 2 A j
end
```


would generate:

```
for i_2 = axes(A, 2)
    j_2 = min(i_2, 5)
    for i_1 = axes(A, 1)
        j_1 = min(i_1, 5)
        s += A[j_1, j_2]
    end
end
```


If you want just a post-expression, supply [`nothing`](/base/constants#Core.nothing) for the pre-expression. Using parentheses and semicolons, you can supply multi-statement expressions.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L9-L37)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@nref' href='#Base.Cartesian.@nref'>#</a>&nbsp;<b><u>Base.Cartesian.@nref</u></b> &mdash; <i>Macro</i>.




```julia
@nref N A indexexpr
```


Generate expressions like `A[i_1, i_2, ...]`. `indexexpr` can either be an iteration-symbol prefix, or an anonymous-function expression.

**Examples**

```julia
julia> @macroexpand Base.Cartesian.@nref 3 A i
:(A[i_1, i_2, i_3])
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L72-L83)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@nextract' href='#Base.Cartesian.@nextract'>#</a>&nbsp;<b><u>Base.Cartesian.@nextract</u></b> &mdash; <i>Macro</i>.




```julia
@nextract N esym isym
```


Generate `N` variables `esym_1`, `esym_2`, ..., `esym_N` to extract values from `isym`. `isym` can be either a `Symbol` or anonymous-function expression.

`@nextract 2 x y` would generate

```
x_1 = y[1]
x_2 = y[2]
```


while `@nextract 3 x d->y[2d-1]` yields

```
x_1 = y[1]
x_2 = y[3]
x_3 = y[5]
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L160-L177)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@nexprs' href='#Base.Cartesian.@nexprs'>#</a>&nbsp;<b><u>Base.Cartesian.@nexprs</u></b> &mdash; <i>Macro</i>.




```julia
@nexprs N expr
```


Generate `N` expressions. `expr` should be an anonymous-function expression.

**Examples**

```julia
julia> @macroexpand Base.Cartesian.@nexprs 4 i -> y[i] = A[i+j]
quote
    y[1] = A[1 + j]
    y[2] = A[2 + j]
    y[3] = A[3 + j]
    y[4] = A[4 + j]
end
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L139-L154)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@ncall' href='#Base.Cartesian.@ncall'>#</a>&nbsp;<b><u>Base.Cartesian.@ncall</u></b> &mdash; <i>Macro</i>.




```julia
@ncall N f sym...
```


Generate a function call expression. `sym` represents any number of function arguments, the last of which may be an anonymous-function expression and is expanded into `N` arguments.

For example, `@ncall 3 func a` generates

```
func(a_1, a_2, a_3)
```


while `@ncall 2 func a b i->c[i]` yields

```
func(a, b, c[1], c[2])
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L89-L103)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@ncallkw' href='#Base.Cartesian.@ncallkw'>#</a>&nbsp;<b><u>Base.Cartesian.@ncallkw</u></b> &mdash; <i>Macro</i>.




```julia
@ncallkw N f kw sym...
```


Generate a function call expression with keyword arguments `kw...`. As in the case of [`@ncall`](/devdocs/cartesian#Base.Cartesian.@ncall), `sym` represents any number of function arguments, the last of which may be an anonymous-function expression and is expanded into `N` arguments.

**Examples**

```julia
julia> using Base.Cartesian

julia> f(x...; a, b = 1, c = 2, d = 3) = +(x..., a, b, c, d);

julia> x_1, x_2 = (-1, -2); b = 0; kw = (c = 0, d = 0);

julia> @ncallkw 2 f (; a = 0, b, kw...) x
-3

```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L111-L130)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@ntuple' href='#Base.Cartesian.@ntuple'>#</a>&nbsp;<b><u>Base.Cartesian.@ntuple</u></b> &mdash; <i>Macro</i>.




```julia
@ntuple N expr
```


Generates an `N`-tuple. `@ntuple 2 i` would generate `(i_1, i_2)`, and `@ntuple 2 k->k+1` would generate `(2,3)`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L221-L226)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@nall' href='#Base.Cartesian.@nall'>#</a>&nbsp;<b><u>Base.Cartesian.@nall</u></b> &mdash; <i>Macro</i>.




```julia
@nall N expr
```


Check whether all of the expressions generated by the anonymous-function expression `expr` evaluate to `true`.

`@nall 3 d->(i_d > 1)` would generate the expression `(i_1 > 1 && i_2 > 1 && i_3 > 1)`. This can be convenient for bounds-checking.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L188-L196)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@nany' href='#Base.Cartesian.@nany'>#</a>&nbsp;<b><u>Base.Cartesian.@nany</u></b> &mdash; <i>Macro</i>.




```julia
@nany N expr
```


Check whether any of the expressions generated by the anonymous-function expression `expr` evaluate to `true`.

`@nany 3 d->(i_d > 1)` would generate the expression `(i_1 > 1 || i_2 > 1 || i_3 > 1)`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L205-L212)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cartesian.@nif' href='#Base.Cartesian.@nif'>#</a>&nbsp;<b><u>Base.Cartesian.@nif</u></b> &mdash; <i>Macro</i>.




```julia
@nif N conditionexpr expr
@nif N conditionexpr expr elseexpr
```


Generates a sequence of `if ... elseif ... else ... end` statements. For example:

```
@nif 3 d->(i_d >= size(A,d)) d->(error("Dimension ", d, " too big")) d->println("All OK")
```


would generate:

```
if i_1 > size(A, 1)
    error("Dimension ", 1, " too big")
elseif i_2 > size(A, 2)
    error("Dimension ", 2, " too big")
else
    println("All OK")
end
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/cartesian.jl#L232-L249)

</div>
<br>
