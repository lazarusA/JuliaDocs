
# Stack Traces {#Stack-Traces}

The `StackTraces` module provides simple stack traces that are both human readable and easy to use programmatically.

## Viewing a stack trace {#Viewing-a-stack-trace}

The primary function used to obtain a stack trace is [`stacktrace`](/base/stacktraces#Base.StackTraces.stacktrace):

```julia
6-element Array{Base.StackTraces.StackFrame,1}:
 top-level scope
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
```


Calling [`stacktrace()`](/base/stacktraces#Base.StackTraces.stacktrace) returns a vector of [`StackTraces.StackFrame`](/base/stacktraces#Base.StackTraces.StackFrame) s. For ease of use, the alias [`StackTraces.StackTrace`](/base/stacktraces#Base.StackTraces.StackTrace) can be used in place of `Vector{StackFrame}`. (Examples with `[...]` indicate that output may vary depending on how the code is run.)

```julia
julia> example() = stacktrace()
example (generic function with 1 method)

julia> example()
7-element Array{Base.StackTraces.StackFrame,1}:
 example() at REPL[1]:1
 top-level scope
 eval at boot.jl:317 [inlined]
[...]

julia> @noinline child() = stacktrace()
child (generic function with 1 method)

julia> @noinline parent() = child()
parent (generic function with 1 method)

julia> grandparent() = parent()
grandparent (generic function with 1 method)

julia> grandparent()
9-element Array{Base.StackTraces.StackFrame,1}:
 child() at REPL[3]:1
 parent() at REPL[4]:1
 grandparent() at REPL[5]:1
[...]
```


Note that when calling [`stacktrace()`](/base/stacktraces#Base.StackTraces.stacktrace) you&#39;ll typically see a frame with `eval at boot.jl`. When calling [`stacktrace()`](/base/stacktraces#Base.StackTraces.stacktrace) from the REPL you&#39;ll also have a few extra frames in the stack from `REPL.jl`, usually looking something like this:

```julia
julia> example() = stacktrace()
example (generic function with 1 method)

julia> example()
7-element Array{Base.StackTraces.StackFrame,1}:
 example() at REPL[1]:1
 top-level scope
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
```


## Extracting useful information {#Extracting-useful-information}

Each [`StackTraces.StackFrame`](/base/stacktraces#Base.StackTraces.StackFrame) contains the function name, file name, line number, lambda info, a flag indicating whether the frame has been inlined, a flag indicating whether it is a C function (by default C functions do not appear in the stack trace), and an integer representation of the pointer returned by [`backtrace`](/base/base#Base.backtrace):

```julia
julia> frame = stacktrace()[3]
eval(::Module, ::Expr) at REPL.jl:5

julia> frame.func
:eval

julia> frame.file
Symbol("~/julia/usr/share/julia/stdlib/v0.7/REPL/src/REPL.jl")

julia> frame.line
5

julia> frame.linfo
MethodInstance for eval(::Module, ::Expr)

julia> frame.inlined
false

julia> frame.from_c
false

julia> frame.pointer
0x00007f92d6293171
```


This makes stack trace information available programmatically for logging, error handling, and more.

## Error handling {#Error-handling}

While having easy access to information about the current state of the callstack can be helpful in many places, the most obvious application is in error handling and debugging.

```julia
julia> @noinline bad_function() = undeclared_variable
bad_function (generic function with 1 method)

julia> @noinline example() = try
           bad_function()
       catch
           stacktrace()
       end
example (generic function with 1 method)

julia> example()
7-element Array{Base.StackTraces.StackFrame,1}:
 example() at REPL[2]:4
 top-level scope
 eval at boot.jl:317 [inlined]
[...]
```


You may notice that in the example above the first stack frame points at line 4, where [`stacktrace`](/base/stacktraces#Base.StackTraces.stacktrace) is called, rather than line 2, where _bad_function_ is called, and `bad_function`&#39;s frame is missing entirely. This is understandable, given that [`stacktrace`](/base/stacktraces#Base.StackTraces.stacktrace) is called from the context of the _catch_. While in this example it&#39;s fairly easy to find the actual source of the error, in complex cases tracking down the source of the error becomes nontrivial.

This can be remedied by passing the result of [`catch_backtrace`](/base/base#Base.catch_backtrace) to [`stacktrace`](/base/stacktraces#Base.StackTraces.stacktrace). Instead of returning callstack information for the current context, [`catch_backtrace`](/base/base#Base.catch_backtrace) returns stack information for the context of the most recent exception:

```julia
julia> @noinline bad_function() = undeclared_variable
bad_function (generic function with 1 method)

julia> @noinline example() = try
           bad_function()
       catch
           stacktrace(catch_backtrace())
       end
example (generic function with 1 method)

julia> example()
8-element Array{Base.StackTraces.StackFrame,1}:
 bad_function() at REPL[1]:1
 example() at REPL[2]:2
[...]
```


Notice that the stack trace now indicates the appropriate line number and the missing frame.

```julia
julia> @noinline child() = error("Whoops!")
child (generic function with 1 method)

julia> @noinline parent() = child()
parent (generic function with 1 method)

julia> @noinline function grandparent()
           try
               parent()
           catch err
               println("ERROR: ", err.msg)
               stacktrace(catch_backtrace())
           end
       end
grandparent (generic function with 1 method)

julia> grandparent()
ERROR: Whoops!
10-element Array{Base.StackTraces.StackFrame,1}:
 error at error.jl:33 [inlined]
 child() at REPL[1]:1
 parent() at REPL[2]:1
 grandparent() at REPL[3]:3
[...]
```


## Exception stacks and [`current_exceptions`](/base/base#Base.current_exceptions) {#Exception-stacks-and-[current_exceptions](@ref)}

::: tip Julia 1.1

Exception stacks requires at least Julia 1.1.

:::

While handling an exception further exceptions may be thrown. It can be useful to inspect all these exceptions to identify the root cause of a problem. The julia runtime supports this by pushing each exception onto an internal _exception stack_ as it occurs. When the code exits a `catch` normally, any exceptions which were pushed onto the stack in the associated `try` are considered to be successfully handled and are removed from the stack.

The stack of current exceptions can be accessed using the [`current_exceptions`](/base/base#Base.current_exceptions) function. For example,

```julia
julia> try
           error("(A) The root cause")
       catch
           try
               error("(B) An exception while handling the exception")
           catch
               for (exc, bt) in current_exceptions()
                   showerror(stdout, exc, bt)
                   println(stdout)
               end
           end
       end
(A) The root cause
Stacktrace:
 [1] error(::String) at error.jl:33
 [2] top-level scope at REPL[7]:2
 [3] eval(::Module, ::Any) at boot.jl:319
 [4] eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 [5] macro expansion at REPL.jl:117 [inlined]
 [6] (::getfield(REPL, Symbol("##26#27")){REPL.REPLBackend})() at task.jl:259
(B) An exception while handling the exception
Stacktrace:
 [1] error(::String) at error.jl:33
 [2] top-level scope at REPL[7]:5
 [3] eval(::Module, ::Any) at boot.jl:319
 [4] eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 [5] macro expansion at REPL.jl:117 [inlined]
 [6] (::getfield(REPL, Symbol("##26#27")){REPL.REPLBackend})() at task.jl:259
```


In this example the root cause exception (A) is first on the stack, with a further exception (B) following it. After exiting both catch blocks normally (i.e., without throwing a further exception) all exceptions are removed from the stack and are no longer accessible.

The exception stack is stored on the `Task` where the exceptions occurred. When a task fails with uncaught exceptions, `current_exceptions(task)` may be used to inspect the exception stack for that task.

## Comparison with [`backtrace`](/base/base#Base.backtrace) {#Comparison-with-[backtrace](@ref)}

A call to [`backtrace`](/base/base#Base.backtrace) returns a vector of `Union{Ptr{Nothing}, Base.InterpreterIP}`, which may then be passed into [`stacktrace`](/base/stacktraces#Base.StackTraces.stacktrace) for translation:

```julia
julia> trace = backtrace()
18-element Array{Union{Ptr{Nothing}, Base.InterpreterIP},1}:
 Ptr{Nothing} @0x00007fd8734c6209
 Ptr{Nothing} @0x00007fd87362b342
 Ptr{Nothing} @0x00007fd87362c136
 Ptr{Nothing} @0x00007fd87362c986
 Ptr{Nothing} @0x00007fd87362d089
 Base.InterpreterIP(CodeInfo(:(begin
      Core.SSAValue(0) = backtrace()
      trace = Core.SSAValue(0)
      return Core.SSAValue(0)
  end)), 0x0000000000000000)
 Ptr{Nothing} @0x00007fd87362e4cf
[...]

julia> stacktrace(trace)
6-element Array{Base.StackTraces.StackFrame,1}:
 top-level scope
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
```


Notice that the vector returned by [`backtrace`](/base/base#Base.backtrace) had 18 elements, while the vector returned by [`stacktrace`](/base/stacktraces#Base.StackTraces.stacktrace) only has 6. This is because, by default, [`stacktrace`](/base/stacktraces#Base.StackTraces.stacktrace) removes any lower-level C functions from the stack. If you want to include stack frames from C calls, you can do it like this:

```julia
julia> stacktrace(trace, true)
21-element Array{Base.StackTraces.StackFrame,1}:
 jl_apply_generic at gf.c:2167
 do_call at interpreter.c:324
 eval_value at interpreter.c:416
 eval_body at interpreter.c:559
 jl_interpret_toplevel_thunk_callback at interpreter.c:798
 top-level scope
 jl_interpret_toplevel_thunk at interpreter.c:807
 jl_toplevel_eval_flex at toplevel.c:856
 jl_toplevel_eval_in at builtins.c:624
 eval at boot.jl:317 [inlined]
 eval(::Module, ::Expr) at REPL.jl:5
 jl_apply_generic at gf.c:2167
 eval_user_input(::Any, ::REPL.REPLBackend) at REPL.jl:85
 jl_apply_generic at gf.c:2167
 macro expansion at REPL.jl:116 [inlined]
 (::getfield(REPL, Symbol("##28#29")){REPL.REPLBackend})() at event.jl:92
 jl_fptr_trampoline at gf.c:1838
 jl_apply_generic at gf.c:2167
 jl_apply at julia.h:1540 [inlined]
 start_task at task.c:268
 ip:0xffffffffffffffff
```


Individual pointers returned by [`backtrace`](/base/base#Base.backtrace) can be translated into [`StackTraces.StackFrame`](/base/stacktraces#Base.StackTraces.StackFrame) s by passing them into [`StackTraces.lookup`](/base/stacktraces#Base.StackTraces.lookup):

```julia
julia> pointer = backtrace()[1];

julia> frame = StackTraces.lookup(pointer)
1-element Array{Base.StackTraces.StackFrame,1}:
 jl_apply_generic at gf.c:2167

julia> println("The top frame is from $(frame[1].func)!")
The top frame is from jl_apply_generic!
```

