
# Distributed Computing {#man-distributed}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed' href='#Distributed'>#</a>&nbsp;<b><u>Distributed</u></b> &mdash; <i>Module</i>.




Tools for distributed parallel processing.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/Distributed.jl#L3-L5)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.addprocs' href='#Distributed.addprocs'>#</a>&nbsp;<b><u>Distributed.addprocs</u></b> &mdash; <i>Function</i>.




```julia
addprocs(manager::ClusterManager; kwargs...) -> List of process identifiers
```


Launches worker processes via the specified cluster manager.

For example, Beowulf clusters are supported via a custom cluster manager implemented in the package `ClusterManagers.jl`.

The number of seconds a newly launched worker waits for connection establishment from the master can be specified via variable `JULIA_WORKER_TIMEOUT` in the worker process&#39;s environment. Relevant only when using TCP/IP as transport.

To launch workers without blocking the REPL, or the containing function if launching workers programmatically, execute `addprocs` in its own task.

**Examples**

```julia
# On busy clusters, call `addprocs` asynchronously
t = @async addprocs(...)
```


```julia
# Utilize workers as and when they come online
if nprocs() > 1   # Ensure at least one new worker is available
   ....   # perform distributed execution
end
```


```julia
# Retrieve newly launched worker IDs, or any error messages
if istaskdone(t)   # Check if `addprocs` has completed to ensure `fetch` doesn't block
    if nworkers() == N
        new_pids = fetch(t)
    else
        fetch(t)
    end
end
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L403-L442)



```julia
addprocs(machines; tunnel=false, sshflags=``, max_parallel=10, kwargs...) -> List of process identifiers
```


Add worker processes on remote machines via SSH. Configuration is done with keyword arguments (see below). In particular, the `exename` keyword can be used to specify the path to the `julia` binary on the remote machine(s).

`machines` is a vector of &quot;machine specifications&quot; which are given as strings of the form `[user@]host[:port] [bind_addr[:port]]`. `user` defaults to current user and `port` to the standard SSH port. If `[bind_addr[:port]]` is specified, other workers will connect to this worker at the specified `bind_addr` and `port`.

It is possible to launch multiple processes on a remote host by using a tuple in the `machines` vector or the form `(machine_spec, count)`, where `count` is the number of workers to be launched on the specified host. Passing `:auto` as the worker count will launch as many workers as the number of CPU threads on the remote host.

**Examples**:

```julia
addprocs([
    "remote1",               # one worker on 'remote1' logging in with the current username
    "user@remote2",          # one worker on 'remote2' logging in with the 'user' username
    "user@remote3:2222",     # specifying SSH port to '2222' for 'remote3'
    ("user@remote4", 4),     # launch 4 workers on 'remote4'
    ("user@remote5", :auto), # launch as many workers as CPU threads on 'remote5'
])
```


**Keyword arguments**:
- `tunnel`: if `true` then SSH tunneling will be used to connect to the worker from the master process. Default is `false`.
  
- `multiplex`: if `true` then SSH multiplexing is used for SSH tunneling. Default is `false`.
  
- `ssh`: the name or path of the SSH client executable used to start the workers. Default is `"ssh"`.
  
- `sshflags`: specifies additional ssh options, e.g. `sshflags=`-i /home/foo/bar.pem``
  
- `max_parallel`: specifies the maximum number of workers connected to in parallel at a host. Defaults to 10.
  
- `shell`: specifies the type of shell to which ssh connects on the workers.
  - `shell=:posix`: a POSIX-compatible Unix/Linux shell (sh, ksh, bash, dash, zsh, etc.). The default.
    
  - `shell=:csh`: a Unix C shell (csh, tcsh).
    
  - `shell=:wincmd`: Microsoft Windows `cmd.exe`.
    
  
- `dir`: specifies the working directory on the workers. Defaults to the host&#39;s current directory (as found by `pwd()`)
  
- `enable_threaded_blas`: if `true` then  BLAS will run on multiple threads in added processes. Default is `false`.
  
- `exename`: name of the `julia` executable. Defaults to `"$(Sys.BINDIR)/julia"` or `"$(Sys.BINDIR)/julia-debug"` as the case may be. It is recommended that a common Julia version is used on all remote machines because serialization and code distribution might fail otherwise.
  
- `exeflags`: additional flags passed to the worker processes.
  
- `topology`: Specifies how the workers connect to each other. Sending a message between unconnected workers results in an error.
  - `topology=:all_to_all`: All processes are connected to each other. The default.
    
  - `topology=:master_worker`: Only the driver process, i.e. `pid` 1 connects to the workers. The workers do not connect to each other.
    
  - `topology=:custom`: The `launch` method of the cluster manager specifies the connection topology via fields `ident` and `connect_idents` in `WorkerConfig`. A worker with a cluster manager identity `ident` will connect to all workers specified in `connect_idents`.
    
  
- `lazy`: Applicable only with `topology=:all_to_all`. If `true`, worker-worker connections are setup lazily, i.e. they are setup at the first instance of a remote call between workers. Default is true.
  
- `env`: provide an array of string pairs such as `env=["JULIA_DEPOT_PATH"=>"/depot"]` to request that environment variables are set on the remote machine. By default only the environment variable `JULIA_WORKER_TIMEOUT` is passed automatically from the local to the remote environment.
  
- `cmdline_cookie`: pass the authentication cookie via the `--worker` commandline  option. The (more secure) default behaviour of passing the cookie via ssh stdio  may hang with Windows workers that use older (pre-ConPTY) Julia or Windows versions,  in which case `cmdline_cookie=true` offers a work-around.
  

::: tip Julia 1.6

The keyword arguments `ssh`, `shell`, `env` and `cmdline_cookie` were added in Julia 1.6.

:::

Environment variables:

If the master process fails to establish a connection with a newly launched worker within 60.0 seconds, the worker treats it as a fatal situation and terminates. This timeout can be controlled via environment variable `JULIA_WORKER_TIMEOUT`. The value of `JULIA_WORKER_TIMEOUT` on the master process specifies the number of seconds a newly launched worker waits for connection establishment.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/managers.jl#L51-L155)



```julia
addprocs(np::Integer=Sys.CPU_THREADS; restrict=true, kwargs...) -> List of process identifiers
```


Launch `np` workers on the local host using the in-built `LocalManager`.

Local workers inherit the current package environment (i.e., active project, [`LOAD_PATH`](/base/constants#Base.LOAD_PATH), and [`DEPOT_PATH`](/base/constants#Base.DEPOT_PATH)) from the main process.

::: warning Warning

Note that workers do not run a `~/.julia/config/startup.jl` startup script, nor do they synchronize their global state (such as command-line switches, global variables, new method definitions, and loaded modules) with any of the other running processes.

:::

**Keyword arguments**:
- `restrict::Bool`: if `true` (default) binding is restricted to `127.0.0.1`.
  
- `dir`, `exename`, `exeflags`, `env`, `topology`, `lazy`, `enable_threaded_blas`: same effect as for `SSHManager`, see documentation for [`addprocs(machines::AbstractVector)`](/stdlib/Distributed#Distributed.addprocs).
  

::: tip Julia 1.9

The inheriting of the package environment and the `env` keyword argument were added in Julia 1.9.

:::


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/managers.jl#L445-L466)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.nprocs' href='#Distributed.nprocs'>#</a>&nbsp;<b><u>Distributed.nprocs</u></b> &mdash; <i>Function</i>.




```julia
nprocs()
```


Get the number of available processes.

**Examples**

```julia
julia> nprocs()
3

