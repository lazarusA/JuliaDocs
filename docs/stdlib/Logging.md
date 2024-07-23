


# Logging {#man-logging}

The [`Logging`](/stdlib/Logging#Logging.Logging) module provides a way to record the history and progress of a computation as a log of events. Events are created by inserting a logging statement into the source code, for example:

```julia
@warn "Abandon printf debugging, all ye who enter here!"
┌ Warning: Abandon printf debugging, all ye who enter here!
└ @ Main REPL[1]:1
```


The system provides several advantages over peppering your source code with calls to `println()`. First, it allows you to control the visibility and presentation of messages without editing the source code. For example, in contrast to the `@warn` above

```julia
@debug "The sum of some values $(sum(rand(100)))"
```


will produce no output by default. Furthermore, it&#39;s very cheap to leave debug statements like this in the source code because the system avoids evaluating the message if it would later be ignored. In this case `sum(rand(100))` and the associated string processing will never be executed unless debug logging is enabled.

Second, the logging tools allow you to attach arbitrary data to each event as a set of key–value pairs. This allows you to capture local variables and other program state for later analysis. For example, to attach the local array variable `A` and the sum of a vector `v` as the key `s` you can use

```julia
A = ones(Int, 4, 4)
v = ones(100)
@info "Some variables"  A  s=sum(v)

# output
┌ Info: Some variables
│   A =
│    4×4 Matrix{Int64}:
│     1  1  1  1
│     1  1  1  1
│     1  1  1  1
│     1  1  1  1
└   s = 100.0
```


All of the logging macros `@debug`, `@info`, `@warn` and `@error` share common features that are described in detail in the documentation for the more general macro [`@logmsg`](/stdlib/Logging#Logging.@logmsg).

## Log event structure {#Log-event-structure}

Each event generates several pieces of data, some provided by the user and some automatically extracted. Let&#39;s examine the user-defined data first:
- The _log level_ is a broad category for the message that is used for early filtering. There are several standard levels of type [`LogLevel`](/stdlib/Logging#Logging.LogLevel); user-defined levels are also possible. Each is distinct in purpose:
  - [`Logging.Debug`](/stdlib/Logging#Logging.Debug) (log level -1000) is information intended for the developer of the program. These events are disabled by default.
    
  - [`Logging.Info`](/stdlib/Logging#Logging.Info) (log level 0) is for general information to the user. Think of it as an alternative to using `println` directly.
    
  - [`Logging.Warn`](/stdlib/Logging#Logging.Warn) (log level 1000) means something is wrong and action is likely required but that for now the program is still working.
    
  - [`Logging.Error`](/stdlib/Logging#Logging.Error) (log level 2000) means something is wrong and it is unlikely to be recovered, at least by this part of the code. Often this log-level is unneeded as throwing an exception can convey all the required information.
    
  
- The _message_  is an object describing the event. By convention `AbstractString`s passed as messages are assumed to be in markdown format. Other types will be displayed using `print(io, obj)` or `string(obj)` for text-based output and possibly `show(io,mime,obj)` for other multimedia displays used in the installed logger.
  
- Optional _key–value pairs_ allow arbitrary data to be attached to each event. Some keys have conventional meaning that can affect the way an event is interpreted (see [`@logmsg`](/stdlib/Logging#Logging.@logmsg)).
  

The system also generates some standard information for each event:
- The `module` in which the logging macro was expanded.
  
- The `file` and `line` where the logging macro occurs in the source code.
  
- A message `id` that is a unique, fixed identifier for the _source code statement_ where the logging macro appears. This identifier is designed to be fairly stable even if the source code of the file changes, as long as the logging statement itself remains the same.
  
- A `group` for the event, which is set to the base name of the file by default, without extension. This can be used to group messages into categories more finely than the log level (for example, all deprecation warnings have group `:depwarn`), or into logical groupings across or within modules.
  

Notice that some useful information such as the event time is not included by default. This is because such information can be expensive to extract and is also _dynamically_ available to the current logger. It&#39;s simple to define a [custom logger](/stdlib/Logging#AbstractLogger-interface) to augment event data with the time, backtrace, values of global variables and other useful information as required.

## Processing log events {#Processing-log-events}

As you can see in the examples, logging statements make no mention of where log events go or how they are processed. This is a key design feature that makes the system composable and natural for concurrent use. It does this by separating two different concerns:
- _Creating_ log events is the concern of the module author who needs to decide where events are triggered and which information to include.
  
- _Processing_ of log events — that is, display, filtering, aggregation and recording — is the concern of the application author who needs to bring multiple modules together into a cooperating application.
  

### Loggers

Processing of events is performed by a _logger_, which is the first piece of user configurable code to see the event. All loggers must be subtypes of [`AbstractLogger`](/stdlib/Logging#Logging.AbstractLogger).

When an event is triggered, the appropriate logger is found by looking for a task-local logger with the global logger as fallback. The idea here is that the application code knows how log events should be processed and exists somewhere at the top of the call stack. So we should look up through the call stack to discover the logger — that is, the logger should be _dynamically scoped_. (This is a point of contrast with logging frameworks where the logger is _lexically scoped_; provided explicitly by the module author or as a simple global variable. In such a system it&#39;s awkward to control logging while composing functionality from multiple modules.)

The global logger may be set with [`global_logger`](/stdlib/Logging#Logging.global_logger), and task-local loggers controlled using [`with_logger`](/stdlib/Logging#Logging.with_logger). Newly spawned tasks inherit the logger of the parent task.

There are three logger types provided by the library.  [`ConsoleLogger`](/stdlib/Logging#Base.CoreLogging.ConsoleLogger) is the default logger you see when starting the REPL. It displays events in a readable text format and tries to give simple but user friendly control over formatting and filtering.  [`NullLogger`](/stdlib/Logging#Logging.NullLogger) is a convenient way to drop all messages where necessary; it is the logging equivalent of the [`devnull`](/base/base#Base.devnull) stream.  [`SimpleLogger`](/stdlib/Logging#Logging.SimpleLogger) is a very simplistic text formatting logger, mainly useful for debugging the logging system itself.

Custom loggers should come with overloads for the functions described in the [reference section](/stdlib/Logging#AbstractLogger-interface).

### Early filtering and message handling {#Early-filtering-and-message-handling}

When an event occurs, a few steps of early filtering occur to avoid generating messages that will be discarded:
1. The message log level is checked against a global minimum level (set via [`disable_logging`](/stdlib/Logging#Logging.disable_logging)). This is a crude but extremely cheap global setting.
  
2. The current logger state is looked up and the message level checked against the logger&#39;s cached minimum level, as found by calling [`Logging.min_enabled_level`](/stdlib/Logging#Logging.min_enabled_level). This behavior can be overridden via environment variables (more on this later).
  
3. The [`Logging.shouldlog`](/stdlib/Logging#Logging.shouldlog) function is called with the current logger, taking some minimal information (level, module, group, id) which can be computed statically. Most usefully, `shouldlog` is passed an event `id` which can be used to discard events early based on a cached predicate.
  

If all these checks pass, the message and key–value pairs are evaluated in full and passed to the current logger via the [`Logging.handle_message`](/stdlib/Logging#Logging.handle_message) function. `handle_message()` may perform additional filtering as required and display the event to the screen, save it to a file, etc.

Exceptions that occur while generating the log event are captured and logged by default. This prevents individual broken events from crashing the application, which is helpful when enabling little-used debug events in a production system. This behavior can be customized per logger type by extending [`Logging.catch_exceptions`](/stdlib/Logging#Logging.catch_exceptions).

## Testing log events {#Testing-log-events}

Log events are a side effect of running normal code, but you might find yourself wanting to test particular informational messages and warnings. The `Test` module provides a [`@test_logs`](/stdlib/Test#Test.@test_logs) macro that can be used to pattern match against the log event stream.

## Environment variables {#Environment-variables}

Message filtering can be influenced through the [`JULIA_DEBUG`](/manual/environment-variables#JULIA_DEBUG) environment variable, and serves as an easy way to enable debug logging for a file or module. Loading julia with `JULIA_DEBUG=loading` will activate `@debug` log messages in `loading.jl`. For example, in Linux shells:

```
$ JULIA_DEBUG=loading julia -e 'using OhMyREPL'
┌ Debug: Rejecting cache file /home/user/.julia/compiled/v0.7/OhMyREPL.ji due to it containing an invalid cache header
└ @ Base loading.jl:1328
[ Info: Recompiling stale cache file /home/user/.julia/compiled/v0.7/OhMyREPL.ji for module OhMyREPL
┌ Debug: Rejecting cache file /home/user/.julia/compiled/v0.7/Tokenize.ji due to it containing an invalid cache header
└ @ Base loading.jl:1328
...
```


On windows, the same can be achieved in `CMD` via first running `set JULIA_DEBUG="loading"` and in `Powershell` via `$env:JULIA_DEBUG="loading"`.

Similarly, the environment variable can be used to enable debug logging of modules, such as `Pkg`, or module roots (see [`Base.moduleroot`](/base/base#Base.moduleroot)). To enable all debug logging, use the special value `all`.

To turn debug logging on from the REPL, set `ENV["JULIA_DEBUG"]` to the name of the module of interest. Functions defined in the REPL belong to module `Main`; logging for them can be enabled like this:

```julia
julia> foo() = @debug "foo"
foo (generic function with 1 method)

julia> foo()

julia> ENV["JULIA_DEBUG"] = Main
Main

julia> foo()
┌ Debug: foo
└ @ Main REPL[1]:1

```


Use a comma separator to enable debug for multiple modules: `JULIA_DEBUG=loading,Main`.

## Examples

### Example: Writing log events to a file {#Example:-Writing-log-events-to-a-file}

Sometimes it can be useful to write log events to a file. Here is an example of how to use a task-local and global logger to write information to a text file:

```julia
# Load the logging module
julia> using Logging

# Open a textfile for writing
julia> io = open("log.txt", "w+")
IOStream(<file log.txt>)

# Create a simple logger
julia> logger = SimpleLogger(io)
SimpleLogger(IOStream(<file log.txt>), Info, Dict{Any,Int64}())

# Log a task-specific message
julia> with_logger(logger) do
           @info("a context specific log message")
       end

# Write all buffered messages to the file
julia> flush(io)

# Set the global logger to logger
julia> global_logger(logger)
SimpleLogger(IOStream(<file log.txt>), Info, Dict{Any,Int64}())

# This message will now also be written to the file
julia> @info("a global log message")

# Close the file
julia> close(io)
```


### Example: Enable debug-level messages {#Example:-Enable-debug-level-messages}

Here is an example of creating a [`ConsoleLogger`](/stdlib/Logging#Base.CoreLogging.ConsoleLogger) that lets through any messages with log level higher than, or equal, to [`Logging.Debug`](/stdlib/Logging#Logging.Debug).

```julia
julia> using Logging

# Create a ConsoleLogger that prints any log messages with level >= Debug to stderr
julia> debuglogger = ConsoleLogger(stderr, Logging.Debug)

# Enable debuglogger for a task
julia> with_logger(debuglogger) do
           @debug "a context specific log message"
       end

# Set the global logger
julia> global_logger(debuglogger)
```


## Reference

### Logging module {#Logging-module}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.Logging' href='#Logging.Logging'>#</a>&nbsp;<b><u>Logging.Logging</u></b> &mdash; <i>Module</i>.




Utilities for capturing, filtering and presenting streams of log events. Normally you don&#39;t need to import `Logging` to create log events; for this the standard logging macros such as `@info` are already exported by `Base` and available by default.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Logging/src/Logging.jl#L3-L8)

</div>
<br>

### Creating events {#Creating-events}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.@logmsg' href='#Logging.@logmsg'>#</a>&nbsp;<b><u>Logging.@logmsg</u></b> &mdash; <i>Macro</i>.




```julia
@debug message  [key=value | value ...]
@info  message  [key=value | value ...]
@warn  message  [key=value | value ...]
@error message  [key=value | value ...]

@logmsg level message [key=value | value ...]
```


Create a log record with an informational `message`.  For convenience, four logging macros `@debug`, `@info`, `@warn` and `@error` are defined which log at the standard severity levels `Debug`, `Info`, `Warn` and `Error`.  `@logmsg` allows `level` to be set programmatically to any `LogLevel` or custom log level types.

`message` should be an expression which evaluates to a string which is a human readable description of the log event.  By convention, this string will be formatted as markdown when presented.

The optional list of `key=value` pairs supports arbitrary user defined metadata which will be passed through to the logging backend as part of the log record.  If only a `value` expression is supplied, a key representing the expression will be generated using [`Symbol`](/base/base#Core.Symbol). For example, `x` becomes `x=x`, and `foo(10)` becomes `Symbol("foo(10)")=foo(10)`.  For splatting a list of key value pairs, use the normal splatting syntax, `@info "blah" kws...`.

There are some keys which allow automatically generated log data to be overridden:
- `_module=mod` can be used to specify a different originating module from the source location of the message.
  
- `_group=symbol` can be used to override the message group (this is normally derived from the base name of the source file).
  
- `_id=symbol` can be used to override the automatically generated unique message identifier.  This is useful if you need to very closely associate messages generated on different source lines.
  
- `_file=string` and `_line=integer` can be used to override the apparent source location of a log message.
  

There&#39;s also some key value pairs which have conventional meaning:
- `maxlog=integer` should be used as a hint to the backend that the message should be displayed no more than `maxlog` times.
  
- `exception=ex` should be used to transport an exception with a log message, often used with `@error`. An associated backtrace `bt` may be attached using the tuple `exception=(ex,bt)`.
  

**Examples**

```julia
@debug "Verbose debugging information.  Invisible by default"
@info  "An informational message"
@warn  "Something was odd.  You should pay attention"
@error "A non fatal error occurred"

x = 10
@info "Some variables attached to the message" x a=42.0

@debug begin
    sA = sum(A)
    "sum(A) = $sA is an expensive operation, evaluated only when `shouldlog` returns true"
end

for i=1:10000
    @info "With the default backend, you will only see (i = $i) ten times"  maxlog=10
    @debug "Algorithm1" i progress=i/10000
end
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L277-L344)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.LogLevel' href='#Logging.LogLevel'>#</a>&nbsp;<b><u>Logging.LogLevel</u></b> &mdash; <i>Type</i>.




```julia
LogLevel(level)
```


Severity/verbosity of a log record.

The log level provides a key against which potential log records may be filtered, before any other work is done to construct the log record data structure itself.

**Examples**

```julia
julia> Logging.LogLevel(0) == Logging.Info
true
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L110-L124)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.Debug' href='#Logging.Debug'>#</a>&nbsp;<b><u>Logging.Debug</u></b> &mdash; <i>Constant</i>.




```julia
Debug
```


Alias for [`LogLevel(-1000)`](/stdlib/Logging#Logging.LogLevel).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Logging/src/Logging.jl#L33-L37)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.Info' href='#Logging.Info'>#</a>&nbsp;<b><u>Logging.Info</u></b> &mdash; <i>Constant</i>.




```julia
Info
```


Alias for [`LogLevel(0)`](/stdlib/Logging#Logging.LogLevel).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Logging/src/Logging.jl#L39-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.Warn' href='#Logging.Warn'>#</a>&nbsp;<b><u>Logging.Warn</u></b> &mdash; <i>Constant</i>.




```julia
Warn
```


Alias for [`LogLevel(1000)`](/stdlib/Logging#Logging.LogLevel).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Logging/src/Logging.jl#L45-L49)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.Error' href='#Logging.Error'>#</a>&nbsp;<b><u>Logging.Error</u></b> &mdash; <i>Constant</i>.




```julia
Error
```


Alias for [`LogLevel(2000)`](/stdlib/Logging#Logging.LogLevel).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Logging/src/Logging.jl#L51-L55)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.BelowMinLevel' href='#Logging.BelowMinLevel'>#</a>&nbsp;<b><u>Logging.BelowMinLevel</u></b> &mdash; <i>Constant</i>.




```julia
BelowMinLevel
```


Alias for [`LogLevel(-1_000_001)`](/stdlib/Logging#Logging.LogLevel).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Logging/src/Logging.jl#L57-L61)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.AboveMaxLevel' href='#Logging.AboveMaxLevel'>#</a>&nbsp;<b><u>Logging.AboveMaxLevel</u></b> &mdash; <i>Constant</i>.




```julia
AboveMaxLevel
```


Alias for [`LogLevel(1_000_001)`](/stdlib/Logging#Logging.LogLevel).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/Logging/src/Logging.jl#L63-L67)

</div>
<br>

### Processing events with AbstractLogger {#AbstractLogger-interface}

Event processing is controlled by overriding functions associated with `AbstractLogger`:

| Methods to implement                                                     |                        | Brief description                            |
|:------------------------------------------------------------------------ |:---------------------- |:-------------------------------------------- |
| [`Logging.handle_message`](/stdlib/Logging#Logging.handle_message)       |                        | Handle a log event                           |
| [`Logging.shouldlog`](/stdlib/Logging#Logging.shouldlog)                 |                        | Early filtering of events                    |
| [`Logging.min_enabled_level`](/stdlib/Logging#Logging.min_enabled_level) |                        | Lower bound for log level of accepted events |
| **Optional methods**                                                     | **Default definition** | **Brief description**                        |
| [`Logging.catch_exceptions`](/stdlib/Logging#Logging.catch_exceptions)   | `true`                 | Catch exceptions during event evaluation     |

<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.AbstractLogger' href='#Logging.AbstractLogger'>#</a>&nbsp;<b><u>Logging.AbstractLogger</u></b> &mdash; <i>Type</i>.




A logger controls how log records are filtered and dispatched.  When a log record is generated, the logger is the first piece of user configurable code which gets to inspect the record and decide what to do with it.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L25-L29)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.handle_message' href='#Logging.handle_message'>#</a>&nbsp;<b><u>Logging.handle_message</u></b> &mdash; <i>Function</i>.




```julia
handle_message(logger, level, message, _module, group, id, file, line; key1=val1, ...)
```


Log a message to `logger` at `level`.  The logical location at which the message was generated is given by module `_module` and `group`; the source location by `file` and `line`. `id` is an arbitrary unique value (typically a [`Symbol`](/base/base#Core.Symbol)) to be used as a key to identify the log statement when filtering.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L32-L40)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.shouldlog' href='#Logging.shouldlog'>#</a>&nbsp;<b><u>Logging.shouldlog</u></b> &mdash; <i>Function</i>.




```julia
shouldlog(logger, level, _module, group, id)
```


Return `true` when `logger` accepts a message at `level`, generated for `_module`, `group` and with unique log identifier `id`.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L43-L48)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.min_enabled_level' href='#Logging.min_enabled_level'>#</a>&nbsp;<b><u>Logging.min_enabled_level</u></b> &mdash; <i>Function</i>.




```julia
min_enabled_level(logger)
```


Return the minimum enabled level for `logger` for early filtering.  That is, the log level below or equal to which all messages are filtered.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L51-L56)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.catch_exceptions' href='#Logging.catch_exceptions'>#</a>&nbsp;<b><u>Logging.catch_exceptions</u></b> &mdash; <i>Function</i>.




```julia
catch_exceptions(logger)
```


Return `true` if the logger should catch exceptions which happen during log record construction.  By default, messages are caught.

By default all exceptions are caught to prevent log message generation from crashing the program.  This lets users confidently toggle little-used functionality - such as debug logging - in a production system.

If you want to use logging as an audit trail you should disable this for your logger type.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L59-L71)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.disable_logging' href='#Logging.disable_logging'>#</a>&nbsp;<b><u>Logging.disable_logging</u></b> &mdash; <i>Function</i>.




```julia
disable_logging(level)
```


Disable all log messages at log levels equal to or less than `level`.  This is a _global_ setting, intended to make debug logging extremely cheap when disabled.

**Examples**

```julia
Logging.disable_logging(Logging.Info) # Disable debug and info
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L527-L538)

</div>
<br>

### Using Loggers {#Using-Loggers}

Logger installation and inspection:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.global_logger' href='#Logging.global_logger'>#</a>&nbsp;<b><u>Logging.global_logger</u></b> &mdash; <i>Function</i>.




```julia
global_logger()
```


Return the global logger, used to receive messages when no specific logger exists for the current task.

```
global_logger(logger)
```


Set the global logger to `logger`, and return the previous global logger.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L595-L604)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.with_logger' href='#Logging.with_logger'>#</a>&nbsp;<b><u>Logging.with_logger</u></b> &mdash; <i>Function</i>.




```julia
with_logger(function, logger)
```


Execute `function`, directing all log messages to `logger`.

**Examples**

```julia
function test(x)
    @info "x = $x"
end

with_logger(logger) do
    test(1)
    test([1,2])
end
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L613-L630)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.current_logger' href='#Logging.current_logger'>#</a>&nbsp;<b><u>Logging.current_logger</u></b> &mdash; <i>Function</i>.




```julia
current_logger()
```


Return the logger for the current task, or the global logger if none is attached to the task.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L635-L640)

</div>
<br>

Loggers that are supplied with the system:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.NullLogger' href='#Logging.NullLogger'>#</a>&nbsp;<b><u>Logging.NullLogger</u></b> &mdash; <i>Type</i>.




```julia
NullLogger()
```


Logger which disables all messages and produces no output - the logger equivalent of /dev/null.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L94-L99)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.CoreLogging.ConsoleLogger' href='#Base.CoreLogging.ConsoleLogger'>#</a>&nbsp;<b><u>Base.CoreLogging.ConsoleLogger</u></b> &mdash; <i>Type</i>.




```julia
ConsoleLogger([stream,] min_level=Info; meta_formatter=default_metafmt,
              show_limited=true, right_justify=0)
```


Logger with formatting optimized for readability in a text console, for example interactive work with the Julia REPL.

Log levels less than `min_level` are filtered out.

Message formatting can be controlled by setting keyword arguments:
- `meta_formatter` is a function which takes the log event metadata `(level, _module, group, id, file, line)` and returns a color (as would be passed to printstyled), prefix and suffix for the log message.  The default is to prefix with the log level and a suffix containing the module, file and line location.
  
- `show_limited` limits the printing of large data structures to something which can fit on the screen by setting the `:limit` `IOContext` key during formatting.
  
- `right_justify` is the integer column which log metadata is right justified at. The default is zero (metadata goes on its own line).
  


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/ConsoleLogger.jl#L3-L24)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Logging.SimpleLogger' href='#Logging.SimpleLogger'>#</a>&nbsp;<b><u>Logging.SimpleLogger</u></b> &mdash; <i>Type</i>.




```julia
SimpleLogger([stream,] min_level=Info)
```


Simplistic logger for logging all messages with level greater than or equal to `min_level` to `stream`. If stream is closed then messages with log level greater or equal to `Warn` will be logged to `stderr` and below to `stdout`.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/logging/logging.jl#L648-L654)

</div>
<br>
