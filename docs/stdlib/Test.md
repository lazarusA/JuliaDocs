


# Unit Testing {#Unit-Testing}



## Testing Base Julia {#Testing-Base-Julia}

Julia is under rapid development and has an extensive test suite to verify functionality across multiple platforms. If you build Julia from source, you can run this test suite with `make test`. In a binary install, you can run the test suite using `Base.runtests()`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.runtests' href='#Base.runtests'>#</a>&nbsp;<b><u>Base.runtests</u></b> &mdash; <i>Function</i>.




```julia
Base.runtests(tests=["all"]; ncores=ceil(Int, Sys.CPU_THREADS / 2),
              exit_on_error=false, revise=false, [seed])
```


Run the Julia unit tests listed in `tests`, which can be either a string or an array of strings, using `ncores` processors. If `exit_on_error` is `false`, when one test fails, all remaining tests in other files will still be run; they are otherwise discarded, when `exit_on_error == true`. If `revise` is `true`, the `Revise` package is used to load any modifications to `Base` or to the standard libraries before running the tests. If a seed is provided via the keyword argument, it is used to seed the global RNG in the context where the tests are run; otherwise the seed is chosen randomly.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/util.jl#L662-L674)

</div>
<br>

## Basic Unit Tests {#Basic-Unit-Tests}

The `Test` module provides simple _unit testing_ functionality. Unit testing is a way to see if your code is correct by checking that the results are what you expect. It can be helpful to ensure your code still works after you make changes, and can be used when developing as a way of specifying the behaviors your code should have when complete. You may also want to look at the documentation for [adding tests to your Julia Package](https://pkgdocs.julialang.org/dev/creating-packages/#Adding-tests-to-the-package).

Simple unit testing can be performed with the `@test` and `@test_throws` macros:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test' href='#Test.@test'>#</a>&nbsp;<b><u>Test.@test</u></b> &mdash; <i>Macro</i>.




```julia
@test ex
@test f(args...) key=val ...
@test ex broken=true
@test ex skip=true
```


Test that the expression `ex` evaluates to `true`. If executed inside a `@testset`, return a `Pass` `Result` if it does, a `Fail` `Result` if it is `false`, and an `Error` `Result` if it could not be evaluated. If executed outside a `@testset`, throw an exception instead of returning `Fail` or `Error`.

**Examples**

```julia
julia> @test true
Test Passed

julia> @test [1, 2] + [2, 1] == [3, 3]
Test Passed
```


The `@test f(args...) key=val...` form is equivalent to writing `@test f(args..., key=val...)` which can be useful when the expression is a call using infix syntax such as approximate comparisons:

```julia
julia> @test π ≈ 3.14 atol=0.01
Test Passed
```


This is equivalent to the uglier test `@test ≈(π, 3.14, atol=0.01)`. It is an error to supply more than one expression unless the first is a call expression and the rest are assignments (`k=v`).

You can use any key for the `key=val` arguments, except for `broken` and `skip`, which have special meanings in the context of `@test`:
- `broken=cond` indicates a test that should pass but currently consistently fails when `cond==true`.  Tests that the expression `ex` evaluates to `false` or causes an exception.  Returns a `Broken` `Result` if it does, or an `Error` `Result` if the expression evaluates to `true`.  Regular `@test ex` is evaluated when `cond==false`.
  
- `skip=cond` marks a test that should not be executed but should be included in test summary reporting as `Broken`, when `cond==true`.  This can be useful for tests that intermittently fail, or tests of not-yet-implemented functionality. Regular `@test ex` is evaluated when `cond==false`.
  

**Examples**

```julia
julia> @test 2 + 2 ≈ 6 atol=1 broken=true
Test Broken
  Expression: ≈(2 + 2, 6, atol = 1)

julia> @test 2 + 2 ≈ 5 atol=1 broken=false
Test Passed

julia> @test 2 + 2 == 5 skip=true
Test Broken
  Skipped: 2 + 2 == 5

julia> @test 2 + 2 == 4 skip=false
Test Passed
```


::: tip Julia 1.7

The `broken` and `skip` keyword arguments require at least Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L426-L492)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test_throws' href='#Test.@test_throws'>#</a>&nbsp;<b><u>Test.@test_throws</u></b> &mdash; <i>Macro</i>.




```julia
@test_throws exception expr
```


Tests that the expression `expr` throws `exception`. The exception may specify either a type, a string, regular expression, or list of strings occurring in the displayed error message, a matching function, or a value (which will be tested for equality by comparing fields). Note that `@test_throws` does not support a trailing keyword form.

::: tip Julia 1.8

The ability to specify anything other than a type or a value as `exception` requires Julia v1.8 or later.

:::

**Examples**

```julia
julia> @test_throws BoundsError [1, 2, 3][4]
Test Passed
      Thrown: BoundsError

julia> @test_throws DimensionMismatch [1, 2, 3] + [1, 2]
Test Passed
      Thrown: DimensionMismatch

julia> @test_throws "Try sqrt(Complex" sqrt(-1)
Test Passed
     Message: "DomainError with -1.0:\nsqrt was called with a negative real argument but will only return a complex result if called with a complex argument. Try sqrt(Complex(x))."
```


In the final example, instead of matching a single string it could alternatively have been performed with:
- `["Try", "Complex"]` (a list of strings)
  
- `r"Try sqrt\([Cc]omplex"` (a regular expression)
  
- `str -> occursin("complex", str)` (a matching function)
  


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L734-L767)

</div>
<br>

