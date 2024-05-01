


# Random Numbers {#Random-Numbers}



Random number generation in Julia uses the [Xoshiro256++](https://prng.di.unimi.it/) algorithm by default, with per-`Task` state. Other RNG types can be plugged in by inheriting the `AbstractRNG` type; they can then be used to obtain multiple streams of random numbers.

The PRNGs (pseudorandom number generators) exported by the `Random` package are:
- `TaskLocalRNG`: a token that represents use of the currently active Task-local stream, deterministically seeded from the parent task, or by `RandomDevice` (with system randomness) at program start
  
- `Xoshiro`: generates a high-quality stream of random numbers with a small state vector and high performance using the Xoshiro256++ algorithm
  
- `RandomDevice`: for OS-provided entropy. This may be used for cryptographically secure random numbers (CS(P)RNG).
  
- `MersenneTwister`: an alternate high-quality PRNG which was the default in older versions of Julia, and is also quite fast, but requires much more space to store the state vector and generate a random sequence.
  

Most functions related to random generation accept an optional `AbstractRNG` object as first argument. Some also accept dimension specifications `dims...` (which can also be given as a tuple) to generate arrays of random values. In a multi-threaded program, you should generally use different RNG objects from different threads or tasks in order to be thread-safe. However, the default RNG is thread-safe as of Julia 1.3 (using a per-thread RNG up to version 1.6, and per-task thereafter).

The provided RNGs can generate uniform random numbers of the following types: [`Float16`](/base/numbers#Core.Float16), [`Float32`](/base/numbers#Core.Float32), [`Float64`](/base/numbers#Core.Float64), [`BigFloat`](/base/numbers#Base.MPFR.BigFloat), [`Bool`](/base/numbers#Core.Bool), [`Int8`](/base/numbers#Core.Int8), [`UInt8`](/base/numbers#Core.UInt8), [`Int16`](/base/numbers#Core.Int16), [`UInt16`](/base/numbers#Core.UInt16), [`Int32`](/base/numbers#Core.Int32), [`UInt32`](/base/numbers#Core.UInt32), [`Int64`](/base/numbers#Core.Int64), [`UInt64`](/base/numbers#Core.UInt64), [`Int128`](/base/numbers#Core.Int128), [`UInt128`](/base/numbers#Core.UInt128), [`BigInt`](/base/numbers#Base.GMP.BigInt) (or complex numbers of those types). Random floating point numbers are generated uniformly in $[0, 1)$. As `BigInt` represents unbounded integers, the interval must be specified (e.g. `rand(big.(1:6))`).

Additionally, normal and exponential distributions are implemented for some `AbstractFloat` and `Complex` types, see [`randn`](/stdlib/Random#Base.randn) and [`randexp`](/stdlib/Random#Random.randexp) for details.

To generate random numbers from other distributions, see the [Distributions.jl](https://juliastats.org/Distributions.jl/stable/) package.

::: warning Warning

Because the precise way in which random numbers are generated is considered an implementation detail, bug fixes and speed improvements may change the stream of numbers that are generated after a version change. Relying on a specific seed or generated stream of numbers during unit testing is thus discouraged - consider testing properties of the methods in question instead.

:::

## Random numbers module {#Random-numbers-module}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.Random' href='#Random.Random'>#</a>&nbsp;<b><u>Random.Random</u></b> &mdash; <i>Module</i>.




```julia
Random
```


Support for generating random numbers. Provides [`rand`](/stdlib/Random#Base.rand), [`randn`](/stdlib/Random#Base.randn), [`AbstractRNG`](/stdlib/Random#Random.AbstractRNG), [`Xoshiro`](/stdlib/Random#Random.Xoshiro), [`MersenneTwister`](/stdlib/Random#Random.MersenneTwister), and [`RandomDevice`](/stdlib/Random#Random.RandomDevice).


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L3-L8)

</div>
<br>

## Random generation functions {#Random-generation-functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rand' href='#Base.rand'>#</a>&nbsp;<b><u>Base.rand</u></b> &mdash; <i>Function</i>.




```julia
rand([rng=default_rng()], [S], [dims...])
```


Pick a random element or array of random elements from the set of values specified by `S`; `S` can be
- an indexable collection (for example `1:9` or `('x', "y", :z)`)
  
- an `AbstractDict` or `AbstractSet` object
  
- a string (considered as a collection of characters), or
  
- a type from the list below, corresponding to the specified set of values
  - concrete integer types sample from `typemin(S):typemax(S)` (excepting [`BigInt`](/base/numbers#Base.GMP.BigInt) which is not supported)
    
  - concrete floating point types sample from `[0, 1)`
    
  - concrete complex types `Complex{T}` if `T` is a sampleable type take their real and imaginary components independently from the set of values corresponding to `T`, but are not supported if `T` is not sampleable.
    
  - all `<:AbstractChar` types sample from the set of valid Unicode scalars
    
  - a user-defined type and set of values; for implementation guidance please see [Hooking into the `Random` API](/stdlib/Random#rand-api-hook)
    
  - a tuple type of known size and where each parameter of `S` is itself a sampleable type; return a value of type `S`. Note that tuple types such as `Tuple{Vararg{T}}` (unknown size) and `Tuple{1:2}` (parameterized with a value) are not supported
    
  - a `Pair` type, e.g. `Pair{X, Y}` such that `rand` is defined for `X` and `Y`, in which case random pairs are produced.
    
  

`S` defaults to [`Float64`](/base/numbers#Core.Float64). When only one argument is passed besides the optional `rng` and is a `Tuple`, it is interpreted as a collection of values (`S`) and not as `dims`.

See also [`randn`](/stdlib/Random#Base.randn) for normally distributed numbers, and [`rand!`](/stdlib/Random#Random.rand!) and [`randn!`](/stdlib/Random#Random.randn!) for the in-place equivalents.

::: tip Julia 1.1

Support for `S` as a tuple requires at least Julia 1.1.

:::

::: tip Julia 1.11

Support for `S` as a `Tuple` type requires at least Julia 1.11.

:::

**Examples**

```julia
julia> rand(Int, 2)
2-element Array{Int64,1}:
 1339893410598768192
 1575814717733606317

julia> using Random

julia> rand(Xoshiro(0), Dict(1=>2, 3=>4))
3 => 4

julia> rand((2, 3))
3

julia> rand(Float64, (2, 3))
2×3 Array{Float64,2}:
 0.999717  0.0143835  0.540787
 0.696556  0.783855   0.938235
```


::: tip Note

The complexity of `rand(rng, s::Union{AbstractDict,AbstractSet})` is linear in the length of `s`, unless an optimized method with constant complexity is available, which is the case for `Dict`, `Set` and dense `BitSet`s. For more than a few calls, use `rand(rng, collect(s))` instead, or either `rand(rng, Dict(s))` or `rand(rng, Set(s))` as appropriate.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L308-L381)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.rand!' href='#Random.rand!'>#</a>&nbsp;<b><u>Random.rand!</u></b> &mdash; <i>Function</i>.




```julia
rand!([rng=default_rng()], A, [S=eltype(A)])
```


Populate the array `A` with random values. If `S` is specified (`S` can be a type or a collection, cf. [`rand`](/stdlib/Random#Base.rand) for details), the values are picked randomly from `S`. This is equivalent to `copyto!(A, rand(rng, S, size(A)))` but without allocating a new array.

**Examples**

```julia
julia> rand!(Xoshiro(123), zeros(5))
5-element Vector{Float64}:
 0.521213795535383
 0.5868067574533484
 0.8908786980927811
 0.19090669902576285
 0.5256623915420473
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L384-L403)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.bitrand' href='#Random.bitrand'>#</a>&nbsp;<b><u>Random.bitrand</u></b> &mdash; <i>Function</i>.




```julia
bitrand([rng=default_rng()], [dims...])
```


Generate a `BitArray` of random boolean values.

**Examples**

```julia
julia> bitrand(Xoshiro(123), 10)
10-element BitVector:
 0
 1
 0
 1
 0
 1
 0
 0
 1
 1
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L13-L33)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.randn' href='#Base.randn'>#</a>&nbsp;<b><u>Base.randn</u></b> &mdash; <i>Function</i>.




```julia
randn([rng=default_rng()], [T=Float64], [dims...])
```


Generate a normally-distributed random number of type `T` with mean 0 and standard deviation 1. Given the optional `dims` argument(s), generate an array of size `dims` of such numbers. Julia&#39;s standard library supports `randn` for any floating-point type that implements [`rand`](/stdlib/Random#Base.rand), e.g. the `Base` types [`Float16`](/base/numbers#Core.Float16), [`Float32`](/base/numbers#Core.Float32), [`Float64`](/base/numbers#Core.Float64) (the default), and [`BigFloat`](/base/numbers#Base.MPFR.BigFloat), along with their [`Complex`](/base/numbers#Base.Complex) counterparts.

(When `T` is complex, the values are drawn from the circularly symmetric complex normal distribution of variance 1, corresponding to real and imaginary parts having independent normal distribution with mean zero and variance `1/2`).

See also [`randn!`](/stdlib/Random#Random.randn!) to act in-place.

**Examples**

Generating a single random number (with the default `Float64` type):

```julia
julia> randn()
-0.942481877315864
```


Generating a matrix of normal random numbers (with the default `Float64` type):

```julia
julia> randn(2,3)
2×3 Matrix{Float64}:
  1.18786   -0.678616   1.49463
 -0.342792  -0.134299  -1.45005
```


Setting up of the random number generator `rng` with a user-defined seed (for reproducible numbers) and using it to generate a random `Float32` number or a matrix of `ComplexF32` random numbers:

```julia
julia> using Random

julia> rng = Xoshiro(123);

julia> randn(rng, Float32)
-0.6457307f0

julia> randn(rng, ComplexF32, (2, 3))
2×3 Matrix{ComplexF32}:
  -1.03467-1.14806im  0.693657+0.056538im   0.291442+0.419454im
 -0.153912+0.34807im    1.0954-0.948661im  -0.543347-0.0538589im
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/normal.jl#L12-L63)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randn!' href='#Random.randn!'>#</a>&nbsp;<b><u>Random.randn!</u></b> &mdash; <i>Function</i>.




```julia
randn!([rng=default_rng()], A::AbstractArray) -> A
```


Fill the array `A` with normally-distributed (mean 0, standard deviation 1) random numbers. Also see the [`rand`](/stdlib/Random#Base.rand) function.

**Examples**

```julia
julia> randn!(Xoshiro(123), zeros(5))
5-element Vector{Float64}:
 -0.6457306721039767
 -1.4632513788889214
 -1.6236037455860806
 -0.21766510678354617
  0.4922456865251828
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/normal.jl#L181-L197)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randexp' href='#Random.randexp'>#</a>&nbsp;<b><u>Random.randexp</u></b> &mdash; <i>Function</i>.




```julia
randexp([rng=default_rng()], [T=Float64], [dims...])
```


Generate a random number of type `T` according to the exponential distribution with scale 1. Optionally generate an array of such random numbers. The `Base` module currently provides an implementation for the types [`Float16`](/base/numbers#Core.Float16), [`Float32`](/base/numbers#Core.Float32), and [`Float64`](/base/numbers#Core.Float64) (the default).

**Examples**

```julia
julia> rng = Xoshiro(123);

julia> randexp(rng, Float32)
1.1757717f0

julia> randexp(rng, 3, 3)
3×3 Matrix{Float64}:
 1.37766  0.456653  0.236418
 3.40007  0.229917  0.0684921
 0.48096  0.577481  0.71835
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/normal.jl#L130-L152)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randexp!' href='#Random.randexp!'>#</a>&nbsp;<b><u>Random.randexp!</u></b> &mdash; <i>Function</i>.




```julia
randexp!([rng=default_rng()], A::AbstractArray) -> A
```


Fill the array `A` with random numbers following the exponential distribution (with scale 1).

**Examples**

```julia
julia> randexp!(Xoshiro(123), zeros(5))
5-element Vector{Float64}:
 1.1757716836348473
 1.758884569451514
 1.0083623637301151
 0.3510644315565272
 0.6348266443720407
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/normal.jl#L200-L216)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randstring' href='#Random.randstring'>#</a>&nbsp;<b><u>Random.randstring</u></b> &mdash; <i>Function</i>.




```julia
randstring([rng=default_rng()], [chars], [len=8])
```


Create a random string of length `len`, consisting of characters from `chars`, which defaults to the set of upper- and lower-case letters and the digits 0-9. The optional `rng` argument specifies a random number generator, see [Random Numbers](/stdlib/Random#Random-Numbers).

**Examples**

```julia
julia> Random.seed!(3); randstring()
"Lxz5hUwn"

julia> randstring(Xoshiro(3), 'a':'z', 6)
"iyzcsm"

julia> randstring("ACGT")
"TGCTCCTC"
```


::: tip Note

`chars` can be any collection of characters, of type `Char` or `UInt8` (more efficient), provided [`rand`](/stdlib/Random#Base.rand) can randomly pick characters from it.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L43-L67)

</div>
<br>

## Subsequences, permutations and shuffling {#Subsequences,-permutations-and-shuffling}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randsubseq' href='#Random.randsubseq'>#</a>&nbsp;<b><u>Random.randsubseq</u></b> &mdash; <i>Function</i>.




```julia
randsubseq([rng=default_rng(),] A, p) -> Vector
```


Return a vector consisting of a random subsequence of the given array `A`, where each element of `A` is included (in order) with independent probability `p`. (Complexity is linear in `p*length(A)`, so this function is efficient even if `p` is small and `A` is large.) Technically, this process is known as &quot;Bernoulli sampling&quot; of `A`.

**Examples**

```julia
julia> randsubseq(Xoshiro(123), 1:8, 0.3)
2-element Vector{Int64}:
 4
 7
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L160-L175)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randsubseq!' href='#Random.randsubseq!'>#</a>&nbsp;<b><u>Random.randsubseq!</u></b> &mdash; <i>Function</i>.




```julia
randsubseq!([rng=default_rng(),] S, A, p)
```


Like [`randsubseq`](/stdlib/Random#Random.randsubseq), but the results are stored in `S` (which is resized as needed).

**Examples**

```julia
julia> S = Int64[];

julia> randsubseq!(Xoshiro(123), S, 1:8, 0.3)
2-element Vector{Int64}:
 4
 7

julia> S
2-element Vector{Int64}:
 4
 7
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L134-L154)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randperm' href='#Random.randperm'>#</a>&nbsp;<b><u>Random.randperm</u></b> &mdash; <i>Function</i>.




```julia
randperm([rng=default_rng(),] n::Integer)
```


Construct a random permutation of length `n`. The optional `rng` argument specifies a random number generator (see [Random Numbers](/stdlib/Random#Random-Numbers)). The element type of the result is the same as the type of `n`.

To randomly permute an arbitrary vector, see [`shuffle`](/stdlib/Random#Random.shuffle) or [`shuffle!`](/stdlib/Random#Random.shuffle!).

::: tip Julia 1.1

In Julia 1.1 `randperm` returns a vector `v` with `eltype(v) == typeof(n)` while in Julia 1.0 `eltype(v) == Int`.

:::

**Examples**

```julia
julia> randperm(Xoshiro(123), 4)
4-element Vector{Int64}:
 1
 4
 2
 3
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L271-L295)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randperm!' href='#Random.randperm!'>#</a>&nbsp;<b><u>Random.randperm!</u></b> &mdash; <i>Function</i>.




```julia
randperm!([rng=default_rng(),] A::Array{<:Integer})
```


Construct in `A` a random permutation of length `length(A)`. The optional `rng` argument specifies a random number generator (see [Random Numbers](/stdlib/Random#Random-Numbers)). To randomly permute an arbitrary vector, see [`shuffle`](/stdlib/Random#Random.shuffle) or [`shuffle!`](/stdlib/Random#Random.shuffle!).

**Examples**

```julia
julia> randperm!(Xoshiro(123), Vector{Int}(undef, 4))
4-element Vector{Int64}:
 1
 4
 2
 3
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L299-L316)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randcycle' href='#Random.randcycle'>#</a>&nbsp;<b><u>Random.randcycle</u></b> &mdash; <i>Function</i>.




```julia
randcycle([rng=default_rng(),] n::Integer)
```


Construct a random cyclic permutation of length `n`. The optional `rng` argument specifies a random number generator, see [Random Numbers](/stdlib/Random#Random-Numbers). The element type of the result is the same as the type of `n`.

Here, a &quot;cyclic permutation&quot; means that all of the elements lie within a single cycle.  If `n > 0`, there are $(n-1)!$ possible cyclic permutations, which are sampled uniformly.  If `n == 0`, `randcycle` returns an empty vector.

[`randcycle!`](/stdlib/Random#Random.randcycle!) is an in-place variant of this function.

::: tip Julia 1.1

In Julia 1.1 and above, `randcycle` returns a vector `v` with `eltype(v) == typeof(n)` while in Julia 1.0 `eltype(v) == Int`.

:::

**Examples**

```julia
julia> randcycle(Xoshiro(123), 6)
6-element Vector{Int64}:
 5
 4
 2
 6
 3
 1
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L340-L368)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.randcycle!' href='#Random.randcycle!'>#</a>&nbsp;<b><u>Random.randcycle!</u></b> &mdash; <i>Function</i>.




```julia
randcycle!([rng=default_rng(),] A::Array{<:Integer})
```


Construct in `A` a random cyclic permutation of length `n = length(A)`. The optional `rng` argument specifies a random number generator, see [Random Numbers](/stdlib/Random#Random-Numbers).

Here, a &quot;cyclic permutation&quot; means that all of the elements lie within a single cycle. If `A` is nonempty (`n > 0`), there are $(n-1)!$ possible cyclic permutations, which are sampled uniformly.  If `A` is empty, `randcycle!` leaves it unchanged.

[`randcycle`](/stdlib/Random#Random.randcycle) is a variant of this function that allocates a new vector.

**Examples**

```julia
julia> randcycle!(Xoshiro(123), Vector{Int}(undef, 6))
6-element Vector{Int64}:
 5
 4
 2
 6
 3
 1
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L372-L396)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.shuffle' href='#Random.shuffle'>#</a>&nbsp;<b><u>Random.shuffle</u></b> &mdash; <i>Function</i>.




```julia
shuffle([rng=default_rng(),] v::AbstractArray)
```


Return a randomly permuted copy of `v`. The optional `rng` argument specifies a random number generator (see [Random Numbers](/stdlib/Random#Random-Numbers)). To permute `v` in-place, see [`shuffle!`](/stdlib/Random#Random.shuffle!). To obtain randomly permuted indices, see [`randperm`](/stdlib/Random#Random.randperm).

**Examples**

```julia
julia> shuffle(Xoshiro(123), Vector(1:10))
10-element Vector{Int64}:
  5
  4
  2
  3
  6
 10
  8
  1
  9
  7
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L240-L263)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.shuffle!' href='#Random.shuffle!'>#</a>&nbsp;<b><u>Random.shuffle!</u></b> &mdash; <i>Function</i>.




```julia
shuffle!([rng=default_rng(),] v::AbstractArray)
```


In-place version of [`shuffle`](/stdlib/Random#Random.shuffle): randomly permute `v` in-place, optionally supplying the random-number generator `rng`.

**Examples**

```julia
julia> shuffle!(Xoshiro(123), Vector(1:10))
10-element Vector{Int64}:
  5
  4
  2
  3
  6
 10
  8
  1
  9
  7
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/misc.jl#L186-L207)

</div>
<br>

## Generators (creation and seeding) {#Generators-(creation-and-seeding)}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.default_rng' href='#Random.default_rng'>#</a>&nbsp;<b><u>Random.default_rng</u></b> &mdash; <i>Function</i>.




```julia
Random.default_rng() -> rng
```


Return the default global random number generator (RNG), which is used by `rand`-related functions when no explicit RNG is provided.

When the `Random` module is loaded, the default RNG is _randomly_ seeded, via [`Random.seed!()`](/stdlib/Random#Random.seed!): this means that each time a new julia session is started, the first call to `rand()` produces a different result, unless `seed!(seed)` is called first.

It is thread-safe: distinct threads can safely call `rand`-related functions on `default_rng()` concurrently, e.g. `rand(default_rng())`.

::: tip Note

The type of the default RNG is an implementation detail. Across different versions of Julia, you should not expect the default RNG to always have the same type, nor that it will produce the same stream of random numbers for a given seed.

:::

::: tip Julia 1.3

This function was introduced in Julia 1.3.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/RNGs.jl#L378-L398)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.seed!' href='#Random.seed!'>#</a>&nbsp;<b><u>Random.seed!</u></b> &mdash; <i>Function</i>.




```julia
seed!([rng=default_rng()], seed) -> rng
seed!([rng=default_rng()]) -> rng
```


Reseed the random number generator: `rng` will give a reproducible sequence of numbers if and only if a `seed` is provided. Some RNGs don&#39;t accept a seed, like `RandomDevice`. After the call to `seed!`, `rng` is equivalent to a newly created object initialized with the same seed. The types of accepted seeds depend on the type of `rng`, but in general, integer seeds should work.

If `rng` is not specified, it defaults to seeding the state of the shared task-local generator.

**Examples**

```julia
julia> Random.seed!(1234);

julia> x1 = rand(2)
2-element Vector{Float64}:
 0.32597672886359486
 0.5490511363155669

julia> Random.seed!(1234);

julia> x2 = rand(2)
2-element Vector{Float64}:
 0.32597672886359486
 0.5490511363155669

julia> x1 == x2
true

julia> rng = Xoshiro(1234); rand(rng, 2) == x1
true

julia> Xoshiro(1) == Random.seed!(rng, 1)
true

julia> rand(Random.seed!(rng), Bool) # not reproducible
true

julia> rand(Random.seed!(rng), Bool) # not reproducible either
false

julia> rand(Xoshiro(), Bool) # not reproducible either
true
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L406-L455)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.AbstractRNG' href='#Random.AbstractRNG'>#</a>&nbsp;<b><u>Random.AbstractRNG</u></b> &mdash; <i>Type</i>.




```julia
AbstractRNG
```


Supertype for random number generators such as [`MersenneTwister`](/stdlib/Random#Random.MersenneTwister) and [`RandomDevice`](/stdlib/Random#Random.RandomDevice).


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L34-L38)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.TaskLocalRNG' href='#Random.TaskLocalRNG'>#</a>&nbsp;<b><u>Random.TaskLocalRNG</u></b> &mdash; <i>Type</i>.




```julia
TaskLocalRNG
```


The `TaskLocalRNG` has state that is local to its task, not its thread. It is seeded upon task creation, from the state of its parent task. Therefore, task creation is an event that changes the parent&#39;s RNG state.

As an upside, the `TaskLocalRNG` is pretty fast, and permits reproducible multithreaded simulations (barring race conditions), independent of scheduler decisions. As long as the number of threads is not used to make decisions on task creation, simulation results are also independent of the number of available threads / CPUs. The random stream should not depend on hardware specifics, up to endianness and possibly word size.

Using or seeding the RNG of any other task than the one returned by `current_task()` is undefined behavior: it will work most of the time, and may sometimes fail silently.

When seeding `TaskLocalRNG()` with [`seed!`](/stdlib/Random#Random.seed!), the passed seed, if any, may be any integer.

::: tip Julia 1.11

Seeding `TaskLocalRNG()` with a negative integer seed requires at least Julia 1.11.

:::


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Xoshiro.jl#L184-L206)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.Xoshiro' href='#Random.Xoshiro'>#</a>&nbsp;<b><u>Random.Xoshiro</u></b> &mdash; <i>Type</i>.




```julia
Xoshiro(seed::Union{Integer, AbstractString})
Xoshiro()
```


Xoshiro256++ is a fast pseudorandom number generator described by David Blackman and Sebastiano Vigna in &quot;Scrambled Linear Pseudorandom Number Generators&quot;, ACM Trans. Math. Softw., 2021. Reference implementation is available at https://prng.di.unimi.it

Apart from the high speed, Xoshiro has a small memory footprint, making it suitable for applications where many different random states need to be held for long time.

Julia&#39;s Xoshiro implementation has a bulk-generation mode; this seeds new virtual PRNGs from the parent, and uses SIMD to generate in parallel (i.e. the bulk stream consists of multiple interleaved xoshiro instances). The virtual PRNGs are discarded once the bulk request has been serviced (and should cause no heap allocations).

If no seed is provided, a randomly generated one is created (using entropy from the system). See the [`seed!`](/stdlib/Random#Random.seed!) function for reseeding an already existing `Xoshiro` object.

::: tip Julia 1.11

Passing a negative integer seed requires at least Julia 1.11.

:::

**Examples**

```julia
julia> using Random

julia> rng = Xoshiro(1234);

julia> x1 = rand(rng, 2)
2-element Vector{Float64}:
 0.32597672886359486
 0.5490511363155669

julia> rng = Xoshiro(1234);

julia> x2 = rand(rng, 2)
2-element Vector{Float64}:
 0.32597672886359486
 0.5490511363155669

julia> x1 == x2
true
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Xoshiro.jl#L6-L51)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.MersenneTwister' href='#Random.MersenneTwister'>#</a>&nbsp;<b><u>Random.MersenneTwister</u></b> &mdash; <i>Type</i>.




```julia
MersenneTwister(seed)
MersenneTwister()
```


Create a `MersenneTwister` RNG object. Different RNG objects can have their own seeds, which may be useful for generating different streams of random numbers. The `seed` may be an integer, a string, or a vector of `UInt32` integers. If no seed is provided, a randomly generated one is created (using entropy from the system). See the [`seed!`](/stdlib/Random#Random.seed!) function for reseeding an already existing `MersenneTwister` object.

::: tip Julia 1.11

Passing a negative integer seed requires at least Julia 1.11.

:::

**Examples**

```julia
julia> rng = MersenneTwister(123);

julia> x1 = rand(rng, 2)
2-element Vector{Float64}:
 0.37453777969575874
 0.8735343642013971

julia> x2 = rand(MersenneTwister(123), 2)
2-element Vector{Float64}:
 0.37453777969575874
 0.8735343642013971

julia> x1 == x2
true
```



[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/RNGs.jl#L79-L110)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.RandomDevice' href='#Random.RandomDevice'>#</a>&nbsp;<b><u>Random.RandomDevice</u></b> &mdash; <i>Type</i>.




```julia
RandomDevice()
```


Create a `RandomDevice` RNG object. Two such objects will always generate different streams of random numbers. The entropy is obtained from the operating system.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/RNGs.jl#L6-L12)

</div>
<br>

## Hooking into the `Random` API {#rand-api-hook}

There are two mostly orthogonal ways to extend `Random` functionalities:
1. generating random values of custom types
  
1. creating new generators
  

The API for 1) is quite functional, but is relatively recent so it may still have to evolve in subsequent releases of the `Random` module. For example, it&#39;s typically sufficient to implement one `rand` method in order to have all other usual methods work automatically.

The API for 2) is still rudimentary, and may require more work than strictly necessary from the implementer, in order to support usual types of generated values.

### Generating random values of custom types {#Generating-random-values-of-custom-types}

Generating random values for some distributions may involve various trade-offs. _Pre-computed_ values, such as an [alias table](https://en.wikipedia.org/wiki/Alias_method) for discrete distributions, or [“squeezing” functions](https://en.wikipedia.org/wiki/Rejection_sampling) for univariate distributions, can speed up sampling considerably. How much information should be pre-computed can depend on the number of values we plan to draw from a distribution. Also, some random number generators can have certain properties that various algorithms may want to exploit.

The `Random` module defines a customizable framework for obtaining random values that can address these issues. Each invocation of `rand` generates a _sampler_ which can be customized with the above trade-offs in mind, by adding methods to `Sampler`, which in turn can dispatch on the random number generator, the object that characterizes the distribution, and a suggestion for the number of repetitions. Currently, for the latter, `Val{1}` (for a single sample) and `Val{Inf}` (for an arbitrary number) are used, with `Random.Repetition` an alias for both.

The object returned by `Sampler` is then used to generate the random values. When implementing the random generation interface for a value `X` that can be sampled from, the implementer should define the method

```julia
rand(rng, sampler)
```


for the particular `sampler` returned by `Sampler(rng, X, repetition)`.

Samplers can be arbitrary values that implement `rand(rng, sampler)`, but for most applications the following predefined samplers may be sufficient:
1. `SamplerType{T}()` can be used for implementing samplers that draw from type `T` (e.g. `rand(Int)`). This is the default returned by `Sampler` for _types_.
  
1. `SamplerTrivial(self)` is a simple wrapper for `self`, which can be accessed with `[]`. This is the recommended sampler when no pre-computed information is needed (e.g. `rand(1:3)`), and is the default returned by `Sampler` for _values_.
  
1. `SamplerSimple(self, data)` also contains the additional `data` field, which can be used to store arbitrary pre-computed values, which should be computed in a _custom method_ of `Sampler`.
  

We provide examples for each of these. We assume here that the choice of algorithm is independent of the RNG, so we use `AbstractRNG` in our signatures.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.Sampler' href='#Random.Sampler'>#</a>&nbsp;<b><u>Random.Sampler</u></b> &mdash; <i>Type</i>.




```julia
Sampler(rng, x, repetition = Val(Inf))
```


Return a sampler object that can be used to generate random values from `rng` for `x`.

When `sp = Sampler(rng, x, repetition)`, `rand(rng, sp)` will be used to draw random values, and should be defined accordingly.

`repetition` can be `Val(1)` or `Val(Inf)`, and should be used as a suggestion for deciding the amount of precomputation, if applicable.

[`Random.SamplerType`](/stdlib/Random#Random.SamplerType) and [`Random.SamplerTrivial`](/stdlib/Random#Random.SamplerTrivial) are default fallbacks for _types_ and _values_, respectively. [`Random.SamplerSimple`](/stdlib/Random#Random.SamplerSimple) can be used to store pre-computed values without defining extra types for only this purpose.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L124-L138)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.SamplerType' href='#Random.SamplerType'>#</a>&nbsp;<b><u>Random.SamplerType</u></b> &mdash; <i>Type</i>.




```julia
SamplerType{T}()
```


A sampler for types, containing no other information. The default fallback for `Sampler` when called with types.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L154-L159)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.SamplerTrivial' href='#Random.SamplerTrivial'>#</a>&nbsp;<b><u>Random.SamplerTrivial</u></b> &mdash; <i>Type</i>.




```julia
SamplerTrivial(x)
```


Create a sampler that just wraps the given value `x`. This is the default fall-back for values. The `eltype` of this sampler is equal to `eltype(x)`.

The recommended use case is sampling from values without precomputed data.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L170-L178)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Random.SamplerSimple' href='#Random.SamplerSimple'>#</a>&nbsp;<b><u>Random.SamplerSimple</u></b> &mdash; <i>Type</i>.




```julia
SamplerSimple(x, data)
```


Create a sampler that wraps the given value `x` and the `data`. The `eltype` of this sampler is equal to `eltype(x)`.

The recommended use case is sampling from values with precomputed data.


[source](https://github.com/lazarusA/julia/blob/e162027b054e012a31046f06b22c4befb65eac54/stdlib/Random/src/Random.jl#L191-L198)

</div>
<br>

Decoupling pre-computation from actually generating the values is part of the API, and is also available to the user. As an example, assume that `rand(rng, 1:20)` has to be called repeatedly in a loop: the way to take advantage of this decoupling is as follows:

```julia
rng = Xoshiro()
sp = Random.Sampler(rng, 1:20) # or Random.Sampler(Xoshiro, 1:20)
for x in X
    n = rand(rng, sp) # similar to n = rand(rng, 1:20)
    # use n
end
```


This is the mechanism that is also used in the standard library, e.g. by the default implementation of random array generation (like in `rand(1:20, 10)`).

#### Generating values from a type {#Generating-values-from-a-type}

Given a type `T`, it&#39;s currently assumed that if `rand(T)` is defined, an object of type `T` will be produced. `SamplerType` is the _default sampler for types_. In order to define random generation of values of type `T`, the `rand(rng::AbstractRNG, ::Random.SamplerType{T})` method should be defined, and should return values what `rand(rng, T)` is expected to return.

Let&#39;s take the following example: we implement a `Die` type, with a variable number `n` of sides, numbered from `1` to `n`. We want `rand(Die)` to produce a `Die` with a random number of up to 20 sides (and at least 4):

```julia
struct Die
    nsides::Int # number of sides
end

Random.rand(rng::AbstractRNG, ::Random.SamplerType{Die}) = Die(rand(rng, 4:20))

# output

```


Scalar and array methods for `Die` now work as expected:

```julia
julia> rand(Die)
Die(5)

julia> rand(Xoshiro(0), Die)
Die(10)

julia> rand(Die, 3)
3-element Vector{Die}:
 Die(9)
 Die(15)
 Die(14)

julia> a = Vector{Die}(undef, 3); rand!(a)
3-element Vector{Die}:
 Die(19)
 Die(7)
 Die(17)
```


#### A simple sampler without pre-computed data {#A-simple-sampler-without-pre-computed-data}

Here we define a sampler for a collection. If no pre-computed data is required, it can be implemented with a `SamplerTrivial` sampler, which is in fact the _default fallback for values_.

In order to define random generation out of objects of type `S`, the following method should be defined: `rand(rng::AbstractRNG, sp::Random.SamplerTrivial{S})`. Here, `sp` simply wraps an object of type `S`, which can be accessed via `sp[]`. Continuing the `Die` example, we want now to define `rand(d::Die)` to produce an `Int` corresponding to one of `d`&#39;s sides:

```julia
julia> Random.rand(rng::AbstractRNG, d::Random.SamplerTrivial{Die}) = rand(rng, 1:d[].nsides);

julia> rand(Die(4))
1

julia> rand(Die(4), 3)
3-element Vector{Any}:
 2
 3
 3
```


Given a collection type `S`, it&#39;s currently assumed that if `rand(::S)` is defined, an object of type `eltype(S)` will be produced. In the last example, a `Vector{Any}` is produced; the reason is that `eltype(Die) == Any`. The remedy is to define `Base.eltype(::Type{Die}) = Int`.

#### Generating values for an `AbstractFloat` type {#Generating-values-for-an-AbstractFloat-type}

`AbstractFloat` types are special-cased, because by default random values are not produced in the whole type domain, but rather in `[0,1)`. The following method should be implemented for `T <: AbstractFloat`: `Random.rand(::AbstractRNG, ::Random.SamplerTrivial{Random.CloseOpen01{T}})`

#### An optimized sampler with pre-computed data {#An-optimized-sampler-with-pre-computed-data}

Consider a discrete distribution, where numbers `1:n` are drawn with given probabilities that sum to one. When many values are needed from this distribution, the fastest method is using an [alias table](https://en.wikipedia.org/wiki/Alias_method). We don&#39;t provide the algorithm for building such a table here, but suppose it is available in `make_alias_table(probabilities)` instead, and `draw_number(rng, alias_table)` can be used to draw a random number from it.

Suppose that the distribution is described by

```julia
struct DiscreteDistribution{V <: AbstractVector}
    probabilities::V
end
```


and that we _always_ want to build an alias table, regardless of the number of values needed (we learn how to customize this below). The methods

```julia
Random.eltype(::Type{<:DiscreteDistribution}) = Int

function Random.Sampler(::Type{<:AbstractRNG}, distribution::DiscreteDistribution, ::Repetition)
    SamplerSimple(distribution, make_alias_table(distribution.probabilities))
end
```


should be defined to return a sampler with pre-computed data, then

```julia
function rand(rng::AbstractRNG, sp::SamplerSimple{<:DiscreteDistribution})
    draw_number(rng, sp.data)
end
```


will be used to draw the values.

#### Custom sampler types {#Custom-sampler-types}

The `SamplerSimple` type is sufficient for most use cases with precomputed data. However, in order to demonstrate how to use custom sampler types, here we implement something similar to `SamplerSimple`.

Going back to our `Die` example: `rand(::Die)` uses random generation from a range, so there is an opportunity for this optimization. We call our custom sampler `SamplerDie`.

```julia
import Random: Sampler, rand

struct SamplerDie <: Sampler{Int} # generates values of type Int
    die::Die
    sp::Sampler{Int} # this is an abstract type, so this could be improved
end

Sampler(RNG::Type{<:AbstractRNG}, die::Die, r::Random.Repetition) =
    SamplerDie(die, Sampler(RNG, 1:die.nsides, r))
# the `r` parameter will be explained later on

rand(rng::AbstractRNG, sp::SamplerDie) = rand(rng, sp.sp)
```


It&#39;s now possible to get a sampler with `sp = Sampler(rng, die)`, and use `sp` instead of `die` in any `rand` call involving `rng`. In the simplistic example above, `die` doesn&#39;t need to be stored in `SamplerDie` but this is often the case in practice.

Of course, this pattern is so frequent that the helper type used above, namely `Random.SamplerSimple`, is available, saving us the definition of `SamplerDie`: we could have implemented our decoupling with:

```julia
Sampler(RNG::Type{<:AbstractRNG}, die::Die, r::Random.Repetition) =
    SamplerSimple(die, Sampler(RNG, 1:die.nsides, r))

rand(rng::AbstractRNG, sp::SamplerSimple{Die}) = rand(rng, sp.data)
```


Here, `sp.data` refers to the second parameter in the call to the `SamplerSimple` constructor (in this case equal to `Sampler(rng, 1:die.nsides, r)`), while the `Die` object can be accessed via `sp[]`.

Like `SamplerDie`, any custom sampler must be a subtype of `Sampler{T}` where `T` is the type of the generated values. Note that `SamplerSimple(x, data) isa Sampler{eltype(x)}`, so this constrains what the first argument to `SamplerSimple` can be (it&#39;s recommended to use `SamplerSimple` like in the `Die` example, where `x` is simply forwarded while defining a `Sampler` method). Similarly, `SamplerTrivial(x) isa Sampler{eltype(x)}`.

Another helper type is currently available for other cases, `Random.SamplerTag`, but is considered as internal API, and can break at any time without proper deprecations.

#### Using distinct algorithms for scalar or array generation {#Using-distinct-algorithms-for-scalar-or-array-generation}

In some cases, whether one wants to generate only a handful of values or a large number of values will have an impact on the choice of algorithm. This is handled with the third parameter of the `Sampler` constructor. Let&#39;s assume we defined two helper types for `Die`, say `SamplerDie1` which should be used to generate only few random values, and `SamplerDieMany` for many values. We can use those types as follows:

```julia
Sampler(RNG::Type{<:AbstractRNG}, die::Die, ::Val{1}) = SamplerDie1(...)
Sampler(RNG::Type{<:AbstractRNG}, die::Die, ::Val{Inf}) = SamplerDieMany(...)
```


Of course, `rand` must also be defined on those types (i.e. `rand(::AbstractRNG, ::SamplerDie1)` and `rand(::AbstractRNG, ::SamplerDieMany)`). Note that, as usual, `SamplerTrivial` and `SamplerSimple` can be used if custom types are not necessary.

Note: `Sampler(rng, x)` is simply a shorthand for `Sampler(rng, x, Val(Inf))`, and `Random.Repetition` is an alias for `Union{Val{1}, Val{Inf}}`.

### Creating new generators {#Creating-new-generators}

The API is not clearly defined yet, but as a rule of thumb:
1. any `rand` method producing &quot;basic&quot; types (`isbitstype` integer and floating types in `Base`) should be defined for this specific RNG, if they are needed;
  
1. other documented `rand` methods accepting an `AbstractRNG` should work out of the box, (provided the methods from 1) what are relied on are implemented), but can of course be specialized for this RNG if there is room for optimization;
  
1. `copy` for pseudo-RNGs should return an independent copy that generates the exact same random sequence as the original from that point when called in the same way. When this is not feasible (e.g. hardware-based RNGs), `copy` must not be implemented.
  

Concerning 1), a `rand` method may happen to work automatically, but it&#39;s not officially supported and may break without warnings in a subsequent release.

To define a new `rand` method for an hypothetical `MyRNG` generator, and a value specification `s` (e.g. `s == Int`, or `s == 1:10`) of type `S==typeof(s)` or `S==Type{s}` if `s` is a type, the same two methods as we saw before must be defined:
1. `Sampler(::Type{MyRNG}, ::S, ::Repetition)`, which returns an object of type say `SamplerS`
  
1. `rand(rng::MyRNG, sp::SamplerS)`
  

It can happen that `Sampler(rng::AbstractRNG, ::S, ::Repetition)` is already defined in the `Random` module. It would then be possible to skip step 1) in practice (if one wants to specialize generation for this particular RNG type), but the corresponding `SamplerS` type is considered as internal detail, and may be changed without warning.

#### Specializing array generation {#Specializing-array-generation}

In some cases, for a given RNG type, generating an array of random values can be more efficient with a specialized method than by merely using the decoupling technique explained before. This is for example the case for `MersenneTwister`, which natively writes random values in an array.

To implement this specialization for `MyRNG` and for a specification `s`, producing elements of type `S`, the following method can be defined: `rand!(rng::MyRNG, a::AbstractArray{S}, ::SamplerS)`, where `SamplerS` is the type of the sampler returned by `Sampler(MyRNG, s, Val(Inf))`. Instead of `AbstractArray`, it&#39;s possible to implement the functionality only for a subtype, e.g. `Array{S}`. The non-mutating array method of `rand` will automatically call this specialization internally.



# Reproducibility {#Reproducibility}

By using an RNG parameter initialized with a given seed, you can reproduce the same pseudorandom number sequence when running your program multiple times. However, a minor release of Julia (e.g. 1.3 to 1.4) _may change_ the sequence of pseudorandom numbers generated from a specific seed. (Even if the sequence produced by a low-level function like [`rand`](/stdlib/Random#Base.rand) does not change, the output of higher-level functions like [`randsubseq`](/stdlib/Random#Random.randsubseq) may change due to algorithm updates.) Rationale: guaranteeing that pseudorandom streams never change prohibits many algorithmic improvements.

If you need to guarantee exact reproducibility of random data, it is advisable to simply _save the data_ (e.g. as a supplementary attachment in a scientific publication). (You can also, of course, specify a particular Julia version and package manifest, especially if you require bit reproducibility.)

Software tests that rely on _specific_ &quot;random&quot; data should also generally either save the data, embed it into the test code, or use third-party packages like [StableRNGs.jl](https://github.com/JuliaRandom/StableRNGs.jl). On the other hand, tests that should pass for _most_ random data (e.g. testing `A \ (A*x) ≈ x` for a random matrix `A = randn(n,n)`) can use an RNG with a fixed seed to ensure that simply running the test many times does not encounter a failure due to very improbable data (e.g. an extremely ill-conditioned matrix).

The statistical _distribution_ from which random samples are drawn _is_ guaranteed to be the same across any minor Julia releases.
