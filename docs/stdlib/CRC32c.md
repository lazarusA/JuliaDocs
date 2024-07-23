


# CRC32c

Standard library module for computing the CRC-32c checksum.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='CRC32c.crc32c' href='#CRC32c.crc32c'>#</a>&nbsp;<b><u>CRC32c.crc32c</u></b> &mdash; <i>Function</i>.




```julia
crc32c(data, crc::UInt32=0x00000000)
```


Compute the CRC-32c checksum of the given `data`, which can be an `Array{UInt8}`, a contiguous subarray thereof, or a `String`.  Optionally, you can pass a starting `crc` integer to be mixed in with the checksum.  The `crc` parameter can be used to compute a checksum on data divided into chunks: performing `crc32c(data2, crc32c(data1))` is equivalent to the checksum of `[data1; data2]`. (Technically, a little-endian checksum is computed.)

There is also a method `crc32c(io, nb, crc)` to checksum `nb` bytes from a stream `io`, or `crc32c(io, crc)` to checksum all the remaining bytes. Hence you can do [`open(crc32c, filename)`](/base/io-network#Base.open) to checksum an entire file, or `crc32c(seekstart(buf))` to checksum an [`IOBuffer`](/base/io-network#Base.IOBuffer) without calling [`take!`](/base/io-network#Base.take!-Tuple{Base.GenericIOBuffer}).

For a `String`, note that the result is specific to the UTF-8 encoding (a different checksum would be obtained from a different Unicode encoding). To checksum an `a::Array` of some other bitstype, you can do `crc32c(reinterpret(UInt8,a))`, but note that the result may be endian-dependent.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/CRC32c/src/CRC32c.jl#L15-L35)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='CRC32c.crc32c-Tuple{IO, Integer, UInt32}' href='#CRC32c.crc32c-Tuple{IO, Integer, UInt32}'>#</a>&nbsp;<b><u>CRC32c.crc32c</u></b> &mdash; <i>Method</i>.




```julia
crc32c(io::IO, [nb::Integer,] crc::UInt32=0x00000000)
```


Read up to `nb` bytes from `io` and return the CRC-32c checksum, optionally mixed with a starting `crc` integer.  If `nb` is not supplied, then `io` will be read until the end of the stream.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/CRC32c/src/CRC32c.jl#L45-L51)

</div>
<br>
