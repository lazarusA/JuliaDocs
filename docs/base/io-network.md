
# I/O and Network {#I/O-and-Network}

## General I/O {#General-I/O}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.stdout' href='#Base.stdout'>#</a>&nbsp;<b><u>Base.stdout</u></b> &mdash; <i>Constant</i>.




```julia
stdout::IO
```


Global variable referring to the standard out stream.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libuv.jl#L160-L164)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.stderr' href='#Base.stderr'>#</a>&nbsp;<b><u>Base.stderr</u></b> &mdash; <i>Constant</i>.




```julia
stderr::IO
```


Global variable referring to the standard error stream.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libuv.jl#L167-L171)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.stdin' href='#Base.stdin'>#</a>&nbsp;<b><u>Base.stdin</u></b> &mdash; <i>Constant</i>.




```julia
stdin::IO
```


Global variable referring to the standard input stream.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libuv.jl#L153-L157)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.read-Tuple{AbstractString}' href='#Base.read-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.read</u></b> &mdash; <i>Method</i>.




```julia
read(filename::AbstractString)
```


Read the entire contents of a file as a `Vector{UInt8}`.

```
read(filename::AbstractString, String)
```


Read the entire contents of a file as a string.

```
read(filename::AbstractString, args...)
```


Open a file and read its contents. `args` is passed to `read`: this is equivalent to `open(io->read(io, args...), filename)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L491-L504)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.write-Tuple{AbstractString, Any}' href='#Base.write-Tuple{AbstractString, Any}'>#</a>&nbsp;<b><u>Base.write</u></b> &mdash; <i>Method</i>.




```julia
write(filename::AbstractString, content)
```


Write the canonical binary representation of `content` to a file, which will be created if it does not exist yet or overwritten if it does exist.

Return the number of bytes written into the file.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L482-L488)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.open' href='#Base.open'>#</a>&nbsp;<b><u>Base.open</u></b> &mdash; <i>Function</i>.




```julia
open(f::Function, args...; kwargs...)
```


Apply the function `f` to the result of `open(args...; kwargs...)` and close the resulting file descriptor upon completion.

**Examples**

```julia
julia> write("myfile.txt", "Hello world!");

julia> open(io->read(io, String), "myfile.txt")
"Hello world!"

julia> rm("myfile.txt")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L391-L406)



```julia
open(filename::AbstractString; lock = true, keywords...) -> IOStream
```


Open a file in a mode specified by five boolean keyword arguments:

| Keyword    | Description            | Default                               |
|:---------- |:---------------------- |:------------------------------------- |
| `read`     | open for reading       | `!write`                              |
| `write`    | open for writing       | `truncate \| append`                  |
| `create`   | create if non-existent | `!read & write \| truncate \| append` |
| `truncate` | truncate to zero size  | `!read & write`                       |
| `append`   | seek to end            | `false`                               |


The default when no keywords are passed is to open files for reading only. Returns a stream for accessing the opened file.

The `lock` keyword argument controls whether operations will be locked for safe multi-threaded access.

::: tip Julia 1.5

The `lock` argument is available as of Julia 1.5.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L255-L276)



```julia
open(filename::AbstractString, [mode::AbstractString]; lock = true) -> IOStream
```


Alternate syntax for open, where a string-based mode specifier is used instead of the five booleans. The values of `mode` correspond to those from `fopen(3)` or Perl `open`, and are equivalent to setting the following boolean groups:

| Mode | Description                   | Keywords                       |
|:---- |:----------------------------- |:------------------------------ |
| `r`  | read                          | none                           |
| `w`  | write, create, truncate       | `write = true`                 |
| `a`  | write, create, append         | `append = true`                |
| `r+` | read, write                   | `read = true, write = true`    |
| `w+` | read, write, create, truncate | `truncate = true, read = true` |
| `a+` | read, write, create, append   | `append = true, read = true`   |


The `lock` keyword argument controls whether operations will be locked for safe multi-threaded access.

**Examples**

```julia
julia> io = open("myfile.txt", "w");

julia> write(io, "Hello world!");

julia> close(io);

julia> io = open("myfile.txt", "r");

julia> read(io, String)
"Hello world!"

julia> write(io, "This file is read only")
ERROR: ArgumentError: write failed, IOStream is not writeable
[...]

julia> close(io)

julia> io = open("myfile.txt", "a");

julia> write(io, "This stream is not read only")
28

julia> close(io)

julia> rm("myfile.txt")
```


::: tip Julia 1.5

The `lock` argument is available as of Julia 1.5.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L309-L359)



```julia
open(fd::OS_HANDLE) -> IO
```


Take a raw file descriptor wrap it in a Julia-aware IO type, and take ownership of the fd handle. Call `open(Libc.dup(fd))` to avoid the ownership capture of the original handle.

::: warning Warning

Do not call this on a handle that&#39;s already owned by some other part of the system.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L318-L329)



```julia
open(command, mode::AbstractString, stdio=devnull)
```


Run `command` asynchronously. Like `open(command, stdio; read, write)` except specifying the read and write flags via a mode string instead of keyword arguments. Possible mode strings are:

| Mode | Description | Keywords                    |
|:---- |:----------- |:--------------------------- |
| `r`  | read        | none                        |
| `w`  | write       | `write = true`              |
| `r+` | read, write | `read = true, write = true` |
| `w+` | read, write | `read = true, write = true` |



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/process.jl#L360-L373)



```julia
open(command, stdio=devnull; write::Bool = false, read::Bool = !write)
```


Start running `command` asynchronously, and return a `process::IO` object.  If `read` is true, then reads from the process come from the process&#39;s standard output and `stdio` optionally specifies the process&#39;s standard input stream.  If `write` is true, then writes go to the process&#39;s standard input and `stdio` optionally specifies the process&#39;s standard output stream. The process&#39;s standard error stream is connected to the current global `stderr`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/process.jl#L387-L396)



```julia
open(f::Function, command, args...; kwargs...)
```


Similar to `open(command, args...; kwargs...)`, but calls `f(stream)` on the resulting process stream, then closes the input stream and waits for the process to complete. Return the value returned by `f` on success. Throw an error if the process failed, or if the process attempts to print anything to stdout.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/process.jl#L420-L427)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IOStream' href='#Base.IOStream'>#</a>&nbsp;<b><u>Base.IOStream</u></b> &mdash; <i>Type</i>.




```julia
IOStream
```


