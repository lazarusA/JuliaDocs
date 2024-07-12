


# Profiling {#lib-profiling}

## CPU Profiling {#CPU-Profiling}

There are two main approaches to CPU profiling julia code:

## Via `@profile` {#Via-@profile}

Where profiling is enabled for a given call via the `@profile` macro.

```julia
julia> using Profile

julia> @profile foo()

julia> Profile.print()
Overhead ╎ [+additional indent] Count File:Line; Function
=========================================================
    ╎147  @Base/client.jl:506; _start()
        ╎ 147  @Base/client.jl:318; exec_options(opts::Base.JLOptions)
...
```


## Triggered During Execution {#Triggered-During-Execution}

Tasks that are already running can also be profiled for a fixed time period at any user-triggered time.

To trigger the profiling:
- MacOS &amp; FreeBSD (BSD-based platforms): Use `ctrl-t` or pass a `SIGINFO` signal to the julia process i.e. `% kill -INFO $julia_pid`
  
- Linux: Pass a `SIGUSR1` signal to the julia process i.e. `% kill -USR1 $julia_pid`
  
- Windows: Not currently supported.
  

First, a single stack trace at the instant that the signal was thrown is shown, then a 1 second profile is collected, followed by the profile report at the next yield point, which may be at task completion for code without yield points e.g. tight loops.

Optionally set environment variable [`JULIA_PROFILE_PEEK_HEAP_SNAPSHOT`](/manual/environment-variables#JULIA_PROFILE_PEEK_HEAP_SNAPSHOT) to `1` to also automatically collect a [heap snapshot](/stdlib/Profile#Heap-Snapshots).

```julia
julia> foo()
##== the user sends a trigger while foo is running ==##
load: 2.53  cmd: julia 88903 running 6.16u 0.97s

======================================================================================
Information request received. A stacktrace will print followed by a 1.0 second profile
======================================================================================

signal (29): Information request: 29
__psynch_cvwait at /usr/lib/system/libsystem_kernel.dylib (unknown line)
_pthread_cond_wait at /usr/lib/system/libsystem_pthread.dylib (unknown line)
...

======================================================================
Profile collected. A report will print if the Profile module is loaded
======================================================================

Overhead ╎ [+additional indent] Count File:Line; Function
=========================================================
Thread 1 Task 0x000000011687c010 Total snapshots: 572. Utilization: 100%
   ╎147 @Base/client.jl:506; _start()
       ╎ 147 @Base/client.jl:318; exec_options(opts::Base.JLOptions)
...

Thread 2 Task 0x0000000116960010 Total snapshots: 572. Utilization: 0%
   ╎572 @Base/task.jl:587; task_done_hook(t::Task)
      ╎ 572 @Base/task.jl:879; wait()
...
```


### Customization

The duration of the profiling can be adjusted via [`Profile.set_peek_duration`](/stdlib/Profile#Profile.set_peek_duration)

The profile report is broken down by thread and task. Pass a no-arg function to `Profile.peek_report[]` to override this. i.e. `Profile.peek_report[] = () -> Profile.print()` to remove any grouping. This could also be overridden by an external profile data consumer.

## Reference
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.@profile' href='#Profile.@profile'>#</a>&nbsp;<b><u>Profile.@profile</u></b> &mdash; <i>Macro</i>.




```julia
@profile
```


`@profile <expression>` runs your expression while taking periodic backtraces. These are appended to an internal buffer of backtraces.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L47-L52)

</div>
<br>

The methods in `Profile` are not exported and need to be called e.g. as `Profile.print()`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.clear' href='#Profile.clear'>#</a>&nbsp;<b><u>Profile.clear</u></b> &mdash; <i>Function</i>.




```julia
clear()
```


Clear any existing backtraces from the internal buffer.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L158-L162)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.print' href='#Profile.print'>#</a>&nbsp;<b><u>Profile.print</u></b> &mdash; <i>Function</i>.




```julia
print([io::IO = stdout,] [data::Vector = fetch()], [lidict::Union{LineInfoDict, LineInfoFlatDict} = getdict(data)]; kwargs...)
```


Prints profiling results to `io` (by default, `stdout`). If you do not supply a `data` vector, the internal buffer of accumulated backtraces will be used.