julia> workers()
2-element Array{Int64,1}:
 2
 3
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L852-L867)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.nworkers' href='#Distributed.nworkers'>#</a>&nbsp;<b><u>Distributed.nworkers</u></b> &mdash; <i>Function</i>.




```julia
nworkers()
```


Get the number of available worker processes. This is one less than [`nprocs()`](/stdlib/Distributed#Distributed.nprocs). Equal to `nprocs()` if `nprocs() == 1`.

**Examples**

```julia
$ julia -p 2

julia> nprocs()
3

julia> nworkers()
2
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L883-L899)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.procs-Tuple{}' href='#Distributed.procs-Tuple{}'>#</a>&nbsp;<b><u>Distributed.procs</u></b> &mdash; <i>Method</i>.




```julia
procs()
```


Return a list of all process identifiers, including pid 1 (which is not included by [`workers()`](/stdlib/Distributed#Distributed.workers)).

**Examples**

```julia
$ julia -p 2

julia> procs()
3-element Array{Int64,1}:
 1
 2
 3
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L905-L920)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.procs-Tuple{Integer}' href='#Distributed.procs-Tuple{Integer}'>#</a>&nbsp;<b><u>Distributed.procs</u></b> &mdash; <i>Method</i>.




```julia
procs(pid::Integer)
```


Return a list of all process identifiers on the same physical node. Specifically all workers bound to the same ip-address as `pid` are returned.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L947-L952)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.workers' href='#Distributed.workers'>#</a>&nbsp;<b><u>Distributed.workers</u></b> &mdash; <i>Function</i>.




```julia
workers()
```


Return a list of all worker process identifiers.

**Examples**

```julia
$ julia -p 2

julia> workers()
2-element Array{Int64,1}:
 2
 3
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L967-L981)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.rmprocs' href='#Distributed.rmprocs'>#</a>&nbsp;<b><u>Distributed.rmprocs</u></b> &mdash; <i>Function</i>.




```julia
rmprocs(pids...; waitfor=typemax(Int))
```


Remove the specified workers. Note that only process 1 can add or remove workers.

Argument `waitfor` specifies how long to wait for the workers to shut down:
- If unspecified, `rmprocs` will wait until all requested `pids` are removed.
  
- An [`ErrorException`](/base/base#Core.ErrorException) is raised if all workers cannot be terminated before the requested `waitfor` seconds.
  
- With a `waitfor` value of 0, the call returns immediately with the workers scheduled for removal in a different task. The scheduled [`Task`](/base/parallel#Core.Task) object is returned. The user should call [`wait`](/base/parallel#Base.wait) on the task before invoking any other parallel calls.
  

**Examples**

```julia
$ julia -p 5

julia> t = rmprocs(2, 3, waitfor=0)
Task (runnable) @0x0000000107c718d0

julia> wait(t)

julia> workers()
3-element Array{Int64,1}:
 4
 5
 6
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L997-L1027)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.interrupt' href='#Distributed.interrupt'>#</a>&nbsp;<b><u>Distributed.interrupt</u></b> &mdash; <i>Function</i>.




```julia
interrupt(pids::Integer...)
```


Interrupt the current executing task on the specified workers. This is equivalent to pressing Ctrl-C on the local machine. If no arguments are given, all workers are interrupted.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L1204-L1209)



```julia
interrupt(pids::AbstractVector=workers())
```


Interrupt the current executing task on the specified workers. This is equivalent to pressing Ctrl-C on the local machine. If no arguments are given, all workers are interrupted.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L1212-L1217)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.myid' href='#Distributed.myid'>#</a>&nbsp;<b><u>Distributed.myid</u></b> &mdash; <i>Function</i>.




```julia
myid()
```


Get the id of the current process.

**Examples**

