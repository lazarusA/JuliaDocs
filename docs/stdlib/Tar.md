


The `Tar` module provides a simple interface for handling tar archives, including creation of archives, extraction of selected files from an archive, and access to metadata.

# Tar
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Tar.create' href='#Tar.create'>#</a>&nbsp;<b><u>Tar.create</u></b> &mdash; <i>Function</i>.




```julia
create(
    [ predicate, ] dir, [ tarball ];
    [ skeleton, ] [ portable = false ]
) -> tarball

    predicate :: String --> Bool
    dir       :: AbstractString
    tarball   :: Union{AbstractString, AbstractCmd, IO}
    skeleton  :: Union{AbstractString, AbstractCmd, IO}
    portable  :: Bool
```


Create a tar archive (&quot;tarball&quot;) of the directory `dir`. The resulting archive is written to the path `tarball` or if no path is specified, a temporary path is created and returned by the function call. If `tarball` is an IO object then the tarball content is written to that handle instead (the handle is left open).

If a `predicate` function is passed, it is called on each system path that is encountered while recursively searching `dir` and `path` is only included in the tarball if `predicate(path)` is true. If `predicate(path)` returns false for a directory, then the directory is excluded entirely: nothing under that directory will be included in the archive.

If the `skeleton` keyword is passed then the file or IO handle given is used as a &quot;skeleton&quot; to generate the tarball. You create a skeleton file by passing the `skeleton` keyword to the `extract` command. If `create` is called with that skeleton file and the extracted files haven&#39;t changed, an identical tarball is recreated. The `skeleton` and `predicate` arguments cannot be used together.

If the `portable` flag is true then path names are checked for validity on Windows, which ensures that they don&#39;t contain illegal characters or have names that are reserved. See https://stackoverflow.com/a/31976060/659248 for details.


