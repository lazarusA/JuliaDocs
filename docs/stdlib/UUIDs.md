


# UUIDs
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='UUIDs.uuid1' href='#UUIDs.uuid1'>#</a>&nbsp;<b><u>UUIDs.uuid1</u></b> &mdash; <i>Function</i>.




```julia
uuid1([rng::AbstractRNG]) -> UUID
```


Generates a version 1 (time-based) universally unique identifier (UUID), as specified by RFC 4122. Note that the Node ID is randomly generated (does not identify the host) according to section 4.5 of the RFC.

The default rng used by `uuid1` is not `Random.default_rng()` and every invocation of `uuid1()` without an argument should be expected to return a unique identifier. Importantly, the outputs of `uuid1` do not repeat even when `Random.seed!(seed)` is called. Currently (as of Julia 1.6), `uuid1` uses `Random.RandomDevice` as the default rng. However, this is an implementation detail that may change in the future.

::: tip Julia 1.6

The output of `uuid1` does not depend on `Random.default_rng()` as of Julia 1.6.

:::

**Examples**

```julia
julia> using Random

julia> rng = MersenneTwister(1234);

julia> uuid1(rng)
UUID("cfc395e8-590f-11e8-1f13-43a2532b2fa8")
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/UUIDs/src/UUIDs.jl#L38-L63)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='UUIDs.uuid4' href='#UUIDs.uuid4'>#</a>&nbsp;<b><u>UUIDs.uuid4</u></b> &mdash; <i>Function</i>.




```julia
uuid4([rng::AbstractRNG]) -> UUID
```


Generates a version 4 (random or pseudo-random) universally unique identifier (UUID), as specified by RFC 4122.

The default rng used by `uuid4` is not `Random.default_rng()` and every invocation of `uuid4()` without an argument should be expected to return a unique identifier. Importantly, the outputs of `uuid4` do not repeat even when `Random.seed!(seed)` is called. Currently (as of Julia 1.6), `uuid4` uses `Random.RandomDevice` as the default rng. However, this is an implementation detail that may change in the future.

::: tip Julia 1.6

The output of `uuid4` does not depend on `Random.default_rng()` as of Julia 1.6.

:::

**Examples**

```julia
julia> using Random

julia> rng = Xoshiro(123);

julia> uuid4(rng)
UUID("856e446e-0c6a-472a-9638-f7b8557cd282")
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/UUIDs/src/UUIDs.jl#L87-L111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='UUIDs.uuid5' href='#UUIDs.uuid5'>#</a>&nbsp;<b><u>UUIDs.uuid5</u></b> &mdash; <i>Function</i>.




```julia
uuid5(ns::UUID, name::String) -> UUID
```


Generates a version 5 (namespace and domain-based) universally unique identifier (UUID), as specified by RFC 4122.

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

**Examples**

```julia
julia> using Random

julia> rng = Xoshiro(123);

julia> u4 = uuid4(rng)
UUID("856e446e-0c6a-472a-9638-f7b8557cd282")

julia> u5 = uuid5(u4, "julia")
UUID("2df91e3f-da06-5362-a6fe-03772f2e14c9")
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/UUIDs/src/UUIDs.jl#L119-L140)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='UUIDs.uuid_version' href='#UUIDs.uuid_version'>#</a>&nbsp;<b><u>UUIDs.uuid_version</u></b> &mdash; <i>Function</i>.




```julia
uuid_version(u::UUID) -> Int
```


Inspects the given UUID and returns its version (see [RFC 4122](https://www.ietf.org/rfc/rfc4122)).

**Examples**

```julia
julia> uuid_version(uuid4())
4
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/UUIDs/src/UUIDs.jl#L17-L28)

</div>
<br>
