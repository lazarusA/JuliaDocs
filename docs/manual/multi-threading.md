
# Multi-Threading {#man-multithreading}

Visit this [blog post](https://julialang.org/blog/2019/07/multithreading/) for a presentation of Julia multi-threading features.

## Starting Julia with multiple threads {#Starting-Julia-with-multiple-threads}

By default, Julia starts up with a single thread of execution. This can be verified by using the command [`Threads.nthreads()`](/base/multi-threading#Base.Threads.nthreads):

```julia
julia> Threads.nthreads()
1
```


The number of execution threads is controlled either by using the `-t`/`--threads` command line argument or by using the [`JULIA_NUM_THREADS`](/manual/environment-variables#JULIA_NUM_THREADS) environment variable. When both are specified, then `-t`/`--threads` takes precedence.

The number of threads can either be specified as an integer (`--threads=4`) or as `auto` (`--threads=auto`), where `auto` tries to infer a useful default number of threads to use (see [Command-line Options](/manual/command-line-interface#command-line-interface) for more details).

::: tip Julia 1.5

The `-t`/`--threads` command line argument requires at least Julia 1.5. In older versions you must use the environment variable instead.

:::

::: tip Julia 1.7

Using `auto` as value of the environment variable [`JULIA_NUM_THREADS`](/manual/environment-variables#JULIA_NUM_THREADS) requires at least Julia 1.7. In older versions, this value is ignored.

:::

Lets start Julia with 4 threads:

```bash
$ julia --threads 4
```


Let&#39;s verify there are 4 threads at our disposal.

```julia
julia> Threads.nthreads()
4
```


But we are currently on the master thread. To check, we use the function [`Threads.threadid`](/base/multi-threading#Base.Threads.threadid)

```julia
julia> Threads.threadid()
1
```


::: tip Note

If you prefer to use the environment variable you can set it as follows in Bash (Linux/macOS):

```bash
export JULIA_NUM_THREADS=4
```


C shell on Linux/macOS, CMD on Windows:

```bash
set JULIA_NUM_THREADS=4
```


Powershell on Windows:

```powershell
$env:JULIA_NUM_THREADS=4
```


Note that this must be done _before_ starting Julia.

:::

::: tip Note

The number of threads specified with `-t`/`--threads` is propagated to worker processes that are spawned using the `-p`/`--procs` or `--machine-file` command line options. For example, `julia -p2 -t2` spawns 1 main process with 2 worker processes, and all three processes have 2 threads enabled. For more fine grained control over worker threads use [`addprocs`](/stdlib/Distributed#Distributed.addprocs) and pass `-t`/`--threads` as `exeflags`.

:::

### Multiple GC Threads {#Multiple-GC-Threads}

The Garbage Collector (GC) can use multiple threads. The amount used is either half the number of compute worker threads or configured by either the `--gcthreads` command line argument or by using the [`JULIA_NUM_GC_THREADS`](/manual/environment-variables#JULIA_NUM_GC_THREADS) environment variable.

::: tip Julia 1.10

The `--gcthreads` command line argument requires at least Julia 1.10.

:::

## Threadpools {#man-threadpools}

When a program&#39;s threads are busy with many tasks to run, tasks may experience delays which may negatively affect the responsiveness and interactivity of the program. To address this, you can specify that a task is interactive when you [`Threads.@spawn`](/base/multi-threading#Base.Threads.@spawn) it:

```julia
using Base.Threads
@spawn :interactive f()
```


Interactive tasks should avoid performing high latency operations, and if they are long duration tasks, should yield frequently.

Julia may be started with one or more threads reserved to run interactive tasks:

```bash
$ julia --threads 3,1
```


The environment variable [`JULIA_NUM_THREADS`](/manual/environment-variables#JULIA_NUM_THREADS) can also be used similarly:

```bash
export JULIA_NUM_THREADS=3,1
```


This starts Julia with 3 threads in the `:default` threadpool and 1 thread in the `:interactive` threadpool:

```julia
julia> using Base.Threads

julia> nthreadpools()
2

julia> threadpool() # the main thread is in the interactive thread pool
:interactive

julia> nthreads(:default)
3

julia> nthreads(:interactive)
1

julia> nthreads()
3
```


::: tip Note

The zero-argument version of `nthreads` returns the number of threads in the default pool.

:::

::: tip Note

Depending on whether Julia has been started with interactive threads, the main thread is either in the default or interactive thread pool.

:::

Either or both numbers can be replaced with the word `auto`, which causes Julia to choose a reasonable default.

## The `@threads` Macro {#The-@threads-Macro}

Let&#39;s work a simple example using our native threads. Let us create an array of zeros:

```julia
julia> a = zeros(10)
10-element Vector{Float64}:
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
 0.0
```


Let us operate on this array simultaneously using 4 threads. We&#39;ll have each thread write its thread ID into each location.

Julia supports parallel loops using the [`Threads.@threads`](/base/multi-threading#Base.Threads.@threads) macro. This macro is affixed in front of a `for` loop to indicate to Julia that the loop is a multi-threaded region:

```julia
julia> Threads.@threads for i = 1:10
           a[i] = Threads.threadid()
       end
```


The iteration space is split among the threads, after which each thread writes its thread ID to its assigned locations:

```julia
julia> a
10-element Vector{Float64}:
 1.0
 1.0
 1.0
 2.0
 2.0
 2.0
 3.0
 3.0
 4.0
 4.0
```


Note that [`Threads.@threads`](/base/multi-threading#Base.Threads.@threads) does not have an optional reduction parameter like [`@distributed`](/stdlib/Distributed#Distributed.@distributed).

### Using `@threads` without data-races {#Using-@threads-without-data-races}

The concept of a data-race is elaborated on in [&quot;Communication and data races between threads&quot;](/manual/multi-threading#man-communication-and-data-races). For now, just known that a data race can result in incorrect results and dangerous errors.

Lets say we want to make the function `sum_single` below multithreaded.

```julia
julia> function sum_single(a)
           s = 0
           for i in a
               s += i
           end
           s
       end
sum_single (generic function with 1 method)

julia> sum_single(1:1_000_000)
500000500000
```


Simply adding `@threads` exposes a data race with multiple threads reading and writing `s` at the same time.

```julia
julia> function sum_multi_bad(a)
           s = 0
           Threads.@threads for i in a
               s += i
           end
           s
       end
sum_multi_bad (generic function with 1 method)

julia> sum_multi_bad(1:1_000_000)
70140554652
```


Note that the result is not `500000500000` as it should be, and will most likely change each evaluation.

To fix this, buffers that are specific to the task may be used to segment the sum into chunks that are race-free. Here `sum_single` is reused, with its own internal buffer `s`. The input vector `a` is split into at most `nthreads()` chunks for parallel work. We then use `Threads.@spawn` to create tasks that individually sum each chunk. Finally, we sum the results from each task using `sum_single` again:

```julia
julia> function sum_multi_good(a)
           chunks = Iterators.partition(a, cld(length(a), Threads.nthreads()))
           tasks = map(chunks) do chunk
               Threads.@spawn sum_single(chunk)
           end
           chunk_sums = fetch.(tasks)
           return sum_single(chunk_sums)
       end
sum_multi_good (generic function with 1 method)

julia> sum_multi_good(1:1_000_000)
500000500000
```


::: tip Note

Buffers should not be managed based on `threadid()` i.e. `buffers = zeros(Threads.nthreads())` because concurrent tasks can yield, meaning multiple concurrent tasks may use the same buffer on a given thread, introducing risk of data races. Further, when more than one thread is available tasks may change thread at yield points, which is known as [task migration](/manual/multi-threading#man-task-migration).

:::

Another option is the use of atomic operations on variables shared across tasks/threads, which may be more performant depending on the characteristics of the operations.

## Communication and data-races between threads {#man-communication-and-data-races}

Although Julia&#39;s threads can communicate through shared memory, it is notoriously difficult to write correct and data-race free multi-threaded code. Julia&#39;s [`Channel`](/base/parallel#Base.Channel)s are thread-safe and may be used to communicate safely. There are also sections below that explain how to use [locks](/manual/multi-threading#man-using-locks) and [atomics](/manual/multi-threading#man-atomic-operations) to avoid data-races.

### Data-race freedom {#Data-race-freedom}

You are entirely responsible for ensuring that your program is data-race free, and nothing promised here can be assumed if you do not observe that requirement. The observed results may be highly unintuitive.

If data-races are introduced, Julia is not memory safe. **Be very careful about reading _any_ data if another thread might write to it, as it could result in segmentation faults or worse**. Below are a couple of unsafe ways to access global variables from different threads:

```julia
Thread 1:
global b = false
global a = rand()
global b = true

Thread 2:
while !b; end
bad_read1(a) # it is NOT safe to access `a` here!

Thread 3:
while !@isdefined(a); end
bad_read2(a) # it is NOT safe to access `a` here
```


### Using locks to avoid data-races {#man-using-locks}

An important tool to avoid data-races, and thereby write thread-safe code, is the concept of a &quot;lock&quot;. A lock can be locked and unlocked. If a thread has locked a lock, and not unlocked it, it is said to &quot;hold&quot; the lock. If there is only one lock, and we write code the requires holding the lock to access some data, we can ensure that multiple threads will never access the same data simultaneously. Note that the link between a lock and a variable is made by the programmer, and not the program.

For example, we can create a lock `my_lock`, and lock it while we mutate a variable `my_variable`. This is done most simply with the `@lock` macro:

```julia
julia> my_lock = ReentrantLock();

julia> my_variable = [1, 2, 3];

julia> @lock my_lock my_variable[1] = 100
100
```


By using a similar pattern with the same lock and variable, but on another thread, the operations are free from data-races.

We could have performed the operation above with the functional version of `lock`, in the following two ways:

```julia
julia> lock(my_lock) do
           my_variable[1] = 100
       end
100

julia> begin
           lock(my_lock)
           try
               my_variable[1] = 100
           finally
               unlock(my_lock)
           end
       end
100
```


All three options are equivalent. Note how the final version requires an explicit `try`-block to ensure that the lock is always unlocked, whereas the first two version do this internally. One should always use the lock pattern above when changing data (such as assigning to a global or closure variable) accessed by other threads. Failing to do this could have unforeseen and serious consequences.

### Atomic Operations {#man-atomic-operations}

Julia supports accessing and modifying values _atomically_, that is, in a thread-safe way to avoid [race conditions](https://en.wikipedia.org/wiki/Race_condition). A value (which must be of a primitive type) can be wrapped as [`Threads.Atomic`](/base/multi-threading#Base.Threads.Atomic) to indicate it must be accessed in this way. Here we can see an example:

```julia
julia> i = Threads.Atomic{Int}(0);

julia> ids = zeros(4);

julia> old_is = zeros(4);

julia> Threads.@threads for id in 1:4
           old_is[id] = Threads.atomic_add!(i, id)
           ids[id] = id
       end

julia> old_is
4-element Vector{Float64}:
 0.0
 1.0
 7.0
 3.0

julia> i[]
 10

julia> ids
4-element Vector{Float64}:
 1.0
 2.0
 3.0
 4.0
```


Had we tried to do the addition without the atomic tag, we might have gotten the wrong answer due to a race condition. An example of what would happen if we didn&#39;t avoid the race:

```julia
julia> using Base.Threads

julia> Threads.nthreads()
4

julia> acc = Ref(0)
Base.RefValue{Int64}(0)

julia> @threads for i in 1:1000
          acc[] += 1
       end

julia> acc[]
926

julia> acc = Atomic{Int64}(0)
Atomic{Int64}(0)

julia> @threads for i in 1:1000
          atomic_add!(acc, 1)
       end

julia> acc[]
1000
```


#### Per-field atomics {#man-atomics}

We can also use atomics on a more granular level using the [`@atomic`](/base/multi-threading#Base.@atomic), [`@atomicswap`](/base/multi-threading#Base.@atomicswap), [`@atomicreplace`](/base/multi-threading#Base.@atomicreplace) macros, and [`@atomiconce`](/base/multi-threading#Base.@atomiconce) macros.

Specific details of the memory model and other details of the design are written in the [Julia Atomics Manifesto](https://gist.github.com/vtjnash/11b0031f2e2a66c9c24d33e810b34ec0), which will later be published formally.

Any field in a struct declaration can be decorated with `@atomic`, and then any write must be marked with `@atomic` also, and must use one of the defined atomic orderings (`:monotonic`, `:acquire`, `:release`, `:acquire_release`, or `:sequentially_consistent`). Any read of an atomic field can also be annotated with an atomic ordering constraint, or will be done with monotonic (relaxed) ordering if unspecified.

::: tip Julia 1.7

Per-field atomics requires at least Julia 1.7.

:::

## Side effects and mutable function arguments {#Side-effects-and-mutable-function-arguments}

When using multi-threading we have to be careful when using functions that are not [pure](https://en.wikipedia.org/wiki/Pure_function) as we might get a wrong answer. For instance functions that have a [name ending with `!`](/manual/style-guide#bang-convention) by convention modify their arguments and thus are not pure.

## @threadcall {#@threadcall}

External libraries, such as those called via [`ccall`](/base/c#ccall), pose a problem for Julia&#39;s task-based I/O mechanism. If a C library performs a blocking operation, that prevents the Julia scheduler from executing any other tasks until the call returns. (Exceptions are calls into custom C code that call back into Julia, which may then yield, or C code that calls `jl_yield()`, the C equivalent of [`yield`](/base/parallel#Base.yield).)

The [`@threadcall`](/manual/multi-threading#@threadcall) macro provides a way to avoid stalling execution in such a scenario. It schedules a C function for execution in a separate thread. A threadpool with a default size of 4 is used for this. The size of the threadpool is controlled via environment variable `UV_THREADPOOL_SIZE`. While waiting for a free thread, and during function execution once a thread is available, the requesting task (on the main Julia event loop) yields to other tasks. Note that `@threadcall` does not return until the execution is complete. From a user point of view, it is therefore a blocking call like other Julia APIs.

It is very important that the called function does not call back into Julia, as it will segfault.

`@threadcall` may be removed/changed in future versions of Julia.

## Caveats {#Caveats}

At this time, most operations in the Julia runtime and standard libraries can be used in a thread-safe manner, if the user code is data-race free. However, in some areas work on stabilizing thread support is ongoing. Multi-threaded programming has many inherent difficulties, and if a program using threads exhibits unusual or undesirable behavior (e.g. crashes or mysterious results), thread interactions should typically be suspected first.

There are a few specific limitations and warnings to be aware of when using threads in Julia:
- Base collection types require manual locking if used simultaneously by multiple threads where at least one thread modifies the collection (common examples include `push!` on arrays, or inserting items into a `Dict`).
  
- The schedule used by [`@spawn`](/base/multi-threading#Base.Threads.@spawn) is nondeterministic and should not be relied on.
  
- Compute-bound, non-memory-allocating tasks can prevent garbage collection from running in other threads that are allocating memory. In these cases it may be necessary to insert a manual call to `GC.safepoint()` to allow GC to run. This limitation will be removed in the future.
  
- Avoid running top-level operations, e.g. `include`, or `eval` of type, method, and module definitions in parallel.
  
- Be aware that finalizers registered by a library may break if threads are enabled. This may require some transitional work across the ecosystem before threading can be widely adopted with confidence. See the section on [the safe use of finalizers](/manual/multi-threading#man-finalizers) for further details.
  

## Task Migration {#man-task-migration}

After a task starts running on a certain thread it may move to a different thread if the task yields.

Such tasks may have been started with [`@spawn`](/base/multi-threading#Base.Threads.@spawn) or [`@threads`](/base/multi-threading#Base.Threads.@threads), although the `:static` schedule option for `@threads` does freeze the threadid.

This means that in most cases [`threadid()`](/base/multi-threading#Base.Threads.threadid) should not be treated as constant within a task, and therefore should not be used to index into a vector of buffers or stateful objects.

::: tip Julia 1.7

Task migration was introduced in Julia 1.7. Before this tasks always remained on the same thread that they were started on.

:::

## Safe use of Finalizers {#man-finalizers}

Because finalizers can interrupt any code, they must be very careful in how they interact with any global state. Unfortunately, the main reason that finalizers are used is to update global state (a pure function is generally rather pointless as a finalizer). This leads us to a bit of a conundrum. There are a few approaches to dealing with this problem:
1. When single-threaded, code could call the internal `jl_gc_enable_finalizers` C function to prevent finalizers from being scheduled inside a critical region. Internally, this is used inside some functions (such as our C locks) to prevent recursion when doing certain operations (incremental package loading, codegen, etc.). The combination of a lock and this flag can be used to make finalizers safe.
  
1. A second strategy, employed by Base in a couple places, is to explicitly delay a finalizer until it may be able to acquire its lock non-recursively. The following example demonstrates how this strategy could be applied to `Distributed.finalize_ref`:
  
  ```julia
  function finalize_ref(r::AbstractRemoteRef)
      if r.where > 0 # Check if the finalizer is already run
          if islocked(client_refs) || !trylock(client_refs)
              # delay finalizer for later if we aren't free to acquire the lock
              finalizer(finalize_ref, r)
              return nothing
          end
          try # `lock` should always be followed by `try`
              if r.where > 0 # Must check again here
                  # Do actual cleanup here
                  r.where = 0
              end
          finally
              unlock(client_refs)
          end
      end
      nothing
  end
  ```
  
  
1. A related third strategy is to use a yield-free queue. We don&#39;t currently have a lock-free queue implemented in Base, but `Base.IntrusiveLinkedListSynchronized{T}` is suitable. This can frequently be a good strategy to use for code with event loops. For example, this strategy is employed by `Gtk.jl` to manage lifetime ref-counting. In this approach, we don&#39;t do any explicit work inside the `finalizer`, and instead add it to a queue to run at a safer time. In fact, Julia&#39;s task scheduler already uses this, so defining the finalizer as `x -> @spawn do_cleanup(x)` is one example of this approach. Note however that this doesn&#39;t control which thread `do_cleanup` runs on, so `do_cleanup` would still need to acquire a lock. That doesn&#39;t need to be true if you implement your own queue, as you can explicitly only drain that queue from your thread.
  
