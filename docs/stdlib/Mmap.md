


# Memory-mapped I/O {#Memory-mapped-I/O}

Low level module for mmap (memory mapping of files).
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Mmap.Anonymous' href='#Mmap.Anonymous'>#</a>&nbsp;<b><u>Mmap.Anonymous</u></b> &mdash; <i>Type</i>.




```julia
Mmap.Anonymous(name::AbstractString="", readonly::Bool=false, create::Bool=true)
```


Create an `IO`-like object for creating zeroed-out mmapped-memory that is not tied to a file for use in [`mmap`](/stdlib/Mmap#Mmap.mmap). Used by `SharedArray` for creating shared memory arrays.

**Examples**

```julia
julia> using Mmap

julia> anon = Mmap.Anonymous();

julia> isreadable(anon)
true

julia> iswritable(anon)
true

julia> isopen(anon)
true
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Mmap/src/Mmap.jl#L21-L42)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Mmap.mmap' href='#Mmap.mmap'>#</a>&nbsp;<b><u>Mmap.mmap</u></b> &mdash; <i>Function</i>.




```julia
mmap(io::Union{IOStream,AbstractString,Mmap.AnonymousMmap}[, type::Type{Array{T,N}}, dims, offset]; grow::Bool=true, shared::Bool=true)
mmap(type::Type{Array{T,N}}, dims)
```


Create an `Array` whose values are linked to a file, using memory-mapping. This provides a convenient way of working with data too large to fit in the computer&#39;s memory.

The type is an `Array{T,N}` with a bits-type element of `T` and dimension `N` that determines how the bytes of the array are interpreted. Note that the file must be stored in binary format, and no format conversions are possible (this is a limitation of operating systems, not Julia).

`dims` is a tuple or single [`Integer`](/base/numbers#Core.Integer) specifying the size or length of the array.

The file is passed via the stream argument, either as an open [`IOStream`](/base/io-network#Base.IOStream) or filename string. When you initialize the stream, use `"r"` for a &quot;read-only&quot; array, and `"w+"` to create a new array used to write values to disk.

If no `type` argument is specified, the default is `Vector{UInt8}`.

Optionally, you can specify an offset (in bytes) if, for example, you want to skip over a header in the file. The default value for the offset is the current stream position for an `IOStream`.

The `grow` keyword argument specifies whether the disk file should be grown to accommodate the requested size of array (if the total file size is &lt; requested array size). Write privileges are required to grow the file.

The `shared` keyword argument specifies whether the resulting `Array` and changes made to it will be visible to other processes mapping the same file.

For example, the following code

```julia
# Create a file for mmapping
# (you could alternatively use mmap to do this step, too)
using Mmap
A = rand(1:20, 5, 30)
s = open("/tmp/mmap.bin", "w+")
# We'll write the dimensions of the array as the first two Ints in the file
write(s, size(A,1))
write(s, size(A,2))
# Now write the data
write(s, A)
close(s)

# Test by reading it back in
s = open("/tmp/mmap.bin")   # default is read-only
m = read(s, Int)
n = read(s, Int)
A2 = mmap(s, Matrix{Int}, (m,n))
```


creates a `m`-by-`n` `Matrix{Int}`, linked to the file associated with stream `s`.

A more portable file would need to encode the word size – 32 bit or 64 bit – and endianness information in the header. In practice, consider encoding binary data using standard formats like HDF5 (which can be used with memory-mapping).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Mmap/src/Mmap.jl#L127-L185)



```julia
mmap(io, BitArray, [dims, offset])
```


Create a [`BitArray`](/base/arrays#Base.BitArray) whose values are linked to a file, using memory-mapping; it has the same purpose, works in the same way, and has the same arguments, as [`mmap`](/stdlib/Mmap#Mmap.mmap), but the byte representation is different.

**Examples**

```julia
julia> using Mmap

julia> io = open("mmap.bin", "w+");

julia> B = mmap(io, BitArray, (25,30000));

julia> B[3, 4000] = true;

julia> Mmap.sync!(B);

julia> close(io);

julia> io = open("mmap.bin", "r+");

julia> C = mmap(io, BitArray, (25,30000));

julia> C[3, 4000]
true

julia> C[2, 4000]
false

julia> close(io)

julia> rm("mmap.bin")
```


This creates a 25-by-30000 `BitArray`, linked to the file associated with stream `io`.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Mmap/src/Mmap.jl#L287-L323)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Mmap.sync!' href='#Mmap.sync!'>#</a>&nbsp;<b><u>Mmap.sync!</u></b> &mdash; <i>Function</i>.




```julia
Mmap.sync!(array)
```


Forces synchronization between the in-memory version of a memory-mapped `Array` or [`BitArray`](/base/arrays#Base.BitArray) and the on-disk version.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Mmap/src/Mmap.jl#L363-L368)

</div>
<br>