For example, suppose we want to check our new function `foo(x)` works as expected:

```julia
julia> using Test

julia> foo(x) = length(x)^2
foo (generic function with 1 method)
```


If the condition is true, a `Pass` is returned:

```julia
julia> @test foo("bar") == 9
Test Passed

julia> @test foo("fizz") >= 10
Test Passed
```


If the condition is false, then a `Fail` is returned and an exception is thrown:

```julia
julia> @test foo("f") == 20
Test Failed at none:1
  Expression: foo("f") == 20
   Evaluated: 1 == 20

ERROR: There was an error during testing
```


If the condition could not be evaluated because an exception was thrown, which occurs in this case because `length` is not defined for symbols, an `Error` object is returned and an exception is thrown:

```julia
julia> @test foo(:cat) == 1
Error During Test
  Test threw an exception of type MethodError
  Expression: foo(:cat) == 1
  MethodError: no method matching length(::Symbol)
  The function `length` exists, but no method is defined for this combination of argument types.

  Closest candidates are:
    length(::SimpleVector) at essentials.jl:256
    length(::Base.MethodList) at reflection.jl:521
    length(::MethodTable) at reflection.jl:597
    ...
  Stacktrace:
  [...]
ERROR: There was an error during testing
```


If we expect that evaluating an expression _should_ throw an exception, then we can use `@test_throws` to check that this occurs:

```julia
julia> @test_throws MethodError foo(:cat)
Test Passed
      Thrown: MethodError
```


## Working with Test Sets {#Working-with-Test-Sets}

Typically a large number of tests are used to make sure functions work correctly over a range of inputs. In the event a test fails, the default behavior is to throw an exception immediately. However, it is normally preferable to run the rest of the tests first to get a better picture of how many errors there are in the code being tested.

::: tip Note

The `@testset` will create a local scope of its own when running the tests in it.

:::

The `@testset` macro can be used to group tests into _sets_. All the tests in a test set will be run, and at the end of the test set a summary will be printed. If any of the tests failed, or could not be evaluated due to an error, the test set will then throw a `TestSetException`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@testset' href='#Test.@testset'>#</a>&nbsp;<b><u>Test.@testset</u></b> &mdash; <i>Macro</i>.




```julia
@testset [CustomTestSet] [options...] ["description"] begin test_ex end
@testset [CustomTestSet] [options...] ["description $v"] for v in itr test_ex end
@testset [CustomTestSet] [options...] ["description $v, $w"] for v in itrv, w in itrw test_ex end
@testset [CustomTestSet] [options...] ["description"] test_func()
@testset let v = v, w = w; test_ex; end
```


**With begin/end or function call**

When @testset is used, with begin/end or a single function call, the macro starts a new test set in which to evaluate the given expression.

If no custom testset type is given it defaults to creating a `DefaultTestSet`. `DefaultTestSet` records all the results and, if there are any `Fail`s or `Error`s, throws an exception at the end of the top-level (non-nested) test set, along with a summary of the test results.

Any custom testset type (subtype of `AbstractTestSet`) can be given and it will also be used for any nested `@testset` invocations. The given options are only applied to the test set where they are given. The default test set type accepts three boolean options:
- `verbose`: if `true`, the result summary of the nested testsets is shown even when they all pass (the default is `false`).
  
- `showtiming`: if `true`, the duration of each displayed testset is shown (the default is `true`).
  
- `failfast`: if `true`, any test failure or error will cause the testset and any child testsets to return immediately (the default is `false`). This can also be set globally via the env var `JULIA_TEST_FAILFAST`.
  

::: tip Julia 1.8

`@testset test_func()` requires at least Julia 1.8.

:::

::: tip Julia 1.9

`failfast` requires at least Julia 1.9.

:::

The description string accepts interpolation from the loop indices. If no description is provided, one is constructed based on the variables. If a function call is provided, its name will be used. Explicit description strings override this behavior.

By default the `@testset` macro will return the testset object itself, though this behavior can be customized in other testset types. If a `for` loop is used then the macro collects and returns a list of the return values of the `finish` method, which by default will return a list of the testset objects used in each iteration.

Before the execution of the body of a `@testset`, there is an implicit call to `Random.seed!(seed)` where `seed` is the current seed of the global RNG. Moreover, after the execution of the body, the state of the global RNG is restored to what it was before the `@testset`. This is meant to ease reproducibility in case of failure, and to allow seamless re-arrangements of `@testset`s regardless of their side-effect on the global RNG state.

**Examples**

```julia
julia> @testset "trigonometric identities" begin
           θ = 2/3*π
           @test sin(-θ) ≈ -sin(θ)
           @test cos(-θ) ≈ cos(θ)
           @test sin(2θ) ≈ 2*sin(θ)*cos(θ)
           @test cos(2θ) ≈ cos(θ)^2 - sin(θ)^2
       end;
Test Summary:            | Pass  Total  Time
trigonometric identities |    4      4  0.2s
```


**`@testset for`**

When `@testset for` is used, the macro starts a new test for each iteration of the provided loop. The semantics of each test set are otherwise identical to that of that `begin/end` case (as if used for each loop iteration).

**`@testset let`**

When `@testset let` is used, the macro starts a _transparent_ test set with the given object added as a context object to any failing test contained therein. This is useful when performing a set of related tests on one larger object and it is desirable to print this larger object when any of the individual tests fail. Transparent test sets do not introduce additional levels of nesting in the test set hierarchy and are passed through directly to the parent test set (with the context object appended to any failing tests.)

::: tip Julia 1.9

