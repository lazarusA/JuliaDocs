


# Serialization {#Serialization}

Provides serialization of Julia objects.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Serialization.serialize' href='#Serialization.serialize'>#</a>&nbsp;<b><u>Serialization.serialize</u></b> &mdash; <i>Function</i>.




```julia
serialize(stream::IO, value)
```


Write an arbitrary value to a stream in an opaque format, such that it can be read back by [`deserialize`](/stdlib/Serialization#Serialization.deserialize). The read-back value will be as identical as possible to the original, but note that `Ptr` values are serialized as all-zero bit patterns (`NULL`).

An 8-byte identifying header is written to the stream first. To avoid writing the header, construct a `Serializer` and use it as the first argument to `serialize` instead. See also [`Serialization.writeheader`](/stdlib/Serialization#Serialization.writeheader).

The data format can change in minor (1.x) Julia releases, but files written by prior 1.x versions will remain readable. The main exception to this is when the definition of a type in an external package changes. If that occurs, it may be necessary to specify an explicit compatible version of the affected package in your environment. Renaming functions, even private functions, inside packages can also put existing files out of sync. Anonymous functions require special care: because their names are automatically generated, minor code changes can cause them to be renamed. Serializing anonymous functions should be avoided in files intended for long-term storage.

In some cases, the word size (32- or 64-bit) of the reading and writing machines must match. In rarer cases the OS or architecture must also match, for example when using packages that contain platform-dependent code.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Serialization/src/Serialization.jl#L780-L803)



```julia
serialize(filename::AbstractString, value)
```


Open a file and serialize the given value to it.

::: tip Julia 1.1

This method is available as of Julia 1.1.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Serialization/src/Serialization.jl#L810-L817)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Serialization.deserialize' href='#Serialization.deserialize'>#</a>&nbsp;<b><u>Serialization.deserialize</u></b> &mdash; <i>Function</i>.




```julia
deserialize(stream)
```


Read a value written by [`serialize`](/stdlib/Serialization#Serialization.serialize). `deserialize` assumes the binary data read from `stream` is correct and has been serialized by a compatible implementation of [`serialize`](/stdlib/Serialization#Serialization.serialize). `deserialize` is designed for simplicity and performance, and so does not validate the data read. Malformed data can result in process termination. The caller must ensure the integrity and correctness of data read from `stream`.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Serialization/src/Serialization.jl#L822-L830)



```julia
deserialize(filename::AbstractString)
```


Open a file and deserialize its contents.

::: tip Julia 1.1

This method is available as of Julia 1.1.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Serialization/src/Serialization.jl#L833-L840)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Serialization.writeheader' href='#Serialization.writeheader'>#</a>&nbsp;<b><u>Serialization.writeheader</u></b> &mdash; <i>Function</i>.




```julia
Serialization.writeheader(s::AbstractSerializer)
```


Write an identifying header to the specified serializer. The header consists of 8 bytes as follows:

| Offset | Description                                |
|:------ |:------------------------------------------ |
| 0      | tag byte (0x37)                            |
| 1-2    | signature bytes &quot;JL&quot;             |
| 3      | protocol version                           |
| 4      | bits 0-1: endianness: 0 = little, 1 = big  |
| 4      | bits 2-3: platform: 0 = 32-bit, 1 = 64-bit |
| 5-7    | reserved                                   |



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Serialization/src/Serialization.jl#L715-L729)

</div>
<br>
