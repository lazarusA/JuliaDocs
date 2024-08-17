
# Tasks
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Task' href='#Core.Task'>#</a>&nbsp;<b><u>Core.Task</u></b> &mdash; <i>Type</i>.




```julia
Task(func[, reserved_stack::Int])
```


Create a `Task` (i.e. coroutine) to execute the given function `func` (which must be callable with no arguments). The task exits when this function returns. The task will run in the &quot;world age&quot; from the parent at construction when [`schedule`](/base/parallel#Base.schedule)d.

The optional `reserved_stack` argument specifies the size of the stack available for this task, in bytes. The default, `0`, uses the system-dependent stack size default.

::: warning Warning

By default tasks will have the sticky bit set to true `t.sticky`. This models the historic default for [`@async`](/base/parallel#Base.@async). Sticky tasks can only be run on the worker thread they are first scheduled on, and when scheduled will make the task that they were scheduled from sticky. To obtain the behavior of [`Threads.@spawn`](/base/multi-threading#Base.Threads.@spawn) set the sticky bit manually to `false`.

:::

**Examples**

```julia
julia> a() = sum(i for i in 1:1000);

julia> b = Task(a);
```


In this example, `b` is a runnable `Task` that hasn&#39;t started yet.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/docs/basedocs.jl#L1840-L1865)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@task' href='#Base.@task'>#</a>&nbsp;<b><u>Base.@task</u></b> &mdash; <i>Macro</i>.




```julia
@task
```


Wrap an expression in a [`Task`](/base/parallel#Core.Task) without executing it, and return the [`Task`](/base/parallel#Core.Task). This only creates a task, and does not run it.

::: warning Warning

By default tasks will have the sticky bit set to true `t.sticky`. This models the historic default for [`@async`](/base/parallel#Base.@async). Sticky tasks can only be run on the worker thread they are first scheduled on, and when scheduled will make the task that they were scheduled from sticky. To obtain the behavior of [`Threads.@spawn`](/base/multi-threading#Base.Threads.@spawn) set the sticky bit manually to `false`.

:::

**Examples**

```julia
julia> a1() = sum(i for i in 1:1000);

julia> b = @task a1();

julia> istaskstarted(b)
false

julia> schedule(b);

julia> yield();

julia> istaskdone(b)
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L111-L140)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@async' href='#Base.@async'>#</a>&nbsp;<b><u>Base.@async</u></b> &mdash; <i>Macro</i>.




```julia
@async
```


Wrap an expression in a [`Task`](/base/parallel#Core.Task) and add it to the local machine&#39;s scheduler queue.

Values can be interpolated into `@async` via `$`, which copies the value directly into the constructed underlying closure. This allows you to insert the _value_ of a variable, isolating the asynchronous code from changes to the variable&#39;s value in the current task.

::: warning Warning

It is strongly encouraged to favor `Threads.@spawn` over `@async` always **even when no parallelism is required** especially in publicly distributed libraries.  This is because a use of `@async` disables the migration of the _parent_ task across worker threads in the current implementation of Julia.  Thus, seemingly innocent use of `@async` in a library function can have a large impact on the performance of very different parts of user applications.

:::

::: tip Julia 1.4

Interpolating values via `$` is available as of Julia 1.4.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L659-L678)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.asyncmap' href='#Base.asyncmap'>#</a>&nbsp;<b><u>Base.asyncmap</u></b> &mdash; <i>Function</i>.




```julia
asyncmap(f, c...; ntasks=0, batch_size=nothing)
```


Uses multiple concurrent tasks to map `f` over a collection (or multiple equal length collections). For multiple collection arguments, `f` is applied elementwise.

The output is guaranteed to be the same order as the elements of the collection(s) `c`.

`ntasks` specifies the number of tasks to run concurrently. Depending on the length of the collections, if `ntasks` is unspecified, up to 100 tasks will be used for concurrent mapping.

`ntasks` can also be specified as a zero-arg function. In this case, the number of tasks to run in parallel is checked before processing every element and a new task started if the value of `ntasks_func` is greater than the current number of tasks.

If `batch_size` is specified, the collection is processed in batch mode. `f` must then be a function that must accept a `Vector` of argument tuples and must return a vector of results. The input vector will have a length of `batch_size` or less.

The following examples highlight execution in different tasks by returning the `objectid` of the tasks in which the mapping function is executed.

First, with `ntasks` undefined, each element is processed in a different task.

```
julia> tskoid() = objectid(current_task());

julia> asyncmap(x->tskoid(), 1:5)
5-element Array{UInt64,1}:
 0x6e15e66c75c75853
 0x440f8819a1baa682
 0x9fb3eeadd0c83985
 0xebd3e35fe90d4050
 0x29efc93edce2b961

julia> length(unique(asyncmap(x->tskoid(), 1:5)))
5
```


With `ntasks=2` all elements are processed in 2 tasks.

```
julia> asyncmap(x->tskoid(), 1:5; ntasks=2)
5-element Array{UInt64,1}:
 0x027ab1680df7ae94
 0xa23d2f80cd7cf157
 0x027ab1680df7ae94
 0xa23d2f80cd7cf157
 0x027ab1680df7ae94

julia> length(unique(asyncmap(x->tskoid(), 1:5; ntasks=2)))
2
```


With `batch_size` defined, the mapping function needs to be changed to accept an array of argument tuples and return an array of results. `map` is used in the modified mapping function to achieve this.

```
julia> batch_func(input) = map(x->string("args_tuple: ", x, ", element_val: ", x[1], ", task: ", tskoid()), input)
batch_func (generic function with 1 method)

julia> asyncmap(batch_func, 1:5; ntasks=2, batch_size=2)
5-element Array{String,1}:
 "args_tuple: (1,), element_val: 1, task: 9118321258196414413"
 "args_tuple: (2,), element_val: 2, task: 4904288162898683522"
 "args_tuple: (3,), element_val: 3, task: 9118321258196414413"
 "args_tuple: (4,), element_val: 4, task: 4904288162898683522"
 "args_tuple: (5,), element_val: 5, task: 9118321258196414413"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/asyncmap.jl#L5-L75)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.asyncmap!' href='#Base.asyncmap!'>#</a>&nbsp;<b><u>Base.asyncmap!</u></b> &mdash; <i>Function</i>.




```julia
asyncmap!(f, results, c...; ntasks=0, batch_size=nothing)
```


Like [`asyncmap`](/base/parallel#Base.asyncmap), but stores output in `results` rather than returning a collection.

::: warning Warning

Behavior can be unexpected when any mutated argument shares memory with any other argument.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/asyncmap.jl#L394-L401)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.current_task' href='#Base.current_task'>#</a>&nbsp;<b><u>Base.current_task</u></b> &mdash; <i>Function</i>.




```julia
current_task()
```


Get the currently running [`Task`](/base/parallel#Core.Task).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L146-L150)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.istaskdone' href='#Base.istaskdone'>#</a>&nbsp;<b><u>Base.istaskdone</u></b> &mdash; <i>Function</i>.




```julia
istaskdone(t::Task) -> Bool
```


Determine whether a task has exited.

**Examples**

```julia
julia> a2() = sum(i for i in 1:1000);

julia> b = Task(a2);

julia> istaskdone(b)
false

julia> schedule(b);

julia> yield();

julia> istaskdone(b)
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L204-L225)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.istaskstarted' href='#Base.istaskstarted'>#</a>&nbsp;<b><u>Base.istaskstarted</u></b> &mdash; <i>Function</i>.




```julia
istaskstarted(t::Task) -> Bool
```


Determine whether a task has started executing.

**Examples**

```julia
julia> a3() = sum(i for i in 1:1000);

julia> b = Task(a3);

julia> istaskstarted(b)
false
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L228-L242)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.istaskfailed' href='#Base.istaskfailed'>#</a>&nbsp;<b><u>Base.istaskfailed</u></b> &mdash; <i>Function</i>.




```julia
istaskfailed(t::Task) -> Bool
```


Determine whether a task has exited because an exception was thrown.

**Examples**

```julia
julia> a4() = error("task failed");

julia> b = Task(a4);

julia> istaskfailed(b)
false

julia> schedule(b);

julia> yield();

julia> istaskfailed(b)
true
```


::: tip Julia 1.3

This function requires at least Julia 1.3.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L245-L269)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.task_local_storage-Tuple{Any}' href='#Base.task_local_storage-Tuple{Any}'>#</a>&nbsp;<b><u>Base.task_local_storage</u></b> &mdash; <i>Method</i>.




```julia
task_local_storage(key)
```


Look up the value of a key in the current task&#39;s task-local storage.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L288-L292)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.task_local_storage-Tuple{Any, Any}' href='#Base.task_local_storage-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.task_local_storage</u></b> &mdash; <i>Method</i>.




```julia
task_local_storage(key, value)
```


Assign a value to a key in the current task&#39;s task-local storage.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L295-L299)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.task_local_storage-Tuple{Function, Any, Any}' href='#Base.task_local_storage-Tuple{Function, Any, Any}'>#</a>&nbsp;<b><u>Base.task_local_storage</u></b> &mdash; <i>Method</i>.




```julia
task_local_storage(body, key, value)
```


Call the function `body` with a modified task-local storage, in which `value` is assigned to `key`; the previous value of `key`, or lack thereof, is restored afterwards. Useful for emulating dynamic scoping.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L302-L308)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.ConcurrencyViolationError' href='#Core.ConcurrencyViolationError'>#</a>&nbsp;<b><u>Core.ConcurrencyViolationError</u></b> &mdash; <i>Type</i>.




```julia
ConcurrencyViolationError(msg) <: Exception
```


An error thrown when a detectable violation of concurrent semantics has occurred.

A non-exhaustive list of examples of when this is used include:
- Throwing when a deadlock has been detected (e.g. `wait(current_task())`)
  
- Known-unsafe behavior is attempted (e.g. `yield(current_task)`)
  
- A known non-threadsafe datastructure is attempted to be modified from multiple concurrent tasks
  
- A lock is being unlocked that wasn&#39;t locked by this task
  


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/docs/basedocs.jl#L3805-L3816)

</div>
<br>

## Scheduling
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.yield' href='#Base.yield'>#</a>&nbsp;<b><u>Base.yield</u></b> &mdash; <i>Function</i>.




```julia
yield()
```


Switch to the scheduler to allow another scheduled task to run. A task that calls this function is still runnable, and will be restarted immediately if there are no other runnable tasks.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L1050-L1056)



```julia
yield(t::Task, arg = nothing)
```


A fast, unfair-scheduling version of `schedule(t, arg); yield()` which immediately yields to `t` before calling the scheduler.

Throws a `ConcurrencyViolationError` if `t` is the currently running task.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L1070-L1077)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.yieldto' href='#Base.yieldto'>#</a>&nbsp;<b><u>Base.yieldto</u></b> &mdash; <i>Function</i>.




```julia
yieldto(t::Task, arg = nothing)
```


Switch to the given task. The first time a task is switched to, the task&#39;s function is called with no arguments. On subsequent switches, `arg` is returned from the task&#39;s last call to `yieldto`. This is a low-level call that only switches tasks, not considering states or scheduling in any way. Its use is discouraged.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L1088-L1095)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sleep' href='#Base.sleep'>#</a>&nbsp;<b><u>Base.sleep</u></b> &mdash; <i>Function</i>.




```julia
sleep(seconds)
```


Block the current task for a specified number of seconds. The minimum sleep time is 1 millisecond or input of `0.001`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/asyncevent.jl#L264-L269)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.schedule' href='#Base.schedule'>#</a>&nbsp;<b><u>Base.schedule</u></b> &mdash; <i>Function</i>.




```julia
schedule(t::Task, [val]; error=false)
```


Add a [`Task`](/base/parallel#Core.Task) to the scheduler&#39;s queue. This causes the task to run constantly when the system is otherwise idle, unless the task performs a blocking operation such as [`wait`](/base/parallel#Base.wait).

If a second argument `val` is provided, it will be passed to the task (via the return value of [`yieldto`](/base/parallel#Base.yieldto)) when it runs again. If `error` is `true`, the value is raised as an exception in the woken task.

::: warning Warning

It is incorrect to use `schedule` on an arbitrary `Task` that has already been started. See [the API reference](/base/parallel#low-level-schedule-wait) for more information.

:::

::: warning Warning

By default tasks will have the sticky bit set to true `t.sticky`. This models the historic default for [`@async`](/base/parallel#Base.@async). Sticky tasks can only be run on the worker thread they are first scheduled on, and when scheduled will make the task that they were scheduled from sticky. To obtain the behavior of [`Threads.@spawn`](/base/multi-threading#Base.Threads.@spawn) set the sticky bit manually to `false`.

:::

**Examples**

```julia
julia> a5() = sum(i for i in 1:1000);

julia> b = Task(a5);

julia> istaskstarted(b)
false

julia> schedule(b);

julia> yield();

julia> istaskstarted(b)
true

julia> istaskdone(b)
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L994-L1034)

</div>
<br>

## Synchronization {#lib-task-sync}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.errormonitor' href='#Base.errormonitor'>#</a>&nbsp;<b><u>Base.errormonitor</u></b> &mdash; <i>Function</i>.




```julia
errormonitor(t::Task)
```


Print an error log to `stderr` if task `t` fails.

**Examples**

```julia
julia> wait(errormonitor(Threads.@spawn error("task failed")); throw = false)
Unhandled Task ERROR: task failed
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L731-L743)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@sync' href='#Base.@sync'>#</a>&nbsp;<b><u>Base.@sync</u></b> &mdash; <i>Macro</i>.




```julia
@sync
```


Wait until all lexically-enclosed uses of [`@async`](/base/parallel#Base.@async), [`@spawn`](/base/multi-threading#Base.Threads.@spawn), `Distributed.@spawnat` and `Distributed.@distributed` are complete. All exceptions thrown by enclosed async operations are collected and thrown as a [`CompositeException`](/base/base#Base.CompositeException).

**Examples**

```julia
julia> Threads.nthreads()
4

julia> @sync begin
           Threads.@spawn println("Thread-id $(Threads.threadid()), task 1")
           Threads.@spawn println("Thread-id $(Threads.threadid()), task 2")
       end;
Thread-id 3, task 1
Thread-id 1, task 2
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L625-L645)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.wait' href='#Base.wait'>#</a>&nbsp;<b><u>Base.wait</u></b> &mdash; <i>Function</i>.




```julia
wait([x])
```


Block the current task until some event occurs.
- [`Channel`](/base/parallel#Base.Channel): Wait for a value to be appended to the channel.
  
- [`Condition`](/base/parallel#Base.Condition): Wait for [`notify`](/base/parallel#Base.notify) on a condition and return the `val` parameter passed to `notify`. See the `Condition`-specific docstring of `wait` for the exact behavior.
  
- `Process`: Wait for a process or process chain to exit. The `exitcode` field of a process can be used to determine success or failure.
  
- [`Task`](/base/parallel#Core.Task): Wait for a `Task` to finish. See the `Task`-specific docstring of `wait` for the exact behavior.
  
- [`RawFD`](/base/file#Base.Libc.RawFD): Wait for changes on a file descriptor (see the `FileWatching` package).
  

If no argument is passed, the task blocks for an undefined period. A task can only be restarted by an explicit call to [`schedule`](/base/parallel#Base.schedule) or [`yieldto`](/base/parallel#Base.yieldto).

Often `wait` is called within a `while` loop to ensure a waited-for condition is met before proceeding.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/condition.jl#L103-L123)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.waitany' href='#Base.waitany'>#</a>&nbsp;<b><u>Base.waitany</u></b> &mdash; <i>Function</i>.




```julia
waitany(tasks; throw=true) -> (done_tasks, remaining_tasks)
```


Wait until at least one of the given tasks have been completed.

If `throw` is `true`, throw `CompositeException` when one of the completed tasks completes with an exception.

The return value consists of two task vectors. The first one consists of completed tasks, and the other consists of uncompleted tasks.

::: warning Warning

This may scale poorly compared to writing code that uses multiple individual tasks that each runs serially, since this needs to scan the list of `tasks` each time and synchronize with each one every time this is called. Or consider using [`waitall(tasks; failfast=true)`](/base/parallel#Base.waitall) instead.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L387-L403)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.waitall' href='#Base.waitall'>#</a>&nbsp;<b><u>Base.waitall</u></b> &mdash; <i>Function</i>.




```julia
waitall(tasks; failfast=true, throw=true) -> (done_tasks, remaining_tasks)
```


Wait until all the given tasks have been completed.

If `failfast` is `true`, the function will return when at least one of the given tasks is finished by exception. If `throw` is `true`, throw `CompositeException` when one of the completed tasks has failed.

`failfast` and `throw` keyword arguments work independently; when only `throw=true` is specified, this function waits for all the tasks to complete.

The return value consists of two task vectors. The first one consists of completed tasks, and the other consists of uncompleted tasks.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L406-L420)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fetch-Tuple{Task}' href='#Base.fetch-Tuple{Task}'>#</a>&nbsp;<b><u>Base.fetch</u></b> &mdash; <i>Method</i>.




```julia
fetch(t::Task)
```


Wait for a [`Task`](/base/parallel#Core.Task) to finish, then return its result value. If the task fails with an exception, a [`TaskFailedException`](/base/base#Base.TaskFailedException) (which wraps the failed task) is thrown.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L534-L540)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fetch-Tuple{Any}' href='#Base.fetch-Tuple{Any}'>#</a>&nbsp;<b><u>Base.fetch</u></b> &mdash; <i>Method</i>.




```julia
fetch(x::Any)
```


Return `x`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/task.jl#L527-L531)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.timedwait' href='#Base.timedwait'>#</a>&nbsp;<b><u>Base.timedwait</u></b> &mdash; <i>Function</i>.




```julia
timedwait(testcb, timeout::Real; pollint::Real=0.1)
```


Wait until `testcb()` returns `true` or `timeout` seconds have passed, whichever is earlier. The test function is polled every `pollint` seconds. The minimum value for `pollint` is 0.001 seconds, that is, 1 millisecond.

Return `:ok` or `:timed_out`.

**Examples**

```julia
julia> cb() = (sleep(5); return);

julia> t = @async cb();

julia> timedwait(()->istaskdone(t), 1)
:timed_out

julia> timedwait(()->istaskdone(t), 6.5)
:ok
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/asyncevent.jl#L334-L355)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Condition' href='#Base.Condition'>#</a>&nbsp;<b><u>Base.Condition</u></b> &mdash; <i>Type</i>.




```julia
Condition()
```


Create an edge-triggered event source that tasks can wait for. Tasks that call [`wait`](/base/parallel#Base.wait) on a `Condition` are suspended and queued. Tasks are woken up when [`notify`](/base/parallel#Base.notify) is later called on the `Condition`. Waiting on a condition can return a value or raise an error if the optional arguments of [`notify`](/base/parallel#Base.notify) are used. Edge triggering means that only tasks waiting at the time [`notify`](/base/parallel#Base.notify) is called can be woken up. For level-triggered notifications, you must keep extra state to keep track of whether a notification has happened. The [`Channel`](/base/parallel#Base.Channel) and [`Threads.Event`](/base/parallel#Base.Event) types do this, and can be used for level-triggered events.

This object is NOT thread-safe. See [`Threads.Condition`](/base/parallel#Base.Threads.Condition) for a thread-safe version.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/condition.jl#L182-L194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads.Condition' href='#Base.Threads.Condition'>#</a>&nbsp;<b><u>Base.Threads.Condition</u></b> &mdash; <i>Type</i>.




```julia
Threads.Condition([lock])
```


A thread-safe version of [`Base.Condition`](/base/parallel#Base.Condition).

To call [`wait`](/base/parallel#Base.wait) or [`notify`](/base/parallel#Base.notify) on a `Threads.Condition`, you must first call [`lock`](/base/parallel#Base.lock) on it. When `wait` is called, the lock is atomically released during blocking, and will be reacquired before `wait` returns. Therefore idiomatic use of a `Threads.Condition` `c` looks like the following:

```
lock(c)
try
    while !thing_we_are_waiting_for
        wait(c)
    end
finally
    unlock(c)
end
```


::: tip Julia 1.2

This functionality requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L355-L378)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Event' href='#Base.Event'>#</a>&nbsp;<b><u>Base.Event</u></b> &mdash; <i>Type</i>.




```julia
Event([autoreset=false])
```


Create a level-triggered event source. Tasks that call [`wait`](/base/parallel#Base.wait) on an `Event` are suspended and queued until [`notify`](/base/parallel#Base.notify) is called on the `Event`. After `notify` is called, the `Event` remains in a signaled state and tasks will no longer block when waiting for it, until `reset` is called.

If `autoreset` is true, at most one task will be released from `wait` for each call to `notify`.

This provides an acquire &amp; release memory ordering on notify/wait.

::: tip Julia 1.1

This functionality requires at least Julia 1.1.

:::

::: tip Julia 1.8

The `autoreset` functionality and memory ordering guarantee requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L481-L499)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.notify' href='#Base.notify'>#</a>&nbsp;<b><u>Base.notify</u></b> &mdash; <i>Function</i>.




```julia
notify(condition, val=nothing; all=true, error=false)
```


Wake up tasks waiting for a condition, passing them `val`. If `all` is `true` (the default), all waiting tasks are woken, otherwise only one is. If `error` is `true`, the passed value is raised as an exception in the woken tasks.

Return the count of tasks woken up. Return 0 if no tasks are waiting on `condition`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/condition.jl#L148-L156)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.reset-Tuple{Base.Event}' href='#Base.reset-Tuple{Base.Event}'>#</a>&nbsp;<b><u>Base.reset</u></b> &mdash; <i>Method</i>.




```julia
reset(::Event)
```


Reset an [`Event`](/base/parallel#Base.Event) back into an un-set state. Then any future calls to `wait` will block until [`notify`](/base/parallel#Base.notify) is called again.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L544-L549)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Semaphore' href='#Base.Semaphore'>#</a>&nbsp;<b><u>Base.Semaphore</u></b> &mdash; <i>Type</i>.




```julia
Semaphore(sem_size)
```


Create a counting semaphore that allows at most `sem_size` acquires to be in use at any time. Each acquire must be matched with a release.

This provides a acquire &amp; release memory ordering on acquire/release calls.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L393-L401)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.acquire' href='#Base.acquire'>#</a>&nbsp;<b><u>Base.acquire</u></b> &mdash; <i>Function</i>.




```julia
acquire(s::Semaphore)
```


Wait for one of the `sem_size` permits to be available, blocking until one can be acquired.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L409-L414)



```julia
acquire(f, s::Semaphore)
```


Execute `f` after acquiring from Semaphore `s`, and `release` on completion or error.

For example, a do-block form that ensures only 2 calls of `foo` will be active at the same time:

```julia
s = Base.Semaphore(2)
@sync for _ in 1:100
    Threads.@spawn begin
        Base.acquire(s) do
            foo()
        end
    end
end
```


::: tip Julia 1.8

This method requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L428-L451)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.release' href='#Base.release'>#</a>&nbsp;<b><u>Base.release</u></b> &mdash; <i>Function</i>.




```julia
release(s::Semaphore)
```


Return one permit to the pool, possibly allowing another task to acquire it and resume execution.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L461-L467)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractLock' href='#Base.AbstractLock'>#</a>&nbsp;<b><u>Base.AbstractLock</u></b> &mdash; <i>Type</i>.




```julia
AbstractLock
```


Abstract supertype describing types that implement the synchronization primitives: [`lock`](/base/parallel#Base.lock), [`trylock`](/base/parallel#Base.trylock), [`unlock`](/base/parallel#Base.unlock), and [`islocked`](/base/parallel#Base.islocked).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/condition.jl#L11-L17)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.lock' href='#Base.lock'>#</a>&nbsp;<b><u>Base.lock</u></b> &mdash; <i>Function</i>.




```julia
lock(lock)
```


Acquire the `lock` when it becomes available. If the lock is already locked by a different task/thread, wait for it to become available.

Each `lock` must be matched by an [`unlock`](/base/parallel#Base.unlock).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L137-L145)



```julia
lock(f::Function, lock)
```


Acquire the `lock`, execute `f` with the `lock` held, and release the `lock` when `f` returns. If the lock is already locked by a different task/thread, wait for it to become available.

When this function returns, the `lock` has been released, so the caller should not attempt to `unlock` it.

See also: [`@lock`](/base/parallel#Base.@lock).

::: tip Julia 1.7

Using a [`Channel`](/base/parallel#Base.Channel) as the second argument requires Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L214-L228)



lock(f::Function, l::Lockable)

Acquire the lock associated with `l`, execute `f` with the lock held, and release the lock when `f` returns. `f` will receive one positional argument: the value wrapped by `l`. If the lock is already locked by a different task/thread, wait for it to become available. When this function returns, the `lock` has been released, so the caller should not attempt to `unlock` it.

::: tip Julia 1.11

Requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L330-L342)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.unlock' href='#Base.unlock'>#</a>&nbsp;<b><u>Base.unlock</u></b> &mdash; <i>Function</i>.




```julia
unlock(lock)
```


Releases ownership of the `lock`.

If this is a recursive lock which has been acquired before, decrement an internal counter and return immediately.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L167-L174)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.trylock' href='#Base.trylock'>#</a>&nbsp;<b><u>Base.trylock</u></b> &mdash; <i>Function</i>.




```julia
trylock(lock) -> Success (Boolean)
```


Acquire the lock if it is available, and return `true` if successful. If the lock is already locked by a different task/thread, return `false`.

Each successful `trylock` must be matched by an [`unlock`](/base/parallel#Base.unlock).

Function `trylock` combined with [`islocked`](/base/parallel#Base.islocked) can be used for writing the test-and-test-and-set or exponential backoff algorithms _if it is supported by the `typeof(lock)`_ (read its documentation).


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L97-L110)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.islocked' href='#Base.islocked'>#</a>&nbsp;<b><u>Base.islocked</u></b> &mdash; <i>Function</i>.




```julia
islocked(lock) -> Status (Boolean)
```


Check whether the `lock` is held by any task/thread. This function alone should not be used for synchronization. However, `islocked` combined with [`trylock`](/base/parallel#Base.trylock) can be used for writing the test-and-test-and-set or exponential backoff algorithms _if it is supported by the `typeof(lock)`_ (read its documentation).

**Extended help**

For example, an exponential backoff can be implemented as follows if the `lock` implementation satisfied the properties documented below.

```julia
nspins = 0
while true
    while islocked(lock)
        GC.safepoint()
        nspins += 1
        nspins > LIMIT && error("timeout")
    end
    trylock(lock) && break
    backoff()
end
```


**Implementation**

A lock implementation is advised to define `islocked` with the following properties and note it in its docstring.
- `islocked(lock)` is data-race-free.
  
- If `islocked(lock)` returns `false`, an immediate invocation of `trylock(lock)` must succeed (returns `true`) if there is no interference from other tasks.
  


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L54-L88)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ReentrantLock' href='#Base.ReentrantLock'>#</a>&nbsp;<b><u>Base.ReentrantLock</u></b> &mdash; <i>Type</i>.




```julia
ReentrantLock()
```


Creates a re-entrant lock for synchronizing [`Task`](/base/parallel#Core.Task)s. The same task can acquire the lock as many times as required (this is what the &quot;Reentrant&quot; part of the name means). Each [`lock`](/base/parallel#Base.lock) must be matched with an [`unlock`](/base/parallel#Base.unlock).

Calling `lock` will also inhibit running of finalizers on that thread until the corresponding `unlock`. Use of the standard lock pattern illustrated below should naturally be supported, but beware of inverting the try/lock order or missing the try block entirely (e.g. attempting to return with the lock still held):

This provides a acquire/release memory ordering on lock/unlock calls.

```
lock(l)
try
    <atomic work>
finally
    unlock(l)
end
```


If [`!islocked(lck::ReentrantLock)`](/base/parallel#Base.islocked) holds, [`trylock(lck)`](/base/parallel#Base.trylock) succeeds unless there are other tasks attempting to hold the lock &quot;at the same time.&quot;


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L6-L32)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@lock' href='#Base.@lock'>#</a>&nbsp;<b><u>Base.@lock</u></b> &mdash; <i>Macro</i>.




```julia
@lock l expr
```


Macro version of `lock(f, l::AbstractLock)` but with `expr` instead of `f` function. Expands to:

```julia
lock(l)
try
    expr
finally
    unlock(l)
end
```


This is similar to using [`lock`](/base/parallel#Base.lock) with a `do` block, but avoids creating a closure and thus can improve the performance.

::: tip Compat

`@lock` was added in Julia 1.3, and exported in Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L249-L267)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Lockable' href='#Base.Lockable'>#</a>&nbsp;<b><u>Base.Lockable</u></b> &mdash; <i>Type</i>.




Lockable(value, lock = ReentrantLock())

Creates a `Lockable` object that wraps `value` and associates it with the provided `lock`. This object supports [`@lock`](/base/parallel#Base.@lock), [`lock`](/base/parallel#Base.lock), [`trylock`](/base/parallel#Base.trylock), [`unlock`](/base/parallel#Base.unlock). To access the value, index the lockable object while holding the lock.

::: tip Julia 1.11

Requires at least Julia 1.11.

:::

**Example**

```julia
julia> locked_list = Base.Lockable(Int[]);

julia> @lock(locked_list, push!(locked_list[], 1)) # must hold the lock to access the value
1-element Vector{Int64}:
 1

julia> lock(summary, locked_list)
"1-element Vector{Int64}"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/lock.jl#L297-L321)

</div>
<br>

## Channels
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AbstractChannel' href='#Base.AbstractChannel'>#</a>&nbsp;<b><u>Base.AbstractChannel</u></b> &mdash; <i>Type</i>.




```julia
AbstractChannel{T}
```


Representation of a channel passing objects of type `T`.


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L3-L7)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Channel' href='#Base.Channel'>#</a>&nbsp;<b><u>Base.Channel</u></b> &mdash; <i>Type</i>.




```julia
Channel{T=Any}(size::Int=0)
```


Constructs a `Channel` with an internal buffer that can hold a maximum of `size` objects of type `T`. [`put!`](/base/parallel#Base.put!-Tuple{Channel,%20Any}) calls on a full channel block until an object is removed with [`take!`](/base/io-network#Base.take!-Tuple{Base.GenericIOBuffer}).

`Channel(0)` constructs an unbuffered channel. `put!` blocks until a matching `take!` is called. And vice-versa.

Other constructors:
- `Channel()`: default constructor, equivalent to `Channel{Any}(0)`
  
- `Channel(Inf)`: equivalent to `Channel{Any}(typemax(Int))`
  
- `Channel(sz)`: equivalent to `Channel{Any}(sz)`
  

::: tip Julia 1.3

The default constructor `Channel()` and default `size=0` were added in Julia 1.3.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L13-L31)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Channel-Tuple{Function}' href='#Base.Channel-Tuple{Function}'>#</a>&nbsp;<b><u>Base.Channel</u></b> &mdash; <i>Method</i>.




```julia
Channel{T=Any}(func::Function, size=0; taskref=nothing, spawn=false, threadpool=nothing)
```


Create a new task from `func`, bind it to a new channel of type `T` and size `size`, and schedule the task, all in a single call. The channel is automatically closed when the task terminates.

`func` must accept the bound channel as its only argument.

If you need a reference to the created task, pass a `Ref{Task}` object via the keyword argument `taskref`.

If `spawn=true`, the `Task` created for `func` may be scheduled on another thread in parallel, equivalent to creating a task via [`Threads.@spawn`](/base/multi-threading#Base.Threads.@spawn).

If `spawn=true` and the `threadpool` argument is not set, it defaults to `:default`.

If the `threadpool` argument is set (to `:default` or `:interactive`), this implies that `spawn=true` and the new Task is spawned to the specified threadpool.

Return a `Channel`.

**Examples**

```julia
julia> chnl = Channel() do ch
           foreach(i -> put!(ch, i), 1:4)
       end;

julia> typeof(chnl)
Channel{Any}

julia> for i in chnl
           @show i
       end;
i = 1
i = 2
i = 3
i = 4
```


Referencing the created task:

```julia
julia> taskref = Ref{Task}();

julia> chnl = Channel(taskref=taskref) do ch
           println(take!(ch))
       end;

julia> istaskdone(taskref[])
false

julia> put!(chnl, "Hello");
Hello

julia> istaskdone(taskref[])
true
```


::: tip Julia 1.3

The `spawn=` parameter was added in Julia 1.3. This constructor was added in Julia 1.3. In earlier versions of Julia, Channel used keyword arguments to set `size` and `T`, but those constructors are deprecated.

:::

::: tip Julia 1.9

The `threadpool=` argument was added in Julia 1.9.

:::

```julia
julia> chnl = Channel{Char}(1, spawn=true) do ch
           for c in "hello world"
               put!(ch, c)
           end
       end
Channel{Char}(1) (2 items available)

julia> String(collect(chnl))
"hello world"
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L61-L139)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.put!-Tuple{Channel, Any}' href='#Base.put!-Tuple{Channel, Any}'>#</a>&nbsp;<b><u>Base.put!</u></b> &mdash; <i>Method</i>.




```julia
put!(c::Channel, v)
```


Append an item `v` to the channel `c`. Blocks if the channel is full.

For unbuffered channels, blocks until a [`take!`](/base/io-network#Base.take!-Tuple{Base.GenericIOBuffer}) is performed by a different task.

::: tip Julia 1.1

`v` now gets converted to the channel&#39;s type with [`convert`](/base/base#Base.convert) as `put!` is called.

:::


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L344-L354)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.take!-Tuple{Channel}' href='#Base.take!-Tuple{Channel}'>#</a>&nbsp;<b><u>Base.take!</u></b> &mdash; <i>Method</i>.




```julia
take!(c::Channel)
```


Removes and returns a value from a [`Channel`](/base/parallel#Base.Channel) in order. Blocks until data is available. For unbuffered channels, blocks until a [`put!`](/base/parallel#Base.put!-Tuple{Channel,%20Any}) is performed by a different task.

**Examples**

Buffered channel:

```julia
julia> c = Channel(1);

julia> put!(c, 1);

julia> take!(c)
1
```


Unbuffered channel:

```julia
julia> c = Channel(0);

julia> task = Task(() -> put!(c, 1));

julia> schedule(task);

julia> take!(c)
1
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L457-L486)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isfull-Tuple{Channel}' href='#Base.isfull-Tuple{Channel}'>#</a>&nbsp;<b><u>Base.isfull</u></b> &mdash; <i>Method</i>.




```julia
isfull(c::Channel)
```


Determines if a [`Channel`](/base/parallel#Base.Channel) is full, in the sense that calling `put!(c, some_value)` would have blocked. Returns immediately, does not block.

Note that it may frequently be the case that `put!` will not block after this returns `true`. Users must take precautions not to accidentally create live-lock bugs in their code by calling this method, as these are generally harder to debug than deadlocks. It is also possible that `put!` will block after this call returns `false`, if there are multiple producer tasks calling `put!` in parallel.

**Examples**

Buffered channel:

```julia
julia> c = Channel(1); # capacity = 1

julia> isfull(c)
false

julia> put!(c, 1);

julia> isfull(c)
true
```


Unbuffered channel:

```julia
julia> c = Channel(); # capacity = 0

julia> isfull(c) # unbuffered channel is always full
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L562-L600)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isready-Tuple{Channel}' href='#Base.isready-Tuple{Channel}'>#</a>&nbsp;<b><u>Base.isready</u></b> &mdash; <i>Method</i>.




```julia
isready(c::Channel)
```


Determines whether a [`Channel`](/base/parallel#Base.Channel) has a value stored in it. Returns immediately, does not block.

For unbuffered channels, return `true` if there are tasks waiting on a [`put!`](/base/parallel#Base.put!-Tuple{Channel,%20Any}).

**Examples**

Buffered channel:

```julia
julia> c = Channel(1);

julia> isready(c)
false

julia> put!(c, 1);

julia> isready(c)
true
```


Unbuffered channel:

```julia
julia> c = Channel();

julia> isready(c)  # no tasks waiting to put!
false

julia> task = Task(() -> put!(c, 1));

julia> schedule(task);  # schedule a put! task

julia> isready(c)
true
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L516-L554)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fetch-Tuple{Channel}' href='#Base.fetch-Tuple{Channel}'>#</a>&nbsp;<b><u>Base.fetch</u></b> &mdash; <i>Method</i>.




```julia
fetch(c::Channel)
```


Waits for and returns (without removing) the first available item from the `Channel`. Note: `fetch` is unsupported on an unbuffered (0-size) `Channel`.

**Examples**

Buffered channel:

```julia
julia> c = Channel(3) do ch
           foreach(i -> put!(ch, i), 1:3)
       end;

julia> fetch(c)
1

julia> collect(c)  # item is not removed
3-element Vector{Any}:
 1
 2
 3
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L417-L440)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.close-Tuple{Channel}' href='#Base.close-Tuple{Channel}'>#</a>&nbsp;<b><u>Base.close</u></b> &mdash; <i>Method</i>.




```julia
close(c::Channel[, excp::Exception])
```


Close a channel. An exception (optionally given by `excp`), is thrown by:
- [`put!`](/base/parallel#Base.put!-Tuple{Channel,%20Any}) on a closed channel.
  
- [`take!`](/base/io-network#Base.take!-Tuple{Base.GenericIOBuffer}) and [`fetch`](/base/parallel#Base.fetch-Tuple{Task}) on an empty, closed channel.
  


[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L192-L199)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.bind-Tuple{Channel, Task}' href='#Base.bind-Tuple{Channel, Task}'>#</a>&nbsp;<b><u>Base.bind</u></b> &mdash; <i>Method</i>.




```julia
bind(chnl::Channel, task::Task)
```


Associate the lifetime of `chnl` with a task. `Channel` `chnl` is automatically closed when the task terminates. Any uncaught exception in the task is propagated to all waiters on `chnl`.

The `chnl` object can be explicitly closed independent of task termination. Terminating tasks have no effect on already closed `Channel` objects.

When a channel is bound to multiple tasks, the first task to terminate will close the channel. When multiple channels are bound to the same task, termination of the task will close all of the bound channels.

**Examples**

```julia
julia> c = Channel(0);

julia> task = @async foreach(i->put!(c, i), 1:4);

julia> bind(c,task);

julia> for i in c
           @show i
       end;
i = 1
i = 2
i = 3
i = 4

julia> isopen(c)
false
```


```julia
julia> c = Channel(0);

julia> task = @async (put!(c, 1); error("foo"));

julia> bind(c, task);

julia> take!(c)
1

julia> put!(c, 1);
ERROR: TaskFailedException
Stacktrace:
[...]
    nested task error: foo
[...]
```



[source](https://github.com/JuliaLang/julia/blob/b4082487c46b74edf91566306202a6443a6bf791/base/channels.jl#L237-L288)

</div>
<br>

## Low-level synchronization using `schedule` and `wait` {#low-level-schedule-wait}

The easiest correct use of [`schedule`](/base/parallel#Base.schedule) is on a `Task` that is not started (scheduled) yet. However, it is possible to use [`schedule`](/base/parallel#Base.schedule) and [`wait`](/base/parallel#Base.wait) as a very low-level building block for constructing synchronization interfaces. A crucial pre-condition of calling `schedule(task)` is that the caller must &quot;own&quot; the `task`; i.e., it must know that the call to `wait` in the given `task` is happening at the locations known to the code calling `schedule(task)`. One strategy for ensuring such pre-condition is to use atomics, as demonstrated in the following example:

```julia
@enum OWEState begin
    OWE_EMPTY
    OWE_WAITING
    OWE_NOTIFYING
end

mutable struct OneWayEvent
    @atomic state::OWEState
    task::Task
    OneWayEvent() = new(OWE_EMPTY)
end

function Base.notify(ev::OneWayEvent)
    state = @atomic ev.state
    while state !== OWE_NOTIFYING
        # Spin until we successfully update the state to OWE_NOTIFYING:
        state, ok = @atomicreplace(ev.state, state => OWE_NOTIFYING)
        if ok
            if state == OWE_WAITING
                # OWE_WAITING -> OWE_NOTIFYING transition means that the waiter task is
                # already waiting or about to call `wait`. The notifier task must wake up
                # the waiter task.
                schedule(ev.task)
            else
                @assert state == OWE_EMPTY
                # Since we are assuming that there is only one notifier task (for
                # simplicity), we know that the other possible case here is OWE_EMPTY.
                # We do not need to do anything because we know that the waiter task has
                # not called `wait(ev::OneWayEvent)` yet.
            end
            break
        end
    end
    return
end

function Base.wait(ev::OneWayEvent)
    ev.task = current_task()
    state, ok = @atomicreplace(ev.state, OWE_EMPTY => OWE_WAITING)
    if ok
        # OWE_EMPTY -> OWE_WAITING transition means that the notifier task is guaranteed to
        # invoke OWE_WAITING -> OWE_NOTIFYING transition. The waiter task must call
        # `wait()` immediately. In particular, it MUST NOT invoke any function that may
        # yield to the scheduler at this point in code.
        wait()
    else
        @assert state == OWE_NOTIFYING
        # Otherwise, the `state` must have already been moved to OWE_NOTIFYING by the
        # notifier task.
    end
    return
end

ev = OneWayEvent()
@sync begin
    Threads.@spawn begin
        wait(ev)
        println("done")
    end
    println("notifying...")
    notify(ev)
end

# output
notifying...
done
```


`OneWayEvent` lets one task to `wait` for another task&#39;s `notify`. It is a limited communication interface since `wait` can only be used once from a single task (note the non-atomic assignment of `ev.task`)

In this example, `notify(ev::OneWayEvent)` is allowed to call `schedule(ev.task)` if and only if _it_ modifies the state from `OWE_WAITING` to `OWE_NOTIFYING`. This lets us know that the task executing `wait(ev::OneWayEvent)` is now in the `ok` branch and that there cannot be other tasks that tries to `schedule(ev.task)` since their `@atomicreplace(ev.state, state => OWE_NOTIFYING)` will fail.
