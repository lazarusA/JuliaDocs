
# C Standard Library {#C-Standard-Library}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.malloc' href='#Base.Libc.malloc'>#</a>&nbsp;<b><u>Base.Libc.malloc</u></b> &mdash; <i>Function</i>.




```julia
malloc(size::Integer) -> Ptr{Cvoid}
```


Call `malloc` from the C standard library.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L387-L391)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.calloc' href='#Base.Libc.calloc'>#</a>&nbsp;<b><u>Base.Libc.calloc</u></b> &mdash; <i>Function</i>.




```julia
calloc(num::Integer, size::Integer) -> Ptr{Cvoid}
```


Call `calloc` from the C standard library.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L404-L408)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.realloc' href='#Base.Libc.realloc'>#</a>&nbsp;<b><u>Base.Libc.realloc</u></b> &mdash; <i>Function</i>.




```julia
realloc(addr::Ptr, size::Integer) -> Ptr{Cvoid}
```


Call `realloc` from the C standard library.

See warning in the documentation for [`free`](/base/libc#Base.Libc.free) regarding only using this on memory originally obtained from [`malloc`](/base/libc#Base.Libc.malloc).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L394-L401)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.memcpy' href='#Base.memcpy'>#</a>&nbsp;<b><u>Base.memcpy</u></b> &mdash; <i>Function</i>.




```julia
memcpy(dst::Ptr, src::Ptr, n::Integer) -> Ptr{Cvoid}
```


Call `memcpy` from the C standard library.

::: tip Julia 1.10

Support for `memcpy` requires at least Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmem.jl#L3-L11)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.memmove' href='#Base.memmove'>#</a>&nbsp;<b><u>Base.memmove</u></b> &mdash; <i>Function</i>.




```julia
memmove(dst::Ptr, src::Ptr, n::Integer) -> Ptr{Cvoid}
```


Call `memmove` from the C standard library.

::: tip Julia 1.10

Support for `memmove` requires at least Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmem.jl#L17-L25)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.memset' href='#Base.memset'>#</a>&nbsp;<b><u>Base.memset</u></b> &mdash; <i>Function</i>.




```julia
memset(dst::Ptr, val, n::Integer) -> Ptr{Cvoid}
```


Call `memset` from the C standard library.

::: tip Julia 1.10

Support for `memset` requires at least Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmem.jl#L31-L39)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.memcmp' href='#Base.memcmp'>#</a>&nbsp;<b><u>Base.memcmp</u></b> &mdash; <i>Function</i>.




```julia
memcmp(a::Ptr, b::Ptr, n::Integer) -> Int
```


Call `memcmp` from the C standard library.

::: tip Julia 1.10

Support for `memcmp` requires at least Julia 1.9.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmem.jl#L45-L53)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.free' href='#Base.Libc.free'>#</a>&nbsp;<b><u>Base.Libc.free</u></b> &mdash; <i>Function</i>.




```julia
free(addr::Ptr)
```


Call `free` from the C standard library. Only use this on memory obtained from [`malloc`](/base/libc#Base.Libc.malloc), not on pointers retrieved from other C libraries. [`Ptr`](/base/c#Core.Ptr) objects obtained from C libraries should be freed by the free functions defined in that library, to avoid assertion failures if multiple `libc` libraries exist on the system.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L375-L382)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.errno' href='#Base.Libc.errno'>#</a>&nbsp;<b><u>Base.Libc.errno</u></b> &mdash; <i>Function</i>.




```julia
errno([code])
```


Get the value of the C library&#39;s `errno`. If an argument is specified, it is used to set the value of `errno`.

The value of `errno` is only valid immediately after a `ccall` to a C library routine that sets it. Specifically, you cannot call `errno` at the next prompt in a REPL, because lots of code is executed between prompts.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L316-L325)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.strerror' href='#Base.Libc.strerror'>#</a>&nbsp;<b><u>Base.Libc.strerror</u></b> &mdash; <i>Function</i>.




```julia
strerror(n=errno())
```


Convert a system call error code to a descriptive string


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L329-L333)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.GetLastError' href='#Base.Libc.GetLastError'>#</a>&nbsp;<b><u>Base.Libc.GetLastError</u></b> &mdash; <i>Function</i>.




```julia
GetLastError()
```


