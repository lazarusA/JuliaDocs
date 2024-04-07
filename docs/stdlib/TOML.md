


# TOML {#TOML}

TOML.jl is a Julia standard library for parsing and writing [TOML v1.0](https://toml.io/en/) files.

## Parsing TOML data {#Parsing-TOML-data}

```julia
julia> using TOML

julia> data = """
           [database]
           server = "192.168.1.1"
           ports = [ 8001, 8001, 8002 ]
       """;

julia> TOML.parse(data)
Dict{String, Any} with 1 entry:
  "database" => Dict{String, Any}("server"=>"192.168.1.1", "ports"=>[8001, 8001…
```


To parse a file, use [`TOML.parsefile`](/stdlib/TOML#TOML.parsefile). If the file has a syntax error, an exception is thrown:

```julia
julia> using TOML

julia> TOML.parse("""
           value = 0.0.0
       """)
ERROR: TOML Parser error:
none:1:16 error: failed to parse value
      value = 0.0.0
                 ^
[...]
```


There are other versions of the parse functions ([`TOML.tryparse`](/stdlib/TOML#TOML.tryparse) and [`TOML.tryparsefile`](/stdlib/TOML#TOML.tryparsefile)) that instead of throwing exceptions on parser error returns a [`TOML.ParserError`](/stdlib/TOML#TOML.ParserError) with information:

```julia
julia> using TOML

julia> err = TOML.tryparse("""
           value = 0.0.0
       """);

julia> err.type
ErrGenericValueError::ErrorType = 14

julia> err.line
1

julia> err.column
16
```


## Exporting data to TOML file {#Exporting-data-to-TOML-file}

The [`TOML.print`](/stdlib/TOML#TOML.print) function is used to print (or serialize) data into TOML format.

```julia
julia> using TOML

julia> data = Dict(
          "names" => ["Julia", "Julio"],
          "age" => [10, 20],
       );

julia> TOML.print(data)
names = ["Julia", "Julio"]
age = [10, 20]

julia> fname = tempname();

julia> open(fname, "w") do io
           TOML.print(io, data)
       end

julia> TOML.parsefile(fname)
Dict{String, Any} with 2 entries:
  "names" => ["Julia", "Julio"]
  "age"   => [10, 20]
```


Keys can be sorted according to some value

```julia
julia> using TOML

julia> TOML.print(Dict(
       "abc"  => 1,
       "ab"   => 2,
       "abcd" => 3,
       ); sorted=true, by=length)
ab = 2
abc = 1
abcd = 3
```


For custom structs, pass a function that converts the struct to a supported type

```julia
julia> using TOML

julia> struct MyStruct
           a::Int
           b::String
       end

julia> TOML.print(Dict("foo" => MyStruct(5, "bar"))) do x
           x isa MyStruct && return [x.a, x.b]
           error("unhandled type $(typeof(x))")
       end
foo = [5, "bar"]
```


## References {#References}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='TOML.parse' href='#TOML.parse'>#</a>&nbsp;<b><u>TOML.parse</u></b> &mdash; <i>Function</i>.




```julia
parse(x::Union{AbstractString, IO})
parse(p::Parser, x::Union{AbstractString, IO})
```


Parse the string  or stream `x`, and return the resulting table (dictionary). Throw a [`ParserError`](/stdlib/TOML#TOML.ParserError) upon failure.

See also [`TOML.tryparse`](/stdlib/TOML#TOML.tryparse).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/TOML/src/TOML.jl#L67-L75)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='TOML.parsefile' href='#TOML.parsefile'>#</a>&nbsp;<b><u>TOML.parsefile</u></b> &mdash; <i>Function</i>.




```julia
parsefile(f::AbstractString)
parsefile(p::Parser, f::AbstractString)
```


Parse file `f` and return the resulting table (dictionary). Throw a [`ParserError`](/stdlib/TOML#TOML.ParserError) upon failure.

See also [`TOML.tryparsefile`](/stdlib/TOML#TOML.tryparsefile).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/TOML/src/TOML.jl#L39-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='TOML.tryparse' href='#TOML.tryparse'>#</a>&nbsp;<b><u>TOML.tryparse</u></b> &mdash; <i>Function</i>.




```julia
tryparse(x::Union{AbstractString, IO})
tryparse(p::Parser, x::Union{AbstractString, IO})
```


Parse the string or stream `x`, and return the resulting table (dictionary). Return a [`ParserError`](/stdlib/TOML#TOML.ParserError) upon failure.

See also [`TOML.parse`](/stdlib/TOML#TOML.parse).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/TOML/src/TOML.jl#L83-L91)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='TOML.tryparsefile' href='#TOML.tryparsefile'>#</a>&nbsp;<b><u>TOML.tryparsefile</u></b> &mdash; <i>Function</i>.




```julia
tryparsefile(f::AbstractString)
tryparsefile(p::Parser, f::AbstractString)
```


Parse file `f` and return the resulting table (dictionary). Return a [`ParserError`](/stdlib/TOML#TOML.ParserError) upon failure.

See also [`TOML.parsefile`](/stdlib/TOML#TOML.parsefile).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/TOML/src/TOML.jl#L53-L61)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='TOML.print' href='#TOML.print'>#</a>&nbsp;<b><u>TOML.print</u></b> &mdash; <i>Function</i>.




```julia
print([to_toml::Function], io::IO [=stdout], data::AbstractDict; sorted=false, by=identity, inline_tables::IdSet{<:AbstractDict})
```


Write `data` as TOML syntax to the stream `io`. If the keyword argument `sorted` is set to `true`, sort tables according to the function given by the keyword argument `by`. If the keyword argument `inline_tables` is given, it should be a set of tables that should be printed &quot;inline&quot;.

The following data types are supported: `AbstractDict`, `AbstractVector`, `AbstractString`, `Integer`, `AbstractFloat`, `Bool`, `Dates.DateTime`, `Dates.Time`, `Dates.Date`. Note that the integers and floats need to be convertible to `Float64` and `Int64` respectively. For other data types, pass the function `to_toml` that takes the data types and returns a value of a supported type.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/TOML/src/TOML.jl#L112-L124)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='TOML.Parser' href='#TOML.Parser'>#</a>&nbsp;<b><u>TOML.Parser</u></b> &mdash; <i>Type</i>.




```julia
Parser()
```


Constructor for a TOML `Parser`.  Note that in most cases one does not need to explicitly create a `Parser` but instead one directly use use [`TOML.parsefile`](/stdlib/TOML#TOML.parsefile) or [`TOML.parse`](/stdlib/TOML#TOML.parse).  Using an explicit parser will however reuse some internal data structures which can be beneficial for performance if a larger number of small files are parsed.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/TOML/src/TOML.jl#L28-L36)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='TOML.ParserError' href='#TOML.ParserError'>#</a>&nbsp;<b><u>TOML.ParserError</u></b> &mdash; <i>Type</i>.




```julia
ParserError
```


Type that is returned from [`tryparse`](/stdlib/TOML#TOML.tryparse) and [`tryparsefile`](/stdlib/TOML#TOML.tryparsefile) when parsing fails. It contains (among others) the following fields:
- `pos`, the position in the string when the error happened
  
- `table`, the result that so far was successfully parsed
  
- `type`, an error type, different for different types of errors
  


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/TOML/src/TOML.jl#L99-L108)

</div>
<br>
