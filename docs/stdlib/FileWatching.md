


# File Events {#lib-filewatching}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.poll_fd' href='#FileWatching.poll_fd'>#</a>&nbsp;<b><u>FileWatching.poll_fd</u></b> &mdash; <i>Function</i>.




```julia
poll_fd(fd, timeout_s::Real=-1; readable=false, writable=false)
```


Monitor a file descriptor `fd` for changes in the read or write availability, and with a timeout given by `timeout_s` seconds.

The keyword arguments determine which of read and/or write status should be monitored; at least one of them must be set to `true`.

The returned value is an object with boolean fields `readable`, `writable`, and `timedout`, giving the result of the polling.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/FileWatching.jl#L709-L720)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.poll_file' href='#FileWatching.poll_file'>#</a>&nbsp;<b><u>FileWatching.poll_file</u></b> &mdash; <i>Function</i>.




```julia
poll_file(path::AbstractString, interval_s::Real=5.007, timeout_s::Real=-1) -> (previous::StatStruct, current)
```


Monitor a file for changes by polling every `interval_s` seconds until a change occurs or `timeout_s` seconds have elapsed. The `interval_s` should be a long period; the default is 5.007 seconds.

Returns a pair of status objects `(previous, current)` when a change is detected. The `previous` status is always a `StatStruct`, but it may have all of the fields zeroed (indicating the file didn&#39;t previously exist, or wasn&#39;t previously accessible).

The `current` status object may be a `StatStruct`, an `EOFError` (indicating the timeout elapsed), or some other `Exception` subtype (if the `stat` operation failed - for example, if the path does not exist).

To determine when a file was modified, compare `current isa StatStruct && mtime(prev) != mtime(current)` to detect notification of changes. However, using [`watch_file`](/stdlib/FileWatching#FileWatching.watch_file) for this operation is preferred, since it is more reliable and efficient, although in some situations it may not be available.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/FileWatching.jl#L869-L886)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.watch_file' href='#FileWatching.watch_file'>#</a>&nbsp;<b><u>FileWatching.watch_file</u></b> &mdash; <i>Function</i>.




```julia
watch_file(path::AbstractString, timeout_s::Real=-1)
```


Watch file or directory `path` for changes until a change occurs or `timeout_s` seconds have elapsed. This function does not poll the file system and instead uses platform-specific functionality to receive notifications from the operating system (e.g. via inotify on Linux). See the NodeJS documentation linked below for details.

The returned value is an object with boolean fields `renamed`, `changed`, and `timedout`, giving the result of watching the file.

This behavior of this function varies slightly across platforms. See [https://nodejs.org/api/fs.html#fs_caveats](https://nodejs.org/api/fs.html#fs_caveats) for more detailed information.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/FileWatching.jl#L764-L777)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.watch_folder' href='#FileWatching.watch_folder'>#</a>&nbsp;<b><u>FileWatching.watch_folder</u></b> &mdash; <i>Function</i>.




```julia
watch_folder(path::AbstractString, timeout_s::Real=-1)
```


Watches a file or directory `path` for changes until a change has occurred or `timeout_s` seconds have elapsed. This function does not poll the file system and instead uses platform-specific functionality to receive notifications from the operating system (e.g. via inotify on Linux). See the NodeJS documentation linked below for details.

This will continuing tracking changes for `path` in the background until `unwatch_folder` is called on the same `path`.

The returned value is an pair where the first field is the name of the changed file (if available) and the second field is an object with boolean fields `renamed`, `changed`, and `timedout`, giving the event.

This behavior of this function varies slightly across platforms. See [https://nodejs.org/api/fs.html#fs_caveats](https://nodejs.org/api/fs.html#fs_caveats) for more detailed information.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/FileWatching.jl#L795-L812)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.unwatch_folder' href='#FileWatching.unwatch_folder'>#</a>&nbsp;<b><u>FileWatching.unwatch_folder</u></b> &mdash; <i>Function</i>.




```julia
unwatch_folder(path::AbstractString)
```


Stop background tracking of changes for `path`. It is not recommended to do this while another task is waiting for `watch_folder` to return on the same path, as the result may be unpredictable.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/FileWatching.jl#L853-L859)

</div>
<br>

# Pidfile {#Pidfile}



A simple utility tool for creating advisory pidfiles (lock files).

## Primary Functions {#Primary-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.mkpidlock' href='#FileWatching.Pidfile.mkpidlock'>#</a>&nbsp;<b><u>FileWatching.Pidfile.mkpidlock</u></b> &mdash; <i>Function</i>.




```julia
mkpidlock([f::Function], at::String, [pid::Cint]; kwopts...)
mkpidlock(at::String, proc::Process; kwopts...)
```


Create a pidfile lock for the path &quot;at&quot; for the current process or the process identified by pid or proc. Can take a function to execute once locked, for usage in `do` blocks, after which the lock will be automatically closed. If the lock fails and `wait` is false, then an error is thrown.

The lock will be released by either `close`, a `finalizer`, or shortly after `proc` exits. Make sure the return value is live through the end of the critical section of your program, so the `finalizer` does not reclaim it early.

Optional keyword arguments:
- `mode`: file access mode (modified by the process umask). Defaults to world-readable.
  
- `poll_interval`: Specify the maximum time to between attempts (if `watch_file` doesn&#39;t work)
  
- `stale_age`: Delete an existing pidfile (ignoring the lock) if it is older than this many seconds, based on its mtime.   The file won&#39;t be deleted until 5x longer than this if the pid in the file appears that it may be valid.   Or 25x longer if `refresh` is overridden to 0 to disable lock refreshing.   By default this is disabled (`stale_age` = 0), but a typical recommended value would be about 3-5x an   estimated normal completion time.
  
- `refresh`: Keeps a lock from becoming stale by updating the mtime every interval of time that passes.   By default, this is set to `stale_age/2`, which is the recommended value.
  
- `wait`: If true, block until we get the lock, if false, raise error if lock fails.
  


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L17-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.trymkpidlock' href='#FileWatching.Pidfile.trymkpidlock'>#</a>&nbsp;<b><u>FileWatching.Pidfile.trymkpidlock</u></b> &mdash; <i>Function</i>.




```julia
trymkpidlock([f::Function], at::String, [pid::Cint]; kwopts...)
trymkpidlock(at::String, proc::Process; kwopts...)
```


Like `mkpidlock` except returns `false` instead of waiting if the file is already locked.

::: tip Julia 1.10

This function requires at least Julia 1.10.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L44-L52)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.close-Tuple{FileWatching.Pidfile.LockMonitor}' href='#Base.close-Tuple{FileWatching.Pidfile.LockMonitor}'>#</a>&nbsp;<b><u>Base.close</u></b> &mdash; <i>Method</i>.




```julia
close(lock::LockMonitor)
```


Release a pidfile lock.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L319-L323)

</div>
<br>

## Helper Functions {#Helper-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.open_exclusive' href='#FileWatching.Pidfile.open_exclusive'>#</a>&nbsp;<b><u>FileWatching.Pidfile.open_exclusive</u></b> &mdash; <i>Function</i>.




```julia
open_exclusive(path::String; mode, poll_interval, wait, stale_age, refresh) :: File
```


Create a new a file for read-write advisory-exclusive access. If `wait` is `false` then error out if the lock files exist otherwise block until we get the lock.

For a description of the keyword arguments, see [`mkpidlock`](/stdlib/FileWatching#FileWatching.Pidfile.mkpidlock).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L226-L234)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.tryopen_exclusive' href='#FileWatching.Pidfile.tryopen_exclusive'>#</a>&nbsp;<b><u>FileWatching.Pidfile.tryopen_exclusive</u></b> &mdash; <i>Function</i>.




```julia
tryopen_exclusive(path::String, mode::Integer = 0o444) :: Union{Void, File}
```


Try to create a new file for read-write advisory-exclusive access, return nothing if it already exists.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L207-L212)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.write_pidfile' href='#FileWatching.Pidfile.write_pidfile'>#</a>&nbsp;<b><u>FileWatching.Pidfile.write_pidfile</u></b> &mdash; <i>Function</i>.




```julia
write_pidfile(io, pid)
```


Write our pidfile format to an open IO descriptor.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L133-L137)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.parse_pidfile' href='#FileWatching.Pidfile.parse_pidfile'>#</a>&nbsp;<b><u>FileWatching.Pidfile.parse_pidfile</u></b> &mdash; <i>Function</i>.




```julia
parse_pidfile(file::Union{IO, String}) => (pid, hostname, age)
```


Attempt to parse our pidfile format, replaced an element with (0, &quot;&quot;, 0.0), respectively, for any read that failed.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L142-L147)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.stale_pidfile' href='#FileWatching.Pidfile.stale_pidfile'>#</a>&nbsp;<b><u>FileWatching.Pidfile.stale_pidfile</u></b> &mdash; <i>Function</i>.




```julia
stale_pidfile(path::String, stale_age::Real, refresh::Real) :: Bool
```


Helper function for `open_exclusive` for deciding if a pidfile is stale.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L190-L194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='FileWatching.Pidfile.isvalidpid' href='#FileWatching.Pidfile.isvalidpid'>#</a>&nbsp;<b><u>FileWatching.Pidfile.isvalidpid</u></b> &mdash; <i>Function</i>.




```julia
isvalidpid(hostname::String, pid::Cuint) :: Bool
```


Attempt to conservatively estimate whether pid is a valid process id.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L172-L176)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.touch-Tuple{FileWatching.Pidfile.LockMonitor}' href='#Base.Filesystem.touch-Tuple{FileWatching.Pidfile.LockMonitor}'>#</a>&nbsp;<b><u>Base.Filesystem.touch</u></b> &mdash; <i>Method</i>.




```julia
Base.touch(::Pidfile.LockMonitor)
```


Update the `mtime` on the lock, to indicate it is still fresh.

See also the `refresh` keyword in the [`mkpidlock`](/stdlib/FileWatching#FileWatching.Pidfile.mkpidlock) constructor.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/FileWatching/src/pidfile.jl#L124-L130)

</div>
<br>
