


# Unicode {#Unicode}

The `Unicode` module provides essential functionality for managing Unicode characters and strings. It includes validation, category determination, normalization, case transformation, and grapheme segmentation, enabling effective Unicode data handling.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Unicode' href='#Unicode'>#</a>&nbsp;<b><u>Unicode</u></b> &mdash; <i>Module</i>.




The `Unicode` module provides essential functionality for managing Unicode characters and strings. It includes validation, category determination, normalization, case transformation, and grapheme segmentation, enabling effective Unicode data handling.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Unicode/src/Unicode.jl#L2-L6)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Unicode.julia_chartransform' href='#Unicode.julia_chartransform'>#</a>&nbsp;<b><u>Unicode.julia_chartransform</u></b> &mdash; <i>Function</i>.




```julia
Unicode.julia_chartransform(c::Union{Char,Integer})
```


Map the Unicode character (`Char`) or codepoint (`Integer`) `c` to the corresponding &quot;equivalent&quot; character or codepoint, respectively, according to the custom equivalence used within the Julia parser (in addition to NFC normalization).

For example, `'µ'` (U+00B5 micro) is treated as equivalent to `'μ'` (U+03BC mu) by Julia&#39;s parser, so `julia_chartransform` performs this transformation while leaving other characters unchanged:

```julia
julia> Unicode.julia_chartransform('µ')
'μ': Unicode U+03BC (category Ll: Letter, lowercase)

julia> Unicode.julia_chartransform('x')
'x': ASCII/Unicode U+0078 (category Ll: Letter, lowercase)
```