The keyword arguments can be any combination of:
- `format` – Determines whether backtraces are printed with (default, `:tree`) or without (`:flat`) indentation indicating tree structure.
  
- `C` – If `true`, backtraces from C and Fortran code are shown (normally they are excluded).
  
- `combine` – If `true` (default), instruction pointers are merged that correspond to the same line of code.
  
- `maxdepth` – Limits the depth higher than `maxdepth` in the `:tree` format.
  
- `sortedby` – Controls the order in `:flat` format. `:filefuncline` (default) sorts by the source  line, `:count` sorts in order of number of collected samples, and `:overhead` sorts by the number of samples  incurred by each function by itself.
  
- `groupby` – Controls grouping over tasks and threads, or no grouping. Options are `:none` (default), `:thread`, `:task`,  `[:thread, :task]`, or `[:task, :thread]` where the last two provide nested grouping.
  
- `noisefloor` – Limits frames that exceed the heuristic noise floor of the sample (only applies to format `:tree`).  A suggested value to try for this is 2.0 (the default is 0). This parameter hides samples for which `n <= noisefloor * √N`,  where `n` is the number of samples on this line, and `N` is the number of samples for the callee.
  
- `mincount` – Limits the printout to only those lines with at least `mincount` occurrences.
  
- `recur` – Controls the recursion handling in `:tree` format. `:off` (default) prints the tree as normal. `:flat` instead  compresses any recursion (by ip), showing the approximate effect of converting any self-recursion into an iterator.  `:flatc` does the same but also includes collapsing of C frames (may do odd things around `jl_apply`).
  
- `threads::Union{Int,AbstractVector{Int}}` – Specify which threads to include snapshots from in the report. Note that  this does not control which threads samples are collected on (which may also have been collected on another machine).
  
- `tasks::Union{Int,AbstractVector{Int}}` – Specify which tasks to include snapshots from in the report. Note that this  does not control which tasks samples are collected within.
  

::: tip Julia 1.8

The `groupby`, `threads`, and `tasks` keyword arguments were introduced in Julia 1.8.

:::

::: tip Note

Profiling on windows is limited to the main thread. Other threads have not been sampled and will not show in the report.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L194-L241)



```julia
print([io::IO = stdout,] data::Vector, lidict::LineInfoDict; kwargs...)
```


Prints profiling results to `io`. This variant is used to examine results exported by a previous call to [`retrieve`](/stdlib/Profile#Profile.retrieve). Supply the vector `data` of backtraces and a dictionary `lidict` of line information.

See `Profile.print([io], data)` for an explanation of the valid keyword arguments.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L334-L342)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.init' href='#Profile.init'>#</a>&nbsp;<b><u>Profile.init</u></b> &mdash; <i>Function</i>.




```julia
init(; n::Integer, delay::Real)
```


Configure the `delay` between backtraces (measured in seconds), and the number `n` of instruction pointers that may be stored per thread. Each instruction pointer corresponds to a single line of code; backtraces generally consist of a long list of instruction pointers. Note that 6 spaces for instruction pointers per backtrace are used to store metadata and two NULL end markers. Current settings can be obtained by calling this function with no arguments, and each can be set independently using keywords or in the order `(n, delay)`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L93-L101)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.fetch' href='#Profile.fetch'>#</a>&nbsp;<b><u>Profile.fetch</u></b> &mdash; <i>Function</i>.




```julia
fetch(;include_meta = true) -> data
```


Return a copy of the buffer of profile backtraces. Note that the values in `data` have meaning only on this machine in the current session, because it depends on the exact memory addresses used in JIT-compiling. This function is primarily for internal use; [`retrieve`](/stdlib/Profile#Profile.retrieve) may be a better choice for most users. By default metadata such as threadid and taskid is included. Set `include_meta` to `false` to strip metadata.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L623-L631)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.retrieve' href='#Profile.retrieve'>#</a>&nbsp;<b><u>Profile.retrieve</u></b> &mdash; <i>Function</i>.




```julia
retrieve(; kwargs...) -> data, lidict
```


&quot;Exports&quot; profiling results in a portable format, returning the set of all backtraces (`data`) and a dictionary that maps the (session-specific) instruction pointers in `data` to `LineInfo` values that store the file name, function name, and line number. This function allows you to save profiling results for future analysis.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L413-L420)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.callers' href='#Profile.callers'>#</a>&nbsp;<b><u>Profile.callers</u></b> &mdash; <i>Function</i>.




