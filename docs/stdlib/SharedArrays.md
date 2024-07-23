


# Shared Arrays {#Shared-Arrays}

`SharedArray` represents an array, which is shared across multiple processes, on a single machine.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SharedArrays.SharedArray' href='#SharedArrays.SharedArray'>#</a>&nbsp;<b><u>SharedArrays.SharedArray</u></b> &mdash; <i>Type</i>.




```julia
SharedArray{T}(dims::NTuple; init=false, pids=Int[])
SharedArray{T,N}(...)
```


Construct a `SharedArray` of a bits type `T` and size `dims` across the processes specified by `pids` - all of which have to be on the same host.  If `N` is specified by calling `SharedArray{T,N}(dims)`, then `N` must match the length of `dims`.

If `pids` is left unspecified, the shared array will be mapped across all processes on the current host, including the master. But, `localindices` and `indexpids` will only refer to worker processes. This facilitates work distribution code to use workers for actual computation with the master process acting as a driver.

If an `init` function of the type `initfn(S::SharedArray)` is specified, it is called on all the participating workers.

The shared array is valid as long as a reference to the `SharedArray` object exists on the node which created the mapping.

```
SharedArray{T}(filename::AbstractString, dims::NTuple, [offset=0]; mode=nothing, init=false, pids=Int[])
SharedArray{T,N}(...)
```


Construct a `SharedArray` backed by the file `filename`, with element type `T` (must be a bits type) and size `dims`, across the processes specified by `pids` - all of which have to be on the same host. This file is mmapped into the host memory, with the following consequences:
- The array data must be represented in binary format (e.g., an ASCII format like CSV cannot be supported)
  
- Any changes you make to the array values (e.g., `A[3] = 0`) will also change the values on disk
  

If `pids` is left unspecified, the shared array will be mapped across all processes on the current host, including the master. But, `localindices` and `indexpids` will only refer to worker processes. This facilitates work distribution code to use workers for actual computation with the master process acting as a driver.

`mode` must be one of `"r"`, `"r+"`, `"w+"`, or `"a+"`, and defaults to `"r+"` if the file specified by `filename` already exists, or `"w+"` if not. If an `init` function of the type `initfn(S::SharedArray)` is specified, it is called on all the participating workers. You cannot specify an `init` function if the file is not writable.

`offset` allows you to skip the specified number of bytes at the beginning of the file.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/SharedArrays/src/SharedArrays.jl#L52-L101)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SharedArrays.SharedVector' href='#SharedArrays.SharedVector'>#</a>&nbsp;<b><u>SharedArrays.SharedVector</u></b> &mdash; <i>Type</i>.




```julia
SharedVector
```


A one-dimensional [`SharedArray`](/stdlib/SharedArrays#SharedArrays.SharedArray).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/SharedArrays/src/SharedArrays.jl#L278-L282)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SharedArrays.SharedMatrix' href='#SharedArrays.SharedMatrix'>#</a>&nbsp;<b><u>SharedArrays.SharedMatrix</u></b> &mdash; <i>Type</i>.




```julia
SharedMatrix
```


A two-dimensional [`SharedArray`](/stdlib/SharedArrays#SharedArrays.SharedArray).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/SharedArrays/src/SharedArrays.jl#L284-L288)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.procs-Tuple{SharedArray}' href='#Distributed.procs-Tuple{SharedArray}'>#</a>&nbsp;<b><u>Distributed.procs</u></b> &mdash; <i>Method</i>.




```julia
procs(S::SharedArray)
```


Get the vector of processes mapping the shared array.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/SharedArrays/src/SharedArrays.jl#L321-L325)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SharedArrays.sdata' href='#SharedArrays.sdata'>#</a>&nbsp;<b><u>SharedArrays.sdata</u></b> &mdash; <i>Function</i>.




```julia
sdata(S::SharedArray)
```


Return the actual `Array` object backing `S`.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/SharedArrays/src/SharedArrays.jl#L337-L341)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SharedArrays.indexpids' href='#SharedArrays.indexpids'>#</a>&nbsp;<b><u>SharedArrays.indexpids</u></b> &mdash; <i>Function</i>.




```julia
indexpids(S::SharedArray)
```


Return the current worker&#39;s index in the list of workers mapping the `SharedArray` (i.e. in the same list returned by `procs(S)`), or 0 if the `SharedArray` is not mapped locally.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/SharedArrays/src/SharedArrays.jl#L328-L334)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='SharedArrays.localindices' href='#SharedArrays.localindices'>#</a>&nbsp;<b><u>SharedArrays.localindices</u></b> &mdash; <i>Function</i>.




```julia
localindices(S::SharedArray)
```


Return a range describing the &quot;default&quot; indices to be handled by the current process.  This range should be interpreted in the sense of linear indexing, i.e., as a sub-range of `1:length(S)`.  In multi-process contexts, returns an empty range in the parent process (or any process for which [`indexpids`](/stdlib/SharedArrays#SharedArrays.indexpids) returns 0).

It&#39;s worth emphasizing that `localindices` exists purely as a convenience, and you can partition work on the array among workers any way you wish. For a `SharedArray`, all indices should be equally fast for each worker process.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/SharedArrays/src/SharedArrays.jl#L345-L358)

</div>
<br>
