
# Constants {#lib-constants}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.nothing' href='#Core.nothing'>#</a>&nbsp;<b><u>Core.nothing</u></b> &mdash; <i>Constant</i>.




```julia
nothing
```


The singleton instance of type [`Nothing`](/base/base#Core.Nothing), used by convention when there is no value to return (as in a C `void` function) or when a variable or field holds no value.

A return value of `nothing` is not displayed by the REPL and similar interactive environments.

See also: [`isnothing`](/base/base#Base.isnothing), [`something`](/base/base#Base.something), [`missing`](/manual/missing#missing).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/docs/basedocs.jl#L1563-L1572)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.PROGRAM_FILE' href='#Base.PROGRAM_FILE'>#</a>&nbsp;<b><u>Base.PROGRAM_FILE</u></b> &mdash; <i>Constant</i>.




```julia
PROGRAM_FILE
```


A string containing the script name passed to Julia from the command line. Note that the script name remains unchanged from within included files. Alternatively see [`@__FILE__`](/base/base#Base.@__FILE__).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/initdefs.jl#L5-L11)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ARGS' href='#Base.ARGS'>#</a>&nbsp;<b><u>Base.ARGS</u></b> &mdash; <i>Constant</i>.




```julia
ARGS
```


An array of the command line arguments passed to Julia, as strings.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/initdefs.jl#L14-L18)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.C_NULL' href='#Base.C_NULL'>#</a>&nbsp;<b><u>Base.C_NULL</u></b> &mdash; <i>Constant</i>.




```julia
C_NULL
```


The C null pointer constant, sometimes used when calling external code.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/pointer.jl#L13-L17)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.VERSION' href='#Base.VERSION'>#</a>&nbsp;<b><u>Base.VERSION</u></b> &mdash; <i>Constant</i>.




```julia
VERSION
```


A [`VersionNumber`](/base/base#Base.VersionNumber) object describing which version of Julia is in use. See also [Version Number Literals](/manual/strings#man-version-number-literals).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/version.jl#L242-L247)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.DEPOT_PATH' href='#Base.DEPOT_PATH'>#</a>&nbsp;<b><u>Base.DEPOT_PATH</u></b> &mdash; <i>Constant</i>.




```julia
DEPOT_PATH
```


A stack of &quot;depot&quot; locations where the package manager, as well as Julia&#39;s code loading mechanisms, look for package registries, installed packages, named environments, repo clones, cached compiled package images, and configuration files. By default it includes:
1. `~/.julia` where `~` is the user home as appropriate on the system;
  
2. an architecture-specific shared system directory, e.g. `/usr/local/share/julia`;
  
3. an architecture-independent shared system directory, e.g. `/usr/share/julia`.
  

So `DEPOT_PATH` might be:

```julia
[joinpath(homedir(), ".julia"), "/usr/local/share/julia", "/usr/share/julia"]
```


The first entry is the &quot;user depot&quot; and should be writable by and owned by the current user. The user depot is where: registries are cloned, new package versions are installed, named environments are created and updated, package repos are cloned, newly compiled package image files are saved, log files are written, development packages are checked out by default, and global configuration data is saved. Later entries in the depot path are treated as read-only and are appropriate for registries, packages, etc. installed and managed by system administrators.

`DEPOT_PATH` is populated based on the [`JULIA_DEPOT_PATH`](/manual/environment-variables#JULIA_DEPOT_PATH) environment variable if set.

**DEPOT_PATH contents**

Each entry in `DEPOT_PATH` is a path to a directory which contains subdirectories used by Julia for various purposes. Here is an overview of some of the subdirectories that may exist in a depot:
- `artifacts`: Contains content that packages use for which Pkg manages the installation of.
  
- `clones`: Contains full clones of package repos. Maintained by `Pkg.jl` and used as a cache.
  
- `config`: Contains julia-level configuration such as a `startup.jl`.
  
- `compiled`: Contains precompiled `*.ji` files for packages. Maintained by Julia.
  
- `dev`: Default directory for `Pkg.develop`. Maintained by `Pkg.jl` and the user.
  
- `environments`: Default package environments. For instance the global environment for a specific julia version. Maintained by `Pkg.jl`.
  
- `logs`: Contains logs of `Pkg` and `REPL` operations. Maintained by `Pkg.jl` and Julia.
  
- `packages`: Contains packages, some of which were explicitly installed and some which are implicit dependencies. Maintained by `Pkg.jl`.
  
- `registries`: Contains package registries. By default only `General`. Maintained by `Pkg.jl`.
  
- `scratchspaces`: Contains content that a package itself installs via the [`Scratch.jl`](https://github.com/JuliaPackaging/Scratch.jl) package. `Pkg.gc()` will delete content that is known to be unused.
  

::: tip Note

Packages that want to store content should use the `scratchspaces` subdirectory via [`Scratch.jl`](https://github.com/JuliaPackaging/Scratch.jl) instead of creating new subdirectories in the depot root.

:::

See also [`JULIA_DEPOT_PATH`](/manual/environment-variables#JULIA_DEPOT_PATH), and [Code Loading](/manual/code-loading#code-loading).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/initdefs.jl#L44-L94)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.LOAD_PATH' href='#Base.LOAD_PATH'>#</a>&nbsp;<b><u>Base.LOAD_PATH</u></b> &mdash; <i>Constant</i>.




```julia
LOAD_PATH
```


An array of paths for `using` and `import` statements to consider as project environments or package directories when loading code. It is populated based on the [`JULIA_LOAD_PATH`](/manual/environment-variables#JULIA_LOAD_PATH) environment variable if set; otherwise it defaults to `["@", "@v#.#", "@stdlib"]`. Entries starting with `@` have special meanings:
- `@` refers to the &quot;current active environment&quot;, the initial value of which is initially determined by the [`JULIA_PROJECT`](/manual/environment-variables#JULIA_PROJECT) environment variable or the `--project` command-line option.
  
- `@stdlib` expands to the absolute path of the current Julia installation&#39;s standard library directory.
  
- `@name` refers to a named environment, which are stored in depots (see [`JULIA_DEPOT_PATH`](/manual/environment-variables#JULIA_DEPOT_PATH)) under the `environments` subdirectory. The user&#39;s named environments are stored in `~/.julia/environments` so `@name` would refer to the environment in `~/.julia/environments/name` if it exists and contains a `Project.toml` file. If `name` contains `#` characters, then they are replaced with the major, minor and patch components of the Julia version number. For example, if you are running Julia 1.2 then `@v#.#` expands to `@v1.2` and will look for an environment by that name, typically at `~/.julia/environments/v1.2`.
  

The fully expanded value of `LOAD_PATH` that is searched for projects and packages can be seen by calling the `Base.load_path()` function.

See also [`JULIA_LOAD_PATH`](/manual/environment-variables#JULIA_LOAD_PATH), [`JULIA_PROJECT`](/manual/environment-variables#JULIA_PROJECT), [`JULIA_DEPOT_PATH`](/manual/environment-variables#JULIA_DEPOT_PATH), and [Code Loading](/manual/code-loading#code-loading).


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/initdefs.jl#L156-L190)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.BINDIR' href='#Base.Sys.BINDIR'>#</a>&nbsp;<b><u>Base.Sys.BINDIR</u></b> &mdash; <i>Constant</i>.




```julia
Sys.BINDIR::String
```


A string containing the full path to the directory containing the `julia` executable.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/sysinfo.jl#L43-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.CPU_THREADS' href='#Base.Sys.CPU_THREADS'>#</a>&nbsp;<b><u>Base.Sys.CPU_THREADS</u></b> &mdash; <i>Constant</i>.




```julia
Sys.CPU_THREADS::Int
```


The number of logical CPU cores available in the system, i.e. the number of threads that the CPU can run concurrently. Note that this is not necessarily the number of CPU cores, for example, in the presence of [hyper-threading](https://en.wikipedia.org/wiki/Hyper-threading).

See Hwloc.jl or CpuId.jl for extended information, including number of physical cores.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/sysinfo.jl#L62-L71)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.WORD_SIZE' href='#Base.Sys.WORD_SIZE'>#</a>&nbsp;<b><u>Base.Sys.WORD_SIZE</u></b> &mdash; <i>Constant</i>.




```julia
Sys.WORD_SIZE::Int
```


Standard word size on the current machine, in bits.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/sysinfo.jl#L96-L100)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.KERNEL' href='#Base.Sys.KERNEL'>#</a>&nbsp;<b><u>Base.Sys.KERNEL</u></b> &mdash; <i>Constant</i>.




```julia
Sys.KERNEL::Symbol
```


A symbol representing the name of the operating system, as returned by `uname` of the build configuration.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/sysinfo.jl#L82-L86)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.ARCH' href='#Base.Sys.ARCH'>#</a>&nbsp;<b><u>Base.Sys.ARCH</u></b> &mdash; <i>Constant</i>.




```julia
Sys.ARCH::Symbol
```


A symbol representing the architecture of the build configuration.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/sysinfo.jl#L74-L78)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.MACHINE' href='#Base.Sys.MACHINE'>#</a>&nbsp;<b><u>Base.Sys.MACHINE</u></b> &mdash; <i>Constant</i>.




```julia
Sys.MACHINE::String
```


A string containing the build triple.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/sysinfo.jl#L89-L93)

</div>
<br>

See also:
- [`stdin`](/base/io-network#Base.stdin)
  
- [`stdout`](/base/io-network#Base.stdout)
  
- [`stderr`](/base/io-network#Base.stderr)
  
- [`ENV`](/base/base#Base.ENV)
  
- [`ENDIAN_BOM`](/base/io-network#Base.ENDIAN_BOM)
  
