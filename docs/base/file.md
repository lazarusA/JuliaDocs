
# Filesystem {#Filesystem}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.read-Tuple{String}' href='#Base.read-Tuple{String}'>#</a>&nbsp;<b><u>Base.read</u></b> &mdash; <i>Method</i>.




```julia
read(filename::AbstractString)
```


Read the entire contents of a file as a `Vector{UInt8}`.

```
read(filename::AbstractString, String)
```


Read the entire contents of a file as a string.

```
read(filename::AbstractString, args...)
```


Open a file and read its contents. `args` is passed to `read`: this is equivalent to `open(io->read(io, args...), filename)`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/io.jl#L491-L504)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.write-Tuple{String, Any}' href='#Base.write-Tuple{String, Any}'>#</a>&nbsp;<b><u>Base.write</u></b> &mdash; <i>Method</i>.




```julia
write(filename::AbstractString, content)
```


Write the canonical binary representation of `content` to a file, which will be created if it does not exist yet or overwritten if it does exist.

Return the number of bytes written into the file.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/io.jl#L482-L488)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.pwd' href='#Base.Filesystem.pwd'>#</a>&nbsp;<b><u>Base.Filesystem.pwd</u></b> &mdash; <i>Function</i>.




```julia
pwd() -> String
```


Get the current working directory.

See also: [`cd`](/base/file#Base.Filesystem.cd-Tuple{AbstractString}), [`tempdir`](/base/file#Base.Filesystem.tempdir).

**Examples**

```julia
julia> pwd()
"/home/JuliaUser"

julia> cd("/home/JuliaUser/Projects/julia")

julia> pwd()
"/home/JuliaUser/Projects/julia"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L34-L51)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.cd-Tuple{AbstractString}' href='#Base.Filesystem.cd-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.Filesystem.cd</u></b> &mdash; <i>Method</i>.




```julia
cd(dir::AbstractString=homedir())
```


Set the current working directory.

See also: [`pwd`](/base/file#Base.Filesystem.pwd), [`mkdir`](/base/file#Base.Filesystem.mkdir), [`mkpath`](/base/file#Base.Filesystem.mkpath), [`mktempdir`](/base/file#Base.Filesystem.mktempdir-Tuple{AbstractString}).

**Examples**

```julia
julia> cd("/home/JuliaUser/Projects/julia")

julia> pwd()
"/home/JuliaUser/Projects/julia"

julia> cd()

julia> pwd()
"/home/JuliaUser"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L69-L88)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.cd-Tuple{Function}' href='#Base.Filesystem.cd-Tuple{Function}'>#</a>&nbsp;<b><u>Base.Filesystem.cd</u></b> &mdash; <i>Method</i>.




```julia
cd(f::Function, dir::AbstractString=homedir())
```


Temporarily change the current working directory to `dir`, apply function `f` and finally return to the original directory.

**Examples**

```julia
julia> pwd()
"/home/JuliaUser"

julia> cd(readdir, "/home/JuliaUser/Projects/julia")
34-element Array{String,1}:
 ".circleci"
 ".freebsdci.sh"
 ".git"
 ".gitattributes"
 ".github"
 ⋮
 "test"
 "ui"
 "usr"
 "usr-staging"

julia> pwd()
"/home/JuliaUser"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L119-L146)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.readdir' href='#Base.Filesystem.readdir'>#</a>&nbsp;<b><u>Base.Filesystem.readdir</u></b> &mdash; <i>Function</i>.




```julia
readdir(dir::AbstractString=pwd();
    join::Bool = false,
    sort::Bool = true,
) -> Vector{String}
```


Return the names in the directory `dir` or the current working directory if not given. When `join` is false, `readdir` returns just the names in the directory as is; when `join` is true, it returns `joinpath(dir, name)` for each `name` so that the returned strings are full paths. If you want to get absolute paths back, call `readdir` with an absolute directory path and `join` set to true.

By default, `readdir` sorts the list of names it returns. If you want to skip sorting the names and get them in the order that the file system lists them, you can use `readdir(dir, sort=false)` to opt out of sorting.

See also: [`walkdir`](/base/file#Base.Filesystem.walkdir).

::: tip Julia 1.4

The `join` and `sort` keyword arguments require at least Julia 1.4.

:::

**Examples**

```julia
julia> cd("/home/JuliaUser/dev/julia")

julia> readdir()
30-element Array{String,1}:
 ".appveyor.yml"
 ".git"
 ".gitattributes"
 ⋮
 "ui"
 "usr"
 "usr-staging"

julia> readdir(join=true)
30-element Array{String,1}:
 "/home/JuliaUser/dev/julia/.appveyor.yml"
 "/home/JuliaUser/dev/julia/.git"
 "/home/JuliaUser/dev/julia/.gitattributes"
 ⋮
 "/home/JuliaUser/dev/julia/ui"
 "/home/JuliaUser/dev/julia/usr"
 "/home/JuliaUser/dev/julia/usr-staging"

julia> readdir("base")
145-element Array{String,1}:
 ".gitignore"
 "Base.jl"
 "Enums.jl"
 ⋮
 "version_git.sh"
 "views.jl"
 "weakkeydict.jl"

