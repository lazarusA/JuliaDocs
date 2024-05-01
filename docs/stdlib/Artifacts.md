


# Artifacts {#Artifacts}



Starting with Julia 1.6, the artifacts support has moved from `Pkg.jl` to Julia itself. Until proper documentation can be added here, you can learn more about artifacts in the `Pkg.jl` manual at [https://julialang.github.io/Pkg.jl/v1/artifacts/](https://julialang.github.io/Pkg.jl/v1/artifacts/).

::: tip Julia 1.6

Julia&#39;s artifacts API requires at least Julia 1.6. In Julia versions 1.3 to 1.5, you can use `Pkg.Artifacts` instead.

:::
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Artifacts.artifact_meta' href='#Artifacts.artifact_meta'>#</a>&nbsp;<b><u>Artifacts.artifact_meta</u></b> &mdash; <i>Function</i>.




```julia
artifact_meta(name::String, artifacts_toml::String;
              platform::AbstractPlatform = HostPlatform(),
              pkg_uuid::Union{Base.UUID,Nothing}=nothing)
```


Get metadata about a given artifact (identified by name) stored within the given `(Julia)Artifacts.toml` file.  If the artifact is platform-specific, use `platform` to choose the most appropriate mapping.  If none is found, return `nothing`.

::: tip Julia 1.3

This function requires at least Julia 1.3.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Artifacts/src/Artifacts.jl#L370-L381)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Artifacts.artifact_hash' href='#Artifacts.artifact_hash'>#</a>&nbsp;<b><u>Artifacts.artifact_hash</u></b> &mdash; <i>Function</i>.




```julia
artifact_hash(name::String, artifacts_toml::String;
              platform::AbstractPlatform = HostPlatform())
```


Thin wrapper around `artifact_meta()` to return the hash of the specified, platform- collapsed artifact.  Returns `nothing` if no mapping can be found.

::: tip Julia 1.3

This function requires at least Julia 1.3.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Artifacts/src/Artifacts.jl#L428-L437)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Artifacts.find_artifacts_toml' href='#Artifacts.find_artifacts_toml'>#</a>&nbsp;<b><u>Artifacts.find_artifacts_toml</u></b> &mdash; <i>Function</i>.




```julia
find_artifacts_toml(path::String)
```


Given the path to a `.jl` file, (such as the one returned by `__source__.file` in a macro context), find the `(Julia)Artifacts.toml` that is contained within the containing project (if it exists), otherwise return `nothing`.

::: tip Julia 1.3

This function requires at least Julia 1.3.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Artifacts/src/Artifacts.jl#L493-L502)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Artifacts.@artifact_str' href='#Artifacts.@artifact_str'>#</a>&nbsp;<b><u>Artifacts.@artifact_str</u></b> &mdash; <i>Macro</i>.




```julia
macro artifact_str(name)
```


Return the on-disk path to an artifact. Automatically looks the artifact up by name in the project&#39;s `(Julia)Artifacts.toml` file. Throws an error on if the requested artifact is not present. If run in the REPL, searches for the toml file starting in the current directory, see `find_artifacts_toml()` for more.

If the artifact is marked &quot;lazy&quot; and the package has `using LazyArtifacts` defined, the artifact will be downloaded on-demand with `Pkg` the first time this macro tries to compute the path. The files will then be left installed locally for later.

If `name` contains a forward or backward slash, all elements after the first slash will be taken to be path names indexing into the artifact, allowing for an easy one-liner to access a single file/directory within an artifact.  Example:

```
ffmpeg_path = @artifact"FFMPEG/bin/ffmpeg"
```


::: tip Julia 1.3

This macro requires at least Julia 1.3.

:::

::: tip Julia 1.6

Slash-indexing requires at least Julia 1.6.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Artifacts/src/Artifacts.jl#L649-L673)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Artifacts.artifact_exists' href='#Artifacts.artifact_exists'>#</a>&nbsp;<b><u>Artifacts.artifact_exists</u></b> &mdash; <i>Function</i>.




```julia
artifact_exists(hash::SHA1; honor_overrides::Bool=true)
```


Return whether or not the given artifact (identified by its sha1 git tree hash) exists on-disk.  Note that it is possible that the given artifact exists in multiple locations (e.g. within multiple depots).

::: tip Julia 1.3

This function requires at least Julia 1.3.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Artifacts/src/Artifacts.jl#L253-L262)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Artifacts.artifact_path' href='#Artifacts.artifact_path'>#</a>&nbsp;<b><u>Artifacts.artifact_path</u></b> &mdash; <i>Function</i>.




```julia
artifact_path(hash::SHA1; honor_overrides::Bool=true)
```


Given an artifact (identified by SHA1 git tree hash), return its installation path.  If the artifact does not exist, returns the location it would be installed to.

::: tip Julia 1.3

This function requires at least Julia 1.3.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Artifacts/src/Artifacts.jl#L229-L237)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Artifacts.select_downloadable_artifacts' href='#Artifacts.select_downloadable_artifacts'>#</a>&nbsp;<b><u>Artifacts.select_downloadable_artifacts</u></b> &mdash; <i>Function</i>.




```julia
select_downloadable_artifacts(artifacts_toml::String;
                              platform = HostPlatform,
                              include_lazy = false,
                              pkg_uuid = nothing)
```


Return a dictionary where every entry is an artifact from the given `Artifacts.toml` that should be downloaded for the requested platform.  Lazy artifacts are included if `include_lazy` is set.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Artifacts/src/Artifacts.jl#L471-L480)

</div>
<br>