Call the Win32 `GetLastError` function [only available on Windows].


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L337-L341)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.FormatMessage' href='#Base.Libc.FormatMessage'>#</a>&nbsp;<b><u>Base.Libc.FormatMessage</u></b> &mdash; <i>Function</i>.




```julia
FormatMessage(n=GetLastError())
```


Convert a Win32 system call error code to a descriptive string [only available on Windows].


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L344-L348)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.time-Tuple{Base.Libc.TmStruct}' href='#Base.Libc.time-Tuple{Base.Libc.TmStruct}'>#</a>&nbsp;<b><u>Base.Libc.time</u></b> &mdash; <i>Method</i>.




```julia
time(t::TmStruct) -> Float64
```


Converts a `TmStruct` struct to a number of seconds since the epoch.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L273-L277)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.strftime' href='#Base.Libc.strftime'>#</a>&nbsp;<b><u>Base.Libc.strftime</u></b> &mdash; <i>Function</i>.




```julia
strftime([format], time)
```


Convert time, given as a number of seconds since the epoch or a `TmStruct`, to a formatted string using the given format. Supported formats are the same as those in the standard C library.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L221-L227)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.strptime' href='#Base.Libc.strptime'>#</a>&nbsp;<b><u>Base.Libc.strptime</u></b> &mdash; <i>Function</i>.




```julia
strptime([format], timestr)
```


Parse a formatted time string into a `TmStruct` giving the seconds, minute, hour, date, etc. Supported formats are the same as those in the standard C library. On some platforms, timezones will not be parsed correctly. If the result of this function will be passed to `time` to convert it to seconds since the epoch, the `isdst` field should be filled in manually. Setting it to `-1` will tell the C library to use the current system settings to determine the timezone.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L239-L248)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.TmStruct' href='#Base.Libc.TmStruct'>#</a>&nbsp;<b><u>Base.Libc.TmStruct</u></b> &mdash; <i>Type</i>.




```julia
TmStruct([seconds])
```


Convert a number of seconds since the epoch to broken-down format, with fields `sec`, `min`, `hour`, `mday`, `month`, `year`, `wday`, `yday`, and `isdst`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L186-L191)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.FILE' href='#Base.Libc.FILE'>#</a>&nbsp;<b><u>Base.Libc.FILE</u></b> &mdash; <i>Type</i>.




```julia
FILE(::Ptr)
FILE(::IO)
```


A libc `FILE*`, representing an opened file.

It can be passed as a `Ptr{FILE}` argument to [`ccall`](/base/c#ccall) and also supports [`seek`](/base/io-network#Base.seek), [`position`](/base/io-network#Base.position) and [`close`](/base/io-network#Base.close).

A `FILE` can be constructed from an ordinary `IO` object, provided it is an open file. It must be closed afterward.

**Examples**

```julia
julia> using Base.Libc

julia> mktemp() do _, io
           # write to the temporary file using `puts(char*, FILE*)` from libc
           file = FILE(io)
           ccall(:fputs, Cint, (Cstring, Ptr{FILE}), "hello world", file)
           close(file)
           # read the file again
           seek(io, 0)
           read(io, String)
       end
"hello world"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L83-L110)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.flush_cstdio' href='#Base.Libc.flush_cstdio'>#</a>&nbsp;<b><u>Base.Libc.flush_cstdio</u></b> &mdash; <i>Function</i>.




```julia
flush_cstdio()
```


Flushes the C `stdout` and `stderr` streams (which may have been written to by external C code).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L143-L147)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.systemsleep' href='#Base.Libc.systemsleep'>#</a>&nbsp;<b><u>Base.Libc.systemsleep</u></b> &mdash; <i>Function</i>.




```julia
systemsleep(s::Real)
```


Suspends execution for `s` seconds. This function does not yield to Julia&#39;s scheduler and therefore blocks the Julia thread that it is running on for the duration of the sleep time.

See also [`sleep`](/base/parallel#Base.sleep).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L163-L171)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.mkfifo' href='#Base.Libc.mkfifo'>#</a>&nbsp;<b><u>Base.Libc.mkfifo</u></b> &mdash; <i>Function</i>.




```julia
mkfifo(path::AbstractString, [mode::Integer]) -> path
```


Make a FIFO special file (a named pipe) at `path`.  Return `path` as-is on success.

`mkfifo` is supported only in Unix platforms.

::: tip Julia 1.11

`mkfifo` requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L445-L454)

</div>
<br>
