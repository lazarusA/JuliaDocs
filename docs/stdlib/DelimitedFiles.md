
# Delimited Files {#Delimited-Files}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='DelimitedFiles.readdlm-Tuple{Any, AbstractChar, Type, AbstractChar}' href='#DelimitedFiles.readdlm-Tuple{Any, AbstractChar, Type, AbstractChar}'>#</a>&nbsp;<b><u>DelimitedFiles.readdlm</u></b> &mdash; <i>Method</i>.




```julia
readdlm(source, delim::AbstractChar, T::Type, eol::AbstractChar; header=false, skipstart=0, skipblanks=true, use_mmap, quotes=true, dims, comments=false, comment_char='#')
```


Read a matrix from the source where each line (separated by `eol`) gives one row, with elements separated by the given delimiter. The source can be a text file, stream or byte array. Memory mapped files can be used by passing the byte array representation of the mapped segment as source.

If `T` is a numeric type, the result is an array of that type, with any non-numeric elements as `NaN` for floating-point types, or zero. Other useful values of `T` include `String`, `AbstractString`, and `Any`.

If `header` is `true`, the first row of data will be read as header and the tuple `(data_cells, header_cells)` is returned instead of only `data_cells`.

Specifying `skipstart` will ignore the corresponding number of initial lines from the input.

If `skipblanks` is `true`, blank lines in the input will be ignored.

If `use_mmap` is `true`, the file specified by `source` is memory mapped for potential speedups if the file is large. Default is `false`. On a Windows filesystem, `use_mmap` should not be set to `true` unless the file is only read once and is also not written to. Some edge cases exist where an OS is Unix-like but the filesystem is Windows-like.

If `quotes` is `true`, columns enclosed within double-quote (&quot;) characters are allowed to contain new lines and column delimiters. Double-quote characters within a quoted field must be escaped with another double-quote.  Specifying `dims` as a tuple of the expected rows and columns (including header, if any) may speed up reading of large files.  If `comments` is `true`, lines beginning with `comment_char` and text following `comment_char` in any line are ignored.

**Examples**

```julia
julia> using DelimitedFiles

julia> x = [1; 2; 3; 4];

julia> y = [5; 6; 7; 8];

julia> open("delim_file.txt", "w") do io
           writedlm(io, [x y])
       end

julia> readdlm("delim_file.txt", '\t', Int, '\n')
4×2 Matrix{Int64}:
 1  5
 2  6
 3  7
 4  8

julia> rm("delim_file.txt")
```



