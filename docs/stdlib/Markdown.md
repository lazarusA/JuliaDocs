


# Markdown {#markdown_stdlib}

This section describes Julia&#39;s markdown syntax, which is enabled by the Markdown standard library. The following Markdown elements are supported:

## Inline elements {#Inline-elements}

Here &quot;inline&quot; refers to elements that can be found within blocks of text, i.e. paragraphs. These include the following elements.

### Bold

Surround words with two asterisks, `**`, to display the enclosed text in boldface.

```
A paragraph containing a **bold** word.
```


### Italics

Surround words with one asterisk, `*`, to display the enclosed text in italics.

```
A paragraph containing an *italicized* word.
```


### Literals

Surround text that should be displayed exactly as written with single backticks, ``` .

```
A paragraph containing a `literal` word.
```


Literals should be used when writing text that refers to names of variables, functions, or other parts of a Julia program.

::: tip Tip

To include a backtick character within literal text use three backticks rather than one to enclose the text.

```
A paragraph containing ``` `backtick` characters ```.
```


By extension any odd number of backticks may be used to enclose a lesser number of backticks.

:::

### $\LaTeX$ {#\LaTeX}

Surround text that should be displayed as mathematics using $\LaTeX$ syntax with double backticks, ```` .

```
A paragraph containing some ``\LaTeX`` markup.
```


::: tip Tip

As with literals in the previous section, if literal backticks need to be written within double backticks use an even number greater than two. Note that if a single literal backtick needs to be included within $\LaTeX$ markup then two enclosing backticks is sufficient.

:::

::: tip Note

The `\` character should be escaped appropriately if the text is embedded in a Julia source code, for example, `"``\\LaTeX`` syntax in a docstring."`, since it is interpreted as a string literal. Alternatively, in order to avoid escaping, it is possible to use the `raw` string macro together with the `@doc` macro:

```
@doc raw"``\LaTeX`` syntax in a docstring." functionname
```


:::

### Links

Links to either external or internal targets can be written using the following syntax, where the text enclosed in square brackets, `[ ]`, is the name of the link and the text enclosed in parentheses, `( )`, is the URL.

```
A paragraph containing a link to [Julia](https://www.julialang.org).
```


It&#39;s also possible to add cross-references to other documented functions/methods/variables within the Julia documentation itself. For example:

```julia
"""
    tryparse(type, str; base)

Like [`parse`](@ref), but returns either a value of the requested type,
or [`nothing`](@ref) if the string does not contain a valid number.
"""
```


This will create a link in the generated docs to the [`parse`](/base/numbers#Base.parse) documentation (which has more information about what this function actually does), and to the [`nothing`](/base/constants#Core.nothing) documentation. It&#39;s good to include cross references to mutating/non-mutating versions of a function, or to highlight a difference between two similar-seeming functions.

::: tip Note

The above cross referencing is _not_ a Markdown feature, and relies on [Documenter.jl](https://github.com/JuliaDocs/Documenter.jl), which is used to build base Julia&#39;s documentation.

:::

### Footnote references {#Footnote-references}

Named and numbered footnote references can be written using the following syntax. A footnote name must be a single alphanumeric word containing no punctuation.

```
A paragraph containing a numbered footnote [^1] and a named one [^named].
```


::: tip Note

The text associated with a footnote can be written anywhere within the same page as the footnote reference. The syntax used to define the footnote text is discussed in the [Footnotes](/stdlib/Markdown#Footnotes) section below.

:::

## Toplevel elements {#Toplevel-elements}

The following elements can be written either at the &quot;toplevel&quot; of a document or within another &quot;toplevel&quot; element.

### Paragraphs

A paragraph is a block of plain text, possibly containing any number of inline elements defined in the [Inline elements](/stdlib/Markdown#Inline-elements) section above, with one or more blank lines above and below it.

```
This is a paragraph.

And this is *another* paragraph containing some emphasized text.
A new line, but still part of the same paragraph.
```


### Headers

A document can be split up into different sections using headers. Headers use the following syntax:

```julia
# Level One
## Level Two
### Level Three
#### Level Four
##### Level Five
###### Level Six
```


A header line can contain any inline syntax in the same way as a paragraph can.

::: tip Tip

Try to avoid using too many levels of header within a single document. A heavily nested document may be indicative of a need to restructure it or split it into several pages covering separate topics.

:::

### Code blocks {#Code-blocks}

Source code can be displayed as a literal block using an indent of four spaces or one tab as shown in the following example.

```
This is a paragraph.

    function func(x)
        # ...
    end

Another paragraph.
```


Additionally, code blocks can be enclosed using triple backticks with an optional &quot;language&quot; to specify how a block of code should be highlighted.

````
A code block without a "language":

```
function func(x)
    # ...
end
```

and another one with the "language" specified as `julia`:

```julia
function func(x)
    # ...
end
```
````


::: tip Note

&quot;Fenced&quot; code blocks, as shown in the last example, should be preferred over indented code blocks since there is no way to specify what language an indented code block is written in.

:::

### Block quotes {#Block-quotes}

Text from external sources, such as quotations from books or websites, can be quoted using `>` characters prepended to each line of the quote as follows.

```
Here's a quote:

> Julia is a high-level, high-performance dynamic programming language for
> technical computing, with syntax that is familiar to users of other
> technical computing environments.
```


Note that a single space must appear after the `>` character on each line. Quoted blocks may themselves contain other toplevel or inline elements.

### Images

The syntax for images is similar to the link syntax mentioned above. Prepending a `!` character to a link will display an image from the specified URL rather than a link to it.

```julia
![alternative text](link/to/image.png)
```


### Lists

Unordered lists can be written by prepending each item in a list with either `*`, `+`, or `-`.

```
A list of items:

  * item one
  * item two
  * item three
```


Note the two spaces before each `*` and the single space after each one.

Lists can contain other nested toplevel elements such as lists, code blocks, or quoteblocks. A blank line should be left between each list item when including any toplevel elements within a list.

```
Another list:

  * item one

  * item two

    ```
    f(x) = x
    ```

  * And a sublist:

      + sub-item one
      + sub-item two
```


::: tip Note

The contents of each item in the list must line up with the first line of the item. In the above example the fenced code block must be indented by four spaces to align with the `i` in `item two`.

:::

Ordered lists are written by replacing the &quot;bullet&quot; character, either `*`, `+`, or `-`, with a positive integer followed by either `.` or `)`.

```
Two ordered lists:

 1. item one
 2. item two
 3. item three

 5) item five
 6) item six
 7) item seven