`@testset let` requires at least Julia 1.9.

:::

::: tip Julia 1.10

Multiple `let` assignments are supported since Julia 1.10.

:::

**Examples**

```julia
julia> @testset let logi = log(im)
           @test imag(logi) == π/2
           @test !iszero(real(logi))
       end
Test Failed at none:3
  Expression: !(iszero(real(logi)))
     Context: logi = 0.0 + 1.5707963267948966im

ERROR: There was an error during testing

julia> @testset let logi = log(im), op = !iszero
           @test imag(logi) == π/2
           @test op(real(logi))
       end
Test Failed at none:3
  Expression: op(real(logi))
     Context: logi = 0.0 + 1.5707963267948966im
              op = !iszero

ERROR: There was an error during testing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1477-L1589)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.TestSetException' href='#Test.TestSetException'>#</a>&nbsp;<b><u>Test.TestSetException</u></b> &mdash; <i>Type</i>.




```julia
TestSetException
```


Thrown when a test set finishes and not all tests passed.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L974-L978)

</div>
<br>

We can put our tests for the `foo(x)` function in a test set:

```julia
julia> @testset "Foo Tests" begin
           @test foo("a")   == 1
           @test foo("ab")  == 4
           @test foo("abc") == 9
       end;
Test Summary: | Pass  Total  Time
Foo Tests     |    3      3  0.0s
```


Test sets can also be nested:

```julia
julia> @testset "Foo Tests" begin
           @testset "Animals" begin
               @test foo("cat") == 9
               @test foo("dog") == foo("cat")
           end
           @testset "Arrays $i" for i in 1:3
               @test foo(zeros(i)) == i^2
               @test foo(fill(1.0, i)) == i^2
           end
       end;
Test Summary: | Pass  Total  Time
Foo Tests     |    8      8  0.0s
```


As well as call functions:

```julia
julia> f(x) = @test isone(x)
f (generic function with 1 method)

julia> @testset f(1);
Test Summary: | Pass  Total  Time
f             |    1      1  0.0s
```


This can be used to allow for factorization of test sets, making it easier to run individual test sets by running the associated functions instead. Note that in the case of functions, the test set will be given the name of the called function. In the event that a nested test set has no failures, as happened here, it will be hidden in the summary, unless the `verbose=true` option is passed:

```julia
julia> @testset verbose = true "Foo Tests" begin
           @testset "Animals" begin
               @test foo("cat") == 9
               @test foo("dog") == foo("cat")
           end
           @testset "Arrays $i" for i in 1:3
               @test foo(zeros(i)) == i^2
               @test foo(fill(1.0, i)) == i^2
           end
       end;
Test Summary: | Pass  Total  Time
Foo Tests     |    8      8  0.0s
  Animals     |    2      2  0.0s
  Arrays 1    |    2      2  0.0s
  Arrays 2    |    2      2  0.0s
  Arrays 3    |    2      2  0.0s
```


If we do have a test failure, only the details for the failed test sets will be shown:

```julia-repl; filter = r"[0-9\.]+s"
julia> @testset "Foo Tests" begin
           @testset "Animals" begin
               @testset "Felines" begin
                   @test foo("cat") == 9
               end
               @testset "Canines" begin
                   @test foo("dog") == 9
               end
           end
           @testset "Arrays" begin
               @test foo(zeros(2)) == 4
               @test foo(fill(1.0, 4)) == 15
           end
       end

Arrays: Test Failed
  Expression: foo(fill(1.0, 4)) == 15
   Evaluated: 16 == 15
[...]
Test Summary: | Pass  Fail  Total  Time
Foo Tests     |    3     1      4  0.0s
  Animals     |    2            2  0.0s
  Arrays      |    1     1      2  0.0s
ERROR: Some tests did not pass: 3 passed, 1 failed, 0 errored, 0 broken.
```


## Testing Log Statements {#Testing-Log-Statements}

One can use the [`@test_logs`](/stdlib/Test#Test.@test_logs) macro to test log statements, or use a [`TestLogger`](/stdlib/Test#Test.TestLogger).
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test_logs' href='#Test.@test_logs'>#</a>&nbsp;<b><u>Test.@test_logs</u></b> &mdash; <i>Macro</i>.




```julia
@test_logs [log_patterns...] [keywords] expression
```


Collect a list of log records generated by `expression` using `collect_test_logs`, check that they match the sequence `log_patterns`, and return the value of `expression`.  The `keywords` provide some simple filtering of log records: the `min_level` keyword controls the minimum log level which will be collected for the test, the `match_mode` keyword defines how matching will be performed (the default `:all` checks that all logs and patterns match pairwise; use `:any` to check that the pattern matches at least once somewhere in the sequence.)

The most useful log pattern is a simple tuple of the form `(level,message)`. A different number of tuple elements may be used to match other log metadata, corresponding to the arguments to passed to `AbstractLogger` via the `handle_message` function: `(level,message,module,group,id,file,line)`. Elements which are present will be matched pairwise with the log record fields using `==` by default, with the special cases that `Symbol`s may be used for the standard log levels, and `Regex`s in the pattern will match string or Symbol fields using `occursin`.

**Examples**

Consider a function which logs a warning, and several debug messages:

```
function foo(n)
    @info "Doing foo with n=$n"
    for i=1:n
        @debug "Iteration $i"
    end
    42