A buffered IO stream wrapping an OS file descriptor. Mostly used to represent files returned by [`open`](/base/io-network#Base.open).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L7-L12)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IOBuffer' href='#Base.IOBuffer'>#</a>&nbsp;<b><u>Base.IOBuffer</u></b> &mdash; <i>Type</i>.




```julia
IOBuffer([data::AbstractVector{UInt8}]; keywords...) -> IOBuffer
```


Create an in-memory I/O stream, which may optionally operate on a pre-existing array.

It may take optional keyword arguments:
- `read`, `write`, `append`: restricts operations to the buffer; see `open` for details.
  
- `truncate`: truncates the buffer size to zero length.
  
- `maxsize`: specifies a size beyond which the buffer may not be grown.
  
- `sizehint`: suggests a capacity of the buffer (`data` must implement `sizehint!(data, size)`).
  

When `data` is not given, the buffer will be both readable and writable by default.

**Examples**

```julia
julia> io = IOBuffer();

julia> write(io, "JuliaLang is a GitHub organization.", " It has many members.")
56

julia> String(take!(io))
"JuliaLang is a GitHub organization. It has many members."

julia> io = IOBuffer(b"JuliaLang is a GitHub organization.")
IOBuffer(data=UInt8[...], readable=true, writable=false, seekable=true, append=false, size=35, maxsize=Inf, ptr=1, mark=-1)

julia> read(io, String)
"JuliaLang is a GitHub organization."

julia> write(io, "This isn't writable.")
ERROR: ArgumentError: ensureroom failed, IOBuffer is not writeable

julia> io = IOBuffer(UInt8[], read=true, write=true, maxsize=34)
IOBuffer(data=UInt8[...], readable=true, writable=true, seekable=true, append=false, size=0, maxsize=34, ptr=1, mark=-1)

julia> write(io, "JuliaLang is a GitHub organization.")
34

julia> String(take!(io))
"JuliaLang is a GitHub organization"

julia> length(read(IOBuffer(b"data", read=true, truncate=false)))
4

julia> length(read(IOBuffer(b"data", read=true, truncate=true)))
0
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iobuffer.jl#L49-L96)



```julia
IOBuffer(string::String)
```


Create a read-only `IOBuffer` on the data underlying the given string.

**Examples**

```julia
julia> io = IOBuffer("Haho");

julia> String(take!(io))
"Haho"

julia> String(take!(io))
"Haho"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/strings/io.jl#L292-L307)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.take!-Tuple{Base.GenericIOBuffer}' href='#Base.take!-Tuple{Base.GenericIOBuffer}'>#</a>&nbsp;<b><u>Base.take!</u></b> &mdash; <i>Method</i>.




```julia
take!(b::IOBuffer)
```


Obtain the contents of an `IOBuffer` as an array. Afterwards, the `IOBuffer` is reset to its initial state.

**Examples**

```julia
julia> io = IOBuffer();

julia> write(io, "JuliaLang is a GitHub organization.", " It has many members.")
56

julia> String(take!(io))
"JuliaLang is a GitHub organization. It has many members."
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iobuffer.jl#L420-L435)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Pipe' href='#Base.Pipe'>#</a>&nbsp;<b><u>Base.Pipe</u></b> &mdash; <i>Type</i>.




```julia
Pipe()
```


Construct an uninitialized Pipe object, especially for IO communication between multiple processes.

The appropriate end of the pipe will be automatically initialized if the object is used in process spawning. This can be useful to easily obtain references in process pipelines, e.g.:

```
julia> err = Pipe()

# After this `err` will be initialized and you may read `foo`'s
# stderr from the `err` pipe, or pass `err` to other pipelines.
julia> run(pipeline(pipeline(`foo`, stderr=err), `cat`), wait=false)

# Now destroy the write half of the pipe, so that the read half will get EOF
julia> closewrite(err)

julia> read(err, String)
"stderr messages"
```


See also [`Base.link_pipe!`](/base/io-network#Base.link_pipe!).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L748-L771)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.link_pipe!' href='#Base.link_pipe!'>#</a>&nbsp;<b><u>Base.link_pipe!</u></b> &mdash; <i>Function</i>.




```julia
link_pipe!(pipe; reader_supports_async=false, writer_supports_async=false)
```


Initialize `pipe` and link the `in` endpoint to the `out` endpoint. The keyword arguments `reader_supports_async`/`writer_supports_async` correspond to `OVERLAPPED` on Windows and `O_NONBLOCK` on POSIX systems. They should be `true` unless they&#39;ll be used by an external program (e.g. the output of a command executed with [`run`](/base/base#Base.run)).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L776-L784)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fdio' href='#Base.fdio'>#</a>&nbsp;<b><u>Base.fdio</u></b> &mdash; <i>Function</i>.




```julia
fdio([name::AbstractString, ]fd::Integer[, own::Bool=false]) -> IOStream
```


Create an [`IOStream`](/base/io-network#Base.IOStream) object from an integer file descriptor. If `own` is `true`, closing this object will close the underlying descriptor. By default, an `IOStream` is closed when it is garbage collected. `name` allows you to associate the descriptor with a named file.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L240-L246)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.flush' href='#Base.flush'>#</a>&nbsp;<b><u>Base.flush</u></b> &mdash; <i>Function</i>.




```julia
flush(stream)
```


Commit all currently buffered writes to the given stream.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L99-L103)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.close' href='#Base.close'>#</a>&nbsp;<b><u>Base.close</u></b> &mdash; <i>Function</i>.




```julia
close(stream)
```


Close an I/O stream. Performs a [`flush`](/base/io-network#Base.flush) first.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L65-L69)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.closewrite' href='#Base.closewrite'>#</a>&nbsp;<b><u>Base.closewrite</u></b> &mdash; <i>Function</i>.




```julia
closewrite(stream)
```


Shutdown the write half of a full-duplex I/O stream. Performs a [`flush`](/base/io-network#Base.flush) first. Notify the other end that no more data will be written to the underlying file. This is not supported by all IO types.

If implemented, `closewrite` causes subsequent `read` or `eof` calls that would block to instead throw EOF or return true, respectively. If the stream is already closed, this is idempotent.

**Examples**

```julia
julia> io = Base.BufferStream(); # this never blocks, so we can read and write on the same Task

julia> write(io, "request");

julia> # calling `read(io)` here would block forever

julia> closewrite(io);

julia> read(io, String)
"request"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L72-L96)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.write' href='#Base.write'>#</a>&nbsp;<b><u>Base.write</u></b> &mdash; <i>Function</i>.




```julia
write(io::IO, x)
```


Write the canonical binary representation of a value to the given I/O stream or file. Return the number of bytes written into the stream. See also [`print`](/base/io-network#Base.print) to write a text representation (with an encoding that may depend upon `io`).

The endianness of the written value depends on the endianness of the host system. Convert to/from a fixed endianness when writing/reading (e.g. using  [`htol`](/base/io-network#Base.htol) and [`ltoh`](/base/io-network#Base.ltoh)) to get results that are consistent across platforms.

You can write multiple values with the same `write` call. i.e. the following are equivalent:

```
write(io, x, y...)
write(io, x) + write(io, y...)
```


**Examples**

Consistent serialization:

```julia
julia> fname = tempname(); # random temporary filename

julia> open(fname,"w") do f
           # Make sure we write 64bit integer in little-endian byte order
           write(f,htol(Int64(42)))
       end
8

julia> open(fname,"r") do f
           # Convert back to host byte order and host integer type
           Int(ltoh(read(f,Int64)))
       end
42
```


Merging write calls:

```julia
julia> io = IOBuffer();

julia> write(io, "JuliaLang is a GitHub organization.", " It has many members.")
56

julia> String(take!(io))
"JuliaLang is a GitHub organization. It has many members."

julia> write(io, "Sometimes those members") + write(io, " write documentation.")
44

julia> String(take!(io))
"Sometimes those members write documentation."
```


User-defined plain-data types without `write` methods can be written when wrapped in a `Ref`:

```julia
julia> struct MyStruct; x::Float64; end

julia> io = IOBuffer()
IOBuffer(data=UInt8[...], readable=true, writable=true, seekable=true, append=false, size=0, maxsize=Inf, ptr=1, mark=-1)

julia> write(io, Ref(MyStruct(42.0)))
8

julia> seekstart(io); read!(io, Ref(MyStruct(NaN)))
Base.RefValue{MyStruct}(MyStruct(42.0))
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L239-L302)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.read' href='#Base.read'>#</a>&nbsp;<b><u>Base.read</u></b> &mdash; <i>Function</i>.




```julia
read(io::IO, T)
```


Read a single value of type `T` from `io`, in canonical binary representation.

Note that Julia does not convert the endianness for you. Use [`ntoh`](/base/io-network#Base.ntoh) or [`ltoh`](/base/io-network#Base.ltoh) for this purpose.

```
read(io::IO, String)
```


Read the entirety of `io`, as a `String` (see also [`readchomp`](/base/io-network#Base.readchomp)).

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization");

julia> read(io, Char)
'J': ASCII/Unicode U+004A (category Lu: Letter, uppercase)

julia> io = IOBuffer("JuliaLang is a GitHub organization");

julia> read(io, String)
"JuliaLang is a GitHub organization"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L210-L234)



```julia
read(filename::AbstractString)
```


Read the entire contents of a file as a `Vector{UInt8}`.

```
read(filename::AbstractString, String)
```


Read the entire contents of a file as a string.

```
read(filename::AbstractString, args...)
```


Open a file and read its contents. `args` is passed to `read`: this is equivalent to `open(io->read(io, args...), filename)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L491-L504)



```julia
read(s::IO, nb=typemax(Int))
```


Read at most `nb` bytes from `s`, returning a `Vector{UInt8}` of the bytes read.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1167-L1171)



```julia
read(s::IOStream, nb::Integer; all=true)
```


Read at most `nb` bytes from `s`, returning a `Vector{UInt8}` of the bytes read.

If `all` is `true` (the default), this function will block repeatedly trying to read all requested bytes, until an error or end-of-file occurs. If `all` is `false`, at most one `read` call is performed, and the amount of data returned is device-dependent. Note that not all stream types support the `all` option.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L588-L597)



```julia
read(command::Cmd)
```


Run `command` and return the resulting output as an array of bytes.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/process.jl#L474-L478)



```julia
read(command::Cmd, String)
```


Run `command` and return the resulting output as a `String`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/process.jl#L486-L490)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.read!' href='#Base.read!'>#</a>&nbsp;<b><u>Base.read!</u></b> &mdash; <i>Function</i>.




```julia
read!(stream::IO, array::AbstractArray)
read!(filename::AbstractString, array::AbstractArray)
```


Read binary data from an I/O stream or file, filling in `array`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L509-L514)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.readbytes!' href='#Base.readbytes!'>#</a>&nbsp;<b><u>Base.readbytes!</u></b> &mdash; <i>Function</i>.




```julia
readbytes!(stream::IO, b::AbstractVector{UInt8}, nb=length(b))
```


Read at most `nb` bytes from `stream` into `b`, returning the number of bytes read. The size of `b` will be increased if needed (i.e. if `nb` is greater than `length(b)` and enough bytes could be read), but it will never be decreased.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1141-L1147)



```julia
readbytes!(stream::IOStream, b::AbstractVector{UInt8}, nb=length(b); all::Bool=true)
```


Read at most `nb` bytes from `stream` into `b`, returning the number of bytes read. The size of `b` will be increased if needed (i.e. if `nb` is greater than `length(b)` and enough bytes could be read), but it will never be decreased.

If `all` is `true` (the default), this function will block repeatedly trying to read all requested bytes, until an error or end-of-file occurs. If `all` is `false`, at most one `read` call is performed, and the amount of data returned is device-dependent. Note that not all stream types support the `all` option.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L538-L549)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_read' href='#Base.unsafe_read'>#</a>&nbsp;<b><u>Base.unsafe_read</u></b> &mdash; <i>Function</i>.




```julia
unsafe_read(io::IO, ref, nbytes::UInt)
```


Copy `nbytes` from the `IO` stream object into `ref` (converted to a pointer).

It is recommended that subtypes `T<:IO` override the following method signature to provide more efficient implementations: `unsafe_read(s::T, p::Ptr{UInt8}, n::UInt)`


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L325-L333)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unsafe_write' href='#Base.unsafe_write'>#</a>&nbsp;<b><u>Base.unsafe_write</u></b> &mdash; <i>Function</i>.