```


An ordered list may start from a number other than one, as in the second list of the above example, where it is numbered from five. As with unordered lists, ordered lists can contain nested toplevel elements.

### Display equations {#Display-equations}

Large $\LaTeX$ equations that do not fit inline within a paragraph may be written as display equations using a fenced code block with the &quot;language&quot; `math` as in the example below.

````julia
```math
f(a) = \frac{1}{2\pi}\int_{0}^{2\pi} (\alpha+R\cos(\theta))d\theta
```
````


### Footnotes

This syntax is paired with the inline syntax for [Footnote references](/stdlib/Markdown#Footnote-references). Make sure to read that section as well.

Footnote text is defined using the following syntax, which is similar to footnote reference syntax, aside from the `:` character that is appended to the footnote label.

```
[^1]: Numbered footnote text.

[^note]:

    Named footnote text containing several toplevel elements
    indented by 4 spaces or one tab.

      * item one
      * item two
      * item three

    ```julia
    function func(x)
        # ...
    end
    ```
```


::: tip Note

No checks are done during parsing to make sure that all footnote references have matching footnotes.

:::

### Horizontal rules {#Horizontal-rules}

The equivalent of an `<hr>` HTML tag can be achieved using three hyphens (`---`). For example:

```
Text above the line.

---

And text below the line.
```


### Tables

Basic tables can be written using the syntax described below. Note that markdown tables have limited features and cannot contain nested toplevel elements unlike other elements discussed above – only inline elements are allowed. Tables must always contain a header row with column names. Cells cannot span multiple rows or columns of the table.

```
| Column One | Column Two | Column Three |
|:---------- | ---------- |:------------:|
| Row `1`    | Column `2` |              |
| *Row* 2    | **Row** 2  | Column ``3`` |
```


::: tip Note

As illustrated in the above example each column of `|` characters must be aligned vertically.

A `:` character on either end of a column&#39;s header separator (the row containing `-` characters) specifies whether the row is left-aligned, right-aligned, or (when `:` appears on both ends) center-aligned. Providing no `:` characters will default to right-aligning the column.

:::

### Admonitions

Specially formatted blocks, known as admonitions, can be used to highlight particular remarks. They can be defined using the following `!!!` syntax:

```
!!! note

    This is the content of the note.
    It is indented by 4 spaces. A tab would work as well.

!!! warning "Beware!"

    And this is another one.

    This warning admonition has a custom title: `"Beware!"`.
```


The first word after `!!!` declares the type of the admonition. There are standard admonition types that should produce special styling. Namely (in order of decreasing severity): `danger`, `warning`, `info`/`note`, and `tip`.

You can also use your own admonition types, as long as the type name only contains lowercase Latin characters (a-z). For example, you could have a `terminology` block like this:

```
!!! terminology "julia vs Julia"

    Strictly speaking, "Julia" refers to the language,
    and "julia" to the standard implementation.