julia> readdir("base", join=true)
145-element Array{String,1}:
 "base/.gitignore"
 "base/Base.jl"
 "base/Enums.jl"
 ⋮
 "base/version_git.sh"
 "base/views.jl"
 "base/weakkeydict.jl"

julia> readdir(abspath("base"), join=true)
145-element Array{String,1}:
 "/home/JuliaUser/dev/julia/base/.gitignore"
 "/home/JuliaUser/dev/julia/base/Base.jl"
 "/home/JuliaUser/dev/julia/base/Enums.jl"
 ⋮
 "/home/JuliaUser/dev/julia/base/version_git.sh"
 "/home/JuliaUser/dev/julia/base/views.jl"
 "/home/JuliaUser/dev/julia/base/weakkeydict.jl"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L856-L931)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.walkdir' href='#Base.Filesystem.walkdir'>#</a>&nbsp;<b><u>Base.Filesystem.walkdir</u></b> &mdash; <i>Function</i>.




```julia
walkdir(dir; topdown=true, follow_symlinks=false, onerror=throw)
```


Return an iterator that walks the directory tree of a directory. The iterator returns a tuple containing `(rootpath, dirs, files)`. The directory tree can be traversed top-down or bottom-up. If `walkdir` or `stat` encounters a `IOError` it will rethrow the error by default. A custom error handling function can be provided through `onerror` keyword argument. `onerror` is called with a `IOError` as argument.

See also: [`readdir`](/base/file#Base.Filesystem.readdir).

**Examples**

```julia
for (root, dirs, files) in walkdir(".")
    println("Directories in $root")
    for dir in dirs
        println(joinpath(root, dir)) # path to directories
    end
    println("Files in $root")
    for file in files
        println(joinpath(root, file)) # path to files
    end
end
```


```julia
julia> mkpath("my/test/dir");

julia> itr = walkdir("my");

julia> (root, dirs, files) = first(itr)
("my", ["test"], String[])

julia> (root, dirs, files) = first(itr)
("my/test", ["dir"], String[])

julia> (root, dirs, files) = first(itr)
("my/test/dir", String[], String[])
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L1038-L1078)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mkdir' href='#Base.Filesystem.mkdir'>#</a>&nbsp;<b><u>Base.Filesystem.mkdir</u></b> &mdash; <i>Function</i>.




```julia
mkdir(path::AbstractString; mode::Unsigned = 0o777)
```


Make a new directory with name `path` and permissions `mode`. `mode` defaults to `0o777`, modified by the current file creation mask. This function never creates more than one directory. If the directory already exists, or some intermediate directories do not exist, this function throws an error. See [`mkpath`](/base/file#Base.Filesystem.mkpath) for a function which creates all required intermediate directories. Return `path`.

**Examples**

```julia
julia> mkdir("testingdir")
"testingdir"

julia> cd("testingdir")

julia> pwd()
"/home/JuliaUser/testingdir"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L156-L176)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mkpath' href='#Base.Filesystem.mkpath'>#</a>&nbsp;<b><u>Base.Filesystem.mkpath</u></b> &mdash; <i>Function</i>.




```julia
mkpath(path::AbstractString; mode::Unsigned = 0o777)
```


Create all intermediate directories in the `path` as required. Directories are created with the permissions `mode` which defaults to `0o777` and is modified by the current file creation mask. Unlike [`mkdir`](/base/file#Base.Filesystem.mkdir), `mkpath` does not error if `path` (or parts of it) already exists. However, an error will be thrown if `path` (or parts of it) points to an existing file. Return `path`.

If `path` includes a filename you will probably want to use `mkpath(dirname(path))` to avoid creating a directory using the filename.

**Examples**

```julia
julia> cd(mktempdir())

julia> mkpath("my/test/dir") # creates three directories
"my/test/dir"

julia> readdir()
1-element Array{String,1}:
 "my"

julia> cd("my")

julia> readdir()
1-element Array{String,1}:
 "test"

julia> readdir("test")
1-element Array{String,1}:
 "dir"

julia> mkpath("intermediate_dir/actually_a_directory.txt") # creates two directories
"intermediate_dir/actually_a_directory.txt"

julia> isdir("intermediate_dir/actually_a_directory.txt")
true

```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L194-L234)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.hardlink' href='#Base.Filesystem.hardlink'>#</a>&nbsp;<b><u>Base.Filesystem.hardlink</u></b> &mdash; <i>Function</i>.




```julia
hardlink(src::AbstractString, dst::AbstractString)
```


Creates a hard link to an existing source file `src` with the name `dst`. The destination, `dst`, must not exist.

See also: [`symlink`](/base/file#Base.Filesystem.symlink).

::: tip Julia 1.8

This method was added in Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L1164-L1174)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.symlink' href='#Base.Filesystem.symlink'>#</a>&nbsp;<b><u>Base.Filesystem.symlink</u></b> &mdash; <i>Function</i>.




```julia
symlink(target::AbstractString, link::AbstractString; dir_target = false)
```


Creates a symbolic link to `target` with the name `link`.

On Windows, symlinks must be explicitly declared as referring to a directory or not.  If `target` already exists, by default the type of `link` will be auto- detected, however if `target` does not exist, this function defaults to creating a file symlink unless `dir_target` is set to `true`.  Note that if the user sets `dir_target` but `target` exists and is a file, a directory symlink will still be created, but dereferencing the symlink will fail, just as if the user creates a file symlink (by calling `symlink()` with `dir_target` set to `false` before the directory is created) and tries to dereference it to a directory.