```julia
unsafe_write(io::IO, ref, nbytes::UInt)
```


Copy `nbytes` from `ref` (converted to a pointer) into the `IO` object.

It is recommended that subtypes `T<:IO` override the following method signature to provide more efficient implementations: `unsafe_write(s::T, p::Ptr{UInt8}, n::UInt)`


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L308-L316)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.readeach' href='#Base.readeach'>#</a>&nbsp;<b><u>Base.readeach</u></b> &mdash; <i>Function</i>.




```julia
readeach(io::IO, T)
```


Return an iterable object yielding [`read(io, T)`](/base/file#Base.read-Tuple{String}).

See also [`skipchars`](/base/io-network#Base.skipchars), [`eachline`](/base/io-network#Base.eachline), [`readuntil`](/base/io-network#Base.readuntil).

::: tip Julia 1.6

`readeach` requires Julia 1.6 or later.

:::

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization.\n It has many members.\n");

julia> for c in readeach(io, Char)
           c == '\n' && break
           print(c)
       end
JuliaLang is a GitHub organization.
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1359-L1379)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.peek' href='#Base.peek'>#</a>&nbsp;<b><u>Base.peek</u></b> &mdash; <i>Function</i>.




```julia
peek(stream[, T=UInt8])
```


Read and return a value of type `T` from a stream without advancing the current position in the stream.   See also [`startswith(stream, char_or_string)`](/base/strings#Base.startswith).

**Examples**

```julia
julia> b = IOBuffer("julia");

julia> peek(b)
0x6a

julia> position(b)
0

julia> peek(b, Char)
'j': ASCII/Unicode U+006A (category Ll: Letter, lowercase)
```


::: tip Julia 1.5

The method which accepts a type requires Julia 1.5 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/essentials.jl#L1153-L1176)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.position' href='#Base.position'>#</a>&nbsp;<b><u>Base.position</u></b> &mdash; <i>Function</i>.




```julia
position(l::Lexer)
```


Returns the current position.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base//Users/lalonso/Documents/julia/base/JuliaSyntax/src/tokenize.jl#L354-L358)



```julia
position(s)
```


Get the current position of a stream.

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization.");

julia> seek(io, 5);

julia> position(io)
5

julia> skip(io, 10);

julia> position(io)
15

julia> seekend(io);

julia> position(io)
35
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L193-L217)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.seek' href='#Base.seek'>#</a>&nbsp;<b><u>Base.seek</u></b> &mdash; <i>Function</i>.




```julia
seek(s, pos)
```


Seek a stream to the given position.

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization.");

julia> seek(io, 5);

julia> read(io, Char)
'L': ASCII/Unicode U+004C (category Lu: Letter, uppercase)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L114-L128)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.seekstart' href='#Base.seekstart'>#</a>&nbsp;<b><u>Base.seekstart</u></b> &mdash; <i>Function</i>.




```julia
seekstart(s)
```


Seek a stream to its beginning.

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization.");

julia> seek(io, 5);

julia> read(io, Char)
'L': ASCII/Unicode U+004C (category Lu: Letter, uppercase)

julia> seekstart(io);

julia> read(io, Char)
'J': ASCII/Unicode U+004A (category Lu: Letter, uppercase)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L136-L155)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.seekend' href='#Base.seekend'>#</a>&nbsp;<b><u>Base.seekend</u></b> &mdash; <i>Function</i>.




```julia
seekend(s)
```


Seek a stream to its end.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L158-L162)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.skip' href='#Base.skip'>#</a>&nbsp;<b><u>Base.skip</u></b> &mdash; <i>Function</i>.




```julia
skip(s, offset)
```


Seek a stream relative to the current position.

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization.");

julia> seek(io, 5);

julia> skip(io, 10);

julia> read(io, Char)
'G': ASCII/Unicode U+0047 (category Lu: Letter, uppercase)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L169-L185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.mark' href='#Base.mark'>#</a>&nbsp;<b><u>Base.mark</u></b> &mdash; <i>Function</i>.




```julia
mark(s::IO)
```


Add a mark at the current position of stream `s`. Return the marked position.

