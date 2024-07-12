


# Future

The `Future` module implements future behavior of already existing functions, which will replace the current version in a future release of Julia.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Future.copy!' href='#Future.copy!'>#</a>&nbsp;<b><u>Future.copy!</u></b> &mdash; <i>Function</i>.




```julia
Future.copy!(dst, src) -> dst
```


Copy `src` into `dst`.

::: tip Julia 1.1

This function has moved to `Base` with Julia 1.1, consider using `copy!(dst, src)` instead. `Future.copy!` will be deprecated in the future.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Future/src/Future.jl#L14-L22)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Future.randjump' href='#Future.randjump'>#</a>&nbsp;<b><u>Future.randjump</u></b> &mdash; <i>Function</i>.




```julia
randjump(r::MersenneTwister, steps::Integer) -> MersenneTwister
```


Create an initialized `MersenneTwister` object, whose state is moved forward (without generating numbers) from `r` by `steps` steps. One such step corresponds to the generation of two `Float64` numbers. For each different value of `steps`, a large polynomial has to be generated internally. One is already pre-computed for `steps=big(10)^20`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Future/src/Future.jl#L30-L38)

</div>
<br>