Additionally, there are two methods of making a link on Windows; symbolic links and junction points.  Junction points are slightly more efficient, but do not support relative paths, so if a relative directory symlink is requested (as denoted by `isabspath(target)` returning `false`) a symlink will be used, else a junction point will be used.  Best practice for creating symlinks on Windows is to create them only after the files/directories they reference are already created.

See also: [`hardlink`](/base/file#Base.Filesystem.hardlink).

::: tip Note

This function raises an error under operating systems that do not support soft symbolic links, such as Windows XP.

:::

::: tip Julia 1.6

The `dir_target` keyword argument was added in Julia 1.6.  Prior to this, symlinks to nonexistent paths on windows would always be file symlinks, and relative symlinks to directories were not supported.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L1184-L1216)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.readlink' href='#Base.Filesystem.readlink'>#</a>&nbsp;<b><u>Base.Filesystem.readlink</u></b> &mdash; <i>Function</i>.




```julia
readlink(path::AbstractString) -> String
```


Return the target location a symbolic link `path` points to.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L1260-L1264)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.chmod' href='#Base.Filesystem.chmod'>#</a>&nbsp;<b><u>Base.Filesystem.chmod</u></b> &mdash; <i>Function</i>.




```julia
chmod(path::AbstractString, mode::Integer; recursive::Bool=false)
```


Change the permissions mode of `path` to `mode`. Only integer `mode`s (e.g. `0o777`) are currently supported. If `recursive=true` and the path is a directory all permissions in that directory will be recursively changed. Return `path`.

::: tip Note

Prior to Julia 1.6, this did not correctly manipulate filesystem ACLs  on Windows, therefore it would only set read-only bits on files.  It  now is able to manipulate ACLs.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L1284-L1296)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.chown' href='#Base.Filesystem.chown'>#</a>&nbsp;<b><u>Base.Filesystem.chown</u></b> &mdash; <i>Function</i>.




```julia
chown(path::AbstractString, owner::Integer, group::Integer=-1)
```


Change the owner and/or group of `path` to `owner` and/or `group`. If the value entered for `owner` or `group` is `-1` the corresponding ID will not change. Only integer `owner`s and `group`s are currently supported. Return `path`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L1310-L1316)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.RawFD' href='#Base.Libc.RawFD'>#</a>&nbsp;<b><u>Base.Libc.RawFD</u></b> &mdash; <i>Type</i>.




```julia
RawFD
```


Primitive type which wraps the native OS file descriptor. `RawFD`s can be passed to methods like [`stat`](/base/file#Base.stat) to discover information about the underlying file, and can also be used to open streams, with the `RawFD` describing the OS file backing the stream.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/libc.jl#L25-L33)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.stat' href='#Base.stat'>#</a>&nbsp;<b><u>Base.stat</u></b> &mdash; <i>Function</i>.




```julia
stat(file)
```


Return a structure whose fields contain information about the file. The fields of the structure are:

| Name    | Type                            | Description                                                        |
|:------- |:------------------------------- |:------------------------------------------------------------------ |
| desc    | `Union{String, Base.OS_HANDLE}` | The path or OS file descriptor                                     |
| size    | `Int64`                         | The size (in bytes) of the file                                    |
| device  | `UInt`                          | ID of the device that contains the file                            |
| inode   | `UInt`                          | The inode number of the file                                       |
| mode    | `UInt`                          | The protection mode of the file                                    |
| nlink   | `Int`                           | The number of hard links to the file                               |
| uid     | `UInt`                          | The user id of the owner of the file                               |
| gid     | `UInt`                          | The group id of the file owner                                     |
| rdev    | `UInt`                          | If this file refers to a device, the ID of the device it refers to |
| blksize | `Int64`                         | The file-system preferred block size for the file                  |
| blocks  | `Int64`                         | The number of 512-byte blocks allocated                            |
| mtime   | `Float64`                       | Unix timestamp of when the file was last modified                  |
| ctime   | `Float64`                       | Unix timestamp of when the file&#39;s metadata was changed         |



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L194-L215)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.diskstat' href='#Base.Filesystem.diskstat'>#</a>&nbsp;<b><u>Base.Filesystem.diskstat</u></b> &mdash; <i>Function</i>.




```julia
diskstat(path=pwd())
```


Returns statistics in bytes about the disk that contains the file or directory pointed at by `path`. If no argument is passed, statistics about the disk that contains the current working directory are returned.

::: tip Julia 1.8

This method was added in Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L1357-L1366)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.lstat' href='#Base.Filesystem.lstat'>#</a>&nbsp;<b><u>Base.Filesystem.lstat</u></b> &mdash; <i>Function</i>.




```julia
lstat(file)
```


Like [`stat`](/base/file#Base.stat), but for symbolic links gets the info for the link itself rather than the file it refers to. This function must be called on a file path rather than a file object or a file descriptor.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L218-L225)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.ctime' href='#Base.Filesystem.ctime'>#</a>&nbsp;<b><u>Base.Filesystem.ctime</u></b> &mdash; <i>Function</i>.




```julia
ctime(file)
```


Equivalent to `stat(file).ctime`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L312-L316)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mtime' href='#Base.Filesystem.mtime'>#</a>&nbsp;<b><u>Base.Filesystem.mtime</u></b> &mdash; <i>Function</i>.




