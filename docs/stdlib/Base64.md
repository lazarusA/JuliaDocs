


# Base64
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base64.Base64' href='#Base64.Base64'>#</a>&nbsp;<b><u>Base64.Base64</u></b> &mdash; <i>Module</i>.




```julia
Base64
```


Functionality for [base64 encoding and decoding](https://en.wikipedia.org/wiki/Base64), a method to represent binary data using text, common on the web.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Base64/src/Base64.jl#L3-L8)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base64.Base64EncodePipe' href='#Base64.Base64EncodePipe'>#</a>&nbsp;<b><u>Base64.Base64EncodePipe</u></b> &mdash; <i>Type</i>.




```julia
Base64EncodePipe(ostream)
```


Return a new write-only I/O stream, which converts any bytes written to it into base64-encoded ASCII bytes written to `ostream`.  Calling [`close`](/base/io-network#Base.close) on the `Base64EncodePipe` stream is necessary to complete the encoding (but does not close `ostream`).

**Examples**

```julia
julia> io = IOBuffer();

julia> iob64_encode = Base64EncodePipe(io);

julia> write(iob64_encode, "Hello!")
6

julia> close(iob64_encode);

julia> str = String(take!(io))
"SGVsbG8h"

julia> String(base64decode(str))
"Hello!"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Base64/src/encode.jl#L8-L33)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base64.base64encode' href='#Base64.base64encode'>#</a>&nbsp;<b><u>Base64.base64encode</u></b> &mdash; <i>Function</i>.




```julia
base64encode(writefunc, args...; context=nothing)
base64encode(args...; context=nothing)
```


Given a [`write`](/base/io-network#Base.write)-like function `writefunc`, which takes an I/O stream as its first argument, `base64encode(writefunc, args...)` calls `writefunc` to write `args...` to a base64-encoded string, and returns the string. `base64encode(args...)` is equivalent to `base64encode(write, args...)`: it converts its arguments into bytes using the standard [`write`](/base/io-network#Base.write) functions and returns the base64-encoded string.

The optional keyword argument `context` can be set to `:key=>value` pair or an `IO` or [`IOContext`](/base/io-network#Base.IOContext) object whose attributes are used for the I/O stream passed to `writefunc` or `write`.

See also [`base64decode`](/stdlib/Base64#Base64.base64decode).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Base64/src/encode.jl#L188-L204)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base64.Base64DecodePipe' href='#Base64.Base64DecodePipe'>#</a>&nbsp;<b><u>Base64.Base64DecodePipe</u></b> &mdash; <i>Type</i>.




```julia
Base64DecodePipe(istream)
```


Return a new read-only I/O stream, which decodes base64-encoded data read from `istream`.

**Examples**

```julia
julia> io = IOBuffer();

julia> iob64_decode = Base64DecodePipe(io);

julia> write(io, "SGVsbG8h")
8

julia> seekstart(io);

julia> String(read(iob64_decode))
"Hello!"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Base64/src/decode.jl#L14-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base64.base64decode' href='#Base64.base64decode'>#</a>&nbsp;<b><u>Base64.base64decode</u></b> &mdash; <i>Function</i>.




```julia
base64decode(string)
```


Decode the base64-encoded `string` and returns a `Vector{UInt8}` of the decoded bytes.

See also [`base64encode`](/stdlib/Base64#Base64.base64encode).

**Examples**

```julia
julia> b = base64decode("SGVsbG8h")
6-element Vector{UInt8}:
 0x48
 0x65
 0x6c
 0x6c
 0x6f
 0x21

julia> String(b)
"Hello!"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Base64/src/decode.jl#L190-L212)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base64.stringmime' href='#Base64.stringmime'>#</a>&nbsp;<b><u>Base64.stringmime</u></b> &mdash; <i>Function</i>.




```julia
stringmime(mime, x; context=nothing)
```


Return an `AbstractString` containing the representation of `x` in the requested `mime` type. This is similar to [`repr(mime, x)`](/base/io-network#Base.repr-Tuple{MIME,%20Any}) except that binary data is base64-encoded as an ASCII string.

The optional keyword argument `context` can be set to `:key=>value` pair or an `IO` or [`IOContext`](/base/io-network#Base.IOContext) object whose attributes are used for the I/O stream passed to [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Base64/src/Base64.jl#L33-L43)

</div>
<br>