See also [`unmark`](/base/io-network#Base.unmark), [`reset`](/base/io-network#Base.reset-Tuple{IO}), [`ismarked`](/base/io-network#Base.ismarked).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1396-L1402)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unmark' href='#Base.unmark'>#</a>&nbsp;<b><u>Base.unmark</u></b> &mdash; <i>Function</i>.




```julia
unmark(s::IO)
```


Remove a mark from stream `s`. Return `true` if the stream was marked, `false` otherwise.

See also [`mark`](/base/io-network#Base.mark), [`reset`](/base/io-network#Base.reset-Tuple{IO}), [`ismarked`](/base/io-network#Base.ismarked).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1407-L1413)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reset-Tuple{IO}' href='#Base.reset-Tuple{IO}'>#</a>&nbsp;<b><u>Base.reset</u></b> &mdash; <i>Method</i>.




```julia
reset(s::IO)
```


Reset a stream `s` to a previously marked position, and remove the mark. Return the previously marked position. Throw an error if the stream is not marked.

See also [`mark`](/base/io-network#Base.mark), [`unmark`](/base/io-network#Base.unmark), [`ismarked`](/base/io-network#Base.ismarked).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1420-L1427)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ismarked' href='#Base.ismarked'>#</a>&nbsp;<b><u>Base.ismarked</u></b> &mdash; <i>Function</i>.




```julia
ismarked(s::IO)
```


Return `true` if stream `s` is marked.

See also [`mark`](/base/io-network#Base.mark), [`unmark`](/base/io-network#Base.unmark), [`reset`](/base/io-network#Base.reset-Tuple{IO}).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1436-L1442)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eof' href='#Base.eof'>#</a>&nbsp;<b><u>Base.eof</u></b> &mdash; <i>Function</i>.




```julia
eof(stream) -> Bool
```


Test whether an I/O stream is at end-of-file. If the stream is not yet exhausted, this function will block to wait for more data if necessary, and then return `false`. Therefore it is always safe to read one byte after seeing `eof` return `false`. `eof` will return `false` as long as buffered data is still available, even if the remote end of a connection is closed.

**Examples**

```julia
julia> b = IOBuffer("my buffer");

julia> eof(b)
false

julia> seekend(b);

julia> eof(b)
true
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L182-L203)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isreadonly' href='#Base.isreadonly'>#</a>&nbsp;<b><u>Base.isreadonly</u></b> &mdash; <i>Function</i>.




```julia
isreadonly(io) -> Bool
```


Determine whether a stream is read-only.

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization");

julia> isreadonly(io)
true

julia> io = IOBuffer();

julia> isreadonly(io)
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L770-L787)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.iswritable' href='#Base.iswritable'>#</a>&nbsp;<b><u>Base.iswritable</u></b> &mdash; <i>Function</i>.




```julia
iswritable(path::String)
```


Return `true` if the access permissions for the given `path` permitted writing by the current user.

::: tip Note

This permission may change before the user calls `open`, so it is recommended to just call `open` alone and handle the error if that fails, rather than calling `iswritable` first.

:::

::: tip Note

Currently this function does not correctly interrogate filesystem ACLs on Windows, therefore it can return wrong results.

:::

::: tip Julia 1.11

This function requires at least Julia 1.11.

:::

See also [`ispath`](/base/file#Base.Filesystem.ispath), [`isexecutable`](/base/io-network#Base.isexecutable), [`isreadable`](/base/io-network#Base.isreadable).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/filesystem.jl#L422-L440)



```julia
iswritable(io) -> Bool
```


Return `false` if the specified IO object is not writable.

**Examples**

```julia
julia> open("myfile.txt", "w") do io
           print(io, "Hello world!");
           iswritable(io)
       end
true

julia> open("myfile.txt", "r") do io
           iswritable(io)
       end
false

julia> rm("myfile.txt")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L159-L179)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isreadable' href='#Base.isreadable'>#</a>&nbsp;<b><u>Base.isreadable</u></b> &mdash; <i>Function</i>.




```julia
isreadable(path::String)
```


Return `true` if the access permissions for the given `path` permitted reading by the current user.

::: tip Note

This permission may change before the user calls `open`, so it is recommended to just call `open` alone and handle the error if that fails, rather than calling `isreadable` first.

:::

::: tip Note

Currently this function does not correctly interrogate filesystem ACLs on Windows, therefore it can return wrong results.

:::

::: tip Julia 1.11

This function requires at least Julia 1.11.

:::

See also [`ispath`](/base/file#Base.Filesystem.ispath), [`isexecutable`](/base/io-network#Base.isexecutable), [`iswritable`](/base/io-network#Base.iswritable).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/filesystem.jl#L395-L413)



```julia
isreadable(io) -> Bool
```


Return `false` if the specified IO object is not readable.

**Examples**

```julia
julia> open("myfile.txt", "w") do io
           print(io, "Hello world!");
           isreadable(io)
       end
false

julia> open("myfile.txt", "r") do io
           isreadable(io)
       end
true

julia> rm("myfile.txt")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L136-L156)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isexecutable' href='#Base.isexecutable'>#</a>&nbsp;<b><u>Base.isexecutable</u></b> &mdash; <i>Function</i>.




```julia
isexecutable(path::String)
```


Return `true` if the given `path` has executable permissions.

::: tip Note

This permission may change before the user executes `path`, so it is recommended to execute the file and handle the error if that fails, rather than calling `isexecutable` first.

:::

::: tip Note

Prior to Julia 1.6, this did not correctly interrogate filesystem ACLs on Windows, therefore it would return `true` for any file.  From Julia 1.6 on, it correctly determines whether the file is marked as executable or not.

:::

See also [`ispath`](/base/file#Base.Filesystem.ispath), [`isreadable`](/base/io-network#Base.isreadable), [`iswritable`](/base/io-network#Base.iswritable).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/filesystem.jl#L369-L386)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isopen' href='#Base.isopen'>#</a>&nbsp;<b><u>Base.isopen</u></b> &mdash; <i>Function</i>.




```julia
isopen(object) -> Bool
```


Determine whether an object - such as a stream or timer – is not yet closed. Once an object is closed, it will never produce a new event. However, since a closed stream may still have data to read in its buffer, use [`eof`](/base/io-network#Base.eof) to check for the ability to read data. Use the `FileWatching` package to be notified when a stream might be writable or readable.

**Examples**

```julia
julia> io = open("my_file.txt", "w+");

julia> isopen(io)
true

julia> close(io)

julia> isopen(io)
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L41-L62)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fd' href='#Base.fd'>#</a>&nbsp;<b><u>Base.fd</u></b> &mdash; <i>Function</i>.




```julia
fd(stream)
```


Return the file descriptor backing the stream or file. Note that this function only applies to synchronous `File`&#39;s and `IOStream`&#39;s not to any of the asynchronous streams.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L49-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.redirect_stdio' href='#Base.redirect_stdio'>#</a>&nbsp;<b><u>Base.redirect_stdio</u></b> &mdash; <i>Function</i>.




```julia
redirect_stdio(;stdin=stdin, stderr=stderr, stdout=stdout)
```


Redirect a subset of the streams `stdin`, `stderr`, `stdout`. Each argument must be an `IOStream`, `TTY`, [`Pipe`](/base/io-network#Base.Pipe), socket, or `devnull`.

::: tip Julia 1.7

`redirect_stdio` requires Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1335-L1344)



```julia
redirect_stdio(f; stdin=nothing, stderr=nothing, stdout=nothing)
```


Redirect a subset of the streams `stdin`, `stderr`, `stdout`, call `f()` and restore each stream.

Possible values for each stream are:
- `nothing` indicating the stream should not be redirected.
  
- `path::AbstractString` redirecting the stream to the file at `path`.
  
- `io` an `IOStream`, `TTY`, [`Pipe`](/base/io-network#Base.Pipe), socket, or `devnull`.
  

**Examples**

```julia
julia> redirect_stdio(stdout="stdout.txt", stderr="stderr.txt") do
           print("hello stdout")
           print(stderr, "hello stderr")
       end

julia> read("stdout.txt", String)
"hello stdout"

julia> read("stderr.txt", String)
"hello stderr"
```


**Edge cases**

It is possible to pass the same argument to `stdout` and `stderr`:

```julia
julia> redirect_stdio(stdout="log.txt", stderr="log.txt", stdin=devnull) do
    ...
end
```


However it is not supported to pass two distinct descriptors of the same file.

```julia
julia> io1 = open("same/path", "w")

julia> io2 = open("same/path", "w")

julia> redirect_stdio(f, stdout=io1, stderr=io2) # not supported
```


Also the `stdin` argument may not be the same descriptor as `stdout` or `stderr`.

```julia
julia> io = open(...)

julia> redirect_stdio(f, stdout=io, stdin=io) # not supported
```


::: tip Julia 1.7

`redirect_stdio` requires Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1351-L1402)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.redirect_stdout' href='#Base.redirect_stdout'>#</a>&nbsp;<b><u>Base.redirect_stdout</u></b> &mdash; <i>Function</i>.




```julia
redirect_stdout([stream]) -> stream
```


Create a pipe to which all C and Julia level [`stdout`](/base/io-network#Base.stdout) output will be redirected. Return a stream representing the pipe ends. Data written to [`stdout`](/base/io-network#Base.stdout) may now be read from the `rd` end of the pipe.

::: tip Note

`stream` must be a compatible objects, such as an `IOStream`, `TTY`, [`Pipe`](/base/io-network#Base.Pipe), socket, or `devnull`.

:::

See also [`redirect_stdio`](/base/io-network#Base.redirect_stdio).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1292-L1305)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.redirect_stdout-Tuple{Function, Any}' href='#Base.redirect_stdout-Tuple{Function, Any}'>#</a>&nbsp;<b><u>Base.redirect_stdout</u></b> &mdash; <i>Method</i>.




```julia
redirect_stdout(f::Function, stream)
```


Run the function `f` while redirecting [`stdout`](/base/io-network#Base.stdout) to `stream`. Upon completion, [`stdout`](/base/io-network#Base.stdout) is restored to its prior setting.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1463-L1468)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.redirect_stderr' href='#Base.redirect_stderr'>#</a>&nbsp;<b><u>Base.redirect_stderr</u></b> &mdash; <i>Function</i>.




```julia
redirect_stderr([stream]) -> stream
```


Like [`redirect_stdout`](/base/io-network#Base.redirect_stdout), but for [`stderr`](/base/io-network#Base.stderr).

::: tip Note

`stream` must be a compatible objects, such as an `IOStream`, `TTY`, [`Pipe`](/base/io-network#Base.Pipe), socket, or `devnull`.

:::

See also [`redirect_stdio`](/base/io-network#Base.redirect_stdio).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1308-L1318)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.redirect_stderr-Tuple{Function, Any}' href='#Base.redirect_stderr-Tuple{Function, Any}'>#</a>&nbsp;<b><u>Base.redirect_stderr</u></b> &mdash; <i>Method</i>.




```julia
redirect_stderr(f::Function, stream)
```


Run the function `f` while redirecting [`stderr`](/base/io-network#Base.stderr) to `stream`. Upon completion, [`stderr`](/base/io-network#Base.stderr) is restored to its prior setting.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1471-L1476)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.redirect_stdin' href='#Base.redirect_stdin'>#</a>&nbsp;<b><u>Base.redirect_stdin</u></b> &mdash; <i>Function</i>.




```julia
redirect_stdin([stream]) -> stream
```


Like [`redirect_stdout`](/base/io-network#Base.redirect_stdout), but for [`stdin`](/base/io-network#Base.stdin). Note that the direction of the stream is reversed.

::: tip Note

`stream` must be a compatible objects, such as an `IOStream`, `TTY`, [`Pipe`](/base/io-network#Base.Pipe), socket, or `devnull`.

:::

See also [`redirect_stdio`](/base/io-network#Base.redirect_stdio).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1321-L1332)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.redirect_stdin-Tuple{Function, Any}' href='#Base.redirect_stdin-Tuple{Function, Any}'>#</a>&nbsp;<b><u>Base.redirect_stdin</u></b> &mdash; <i>Method</i>.




```julia
redirect_stdin(f::Function, stream)
```


Run the function `f` while redirecting [`stdin`](/base/io-network#Base.stdin) to `stream`. Upon completion, [`stdin`](/base/io-network#Base.stdin) is restored to its prior setting.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L1479-L1484)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.readchomp' href='#Base.readchomp'>#</a>&nbsp;<b><u>Base.readchomp</u></b> &mdash; <i>Function</i>.




```julia
readchomp(x)
```


Read the entirety of `x` as a string and remove a single trailing newline if there is one. Equivalent to `chomp(read(x, String))`.

**Examples**

```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\nIt has many members.\n");

julia> readchomp("my_file.txt")
"JuliaLang is a GitHub organization.\nIt has many members."

julia> rm("my_file.txt");
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1121-L1136)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.truncate' href='#Base.truncate'>#</a>&nbsp;<b><u>Base.truncate</u></b> &mdash; <i>Function</i>.




```julia
truncate(file, n)
```


Resize the file or buffer given by the first argument to exactly `n` bytes, filling previously unallocated space with &#39;\0&#39; if the file or buffer is grown.

**Examples**

```julia
julia> io = IOBuffer();

julia> write(io, "JuliaLang is a GitHub organization.")
35

julia> truncate(io, 15)
IOBuffer(data=UInt8[...], readable=true, writable=true, seekable=true, append=false, size=15, maxsize=Inf, ptr=16, mark=-1)

julia> String(take!(io))
"JuliaLang is a "

julia> io = IOBuffer();

julia> write(io, "JuliaLang is a GitHub organization.");

julia> truncate(io, 40);

julia> String(take!(io))
"JuliaLang is a GitHub organization.\0\0\0\0\0"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iostream.jl#L79-L107)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.skipchars' href='#Base.skipchars'>#</a>&nbsp;<b><u>Base.skipchars</u></b> &mdash; <i>Function</i>.




```julia
skipchars(predicate, io::IO; linecomment=nothing)
```


Advance the stream `io` such that the next-read character will be the first remaining for which `predicate` returns `false`. If the keyword argument `linecomment` is specified, all characters from that character until the start of the next line are ignored.

**Examples**

```julia
julia> buf = IOBuffer("    text")
IOBuffer(data=UInt8[...], readable=true, writable=false, seekable=true, append=false, size=8, maxsize=Inf, ptr=1, mark=-1)

julia> skipchars(isspace, buf)
IOBuffer(data=UInt8[...], readable=true, writable=false, seekable=true, append=false, size=8, maxsize=Inf, ptr=5, mark=-1)

julia> String(readavailable(buf))
"text"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1450-L1468)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.countlines' href='#Base.countlines'>#</a>&nbsp;<b><u>Base.countlines</u></b> &mdash; <i>Function</i>.




```julia
countlines(io::IO; eol::AbstractChar = '\n')
countlines(filename::AbstractString; eol::AbstractChar = '\n')
```


Read `io` until the end of the stream/file and count the number of lines. To specify a file pass the filename as the first argument. EOL markers other than `'\n'` are supported by passing them as the second argument.  The last non-empty line of `io` is counted even if it does not end with the EOL, matching the length returned by [`eachline`](/base/io-network#Base.eachline) and [`readlines`](/base/io-network#Base.readlines).

To count lines of a `String`, `countlines(IOBuffer(str))` can be used.

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization.\n");

julia> countlines(io)
1

julia> io = IOBuffer("JuliaLang is a GitHub organization.");

julia> countlines(io)
1

julia> eof(io) # counting lines moves the file pointer
true

julia> io = IOBuffer("JuliaLang is a GitHub organization.");

julia> countlines(io, eol = '.')
1
```


```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\n")
36

julia> countlines("my_file.txt")
1

julia> countlines("my_file.txt", eol = 'n')
4

julia> rm("my_file.txt")

```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1481-L1525)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.PipeBuffer' href='#Base.PipeBuffer'>#</a>&nbsp;<b><u>Base.PipeBuffer</u></b> &mdash; <i>Function</i>.




```julia
PipeBuffer(data::AbstractVector{UInt8}=UInt8[]; maxsize::Integer = typemax(Int))
```


An [`IOBuffer`](/base/io-network#Base.IOBuffer) that allows reading and performs writes by appending. Seeking and truncating are not supported. See [`IOBuffer`](/base/io-network#Base.IOBuffer) for the available constructors. If `data` is given, creates a `PipeBuffer` to operate on a data vector, optionally specifying a size beyond which the underlying `Array` may not be grown.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/iobuffer.jl#L142-L150)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.readavailable' href='#Base.readavailable'>#</a>&nbsp;<b><u>Base.readavailable</u></b> &mdash; <i>Function</i>.




```julia
readavailable(stream)
```


Read available buffered data from a stream. Actual I/O is performed only if no data has already been buffered. The result is a `Vector{UInt8}`.

::: warning Warning

The amount of data returned is implementation-dependent; for example it can depend on the internal choice of buffer size. Other functions such as [`read`](/base/io-network#Base.read) should generally be used instead.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L121-L131)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IOContext' href='#Base.IOContext'>#</a>&nbsp;<b><u>Base.IOContext</u></b> &mdash; <i>Type</i>.




```julia
IOContext
```


`IOContext` provides a mechanism for passing output configuration settings among [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}) methods.

In short, it is an immutable dictionary that is a subclass of `IO`. It supports standard dictionary operations such as [`getindex`](/base/collections#Base.getindex), and can also be used as an I/O stream.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/show.jl#L291-L298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IOContext-Tuple{IO, Pair}' href='#Base.IOContext-Tuple{IO, Pair}'>#</a>&nbsp;<b><u>Base.IOContext</u></b> &mdash; <i>Method</i>.




```julia
IOContext(io::IO, KV::Pair...)
```


Create an `IOContext` that wraps a given stream, adding the specified `key=>value` pairs to the properties of that stream (note that `io` can itself be an `IOContext`).
- use `(key => value) in io` to see if this particular combination is in the properties set
  
- use `get(io, key, default)` to retrieve the most recent value for a particular key
  

The following properties are in common use:
- `:compact`: Boolean specifying that values should be printed more compactly, e.g. that numbers should be printed with fewer digits. This is set when printing array elements. `:compact` output should not contain line breaks.
  
- `:limit`: Boolean specifying that containers should be truncated, e.g. showing `…` in place of most elements.
  
- `:displaysize`: A `Tuple{Int,Int}` giving the size in rows and columns to use for text output. This can be used to override the display size for called functions, but to get the size of the screen use the `displaysize` function.
  
- `:typeinfo`: a `Type` characterizing the information already printed concerning the type of the object about to be displayed. This is mainly useful when displaying a collection of objects of the same type, so that redundant type information can be avoided (e.g. `[Float16(0)]` can be shown as &quot;Float16[0.0]&quot; instead of &quot;Float16[Float16(0.0)]&quot; : while displaying the elements of the array, the `:typeinfo` property will be set to `Float16`).
  
- `:color`: Boolean specifying whether ANSI color/escape codes are supported/expected. By default, this is determined by whether `io` is a compatible terminal and by any `--color` command-line flag when `julia` was launched.
  

**Examples**

```julia
julia> io = IOBuffer();

julia> printstyled(IOContext(io, :color => true), "string", color=:red)

julia> String(take!(io))
"\e[31mstring\e[39m"

julia> printstyled(io, "string", color=:red)

julia> String(take!(io))
"string"
```


```julia
julia> print(IOContext(stdout, :compact => false), 1.12341234)
1.12341234
julia> print(IOContext(stdout, :compact => true), 1.12341234)
1.12341
```


```julia
julia> function f(io::IO)
           if get(io, :short, false)
               print(io, "short")
           else
               print(io, "loooooong")
           end
       end
f (generic function with 1 method)

julia> f(stdout)
loooooong
julia> f(IOContext(stdout, :short => true))
short
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/show.jl#L342-L409)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.IOContext-Tuple{IO, IOContext}' href='#Base.IOContext-Tuple{IO, IOContext}'>#</a>&nbsp;<b><u>Base.IOContext</u></b> &mdash; <i>Method</i>.




```julia
IOContext(io::IO, context::IOContext)
```


Create an `IOContext` that wraps an alternate `IO` but inherits the properties of `context`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/show.jl#L335-L339)

</div>
<br>

## Text I/O {#Text-I/O}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.show-Tuple{IO, Any}' href='#Base.show-Tuple{IO, Any}'>#</a>&nbsp;<b><u>Base.show</u></b> &mdash; <i>Method</i>.




```julia
show([io::IO = stdout], x)
```


Write a text representation of a value `x` to the output stream `io`. New types `T` should overload `show(io::IO, x::T)`. The representation used by `show` generally includes Julia-specific formatting and type information, and should be parseable Julia code when possible.

[`repr`](/base/io-network#Base.repr-Tuple{MIME,%20Any}) returns the output of `show` as a string.

For a more verbose human-readable text output for objects of type `T`, define `show(io::IO, ::MIME"text/plain", ::T)` in addition. Checking the `:compact` [`IOContext`](/base/io-network#Base.IOContext) key (often checked as `get(io, :compact, false)::Bool`) of `io` in such methods is recommended, since some containers show their elements by calling this method with `:compact => true`.

See also [`print`](/base/io-network#Base.print), which writes un-decorated representations.

**Examples**

```julia
julia> show("Hello World!")
"Hello World!"
julia> print("Hello World!")
Hello World!
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/show.jl#L447-L473)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.summary' href='#Base.summary'>#</a>&nbsp;<b><u>Base.summary</u></b> &mdash; <i>Function</i>.




```julia
summary(io::IO, x)
str = summary(x)
```


Print to a stream `io`, or return a string `str`, giving a brief description of a value. By default returns `string(typeof(x))`, e.g. [`Int64`](/base/numbers#Core.Int64).

For arrays, returns a string of size and type info, e.g. `10-element Array{Int64,1}`.

**Examples**

```julia
julia> summary(1)
"Int64"

julia> summary(zeros(2))
"2-element Vector{Float64}"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/show.jl#L3137-L3155)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.print' href='#Base.print'>#</a>&nbsp;<b><u>Base.print</u></b> &mdash; <i>Function</i>.




```julia
print([io::IO], xs...)
```


Write to `io` (or to the default output stream [`stdout`](/base/io-network#Base.stdout) if `io` is not given) a canonical (un-decorated) text representation. The representation used by `print` includes minimal formatting and tries to avoid Julia-specific details.

`print` falls back to calling `show`, so most types should just define `show`. Define `print` if your type has a separate &quot;plain&quot; representation. For example, `show` displays strings with quotes, and `print` displays strings without quotes.

See also [`println`](/base/io-network#Base.println), [`string`](/base/strings#Base.string), [`printstyled`](/base/io-network#Base.printstyled).

**Examples**

```julia
julia> print("Hello World!")
Hello World!
julia> io = IOBuffer();

julia> print(io, "Hello", ' ', :World!)

julia> String(take!(io))
"Hello World!"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/strings/io.jl#L5-L31)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.println' href='#Base.println'>#</a>&nbsp;<b><u>Base.println</u></b> &mdash; <i>Function</i>.




```julia
println([io::IO], xs...)
```


Print (using [`print`](/base/io-network#Base.print)) `xs` to `io` followed by a newline. If `io` is not supplied, prints to the default output stream [`stdout`](/base/io-network#Base.stdout).

See also [`printstyled`](/base/io-network#Base.printstyled) to add colors etc.

**Examples**

```julia
julia> println("Hello, world")
Hello, world

julia> io = IOBuffer();

julia> println(io, "Hello", ',', " world.")

julia> String(take!(io))
"Hello, world.\n"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/strings/io.jl#L54-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.printstyled' href='#Base.printstyled'>#</a>&nbsp;<b><u>Base.printstyled</u></b> &mdash; <i>Function</i>.




```julia
printstyled([io], xs...; bold::Bool=false, italic::Bool=false, underline::Bool=false, blink::Bool=false, reverse::Bool=false, hidden::Bool=false, color::Union{Symbol,Int}=:normal)
```


Print `xs` in a color specified as a symbol or integer, optionally in bold.

Keyword `color` may take any of the values `:normal`, `:italic`, `:default`, `:bold`, `:black`, `:blink`, `:blue`, `:cyan`, `:green`, `:hidden`, `:light_black`, `:light_blue`, `:light_cyan`, `:light_green`, `:light_magenta`, `:light_red`, `:light_white`, `:light_yellow`, `:magenta`, `:nothing`, `:red`, `:reverse`, `:underline`, `:white`, or  `:yellow` or an integer between 0 and 255 inclusive. Note that not all terminals support 256 colors.

Keywords `bold=true`, `italic=true`, `underline=true`, `blink=true` are self-explanatory. Keyword `reverse=true` prints with foreground and background colors exchanged, and `hidden=true` should be invisible in the terminal but can still be copied. These properties can be used in any combination.

See also [`print`](/base/io-network#Base.print), [`println`](/base/io-network#Base.println), [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}).

::: tip Note

Not all terminals support italic output. Some terminals interpret italic as reverse or blink.

:::

::: tip Julia 1.7

Keywords except `color` and `bold` were added in Julia 1.7.

:::

::: tip Julia 1.10

Support for italic output was added in Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/util.jl#L117-L140)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sprint' href='#Base.sprint'>#</a>&nbsp;<b><u>Base.sprint</u></b> &mdash; <i>Function</i>.




```julia
sprint(f::Function, args...; context=nothing, sizehint=0)
```


Call the given function with an I/O stream and the supplied extra arguments. Everything written to this I/O stream is returned as a string. `context` can be an [`IOContext`](/base/io-network#Base.IOContext) whose properties will be used, a `Pair` specifying a property and its value, or a tuple of `Pair` specifying multiple properties and their values. `sizehint` suggests the capacity of the buffer (in bytes).

The optional keyword argument `context` can be set to a `:key=>value` pair, a tuple of `:key=>value` pairs, or an `IO` or [`IOContext`](/base/io-network#Base.IOContext) object whose attributes are used for the I/O stream passed to `f`.  The optional `sizehint` is a suggested size (in bytes) to allocate for the buffer used to write the string.

::: tip Julia 1.7

Passing a tuple to keyword `context` requires Julia 1.7 or later.

:::

**Examples**

```julia
julia> sprint(show, 66.66666; context=:compact => true)
"66.6667"

julia> sprint(showerror, BoundsError([1], 100))
"BoundsError: attempt to access 1-element Vector{Int64} at index [100]"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/strings/io.jl#L79-L106)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.showerror' href='#Base.showerror'>#</a>&nbsp;<b><u>Base.showerror</u></b> &mdash; <i>Function</i>.




```julia
showerror(io, e)
```


Show a descriptive representation of an exception object `e`. This method is used to display the exception after a call to [`throw`](/base/base#Core.throw).

**Examples**

```julia
julia> struct MyException <: Exception
           msg::String
       end

julia> function Base.showerror(io::IO, err::MyException)
           print(io, "MyException: ")
           print(io, err.msg)
       end

julia> err = MyException("test exception")
MyException("test exception")

julia> sprint(showerror, err)
"MyException: test exception"

julia> throw(MyException("test exception"))
ERROR: MyException: test exception
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/errorshow.jl#L3-L29)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.dump' href='#Base.dump'>#</a>&nbsp;<b><u>Base.dump</u></b> &mdash; <i>Function</i>.




```julia
dump(x; maxdepth=8)
```


Show every part of the representation of a value. The depth of the output is truncated at `maxdepth`.

**Examples**

```julia
julia> struct MyStruct
           x
           y
       end

julia> x = MyStruct(1, (2,3));

julia> dump(x)
MyStruct
  x: Int64 1
  y: Tuple{Int64, Int64}
    1: Int64 2
    2: Int64 3

julia> dump(x; maxdepth = 1)
MyStruct
  x: Int64 1
  y: Tuple{Int64, Int64}
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/show.jl#L3044-L3071)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.@dump' href='#Base.Meta.@dump'>#</a>&nbsp;<b><u>Base.Meta.@dump</u></b> &mdash; <i>Macro</i>.




```julia
@dump expr
```


Show every part of the representation of the given expression. Equivalent to [`dump(:(expr))`](/base/io-network#Base.dump).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/meta.jl#L146-L151)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.readline' href='#Base.readline'>#</a>&nbsp;<b><u>Base.readline</u></b> &mdash; <i>Function</i>.




```julia
readline(io::IO=stdin; keep::Bool=false)
readline(filename::AbstractString; keep::Bool=false)
```


Read a single line of text from the given I/O stream or file (defaults to `stdin`). When reading from a file, the text is assumed to be encoded in UTF-8. Lines in the input end with `'\n'` or `"\r\n"` or the end of an input stream. When `keep` is false (as it is by default), these trailing newline characters are removed from the line before it is returned. When `keep` is true, they are returned as part of the line.

Return a `String`.   See also [`copyline`](/base/io-network#Base.copyline) to instead write in-place to another stream (which can be a preallocated [`IOBuffer`](/base/io-network#Base.IOBuffer)).

See also [`readuntil`](/base/io-network#Base.readuntil) for reading until more general delimiters.

**Examples**

```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\nIt has many members.\n");

julia> readline("my_file.txt")
"JuliaLang is a GitHub organization."

julia> readline("my_file.txt", keep=true)
"JuliaLang is a GitHub organization.\n"

julia> rm("my_file.txt")
```


```julia
julia> print("Enter your name: ")
Enter your name:

julia> your_name = readline()
Logan
"Logan"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L580-L616)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.readuntil' href='#Base.readuntil'>#</a>&nbsp;<b><u>Base.readuntil</u></b> &mdash; <i>Function</i>.




```julia
readuntil(stream::IO, delim; keep::Bool = false)
readuntil(filename::AbstractString, delim; keep::Bool = false)
```


Read a string from an I/O `stream` or a file, up to the given delimiter. The delimiter can be a `UInt8`, `AbstractChar`, string, or vector. Keyword argument `keep` controls whether the delimiter is included in the result. The text is assumed to be encoded in UTF-8.

Return a `String` if `delim` is an `AbstractChar` or a string or otherwise return a `Vector{typeof(delim)}`.   See also [`copyuntil`](/base/io-network#Base.copyuntil) to instead write in-place to another stream (which can be a preallocated [`IOBuffer`](/base/io-network#Base.IOBuffer)).

**Examples**

```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\nIt has many members.\n");

julia> readuntil("my_file.txt", 'L')
"Julia"

julia> readuntil("my_file.txt", '.', keep = true)
"JuliaLang is a GitHub organization."

julia> rm("my_file.txt")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L519-L544)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.readlines' href='#Base.readlines'>#</a>&nbsp;<b><u>Base.readlines</u></b> &mdash; <i>Function</i>.




```julia
readlines(io::IO=stdin; keep::Bool=false)
readlines(filename::AbstractString; keep::Bool=false)
```


Read all lines of an I/O stream or a file as a vector of strings. Behavior is equivalent to saving the result of reading [`readline`](/base/io-network#Base.readline) repeatedly with the same arguments and saving the resulting lines as a vector of strings.  See also [`eachline`](/base/io-network#Base.eachline) to iterate over the lines without reading them all at once.

**Examples**

```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\nIt has many members.\n");

julia> readlines("my_file.txt")
2-element Vector{String}:
 "JuliaLang is a GitHub organization."
 "It has many members."

julia> readlines("my_file.txt", keep=true)
2-element Vector{String}:
 "JuliaLang is a GitHub organization.\n"
 "It has many members.\n"

julia> rm("my_file.txt")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L677-L702)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eachline' href='#Base.eachline'>#</a>&nbsp;<b><u>Base.eachline</u></b> &mdash; <i>Function</i>.




```julia
eachline(io::IO=stdin; keep::Bool=false)
eachline(filename::AbstractString; keep::Bool=false)
```


Create an iterable `EachLine` object that will yield each line from an I/O stream or a file. Iteration calls [`readline`](/base/io-network#Base.readline) on the stream argument repeatedly with `keep` passed through, determining whether trailing end-of-line characters are retained. When called with a file name, the file is opened once at the beginning of iteration and closed at the end. If iteration is interrupted, the file will be closed when the `EachLine` object is garbage collected.

To iterate over each line of a `String`, `eachline(IOBuffer(str))` can be used.

[`Iterators.reverse`](/base/iterators#Base.Iterators.reverse) can be used on an `EachLine` object to read the lines in reverse order (for files, buffers, and other I/O streams supporting [`seek`](/base/io-network#Base.seek)), and [`first`](/base/collections#Base.first) or [`last`](/base/collections#Base.last) can be used to extract the initial or final lines, respectively.

**Examples**

```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\n It has many members.\n");

julia> for line in eachline("my_file.txt")
           print(line)
       end
JuliaLang is a GitHub organization. It has many members.

julia> rm("my_file.txt");
```


::: tip Julia 1.8

Julia 1.8 is required to use `Iterators.reverse` or `last` with `eachline` iterators.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L1193-L1225)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copyline' href='#Base.copyline'>#</a>&nbsp;<b><u>Base.copyline</u></b> &mdash; <i>Function</i>.




```julia
copyline(out::IO, io::IO=stdin; keep::Bool=false)
copyline(out::IO, filename::AbstractString; keep::Bool=false)
```


Copy a single line of text from an I/O `stream` or a file to the `out` stream, returning `out`.

When reading from a file, the text is assumed to be encoded in UTF-8. Lines in the input end with `'\n'` or `"\r\n"` or the end of an input stream. When `keep` is false (as it is by default), these trailing newline characters are removed from the line before it is returned. When `keep` is true, they are returned as part of the line.

Similar to [`readline`](/base/io-network#Base.readline), which returns a `String`; in contrast, `copyline` writes directly to `out`, without allocating a string. (This can be used, for example, to read data into a pre-allocated [`IOBuffer`](/base/io-network#Base.IOBuffer).)

See also [`copyuntil`](/base/io-network#Base.copyuntil) for reading until more general delimiters.

**Examples**

```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\nIt has many members.\n");

julia> String(take!(copyline(IOBuffer(), "my_file.txt")))
"JuliaLang is a GitHub organization."

julia> String(take!(copyline(IOBuffer(), "my_file.txt", keep=true)))
"JuliaLang is a GitHub organization.\n"

julia> rm("my_file.txt")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L622-L653)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copyuntil' href='#Base.copyuntil'>#</a>&nbsp;<b><u>Base.copyuntil</u></b> &mdash; <i>Function</i>.




```julia
copyuntil(out::IO, stream::IO, delim; keep::Bool = false)
copyuntil(out::IO, filename::AbstractString, delim; keep::Bool = false)
```


Copy a string from an I/O `stream` or a file, up to the given delimiter, to the `out` stream, returning `out`. The delimiter can be a `UInt8`, `AbstractChar`, string, or vector. Keyword argument `keep` controls whether the delimiter is included in the result. The text is assumed to be encoded in UTF-8.

Similar to [`readuntil`](/base/io-network#Base.readuntil), which returns a `String`; in contrast, `copyuntil` writes directly to `out`, without allocating a string. (This can be used, for example, to read data into a pre-allocated [`IOBuffer`](/base/io-network#Base.IOBuffer).)

**Examples**

```julia
julia> write("my_file.txt", "JuliaLang is a GitHub organization.\nIt has many members.\n");

julia> String(take!(copyuntil(IOBuffer(), "my_file.txt", 'L')))
"Julia"

julia> String(take!(copyuntil(IOBuffer(), "my_file.txt", '.', keep = true)))
"JuliaLang is a GitHub organization."

julia> rm("my_file.txt")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L551-L577)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.displaysize' href='#Base.displaysize'>#</a>&nbsp;<b><u>Base.displaysize</u></b> &mdash; <i>Function</i>.




```julia
displaysize([io::IO]) -> (lines, columns)
```


Return the nominal size of the screen that may be used for rendering output to this `IO` object. If no input is provided, the environment variables `LINES` and `COLUMNS` are read. If those are not set, a default size of `(24, 80)` is returned.

**Examples**

```julia
julia> withenv("LINES" => 30, "COLUMNS" => 100) do
           displaysize()
       end
(30, 100)
```


To get your TTY size,

```julia
julia> displaysize(stdout)
(34, 147)
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/stream.jl#L545-L567)

</div>
<br>

## Multimedia I/O {#Multimedia-I/O}

Just as text output is performed by [`print`](/base/io-network#Base.print) and user-defined types can indicate their textual representation by overloading [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}), Julia provides a standardized mechanism for rich multimedia output (such as images, formatted text, or even audio and video), consisting of three parts:
- A function [`display(x)`](/base/io-network#Base.Multimedia.display) to request the richest available multimedia display of a Julia object `x` (with a plain-text fallback).
  
- Overloading [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}) allows one to indicate arbitrary multimedia representations (keyed by standard MIME types) of user-defined types.
  
- Multimedia-capable display backends may be registered by subclassing a generic [`AbstractDisplay`](/base/io-network#Base.Multimedia.AbstractDisplay) type and pushing them onto a stack of display backends via [`pushdisplay`](/base/io-network#Base.Multimedia.pushdisplay).
  

The base Julia runtime provides only plain-text display, but richer displays may be enabled by loading external modules or by using graphical Julia environments (such as the IPython-based IJulia notebook).
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.AbstractDisplay' href='#Base.Multimedia.AbstractDisplay'>#</a>&nbsp;<b><u>Base.Multimedia.AbstractDisplay</u></b> &mdash; <i>Type</i>.




```julia
AbstractDisplay
```


Abstract supertype for rich display output devices. [`TextDisplay`](/base/io-network#Base.Multimedia.TextDisplay) is a subtype of this.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L219-L224)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.display' href='#Base.Multimedia.display'>#</a>&nbsp;<b><u>Base.Multimedia.display</u></b> &mdash; <i>Function</i>.




```julia
display(x)
display(d::AbstractDisplay, x)
display(mime, x)
display(d::AbstractDisplay, mime, x)
```


Display `x` using the topmost applicable display in the display stack, typically using the richest supported multimedia output for `x`, with plain-text [`stdout`](/base/io-network#Base.stdout) output as a fallback. The `display(d, x)` variant attempts to display `x` on the given display `d` only, throwing a [`MethodError`](/base/base#Core.MethodError) if `d` cannot display objects of this type.

In general, you cannot assume that `display` output goes to `stdout` (unlike [`print(x)`](/base/io-network#Base.print) or [`show(x)`](/base/io-network#Base.show-Tuple{IO,%20Any})).  For example, `display(x)` may open up a separate window with an image. `display(x)` means &quot;show `x` in the best way you can for the current output device(s).&quot; If you want REPL-like text output that is guaranteed to go to `stdout`, use [`show(stdout, "text/plain", x)`](/base/io-network#Base.show-Tuple{IO,%20Any}) instead.

There are also two variants with a `mime` argument (a MIME type string, such as `"image/png"`), which attempt to display `x` using the requested MIME type _only_, throwing a `MethodError` if this type is not supported by either the display(s) or by `x`. With these variants, one can also supply the &quot;raw&quot; data in the requested MIME type by passing `x::AbstractString` (for MIME types with text-based storage, such as text/html or application/postscript) or `x::Vector{UInt8}` (for binary MIME types).

To customize how instances of a type are displayed, overload [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}) rather than `display`, as explained in the manual section on [custom pretty-printing](/manual/types#man-custom-pretty-printing).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L309-L335)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.redisplay' href='#Base.Multimedia.redisplay'>#</a>&nbsp;<b><u>Base.Multimedia.redisplay</u></b> &mdash; <i>Function</i>.




```julia
redisplay(x)
redisplay(d::AbstractDisplay, x)
redisplay(mime, x)
redisplay(d::AbstractDisplay, mime, x)
```


By default, the `redisplay` functions simply call [`display`](/base/io-network#Base.Multimedia.display). However, some display backends may override `redisplay` to modify an existing display of `x` (if any). Using `redisplay` is also a hint to the backend that `x` may be redisplayed several times, and the backend may choose to defer the display until (for example) the next interactive prompt.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L382-L394)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.displayable' href='#Base.Multimedia.displayable'>#</a>&nbsp;<b><u>Base.Multimedia.displayable</u></b> &mdash; <i>Function</i>.




```julia
displayable(mime) -> Bool
displayable(d::AbstractDisplay, mime) -> Bool
```


Return a boolean value indicating whether the given `mime` type (string) is displayable by any of the displays in the current display stack, or specifically by the display `d` in the second variant.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L231-L238)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.show-Tuple{IO, Any, Any}' href='#Base.show-Tuple{IO, Any, Any}'>#</a>&nbsp;<b><u>Base.show</u></b> &mdash; <i>Method</i>.




```julia
show(io::IO, mime, x)
```


The [`display`](/base/io-network#Base.Multimedia.display) functions ultimately call `show` in order to write an object `x` as a given `mime` type to a given I/O stream `io` (usually a memory buffer), if possible. In order to provide a rich multimedia representation of a user-defined type `T`, it is only necessary to define a new `show` method for `T`, via: `show(io, ::MIME"mime", x::T) = ...`, where `mime` is a MIME-type string and the function body calls [`write`](/base/io-network#Base.write) (or similar) to write that representation of `x` to `io`. (Note that the `MIME""` notation only supports literal strings; to construct `MIME` types in a more flexible manner use `MIME{Symbol("")}`.)

For example, if you define a `MyImage` type and know how to write it to a PNG file, you could define a function `show(io, ::MIME"image/png", x::MyImage) = ...` to allow your images to be displayed on any PNG-capable `AbstractDisplay` (such as IJulia). As usual, be sure to `import Base.show` in order to add new methods to the built-in Julia function `show`.

Technically, the `MIME"mime"` macro defines a singleton type for the given `mime` string, which allows us to exploit Julia&#39;s dispatch mechanisms in determining how to display objects of any given type.

The default MIME type is `MIME"text/plain"`. There is a fallback definition for `text/plain` output that calls `show` with 2 arguments, so it is not always necessary to add a method for that case. If a type benefits from custom human-readable output though, `show(::IO, ::MIME"text/plain", ::T)` should be defined. For example, the `Day` type uses `1 day` as the output for the `text/plain` MIME type, and `Day(1)` as the output of 2-argument `show`.

**Examples**

```julia
julia> struct Day
           n::Int
       end

julia> Base.show(io::IO, ::MIME"text/plain", d::Day) = print(io, d.n, " day")

julia> Day(1)
1 day
```


Container types generally implement 3-argument `show` by calling `show(io, MIME"text/plain"(), x)` for elements `x`, with `:compact => true` set in an [`IOContext`](/base/io-network#Base.IOContext) passed as the first argument.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L79-L121)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.showable' href='#Base.Multimedia.showable'>#</a>&nbsp;<b><u>Base.Multimedia.showable</u></b> &mdash; <i>Function</i>.




```julia
showable(mime, x)
```


Return a boolean value indicating whether or not the object `x` can be written as the given `mime` type.

(By default, this is determined automatically by the existence of the corresponding [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}) method for `typeof(x)`.  Some types provide custom `showable` methods; for example, if the available MIME formats depend on the _value_ of `x`.)

**Examples**

```julia
julia> showable(MIME("text/plain"), rand(5))
true

julia> showable("image/png", rand(5))
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L57-L75)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.repr-Tuple{MIME, Any}' href='#Base.repr-Tuple{MIME, Any}'>#</a>&nbsp;<b><u>Base.repr</u></b> &mdash; <i>Method</i>.




```julia
repr(mime, x; context=nothing)
```


Return an `AbstractString` or `Vector{UInt8}` containing the representation of `x` in the requested `mime` type, as written by [`show(io, mime, x)`](/base/io-network#Base.show-Tuple{IO,%20Any}) (throwing a [`MethodError`](/base/base#Core.MethodError) if no appropriate `show` is available). An `AbstractString` is returned for MIME types with textual representations (such as `"text/html"` or `"application/postscript"`), whereas binary data is returned as `Vector{UInt8}`. (The function `istextmime(mime)` returns whether or not Julia treats a given `mime` type as text.)

The optional keyword argument `context` can be set to `:key=>value` pair or an `IO` or [`IOContext`](/base/io-network#Base.IOContext) object whose attributes are used for the I/O stream passed to `show`.

As a special case, if `x` is an `AbstractString` (for textual MIME types) or a `Vector{UInt8}` (for binary MIME types), the `repr` function assumes that `x` is already in the requested `mime` format and simply returns `x`. This special case does not apply to the `"text/plain"` MIME type. This is useful so that raw data can be passed to `display(m::MIME, x)`.

In particular, `repr("text/plain", x)` is typically a &quot;pretty-printed&quot; version of `x` designed for human consumption.  See also [`repr(x)`](/base/strings#Base.repr-Tuple{Any}) to instead return a string corresponding to [`show(x)`](/base/io-network#Base.show-Tuple{IO,%20Any}) that may be closer to how the value of `x` would be entered in Julia.

**Examples**

```julia
julia> A = [1 2; 3 4];

julia> repr("text/plain", A)
"2×2 Matrix{Int64}:\n 1  2\n 3  4"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L125-L158)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.MIME' href='#Base.Multimedia.MIME'>#</a>&nbsp;<b><u>Base.Multimedia.MIME</u></b> &mdash; <i>Type</i>.




```julia
MIME
```


A type representing a standard internet data format. &quot;MIME&quot; stands for &quot;Multipurpose Internet Mail Extensions&quot;, since the standard was originally used to describe multimedia attachments to email messages.

A `MIME` object can be passed as the second argument to [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}) to request output in that format.

**Examples**

```julia
julia> show(stdout, MIME("text/plain"), "hi")
"hi"
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L16-L31)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.@MIME_str' href='#Base.Multimedia.@MIME_str'>#</a>&nbsp;<b><u>Base.Multimedia.@MIME_str</u></b> &mdash; <i>Macro</i>.




```julia
@MIME_str
```


A convenience macro for writing [`MIME`](/base/io-network#Base.Multimedia.MIME) types, typically used when adding methods to [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}). For example the syntax `show(io::IO, ::MIME"text/html", x::MyType) = ...` could be used to define how to write an HTML representation of `MyType`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L34-L41)

</div>
<br>

As mentioned above, one can also define new display backends. For example, a module that can display PNG images in a window can register this capability with Julia, so that calling [`display(x)`](/base/io-network#Base.Multimedia.display) on types with PNG representations will automatically display the image using the module&#39;s window.

In order to define a new display backend, one should first create a subtype `D` of the abstract class [`AbstractDisplay`](/base/io-network#Base.Multimedia.AbstractDisplay).  Then, for each MIME type (`mime` string) that can be displayed on `D`, one should define a function `display(d::D, ::MIME"mime", x) = ...` that displays `x` as that MIME type, usually by calling [`show(io, mime, x)`](/base/io-network#Base.show-Tuple{IO,%20Any}) or [`repr(io, mime, x)`](/base/io-network#Base.repr-Tuple{MIME,%20Any}). A [`MethodError`](/base/base#Core.MethodError) should be thrown if `x` cannot be displayed as that MIME type; this is automatic if one calls `show` or `repr`. Finally, one should define a function `display(d::D, x)` that queries [`showable(mime, x)`](/base/io-network#Base.Multimedia.showable) for the `mime` types supported by `D` and displays the &quot;best&quot; one; a `MethodError` should be thrown if no supported MIME types are found for `x`.  Similarly, some subtypes may wish to override [`redisplay(d::D, ...)`](/base/io-network#Base.Multimedia.redisplay). (Again, one should `import Base.display` to add new methods to `display`.) The return values of these functions are up to the implementation (since in some cases it may be useful to return a display &quot;handle&quot; of some type).  The display functions for `D` can then be called directly, but they can also be invoked automatically from [`display(x)`](/base/io-network#Base.Multimedia.display) simply by pushing a new display onto the display-backend stack with:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.pushdisplay' href='#Base.Multimedia.pushdisplay'>#</a>&nbsp;<b><u>Base.Multimedia.pushdisplay</u></b> &mdash; <i>Function</i>.




```julia
pushdisplay(d::AbstractDisplay)
```


Pushes a new display `d` on top of the global display-backend stack. Calling `display(x)` or `display(mime, x)` will display `x` on the topmost compatible backend in the stack (i.e., the topmost backend that does not throw a [`MethodError`](/base/base#Core.MethodError)).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L274-L280)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.popdisplay' href='#Base.Multimedia.popdisplay'>#</a>&nbsp;<b><u>Base.Multimedia.popdisplay</u></b> &mdash; <i>Function</i>.




```julia
popdisplay()
popdisplay(d::AbstractDisplay)
```


Pop the topmost backend off of the display-backend stack, or the topmost copy of `d` in the second variant.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L286-L292)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.TextDisplay' href='#Base.Multimedia.TextDisplay'>#</a>&nbsp;<b><u>Base.Multimedia.TextDisplay</u></b> &mdash; <i>Type</i>.




```julia
TextDisplay(io::IO)
```


Return a `TextDisplay <: AbstractDisplay`, which displays any object as the text/plain MIME type (by default), writing the text representation to the given I/O stream. (This is how objects are printed in the Julia REPL.)


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L244-L250)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Multimedia.istextmime' href='#Base.Multimedia.istextmime'>#</a>&nbsp;<b><u>Base.Multimedia.istextmime</u></b> &mdash; <i>Function</i>.




```julia
istextmime(m::MIME)
```


Determine whether a MIME type is text data. MIME types are assumed to be binary data except for a set of types known to be text data (possibly Unicode).

**Examples**

```julia
julia> istextmime(MIME("text/plain"))
true

julia> istextmime(MIME("image/png"))
false
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/multimedia.jl#L180-L194)

</div>
<br>

## Network I/O {#Network-I/O}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.bytesavailable' href='#Base.bytesavailable'>#</a>&nbsp;<b><u>Base.bytesavailable</u></b> &mdash; <i>Function</i>.




```julia
bytesavailable(io)
```


Return the number of bytes available for reading before a read from this stream or buffer will block.

**Examples**

```julia
julia> io = IOBuffer("JuliaLang is a GitHub organization");

julia> bytesavailable(io)
34
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L106-L118)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ntoh' href='#Base.ntoh'>#</a>&nbsp;<b><u>Base.ntoh</u></b> &mdash; <i>Function</i>.




```julia
ntoh(x)
```


Convert the endianness of a value from Network byte order (big-endian) to that used by the Host.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L741-L745)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hton' href='#Base.hton'>#</a>&nbsp;<b><u>Base.hton</u></b> &mdash; <i>Function</i>.




```julia
hton(x)
```


Convert the endianness of a value from that used by the Host to Network byte order (big-endian).


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L748-L752)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ltoh' href='#Base.ltoh'>#</a>&nbsp;<b><u>Base.ltoh</u></b> &mdash; <i>Function</i>.




```julia
ltoh(x)
```


Convert the endianness of a value from Little-endian to that used by the Host.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L755-L759)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.htol' href='#Base.htol'>#</a>&nbsp;<b><u>Base.htol</u></b> &mdash; <i>Function</i>.




```julia
htol(x)
```


Convert the endianness of a value from that used by the Host to Little-endian.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L762-L766)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ENDIAN_BOM' href='#Base.ENDIAN_BOM'>#</a>&nbsp;<b><u>Base.ENDIAN_BOM</u></b> &mdash; <i>Constant</i>.




```julia
ENDIAN_BOM
```


The 32-bit byte-order-mark indicates the native byte order of the host machine. Little-endian machines will contain the value `0x04030201`. Big-endian machines will contain the value `0x01020304`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/io.jl#L732-L738)

</div>
<br>