```julia
mtime(file)
```


Equivalent to `stat(file).mtime`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L305-L309)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.filemode' href='#Base.Filesystem.filemode'>#</a>&nbsp;<b><u>Base.Filesystem.filemode</u></b> &mdash; <i>Function</i>.




```julia
filemode(file)
```


Equivalent to `stat(file).mode`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L275-L279)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.filesize' href='#Base.filesize'>#</a>&nbsp;<b><u>Base.filesize</u></b> &mdash; <i>Function</i>.




```julia
filesize(path...)
```


Equivalent to `stat(file).size`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L298-L302)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.uperm' href='#Base.Filesystem.uperm'>#</a>&nbsp;<b><u>Base.Filesystem.uperm</u></b> &mdash; <i>Function</i>.




```julia
uperm(file)
```


Get the permissions of the owner of the file as a bitfield of

| Value | Description        |
|:----- |:------------------ |
| 01    | Execute Permission |
| 02    | Write Permission   |
| 04    | Read Permission    |


For allowed arguments, see [`stat`](/base/file#Base.stat).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L443-L455)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.gperm' href='#Base.Filesystem.gperm'>#</a>&nbsp;<b><u>Base.Filesystem.gperm</u></b> &mdash; <i>Function</i>.




```julia
gperm(file)
```


Like [`uperm`](/base/file#Base.Filesystem.uperm) but gets the permissions of the group owning the file.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L458-L462)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.operm' href='#Base.Filesystem.operm'>#</a>&nbsp;<b><u>Base.Filesystem.operm</u></b> &mdash; <i>Function</i>.




```julia
operm(file)
```


Like [`uperm`](/base/file#Base.Filesystem.uperm) but gets the permissions for people who neither own the file nor are a member of the group owning the file


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L465-L470)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.cp' href='#Base.Filesystem.cp'>#</a>&nbsp;<b><u>Base.Filesystem.cp</u></b> &mdash; <i>Function</i>.




```julia
cp(src::AbstractString, dst::AbstractString; force::Bool=false, follow_symlinks::Bool=false)
```


Copy the file, link, or directory from `src` to `dst`. `force=true` will first remove an existing `dst`.

If `follow_symlinks=false`, and `src` is a symbolic link, `dst` will be created as a symbolic link. If `follow_symlinks=true` and `src` is a symbolic link, `dst` will be a copy of the file or directory `src` refers to. Return `dst`.

::: tip Note

The `cp` function is different from the `cp` command. The `cp` function always operates on the assumption that `dst` is a file, while the command does different things depending on whether `dst` is a directory or a file. Using `force=true` when `dst` is a directory will result in loss of all the contents present in the `dst` directory, and `dst` will become a file that has the contents of `src` instead.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L372-L389)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.download' href='#Base.download'>#</a>&nbsp;<b><u>Base.download</u></b> &mdash; <i>Function</i>.




```julia
download(url::AbstractString, [path::AbstractString = tempname()]) -> path
```


Download a file from the given url, saving it to the location `path`, or if not specified, a temporary path. Returns the path of the downloaded file.

::: tip Note

Since Julia 1.6, this function is deprecated and is just a thin wrapper around `Downloads.download`. In new code, you should use that function directly instead of calling this.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/download.jl#L8-L18)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mv' href='#Base.Filesystem.mv'>#</a>&nbsp;<b><u>Base.Filesystem.mv</u></b> &mdash; <i>Function</i>.




```julia
mv(src::AbstractString, dst::AbstractString; force::Bool=false)
```


Move the file, link, or directory from `src` to `dst`. `force=true` will first remove an existing `dst`. Return `dst`.

**Examples**

```julia
julia> write("hello.txt", "world");

julia> mv("hello.txt", "goodbye.txt")
"goodbye.txt"

julia> "hello.txt" in readdir()
false

julia> readline("goodbye.txt")
"world"

julia> write("hello.txt", "world2");

julia> mv("hello.txt", "goodbye.txt")
ERROR: ArgumentError: 'goodbye.txt' exists. `force=true` is required to remove 'goodbye.txt' before moving.
Stacktrace:
 [1] #checkfor_mv_cp_cptree#10(::Bool, ::Function, ::String, ::String, ::String) at ./file.jl:293
[...]

julia> mv("hello.txt", "goodbye.txt", force=true)
"goodbye.txt"

julia> rm("goodbye.txt");

```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L403-L437)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.rm' href='#Base.Filesystem.rm'>#</a>&nbsp;<b><u>Base.Filesystem.rm</u></b> &mdash; <i>Function</i>.




```julia
rm(path::AbstractString; force::Bool=false, recursive::Bool=false)
```


Delete the file, link, or empty directory at the given path. If `force=true` is passed, a non-existing path is not treated as error. If `recursive=true` is passed and the path is a directory, then all contents are removed recursively.

**Examples**