```julia
julia> myid()
1

julia> remotecall_fetch(() -> myid(), 4)
4
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L836-L849)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.pmap' href='#Distributed.pmap'>#</a>&nbsp;<b><u>Distributed.pmap</u></b> &mdash; <i>Function</i>.




```julia
pmap(f, [::AbstractWorkerPool], c...; distributed=true, batch_size=1, on_error=nothing, retry_delays=[], retry_check=nothing) -> collection
```


Transform collection `c` by applying `f` to each element using available workers and tasks.

For multiple collection arguments, apply `f` elementwise.

Note that `f` must be made available to all worker processes; see [Code Availability and Loading Packages](/manual/distributed-computing#code-availability) for details.

If a worker pool is not specified all available workers will be used via a [`CachingPool`](/stdlib/Distributed#Distributed.CachingPool).

By default, `pmap` distributes the computation over all specified workers. To use only the local process and distribute over tasks, specify `distributed=false`. This is equivalent to using [`asyncmap`](/base/parallel#Base.asyncmap). For example, `pmap(f, c; distributed=false)` is equivalent to `asyncmap(f,c; ntasks=()->nworkers())`

`pmap` can also use a mix of processes and tasks via the `batch_size` argument. For batch sizes greater than 1, the collection is processed in multiple batches, each of length `batch_size` or less. A batch is sent as a single request to a free worker, where a local [`asyncmap`](/base/parallel#Base.asyncmap) processes elements from the batch using multiple concurrent tasks.

Any error stops `pmap` from processing the remainder of the collection. To override this behavior you can specify an error handling function via argument `on_error` which takes in a single argument, i.e., the exception. The function can stop the processing by rethrowing the error, or, to continue, return any value which is then returned inline with the results to the caller.

Consider the following two examples. The first one returns the exception object inline, the second a 0 in place of any exception:

```julia
julia> pmap(x->iseven(x) ? error("foo") : x, 1:4; on_error=identity)
4-element Array{Any,1}:
 1
  ErrorException("foo")
 3
  ErrorException("foo")

julia> pmap(x->iseven(x) ? error("foo") : x, 1:4; on_error=ex->0)
4-element Array{Int64,1}:
 1
 0
 3
 0
```


Errors can also be handled by retrying failed computations. Keyword arguments `retry_delays` and `retry_check` are passed through to [`retry`](/base/base#Base.retry) as keyword arguments `delays` and `check` respectively. If batching is specified, and an entire batch fails, all items in the batch are retried.

Note that if both `on_error` and `retry_delays` are specified, the `on_error` hook is called before retrying. If `on_error` does not throw (or rethrow) an exception, the element will not be retried.

Example: On errors, retry `f` on an element a maximum of 3 times without any delay between retries.

```julia
pmap(f, c; retry_delays = zeros(3))
```


Example: Retry `f` only if the exception is not of type [`InexactError`](/base/base#Core.InexactError), with exponentially increasing delays up to 3 times. Return a `NaN` in place for all `InexactError` occurrences.

```julia
pmap(f, c; on_error = e->(isa(e, InexactError) ? NaN : rethrow()), retry_delays = ExponentialBackOff(n = 3))
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/pmap.jl#L32-L98)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.RemoteException' href='#Distributed.RemoteException'>#</a>&nbsp;<b><u>Distributed.RemoteException</u></b> &mdash; <i>Type</i>.




```julia
RemoteException(captured)
```


Exceptions on remote computations are captured and rethrown locally.  A `RemoteException` wraps the `pid` of the worker and a captured exception. A `CapturedException` captures the remote exception and a serializable form of the call stack when the exception was raised.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/process_messages.jl#L54-L60)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.ProcessExitedException' href='#Distributed.ProcessExitedException'>#</a>&nbsp;<b><u>Distributed.ProcessExitedException</u></b> &mdash; <i>Type</i>.




```julia
ProcessExitedException(worker_id::Int)
```


After a client Julia process has exited, further attempts to reference the dead child will throw this exception.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L1077-L1082)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.Future' href='#Distributed.Future'>#</a>&nbsp;<b><u>Distributed.Future</u></b> &mdash; <i>Type</i>.




```julia
Future(w::Int, rrid::RRID, v::Union{Some, Nothing}=nothing)
```


A `Future` is a placeholder for a single computation of unknown termination status and time. For multiple potential computations, see `RemoteChannel`. See `remoteref_id` for identifying an `AbstractRemoteRef`.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L17-L24)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.RemoteChannel' href='#Distributed.RemoteChannel'>#</a>&nbsp;<b><u>Distributed.RemoteChannel</u></b> &mdash; <i>Type</i>.




```julia
RemoteChannel(pid::Integer=myid())
```


Make a reference to a `Channel{Any}(1)` on process `pid`. The default `pid` is the current process.

```
RemoteChannel(f::Function, pid::Integer=myid())
```


Create references to remote channels of a specific size and type. `f` is a function that when executed on `pid` must return an implementation of an `AbstractChannel`.

For example, `RemoteChannel(()->Channel{Int}(10), pid)`, will return a reference to a channel of type `Int` and size 10 on `pid`.

The default `pid` is the current process.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L38-L53)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fetch-Tuple{Distributed.Future}' href='#Base.fetch-Tuple{Distributed.Future}'>#</a>&nbsp;<b><u>Base.fetch</u></b> &mdash; <i>Method</i>.




```julia
fetch(x::Future)
```


