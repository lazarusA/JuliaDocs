
# Julia Syntax Highlighting {#Julia-Syntax-Highlighting}

The `JuliaSyntaxHighlighting` library serves as a small convenience package to syntax highlight Julia code using `JuliaSyntax` and `StyledStrings`.

It is intended for use across the standard library, and the wider ecosystem.

## Functions {#stdlib-jsh-api}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='JuliaSyntaxHighlighting.highlight' href='#JuliaSyntaxHighlighting.highlight'>#</a>&nbsp;<b><u>JuliaSyntaxHighlighting.highlight</u></b> &mdash; <i>Function</i>.




```julia
highlight(content::Union{AbstractString, IO},
          ast::JuliaSyntax.GreenNode = <parsed content>;
          syntax_errors::Bool = false) -> AnnotatedString{String}
```


Apply syntax highlighting to `content` using `JuliaSyntax`.

By default, `JuliaSyntax.parseall` is used to generate to `ast` with the `ignore_errors` keyword argument set to `true`. Alternatively, one may provide a pre-generated `ast`.

When `syntax_errors` is set, the `julia_error` face is applied to detected syntax errors.

::: warning Warning

Note that the particular faces used by `JuliaSyntax`, and the way they are applied, is subject to change.

:::

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



[source](https://github.com/julialang/JuliaSyntaxHighlighting.jl/blob/b89dd99db56700c47434df6106b6c6afd1c9ed01/src/JuliaSyntaxHighlighting.jl#L351-L383)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='JuliaSyntaxHighlighting.highlight!' href='#JuliaSyntaxHighlighting.highlight!'>#</a>&nbsp;<b><u>JuliaSyntaxHighlighting.highlight!</u></b> &mdash; <i>Function</i>.




```julia
highlight!(content::Union{AnnotatedString, SubString{AnnotatedString}},
           ast::JuliaSyntax.GreenNode = <parsed content>;
           syntax_errors::Bool = false) -> content
```


Modify `content` by applying syntax highlighting using `JuliaSyntax`.

By default, `JuliaSyntax.parseall` is used to generate to `ast` with the `ignore_errors` keyword argument set to `true`. Alternatively, one may provide a pre-generated `ast`.

When `syntax_errors` is set, the `julia_error` face is applied to detected syntax errors.

::: warning Warning

Note that the particular faces used by `JuliaSyntax`, and the way they are applied, is subject to change.

:::

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



[source](https://github.com/julialang/JuliaSyntaxHighlighting.jl/blob/b89dd99db56700c47434df6106b6c6afd1c9ed01/src/JuliaSyntaxHighlighting.jl#L398-L433)

</div>
<br>

## Faces {#stdlib-jsh-faces}

The `highlight`/`highlight!` methods work by applying custom faces to Julia code. As part of the standard library, these faces use privileged face names, of the form `julia_*`. These can be re-used in other packages, and customised with `faces.toml` configuration.

::: warning Unstable faces

The particular faces used by `JuliaSyntaxHighlighting` are liable to change without warning in point releases. As the syntax highlighting rules are refined over time, changes should become less and less frequent though.

:::

The current set of faces, and their default values are as follows:
- `julia_macro`: magenta
  
- `julia_symbol`: magenta
  
- `julia_singleton_identifier`: inherits from `julia_symbol`
  
- `julia_type`: yellow
  
- `julia_typedec`: bright blue
  
- `julia_comment`: grey
  
- `julia_string`: green
  
- `julia_regex`: inherits from `julia_string`
  
- `julia_backslash_literal`: magenta, inherits from `julia_string`
  
- `julia_string_delim`: bright green
  
- `julia_cmdstring`: inherits from `julia_string`
  
- `julia_char`: inherits from `julia_string`
  
- `julia_char_delim`: inherits from `julia_string_delim`
  
- `julia_number`: bright magenta
  
- `julia_bool`: inherits from `julia_number`
  
- `julia_funcall`: cyan
  
- `julia_broadcast`: bright blue, bold
  
- `julia_builtin`: bright blue
  
- `julia_operator`: blue
  
- `julia_comparator`: inherits from `julia_operator`
  
- `julia_assignment`: bright red
  
- `julia_keyword`: red
  
- `julia_parentheses`: unstyled
  
- `julia_unpaired_parentheses`: inherit from `julia_error` and `julia_parentheses`
  
- `julia_error`: red background
  
- `julia_rainbow_paren_1`: bright green, inherits from `julia_parentheses`
  
- `julia_rainbow_paren_2`: bright blue, inherits from `julia_parentheses`
  
- `julia_rainbow_paren_3`: bright red, inherits from `julia_parentheses`
  
- `julia_rainbow_paren_4`: inherits from `julia_rainbow_paren_1`
  
- `julia_rainbow_paren_5`: inherits from `julia_rainbow_paren_2`
  
- `julia_rainbow_paren_6`: inherits from `julia_rainbow_paren_3`
  
- `julia_rainbow_bracket_1`: blue, inherits from `julia_parentheses`
  
- `julia_rainbow_bracket_2`: bright_magenta, inherits from `julia_parentheses`
  
- `julia_rainbow_bracket_3`: inherits from `julia_rainbow_bracket_1`
  
- `julia_rainbow_bracket_4`: inherits from `julia_rainbow_bracket_2`
  
- `julia_rainbow_bracket_5`: inherits from `julia_rainbow_bracket_1`
  
- `julia_rainbow_bracket_6`: inherits from `julia_rainbow_bracket_2`
  
- `julia_rainbow_curly_1`: bright yellow, inherits from `julia_parentheses`
  
- `julia_rainbow_curly_2`: yellow, inherits from `julia_parentheses`
  
- `julia_rainbow_curly_3`: inherits from `julia_rainbow_curly_1`
  
- `julia_rainbow_curly_4`: inherits from `julia_rainbow_curly_2`
  
- `julia_rainbow_curly_5`: inherits from `julia_rainbow_curly_1`
  
- `julia_rainbow_curly_6`: inherits from `julia_rainbow_curly_2`
  
