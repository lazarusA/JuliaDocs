
# StyledStrings {#stdlib-styledstrings}

## Styling {#stdlib-styledstrings-styling}

When working with strings, formatting and styling often appear as a secondary concern.

::: tip Note

For instance, when printing to a terminal you might want to sprinkle [ANSI escape sequences](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters) in the output, when outputting HTML styling constructs (`<span style="...">`, etc.) serve a similar purpose, and so on. It is possible to simply insert the raw styling constructs into the string next to the content itself, but it quickly becomes apparent that this is not well suited for anything but the most basic use-cases. Not all terminals support the same ANSI codes, the styling constructs need to be painstakingly removed when calculating the width of already-styled content, and that&#39;s before you even get into handling multiple output formats.

:::

Instead of leaving this headache to be widely experienced downstream, it is tackled head-on by the introduction of a special string type ([`AnnotatedString`](/base/strings#Base.AnnotatedString)). This string type wraps any other string type and allows for formating information to be applied to regions (e.g. characters 1 through to 7 are bold and red).

Regions of a string are styled by applying [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s to them —a structure that holds styling information— (think &quot;typeface&quot;). As a convenience, it is possible to name a face in the global faces dictionary instead of giving the [`Face`](/stdlib/StyledStrings#StyledStrings.Face) directly.

Along with these capabilities, we also provide a convenient way for constructing [`AnnotatedString`](/base/strings#Base.AnnotatedString)s, detailed in [Styled String Literals](/stdlib/StyledStrings#stdlib-styledstring-literals).

```julia
julia> styled"{yellow:hello} {blue:there}"
"hello there" # prints with colour in the REPL
```


## Styling via [`AnnotatedString`](/base/strings#Base.AnnotatedString)s {#Styling-via-[AnnotatedString](@ref-Base.AnnotatedString)s}

## Faces {#stdlib-styledstrings-faces}

### The `Face` type {#The-Face-type}

A [`Face`](/stdlib/StyledStrings#StyledStrings.Face) specifies details of a typeface that text can be set in. It covers a set of basic attributes that generalise well across different formats, namely:
- `height`
  
- `weight`
  
- `slant`
  
- `foreground`
  
- `background`
  
- `underline`
  
- `strikethrough`
  
- `inverse`
  
- `inherit`
  

For details on the particular forms these attributes take, see the [`Face`](/stdlib/StyledStrings#StyledStrings.Face) docstring, but of particular interest is `inherit` as it allows you to _inherit_ attributes from other [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s.

### The global faces dictionary {#The-global-faces-dictionary}

To make referring to particular styles more convenient, there is a global `Dict{Symbol, Face}` that allows for [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s to be referred to simply by name. Packages can add faces to this dictionary via the [`addface!`](/stdlib/StyledStrings#StyledStrings.addface!) function, and the loaded faces can be easily [customised](/stdlib/StyledStrings#stdlib-styledstrings-face-toml).

::: warning Warning

Any package registering new faces should ensure that they are prefixed by the package name, i.e. follow the format `mypackage_myface`. This is important for predictability, and to prevent name clashes.

:::

There is one set of exemptions to the package-prefix rule, the set of basic faces that are part of the default value of the faces dictionary.

#### Basic faces {#stdlib-styledstrings-basic-faces}

Basic faces are intended represent a general idea, that is widely applicable.

For setting some text with a certain attribute, we have the `bold`, `light`, `italic`, `underline`, `strikethrough`, and `inverse` faces.

There are also named faces for the 16 terminal colours: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `bright_black`/`grey`/`gray`, `bright_red`, `bright_green`, `bright_blue`, `bright_magenta`, `bright_cyan`, and `bright_white`.

For shadowed text (i.e. dim but there) there is the `shadow` face. To indicate a selected region, there is the `region` face. Similarly for emphasis and highlighting the `emphasis` and `highlight` faces are defined. There is also `code` for code-like text.

For visually indicating the severity of messages the `error`, `warning`, `success`, `info`, `note`, and `tip` faces are defined.

### Customisation of faces (`Faces.toml`) {#stdlib-styledstrings-face-toml}

It is good for the name faces in the global face dictionary to be customizable. Theming and aesthetics are nice, and it is important for accessibility reasons too. A TOML file can be parsed into a list of [`Face`](/stdlib/StyledStrings#StyledStrings.Face) specifications that are merged with the pre-existing entry in the face dictionary.

A [`Face`](/stdlib/StyledStrings#StyledStrings.Face) is represented in TOML like so:

```toml
[facename]
attribute = "value"
...

[package.facename]
attribute = "value"
```


For example, if the `shadow` face is too hard to read it can be made brighter like so:

```toml
[shadow]
foreground = "white"
```


### Applying faces to a `AnnotatedString` {#Applying-faces-to-a-AnnotatedString}

By convention, the `:face` attributes of a [`AnnotatedString`](/base/strings#Base.AnnotatedString) hold information on the [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s that currently apply. This can be given in multiple forms, as a single `Symbol` naming a [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s in the global face dictionary, a [`Face`](/stdlib/StyledStrings#StyledStrings.Face) itself, or a vector of either.

The `show(::IO, ::MIME"text/plain", ::AnnotatedString)` and `show(::IO, ::MIME"text/html", ::AnnotatedString)` methods both look at the `:face` attributes and merge them all together when determining the overall styling.

We can supply `:face` attributes to a `AnnotatedString` during construction, add them to the properties list afterwards, or use the convenient [Styled String literals](/stdlib/StyledStrings#stdlib-styledstring-literals).

```julia
julia> str1 = Base.AnnotatedString("blue text", [(1:9, :face => :blue)])
"blue text"

julia> str2 = styled"{blue:blue text}"
"blue text"

julia> str1 == str2
true

julia> sprint(print, str1, context = :color => true)
"\e[34mblue text\e[39m"

julia> sprint(show, MIME("text/html"), str1, context = :color => true)
"<pre><span style=\"color: #000080;\">blue text</span></pre>"
```


## Styled String Literals {#stdlib-styledstring-literals}

To ease construction of [`AnnotatedString`](/base/strings#Base.AnnotatedString)s with [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s applied, the [`styled"..."`](/stdlib/StyledStrings#StyledStrings.@styled_str) styled string literal allows for the content and attributes to be easily expressed together via a custom grammar.

Within a [`styled"..."`](/stdlib/StyledStrings#StyledStrings.@styled_str) literal, curly parenthesis are considered special characters and must be escaped in normal usage (`\{`, `\}`). This allows them to be used to express annotations with (nestable) `{annotations...:text}` constructs.

The `annotations...` component is a comma-separated list of three types of annotations.
- Face names
  
- Inline `Face` expressions `(key=val,...)`
  
- `key=value` pairs
  

Interpolation is possible everywhere except for inline face keys.

For more information on the grammar, see the extended help of the [`styled"..."`](/stdlib/StyledStrings#StyledStrings.@styled_str) docstring.

## API reference {#stdlib-styledstrings-api}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='StyledStrings.@styled_str' href='#StyledStrings.@styled_str'>#</a>&nbsp;<b><u>StyledStrings.@styled_str</u></b> &mdash; <i>Macro</i>.




```julia
@styled_str -> AnnotatedString
```


Construct a styled string. Within the string, `{<specs>:<content>}` structures apply the formatting to `<content>`, according to the list of comma-separated specifications `<specs>`. Each spec can either take the form of a face name, an inline face specification, or a `key=value` pair. The value must be wrapped by `{...}` should it contain any of the characters `,=:{}`.

String interpolation with `$` functions in the same way as regular strings, except quotes need to be escaped. Faces, keys, and values can also be interpolated with `$`.

**Example**

```julia
styled"The {bold:{italic:quick} {(foreground=#cd853f):brown} fox} jumped over the {link={https://en.wikipedia.org/wiki/Laziness}:lazy} dog"
```


**Extended help**

This macro can be described by the following EBNF grammar:

```ebnf
styledstring = { styled | interpolated | escaped | plain } ;

specialchar = '{' | '}' | '$' | '\"' ;
anychar = [\u0-\u1fffff] ;
almostplain = { anychar - specialchar } ;
plain = { anychar - specialchar } ;
escaped = '\\', specialchar ;

interpolated = '$', ? expr ? | '$(', ? expr ?, ')' ;

styled = '{', ws, annotations, ':', content, '}' ;
content = { interpolated | plain | escaped | styled } ;
annotations = annotation | annotations, ws, ',', ws, annotation ;
annotation = face | inlineface | keyvalue ;
ws = { ' ' | '\t' | '\n' } ; (* whitespace *)

face = facename | interpolated ;
facename = [A-Za-z0-9_]+ ;

inlineface = '(', ws, [ faceprop ], { ws, ',', faceprop }, ws, ')' ;
faceprop = [a-z]+, ws, '=', ws, ( [^,)]+ | interpolated) ;

keyvalue = key, ws, '=', ws, value ;
key = ( [^${}=,:], [^=,:]* ) | interpolated ;
value = simplevalue | curlybraced | interpolated ;
curlybraced = '{' { escaped | plain } '}' ;
simplevalue = [^${},:], [^,:]* ;
```


The above grammar for `inlineface` is simplified, as the actual implementation is a bit more sophisticated. The full behaviour is given below.

```ebnf
faceprop = ( 'face', ws, '=', ws, ( ? string ? | interpolated ) ) |
           ( 'height', ws, '=', ws, ( ? number ? | interpolated ) ) |
           ( 'weight', ws, '=', ws, ( symbol | interpolated ) ) |
           ( 'slant', ws, '=', ws, ( symbol | interpolated ) ) |
           ( ( 'foreground' | 'fg' | 'background' | 'bg' ),
               ws, '=', ws, ( simplecolor | interpolated ) ) |
           ( 'underline', ws, '=', ws, ( underline | interpolated ) ) |
           ( 'strikethrough', ws, '=', ws, ( bool | interpolated ) ) |
           ( 'inverse', ws, '=', ws, ( bool | interpolated ) ) |
           ( 'inherit', ws, '=', ws, ( inherit | interpolated ) ) ;

nothing = 'nothing' ;
bool = 'true' | 'false' ;
symbol = [^ ,)]+ ;
hexcolor = ('#' | '0x'), [0-9a-f]{6} ;
simplecolor = hexcolor | symbol | nothing ;

underline = nothing | bool | simplecolor | underlinestyled;
underlinestyled = '(', whitespace, ('' | nothing | simplecolor), whitespace,
                  ',', whitespace, symbol, whitespace ')' ;

inherit = ( '[', inheritval, { ',', inheritval }, ']' ) | inheritval;
inheritval = whitespace, ':'?, symbol ;
```



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/e0ca0f85412ea5cafabfeaaec4d62ca26c3959d2/src/stylemacro.jl#L3-L84)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='StyledStrings.Face' href='#StyledStrings.Face'>#</a>&nbsp;<b><u>StyledStrings.Face</u></b> &mdash; <i>Type</i>.




A [`Face`](/stdlib/StyledStrings#StyledStrings.Face) is a collection of graphical attributes for displaying text. Faces control how text is displayed in the terminal, and possibly other places too.

Most of the time, a [`Face`](/stdlib/StyledStrings#StyledStrings.Face) will be stored in the global faces dicts as a unique association with a _face name_ Symbol, and will be most often referred to by this name instead of the [`Face`](/stdlib/StyledStrings#StyledStrings.Face) object itself.

**Attributes**

All attributes can be set via the keyword constructor, and default to `nothing`.
- `height` (an `Int` or `Float64`): The height in either deci-pt (when an `Int`), or as a factor of the base size (when a `Float64`).
  
- `weight` (a `Symbol`): One of the symbols (from faintest to densest) `:thin`, `:extralight`, `:light`, `:semilight`, `:normal`, `:medium`, `:semibold`, `:bold`, `:extrabold`, or `:black`. In terminals any weight greater than `:normal` is displayed as bold, and in terminals that support variable-brightness text, any weight less than `:normal` is displayed as faint.
  
- `slant` (a `Symbol`): One of the symbols `:italic`, `:oblique`, or `:normal`.
  
- `foreground` (a `SimpleColor`): The text foreground color.
  
- `background` (a `SimpleColor`): The text background color.
  
- `underline`, the text underline, which takes one of the following forms:
  - a `Bool`: Whether the text should be underlined or not.
    MarkdownAST.LineBreak()
    
    
    
  - a `SimpleColor`: The text should be underlined with this color.
    MarkdownAST.LineBreak()
    
    
    
  - a `Tuple{Nothing, Symbol}`: The text should be underlined using the style set by the Symbol, one of `:straight`, `:double`, `:curly`, `:dotted`, or `:dashed`.
    MarkdownAST.LineBreak()
    
    
    
  - a `Tuple{SimpleColor, Symbol}`: The text should be underlined in the specified SimpleColor, and using the style specified by the Symbol, as before.
    
  
- `strikethrough` (a `Bool`): Whether the text should be struck through.
  
- `inverse` (a `Bool`): Whether the foreground and background colors should be inverted.
  
- `inherit` (a `Vector{Symbol}`): Names of faces to inherit from, with earlier faces taking priority. All faces inherit from the `:default` face.
  


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/e0ca0f85412ea5cafabfeaaec4d62ca26c3959d2/src/faces.jl#L82-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='StyledStrings.addface!' href='#StyledStrings.addface!'>#</a>&nbsp;<b><u>StyledStrings.addface!</u></b> &mdash; <i>Function</i>.




```julia
addface!(name::Symbol => default::Face)
```


Create a new face by the name `name`. So long as no face already exists by this name, `default` is added to both `FACES``.default` and (a copy of) to `FACES`.`current`, with the current value returned.

Should the face `name` already exist, `nothing` is returned.

**Examples**

```julia
julia> addface!(:mypkg_myface => Face(slant=:italic, underline=true))
Face (sample)
         slant: italic
     underline: true
```



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/e0ca0f85412ea5cafabfeaaec4d62ca26c3959d2/src/faces.jl#L347-L364)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='StyledStrings.SimpleColor' href='#StyledStrings.SimpleColor'>#</a>&nbsp;<b><u>StyledStrings.SimpleColor</u></b> &mdash; <i>Type</i>.




```julia
struct SimpleColor
```


A basic representation of a color, intended for string styling purposes. It can either contain a named color (like `:red`), or an `RGBTuple` which is a NamedTuple specifying an `r`, `g`, `b` color with a bit-depth of 8.

**Constructors**

```julia
SimpleColor(name::Symbol)  # e.g. :red
SimpleColor(rgb::RGBTuple) # e.g. (r=1, b=2, g=3)
SimpleColor(r::Integer, b::Integer, b::Integer)
SimpleColor(rgb::UInt32)   # e.g. 0x123456
```


Also see `tryparse(SimpleColor, rgb::String)`.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/e0ca0f85412ea5cafabfeaaec4d62ca26c3959d2/src/faces.jl#L5-L22)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.parse-Tuple{Type{StyledStrings.SimpleColor}, String}' href='#Base.parse-Tuple{Type{StyledStrings.SimpleColor}, String}'>#</a>&nbsp;<b><u>Base.parse</u></b> &mdash; <i>Method</i>.




```julia
parse(::Type{SimpleColor}, rgb::String)
```


An analogue of `tryparse(SimpleColor, rgb::String)` (which see), that raises an error instead of returning `nothing`.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/e0ca0f85412ea5cafabfeaaec4d62ca26c3959d2/src/faces.jl#L69-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.tryparse-Tuple{Type{StyledStrings.SimpleColor}, String}' href='#Base.tryparse-Tuple{Type{StyledStrings.SimpleColor}, String}'>#</a>&nbsp;<b><u>Base.tryparse</u></b> &mdash; <i>Method</i>.




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



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/e0ca0f85412ea5cafabfeaaec4d62ca26c3959d2/src/faces.jl#L34-L55)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.merge-Tuple{StyledStrings.Face, StyledStrings.Face}' href='#Base.merge-Tuple{StyledStrings.Face, StyledStrings.Face}'>#</a>&nbsp;<b><u>Base.merge</u></b> &mdash; <i>Method</i>.




```julia
merge(initial::Face, others::Face...)
```


Merge the properties of the `initial` face and `others`, with later faces taking priority.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/e0ca0f85412ea5cafabfeaaec4d62ca26c3959d2/src/faces.jl#L458-L463)

</div>
<br>
