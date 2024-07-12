
# Essentials

## Introduction

Julia Base contains a range of functions and macros appropriate for performing scientific and numerical computing, but is also as broad as those of many general purpose programming languages. Additional functionality is available from a growing collection of [available packages](https://julialang.org/packages/). Functions are grouped by topic below.

Some general notes:
- To use module functions, use `import Module` to import the module, and `Module.fn(x)` to use the functions.
  
- Alternatively, `using Module` will import all exported `Module` functions into the current namespace.
  
- By convention, function names ending with an exclamation point (`!`) modify their arguments. Some functions have both modifying (e.g., `sort!`) and non-modifying (`sort`) versions.
  

The behaviors of `Base` and standard libraries are stable as defined in [SemVer](https://semver.org/) only if they are documented; i.e., included in the [Julia documentation](https://docs.julialang.org/) and not marked as unstable. See [API FAQ](/manual/faq#man-api) for more information.

## Getting Around {#Getting-Around}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.exit' href='#Base.exit'>#</a>&nbsp;<b><u>Base.exit</u></b> &mdash; <i>Function</i>.




```julia
exit(code=0)
```


Stop the program with an exit code. The default exit code is zero, indicating that the program completed successfully. In an interactive session, `exit()` can be called with the keyboard shortcut `^D`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/initdefs.jl#L21-L27)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.atexit' href='#Base.atexit'>#</a>&nbsp;<b><u>Base.atexit</u></b> &mdash; <i>Function</i>.




```julia
atexit(f)
```


Register a zero- or one-argument function `f()` to be called at process exit. `atexit()` hooks are called in last in first out (LIFO) order and run before object finalizers.

If `f` has a method defined for one integer argument, it will be called as `f(n::Int32)`, where `n` is the current exit code, otherwise it will be called as `f()`.

::: tip Julia 1.9

The one-argument form requires Julia 1.9

:::

Exit hooks are allowed to call `exit(n)`, in which case Julia will exit with exit code `n` (instead of the original exit code). If more than one exit hook calls `exit(n)`, then Julia will exit with the exit code corresponding to the last called exit hook that calls `exit(n)`. (Because exit hooks are called in LIFO order, &quot;last called&quot; is equivalent to &quot;first registered&quot;.)

Note: Once all exit hooks have been called, no more exit hooks can be registered, and any call to `atexit(f)` after all hooks have completed will throw an exception. This situation may occur if you are registering exit hooks from background Tasks that may still be executing concurrently during shutdown.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/initdefs.jl#L405-L429)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isinteractive' href='#Base.isinteractive'>#</a>&nbsp;<b><u>Base.isinteractive</u></b> &mdash; <i>Function</i>.




```julia
isinteractive() -> Bool
```


Determine whether Julia is running an interactive session.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/initdefs.jl#L35-L39)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.summarysize' href='#Base.summarysize'>#</a>&nbsp;<b><u>Base.summarysize</u></b> &mdash; <i>Function</i>.




```julia
Base.summarysize(obj; exclude=Union{...}, chargeall=Union{...}) -> Int
```


Compute the amount of memory, in bytes, used by all unique objects reachable from the argument.

**Keyword Arguments**
- `exclude`: specifies the types of objects to exclude from the traversal.
  
- `chargeall`: specifies the types of objects to always charge the size of all of their fields, even if those fields would normally be excluded.
  

See also [`sizeof`](/base/base#Base.sizeof-Tuple{Type}).

**Examples**

```julia
julia> Base.summarysize(1.0)
8

julia> Base.summarysize(Ref(rand(100)))
864

julia> sizeof(Ref(rand(100)))
8
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/summarysize.jl#L11-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.__precompile__' href='#Base.__precompile__'>#</a>&nbsp;<b><u>Base.__precompile__</u></b> &mdash; <i>Function</i>.




```julia
__precompile__(isprecompilable::Bool)
```


Specify whether the file calling this function is precompilable, defaulting to `true`. If a module or file is _not_ safely precompilable, it should call `__precompile__(false)` in order to throw an error if Julia attempts to precompile it.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L2105-L2111)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.include' href='#Base.include'>#</a>&nbsp;<b><u>Base.include</u></b> &mdash; <i>Function</i>.




```julia
Base.include([mapexpr::Function,] m::Module, path::AbstractString)
```


Evaluate the contents of the input source file in the global scope of module `m`. Every module (except those defined with [`baremodule`](/base/base#baremodule)) has its own definition of `include` omitting the `m` argument, which evaluates the file in that module. Returns the result of the last evaluated expression of the input file. During including, a task-local include path is set to the directory containing the file. Nested calls to `include` will search relative to that path. This function is typically used to load source interactively, or to combine files in packages that are broken into multiple source files.

The optional first argument `mapexpr` can be used to transform the included code before it is evaluated: for each parsed expression `expr` in `path`, the `include` function actually evaluates `mapexpr(expr)`.  If it is omitted, `mapexpr` defaults to [`identity`](/base/base#Base.identity).

::: tip Julia 1.5

Julia 1.5 is required for passing the `mapexpr` argument.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L2620-L2637)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='include' href='#include'>#</a>&nbsp;<b><u>include</u></b> &mdash; <i>Function</i>.




```julia
include([mapexpr::Function,] path::AbstractString)
```


Evaluate the contents of the input source file in the global scope of the containing module. Every module (except those defined with `baremodule`) has its own definition of `include`, which evaluates the file in that module. Returns the result of the last evaluated expression of the input file. During including, a task-local include path is set to the directory containing the file. Nested calls to `include` will search relative to that path. This function is typically used to load source interactively, or to combine files in packages that are broken into multiple source files. The argument `path` is normalized using [`normpath`](/base/file#Base.Filesystem.normpath) which will resolve relative path tokens such as `..` and convert `/` to the appropriate path separator.

The optional first argument `mapexpr` can be used to transform the included code before it is evaluated: for each parsed expression `expr` in `path`, the `include` function actually evaluates `mapexpr(expr)`.  If it is omitted, `mapexpr` defaults to [`identity`](/base/base#Base.identity).

Use [`Base.include`](/base/base#Base.include) to evaluate a file into another module.

::: tip Julia 1.5

Julia 1.5 is required for passing the `mapexpr` argument.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysimg.jl#L13-L34)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.include_string' href='#Base.include_string'>#</a>&nbsp;<b><u>Base.include_string</u></b> &mdash; <i>Function</i>.




```julia
include_string([mapexpr::Function,] m::Module, code::AbstractString, filename::AbstractString="string")
```


Like [`include`](/base/base#Base.include), except reads code from the given string rather than from a file.

The optional first argument `mapexpr` can be used to transform the included code before it is evaluated: for each parsed expression `expr` in `code`, the `include_string` function actually evaluates `mapexpr(expr)`.  If it is omitted, `mapexpr` defaults to [`identity`](/base/base#Base.identity).

::: tip Julia 1.5

Julia 1.5 is required for passing the `mapexpr` argument.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L2561-L2572)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.include_dependency' href='#Base.include_dependency'>#</a>&nbsp;<b><u>Base.include_dependency</u></b> &mdash; <i>Function</i>.




```julia
include_dependency(path::AbstractString; track_content::Bool=false)
```


In a module, declare that the file, directory, or symbolic link specified by `path` (relative or absolute) is a dependency for precompilation; that is, the module will need to be recompiled if the modification time `mtime` of `path` changes. If `track_content=true` recompilation is triggered when the content of `path` changes (if `path` is a directory the content equals `join(readdir(path))`).

This is only needed if your module depends on a path that is not used via [`include`](/base/base#Base.include). It has no effect outside of compilation.

::: tip Julia 1.11

Keyword argument `track_content` requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L2075-L2089)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='__init__' href='#__init__'>#</a>&nbsp;<b><u>__init__</u></b> &mdash; <i>Keyword</i>.




```julia
__init__
```


The `__init__()` function in a module executes immediately _after_ the module is loaded at runtime for the first time. It is called once, after all other statements in the module have been executed. Because it is called after fully importing the module, `__init__` functions of submodules will be executed first. Two typical uses of `__init__` are calling runtime initialization functions of external C libraries and initializing global constants that involve pointers returned by external libraries. See the [manual section about modules](/manual/modules#modules) for more details.

**Examples**

```julia
const foo_data_ptr = Ref{Ptr{Cvoid}}(0)
function __init__()
    ccall((:foo_init, :libfoo), Cvoid, ())
    foo_data_ptr[] = ccall((:foo_data, :libfoo), Ptr{Cvoid}, ())
    nothing
end
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L145-L165)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.which-Tuple{Any, Any}' href='#Base.which-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.which</u></b> &mdash; <i>Method</i>.




```julia
which(f, types)
```


Returns the method of `f` (a `Method` object) that would be called for arguments of the given `types`.

If `types` is an abstract type, then the method that would be called by `invoke` is returned.

See also: [`parentmodule`](/base/base#Base.parentmodule), [`@which`](/stdlib/InteractiveUtils#InteractiveUtils.@which), and [`@edit`](/stdlib/InteractiveUtils#InteractiveUtils.@edit).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2253-L2261)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.methods' href='#Base.methods'>#</a>&nbsp;<b><u>Base.methods</u></b> &mdash; <i>Function</i>.




```julia
methods(f, [types], [module])
```


Return the method table for `f`.

If `types` is specified, return an array of methods whose types match. If `module` is specified, return an array of methods defined in that module. A list of modules can also be specified as an array.

::: tip Julia 1.4

At least Julia 1.4 is required for specifying a module.

:::

See also: [`which`](/base/base#Base.which-Tuple{Any,%20Any}), [`@which`](/stdlib/InteractiveUtils#InteractiveUtils.@which) and [`methodswith`](/stdlib/InteractiveUtils#InteractiveUtils.methodswith).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L1223-L1236)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@show' href='#Base.@show'>#</a>&nbsp;<b><u>Base.@show</u></b> &mdash; <i>Macro</i>.




```julia
@show exs...
```


Prints one or more expressions, and their results, to `stdout`, and returns the last result.

See also: [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}), [`@info`](/stdlib/Logging#man-logging), [`println`](/base/io-network#Base.println).

**Examples**

```julia
julia> x = @show 1+2
1 + 2 = 3
3

julia> @show x^2 x/2;
x ^ 2 = 9
x / 2 = 1.5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/show.jl#L1215-L1232)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MainInclude.ans' href='#Base.MainInclude.ans'>#</a>&nbsp;<b><u>Base.MainInclude.ans</u></b> &mdash; <i>Constant</i>.




```julia
ans
```


A variable referring to the last computed value, automatically imported to the interactive prompt.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/client.jl#L500-L504)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MainInclude.err' href='#Base.MainInclude.err'>#</a>&nbsp;<b><u>Base.MainInclude.err</u></b> &mdash; <i>Constant</i>.




```julia
err
```


A variable referring to the last thrown errors, automatically imported to the interactive prompt. The thrown errors are collected in a stack of exceptions.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/client.jl#L507-L512)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.active_project' href='#Base.active_project'>#</a>&nbsp;<b><u>Base.active_project</u></b> &mdash; <i>Function</i>.




```julia
active_project()
```


Return the path of the active `Project.toml` file. See also [`Base.set_active_project`](/base/base#Base.set_active_project).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/initdefs.jl#L329-L333)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.set_active_project' href='#Base.set_active_project'>#</a>&nbsp;<b><u>Base.set_active_project</u></b> &mdash; <i>Function</i>.




```julia
set_active_project(projfile::Union{AbstractString,Nothing})
```


Set the active `Project.toml` file to `projfile`. See also [`Base.active_project`](/base/base#Base.active_project).

::: tip Julia 1.8

This function requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/initdefs.jl#L358-L365)

</div>
<br>

## Keywords

This is the list of reserved keywords in Julia: `baremodule`, `begin`, `break`, `catch`, `const`, `continue`, `do`, `else`, `elseif`, `end`, `export`, `false`, `finally`, `for`, `function`, `global`, `if`, `import`, `let`, `local`, `macro`, `module`, `quote`, `return`, `struct`, `true`, `try`, `using`, `while`. Those keywords are not allowed to be used as variable names.

The following two-word sequences are reserved: `abstract type`, `mutable struct`, `primitive type`. However, you can create variables with names: `abstract`, `mutable`, `primitive` and `type`.

Finally: `where` is parsed as an infix operator for writing parametric method and type definitions; `in` and `isa` are parsed as infix operators; `public` is parsed as a keyword when beginning a toplevel statement; `outer` is parsed as a keyword when used to modify the scope of a variable in an iteration specification of a `for` loop; and `as` is used as a keyword to rename an identifier brought into scope by `import` or `using`. Creation of variables named `where`, `in`, `isa`, `outer` and `as` is allowed, though.
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='module' href='#module'>#</a>&nbsp;<b><u>module</u></b> &mdash; <i>Keyword</i>.




```julia
module
```


`module` declares a [`Module`](/base/base#Core.Module), which is a separate global variable workspace. Within a module, you can control which names from other modules are visible (via importing), and specify which of your names are intended to be public (via `export` and `public`). Modules allow you to create top-level definitions without worrying about name conflicts when your code is used together with somebody else’s. See the [manual section about modules](/manual/modules#modules) for more details.

**Examples**

```julia
module Foo
import Base.show
export MyType, foo

struct MyType
    x
end

bar(x) = 2x
foo(a::MyType) = bar(a.x) + 1
show(io::IO, a::MyType) = print(io, "MyType $(a.x)")
end
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L117-L142)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='export' href='#export'>#</a>&nbsp;<b><u>export</u></b> &mdash; <i>Keyword</i>.




```julia
export
```


`export` is used within modules to tell Julia which names should be made available to the user. For example: `export foo` makes the name `foo` available when [`using`](/base/base#using) the module. See the [manual section about modules](/manual/modules#modules) for details.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L53-L60)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='public' href='#public'>#</a>&nbsp;<b><u>public</u></b> &mdash; <i>Keyword</i>.




```julia
public
```


`public` is used within modules to tell Julia which names are part of the public API of the module. For example: `public foo` indicates that the name `foo` is public, without making it available when [`using`](/base/base#using) the module.

As [`export`](/base/base#export) already indicates that a name is public, it is unnecessary and an error to declare a name both as `public` and as `export`ed. See the [manual section about modules](/manual/modules#modules) for details.

::: tip Julia 1.11

The public keyword was added in Julia 1.11. Prior to this the notion of publicness was less explicit.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L63-L77)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='import' href='#import'>#</a>&nbsp;<b><u>import</u></b> &mdash; <i>Keyword</i>.




```julia
import
```


`import Foo` will load the module or package `Foo`. Names from the imported `Foo` module can be accessed with dot syntax (e.g. `Foo.foo` to access the name `foo`). See the [manual section about modules](/manual/modules#modules) for details.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L43-L50)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='using' href='#using'>#</a>&nbsp;<b><u>using</u></b> &mdash; <i>Keyword</i>.




```julia
using
```


`using Foo` will load the module or package `Foo` and make its [`export`](/base/base#export)ed names available for direct use. Names can also be used via dot syntax (e.g. `Foo.foo` to access the name `foo`), whether they are `export`ed or not. See the [manual section about modules](/manual/modules#modules) for details.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L33-L40)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='as' href='#as'>#</a>&nbsp;<b><u>as</u></b> &mdash; <i>Keyword</i>.




```julia
as
```


`as` is used as a keyword to rename an identifier brought into scope by `import` or `using`, for the purpose of working around name conflicts as well as for shortening names.  (Outside of `import` or `using` statements, `as` is not a keyword and can be used as an ordinary identifier.)

`import LinearAlgebra as LA` brings the imported `LinearAlgebra` standard library into scope as `LA`.

`import LinearAlgebra: eigen as eig, cholesky as chol` brings the `eigen` and `cholesky` methods from `LinearAlgebra` into scope as `eig` and `chol` respectively.

`as` works with `using` only when individual identifiers are brought into scope. For example, `using LinearAlgebra: eigen as eig` or `using LinearAlgebra: eigen as eig, cholesky as chol` works, but `using LinearAlgebra as LA` is invalid syntax, since it is nonsensical to rename _all_ exported names from `LinearAlgebra` to `LA`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L80-L98)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='baremodule' href='#baremodule'>#</a>&nbsp;<b><u>baremodule</u></b> &mdash; <i>Keyword</i>.




```julia
baremodule
```


`baremodule` declares a module that does not contain `using Base` or local definitions of [`eval`](/base/base#eval) and [`include`](/base/base#Base.include). It does still import `Core`. In other words,

```julia
module Mod

...

end
```


is equivalent to

```julia
baremodule Mod

using Base

eval(x) = Core.eval(Mod, x)
include(p) = Base.include(Mod, p)

...

end
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L168-L196)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='function' href='#function'>#</a>&nbsp;<b><u>function</u></b> &mdash; <i>Keyword</i>.




```julia
function
```


Functions are defined with the `function` keyword:

```julia
function add(a, b)
    return a + b
end
```


Or the short form notation:

```julia
add(a, b) = a + b
```


The use of the [`return`](/base/base#return) keyword is exactly the same as in other languages, but is often optional. A function without an explicit `return` statement will return the last expression in the function body.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L802-L821)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='macro' href='#macro'>#</a>&nbsp;<b><u>macro</u></b> &mdash; <i>Keyword</i>.




```julia
macro
```


`macro` defines a method for inserting generated code into a program. A macro maps a sequence of argument expressions to a returned expression, and the resulting expression is substituted directly into the program at the point where the macro is invoked. Macros are a way to run generated code without calling [`eval`](/base/base#eval), since the generated code instead simply becomes part of the surrounding program. Macro arguments may include expressions, literal values, and symbols. Macros can be defined for variable number of arguments (varargs), but do not accept keyword arguments. Every macro also implicitly gets passed the arguments `__source__`, which contains the line number and file name the macro is called from, and `__module__`, which is the module the macro is expanded in.

See the manual section on [Metaprogramming](/manual/metaprogramming#Metaprogramming) for more information about how to write a macro.

**Examples**

```julia
julia> macro sayhello(name)
           return :( println("Hello, ", $name, "!") )
       end
@sayhello (macro with 1 method)

julia> @sayhello "Charlie"
Hello, Charlie!

julia> macro saylots(x...)
           return :( println("Say: ", $(x...)) )
       end
@saylots (macro with 1 method)

julia> @saylots "hey " "there " "friend"
Say: hey there friend
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L217-L252)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='return' href='#return'>#</a>&nbsp;<b><u>return</u></b> &mdash; <i>Keyword</i>.




```julia
return
```


`return x` causes the enclosing function to exit early, passing the given value `x` back to its caller. `return` by itself with no value is equivalent to `return nothing` (see [`nothing`](/base/constants#Core.nothing)).

```julia
function compare(a, b)
    a == b && return "equal to"
    a < b ? "less than" : "greater than"
end
```


In general you can place a `return` statement anywhere within a function body, including within deeply nested loops or conditionals, but be careful with `do` blocks. For example:

```julia
function test1(xs)
    for x in xs
        iseven(x) && return 2x
    end
end

function test2(xs)
    map(xs) do x
        iseven(x) && return 2x
        x
    end
end
```


In the first example, the return breaks out of `test1` as soon as it hits an even number, so `test1([5,6,7])` returns `12`.

You might expect the second example to behave the same way, but in fact the `return` there only breaks out of the _inner_ function (inside the `do` block) and gives a value back to `map`. `test2([5,6,7])` then returns `[5,12,7]`.

When used in a top-level expression (i.e. outside any function), `return` causes the entire current top-level expression to terminate early.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L850-L890)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='do' href='#do'>#</a>&nbsp;<b><u>do</u></b> &mdash; <i>Keyword</i>.




```julia
do
```


Create an anonymous function and pass it as the first argument to a function call. For example:

```julia
map(1:10) do x
    2x
end
```


is equivalent to `map(x->2x, 1:10)`.

Use multiple arguments like so:

```julia
map(1:10, 11:20) do x, y
    x + y
end
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1136-L1158)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='begin' href='#begin'>#</a>&nbsp;<b><u>begin</u></b> &mdash; <i>Keyword</i>.




```julia
begin
```


`begin...end` denotes a block of code.

```julia
begin
    println("Hello, ")
    println("World!")
end
```


Usually `begin` will not be necessary, since keywords such as [`function`](/base/base#function) and [`let`](/base/base#let) implicitly begin blocks of code. See also [`;`](/base/base#;).

`begin` may also be used when indexing to represent the first index of a collection or the first index of a dimension of an array.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Array{Int64,2}:
 1  2
 3  4

julia> A[begin, :]
2-element Array{Int64,1}:
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1359-L1389)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='end' href='#end'>#</a>&nbsp;<b><u>end</u></b> &mdash; <i>Keyword</i>.




```julia
end
```


`end` marks the conclusion of a block of expressions, for example [`module`](/base/base#module), [`struct`](/base/base#struct), [`mutable struct`](/base/base#mutable%20struct), [`begin`](/base/base#begin), [`let`](/base/base#let), [`for`](/base/base#for) etc.

`end` may also be used when indexing to represent the last index of a collection or the last index of a dimension of an array.

**Examples**

```julia
julia> A = [1 2; 3 4]
2×2 Array{Int64, 2}:
 1  2
 3  4

julia> A[end, :]
2-element Array{Int64, 1}:
 3
 4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L992-L1014)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='let' href='#let'>#</a>&nbsp;<b><u>let</u></b> &mdash; <i>Keyword</i>.




```julia
let
```


`let` blocks create a new hard scope and optionally introduce new local bindings.

Just like the [other scope constructs](/manual/variables-and-scoping#man-scope-table), `let` blocks define the block of code where newly introduced local variables are accessible. Additionally, the syntax has a special meaning for comma-separated assignments and variable names that may optionally appear on the same line as the `let`:

```julia
let var1 = value1, var2, var3 = value3
    code
end
```


The variables introduced on this line are local to the `let` block and the assignments are evaluated in order, with each right-hand side evaluated in the scope without considering the name on the left-hand side. Therefore it makes sense to write something like `let x = x`, since the two `x` variables are distinct with the left-hand side locally shadowing the `x` from the outer scope. This can even be a useful idiom as new local variables are freshly created each time local scopes are entered, but this is only observable in the case of variables that outlive their scope via closures.  A `let` variable without an assignment, such as `var2` in the example above, declares a new local variable that is not yet bound to a value.

By contrast, [`begin`](/base/base#begin) blocks also group multiple expressions together but do not introduce scope or have the special assignment syntax.

**Examples**

In the function below, there is a single `x` that is iteratively updated three times by the `map`. The closures returned all reference that one `x` at its final value:

```julia
julia> function test_outer_x()
           x = 0
           map(1:3) do _
               x += 1
               return ()->x
           end
       end
test_outer_x (generic function with 1 method)

julia> [f() for f in test_outer_x()]
3-element Vector{Int64}:
 3
 3
 3
```


If, however, we add a `let` block that introduces a _new_ local variable we will end up with three distinct variables being captured (one at each iteration) even though we chose to use (shadow) the same name.

```julia
julia> function test_let_x()
           x = 0
           map(1:3) do _
               x += 1
               let x = x
                   return ()->x
               end
           end
       end
test_let_x (generic function with 1 method)

julia> [f() for f in test_let_x()]
3-element Vector{Int64}:
 1
 2
 3
```


All scope constructs that introduce new local variables behave this way when repeatedly run; the distinctive feature of `let` is its ability to succinctly declare new `local`s that may shadow outer variables of the same name. For example, directly using the argument of the `do` function similarly captures three distinct variables:

```julia
julia> function test_do_x()
           map(1:3) do x
               return ()->x
           end
       end
test_do_x (generic function with 1 method)

julia> [f() for f in test_do_x()]
3-element Vector{Int64}:
 1
 2
 3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L518-L614)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='if' href='#if'>#</a>&nbsp;<b><u>if</u></b> &mdash; <i>Keyword</i>.




```julia
if/elseif/else
```


`if`/`elseif`/`else` performs conditional evaluation, which allows portions of code to be evaluated or not evaluated depending on the value of a boolean expression. Here is the anatomy of the `if`/`elseif`/`else` conditional syntax:

```julia
if x < y
    println("x is less than y")
elseif x > y
    println("x is greater than y")
else
    println("x is equal to y")
end
```


If the condition expression `x < y` is true, then the corresponding block is evaluated; otherwise the condition expression `x > y` is evaluated, and if it is true, the corresponding block is evaluated; if neither expression is true, the `else` block is evaluated. The `elseif` and `else` blocks are optional, and as many `elseif` blocks as desired can be used.

In contrast to some other languages conditions must be of type `Bool`. It does not suffice for conditions to be convertible to `Bool`.

```julia
julia> if 1 end
ERROR: TypeError: non-boolean (Int64) used in boolean context
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L893-L921)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='for' href='#for'>#</a>&nbsp;<b><u>for</u></b> &mdash; <i>Keyword</i>.




```julia
for
```


`for` loops repeatedly evaluate a block of statements while iterating over a sequence of values.

The iteration variable is always a new variable, even if a variable of the same name exists in the enclosing scope. Use [`outer`](/base/base#outer) to reuse an existing local variable for iteration.

**Examples**

```julia
julia> for i in [1, 4, 0]
           println(i)
       end
1
4
0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L946-L965)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='while' href='#while'>#</a>&nbsp;<b><u>while</u></b> &mdash; <i>Keyword</i>.




```julia
while
```


`while` loops repeatedly evaluate a conditional expression, and continue evaluating the body of the while loop as long as the expression remains true. If the condition expression is false when the while loop is first reached, the body is never evaluated.

**Examples**

```julia
julia> i = 1
1

julia> while i < 5
           println(i)
           global i += 1
       end
1
2
3
4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L968-L989)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='break' href='#break'>#</a>&nbsp;<b><u>break</u></b> &mdash; <i>Keyword</i>.




```julia
break
```


Break out of a loop immediately.

**Examples**

```julia
julia> i = 0
0

julia> while true
           global i += 1
           i > 5 && break
           println(i)
       end
1
2
3
4
5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1094-L1115)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='continue' href='#continue'>#</a>&nbsp;<b><u>continue</u></b> &mdash; <i>Keyword</i>.




```julia
continue
```


Skip the rest of the current loop iteration.

**Examples**

```julia
julia> for i = 1:6
           iseven(i) && continue
           println(i)
       end
1
3
5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1118-L1133)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='try' href='#try'>#</a>&nbsp;<b><u>try</u></b> &mdash; <i>Keyword</i>.




```julia
try/catch
```


A `try`/`catch` statement allows intercepting errors (exceptions) thrown by [`throw`](/base/base#Core.throw) so that program execution can continue. For example, the following code attempts to write a file, but warns the user and proceeds instead of terminating execution if the file cannot be written:

```julia
try
    open("/danger", "w") do f
        println(f, "Hello")
    end
catch
    @warn "Could not write file."
end
```


or, when the file cannot be read into a variable:

```julia
lines = try
    open("/danger", "r") do f
        readlines(f)
    end
catch
    @warn "File not found."
end
```


The syntax `catch e` (where `e` is any variable) assigns the thrown exception object to the given variable within the `catch` block.

The power of the `try`/`catch` construct lies in the ability to unwind a deeply nested computation immediately to a much higher level in the stack of calling functions.

A `try` or `try`/`catch` block can also have a [`finally`](/base/base#finally) clause that executes at the end, regardless of whether an exception occurred.  For example, this can be used to guarantee that an opened file is closed:

```julia
f = open("file")
try
    operate_on_file(f)
catch
    @warn "An error occurred!"
finally
    close(f)
end
```


(`finally` can also be used without a `catch` block.)


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1017-L1067)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='finally' href='#finally'>#</a>&nbsp;<b><u>finally</u></b> &mdash; <i>Keyword</i>.




```julia
finally
```


Run some code when a given `try` block of code exits, regardless of how it exits. For example, here is how we can guarantee that an opened file is closed:

```julia
f = open("file")
try
    operate_on_file(f)
finally
    close(f)
end
```


When control leaves the [`try`](/base/base#try) block (for example, due to a [`return`](/base/base#return), or just finishing normally), [`close(f)`](/base/io-network#Base.close) will be executed. If the `try` block exits due to an exception, the exception will continue propagating. A `catch` block may be combined with `try` and `finally` as well. In this case the `finally` block will run after `catch` has handled the error.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1070-L1091)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='quote' href='#quote'>#</a>&nbsp;<b><u>quote</u></b> &mdash; <i>Keyword</i>.




```julia
quote
```


`quote` creates multiple expression objects in a block without using the explicit [`Expr`](/base/base#Core.Expr) constructor. For example:

```julia
ex = quote
    x = 1
    y = 2
    x + y
end
```


Unlike the other means of quoting, `:( ... )`, this form introduces `QuoteNode` elements to the expression tree, which must be considered when directly manipulating the tree. For other purposes, `:( ... )` and `quote .. end` blocks are treated identically.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L617-L633)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='local' href='#local'>#</a>&nbsp;<b><u>local</u></b> &mdash; <i>Keyword</i>.




```julia
local
```


`local` introduces a new local variable. See the [manual section on variable scoping](/manual/variables-and-scoping#scope-of-variables) for more information.

**Examples**

```julia
julia> function foo(n)
           x = 0
           for i = 1:n
               local x # introduce a loop-local x
               x = i
           end
           x
       end
foo (generic function with 1 method)

julia> foo(10)
0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L273-L294)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='global' href='#global'>#</a>&nbsp;<b><u>global</u></b> &mdash; <i>Keyword</i>.




```julia
global
```


`global x` makes `x` in the current scope and its inner scopes refer to the global variable of that name. See the [manual section on variable scoping](/manual/variables-and-scoping#scope-of-variables) for more information.

**Examples**

```julia
julia> z = 3
3

julia> function foo()
           global z = 6 # use the z variable defined outside foo
       end
foo (generic function with 1 method)

julia> foo()
6

julia> z
6
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L297-L320)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='outer' href='#outer'>#</a>&nbsp;<b><u>outer</u></b> &mdash; <i>Keyword</i>.




```julia
for outer
```


Reuse an existing local variable for iteration in a `for` loop.

See the [manual section on variable scoping](/manual/variables-and-scoping#scope-of-variables) for more information.

See also [`for`](/base/base#for).

**Examples**

```julia
julia> function f()
           i = 0
           for i = 1:3
               # empty
           end
           return i
       end;

julia> f()
0
```


```julia
julia> function f()
           i = 0
           for outer i = 1:3
               # empty
           end
           return i
       end;

julia> f()
3
```


```julia
julia> i = 0 # global variable
       for outer i = 1:3
       end
ERROR: syntax: no outer local variable declaration exists for "for outer"
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L323-L367)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='const' href='#const'>#</a>&nbsp;<b><u>const</u></b> &mdash; <i>Keyword</i>.




```julia
const
```


`const` is used to declare global variables whose values will not change. In almost all code (and particularly performance sensitive code) global variables should be declared constant in this way.

```julia
const x = 5
```


Multiple variables can be declared within a single `const`:

```julia
const y, z = 7, 11
```


Note that `const` only applies to one `=` operation, therefore `const x = y = 1` declares `x` to be constant but not `y`. On the other hand, `const x = const y = 1` declares both `x` and `y` constant.

Note that &quot;constant-ness&quot; does not extend into mutable containers; only the association between a variable and its value is constant. If `x` is an array or dictionary (for example) you can still modify, add, or remove elements.

In some cases changing the value of a `const` variable gives a warning instead of an error. However, this can produce unpredictable behavior or corrupt the state of your program, and so should be avoided. This feature is intended only for convenience during interactive use.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L770-L799)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='struct' href='#struct'>#</a>&nbsp;<b><u>struct</u></b> &mdash; <i>Keyword</i>.




```julia
struct
```


The most commonly used kind of type in Julia is a struct, specified as a name and a set of fields.

```julia
struct Point
    x
    y
end
```


Fields can have type restrictions, which may be parameterized:

```julia
struct Point{X}
    x::X
    y::Float64
end
```


A struct can also declare an abstract super type via `<:` syntax:

```julia
struct Point <: AbstractPoint
    x
    y
end
```


`struct`s are immutable by default; an instance of one of these types cannot be modified after construction. Use [`mutable struct`](/base/base#mutable%20struct) instead to declare a type whose instances can be modified.

See the manual section on [Composite Types](/manual/types#Composite-Types) for more details, such as how to define constructors.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1392-L1429)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='mutable struct' href='#mutable struct'>#</a>&nbsp;<b><u>mutable struct</u></b> &mdash; <i>Keyword</i>.




```julia
mutable struct
```


`mutable struct` is similar to [`struct`](/base/base#struct), but additionally allows the fields of the type to be set after construction. See the manual section on [Composite Types](/manual/types#Composite-Types) for more information.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1432-L1438)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@kwdef' href='#Base.@kwdef'>#</a>&nbsp;<b><u>Base.@kwdef</u></b> &mdash; <i>Macro</i>.




```julia
@kwdef typedef
```


This is a helper macro that automatically defines a keyword-based constructor for the type declared in the expression `typedef`, which must be a `struct` or `mutable struct` expression. The default argument is supplied by declaring fields of the form `field::T = default` or `field = default`. If no default is provided then the keyword argument becomes a required keyword argument in the resulting type constructor.

Inner constructors can still be defined, but at least one should accept arguments in the same form as the default inner constructor (i.e. one positional argument per field) in order to function correctly with the keyword outer constructor.

::: tip Julia 1.1

`Base.@kwdef` for parametric structs, and structs with supertypes requires at least Julia 1.1.

:::

::: tip Julia 1.9

This macro is exported as of Julia 1.9.

:::

**Examples**

```julia
julia> @kwdef struct Foo
           a::Int = 1         # specified default
           b::String          # required keyword
       end
Foo

julia> Foo(b="hi")
Foo(1, "hi")

julia> Foo()
ERROR: UndefKeywordError: keyword argument `b` not assigned
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/util.jl#L527-L563)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='abstract type' href='#abstract type'>#</a>&nbsp;<b><u>abstract type</u></b> &mdash; <i>Keyword</i>.




```julia
abstract type
```


`abstract type` declares a type that cannot be instantiated, and serves only as a node in the type graph, thereby describing sets of related concrete types: those concrete types which are their descendants. Abstract types form the conceptual hierarchy which makes Julia’s type system more than just a collection of object implementations. For example:

```julia
abstract type Number end
abstract type Real <: Number end
```


[`Number`](/base/numbers#Core.Number) has no supertype, whereas [`Real`](/base/numbers#Core.Real) is an abstract subtype of `Number`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L101-L114)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='primitive type' href='#primitive type'>#</a>&nbsp;<b><u>primitive type</u></b> &mdash; <i>Keyword</i>.




```julia
primitive type
```


`primitive type` declares a concrete type whose data consists only of a series of bits. Classic examples of primitive types are integers and floating-point values. Some example built-in primitive type declarations:

```julia
primitive type Char 32 end
primitive type Bool <: Integer 8 end
```


The number after the name indicates how many bits of storage the type requires. Currently, only sizes that are multiples of 8 bits are supported. The [`Bool`](/base/numbers#Core.Bool) declaration shows how a primitive type can be optionally declared to be a subtype of some supertype.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L199-L214)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='where' href='#where'>#</a>&nbsp;<b><u>where</u></b> &mdash; <i>Keyword</i>.




```julia
where
```


The `where` keyword creates a type that is an iterated union of other types, over all values of some variable. For example `Vector{T} where T<:Real` includes all [`Vector`](/base/arrays#Base.Vector)s where the element type is some kind of `Real` number.

The variable bound defaults to [`Any`](/base/base#Core.Any) if it is omitted:

```julia
Vector{T} where T    # short for `where T<:Any`
```


Variables can also have lower bounds:

```julia
Vector{T} where T>:Int
Vector{T} where Int<:T<:Real
```


There is also a concise syntax for nested `where` expressions. For example, this:

```julia
Pair{T, S} where S<:Array{T} where T<:Number
```


can be shortened to:

```julia
Pair{T, S} where {T<:Number, S<:Array{T}}
```


This form is often found on method signatures.

Note that in this form, the variables are listed outermost-first. This matches the order in which variables are substituted when a type is &quot;applied&quot; to parameter values using the syntax `T{p1, p2, ...}`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1451-L1484)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='...' href='#...'>#</a>&nbsp;<b><u>...</u></b> &mdash; <i>Keyword</i>.




```julia
...
```


The &quot;splat&quot; operator, `...`, represents a sequence of arguments. `...` can be used in function definitions, to indicate that the function accepts an arbitrary number of arguments. `...` can also be used to apply a function to a sequence of arguments.

**Examples**

```julia
julia> add(xs...) = reduce(+, xs)
add (generic function with 1 method)

julia> add(1, 2, 3, 4, 5)
15

julia> add([1, 2, 3]...)
6

julia> add(7, 1:100..., 1000:1100...)
111107
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1161-L1183)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id=';' href='#;'>#</a>&nbsp;<b><u>;</u></b> &mdash; <i>Keyword</i>.




```julia
;
```


`;` has a similar role in Julia as in many C-like languages, and is used to delimit the end of the previous statement.

`;` is not necessary at the end of a line, but can be used to separate statements on a single line or to join statements into a single expression.

Adding `;` at the end of a line in the REPL will suppress printing the result of that expression.

In function declarations, and optionally in calls, `;` separates regular arguments from keywords.

In array literals, arguments separated by semicolons have their contents concatenated together. A separator made of a single `;` concatenates vertically (i.e. along the first dimension), `;;` concatenates horizontally (second dimension), `;;;` concatenates along the third dimension, etc. Such a separator can also be used in last position in the square brackets to add trailing dimensions of length 1.

A `;` in first position inside of parentheses can be used to construct a named tuple. The same `(; ...)` syntax on the left side of an assignment allows for property destructuring.

In the standard REPL, typing `;` on an empty line will switch to shell mode.

**Examples**

```julia
julia> function foo()
           x = "Hello, "; x *= "World!"
           return x
       end
foo (generic function with 1 method)

julia> bar() = (x = "Hello, Mars!"; return x)
bar (generic function with 1 method)

julia> foo();

julia> bar()
"Hello, Mars!"

julia> function plot(x, y; style="solid", width=1, color="black")
           ###
       end

julia> A = [1 2; 3 4]
2×2 Matrix{Int64}:
 1  2
 3  4

julia> [1; 3;; 2; 4;;; 10*A]
2×2×2 Array{Int64, 3}:
[:, :, 1] =
 1  2
 3  4

[:, :, 2] =
 10  20
 30  40

julia> [2; 3;;;]
2×1×1 Array{Int64, 3}:
[:, :, 1] =
 2
 3

julia> nt = (; x=1) # without the ; or a trailing comma this would assign to x
(x = 1,)

julia> key = :a; c = 3;

julia> nt2 = (; key => 1, b=2, c, nt.x)
(a = 1, b = 2, c = 3, x = 1)

julia> (; b, x) = nt2; # set variables b and x using property destructuring

julia> b, x
(2, 1)

julia> ; # upon typing ;, the prompt changes (in place) to: shell>
shell> echo hello
hello
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1186-L1270)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='=' href='#='>#</a>&nbsp;<b><u>=</u></b> &mdash; <i>Keyword</i>.




```julia
=
```


`=` is the assignment operator.
- For variable `a` and expression `b`, `a = b` makes `a` refer to the value of `b`.
  
- For functions `f(x)`, `f(x) = x` defines a new function constant `f`, or adds a new method to `f` if `f` is already defined; this usage is equivalent to `function f(x); x; end`.
  
- `a[i] = v` calls [`setindex!`](/base/collections#Base.setindex!)`(a,v,i)`.
  
- `a.b = c` calls [`setproperty!`](/base/base#Base.setproperty!)`(a,:b,c)`.
  
- Inside a function call, `f(a=b)` passes `b` as the value of keyword argument `a`.
  
- Inside parentheses with commas, `(a=1,)` constructs a [`NamedTuple`](/base/base#Core.NamedTuple).
  

**Examples**

Assigning `a` to `b` does not create a copy of `b`; instead use [`copy`](/base/base#Base.copy) or [`deepcopy`](/base/base#Base.deepcopy).

```julia
julia> b = [1]; a = b; b[1] = 2; a
1-element Array{Int64, 1}:
 2

julia> b = [1]; a = copy(b); b[1] = 2; a
1-element Array{Int64, 1}:
 1

```


Collections passed to functions are also not copied. Functions can modify (mutate) the contents of the objects their arguments refer to. (The names of functions which do this are conventionally suffixed with &#39;!&#39;.)

```julia
julia> function f!(x); x[:] .+= 1; end
f! (generic function with 1 method)

julia> a = [1]; f!(a); a
1-element Array{Int64, 1}:
 2

```


Assignment can operate on multiple variables in parallel, taking values from an iterable:

```julia
julia> a, b = 4, 5
(4, 5)

julia> a, b = 1:3
1:3

julia> a, b
(1, 2)

```


Assignment can operate on multiple variables in series, and will return the value of the right-hand-most expression:

```julia
julia> a = [1]; b = [2]; c = [3]; a = b = c
1-element Array{Int64, 1}:
 3

julia> b[1] = 2; a, b, c
([2], [2], [2])

```


Assignment at out-of-bounds indices does not grow a collection. If the collection is a [`Vector`](/base/arrays#Base.Vector) it can instead be grown with [`push!`](/base/collections#Base.push!) or [`append!`](/base/collections#Base.append!).

```julia
julia> a = [1, 1]; a[3] = 2
ERROR: BoundsError: attempt to access 2-element Array{Int64, 1} at index [3]
[...]

julia> push!(a, 2, 3)
4-element Array{Int64, 1}:
 1
 1
 2
 3

```


Assigning `[]` does not eliminate elements from a collection; instead use [`filter!`](/base/collections#Base.filter!).

```julia
julia> a = collect(1:3); a[a .<= 1] = []
ERROR: DimensionMismatch: tried to assign 0 elements to 1 destinations
[...]

julia> filter!(x -> x > 1, a) # in-place & thus more efficient than a = a[a .> 1]
2-element Array{Int64, 1}:
 2
 3

```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L383-L465)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='?:' href='#?:'>#</a>&nbsp;<b><u>?:</u></b> &mdash; <i>Keyword</i>.




```julia
a ? b : c
```


Short form for conditionals; read &quot;if `a`, evaluate `b` otherwise evaluate `c`&quot;. Also known as the [ternary operator](https://en.wikipedia.org/wiki/%3F:).

This syntax is equivalent to `if a; b else c end`, but is often used to emphasize the value `b`-or-`c` which is being used as part of a larger expression, rather than the side effects that evaluating `b` or `c` may have.

See the manual section on [control flow](/manual/control-flow#man-conditional-evaluation) for more details.

**Examples**

```
julia> x = 1; y = 2;

julia> x > y ? println("x is larger") : println("y is larger")
y is larger
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L924-L943)

</div>
<br>

## Standard Modules {#Standard-Modules}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Main' href='#Main'>#</a>&nbsp;<b><u>Main</u></b> &mdash; <i>Module</i>.




```julia
Main
```


`Main` is the top-level module, and Julia starts with `Main` set as the current module.  Variables defined at the prompt go in `Main`, and `varinfo` lists variables in `Main`.

```julia
julia> @__MODULE__
Main
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3533-L3541)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core' href='#Core'>#</a>&nbsp;<b><u>Core</u></b> &mdash; <i>Module</i>.




```julia
Core
```


`Core` is the module that contains all identifiers considered &quot;built in&quot; to the language, i.e. part of the core language and not libraries. Every module implicitly specifies `using Core`, since you can&#39;t do anything without those definitions.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3526-L3530)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base' href='#Base'>#</a>&nbsp;<b><u>Base</u></b> &mdash; <i>Module</i>.




```julia
Base
```


The base library of Julia. `Base` is a module that contains basic functionality (the contents of `base/`). All modules implicitly contain `using Base`, since this is needed in the vast majority of cases.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3544-L3548)

</div>
<br>

## Base Submodules {#Base-Submodules}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Broadcast' href='#Base.Broadcast'>#</a>&nbsp;<b><u>Base.Broadcast</u></b> &mdash; <i>Module</i>.




```julia
Base.Broadcast
```


Module containing the broadcasting implementation.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/broadcast.jl#L3-L7)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Docs' href='#Base.Docs'>#</a>&nbsp;<b><u>Base.Docs</u></b> &mdash; <i>Module</i>.




```julia
Docs
```


The `Docs` module provides the [`@doc`](/base/base#Core.@doc) macro which can be used to set and retrieve documentation metadata for Julia objects.

Please see the manual section on [documentation](/manual/documentation#man-documentation) for more information.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/Docs.jl#L3-L11)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Iterators' href='#Base.Iterators'>#</a>&nbsp;<b><u>Base.Iterators</u></b> &mdash; <i>Module</i>.




Methods for working with Iterators.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/iterators.jl#L3-L5)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc' href='#Base.Libc'>#</a>&nbsp;<b><u>Base.Libc</u></b> &mdash; <i>Module</i>.




Interface to libc, the C standard library.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L4-L6)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta' href='#Base.Meta'>#</a>&nbsp;<b><u>Base.Meta</u></b> &mdash; <i>Module</i>.




Convenience functions for metaprogramming.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L3-L5)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StackTraces' href='#Base.StackTraces'>#</a>&nbsp;<b><u>Base.StackTraces</u></b> &mdash; <i>Module</i>.




Tools for collecting and manipulating stack traces. Mainly used for building errors.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/stacktraces.jl#L3-L5)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys' href='#Base.Sys'>#</a>&nbsp;<b><u>Base.Sys</u></b> &mdash; <i>Module</i>.




Provide methods for retrieving information about hardware and the operating system.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L4-L6)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Threads' href='#Base.Threads'>#</a>&nbsp;<b><u>Base.Threads</u></b> &mdash; <i>Module</i>.




Multithreading support.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/threads.jl#L3-L5)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GC' href='#Base.GC'>#</a>&nbsp;<b><u>Base.GC</u></b> &mdash; <i>Module</i>.




```julia
Base.GC
```


Module with garbage collection utilities.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L105-L109)

</div>
<br>

## All Objects {#All-Objects}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.:===' href='#Core.:==='>#</a>&nbsp;<b><u>Core.:===</u></b> &mdash; <i>Function</i>.




```julia
===(x,y) -> Bool
≡(x,y) -> Bool
```


Determine whether `x` and `y` are identical, in the sense that no program could distinguish them. First the types of `x` and `y` are compared. If those are identical, mutable objects are compared by address in memory and immutable objects (such as numbers) are compared by contents at the bit level. This function is sometimes called &quot;egal&quot;. It always returns a `Bool` value.

**Examples**

```julia
julia> a = [1, 2]; b = [1, 2];

julia> a == b
true

julia> a === b
false

julia> a === a
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L321-L344)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.isa' href='#Core.isa'>#</a>&nbsp;<b><u>Core.isa</u></b> &mdash; <i>Function</i>.




```julia
isa(x, type) -> Bool
```


Determine whether `x` is of the given `type`. Can also be used as an infix operator, e.g. `x isa type`.

**Examples**

```julia
julia> isa(1, Int)
true

julia> isa(1, Matrix)
false

julia> isa(1, Char)
false

julia> isa(1, Number)
true

julia> 1 isa Number
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1983-L2006)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isequal' href='#Base.isequal'>#</a>&nbsp;<b><u>Base.isequal</u></b> &mdash; <i>Function</i>.




```julia
isequal(x, y) -> Bool
```


Similar to [`==`](/base/math#Base.:==), except for the treatment of floating point numbers and of missing values. `isequal` treats all floating-point `NaN` values as equal to each other, treats `-0.0` as unequal to `0.0`, and [`missing`](/manual/missing#missing) as equal to `missing`. Always returns a `Bool` value.

`isequal` is an equivalence relation - it is reflexive (`===` implies `isequal`), symmetric (`isequal(a, b)` implies `isequal(b, a)`) and transitive (`isequal(a, b)` and `isequal(b, c)` implies `isequal(a, c)`).

**Implementation**

The default implementation of `isequal` calls `==`, so a type that does not involve floating-point values generally only needs to define `==`.

`isequal` is the comparison function used by hash tables (`Dict`). `isequal(x,y)` must imply that `hash(x) == hash(y)`.

This typically means that types for which a custom `==` or `isequal` method exists must implement a corresponding [`hash`](/base/base#Base.hash) method (and vice versa). Collections typically implement `isequal` by calling `isequal` recursively on all contents.

Furthermore, `isequal` is linked with [`isless`](/base/base#Base.isless), and they work together to define a fixed total ordering, where exactly one of `isequal(x, y)`, `isless(x, y)`, or `isless(y, x)` must be `true` (and the other two `false`).

Scalar types generally do not need to implement `isequal` separate from `==`, unless they represent floating-point numbers amenable to a more efficient implementation than that provided as a generic fallback (based on `isnan`, `signbit`, and `==`).

**Examples**

```julia
julia> isequal([1., NaN], [1., NaN])
true

julia> [1., NaN] == [1., NaN]
false

julia> 0.0 == -0.0
true

julia> isequal(0.0, -0.0)
false

julia> missing == missing
missing

julia> isequal(missing, missing)
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L123-L174)



```julia
isequal(x)
```


Create a function that compares its argument to `x` using [`isequal`](/base/base#Base.isequal), i.e. a function equivalent to `y -> isequal(y, x)`.

The returned function is of type `Base.Fix2{typeof(isequal)}`, which can be used to implement specialized methods.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L1187-L1195)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isless' href='#Base.isless'>#</a>&nbsp;<b><u>Base.isless</u></b> &mdash; <i>Function</i>.




```julia
isless(x, y)
```


Test whether `x` is less than `y`, according to a fixed total order (defined together with [`isequal`](/base/base#Base.isequal)). `isless` is not defined for pairs `(x, y)` of all types. However, if it is defined, it is expected to satisfy the following:
- If `isless(x, y)` is defined, then so is `isless(y, x)` and `isequal(x, y)`, and exactly one of those three yields `true`.
  
- The relation defined by `isless` is transitive, i.e., `isless(x, y) && isless(y, z)` implies `isless(x, z)`.
  

Values that are normally unordered, such as `NaN`, are ordered after regular values. [`missing`](/manual/missing#missing) values are ordered last.

This is the default comparison used by [`sort!`](/base/sort#Base.sort!).

**Implementation**

Non-numeric types with a total order should implement this function. Numeric types only need to implement it if they have special values such as `NaN`. Types with a partial order should implement [`<`](/base/math#Base.:<). See the documentation on [Alternate Orderings](/base/sort#Alternate-Orderings) for how to define alternate ordering methods that can be used in sorting and related functions.

**Examples**

```julia
julia> isless(1, 3)
true

julia> isless("Red", "Blue")
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L184-L216)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isunordered' href='#Base.isunordered'>#</a>&nbsp;<b><u>Base.isunordered</u></b> &mdash; <i>Function</i>.




```julia
isunordered(x)
```


Return `true` if `x` is a value that is not orderable according to [`<`](/base/math#Base.:<), such as `NaN` or `missing`.

The values that evaluate to `true` with this predicate may be orderable with respect to other orderings such as [`isless`](/base/base#Base.isless).

::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L276-L287)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ifelse' href='#Base.ifelse'>#</a>&nbsp;<b><u>Base.ifelse</u></b> &mdash; <i>Function</i>.




```julia
ifelse(condition::Bool, x, y)
```


Return `x` if `condition` is `true`, otherwise return `y`. This differs from `?` or `if` in that it is an ordinary function, so all the arguments are evaluated first. In some cases, using `ifelse` instead of an `if` statement can eliminate the branch in generated code and provide higher performance in tight loops.

**Examples**

```julia
julia> ifelse(1 > 2, 1, 2)
2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L760-L773)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.typeassert' href='#Core.typeassert'>#</a>&nbsp;<b><u>Core.typeassert</u></b> &mdash; <i>Function</i>.




```julia
typeassert(x, type)
```


Throw a [`TypeError`](/base/base#Core.TypeError) unless `x isa type`. The syntax `x::type` calls this function.

**Examples**

```julia
julia> typeassert(2.5, Int)
ERROR: TypeError: in typeassert, expected Int64, got a value of type Float64
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3344-L3357)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.typeof' href='#Core.typeof'>#</a>&nbsp;<b><u>Core.typeof</u></b> &mdash; <i>Function</i>.




```julia
typeof(x)
```


Get the concrete type of `x`.

See also [`eltype`](/base/collections#Base.eltype).

**Examples**

```julia
julia> a = 1//2;

julia> typeof(a)
Rational{Int64}

julia> M = [1 2; 3.5 4];

julia> typeof(M)
Matrix{Float64} (alias for Array{Float64, 2})
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2604-L2623)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.tuple' href='#Core.tuple'>#</a>&nbsp;<b><u>Core.tuple</u></b> &mdash; <i>Function</i>.




```julia
tuple(xs...)
```


Construct a tuple of the given objects.

See also [`Tuple`](/base/base#Core.Tuple), [`ntuple`](/base/base#Base.ntuple), [`NamedTuple`](/base/base#Core.NamedTuple).

**Examples**

```julia
julia> tuple(1, 'b', pi)
(1, 'b', π)

julia> ans === (1, 'b', π)
true

julia> Tuple(Real[1, 2, pi])  # takes a collection
(1, 2, π)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2292-L2310)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ntuple' href='#Base.ntuple'>#</a>&nbsp;<b><u>Base.ntuple</u></b> &mdash; <i>Function</i>.




```julia
ntuple(f, n::Integer)
```


Create a tuple of length `n`, computing each element as `f(i)`, where `i` is the index of the element.

**Examples**

```julia
julia> ntuple(i -> 2*i, 4)
(2, 4, 6, 8)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/ntuple.jl#L5-L16)



```julia
ntuple(f, ::Val{N})
```


Create a tuple of length `N`, computing each element as `f(i)`, where `i` is the index of the element. By taking a `Val(N)` argument, it is possible that this version of ntuple may generate more efficient code than the version taking the length as an integer. But `ntuple(f, N)` is preferable to `ntuple(f, Val(N))` in cases where `N` cannot be determined at compile time.

**Examples**

```julia
julia> ntuple(i -> 2*i, Val(4))
(2, 4, 6, 8)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/ntuple.jl#L52-L68)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.objectid' href='#Base.objectid'>#</a>&nbsp;<b><u>Base.objectid</u></b> &mdash; <i>Function</i>.




```julia
objectid(x) -> UInt
```


Get a hash value for `x` based on object identity.

If `x === y` then `objectid(x) == objectid(y)`, and usually when `x !== y`, `objectid(x) != objectid(y)`.

See also [`hash`](/base/base#Base.hash), [`IdDict`](/base/collections#Base.IdDict).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L745-L753)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hash' href='#Base.hash'>#</a>&nbsp;<b><u>Base.hash</u></b> &mdash; <i>Function</i>.




```julia
hash(x[, h::UInt]) -> UInt
```


Compute an integer hash code such that `isequal(x,y)` implies `hash(x)==hash(y)`. The optional second argument `h` is another hash code to be mixed with the result.

New types should implement the 2-argument form, typically by calling the 2-argument `hash` method recursively in order to mix hashes of the contents with each other (and with `h`). Typically, any type that implements `hash` should also implement its own [`==`](/base/math#Base.:==) (hence [`isequal`](/base/base#Base.isequal)) to guarantee the property mentioned above. Types supporting subtraction (operator `-`) should also implement [`widen`](/base/base#Base.widen), which is required to hash values inside heterogeneous arrays.

The hash value may change when a new Julia process is started.

```julia
julia> a = hash(10)
0x95ea2955abd45275

julia> hash(10, a) # only use the output of another hash function as the second argument
0xd42bad54a8575b16
```


See also: [`objectid`](/base/base#Base.objectid), [`Dict`](/base/collections#Base.Dict), [`Set`](/base/collections#Base.Set).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/hashing.jl#L5-L29)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.finalizer' href='#Base.finalizer'>#</a>&nbsp;<b><u>Base.finalizer</u></b> &mdash; <i>Function</i>.




```julia
finalizer(f, x)
```


Register a function `f(x)` to be called when there are no program-accessible references to `x`, and return `x`. The type of `x` must be a `mutable struct`, otherwise the function will throw.

`f` must not cause a task switch, which excludes most I/O operations such as `println`. Using the `@async` macro (to defer context switching to outside of the finalizer) or `ccall` to directly invoke IO functions in C may be helpful for debugging purposes.

Note that there is no guaranteed world age for the execution of `f`. It may be called in the world age in which the finalizer was registered or any later world age.

**Examples**

```julia
finalizer(my_mutable_struct) do x
    @async println("Finalizing $x.")
end

finalizer(my_mutable_struct) do x
    ccall(:jl_safe_printf, Cvoid, (Cstring, Cstring), "Finalizing %s.", repr(x))
end
```


A finalizer may be registered at object construction. In the following example note that we implicitly rely on the finalizer returning the newly created mutable struct `x`.

```julia
mutable struct MyMutableStruct
    bar
    function MyMutableStruct(bar)
        x = new(bar)
        f(t) = @async println("Finalizing $t.")
        finalizer(f, x)
    end
end
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L45-L83)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.finalize' href='#Base.finalize'>#</a>&nbsp;<b><u>Base.finalize</u></b> &mdash; <i>Function</i>.




```julia
finalize(x)
```


Immediately run finalizers registered for object `x`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L97-L101)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.copy' href='#Base.copy'>#</a>&nbsp;<b><u>Base.copy</u></b> &mdash; <i>Function</i>.




```julia
copy(x)
```


Create a shallow copy of `x`: the outer structure is copied, but not all internal values. For example, copying an array produces a new array with identically-same elements as the original.

See also [`copy!`](/base/arrays#Base.copy!), [`copyto!`](/base/c#Base.copyto!), [`deepcopy`](/base/base#Base.deepcopy).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L334-L342)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.deepcopy' href='#Base.deepcopy'>#</a>&nbsp;<b><u>Base.deepcopy</u></b> &mdash; <i>Function</i>.




```julia
deepcopy(x)
```


Create a deep copy of `x`: everything is copied recursively, resulting in a fully independent object. For example, deep-copying an array creates deep copies of all the objects it contains and produces a new array with the consistent relationship structure (e.g., if the first two elements are the same object in the original array, the first two elements of the new array will also be the same `deepcopy`ed object). Calling `deepcopy` on an object should generally have the same effect as serializing and then deserializing it.

While it isn&#39;t normally necessary, user-defined types can override the default `deepcopy` behavior by defining a specialized version of the function `deepcopy_internal(x::T, dict::IdDict)` (which shouldn&#39;t otherwise be used), where `T` is the type to be specialized for, and `dict` keeps track of objects copied so far within the recursion. Within the definition, `deepcopy_internal` should be used in place of `deepcopy`, and the `dict` variable should be updated as appropriate before returning.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/deepcopy.jl#L8-L26)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.getproperty' href='#Base.getproperty'>#</a>&nbsp;<b><u>Base.getproperty</u></b> &mdash; <i>Function</i>.




```julia
getproperty(value, name::Symbol)
getproperty(value, name::Symbol, order::Symbol)
```


The syntax `a.b` calls `getproperty(a, :b)`. The syntax `@atomic order a.b` calls `getproperty(a, :b, :order)` and the syntax `@atomic a.b` calls `getproperty(a, :b, :sequentially_consistent)`.

**Examples**

```julia
julia> struct MyType{T <: Number}
           x::T
       end

julia> function Base.getproperty(obj::MyType, sym::Symbol)
           if sym === :special
               return obj.x + 1
           else # fallback to getfield
               return getfield(obj, sym)
           end
       end

julia> obj = MyType(1);

julia> obj.special
2

julia> obj.x
1
```


One should overload `getproperty` only when necessary, as it can be confusing if the behavior of the syntax `obj.f` is unusual. Also note that using methods is often preferable. See also this style guide documentation for more information: [Prefer exported methods over direct field access](/manual/style-guide#Prefer-exported-methods-over-direct-field-access).

See also [`getfield`](/base/base#Core.getfield), [`propertynames`](/base/base#Base.propertynames) and [`setproperty!`](/base/base#Base.setproperty!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3360-L3399)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setproperty!' href='#Base.setproperty!'>#</a>&nbsp;<b><u>Base.setproperty!</u></b> &mdash; <i>Function</i>.




```julia
setproperty!(value, name::Symbol, x)
setproperty!(value, name::Symbol, x, order::Symbol)
```


The syntax `a.b = c` calls `setproperty!(a, :b, c)`. The syntax `@atomic order a.b = c` calls `setproperty!(a, :b, c, :order)` and the syntax `@atomic a.b = c` calls `setproperty!(a, :b, c, :sequentially_consistent)`.

::: tip Julia 1.8

`setproperty!` on modules requires at least Julia 1.8.

:::

See also [`setfield!`](/base/base#Core.setfield!), [`propertynames`](/base/base#Base.propertynames) and [`getproperty`](/base/base#Base.getproperty).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3402-L3416)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.replaceproperty!' href='#Base.replaceproperty!'>#</a>&nbsp;<b><u>Base.replaceproperty!</u></b> &mdash; <i>Function</i>.




```julia
replaceproperty!(x, f::Symbol, expected, desired, success_order::Symbol=:not_atomic, fail_order::Symbol=success_order)
```


Perform a compare-and-swap operation on `x.f` from `expected` to `desired`, per egal. The syntax `@atomicreplace x.f expected => desired` can be used instead of the function call form.

See also [`replacefield!`](/base/base#Core.replacefield!) [`setproperty!`](/base/base#Base.setproperty!), [`setpropertyonce!`](/base/base#Base.setpropertyonce!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3447-L3457)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.swapproperty!' href='#Base.swapproperty!'>#</a>&nbsp;<b><u>Base.swapproperty!</u></b> &mdash; <i>Function</i>.




```julia
swapproperty!(x, f::Symbol, v, order::Symbol=:not_atomic)
```


The syntax `@atomic a.b, _ = c, a.b` returns `(c, swapproperty!(a, :b, c, :sequentially_consistent))`, where there must be one `getproperty` expression common to both sides.

See also [`swapfield!`](/base/base#Core.swapfield!) and [`setproperty!`](/base/base#Base.setproperty!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3419-L3427)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.modifyproperty!' href='#Base.modifyproperty!'>#</a>&nbsp;<b><u>Base.modifyproperty!</u></b> &mdash; <i>Function</i>.




```julia
modifyproperty!(x, f::Symbol, op, v, order::Symbol=:not_atomic)
```


The syntax `@atomic op(x.f, v)` (and its equivalent `@atomic x.f op v`) returns `modifyproperty!(x, :f, op, v, :sequentially_consistent)`, where the first argument must be a `getproperty` expression and is modified atomically.

Invocation of `op(getproperty(x, f), v)` must return a value that can be stored in the field `f` of the object `x` by default.  In particular, unlike the default behavior of [`setproperty!`](/base/base#Base.setproperty!), the `convert` function is not called automatically.

See also [`modifyfield!`](/base/base#Core.modifyfield!) and [`setproperty!`](/base/base#Base.setproperty!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3430-L3444)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setpropertyonce!' href='#Base.setpropertyonce!'>#</a>&nbsp;<b><u>Base.setpropertyonce!</u></b> &mdash; <i>Function</i>.




```julia
setpropertyonce!(x, f::Symbol, value, success_order::Symbol=:not_atomic, fail_order::Symbol=success_order)
```


Perform a compare-and-swap operation on `x.f` to set it to `value` if previously unset. The syntax `@atomiconce x.f = value` can be used instead of the function call form.

See also [`setfieldonce!`](/base/base#Core.replacefield!), [`setproperty!`](/base/base#Base.setproperty!), [`replaceproperty!`](/base/base#Base.replaceproperty!).

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3460-L3472)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.propertynames' href='#Base.propertynames'>#</a>&nbsp;<b><u>Base.propertynames</u></b> &mdash; <i>Function</i>.




```julia
propertynames(x, private=false)
```


Get a tuple or a vector of the properties (`x.property`) of an object `x`. This is typically the same as [`fieldnames(typeof(x))`](/base/base#Base.fieldnames), but types that overload [`getproperty`](/base/base#Base.getproperty) should generally overload `propertynames` as well to get the properties of an instance of the type.

`propertynames(x)` may return only &quot;public&quot; property names that are part of the documented interface of `x`.   If you want it to also return &quot;private&quot; property names intended for internal use, pass `true` for the optional second argument. REPL tab completion on `x.` shows only the `private=false` properties.

See also: [`hasproperty`](/base/base#Base.hasproperty), [`hasfield`](/base/base#Base.hasfield).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2638-L2652)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hasproperty' href='#Base.hasproperty'>#</a>&nbsp;<b><u>Base.hasproperty</u></b> &mdash; <i>Function</i>.




```julia
hasproperty(x, s::Symbol)
```


Return a boolean indicating whether the object `x` has `s` as one of its own properties.

::: tip Julia 1.2

This function requires at least Julia 1.2.

:::

See also: [`propertynames`](/base/base#Base.propertynames), [`hasfield`](/base/base#Base.hasfield).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2658-L2667)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.getfield' href='#Core.getfield'>#</a>&nbsp;<b><u>Core.getfield</u></b> &mdash; <i>Function</i>.




```julia
getfield(value, name::Symbol, [order::Symbol])
getfield(value, i::Int, [order::Symbol])
```


Extract a field from a composite `value` by name or position. Optionally, an ordering can be defined for the operation. If the field was declared `@atomic`, the specification is strongly recommended to be compatible with the stores to that location. Otherwise, if not declared as `@atomic`, this parameter must be `:not_atomic` if specified. See also [`getproperty`](/base/base#Base.getproperty) and [`fieldnames`](/base/base#Base.fieldnames).

**Examples**

```julia
julia> a = 1//2
1//2

julia> getfield(a, :num)
1

julia> a.num
1

julia> getfield(a, 1)
1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2313-L2338)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.setfield!' href='#Core.setfield!'>#</a>&nbsp;<b><u>Core.setfield!</u></b> &mdash; <i>Function</i>.




```julia
setfield!(value, name::Symbol, x, [order::Symbol])
setfield!(value, i::Int, x, [order::Symbol])
```


Assign `x` to a named field in `value` of composite type. The `value` must be mutable and `x` must be a subtype of `fieldtype(typeof(value), name)`. Additionally, an ordering can be specified for this operation. If the field was declared `@atomic`, this specification is mandatory. Otherwise, if not declared as `@atomic`, it must be `:not_atomic` if specified. See also [`setproperty!`](/base/base#Base.setproperty!).

**Examples**

```julia
julia> mutable struct MyMutableStruct
           field::Int
       end

julia> a = MyMutableStruct(1);

julia> setfield!(a, :field, 2);

julia> getfield(a, :field)
2

julia> a = 1//2
1//2

julia> setfield!(a, :num, 3);
ERROR: setfield!: immutable struct of type Rational cannot be changed
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2341-L2371)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.modifyfield!' href='#Core.modifyfield!'>#</a>&nbsp;<b><u>Core.modifyfield!</u></b> &mdash; <i>Function</i>.




```julia
modifyfield!(value, name::Symbol, op, x, [order::Symbol]) -> Pair
modifyfield!(value, i::Int, op, x, [order::Symbol]) -> Pair
```


Atomically perform the operations to get and set a field after applying the function `op`.

```
y = getfield(value, name)
z = op(y, x)
setfield!(value, name, z)
return y => z
```


If supported by the hardware (for example, atomic increment), this may be optimized to the appropriate hardware instruction, otherwise it&#39;ll use a loop.

::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2389-L2406)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.replacefield!' href='#Core.replacefield!'>#</a>&nbsp;<b><u>Core.replacefield!</u></b> &mdash; <i>Function</i>.




```julia
replacefield!(value, name::Symbol, expected, desired,
              [success_order::Symbol, [fail_order::Symbol=success_order]) -> (; old, success::Bool)
replacefield!(value, i::Int, expected, desired,
              [success_order::Symbol, [fail_order::Symbol=success_order]) -> (; old, success::Bool)
```


Atomically perform the operations to get and conditionally set a field to a given value.

```
y = getfield(value, name, fail_order)
ok = y === expected
if ok
    setfield!(value, name, desired, success_order)
end
return (; old = y, success = ok)
```


If supported by the hardware, this may be optimized to the appropriate hardware instruction, otherwise it&#39;ll use a loop.

::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2409-L2430)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.swapfield!' href='#Core.swapfield!'>#</a>&nbsp;<b><u>Core.swapfield!</u></b> &mdash; <i>Function</i>.




```julia
swapfield!(value, name::Symbol, x, [order::Symbol])
swapfield!(value, i::Int, x, [order::Symbol])
```


Atomically perform the operations to simultaneously get and set a field:

```
y = getfield(value, name)
setfield!(value, name, x)
return y
```


::: tip Julia 1.7

This function requires Julia 1.7 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2374-L2386)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.setfieldonce!' href='#Core.setfieldonce!'>#</a>&nbsp;<b><u>Core.setfieldonce!</u></b> &mdash; <i>Function</i>.




```julia
setfieldonce!(value, name::Union{Int,Symbol}, desired,
              [success_order::Symbol, [fail_order::Symbol=success_order]) -> success::Bool
```


Atomically perform the operations to set a field to a given value, only if it was previously not set.

```
ok = !isdefined(value, name, fail_order)
if ok
    setfield!(value, name, desired, success_order)
end
return ok
```


::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2433-L2448)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.isdefined' href='#Core.isdefined'>#</a>&nbsp;<b><u>Core.isdefined</u></b> &mdash; <i>Function</i>.




```julia
isdefined(m::Module, s::Symbol, [order::Symbol])
isdefined(object, s::Symbol, [order::Symbol])
isdefined(object, index::Int, [order::Symbol])
```


Tests whether a global variable or object field is defined. The arguments can be a module and a symbol or a composite object and field name (as a symbol) or index. Optionally, an ordering can be defined for the operation. If the field was declared `@atomic`, the specification is strongly recommended to be compatible with the stores to that location. Otherwise, if not declared as `@atomic`, this parameter must be `:not_atomic` if specified.

To test whether an array element is defined, use [`isassigned`](/base/arrays#Base.isassigned) instead.

See also [`@isdefined`](/base/base#Base.@isdefined).

**Examples**

```julia
julia> isdefined(Base, :sum)
true

julia> isdefined(Base, :NonExistentMethod)
false

julia> a = 1//2;

julia> isdefined(a, 2)
true

julia> isdefined(a, 3)
false

julia> isdefined(a, :num)
true

julia> isdefined(a, :numerator)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2626-L2664)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@isdefined' href='#Base.@isdefined'>#</a>&nbsp;<b><u>Base.@isdefined</u></b> &mdash; <i>Macro</i>.




```julia
@isdefined s -> Bool
```


Tests whether variable `s` is defined in the current scope.

See also [`isdefined`](/base/base#Core.isdefined) for field properties and [`isassigned`](/base/arrays#Base.isassigned) for array indexes or [`haskey`](/base/collections#Base.haskey) for other mappings.

**Examples**

```julia
julia> @isdefined newvar
false

julia> newvar = 1
1

julia> @isdefined newvar
true

julia> function f()
           println(@isdefined x)
           x = 3
           println(@isdefined x)
       end
f (generic function with 1 method)

julia> f()
false
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L148-L178)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.convert' href='#Base.convert'>#</a>&nbsp;<b><u>Base.convert</u></b> &mdash; <i>Function</i>.




```julia
convert(T, x)
```


Convert `x` to a value of type `T`.

If `T` is an [`Integer`](/base/numbers#Core.Integer) type, an [`InexactError`](/base/base#Core.InexactError) will be raised if `x` is not representable by `T`, for example if `x` is not integer-valued, or is outside the range supported by `T`.

**Examples**

```julia
julia> convert(Int, 3.0)
3

julia> convert(Int, 3.5)
ERROR: InexactError: Int64(3.5)
Stacktrace:
[...]
```


If `T` is a [`AbstractFloat`](/base/numbers#Core.AbstractFloat) type, then it will return the closest value to `x` representable by `T`. Inf is treated as one ulp greater than `floatmax(T)` for purposes of determining nearest.

```julia
julia> x = 1/3
0.3333333333333333

julia> convert(Float32, x)
0.33333334f0

julia> convert(BigFloat, x)
0.333333333333333314829616256247390992939472198486328125
```


If `T` is a collection type and `x` a collection, the result of `convert(T, x)` may alias all or part of `x`.

```julia
julia> x = Int[1, 2, 3];

julia> y = convert(Vector{Int}, x);

julia> y === x
true
```


See also: [`round`](/base/math#Base.round), [`trunc`](/base/math#Base.trunc), [`oftype`](/base/base#Base.oftype), [`reinterpret`](/base/arrays#Base.reinterpret).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L382-L429)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.promote' href='#Base.promote'>#</a>&nbsp;<b><u>Base.promote</u></b> &mdash; <i>Function</i>.




```julia
promote(xs...)
```


Convert all arguments to a common type, and return them all (as a tuple). If no arguments can be converted, an error is raised.

See also: [`promote_type`](/base/base#Base.promote_type), [`promote_rule`](/base/base#Base.promote_rule).

**Examples**

```julia
julia> promote(Int8(1), Float16(4.5), Float32(4.1))
(1.0f0, 4.5f0, 4.1f0)

julia> promote_type(Int8, Float16, Float32)
Float32

julia> reduce(Base.promote_typejoin, (Int8, Float16, Float32))
Real

julia> promote(1, "x")
ERROR: promotion of types Int64 and String failed to change any arguments
[...]

julia> promote_type(Int, String)
Any
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/promotion.jl#L343-L369)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.oftype' href='#Base.oftype'>#</a>&nbsp;<b><u>Base.oftype</u></b> &mdash; <i>Function</i>.




```julia
oftype(x, y)
```


Convert `y` to the type of `x` i.e. `convert(typeof(x), y)`.

**Examples**

```julia
julia> x = 4;

julia> y = 3.;

julia> oftype(x, y)
3

julia> oftype(y, x)
4.0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L626-L643)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.widen' href='#Base.widen'>#</a>&nbsp;<b><u>Base.widen</u></b> &mdash; <i>Function</i>.




```julia
widen(x)
```


If `x` is a type, return a &quot;larger&quot; type, defined so that arithmetic operations `+` and `-` are guaranteed not to overflow nor lose precision for any combination of values that type `x` can hold.

For fixed-size integer types less than 128 bits, `widen` will return a type with twice the number of bits.

If `x` is a value, it is converted to `widen(typeof(x))`.

**Examples**

```julia
julia> widen(Int32)
Int64

julia> widen(1.5f0)
1.5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L920-L940)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.identity' href='#Base.identity'>#</a>&nbsp;<b><u>Base.identity</u></b> &mdash; <i>Function</i>.




```julia
identity(x)
```


The identity function. Returns its argument.

See also: [`one`](/base/numbers#Base.one), [`oneunit`](/base/numbers#Base.oneunit), and [`LinearAlgebra`](/stdlib/LinearAlgebra#man-linalg)&#39;s `I`.

**Examples**

```julia
julia> identity("Well, what did you expect?")
"Well, what did you expect?"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L559-L571)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.WeakRef' href='#Core.WeakRef'>#</a>&nbsp;<b><u>Core.WeakRef</u></b> &mdash; <i>Type</i>.




```julia
WeakRef(x)
```


`w = WeakRef(x)` constructs a [weak reference](https://en.wikipedia.org/wiki/Weak_reference) to the Julia value `x`: although `w` contains a reference to `x`, it does not prevent `x` from being garbage collected. `w.value` is either `x` (if `x` has not been garbage-collected yet) or `nothing` (if `x` has been garbage-collected).

```julia
julia> x = "a string"
"a string"

julia> w = WeakRef(x)
WeakRef("a string")

julia> GC.gc()

julia> w           # a reference is maintained via `x`
WeakRef("a string")

julia> x = nothing # clear reference

julia> GC.gc()

julia> w
WeakRef(nothing)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L4-L31)

</div>
<br>

## Properties of Types {#Properties-of-Types}

### Type relations {#Type-relations}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.supertype' href='#Base.supertype'>#</a>&nbsp;<b><u>Base.supertype</u></b> &mdash; <i>Function</i>.




```julia
supertype(T::Union{DataType, UnionAll})
```


Return the direct supertype of type `T`. `T` can be a [`DataType`](/base/base#Core.DataType) or a [`UnionAll`](/base/base#Core.UnionAll) type. Does not support type [`Union`](/base/base#Core.Union)s. Also see info on [Types](/manual/types#man-types).

**Examples**

```julia
julia> supertype(Int32)
Signed

julia> supertype(Vector)
DenseVector (alias for DenseArray{T, 1} where T)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L68-L83)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Type' href='#Core.Type'>#</a>&nbsp;<b><u>Core.Type</u></b> &mdash; <i>Type</i>.




```julia
Core.Type{T}
```


`Core.Type` is an abstract type which has all type objects as its instances. The only instance of the singleton type `Core.Type{T}` is the object `T`.

**Examples**

```julia
julia> isa(Type{Float64}, Type)
true

julia> isa(Float64, Type)
true

julia> isa(Real, Type{Float64})
false

julia> isa(Real, Type{Real})
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1552-L1573)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.DataType' href='#Core.DataType'>#</a>&nbsp;<b><u>Core.DataType</u></b> &mdash; <i>Type</i>.




```julia
DataType <: Type{T}
```


`DataType` represents explicitly declared types that have names, explicitly declared supertypes, and, optionally, parameters.  Every concrete value in the system is an instance of some `DataType`.

**Examples**

```julia
julia> typeof(Real)
DataType

julia> typeof(Int)
DataType

julia> struct Point
           x::Int
           y
       end

julia> typeof(Point)
DataType
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1576-L1599)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.:<:' href='#Core.:<:'>#</a>&nbsp;<b><u>Core.:<:</u></b> &mdash; <i>Function</i>.




```julia
<:(T1, T2)::Bool
```


Subtyping relation, defined between two types. In Julia, a type `S` is said to be a _subtype_ of a type `T` if and only if we have `S <: T`.

For any type `L` and any type `R`, `L <: R` implies that any value `v` of type `L` is also of type `R`. I.e., `(L <: R) && (v isa L)` implies `v isa R`.

The subtyping relation is a _partial order_. I.e., `<:` is:
- _reflexive_: for any type `T`, `T <: T` holds
  
- _antisymmetric_: for any type `A` and any type `B`, `(A <: B) && (B <: A)` implies `A == B`
  
- _transitive_: for any type `A`, any type `B` and any type `C`; `(A <: B) && (B <: C)` implies `A <: C`
  

See also info on [Types](/manual/types#man-types), [`Union{}`](/base/base#Union{}), [`Any`](/base/base#Core.Any), [`isa`](/base/base#Core.isa).

**Examples**

```julia
julia> Float64 <: AbstractFloat
true

julia> Vector{Int} <: AbstractArray
true

julia> Matrix{Float64} <: Matrix{AbstractFloat}  # `Matrix` is invariant
false

julia> Tuple{Float64} <: Tuple{AbstractFloat}    # `Tuple` is covariant
true

julia> Union{} <: Int  # The bottom type, `Union{}`, subtypes each type.
true

julia> Union{} <: Float32 <: AbstractFloat <: Real <: Number <: Any  # Operator chaining
true
```


The `<:` keyword also has several syntactic uses which represent the same subtyping relation, but which do not execute the operator or return a Bool:
- To specify the lower bound and the upper bound on a parameter of a [`UnionAll`](/base/base#Core.UnionAll) type in a [`where`](/base/base#where) statement.
  
- To specify the lower bound and the upper bound on a (static) parameter of a method, see [Parametric Methods](/manual/methods#Parametric-Methods).
  
- To define a subtyping relation while declaring a new type, see [`struct`](/base/base#struct) and [`abstract type`](/base/base#abstract%20type).
  


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L5-L58)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:>:' href='#Base.:>:'>#</a>&nbsp;<b><u>Base.:>:</u></b> &mdash; <i>Function</i>.




```julia
>:(T1, T2)
```


Supertype operator, equivalent to `T2 <: T1`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L61-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.typejoin' href='#Base.typejoin'>#</a>&nbsp;<b><u>Base.typejoin</u></b> &mdash; <i>Function</i>.




```julia
typejoin(T, S, ...)
```


Return the closest common ancestor of types `T` and `S`, i.e. the narrowest type from which they both inherit. Recurses on additional varargs.

**Examples**

```julia
julia> typejoin(Int, Float64)
Real

julia> typejoin(Int, Float64, ComplexF32)
Number
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/promotion.jl#L5-L19)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.typeintersect' href='#Base.typeintersect'>#</a>&nbsp;<b><u>Base.typeintersect</u></b> &mdash; <i>Function</i>.




```julia
typeintersect(T::Type, S::Type)
```


Compute a type that contains the intersection of `T` and `S`. Usually this will be the smallest such type or one close to it.

A special case where exact behavior is guaranteed: when `T <: S`, `typeintersect(S, T) == T == typeintersect(T, S)`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L902-L910)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.promote_type' href='#Base.promote_type'>#</a>&nbsp;<b><u>Base.promote_type</u></b> &mdash; <i>Function</i>.




```julia
promote_type(type1, type2, ...)
```


Promotion refers to converting values of mixed types to a single common type. `promote_type` represents the default promotion behavior in Julia when operators (usually mathematical) are given arguments of differing types. `promote_type` generally tries to return a type which can at least approximate most values of either input type without excessively widening.  Some loss is tolerated; for example, `promote_type(Int64, Float64)` returns [`Float64`](/base/numbers#Core.Float64) even though strictly, not all [`Int64`](/base/numbers#Core.Int64) values can be represented exactly as `Float64` values.

See also: [`promote`](/base/base#Base.promote), [`promote_typejoin`](/base/base#Base.promote_typejoin), [`promote_rule`](/base/base#Base.promote_rule).

**Examples**

```julia
julia> promote_type(Int64, Float64)
Float64

julia> promote_type(Int32, Int64)
Int64

julia> promote_type(Float32, BigInt)
BigFloat

julia> promote_type(Int16, Float16)
Float16

julia> promote_type(Int64, Float16)
Float16

julia> promote_type(Int8, UInt16)
UInt16
```


::: warning Don't overload this directly

To overload promotion for your own types you should overload [`promote_rule`](/base/base#Base.promote_rule). `promote_type` calls `promote_rule` internally to determine the type. Overloading `promote_type` directly can cause ambiguity errors.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/promotion.jl#L259-L298)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.promote_rule' href='#Base.promote_rule'>#</a>&nbsp;<b><u>Base.promote_rule</u></b> &mdash; <i>Function</i>.




```julia
promote_rule(type1, type2)
```


Specifies what type should be used by [`promote`](/base/base#Base.promote) when given values of types `type1` and `type2`. This function should not be called directly, but should have definitions added to it for new types as appropriate.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/promotion.jl#L321-L327)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.promote_typejoin' href='#Base.promote_typejoin'>#</a>&nbsp;<b><u>Base.promote_typejoin</u></b> &mdash; <i>Function</i>.




```julia
promote_typejoin(T, S)
```


Compute a type that contains both `T` and `S`, which could be either a parent of both types, or a `Union` if appropriate. Falls back to [`typejoin`](/base/base#Base.typejoin).

See instead [`promote`](/base/base#Base.promote), [`promote_type`](/base/base#Base.promote_type).

**Examples**

```julia
julia> Base.promote_typejoin(Int, Float64)
Real

julia> Base.promote_type(Int, Float64)
Float64
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/promotion.jl#L156-L173)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isdispatchtuple' href='#Base.isdispatchtuple'>#</a>&nbsp;<b><u>Base.isdispatchtuple</u></b> &mdash; <i>Function</i>.




```julia
isdispatchtuple(T)
```


Determine whether type `T` is a tuple &quot;leaf type&quot;, meaning it could appear as a type signature in dispatch and has no subtypes (or supertypes) which could appear in a call. If `T` is not a type, then return `false`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L759-L766)

</div>
<br>

### Declared structure {#Declared-structure}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ismutable' href='#Base.ismutable'>#</a>&nbsp;<b><u>Base.ismutable</u></b> &mdash; <i>Function</i>.




```julia
ismutable(v) -> Bool
```


Return `true` if and only if value `v` is mutable.  See [Mutable Composite Types](/manual/types#Mutable-Composite-Types) for a discussion of immutability. Note that this function works on values, so if you give it a `DataType`, it will tell you that a value of the type is mutable.

::: tip Note

For technical reasons, `ismutable` returns `true` for values of certain special types (for example `String` and `Symbol`) even though they cannot be mutated in a permissible way.

:::

See also [`isbits`](/base/base#Base.isbits), [`isstructtype`](/base/base#Base.isstructtype).

**Examples**

```julia
julia> ismutable(1)
false

julia> ismutable([1,2])
true
```


::: tip Julia 1.5

This function requires at least Julia 1.5.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L634-L658)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isimmutable' href='#Base.isimmutable'>#</a>&nbsp;<b><u>Base.isimmutable</u></b> &mdash; <i>Function</i>.




```julia
isimmutable(v) -> Bool
```


::: warning Warning

Consider using `!ismutable(v)` instead, as `isimmutable(v)` will be replaced by `!ismutable(v)` in a future release. (Since Julia 1.5)

:::

Return `true` iff value `v` is immutable.  See [Mutable Composite Types](/manual/types#Mutable-Composite-Types) for a discussion of immutability. Note that this function works on values, so if you give it a type, it will tell you that a value of `DataType` is mutable.

**Examples**

```julia
julia> isimmutable(1)
true

julia> isimmutable([1,2])
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/deprecated.jl#L343-L359)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ismutabletype' href='#Base.ismutabletype'>#</a>&nbsp;<b><u>Base.ismutabletype</u></b> &mdash; <i>Function</i>.




```julia
ismutabletype(T) -> Bool
```


Determine whether type `T` was declared as a mutable type (i.e. using `mutable struct` keyword). If `T` is not a type, then return `false`.

::: tip Julia 1.7

This function requires at least Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L663-L672)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isabstracttype' href='#Base.isabstracttype'>#</a>&nbsp;<b><u>Base.isabstracttype</u></b> &mdash; <i>Function</i>.




```julia
isabstracttype(T)
```


Determine whether type `T` was declared as an abstract type (i.e. using the `abstract type` syntax). Note that this is not the negation of `isconcretetype(T)`. If `T` is not a type, then return `false`.

**Examples**

```julia
julia> isabstracttype(AbstractArray)
true

julia> isabstracttype(Vector)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L858-L874)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isprimitivetype' href='#Base.isprimitivetype'>#</a>&nbsp;<b><u>Base.isprimitivetype</u></b> &mdash; <i>Function</i>.




```julia
isprimitivetype(T) -> Bool
```


Determine whether type `T` was declared as a primitive type (i.e. using the `primitive type` syntax). If `T` is not a type, then return `false`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L697-L703)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.issingletontype' href='#Base.issingletontype'>#</a>&nbsp;<b><u>Base.issingletontype</u></b> &mdash; <i>Function</i>.




```julia
Base.issingletontype(T)
```


Determine whether type `T` has exactly one possible instance; for example, a struct type with no fields except other singleton values. If `T` is not a concrete type, then return `false`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L893-L899)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isstructtype' href='#Base.isstructtype'>#</a>&nbsp;<b><u>Base.isstructtype</u></b> &mdash; <i>Function</i>.




```julia
isstructtype(T) -> Bool
```


Determine whether type `T` was declared as a struct type (i.e. using the `struct` or `mutable struct` keyword). If `T` is not a type, then return `false`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L682-L688)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nameof-Tuple{DataType}' href='#Base.nameof-Tuple{DataType}'>#</a>&nbsp;<b><u>Base.nameof</u></b> &mdash; <i>Method</i>.




```julia
nameof(t::DataType) -> Symbol
```


Get the name of a (potentially `UnionAll`-wrapped) `DataType` (without its parent module) as a symbol.

**Examples**

```julia
julia> module Foo
           struct S{T}
           end
       end
Foo

julia> nameof(Foo.S{T} where T)
:S
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L292-L309)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fieldnames' href='#Base.fieldnames'>#</a>&nbsp;<b><u>Base.fieldnames</u></b> &mdash; <i>Function</i>.




```julia
fieldnames(x::DataType)
```


Get a tuple with the names of the fields of a `DataType`.

See also [`propertynames`](/base/base#Base.propertynames), [`hasfield`](/base/base#Base.hasfield).

**Examples**

```julia
julia> fieldnames(Rational)
(:num, :den)

julia> fieldnames(typeof(1+im))
(:re, :im)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L244-L259)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fieldname' href='#Base.fieldname'>#</a>&nbsp;<b><u>Base.fieldname</u></b> &mdash; <i>Function</i>.




```julia
fieldname(x::DataType, i::Integer)
```


Get the name of field `i` of a `DataType`.

**Examples**

```julia
julia> fieldname(Rational, 1)
:num

julia> fieldname(Rational, 2)
:den
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L210-L223)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.fieldtype' href='#Core.fieldtype'>#</a>&nbsp;<b><u>Core.fieldtype</u></b> &mdash; <i>Function</i>.




```julia
fieldtype(T, name::Symbol | index::Int)
```


Determine the declared type of a field (specified by name or index) in a composite DataType `T`.

**Examples**

```julia
julia> struct Foo
           x::Int64
           y::String
       end

julia> fieldtype(Foo, :x)
Int64

julia> fieldtype(Foo, 2)
String
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L944-L962)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fieldtypes' href='#Base.fieldtypes'>#</a>&nbsp;<b><u>Base.fieldtypes</u></b> &mdash; <i>Function</i>.




```julia
fieldtypes(T::Type)
```


The declared types of all fields in a composite DataType `T` as a tuple.

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

**Examples**

```julia
julia> struct Foo
           x::Int64
           y::String
       end

julia> fieldtypes(Foo)
(Int64, String)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L1066-L1084)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fieldcount' href='#Base.fieldcount'>#</a>&nbsp;<b><u>Base.fieldcount</u></b> &mdash; <i>Function</i>.




```julia
fieldcount(t::Type)
```


Get the number of fields that an instance of the given type would have. An error is thrown if the type is too abstract to determine this.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L1040-L1045)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hasfield' href='#Base.hasfield'>#</a>&nbsp;<b><u>Base.hasfield</u></b> &mdash; <i>Function</i>.




```julia
hasfield(T::Type, name::Symbol)
```


Return a boolean indicating whether `T` has `name` as one of its own fields.

See also [`fieldnames`](/base/base#Base.fieldnames), [`fieldcount`](/base/base#Base.fieldcount), [`hasproperty`](/base/base#Base.hasproperty).

::: tip Julia 1.2

This function requires at least Julia 1.2.

:::

**Examples**

```julia
julia> struct Foo
            bar::Int
       end

julia> hasfield(Foo, :bar)
true

julia> hasfield(Foo, :x)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L267-L289)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.nfields' href='#Core.nfields'>#</a>&nbsp;<b><u>Core.nfields</u></b> &mdash; <i>Function</i>.




```julia
nfields(x) -> Int
```


Get the number of fields in the given object.

**Examples**

```julia
julia> a = 1//2;

julia> nfields(a)
2

julia> b = 1
1

julia> nfields(b)
0

julia> ex = ErrorException("I've done a bad thing");

julia> nfields(ex)
1
```


In these examples, `a` is a [`Rational`](/base/numbers#Base.Rational), which has two fields. `b` is an `Int`, which is a primitive bitstype with no fields at all. `ex` is an [`ErrorException`](/base/base#Core.ErrorException), which has one field.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1811-L1838)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isconst' href='#Base.isconst'>#</a>&nbsp;<b><u>Base.isconst</u></b> &mdash; <i>Function</i>.




```julia
isconst(m::Module, s::Symbol) -> Bool
```


Determine whether a global is declared `const` in a given module `m`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L335-L339)



```julia
isconst(t::DataType, s::Union{Int,Symbol}) -> Bool
```


Determine whether a field `s` is declared `const` in a given type `t`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L347-L351)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isfieldatomic' href='#Base.isfieldatomic'>#</a>&nbsp;<b><u>Base.isfieldatomic</u></b> &mdash; <i>Function</i>.




```julia
isfieldatomic(t::DataType, s::Union{Int,Symbol}) -> Bool
```


Determine whether a field `s` is declared `@atomic` in a given type `t`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L371-L375)

</div>
<br>

### Memory layout {#Memory-layout}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.sizeof-Tuple{Type}' href='#Base.sizeof-Tuple{Type}'>#</a>&nbsp;<b><u>Base.sizeof</u></b> &mdash; <i>Method</i>.




```julia
sizeof(T::DataType)
sizeof(obj)
```


Size, in bytes, of the canonical binary representation of the given `DataType` `T`, if any. Or the size, in bytes, of object `obj` if it is not a `DataType`.

See also [`Base.summarysize`](/base/base#Base.summarysize).

**Examples**

```julia
julia> sizeof(Float32)
4

julia> sizeof(ComplexF64)
16

julia> sizeof(1.0)
8

julia> sizeof(collect(1.0:10.0))
80

julia> struct StructWithPadding
           x::Int64
           flag::Bool
       end

julia> sizeof(StructWithPadding) # not the sum of `sizeof` of fields due to padding
16

julia> sizeof(Int64) + sizeof(Bool) # different from above
9
```


If `DataType` `T` does not have a specific size, an error is thrown.

```julia
julia> sizeof(AbstractArray)
ERROR: Abstract type AbstractArray does not have a definite size.
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L714-L757)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isconcretetype' href='#Base.isconcretetype'>#</a>&nbsp;<b><u>Base.isconcretetype</u></b> &mdash; <i>Function</i>.




```julia
isconcretetype(T)
```


Determine whether type `T` is a concrete type, meaning it could have direct instances (values `x` such that `typeof(x) === T`). Note that this is not the negation of `isabstracttype(T)`. If `T` is not a type, then return `false`.

See also: [`isbits`](/base/base#Base.isbits), [`isabstracttype`](/base/base#Base.isabstracttype), [`issingletontype`](/base/base#Base.issingletontype).

**Examples**

```julia
julia> isconcretetype(Complex)
false

julia> isconcretetype(Complex{Float32})
true

julia> isconcretetype(Vector{Complex})
true

julia> isconcretetype(Vector{Complex{Float32}})
true

julia> isconcretetype(Union{})
false

julia> isconcretetype(Union{Int,String})
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L825-L855)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isbits' href='#Base.isbits'>#</a>&nbsp;<b><u>Base.isbits</u></b> &mdash; <i>Function</i>.




```julia
isbits(x)
```


Return `true` if `x` is an instance of an [`isbitstype`](/base/base#Base.isbitstype) type.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L738-L742)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isbitstype' href='#Base.isbitstype'>#</a>&nbsp;<b><u>Base.isbitstype</u></b> &mdash; <i>Function</i>.




```julia
isbitstype(T)
```


Return `true` if type `T` is a &quot;plain data&quot; type, meaning it is immutable and contains no references to other values, only `primitive` types and other `isbitstype` types. Typical examples are numeric types such as [`UInt8`](/base/numbers#Core.UInt8), [`Float64`](/base/numbers#Core.Float64), and [`Complex{Float64}`](/base/numbers#Base.Complex). This category of types is significant since they are valid as type parameters, may not track [`isdefined`](/base/base#Core.isdefined) / [`isassigned`](/base/arrays#Base.isassigned) status, and have a defined layout that is compatible with C. If `T` is not a type, then return `false`.

See also [`isbits`](/base/base#Base.isbits), [`isprimitivetype`](/base/base#Base.isprimitivetype), [`ismutable`](/base/base#Base.ismutable).

**Examples**

```julia
julia> isbitstype(Complex{Float64})
true

julia> isbitstype(Complex)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L712-L735)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fieldoffset' href='#Base.fieldoffset'>#</a>&nbsp;<b><u>Base.fieldoffset</u></b> &mdash; <i>Function</i>.




```julia
fieldoffset(type, i)
```


The byte offset of field `i` of a type relative to the data start. For example, we could use it in the following manner to summarize information about a struct:

```julia
julia> structinfo(T) = [(fieldoffset(T,i), fieldname(T,i), fieldtype(T,i)) for i = 1:fieldcount(T)];

julia> structinfo(Base.Filesystem.StatStruct)
13-element Vector{Tuple{UInt64, Symbol, Type}}:
 (0x0000000000000000, :desc, Union{RawFD, String})
 (0x0000000000000008, :device, UInt64)
 (0x0000000000000010, :inode, UInt64)
 (0x0000000000000018, :mode, UInt64)
 (0x0000000000000020, :nlink, Int64)
 (0x0000000000000028, :uid, UInt64)
 (0x0000000000000030, :gid, UInt64)
 (0x0000000000000038, :rdev, UInt64)
 (0x0000000000000040, :size, Int64)
 (0x0000000000000048, :blksize, Int64)
 (0x0000000000000050, :blocks, Int64)
 (0x0000000000000058, :mtime, Float64)
 (0x0000000000000060, :ctime, Float64)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L916-L941)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.datatype_alignment' href='#Base.datatype_alignment'>#</a>&nbsp;<b><u>Base.datatype_alignment</u></b> &mdash; <i>Function</i>.




```julia
Base.datatype_alignment(dt::DataType) -> Int
```


Memory allocation minimum alignment for instances of this type. Can be called on any `isconcretetype`, although for Memory it will give the alignment of the elements, not the whole object.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L451-L457)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.datatype_haspadding' href='#Base.datatype_haspadding'>#</a>&nbsp;<b><u>Base.datatype_haspadding</u></b> &mdash; <i>Function</i>.




```julia
Base.datatype_haspadding(dt::DataType) -> Bool
```


Return whether the fields of instances of this type are packed in memory, with no intervening padding bits (defined as bits whose value does not impact the semantic value of the instance itself). Can be called on any `isconcretetype`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L494-L501)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.datatype_pointerfree' href='#Base.datatype_pointerfree'>#</a>&nbsp;<b><u>Base.datatype_pointerfree</u></b> &mdash; <i>Function</i>.




```julia
Base.datatype_pointerfree(dt::DataType) -> Bool
```


Return whether instances of this type can contain references to gc-managed memory. Can be called on any `isconcretetype`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L537-L542)

</div>
<br>

### Special values {#Special-values}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.typemin' href='#Base.typemin'>#</a>&nbsp;<b><u>Base.typemin</u></b> &mdash; <i>Function</i>.




```julia
typemin(T)
```


The lowest value representable by the given (real) numeric DataType `T`.

See also: [`floatmin`](/base/base#Base.floatmin), [`typemax`](/base/base#Base.typemax), [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}).

**Examples**

```julia
julia> typemin(Int8)
-128

julia> typemin(UInt32)
0x00000000

julia> typemin(Float16)
-Inf16

julia> typemin(Float32)
-Inf32

julia> nextfloat(-Inf32)  # smallest finite Float32 floating point number
-3.4028235f38
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/int.jl#L750-L774)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.typemax' href='#Base.typemax'>#</a>&nbsp;<b><u>Base.typemax</u></b> &mdash; <i>Function</i>.




```julia
typemax(T)
```


The highest value representable by the given (real) numeric `DataType`.

See also: [`floatmax`](/base/base#Base.floatmax), [`typemin`](/base/base#Base.typemin), [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}).

**Examples**

```julia
julia> typemax(Int8)
127

julia> typemax(UInt32)
0xffffffff

julia> typemax(Float64)
Inf

julia> typemax(Float32)
Inf32

julia> floatmax(Float32)  # largest finite Float32 floating point number
3.4028235f38
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/int.jl#L777-L801)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.floatmin' href='#Base.floatmin'>#</a>&nbsp;<b><u>Base.floatmin</u></b> &mdash; <i>Function</i>.




```julia
floatmin(T = Float64)
```


Return the smallest positive normal number representable by the floating-point type `T`.

**Examples**

```julia
julia> floatmin(Float16)
Float16(6.104e-5)

julia> floatmin(Float32)
1.1754944f-38

julia> floatmin()
2.2250738585072014e-308
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/float.jl#L1066-L1083)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.floatmax' href='#Base.floatmax'>#</a>&nbsp;<b><u>Base.floatmax</u></b> &mdash; <i>Function</i>.




```julia
floatmax(T = Float64)
```


Return the largest finite number representable by the floating-point type `T`.

See also: [`typemax`](/base/base#Base.typemax), [`floatmin`](/base/base#Base.floatmin), [`eps`](/base/base#Base.eps-Tuple{Type{<:AbstractFloat}}).

**Examples**

```julia
julia> floatmax(Float16)
Float16(6.55e4)

julia> floatmax(Float32)
3.4028235f38

julia> floatmax()
1.7976931348623157e308

julia> typemax(Float64)
Inf
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/float.jl#L1086-L1107)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.maxintfloat' href='#Base.maxintfloat'>#</a>&nbsp;<b><u>Base.maxintfloat</u></b> &mdash; <i>Function</i>.




```julia
maxintfloat(T=Float64)
```


The largest consecutive integer-valued floating-point number that is exactly represented in the given floating-point type `T` (which defaults to `Float64`).

That is, `maxintfloat` returns the smallest positive integer-valued floating-point number `n` such that `n+1` is _not_ exactly representable in the type `T`.

When an `Integer`-type value is needed, use `Integer(maxintfloat(T))`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/floatfuncs.jl#L19-L29)



```julia
maxintfloat(T, S)
```


The largest consecutive integer representable in the given floating-point type `T` that also does not exceed the maximum integer representable by the integer type `S`.  Equivalently, it is the minimum of `maxintfloat(T)` and [`typemax(S)`](/base/base#Base.typemax).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/floatfuncs.jl#L35-L41)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eps-Tuple{Type{<:AbstractFloat}}' href='#Base.eps-Tuple{Type{<:AbstractFloat}}'>#</a>&nbsp;<b><u>Base.eps</u></b> &mdash; <i>Method</i>.




```julia
eps(::Type{T}) where T<:AbstractFloat
eps()
```


Return the _machine epsilon_ of the floating point type `T` (`T = Float64` by default). This is defined as the gap between 1 and the next largest value representable by `typeof(one(T))`, and is equivalent to `eps(one(T))`.  (Since `eps(T)` is a bound on the _relative error_ of `T`, it is a &quot;dimensionless&quot; quantity like [`one`](/base/numbers#Base.one).)

**Examples**

```julia
julia> eps()
2.220446049250313e-16

julia> eps(Float32)
1.1920929f-7

julia> 1.0 + eps()
1.0000000000000002

julia> 1.0 + eps()/2
1.0
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/float.jl#L1113-L1136)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.eps-Tuple{AbstractFloat}' href='#Base.eps-Tuple{AbstractFloat}'>#</a>&nbsp;<b><u>Base.eps</u></b> &mdash; <i>Method</i>.




```julia
eps(x::AbstractFloat)
```


Return the _unit in last place_ (ulp) of `x`. This is the distance between consecutive representable floating point values at `x`. In most cases, if the distance on either side of `x` is different, then the larger of the two is taken, that is

```
eps(x) == max(x-prevfloat(x), nextfloat(x)-x)
```


The exceptions to this rule are the smallest and largest finite values (e.g. `nextfloat(-Inf)` and `prevfloat(Inf)` for [`Float64`](/base/numbers#Core.Float64)), which round to the smaller of the values.

The rationale for this behavior is that `eps` bounds the floating point rounding error. Under the default `RoundNearest` rounding mode, if $y$ is a real number and $x$ is the nearest floating point number to $y$, then

$$|y-x| \leq \operatorname{eps}(x)/2.$$

See also: [`nextfloat`](/base/numbers#Base.nextfloat), [`issubnormal`](/base/numbers#Base.issubnormal), [`floatmax`](/base/base#Base.floatmax).

**Examples**

```julia
julia> eps(1.0)
2.220446049250313e-16

julia> eps(prevfloat(2.0))
2.220446049250313e-16

julia> eps(2.0)
4.440892098500626e-16

julia> x = prevfloat(Inf)      # largest finite Float64
1.7976931348623157e308

julia> x + eps(x)/2            # rounds up
Inf

julia> x + prevfloat(eps(x)/2) # rounds down
1.7976931348623157e308
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/float.jl#L1139-L1182)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.instances' href='#Base.instances'>#</a>&nbsp;<b><u>Base.instances</u></b> &mdash; <i>Function</i>.




```julia
instances(T::Type)
```


Return a collection of all instances of the given type, if applicable. Mostly used for enumerated types (see `@enum`).

**Examples**

```julia
julia> @enum Color red blue green

julia> instances(Color)
(red, blue, green)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L1089-L1102)

</div>
<br>

## Special Types {#Special-Types}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Any' href='#Core.Any'>#</a>&nbsp;<b><u>Core.Any</u></b> &mdash; <i>Type</i>.




```julia
Any::DataType
```


`Any` is the union of all types. It has the defining property `isa(x, Any) == true` for any `x`. `Any` therefore describes the entire universe of possible values. For example `Integer` is a subset of `Any` that includes `Int`, `Int8`, and other integer types.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3121-L3127)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Union' href='#Core.Union'>#</a>&nbsp;<b><u>Core.Union</u></b> &mdash; <i>Type</i>.




```julia
Union{Types...}
```


A `Union` type is an abstract type which includes all instances of any of its argument types. This means that `T <: Union{T,S}` and `S <: Union{T,S}`.

Like other abstract types, it cannot be instantiated, even if all of its arguments are non abstract.

**Examples**

```julia
julia> IntOrString = Union{Int,AbstractString}
Union{Int64, AbstractString}

julia> 1 isa IntOrString # instance of Int is included in the union
true

julia> "Hello!" isa IntOrString # String is also included
true

julia> 1.0 isa IntOrString # Float64 is not included because it is neither Int nor AbstractString
false
```


**Extended Help**

Unlike most other parametric types, unions are covariant in their parameters. For example, `Union{Real, String}` is a subtype of `Union{Number, AbstractString}`.

The empty union [`Union{}`](/base/base#Union{}) is the bottom type of Julia.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3145-L3175)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Union{}' href='#Union{}'>#</a>&nbsp;<b><u>Union{}</u></b> &mdash; <i>Keyword</i>.




```julia
Union{}
```


`Union{}`, the empty [`Union`](/base/base#Core.Union) of types, is the type that has no values. That is, it has the defining property `isa(x, Union{}) == false` for any `x`. `Base.Bottom` is defined as its alias and the type of `Union{}` is `Core.TypeofBottom`.

**Examples**

```julia
julia> isa(nothing, Union{})
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3130-L3142)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UnionAll' href='#Core.UnionAll'>#</a>&nbsp;<b><u>Core.UnionAll</u></b> &mdash; <i>Type</i>.




```julia
UnionAll
```


A union of types over all values of a type parameter. `UnionAll` is used to describe parametric types where the values of some parameters are not known. See the manual section on [UnionAll Types](/manual/types#UnionAll-Types).

**Examples**

```julia
julia> typeof(Vector)
UnionAll

julia> typeof(Vector{Int})
DataType
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3179-L3193)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Tuple' href='#Core.Tuple'>#</a>&nbsp;<b><u>Core.Tuple</u></b> &mdash; <i>Type</i>.




```julia
Tuple{Types...}
```


A tuple is a fixed-length container that can hold any values of different types, but cannot be modified (it is immutable). The values can be accessed via indexing. Tuple literals are written with commas and parentheses:

```julia
julia> (1, 1+1)
(1, 2)

julia> (1,)
(1,)

julia> x = (0.0, "hello", 6*7)
(0.0, "hello", 42)

julia> x[2]
"hello"

julia> typeof(x)
Tuple{Float64, String, Int64}
```


A length-1 tuple must be written with a comma, `(1,)`, since `(1)` would just be a parenthesized value. `()` represents the empty (length-0) tuple.

A tuple can be constructed from an iterator by using a `Tuple` type as constructor:

```julia
julia> Tuple(["a", 1])
("a", 1)

julia> Tuple{String, Float64}(["a", 1])
("a", 1.0)
```


Tuple types are covariant in their parameters: `Tuple{Int}` is a subtype of `Tuple{Any}`. Therefore `Tuple{Any}` is considered an abstract type, and tuple types are only concrete if their parameters are. Tuples do not have field names; fields are only accessed by index. Tuple types may have any number of parameters.

See the manual section on [Tuple Types](/manual/types#Tuple-Types).

See also [`Vararg`](/base/base#Core.Vararg), [`NTuple`](/base/base#Core.NTuple), [`ntuple`](/base/base#Base.ntuple), [`tuple`](/base/base#Core.tuple), [`NamedTuple`](/base/base#Core.NamedTuple).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3262-L3307)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.NTuple' href='#Core.NTuple'>#</a>&nbsp;<b><u>Core.NTuple</u></b> &mdash; <i>Type</i>.




```julia
NTuple{N, T}
```


A compact way of representing the type for a tuple of length `N` where all elements are of type `T`.

**Examples**

```julia
julia> isa((1, 2, 3, 4, 5, 6), NTuple{6, Int})
true
```


See also [`ntuple`](/base/base#Base.ntuple).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/tuple.jl#L4-L16)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.NamedTuple' href='#Core.NamedTuple'>#</a>&nbsp;<b><u>Core.NamedTuple</u></b> &mdash; <i>Type</i>.




```julia
NamedTuple
```


`NamedTuple`s are, as their name suggests, named [`Tuple`](/base/base#Core.Tuple)s. That is, they&#39;re a tuple-like collection of values, where each entry has a unique name, represented as a [`Symbol`](/base/base#Core.Symbol). Like `Tuple`s, `NamedTuple`s are immutable; neither the names nor the values can be modified in place after construction.

A named tuple can be created as a tuple literal with keys, e.g. `(a=1, b=2)`, or as a tuple literal with semicolon after the opening parenthesis, e.g. `(; a=1, b=2)` (this form also accepts programmatically generated names as described below), or using a `NamedTuple` type as constructor, e.g. `NamedTuple{(:a, :b)}((1,2))`.

Accessing the value associated with a name in a named tuple can be done using field access syntax, e.g. `x.a`, or using [`getindex`](/base/collections#Base.getindex), e.g. `x[:a]` or `x[(:a, :b)]`. A tuple of the names can be obtained using [`keys`](/base/collections#Base.keys), and a tuple of the values can be obtained using [`values`](/base/collections#Base.values).

::: tip Note

Iteration over `NamedTuple`s produces the _values_ without the names. (See example below.) To iterate over the name-value pairs, use the [`pairs`](/base/collections#Base.pairs) function.

:::

The [`@NamedTuple`](/base/base#Base.@NamedTuple) macro can be used for conveniently declaring `NamedTuple` types.

**Examples**

```julia
julia> x = (a=1, b=2)
(a = 1, b = 2)

julia> x.a
1

julia> x[:a]
1

julia> x[(:a,)]
(a = 1,)

julia> keys(x)
(:a, :b)

julia> values(x)
(1, 2)

julia> collect(x)
2-element Vector{Int64}:
 1
 2

julia> collect(pairs(x))
2-element Vector{Pair{Symbol, Int64}}:
 :a => 1
 :b => 2
```


In a similar fashion as to how one can define keyword arguments programmatically, a named tuple can be created by giving pairs `name::Symbol => value` after a semicolon inside a tuple literal. This and the `name=value` syntax can be mixed:

```julia
julia> (; :a => 1, :b => 2, c=3)
(a = 1, b = 2, c = 3)
```


The name-value pairs can also be provided by splatting a named tuple or any iterator that yields two-value collections holding each a symbol as first value:

```julia
julia> keys = (:a, :b, :c); values = (1, 2, 3);

julia> NamedTuple{keys}(values)
(a = 1, b = 2, c = 3)

julia> (; (keys .=> values)...)
(a = 1, b = 2, c = 3)

julia> nt1 = (a=1, b=2);

julia> nt2 = (c=3, d=4);

julia> (; nt1..., nt2..., b=20) # the final b overwrites the value from nt1
(a = 1, b = 20, c = 3, d = 4)

julia> (; zip(keys, values)...) # zip yields tuples such as (:a, 1)
(a = 1, b = 2, c = 3)
```


As in keyword arguments, identifiers and dot expressions imply names:

```julia
julia> x = 0
0

julia> t = (; x)
(x = 0,)

julia> (; t.x)
(x = 0,)
```


::: tip Julia 1.5

Implicit names from identifiers and dot expressions are available as of Julia 1.5.

:::

::: tip Julia 1.7

Use of `getindex` methods with multiple `Symbol`s is available as of Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/namedtuple.jl#L3-L110)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@NamedTuple' href='#Base.@NamedTuple'>#</a>&nbsp;<b><u>Base.@NamedTuple</u></b> &mdash; <i>Macro</i>.




```julia
@NamedTuple{key1::Type1, key2::Type2, ...}
@NamedTuple begin key1::Type1; key2::Type2; ...; end
```


This macro gives a more convenient syntax for declaring `NamedTuple` types. It returns a `NamedTuple` type with the given keys and types, equivalent to `NamedTuple{(:key1, :key2, ...), Tuple{Type1,Type2,...}}`. If the `::Type` declaration is omitted, it is taken to be `Any`.   The `begin ... end` form allows the declarations to be split across multiple lines (similar to a `struct` declaration), but is otherwise equivalent. The `NamedTuple` macro is used when printing `NamedTuple` types to e.g. the REPL.

For example, the tuple `(a=3.1, b="hello")` has a type `NamedTuple{(:a, :b), Tuple{Float64, String}}`, which can also be declared via `@NamedTuple` as:

```julia
julia> @NamedTuple{a::Float64, b::String}
@NamedTuple{a::Float64, b::String}

julia> @NamedTuple begin
           a::Float64
           b::String
       end
@NamedTuple{a::Float64, b::String}
```


::: tip Julia 1.5

This macro is available as of Julia 1.5.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/namedtuple.jl#L472-L498)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@Kwargs' href='#Base.@Kwargs'>#</a>&nbsp;<b><u>Base.@Kwargs</u></b> &mdash; <i>Macro</i>.




```julia
@Kwargs{key1::Type1, key2::Type2, ...}
```


This macro gives a convenient way to construct the type representation of keyword arguments from the same syntax as [`@NamedTuple`](/base/base#Base.@NamedTuple). For example, when we have a function call like `func([positional arguments]; kw1=1.0, kw2="2")`, we can use this macro to construct the internal type representation of the keyword arguments as `@Kwargs{kw1::Float64, kw2::String}`. The macro syntax is specifically designed to simplify the signature type of a keyword method when it is printed in the stack trace view.

```julia
julia> @Kwargs{init::Int} # the internal representation of keyword arguments
Base.Pairs{Symbol, Int64, Tuple{Symbol}, @NamedTuple{init::Int64}}

julia> sum("julia"; init=1)
ERROR: MethodError: no method matching +(::Char, ::Char)
The function `+` exists, but no method is defined for this combination of argument types.

Closest candidates are:
  +(::Any, ::Any, ::Any, ::Any...)
   @ Base operators.jl:585
  +(::Integer, ::AbstractChar)
   @ Base char.jl:247
  +(::T, ::Integer) where T<:AbstractChar
   @ Base char.jl:237

Stacktrace:
  [1] add_sum(x::Char, y::Char)
    @ Base ./reduce.jl:24
  [2] BottomRF
    @ Base ./reduce.jl:86 [inlined]
  [3] _foldl_impl(op::Base.BottomRF{typeof(Base.add_sum)}, init::Int64, itr::String)
    @ Base ./reduce.jl:62
  [4] foldl_impl(op::Base.BottomRF{typeof(Base.add_sum)}, nt::Int64, itr::String)
    @ Base ./reduce.jl:48 [inlined]
  [5] mapfoldl_impl(f::typeof(identity), op::typeof(Base.add_sum), nt::Int64, itr::String)
    @ Base ./reduce.jl:44 [inlined]
  [6] mapfoldl(f::typeof(identity), op::typeof(Base.add_sum), itr::String; init::Int64)
    @ Base ./reduce.jl:175 [inlined]
  [7] mapreduce(f::typeof(identity), op::typeof(Base.add_sum), itr::String; kw::@Kwargs{init::Int64})
    @ Base ./reduce.jl:307 [inlined]
  [8] sum(f::typeof(identity), a::String; kw::@Kwargs{init::Int64})
    @ Base ./reduce.jl:535 [inlined]
  [9] sum(a::String; kw::@Kwargs{init::Int64})
    @ Base ./reduce.jl:564 [inlined]
 [10] top-level scope
    @ REPL[12]:1
```


::: tip Julia 1.10

This macro is available as of Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/namedtuple.jl#L510-L562)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Val' href='#Base.Val'>#</a>&nbsp;<b><u>Base.Val</u></b> &mdash; <i>Type</i>.




```julia
Val(c)
```


Return `Val{c}()`, which contains no run-time data. Types like this can be used to pass the information between functions through the value `c`, which must be an `isbits` value or a `Symbol`. The intent of this construct is to be able to dispatch on constants directly (at compile time) without having to test the value of the constant at run time.

**Examples**

```julia
julia> f(::Val{true}) = "Good"
f (generic function with 1 method)

julia> f(::Val{false}) = "Bad"
f (generic function with 2 methods)

julia> f(Val(true))
"Good"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L992-L1011)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Vararg' href='#Core.Vararg'>#</a>&nbsp;<b><u>Core.Vararg</u></b> &mdash; <i>Constant</i>.




```julia
Vararg{T,N}
```


The last parameter of a tuple type [`Tuple`](/base/base#Core.Tuple) can be the special value `Vararg`, which denotes any number of trailing elements. `Vararg{T,N}` corresponds to exactly `N` elements of type `T`. Finally `Vararg{T}` corresponds to zero or more elements of type `T`. `Vararg` tuple types are used to represent the arguments accepted by varargs methods (see the section on [Varargs Functions](/manual/functions#Varargs-Functions) in the manual.)

See also [`NTuple`](/base/base#Core.NTuple).

**Examples**

```julia
julia> mytupletype = Tuple{AbstractString, Vararg{Int}}
Tuple{AbstractString, Vararg{Int64}}

julia> isa(("1",), mytupletype)
true

julia> isa(("1",1), mytupletype)
true

julia> isa(("1",1,2), mytupletype)
true

julia> isa(("1",1,2,3.0), mytupletype)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3232-L3259)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Nothing' href='#Core.Nothing'>#</a>&nbsp;<b><u>Core.Nothing</u></b> &mdash; <i>Type</i>.




```julia
Nothing
```


A type with no fields that is the type of [`nothing`](/base/constants#Core.nothing).

See also: [`isnothing`](/base/base#Base.isnothing), [`Some`](/base/base#Base.Some), [`Missing`](/base/base#Base.Missing).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1524-L1530)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isnothing' href='#Base.isnothing'>#</a>&nbsp;<b><u>Base.isnothing</u></b> &mdash; <i>Function</i>.




```julia
isnothing(x)
```


Return `true` if `x === nothing`, and return `false` if not.

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::

See also [`something`](/base/base#Base.something), [`Base.notnothing`](/base/base#Base.notnothing), [`ismissing`](/base/base#Base.ismissing).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/some.jl#L59-L68)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.notnothing' href='#Base.notnothing'>#</a>&nbsp;<b><u>Base.notnothing</u></b> &mdash; <i>Function</i>.




```julia
notnothing(x)
```


Throw an error if `x === nothing`, and return `x` if not.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/some.jl#L51-L55)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Some' href='#Base.Some'>#</a>&nbsp;<b><u>Base.Some</u></b> &mdash; <i>Type</i>.




```julia
Some{T}
```


A wrapper type used in `Union{Some{T}, Nothing}` to distinguish between the absence of a value ([`nothing`](/base/constants#Core.nothing)) and the presence of a `nothing` value (i.e. `Some(nothing)`).

Use [`something`](/base/base#Base.something) to access the value wrapped by a `Some` object.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/some.jl#L3-L10)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.something' href='#Base.something'>#</a>&nbsp;<b><u>Base.something</u></b> &mdash; <i>Function</i>.




```julia
something(x...)
```


Return the first value in the arguments which is not equal to [`nothing`](/base/constants#Core.nothing), if any. Otherwise throw an error. Arguments of type [`Some`](/base/base#Base.Some) are unwrapped.

See also [`coalesce`](/base/base#Base.coalesce), [`skipmissing`](/base/base#Base.skipmissing), [`@something`](/base/base#Base.@something).

**Examples**

```julia
julia> something(nothing, 1)
1

julia> something(Some(1), nothing)
1

julia> something(Some(nothing), 2) === nothing
true

julia> something(missing, nothing)
missing

julia> something(nothing, nothing)
ERROR: ArgumentError: No value arguments present
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/some.jl#L72-L98)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@something' href='#Base.@something'>#</a>&nbsp;<b><u>Base.@something</u></b> &mdash; <i>Macro</i>.




```julia
@something(x...)
```


Short-circuiting version of [`something`](/base/base#Base.something).

**Examples**

```julia
julia> f(x) = (println("f($x)"); nothing);

julia> a = 1;

julia> a = @something a f(2) f(3) error("Unable to find default for `a`")
1

julia> b = nothing;

julia> b = @something b f(2) f(3) error("Unable to find default for `b`")
f(2)
f(3)
ERROR: Unable to find default for `b`
[...]

julia> b = @something b f(2) f(3) Some(nothing)
f(2)
f(3)

julia> b === nothing
true
```


::: tip Julia 1.7

This macro is available as of Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/some.jl#L107-L139)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Enums.Enum' href='#Base.Enums.Enum'>#</a>&nbsp;<b><u>Base.Enums.Enum</u></b> &mdash; <i>Type</i>.




```julia
Enum{T<:Integer}
```


The abstract supertype of all enumerated types defined with [`@enum`](/base/base#Base.Enums.@enum).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/Enums.jl#L10-L14)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Enums.@enum' href='#Base.Enums.@enum'>#</a>&nbsp;<b><u>Base.Enums.@enum</u></b> &mdash; <i>Macro</i>.




```julia
@enum EnumName[::BaseType] value1[=x] value2[=y]
```


Create an `Enum{BaseType}` subtype with name `EnumName` and enum member values of `value1` and `value2` with optional assigned values of `x` and `y`, respectively. `EnumName` can be used just like other types and enum member values as regular values, such as

**Examples**

```julia
julia> @enum Fruit apple=1 orange=2 kiwi=3

julia> f(x::Fruit) = "I'm a Fruit with value: $(Int(x))"
f (generic function with 1 method)

julia> f(apple)
"I'm a Fruit with value: 1"

julia> Fruit(1)
apple::Fruit = 1
```


Values can also be specified inside a `begin` block, e.g.

```julia
@enum EnumName begin
    value1
    value2
end
```


`BaseType`, which defaults to [`Int32`](/base/numbers#Core.Int32), must be a primitive subtype of `Integer`. Member values can be converted between the enum type and `BaseType`. `read` and `write` perform these conversions automatically. In case the enum is created with a non-default `BaseType`, `Integer(value1)` will return the integer `value1` with the type `BaseType`.

To list all the instances of an enum use `instances`, e.g.

```julia
julia> instances(Fruit)
(apple, orange, kiwi)
```


It is possible to construct a symbol from an enum instance:

```julia
julia> Symbol(apple)
:apple
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/Enums.jl#L95-L143)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Expr' href='#Core.Expr'>#</a>&nbsp;<b><u>Core.Expr</u></b> &mdash; <i>Type</i>.




```julia
Expr(head::Symbol, args...)
```


A type representing compound expressions in parsed julia code (ASTs). Each expression consists of a `head` `Symbol` identifying which kind of expression it is (e.g. a call, for loop, conditional statement, etc.), and subexpressions (e.g. the arguments of a call). The subexpressions are stored in a `Vector{Any}` field called `args`.

See the manual chapter on [Metaprogramming](/manual/metaprogramming#Metaprogramming) and the developer documentation [Julia ASTs](/devdocs/ast#Julia-ASTs).

**Examples**

```julia
julia> Expr(:call, :+, 1, 2)
:(1 + 2)

julia> dump(:(a ? b : c))
Expr
  head: Symbol if
  args: Array{Any}((3,))
    1: Symbol a
    2: Symbol b
    3: Symbol c
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L699-L724)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Symbol' href='#Core.Symbol'>#</a>&nbsp;<b><u>Core.Symbol</u></b> &mdash; <i>Type</i>.




```julia
Symbol
```


The type of object used to represent identifiers in parsed julia code (ASTs). Also often used as a name or label to identify an entity (e.g. as a dictionary key). `Symbol`s can be entered using the `:` quote operator:

```julia
julia> :name
:name

julia> typeof(:name)
Symbol

julia> x = 42
42

julia> eval(:x)
42
```


`Symbol`s can also be constructed from strings or other values by calling the constructor `Symbol(x...)`.

`Symbol`s are immutable and their implementation re-uses the same object for all `Symbol`s with the same name.

Unlike strings, `Symbol`s are &quot;atomic&quot; or &quot;scalar&quot; entities that do not support iteration over characters.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2246-L2273)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Symbol-Tuple' href='#Core.Symbol-Tuple'>#</a>&nbsp;<b><u>Core.Symbol</u></b> &mdash; <i>Method</i>.




```julia
Symbol(x...) -> Symbol
```


Create a [`Symbol`](/base/base#Core.Symbol) by concatenating the string representations of the arguments together.

**Examples**

```julia
julia> Symbol("my", "name")
:myname

julia> Symbol("day", 4)
:day4
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2276-L2289)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Module' href='#Core.Module'>#</a>&nbsp;<b><u>Core.Module</u></b> &mdash; <i>Type</i>.




```julia
Module
```


A `Module` is a separate global variable workspace. See [`module`](/base/base#module) and the [manual section about modules](/manual/modules#modules) for details.

```
Module(name::Symbol=:anonymous, std_imports=true, default_names=true)
```


Return a module with the specified name. A `baremodule` corresponds to `Module(:ModuleName, false)`

An empty module containing no names at all can be created with `Module(:ModuleName, false, false)`. This module will not import `Base` or `Core` and does not contain a reference to itself.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3512-L3523)

</div>
<br>

## Generic Functions {#Generic-Functions}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.Function' href='#Core.Function'>#</a>&nbsp;<b><u>Core.Function</u></b> &mdash; <i>Type</i>.




```julia
Function
```


Abstract type of all functions.

**Examples**

```julia
julia> isa(+, Function)
true

julia> typeof(sin)
typeof(sin) (singleton type of function sin, subtype of Function)

julia> ans <: Function
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1602-L1618)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.hasmethod' href='#Base.hasmethod'>#</a>&nbsp;<b><u>Base.hasmethod</u></b> &mdash; <i>Function</i>.




```julia
hasmethod(f, t::Type{<:Tuple}[, kwnames]; world=get_world_counter()) -> Bool
```


Determine whether the given generic function has a method matching the given `Tuple` of argument types with the upper bound of world age given by `world`.

If a tuple of keyword argument names `kwnames` is provided, this also checks whether the method of `f` matching `t` has the given keyword argument names. If the matching method accepts a variable number of keyword arguments, e.g. with `kwargs...`, any names given in `kwnames` are considered valid. Otherwise the provided names must be a subset of the method&#39;s keyword arguments.

See also [`applicable`](/base/base#Core.applicable).

::: tip Julia 1.2

Providing keyword argument names requires Julia 1.2 or later.

:::

**Examples**

```julia
julia> hasmethod(length, Tuple{Array})
true

julia> f(; oranges=0) = oranges;

julia> hasmethod(f, Tuple{}, (:oranges,))
true

julia> hasmethod(f, Tuple{}, (:apples, :bananas))
false

julia> g(; xs...) = 4;

julia> hasmethod(g, Tuple{}, (:a, :b, :c, :d))  # g accepts arbitrary kwargs
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2354-L2389)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.applicable' href='#Core.applicable'>#</a>&nbsp;<b><u>Core.applicable</u></b> &mdash; <i>Function</i>.




```julia
applicable(f, args...) -> Bool
```


Determine whether the given generic function has a method applicable to the given arguments.

See also [`hasmethod`](/base/base#Base.hasmethod).

**Examples**

```julia
julia> function f(x, y)
           x + y
       end;

julia> applicable(f, 1)
false

julia> applicable(f, 1, 2)
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1913-L1932)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isambiguous' href='#Base.isambiguous'>#</a>&nbsp;<b><u>Base.isambiguous</u></b> &mdash; <i>Function</i>.




```julia
Base.isambiguous(m1, m2; ambiguous_bottom=false) -> Bool
```


Determine whether two methods `m1` and `m2` may be ambiguous for some call signature. This test is performed in the context of other methods of the same function; in isolation, `m1` and `m2` might be ambiguous, but if a third method resolving the ambiguity has been defined, this returns `false`. Alternatively, in isolation `m1` and `m2` might be ordered, but if a third method cannot be sorted with them, they may cause an ambiguity together.

For parametric types, the `ambiguous_bottom` keyword argument controls whether `Union{}` counts as an ambiguous intersection of type parameters – when `true`, it is considered ambiguous, when `false` it is not.

**Examples**

```julia
julia> foo(x::Complex{<:Integer}) = 1
foo (generic function with 1 method)

julia> foo(x::Complex{<:Rational}) = 2
foo (generic function with 2 methods)

julia> m1, m2 = collect(methods(foo));

julia> typeintersect(m1.sig, m2.sig)
Tuple{typeof(foo), Complex{Union{}}}

julia> Base.isambiguous(m1, m2, ambiguous_bottom=true)
true

julia> Base.isambiguous(m1, m2, ambiguous_bottom=false)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2465-L2498)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.invoke' href='#Core.invoke'>#</a>&nbsp;<b><u>Core.invoke</u></b> &mdash; <i>Function</i>.




```julia
invoke(f, argtypes::Type, args...; kwargs...)
```


Invoke a method for the given generic function `f` matching the specified types `argtypes` on the specified arguments `args` and passing the keyword arguments `kwargs`. The arguments `args` must conform with the specified types in `argtypes`, i.e. conversion is not automatically performed. This method allows invoking a method other than the most specific matching method, which is useful when the behavior of a more general definition is explicitly needed (often as part of the implementation of a more specific method of the same function).

Be careful when using `invoke` for functions that you don&#39;t write.  What definition is used for given `argtypes` is an implementation detail unless the function is explicitly states that calling with certain `argtypes` is a part of public API.  For example, the change between `f1` and `f2` in the example below is usually considered compatible because the change is invisible by the caller with a normal (non-`invoke`) call.  However, the change is visible if you use `invoke`.

**Examples**

```julia
julia> f(x::Real) = x^2;

julia> f(x::Integer) = 1 + invoke(f, Tuple{Real}, x);

julia> f(2)
5

julia> f1(::Integer) = Integer
       f1(::Real) = Real;

julia> f2(x::Real) = _f2(x)
       _f2(::Integer) = Integer
       _f2(_) = Real;

julia> f1(1)
Integer

julia> f2(1)
Integer

julia> invoke(f1, Tuple{Real}, 1)
Real

julia> invoke(f2, Tuple{Real}, 1)
Integer
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1935-L1980)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@invoke' href='#Base.@invoke'>#</a>&nbsp;<b><u>Base.@invoke</u></b> &mdash; <i>Macro</i>.




```julia
@invoke f(arg::T, ...; kwargs...)
```


Provides a convenient way to call [`invoke`](/base/base#Core.invoke) by expanding `@invoke f(arg1::T1, arg2::T2; kwargs...)` to `invoke(f, Tuple{T1,T2}, arg1, arg2; kwargs...)`. When an argument&#39;s type annotation is omitted, it&#39;s replaced with `Core.Typeof` that argument. To invoke a method where an argument is untyped or explicitly typed as `Any`, annotate the argument with `::Any`.

It also supports the following syntax:
- `@invoke (x::X).f` expands to `invoke(getproperty, Tuple{X,Symbol}, x, :f)`
  
- `@invoke (x::X).f = v::V` expands to `invoke(setproperty!, Tuple{X,Symbol,V}, x, :f, v)`
  
- `@invoke (xs::Xs)[i::I]` expands to `invoke(getindex, Tuple{Xs,I}, xs, i)`
  
- `@invoke (xs::Xs)[i::I] = v::V` expands to `invoke(setindex!, Tuple{Xs,V,I}, xs, v, i)`
  

**Examples**

```julia
julia> @macroexpand @invoke f(x::T, y)
:(Core.invoke(f, Tuple{T, Core.Typeof(y)}, x, y))

julia> @invoke 420::Integer % Unsigned
0x00000000000001a4

julia> @macroexpand @invoke (x::X).f
:(Core.invoke(Base.getproperty, Tuple{X, Core.Typeof(:f)}, x, :f))

julia> @macroexpand @invoke (x::X).f = v::V
:(Core.invoke(Base.setproperty!, Tuple{X, Core.Typeof(:f), V}, x, :f, v))

julia> @macroexpand @invoke (xs::Xs)[i::I]
:(Core.invoke(Base.getindex, Tuple{Xs, I}, xs, i))

julia> @macroexpand @invoke (xs::Xs)[i::I] = v::V
:(Core.invoke(Base.setindex!, Tuple{Xs, V, I}, xs, v, i))
```


::: tip Julia 1.7

This macro requires Julia 1.7 or later.

:::

::: tip Julia 1.9

This macro is exported as of Julia 1.9.

:::

::: tip Julia 1.10

The additional syntax is supported as of Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2670-L2715)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.invokelatest' href='#Base.invokelatest'>#</a>&nbsp;<b><u>Base.invokelatest</u></b> &mdash; <i>Function</i>.




```julia
invokelatest(f, args...; kwargs...)
```


Calls `f(args...; kwargs...)`, but guarantees that the most recent method of `f` will be executed.   This is useful in specialized circumstances, e.g. long-running event loops or callback functions that may call obsolete versions of a function `f`. (The drawback is that `invokelatest` is somewhat slower than calling `f` directly, and the type of the result cannot be inferred by the compiler.)

::: tip Julia 1.9

Prior to Julia 1.9, this function was not exported, and was called as `Base.invokelatest`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L1017-L1029)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@invokelatest' href='#Base.@invokelatest'>#</a>&nbsp;<b><u>Base.@invokelatest</u></b> &mdash; <i>Macro</i>.




```julia
@invokelatest f(args...; kwargs...)
```


Provides a convenient way to call [`invokelatest`](/base/base#Base.invokelatest). `@invokelatest f(args...; kwargs...)` will simply be expanded into `Base.invokelatest(f, args...; kwargs...)`.

It also supports the following syntax:
- `@invokelatest x.f` expands to `Base.invokelatest(getproperty, x, :f)`
  
- `@invokelatest x.f = v` expands to `Base.invokelatest(setproperty!, x, :f, v)`
  
- `@invokelatest xs[i]` expands to `Base.invokelatest(getindex, xs, i)`
  
- `@invokelatest xs[i] = v` expands to `Base.invokelatest(setindex!, xs, v, i)`
  

```julia
julia> @macroexpand @invokelatest f(x; kw=kwv)
:(Base.invokelatest(f, x; kw = kwv))

julia> @macroexpand @invokelatest x.f
:(Base.invokelatest(Base.getproperty, x, :f))

julia> @macroexpand @invokelatest x.f = v
:(Base.invokelatest(Base.setproperty!, x, :f, v))

julia> @macroexpand @invokelatest xs[i]
:(Base.invokelatest(Base.getindex, xs, i))

julia> @macroexpand @invokelatest xs[i] = v
:(Base.invokelatest(Base.setindex!, xs, v, i))
```


::: tip Julia 1.7

This macro requires Julia 1.7 or later.

:::

::: tip Julia 1.9

Prior to Julia 1.9, this macro was not exported, and was called as `Base.@invokelatest`.

:::

::: tip Julia 1.10

The additional `x.f` and `xs[i]` syntax requires Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2736-L2774)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='new' href='#new'>#</a>&nbsp;<b><u>new</u></b> &mdash; <i>Keyword</i>.




```julia
new, or new{A,B,...}
```


Special function available to inner constructors which creates a new object of the type. The form new{A,B,...} explicitly specifies values of parameters for parametric types. See the manual section on [Inner Constructor Methods](/manual/constructors#man-inner-constructor-methods) for more information.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1441-L1448)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:|>' href='#Base.:|>'>#</a>&nbsp;<b><u>Base.:|></u></b> &mdash; <i>Function</i>.




```julia
|>(x, f)
```


Infix operator which applies function `f` to the argument `x`. This allows `f(g(x))` to be written `x |> g |> f`. When used with anonymous functions, parentheses are typically required around the definition to get the intended chain.

**Examples**

```julia
julia> 4 |> inv
0.25

julia> [2, 3, 5] |> sum |> inv
0.1

julia> [0 1; 2 3] .|> (x -> x^2) |> sum
14
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L947-L966)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.:∘' href='#Base.:∘'>#</a>&nbsp;<b><u>Base.:∘</u></b> &mdash; <i>Function</i>.




```julia
f ∘ g
```


Compose functions: i.e. `(f ∘ g)(args...; kwargs...)` means `f(g(args...; kwargs...))`. The `∘` symbol can be entered in the Julia REPL (and most editors, appropriately configured) by typing `\circ<tab>`.

Function composition also works in prefix form: `∘(f, g)` is the same as `f ∘ g`. The prefix form supports composition of multiple functions: `∘(f, g, h) = f ∘ g ∘ h` and splatting `∘(fs...)` for composing an iterable collection of functions. The last argument to `∘` execute first.

::: tip Julia 1.4

Multiple function composition requires at least Julia 1.4.

:::

::: tip Julia 1.5

Composition of one function ∘(f) requires at least Julia 1.5.

:::

::: tip Julia 1.7

Using keyword arguments requires at least Julia 1.7.

:::

**Examples**

```julia
julia> map(uppercase∘first, ["apple", "banana", "carrot"])
3-element Vector{Char}:
 'A': ASCII/Unicode U+0041 (category Lu: Letter, uppercase)
 'B': ASCII/Unicode U+0042 (category Lu: Letter, uppercase)
 'C': ASCII/Unicode U+0043 (category Lu: Letter, uppercase)

julia> (==(6)∘length).(["apple", "banana", "carrot"])
3-element BitVector:
 0
 1
 1

julia> fs = [
           x -> 2x
           x -> x-1
           x -> x/2
           x -> x+1
       ];

julia> ∘(fs...)(3)
2.0
```


See also [`ComposedFunction`](/base/base#Base.ComposedFunction), [`!f::Function`](/base/math#Base.:!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L1005-L1050)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ComposedFunction' href='#Base.ComposedFunction'>#</a>&nbsp;<b><u>Base.ComposedFunction</u></b> &mdash; <i>Type</i>.




```julia
ComposedFunction{Outer,Inner} <: Function
```


Represents the composition of two callable objects `outer::Outer` and `inner::Inner`. That is

```julia
ComposedFunction(outer, inner)(args...; kw...) === outer(inner(args...; kw...))
```


The preferred way to construct an instance of `ComposedFunction` is to use the composition operator [`∘`](/base/base#Base.:∘):

```julia
julia> sin ∘ cos === ComposedFunction(sin, cos)
true

julia> typeof(sin∘cos)
ComposedFunction{typeof(sin), typeof(cos)}
```


The composed pieces are stored in the fields of `ComposedFunction` and can be retrieved as follows:

```julia
julia> composition = sin ∘ cos
sin ∘ cos

julia> composition.outer === sin
true

julia> composition.inner === cos
true
```


::: tip Julia 1.6

ComposedFunction requires at least Julia 1.6. In earlier versions `∘` returns an anonymous function instead.

:::

See also [`∘`](/base/base#Base.:∘).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L1053-L1083)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.splat' href='#Base.splat'>#</a>&nbsp;<b><u>Base.splat</u></b> &mdash; <i>Function</i>.




```julia
splat(f)
```


Equivalent to

```julia
    my_splat(f) = args->f(args...)
```


i.e. given a function returns a new function that takes one argument and splats it into the original function. This is useful as an adaptor to pass a multi-argument function in a context that expects a single argument, but passes a tuple as that single argument.

**Examples**

```julia
julia> map(splat(+), zip(1:3,4:6))
3-element Vector{Int64}:
 5
 7
 9

julia> my_add = splat(+)
splat(+)

julia> my_add((1,2,3))
6
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L1274-L1300)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Fix1' href='#Base.Fix1'>#</a>&nbsp;<b><u>Base.Fix1</u></b> &mdash; <i>Type</i>.




```julia
Fix1(f, x)
```


A type representing a partially-applied version of the two-argument function `f`, with the first argument fixed to the value &quot;x&quot;. In other words, `Fix1(f, x)` behaves similarly to `y->f(x, y)`.

See also [`Fix2`](/base/base#Base.Fix2).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L1151-L1159)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Fix2' href='#Base.Fix2'>#</a>&nbsp;<b><u>Base.Fix2</u></b> &mdash; <i>Type</i>.




```julia
Fix2(f, x)
```


A type representing a partially-applied version of the two-argument function `f`, with the second argument fixed to the value &quot;x&quot;. In other words, `Fix2(f, x)` behaves similarly to `y->f(y, x)`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/operators.jl#L1170-L1176)

</div>
<br>

## Syntax
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.eval' href='#Core.eval'>#</a>&nbsp;<b><u>Core.eval</u></b> &mdash; <i>Function</i>.




```julia
Core.eval(m::Module, expr)
```


Evaluate an expression in the given module and return the result.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L190-L194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='eval' href='#eval'>#</a>&nbsp;<b><u>eval</u></b> &mdash; <i>Function</i>.




```julia
eval(expr)
```


Evaluate an expression in the global scope of the containing module. Every `Module` (except those defined with `baremodule`) has its own 1-argument definition of `eval`, which evaluates expressions in that module.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysimg.jl#L41-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@eval' href='#Base.@eval'>#</a>&nbsp;<b><u>Base.@eval</u></b> &mdash; <i>Macro</i>.




```julia
@eval [mod,] ex
```


Evaluate an expression with values interpolated into it using `eval`. If two arguments are provided, the first is the module to evaluate in.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L441-L446)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.evalfile' href='#Base.evalfile'>#</a>&nbsp;<b><u>Base.evalfile</u></b> &mdash; <i>Function</i>.




```julia
evalfile(path::AbstractString, args::Vector{String}=String[])
```


Load the file into an anonymous module using [`include`](/base/base#Base.include), evaluate all expressions, and return the value of the last expression. The optional `args` argument can be used to set the input arguments of the script (i.e. the global `ARGS` variable). Note that definitions (e.g. methods, globals) are evaluated in the anonymous module and do not affect the current module.

**Examples**

```julia
julia> write("testfile.jl", """
           @show ARGS
           1 + 1
       """);

julia> x = evalfile("testfile.jl", ["ARG1", "ARG2"]);
ARGS = ["ARG1", "ARG2"]

julia> x
2

julia> rm("testfile.jl")
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L2661-L2685)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.esc' href='#Base.esc'>#</a>&nbsp;<b><u>Base.esc</u></b> &mdash; <i>Function</i>.




```julia
esc(e)
```


Only valid in the context of an [`Expr`](/base/base#Core.Expr) returned from a macro. Prevents the macro hygiene pass from turning embedded variables into gensym variables. See the [Macros](/manual/metaprogramming#man-macros) section of the Metaprogramming chapter of the manual for more details and examples.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L776-L782)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@inbounds' href='#Base.@inbounds'>#</a>&nbsp;<b><u>Base.@inbounds</u></b> &mdash; <i>Macro</i>.




```julia
@inbounds(blk)
```


Eliminates array bounds checking within expressions.

In the example below the in-range check for referencing element `i` of array `A` is skipped to improve performance.

```julia
function sum(A::AbstractArray)
    r = zero(eltype(A))
    for i in eachindex(A)
        @inbounds r += A[i]
    end
    return r
end
```


::: warning Warning

Using `@inbounds` may return incorrect results/crashes/corruption for out-of-bounds indices. The user is responsible for checking it manually. Only use `@inbounds` when it is certain from the information locally available that all accesses are in bounds. In particular, using `1:length(A)` instead of `eachindex(A)` in a function like the one above is _not_ safely inbounds because the first index of `A` may not be `1` for all user defined types that subtype `AbstractArray`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L833-L860)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@boundscheck' href='#Base.@boundscheck'>#</a>&nbsp;<b><u>Base.@boundscheck</u></b> &mdash; <i>Macro</i>.




```julia
@boundscheck(blk)
```


Annotates the expression `blk` as a bounds checking block, allowing it to be elided by [`@inbounds`](/base/base#Base.@inbounds).

::: tip Note

The function in which `@boundscheck` is written must be inlined into its caller in order for `@inbounds` to have effect.

:::

**Examples**

```julia
julia> @inline function g(A, i)
           @boundscheck checkbounds(A, i)
           return "accessing ($A)[$i]"
       end;

julia> f1() = return g(1:2, -1);

julia> f2() = @inbounds return g(1:2, -1);

julia> f1()
ERROR: BoundsError: attempt to access 2-element UnitRange{Int64} at index [-1]
Stacktrace:
 [1] throw_boundserror(::UnitRange{Int64}, ::Tuple{Int64}) at ./abstractarray.jl:455
 [2] checkbounds at ./abstractarray.jl:420 [inlined]
 [3] g at ./none:2 [inlined]
 [4] f1() at ./none:1
 [5] top-level scope

julia> f2()
"accessing (1:2)[-1]"
```


::: warning Warning

The `@boundscheck` annotation allows you, as a library writer, to opt-in to allowing _other code_ to remove your bounds checks with [`@inbounds`](/base/base#Base.@inbounds). As noted there, the caller must verify—using information they can access—that their accesses are valid before using `@inbounds`. For indexing into your [`AbstractArray`](/base/arrays#Core.AbstractArray) subclasses, for example, this involves checking the indices against its [`axes`](/base/arrays#Base.axes-Tuple{Any}). Therefore, `@boundscheck` annotations should only be added to a [`getindex`](/base/collections#Base.getindex) or [`setindex!`](/base/collections#Base.setindex!) implementation after you are certain its behavior is correct.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L785-L828)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@propagate_inbounds' href='#Base.@propagate_inbounds'>#</a>&nbsp;<b><u>Base.@propagate_inbounds</u></b> &mdash; <i>Macro</i>.




```julia
@propagate_inbounds
```


Tells the compiler to inline a function while retaining the caller&#39;s inbounds context.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L857-L861)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@inline' href='#Base.@inline'>#</a>&nbsp;<b><u>Base.@inline</u></b> &mdash; <i>Macro</i>.




```julia
@inline
```


Give a hint to the compiler that this function is worth inlining.

Small functions typically do not need the `@inline` annotation, as the compiler does it automatically. By using `@inline` on bigger functions, an extra nudge can be given to the compiler to inline it.

`@inline` can be applied immediately before a function definition or within a function body.

```julia
# annotate long-form definition
@inline function longdef(x)
    ...
end

# annotate short-form definition
@inline shortdef(x) = ...

# annotate anonymous function that a `do` block creates
f() do
    @inline
    ...
end
```


::: tip Julia 1.8

The usage within a function body requires at least Julia 1.8.

:::


---


```
@inline block
```


Give a hint to the compiler that calls within `block` are worth inlining.

```julia
# The compiler will try to inline `f`
@inline f(...)

# The compiler will try to inline `f`, `g` and `+`
@inline f(...) + g(...)
```


::: tip Note

A callsite annotation always has the precedence over the annotation applied to the definition of the called function:

```julia
@noinline function explicit_noinline(args...)
    # body
end

let
    @inline explicit_noinline(args...) # will be inlined
end
```


:::

::: tip Note

When there are nested callsite annotations, the innermost annotation has the precedence:

```julia
@noinline let a0, b0 = ...
    a = @inline f(a0)  # the compiler will try to inline this call
    b = f(b0)          # the compiler will NOT try to inline this call
    return a, b
end
```


:::

::: warning Warning

Although a callsite annotation will try to force inlining in regardless of the cost model, there are still chances it can&#39;t succeed in it. Especially, recursive calls can not be inlined even if they are annotated as `@inline`d.

:::

::: tip Julia 1.8

The callsite annotation requires at least Julia 1.8.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L197-L270)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@noinline' href='#Base.@noinline'>#</a>&nbsp;<b><u>Base.@noinline</u></b> &mdash; <i>Macro</i>.




```julia
@noinline
```


Give a hint to the compiler that it should not inline a function.

Small functions are typically inlined automatically. By using `@noinline` on small functions, auto-inlining can be prevented.

`@noinline` can be applied immediately before a function definition or within a function body.

```julia
# annotate long-form definition
@noinline function longdef(x)
    ...
end

# annotate short-form definition
@noinline shortdef(x) = ...

# annotate anonymous function that a `do` block creates
f() do
    @noinline
    ...
end
```


::: tip Julia 1.8

The usage within a function body requires at least Julia 1.8.

:::


---


```
@noinline block
```


Give a hint to the compiler that it should not inline the calls within `block`.

```julia
# The compiler will try to not inline `f`
@noinline f(...)

# The compiler will try to not inline `f`, `g` and `+`
@noinline f(...) + g(...)
```


::: tip Note

A callsite annotation always has the precedence over the annotation applied to the definition of the called function:

```julia
@inline function explicit_inline(args...)
    # body
end

let
    @noinline explicit_inline(args...) # will not be inlined
end
```


:::

::: tip Note

When there are nested callsite annotations, the innermost annotation has the precedence:

```julia
@inline let a0, b0 = ...
    a = @noinline f(a0)  # the compiler will NOT try to inline this call
    b = f(b0)            # the compiler will try to inline this call
    return a, b
end
```


:::

::: tip Julia 1.8

The callsite annotation requires at least Julia 1.8.

:::


---


::: tip Note

If the function is trivial (for example returning a constant) it might get inlined anyway.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L275-L347)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@nospecialize' href='#Base.@nospecialize'>#</a>&nbsp;<b><u>Base.@nospecialize</u></b> &mdash; <i>Macro</i>.




```julia
@nospecialize
```


Applied to a function argument name, hints to the compiler that the method implementation should not be specialized for different types of that argument, but instead use the declared type for that argument. It can be applied to an argument within a formal argument list, or in the function body. When applied to an argument, the macro must wrap the entire argument expression, e.g., `@nospecialize(x::Real)` or `@nospecialize(i::Integer...)` rather than wrapping just the argument name. When used in a function body, the macro must occur in statement position and before any code.

When used without arguments, it applies to all arguments of the parent scope. In local scope, this means all arguments of the containing function. In global (top-level) scope, this means all methods subsequently defined in the current module.

Specialization can reset back to the default by using [`@specialize`](/base/base#Base.@specialize).

```julia
function example_function(@nospecialize x)
    ...
end

function example_function(x, @nospecialize(y = 1))
    ...
end

function example_function(x, y, z)
    @nospecialize x y
    ...
end

@nospecialize
f(y) = [x for x in y]
@specialize
```


::: tip Note

`@nospecialize` affects code generation but not inference: it limits the diversity of the resulting native code, but it does not impose any limitations (beyond the standard ones) on type-inference. Use [`Base.@nospecializeinfer`](/base/base#Base.@nospecializeinfer) together with `@nospecialize` to additionally suppress inference.

:::

**Examples**

```julia
julia> f(A::AbstractArray) = g(A)
f (generic function with 1 method)

julia> @noinline g(@nospecialize(A::AbstractArray)) = A[1]
g (generic function with 1 method)

julia> @code_typed f([1.0])
CodeInfo(
1 ─ %1 = invoke Main.g(_2::AbstractArray)::Float64
└──      return %1
) => Float64
```


Here, the `@nospecialize` annotation results in the equivalent of

```julia
f(A::AbstractArray) = invoke(g, Tuple{AbstractArray}, A)
```


ensuring that only one version of native code will be generated for `g`, one that is generic for any `AbstractArray`. However, the specific return type is still inferred for both `g` and `f`, and this is still used in optimizing the callers of `f` and `g`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L49-L119)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@specialize' href='#Base.@specialize'>#</a>&nbsp;<b><u>Base.@specialize</u></b> &mdash; <i>Macro</i>.




```julia
@specialize
```


Reset the specialization hint for an argument back to the default. For details, see [`@nospecialize`](/base/base#Base.@nospecialize).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L131-L136)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@nospecializeinfer' href='#Base.@nospecializeinfer'>#</a>&nbsp;<b><u>Base.@nospecializeinfer</u></b> &mdash; <i>Macro</i>.




```julia
Base.@nospecializeinfer function f(args...)
    @nospecialize ...
    ...
end
Base.@nospecializeinfer f(@nospecialize args...) = ...
```


Tells the compiler to infer `f` using the declared types of `@nospecialize`d arguments. This can be used to limit the number of compiler-generated specializations during inference.

**Examples**

```julia
julia> f(A::AbstractArray) = g(A)
f (generic function with 1 method)

julia> @noinline Base.@nospecializeinfer g(@nospecialize(A::AbstractArray)) = A[1]
g (generic function with 1 method)

julia> @code_typed f([1.0])
CodeInfo(
1 ─ %1 = invoke Main.g(_2::AbstractArray)::Any
└──      return %1
) => Any
```


In this example, `f` will be inferred for each specific type of `A`, but `g` will only be inferred once with the declared argument type `A::AbstractArray`, meaning that the compiler will not likely see the excessive inference time on it while it can not infer the concrete return type of it. Without the `@nospecializeinfer`, `f([1.0])` would infer the return type of `g` as `Float64`, indicating that inference ran for `g(::Vector{Float64})` despite the prohibition on specialized code generation.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L819-L852)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@constprop' href='#Base.@constprop'>#</a>&nbsp;<b><u>Base.@constprop</u></b> &mdash; <i>Macro</i>.




```julia
Base.@constprop setting [ex]
```


Control the mode of interprocedural constant propagation for the annotated function.

Two `setting`s are supported:
- `Base.@constprop :aggressive [ex]`: apply constant propagation aggressively. For a method where the return type depends on the value of the arguments, this can yield improved inference results at the cost of additional compile time.
  
- `Base.@constprop :none [ex]`: disable constant propagation. This can reduce compile times for functions that Julia might otherwise deem worthy of constant-propagation. Common cases are for functions with `Bool`- or `Symbol`-valued arguments or keyword arguments.
  

`Base.@constprop` can be applied immediately before a function definition or within a function body.

```julia
# annotate long-form definition
Base.@constprop :aggressive function longdef(x)
    ...
end

# annotate short-form definition
Base.@constprop :aggressive shortdef(x) = ...

# annotate anonymous function that a `do` block creates
f() do
    Base.@constprop :aggressive
    ...
end
```


::: tip Julia 1.10

The usage within a function body requires at least Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L352-L386)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.gensym' href='#Base.gensym'>#</a>&nbsp;<b><u>Base.gensym</u></b> &mdash; <i>Function</i>.




```julia
gensym([tag])
```


Generates a symbol which will not conflict with other variable names (in the same module).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L9-L13)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@gensym' href='#Base.@gensym'>#</a>&nbsp;<b><u>Base.@gensym</u></b> &mdash; <i>Macro</i>.




```julia
@gensym
```


Generates a gensym symbol for a variable. For example, `@gensym x y` is transformed into `x = gensym("x"); y = gensym("y")`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L21-L26)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='var"name"' href='#var"name"'>#</a>&nbsp;<b><u>var"name"</u></b> &mdash; <i>Keyword</i>.




```julia
var
```


The syntax `var"#example#"` refers to a variable named `Symbol("#example#")`, even though `#example#` is not a valid Julia identifier name.

This can be useful for interoperability with programming languages which have different rules for the construction of valid identifiers. For example, to refer to the `R` variable `draw.segments`, you can use `var"draw.segments"` in your Julia code.

It is also used to `show` julia source code which has gone through macro hygiene or otherwise contains variable names which can&#39;t be parsed normally.

Note that this syntax requires parser support so it is expanded directly by the parser rather than being implemented as a normal string macro `@var_str`.

::: tip Julia 1.3

This syntax requires at least Julia 1.3.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1487-L1507)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@goto' href='#Base.@goto'>#</a>&nbsp;<b><u>Base.@goto</u></b> &mdash; <i>Macro</i>.




```julia
@goto name
```


`@goto name` unconditionally jumps to the statement at the location [`@label name`](/base/base#Base.@label).

`@label` and `@goto` cannot create jumps to different top-level statements. Attempts cause an error. To still use `@goto`, enclose the `@label` and `@goto` in a block.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L879-L886)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@label' href='#Base.@label'>#</a>&nbsp;<b><u>Base.@label</u></b> &mdash; <i>Macro</i>.




```julia
@label name
```


Labels a statement with the symbolic label `name`. The label marks the end-point of an unconditional jump with [`@goto name`](/base/base#Base.@goto).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L869-L874)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.SimdLoop.@simd' href='#Base.SimdLoop.@simd'>#</a>&nbsp;<b><u>Base.SimdLoop.@simd</u></b> &mdash; <i>Macro</i>.




```julia
@simd
```


Annotate a `for` loop to allow the compiler to take extra liberties to allow loop re-ordering

::: warning Warning

This feature is experimental and could change or disappear in future versions of Julia. Incorrect use of the `@simd` macro may cause unexpected results.

:::

The object iterated over in a `@simd for` loop should be a one-dimensional range. By using `@simd`, you are asserting several properties of the loop:
- It is safe to execute iterations in arbitrary or overlapping order, with special consideration for reduction variables.
  
- Floating-point operations on reduction variables can be reordered or contracted, possibly causing different results than without `@simd`.
  

In many cases, Julia is able to automatically vectorize inner for loops without the use of `@simd`. Using `@simd` gives the compiler a little extra leeway to make it possible in more situations. In either case, your inner loop should have the following properties to allow vectorization:
- The loop must be an innermost loop
  
- The loop body must be straight-line code. Therefore, [`@inbounds`](/base/base#Base.@inbounds) is   currently needed for all array accesses. The compiler can sometimes turn   short `&&`, `||`, and `?:` expressions into straight-line code if it is safe   to evaluate all operands unconditionally. Consider using the [`ifelse`](/base/base#Base.ifelse)   function instead of `?:` in the loop if it is safe to do so.
  
- Accesses must have a stride pattern and cannot be &quot;gathers&quot; (random-index   reads) or &quot;scatters&quot; (random-index writes).
  
- The stride should be unit stride.
  

::: tip Note

The `@simd` does not assert by default that the loop is completely free of loop-carried memory dependencies, which is an assumption that can easily be violated in generic code. If you are writing non-generic code, you can use `@simd ivdep for ... end` to also assert that:

:::
- There exists no loop-carried memory dependencies
  
- No iteration ever waits on a previous iteration to make forward progress.
  


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/simdloop.jl#L90-L126)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@polly' href='#Base.@polly'>#</a>&nbsp;<b><u>Base.@polly</u></b> &mdash; <i>Macro</i>.




```julia
@polly
```


Tells the compiler to apply the polyhedral optimizer Polly to a function.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L870-L874)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@generated' href='#Base.@generated'>#</a>&nbsp;<b><u>Base.@generated</u></b> &mdash; <i>Macro</i>.




```julia
@generated f
```


`@generated` is used to annotate a function which will be generated. In the body of the generated function, only types of arguments can be read (not the values). The function returns a quoted expression evaluated when the function is called. The `@generated` macro should not be used on functions mutating the global scope or depending on mutable elements.

See [Metaprogramming](/manual/metaprogramming#Metaprogramming) for further details.

**Examples**

```julia
julia> @generated function bar(x)
           if x <: Integer
               return :(x ^ 2)
           else
               return :(x)
           end
       end
bar (generic function with 1 method)

julia> bar(4)
16

julia> bar("baz")
"baz"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L1044-L1072)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@assume_effects' href='#Base.@assume_effects'>#</a>&nbsp;<b><u>Base.@assume_effects</u></b> &mdash; <i>Macro</i>.




```julia
Base.@assume_effects setting... [ex]
```


Override the compiler&#39;s effect modeling. This macro can be used in several contexts:
1. Immediately before a method definition, to override the entire effect modeling of the applied method.
  
2. Within a function body without any arguments, to override the entire effect modeling of the enclosing method.
  
3. Applied to a code block, to override the local effect modeling of the applied code block.
  

**Examples**

```julia
julia> Base.@assume_effects :terminates_locally function fact(x)
           # usage 1:
           # this :terminates_locally allows `fact` to be constant-folded
           res = 1
           0 ≤ x < 20 || error("bad fact")
           while x > 1
               res *= x
               x -= 1
           end
           return res
       end
fact (generic function with 1 method)

julia> code_typed() do
           fact(12)
       end |> only
CodeInfo(
1 ─     return 479001600
) => Int64

julia> code_typed() do
           map((2,3,4)) do x
               # usage 2:
               # this :terminates_locally allows this anonymous function to be constant-folded
               Base.@assume_effects :terminates_locally
               res = 1
               0 ≤ x < 20 || error("bad fact")
               while x > 1
                   res *= x
                   x -= 1
               end
               return res
           end
       end |> only
CodeInfo(
1 ─     return (2, 6, 24)
) => Tuple{Int64, Int64, Int64}

julia> code_typed() do
           map((2,3,4)) do x
               res = 1
               0 ≤ x < 20 || error("bad fact")
               # usage 3:
               # with this :terminates_locally annotation the compiler skips tainting
               # `:terminates` effect within this `while` block, allowing the parent
               # anonymous function to be constant-folded
               Base.@assume_effects :terminates_locally while x > 1
                   res *= x
                   x -= 1
               end
               return res
           end
       end |> only
CodeInfo(
1 ─     return (2, 6, 24)
) => Tuple{Int64, Int64, Int64}
```


::: tip Julia 1.8

Using `Base.@assume_effects` requires Julia version 1.8.

:::

::: tip Julia 1.10

The usage within a function body requires at least Julia 1.10.

:::

::: tip Julia 1.11

The code block annotation requires at least Julia 1.11.

:::

::: warning Warning

Improper use of this macro causes undefined behavior (including crashes, incorrect answers, or other hard to track bugs). Use with care and only as a last resort if absolutely required. Even in such a case, you SHOULD take all possible steps to minimize the strength of the effect assertion (e.g., do not use `:total` if `:nothrow` would have been sufficient).

:::

In general, each `setting` value makes an assertion about the behavior of the function, without requiring the compiler to prove that this behavior is indeed true. These assertions are made for all world ages. It is thus advisable to limit the use of generic functions that may later be extended to invalidate the assumption (which would cause undefined behavior).

The following `setting`s are supported.
- `:consistent`
  
- `:effect_free`
  
- `:nothrow`
  
- `:terminates_globally`
  
- `:terminates_locally`
  
- `:notaskstate`
  
- `:inaccessiblememonly`
  
- `:noub`
  
- `:noub_if_noinbounds`
  
- `:foldable`
  
- `:removable`
  
- `:total`
  

**Extended help**


---


**`:consistent`**

The `:consistent` setting asserts that for egal (`===`) inputs:
- The manner of termination (return value, exception, non-termination) will always be the same.
  
- If the method returns, the results will always be egal.
  

::: tip Note

This in particular implies that the method must not return a freshly allocated mutable object. Multiple allocations of mutable objects (even with identical contents) are not egal.

:::

::: tip Note

The `:consistent`-cy assertion is made world-age wise. More formally, write $fᵢ$ for the evaluation of $f$ in world-age $i$, then we require:

$$∀ i, x, y: x ≡ y → fᵢ(x) ≡ fᵢ(y)$$

However, for two world ages $i$, $j$ s.t. $i ≠ j$, we may have $fᵢ(x) ≢ fⱼ(y)$.

A further implication is that `:consistent` functions may not make their return value dependent on the state of the heap or any other global state that is not constant for a given world age.

:::

::: tip Note

The `:consistent`-cy includes all legal rewrites performed by the optimizer. For example, floating-point fastmath operations are not considered `:consistent`, because the optimizer may rewrite them causing the output to not be `:consistent`, even for the same world age (e.g. because one ran in the interpreter, while the other was optimized).

:::

::: tip Note

If `:consistent` functions terminate by throwing an exception, that exception itself is not required to meet the egality requirement specified above.

:::


---


**`:effect_free`**

The `:effect_free` setting asserts that the method is free of externally semantically visible side effects. The following is an incomplete list of externally semantically visible side effects:
- Changing the value of a global variable.
  
- Mutating the heap (e.g. an array or mutable value), except as noted below
  
- Changing the method table (e.g. through calls to eval)
  
- File/Network/etc. I/O
  
- Task switching
  

However, the following are explicitly not semantically visible, even if they may be observable:
- Memory allocations (both mutable and immutable)
  
- Elapsed time
  
- Garbage collection
  
- Heap mutations of objects whose lifetime does not exceed the method (i.e. were allocated in the method and do not escape).
  
- The returned value (which is externally visible, but not a side effect)
  

The rule of thumb here is that an externally visible side effect is anything that would affect the execution of the remainder of the program if the function were not executed.

::: tip Note

The `:effect_free` assertion is made both for the method itself and any code that is executed by the method. Keep in mind that the assertion must be valid for all world ages and limit use of this assertion accordingly.

:::


---


**`:nothrow`**

The `:nothrow` settings asserts that this method does not throw an exception (i.e. will either always return a value or never return).

::: tip Note

It is permissible for `:nothrow` annotated methods to make use of exception handling internally as long as the exception is not rethrown out of the method itself.

:::

::: tip Note

If the execution of a method may raise `MethodError`s and similar exceptions, then the method is not considered as `:nothrow`. However, note that environment-dependent errors like `StackOverflowError` or `InterruptException` are not modeled by this effect and thus a method that may result in `StackOverflowError` does not necessarily need to be `!:nothrow` (although it should usually be `!:terminates` too).

:::


---


**`:terminates_globally`**

The `:terminates_globally` settings asserts that this method will eventually terminate (either normally or abnormally), i.e. does not loop indefinitely.

::: tip Note

This `:terminates_globally` assertion covers any other methods called by the annotated method.

:::

::: tip Note

The compiler will consider this a strong indication that the method will terminate relatively _quickly_ and may (if otherwise legal) call this method at compile time. I.e. it is a bad idea to annotate this setting on a method that _technically_, but not _practically_, terminates.

:::


---


**`:terminates_locally`**

The `:terminates_locally` setting is like `:terminates_globally`, except that it only applies to syntactic control flow _within_ the annotated method. It is thus a much weaker (and thus safer) assertion that allows for the possibility of non-termination if the method calls some other method that does not terminate.

::: tip Note

`:terminates_globally` implies `:terminates_locally`.

:::


---


**`:notaskstate`**

The `:notaskstate` setting asserts that the method does not use or modify the local task state (task local storage, RNG state, etc.) and may thus be safely moved between tasks without observable results.

::: tip Note

The implementation of exception handling makes use of state stored in the task object. However, this state is currently not considered to be within the scope of `:notaskstate` and is tracked separately using the `:nothrow` effect.

:::

::: tip Note

The `:notaskstate` assertion concerns the state of the _currently running task_. If a reference to a `Task` object is obtained by some other means that does not consider which task is _currently_ running, the `:notaskstate` effect need not be tainted. This is true, even if said task object happens to be `===` to the currently running task.

:::

::: tip Note

Access to task state usually also results in the tainting of other effects, such as `:effect_free` (if task state is modified) or `:consistent` (if task state is used in the computation of the result). In particular, code that is not `:notaskstate`, but is `:effect_free` and `:consistent` may still be dead-code-eliminated and thus promoted to `:total`.

:::


---


**`:inaccessiblememonly`**

The `:inaccessiblememonly` setting asserts that the method does not access or modify externally accessible mutable memory. This means the method can access or modify mutable memory for newly allocated objects that is not accessible by other methods or top-level execution before return from the method, but it can not access or modify any mutable global state or mutable memory pointed to by its arguments.

::: tip Note

Below is an incomplete list of examples that invalidate this assumption:
- a global reference or `getglobal` call to access a mutable global variable
  
- a global assignment or `setglobal!` call to perform assignment to a non-constant global variable
  
- `setfield!` call that changes a field of a global mutable variable
  

:::

::: tip Note

This `:inaccessiblememonly` assertion covers any other methods called by the annotated method.

:::


---


**`:noub`**

The `:noub` setting asserts that the method will not execute any undefined behavior (for any input). Note that undefined behavior may technically cause the method to violate any other effect assertions (such as `:consistent` or `:effect_free`) as well, but we do not model this, and they assume the absence of undefined behavior.


---


**`:foldable`**

This setting is a convenient shortcut for the set of effects that the compiler requires to be guaranteed to constant fold a call at compile time. It is currently equivalent to the following `setting`s:
- `:consistent`
  
- `:effect_free`
  
- `:terminates_globally`
  
- `:noub`
  

::: tip Note

This list in particular does not include `:nothrow`. The compiler will still attempt constant propagation and note any thrown error at compile time. Note however, that by the `:consistent`-cy requirements, any such annotated call must consistently throw given the same argument values.

:::

::: tip Note

An explicit `@inbounds` annotation inside the function will also disable constant folding and not be overridden by `:foldable`.

:::


---


**`:removable`**

This setting is a convenient shortcut for the set of effects that the compiler requires to be guaranteed to delete a call whose result is unused at compile time. It is currently equivalent to the following `setting`s:
- `:effect_free`
  
- `:nothrow`
  
- `:terminates_globally`
  


---


**`:total`**

This `setting` is the maximum possible set of effects. It currently implies the following other `setting`s:
- `:consistent`
  
- `:effect_free`
  
- `:nothrow`
  
- `:terminates_globally`
  
- `:notaskstate`
  
- `:inaccessiblememonly`
  
- `:noub`
  

::: warning Warning

`:total` is a very strong assertion and will likely gain additional semantics in future versions of Julia (e.g. if additional effects are added and included in the definition of `:total`). As a result, it should be used with care. Whenever possible, prefer to use the minimum possible set of specific effect assertions required for a particular application. In cases where a large number of effect overrides apply to a set of functions, a custom macro is recommended over the use of `:total`.

:::


---


**Negated effects**

Effect names may be prefixed by `!` to indicate that the effect should be removed from an earlier meta effect. For example, `:total !:nothrow` indicates that while the call is generally total, it may however throw.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L407-L735)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@deprecate' href='#Base.@deprecate'>#</a>&nbsp;<b><u>Base.@deprecate</u></b> &mdash; <i>Macro</i>.




```julia
@deprecate old new [export_old=true]
```


Deprecate method `old` and specify the replacement call `new`, defining a new method `old` with the specified signature in the process.

To prevent `old` from being exported, set `export_old` to `false`.

::: tip Julia 1.5

As of Julia 1.5, functions defined by `@deprecate` do not print warning when `julia` is run without the `--depwarn=yes` flag set, as the default value of `--depwarn` option is `no`.  The warnings are printed from tests run by `Pkg.test()`.

:::

**Examples**

```julia
julia> @deprecate old_export(x) new(x)
old_export (generic function with 1 method)

julia> @deprecate old_public(x) new(x) false
old_public (generic function with 1 method)
```


Calls to `@deprecate` without explicit type-annotations will define deprecated methods accepting any number of positional and keyword arguments of type `Any`.

::: tip Julia 1.9

Keyword arguments are forwarded when there is no explicit type annotation as of Julia 1.9. For older versions, you can manually forward positional and keyword arguments by doing `@deprecate old(args...; kwargs...) new(args...; kwargs...)`.

:::

To restrict deprecation to a specific signature, annotate the arguments of `old`. For example,

```julia
julia> new(x::Int) = x;

julia> new(x::Float64) = 2x;

julia> @deprecate old(x::Int) new(x);

julia> methods(old)
# 1 method for generic function "old" from Main:
 [1] old(x::Int64)
     @ deprecated.jl:94
```


will define and deprecate a method `old(x::Int)` that mirrors `new(x::Int)` but will not define nor deprecate the method `old(x::Float64)`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/deprecated.jl#L125-L173)

</div>
<br>

## Missing Values {#Missing-Values}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Missing' href='#Base.Missing'>#</a>&nbsp;<b><u>Base.Missing</u></b> &mdash; <i>Type</i>.




```julia
Missing
```


A type with no fields whose singleton instance [`missing`](/manual/missing#missing) is used to represent missing values.

See also: [`skipmissing`](/base/base#Base.skipmissing), [`nonmissingtype`](/base/base#Base.nonmissingtype), [`Nothing`](/base/base#Core.Nothing).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L1126-L1133)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.missing' href='#Base.missing'>#</a>&nbsp;<b><u>Base.missing</u></b> &mdash; <i>Constant</i>.




```julia
missing
```


The singleton instance of type [`Missing`](/base/base#Base.Missing) representing a missing value.

See also: [`NaN`](/base/numbers#Base.NaN), [`skipmissing`](/base/base#Base.skipmissing), [`nonmissingtype`](/base/base#Base.nonmissingtype).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L1136-L1142)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.coalesce' href='#Base.coalesce'>#</a>&nbsp;<b><u>Base.coalesce</u></b> &mdash; <i>Function</i>.




```julia
coalesce(x...)
```


Return the first value in the arguments which is not equal to [`missing`](/manual/missing#missing), if any. Otherwise return `missing`.

See also [`skipmissing`](/base/base#Base.skipmissing), [`something`](/base/base#Base.something), [`@coalesce`](/base/base#Base.@coalesce).

**Examples**

```julia
julia> coalesce(missing, 1)
1

julia> coalesce(1, missing)
1

julia> coalesce(nothing, 1)  # returns `nothing`

julia> coalesce(missing, missing)
missing
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/missing.jl#L394-L416)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@coalesce' href='#Base.@coalesce'>#</a>&nbsp;<b><u>Base.@coalesce</u></b> &mdash; <i>Macro</i>.




```julia
@coalesce(x...)
```


Short-circuiting version of [`coalesce`](/base/base#Base.coalesce).

**Examples**

```julia
julia> f(x) = (println("f($x)"); missing);

julia> a = 1;

julia> a = @coalesce a f(2) f(3) error("`a` is still missing")
1

julia> b = missing;

julia> b = @coalesce b f(2) f(3) error("`b` is still missing")
f(2)
f(3)
ERROR: `b` is still missing
[...]
```


::: tip Julia 1.7

This macro is available as of Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/missing.jl#L424-L449)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ismissing' href='#Base.ismissing'>#</a>&nbsp;<b><u>Base.ismissing</u></b> &mdash; <i>Function</i>.




```julia
ismissing(x)
```


Indicate whether `x` is [`missing`](/manual/missing#missing).

See also: [`skipmissing`](/base/base#Base.skipmissing), [`isnothing`](/base/base#Base.isnothing), [`isnan`](/base/numbers#Base.isnan).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L1145-L1151)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.skipmissing' href='#Base.skipmissing'>#</a>&nbsp;<b><u>Base.skipmissing</u></b> &mdash; <i>Function</i>.




```julia
skipmissing(itr)
```


Return an iterator over the elements in `itr` skipping [`missing`](/manual/missing#missing) values. The returned object can be indexed using indices of `itr` if the latter is indexable. Indices corresponding to missing values are not valid: they are skipped by [`keys`](/base/collections#Base.keys) and [`eachindex`](/base/arrays#Base.eachindex), and a `MissingException` is thrown when trying to use them.

Use [`collect`](/base/collections#Base.collect-Tuple{Any}) to obtain an `Array` containing the non-`missing` values in `itr`. Note that even if `itr` is a multidimensional array, the result will always be a `Vector` since it is not possible to remove missings while preserving dimensions of the input.

See also [`coalesce`](/base/base#Base.coalesce), [`ismissing`](/base/base#Base.ismissing), [`something`](/base/base#Base.something).

**Examples**

```julia
julia> x = skipmissing([1, missing, 2])
skipmissing(Union{Missing, Int64}[1, missing, 2])

julia> sum(x)
3

julia> x[1]
1

julia> x[2]
ERROR: MissingException: the value at index (2,) is missing
[...]

julia> argmax(x)
3

julia> collect(keys(x))
2-element Vector{Int64}:
 1
 3

julia> collect(skipmissing([1, missing, 2]))
2-element Vector{Int64}:
 1
 2

julia> collect(skipmissing([1 missing; 2 missing]))
2-element Vector{Int64}:
 1
 2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/missing.jl#L182-L230)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nonmissingtype' href='#Base.nonmissingtype'>#</a>&nbsp;<b><u>Base.nonmissingtype</u></b> &mdash; <i>Function</i>.




```julia
nonmissingtype(T::Type)
```


If `T` is a union of types containing `Missing`, return a new type with `Missing` removed.

**Examples**

```julia
julia> nonmissingtype(Union{Int64,Missing})
Int64

julia> nonmissingtype(Any)
Any
```


::: tip Julia 1.3

This function is exported as of Julia 1.3.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/missing.jl#L21-L38)

</div>
<br>

## System
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.run' href='#Base.run'>#</a>&nbsp;<b><u>Base.run</u></b> &mdash; <i>Function</i>.




```julia
run(command, args...; wait::Bool = true)
```


Run a command object, constructed with backticks (see the [Running External Programs](/manual/running-external-programs#Running-External-Programs) section in the manual). Throws an error if anything goes wrong, including the process exiting with a non-zero status (when `wait` is true).

The `args...` allow you to pass through file descriptors to the command, and are ordered like regular unix file descriptors (eg `stdin, stdout, stderr, FD(3), FD(4)...`).

If `wait` is false, the process runs asynchronously. You can later wait for it and check its exit status by calling `success` on the returned process object.

When `wait` is false, the process&#39; I/O streams are directed to `devnull`. When `wait` is true, I/O streams are shared with the parent process. Use [`pipeline`](/base/base#Base.pipeline-Tuple{Any,%20Any,%20Any,%20Vararg{Any}}) to control I/O redirection.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/process.jl#L493-L509)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.devnull' href='#Base.devnull'>#</a>&nbsp;<b><u>Base.devnull</u></b> &mdash; <i>Constant</i>.




```julia
devnull
```


Used in a stream redirect to discard all data written to it. Essentially equivalent to `/dev/null` on Unix or `NUL` on Windows. Usage:

```julia
run(pipeline(`cat test.txt`, devnull))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1510-L1519)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.success' href='#Base.success'>#</a>&nbsp;<b><u>Base.success</u></b> &mdash; <i>Function</i>.




```julia
success(command)
```


Run a command object, constructed with backticks (see the [Running External Programs](/manual/running-external-programs#Running-External-Programs) section in the manual), and tell whether it was successful (exited with a code of 0). An exception is raised if the process cannot be started.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/process.jl#L562-L568)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.process_running' href='#Base.process_running'>#</a>&nbsp;<b><u>Base.process_running</u></b> &mdash; <i>Function</i>.




```julia
process_running(p::Process)
```


Determine whether a process is currently running.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/process.jl#L659-L663)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.process_exited' href='#Base.process_exited'>#</a>&nbsp;<b><u>Base.process_exited</u></b> &mdash; <i>Function</i>.




```julia
process_exited(p::Process)
```


Determine whether a process has exited.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/process.jl#L668-L672)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.kill-Tuple{Base.Process, Integer}' href='#Base.kill-Tuple{Base.Process, Integer}'>#</a>&nbsp;<b><u>Base.kill</u></b> &mdash; <i>Method</i>.




```julia
kill(p::Process, signum=Base.SIGTERM)
```


Send a signal to a process. The default is to terminate the process. Returns successfully if the process has already exited, but throws an error if killing the process failed for other reasons (e.g. insufficient permissions).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/process.jl#L614-L621)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.set_process_title' href='#Base.Sys.set_process_title'>#</a>&nbsp;<b><u>Base.Sys.set_process_title</u></b> &mdash; <i>Function</i>.




```julia
Sys.set_process_title(title::AbstractString)
```


Set the process title. No-op on some operating systems.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L387-L391)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.get_process_title' href='#Base.Sys.get_process_title'>#</a>&nbsp;<b><u>Base.Sys.get_process_title</u></b> &mdash; <i>Function</i>.




```julia
Sys.get_process_title()
```


Get the process title. On some systems, will always return an empty string.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L375-L379)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ignorestatus' href='#Base.ignorestatus'>#</a>&nbsp;<b><u>Base.ignorestatus</u></b> &mdash; <i>Function</i>.




```julia
ignorestatus(command)
```


Mark a command object so that running it will not throw an error if the result code is non-zero.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L220-L224)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.detach' href='#Base.detach'>#</a>&nbsp;<b><u>Base.detach</u></b> &mdash; <i>Function</i>.




```julia
detach(command)
```


Mark a command object so that it will be run in a new process group, allowing it to outlive the julia process, and not have Ctrl-C interrupts passed to it.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L229-L233)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Cmd' href='#Base.Cmd'>#</a>&nbsp;<b><u>Base.Cmd</u></b> &mdash; <i>Type</i>.




```julia
Cmd(cmd::Cmd; ignorestatus, detach, windows_verbatim, windows_hide, env, dir)
Cmd(exec::Vector{String})
```


Construct a new `Cmd` object, representing an external program and arguments, from `cmd`, while changing the settings of the optional keyword arguments:
- `ignorestatus::Bool`: If `true` (defaults to `false`), then the `Cmd` will not throw an error if the return code is nonzero.
  
- `detach::Bool`: If `true` (defaults to `false`), then the `Cmd` will be run in a new process group, allowing it to outlive the `julia` process and not have Ctrl-C passed to it.
  
- `windows_verbatim::Bool`: If `true` (defaults to `false`), then on Windows the `Cmd` will send a command-line string to the process with no quoting or escaping of arguments, even arguments containing spaces. (On Windows, arguments are sent to a program as a single &quot;command-line&quot; string, and programs are responsible for parsing it into arguments. By default, empty arguments and arguments with spaces or tabs are quoted with double quotes `"` in the command line, and `\` or `"` are preceded by backslashes. `windows_verbatim=true` is useful for launching programs that parse their command line in nonstandard ways.) Has no effect on non-Windows systems.
  
- `windows_hide::Bool`: If `true` (defaults to `false`), then on Windows no new console window is displayed when the `Cmd` is executed. This has no effect if a console is already open or on non-Windows systems.
  
- `env`: Set environment variables to use when running the `Cmd`. `env` is either a dictionary mapping strings to strings, an array of strings of the form `"var=val"`, an array or tuple of `"var"=>val` pairs. In order to modify (rather than replace) the existing environment, initialize `env` with `copy(ENV)` and then set `env["var"]=val` as desired.  To add to an environment block within a `Cmd` object without replacing all elements, use [`addenv()`](/base/base#Base.addenv) which will return a `Cmd` object with the updated environment.
  
- `dir::AbstractString`: Specify a working directory for the command (instead of the current directory).
  

For any keywords that are not specified, the current settings from `cmd` are used.

Note that the `Cmd(exec)` constructor does not create a copy of `exec`. Any subsequent changes to `exec` will be reflected in the `Cmd` object.

The most common way to construct a `Cmd` object is with command literals (backticks), e.g.

```
`ls -l`
```


This can then be passed to the `Cmd` constructor to modify its settings, e.g.

```
Cmd(`echo "Hello world"`, ignorestatus=true, detach=false)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L43-L86)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setenv' href='#Base.setenv'>#</a>&nbsp;<b><u>Base.setenv</u></b> &mdash; <i>Function</i>.




```julia
setenv(command::Cmd, env; dir)
```


Set environment variables to use when running the given `command`. `env` is either a dictionary mapping strings to strings, an array of strings of the form `"var=val"`, or zero or more `"var"=>val` pair arguments. In order to modify (rather than replace) the existing environment, create `env` through `copy(ENV)` and then setting `env["var"]=val` as desired, or use [`addenv`](/base/base#Base.addenv).

The `dir` keyword argument can be used to specify a working directory for the command. `dir` defaults to the currently set `dir` for `command` (which is the current working directory if not specified already).

See also [`Cmd`](/base/base#Base.Cmd), [`addenv`](/base/base#Base.addenv), [`ENV`](/base/base#Base.ENV), [`pwd`](/base/file#Base.Filesystem.pwd).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L254-L268)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.addenv' href='#Base.addenv'>#</a>&nbsp;<b><u>Base.addenv</u></b> &mdash; <i>Function</i>.




```julia
addenv(command::Cmd, env...; inherit::Bool = true)
```


Merge new environment mappings into the given [`Cmd`](/base/base#Base.Cmd) object, returning a new `Cmd` object. Duplicate keys are replaced.  If `command` does not contain any environment values set already, it inherits the current environment at time of `addenv()` call if `inherit` is `true`. Keys with value `nothing` are deleted from the env.

See also [`Cmd`](/base/base#Base.Cmd), [`setenv`](/base/base#Base.setenv), [`ENV`](/base/base#Base.ENV).

::: tip Julia 1.6

This function requires Julia 1.6 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L283-L295)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.withenv' href='#Base.withenv'>#</a>&nbsp;<b><u>Base.withenv</u></b> &mdash; <i>Function</i>.




```julia
withenv(f, kv::Pair...)
```


Execute `f` in an environment that is temporarily modified (not replaced as in `setenv`) by zero or more `"var"=>val` arguments `kv`. `withenv` is generally used via the `withenv(kv...) do ... end` syntax. A value of `nothing` can be used to temporarily unset an environment variable (if it is set). When `withenv` returns, the original environment has been restored.

::: warning Warning

Changing the environment is not thread-safe. For running external commands with a different environment from the parent process, prefer using [`addenv`](/base/base#Base.addenv) over `withenv`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/env.jl#L246-L258)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.shell_escape' href='#Base.shell_escape'>#</a>&nbsp;<b><u>Base.shell_escape</u></b> &mdash; <i>Function</i>.




```julia
shell_escape(args::Union{Cmd,AbstractString...}; special::AbstractString="")
```


The unexported `shell_escape` function is the inverse of the unexported [`Base.shell_split()`](/base/base#Base.shell_split) function: it takes a string or command object and escapes any special characters in such a way that calling [`Base.shell_split()`](/base/base#Base.shell_split) on it would give back the array of words in the original command. The `special` keyword argument controls what characters in addition to whitespace, backslashes, quotes and dollar signs are considered to be special (default: none).

**Examples**

```julia
julia> Base.shell_escape("cat", "/foo/bar baz", "&&", "echo", "done")
"cat '/foo/bar baz' && echo done"

julia> Base.shell_escape("echo", "this", "&&", "that")
"echo this && that"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/shell.jl#L219-L236)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.shell_split' href='#Base.shell_split'>#</a>&nbsp;<b><u>Base.shell_split</u></b> &mdash; <i>Function</i>.




```julia
shell_split(command::AbstractString)
```


Split a shell command string into its individual components.

**Examples**

```julia
julia> Base.shell_split("git commit -m 'Initial commit'")
4-element Vector{String}:
 "git"
 "commit"
 "-m"
 "Initial commit"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/shell.jl#L155-L169)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.shell_escape_posixly' href='#Base.shell_escape_posixly'>#</a>&nbsp;<b><u>Base.shell_escape_posixly</u></b> &mdash; <i>Function</i>.




```julia
shell_escape_posixly(args::Union{Cmd,AbstractString...})
```


The unexported `shell_escape_posixly` function takes a string or command object and escapes any special characters in such a way that it is safe to pass it as an argument to a posix shell.

See also: [`Base.shell_escape()`](/base/base#Base.shell_escape)

**Examples**

```julia
julia> Base.shell_escape_posixly("cat", "/foo/bar baz", "&&", "echo", "done")
"cat '/foo/bar baz' '&&' echo done"

julia> Base.shell_escape_posixly("echo", "this", "&&", "that")
"echo this '&&' that"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/shell.jl#L280-L297)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.shell_escape_csh' href='#Base.shell_escape_csh'>#</a>&nbsp;<b><u>Base.shell_escape_csh</u></b> &mdash; <i>Function</i>.




```julia
shell_escape_csh(args::Union{Cmd,AbstractString...})
shell_escape_csh(io::IO, args::Union{Cmd,AbstractString...})
```


This function quotes any metacharacters in the string arguments such that the string returned can be inserted into a command-line for interpretation by the Unix C shell (csh, tcsh), where each string argument will form one word.

In contrast to a POSIX shell, csh does not support the use of the backslash as a general escape character in double-quoted strings. Therefore, this function wraps strings that might contain metacharacters in single quotes, except for parts that contain single quotes, which it wraps in double quotes instead. It switches between these types of quotes as needed. Linefeed characters are escaped with a backslash.

This function should also work for a POSIX shell, except if the input string contains a linefeed (`"\n"`) character.

See also: [`Base.shell_escape_posixly()`](/base/base#Base.shell_escape_posixly)


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/shell.jl#L301-L322)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.shell_escape_wincmd' href='#Base.shell_escape_wincmd'>#</a>&nbsp;<b><u>Base.shell_escape_wincmd</u></b> &mdash; <i>Function</i>.




```julia
shell_escape_wincmd(s::AbstractString)
shell_escape_wincmd(io::IO, s::AbstractString)
```


The unexported `shell_escape_wincmd` function escapes Windows `cmd.exe` shell meta characters. It escapes `()!^<>&|` by placing a `^` in front. An `@` is only escaped at the start of the string. Pairs of `"` characters and the strings they enclose are passed through unescaped. Any remaining `"` is escaped with `^` to ensure that the number of unescaped `"` characters in the result remains even.

Since `cmd.exe` substitutes variable references (like `%USER%`) _before_ processing the escape characters `^` and `"`, this function makes no attempt to escape the percent sign (`%`), the presence of `%` in the input may cause severe breakage, depending on where the result is used.

Input strings with ASCII control characters that cannot be escaped (NUL, CR, LF) will cause an `ArgumentError` exception.

The result is safe to pass as an argument to a command call being processed by `CMD.exe /S /C " ... "` (with surrounding double-quote pair) and will be received verbatim by the target application if the input does not contain `%` (else this function will fail with an ArgumentError). The presence of `%` in the input string may result in command injection vulnerabilities and may invalidate any claim of suitability of the output of this function for use as an argument to cmd (due to the ordering described above), so use caution when assembling a string from various sources.

This function may be useful in concert with the `windows_verbatim` flag to [`Cmd`](/base/base#Base.Cmd) when constructing process pipelines.

```julia
wincmd(c::String) =
   run(Cmd(Cmd(["cmd.exe", "/s /c \" $c \""]);
           windows_verbatim=true))
wincmd_echo(s::String) =
   wincmd("echo " * Base.shell_escape_wincmd(s))
wincmd_echo("hello $(ENV["USERNAME"]) & the \"whole\" world! (=^I^=)")
```


But take note that if the input string `s` contains a `%`, the argument list and echo&#39;ed text may get corrupted, resulting in arbitrary command execution. The argument can alternatively be passed as an environment variable, which avoids the problem with `%` and the need for the `windows_verbatim` flag:

```julia
cmdargs = Base.shell_escape_wincmd("Passing args with %cmdargs% works 100%!")
run(setenv(`cmd /C echo %cmdargs%`, "cmdargs" => cmdargs))
```


::: warning Warning

The argument parsing done by CMD when calling batch files (either inside `.bat` files or as arguments to them) is not fully compatible with the output of this function. In particular, the processing of `%` is different.

:::

::: tip Important

Due to a peculiar behavior of the CMD parser/interpreter, each command after a literal `|` character (indicating a command pipeline) must have `shell_escape_wincmd` applied twice since it will be parsed twice by CMD. This implies ENV variables would also be expanded twice! For example:

```julia
to_print = "All for 1 & 1 for all!"
to_print_esc = Base.shell_escape_wincmd(Base.shell_escape_wincmd(to_print))
run(Cmd(Cmd(["cmd", "/S /C \" break | echo $(to_print_esc) \""]), windows_verbatim=true))
```


:::

With an I/O stream parameter `io`, the result will be written there, rather than returned as a string.

See also [`Base.escape_microsoft_c_args()`](/base/base#Base.escape_microsoft_c_args), [`Base.shell_escape_posixly()`](/base/base#Base.shell_escape_posixly).

**Examples**

```julia
julia> Base.shell_escape_wincmd("a^\"^o\"^u\"")
"a^^\"^o\"^^u^\""
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/shell.jl#L349-L426)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.escape_microsoft_c_args' href='#Base.escape_microsoft_c_args'>#</a>&nbsp;<b><u>Base.escape_microsoft_c_args</u></b> &mdash; <i>Function</i>.




```julia
escape_microsoft_c_args(args::Union{Cmd,AbstractString...})
escape_microsoft_c_args(io::IO, args::Union{Cmd,AbstractString...})
```


Convert a collection of string arguments into a string that can be passed to many Windows command-line applications.

Microsoft Windows passes the entire command line as a single string to the application (unlike POSIX systems, where the shell splits the command line into a list of arguments). Many Windows API applications (including julia.exe), use the conventions of the [Microsoft C/C++ runtime](https://docs.microsoft.com/en-us/cpp/c-language/parsing-c-command-line-arguments) to split that command line into a list of strings.

This function implements an inverse for a parser compatible with these rules. It joins command-line arguments to be passed to a Windows C/C++/Julia application into a command line, escaping or quoting the meta characters space, TAB, double quote and backslash where needed.

See also [`Base.shell_escape_wincmd()`](/base/base#Base.shell_escape_wincmd), [`Base.escape_raw_string()`](/base/strings#Base.escape_raw_string).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/shell.jl#L454-L474)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.setcpuaffinity' href='#Base.setcpuaffinity'>#</a>&nbsp;<b><u>Base.setcpuaffinity</u></b> &mdash; <i>Function</i>.




```julia
setcpuaffinity(original_command::Cmd, cpus) -> command::Cmd
```


Set the CPU affinity of the `command` by a list of CPU IDs (1-based) `cpus`.  Passing `cpus = nothing` means to unset the CPU affinity if the `original_command` has any.

This function is supported only in Linux and Windows.  It is not supported in macOS because libuv does not support affinity setting.

::: tip Julia 1.8

This function requires at least Julia 1.8.

:::

**Examples**

In Linux, the `taskset` command line program can be used to see how `setcpuaffinity` works.

```julia
julia> run(setcpuaffinity(`sh -c 'taskset -p $$'`, [1, 2, 5]));
pid 2273's current affinity mask: 13
```


Note that the mask value `13` reflects that the first, second, and the fifth bits (counting from the least significant position) are turned on:

```julia
julia> 0b010011
0x13
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L325-L353)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pipeline-Tuple{Any, Any, Any, Vararg{Any}}' href='#Base.pipeline-Tuple{Any, Any, Any, Vararg{Any}}'>#</a>&nbsp;<b><u>Base.pipeline</u></b> &mdash; <i>Method</i>.




```julia
pipeline(from, to, ...)
```


Create a pipeline from a data source to a destination. The source and destination can be commands, I/O streams, strings, or results of other `pipeline` calls. At least one argument must be a command. Strings refer to filenames. When called with more than two arguments, they are chained together from left to right. For example, `pipeline(a,b,c)` is equivalent to `pipeline(pipeline(a,b),c)`. This provides a more concise way to specify multi-stage pipelines.

**Examples**:

```julia
run(pipeline(`ls`, `grep xyz`))
run(pipeline(`ls`, "out.txt"))
run(pipeline("out.txt", `grep xyz`))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L409-L426)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pipeline-Tuple{Base.AbstractCmd}' href='#Base.pipeline-Tuple{Base.AbstractCmd}'>#</a>&nbsp;<b><u>Base.pipeline</u></b> &mdash; <i>Method</i>.




```julia
pipeline(command; stdin, stdout, stderr, append=false)
```


Redirect I/O to or from the given `command`. Keyword arguments specify which of the command&#39;s streams should be redirected. `append` controls whether file output appends to the file. This is a more general version of the 2-argument `pipeline` function. `pipeline(from, to)` is equivalent to `pipeline(from, stdout=to)` when `from` is a command, and to `pipeline(to, stdin=from)` when `from` is another kind of data source.

**Examples**:

```julia
run(pipeline(`dothings`, stdout="out.txt", stderr="errs.txt"))
run(pipeline(`update`, stdout="log.txt", append=true))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/cmd.jl#L374-L389)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.gethostname' href='#Base.Libc.gethostname'>#</a>&nbsp;<b><u>Base.Libc.gethostname</u></b> &mdash; <i>Function</i>.




```julia
gethostname() -> String
```


Get the local machine&#39;s host name.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L298-L302)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.getpid' href='#Base.Libc.getpid'>#</a>&nbsp;<b><u>Base.Libc.getpid</u></b> &mdash; <i>Function</i>.




```julia
getpid() -> Int32
```


Get Julia&#39;s process ID.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L289-L293)



```julia
getpid(process) -> Int32
```


Get the child process ID, if it still exists.

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/process.jl#L637-L644)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Libc.time-Tuple{}' href='#Base.Libc.time-Tuple{}'>#</a>&nbsp;<b><u>Base.Libc.time</u></b> &mdash; <i>Method</i>.




```julia
time() -> Float64
```


Get the system time in seconds since the epoch, with fairly high (typically, microsecond) resolution.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/libc.jl#L280-L284)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.time_ns' href='#Base.time_ns'>#</a>&nbsp;<b><u>Base.time_ns</u></b> &mdash; <i>Function</i>.




```julia
time_ns() -> UInt64
```


Get the time in nanoseconds. The time corresponding to 0 is undefined, and wraps every 5.8 years.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/Base.jl#L152-L156)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@time' href='#Base.@time'>#</a>&nbsp;<b><u>Base.@time</u></b> &mdash; <i>Macro</i>.




```julia
@time expr
@time "description" expr
```


A macro to execute an expression, printing the time it took to execute, the number of allocations, and the total number of bytes its execution caused to be allocated, before returning the value of the expression. Any time spent garbage collecting (gc), compiling new code, or recompiling invalidated code is shown as a percentage. Any lock conflicts where a [`ReentrantLock`](/base/parallel#Base.ReentrantLock) had to wait are shown as a count.

Optionally provide a description string to print before the time report.

In some cases the system will look inside the `@time` expression and compile some of the called code before execution of the top-level expression begins. When that happens, some compilation time will not be counted. To include this time you can run `@time @eval ...`.

See also [`@showtime`](/base/base#Base.@showtime), [`@timev`](/base/base#Base.@timev), [`@timed`](/base/base#Base.@timed), [`@elapsed`](/base/base#Base.@elapsed), [`@allocated`](/base/base#Base.@allocated), and [`@allocations`](/base/base#Base.@allocations).

::: tip Note

For more serious benchmarking, consider the `@btime` macro from the BenchmarkTools.jl package which among other things evaluates the function multiple times in order to reduce noise.

:::

::: tip Julia 1.8

The option to add a description was introduced in Julia 1.8.

Recompilation time being shown separately from compilation time was introduced in Julia 1.8

:::

::: tip Julia 1.11

The reporting of any lock conflicts was added in Julia 1.11.

:::

```julia
julia> x = rand(10,10);

julia> @time x * x;
  0.606588 seconds (2.19 M allocations: 116.555 MiB, 3.75% gc time, 99.94% compilation time)

julia> @time x * x;
  0.000009 seconds (1 allocation: 896 bytes)

julia> @time begin
           sleep(0.3)
           1+1
       end
  0.301395 seconds (8 allocations: 336 bytes)
2

julia> @time "A one second sleep" sleep(1)
A one second sleep: 1.005750 seconds (5 allocations: 144 bytes)

julia> for loop in 1:3
            @time loop sleep(1)
        end
1: 1.006760 seconds (5 allocations: 144 bytes)
2: 1.001263 seconds (5 allocations: 144 bytes)
3: 1.003676 seconds (5 allocations: 144 bytes)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L251-L309)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@showtime' href='#Base.@showtime'>#</a>&nbsp;<b><u>Base.@showtime</u></b> &mdash; <i>Macro</i>.




```julia
@showtime expr
```


Like `@time` but also prints the expression being evaluated for reference.

::: tip Julia 1.8

This macro was added in Julia 1.8.

:::

See also [`@time`](/manual/profile#@time).

```julia
julia> @showtime sleep(1)
sleep(1): 1.002164 seconds (4 allocations: 128 bytes)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L324-L338)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@timev' href='#Base.@timev'>#</a>&nbsp;<b><u>Base.@timev</u></b> &mdash; <i>Macro</i>.




```julia
@timev expr
@timev "description" expr
```


This is a verbose version of the `@time` macro. It first prints the same information as `@time`, then any non-zero memory allocation counters, and then returns the value of the expression.

Optionally provide a description string to print before the time report.

::: tip Julia 1.8

The option to add a description was introduced in Julia 1.8.

:::

See also [`@time`](/manual/profile#@time), [`@timed`](/base/base#Base.@timed), [`@elapsed`](/base/base#Base.@elapsed), [`@allocated`](/base/base#Base.@allocated), and [`@allocations`](/base/base#Base.@allocations).

```julia
julia> x = rand(10,10);

julia> @timev x * x;
  0.546770 seconds (2.20 M allocations: 116.632 MiB, 4.23% gc time, 99.94% compilation time)
elapsed time (ns): 546769547
gc time (ns):      23115606
bytes allocated:   122297811
pool allocs:       2197930
non-pool GC allocs:1327
malloc() calls:    36
realloc() calls:   5
GC pauses:         3

julia> @timev x * x;
  0.000010 seconds (1 allocation: 896 bytes)
elapsed time (ns): 9848
bytes allocated:   896
pool allocs:       1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L345-L381)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@timed' href='#Base.@timed'>#</a>&nbsp;<b><u>Base.@timed</u></b> &mdash; <i>Macro</i>.




```julia
@timed
```


A macro to execute an expression, and return the value of the expression, elapsed time in seconds, total bytes allocated, garbage collection time, an object with various memory allocation counters, compilation time in seconds, and recompilation time in seconds. Any lock conflicts where a [`ReentrantLock`](/base/parallel#Base.ReentrantLock) had to wait are shown as a count.

In some cases the system will look inside the `@timed` expression and compile some of the called code before execution of the top-level expression begins. When that happens, some compilation time will not be counted. To include this time you can run `@timed @eval ...`.

See also [`@time`](/manual/profile#@time), [`@timev`](/base/base#Base.@timev), [`@elapsed`](/base/base#Base.@elapsed), [`@allocated`](/base/base#Base.@allocated), [`@allocations`](/base/base#Base.@allocations), and [`@lock_conflicts`](/base/base#Base.@lock_conflicts).

```julia
julia> stats = @timed rand(10^6);

julia> stats.time
0.006634834

julia> stats.bytes
8000256

julia> stats.gctime
0.0055765

julia> propertynames(stats.gcstats)
(:allocd, :malloc, :realloc, :poolalloc, :bigalloc, :freecall, :total_time, :pause, :full_sweep)

julia> stats.gcstats.total_time
5576500

julia> stats.compile_time
0.0

julia> stats.recompile_time
0.0

```


::: tip Julia 1.5

The return type of this macro was changed from `Tuple` to `NamedTuple` in Julia 1.5.

:::

::: tip Julia 1.11

The `lock_conflicts`, `compile_time`, and `recompile_time` fields were added in Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L522-L568)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@elapsed' href='#Base.@elapsed'>#</a>&nbsp;<b><u>Base.@elapsed</u></b> &mdash; <i>Macro</i>.




```julia
@elapsed
```


A macro to evaluate an expression, discarding the resulting value, instead returning the number of seconds it took to execute as a floating-point number.

In some cases the system will look inside the `@elapsed` expression and compile some of the called code before execution of the top-level expression begins. When that happens, some compilation time will not be counted. To include this time you can run `@elapsed @eval ...`.

See also [`@time`](/manual/profile#@time), [`@timev`](/base/base#Base.@timev), [`@timed`](/base/base#Base.@timed), [`@allocated`](/base/base#Base.@allocated), and [`@allocations`](/base/base#Base.@allocations).

```julia
julia> @elapsed sleep(0.3)
0.301391426
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L396-L413)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@allocated' href='#Base.@allocated'>#</a>&nbsp;<b><u>Base.@allocated</u></b> &mdash; <i>Macro</i>.




```julia
@allocated
```


A macro to evaluate an expression, discarding the resulting value, instead returning the total number of bytes allocated during evaluation of the expression.

See also [`@allocations`](/base/base#Base.@allocations), [`@time`](/manual/profile#@time), [`@timev`](/base/base#Base.@timev), [`@timed`](/base/base#Base.@timed), and [`@elapsed`](/base/base#Base.@elapsed).

```julia
julia> @allocated rand(10^6)
8000080
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L432-L445)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@allocations' href='#Base.@allocations'>#</a>&nbsp;<b><u>Base.@allocations</u></b> &mdash; <i>Macro</i>.




```julia
@allocations
```


A macro to evaluate an expression, discard the resulting value, and instead return the total number of allocations during evaluation of the expression.

See also [`@allocated`](/base/base#Base.@allocated), [`@time`](/manual/profile#@time), [`@timev`](/base/base#Base.@timev), [`@timed`](/base/base#Base.@timed), and [`@elapsed`](/base/base#Base.@elapsed).

```julia
julia> @allocations rand(10^6)
2
```


::: tip Julia 1.9

This macro was added in Julia 1.9.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L458-L474)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@lock_conflicts' href='#Base.@lock_conflicts'>#</a>&nbsp;<b><u>Base.@lock_conflicts</u></b> &mdash; <i>Macro</i>.




```julia
@lock_conflicts
```


A macro to evaluate an expression, discard the resulting value, and instead return the total number of lock conflicts during evaluation, where a lock attempt on a [`ReentrantLock`](/base/parallel#Base.ReentrantLock) resulted in a wait because the lock was already held.

See also [`@time`](/manual/profile#@time), [`@timev`](/base/base#Base.@timev) and [`@timed`](/base/base#Base.@timed).

```julia
julia> @lock_conflicts begin
    l = ReentrantLock()
    Threads.@threads for i in 1:Threads.nthreads()
        lock(l) do
        sleep(1)
        end
    end
end
5
```


::: tip Julia 1.11

This macro was added in Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L485-L508)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.EnvDict' href='#Base.EnvDict'>#</a>&nbsp;<b><u>Base.EnvDict</u></b> &mdash; <i>Type</i>.




```julia
EnvDict() -> EnvDict
```


A singleton of this type provides a hash table interface to environment variables.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/env.jl#L76-L80)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ENV' href='#Base.ENV'>#</a>&nbsp;<b><u>Base.ENV</u></b> &mdash; <i>Constant</i>.




```julia
ENV
```


Reference to the singleton `EnvDict`, providing a dictionary interface to system environment variables.

(On Windows, system environment variables are case-insensitive, and `ENV` correspondingly converts all keys to uppercase for display, iteration, and copying. Portable code should not rely on the ability to distinguish variables by case, and should beware that setting an ostensibly lowercase variable may result in an uppercase `ENV` key.)

::: warning Warning

Mutating the environment is not thread-safe.

:::

**Examples**

```julia
julia> ENV
Base.EnvDict with "50" entries:
  "SECURITYSESSIONID"            => "123"
  "USER"                         => "username"
  "MallocNanoZone"               => "0"
  ⋮                              => ⋮

julia> ENV["JULIA_EDITOR"] = "vim"
"vim"

julia> ENV["JULIA_EDITOR"]
"vim"
```


See also: [`withenv`](/base/base#Base.withenv), [`addenv`](/base/base#Base.addenv).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/env.jl#L83-L114)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.STDLIB' href='#Base.Sys.STDLIB'>#</a>&nbsp;<b><u>Base.Sys.STDLIB</u></b> &mdash; <i>Constant</i>.




```julia
Sys.STDLIB::String
```


A string containing the full path to the directory containing the `stdlib` packages.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L50-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isunix' href='#Base.Sys.isunix'>#</a>&nbsp;<b><u>Base.Sys.isunix</u></b> &mdash; <i>Function</i>.




```julia
Sys.isunix([os])
```


Predicate for testing if the OS provides a Unix-like interface. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L407-L412)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isapple' href='#Base.Sys.isapple'>#</a>&nbsp;<b><u>Base.Sys.isapple</u></b> &mdash; <i>Function</i>.




```julia
Sys.isapple([os])
```


Predicate for testing if the OS is a derivative of Apple Macintosh OS X or Darwin. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L514-L519)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.islinux' href='#Base.Sys.islinux'>#</a>&nbsp;<b><u>Base.Sys.islinux</u></b> &mdash; <i>Function</i>.




```julia
Sys.islinux([os])
```


Predicate for testing if the OS is a derivative of Linux. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L429-L434)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isbsd' href='#Base.Sys.isbsd'>#</a>&nbsp;<b><u>Base.Sys.isbsd</u></b> &mdash; <i>Function</i>.




```julia
Sys.isbsd([os])
```


Predicate for testing if the OS is a derivative of BSD. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).

::: tip Note

The Darwin kernel descends from BSD, which means that `Sys.isbsd()` is `true` on macOS systems. To exclude macOS from a predicate, use `Sys.isbsd() && !Sys.isapple()`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L437-L447)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isfreebsd' href='#Base.Sys.isfreebsd'>#</a>&nbsp;<b><u>Base.Sys.isfreebsd</u></b> &mdash; <i>Function</i>.




```julia
Sys.isfreebsd([os])
```


Predicate for testing if the OS is a derivative of FreeBSD. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).

::: tip Note

Not to be confused with `Sys.isbsd()`, which is `true` on FreeBSD but also on other BSD-based systems. `Sys.isfreebsd()` refers only to FreeBSD.

:::

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L450-L461)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isopenbsd' href='#Base.Sys.isopenbsd'>#</a>&nbsp;<b><u>Base.Sys.isopenbsd</u></b> &mdash; <i>Function</i>.




```julia
Sys.isopenbsd([os])
```


Predicate for testing if the OS is a derivative of OpenBSD. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).

::: tip Note

Not to be confused with `Sys.isbsd()`, which is `true` on OpenBSD but also on other BSD-based systems. `Sys.isopenbsd()` refers only to OpenBSD.

:::

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L464-L475)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isnetbsd' href='#Base.Sys.isnetbsd'>#</a>&nbsp;<b><u>Base.Sys.isnetbsd</u></b> &mdash; <i>Function</i>.




```julia
Sys.isnetbsd([os])
```


Predicate for testing if the OS is a derivative of NetBSD. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).

::: tip Note

Not to be confused with `Sys.isbsd()`, which is `true` on NetBSD but also on other BSD-based systems. `Sys.isnetbsd()` refers only to NetBSD.

:::

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L478-L489)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isdragonfly' href='#Base.Sys.isdragonfly'>#</a>&nbsp;<b><u>Base.Sys.isdragonfly</u></b> &mdash; <i>Function</i>.




```julia
Sys.isdragonfly([os])
```


Predicate for testing if the OS is a derivative of DragonFly BSD. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).

::: tip Note

Not to be confused with `Sys.isbsd()`, which is `true` on DragonFly but also on other BSD-based systems. `Sys.isdragonfly()` refers only to DragonFly.

:::

::: tip Julia 1.1

This function requires at least Julia 1.1.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L492-L503)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.iswindows' href='#Base.Sys.iswindows'>#</a>&nbsp;<b><u>Base.Sys.iswindows</u></b> &mdash; <i>Function</i>.




```julia
Sys.iswindows([os])
```


Predicate for testing if the OS is a derivative of Microsoft Windows NT. See documentation in [Handling Operating System Variation](/manual/handling-operating-system-variation#Handling-Operating-System-Variation).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L506-L511)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.windows_version' href='#Base.Sys.windows_version'>#</a>&nbsp;<b><u>Base.Sys.windows_version</u></b> &mdash; <i>Function</i>.




```julia
Sys.windows_version()
```


Return the version number for the Windows NT Kernel as a `VersionNumber`, i.e. `v"major.minor.build"`, or `v"0.0.0"` if this is not running on Windows.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L546-L551)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.free_memory' href='#Base.Sys.free_memory'>#</a>&nbsp;<b><u>Base.Sys.free_memory</u></b> &mdash; <i>Function</i>.




```julia
Sys.free_memory()
```


Get the total free memory in RAM in bytes.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L351-L355)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.total_memory' href='#Base.Sys.total_memory'>#</a>&nbsp;<b><u>Base.Sys.total_memory</u></b> &mdash; <i>Function</i>.




```julia
Sys.total_memory()
```


Get the total memory in RAM (including that which is currently used) in bytes. This amount may be constrained, e.g., by Linux control groups. For the unconstrained amount, see `Sys.total_physical_memory()`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L358-L364)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.free_physical_memory' href='#Base.Sys.free_physical_memory'>#</a>&nbsp;<b><u>Base.Sys.free_physical_memory</u></b> &mdash; <i>Function</i>.




```julia
Sys.free_physical_memory()
```


Get the free memory of the system in bytes. The entire amount may not be available to the current process; use `Sys.free_memory()` for the actually available amount.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L335-L340)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.total_physical_memory' href='#Base.Sys.total_physical_memory'>#</a>&nbsp;<b><u>Base.Sys.total_physical_memory</u></b> &mdash; <i>Function</i>.




```julia
Sys.total_physical_memory()
```


Get the total memory in RAM (including that which is currently used) in bytes. The entire amount may not be available to the current process; see `Sys.total_memory()`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L343-L348)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.uptime' href='#Base.Sys.uptime'>#</a>&nbsp;<b><u>Base.Sys.uptime</u></b> &mdash; <i>Function</i>.




```julia
Sys.uptime()
```


Gets the current system uptime in seconds.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L312-L316)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isjsvm' href='#Base.Sys.isjsvm'>#</a>&nbsp;<b><u>Base.Sys.isjsvm</u></b> &mdash; <i>Function</i>.




```julia
Sys.isjsvm([os])
```


Predicate for testing if Julia is running in a JavaScript VM (JSVM), including e.g. a WebAssembly JavaScript embedding in a web browser.

::: tip Julia 1.2

This function requires at least Julia 1.2.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L522-L530)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.loadavg' href='#Base.Sys.loadavg'>#</a>&nbsp;<b><u>Base.Sys.loadavg</u></b> &mdash; <i>Function</i>.




```julia
Sys.loadavg()
```


Get the load average. See: https://en.wikipedia.org/wiki/Load_(computing).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L324-L328)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isexecutable' href='#Base.Sys.isexecutable'>#</a>&nbsp;<b><u>Base.Sys.isexecutable</u></b> &mdash; <i>Function</i>.




```julia
isexecutable(path::String)
```


Return `true` if the given `path` has executable permissions.

::: tip Note

This permission may change before the user executes `path`, so it is recommended to execute the file and handle the error if that fails, rather than calling `isexecutable` first.

:::

::: tip Note

Prior to Julia 1.6, this did not correctly interrogate filesystem ACLs on Windows, therefore it would return `true` for any file.  From Julia 1.6 on, it correctly determines whether the file is marked as executable or not.

:::

See also [`ispath`](/base/file#Base.Filesystem.ispath), [`isreadable`](/base/io-network#Base.isreadable), [`iswritable`](/base/io-network#Base.iswritable).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/filesystem.jl#L369-L386)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.isreadable' href='#Base.Sys.isreadable'>#</a>&nbsp;<b><u>Base.Sys.isreadable</u></b> &mdash; <i>Function</i>.




```julia
isreadable(path::String)
```


Return `true` if the access permissions for the given `path` permitted reading by the current user.

::: tip Note

This permission may change before the user calls `open`, so it is recommended to just call `open` alone and handle the error if that fails, rather than calling `isreadable` first.

:::

::: tip Note

Currently this function does not correctly interrogate filesystem ACLs on Windows, therefore it can return wrong results.

:::

::: tip Julia 1.11

This function requires at least Julia 1.11.

:::

See also [`ispath`](/base/file#Base.Filesystem.ispath), [`isexecutable`](/base/io-network#Base.isexecutable), [`iswritable`](/base/io-network#Base.iswritable).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/filesystem.jl#L395-L413)



```julia
isreadable(io) -> Bool
```


Return `false` if the specified IO object is not readable.

**Examples**

```julia
julia> open("myfile.txt", "w") do io
           print(io, "Hello world!");
           isreadable(io)
       end
false

julia> open("myfile.txt", "r") do io
           isreadable(io)
       end
true

julia> rm("myfile.txt")
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/io.jl#L136-L156)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.iswritable' href='#Base.Sys.iswritable'>#</a>&nbsp;<b><u>Base.Sys.iswritable</u></b> &mdash; <i>Function</i>.




```julia
iswritable(path::String)
```


Return `true` if the access permissions for the given `path` permitted writing by the current user.

::: tip Note

This permission may change before the user calls `open`, so it is recommended to just call `open` alone and handle the error if that fails, rather than calling `iswritable` first.

:::

::: tip Note

Currently this function does not correctly interrogate filesystem ACLs on Windows, therefore it can return wrong results.

:::

::: tip Julia 1.11

This function requires at least Julia 1.11.

:::

See also [`ispath`](/base/file#Base.Filesystem.ispath), [`isexecutable`](/base/io-network#Base.isexecutable), [`isreadable`](/base/io-network#Base.isreadable).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/filesystem.jl#L422-L440)



```julia
iswritable(io) -> Bool
```


Return `false` if the specified IO object is not writable.

**Examples**

```julia
julia> open("myfile.txt", "w") do io
           print(io, "Hello world!");
           iswritable(io)
       end
true

julia> open("myfile.txt", "r") do io
           iswritable(io)
       end
false

julia> rm("myfile.txt")
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/io.jl#L159-L179)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Sys.username' href='#Base.Sys.username'>#</a>&nbsp;<b><u>Base.Sys.username</u></b> &mdash; <i>Function</i>.




```julia
Sys.username() -> String
```


Return the username for the current user. If the username cannot be determined or is empty, this function throws an error.

To retrieve a username that is overridable via an environment variable, e.g., `USER`, consider using

```julia
user = get(Sys.username, ENV, "USER")
```


::: tip Julia 1.11

This function requires at least Julia 1.11.

:::

See also [`homedir`](/base/file#Base.Filesystem.homedir).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/sysinfo.jl#L639-L655)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@static' href='#Base.@static'>#</a>&nbsp;<b><u>Base.@static</u></b> &mdash; <i>Macro</i>.




```julia
@static
```


Partially evaluate an expression at macro expansion time.

This is useful in cases where a construct would be invalid in some cases, such as a `ccall` to an os-dependent function, or macros defined in packages that are not imported.

`@static` requires a conditional. The conditional can be in an `if` statement, a ternary operator, or `&&``||`. The conditional is evaluated by recursively expanding macros, lowering and executing the resulting expressions. Then, the matching branch (if any) is returned. All the other branches of the conditional are deleted before they are macro-expanded (and lowered or executed).

**Example**

Suppose we want to parse an expression `expr` that is valid only on macOS. We could solve this problem using `@static` with `@static if Sys.isapple() expr end`. In case we had `expr_apple` for macOS and `expr_others` for the other operating systems, the solution with `@static` would be `@static Sys.isapple() ? expr_apple : expr_others`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/osutils.jl#L3-L23)

</div>
<br>

## Versioning
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.VersionNumber' href='#Base.VersionNumber'>#</a>&nbsp;<b><u>Base.VersionNumber</u></b> &mdash; <i>Type</i>.




```julia
VersionNumber
```


Version number type which follows the specifications of [semantic versioning (semver)](https://semver.org/spec/v2.0.0-rc.2.html), composed of major, minor and patch numeric values, followed by pre-release and build alphanumeric annotations.

`VersionNumber` objects can be compared with all of the standard comparison operators (`==`, `<`, `<=`, etc.), with the result following semver v2.0.0-rc.2 rules.

`VersionNumber` has the following public fields:
- `v.major::Integer`
  
- `v.minor::Integer`
  
- `v.patch::Integer`
  
- `v.prerelease::Tuple{Vararg{Union{Integer, AbstractString}}}`
  
- `v.build::Tuple{Vararg{Union{Integer, AbstractString}}}`
  

See also [`@v_str`](/base/base#Base.@v_str) to efficiently construct `VersionNumber` objects from semver-format literal strings, [`VERSION`](/base/constants#Base.VERSION) for the `VersionNumber` of Julia itself, and [Version Number Literals](/manual/strings#man-version-number-literals) in the manual.

**Examples**

```julia
julia> a = VersionNumber(1, 2, 3)
v"1.2.3"

julia> a >= v"1.2"
true

julia> b = VersionNumber("2.0.1-rc1")
v"2.0.1-rc1"

julia> b >= v"2.0.1"
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/version.jl#L8-L45)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@v_str' href='#Base.@v_str'>#</a>&nbsp;<b><u>Base.@v_str</u></b> &mdash; <i>Macro</i>.




```julia
@v_str
```


String macro used to parse a string to a [`VersionNumber`](/base/base#Base.VersionNumber).

**Examples**

```julia
julia> v"1.2.3"
v"1.2.3"

julia> v"2.0.1-rc1"
v"2.0.1-rc1"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/version.jl#L153-L166)

</div>
<br>

## Errors
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.error' href='#Base.error'>#</a>&nbsp;<b><u>Base.error</u></b> &mdash; <i>Function</i>.




```julia
error(message::AbstractString)
```


Raise an `ErrorException` with the given message.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L39-L43)



```julia
error(msg...)
```


Raise an `ErrorException` with a message constructed by `string(msg...)`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L46-L50)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.throw' href='#Core.throw'>#</a>&nbsp;<b><u>Core.throw</u></b> &mdash; <i>Function</i>.




```julia
throw(e)
```


Throw an object as an exception.

See also: [`rethrow`](/base/base#Base.rethrow), [`error`](/base/base#Base.error).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L19-L25)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.rethrow' href='#Base.rethrow'>#</a>&nbsp;<b><u>Base.rethrow</u></b> &mdash; <i>Function</i>.




```julia
rethrow()
```


Rethrow the current exception from within a `catch` block. The rethrown exception will continue propagation as if it had not been caught.

::: tip Note

The alternative form `rethrow(e)` allows you to associate an alternative exception object `e` with the current backtrace. However this misrepresents the program state at the time of the error so you&#39;re encouraged to instead throw a new exception using `throw(e)`. In Julia 1.1 and above, using `throw(e)` will preserve the root cause exception on the stack, as described in [`current_exceptions`](/base/base#Base.current_exceptions).

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L56-L69)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.backtrace' href='#Base.backtrace'>#</a>&nbsp;<b><u>Base.backtrace</u></b> &mdash; <i>Function</i>.




```julia
backtrace()
```


Get a backtrace object for the current program point.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L113-L117)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.catch_backtrace' href='#Base.catch_backtrace'>#</a>&nbsp;<b><u>Base.catch_backtrace</u></b> &mdash; <i>Function</i>.




```julia
catch_backtrace()
```


Get the backtrace of the current exception, for use within `catch` blocks.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L127-L131)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.current_exceptions' href='#Base.current_exceptions'>#</a>&nbsp;<b><u>Base.current_exceptions</u></b> &mdash; <i>Function</i>.




```julia
current_exceptions(task::Task=current_task(); [backtrace::Bool=true])
```


Get the stack of exceptions currently being handled. For nested catch blocks there may be more than one current exception in which case the most recently thrown exception is last in the stack. The stack is returned as an `ExceptionStack` which is an AbstractVector of named tuples `(exception,backtrace)`. If `backtrace` is false, the backtrace in each pair will be set to `nothing`.

Explicitly passing `task` will return the current exception stack on an arbitrary task. This is useful for inspecting tasks which have failed due to uncaught exceptions.

::: tip Julia 1.7

This function went by the experimental name `catch_stack()` in Julia 1.1–1.6, and had a plain Vector-of-tuples as a return type.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L141-L158)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@assert' href='#Base.@assert'>#</a>&nbsp;<b><u>Base.@assert</u></b> &mdash; <i>Macro</i>.




```julia
@assert cond [text]
```


Throw an [`AssertionError`](/base/base#Core.AssertionError) if `cond` is `false`. This is the preferred syntax for writing assertions, which are conditions that are assumed to be true, but that the user might decide to check anyways, as an aid to debugging if they fail. The optional message `text` is displayed upon assertion failure.

::: warning Warning

An assert might be disabled at some optimization levels. Assert should therefore only be used as a debugging tool and not used for authentication verification (e.g., verifying passwords or checking array bounds). The code must not rely on the side effects of running `cond` for the correct behavior of a function.

:::

**Examples**

```julia
julia> @assert iseven(3) "3 is an odd number!"
ERROR: AssertionError: 3 is an odd number!

julia> @assert isodd(3) "What even are numbers?"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L206-L228)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Experimental.register_error_hint' href='#Base.Experimental.register_error_hint'>#</a>&nbsp;<b><u>Base.Experimental.register_error_hint</u></b> &mdash; <i>Function</i>.




```julia
Experimental.register_error_hint(handler, exceptiontype)
```


Register a &quot;hinting&quot; function `handler(io, exception)` that can suggest potential ways for users to circumvent errors.  `handler` should examine `exception` to see whether the conditions appropriate for a hint are met, and if so generate output to `io`. Packages should call `register_error_hint` from within their `__init__` function.

For specific exception types, `handler` is required to accept additional arguments:
- `MethodError`: provide `handler(io, exc::MethodError, argtypes, kwargs)`, which splits the combined arguments into positional and keyword arguments.
  

When issuing a hint, the output should typically start with `\n`.

If you define custom exception types, your `showerror` method can support hints by calling [`Experimental.show_error_hints`](/base/base#Base.Experimental.show_error_hints).

**Examples**

```
julia> module Hinter

       only_int(x::Int)      = 1
       any_number(x::Number) = 2

       function __init__()
           Base.Experimental.register_error_hint(MethodError) do io, exc, argtypes, kwargs
               if exc.f == only_int
                    # Color is not necessary, this is just to show it's possible.
                    print(io, "\nDid you mean to call ")
                    printstyled(io, "`any_number`?", color=:cyan)
               end
           end
       end

       end
```


Then if you call `Hinter.only_int` on something that isn&#39;t an `Int` (thereby triggering a `MethodError`), it issues the hint:

```
julia> Hinter.only_int(1.0)
ERROR: MethodError: no method matching only_int(::Float64)
The function `only_int` exists, but no method is defined for this combination of argument types.
Did you mean to call `any_number`?
Closest candidates are:
    ...
```


::: tip Julia 1.5

Custom error hints are available as of Julia 1.5.

:::

::: warning Warning

This interface is experimental and subject to change or removal without notice. To insulate yourself against changes, consider putting any registrations inside an `if isdefined(Base.Experimental, :register_error_hint) ... end` block.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/experimental.jl#L237-L295)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Experimental.show_error_hints' href='#Base.Experimental.show_error_hints'>#</a>&nbsp;<b><u>Base.Experimental.show_error_hints</u></b> &mdash; <i>Function</i>.




```julia
Experimental.show_error_hints(io, ex, args...)
```


Invoke all handlers from [`Experimental.register_error_hint`](/base/base#Base.Experimental.register_error_hint) for the particular exception type `typeof(ex)`. `args` must contain any other arguments expected by the handler for that type.

::: tip Julia 1.5

Custom error hints are available as of Julia 1.5.

:::

::: warning Warning

This interface is experimental and subject to change or removal without notice.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/experimental.jl#L304-L315)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.ArgumentError' href='#Core.ArgumentError'>#</a>&nbsp;<b><u>Core.ArgumentError</u></b> &mdash; <i>Type</i>.




```julia
ArgumentError(msg)
```


The arguments passed to a function are invalid. `msg` is a descriptive error message.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3070-L3075)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.AssertionError' href='#Core.AssertionError'>#</a>&nbsp;<b><u>Core.AssertionError</u></b> &mdash; <i>Type</i>.




```julia
AssertionError([msg])
```


The asserted condition did not evaluate to `true`. Optional argument `msg` is a descriptive error string.

**Examples**

```julia
julia> @assert false "this is not true"
ERROR: AssertionError: this is not true
```


`AssertionError` is usually thrown from [`@assert`](/base/base#Base.@assert).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3086-L3099)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.BoundsError' href='#Core.BoundsError'>#</a>&nbsp;<b><u>Core.BoundsError</u></b> &mdash; <i>Type</i>.




```julia
BoundsError([a],[i])
```


An indexing operation into an array, `a`, tried to access an out-of-bounds element at index `i`.

**Examples**

```julia
julia> A = fill(1.0, 7);

julia> A[8]
ERROR: BoundsError: attempt to access 7-element Vector{Float64} at index [8]


julia> B = fill(1.0, (2,3));

julia> B[2, 4]
ERROR: BoundsError: attempt to access 2×3 Matrix{Float64} at index [2, 4]


julia> B[9]
ERROR: BoundsError: attempt to access 2×3 Matrix{Float64} at index [9]

```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1721-L1744)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.CompositeException' href='#Base.CompositeException'>#</a>&nbsp;<b><u>Base.CompositeException</u></b> &mdash; <i>Type</i>.




```julia
CompositeException
```


Wrap a `Vector` of exceptions thrown by a [`Task`](/base/parallel#Core.Task) (e.g. generated from a remote worker over a channel or an asynchronously executing local I/O write or a remote worker under `pmap`) with information about the series of exceptions. For example, if a group of workers are executing several tasks, and multiple workers fail, the resulting `CompositeException` will contain a &quot;bundle&quot; of information from each worker indicating where and why the exception(s) occurred.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/task.jl#L38-L45)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.DimensionMismatch' href='#Base.DimensionMismatch'>#</a>&nbsp;<b><u>Base.DimensionMismatch</u></b> &mdash; <i>Type</i>.




```julia
DimensionMismatch([msg])
```


The objects called do not have matching dimensionality. Optional argument `msg` is a descriptive error string.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/array.jl#L5-L10)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.DivideError' href='#Core.DivideError'>#</a>&nbsp;<b><u>Core.DivideError</u></b> &mdash; <i>Type</i>.




```julia
DivideError()
```


Integer division was attempted with a denominator value of 0.

**Examples**

```julia
julia> 2/0
Inf

julia> div(2, 0)
ERROR: DivideError: integer division error
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2009-L2024)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.DomainError' href='#Core.DomainError'>#</a>&nbsp;<b><u>Core.DomainError</u></b> &mdash; <i>Type</i>.




```julia
DomainError(val)
DomainError(val, msg)
```


The argument `val` to a function or constructor is outside the valid domain.

**Examples**

```julia
julia> sqrt(-1)
ERROR: DomainError with -1.0:
sqrt was called with a negative real argument but will only return a complex result if called with a complex argument. Try sqrt(Complex(x)).
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1762-L1776)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.EOFError' href='#Base.EOFError'>#</a>&nbsp;<b><u>Base.EOFError</u></b> &mdash; <i>Type</i>.




```julia
EOFError()
```


No more data was available to read from a file or stream.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/io.jl#L5-L9)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.ErrorException' href='#Core.ErrorException'>#</a>&nbsp;<b><u>Core.ErrorException</u></b> &mdash; <i>Type</i>.




```julia
ErrorException(msg)
```


Generic error type. The error message, in the `.msg` field, may provide more specific details.

**Examples**

```julia
julia> ex = ErrorException("I've done a bad thing");

julia> ex.msg
"I've done a bad thing"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1628-L1640)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.InexactError' href='#Core.InexactError'>#</a>&nbsp;<b><u>Core.InexactError</u></b> &mdash; <i>Type</i>.




```julia
InexactError(name::Symbol, T, val)
```


Cannot exactly convert `val` to type `T` in a method of function `name`.

**Examples**

```julia
julia> convert(Float64, 1+2im)
ERROR: InexactError: Float64(1 + 2im)
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1747-L1759)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.InterruptException' href='#Core.InterruptException'>#</a>&nbsp;<b><u>Core.InterruptException</u></b> &mdash; <i>Type</i>.




```julia
InterruptException()
```


The process was stopped by a terminal interrupt (CTRL+C).

Note that, in Julia script started without `-i` (interactive) option, `InterruptException` is not thrown by default.  Calling [`Base.exit_on_sigint(false)`](/base/c#Base.exit_on_sigint) in the script can recover the behavior of the REPL.  Alternatively, a Julia script can be started with

```sh
julia -e "include(popfirst!(ARGS))" script.jl
```


to let `InterruptException` be thrown by CTRL+C during the execution.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1894-L1910)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.KeyError' href='#Base.KeyError'>#</a>&nbsp;<b><u>Base.KeyError</u></b> &mdash; <i>Type</i>.




```julia
KeyError(key)
```


An indexing operation into an `AbstractDict` (`Dict`) or `Set` like object tried to access or delete a non-existent element.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/abstractdict.jl#L5-L10)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.LoadError' href='#Core.LoadError'>#</a>&nbsp;<b><u>Core.LoadError</u></b> &mdash; <i>Type</i>.




```julia
LoadError(file::AbstractString, line::Int, error)
```


An error occurred while [`include`](/base/base#Base.include)ing, [`require`](/base/base#Base.require)ing, or [`using`](/base/base#using) a file. The error specifics should be available in the `.error` field.

::: tip Julia 1.7

LoadErrors are no longer emitted by `@macroexpand`, `@macroexpand1`, and `macroexpand` as of Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3102-L3110)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.MethodError' href='#Core.MethodError'>#</a>&nbsp;<b><u>Core.MethodError</u></b> &mdash; <i>Type</i>.




```julia
MethodError(f, args)
```


A method with the required type signature does not exist in the given generic function. Alternatively, there is no unique most-specific method.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3078-L3083)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.MissingException' href='#Base.MissingException'>#</a>&nbsp;<b><u>Base.MissingException</u></b> &mdash; <i>Type</i>.




```julia
MissingException(msg)
```


Exception thrown when a [`missing`](/manual/missing#missing) value is encountered in a situation where it is not supported. The error message, in the `msg` field may provide more specific details.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/missing.jl#L7-L13)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.OutOfMemoryError' href='#Core.OutOfMemoryError'>#</a>&nbsp;<b><u>Core.OutOfMemoryError</u></b> &mdash; <i>Type</i>.




```julia
OutOfMemoryError()
```


An operation allocated too much memory for either the system or the garbage collector to handle properly.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1713-L1718)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.ReadOnlyMemoryError' href='#Core.ReadOnlyMemoryError'>#</a>&nbsp;<b><u>Core.ReadOnlyMemoryError</u></b> &mdash; <i>Type</i>.




```julia
ReadOnlyMemoryError()
```


An operation tried to write to memory that is read-only.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1621-L1625)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.OverflowError' href='#Core.OverflowError'>#</a>&nbsp;<b><u>Core.OverflowError</u></b> &mdash; <i>Type</i>.




```julia
OverflowError(msg)
```


The result of an expression is too large for the specified type and will cause a wraparound.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1880-L1884)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ProcessFailedException' href='#Base.ProcessFailedException'>#</a>&nbsp;<b><u>Base.ProcessFailedException</u></b> &mdash; <i>Type</i>.




```julia
ProcessFailedException
```


Indicates problematic exit status of a process. When running commands or pipelines, this is thrown to indicate a nonzero exit code was returned (i.e. that the invoked process failed).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/process.jl#L572-L578)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.TaskFailedException' href='#Base.TaskFailedException'>#</a>&nbsp;<b><u>Base.TaskFailedException</u></b> &mdash; <i>Type</i>.




```julia
TaskFailedException
```


This exception is thrown by a [`wait(t)`](/base/parallel#Base.wait) call when task `t` fails. `TaskFailedException` wraps the failed task `t`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/task.jl#L69-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.StackOverflowError' href='#Core.StackOverflowError'>#</a>&nbsp;<b><u>Core.StackOverflowError</u></b> &mdash; <i>Type</i>.




```julia
StackOverflowError()
```


The function call grew beyond the size of the call stack. This usually happens when a call recurses infinitely.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1803-L1808)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.SystemError' href='#Base.SystemError'>#</a>&nbsp;<b><u>Base.SystemError</u></b> &mdash; <i>Type</i>.




```julia
SystemError(prefix::AbstractString, [errno::Int32])
```


A system call failed with an error code (in the `errno` global variable).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/io.jl#L12-L16)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.TypeError' href='#Core.TypeError'>#</a>&nbsp;<b><u>Core.TypeError</u></b> &mdash; <i>Type</i>.




```julia
TypeError(func::Symbol, context::AbstractString, expected::Type, got)
```


A type assertion failure, or calling an intrinsic function with an incorrect argument type.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1887-L1891)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UndefKeywordError' href='#Core.UndefKeywordError'>#</a>&nbsp;<b><u>Core.UndefKeywordError</u></b> &mdash; <i>Type</i>.




```julia
UndefKeywordError(var::Symbol)
```


The required keyword argument `var` was not assigned in a function call.

**Examples**

```julia
julia> function my_func(;my_arg)
           return my_arg + 1
       end
my_func (generic function with 1 method)

julia> my_func()
ERROR: UndefKeywordError: keyword argument `my_arg` not assigned
Stacktrace:
 [1] my_func() at ./REPL[1]:2
 [2] top-level scope at REPL[2]:1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1859-L1877)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UndefRefError' href='#Core.UndefRefError'>#</a>&nbsp;<b><u>Core.UndefRefError</u></b> &mdash; <i>Type</i>.




```julia
UndefRefError()
```


The item or field is not defined for the given object.

**Examples**

```julia
julia> struct MyType
           a::Vector{Int}
           MyType() = new()
       end

julia> A = MyType()
MyType(#undef)

julia> A.a
ERROR: UndefRefError: access to undefined reference
Stacktrace:
[...]
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1652-L1672)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.UndefVarError' href='#Core.UndefVarError'>#</a>&nbsp;<b><u>Core.UndefVarError</u></b> &mdash; <i>Type</i>.




```julia
UndefVarError(var::Symbol, [scope])
```


A symbol in the current scope is not defined.

**Examples**

```julia
julia> a
ERROR: UndefVarError: `a` not defined in `Main`

julia> a = 1;

julia> a
1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L1841-L1856)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.StringIndexError' href='#Base.StringIndexError'>#</a>&nbsp;<b><u>Base.StringIndexError</u></b> &mdash; <i>Type</i>.




```julia
StringIndexError(str, i)
```


An error occurred when trying to access `str` at index `i` that is not valid.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/strings/string.jl#L3-L7)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.InitError' href='#Core.InitError'>#</a>&nbsp;<b><u>Core.InitError</u></b> &mdash; <i>Type</i>.




```julia
InitError(mod::Symbol, error)
```


An error occurred when running a module&#39;s `__init__` function. The actual error thrown is available in the `.error` field.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3113-L3118)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.retry' href='#Base.retry'>#</a>&nbsp;<b><u>Base.retry</u></b> &mdash; <i>Function</i>.




```julia
retry(f;  delays=ExponentialBackOff(), check=nothing) -> Function
```


Return an anonymous function that calls function `f`.  If an exception arises, `f` is repeatedly called again, each time `check` returns `true`, after waiting the number of seconds specified in `delays`.  `check` should input `delays`&#39;s current state and the `Exception`.

::: tip Julia 1.2

Before Julia 1.2 this signature was restricted to `f::Function`.

:::

**Examples**

```julia
retry(f, delays=fill(5.0, 3))
retry(f, delays=rand(5:10, 2))
retry(f, delays=Base.ExponentialBackOff(n=3, first_delay=5, max_delay=1000))
retry(http_get, check=(s,e)->e.status == "503")(url)
retry(read, check=(s,e)->isa(e, IOError))(io, 128; all=false)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L281-L300)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ExponentialBackOff' href='#Base.ExponentialBackOff'>#</a>&nbsp;<b><u>Base.ExponentialBackOff</u></b> &mdash; <i>Type</i>.




```julia
ExponentialBackOff(; n=1, first_delay=0.05, max_delay=10.0, factor=5.0, jitter=0.1)
```


A [`Float64`](/base/numbers#Core.Float64) iterator of length `n` whose elements exponentially increase at a rate in the interval `factor` * (1 ± `jitter`).  The first element is `first_delay` and all elements are clamped to `max_delay`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/error.jl#L262-L268)

</div>
<br>

## Events
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Timer-Tuple{Function, Real}' href='#Base.Timer-Tuple{Function, Real}'>#</a>&nbsp;<b><u>Base.Timer</u></b> &mdash; <i>Method</i>.




```julia
Timer(callback::Function, delay; interval = 0)
```


Create a timer that runs the function `callback` at each timer expiration.

Waiting tasks are woken and the function `callback` is called after an initial delay of `delay` seconds, and then repeating with the given `interval` in seconds. If `interval` is equal to `0`, the callback is only run once. The function `callback` is called with a single argument, the timer itself. Stop a timer by calling `close`. The `callback` may still be run one final time, if the timer has already expired.

**Examples**

Here the first number is printed after a delay of two seconds, then the following numbers are printed quickly.

```julia
julia> begin
           i = 0
           cb(timer) = (global i += 1; println(i))
           t = Timer(cb, 2, interval=0.2)
           wait(t)
           sleep(0.5)
           close(t)
       end
1
2
3
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/asyncevent.jl#L270-L299)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Timer' href='#Base.Timer'>#</a>&nbsp;<b><u>Base.Timer</u></b> &mdash; <i>Type</i>.




```julia
Timer(delay; interval = 0)
```


Create a timer that wakes up tasks waiting for it (by calling [`wait`](/base/parallel#Base.wait) on the timer object).

Waiting tasks are woken after an initial delay of at least `delay` seconds, and then repeating after at least `interval` seconds again elapse. If `interval` is equal to `0`, the timer is only triggered once. When the timer is closed (by [`close`](/base/io-network#Base.close)) waiting tasks are woken with an error. Use [`isopen`](/base/io-network#Base.isopen) to check whether a timer is still active.

::: tip Note

`interval` is subject to accumulating time skew. If you need precise events at a particular absolute time, create a new timer at each expiration with the difference to the next time computed.

:::

::: tip Note

A `Timer` requires yield points to update its state. For instance, `isopen(t::Timer)` cannot be used to timeout a non-yielding while loop.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/asyncevent.jl#L69-L87)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AsyncCondition' href='#Base.AsyncCondition'>#</a>&nbsp;<b><u>Base.AsyncCondition</u></b> &mdash; <i>Type</i>.




```julia
AsyncCondition()
```


Create a async condition that wakes up tasks waiting for it (by calling [`wait`](/base/parallel#Base.wait) on the object) when notified from C by a call to `uv_async_send`. Waiting tasks are woken with an error when the object is closed (by [`close`](/base/io-network#Base.close)). Use [`isopen`](/base/io-network#Base.isopen) to check whether it is still active.

This provides an implicit acquire &amp; release memory ordering between the sending and waiting threads.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/asyncevent.jl#L5-L15)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.AsyncCondition-Tuple{Function}' href='#Base.AsyncCondition-Tuple{Function}'>#</a>&nbsp;<b><u>Base.AsyncCondition</u></b> &mdash; <i>Method</i>.




```julia
AsyncCondition(callback::Function)
```


Create a async condition that calls the given `callback` function. The `callback` is passed one argument, the async condition object itself.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/asyncevent.jl#L40-L45)

</div>
<br>

## Reflection
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nameof-Tuple{Module}' href='#Base.nameof-Tuple{Module}'>#</a>&nbsp;<b><u>Base.nameof</u></b> &mdash; <i>Method</i>.




```julia
nameof(m::Module) -> Symbol
```


Get the name of a `Module` as a [`Symbol`](/base/base#Core.Symbol).

**Examples**

```julia
julia> nameof(Base.Broadcast)
:Broadcast
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L367-L377)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.parentmodule' href='#Base.parentmodule'>#</a>&nbsp;<b><u>Base.parentmodule</u></b> &mdash; <i>Function</i>.




```julia
parentmodule(m::Module) -> Module
```


Get a module&#39;s enclosing `Module`. `Main` is its own parent.

See also: [`names`](/base/base#Base.names), [`nameof`](/base/base#Base.nameof-Tuple{DataType}), [`fullname`](/base/base#Base.fullname), [`@__MODULE__`](/base/base#Base.@__MODULE__).

**Examples**

```julia
julia> parentmodule(Main)
Main

julia> parentmodule(Base.Broadcast)
Base
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L5-L20)



```julia
parentmodule(t::DataType) -> Module
```


Determine the module containing the definition of a (potentially `UnionAll`-wrapped) `DataType`.

**Examples**

```julia
julia> module Foo
           struct Int end
       end
Foo

julia> parentmodule(Int)
Core

julia> parentmodule(Foo.Int)
Foo
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L313-L331)



```julia
parentmodule(f::Function) -> Module
```


Determine the module containing the (first) definition of a generic function.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2322-L2327)



```julia
parentmodule(f::Function, types) -> Module
```


Determine the module containing the first method of a generic function `f` matching the specified `types`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2330-L2335)



```julia
parentmodule(m::Method) -> Module
```


Return the module in which the given method `m` is defined.

::: tip Julia 1.9

Passing a `Method` as an argument requires Julia 1.9 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2344-L2351)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pathof-Tuple{Module}' href='#Base.pathof-Tuple{Module}'>#</a>&nbsp;<b><u>Base.pathof</u></b> &mdash; <i>Method</i>.




```julia
pathof(m::Module)
```


Return the path of the `m.jl` file that was used to `import` module `m`, or `nothing` if `m` was not imported from a package.

Use [`dirname`](/base/file#Base.Filesystem.dirname) to get the directory part and [`basename`](/base/file#Base.Filesystem.basename) to get the file name part of the path.

See also [`pkgdir`](/base/base#Base.pkgdir-Tuple{Module}).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L474-L484)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pkgdir-Tuple{Module}' href='#Base.pkgdir-Tuple{Module}'>#</a>&nbsp;<b><u>Base.pkgdir</u></b> &mdash; <i>Method</i>.




```julia
pkgdir(m::Module[, paths::String...])
```


Return the root directory of the package that declared module `m`, or `nothing` if `m` was not declared in a package. Optionally further path component strings can be provided to construct a path within the package root.

To get the root directory of the package that implements the current module the form `pkgdir(@__MODULE__)` can be used.

```julia
julia> pkgdir(Foo)
"/path/to/Foo.jl"

julia> pkgdir(Foo, "src", "file.jl")
"/path/to/Foo.jl/src/file.jl"
```


See also [`pathof`](/base/base#Base.pathof-Tuple{Module}).

::: tip Julia 1.7

The optional argument `paths` requires at least Julia 1.7.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L497-L520)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.pkgversion-Tuple{Module}' href='#Base.pkgversion-Tuple{Module}'>#</a>&nbsp;<b><u>Base.pkgversion</u></b> &mdash; <i>Method</i>.




```julia
pkgversion(m::Module)
```


Return the version of the package that imported module `m`, or `nothing` if `m` was not imported from a package, or imported from a package without a version field set.

The version is read from the package&#39;s Project.toml during package load.

To get the version of the package that imported the current module the form `pkgversion(@__MODULE__)` can be used.

::: tip Julia 1.9

This function was introduced in Julia 1.9.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L540-L555)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.moduleroot' href='#Base.moduleroot'>#</a>&nbsp;<b><u>Base.moduleroot</u></b> &mdash; <i>Function</i>.




```julia
moduleroot(m::Module) -> Module
```


Find the root module of a given module. This is the first module in the chain of parent modules of `m` which is either a registered root module or which is its own parent module.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L25-L31)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='__module__' href='#__module__'>#</a>&nbsp;<b><u>__module__</u></b> &mdash; <i>Keyword</i>.




```julia
__module__
```


The argument `__module__` is only visible inside the macro, and it provides information (in the form of a `Module` object) about the expansion context of the macro invocation. See the manual section on [Macro invocation](/manual/metaprogramming#Macro-invocation) for more information.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L255-L261)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='__source__' href='#__source__'>#</a>&nbsp;<b><u>__source__</u></b> &mdash; <i>Keyword</i>.




```julia
__source__
```


The argument `__source__` is only visible inside the macro, and it provides information (in the form of a `LineNumberNode` object) about the parser location of the `@` sign from the macro invocation. See the manual section on [Macro invocation](/manual/metaprogramming#Macro-invocation) for more information.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L264-L270)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@__MODULE__' href='#Base.@__MODULE__'>#</a>&nbsp;<b><u>Base.@__MODULE__</u></b> &mdash; <i>Macro</i>.




```julia
@__MODULE__ -> Module
```


Get the `Module` of the toplevel eval, which is the `Module` code is currently being read from.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L42-L47)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@__FILE__' href='#Base.@__FILE__'>#</a>&nbsp;<b><u>Base.@__FILE__</u></b> &mdash; <i>Macro</i>.




```julia
@__FILE__ -> String
```


Expand to a string with the path to the file containing the macrocall, or an empty string if evaluated by `julia -e <expr>`. Return `nothing` if the macro was missing parser source information. Alternatively see [`PROGRAM_FILE`](/base/constants#Base.PROGRAM_FILE).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L3848-L3855)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@__DIR__' href='#Base.@__DIR__'>#</a>&nbsp;<b><u>Base.@__DIR__</u></b> &mdash; <i>Macro</i>.




```julia
@__DIR__ -> String
```


Macro to obtain the absolute path of the current directory as a string.

If in a script, returns the directory of the script containing the `@__DIR__` macrocall. If run from a REPL or if evaluated by `julia -e <expr>`, returns the current working directory.

**Examples**

The example illustrates the difference in the behaviors of `@__DIR__` and `pwd()`, by creating a simple script in a different directory than the current working one and executing both commands:

```julia
julia> cd("/home/JuliaUser") # working directory

julia> # create script at /home/JuliaUser/Projects
       open("/home/JuliaUser/Projects/test.jl","w") do io
           print(io, """
               println("@__DIR__ = ", @__DIR__)
               println("pwd() = ", pwd())
           """)
       end

julia> # outputs script directory and current working directory
       include("/home/JuliaUser/Projects/test.jl")
@__DIR__ = /home/JuliaUser/Projects
pwd() = /home/JuliaUser
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L3861-L3890)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@__LINE__' href='#Base.@__LINE__'>#</a>&nbsp;<b><u>Base.@__LINE__</u></b> &mdash; <i>Macro</i>.




```julia
@__LINE__ -> Int
```


Expand to the line number of the location of the macrocall. Return `0` if the line number could not be determined.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/essentials.jl#L1182-L1187)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.fullname' href='#Base.fullname'>#</a>&nbsp;<b><u>Base.fullname</u></b> &mdash; <i>Function</i>.




```julia
fullname(m::Module)
```


Get the fully-qualified name of a module as a tuple of symbols. For example,

**Examples**

```julia
julia> fullname(Base.Iterators)
(:Base, :Iterators)

julia> fullname(Main)
(:Main,)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L52-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.names' href='#Base.names'>#</a>&nbsp;<b><u>Base.names</u></b> &mdash; <i>Function</i>.




```julia
names(x::Module; all::Bool=false, imported::Bool=false, usings::Bool=false) -> Vector{Symbol}
```


Get a vector of the public names of a `Module`, excluding deprecated names. If `all` is true, then the list also includes non-public names defined in the module, deprecated names, and compiler-generated names. If `imported` is true, then names explicitly imported from other modules are also included. If `usings` is true, then names explicitly imported via `using` are also included. Names are returned in sorted order.

As a special case, all names defined in `Main` are considered &quot;public&quot;, since it is not idiomatic to explicitly mark names from `Main` as public.

::: tip Note

`sym ∈ names(SomeModule)` does _not_ imply `isdefined(SomeModule, sym)`. `names` may return symbols marked with `public` or `export`, even if they are not defined in the module.

:::

::: warning Warning

`names` may return duplicate names. The duplication happens, e.g. if an `import`ed name conflicts with an already existing identifier.

:::

See also: [`Base.isexported`](/base/base#Base.isexported), [`Base.ispublic`](/base/base#Base.ispublic), [`Base.@locals`](/base/base#Base.@locals), [`@__MODULE__`](/base/base#Base.@__MODULE__).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L79-L103)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isexported' href='#Base.isexported'>#</a>&nbsp;<b><u>Base.isexported</u></b> &mdash; <i>Function</i>.




```julia
isexported(m::Module, s::Symbol) -> Bool
```


Returns whether a symbol is exported from a module.

See also: [`ispublic`](/base/base#Base.ispublic), [`names`](/base/base#Base.names)

```julia
julia> module Mod
           export foo
           public bar
       end
Mod

julia> Base.isexported(Mod, :foo)
true

julia> Base.isexported(Mod, :bar)
false

julia> Base.isexported(Mod, :baz)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L108-L131)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.ispublic' href='#Base.ispublic'>#</a>&nbsp;<b><u>Base.ispublic</u></b> &mdash; <i>Function</i>.




```julia
ispublic(m::Module, s::Symbol) -> Bool
```


Returns whether a symbol is marked as public in a module.

Exported symbols are considered public.

::: tip Julia 1.11

This function and the notion of publicity were added in Julia 1.11.

:::

See also: [`isexported`](/base/base#Base.isexported), [`names`](/base/base#Base.names)

```julia
julia> module Mod
           export foo
           public bar
       end
Mod

julia> Base.ispublic(Mod, :foo)
true

julia> Base.ispublic(Mod, :bar)
true

julia> Base.ispublic(Mod, :baz)
false
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L134-L162)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.nameof-Tuple{Function}' href='#Base.nameof-Tuple{Function}'>#</a>&nbsp;<b><u>Base.nameof</u></b> &mdash; <i>Method</i>.




```julia
nameof(f::Function) -> Symbol
```


Get the name of a generic `Function` as a symbol. For anonymous functions, this is a compiler-generated name. For explicitly-declared subtypes of `Function`, it is the name of the function&#39;s type.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L2300-L2306)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.functionloc-Tuple{Any, Any}' href='#Base.functionloc-Tuple{Any, Any}'>#</a>&nbsp;<b><u>Base.functionloc</u></b> &mdash; <i>Method</i>.




```julia
functionloc(f::Function, types)
```


Return a tuple `(filename,line)` giving the location of a generic `Function` definition.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/methodshow.jl#L174-L178)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.functionloc-Tuple{Method}' href='#Base.functionloc-Tuple{Method}'>#</a>&nbsp;<b><u>Base.functionloc</u></b> &mdash; <i>Method</i>.




```julia
functionloc(m::Method)
```


Return a tuple `(filename,line)` giving the location of a `Method` definition.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/methodshow.jl#L161-L165)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@locals' href='#Base.@locals'>#</a>&nbsp;<b><u>Base.@locals</u></b> &mdash; <i>Macro</i>.




```julia
@locals()
```


Construct a dictionary of the names (as symbols) and values of all local variables defined as of the call site.

::: tip Julia 1.1

This macro requires at least Julia 1.1.

:::

**Examples**

```julia
julia> let x = 1, y = 2
           Base.@locals
       end
Dict{Symbol, Any} with 2 entries:
  :y => 2
  :x => 1

julia> function f(x)
           local y
           show(Base.@locals); println()
           for i = 1:1
               show(Base.@locals); println()
           end
           y = 2
           show(Base.@locals); println()
           nothing
       end;

julia> f(42)
Dict{Symbol, Any}(:x => 42)
Dict{Symbol, Any}(:i => 1, :x => 42)
Dict{Symbol, Any}(:y => 2, :x => 42)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L395-L429)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.getglobal' href='#Core.getglobal'>#</a>&nbsp;<b><u>Core.getglobal</u></b> &mdash; <i>Function</i>.




```julia
getglobal(module::Module, name::Symbol, [order::Symbol=:monotonic])
```


Retrieve the value of the binding `name` from the module `module`. Optionally, an atomic ordering can be defined for the operation, otherwise it defaults to monotonic.

While accessing module bindings using [`getfield`](/base/base#Core.getfield) is still supported to maintain compatibility, using `getglobal` should always be preferred since `getglobal` allows for control over atomic ordering (`getfield` is always monotonic) and better signifies the code&#39;s intent both to the user as well as the compiler.

Most users should not have to call this function directly – The [`getproperty`](/base/base#Base.getproperty) function or corresponding syntax (i.e. `module.name`) should be preferred in all but few very specific use cases.

::: tip Julia 1.9

This function requires Julia 1.9 or later.

:::

See also [`getproperty`](/base/base#Base.getproperty) and [`setglobal!`](/base/base#Core.setglobal!).

**Examples**

```julia
julia> a = 1
1

julia> module M
       a = 2
       end;

julia> getglobal(@__MODULE__, :a)
1

julia> getglobal(M, :a)
2
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2451-L2488)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.setglobal!' href='#Core.setglobal!'>#</a>&nbsp;<b><u>Core.setglobal!</u></b> &mdash; <i>Function</i>.




```julia
setglobal!(module::Module, name::Symbol, x, [order::Symbol=:monotonic])
```


Set or change the value of the binding `name` in the module `module` to `x`. No type conversion is performed, so if a type has already been declared for the binding, `x` must be of appropriate type or an error is thrown.

Additionally, an atomic ordering can be specified for this operation, otherwise it defaults to monotonic.

Users will typically access this functionality through the [`setproperty!`](/base/base#Base.setproperty!) function or corresponding syntax (i.e. `module.name = x`) instead, so this is intended only for very specific use cases.

::: tip Julia 1.9

This function requires Julia 1.9 or later.

:::

See also [`setproperty!`](/base/base#Base.setproperty!) and [`getglobal`](/base/base#Core.getglobal)

**Examples**

```julia
julia> module M end;

julia> M.a  # same as `getglobal(M, :a)`
ERROR: UndefVarError: `a` not defined in `M`
Suggestion: check for spelling errors or missing imports.

julia> setglobal!(M, :a, 1)
1

julia> M.a
1
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2492-L2526)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.modifyglobal!' href='#Core.modifyglobal!'>#</a>&nbsp;<b><u>Core.modifyglobal!</u></b> &mdash; <i>Function</i>.




```julia
modifyglobal!(module::Module, name::Symbol, op, x, [order::Symbol=:monotonic]) -> Pair
```


Atomically perform the operations to get and set a global after applying the function `op`.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`modifyproperty!`](/base/base#Base.modifyproperty!) and [`setglobal!`](/base/base#Core.setglobal!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2563-L2573)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.swapglobal!' href='#Core.swapglobal!'>#</a>&nbsp;<b><u>Core.swapglobal!</u></b> &mdash; <i>Function</i>.




```julia
swapglobal!(module::Module, name::Symbol, x, [order::Symbol=:monotonic])
```


Atomically perform the operations to simultaneously get and set a global.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`swapproperty!`](/base/base#Base.swapproperty!) and [`setglobal!`](/base/base#Core.setglobal!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2551-L2560)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.setglobalonce!' href='#Core.setglobalonce!'>#</a>&nbsp;<b><u>Core.setglobalonce!</u></b> &mdash; <i>Function</i>.




```julia
setglobalonce!(module::Module, name::Symbol, value,
              [success_order::Symbol, [fail_order::Symbol=success_order]) -> success::Bool
```


Atomically perform the operations to set a global to a given value, only if it was previously not set.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`setpropertyonce!`](/base/base#Base.setpropertyonce!) and [`setglobal!`](/base/base#Core.setglobal!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2590-L2601)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.replaceglobal!' href='#Core.replaceglobal!'>#</a>&nbsp;<b><u>Core.replaceglobal!</u></b> &mdash; <i>Function</i>.




```julia
replaceglobal!(module::Module, name::Symbol, expected, desired,
              [success_order::Symbol, [fail_order::Symbol=success_order]) -> (; old, success::Bool)
```


Atomically perform the operations to get and conditionally set a global to a given value.

::: tip Julia 1.11

This function requires Julia 1.11 or later.

:::

See also [`replaceproperty!`](/base/base#Base.replaceproperty!) and [`setglobal!`](/base/base#Core.setglobal!).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L2576-L2587)

</div>
<br>

## Documentation

(See also the [documentation](/manual/documentation#man-documentation) chapter.)
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.@doc' href='#Core.@doc'>#</a>&nbsp;<b><u>Core.@doc</u></b> &mdash; <i>Macro</i>.




**Documentation**

Functions, methods and types can be documented by placing a string before the definition:

```
"""
    foo(x)

Return a fooified version of `x`.
"""
foo(x) = ...
```


The `@doc` macro can be used directly to both set and retrieve documentation / metadata. The macro has special parsing so that the documented object may occur on the next line:

```
@doc "blah"
function foo() ...
```


By default, documentation is written as Markdown, but any object can be used as the first argument.

**Documenting objects separately from their definitions**

You can document an object before or after its definition with

```
@doc "foo" function_to_doc
@doc "bar" TypeToDoc
```


For macros, the syntax is `@doc "macro doc" :(Module.@macro)` or `@doc "macro doc" :(string_macro"")` for string macros. Without the quote `:()` the expansion of the macro will be documented.

**Retrieving Documentation**

You can retrieve docs for functions, macros and other objects as follows:

```
@doc foo
@doc @time
@doc md""
```


**Functions &amp; Methods**

Placing documentation before a method definition (e.g. `function foo() ...` or `foo() = ...`) will cause that specific method to be documented, as opposed to the whole function. Method docs are concatenated together in the order they were defined to provide docs for the function.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/Docs.jl#L16-L59)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Docs.HTML' href='#Base.Docs.HTML'>#</a>&nbsp;<b><u>Base.Docs.HTML</u></b> &mdash; <i>Type</i>.




`HTML(s)`: Create an object that renders `s` as html.

```
HTML("<div>foo</div>")
```


You can also use a stream for large amounts of data:

```
HTML() do io
  println(io, "<div>foo</div>")
end
```


::: warning Warning

`HTML` is currently exported to maintain backwards compatibility, but this export is deprecated. It is recommended to use this type as [`Docs.HTML`](/base/base#Base.Docs.HTML) or to explicitly import it from `Docs`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/utils.jl#L11-L28)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Docs.Text' href='#Base.Docs.Text'>#</a>&nbsp;<b><u>Base.Docs.Text</u></b> &mdash; <i>Type</i>.




`Text(s)`: Create an object that renders `s` as plain text.

```
Text("foo")
```


You can also use a stream for large amounts of data:

```
Text() do io
  println(io, "foo")
end
```


::: warning Warning

`Text` is currently exported to maintain backwards compatibility, but this export is deprecated. It is recommended to use this type as [`Docs.Text`](/base/base#Base.Docs.Text) or to explicitly import it from `Docs`.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/utils.jl#L69-L86)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Docs.hasdoc' href='#Base.Docs.hasdoc'>#</a>&nbsp;<b><u>Base.Docs.hasdoc</u></b> &mdash; <i>Function</i>.




```julia
Docs.hasdoc(mod::Module, sym::Symbol)::Bool
```


Return `true` if `sym` in `mod` has a docstring and `false` otherwise.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/Docs.jl#L794-L798)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Docs.undocumented_names' href='#Base.Docs.undocumented_names'>#</a>&nbsp;<b><u>Base.Docs.undocumented_names</u></b> &mdash; <i>Function</i>.




```julia
undocumented_names(mod::Module; private=false)
```


Return a sorted vector of undocumented symbols in `module` (that is, lacking docstrings). `private=false` (the default) returns only identifiers declared with `public` and/or `export`, whereas `private=true` returns all symbols in the module (excluding compiler-generated hidden symbols starting with `#`).

See also: [`names`](/base/base#Base.names), [`Docs.hasdoc`](/base/base#Base.Docs.hasdoc), [`Base.ispublic`](/base/base#Base.ispublic).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/Docs.jl#L813-L822)

</div>
<br>

## Code loading {#Code-loading}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.identify_package' href='#Base.identify_package'>#</a>&nbsp;<b><u>Base.identify_package</u></b> &mdash; <i>Function</i>.




```julia
Base.identify_package(name::String)::Union{PkgId, Nothing}
Base.identify_package(where::Union{Module,PkgId}, name::String)::Union{PkgId, Nothing}
```


Identify the package by its name from the current environment stack, returning its `PkgId`, or `nothing` if it cannot be found.

If only the `name` argument is provided, it searches each environment in the stack and its named direct dependencies.

The `where` argument provides the context from where to search for the package: in this case it first checks if the name matches the context itself, otherwise it searches all recursive dependencies (from the resolved manifest of each environment) until it locates the context `where`, and from there identifies the dependency with the corresponding name.

```julia
julia> Base.identify_package("Pkg") # Pkg is a dependency of the default environment
Pkg [44cfe95a-1eb2-52ea-b672-e2afdf69b78f]

julia> using LinearAlgebra

julia> Base.identify_package(LinearAlgebra, "Pkg") # Pkg is not a dependency of LinearAlgebra
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L364-L388)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.locate_package' href='#Base.locate_package'>#</a>&nbsp;<b><u>Base.locate_package</u></b> &mdash; <i>Function</i>.




```julia
Base.locate_package(pkg::PkgId)::Union{String, Nothing}
```


The path to the entry-point file for the package corresponding to the identifier `pkg`, or `nothing` if not found. See also [`identify_package`](/base/base#Base.identify_package).

```julia
julia> pkg = Base.identify_package("Pkg")
Pkg [44cfe95a-1eb2-52ea-b672-e2afdf69b78f]

julia> Base.locate_package(pkg)
"/path/to/julia/stdlib/v1.12/Pkg/src/Pkg.jl"
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L456-L469)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.require' href='#Base.require'>#</a>&nbsp;<b><u>Base.require</u></b> &mdash; <i>Function</i>.




```julia
require(into::Module, module::Symbol)
```


This function is part of the implementation of [`using`](/base/base#using) / [`import`](/base/base#import), if a module is not already defined in `Main`. It can also be called directly to force reloading a module, regardless of whether it has been loaded before (for example, when interactively developing libraries).

Loads a source file, in the context of the `Main` module, on every active node, searching standard locations for files. `require` is considered a top-level operation, so it sets the current `include` path but does not use it to search for files (see help for [`include`](/base/base#Base.include)). This function is typically used to load library code, and is implicitly called by `using` to load packages.

When searching for files, `require` first looks for package code in the global array [`LOAD_PATH`](/base/constants#Base.LOAD_PATH). `require` is case-sensitive on all platforms, including those with case-insensitive filesystems like macOS and Windows.

For more details regarding code loading, see the manual sections on [modules](/manual/modules#modules) and [parallel computing](/manual/distributed-computing#code-availability).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L2124-L2144)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.compilecache' href='#Base.compilecache'>#</a>&nbsp;<b><u>Base.compilecache</u></b> &mdash; <i>Function</i>.




```julia
Base.compilecache(module::PkgId)
```


Creates a precompiled cache file for a module and all of its dependencies. This can be used to reduce package load times. Cache files are stored in `DEPOT_PATH[1]/compiled`. See [Module initialization and precompilation](/manual/modules#Module-initialization-and-precompilation) for important notes.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L2899-L2906)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isprecompiled' href='#Base.isprecompiled'>#</a>&nbsp;<b><u>Base.isprecompiled</u></b> &mdash; <i>Function</i>.




```julia
Base.isprecompiled(pkg::PkgId; ignore_loaded::Bool=false)
```


Returns whether a given PkgId within the active project is precompiled.

By default this check observes the same approach that code loading takes with respect to when different versions of dependencies are currently loaded to that which is expected. To ignore loaded modules and answer as if in a fresh julia session specify `ignore_loaded=true`.

::: tip Julia 1.10

This function requires at least Julia 1.10.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L1740-L1752)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.get_extension' href='#Base.get_extension'>#</a>&nbsp;<b><u>Base.get_extension</u></b> &mdash; <i>Function</i>.




```julia
get_extension(parent::Module, extension::Symbol)
```


Return the module for `extension` of `parent` or return `nothing` if the extension is not loaded.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L1544-L1548)

</div>
<br>

## Internals
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GC.gc' href='#Base.GC.gc'>#</a>&nbsp;<b><u>Base.GC.gc</u></b> &mdash; <i>Function</i>.




```julia
GC.gc([full=true])
```


Perform garbage collection. The argument `full` determines the kind of collection: a full collection (default) traverses all live objects (i.e. full mark) and should reclaim memory from all unreachable objects. An incremental collection only reclaims memory from young objects which are not reachable.

The GC may decide to perform a full collection even if an incremental collection was requested.

::: warning Warning

Excessive use will likely lead to poor performance.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L119-L132)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GC.enable' href='#Base.GC.enable'>#</a>&nbsp;<b><u>Base.GC.enable</u></b> &mdash; <i>Function</i>.




```julia
GC.enable(on::Bool)
```


Control whether garbage collection is enabled using a boolean argument (`true` for enabled, `false` for disabled). Return previous GC state.

::: warning Warning

Disabling garbage collection should be used only with caution, as it can cause memory use to grow without bound.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L136-L145)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GC.@preserve' href='#Base.GC.@preserve'>#</a>&nbsp;<b><u>Base.GC.@preserve</u></b> &mdash; <i>Macro</i>.




```julia
GC.@preserve x1 x2 ... xn expr
```


Mark the objects `x1, x2, ...` as being _in use_ during the evaluation of the expression `expr`. This is only required in unsafe code where `expr` _implicitly uses_ memory or other resources owned by one of the `x`s.

_Implicit use_ of `x` covers any indirect use of resources logically owned by `x` which the compiler cannot see. Some examples:
- Accessing memory of an object directly via a `Ptr`
  
- Passing a pointer to `x` to `ccall`
  
- Using resources of `x` which would be cleaned up in the finalizer.
  

`@preserve` should generally not have any performance impact in typical use cases where it briefly extends object lifetime. In implementation, `@preserve` has effects such as protecting dynamically allocated objects from garbage collection.

**Examples**

When loading from a pointer with `unsafe_load`, the underlying object is implicitly used, for example `x` is implicitly used by `unsafe_load(p)` in the following:

```julia
julia> let
           x = Ref{Int}(101)
           p = Base.unsafe_convert(Ptr{Int}, x)
           GC.@preserve x unsafe_load(p)
       end
101
```


When passing pointers to `ccall`, the pointed-to object is implicitly used and should be preserved. (Note however that you should normally just pass `x` directly to `ccall` which counts as an explicit use.)

```julia
julia> let
           x = "Hello"
           p = pointer(x)
           Int(GC.@preserve x @ccall strlen(p::Cstring)::Csize_t)
           # Preferred alternative
           Int(@ccall strlen(x::Cstring)::Csize_t)
       end
5
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L186-L233)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GC.safepoint' href='#Base.GC.safepoint'>#</a>&nbsp;<b><u>Base.GC.safepoint</u></b> &mdash; <i>Function</i>.




```julia
GC.safepoint()
```


Inserts a point in the program where garbage collection may run. This can be useful in rare cases in multi-threaded programs where some threads are allocating memory (and hence may need to run GC) but other threads are doing only simple operations (no allocation, task switches, or I/O). Calling this function periodically in non-allocating threads allows garbage collection to run.

::: tip Julia 1.4

This function is available as of Julia 1.4.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L242-L254)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GC.enable_logging' href='#Base.GC.enable_logging'>#</a>&nbsp;<b><u>Base.GC.enable_logging</u></b> &mdash; <i>Function</i>.




```julia
GC.enable_logging(on::Bool)
```


When turned on, print statistics about each GC to stderr.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L257-L261)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.GC.logging_enabled' href='#Base.GC.logging_enabled'>#</a>&nbsp;<b><u>Base.GC.logging_enabled</u></b> &mdash; <i>Function</i>.




```julia
GC.logging_enabled()
```


Return whether GC logging has been enabled via [`GC.enable_logging`](/base/base#Base.GC.enable_logging).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/gcutils.jl#L266-L270)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.lower' href='#Base.Meta.lower'>#</a>&nbsp;<b><u>Base.Meta.lower</u></b> &mdash; <i>Function</i>.




```julia
lower(m, x)
```


Takes the expression `x` and returns an equivalent expression in lowered form for executing in module `m`. See also [`code_lowered`](/base/base#Base.code_lowered).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L154-L160)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.@lower' href='#Base.Meta.@lower'>#</a>&nbsp;<b><u>Base.Meta.@lower</u></b> &mdash; <i>Macro</i>.




```julia
@lower [m] x
```


Return lowered form of the expression `x` in module `m`. By default `m` is the module in which the macro is called. See also [`lower`](/base/base#Base.Meta.lower).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L163-L169)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.parse-Tuple{AbstractString, Int64}' href='#Base.Meta.parse-Tuple{AbstractString, Int64}'>#</a>&nbsp;<b><u>Base.Meta.parse</u></b> &mdash; <i>Method</i>.




```julia
parse(str, start; greedy=true, raise=true, depwarn=true, filename="none")
```


Parse the expression string and return an expression (which could later be passed to eval for execution). `start` is the code unit index into `str` of the first character to start parsing at (as with all string indexing, these are not character indices). If `greedy` is `true` (default), `parse` will try to consume as much input as it can; otherwise, it will stop as soon as it has parsed a valid expression. Incomplete but otherwise syntactically valid expressions will return `Expr(:incomplete, "(error message)")`. If `raise` is `true` (default), syntax errors other than incomplete expressions will raise an error. If `raise` is `false`, `parse` will return an expression that will raise an error upon evaluation. If `depwarn` is `false`, deprecation warnings will be suppressed. The `filename` argument is used to display diagnostics when an error is raised.

```julia
julia> Meta.parse("(α, β) = 3, 5", 1) # start of string
(:((α, β) = (3, 5)), 16)

julia> Meta.parse("(α, β) = 3, 5", 1, greedy=false)
(:((α, β)), 9)

julia> Meta.parse("(α, β) = 3, 5", 16) # end of string
(nothing, 16)

julia> Meta.parse("(α, β) = 3, 5", 11) # index of 3
(:((3, 5)), 16)

julia> Meta.parse("(α, β) = 3, 5", 11, greedy=false)
(3, 13)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L202-L233)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.parse-Tuple{AbstractString}' href='#Base.Meta.parse-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Base.Meta.parse</u></b> &mdash; <i>Method</i>.




```julia
parse(str; raise=true, depwarn=true, filename="none")
```


Parse the expression string greedily, returning a single expression. An error is thrown if there are additional characters after the first expression. If `raise` is `true` (default), syntax errors will raise an error; otherwise, `parse` will return an expression that will raise an error upon evaluation.  If `depwarn` is `false`, deprecation warnings will be suppressed. The `filename` argument is used to display diagnostics when an error is raised.

```julia
julia> Meta.parse("x = 3")
:(x = 3)

julia> Meta.parse("1.0.2")
ERROR: ParseError:
# Error @ none:1:1
1.0.2
└──┘ ── invalid numeric constant
[...]

julia> Meta.parse("1.0.2"; raise = false)
:($(Expr(:error, "invalid numeric constant "1.0."")))

julia> Meta.parse("x = ")
:($(Expr(:incomplete, "incomplete: premature end of input")))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L247-L273)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.ParseError' href='#Base.Meta.ParseError'>#</a>&nbsp;<b><u>Base.Meta.ParseError</u></b> &mdash; <i>Type</i>.




```julia
ParseError(msg)
```


The expression passed to the [`parse`](/base/base#Base.Meta.parse-Tuple{AbstractString,%20Int64}) function could not be interpreted as a valid Julia expression.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L180-L185)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Core.QuoteNode' href='#Core.QuoteNode'>#</a>&nbsp;<b><u>Core.QuoteNode</u></b> &mdash; <i>Type</i>.




```julia
QuoteNode
```


A quoted piece of code, that does not support interpolation. See the [manual section about QuoteNodes](/manual/metaprogramming#man-quote-node) for details.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/docs/basedocs.jl#L3551-L3555)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.macroexpand' href='#Base.macroexpand'>#</a>&nbsp;<b><u>Base.macroexpand</u></b> &mdash; <i>Function</i>.




```julia
macroexpand(m::Module, x; recursive=true)
```


Take the expression `x` and return an equivalent expression with all macros removed (expanded) for executing in module `m`. The `recursive` keyword controls whether deeper levels of nested macros are also expanded. This is demonstrated in the example below:

```julia
julia> module M
           macro m1()
               42
           end
           macro m2()
               :(@m1())
           end
       end
M

julia> macroexpand(M, :(@m2()), recursive=true)
42

julia> macroexpand(M, :(@m2()), recursive=false)
:(#= REPL[16]:6 =# M.@m1)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L93-L117)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@macroexpand' href='#Base.@macroexpand'>#</a>&nbsp;<b><u>Base.@macroexpand</u></b> &mdash; <i>Macro</i>.




```julia
@macroexpand [mod,] ex
```


Return equivalent expression with all macros removed (expanded). If two arguments are provided, the first is the module to evaluate in.

There are differences between `@macroexpand` and [`macroexpand`](/base/base#Base.macroexpand).
- While [`macroexpand`](/base/base#Base.macroexpand) takes a keyword argument `recursive`, `@macroexpand` is always recursive. For a non recursive macro version, see [`@macroexpand1`](/base/base#Base.@macroexpand1).
  
- While [`macroexpand`](/base/base#Base.macroexpand) has an explicit `module` argument, `@macroexpand` always expands with respect to the module in which it is called.
  

This is best seen in the following example:

```julia
julia> module M
           macro m()
               1
           end
           function f()
               (@macroexpand(@m),
                macroexpand(M, :(@m)),
                macroexpand(Main, :(@m))
               )
           end
       end
M

julia> macro m()
           2
       end
@m (macro with 1 method)

julia> M.f()
(1, 1, 2)
```


With `@macroexpand` the expression expands where `@macroexpand` appears in the code (module `M` in the example). With `macroexpand` the expression expands in the module given as the first argument.

::: tip Julia 1.11

The two-argument form requires at least Julia 1.11.

:::


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L126-L168)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.@macroexpand1' href='#Base.@macroexpand1'>#</a>&nbsp;<b><u>Base.@macroexpand1</u></b> &mdash; <i>Macro</i>.




```julia
@macroexpand1 [mod,] ex
```


Non recursive version of [`@macroexpand`](/base/base#Base.@macroexpand).


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/expr.jl#L176-L180)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.code_lowered' href='#Base.code_lowered'>#</a>&nbsp;<b><u>Base.code_lowered</u></b> &mdash; <i>Function</i>.




```julia
code_lowered(f, types; generated=true, debuginfo=:default)
```


Return an array of the lowered forms (IR) for the methods matching the given generic function and type signature.

If `generated` is `false`, the returned `CodeInfo` instances will correspond to fallback implementations. An error is thrown if no fallback implementation exists. If `generated` is `true`, these `CodeInfo` instances will correspond to the method bodies yielded by expanding the generators.

The keyword `debuginfo` controls the amount of code metadata present in the output.

Note that an error will be thrown if `types` are not leaf types when `generated` is `true` and any of the corresponding methods are an `@generated` method.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L1131-L1146)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.code_typed' href='#Base.code_typed'>#</a>&nbsp;<b><u>Base.code_typed</u></b> &mdash; <i>Function</i>.




```julia
code_typed(f, types; kw...)
```


Returns an array of type-inferred lowered form (IR) for the methods matching the given generic function and type signature.

**Keyword Arguments**
- `optimize::Bool = true`: optional, controls whether additional optimizations, such as inlining, are also applied.
  
- `debuginfo::Symbol = :default`: optional, controls the amount of code metadata present in the output, possible options are `:source` or `:none`.
  

**Internal Keyword Arguments**

This section should be considered internal, and is only for who understands Julia compiler internals.
- `world::UInt = Base.get_world_counter()`: optional, controls the world age to use when looking up methods, use current world age if not specified.
  
- `interp::Core.Compiler.AbstractInterpreter = Core.Compiler.NativeInterpreter(world)`: optional, controls the abstract interpreter to use, use the native interpreter if not specified.
  

**Examples**

One can put the argument types in a tuple to get the corresponding `code_typed`.

```julia
julia> code_typed(+, (Float64, Float64))
1-element Vector{Any}:
 CodeInfo(
1 ─ %1 = Base.add_float(x, y)::Float64
└──      return %1
) => Float64
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/reflection.jl#L1574-L1609)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.precompile' href='#Base.precompile'>#</a>&nbsp;<b><u>Base.precompile</u></b> &mdash; <i>Function</i>.




```julia
precompile(f, argtypes::Tuple{Vararg{Any}})
```


Compile the given function `f` for the argument tuple (of types) `argtypes`, but do not execute it.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L3897-L3901)



```julia
precompile(f, argtypes::Tuple{Vararg{Any}}, m::Method)
```


Precompile a specific method for the given argument types. This may be used to precompile a different method than the one that would ordinarily be chosen by dispatch, thus mimicking `invoke`.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/loading.jl#L3919-L3925)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.jit_total_bytes' href='#Base.jit_total_bytes'>#</a>&nbsp;<b><u>Base.jit_total_bytes</u></b> &mdash; <i>Function</i>.




```julia
Base.jit_total_bytes()
```


Return the total amount (in bytes) allocated by the just-in-time compiler for e.g. native code and data.


[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/timing.jl#L108-L113)

</div>
<br>

## Meta
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.quot' href='#Base.Meta.quot'>#</a>&nbsp;<b><u>Base.Meta.quot</u></b> &mdash; <i>Function</i>.




```julia
Meta.quot(ex)::Expr
```


Quote expression `ex` to produce an expression with head `quote`. This can for instance be used to represent objects of type `Expr` in the AST. See also the manual section about [QuoteNode](/manual/metaprogramming#man-quote-node).

**Examples**

```julia
julia> eval(Meta.quot(:x))
:x

julia> dump(Meta.quot(:x))
Expr
  head: Symbol quote
  args: Array{Any}((1,))
    1: Symbol x

julia> eval(Meta.quot(:(1+2)))
:(1 + 2)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L22-L43)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isexpr' href='#Base.isexpr'>#</a>&nbsp;<b><u>Base.isexpr</u></b> &mdash; <i>Function</i>.




```julia
Meta.isexpr(ex, head[, n])::Bool
```


Return `true` if `ex` is an `Expr` with the given type `head` and optionally that the argument list is of length `n`. `head` may be a `Symbol` or collection of `Symbol`s. For example, to check that a macro was passed a function call expression, you might use `isexpr(ex, :call)`.

**Examples**

```julia
julia> ex = :(f(x))
:(f(x))

julia> Meta.isexpr(ex, :block)
false

julia> Meta.isexpr(ex, :call)
true

julia> Meta.isexpr(ex, [:block, :call]) # multiple possible heads
true

julia> Meta.isexpr(ex, :call, 1)
false

julia> Meta.isexpr(ex, :call, 2)
true
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L46-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isidentifier' href='#Base.isidentifier'>#</a>&nbsp;<b><u>Base.isidentifier</u></b> &mdash; <i>Function</i>.




```julia
 isidentifier(s) -> Bool
```


Return whether the symbol or string `s` contains characters that are parsed as a valid ordinary identifier (not a binary/unary operator) in Julia code; see also [`Base.isoperator`](/base/base#Base.isoperator).

Internally Julia allows any sequence of characters in a `Symbol` (except `\0`s), and macros automatically use variable names containing `#` in order to avoid naming collision with the surrounding code. In order for the parser to recognize a variable, it uses a limited set of characters (greatly extended by Unicode). `isidentifier()` makes it possible to query the parser directly whether a symbol contains valid characters.

**Examples**

```julia
julia> Meta.isidentifier(:x), Meta.isidentifier("1x")
(true, false)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/show.jl#L1531-L1550)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isoperator' href='#Base.isoperator'>#</a>&nbsp;<b><u>Base.isoperator</u></b> &mdash; <i>Function</i>.




```julia
isoperator(s::Symbol)
```


Return `true` if the symbol can be used as an operator, `false` otherwise.

**Examples**

```julia
julia> Meta.isoperator(:+), Meta.isoperator(:f)
(true, false)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/show.jl#L1565-L1575)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isunaryoperator' href='#Base.isunaryoperator'>#</a>&nbsp;<b><u>Base.isunaryoperator</u></b> &mdash; <i>Function</i>.




```julia
isunaryoperator(s::Symbol)
```


Return `true` if the symbol can be used as a unary (prefix) operator, `false` otherwise.

**Examples**

```julia
julia> Meta.isunaryoperator(:-), Meta.isunaryoperator(:√), Meta.isunaryoperator(:f)
(true, true, false)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/show.jl#L1578-L1588)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.isbinaryoperator' href='#Base.isbinaryoperator'>#</a>&nbsp;<b><u>Base.isbinaryoperator</u></b> &mdash; <i>Function</i>.




```julia
isbinaryoperator(s::Symbol)
```


Return `true` if the symbol can be used as a binary (infix) operator, `false` otherwise.

**Examples**

```julia
julia> Meta.isbinaryoperator(:-), Meta.isbinaryoperator(:√), Meta.isbinaryoperator(:f)
(true, false, false)
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/show.jl#L1593-L1603)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.Meta.show_sexpr' href='#Base.Meta.show_sexpr'>#</a>&nbsp;<b><u>Base.Meta.show_sexpr</u></b> &mdash; <i>Function</i>.




```julia
Meta.show_sexpr([io::IO,], ex)
```


Show expression `ex` as a lisp style S-expression.

**Examples**

```julia
julia> Meta.show_sexpr(:(f(x, g(y,z))))
(:call, :f, :x, (:call, :g, :y, :z))
```



[source](https://github.com/JuliaLang/julia/blob/3a083e6f562588db232d656e89848b0633896963/base/meta.jl#L106-L116)

</div>
<br>