`julia_chartransform` is mainly useful for passing to the [`Unicode.normalize`](/stdlib/Unicode#Unicode.normalize) function in order to mimic the normalization used by the Julia parser:

```julia
julia> s = "µö"
"µö"

julia> s2 = Unicode.normalize(s, compose=true, stable=true, chartransform=Unicode.julia_chartransform)
"μö"

julia> collect(s2)
2-element Vector{Char}:
 'μ': Unicode U+03BC (category Ll: Letter, lowercase)
 'ö': Unicode U+00F6 (category Ll: Letter, lowercase)

julia> s2 == string(Meta.parse(s))
true
```


::: tip Julia 1.8

This function was introduced in Julia 1.8.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Unicode/src/Unicode.jl#L11-L49)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Unicode.isassigned' href='#Unicode.isassigned'>#</a>&nbsp;<b><u>Unicode.isassigned</u></b> &mdash; <i>Function</i>.




```julia
Unicode.isassigned(c) -> Bool
```


Return `true` if the given char or integer is an assigned Unicode code point.

**Examples**

```julia
julia> Unicode.isassigned(101)
true

julia> Unicode.isassigned('\x01')
true
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Unicode/src/Unicode.jl#L124-L137)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Unicode.isequal_normalized' href='#Unicode.isequal_normalized'>#</a>&nbsp;<b><u>Unicode.isequal_normalized</u></b> &mdash; <i>Function</i>.




```julia
isequal_normalized(s1::AbstractString, s2::AbstractString; casefold=false, stripmark=false, chartransform=identity)
```


Return whether `s1` and `s2` are canonically equivalent Unicode strings.   If `casefold=true`, ignores case (performs Unicode case-folding); if `stripmark=true`, strips diacritical marks and other combining characters.

As with [`Unicode.normalize`](/stdlib/Unicode#Unicode.normalize), you can also pass an arbitrary function via the `chartransform` keyword (mapping `Integer` codepoints to codepoints) to perform custom normalizations, such as [`Unicode.julia_chartransform`](/stdlib/Unicode#Unicode.julia_chartransform).

::: tip Julia 1.8

The `isequal_normalized` function was added in Julia 1.8.

:::

**Examples**

For example, the string `"noël"` can be constructed in two canonically equivalent ways in Unicode, depending on whether `"ë"` is formed from a single codepoint U+00EB or from the ASCII character `'e'` followed by the U+0308 combining-diaeresis character.

```julia
julia> s1 = "noël"
"noël"

julia> s2 = "noël"
"noël"

julia> s1 == s2
false

julia> isequal_normalized(s1, s2)
true

julia> isequal_normalized(s1, "noel", stripmark=true)
true

julia> isequal_normalized(s1, "NOËL", casefold=true)
true
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Unicode/src/Unicode.jl#L228-L267)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Unicode.normalize' href='#Unicode.normalize'>#</a>&nbsp;<b><u>Unicode.normalize</u></b> &mdash; <i>Function</i>.




```julia
Unicode.normalize(s::AbstractString; keywords...)
Unicode.normalize(s::AbstractString, normalform::Symbol)
```


Normalize the string `s`. By default, canonical composition (`compose=true`) is performed without ensuring Unicode versioning stability (`compat=false`), which produces the shortest possible equivalent string but may introduce composition characters not present in earlier Unicode versions.

Alternatively, one of the four &quot;normal forms&quot; of the Unicode standard can be specified: `normalform` can be `:NFC`, `:NFD`, `:NFKC`, or `:NFKD`.  Normal forms C (canonical composition) and D (canonical decomposition) convert different visually identical representations of the same abstract string into a single canonical form, with form C being more compact.  Normal forms KC and KD additionally canonicalize &quot;compatibility equivalents&quot;: they convert characters that are abstractly similar but visually distinct into a single canonical choice (e.g. they expand ligatures into the individual characters), with form KC being more compact.

Alternatively, finer control and additional transformations may be obtained by calling `Unicode.normalize(s; keywords...)`, where any number of the following boolean keywords options (which all default to `false` except for `compose`) are specified:
- `compose=false`: do not perform canonical composition
  
- `decompose=true`: do canonical decomposition instead of canonical composition (`compose=true` is ignored if present)
  
- `compat=true`: compatibility equivalents are canonicalized
  
- `casefold=true`: perform Unicode case folding, e.g. for case-insensitive string comparison
  
- `newline2lf=true`, `newline2ls=true`, or `newline2ps=true`: convert various newline sequences (LF, CRLF, CR, NEL) into a linefeed (LF), line-separation (LS), or paragraph-separation (PS) character, respectively
  
- `stripmark=true`: strip diacritical marks (e.g. accents)
  
- `stripignore=true`: strip Unicode&#39;s &quot;default ignorable&quot; characters (e.g. the soft hyphen or the left-to-right marker)
  
- `stripcc=true`: strip control characters; horizontal tabs and form feeds are converted to spaces; newlines are also converted to spaces unless a newline-conversion flag was specified
  
- `rejectna=true`: throw an error if unassigned code points are found
  
- `stable=true`: enforce Unicode versioning stability (never introduce characters missing from earlier Unicode versions)
  

You can also use the `chartransform` keyword (which defaults to `identity`) to pass an arbitrary _function_ mapping `Integer` codepoints to codepoints, which is called on each character in `s` as it is processed, in order to perform arbitrary additional normalizations. For example, by passing `chartransform=Unicode.julia_chartransform`, you can apply a few Julia-specific character normalizations that are performed by Julia when parsing identifiers (in addition to NFC normalization: `compose=true, stable=true`).

For example, NFKC corresponds to the options `compose=true, compat=true, stable=true`.

**Examples**

```julia
julia> "é" == Unicode.normalize("é") #LHS: Unicode U+00e9, RHS: U+0065 & U+0301
true

julia> "μ" == Unicode.normalize("µ", compat=true) #LHS: Unicode U+03bc, RHS: Unicode U+00b5
true

julia> Unicode.normalize("JuLiA", casefold=true)
"julia"

julia> Unicode.normalize("JúLiA", stripmark=true)
"JuLiA"
```


::: tip Julia 1.8

The `chartransform` keyword argument requires Julia 1.8.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Unicode/src/Unicode.jl#L55-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Unicode.graphemes' href='#Unicode.graphemes'>#</a>&nbsp;<b><u>Unicode.graphemes</u></b> &mdash; <i>Function</i>.




```julia
graphemes(s::AbstractString) -> GraphemeIterator
```


Return an iterator over substrings of `s` that correspond to the extended graphemes in the string, as defined by Unicode UAX #29. (Roughly, these are what users would perceive as single characters, even though they may contain more than one codepoint; for example a letter combined with an accent mark is a single grapheme.)


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Unicode/src/Unicode.jl#L140-L147)



```julia
graphemes(s::AbstractString, m:n) -> SubString
```


Returns a [`SubString`](/base/strings#Base.SubString) of `s` consisting of the `m`-th through `n`-th graphemes of the string `s`, where the second argument `m:n` is an integer-valued [`AbstractUnitRange`](/base/collections#Base.AbstractUnitRange).

Loosely speaking, this corresponds to the `m:n`-th user-perceived &quot;characters&quot; in the string.  For example:

```julia
julia> s = graphemes("exposé", 3:6)
"posé"

julia> collect(s)
5-element Vector{Char}:
 'p': ASCII/Unicode U+0070 (category Ll: Letter, lowercase)
 'o': ASCII/Unicode U+006F (category Ll: Letter, lowercase)
 's': ASCII/Unicode U+0073 (category Ll: Letter, lowercase)
 'e': ASCII/Unicode U+0065 (category Ll: Letter, lowercase)
 '́': Unicode U+0301 (category Mn: Mark, nonspacing)
```


This consists of the 3rd to _7th_ codepoints ([`Char`](/base/strings#Core.Char)s) in `"exposé"`, because the grapheme `"é"` is actually _two_ Unicode codepoints (an `'e'` followed by an acute-accent combining character U+0301).

Because finding grapheme boundaries requires iteration over the string contents, the `graphemes(s, m:n)` function requires time proportional to the length of the string (number of codepoints) before the end of the substring.

::: tip Julia 1.9

The `m:n` argument of `graphemes` requires Julia 1.9.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Unicode/src/Unicode.jl#L150-L183)

</div>
<br>