[source](https://github.com/JuliaIO/Tar.jl/blob/1114260f5c7a7b59441acadca2411fa227bb8a3b/src/Tar.jl#L65-L97)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Tar.extract' href='#Tar.extract'>#</a>&nbsp;<b><u>Tar.extract</u></b> &mdash; <i>Function</i>.




```julia
extract(
    [ predicate, ] tarball, [ dir ];
    [ skeleton = <none>, ]
    [ copy_symlinks = <auto>, ]
    [ set_permissions = true, ]
) -> dir

    predicate       :: Header --> Bool
    tarball         :: Union{AbstractString, AbstractCmd, IO}
    dir             :: AbstractString
    skeleton        :: Union{AbstractString, AbstractCmd, IO}
    copy_symlinks   :: Bool
    set_permissions :: Bool
```


Extract a tar archive (&quot;tarball&quot;) located at the path `tarball` into the directory `dir`. If `tarball` is an IO object instead of a path, then the archive contents will be read from that IO stream. The archive is extracted to `dir` which must either be an existing empty directory or a non-existent path which can be created as a new directory. If `dir` is not specified, the archive is extracted into a temporary directory which is returned by `extract`.

If a `predicate` function is passed, it is called on each `Header` object that is encountered while extracting `tarball` and the entry is only extracted if the `predicate(hdr)` is true. This can be used to selectively extract only parts of an archive, to skip entries that cause `extract` to throw an error, or to record what is extracted during the extraction process.

Before it is passed to the predicate function, the `Header` object is somewhat modified from the raw header in the tarball: the `path` field is normalized to remove `.` entries and replace multiple consecutive slashes with a single slash. If the entry has type `:hardlink`, the link target path is normalized the same way so that it will match the path of the target entry; the size field is set to the size of the target path (which must be an already-seen file).

If the `skeleton` keyword is passed then a &quot;skeleton&quot; of the extracted tarball is written to the file or IO handle given. This skeleton file can be used to recreate an identical tarball by passing the `skeleton` keyword to the `create` function. The `skeleton` and `predicate` arguments cannot be used together.

If `copy_symlinks` is `true` then instead of extracting symbolic links as such, they will be extracted as copies of what they link to if they are internal to the tarball and if it is possible to do so. Non-internal symlinks, such as a link to `/etc/passwd` will not be copied. Symlinks which are in any way cyclic will also not be copied and will instead be skipped. By default, `extract` will detect whether symlinks can be created in `dir` or not and will automatically copy symlinks if they cannot be created.

If `set_permissions` is `false`, no permissions are set on the extracted files.


[source](https://github.com/JuliaIO/Tar.jl/blob/1114260f5c7a7b59441acadca2411fa227bb8a3b/src/Tar.jl#L188-L237)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Tar.list' href='#Tar.list'>#</a>&nbsp;<b><u>Tar.list</u></b> &mdash; <i>Function</i>.




```julia
list(tarball; [ strict = true ]) -> Vector{Header}
list(callback, tarball; [ strict = true ])

    callback  :: Header, [ <data> ] --> Any
    tarball   :: Union{AbstractString, AbstractCmd, IO}
    strict    :: Bool
```


List the contents of a tar archive (&quot;tarball&quot;) located at the path `tarball`. If `tarball` is an IO handle, read the tar contents from that stream. Returns a vector of `Header` structs. See [`Header`](/stdlib/Tar#Tar.Header) for details.

If a `callback` is provided then instead of returning a vector of headers, the callback is called on each `Header`. This can be useful if the number of items in the tarball is large or if you want examine items prior to an error in the tarball. If the `callback` function can accept a second argument of either type `Vector{UInt8}` or `Vector{Pair{Symbol, String}}` then it will be called with a representation of the raw header data either as a single byte vector or as a vector of pairs mapping field names to the raw data for that field (if these fields are concatenated together, the result is the raw data of the header).

By default `list` will error if it encounters any tarball contents which the `extract` function would refuse to extract. With `strict=false` it will skip these checks and list all the the contents of the tar file whether `extract` would extract them or not. Beware that malicious tarballs can do all sorts of crafty and unexpected things to try to trick you into doing something bad.

If the `tarball` argument is a skeleton file (see `extract` and `create`) then `list` will detect that from the file header and appropriately list or iterate the headers of the skeleton file.


[source](https://github.com/JuliaIO/Tar.jl/blob/1114260f5c7a7b59441acadca2411fa227bb8a3b/src/Tar.jl#L132-L162)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Tar.rewrite' href='#Tar.rewrite'>#</a>&nbsp;<b><u>Tar.rewrite</u></b> &mdash; <i>Function</i>.




```julia
rewrite(
    [ predicate, ] old_tarball, [ new_tarball ];
    [ portable = false, ]
) -> new_tarball

    predicate   :: Header --> Bool
    old_tarball :: Union{AbstractString, AbstractCmd, IO}
    new_tarball :: Union{AbstractString, AbstractCmd, IO}
    portable    :: Bool
```


Rewrite `old_tarball` to the standard format that `create` generates, while also checking that it doesn&#39;t contain anything that would cause `extract` to raise an error. This is functionally equivalent to doing

```
Tar.create(Tar.extract(predicate, old_tarball), new_tarball)
```


However, it never extracts anything to disk and instead uses the `seek` function to navigate the old tarball&#39;s data. If no `new_tarball` argument is passed, the new tarball is written to a temporary file whose path is returned.

If a `predicate` function is passed, it is called on each `Header` object that is encountered while extracting `old_tarball` and the entry is skipped unless `predicate(hdr)` is true. This can be used to selectively rewrite only parts of an archive, to skip entries that would cause `extract` to throw an error, or to record what content is encountered during the rewrite process.

Before it is passed to the predicate function, the `Header` object is somewhat modified from the raw header in the tarball: the `path` field is normalized to remove `.` entries and replace multiple consecutive slashes with a single slash. If the entry has type `:hardlink`, the link target path is normalized the same way so that it will match the path of the target entry; the size field is set to the size of the target path (which must be an already-seen file).

If the `portable` flag is true then path names are checked for validity on Windows, which ensures that they don&#39;t contain illegal characters or have names that are reserved. See https://stackoverflow.com/a/31976060/659248 for details.


[source](https://github.com/JuliaIO/Tar.jl/blob/1114260f5c7a7b59441acadca2411fa227bb8a3b/src/Tar.jl#L286-L323)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Tar.tree_hash' href='#Tar.tree_hash'>#</a>&nbsp;<b><u>Tar.tree_hash</u></b> &mdash; <i>Function</i>.




```julia
tree_hash([ predicate, ] tarball;
          [ algorithm = "git-sha1", ]
          [ skip_empty = false ]) -> hash::String

    predicate  :: Header --> Bool
    tarball    :: Union{AbstractString, AbstractCmd, IO}
    algorithm  :: AbstractString
    skip_empty :: Bool
```


Compute a tree hash value for the file tree that the tarball contains. By default, this uses git&#39;s tree hashing algorithm with the SHA1 secure hash function (like current versions of git). This means that for any tarball whose file tree git can represent—i.e. one with only files, symlinks and non-empty directories—the hash value computed by this function will be the same as the hash value git would compute for that file tree. Note that tarballs can represent file trees with empty directories, which git cannot store, and this function can generate hashes for those, which will, by default (see `skip_empty` below for how to change this behavior), differ from the hash of a tarball which omits those empty directories. In short, the hash function agrees with git on all trees which git can represent, but extends (in a consistent way) the domain of hashable trees to other trees which git cannot represent.

If a `predicate` function is passed, it is called on each `Header` object that is encountered while processing `tarball` and an entry is only hashed if `predicate(hdr)` is true. This can be used to selectively hash only parts of an archive, to skip entries that cause `extract` to throw an error, or to record what is extracted during the hashing process.

Before it is passed to the predicate function, the `Header` object is somewhat modified from the raw header in the tarball: the `path` field is normalized to remove `.` entries and replace multiple consecutive slashes with a single slash. If the entry has type `:hardlink`, the link target path is normalized the same way so that it will match the path of the target entry; the size field is set to the size of the target path (which must be an already-seen file).

Currently supported values for `algorithm` are `git-sha1` (the default) and `git-sha256`, which uses the same basic algorithm as `git-sha1` but replaces the SHA1 hash function with SHA2-256, the hash function that git will transition to using in the future (due to known attacks on SHA1). Support for other file tree hashing algorithms may be added in the future.

The `skip_empty` option controls whether directories in the tarball which recursively contain no files or symlinks are included in the hash or ignored. In general, if you are hashing the content of a tarball or a file tree, you care about all directories, not just non-empty ones, so including these in the computed hash is the default. So why does this function even provide the option to skip empty directories? Because git refuses to store empty directories and will ignore them if you try to add them to a repo. So if you compute a reference tree hash by by adding files to a git repo and then asking git for the tree hash, the hash value that you get will match the hash value computed by `tree_hash` with `skip_empty=true`. In other words, this option allows `tree_hash` to emulate how git would hash a tree with empty directories. If you are hashing trees that may contain empty directories (i.e. do not come from a git repo), however, it is recommended that you hash them using a tool (such as this one) that does not ignore empty directories.


[source](https://github.com/JuliaIO/Tar.jl/blob/1114260f5c7a7b59441acadca2411fa227bb8a3b/src/Tar.jl#L346-L402)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Tar.Header' href='#Tar.Header'>#</a>&nbsp;<b><u>Tar.Header</u></b> &mdash; <i>Type</i>.




The `Header` type is a struct representing the essential metadata for a single record in a tar file with this definition:

```
struct Header
    path :: String # path relative to the root
    type :: Symbol # type indicator (see below)
    mode :: UInt16 # mode/permissions (best viewed in octal)
    size :: Int64  # size of record data in bytes
    link :: String # target path of a symlink
end
```


Types are represented with the following symbols: `file`, `hardlink`, `symlink`, `chardev`, `blockdev`, `directory`, `fifo`, or for unknown types, the typeflag character as a symbol. Note that [`extract`](/stdlib/Tar#Tar.extract) refuses to extract records types other than `file`, `symlink` and `directory`; [`list`](/stdlib/Tar#Tar.list) will only list other kinds of records if called with `strict=false`.

The tar format includes various other metadata about records, including user and group IDs, user and group names, and timestamps. The `Tar` package, by design, completely ignores these. When creating tar files, these fields are always set to zero/empty. When reading tar files, these fields are ignored aside from verifying header checksums for each header record for all fields.


[source](https://github.com/JuliaIO/Tar.jl/blob/1114260f5c7a7b59441acadca2411fa227bb8a3b/src/header.jl#L1-L24)

</div>
<br>
