


# ArgTools {#ArgTools}

## Argument Handling {#Argument-Handling}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.ArgRead' href='#ArgTools.ArgRead'>#</a>&nbsp;<b><u>ArgTools.ArgRead</u></b> &mdash; <i>Type</i>.




```julia
ArgRead = Union{AbstractString, AbstractCmd, IO}
```


The `ArgRead` types is a union of the types that the `arg_read` function knows how to convert into readable IO handles. See [`arg_read`](/stdlib/ArgTools#ArgTools.arg_read) for details.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L42-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.ArgWrite' href='#ArgTools.ArgWrite'>#</a>&nbsp;<b><u>ArgTools.ArgWrite</u></b> &mdash; <i>Type</i>.




```julia
ArgWrite = Union{AbstractString, AbstractCmd, IO}
```


The `ArgWrite` types is a union of the types that the `arg_write` function knows how to convert into writeable IO handles, except for `Nothing` which `arg_write` handles by generating a temporary file. See [`arg_write`](/stdlib/ArgTools#ArgTools.arg_write) for details.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L50-L56)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.arg_read' href='#ArgTools.arg_read'>#</a>&nbsp;<b><u>ArgTools.arg_read</u></b> &mdash; <i>Function</i>.




```julia
arg_read(f::Function, arg::ArgRead) -> f(arg_io)
```


The `arg_read` function accepts an argument `arg` that can be any of these:
- `AbstractString`: a file path to be opened for reading
  
- `AbstractCmd`: a command to be run, reading from its standard output
  
- `IO`: an open IO handle to be read from
  

Whether the body returns normally or throws an error, a path which is opened will be closed before returning from `arg_read` and an `IO` handle will be flushed but not closed before returning from `arg_read`.

Note: when opening a file, ArgTools will pass `lock = false` to the file `open(...)` call. Therefore, the object returned by this function should not be used from multiple threads. This restriction may be relaxed in the future, which would not break any working code.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L59-L73)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.arg_write' href='#ArgTools.arg_write'>#</a>&nbsp;<b><u>ArgTools.arg_write</u></b> &mdash; <i>Function</i>.




```julia
arg_write(f::Function, arg::ArgWrite) -> arg
arg_write(f::Function, arg::Nothing) -> tempname()
```


The `arg_read` function accepts an argument `arg` that can be any of these:
- `AbstractString`: a file path to be opened for writing
  
- `AbstractCmd`: a command to be run, writing to its standard input
  
- `IO`: an open IO handle to be written to
  
- `Nothing`: a temporary path should be written to
  

If the body returns normally, a path that is opened will be closed upon completion; an IO handle argument is left open but flushed before return. If the argument is `nothing` then a temporary path is opened for writing and closed open completion and the path is returned from `arg_write`. In all other cases, `arg` itself is returned. This is a useful pattern since you can consistently return whatever was written, whether an argument was passed or not.

If there is an error during the evaluation of the body, a path that is opened by `arg_write` for writing will be deleted, whether it&#39;s passed in as a string or a temporary path generated when `arg` is `nothing`.

Note: when opening a file, ArgTools will pass `lock = false` to the file `open(...)` call. Therefore, the object returned by this function should not be used from multiple threads. This restriction may be relaxed in the future, which would not break any working code.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L78-L101)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.arg_isdir' href='#ArgTools.arg_isdir'>#</a>&nbsp;<b><u>ArgTools.arg_isdir</u></b> &mdash; <i>Function</i>.




```julia
arg_isdir(f::Function, arg::AbstractString) -> f(arg)
```


The `arg_isdir` function takes `arg` which must be the path to an existing directory (an error is raised otherwise) and passes that path to `f` finally returning the result of `f(arg)`. This is definitely the least useful tool offered by `ArgTools` and mostly exists for symmetry with `arg_mkdir` and to give consistent error messages.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L141-L149)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.arg_mkdir' href='#ArgTools.arg_mkdir'>#</a>&nbsp;<b><u>ArgTools.arg_mkdir</u></b> &mdash; <i>Function</i>.