Wait for and get the value of a [`Future`](/stdlib/Future#Future). The fetched value is cached locally. Further calls to `fetch` on the same reference return the cached value. If the remote value is an exception, throws a [`RemoteException`](/stdlib/Distributed#Distributed.RemoteException) which captures the remote exception and backtrace.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L595-L601)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fetch-Tuple{RemoteChannel}' href='#Base.fetch-Tuple{RemoteChannel}'>#</a>&nbsp;<b><u>Base.fetch</u></b> &mdash; <i>Method</i>.




```julia
fetch(c::RemoteChannel)
```


Wait for and get a value from a [`RemoteChannel`](/stdlib/Distributed#Distributed.RemoteChannel). Exceptions raised are the same as for a [`Future`](/stdlib/Future#Future). Does not remove the item fetched.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L650-L655)



```julia
fetch(x::Any)
```


Return `x`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/task.jl#L509-L513)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remotecall-Tuple{Any, Integer, Vararg{Any}}' href='#Distributed.remotecall-Tuple{Any, Integer, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remotecall</u></b> &mdash; <i>Method</i>.




```julia
remotecall(f, id::Integer, args...; kwargs...) -> Future
```


Call a function `f` asynchronously on the given arguments on the specified process. Return a [`Future`](/stdlib/Future#Future). Keyword arguments, if any, are passed through to `f`.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L440-L446)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remotecall_wait-Tuple{Any, Integer, Vararg{Any}}' href='#Distributed.remotecall_wait-Tuple{Any, Integer, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remotecall_wait</u></b> &mdash; <i>Method</i>.




```julia
remotecall_wait(f, id::Integer, args...; kwargs...)
```


Perform a faster `wait(remotecall(...))` in one message on the `Worker` specified by worker id `id`. Keyword arguments, if any, are passed through to `f`.

See also [`wait`](/base/parallel#Base.wait) and [`remotecall`](/stdlib/Distributed#Distributed.remotecall-Tuple{Any,%20Integer,%20Vararg{Any}}).


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L511-L518)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remotecall_fetch-Tuple{Any, Integer, Vararg{Any}}' href='#Distributed.remotecall_fetch-Tuple{Any, Integer, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remotecall_fetch</u></b> &mdash; <i>Method</i>.




```julia
remotecall_fetch(f, id::Integer, args...; kwargs...)
```


Perform `fetch(remotecall(...))` in one message. Keyword arguments, if any, are passed through to `f`. Any remote exceptions are captured in a [`RemoteException`](/stdlib/Distributed#Distributed.RemoteException) and thrown.

See also [`fetch`](/base/parallel#Base.fetch-Tuple{Task}) and [`remotecall`](/stdlib/Distributed#Distributed.remotecall-Tuple{Any,%20Integer,%20Vararg{Any}}).

**Examples**

```julia
$ julia -p 2

julia> remotecall_fetch(sqrt, 2, 4)
2.0

julia> remotecall_fetch(sqrt, 2, -4)
ERROR: On worker 2:
DomainError with -4.0:
sqrt was called with a negative real argument but will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
...
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L468-L491)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remote_do-Tuple{Any, Integer, Vararg{Any}}' href='#Distributed.remote_do-Tuple{Any, Integer, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remote_do</u></b> &mdash; <i>Method</i>.




```julia
remote_do(f, id::Integer, args...; kwargs...) -> nothing
```


Executes `f` on worker `id` asynchronously. Unlike [`remotecall`](/stdlib/Distributed#Distributed.remotecall-Tuple{Any,%20Integer,%20Vararg{Any}}), it does not store the result of computation, nor is there a way to wait for its completion.

A successful invocation indicates that the request has been accepted for execution on the remote node.

While consecutive `remotecall`s to the same worker are serialized in the order they are invoked, the order of executions on the remote worker is undetermined. For example, `remote_do(f1, 2); remotecall(f2, 2); remote_do(f3, 2)` will serialize the call to `f1`, followed by `f2` and `f3` in that order. However, it is not guaranteed that `f1` is executed before `f3` on worker 2.

Any exceptions thrown by `f` are printed to [`stderr`](/base/io-network#Base.stderr) on the remote worker.

Keyword arguments, if any, are passed through to `f`.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L537-L556)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.put!-Tuple{RemoteChannel, Vararg{Any}}' href='#Base.put!-Tuple{RemoteChannel, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.put!</u></b> &mdash; <i>Method</i>.




```julia
put!(rr::RemoteChannel, args...)
```


Store a set of values to the [`RemoteChannel`](/stdlib/Distributed#Distributed.RemoteChannel). If the channel is full, blocks until space is available. Return the first argument.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L715-L721)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.put!-Tuple{Distributed.Future, Any}' href='#Base.put!-Tuple{Distributed.Future, Any}'>#</a>&nbsp;<b><u>Base.put!</u></b> &mdash; <i>Method</i>.




```julia
put!(rr::Future, v)
```


Store a value to a [`Future`](/stdlib/Future#Future) `rr`. `Future`s are write-once remote references. A `put!` on an already set `Future` throws an `Exception`. All asynchronous remote calls return `Future`s and set the value to the return value of the call upon completion.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L660-L668)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.take!-Tuple{RemoteChannel, Vararg{Any}}' href='#Base.take!-Tuple{RemoteChannel, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.take!</u></b> &mdash; <i>Method</i>.




```julia
take!(rr::RemoteChannel, args...)
```


Fetch value(s) from a [`RemoteChannel`](/stdlib/Distributed#Distributed.RemoteChannel) `rr`, removing the value(s) in the process.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L755-L760)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isready-Tuple{RemoteChannel, Vararg{Any}}' href='#Base.isready-Tuple{RemoteChannel, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.isready</u></b> &mdash; <i>Method</i>.




```julia
isready(rr::RemoteChannel, args...)
```


Determine whether a [`RemoteChannel`](/stdlib/Distributed#Distributed.RemoteChannel) has a value stored to it. Note that this function can cause race conditions, since by the time you receive its result it may no longer be true. However, it can be safely used on a [`Future`](/stdlib/Future#Future) since they are assigned only once.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L224-L231)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isready-Tuple{Distributed.Future}' href='#Base.isready-Tuple{Distributed.Future}'>#</a>&nbsp;<b><u>Base.isready</u></b> &mdash; <i>Method</i>.




```julia
isready(rr::Future)
```


Determine whether a [`Future`](/stdlib/Future#Future) has a value stored to it.

If the argument `Future` is owned by a different node, this call will block to wait for the answer. It is recommended to wait for `rr` in a separate task instead or to use a local [`Channel`](/base/parallel#Base.Channel) as a proxy:

```julia
p = 1
f = Future(p)
errormonitor(@async put!(f, remotecall_fetch(long_computation, p)))
isready(f)  # will not block
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L196-L211)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.AbstractWorkerPool' href='#Distributed.AbstractWorkerPool'>#</a>&nbsp;<b><u>Distributed.AbstractWorkerPool</u></b> &mdash; <i>Type</i>.




```julia
AbstractWorkerPool
```


Supertype for worker pools such as [`WorkerPool`](/stdlib/Distributed#Distributed.WorkerPool) and [`CachingPool`](/stdlib/Distributed#Distributed.CachingPool). An `AbstractWorkerPool` should implement:
- [`push!`](/base/collections#Base.push!) - add a new worker to the overall pool (available + busy)
  
- [`put!`](/base/parallel#Base.put!-Tuple{Channel,%20Any}) - put back a worker to the available pool
  
- [`take!`](/base/io-network#Base.take!-Tuple{Base.GenericIOBuffer}) - take a worker from the available pool (to be used for remote function execution)
  
- [`length`](/base/collections#Base.length) - number of workers available in the overall pool
  
- [`isready`](/base/parallel#Base.isready-Tuple{Channel}) - return false if a `take!` on the pool would block, else true
  

The default implementations of the above (on a `AbstractWorkerPool`) require fields
- `channel::Channel{Int}`
  
- `workers::Set{Int}`
  

where `channel` contains free worker pids and `workers` is the set of all workers associated with this pool.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L3-L18)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.WorkerPool' href='#Distributed.WorkerPool'>#</a>&nbsp;<b><u>Distributed.WorkerPool</u></b> &mdash; <i>Type</i>.




```julia
WorkerPool(workers::Union{Vector{Int},AbstractRange{Int}})
```


Create a `WorkerPool` from a vector or range of worker ids.

**Examples**

```julia
$ julia -p 3

julia> WorkerPool([2, 3])
WorkerPool(Channel{Int64}(sz_max:9223372036854775807,sz_curr:2), Set([2, 3]), RemoteChannel{Channel{Any}}(1, 1, 6))

julia> WorkerPool(2:4)
WorkerPool(Channel{Int64}(sz_max:9223372036854775807,sz_curr:2), Set([4, 2, 3]), RemoteChannel{Channel{Any}}(1, 1, 7))
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L35-L50)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.CachingPool' href='#Distributed.CachingPool'>#</a>&nbsp;<b><u>Distributed.CachingPool</u></b> &mdash; <i>Type</i>.




```julia
CachingPool(workers::Vector{Int})
```


An implementation of an `AbstractWorkerPool`. [`remote`](/stdlib/Distributed#Distributed.remote), [`remotecall_fetch`](/stdlib/Distributed#Distributed.remotecall_fetch-Tuple{Any,%20Integer,%20Vararg{Any}}), [`pmap`](/stdlib/Distributed#Distributed.pmap) (and other remote calls which execute functions remotely) benefit from caching the serialized/deserialized functions on the worker nodes, especially closures (which may capture large amounts of data).

The remote cache is maintained for the lifetime of the returned `CachingPool` object. To clear the cache earlier, use `clear!(pool)`.

For global variables, only the bindings are captured in a closure, not the data. `let` blocks can be used to capture global data.

**Examples**

```julia
const foo = rand(10^8);
wp = CachingPool(workers())
let foo = foo
    pmap(i -> sum(foo) + i, wp, 1:100);
end
```


The above would transfer `foo` only once to each worker.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L306-L332)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.default_worker_pool' href='#Distributed.default_worker_pool'>#</a>&nbsp;<b><u>Distributed.default_worker_pool</u></b> &mdash; <i>Function</i>.




```julia
default_worker_pool()
```


[`AbstractWorkerPool`](/stdlib/Distributed#Distributed.AbstractWorkerPool) containing idle [`workers`](/stdlib/Distributed#Distributed.workers) - used by `remote(f)` and [`pmap`](/stdlib/Distributed#Distributed.pmap) (by default). Unless one is explicitly set via `default_worker_pool!(pool)`, the default worker pool is initialized to a [`WorkerPool`](/stdlib/Distributed#Distributed.WorkerPool).

**Examples**

```julia
$ julia -p 3

julia> default_worker_pool()
WorkerPool(Channel{Int64}(sz_max:9223372036854775807,sz_curr:3), Set([4, 2, 3]), RemoteChannel{Channel{Any}}(1, 1, 4))
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L244-L258)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.clear!' href='#Distributed.clear!'>#</a>&nbsp;<b><u>Distributed.clear!</u></b> &mdash; <i>Function</i>.




```julia
clear!(syms, pids=workers(); mod=Main)
```


Clears global bindings in modules by initializing them to `nothing`. `syms` should be of type [`Symbol`](/base/base#Core.Symbol) or a collection of `Symbol`s . `pids` and `mod` identify the processes and the module in which global variables are to be reinitialized. Only those names found to be defined under `mod` are cleared.

An exception is raised if a global constant is requested to be cleared.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/clusterserialize.jl#L234-L243)



```julia
clear!(pool::CachingPool) -> pool
```


Removes all cached functions from all participating workers.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L341-L345)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remote' href='#Distributed.remote'>#</a>&nbsp;<b><u>Distributed.remote</u></b> &mdash; <i>Function</i>.




```julia
remote([p::AbstractWorkerPool], f) -> Function
```


Return an anonymous function that executes function `f` on an available worker (drawn from [`WorkerPool`](/stdlib/Distributed#Distributed.WorkerPool) `p` if provided) using [`remotecall_fetch`](/stdlib/Distributed#Distributed.remotecall_fetch-Tuple{Any,%20Integer,%20Vararg{Any}}).


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L281-L286)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remotecall-Tuple{Any, AbstractWorkerPool, Vararg{Any}}' href='#Distributed.remotecall-Tuple{Any, AbstractWorkerPool, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remotecall</u></b> &mdash; <i>Method</i>.




```julia
remotecall(f, pool::AbstractWorkerPool, args...; kwargs...) -> Future
```


[`WorkerPool`](/stdlib/Distributed#Distributed.WorkerPool) variant of `remotecall(f, pid, ....)`. Wait for and take a free worker from `pool` and perform a `remotecall` on it.

**Examples**

```julia
$ julia -p 3

julia> wp = WorkerPool([2, 3]);

julia> A = rand(3000);

julia> f = remotecall(maximum, wp, A)
Future(2, 1, 6, nothing)
```


In this example, the task ran on pid 2, called from pid 1.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L169-L186)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remotecall_wait-Tuple{Any, AbstractWorkerPool, Vararg{Any}}' href='#Distributed.remotecall_wait-Tuple{Any, AbstractWorkerPool, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remotecall_wait</u></b> &mdash; <i>Method</i>.




```julia
remotecall_wait(f, pool::AbstractWorkerPool, args...; kwargs...) -> Future
```


[`WorkerPool`](/stdlib/Distributed#Distributed.WorkerPool) variant of `remotecall_wait(f, pid, ....)`. Wait for and take a free worker from `pool` and perform a `remotecall_wait` on it.

**Examples**

```julia
$ julia -p 3

julia> wp = WorkerPool([2, 3]);

julia> A = rand(3000);

julia> f = remotecall_wait(maximum, wp, A)
Future(3, 1, 9, nothing)

julia> fetch(f)
0.9995177101692958
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L190-L210)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remotecall_fetch-Tuple{Any, AbstractWorkerPool, Vararg{Any}}' href='#Distributed.remotecall_fetch-Tuple{Any, AbstractWorkerPool, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remotecall_fetch</u></b> &mdash; <i>Method</i>.




```julia
remotecall_fetch(f, pool::AbstractWorkerPool, args...; kwargs...) -> result
```


[`WorkerPool`](/stdlib/Distributed#Distributed.WorkerPool) variant of `remotecall_fetch(f, pid, ....)`. Waits for and takes a free worker from `pool` and performs a `remotecall_fetch` on it.

**Examples**

```julia
$ julia -p 3

julia> wp = WorkerPool([2, 3]);

julia> A = rand(3000);

julia> remotecall_fetch(maximum, wp, A)
0.9995177101692958
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L214-L231)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remote_do-Tuple{Any, AbstractWorkerPool, Vararg{Any}}' href='#Distributed.remote_do-Tuple{Any, AbstractWorkerPool, Vararg{Any}}'>#</a>&nbsp;<b><u>Distributed.remote_do</u></b> &mdash; <i>Method</i>.




```julia
remote_do(f, pool::AbstractWorkerPool, args...; kwargs...) -> nothing
```


[`WorkerPool`](/stdlib/Distributed#Distributed.WorkerPool) variant of `remote_do(f, pid, ....)`. Wait for and take a free worker from `pool` and perform a `remote_do` on it.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/workerpool.jl#L234-L239)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.@spawn' href='#Distributed.@spawn'>#</a>&nbsp;<b><u>Distributed.@spawn</u></b> &mdash; <i>Macro</i>.




```julia
@spawn expr
```


Create a closure around an expression and run it on an automatically-chosen process, returning a [`Future`](/stdlib/Future#Future) to the result. This macro is deprecated; `@spawnat :any expr` should be used instead.

**Examples**

```julia
julia> addprocs(3);

julia> f = @spawn myid()
Future(2, 1, 5, nothing)

julia> fetch(f)
2

julia> f = @spawn myid()
Future(3, 1, 7, nothing)

julia> fetch(f)
3
```


::: tip Julia 1.3

As of Julia 1.3 this macro is deprecated. Use `@spawnat :any` instead.

:::


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/macros.jl#L15-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.@spawnat' href='#Distributed.@spawnat'>#</a>&nbsp;<b><u>Distributed.@spawnat</u></b> &mdash; <i>Macro</i>.




```julia
@spawnat p expr
```


Create a closure around an expression and run the closure asynchronously on process `p`. Return a [`Future`](/stdlib/Future#Future) to the result. If `p` is the quoted literal symbol `:any`, then the system will pick a processor to use automatically.

**Examples**

```julia
julia> addprocs(3);

julia> f = @spawnat 2 myid()
Future(2, 1, 3, nothing)

julia> fetch(f)
2

julia> f = @spawnat :any myid()
Future(3, 1, 7, nothing)

julia> fetch(f)
3
```


::: tip Julia 1.3

The `:any` argument is available as of Julia 1.3.

:::


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/macros.jl#L54-L81)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.@fetch' href='#Distributed.@fetch'>#</a>&nbsp;<b><u>Distributed.@fetch</u></b> &mdash; <i>Macro</i>.




```julia
@fetch expr
```


Equivalent to `fetch(@spawnat :any expr)`. See [`fetch`](/base/parallel#Base.fetch-Tuple{Task}) and [`@spawnat`](/stdlib/Distributed#Distributed.@spawnat).

**Examples**

```julia
julia> addprocs(3);

julia> @fetch myid()
2

julia> @fetch myid()
3

julia> @fetch myid()
4

julia> @fetch myid()
2
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/macros.jl#L99-L121)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.@fetchfrom' href='#Distributed.@fetchfrom'>#</a>&nbsp;<b><u>Distributed.@fetchfrom</u></b> &mdash; <i>Macro</i>.




```julia
@fetchfrom
```


Equivalent to `fetch(@spawnat p expr)`. See [`fetch`](/base/parallel#Base.fetch-Tuple{Task}) and [`@spawnat`](/stdlib/Distributed#Distributed.@spawnat).

**Examples**

```julia
julia> addprocs(3);

julia> @fetchfrom 2 myid()
2

julia> @fetchfrom 4 myid()
4
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/macros.jl#L127-L143)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.@distributed' href='#Distributed.@distributed'>#</a>&nbsp;<b><u>Distributed.@distributed</u></b> &mdash; <i>Macro</i>.




```julia
@distributed
```


A distributed memory, parallel for loop of the form :

```
@distributed [reducer] for var = range
    body
end
```


The specified range is partitioned and locally executed across all workers. In case an optional reducer function is specified, `@distributed` performs local reductions on each worker with a final reduction on the calling process.

Note that without a reducer function, `@distributed` executes asynchronously, i.e. it spawns independent tasks on all available workers and returns immediately without waiting for completion. To wait for completion, prefix the call with [`@sync`](/base/parallel#Base.@sync), like :

```
@sync @distributed for var = range
    body
end
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/macros.jl#L309-L329)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.@everywhere' href='#Distributed.@everywhere'>#</a>&nbsp;<b><u>Distributed.@everywhere</u></b> &mdash; <i>Macro</i>.




```julia
@everywhere [procs()] expr
```


Execute an expression under `Main` on all `procs`. Errors on any of the processes are collected into a [`CompositeException`](/base/base#Base.CompositeException) and thrown. For example:

```
@everywhere bar = 1
```


will define `Main.bar` on all current processes. Any processes added later (say with [`addprocs()`](/stdlib/Distributed#Distributed.addprocs)) will not have the expression defined.

Unlike [`@spawnat`](/stdlib/Distributed#Distributed.@spawnat), `@everywhere` does not capture any local variables. Instead, local variables can be broadcast using interpolation:

```
foo = 1
@everywhere bar = $foo
```


The optional argument `procs` allows specifying a subset of all processes to have execute the expression.

Similar to calling `remotecall_eval(Main, procs, expr)`, but with two extra features:

```
- `using` and `import` statements run on the calling process first, to ensure
  packages are precompiled.
- The current source file path used by `include` is propagated to other processes.
```



[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/macros.jl#L165-L191)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.remoteref_id' href='#Distributed.remoteref_id'>#</a>&nbsp;<b><u>Distributed.remoteref_id</u></b> &mdash; <i>Function</i>.




```julia
remoteref_id(r::AbstractRemoteRef) -> RRID
```


`Future`s and `RemoteChannel`s are identified by fields:
- `where` - refers to the node where the underlying object/storage referred to by the reference actually exists.
  
- `whence` - refers to the node the remote reference was created from. Note that this is different from the node where the underlying object referred to actually exists. For example calling `RemoteChannel(2)` from the master process would result in a `where` value of 2 and a `whence` value of 1.
  
- `id` is unique across all references created from the worker specified by `whence`.
  

Taken together,  `whence` and `id` uniquely identify a reference across all workers.

`remoteref_id` is a low-level API which returns a `RRID` object that wraps `whence` and `id` values of a remote reference.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L142-L162)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.channel_from_id' href='#Distributed.channel_from_id'>#</a>&nbsp;<b><u>Distributed.channel_from_id</u></b> &mdash; <i>Function</i>.




```julia
channel_from_id(id) -> c
```


A low-level API which returns the backing `AbstractChannel` for an `id` returned by [`remoteref_id`](/stdlib/Distributed#Distributed.remoteref_id). The call is valid only on the node where the backing channel exists.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/remotecall.jl#L165-L171)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.worker_id_from_socket' href='#Distributed.worker_id_from_socket'>#</a>&nbsp;<b><u>Distributed.worker_id_from_socket</u></b> &mdash; <i>Function</i>.




```julia
worker_id_from_socket(s) -> pid
```


A low-level API which, given a `IO` connection or a `Worker`, returns the `pid` of the worker it is connected to. This is useful when writing custom [`serialize`](/stdlib/Serialization#Serialization.serialize) methods for a type, which optimizes the data written out depending on the receiving process id.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L1108-L1115)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.cluster_cookie-Tuple{}' href='#Distributed.cluster_cookie-Tuple{}'>#</a>&nbsp;<b><u>Distributed.cluster_cookie</u></b> &mdash; <i>Method</i>.




```julia
cluster_cookie() -> cookie
```


Return the cluster cookie.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L752-L756)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.cluster_cookie-Tuple{Any}' href='#Distributed.cluster_cookie-Tuple{Any}'>#</a>&nbsp;<b><u>Distributed.cluster_cookie</u></b> &mdash; <i>Method</i>.




```julia
cluster_cookie(cookie) -> cookie
```


Set the passed cookie as the cluster cookie, then returns it.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L759-L763)

</div>
<br>

## Cluster Manager Interface {#Cluster-Manager-Interface}

This interface provides a mechanism to launch and manage Julia workers on different cluster environments. There are two types of managers present in Base: `LocalManager`, for launching additional workers on the same host, and `SSHManager`, for launching on remote hosts via `ssh`. TCP/IP sockets are used to connect and transport messages between processes. It is possible for Cluster Managers to provide a different transport.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.ClusterManager' href='#Distributed.ClusterManager'>#</a>&nbsp;<b><u>Distributed.ClusterManager</u></b> &mdash; <i>Type</i>.




```julia
ClusterManager
```


Supertype for cluster managers, which control workers processes as a cluster. Cluster managers implement how workers can be added, removed and communicated with. `SSHManager` and `LocalManager` are subtypes of this.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L3-L9)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.WorkerConfig' href='#Distributed.WorkerConfig'>#</a>&nbsp;<b><u>Distributed.WorkerConfig</u></b> &mdash; <i>Type</i>.




```julia
WorkerConfig
```


Type used by [`ClusterManager`](/stdlib/Distributed#Distributed.ClusterManager)s to control workers added to their clusters. Some fields are used by all cluster managers to access a host:
- `io` – the connection used to access the worker (a subtype of `IO` or `Nothing`)
  
- `host` – the host address (either a `String` or `Nothing`)
  
- `port` – the port on the host used to connect to the worker (either an `Int` or `Nothing`)
  

Some are used by the cluster manager to add workers to an already-initialized host:
- `count` – the number of workers to be launched on the host
  
- `exename` – the path to the Julia executable on the host, defaults to `"$(Sys.BINDIR)/julia"` or `"$(Sys.BINDIR)/julia-debug"`
  
- `exeflags` – flags to use when launching Julia remotely
  

The `userdata` field is used to store information for each worker by external managers.

Some fields are used by `SSHManager` and similar managers:
- `tunnel` – `true` (use tunneling), `false` (do not use tunneling), or [`nothing`](/base/constants#Core.nothing) (use default for the manager)
  
- `multiplex` – `true` (use SSH multiplexing for tunneling) or `false`
  
- `forward` – the forwarding option used for `-L` option of ssh
  
- `bind_addr` – the address on the remote host to bind to
  
- `sshflags` – flags to use in establishing the SSH connection
  
- `max_parallel` – the maximum number of workers to connect to in parallel on the host
  

Some fields are used by both `LocalManager`s and `SSHManager`s:
- `connect_at` – determines whether this is a worker-to-worker or driver-to-worker setup call
  
- `process` – the process which will be connected (usually the manager will assign this during [`addprocs`](/stdlib/Distributed#Distributed.addprocs))
  
- `ospid` – the process ID according to the host OS, used to interrupt worker processes
  
- `environ` – private dictionary used to store temporary information by Local/SSH managers
  
- `ident` – worker as identified by the [`ClusterManager`](/stdlib/Distributed#Distributed.ClusterManager)
  
- `connect_idents` – list of worker ids the worker must connect to if using a custom topology
  
- `enable_threaded_blas` – `true`, `false`, or `nothing`, whether to use threaded BLAS or not on the workers
  


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L12-L45)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.launch' href='#Distributed.launch'>#</a>&nbsp;<b><u>Distributed.launch</u></b> &mdash; <i>Function</i>.




```julia
launch(manager::ClusterManager, params::Dict, launched::Array, launch_ntfy::Condition)
```


Implemented by cluster managers. For every Julia worker launched by this function, it should append a `WorkerConfig` entry to `launched` and notify `launch_ntfy`. The function MUST exit once all workers, requested by `manager` have been launched. `params` is a dictionary of all keyword arguments [`addprocs`](/stdlib/Distributed#Distributed.addprocs) was called with.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/managers.jl#L531-L538)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.manage' href='#Distributed.manage'>#</a>&nbsp;<b><u>Distributed.manage</u></b> &mdash; <i>Function</i>.




```julia
manage(manager::ClusterManager, id::Integer, config::WorkerConfig. op::Symbol)
```


Implemented by cluster managers. It is called on the master process, during a worker&#39;s lifetime, with appropriate `op` values:
- with `:register`/`:deregister` when a worker is added / removed from the Julia worker pool.
  
- with `:interrupt` when `interrupt(workers)` is called. The `ClusterManager` should signal the appropriate worker with an interrupt signal.
  
- with `:finalize` for cleanup purposes.
  


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/managers.jl#L541-L551)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.kill-Tuple{ClusterManager, Int64, WorkerConfig}' href='#Base.kill-Tuple{ClusterManager, Int64, WorkerConfig}'>#</a>&nbsp;<b><u>Base.kill</u></b> &mdash; <i>Method</i>.




```julia
kill(manager::ClusterManager, pid::Int, config::WorkerConfig)
```


Implemented by cluster managers. It is called on the master process, by [`rmprocs`](/stdlib/Distributed#Distributed.rmprocs). It should cause the remote worker specified by `pid` to exit. `kill(manager::ClusterManager.....)` executes a remote `exit()` on `pid`.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/managers.jl#L721-L729)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.connect-Tuple{ClusterManager, Int64, WorkerConfig}' href='#Sockets.connect-Tuple{ClusterManager, Int64, WorkerConfig}'>#</a>&nbsp;<b><u>Sockets.connect</u></b> &mdash; <i>Method</i>.




```julia
connect(manager::ClusterManager, pid::Int, config::WorkerConfig) -> (instrm::IO, outstrm::IO)
```


Implemented by cluster managers using custom transports. It should establish a logical connection to worker with id `pid`, specified by `config` and return a pair of `IO` objects. Messages from `pid` to current process will be read off `instrm`, while messages to be sent to `pid` will be written to `outstrm`. The custom transport implementation must ensure that messages are delivered and received completely and in order. `connect(manager::ClusterManager.....)` sets up TCP/IP socket connections in-between workers.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/managers.jl#L561-L571)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.init_worker' href='#Distributed.init_worker'>#</a>&nbsp;<b><u>Distributed.init_worker</u></b> &mdash; <i>Function</i>.




```julia
init_worker(cookie::AbstractString, manager::ClusterManager=DefaultClusterManager())
```


Called by cluster managers implementing custom transports. It initializes a newly launched process as a worker. Command line argument `--worker[=<cookie>]` has the effect of initializing a process as a worker using TCP/IP sockets for transport. `cookie` is a [`cluster_cookie`](/stdlib/Distributed#Distributed.cluster_cookie-Tuple{}).


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L364-L371)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.start_worker' href='#Distributed.start_worker'>#</a>&nbsp;<b><u>Distributed.start_worker</u></b> &mdash; <i>Function</i>.




```julia
start_worker([out::IO=stdout], cookie::AbstractString=readline(stdin); close_stdin::Bool=true, stderr_to_stdout::Bool=true)
```


`start_worker` is an internal function which is the default entry point for worker processes connecting via TCP/IP. It sets up the process as a Julia cluster worker.

host:port information is written to stream `out` (defaults to stdout).

The function reads the cookie from stdin if required, and  listens on a free port (or if specified, the port in the `--bind-to` command line option) and schedules tasks to process incoming TCP connections and requests. It also (optionally) closes stdin and redirects stderr to stdout.

It does not return.


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L215-L230)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.process_messages' href='#Distributed.process_messages'>#</a>&nbsp;<b><u>Distributed.process_messages</u></b> &mdash; <i>Function</i>.




```julia
process_messages(r_stream::IO, w_stream::IO, incoming::Bool=true)
```


Called by cluster managers using custom transports. It should be called when the custom transport implementation receives the first message from a remote worker. The custom transport must manage a logical connection to the remote worker and provide two `IO` objects, one for incoming messages and the other for messages addressed to the remote worker. If `incoming` is `true`, the remote peer initiated the connection. Whichever of the pair initiates the connection sends the cluster cookie and its Julia version number to perform the authentication handshake.

See also [`cluster_cookie`](/stdlib/Distributed#Distributed.cluster_cookie-Tuple{}).


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/process_messages.jl#L136-L149)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Distributed.default_addprocs_params' href='#Distributed.default_addprocs_params'>#</a>&nbsp;<b><u>Distributed.default_addprocs_params</u></b> &mdash; <i>Function</i>.




```julia
default_addprocs_params(mgr::ClusterManager) -> Dict{Symbol, Any}
```


Implemented by cluster managers. The default keyword parameters passed when calling `addprocs(mgr)`. The minimal set of options is available by calling `default_addprocs_params()`


[source](https://github.com/JuliaLang/Distributed.jl/blob/6a07d9853ab7686df7440a47d1b585c6c9f3be35/src/cluster.jl#L526-L532)

</div>
<br>