```julia
julia> mkpath("my/test/dir");

julia> rm("my", recursive=true)

julia> rm("this_file_does_not_exist", force=true)

julia> rm("this_file_does_not_exist")
ERROR: IOError: unlink("this_file_does_not_exist"): no such file or directory (ENOENT)
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L256-L276)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.touch' href='#Base.Filesystem.touch'>#</a>&nbsp;<b><u>Base.Filesystem.touch</u></b> &mdash; <i>Function</i>.




```julia
Base.touch(::Pidfile.LockMonitor)
```


Update the `mtime` on the lock, to indicate it is still fresh.

See also the `refresh` keyword in the [`mkpidlock`](/stdlib/FileWatching#FileWatching.Pidfile.mkpidlock) constructor.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/FileWatching/src/pidfile.jl#L124-L130)



```julia
touch(path::AbstractString)
touch(fd::File)
```


Update the last-modified timestamp on a file to the current time.

If the file does not exist a new file is created.

Return `path`.

**Examples**

```julia
julia> write("my_little_file", 2);

julia> mtime("my_little_file")
1.5273815391135583e9

julia> touch("my_little_file");

julia> mtime("my_little_file")
1.527381559163435e9
```


We can see the [`mtime`](/base/file#Base.Filesystem.mtime) has been modified by `touch`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L444-L468)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.tempname' href='#Base.Filesystem.tempname'>#</a>&nbsp;<b><u>Base.Filesystem.tempname</u></b> &mdash; <i>Function</i>.




```julia
tempname(parent=tempdir(); cleanup=true, suffix="") -> String
```


Generate a temporary file path. This function only returns a path; no file is created. The path is likely to be unique, but this cannot be guaranteed due to the very remote possibility of two simultaneous calls to `tempname` generating the same file name. The name is guaranteed to differ from all files already existing at the time of the call to `tempname`.

When called with no arguments, the temporary name will be an absolute path to a temporary name in the system temporary directory as given by `tempdir()`. If a `parent` directory argument is given, the temporary path will be in that directory instead. If a suffix is given the tempname will end with that suffix and be tested for uniqueness with that suffix.

The `cleanup` option controls whether the process attempts to delete the returned path automatically when the process exits. Note that the `tempname` function does not create any file or directory at the returned location, so there is nothing to cleanup unless you create a file or directory there. If you do and `cleanup` is `true` it will be deleted upon process termination.

::: tip Julia 1.4

The `parent` and `cleanup` arguments were added in 1.4. Prior to Julia 1.4 the path `tempname` would never be cleaned up at process termination.

:::

::: tip Julia 1.12

The `suffix` keyword argument was added in Julia 1.12.

:::

::: warning Warning

This can lead to security holes if another process obtains the same file name and creates the file before you are able to. Open the file with `JL_O_EXCL` if this is a concern. Using [`mktemp()`](/base/file#Base.Filesystem.mktemp-Tuple{AbstractString}) is also recommended instead.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L696-L730)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.tempdir' href='#Base.Filesystem.tempdir'>#</a>&nbsp;<b><u>Base.Filesystem.tempdir</u></b> &mdash; <i>Function</i>.




```julia
tempdir()
```


Gets the path of the temporary directory. On Windows, `tempdir()` uses the first environment variable found in the ordered list `TMP`, `TEMP`, `USERPROFILE`. On all other operating systems, `tempdir()` uses the first environment variable found in the ordered list `TMPDIR`, `TMP`, `TEMP`, and `TEMPDIR`. If none of these are found, the path `"/tmp"` is used.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L480-L487)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mktemp-Tuple{AbstractString}' href='#Base.Filesystem.mktemp-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.Filesystem.mktemp</u></b> &mdash; <i>Method</i>.




```julia
mktemp(parent=tempdir(); cleanup=true) -> (path, io)
```


Return `(path, io)`, where `path` is the path of a new temporary file in `parent` and `io` is an open file object for this path. The `cleanup` option controls whether the temporary file is automatically deleted when the process exits.

::: tip Julia 1.3

The `cleanup` keyword argument was added in Julia 1.3. Relatedly, starting from 1.3, Julia will remove the temporary paths created by `mktemp` when the Julia process exits, unless `cleanup` is explicitly set to `false`.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L733-L744)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mktemp-Tuple{Function, AbstractString}' href='#Base.Filesystem.mktemp-Tuple{Function, AbstractString}'>#</a>&nbsp;<b><u>Base.Filesystem.mktemp</u></b> &mdash; <i>Method</i>.




```julia
mktemp(f::Function, parent=tempdir())
```


Apply the function `f` to the result of [`mktemp(parent)`](/base/file#Base.Filesystem.mktemp-Tuple{AbstractString}) and remove the temporary file upon completion.

See also: [`mktempdir`](/base/file#Base.Filesystem.mktempdir-Tuple{AbstractString}).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L795-L802)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mktempdir-Tuple{AbstractString}' href='#Base.Filesystem.mktempdir-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.Filesystem.mktempdir</u></b> &mdash; <i>Method</i>.




```julia
mktempdir(parent=tempdir(); prefix="jl_", cleanup=true) -> path
```


Create a temporary directory in the `parent` directory with a name constructed from the given `prefix` and a random suffix, and return its path. Additionally, on some platforms, any trailing `'X'` characters in `prefix` may be replaced with random characters. If `parent` does not exist, throw an error. The `cleanup` option controls whether the temporary directory is automatically deleted when the process exits.

::: tip Julia 1.2

The `prefix` keyword argument was added in Julia 1.2.

:::

::: tip Julia 1.3

The `cleanup` keyword argument was added in Julia 1.3. Relatedly, starting from 1.3, Julia will remove the temporary paths created by `mktempdir` when the Julia process exits, unless `cleanup` is explicitly set to `false`.

:::

See also: [`mktemp`](/base/file#Base.Filesystem.mktemp-Tuple{AbstractString}), [`mkdir`](/base/file#Base.Filesystem.mkdir).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L747-L766)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.mktempdir-Tuple{Function, AbstractString}' href='#Base.Filesystem.mktempdir-Tuple{Function, AbstractString}'>#</a>&nbsp;<b><u>Base.Filesystem.mktempdir</u></b> &mdash; <i>Method</i>.




```julia
mktempdir(f::Function, parent=tempdir(); prefix="jl_")
```


Apply the function `f` to the result of [`mktempdir(parent; prefix)`](/base/file#Base.Filesystem.mktempdir-Tuple{AbstractString}) and remove the temporary directory and all of its contents upon completion.

See also: [`mktemp`](/base/file#Base.Filesystem.mktemp-Tuple{AbstractString}), [`mkdir`](/base/file#Base.Filesystem.mkdir).

::: tip Julia 1.2

The `prefix` keyword argument was added in Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/file.jl#L820-L830)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.isblockdev' href='#Base.Filesystem.isblockdev'>#</a>&nbsp;<b><u>Base.Filesystem.isblockdev</u></b> &mdash; <i>Function</i>.




```julia
isblockdev(path) -> Bool
```


Return `true` if `path` is a block device, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L372-L376)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.ischardev' href='#Base.Filesystem.ischardev'>#</a>&nbsp;<b><u>Base.Filesystem.ischardev</u></b> &mdash; <i>Function</i>.




```julia
ischardev(path) -> Bool
```


Return `true` if `path` is a character device, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L347-L351)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.isdir' href='#Base.Filesystem.isdir'>#</a>&nbsp;<b><u>Base.Filesystem.isdir</u></b> &mdash; <i>Function</i>.




```julia
isdir(path) -> Bool
```


Return `true` if `path` is a directory, `false` otherwise.

**Examples**

```julia
julia> isdir(homedir())
true