```julia
arg_mkdir(f::Function, arg::AbstractString) -> arg
arg_mkdir(f::Function, arg::Nothing) -> mktempdir()
```


The `arg_mkdir` function takes `arg` which must either be one of:
- a path to an already existing empty directory,
  
- a non-existent path which can be created as a directory, or
  
- `nothing` in which case a temporary directory is created.
  

In all cases the path to the directory is returned. If an error occurs during `f(arg)`, the directory is returned to its original state: if it already existed but was empty, it will be emptied; if it did not exist it will be deleted.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L155-L168)

</div>
<br>

## Function Testing {#Function-Testing}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.arg_readers' href='#ArgTools.arg_readers'>#</a>&nbsp;<b><u>ArgTools.arg_readers</u></b> &mdash; <i>Function</i>.




```julia
arg_readers(arg :: AbstractString, [ type = ArgRead ]) do arg::Function
    ## pre-test setup ##
    @arg_test arg begin
        arg :: ArgRead
        ## test using `arg` ##
    end
    ## post-test cleanup ##
end
```


The `arg_readers` function takes a path to be read and a single-argument do block, which is invoked once for each test reader type that `arg_read` can handle. If the optional `type` argument is given then the do block is only invoked for readers that produce arguments of that type.

The `arg` passed to the do block is not the argument value itself, because some of test argument types need to be initialized and finalized for each test case. Consider an open file handle argument: once you&#39;ve used it for one test, you can&#39;t use it again; you need to close it and open the file again for the next test. This function `arg` can be converted into an `ArgRead` instance using `@arg_test arg begin ... end`.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L223-L244)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.arg_writers' href='#ArgTools.arg_writers'>#</a>&nbsp;<b><u>ArgTools.arg_writers</u></b> &mdash; <i>Function</i>.




```julia
arg_writers([ type = ArgWrite ]) do path::String, arg::Function
    ## pre-test setup ##
    @arg_test arg begin
        arg :: ArgWrite
        ## test using `arg` ##
    end
    ## post-test cleanup ##
end
```


The `arg_writers` function takes a do block, which is invoked once for each test writer type that `arg_write` can handle with a temporary (non-existent) `path` and `arg` which can be converted into various writable argument types which write to `path`. If the optional `type` argument is given then the do block is only invoked for writers that produce arguments of that type.

The `arg` passed to the do block is not the argument value itself, because some of test argument types need to be initialized and finalized for each test case. Consider an open file handle argument: once you&#39;ve used it for one test, you can&#39;t use it again; you need to close it and open the file again for the next test. This function `arg` can be converted into an `ArgWrite` instance using `@arg_test arg begin ... end`.

There is also an `arg_writers` method that takes a path name like `arg_readers`:

```
arg_writers(path::AbstractString, [ type = ArgWrite ]) do arg::Function
    ## pre-test setup ##
    @arg_test arg begin
        # here `arg :: ArgWrite`
        ## test using `arg` ##
    end
    ## post-test cleanup ##
end
```


This method is useful if you need to specify `path` instead of using path name generated by `tempname()`. Since `path` is passed from outside of `arg_writers`, the path is not an argument to the do block in this form.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L256-L293)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='ArgTools.@arg_test' href='#ArgTools.@arg_test'>#</a>&nbsp;<b><u>ArgTools.@arg_test</u></b> &mdash; <i>Macro</i>.




```julia
@arg_test arg1 arg2 ... body
```


The `@arg_test` macro is used to convert `arg` functions provided by `arg_readers` and `arg_writers` into actual argument values. When you write `@arg_test arg body` it is equivalent to `arg(arg -> body)`.


[source](https://github.com/JuliaIO/ArgTools.jl/blob/997089b9cd56404b40ff766759662e16dc1aab4b/src/ArgTools.jl#L319-L325)

</div>
<br>
