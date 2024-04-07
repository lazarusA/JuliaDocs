


# Printf {#man-printf}

The `Printf` module provides formatted output functions similar to the C standard library&#39;s `printf`. It allows formatted printing to an output stream or to a string.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Printf.@printf' href='#Printf.@printf'>#</a>&nbsp;<b><u>Printf.@printf</u></b> &mdash; <i>Macro</i>.




```julia
@printf([io::IO], "%Fmt", args...)
```


Print `args` using C `printf` style format specification string. Optionally, an `IO` may be passed as the first argument to redirect output.

**Examples**

```julia
julia> @printf "Hello %s" "world"
Hello world

julia> @printf "Scientific notation %e" 1.234
Scientific notation 1.234000e+00

julia> @printf "Scientific notation three digits %.3e" 1.23456
Scientific notation three digits 1.235e+00

julia> @printf "Decimal two digits %.2f" 1.23456
Decimal two digits 1.23

julia> @printf "Padded to length 5 %5i" 123
Padded to length 5   123

julia> @printf "Padded with zeros to length 6 %06i" 123
Padded with zeros to length 6 000123

julia> @printf "Use shorter of decimal or scientific %g %g" 1.23 12300000.0
Use shorter of decimal or scientific 1.23 1.23e+07

julia> @printf "Use dynamic width and precision  %*.*f" 10 2 0.12345
Use dynamic width and precision        0.12
```


For a systematic specification of the format, see [here](https://en.cppreference.com/w/c/io/fprintf). See also [`@sprintf`](/stdlib/Printf#Printf.@sprintf) to get the result as a `String` instead of it being printed.

**Caveats**

`Inf` and `NaN` are printed consistently as `Inf` and `NaN` for flags `%a`, `%A`, `%e`, `%E`, `%f`, `%F`, `%g`, and `%G`. Furthermore, if a floating point number is equally close to the numeric values of two possible output strings, the output string further away from zero is chosen.

**Examples**

```julia
julia> @printf("%f %F %f %F", Inf, Inf, NaN, NaN)
Inf Inf NaN NaN

julia> @printf "%.0f %.1f %f" 0.5 0.025 -0.0078125
0 0.0 -0.007812
```


::: tip Julia 1.8

Starting in Julia 1.8, `%s` (string) and `%c` (character) widths are computed using [`textwidth`](/base/strings#Base.Unicode.textwidth), which e.g. ignores zero-width characters (such as combining characters for diacritical marks) and treats certain &quot;wide&quot; characters (e.g. emoji) as width `2`.

:::

::: tip Julia 1.10

Dynamic width specifiers like `%*s` and `%0*.*f` require Julia 1.10.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Printf/src/Printf.jl#L949-L1007)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Printf.@sprintf' href='#Printf.@sprintf'>#</a>&nbsp;<b><u>Printf.@sprintf</u></b> &mdash; <i>Macro</i>.




```julia
@sprintf("%Fmt", args...)
```


Return [`@printf`](/stdlib/Printf#Printf.@printf) formatted output as string.

**Examples**

```julia
julia> @sprintf "this is a %s %15.1f" "test" 34.567
"this is a test            34.6"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Printf/src/Printf.jl#L1022-L1032)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Printf.Format' href='#Printf.Format'>#</a>&nbsp;<b><u>Printf.Format</u></b> &mdash; <i>Type</i>.




```julia
Printf.Format(format_str)
```


Create a C printf-compatible format object that can be used for formatting values.

The input `format_str` can include any valid format specifier character and modifiers.

A `Format` object can be passed to `Printf.format(f::Format, args...)` to produce a formatted string, or `Printf.format(io::IO, f::Format, args...)` to print the formatted string directly to `io`.

For convenience, the `Printf.format"..."` string macro form can be used for building a `Printf.Format` object at macro-expansion-time.

::: tip Julia 1.6

`Printf.Format` requires Julia 1.6 or later.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Printf/src/Printf.jl#L65-L81)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Printf.format' href='#Printf.format'>#</a>&nbsp;<b><u>Printf.format</u></b> &mdash; <i>Function</i>.




```julia
Printf.format(f::Printf.Format, args...) => String
Printf.format(io::IO, f::Printf.Format, args...)
```


Apply a printf format object `f` to provided `args` and return the formatted string (1st method), or print directly to an `io` object (2nd method). See [`@printf`](/stdlib/Printf#Printf.@printf) for more details on C `printf` support.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Printf/src/Printf.jl#L924-L931)

</div>
<br>