julia> isdir("not/a/directory")
false
```


See also [`isfile`](/base/file#Base.Filesystem.isfile) and [`ispath`](/base/file#Base.Filesystem.ispath).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L354-L369)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.isfifo' href='#Base.Filesystem.isfifo'>#</a>&nbsp;<b><u>Base.Filesystem.isfifo</u></b> &mdash; <i>Function</i>.




```julia
isfifo(path) -> Bool
```


Return `true` if `path` is a FIFO, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L340-L344)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.isfile' href='#Base.Filesystem.isfile'>#</a>&nbsp;<b><u>Base.Filesystem.isfile</u></b> &mdash; <i>Function</i>.




```julia
isfile(path) -> Bool
```


Return `true` if `path` is a regular file, `false` otherwise.

**Examples**

```julia
julia> isfile(homedir())
false

julia> filename = "test_file.txt";

julia> write(filename, "Hello world!");

julia> isfile(filename)
true

julia> rm(filename);

julia> isfile(filename)
false
```


See also [`isdir`](/base/file#Base.Filesystem.isdir) and [`ispath`](/base/file#Base.Filesystem.ispath).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L379-L403)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.islink' href='#Base.Filesystem.islink'>#</a>&nbsp;<b><u>Base.Filesystem.islink</u></b> &mdash; <i>Function</i>.




```julia
islink(path) -> Bool
```


Return `true` if `path` is a symbolic link, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L406-L410)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.ismount' href='#Base.Filesystem.ismount'>#</a>&nbsp;<b><u>Base.Filesystem.ismount</u></b> &mdash; <i>Function</i>.




```julia
ismount(path) -> Bool
```


Return `true` if `path` is a mount point, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L511-L515)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.ispath' href='#Base.Filesystem.ispath'>#</a>&nbsp;<b><u>Base.Filesystem.ispath</u></b> &mdash; <i>Function</i>.




```julia
ispath(path) -> Bool
```


Return `true` if a valid filesystem entity exists at `path`, otherwise returns `false`. This is the generalization of [`isfile`](/base/file#Base.Filesystem.isfile), [`isdir`](/base/file#Base.Filesystem.isdir) etc.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L321-L327)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.issetgid' href='#Base.Filesystem.issetgid'>#</a>&nbsp;<b><u>Base.Filesystem.issetgid</u></b> &mdash; <i>Function</i>.




```julia
issetgid(path) -> Bool
```


Return `true` if `path` has the setgid flag set, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L429-L433)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.issetuid' href='#Base.Filesystem.issetuid'>#</a>&nbsp;<b><u>Base.Filesystem.issetuid</u></b> &mdash; <i>Function</i>.




```julia
issetuid(path) -> Bool
```


Return `true` if `path` has the setuid flag set, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L422-L426)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.issocket' href='#Base.Filesystem.issocket'>#</a>&nbsp;<b><u>Base.Filesystem.issocket</u></b> &mdash; <i>Function</i>.




```julia
issocket(path) -> Bool
```


Return `true` if `path` is a socket, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L413-L417)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.issticky' href='#Base.Filesystem.issticky'>#</a>&nbsp;<b><u>Base.Filesystem.issticky</u></b> &mdash; <i>Function</i>.




```julia
issticky(path) -> Bool
```


Return `true` if `path` has the sticky bit set, `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L436-L440)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.homedir' href='#Base.Filesystem.homedir'>#</a>&nbsp;<b><u>Base.Filesystem.homedir</u></b> &mdash; <i>Function</i>.