end
```


We can test the info message using

```
@test_logs (:info,"Doing foo with n=2") foo(2)
```


If we also wanted to test the debug messages, these need to be enabled with the `min_level` keyword:

```
using Logging
@test_logs (:info,"Doing foo with n=2") (:debug,"Iteration 1") (:debug,"Iteration 2") min_level=Logging.Debug foo(2)
```


If you want to test that some particular messages are generated while ignoring the rest, you can set the keyword `match_mode=:any`:

```
using Logging
@test_logs (:info,) (:debug,"Iteration 42") min_level=Logging.Debug match_mode=:any foo(100)
```


The macro may be chained with `@test` to also test the returned value:

```
@test (@test_logs (:info,"Doing foo with n=2") foo(2)) == 42
```


If you want to test for the absence of warnings, you can omit specifying log patterns and set the `min_level` accordingly:

```
# test that the expression logs no messages when the logger level is warn:
@test_logs min_level=Logging.Warn @info("Some information") # passes
@test_logs min_level=Logging.Warn @warn("Some information") # fails
```


If you want to test the absence of warnings (or error messages) in [`stderr`](/base/io-network#Base.stderr) which are not generated by `@warn`, see [`@test_nowarn`](/stdlib/Test#Test.@test_nowarn).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/logging.jl#L174-L236)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.TestLogger' href='#Test.TestLogger'>#</a>&nbsp;<b><u>Test.TestLogger</u></b> &mdash; <i>Type</i>.




```julia
TestLogger(; min_level=Info, catch_exceptions=false)
```


Create a `TestLogger` which captures logged messages in its `logs::Vector{LogRecord}` field.

Set `min_level` to control the `LogLevel`, `catch_exceptions` for whether or not exceptions thrown as part of log event generation should be caught, and `respect_maxlog` for whether or not to follow the convention of logging messages with `maxlog=n` for some integer `n` at most `n` times.

See also: [`LogRecord`](/stdlib/Test#Test.LogRecord).

**Examples**

```julia
julia> using Test, Logging

julia> f() = @info "Hi" number=5;

julia> test_logger = TestLogger();

julia> with_logger(test_logger) do
           f()
           @info "Bye!"
       end

julia> @test test_logger.logs[1].message == "Hi"
Test Passed

julia> @test test_logger.logs[1].kwargs[:number] == 5
Test Passed

julia> @test test_logger.logs[2].message == "Bye!"
Test Passed
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/logging.jl#L51-L86)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.LogRecord' href='#Test.LogRecord'>#</a>&nbsp;<b><u>Test.LogRecord</u></b> &mdash; <i>Type</i>.




```julia
LogRecord
```


