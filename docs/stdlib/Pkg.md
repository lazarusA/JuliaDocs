


# Pkg {#Pkg}

Pkg is Julia&#39;s builtin package manager, and handles operations such as installing, updating and removing packages.

::: tip Note

What follows is a very brief introduction to Pkg. For more information on `Project.toml` files, `Manifest.toml` files, package version compatibility (`[compat]`), environments, registries, etc., it is highly recommended to read the full manual, which is available here: [https://pkgdocs.julialang.org](https://pkgdocs.julialang.org). For a tutorial on creating packages, see [Creating Packages](https://docs.julialang.org/en/v1/tutorials/creating-packages/).

:::

What follows is a quick overview of the basic features of Pkg. It should help new users become familiar with basic Pkg features such as adding and removing packages and working with environments.

::: tip Note

Some Pkg output is omitted in this section in order to keep this basic guide focused. This will help maintain a good pace and not get bogged down in details. If you require more details, refer to subsequent sections of the Pkg manual.

:::

::: tip Note

This guide uses the Pkg REPL to execute Pkg commands. For non-interactive use, we recommend the Pkg API. The Pkg API is fully documented in the [API Reference](https://pkgdocs.julialang.org/v1/api/) section of the Pkg documentation.

:::

Pkg comes with a REPL. Enter the Pkg REPL by pressing `]` from the Julia REPL. To get back to the Julia REPL, press `Ctrl+C` or backspace (when the REPL cursor is at the beginning of the input).

Upon entering the Pkg REPL, you should see the following prompt:

```julia
(@v1.9) pkg>
```


To add a package, use `add`:

```julia
(@v1.9) pkg> add Example
   Resolving package versions...
   Installed Example ─ v0.5.3
    Updating `~/.julia/environments/v1.9/Project.toml`
  [7876af07] + Example v0.5.3
    Updating `~/.julia/environments/v1.9/Manifest.toml`
  [7876af07] + Example v0.5.3
```


After the package is installed, it can be loaded into the Julia session:

```julia
julia> import Example

julia> Example.hello("friend")
"Hello, friend"
```


We can also specify multiple packages at once to install:

```julia
(@v1.9) pkg> add JSON StaticArrays
```


The `status` command (or the shorter `st` command) can be used to see installed packages.

```julia
(@v1.9) pkg> st
Status `~/.julia/environments/v1.6/Project.toml`
  [7876af07] Example v0.5.3
  [682c06a0] JSON v0.21.3
  [90137ffa] StaticArrays v1.5.9
```


::: tip Note

Some Pkg REPL commands have a short and a long version of the command, for example `status` and `st`.

:::

To remove packages, use `rm` (or `remove`):

```julia
(@v1.9) pkg> rm JSON StaticArrays
```


Use `up` (or `update`) to update the installed packages

```julia
(@v1.9) pkg> up
```


If you have been following this guide it is likely that the packages installed are at the latest version so `up` will not do anything. Below we show the status output in the case where we deliberately have installed an old version of the Example package and then upgrade it:

```julia
(@v1.9) pkg> st
Status `~/.julia/environments/v1.9/Project.toml`
⌃ [7876af07] Example v0.5.1
Info Packages marked with ⌃ have new versions available and may be upgradable.

(@v1.9) pkg> up
    Updating `~/.julia/environments/v1.9/Project.toml`
  [7876af07] ↑ Example v0.5.1 ⇒ v0.5.3
```


We can see that the status output tells us that there is a newer version available and that `up` upgrades the package.

For more information about managing packages, see the [Managing Packages](https://pkgdocs.julialang.org/v1/managing-packages/) section of the documentation.

Up to this point, we have covered basic package management: adding, updating, and removing packages.

You may have noticed the `(@v1.9)` in the REPL prompt. This lets us know that `v1.9` is the **active environment**. Different environments can have different totally different packages and versions installed from another environment. The active environment is the environment that will be modified by Pkg commands such as `add`, `rm` and `update`.

Let&#39;s set up a new environment so we may experiment. To set the active environment, use `activate`:

```julia
(@v1.9) pkg> activate tutorial
[ Info: activating new environment at `~/tutorial/Project.toml`.
```


Pkg lets us know we are creating a new environment and that this environment will be stored in the `~/tutorial` directory. The path to the environment is created relative to the current working directory of the REPL.

Pkg has also updated the REPL prompt in order to reflect the new active environment:

```julia
(tutorial) pkg>
```


We can ask for information about the active environment by using `status`:

```julia
(tutorial) pkg> status
    Status `~/tutorial/Project.toml`
   (empty environment)
```


`~/tutorial/Project.toml` is the location of the active environment&#39;s **project file**. A project file is a [TOML](https://toml.io/en/) file where Pkg stores the packages that have been explicitly installed. Notice this new environment is empty. Let us add some packages and observe:

```julia
(tutorial) pkg> add Example JSON
...

(tutorial) pkg> status
    Status `~/tutorial/Project.toml`
  [7876af07] Example v0.5.3
  [682c06a0] JSON v0.21.3
```


We can see that the `tutorial` environment now contains `Example` and `JSON`.

::: tip Note

If you have the same package (at the same version) installed in multiple environments, the package will only be downloaded and stored on the hard drive once. This makes environments very lightweight and effectively free to create. Only using the default environment with a huge number of packages in it is a common beginners mistake in Julia. Learning how to use environments effectively will improve your experience with Julia packages.

:::

For more information about environments, see the [Working with Environments](https://pkgdocs.julialang.org/v1/environments/) section of the documentation.

If you are ever stuck, you can ask `Pkg` for help:

```julia
(@v1.9) pkg> ?
```


You should see a list of available commands along with short descriptions. You can ask for more detailed help by specifying a command:

```julia
(@v1.9) pkg> ?develop
```


This guide should help you get started with `Pkg`. `Pkg` has much more to offer in terms of powerful package management, read the full manual to learn more!