```julia
homedir() -> String
```


Return the current user&#39;s home directory.

::: tip Note

`homedir` determines the home directory via `libuv`&#39;s `uv_os_homedir`. For details (for example on how to specify the home directory via environment variables), see the [`uv_os_homedir` documentation](http://docs.libuv.org/en/v1.x/misc.html#c.uv_os_homedir).

:::

See also [`Sys.username`](/base/base#Base.Sys.username).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L71-L82)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.dirname' href='#Base.Filesystem.dirname'>#</a>&nbsp;<b><u>Base.Filesystem.dirname</u></b> &mdash; <i>Function</i>.




```julia
dirname(path::AbstractString) -> String
```


Get the directory part of a path. Trailing characters (&#39;/&#39; or &#39;\&#39;) in the path are counted as part of the path.

**Examples**

```julia
julia> dirname("/home/myuser")
"/home"

julia> dirname("/home/myuser/")
"/home/myuser"
```


See also [`basename`](/base/file#Base.Filesystem.basename).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L166-L182)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.basename' href='#Base.Filesystem.basename'>#</a>&nbsp;<b><u>Base.Filesystem.basename</u></b> &mdash; <i>Function</i>.




```julia
basename(path::AbstractString) -> String
```


Get the file name part of a path.

::: tip Note

This function differs slightly from the Unix `basename` program, where trailing slashes are ignored, i.e. `$ basename /foo/bar/` returns `bar`, whereas `basename` in Julia returns an empty string `""`.

:::

**Examples**

```julia
julia> basename("/home/myuser/example.jl")
"example.jl"

julia> basename("/home/myuser/")
""
```


See also [`dirname`](/base/file#Base.Filesystem.dirname).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L185-L204)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.isabspath' href='#Base.Filesystem.isabspath'>#</a>&nbsp;<b><u>Base.Filesystem.isabspath</u></b> &mdash; <i>Function</i>.




```julia
isabspath(path::AbstractString) -> Bool
```


Determine whether a path is absolute (begins at the root directory).

**Examples**

```julia
julia> isabspath("/home")
true

julia> isabspath("home")
false
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L106-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.isdirpath' href='#Base.Filesystem.isdirpath'>#</a>&nbsp;<b><u>Base.Filesystem.isdirpath</u></b> &mdash; <i>Function</i>.




```julia
isdirpath(path::AbstractString) -> Bool
```


Determine whether a path refers to a directory (for example, ends with a path separator).

**Examples**

```julia
julia> isdirpath("/home")
false

julia> isdirpath("/home/")
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L122-L135)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.joinpath' href='#Base.Filesystem.joinpath'>#</a>&nbsp;<b><u>Base.Filesystem.joinpath</u></b> &mdash; <i>Function</i>.




```julia
joinpath(parts::AbstractString...) -> String
joinpath(parts::Vector{AbstractString}) -> String
joinpath(parts::Tuple{AbstractString}) -> String
```


Join path components into a full path. If some argument is an absolute path or (on Windows) has a drive specification that doesn&#39;t match the drive computed for the join of the preceding paths, then prior components are dropped.

Note on Windows since there is a current directory for each drive, `joinpath("c:", "foo")` represents a path relative to the current directory on drive &quot;c:&quot; so this is equal to &quot;c:foo&quot;, not &quot;c:\foo&quot;. Furthermore, `joinpath` treats this as a non-absolute path and ignores the drive letter casing, hence `joinpath("C:\A","c:b") = "C:\A\b"`.

**Examples**

```julia
julia> joinpath("/home/myuser", "example.jl")
"/home/myuser/example.jl"
```


```julia
julia> joinpath(["/home/myuser", "example.jl"])
"/home/myuser/example.jl"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L348-L372)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.abspath' href='#Base.Filesystem.abspath'>#</a>&nbsp;<b><u>Base.Filesystem.abspath</u></b> &mdash; <i>Function</i>.




```julia
abspath(path::AbstractString) -> String
```


Convert a path to an absolute path by adding the current directory if necessary. Also normalizes the path as in [`normpath`](/base/file#Base.Filesystem.normpath).

**Examples**

If you are in a directory called `JuliaExample` and the data you are using is two levels up relative to the `JuliaExample` directory, you could write:

```
abspath("../../data")
```


Which gives a path like `"/home/JuliaUser/data/"`.

See also [`joinpath`](/base/file#Base.Filesystem.joinpath), [`pwd`](/base/file#Base.Filesystem.pwd), [`expanduser`](/base/file#Base.Filesystem.expanduser).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L432-L447)



```julia
abspath(path::AbstractString, paths::AbstractString...) -> String
```


Convert a set of paths to an absolute path by joining them together and adding the current directory if necessary. Equivalent to `abspath(joinpath(path, paths...))`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L462-L467)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.normpath' href='#Base.Filesystem.normpath'>#</a>&nbsp;<b><u>Base.Filesystem.normpath</u></b> &mdash; <i>Function</i>.




```julia
normpath(path::AbstractString) -> String
```


Normalize a path, removing &quot;.&quot; and &quot;..&quot; entries and changing &quot;/&quot; to the canonical path separator for the system.

**Examples**

```julia
julia> normpath("/home/myuser/../example.jl")
"/home/example.jl"

julia> normpath("Documents/Julia") == joinpath("Documents", "Julia")
true
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L375-L389)



```julia
normpath(path::AbstractString, paths::AbstractString...) -> String
```


Convert a set of paths to a normalized path by joining them together and removing &quot;.&quot; and &quot;..&quot; entries. Equivalent to `normpath(joinpath(path, paths...))`.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L424-L429)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.realpath' href='#Base.Filesystem.realpath'>#</a>&nbsp;<b><u>Base.Filesystem.realpath</u></b> &mdash; <i>Function</i>.




```julia
realpath(path::AbstractString) -> String
```


Canonicalize a path by expanding symbolic links and removing &quot;.&quot; and &quot;..&quot; entries. On case-insensitive case-preserving filesystems (typically Mac and Windows), the filesystem&#39;s stored case for the path is returned.

(This function throws an exception if `path` does not exist in the filesystem.)


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L489-L497)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.relpath' href='#Base.Filesystem.relpath'>#</a>&nbsp;<b><u>Base.Filesystem.relpath</u></b> &mdash; <i>Function</i>.




