

<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Libdl' href='#Libdl'>#</a>&nbsp;<b><u>Libdl</u></b> &mdash; <i>Module</i>.




The Libdl module in Julia provides specialized and lower-level facilities for dynamic linking with shared libraries. While Julia inherently supports linking to runtime shared libraries through the `ccall` intrinsic, `Libdl` extends this capability by offering additional, more granular control. It enables users to search for shared libraries both in memory and the filesystem, manually load them with specific runtime linker options, and look up library symbols as low-level pointers.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Libdl/src/Libdl.jl#L2-L7)

</div>
<br>

# Dynamic Linker {#Dynamic-Linker}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dlopen' href='#Base.Libc.Libdl.dlopen'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dlopen</u></b> &mdash; <i>Function</i>.




```julia
dlopen(libfile::AbstractString [, flags::Integer]; throw_error:Bool = true)
```


Load a shared library, returning an opaque handle.

The extension given by the constant `dlext` (`.so`, `.dll`, or `.dylib`) can be omitted from the `libfile` string, as it is automatically appended if needed.   If `libfile` is not an absolute path name, then the paths in the array `DL_LOAD_PATH` are searched for `libfile`, followed by the system load path.

The optional flags argument is a bitwise-or of zero or more of `RTLD_LOCAL`, `RTLD_GLOBAL`, `RTLD_LAZY`, `RTLD_NOW`, `RTLD_NODELETE`, `RTLD_NOLOAD`, `RTLD_DEEPBIND`, and `RTLD_FIRST`. These are converted to the corresponding flags of the POSIX (and/or GNU libc and/or MacOS) dlopen command, if possible, or are ignored if the specified functionality is not available on the current platform. The default flags are platform specific. On MacOS the default `dlopen` flags are `RTLD_LAZY|RTLD_DEEPBIND|RTLD_GLOBAL` while on other platforms the defaults are `RTLD_LAZY|RTLD_DEEPBIND|RTLD_LOCAL`. An important usage of these flags is to specify non default behavior for when the dynamic library loader binds library references to exported symbols and if the bound references are put into process local or global scope. For instance `RTLD_LAZY|RTLD_DEEPBIND|RTLD_GLOBAL` allows the library&#39;s symbols to be available for usage in other shared libraries, addressing situations where there are dependencies between shared libraries.

If the library cannot be found, this method throws an error, unless the keyword argument `throw_error` is set to `false`, in which case this method returns `nothing`.

::: tip Note

From Julia 1.6 on, this method replaces paths starting with `@executable_path/` with  the path to the Julia executable, allowing for relocatable relative-path loads. In  Julia 1.5 and earlier, this only worked on macOS.

:::


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L82-L113)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dlopen_e' href='#Base.Libc.Libdl.dlopen_e'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dlopen_e</u></b> &mdash; <i>Function</i>.




```julia
dlopen_e(libfile::AbstractString [, flags::Integer])
```


Similar to [`dlopen`](/stdlib/Libdl#Base.Libc.Libdl.dlopen), except returns `C_NULL` instead of raising errors. This method is now deprecated in favor of `dlopen(libfile::AbstractString [, flags::Integer]; throw_error=false)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L154-L159)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.RTLD_NOW' href='#Base.Libc.Libdl.RTLD_NOW'>#</a>&nbsp;<b><u>Base.Libc.Libdl.RTLD_NOW</u></b> &mdash; <i>Constant</i>.




```julia
RTLD_DEEPBIND
RTLD_FIRST
RTLD_GLOBAL
RTLD_LAZY
RTLD_LOCAL
RTLD_NODELETE
RTLD_NOLOAD
RTLD_NOW
```


Enum constant for [`dlopen`](/stdlib/Libdl#Base.Libc.Libdl.dlopen). See your platform man page for details, if applicable.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L33-L45)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dlsym' href='#Base.Libc.Libdl.dlsym'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dlsym</u></b> &mdash; <i>Function</i>.




```julia
dlsym(handle, sym; throw_error::Bool = true)
```


Look up a symbol from a shared library handle, return callable function pointer on success.

If the symbol cannot be found, this method throws an error, unless the keyword argument `throw_error` is set to `false`, in which case this method returns `nothing`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L51-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dlsym_e' href='#Base.Libc.Libdl.dlsym_e'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dlsym_e</u></b> &mdash; <i>Function</i>.




```julia
dlsym_e(handle, sym)
```


Look up a symbol from a shared library handle, silently return `C_NULL` on lookup failure. This method is now deprecated in favor of `dlsym(handle, sym; throw_error=false)`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L72-L77)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dlclose' href='#Base.Libc.Libdl.dlclose'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dlclose</u></b> &mdash; <i>Function</i>.




```julia
dlclose(handle)
```


Close shared library referenced by handle.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L162-L166)



```julia
dlclose(::Nothing)
```


For the very common pattern usage pattern of

```
try
    hdl = dlopen(library_name)
    ... do something
finally
    dlclose(hdl)
end
```


We define a `dlclose()` method that accepts a parameter of type `Nothing`, so that user code does not have to change its behavior for the case that `library_name` was not found.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L171-L186)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dlext' href='#Base.Libc.Libdl.dlext'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dlext</u></b> &mdash; <i>Constant</i>.




```julia
dlext
```


File extension for dynamic libraries (e.g. dll, dylib, so) on the current platform.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L258-L262)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dllist' href='#Base.Libc.Libdl.dllist'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dllist</u></b> &mdash; <i>Function</i>.




```julia
dllist()
```


Return the paths of dynamic libraries currently loaded in a `Vector{String}`.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L289-L293)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.dlpath' href='#Base.Libc.Libdl.dlpath'>#</a>&nbsp;<b><u>Base.Libc.Libdl.dlpath</u></b> &mdash; <i>Function</i>.




```julia
dlpath(handle::Ptr{Cvoid})
```


Given a library `handle` from `dlopen`, return the full path.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L220-L224)



```julia
dlpath(libname::Union{AbstractString, Symbol})
```


Get the full path of the library `libname`.

**Examples**

```julia
julia> dlpath("libjulia")
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L232-L241)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.Libdl.find_library' href='#Base.Libc.Libdl.find_library'>#</a>&nbsp;<b><u>Base.Libc.Libdl.find_library</u></b> &mdash; <i>Function</i>.




```julia
find_library(names [, locations])
```


Searches for the first library in `names` in the paths in the `locations` list, `DL_LOAD_PATH`, or system library paths (in that order) which can successfully be dlopen&#39;d. On success, the return value will be one of the names (potentially prefixed by one of the paths in locations). This string can be assigned to a `global const` and used as the library name in future `ccall`&#39;s. On failure, it returns the empty string.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L190-L198)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.DL_LOAD_PATH' href='#Base.DL_LOAD_PATH'>#</a>&nbsp;<b><u>Base.DL_LOAD_PATH</u></b> &mdash; <i>Constant</i>.




```julia
DL_LOAD_PATH
```


When calling [`dlopen`](/stdlib/Libdl#Base.Libc.Libdl.dlopen), the paths in this list will be searched first, in order, before searching the system locations for a valid library handle.


[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/libdl.jl#L14-L19)

</div>
<br>
