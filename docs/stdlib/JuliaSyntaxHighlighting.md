
# Julia Syntax Highlighting {#Julia-Syntax-Highlighting}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='JuliaSyntaxHighlighting.highlight' href='#JuliaSyntaxHighlighting.highlight'>#</a>&nbsp;<b><u>JuliaSyntaxHighlighting.highlight</u></b> &mdash; <i>Function</i>.




```julia
highlight(content::Union{AbstractString, IOBuffer, IOContext{IOBuffer}})
```


Apply syntax highlighting to `content` using `JuliaSyntax`.

Returns an `AnnotatedString{String}`.

**Examples**

```julia
julia> JuliaSyntaxHighlighting.highlight("sum(1:8)")
"sum(1:8)"

julia> JuliaSyntaxHighlighting.highlight("sum(1:8)") |> Base.annotations
6-element Vector{Tuple{UnitRange{Int64}, Pair{Symbol, Any}}}:
 (1:3, :face => :julia_funcall)
 (4:4, :face => :julia_rainbow_paren_1)
 (5:5, :face => :julia_number)
 (6:6, :face => :julia_operator)
 (7:7, :face => :julia_number)
 (8:8, :face => :julia_rainbow_paren_1)
```



[source](https://github.com/julialang/JuliaSyntaxHighlighting.jl/blob/4110caaf4fcdf0c614fd3ecd7c5bf589ca82ac63/src/JuliaSyntaxHighlighting.jl#L146-L168)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='JuliaSyntaxHighlighting.highlight!' href='#JuliaSyntaxHighlighting.highlight!'>#</a>&nbsp;<b><u>JuliaSyntaxHighlighting.highlight!</u></b> &mdash; <i>Function</i>.




```julia
highlight!(content::Union{AnnotatedString, SubString{AnnotatedString}})
```


Modify `content` by applying syntax highlighting using `JuliaSyntax`.

**Examples**

```julia
julia> str = Base.AnnotatedString("sum(1:8)")
"sum(1:8)"

julia> JuliaSyntaxHighlighting.highlight!(str)
"sum(1:8)"

julia> Base.annotations(str)
6-element Vector{Tuple{UnitRange{Int64}, Pair{Symbol, Any}}}:
 (1:3, :face => :julia_funcall)
 (4:4, :face => :julia_rainbow_paren_1)
 (5:5, :face => :julia_number)
 (6:6, :face => :julia_operator)
 (7:7, :face => :julia_number)
 (8:8, :face => :julia_rainbow_paren_1)
```



[source](https://github.com/julialang/JuliaSyntaxHighlighting.jl/blob/4110caaf4fcdf0c614fd3ecd7c5bf589ca82ac63/src/JuliaSyntaxHighlighting.jl#L182-L205)

</div>
<br>
