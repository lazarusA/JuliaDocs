
# StyledStrings {#stdlib-styledstrings}

## Styling {#stdlib-styledstrings-styling}

When working with strings, formatting and styling often appear as a secondary concern.

For instance, when printing to a terminal you might want to sprinkle [ANSI escape sequences](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters) in the output, when outputting HTML styling constructs (`<span style="...">`, etc.) serve a similar purpose, and so on. It is possible to simply insert the raw styling constructs into the string next to the content itself, but it quickly becomes apparent that this is not well suited for anything but the most basic use cases. Not all terminals support the same ANSI codes, the styling constructs need to be painstakingly removed when calculating the width of already-styled content, and that&#39;s before you even get into handling multiple output formats.

Instead of leaving this headache to be widely experienced downstream, it is tackled head-on by the introduction of a special string type ([`AnnotatedString`](/base/strings#Base.AnnotatedString)). This string type wraps any other [`AbstractString`](/base/strings#Core.AbstractString) type and allows for formatting information to be applied to regions (e.g. characters 1 through to 7 are bold and red).

Regions of a string are styled by applying [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s (think &quot;typeface&quot;) to them — a structure that holds styling information. As a convenience, faces in the global faces dictionary (e.g. `shadow`) can just be named instead of giving the [`Face`](/stdlib/StyledStrings#StyledStrings.Face) directly.

Along with these capabilities, we also provide a convenient way for constructing [`AnnotatedString`](/base/strings#Base.AnnotatedString)s, detailed in [Styled String Literals](/stdlib/StyledStrings#stdlib-styledstring-literals).

```julia
julia> using StyledStrings

julia> styled"{yellow:hello} {blue:there}"
"hello there"
```


## Styling via [`AnnotatedString`](/base/strings#Base.AnnotatedString)s {#Styling-via-[AnnotatedString](@ref-Base.AnnotatedString)s}

## Faces {#stdlib-styledstrings-faces}

### The `Face` type {#The-Face-type}

A [`Face`](/stdlib/StyledStrings#StyledStrings.Face) specifies details of a typeface that text can be set in. It covers a set of basic attributes that generalize well across different formats, namely:
- `font`
  
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

To make referring to particular styles more convenient, there is a global `Dict{Symbol, Face}` that allows for [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s to be referred to simply by name. Packages can add faces to this dictionary via the [`addface!`](/stdlib/StyledStrings#StyledStrings.addface!) function, and the loaded faces can be easily [customized](/stdlib/StyledStrings#stdlib-styledstrings-face-toml).

::: warning Appropriate face naming

Any package registering new faces should ensure that they are prefixed by the package name, i.e. follow the format `mypackage_myface`. This is important for predictability, and to prevent name clashes.

:::

There is one set of exemptions to the package-prefix rule, the set of basic faces that are part of the default value of the faces dictionary.

#### Basic faces {#stdlib-styledstrings-basic-faces}

Basic faces are intended to represent a general idea that is widely applicable.

For setting some text with a certain attribute, we have the `bold`, `light`, `italic`, `underline`, `strikethrough`, and `inverse` faces.

There are also named faces for the 16 terminal colors: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `bright_black`/`grey`/`gray`, `bright_red`, `bright_green`, `bright_blue`, `bright_magenta`, `bright_cyan`, and `bright_white`.

For shadowed text (i.e. dim but there) there is the `shadow` face. To indicate a selected region, there is the `region` face. Similarly for emphasis and highlighting the `emphasis` and `highlight` faces are defined. There is also `code` for code-like text.

For visually indicating the severity of messages, the `error`, `warning`, `success`, `info`, `note`, and `tip` faces are defined.

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


On initialization, the `config/faces.toml` file under the first Julia depot (usually `~/.julia`) is loaded.

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
"<pre><span style=\"color: #195eb3;\">blue text</span></pre>"
```


## Styled String Literals {#stdlib-styledstring-literals}

To ease construction of [`AnnotatedString`](/base/strings#Base.AnnotatedString)s with [`Face`](/stdlib/StyledStrings#StyledStrings.Face)s applied, the [`styled"..."`](/stdlib/StyledStrings#StyledStrings.StyledMarkup.@styled_str) styled string literal allows for the content and attributes to be easily expressed together via a custom grammar.

Within a [`styled"..."`](/stdlib/StyledStrings#StyledStrings.StyledMarkup.@styled_str) literal, curly braces are considered special characters and must be escaped in normal usage (`\{`, `\}`). This allows them to be used to express annotations with (nestable) `{annotations...:text}` constructs.

The `annotations...` component is a comma-separated list of three types of annotations.
- Face names
  
- Inline `Face` expressions `(key=val,...)`
  
- `key=value` pairs
  

Interpolation is possible everywhere except for inline face keys.

For more information on the grammar, see the extended help of the [`styled"..."`](/stdlib/StyledStrings#StyledStrings.StyledMarkup.@styled_str) docstring.

As an example, we can demonstrate the list of built-in faces mentioned above like so:

```julia
julia> println(styled"
The basic font-style attributes are {bold:bold}, {light:light}, {italic:italic},
{underline:underline}, and {strikethrough:strikethrough}.

In terms of color, we have named faces for the 16 standard terminal colors:
 {black:■} {red:■} {green:■} {yellow:■} {blue:■} {magenta:■} {cyan:■} {white:■}
 {bright_black:■} {bright_red:■} {bright_green:■} {bright_yellow:■} {bright_blue:■} {bright_magenta:■} {bright_cyan:■} {bright_white:■}

Since {code:bright_black} is effectively grey, we define two aliases for it:
{code:grey} and {code:gray} to allow for regional spelling differences.

To flip the foreground and background colors of some text, you can use the
{code:inverse} face, for example: {magenta:some {inverse:inverse} text}.

The intent-based basic faces are {shadow:shadow} (for dim but visible text),
{region:region} for selections, {emphasis:emphasis}, and {highlight:highlight}.
As above, {code:code} is used for code-like text.

Lastly, we have the 'message severity' faces: {error:error}, {warning:warning},
{success:success}, {info:info}, {note:note}, and {tip:tip}.

Remember that all these faces (and any user or package-defined ones) can
arbitrarily nest and overlap, {region,tip:like {bold,italic:so}}.")
```

<pre>
 The basic font-style attributes are <span style="font-weight: 700;">bold</span>, <span style="font-weight: 300;">light</span>, <span style="font-style: italic;">italic</span>,
 <span style="text-decoration: underline;">underline</span>, and <span style="text-decoration: line-through">strikethrough</span>.

 In terms of color, we have named faces for the 16 standard terminal colors:
  <span style="color: #1c1a23;">■</span> <span style="color: #a51c2c;">■</span> <span style="color: #25a268;">■</span> <span style="color: #e5a509;">■</span> <span style="color: #195eb3;">■</span> <span style="color: #803d9b;">■</span> <span style="color: #0097a7;">■</span> <span style="color: #dddcd9;">■</span>
  <span style="color: #76757a;">■</span> <span style="color: #ed333b;">■</span> <span style="color: #33d079;">■</span> <span style="color: #f6d22c;">■</span> <span style="color: #3583e4;">■</span> <span style="color: #bf60ca;">■</span> <span style="color: #26c6da;">■</span> <span style="color: #f6f5f4;">■</span>

 Since <span style="color: #0097a7;">bright_black</span> is effectively grey, we define two aliases for it:
 <span style="color: #0097a7;">grey</span> and <span style="color: #0097a7;">gray</span> to allow for regional spelling differences.

 To flip the foreground and background colors of some text, you can use the
 <span style="color: #0097a7;">inverse</span> face, for example: <span style="color: #803d9b;">some </span><span style="background-color: #803d9b;">inverse</span><span style="color: #803d9b;"> text</span>.

 The intent-based basic faces are <span style="color: #76757a;">shadow</span> (for dim but visible text),
 <span style="background-color: #3a3a3a;">region</span> for selections, <span style="color: #195eb3;">emphasis</span>, and <span style="background-color: #195eb3;">highlight</span>.
 As above, <span style="color: #0097a7;">code</span> is used for code-like text.

 Lastly, we have the 'message severity' faces: <span style="color: #ed333b;">error</span>, <span style="color: #e5a509;">warning</span>,
 <span style="color: #25a268;">success</span>, <span style="color: #26c6da;">info</span>, <span style="color: #76757a;">note</span>, and <span style="color: #33d079;">tip</span>.

 Remember that all these faces (and any user or package-defined ones) can
 arbitrarily nest and overlap, <span style="color: #33d079;background-color: #3a3a3a;">like <span style="font-weight: 700;font-style: italic;">so</span></span>.</pre>


## API reference {#stdlib-styledstrings-api}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='StyledStrings.StyledMarkup.@styled_str' href='#StyledStrings.StyledMarkup.@styled_str'>#</a>&nbsp;<b><u>StyledStrings.StyledMarkup.@styled_str</u></b> &mdash; <i>Macro</i>.




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
key = ( [^\0${}=,:], [^\0=,:]* ) | interpolated ;
value = simplevalue | curlybraced | interpolated ;
curlybraced = '{' { escaped | plain } '}' ;
simplevalue = [^${},:], [^,:]* ;
```


An extra stipulation not encoded in the above grammar is that `plain` should be a valid input to [`unescape_string`](/base/strings#Base.unescape_string), with `specialchar` kept.

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
underlinestyled = '(', ws, ('' | nothing | simplecolor | interpolated), ws,
                  ',', ws, ( symbol | interpolated ), ws ')' ;

inherit = ( '[', inheritval, { ',', inheritval }, ']' ) | inheritval;
inheritval = ws, ':'?, symbol ;
```



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/styledmarkup.jl#L864-L947)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='StyledStrings.StyledMarkup.styled' href='#StyledStrings.StyledMarkup.styled'>#</a>&nbsp;<b><u>StyledStrings.StyledMarkup.styled</u></b> &mdash; <i>Function</i>.




```julia
styled(content::AbstractString) -> AnnotatedString
```


Construct a styled string. Within the string, `{<specs>:<content>}` structures apply the formatting to `<content>`, according to the list of comma-separated specifications `<specs>`. Each spec can either take the form of a face name, an inline face specification, or a `key=value` pair. The value must be wrapped by `{...}` should it contain any of the characters `,=:{}`.

This is a functional equivalent of the [`@styled_str`](/stdlib/StyledStrings#StyledStrings.StyledMarkup.@styled_str) macro, just without interpolation capabilities.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/styledmarkup.jl#L967-L978)

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
  


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L82-L119)

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



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L369-L386)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='StyledStrings.withfaces' href='#StyledStrings.withfaces'>#</a>&nbsp;<b><u>StyledStrings.withfaces</u></b> &mdash; <i>Function</i>.




```julia
withfaces(f, kv::Pair...)
withfaces(f, kvpair_itr)
```


Execute `f` with `FACES``.current` temporarily modified by zero or more `:name => val` arguments `kv`, or `kvpair_itr` which produces `kv`-form values.

`withfaces` is generally used via the `withfaces(kv...) do ... end` syntax. A value of `nothing` can be used to temporarily unset a face (if it has been set). When `withfaces` returns, the original `FACES``.current` has been restored.

**Examples**

```julia
julia> withfaces(:yellow => Face(foreground=:red), :green => :blue) do
           println(styled"{yellow:red} and {green:blue} mixed make {magenta:purple}")
       end
red and blue mixed make purple
```



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L434-L454)

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


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L5-L22)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.parse-Tuple{Type{StyledStrings.SimpleColor}, String}' href='#Base.parse-Tuple{Type{StyledStrings.SimpleColor}, String}'>#</a>&nbsp;<b><u>Base.parse</u></b> &mdash; <i>Method</i>.




```julia
parse(::Type{SimpleColor}, rgb::String)
```


An analogue of `tryparse(SimpleColor, rgb::String)` (which see), that raises an error instead of returning `nothing`.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L69-L74)

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



[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L34-L55)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.merge-Tuple{StyledStrings.Face, StyledStrings.Face}' href='#Base.merge-Tuple{StyledStrings.Face, StyledStrings.Face}'>#</a>&nbsp;<b><u>Base.merge</u></b> &mdash; <i>Method</i>.




```julia
merge(initial::Face, others::Face...)
```


Merge the properties of the `initial` face and `others`, with later faces taking priority.


[source](https://github.com/JuliaLang/StyledStrings.jl/blob/ac472083359dde956aed8c61d43b8158ac84d9ce/src/faces.jl#L481-L486)

</div>
<br>