```julia
relpath(path::AbstractString, startpath::AbstractString = ".") -> String
```


Return a relative filepath to `path` either from the current directory or from an optional start directory. This is a path computation: the filesystem is not accessed to confirm the existence or nature of `path` or `startpath`.

On Windows, case sensitivity is applied to every part of the path except drive letters. If `path` and `startpath` refer to different drives, the absolute path of `path` is returned.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L563-L572)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.expanduser' href='#Base.Filesystem.expanduser'>#</a>&nbsp;<b><u>Base.Filesystem.expanduser</u></b> &mdash; <i>Function</i>.




```julia
expanduser(path::AbstractString) -> AbstractString
```


On Unix systems, replace a tilde character at the start of a path with the current user&#39;s home directory.

See also: [`contractuser`](/base/file#Base.Filesystem.contractuser).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L544-L550)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.contractuser' href='#Base.Filesystem.contractuser'>#</a>&nbsp;<b><u>Base.Filesystem.contractuser</u></b> &mdash; <i>Function</i>.




```julia
contractuser(path::AbstractString) -> AbstractString
```


On Unix systems, if the path starts with `homedir()`, replace it with a tilde character.

See also: [`expanduser`](/base/file#Base.Filesystem.expanduser).


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L553-L559)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.samefile' href='#Base.Filesystem.samefile'>#</a>&nbsp;<b><u>Base.Filesystem.samefile</u></b> &mdash; <i>Function</i>.




```julia
samefile(path_a::AbstractString, path_b::AbstractString)
```


Check if the paths `path_a` and `path_b` refer to the same existing file or directory.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/stat.jl#L504-L508)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.splitdir' href='#Base.Filesystem.splitdir'>#</a>&nbsp;<b><u>Base.Filesystem.splitdir</u></b> &mdash; <i>Function</i>.




```julia
splitdir(path::AbstractString) -> (AbstractString, AbstractString)
```


Split a path into a tuple of the directory name and file name.

**Examples**

```julia
julia> splitdir("/home/myuser")
("/home", "myuser")
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L138-L148)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.splitdrive' href='#Base.Filesystem.splitdrive'>#</a>&nbsp;<b><u>Base.Filesystem.splitdrive</u></b> &mdash; <i>Function</i>.




```julia
splitdrive(path::AbstractString) -> (AbstractString, AbstractString)
```


On Windows, split a path into the drive letter part and the path part. On Unix systems, the first component is always the empty string.


[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L63-L68)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.splitext' href='#Base.Filesystem.splitext'>#</a>&nbsp;<b><u>Base.Filesystem.splitext</u></b> &mdash; <i>Function</i>.




```julia
splitext(path::AbstractString) -> (String, String)
```


If the last component of a path contains one or more dots, split the path into everything before the last dot and everything including and after the dot. Otherwise, return a tuple of the argument unmodified and the empty string. &quot;splitext&quot; is short for &quot;split extension&quot;.

**Examples**

```julia
julia> splitext("/home/myuser/example.jl")
("/home/myuser/example", ".jl")

julia> splitext("/home/myuser/example.tar.gz")
("/home/myuser/example.tar", ".gz")

julia> splitext("/home/my.user/example")
("/home/my.user/example", "")
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L207-L225)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Filesystem.splitpath' href='#Base.Filesystem.splitpath'>#</a>&nbsp;<b><u>Base.Filesystem.splitpath</u></b> &mdash; <i>Function</i>.




```julia
splitpath(path::AbstractString) -> Vector{String}
```


Split a file path into all its path components. This is the opposite of `joinpath`. Returns an array of substrings, one for each directory or file in the path, including the root directory if present.

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

**Examples**

```julia
julia> splitpath("/home/myuser/example.jl")
4-element Vector{String}:
 "/"
 "home"
 "myuser"
 "example.jl"
```



[source](https://github.com/JuliaLang/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/base/path.jl#L236-L255)

</div>
<br>