Stores the results of a single log event. Fields:
- `level`: the [`LogLevel`](/stdlib/Logging#Logging.LogLevel) of the log message
  
- `message`: the textual content of the log message
  
- `_module`: the module of the log event
  
- `group`: the logging group (by default, the name of the file containing the log event)
  
- `id`: the ID of the log event
  
- `file`: the file containing the log event
  
- `line`: the line within the file of the log event
  
- `kwargs`: any keyword arguments passed to the log event
  


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/logging.jl#L8-L21)

</div>
<br>

## Other Test Macros {#Other-Test-Macros}

As calculations on floating-point values can be imprecise, you can perform approximate equality checks using either `@test a ≈ b` (where `≈`, typed via tab completion of `\approx`, is the [`isapprox`](/base/math#Base.isapprox) function) or use [`isapprox`](/base/math#Base.isapprox) directly.

```julia
julia> @test 1 ≈ 0.999999999
Test Passed

julia> @test 1 ≈ 0.999999
Test Failed at none:1
  Expression: 1 ≈ 0.999999
   Evaluated: 1 ≈ 0.999999

ERROR: There was an error during testing
```


You can specify relative and absolute tolerances by setting the `rtol` and `atol` keyword arguments of `isapprox`, respectively, after the `≈` comparison:

```julia
julia> @test 1 ≈ 0.999999  rtol=1e-5
Test Passed
```


Note that this is not a specific feature of the `≈` but rather a general feature of the `@test` macro: `@test a <op> b key=val` is transformed by the macro into `@test op(a, b, key=val)`. It is, however, particularly useful for `≈` tests.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@inferred' href='#Test.@inferred'>#</a>&nbsp;<b><u>Test.@inferred</u></b> &mdash; <i>Macro</i>.




```julia
@inferred [AllowedType] f(x)
```


Tests that the call expression `f(x)` returns a value of the same type inferred by the compiler. It is useful to check for type stability.

`f(x)` can be any call expression. Returns the result of `f(x)` if the types match, and an `Error` `Result` if it finds different types.

Optionally, `AllowedType` relaxes the test, by making it pass when either the type of `f(x)` matches the inferred type modulo `AllowedType`, or when the return type is a subtype of `AllowedType`. This is useful when testing type stability of functions returning a small union such as `Union{Nothing, T}` or `Union{Missing, T}`.

```julia
julia> f(a) = a > 1 ? 1 : 1.0
f (generic function with 1 method)

julia> typeof(f(2))
Int64

julia> @code_warntype f(2)
MethodInstance for f(::Int64)
  from f(a) @ Main none:1
Arguments
  #self#::Core.Const(f)
  a::Int64
Body::UNION{FLOAT64, INT64}
1 ─ %1 = (a > 1)::Bool
└──      goto #3 if not %1
2 ─      return 1
3 ─      return 1.0

julia> @inferred f(2)
ERROR: return type Int64 does not match inferred return type Union{Float64, Int64}
[...]

julia> @inferred max(1, 2)
2

julia> g(a) = a < 10 ? missing : 1.0
g (generic function with 1 method)

julia> @inferred g(20)
ERROR: return type Float64 does not match inferred return type Union{Missing, Float64}
[...]

julia> @inferred Missing g(20)
1.0

julia> h(a) = a < 10 ? missing : f(a)
h (generic function with 1 method)

julia> @inferred Missing h(20)
ERROR: return type Int64 does not match inferred return type Union{Missing, Float64, Int64}
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1906-L1963)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test_deprecated' href='#Test.@test_deprecated'>#</a>&nbsp;<b><u>Test.@test_deprecated</u></b> &mdash; <i>Macro</i>.




```julia
@test_deprecated [pattern] expression
```


When `--depwarn=yes`, test that `expression` emits a deprecation warning and return the value of `expression`.  The log message string will be matched against `pattern` which defaults to `r"deprecated"i`.

When `--depwarn=no`, simply return the result of executing `expression`.  When `--depwarn=error`, check that an ErrorException is thrown.

**Examples**

```
# Deprecated in julia 0.7
@test_deprecated num2hex(1)

# The returned value can be tested by chaining with @test:
@test (@test_deprecated num2hex(1)) == "0000000000000001"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/logging.jl#L308-L327)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test_warn' href='#Test.@test_warn'>#</a>&nbsp;<b><u>Test.@test_warn</u></b> &mdash; <i>Macro</i>.




```julia
@test_warn msg expr
```


Test whether evaluating `expr` results in [`stderr`](/base/io-network#Base.stderr) output that contains the `msg` string or matches the `msg` regular expression.  If `msg` is a boolean function, tests whether `msg(output)` returns `true`.  If `msg` is a tuple or array, checks that the error output contains/matches each item in `msg`. Returns the result of evaluating `expr`.

See also [`@test_nowarn`](/stdlib/Test#Test.@test_nowarn) to check for the absence of error output.

Note: Warnings generated by `@warn` cannot be tested with this macro. Use [`@test_logs`](/stdlib/Test#Test.@test_logs) instead.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L868-L881)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test_nowarn' href='#Test.@test_nowarn'>#</a>&nbsp;<b><u>Test.@test_nowarn</u></b> &mdash; <i>Macro</i>.




```julia
@test_nowarn expr
```


Test whether evaluating `expr` results in empty [`stderr`](/base/io-network#Base.stderr) output (no warnings or other messages).  Returns the result of evaluating `expr`.

Note: The absence of warnings generated by `@warn` cannot be tested with this macro. Use [`@test_logs`](/stdlib/Test#Test.@test_logs) instead.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L900-L908)

</div>
<br>

## Broken Tests {#Broken-Tests}

If a test fails consistently it can be changed to use the `@test_broken` macro. This will denote the test as `Broken` if the test continues to fail and alerts the user via an `Error` if the test succeeds.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test_broken' href='#Test.@test_broken'>#</a>&nbsp;<b><u>Test.@test_broken</u></b> &mdash; <i>Macro</i>.




```julia
@test_broken ex
@test_broken f(args...) key=val ...
```


Indicates a test that should pass but currently consistently fails. Tests that the expression `ex` evaluates to `false` or causes an exception. Returns a `Broken` `Result` if it does, or an `Error` `Result` if the expression evaluates to `true`.  This is equivalent to [`@test ex broken=true`](/stdlib/Test#Test.@test).

The `@test_broken f(args...) key=val...` form works as for the `@test` macro.

**Examples**

```julia
julia> @test_broken 1 == 2
Test Broken
  Expression: 1 == 2

julia> @test_broken 1 == 2 atol=0.1
Test Broken
  Expression: ==(1, 2, atol = 0.1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L526-L548)

</div>
<br>

`@test_skip` is also available to skip a test without evaluation, but counting the skipped test in the test set reporting. The test will not run but gives a `Broken` `Result`.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.@test_skip' href='#Test.@test_skip'>#</a>&nbsp;<b><u>Test.@test_skip</u></b> &mdash; <i>Macro</i>.




```julia
@test_skip ex
@test_skip f(args...) key=val ...
```


Marks a test that should not be executed but should be included in test summary reporting as `Broken`. This can be useful for tests that intermittently fail, or tests of not-yet-implemented functionality.  This is equivalent to [`@test ex skip=true`](/stdlib/Test#Test.@test).

The `@test_skip f(args...) key=val...` form works as for the `@test` macro.

**Examples**

```julia
julia> @test_skip 1 == 2
Test Broken
  Skipped: 1 == 2

julia> @test_skip 1 == 2 atol=0.1
Test Broken
  Skipped: ==(1, 2, atol = 0.1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L557-L578)

</div>
<br>

## Test result types {#Test-result-types}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.Result' href='#Test.Result'>#</a>&nbsp;<b><u>Test.Result</u></b> &mdash; <i>Type</i>.




```julia
Test.Result
```


All tests produce a result object. This object may or may not be stored, depending on whether the test is part of a test set.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L106-L111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.Pass' href='#Test.Pass'>#</a>&nbsp;<b><u>Test.Pass</u></b> &mdash; <i>Type</i>.




```julia
Test.Pass <: Test.Result
```


The test condition was true, i.e. the expression evaluated to true or the correct exception was thrown.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L114-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.Fail' href='#Test.Fail'>#</a>&nbsp;<b><u>Test.Fail</u></b> &mdash; <i>Type</i>.




```julia
Test.Fail <: Test.Result
```


The test condition was false, i.e. the expression evaluated to false or the correct exception was not thrown.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L144-L149)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.Error' href='#Test.Error'>#</a>&nbsp;<b><u>Test.Error</u></b> &mdash; <i>Type</i>.




```julia
Test.Error <: Test.Result
```


The test condition couldn&#39;t be evaluated due to an exception, or it evaluated to something other than a [`Bool`](/base/numbers#Core.Bool). In the case of `@test_broken` it is used to indicate that an unexpected `Pass` `Result` occurred.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L212-L219)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.Broken' href='#Test.Broken'>#</a>&nbsp;<b><u>Test.Broken</u></b> &mdash; <i>Type</i>.




```julia
Test.Broken <: Test.Result
```


The test condition is the expected (failed) result of a broken test, or was explicitly skipped with `@test_skip`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L293-L298)

</div>
<br>

## Creating Custom `AbstractTestSet` Types {#Creating-Custom-AbstractTestSet-Types}

Packages can create their own `AbstractTestSet` subtypes by implementing the `record` and `finish` methods. The subtype should have a one-argument constructor taking a description string, with any options passed in as keyword arguments.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.record' href='#Test.record'>#</a>&nbsp;<b><u>Test.record</u></b> &mdash; <i>Function</i>.




```julia
record(ts::AbstractTestSet, res::Result)
```


Record a result to a testset. This function is called by the `@testset` infrastructure each time a contained `@test` macro completes, and is given the test result (which could be an `Error`). This will also be called with an `Error` if an exception is thrown inside the test block but outside of a `@test` context.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L943-L950)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.finish' href='#Test.finish'>#</a>&nbsp;<b><u>Test.finish</u></b> &mdash; <i>Function</i>.




```julia
finish(ts::AbstractTestSet)
```


Do any final processing necessary for the given testset. This is called by the `@testset` infrastructure after a test block executes.

Custom `AbstractTestSet` subtypes should call `record` on their parent (if there is one) to add themselves to the tree of test results. This might be implemented as:

```julia
if get_testset_depth() != 0
    # Attach this test set to the parent test set
    parent_ts = get_testset()
    record(parent_ts, self)
    return self
end
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L953-L971)

</div>
<br>

`Test` takes responsibility for maintaining a stack of nested testsets as they are executed, but any result accumulation is the responsibility of the `AbstractTestSet` subtype. You can access this stack with the `get_testset` and `get_testset_depth` methods. Note that these functions are not exported.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.get_testset' href='#Test.get_testset'>#</a>&nbsp;<b><u>Test.get_testset</u></b> &mdash; <i>Function</i>.




```julia
get_testset()
```


Retrieve the active test set from the task&#39;s local storage. If no test set is active, use the fallback default test set.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1858-L1863)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.get_testset_depth' href='#Test.get_testset_depth'>#</a>&nbsp;<b><u>Test.get_testset_depth</u></b> &mdash; <i>Function</i>.




```julia
get_testset_depth()
```


Return the number of active test sets, not including the default test set


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1893-L1897)

</div>
<br>

`Test` also makes sure that nested `@testset` invocations use the same `AbstractTestSet` subtype as their parent unless it is set explicitly. It does not propagate any properties of the testset. Option inheritance behavior can be implemented by packages using the stack infrastructure that `Test` provides.

Defining a basic `AbstractTestSet` subtype might look like:

```julia
import Test: Test, record, finish
using Test: AbstractTestSet, Result, Pass, Fail, Error
using Test: get_testset_depth, get_testset
struct CustomTestSet <: Test.AbstractTestSet
    description::AbstractString
    foo::Int
    results::Vector
    # constructor takes a description string and options keyword arguments
    CustomTestSet(desc; foo=1) = new(desc, foo, [])
end

record(ts::CustomTestSet, child::AbstractTestSet) = push!(ts.results, child)
record(ts::CustomTestSet, res::Result) = push!(ts.results, res)
function finish(ts::CustomTestSet)
    # just record if we're not the top-level parent
    if get_testset_depth() > 0
        record(get_testset(), ts)
        return ts
    end

    # so the results are printed if we are at the top level
    Test.print_test_results(ts)
    return ts
end
```


And using that testset looks like:

```julia
@testset CustomTestSet foo=4 "custom testset inner 2" begin
    # this testset should inherit the type, but not the argument.
    @testset "custom testset inner" begin
        @test true
    end
end
```


In order to use a custom testset and have the recorded results printed as part of any outer default testset, also define `Test.get_test_counts`. This might look like so:

```julia
using Test: AbstractTestSet, Pass, Fail, Error, Broken, get_test_counts, TestCounts, format_duration

function Test.get_test_counts(ts::CustomTestSet)
    passes, fails, errors, broken = 0, 0, 0, 0
    # cumulative results
    c_passes, c_fails, c_errors, c_broken = 0, 0, 0, 0

    for t in ts.results
        # count up results
        isa(t, Pass)   && (passes += 1)
        isa(t, Fail)   && (fails  += 1)
        isa(t, Error)  && (errors += 1)
        isa(t, Broken) && (broken += 1)
        # handle children
        if isa(t, AbstractTestSet)
            tc = get_test_counts(t)::TestCounts
            c_passes += tc.passes + tc.cumulative_passes
            c_fails  += tc.fails + tc.cumulative_fails
            c_errors += tc.errors + tc.cumulative_errors
            c_broken += tc.broken + tc.cumulative_broken
        end
    end
    # get a duration, if we have one
    duration = format_duration(ts)
    return TestCounts(true, passes, fails, errors, broken, c_passes, c_fails, c_errors, c_broken, duration)
end
```

<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.TestCounts' href='#Test.TestCounts'>#</a>&nbsp;<b><u>Test.TestCounts</u></b> &mdash; <i>Type</i>.




```julia
TestCounts
```


Holds the state for recursively gathering the results of a test set for display purposes.

Fields:
- `customized`: Whether the function `get_test_counts` was customized for the `AbstractTestSet`               this counts object is for. If a custom method was defined, always pass `true`               to the constructor.
  
- `passes`: The number of passing `@test` invocations.
  
- `fails`: The number of failing `@test` invocations.
  
- `errors`: The number of erroring `@test` invocations.
  
- `broken`: The number of broken `@test` invocations.
  
- `passes`: The cumulative number of passing `@test` invocations.
  
- `fails`: The cumulative number of failing `@test` invocations.
  
- `errors`: The cumulative number of erroring `@test` invocations.
  
- `broken`: The cumulative number of broken `@test` invocations.
  
- `duration`: The total duration the `AbstractTestSet` in question ran for, as a formatted `String`.
  


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1293-L1312)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.get_test_counts' href='#Test.get_test_counts'>#</a>&nbsp;<b><u>Test.get_test_counts</u></b> &mdash; <i>Function</i>.




&quot;     get_test_counts(::AbstractTestSet) -&gt; TestCounts

Recursive function that counts the number of test results of each type directly in the testset, and totals across the child testsets.

Custom `AbstractTestSet` should implement this function to get their totals counted &amp; displayed with `DefaultTestSet` as well.

If this is not implemented for a custom `TestSet`, the printing falls back to reporting `x` for failures and `?s` for the duration.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1326-L1338)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.format_duration' href='#Test.format_duration'>#</a>&nbsp;<b><u>Test.format_duration</u></b> &mdash; <i>Function</i>.




```julia
format_duration(::AbstractTestSet)
```


Return a formatted string for printing the duration the testset ran for.

If not defined, falls back to `"?s"`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1363-L1369)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.print_test_results' href='#Test.print_test_results'>#</a>&nbsp;<b><u>Test.print_test_results</u></b> &mdash; <i>Function</i>.




```julia
print_test_results(ts::AbstractTestSet, depth_pad=0)
```


Print the results of an `AbstractTestSet` as a formatted table.

`depth_pad` refers to how much padding should be added in front of all output.

Called inside of `Test.finish`, if the `finish`ed testset is the topmost testset.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L1163-L1172)

</div>
<br>

## Test utilities {#Test-utilities}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.GenericArray' href='#Test.GenericArray'>#</a>&nbsp;<b><u>Test.GenericArray</u></b> &mdash; <i>Type</i>.




The `GenericArray` can be used to test generic array APIs that program to the `AbstractArray` interface, in order to ensure that functions can work with array types besides the standard `Array` type.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L2233-L2237)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.GenericDict' href='#Test.GenericDict'>#</a>&nbsp;<b><u>Test.GenericDict</u></b> &mdash; <i>Type</i>.




The `GenericDict` can be used to test generic dict APIs that program to the `AbstractDict` interface, in order to ensure that functions can work with associative types besides the standard `Dict` type.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L2209-L2213)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.GenericOrder' href='#Test.GenericOrder'>#</a>&nbsp;<b><u>Test.GenericOrder</u></b> &mdash; <i>Type</i>.




The `GenericOrder` can be used to test APIs for their support of generic ordered types.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L2245-L2248)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.GenericSet' href='#Test.GenericSet'>#</a>&nbsp;<b><u>Test.GenericSet</u></b> &mdash; <i>Type</i>.




The `GenericSet` can be used to test generic set APIs that program to the `AbstractSet` interface, in order to ensure that functions can work with set types besides the standard `Set` and `BitSet` types.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L2200-L2204)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.GenericString' href='#Test.GenericString'>#</a>&nbsp;<b><u>Test.GenericString</u></b> &mdash; <i>Type</i>.




The `GenericString` can be used to test generic string APIs that program to the `AbstractString` interface, in order to ensure that functions can work with string types besides the standard `String` type.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L2183-L2187)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.detect_ambiguities' href='#Test.detect_ambiguities'>#</a>&nbsp;<b><u>Test.detect_ambiguities</u></b> &mdash; <i>Function</i>.




```julia
detect_ambiguities(mod1, mod2...; recursive=false,
                                  ambiguous_bottom=false,
                                  allowed_undefineds=nothing)
```


Return a vector of `(Method,Method)` pairs of ambiguous methods defined in the specified modules. Use `recursive=true` to test in all submodules.

`ambiguous_bottom` controls whether ambiguities triggered only by `Union{}` type parameters are included; in most cases you probably want to set this to `false`. See [`Base.isambiguous`](/base/base#Base.isambiguous).

See [`Test.detect_unbound_args`](/stdlib/Test#Test.detect_unbound_args) for an explanation of `allowed_undefineds`.

::: tip Julia 1.8

`allowed_undefineds` requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L2021-L2039)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Test.detect_unbound_args' href='#Test.detect_unbound_args'>#</a>&nbsp;<b><u>Test.detect_unbound_args</u></b> &mdash; <i>Function</i>.




```julia
detect_unbound_args(mod1, mod2...; recursive=false, allowed_undefineds=nothing)
```


Return a vector of `Method`s which may have unbound type parameters. Use `recursive=true` to test in all submodules.

By default, any undefined symbols trigger a warning. This warning can be suppressed by supplying a collection of `GlobalRef`s for which the warning can be skipped. For example, setting

```
allowed_undefineds = Set([GlobalRef(Base, :active_repl),
                          GlobalRef(Base, :active_repl_backend)])
```


would suppress warnings about `Base.active_repl` and `Base.active_repl_backend`.

::: tip Julia 1.8

`allowed_undefineds` requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/stdlib/Test/src/Test.jl#L2100-L2120)

</div>
<br>

## Workflow for Testing Packages {#Workflow-for-Testing-Packages}

Using the tools available to us in the previous sections, here is a potential workflow of creating a package and adding tests to it.

### Generating an Example Package {#Generating-an-Example-Package}

For this workflow, we will create a package called `Example`:

```julia
pkg> generate Example
shell> cd Example
shell> mkdir test
pkg> activate .
```


### Creating Sample Functions {#Creating-Sample-Functions}

The number one requirement for testing a package is to have functionality to test. For that, we will add some simple functions to `Example` that we can test. Add the following to `src/Example.jl`:

```julia
module Example

export greet, simple_add, type_multiply

function greet()
    "Hello world!"
end

function simple_add(a, b)
    a + b
end

function type_multiply(a::Float64, b::Float64)
    a * b
end

end
```


### Creating a Test Environment {#Creating-a-Test-Environment}

From within the root of the `Example` package, navigate to the `test` directory, activate a new environment there, and add the `Test` package to the environment:

```julia
shell> cd test
pkg> activate .
(test) pkg> add Test
```


### Testing Our Package {#Testing-Our-Package}

Now, we are ready to add tests to `Example`. It is standard practice to create a file within the `test` directory called `runtests.jl` which contains the test sets we want to run. Go ahead and create that file within the `test` directory and add the following code to it:

```julia
using Example
using Test

@testset "Example tests" begin

    @testset "Math tests" begin
        include("math_tests.jl")
    end

    @testset "Greeting tests" begin
        include("greeting_tests.jl")
    end
end
```


We will need to create those two included files, `math_tests.jl` and `greeting_tests.jl`, and add some tests to them.
> 
> **Note:** Notice how we did not have to specify add `Example` into the `test` environment&#39;s `Project.toml`. This is a benefit of Julia&#39;s testing system that you could [read about more here](https://pkgdocs.julialang.org/dev/creating-packages/).
> 

#### Writing Tests for `math_tests.jl` {#Writing-Tests-for-math_tests.jl}

Using our knowledge of `Test.jl`, here are some example tests we could add to `math_tests.jl`:

```julia
@testset "Testset 1" begin
    @test 2 == simple_add(1, 1)
    @test 3.5 == simple_add(1, 2.5)
        @test_throws MethodError simple_add(1, "A")
        @test_throws MethodError simple_add(1, 2, 3)
end

@testset "Testset 2" begin
    @test 1.0 == type_multiply(1.0, 1.0)
        @test isa(type_multiply(2.0, 2.0), Float64)
    @test_throws MethodError type_multiply(1, 2.5)
end
```


#### Writing Tests for `greeting_tests.jl` {#Writing-Tests-for-greeting_tests.jl}

Using our knowledge of `Test.jl`, here are some example tests we could add to `greeting_tests.jl`:

```julia
@testset "Testset 3" begin
    @test "Hello world!" == greet()
    @test_throws MethodError greet("Antonia")
end
```


### Testing Our Package {#Testing-Our-Package-2}

Now that we have added our tests and our `runtests.jl` script in `test`, we can test our `Example` package by going back to the root of the `Example` package environment and reactivating the `Example` environment:

```julia
shell> cd ..
pkg> activate .
```


From there, we can finally run our test suite as follows:

```julia
(Example) pkg> test
     Testing Example
      Status `/tmp/jl_Yngpvy/Project.toml`
  [fa318bd2] Example v0.1.0 `/home/src/Projects/tmp/errata/Example`
  [8dfed614] Test `@stdlib/Test`
      Status `/tmp/jl_Yngpvy/Manifest.toml`
  [fa318bd2] Example v0.1.0 `/home/src/Projects/tmp/errata/Example`
  [2a0f44e3] Base64 `@stdlib/Base64`
  [b77e0a4c] InteractiveUtils `@stdlib/InteractiveUtils`
  [56ddb016] Logging `@stdlib/Logging`
  [d6f4376e] Markdown `@stdlib/Markdown`
  [9a3f8284] Random `@stdlib/Random`
  [ea8e919c] SHA `@stdlib/SHA`
  [9e88b42a] Serialization `@stdlib/Serialization`
  [8dfed614] Test `@stdlib/Test`
     Testing Running tests...
Test Summary: | Pass  Total
Example tests |    9      9
     Testing Example tests passed
```


And if all went correctly, you should see a similar output as above. Using `Test.jl`, more complicated tests can be added for packages but this should ideally point developers in the direction of how to get started with testing their own created packages.



### Code Coverage {#Code-Coverage}

Code coverage tracking during tests can be enabled using the `pkg> test --coverage` flag (or at a lower level using the [`--code-coverage`](/manual/command-line-interface#command-line-interface) julia arg). This is on by default in the [julia-runtest](https://github.com/julia-actions/julia-runtest) GitHub action.

To evaluate coverage either manually inspect the `.cov` files that are generated beside the source files locally, or in CI use the [julia-processcoverage](https://github.com/julia-actions/julia-processcoverage) GitHub action.

::: tip Julia 1.11

Since Julia 1.11, coverage is not collected during the package precompilation phase.

:::