```julia
callers(funcname, [data, lidict], [filename=<filename>], [linerange=<start:stop>]) -> Vector{Tuple{count, lineinfo}}
```


Given a previous profiling run, determine who called a particular function. Supplying the filename (and optionally, range of line numbers over which the function is defined) allows you to disambiguate an overloaded method. The returned value is a vector containing a count of the number of calls and line information about the caller. One can optionally supply backtrace `data` obtained from [`retrieve`](/stdlib/Profile#Profile.retrieve); otherwise, the current internal profile buffer is used.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L543-L552)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.clear_malloc_data' href='#Profile.clear_malloc_data'>#</a>&nbsp;<b><u>Profile.clear_malloc_data</u></b> &mdash; <i>Function</i>.




```julia
clear_malloc_data()
```


Clears any stored memory allocation data when running julia with `--track-allocation`. Execute the command(s) you want to test (to force JIT-compilation), then call [`clear_malloc_data`](/stdlib/Profile#Profile.clear_malloc_data). Then execute your command(s) again, quit Julia, and examine the resulting `*.mem` files.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L584-L591)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.get_peek_duration' href='#Profile.get_peek_duration'>#</a>&nbsp;<b><u>Profile.get_peek_duration</u></b> &mdash; <i>Function</i>.




```julia
get_peek_duration()
```


Get the duration in seconds of the profile &quot;peek&quot; that is triggered via `SIGINFO` or `SIGUSR1`, depending on platform.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L74-L78)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.set_peek_duration' href='#Profile.set_peek_duration'>#</a>&nbsp;<b><u>Profile.set_peek_duration</u></b> &mdash; <i>Function</i>.




```julia
set_peek_duration(t::Float64)
```


Set the duration in seconds of the profile &quot;peek&quot; that is triggered via `SIGINFO` or `SIGUSR1`, depending on platform.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L80-L84)

</div>
<br>

## Memory profiling {#Memory-profiling}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.Allocs.@profile' href='#Profile.Allocs.@profile'>#</a>&nbsp;<b><u>Profile.Allocs.@profile</u></b> &mdash; <i>Macro</i>.




```julia
Profile.Allocs.@profile [sample_rate=0.1] expr
```


Profile allocations that happen during `expr`, returning both the result and AllocResults struct.

A sample rate of 1.0 will record everything; 0.0 will record nothing.

```julia
julia> Profile.Allocs.@profile sample_rate=0.01 peakflops()
1.03733270279065e11

julia> results = Profile.Allocs.fetch()

julia> last(sort(results.allocs, by=x->x.size))
Profile.Allocs.Alloc(Vector{Any}, Base.StackTraces.StackFrame[_new_array_ at array.c:127, ...], 5576)
```


See the profiling tutorial in the Julia documentation for more information.

::: tip Julia 1.11

Older versions of Julia could not capture types in all cases. In older versions of Julia, if you see an allocation of type `Profile.Allocs.UnknownType`, it means that the profiler doesn&#39;t know what type of object was allocated. This mainly happened when the allocation was coming from generated code produced by the compiler. See [issue #43688](https://github.com/JuliaLang/julia/issues/43688) for more info.

Since Julia 1.11, all allocations should have a type reported.

:::

::: tip Julia 1.8

The allocation profiler was added in Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Allocs.jl#L39-L71)

</div>
<br>

The methods in `Profile.Allocs` are not exported and need to be called e.g. as `Profile.Allocs.fetch()`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.Allocs.clear' href='#Profile.Allocs.clear'>#</a>&nbsp;<b><u>Profile.Allocs.clear</u></b> &mdash; <i>Function</i>.




```julia
Profile.Allocs.clear()
```


Clear all previously profiled allocation information from memory.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Allocs.jl#L109-L113)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.Allocs.print' href='#Profile.Allocs.print'>#</a>&nbsp;<b><u>Profile.Allocs.print</u></b> &mdash; <i>Function</i>.