[source](https://github.com/JuliaData/DelimitedFiles.jl/blob/db79c842f95f55b1f8d8037c0d3363ab21cd3b90/src/DelimitedFiles.jl#L173-L225)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='DelimitedFiles.readdlm-Tuple{Any, AbstractChar, AbstractChar}' href='#DelimitedFiles.readdlm-Tuple{Any, AbstractChar, AbstractChar}'>#</a>&nbsp;<b><u>DelimitedFiles.readdlm</u></b> &mdash; <i>Method</i>.




```julia
readdlm(source, delim::AbstractChar, eol::AbstractChar; options...)
```


If all data is numeric, the result will be a numeric array. If some elements cannot be parsed as numbers, a heterogeneous array of numbers and strings is returned.


[source](https://github.com/JuliaData/DelimitedFiles.jl/blob/db79c842f95f55b1f8d8037c0d3363ab21cd3b90/src/DelimitedFiles.jl#L164-L169)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='DelimitedFiles.readdlm-Tuple{Any, AbstractChar, Type}' href='#DelimitedFiles.readdlm-Tuple{Any, AbstractChar, Type}'>#</a>&nbsp;<b><u>DelimitedFiles.readdlm</u></b> &mdash; <i>Method</i>.




```julia
readdlm(source, delim::AbstractChar, T::Type; options...)
```


The end of line delimiter is taken as `\n`.

**Examples**

```julia
julia> using DelimitedFiles

julia> x = [1; 2; 3; 4];

julia> y = [1.1; 2.2; 3.3; 4.4];

julia> open("delim_file.txt", "w") do io
           writedlm(io, [x y], ',')
       end;

julia> readdlm("delim_file.txt", ',', Float64)
4×2 Matrix{Float64}:
 1.0  1.1
 2.0  2.2
 3.0  3.3
 4.0  4.4

julia> rm("delim_file.txt")
```



[source](https://github.com/JuliaData/DelimitedFiles.jl/blob/db79c842f95f55b1f8d8037c0d3363ab21cd3b90/src/DelimitedFiles.jl#L59-L85)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='DelimitedFiles.readdlm-Tuple{Any, AbstractChar}' href='#DelimitedFiles.readdlm-Tuple{Any, AbstractChar}'>#</a>&nbsp;<b><u>DelimitedFiles.readdlm</u></b> &mdash; <i>Method</i>.




```julia
readdlm(source, delim::AbstractChar; options...)
```


The end of line delimiter is taken as `\n`. If all data is numeric, the result will be a numeric array. If some elements cannot be parsed as numbers, a heterogeneous array of numbers and strings is returned.

**Examples**

```julia
julia> using DelimitedFiles

julia> x = [1; 2; 3; 4];

julia> y = [1.1; 2.2; 3.3; 4.4];

julia> open("delim_file.txt", "w") do io
           writedlm(io, [x y], ',')
       end;

julia> readdlm("delim_file.txt", ',')
4×2 Matrix{Float64}:
 1.0  1.1
 2.0  2.2
 3.0  3.3
 4.0  4.4

julia> z = ["a"; "b"; "c"; "d"];

julia> open("delim_file.txt", "w") do io
           writedlm(io, [x z], ',')
       end;

julia> readdlm("delim_file.txt", ',')
4×2 Matrix{Any}:
 1  "a"
 2  "b"
 3  "c"
 4  "d"

julia> rm("delim_file.txt")
```



[source](https://github.com/JuliaData/DelimitedFiles.jl/blob/db79c842f95f55b1f8d8037c0d3363ab21cd3b90/src/DelimitedFiles.jl#L120-L161)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='DelimitedFiles.readdlm-Tuple{Any, Type}' href='#DelimitedFiles.readdlm-Tuple{Any, Type}'>#</a>&nbsp;<b><u>DelimitedFiles.readdlm</u></b> &mdash; <i>Method</i>.




```julia
readdlm(source, T::Type; options...)
```


The columns are assumed to be separated by one or more whitespaces. The end of line delimiter is taken as `\n`.

**Examples**

```julia
julia> using DelimitedFiles

julia> x = [1; 2; 3; 4];

julia> y = [5; 6; 7; 8];

julia> open("delim_file.txt", "w") do io
           writedlm(io, [x y])
       end;

julia> readdlm("delim_file.txt", Int64)
4×2 Matrix{Int64}:
 1  5
 2  6
 3  7
 4  8

julia> readdlm("delim_file.txt", Float64)
4×2 Matrix{Float64}:
 1.0  5.0
 2.0  6.0
 3.0  7.0
 4.0  8.0

julia> rm("delim_file.txt")
```



[source](https://github.com/JuliaData/DelimitedFiles.jl/blob/db79c842f95f55b1f8d8037c0d3363ab21cd3b90/src/DelimitedFiles.jl#L22-L56)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='DelimitedFiles.readdlm-Tuple{Any}' href='#DelimitedFiles.readdlm-Tuple{Any}'>#</a>&nbsp;<b><u>DelimitedFiles.readdlm</u></b> &mdash; <i>Method</i>.




```julia
readdlm(source; options...)
```


The columns are assumed to be separated by one or more whitespaces. The end of line delimiter is taken as `\n`. If all data is numeric, the result will be a numeric array. If some elements cannot be parsed as numbers, a heterogeneous array of numbers and strings is returned.

**Examples**

```julia
julia> using DelimitedFiles

julia> x = [1; 2; 3; 4];

julia> y = ["a"; "b"; "c"; "d"];

julia> open("delim_file.txt", "w") do io
           writedlm(io, [x y])
       end;

julia> readdlm("delim_file.txt")
4×2 Matrix{Any}:
 1  "a"
 2  "b"
 3  "c"
 4  "d"

julia> rm("delim_file.txt")
```



[source](https://github.com/JuliaData/DelimitedFiles.jl/blob/db79c842f95f55b1f8d8037c0d3363ab21cd3b90/src/DelimitedFiles.jl#L88-L117)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='DelimitedFiles.writedlm' href='#DelimitedFiles.writedlm'>#</a>&nbsp;<b><u>DelimitedFiles.writedlm</u></b> &mdash; <i>Function</i>.




```julia
writedlm(f, A, delim='\t'; opts)
```


Write `A` (a vector, matrix, or an iterable collection of iterable rows) as text to `f` (either a filename string or an `IO` stream) using the given delimiter `delim` (which defaults to tab, but can be any printable Julia object, typically a `Char` or `AbstractString`).

For example, two vectors `x` and `y` of the same length can be written as two columns of tab-delimited text to `f` by either `writedlm(f, [x y])` or by `writedlm(f, zip(x, y))`.

**Examples**

```julia
julia> using DelimitedFiles

julia> x = [1; 2; 3; 4];

julia> y = [5; 6; 7; 8];

julia> open("delim_file.txt", "w") do io
           writedlm(io, [x y])
       end

julia> readdlm("delim_file.txt", '\t', Int, '\n')
4×2 Matrix{Int64}:
 1  5
 2  6
 3  7
 4  8

julia> rm("delim_file.txt")
```



[source](https://github.com/JuliaData/DelimitedFiles.jl/blob/db79c842f95f55b1f8d8037c0d3363ab21cd3b90/src/DelimitedFiles.jl#L799-L831)

</div>
<br>