```


However, unless the code rendering the Markdown special-cases that particular admonition type, it will get the default styling.

A custom title for the box can be provided as a string (in double quotes) after the admonition type. If no title text is specified after the admonition type, then the type name will be used as the title (e.g. `"Note"` for the `note` admonition).

Admonitions, like most other toplevel elements, can contain other toplevel elements (e.g. lists, images).

## Markdown String Literals {#stdlib-markdown-literals}

The `md""` macro allows you to embed Markdown strings directly into your Julia code. This macro is designed to simplify the inclusion of Markdown-formatted text within your Julia source files.

### Usage

```julia
result = md"This is a **custom** Markdown string with [a link](http://example.com)."
```


## Markdown Syntax Extensions {#Markdown-Syntax-Extensions}

Julia&#39;s markdown supports interpolation in a very similar way to basic string literals, with the difference that it will store the object itself in the Markdown tree (as opposed to converting it to a string). When the Markdown content is rendered the usual `show` methods will be called, and these can be overridden as usual. This design allows the Markdown to be extended with arbitrarily complex features (such as references) without cluttering the basic syntax.

In principle, the Markdown parser itself can also be arbitrarily extended by packages, or an entirely custom flavour of Markdown can be used, but this should generally be unnecessary.

## API reference {#stdlib-markdown-api}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Markdown.MD' href='#Markdown.MD'>#</a>&nbsp;<b><u>Markdown.MD</u></b> &mdash; <i>Type</i>.




```julia
MD
```


`MD` represents a Markdown document. Note that the `MD` constructor should not generally be used directly, since it constructs the internal data structures. Instead, you can construct `MD` objects using the exported macros [`@md_str`](/stdlib/Markdown#Markdown.@md_str) and [`@doc_str`](/stdlib/Markdown#Markdown.@doc_str).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Markdown/src/parse/parse.jl#L3-L9)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Markdown.@md_str' href='#Markdown.@md_str'>#</a>&nbsp;<b><u>Markdown.@md_str</u></b> &mdash; <i>Macro</i>.




```julia
@md_str -> MD
```


Parse the given string as Markdown text and return a corresponding [`MD`](/stdlib/Markdown#Markdown.MD) object.

**Examples**

```julia
julia> s = md"# Hello, world!"
  Hello, world!
  ≡≡≡≡≡≡≡≡≡≡≡≡≡

julia> typeof(s)
Markdown.MD

```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Markdown/src/Markdown.jl#L71-L86)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Markdown.@doc_str' href='#Markdown.@doc_str'>#</a>&nbsp;<b><u>Markdown.@doc_str</u></b> &mdash; <i>Macro</i>.




```julia
@doc_str -> MD
```


Parse the given string as Markdown text, add line and module information and return a corresponding [`MD`](/stdlib/Markdown#Markdown.MD) object.

`@doc_str` can be used in conjunction with the [`Base.Docs`](/base/base#Base.Docs) module. Please also refer to the manual section on [documentation](/manual/documentation#man-documentation) for more information.

**Examples**

```
julia> s = doc"f(x) = 2*x"
  f(x) = 2*x

julia> typeof(s)
Markdown.MD

```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Markdown/src/Markdown.jl#L98-L116)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Markdown.html' href='#Markdown.html'>#</a>&nbsp;<b><u>Markdown.html</u></b> &mdash; <i>Function</i>.




```julia
html([io::IO], md)
```


Output the contents of the Markdown object `md` in HTML format, either writing to an (optional) `io` stream or returning a string.

One can alternatively use `show(io, "text/html", md)` or `repr("text/html", md)`, which differ in that they wrap the output in a `<div class="markdown"> ... </div>` element.

**Examples**

```julia
julia> html(md"hello _world_")
"<p>hello <em>world</em></p>\n"
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Markdown/src/render/html.jl#L191-L205)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Markdown.latex' href='#Markdown.latex'>#</a>&nbsp;<b><u>Markdown.latex</u></b> &mdash; <i>Function</i>.




```julia
latex([io::IO], md)
```


Output the contents of the Markdown object `md` in LaTeX format, either writing to an (optional) `io` stream or returning a string.

One can alternatively use `show(io, "text/latex", md)` or `repr("text/latex", md)`.

**Examples**

```julia
julia> latex(md"hello _world_")
"hello \\emph{world}\n\n"
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Markdown/src/render/latex.jl#L173-L186)

</div>
<br>
