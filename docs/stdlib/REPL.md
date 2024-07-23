


# The Julia REPL {#The-Julia-REPL}

Julia comes with a full-featured interactive command-line REPL (read-eval-print loop) built into the `julia` executable. In addition to allowing quick and easy evaluation of Julia statements, it has a searchable history, tab-completion, many helpful keybindings, and dedicated help and shell modes. The REPL can be started by simply calling `julia` with no arguments or double-clicking on the executable:

```
$ julia

               _
   _       _ _(_)_     |  Documentation: https://docs.julialang.org
  (_)     | (_) (_)    |
   _ _   _| |_  __ _   |  Type "?" for help, "]?" for Pkg help.
  | | | | | | |/ _` |  |
  | | |_| | | | (_| |  |  Version 1.12.0-DEV.1102 (2024-07-23)
 _/ |\__'_|_|_|\__'_|  |  la/docs/d0ea96fb3b* (fork: 208 commits, 0 days)
|__/                   |


julia>
```


To exit the interactive session, type `^D` – the control key together with the `d` key on a blank line – or type `exit()` followed by the return or enter key. The REPL greets you with a banner and a `julia>` prompt.

## The different prompt modes {#The-different-prompt-modes}

### The Julian mode {#The-Julian-mode}

The REPL has five main modes of operation. The first and most common is the Julian prompt. It is the default mode of operation; each new line initially starts with `julia>`. It is here that you can enter Julia expressions. Hitting return or enter after a complete expression has been entered will evaluate the entry and show the result of the last expression.

```julia
julia> string(1 + 2)
"3"
```


There are a number of useful features unique to interactive work. In addition to showing the result, the REPL also binds the result to the variable `ans`. A trailing semicolon on the line can be used as a flag to suppress showing the result.

```julia
julia> string(3 * 4);

julia> ans
"12"
```


In Julia mode, the REPL supports something called _prompt pasting_. This activates when pasting text that starts with `julia>` into the REPL. In that case, only expressions starting with `julia>` (as well as the other REPL mode prompts: `shell>`, `help?>`, `pkg>` ) are parsed, but others are removed. This makes it possible to paste a chunk of text that has been copied from a REPL session without having to scrub away prompts and outputs. This feature is enabled by default but can be disabled or enabled at will with `REPL.enable_promptpaste(::Bool)`. If it is enabled, you can try it out by pasting the code block above this paragraph straight into the REPL. This feature does not work on the standard Windows command prompt due to its limitation at detecting when a paste occurs.

A non-[`nothing`](/base/constants#Core.nothing) result of executing an expression is displayed by the REPL using the [`show`](/base/io-network#Base.show-Tuple{IO,%20Any}) function with a specific [`IOContext`](/base/io-network#Base.IOContext) (via [`display`](/base/io-network#Base.Multimedia.display), which defaults to calling `show(io, MIME("text/plain"), ans)`, which in turn defaults to `show(io, ans)`). In particular, the `:limit` attribute is set to `true`. Other attributes can receive in certain `show` methods a default value if it&#39;s not already set, like `:compact`. It&#39;s possible, as an experimental feature, to specify the attributes used by the REPL via the `Base.active_repl.options.iocontext` dictionary (associating values to attributes). For example:

```julia
julia> rand(2, 2)
2×2 Array{Float64,2}:
 0.8833    0.329197
 0.719708  0.59114

julia> show(IOContext(stdout, :compact => false), "text/plain", rand(2, 2))
 0.43540323669187075  0.15759787870609387
 0.2540832269192739   0.4597637838786053
julia> Base.active_repl.options.iocontext[:compact] = false;

julia> rand(2, 2)
2×2 Array{Float64,2}:
 0.2083967319174056  0.13330606013126012
 0.6244375177790158  0.9777957560761545
```


In order to define automatically the values of this dictionary at startup time, one can use the [`atreplinit`](/stdlib/REPL#Base.atreplinit) function in the `~/.julia/config/startup.jl` file, for example:

```julia
atreplinit() do repl
    repl.options.iocontext[:compact] = false
end
```


### Help mode {#Help-mode}

When the cursor is at the beginning of the line, the prompt can be changed to a help mode by typing `?`. Julia will attempt to print help or documentation for anything entered in help mode:

```julia
julia> ? # upon typing ?, the prompt changes (in place) to: help?>

help?> string
search: string String Cstring Cwstring RevString randstring bytestring SubString

  string(xs...)

  Create a string from any values using the print function.
```


Macros, types and variables can also be queried:

```
help?> @time
  @time

  A macro to execute an expression, printing the time it took to execute, the number of allocations,
  and the total number of bytes its execution caused to be allocated, before returning the value of the
  expression.

  See also @timev, @timed, @elapsed, and @allocated.

help?> Int32
search: Int32 UInt32

  Int32 <: Signed

  32-bit signed integer type.
```


A string or regex literal searches all docstrings using [`apropos`](/stdlib/InteractiveUtils#Base.Docs.apropos):

```
help?> "aprop"
REPL.stripmd
Base.Docs.apropos

help?> r"ap..p"
Base.:∘
Base.shell_escape_posixly
Distributed.CachingPool
REPL.stripmd
Base.Docs.apropos
```


Another feature of help mode is the ability to access extended docstrings. You can do this by typing something like `??Print` rather than `?Print` which will display the `# Extended help` section from the source codes documentation.

Help mode can be exited by pressing backspace at the beginning of the line.

### Shell mode {#man-shell-mode}

Just as help mode is useful for quick access to documentation, another common task is to use the system shell to execute system commands. Just as `?` entered help mode when at the beginning of the line, a semicolon (`;`) will enter the shell mode. And it can be exited by pressing backspace at the beginning of the line.

```julia
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> echo hello
hello
```


::: tip Note

For Windows users, Julia&#39;s shell mode does not expose windows shell commands. Hence, this will fail:

:::

```julia
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> dir
ERROR: IOError: could not spawn `dir`: no such file or directory (ENOENT)
Stacktrace!
.......
```


However, you can get access to `PowerShell` like this:

```julia
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> powershell
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.
PS C:\Users\elm>
```


... and to `cmd.exe` like that (see the `dir` command):

```julia
julia> ; # upon typing ;, the prompt changes (in place) to: shell>

shell> cmd
Microsoft Windows [version 10.0.17763.973]
(c) 2018 Microsoft Corporation. All rights reserved.
C:\Users\elm>dir
 Volume in drive C has no label
 Volume Serial Number is 1643-0CD7
  Directory of C:\Users\elm

29/01/2020  22:15    <DIR>          .
29/01/2020  22:15    <DIR>          ..
02/02/2020  08:06    <DIR>          .atom
```


### Pkg mode {#Pkg-mode}

The Package manager mode accepts specialized commands for loading and updating packages. It is entered by pressing the `]` key at the Julian REPL prompt and exited by pressing CTRL-C or pressing the backspace key at the beginning of the line. The prompt for this mode is `pkg>`. It supports its own help-mode, which is entered by pressing `?` at the beginning  of the line of the `pkg>` prompt. The Package manager mode is documented in the Pkg manual, available at [https://julialang.github.io/Pkg.jl/v1/](https://julialang.github.io/Pkg.jl/v1/).

### Search modes {#Search-modes}

In all of the above modes, the executed lines get saved to a history file, which can be searched.  To initiate an incremental search through the previous history, type `^R` – the control key together with the `r` key. The prompt will change to `(reverse-i-search)`':`, and as you type the search query will appear in the quotes. The most recent result that matches the query will dynamically update to the right of the colon as more is typed. To find an older result using the same query, simply type `^R` again.

Just as `^R` is a reverse search, `^S` is a forward search, with the prompt `(i-search)`':`.  The two may be used in conjunction with each other to move through the previous or next matching results, respectively.

All executed commands in the Julia REPL are logged into `~/.julia/logs/repl_history.jl` along with a timestamp of when it was executed and the current REPL mode you were in. Search mode queries this log file in order to find the commands which you previously ran. This can be disabled at startup by passing the `--history-file=no` flag to Julia.

## Key bindings {#Key-bindings}

The Julia REPL makes great use of key bindings. Several control-key bindings were already introduced above (`^D` to exit, `^R` and `^S` for searching), but there are many more. In addition to the control-key, there are also meta-key bindings. These vary more by platform, but most terminals default to using alt- or option- held down with a key to send the meta-key (or can be configured to do so), or pressing Esc and then the key.

| Keybinding           | Description                                                                                                        |
|:-------------------- |:------------------------------------------------------------------------------------------------------------------ |
| **Program control**  |                                                                                                                    |
| `^D`                 | Exit (when buffer is empty)                                                                                        |
| `^C`                 | Interrupt or cancel                                                                                                |
| `^L`                 | Clear console screen                                                                                               |
| Return/Enter, `^J`   | New line, executing if it is complete                                                                              |
| meta-Return/Enter    | Insert new line without executing it                                                                               |
| `?` or `;`           | Enter help or shell mode (when at start of a line)                                                                 |
| `^R`, `^S`           | Incremental history search, described above                                                                        |
| **Cursor movement**  |                                                                                                                    |
| Right arrow, `^F`    | Move right one character                                                                                           |
| Left arrow, `^B`     | Move left one character                                                                                            |
| ctrl-Right, `meta-F` | Move right one word                                                                                                |
| ctrl-Left, `meta-B`  | Move left one word                                                                                                 |
| Home, `^A`           | Move to beginning of line                                                                                          |
| End, `^E`            | Move to end of line                                                                                                |
| Up arrow, `^P`       | Move up one line (or change to the previous history entry that matches the text before the cursor)                 |
| Down arrow, `^N`     | Move down one line (or change to the next history entry that matches the text before the cursor)                   |
| Shift-Arrow Key      | Move cursor according to the direction of the Arrow key, while activating the region (&quot;shift selection&quot;) |
| Page-up, `meta-P`    | Change to the previous history entry                                                                               |
| Page-down, `meta-N`  | Change to the next history entry                                                                                   |
| `meta-<`             | Change to the first history entry (of the current session if it is before the current position in history)         |
| `meta->`             | Change to the last history entry                                                                                   |
| `^-Space`            | Set the &quot;mark&quot; in the editing region (and de-activate the region if it&#39;s active)                     |
| `^-Space ^-Space`    | Set the &quot;mark&quot; in the editing region and make the region &quot;active&quot;, i.e. highlighted            |
| `^G`                 | De-activate the region (i.e. make it not highlighted)                                                              |
| `^X^X`               | Exchange the current position with the mark                                                                        |
| **Editing**          |                                                                                                                    |
| Backspace, `^H`      | Delete the previous character, or the whole region when it&#39;s active                                            |
| Delete, `^D`         | Forward delete one character (when buffer has text)                                                                |
| meta-Backspace       | Delete the previous word                                                                                           |
| `meta-d`             | Forward delete the next word                                                                                       |
| `^W`                 | Delete previous text up to the nearest whitespace                                                                  |
| `meta-w`             | Copy the current region in the kill ring                                                                           |
| `meta-W`             | &quot;Kill&quot; the current region, placing the text in the kill ring                                             |
| `^U`                 | &quot;Kill&quot; to beginning of line, placing the text in the kill ring                                           |
| `^K`                 | &quot;Kill&quot; to end of line, placing the text in the kill ring                                                 |
| `^Y`                 | &quot;Yank&quot; insert the text from the kill ring                                                                |
| `meta-y`             | Replace a previously yanked text with an older entry from the kill ring                                            |
| `^T`                 | Transpose the characters about the cursor                                                                          |
| `meta-Up arrow`      | Transpose current line with line above                                                                             |
| `meta-Down arrow`    | Transpose current line with line below                                                                             |
| `meta-u`             | Change the next word to uppercase                                                                                  |
| `meta-c`             | Change the next word to titlecase                                                                                  |
| `meta-l`             | Change the next word to lowercase                                                                                  |
| `^/`, `^_`           | Undo previous editing action                                                                                       |
| `^Q`                 | Write a number in REPL and press `^Q` to open editor at corresponding stackframe or method                         |
| `meta-Left Arrow`    | Indent the current line on the left                                                                                |
| `meta-Right Arrow`   | Indent the current line on the right                                                                               |
| `meta-.`             | Insert last word from previous history entry                                                                       |
| `meta-e`             | Edit the current input in an editor                                                                                |


### Customizing keybindings {#Customizing-keybindings}

Julia&#39;s REPL keybindings may be fully customized to a user&#39;s preferences by passing a dictionary to `REPL.setup_interface`. The keys of this dictionary may be characters or strings. The key `'*'` refers to the default action. Control plus character `x` bindings are indicated with `"^x"`. Meta plus `x` can be written `"\\M-x"` or `"\ex"`, and Control plus `x` can be written `"\\C-x"` or `"^x"`. The values of the custom keymap must be `nothing` (indicating that the input should be ignored) or functions that accept the signature `(PromptState, AbstractREPL, Char)`. The `REPL.setup_interface` function must be called before the REPL is initialized, by registering the operation with [`atreplinit`](/stdlib/REPL#Base.atreplinit) . For example, to bind the up and down arrow keys to move through history without prefix search, one could put the following code in `~/.julia/config/startup.jl`:

```julia
import REPL
import REPL.LineEdit

const mykeys = Dict{Any,Any}(
    # Up Arrow
    "\e[A" => (s,o...)->(LineEdit.edit_move_up(s) || LineEdit.history_prev(s, LineEdit.mode(s).hist)),
    # Down Arrow
    "\e[B" => (s,o...)->(LineEdit.edit_move_down(s) || LineEdit.history_next(s, LineEdit.mode(s).hist))
)

function customize_keys(repl)
    repl.interface = REPL.setup_interface(repl; extra_repl_keymap = mykeys)
end

atreplinit(customize_keys)
```


Users should refer to `LineEdit.jl` to discover the available actions on key input.

## Tab completion {#Tab-completion}

In the Julian, pkg and help modes of the REPL, one can enter the first few characters of a function or type and then press the tab key to get a list all matches:

```julia
julia> x[TAB]
julia> xor
```


In some cases it only completes part of the name, up to the next ambiguity:

```julia
julia> mapf[TAB]
julia> mapfold
```


If you hit tab again, then you get the list of things that might complete this:

```julia
julia> mapfold[TAB]
mapfoldl mapfoldr
```


When a single complete tab-complete result is available at the end of an input line and 2 or more characters have been typed, a hint of the completion will show in a lighter color. This can be disabled via `Base.active_repl.options.hint_tab_completes = false`.

::: tip Julia 1.11

Tab-complete hinting was added in Julia 1.11

:::

Like other components of the REPL, the search is case-sensitive:

```julia
julia> stri[TAB]
stride     strides     string      strip

julia> Stri[TAB]
StridedArray    StridedMatrix    StridedVecOrMat  StridedVector    String
```


The tab key can also be used to substitute LaTeX math symbols with their Unicode equivalents, and get a list of LaTeX matches as well:

```julia
julia> \pi[TAB]
julia> π
π = 3.1415926535897...

julia> e\_1[TAB] = [1,0]
julia> e₁ = [1,0]
2-element Array{Int64,1}:
 1
 0

julia> e\^1[TAB] = [1 0]
julia> e¹ = [1 0]
1×2 Array{Int64,2}:
 1  0

julia> \sqrt[TAB]2     # √ is equivalent to the sqrt function
julia> √2
1.4142135623730951

julia> \hbar[TAB](h) = h / 2\pi[TAB]
julia> ħ(h) = h / 2π
ħ (generic function with 1 method)

julia> \h[TAB]
\hat              \hermitconjmatrix  \hkswarow          \hrectangle
\hatapprox        \hexagon           \hookleftarrow     \hrectangleblack
\hbar             \hexagonblack      \hookrightarrow    \hslash
\heartsuit        \hksearow          \house             \hspace

julia> α="\alpha[TAB]"   # LaTeX completion also works in strings
julia> α="α"
```


A full list of tab-completions can be found in the [Unicode Input](/manual/unicode-input#Unicode-Input) section of the manual.

Completion of paths works for strings and julia&#39;s shell mode:

```julia
julia> path="/[TAB]"
.dockerenv  .juliabox/   boot/        etc/         lib/         media/       opt/         root/        sbin/        sys/         usr/
.dockerinit bin/         dev/         home/        lib64/       mnt/         proc/        run/         srv/         tmp/         var/
shell> /[TAB]
.dockerenv  .juliabox/   boot/        etc/         lib/         media/       opt/         root/        sbin/        sys/         usr/
.dockerinit bin/         dev/         home/        lib64/       mnt/         proc/        run/         srv/         tmp/         var/
```


Dictionary keys can also be tab completed:

```julia
julia> foo = Dict("qwer1"=>1, "qwer2"=>2, "asdf"=>3)
Dict{String,Int64} with 3 entries:
  "qwer2" => 2
  "asdf"  => 3
  "qwer1" => 1

julia> foo["q[TAB]

"qwer1" "qwer2"
julia> foo["qwer
```


Tab completion can also help completing fields:

```julia
julia> x = 3 + 4im;

julia> x.[TAB][TAB]
im re

julia> import UUIDs

julia> UUIDs.uuid[TAB][TAB]
uuid1        uuid4         uuid5        uuid_version
```


Fields for output from functions can also be completed:

```julia
julia> split("","")[1].[TAB]
lastindex  offset  string
```


The completion of fields for output from functions uses type inference, and it can only suggest fields if the function is type stable.

Tab completion can help with investigation of the available methods matching the input arguments:

```julia
julia> max([TAB] # All methods are displayed, not shown here due to size of the list

julia> max([1, 2], [TAB] # All methods where `Vector{Int}` matches as first argument
max(x, y) in Base at operators.jl:215
max(a, b, c, xs...) in Base at operators.jl:281

julia> max([1, 2], max(1, 2), [TAB] # All methods matching the arguments.
max(x, y) in Base at operators.jl:215
max(a, b, c, xs...) in Base at operators.jl:281
```


Keywords are also displayed in the suggested methods after `;`, see below line where `limit` and `keepempty` are keyword arguments:

```julia
julia> split("1 1 1", [TAB]
split(str::AbstractString; limit, keepempty) in Base at strings/util.jl:302
split(str::T, splitter; limit, keepempty) where T<:AbstractString in Base at strings/util.jl:277
```


The completion of the methods uses type inference and can therefore see if the arguments match even if the arguments are output from functions. The function needs to be type stable for the completion to be able to remove non-matching methods.

If you wonder which methods can be used with particular argument types, use `?` as the function name. This shows an example of looking for functions in InteractiveUtils that accept a single string:

```julia
julia> InteractiveUtils.?("somefile")[TAB]
edit(path::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:197
less(file::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:266
```


This listed methods in the `InteractiveUtils` module that can be called on a string. By default, this excludes methods where all arguments are typed as `Any`, but you can see those too by holding down SHIFT-TAB instead of TAB:

```julia
julia> InteractiveUtils.?("somefile")[SHIFT-TAB]
apropos(string) in REPL at REPL/src/docview.jl:796
clipboard(x) in InteractiveUtils at InteractiveUtils/src/clipboard.jl:64
code_llvm(f) in InteractiveUtils at InteractiveUtils/src/codeview.jl:221
code_native(f) in InteractiveUtils at InteractiveUtils/src/codeview.jl:243
edit(path::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:197
edit(f) in InteractiveUtils at InteractiveUtils/src/editless.jl:225
eval(x) in InteractiveUtils at InteractiveUtils/src/InteractiveUtils.jl:3
include(x) in InteractiveUtils at InteractiveUtils/src/InteractiveUtils.jl:3
less(file::AbstractString) in InteractiveUtils at InteractiveUtils/src/editless.jl:266
less(f) in InteractiveUtils at InteractiveUtils/src/editless.jl:274
report_bug(kind) in InteractiveUtils at InteractiveUtils/src/InteractiveUtils.jl:391
separate_kwargs(args...; kwargs...) in InteractiveUtils at InteractiveUtils/src/macros.jl:7
```


You can also use `?("somefile")[TAB]`  and look across all modules, but the method lists can be long.

By omitting the closing parenthesis, you can include functions that might require additional arguments:

```julia
julia> using Mmap

help?> Mmap.?("file",[TAB]
Mmap.Anonymous(name::String, readonly::Bool, create::Bool) in Mmap at Mmap/src/Mmap.jl:16
mmap(file::AbstractString) in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}) where T<:Array in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}) where {T<:Array, N} in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}, offset::Integer; grow, shared) where {T<:Array, N} in Mmap at Mmap/src/Mmap.jl:245
mmap(file::AbstractString, ::Type{T}, len::Integer) where T<:Array in Mmap at Mmap/src/Mmap.jl:251
mmap(file::AbstractString, ::Type{T}, len::Integer, offset::Integer; grow, shared) where T<:Array in Mmap at Mmap/src/Mmap.jl:251
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}) where {T<:BitArray, N} in Mmap at Mmap/src/Mmap.jl:316
mmap(file::AbstractString, ::Type{T}, dims::Tuple{Vararg{Integer, N}}, offset::Integer; grow, shared) where {T<:BitArray, N} in Mmap at Mmap/src/Mmap.jl:316
mmap(file::AbstractString, ::Type{T}, len::Integer) where T<:BitArray in Mmap at Mmap/src/Mmap.jl:322
mmap(file::AbstractString, ::Type{T}, len::Integer, offset::Integer; grow, shared) where T<:BitArray in Mmap at Mmap/src/Mmap.jl:322
```


## Customizing Colors {#Customizing-Colors}

The colors used by Julia and the REPL can be customized, as well. To change the color of the Julia prompt you can add something like the following to your `~/.julia/config/startup.jl` file, which is to be placed inside your home directory:

```julia
function customize_colors(repl)
    repl.prompt_color = Base.text_colors[:cyan]
end

atreplinit(customize_colors)
```


The available color keys can be seen by typing `Base.text_colors` in the help mode of the REPL. In addition, the integers 0 to 255 can be used as color keys for terminals with 256 color support.

You can also change the colors for the help and shell prompts and input and answer text by setting the appropriate field of `repl` in the `customize_colors` function above (respectively, `help_color`, `shell_color`, `input_color`, and `answer_color`). For the latter two, be sure that the `envcolors` field is also set to false.

It is also possible to apply boldface formatting by using `Base.text_colors[:bold]` as a color. For instance, to print answers in boldface font, one can use the following as a `~/.julia/config/startup.jl`:

```julia
function customize_colors(repl)
    repl.envcolors = false
    repl.answer_color = Base.text_colors[:bold]
end

atreplinit(customize_colors)
```


You can also customize the color used to render warning and informational messages by setting the appropriate environment variables. For instance, to render error, warning, and informational messages respectively in magenta, yellow, and cyan you can add the following to your `~/.julia/config/startup.jl` file:

```julia
ENV["JULIA_ERROR_COLOR"] = :magenta
ENV["JULIA_WARN_COLOR"] = :yellow
ENV["JULIA_INFO_COLOR"] = :cyan
```


## Changing the contextual module which is active at the REPL {#Changing-the-contextual-module-which-is-active-at-the-REPL}

When entering expressions at the REPL, they are by default evaluated in the `Main` module;

```julia
julia> @__MODULE__
Main
```


It is possible to change this contextual module via the function `REPL.activate(m)` where `m` is a `Module` or by typing the module in the REPL and pressing the keybinding Alt-m with the cursor on the module name (Esc-m on MacOS). Pressing the keybinding on an empty prompt toggles the context between the previously active non-`Main` module and `Main`. The active module is shown in the prompt (unless it is `Main`):

```julia
julia> using REPL

julia> REPL.activate(Base)

(Base) julia> @__MODULE__
Base

(Base) julia> using REPL # Need to load REPL into Base module to use it

(Base) julia> REPL.activate(Main)

julia>

julia> Core<Alt-m> # using the keybinding to change module

(Core) julia>

(Core) julia> <Alt-m> # going back to Main via keybinding

julia>

julia> <Alt-m> # going back to previously-active Core via keybinding

(Core) julia>
```


Functions that take an optional module argument often defaults to the REPL context module. As an example, calling `varinfo()` will show the variables of the current active module:

```julia
julia> module CustomMod
           export var, f
           var = 1
           f(x) = x^2
       end;

julia> REPL.activate(CustomMod)

(Main.CustomMod) julia> varinfo()
  name         size summary
  ––––––––– ––––––– ––––––––––––––––––––––––––––––––––
  CustomMod         Module
  f         0 bytes f (generic function with 1 method)
  var       8 bytes Int64
```


## Numbered prompt {#Numbered-prompt}

It is possible to get an interface which is similar to the IPython REPL and the Mathematica notebook with numbered input prompts and output prefixes. This is done by calling `REPL.numbered_prompt!()`. If you want to have this enabled on startup, add

```julia
atreplinit() do repl
    @eval import REPL
    if !isdefined(repl, :interface)
        repl.interface = REPL.setup_interface(repl)
    end
    REPL.numbered_prompt!(repl)
end
```


to your `startup.jl` file. In numbered prompt the variable `Out[n]` (where `n` is an integer) can be used to refer to earlier results:

```julia
In [1]: 5 + 3
Out[1]: 8

In [2]: Out[1] + 5
Out[2]: 13

In [3]: Out
Out[3]: Dict{Int64, Any} with 2 entries:
  2 => 13
  1 => 8
```


::: tip Note

Since all outputs from previous REPL evaluations are saved in the `Out` variable, one should be careful if they are returning many large in-memory objects like arrays, since they will be protected from garbage collection so long as a reference to them remains in `Out`. If you need to remove references to objects in `Out`, you can clear the entire history it stores with `empty!(Out)`, or clear an individual entry with `Out[n] = nothing`.

:::

## TerminalMenus

TerminalMenus is a submodule of the Julia REPL and enables small, low-profile interactive menus in the terminal.

### Examples

```julia
import REPL
using REPL.TerminalMenus

options = ["apple", "orange", "grape", "strawberry",
            "blueberry", "peach", "lemon", "lime"]

```


#### RadioMenu

The RadioMenu allows the user to select one option from the list. The `request` function displays the interactive menu and returns the index of the selected choice. If a user presses &#39;q&#39; or `ctrl-c`, `request` will return a `-1`.

```julia
# `pagesize` is the number of items to be displayed at a time.
#  The UI will scroll if the number of options is greater
#   than the `pagesize`
menu = RadioMenu(options, pagesize=4)

# `request` displays the menu and returns the index after the
#   user has selected a choice
choice = request("Choose your favorite fruit:", menu)

if choice != -1
    println("Your favorite fruit is ", options[choice], "!")
else
    println("Menu canceled.")
end

```


Output:

```
Choose your favorite fruit:
^  grape
   strawberry
 > blueberry
v  peach
Your favorite fruit is blueberry!
```


#### MultiSelectMenu

The MultiSelectMenu allows users to select many choices from a list.

```julia
# here we use the default `pagesize` 10
menu = MultiSelectMenu(options)

# `request` returns a `Set` of selected indices
# if the menu us canceled (ctrl-c or q), return an empty set
choices = request("Select the fruits you like:", menu)

if length(choices) > 0
    println("You like the following fruits:")
    for i in choices
        println("  - ", options[i])
    end
else
    println("Menu canceled.")
end
```


Output:

```
Select the fruits you like:
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   [ ] apple
 > [X] orange
   [X] grape
   [ ] strawberry
   [ ] blueberry
   [X] peach
   [ ] lemon
   [ ] lime
You like the following fruits:
  - orange
  - grape
  - peach
```


### Customization / Configuration {#Customization-/-Configuration}

#### ConfiguredMenu subtypes {#ConfiguredMenu-subtypes}

Starting with Julia 1.6, the recommended way to configure menus is via the constructor. For instance, the default multiple-selection menu

```
julia> menu = MultiSelectMenu(options, pagesize=5);

julia> request(menu) # ASCII is used by default
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   [ ] apple
   [X] orange
   [ ] grape
 > [X] strawberry
v  [ ] blueberry
```


can instead be rendered with Unicode selection and navigation characters with

```julia
julia> menu = MultiSelectMenu(options, pagesize=5, charset=:unicode);

julia> request(menu)
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   ⬚ apple
   ✓ orange
   ⬚ grape
 → ✓ strawberry
↓  ⬚ blueberry
```


More fine-grained configuration is also possible:

```julia
julia> menu = MultiSelectMenu(options, pagesize=5, charset=:unicode, checked="YEP!", unchecked="NOPE", cursor='⧐');

julia> request(menu)
julia> request(menu)
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   NOPE apple
   YEP! orange
   NOPE grape
 ⧐ YEP! strawberry
↓  NOPE blueberry
```


Aside from the overall `charset` option, for `RadioMenu` the configurable options are:
- `cursor::Char='>'|'→'`: character to use for cursor
  
- `up_arrow::Char='^'|'↑'`: character to use for up arrow
  
- `down_arrow::Char='v'|'↓'`: character to use for down arrow
  
- `updown_arrow::Char='I'|'↕'`: character to use for up/down arrow in one-line page
  
- `scroll_wrap::Bool=false`: optionally wrap-around at the beginning/end of a menu
  
- `ctrl_c_interrupt::Bool=true`: If `false`, return empty on ^C, if `true` throw InterruptException() on ^C
  

`MultiSelectMenu` adds:
- `checked::String="[X]"|"✓"`: string to use for checked
  
- `unchecked::String="[ ]"|"⬚")`: string to use for unchecked
  

You can create new menu types of your own. Types that are derived from `TerminalMenus.ConfiguredMenu` configure the menu options at construction time.

#### Legacy interface {#Legacy-interface}

Prior to Julia 1.6, and still supported throughout Julia 1.x, one can also configure menus by calling `TerminalMenus.config()`.

## References

### REPL
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.atreplinit' href='#Base.atreplinit'>#</a>&nbsp;<b><u>Base.atreplinit</u></b> &mdash; <i>Function</i>.




```julia
atreplinit(f)
```


Register a one-argument function to be called before the REPL interface is initialized in interactive sessions; this is useful to customize the interface. The argument of `f` is the REPL object. This function should be called from within the `.julia/config/startup.jl` initialization file.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/base/client.jl#L369-L376)

</div>
<br>

### TerminalMenus {#TerminalMenus-2}

### Menus
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.RadioMenu' href='#REPL.TerminalMenus.RadioMenu'>#</a>&nbsp;<b><u>REPL.TerminalMenus.RadioMenu</u></b> &mdash; <i>Type</i>.




```julia
RadioMenu
```


A menu that allows a user to select a single option from a list.

**Sample Output**

```julia
julia> request(RadioMenu(options, pagesize=4))
Choose your favorite fruit:
^  grape
   strawberry
 > blueberry
v  peach
Your favorite fruit is blueberry!
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/RadioMenu.jl#L3-L21)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.MultiSelectMenu' href='#REPL.TerminalMenus.MultiSelectMenu'>#</a>&nbsp;<b><u>REPL.TerminalMenus.MultiSelectMenu</u></b> &mdash; <i>Type</i>.




```julia
MultiSelectMenu
```


A menu that allows a user to select a multiple options from a list.

**Sample Output**

```julia
julia> request(MultiSelectMenu(options))
Select the fruits you like:
[press: Enter=toggle, a=all, n=none, d=done, q=abort]
   [ ] apple
 > [X] orange
   [X] grape
   [ ] strawberry
   [ ] blueberry
   [X] peach
   [ ] lemon
   [ ] lime
You like the following fruits:
  - orange
  - grape
  - peach
```



[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/MultiSelectMenu.jl#L3-L29)

</div>
<br>

#### Configuration
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.Config' href='#REPL.TerminalMenus.Config'>#</a>&nbsp;<b><u>REPL.TerminalMenus.Config</u></b> &mdash; <i>Type</i>.




```julia
Config(; scroll_wrap=false, ctrl_c_interrupt=true, charset=:ascii, cursor::Char, up_arrow::Char, down_arrow::Char)
```


Configure behavior for selection menus via keyword arguments:
- `scroll_wrap`, if `true`, causes the menu to wrap around when scrolling above the first or below the last entry
  
- `ctrl_c_interrupt`, if `true`, throws an `InterruptException` if the user hits Ctrl-C during menu selection. If `false`, [`TerminalMenus.request`](/stdlib/REPL#REPL.TerminalMenus.request) will return the default result from [`TerminalMenus.selected`](/stdlib/REPL#REPL.TerminalMenus.selected).
  
- `charset` affects the default values for `cursor`, `up_arrow`, and `down_arrow`, and can be `:ascii` or `:unicode`
  
- `cursor` is the character printed to indicate the option that will be chosen by hitting &quot;Enter.&quot; Defaults are &#39;&gt;&#39; or &#39;→&#39;, depending on `charset`.
  
- `up_arrow` is the character printed when the display does not include the first entry. Defaults are &#39;^&#39; or &#39;↑&#39;, depending on `charset`.
  
- `down_arrow` is the character printed when the display does not include the last entry. Defaults are &#39;v&#39; or &#39;↓&#39;, depending on `charset`.
  

Subtypes of `ConfiguredMenu` will print `cursor`, `up_arrow`, and `down_arrow` automatically as needed, your `writeline` method should not print them.

::: tip Julia 1.6

`Config` is available as of Julia 1.6. On older releases use the global `CONFIG`.

:::


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/config.jl#L20-L44)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.MultiSelectConfig' href='#REPL.TerminalMenus.MultiSelectConfig'>#</a>&nbsp;<b><u>REPL.TerminalMenus.MultiSelectConfig</u></b> &mdash; <i>Type</i>.




```julia
MultiSelectConfig(; charset=:ascii, checked::String, unchecked::String, kwargs...)
```


Configure behavior for a multiple-selection menu via keyword arguments:
- `checked` is the string to print when an option has been selected. Defaults are &quot;[X]&quot; or &quot;✓&quot;, depending on `charset`.
  
- `unchecked` is the string to print when an option has not been selected. Defaults are &quot;[ ]&quot; or &quot;⬚&quot;, depending on `charset`.
  

All other keyword arguments are as described for [`TerminalMenus.Config`](/stdlib/REPL#REPL.TerminalMenus.Config). `checked` and `unchecked` are not printed automatically, and should be printed by your `writeline` method.

::: tip Julia 1.6

`MultiSelectConfig` is available as of Julia 1.6. On older releases use the global `CONFIG`.

:::


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/config.jl#L70-L86)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.config' href='#REPL.TerminalMenus.config'>#</a>&nbsp;<b><u>REPL.TerminalMenus.config</u></b> &mdash; <i>Function</i>.




```julia
config( <see arguments> )
```


Keyword-only function to configure global menu parameters

**Arguments**
- `charset::Symbol=:na`: ui characters to use (`:ascii` or `:unicode`); overridden by other arguments
  
- `cursor::Char='>'|'→'`: character to use for cursor
  
- `up_arrow::Char='^'|'↑'`: character to use for up arrow
  
- `down_arrow::Char='v'|'↓'`: character to use for down arrow
  
- `checked::String="[X]"|"✓"`: string to use for checked
  
- `unchecked::String="[ ]"|"⬚")`: string to use for unchecked
  
- `scroll::Symbol=:nowrap`: If `:wrap` wrap cursor around top and bottom, if :`nowrap` do not wrap cursor
  
- `supress_output::Bool=false`: Ignored legacy argument, pass `suppress_output` as a keyword argument to `request` instead.
  
- `ctrl_c_interrupt::Bool=true`: If `false`, return empty on ^C, if `true` throw InterruptException() on ^C
  

::: tip Julia 1.6

As of Julia 1.6, `config` is deprecated. Use `Config` or `MultiSelectConfig` instead.

:::


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/config.jl#L117-L135)

</div>
<br>

#### User interaction {#User-interaction}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.request' href='#REPL.TerminalMenus.request'>#</a>&nbsp;<b><u>REPL.TerminalMenus.request</u></b> &mdash; <i>Function</i>.




```julia
request(m::AbstractMenu; cursor=1)
```


Display the menu and enter interactive mode. `cursor` indicates the item number used for the initial cursor position. `cursor` can be either an `Int` or a `RefValue{Int}`. The latter is useful for observation and control of the cursor position from the outside.

Returns `selected(m)`.

::: tip Julia 1.6

The `cursor` argument requires Julia 1.6 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L166-L178)



```julia
request([term,] msg::AbstractString, m::AbstractMenu)
```


Shorthand for `println(msg); request(m)`.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L250-L254)

</div>
<br>

#### AbstractMenu extension interface {#AbstractMenu-extension-interface}

Any subtype of `AbstractMenu` must be mutable, and must contain the fields `pagesize::Int` and `pageoffset::Int`. Any subtype must also implement the following functions:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.pick' href='#REPL.TerminalMenus.pick'>#</a>&nbsp;<b><u>REPL.TerminalMenus.pick</u></b> &mdash; <i>Function</i>.




```julia
pick(m::AbstractMenu, cursor::Int)
```


Defines what happens when a user presses the Enter key while the menu is open. If `true` is returned, `request()` will exit. `cursor` indexes the position of the selection.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L76-L82)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.cancel' href='#REPL.TerminalMenus.cancel'>#</a>&nbsp;<b><u>REPL.TerminalMenus.cancel</u></b> &mdash; <i>Function</i>.




```julia
cancel(m::AbstractMenu)
```


Define what happens when a user cancels (&#39;q&#39; or ctrl-c) a menu. `request()` will always exit after calling this function.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L85-L90)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.writeline' href='#REPL.TerminalMenus.writeline'>#</a>&nbsp;<b><u>REPL.TerminalMenus.writeline</u></b> &mdash; <i>Function</i>.




```julia
writeline(buf::IO, m::AbstractMenu, idx::Int, iscursor::Bool)
```


Write the option at index `idx` to `buf`. `iscursor`, if `true`, indicates that this item is at the current cursor position (the one that will be selected by hitting &quot;Enter&quot;).

If `m` is a `ConfiguredMenu`, `TerminalMenus` will print the cursor indicator. Otherwise the callee is expected to handle such printing.

::: tip Julia 1.6

`writeline` requires Julia 1.6 or higher.

On older versions of Julia, this was     `writeLine(buf::IO, m::AbstractMenu, idx, iscursor::Bool)` and `m` is assumed to be unconfigured. The selection and cursor indicators can be obtained from `TerminalMenus.CONFIG`.

This older function is supported on all Julia 1.x versions but will be dropped in Julia 2.0.

:::


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L102-L120)

</div>
<br>

It must also implement either `options` or `numoptions`:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.options' href='#REPL.TerminalMenus.options'>#</a>&nbsp;<b><u>REPL.TerminalMenus.options</u></b> &mdash; <i>Function</i>.




```julia
options(m::AbstractMenu)
```


Return a list of strings to be displayed as options in the current page.

Alternatively, implement `numoptions`, in which case `options` is not needed.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L93-L99)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.numoptions' href='#REPL.TerminalMenus.numoptions'>#</a>&nbsp;<b><u>REPL.TerminalMenus.numoptions</u></b> &mdash; <i>Function</i>.




```julia
numoptions(m::AbstractMenu) -> Int
```


Return the number of options in menu `m`. Defaults to `length(options(m))`.

::: tip Julia 1.6

This function requires Julia 1.6 or later.

:::


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L148-L155)

</div>
<br>

If the subtype does not have a field named `selected`, it must also implement
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.selected' href='#REPL.TerminalMenus.selected'>#</a>&nbsp;<b><u>REPL.TerminalMenus.selected</u></b> &mdash; <i>Function</i>.




```julia
selected(m::AbstractMenu)
```


Return information about the user-selected option. By default it returns `m.selected`.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L158-L163)

</div>
<br>

The following are optional but can allow additional customization:
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.header' href='#REPL.TerminalMenus.header'>#</a>&nbsp;<b><u>REPL.TerminalMenus.header</u></b> &mdash; <i>Function</i>.




```julia
header(m::AbstractMenu) -> String
```


Return a header string to be printed above the menu. Defaults to &quot;&quot;.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L131-L136)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='REPL.TerminalMenus.keypress' href='#REPL.TerminalMenus.keypress'>#</a>&nbsp;<b><u>REPL.TerminalMenus.keypress</u></b> &mdash; <i>Function</i>.




```julia
keypress(m::AbstractMenu, i::UInt32) -> Bool
```


Handle any non-standard keypress event. If `true` is returned, [`TerminalMenus.request`](/stdlib/REPL#REPL.TerminalMenus.request) will exit. Defaults to `false`.


[source](https://github.com/JuliaLang/julia/blob/d0ea96fb3beee191e4f46c76ae048c5a0ef4a3a8/stdlib/REPL/src/TerminalMenus/AbstractMenu.jl#L139-L145)

</div>
<br>
