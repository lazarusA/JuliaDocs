
# Multi-Threading {#lib-multithreading}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.@threads' href='#Base.Threads.@threads'>#</a>&nbsp;<b><u>Base.Threads.@threads</u></b> &mdash; <i>Macro</i>.




```julia
Threads.@threads [schedule] for ... end
```


A macro to execute a `for` loop in parallel. The iteration space is distributed to coarse-grained tasks. This policy can be specified by the `schedule` argument. The execution of the loop waits for the evaluation of all iterations.

See also: [`@spawn`](/base/multi-threading#Base.Threads.@spawn) and `pmap` in [`Distributed`](/stdlib/Distributed#man-distributed).

**Extended help**

**Semantics**

Unless stronger guarantees are specified by the scheduling option, the loop executed by `@threads` macro have the following semantics.

The `@threads` macro executes the loop body in an unspecified order and potentially concurrently. It does not specify the exact assignments of the tasks and the worker threads. The assignments can be different for each execution. The loop body code (including any code transitively called from it) must not make any assumptions about the distribution of iterations to tasks or the worker thread in which they are executed. The loop body for each iteration must be able to make forward progress independent of other iterations and be free from data races. As such, invalid synchronizations across iterations may deadlock while unsynchronized memory accesses may result in undefined behavior.

For example, the above conditions imply that:
- A lock taken in an iteration _must_ be released within the same iteration.
  
- Communicating between iterations using blocking primitives like `Channel`s is incorrect.
  
- Write only to locations not shared across iterations (unless a lock or atomic operation is used).
  
- Unless the `:static` schedule is used, the value of [`threadid()`](/base/multi-threading#Base.Threads.threadid) may change even within a single iteration. See [`Task Migration`](/manual/multi-threading#man-task-migration).
  

**Schedulers**

Without the scheduler argument, the exact scheduling is unspecified and varies across Julia releases. Currently, `:dynamic` is used when the scheduler is not specified.

::: tip Julia 1.5

The `schedule` argument is available as of Julia 1.5.

:::

**`:dynamic` (default)**

`:dynamic` scheduler executes iterations dynamically to available worker threads. Current implementation assumes that the workload for each iteration is uniform. However, this assumption may be removed in the future.

This scheduling option is merely a hint to the underlying execution mechanism. However, a few properties can be expected. The number of `Task`s used by `:dynamic` scheduler is bounded by a small constant multiple of the number of available worker threads ([`Threads.threadpoolsize()`](/base/multi-threading#Base.Threads.threadpoolsize)). Each task processes contiguous regions of the iteration space. Thus, `@threads :dynamic for x in xs; f(x); end` is typically more efficient than `@sync for x in xs; @spawn f(x); end` if `length(xs)` is significantly larger than the number of the worker threads and the run-time of `f(x)` is relatively smaller than the cost of spawning and synchronizing a task (typically less than 10 microseconds).

::: tip Julia 1.8

The `:dynamic` option for the `schedule` argument is available and the default as of Julia 1.8.

:::

**`:greedy`**

`:greedy` scheduler spawns up to [`Threads.threadpoolsize()`](/base/multi-threading#Base.Threads.threadpoolsize) tasks, each greedily working on the given iterated values as they are produced. As soon as one task finishes its work, it takes the next value from the iterator. Work done by any individual task is not necessarily on contiguous values from the iterator. The given iterator may produce values forever, only the iterator interface is required (no indexing).

This scheduling option is generally a good choice if the workload of individual iterations is not uniform/has a large spread.

::: tip Julia 1.11

The `:greedy` option for the `schedule` argument is available as of Julia 1.11.

:::

**`:static`**

`:static` scheduler creates one task per thread and divides the iterations equally among them, assigning each task specifically to each thread. In particular, the value of [`threadid()`](/base/multi-threading#Base.Threads.threadid) is guaranteed to be constant within one iteration. Specifying `:static` is an error if used from inside another `@threads` loop or from a thread other than 1.

::: tip Note

`:static` scheduling exists for supporting transition of code written before Julia 1.3. In newly written library functions, `:static` scheduling is discouraged because the functions using this option cannot be called from arbitrary worker threads.

:::

**Examples**

To illustrate of the different scheduling strategies, consider the following function `busywait` containing a non-yielding timed loop that runs for a given number of seconds.

```julia
julia> function busywait(seconds)
            tstart = time_ns()
            while (time_ns() - tstart) / 1e9 < seconds
            end
        end

julia> @time begin
            Threads.@spawn busywait(5)
            Threads.@threads :static for i in 1:Threads.threadpoolsize()
                busywait(1)
            end
        end
6.003001 seconds (16.33 k allocations: 899.255 KiB, 0.25% compilation time)

julia> @time begin
            Threads.@spawn busywait(5)
            Threads.@threads :dynamic for i in 1:Threads.threadpoolsize()
                busywait(1)
            end
        end
2.012056 seconds (16.05 k allocations: 883.919 KiB, 0.66% compilation time)
```


The `:dynamic` example takes 2 seconds since one of the non-occupied threads is able to run two of the 1-second iterations to complete the for loop.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L260-L380)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.foreach' href='#Base.Threads.foreach'>#</a>&nbsp;<b><u>Base.Threads.foreach</u></b> &mdash; <i>Function</i>.




```julia
Threads.foreach(f, channel::Channel;
                schedule::Threads.AbstractSchedule=Threads.FairSchedule(),
                ntasks=Threads.threadpoolsize())
```


Similar to `foreach(f, channel)`, but iteration over `channel` and calls to `f` are split across `ntasks` tasks spawned by `Threads.@spawn`. This function will wait for all internally spawned tasks to complete before returning.

If `schedule isa FairSchedule`, `Threads.foreach` will attempt to spawn tasks in a manner that enables Julia&#39;s scheduler to more freely load-balance work items across threads. This approach generally has higher per-item overhead, but may perform better than `StaticSchedule` in concurrence with other multithreaded workloads.

If `schedule isa StaticSchedule`, `Threads.foreach` will spawn tasks in a manner that incurs lower per-item overhead than `FairSchedule`, but is less amenable to load-balancing. This approach thus may be more suitable for fine-grained, uniform workloads, but may perform worse than `FairSchedule` in concurrence with other multithreaded workloads.

**Examples**

```julia
julia> n = 20

julia> c = Channel{Int}(ch -> foreach(i -> put!(ch, i), 1:n), 1)

julia> d = Channel{Int}(n) do ch
           f = i -> put!(ch, i^2)
           Threads.foreach(f, c)
       end

julia> collect(d)
collect(d) = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400]
```


::: tip Julia 1.6

This function requires Julia 1.6 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threads_overloads.jl#L3-L40)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.@spawn' href='#Base.Threads.@spawn'>#</a>&nbsp;<b><u>Base.Threads.@spawn</u></b> &mdash; <i>Macro</i>.




```julia
Threads.@spawn [:default|:interactive] expr
```


Create a [`Task`](/base/parallel#Core.Task) and [`schedule`](/base/parallel#Base.schedule) it to run on any available thread in the specified threadpool (`:default` if unspecified). The task is allocated to a thread once one becomes available. To wait for the task to finish, call [`wait`](/base/parallel#Base.wait) on the result of this macro, or call [`fetch`](/base/parallel#Base.fetch-Tuple{Task}) to wait and then obtain its return value.

Values can be interpolated into `@spawn` via `$`, which copies the value directly into the constructed underlying closure. This allows you to insert the _value_ of a variable, isolating the asynchronous code from changes to the variable&#39;s value in the current task.

::: tip Note

The thread that the task runs on may change if the task yields, therefore `threadid()` should not be treated as constant for a task. See [`Task Migration`](/manual/multi-threading#man-task-migration), and the broader [multi-threading](/manual/multi-threading#man-multithreading) manual for further important caveats. See also the chapter on [threadpools](/manual/multi-threading#man-threadpools).

:::

::: tip Julia 1.3

This macro is available as of Julia 1.3.

:::

::: tip Julia 1.4

Interpolating values via `$` is available as of Julia 1.4.

:::

::: tip Julia 1.9

A threadpool may be specified as of Julia 1.9.

:::

**Examples**

```julia
julia> t() = println("Hello from ", Threads.threadid());

julia> tasks = fetch.([Threads.@spawn t() for i in 1:4]);
Hello from 1
Hello from 1
Hello from 3
Hello from 4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L419-L458)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.threadid' href='#Base.Threads.threadid'>#</a>&nbsp;<b><u>Base.Threads.threadid</u></b> &mdash; <i>Function</i>.




```julia
Threads.threadid() -> Int
```


Get the ID number of the current thread of execution. The master thread has ID `1`.

**Examples**

```julia
julia> Threads.threadid()
1

julia> Threads.@threads for i in 1:4
          println(Threads.threadid())
       end
4
2
5
4
```


::: tip Note

The thread that a task runs on may change if the task yields, which is known as [`Task Migration`](/manual/multi-threading#man-task-migration). For this reason in most cases it is not safe to use `threadid()` to index into, say, a vector of buffer or stateful objects.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L6-L30)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.maxthreadid' href='#Base.Threads.maxthreadid'>#</a>&nbsp;<b><u>Base.Threads.maxthreadid</u></b> &mdash; <i>Function</i>.




```julia
Threads.maxthreadid() -> Int
```


Get a lower bound on the number of threads (across all thread pools) available to the Julia process, with atomic-acquire semantics. The result will always be greater than or equal to [`threadid()`](/base/multi-threading#Base.Threads.threadid) as well as `threadid(task)` for any task you were able to observe before calling `maxthreadid`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L34-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.nthreads' href='#Base.Threads.nthreads'>#</a>&nbsp;<b><u>Base.Threads.nthreads</u></b> &mdash; <i>Function</i>.




```julia
Threads.nthreads(:default | :interactive) -> Int
```


Get the current number of threads within the specified thread pool. The threads in `:interactive` have id numbers `1:nthreads(:interactive)`, and the threads in `:default` have id numbers in `nthreads(:interactive) .+ (1:nthreads(:default))`.

See also `BLAS.get_num_threads` and `BLAS.set_num_threads` in the [`LinearAlgebra`](/stdlib/LinearAlgebra#man-linalg) standard library, and `nprocs()` in the [`Distributed`](/stdlib/Distributed#man-distributed) standard library and [`Threads.maxthreadid()`](/base/multi-threading#Base.Threads.maxthreadid).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L44-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.threadpool' href='#Base.Threads.threadpool'>#</a>&nbsp;<b><u>Base.Threads.threadpool</u></b> &mdash; <i>Function</i>.




```julia
Threads.threadpool(tid = threadid()) -> Symbol
```


Returns the specified thread&#39;s threadpool; either `:default`, `:interactive`, or `:foreign`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L86-L90)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.nthreadpools' href='#Base.Threads.nthreadpools'>#</a>&nbsp;<b><u>Base.Threads.nthreadpools</u></b> &mdash; <i>Function</i>.




```julia
Threads.nthreadpools() -> Int
```


Returns the number of threadpools currently configured.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L96-L100)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.threadpoolsize' href='#Base.Threads.threadpoolsize'>#</a>&nbsp;<b><u>Base.Threads.threadpoolsize</u></b> &mdash; <i>Function</i>.




```julia
Threads.threadpoolsize(pool::Symbol = :default) -> Int
```


Get the number of threads available to the default thread pool (or to the specified thread pool).

See also: `BLAS.get_num_threads` and `BLAS.set_num_threads` in the [`LinearAlgebra`](/stdlib/LinearAlgebra#man-linalg) standard library, and `nprocs()` in the [`Distributed`](/stdlib/Distributed#man-distributed) standard library.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L103-L112)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.ngcthreads' href='#Base.Threads.ngcthreads'>#</a>&nbsp;<b><u>Base.Threads.ngcthreads</u></b> &mdash; <i>Function</i>.




```julia
Threads.ngcthreads() -> Int
```


Returns the number of GC threads currently configured. This includes both mark threads and concurrent sweep threads.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadingconstructs.jl#L140-L145)

</div>
<br>

See also [Multi-Threading](/manual/multi-threading#man-multithreading).

## Atomic operations {#Atomic-operations}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='atomic' href='#atomic'>#</a>&nbsp;<b><u>atomic</u></b> &mdash; <i>Keyword</i>.




Unsafe pointer operations are compatible with loading and storing pointers declared with `_Atomic` and `std::atomic` type in C11 and C++23 respectively. An error may be thrown if there is not support for atomically loading the Julia type `T`.

See also: [`unsafe_load`](/base/c#Base.unsafe_load), [`unsafe_modify!`](/base/c#Base.unsafe_modify!), [`unsafe_replace!`](/base/c#Base.unsafe_replace!), [`unsafe_store!`](/base/c#Base.unsafe_store!), [`unsafe_swap!`](/base/c#Base.unsafe_swap!)


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3604-L3610)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@atomic' href='#Base.@atomic'>#</a>&nbsp;<b><u>Base.@atomic</u></b> &mdash; <i>Macro</i>.




```julia
@atomic var
@atomic order ex
```


Mark `var` or `ex` as being performed atomically, if `ex` is a supported expression. If no `order` is specified it defaults to :sequentially_consistent.

```
@atomic a.b.x = new
@atomic a.b.x += addend
@atomic :release a.b.x = new
@atomic :acquire_release a.b.x += addend
```


Perform the store operation expressed on the right atomically and return the new value.

With `=`, this operation translates to a `setproperty!(a.b, :x, new)` call. With any operator also, this operation translates to a `modifyproperty!(a.b, :x, +, addend)[2]` call.

```
@atomic a.b.x max arg2
@atomic a.b.x + arg2
@atomic max(a.b.x, arg2)
@atomic :acquire_release max(a.b.x, arg2)
@atomic :acquire_release a.b.x + arg2
@atomic :acquire_release a.b.x max arg2
```


Perform the binary operation expressed on the right atomically. Store the result into the field in the first argument and return the values `(old, new)`.

This operation translates to a `modifyproperty!(a.b, :x, func, arg2)` call.

See [Per-field atomics](/manual/multi-threading#man-atomics) section in the manual for more details.

**Examples**

```julia
julia> mutable struct Atomic{T}; @atomic x::T; end

julia> a = Atomic(1)
Atomic{Int64}(1)

julia> @atomic a.x # fetch field x of a, with sequential consistency
1

julia> @atomic :sequentially_consistent a.x = 2 # set field x of a, with sequential consistency
2

julia> @atomic a.x += 1 # increment field x of a, with sequential consistency
3

julia> @atomic a.x + 1 # increment field x of a, with sequential consistency
3 => 4

julia> @atomic a.x # fetch field x of a, with sequential consistency
4

julia> @atomic max(a.x, 10) # change field x of a to the max value, with sequential consistency
4 => 10

julia> @atomic a.x max 5 # again change field x of a to the max value, with sequential consistency
10 => 10
```


::: tip Julia 1.7

This functionality requires at least Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L1092-L1157)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@atomicswap' href='#Base.@atomicswap'>#</a>&nbsp;<b><u>Base.@atomicswap</u></b> &mdash; <i>Macro</i>.




```julia
@atomicswap a.b.x = new
@atomicswap :sequentially_consistent a.b.x = new
```


Stores `new` into `a.b.x` and returns the old value of `a.b.x`.

This operation translates to a `swapproperty!(a.b, :x, new)` call.

See [Per-field atomics](/manual/multi-threading#man-atomics) section in the manual for more details.

**Examples**

```julia
julia> mutable struct Atomic{T}; @atomic x::T; end

julia> a = Atomic(1)
Atomic{Int64}(1)

julia> @atomicswap a.x = 2+2 # replace field x of a with 4, with sequential consistency
1

julia> @atomic a.x # fetch field x of a, with sequential consistency
4
```


::: tip Julia 1.7

This functionality requires at least Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L1216-L1242)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@atomicreplace' href='#Base.@atomicreplace'>#</a>&nbsp;<b><u>Base.@atomicreplace</u></b> &mdash; <i>Macro</i>.




```julia
@atomicreplace a.b.x expected => desired
@atomicreplace :sequentially_consistent a.b.x expected => desired
@atomicreplace :sequentially_consistent :monotonic a.b.x expected => desired
```


Perform the conditional replacement expressed by the pair atomically, returning the values `(old, success::Bool)`. Where `success` indicates whether the replacement was completed.

This operation translates to a `replaceproperty!(a.b, :x, expected, desired)` call.

See [Per-field atomics](/manual/multi-threading#man-atomics) section in the manual for more details.

**Examples**

```julia
julia> mutable struct Atomic{T}; @atomic x::T; end

julia> a = Atomic(1)
Atomic{Int64}(1)

julia> @atomicreplace a.x 1 => 2 # replace field x of a with 2 if it was 1, with sequential consistency
(old = 1, success = true)

julia> @atomic a.x # fetch field x of a, with sequential consistency
2

julia> @atomicreplace a.x 1 => 2 # replace field x of a with 2 if it was 1, with sequential consistency
(old = 2, success = false)

julia> xchg = 2 => 0; # replace field x of a with 0 if it was 2, with sequential consistency

julia> @atomicreplace a.x xchg
(old = 2, success = true)

julia> @atomic a.x # fetch field x of a, with sequential consistency
0
```


::: tip Julia 1.7

This functionality requires at least Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L1260-L1300)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@atomiconce' href='#Base.@atomiconce'>#</a>&nbsp;<b><u>Base.@atomiconce</u></b> &mdash; <i>Macro</i>.




```julia
@atomiconce a.b.x = value
@atomiconce :sequentially_consistent a.b.x = value
@atomiconce :sequentially_consistent :monotonic a.b.x = value
```


Perform the conditional assignment of value atomically if it was previously unset, returning the value `success::Bool`. Where `success` indicates whether the assignment was completed.

This operation translates to a `setpropertyonce!(a.b, :x, value)` call.

See [Per-field atomics](/manual/multi-threading#man-atomics) section in the manual for more details.

**Examples**

```julia
julia> mutable struct AtomicOnce
           @atomic x
           AtomicOnce() = new()
       end

julia> a = AtomicOnce()
AtomicOnce(#undef)

julia> @atomiconce a.x = 1 # set field x of a to 1, if unset, with sequential consistency
true

julia> @atomic a.x # fetch field x of a, with sequential consistency
1

julia> @atomiconce a.x = 1 # set field x of a to 1, if unset, with sequential consistency
false
```


::: tip Julia 1.11

This functionality requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L1326-L1361)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.AtomicMemory' href='#Core.AtomicMemory'>#</a>&nbsp;<b><u>Core.AtomicMemory</u></b> &mdash; <i>Type</i>.




```julia
AtomicMemory{T} == GenericMemory{:atomic, T, Core.CPU}
```


One-dimensional dense array with elements of type `T`, where each element is independently atomic when accessed, and cannot be set non-atomically.

::: tip Julia 1.11

This type requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/genericmemory.jl#L25-L33)

</div>
<br>

There are also optional memory ordering parameters for the `unsafe` set of functions, that select the C/C++-compatible versions of these atomic operations, if that parameter is specified to [`unsafe_load`](/base/c#Base.unsafe_load), [`unsafe_store!`](/base/c#Base.unsafe_store!), [`unsafe_swap!`](/base/c#Base.unsafe_swap!), [`unsafe_replace!`](/base/c#Base.unsafe_replace!), and [`unsafe_modify!`](/base/c#Base.unsafe_modify!).

::: warning Warning

The following APIs are deprecated, though support for them is likely to remain for several releases.

:::
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.Atomic' href='#Base.Threads.Atomic'>#</a>&nbsp;<b><u>Base.Threads.Atomic</u></b> &mdash; <i>Type</i>.




```julia
Threads.Atomic{T}
```


Holds a reference to an object of type `T`, ensuring that it is only accessed atomically, i.e. in a thread-safe manner.

Only certain &quot;simple&quot; types can be used atomically, namely the primitive boolean, integer, and float-point types. These are `Bool`, `Int8`...`Int128`, `UInt8`...`UInt128`, and `Float16`...`Float64`.

New atomic objects can be created from a non-atomic values; if none is specified, the atomic object is initialized with zero.

Atomic objects can be accessed using the `[]` notation:

**Examples**

```julia
julia> x = Threads.Atomic{Int}(3)
Base.Threads.Atomic{Int64}(3)

julia> x[] = 1
1

julia> x[]
1
```


Atomic operations use an `atomic_` prefix, such as [`atomic_add!`](/base/multi-threading#Base.Threads.atomic_add!), [`atomic_xchg!`](/base/multi-threading#Base.Threads.atomic_xchg!), etc.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L45-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_cas!' href='#Base.Threads.atomic_cas!'>#</a>&nbsp;<b><u>Base.Threads.atomic_cas!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_cas!(x::Atomic{T}, cmp::T, newval::T) where T
```


Atomically compare-and-set `x`

Atomically compares the value in `x` with `cmp`. If equal, write `newval` to `x`. Otherwise, leaves `x` unmodified. Returns the old value in `x`. By comparing the returned value to `cmp` (via `===`) one knows whether `x` was modified and now holds the new value `newval`.

For further details, see LLVM&#39;s `cmpxchg` instruction.

This function can be used to implement transactional semantics. Before the transaction, one records the value in `x`. After the transaction, the new value is stored only if `x` has not been modified in the mean time.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(3)
Base.Threads.Atomic{Int64}(3)

julia> Threads.atomic_cas!(x, 4, 2);

julia> x
Base.Threads.Atomic{Int64}(3)

julia> Threads.atomic_cas!(x, 3, 2);

julia> x
Base.Threads.Atomic{Int64}(2)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L90-L122)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_xchg!' href='#Base.Threads.atomic_xchg!'>#</a>&nbsp;<b><u>Base.Threads.atomic_xchg!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_xchg!(x::Atomic{T}, newval::T) where T
```


Atomically exchange the value in `x`

Atomically exchanges the value in `x` with `newval`. Returns the **old** value.

For further details, see LLVM&#39;s `atomicrmw xchg` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(3)
Base.Threads.Atomic{Int64}(3)

julia> Threads.atomic_xchg!(x, 2)
3

julia> x[]
2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L125-L146)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_add!' href='#Base.Threads.atomic_add!'>#</a>&nbsp;<b><u>Base.Threads.atomic_add!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_add!(x::Atomic{T}, val::T) where T <: ArithmeticTypes
```


Atomically add `val` to `x`

Performs `x[] += val` atomically. Returns the **old** value. Not defined for `Atomic{Bool}`.

For further details, see LLVM&#39;s `atomicrmw add` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(3)
Base.Threads.Atomic{Int64}(3)

julia> Threads.atomic_add!(x, 2)
3

julia> x[]
5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L149-L170)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_sub!' href='#Base.Threads.atomic_sub!'>#</a>&nbsp;<b><u>Base.Threads.atomic_sub!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_sub!(x::Atomic{T}, val::T) where T <: ArithmeticTypes
```


Atomically subtract `val` from `x`

Performs `x[] -= val` atomically. Returns the **old** value. Not defined for `Atomic{Bool}`.

For further details, see LLVM&#39;s `atomicrmw sub` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(3)
Base.Threads.Atomic{Int64}(3)

julia> Threads.atomic_sub!(x, 2)
3

julia> x[]
1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L173-L194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_and!' href='#Base.Threads.atomic_and!'>#</a>&nbsp;<b><u>Base.Threads.atomic_and!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_and!(x::Atomic{T}, val::T) where T
```


Atomically bitwise-and `x` with `val`

Performs `x[] &= val` atomically. Returns the **old** value.

For further details, see LLVM&#39;s `atomicrmw and` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(3)
Base.Threads.Atomic{Int64}(3)

julia> Threads.atomic_and!(x, 2)
3

julia> x[]
2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L197-L217)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_nand!' href='#Base.Threads.atomic_nand!'>#</a>&nbsp;<b><u>Base.Threads.atomic_nand!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_nand!(x::Atomic{T}, val::T) where T
```


Atomically bitwise-nand (not-and) `x` with `val`

Performs `x[] = ~(x[] & val)` atomically. Returns the **old** value.

For further details, see LLVM&#39;s `atomicrmw nand` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(3)
Base.Threads.Atomic{Int64}(3)

julia> Threads.atomic_nand!(x, 2)
3

julia> x[]
-3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L220-L240)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_or!' href='#Base.Threads.atomic_or!'>#</a>&nbsp;<b><u>Base.Threads.atomic_or!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_or!(x::Atomic{T}, val::T) where T
```


Atomically bitwise-or `x` with `val`

Performs `x[] |= val` atomically. Returns the **old** value.

For further details, see LLVM&#39;s `atomicrmw or` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(5)
Base.Threads.Atomic{Int64}(5)

julia> Threads.atomic_or!(x, 7)
5

julia> x[]
7
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L243-L263)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_xor!' href='#Base.Threads.atomic_xor!'>#</a>&nbsp;<b><u>Base.Threads.atomic_xor!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_xor!(x::Atomic{T}, val::T) where T
```


Atomically bitwise-xor (exclusive-or) `x` with `val`

Performs `x[] $= val` atomically. Returns the **old** value.

For further details, see LLVM&#39;s `atomicrmw xor` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(5)
Base.Threads.Atomic{Int64}(5)

julia> Threads.atomic_xor!(x, 7)
5

julia> x[]
2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L266-L286)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_max!' href='#Base.Threads.atomic_max!'>#</a>&nbsp;<b><u>Base.Threads.atomic_max!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_max!(x::Atomic{T}, val::T) where T
```


Atomically store the maximum of `x` and `val` in `x`

Performs `x[] = max(x[], val)` atomically. Returns the **old** value.

For further details, see LLVM&#39;s `atomicrmw max` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(5)
Base.Threads.Atomic{Int64}(5)

julia> Threads.atomic_max!(x, 7)
5

julia> x[]
7
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L289-L309)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_min!' href='#Base.Threads.atomic_min!'>#</a>&nbsp;<b><u>Base.Threads.atomic_min!</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_min!(x::Atomic{T}, val::T) where T
```


Atomically store the minimum of `x` and `val` in `x`

Performs `x[] = min(x[], val)` atomically. Returns the **old** value.

For further details, see LLVM&#39;s `atomicrmw min` instruction.

**Examples**

```julia
julia> x = Threads.Atomic{Int}(7)
Base.Threads.Atomic{Int64}(7)

julia> Threads.atomic_min!(x, 5)
7

julia> x[]
5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L312-L332)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.atomic_fence' href='#Base.Threads.atomic_fence'>#</a>&nbsp;<b><u>Base.Threads.atomic_fence</u></b> &mdash; <i>Function</i>.




```julia
Threads.atomic_fence()
```


Insert a sequential-consistency memory fence

Inserts a memory fence with sequentially-consistent ordering semantics. There are algorithms where this is needed, i.e. where an acquire/release ordering is insufficient.

This is likely a very expensive operation. Given that all other atomic operations in Julia already have acquire/release semantics, explicit fences should not be necessary in most cases.

For further details, see LLVM&#39;s `fence` instruction.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/atomics.jl#L450-L464)

</div>
<br>

## ccall using a libuv threadpool (Experimental) {#ccall-using-a-libuv-threadpool-(Experimental)}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@threadcall' href='#Base.@threadcall'>#</a>&nbsp;<b><u>Base.@threadcall</u></b> &mdash; <i>Macro</i>.




```julia
@threadcall((cfunc, clib), rettype, (argtypes...), argvals...)
```


The `@threadcall` macro is called in the same way as [`ccall`](/base/c#ccall) but does the work in a different thread. This is useful when you want to call a blocking C function without causing the current `julia` thread to become blocked. Concurrency is limited by size of the libuv thread pool, which defaults to 4 threads but can be increased by setting the `UV_THREADPOOL_SIZE` environment variable and restarting the `julia` process.

Note that the called function should never call back into Julia.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threadcall.jl#L8-L19)

</div>
<br>

## Low-level synchronization primitives {#Low-level-synchronization-primitives}

These building blocks are used to create the regular synchronization objects.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.SpinLock' href='#Base.Threads.SpinLock'>#</a>&nbsp;<b><u>Base.Threads.SpinLock</u></b> &mdash; <i>Type</i>.




```julia
SpinLock()
```


Create a non-reentrant, test-and-test-and-set spin lock. Recursive use will result in a deadlock. This kind of lock should only be used around code that takes little time to execute and does not block (e.g. perform I/O). In general, [`ReentrantLock`](/base/parallel#Base.ReentrantLock) should be used instead.

Each [`lock`](/base/parallel#Base.lock) must be matched with an [`unlock`](/base/parallel#Base.unlock). If [`!islocked(lck::SpinLock)`](/base/parallel#Base.islocked) holds, [`trylock(lck)`](/base/parallel#Base.trylock) succeeds unless there are other tasks attempting to hold the lock &quot;at the same time.&quot;

Test-and-test-and-set spin locks are quickest up to about 30ish contending threads. If you have more contention than that, different synchronization approaches should be considered.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/locks-mt.jl#L14-L30)

</div>
<br>