```julia
Profile.Allocs.print([io::IO = stdout,] [data::AllocResults = fetch()]; kwargs...)
```


Prints profiling results to `io` (by default, `stdout`). If you do not supply a `data` vector, the internal buffer of accumulated backtraces will be used.

See `Profile.print` for an explanation of the valid keyword arguments.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Allocs.jl#L234-L242)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.Allocs.fetch' href='#Profile.Allocs.fetch'>#</a>&nbsp;<b><u>Profile.Allocs.fetch</u></b> &mdash; <i>Function</i>.




```julia
Profile.Allocs.fetch()
```


Retrieve the recorded allocations, and decode them into Julia objects which can be analyzed.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Allocs.jl#L119-L124)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.Allocs.start' href='#Profile.Allocs.start'>#</a>&nbsp;<b><u>Profile.Allocs.start</u></b> &mdash; <i>Function</i>.




```julia
Profile.Allocs.start(sample_rate::Real)
```


Begin recording allocations with the given sample rate A sample rate of 1.0 will record everything; 0.0 will record nothing.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Allocs.jl#L90-L95)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.Allocs.stop' href='#Profile.Allocs.stop'>#</a>&nbsp;<b><u>Profile.Allocs.stop</u></b> &mdash; <i>Function</i>.




```julia
Profile.Allocs.stop()
```


Stop recording allocations.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Allocs.jl#L100-L104)

</div>
<br>

## Heap Snapshots {#Heap-Snapshots}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Profile.take_heap_snapshot' href='#Profile.take_heap_snapshot'>#</a>&nbsp;<b><u>Profile.take_heap_snapshot</u></b> &mdash; <i>Function</i>.




```julia
Profile.take_heap_snapshot(filepath::String, all_one::Bool=false, streaming=false)
Profile.take_heap_snapshot(all_one::Bool=false; dir::String, streaming=false)
```


Write a snapshot of the heap, in the JSON format expected by the Chrome Devtools Heap Snapshot viewer (.heapsnapshot extension) to a file (`$pid_$timestamp.heapsnapshot`) in the current directory by default (or tempdir if the current directory is unwritable), or in `dir` if given, or the given full file path, or IO stream.

If `all_one` is true, then report the size of every object as one so they can be easily counted. Otherwise, report the actual size.

If `streaming` is true, we will stream the snapshot data out into four files, using filepath as the prefix, to avoid having to hold the entire snapshot in memory. This option should be used for any setting where your memory is constrained. These files can then be reassembled by calling Profile.HeapSnapshot.assemble_snapshot(), which can be done offline.

NOTE: We strongly recommend setting streaming=true for performance reasons. Reconstructing the snapshot from the parts requires holding the entire snapshot in memory, so if the snapshot is large, you can run out of memory while processing it. Streaming allows you to reconstruct the snapshot offline, after your workload is done running. If you do attempt to collect a snapshot with streaming=false (the default, for backwards-compatibility) and your process is killed, note that this will always save the parts in the same directory as your provided filepath, so you can still reconstruct the snapshot after the fact, via `assemble_snapshot()`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Profile/src/Profile.jl#L1252-L1279)

</div>
<br>

The methods in `Profile` are not exported and need to be called e.g. as `Profile.take_heap_snapshot()`.

```julia
julia> using Profile

julia> Profile.take_heap_snapshot("snapshot.heapsnapshot")
```


Traces and records julia objects on the heap. This only records objects known to the Julia garbage collector. Memory allocated by external libraries not managed by the garbage collector will not show up in the snapshot.

To avoid OOMing while recording the snapshot, we added a streaming option to stream out the heap snapshot into four files,

```julia
julia> using Profile

julia> Profile.take_heap_snapshot("snapshot"; streaming=true)
```


where &quot;snapshot&quot; is the filepath as the prefix for the generated files.

Once the snapshot files are generated, they could be assembled offline with the following command:

```julia
julia> using Profile

julia> Profile.HeapSnapshot.assemble_snapshot("snapshot", "snapshot.heapsnapshot")
```


The resulting heap snapshot file can be uploaded to chrome devtools to be viewed. For more information, see the [chrome devtools docs](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots/#view_snapshots).
