import { defineConfig, DefaultTheme } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import mathjax3 from "markdown-it-mathjax3";
import footnote from "markdown-it-footnote";
// https://github.com/cap-js/docs/blob/main/.vitepress/config.ts
const localSearchOptions = {
  provider: 'local',
  options: {
    miniSearch: {
      options: {
        tokenize: text => text.split( /[\n\r #%*,=/:;?[\]{}()&]+/u ), // simplified charset: removed [-_.@] and non-english chars (diacritics etc.)
        processTerm: (term, fieldName) => {
          term = term.trim().toLowerCase().replace(/^[^a-zA-Z0-9@!\.]+/, '').replace(/[^a-zA-Z0-9@!\.]+$/, '')
          const stopWords = ["a", "able", "about", "across", "after", "almost", "also", "am", "among", "an", "and", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "does", "either", "ever", "every", "from", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "into", "it", "its", "just", "least", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "who", "whom", "why", "will", "would", "yet", "you", "your"]
          if (term.length < 2 || stopWords.includes(term))  return false

          if (fieldName === 'text') {
            // as we don't tokenize along . to keep expressions like `LinearAlgebra.mean`, split and add the single parts as extra terms
            const parts = term.split('.')
            if (parts.length > 1) {
              const newTerms = [term, ...parts].filter(t => t.length >= 2).filter(t => !stopWords.includes(t))
              return newTerms
            }
          }
          return term
        },
      },
      searchOptions: {
        prefix: true,
        combineWith: 'AND',
        boost: { title: 100 },
        fuzzy: false,
        boostDocument: (documentId, term, storedFields:Record<string, string|string[]>) => {

          const titles = (storedFields?.titles as string[]).filter(t => !!t).map(t => t.toLowerCase())
          // Uprate if term appears in titles. Add bonus for higher levels (i.e. lower index)
          const titleIndex = titles.map((t, i) => t?.includes(term) ? i : -1).find(i => i>=0) ?? -1
          if (titleIndex >=0)  return 10000 - titleIndex
          return 1
        }
      }
    }
  }
} as { provider: 'local'; options?: DefaultTheme.LocalSearchOptions }

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/JuliaDocs',// TODO: replace this in makedocs!
  title: 'Programming',
  description: "The Julia Programming Language",
  lastUpdated: true,
  cleanUrls: true,
  // outDir: '../final_site', // This is required for MarkdownVitepress to work correctly...

  ignoreDeadLinks: true,

  markdown: {
    math: true,
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(mathjax3),
      md.use(footnote)
    },
    theme: {
      light: "github-light",
      dark: "github-dark"}
  },
  themeConfig: {
    outline: 'deep',
    logo: { light: "/logo.svg", dark: "/logo-dark.svg", alt: "julia" },
    search: localSearchOptions,

nav: [
{ text: 'Home', link: '/index' },
{ text: 'Manual', items: [
{ text: 'Getting Started', link: '/manual/getting-started' },
{ text: 'Installation', link: '/manual/installation' },
{ text: 'Variables', link: '/manual/variables' },
{ text: 'Integers and Floating-Point Numbers', link: '/manual/integers-and-floating-point-numbers' },
{ text: 'Mathematical Operations and Elementary Functions', link: '/manual/mathematical-operations' },
{ text: 'Complex and Rational Numbers', link: '/manual/complex-and-rational-numbers' },
{ text: 'Strings', link: '/manual/strings' },
{ text: 'Functions', link: '/manual/functions' },
{ text: 'Control Flow', link: '/manual/control-flow' },
{ text: 'Scope of Variables', link: '/manual/variables-and-scoping' },
{ text: 'Types', link: '/manual/types' },
{ text: 'Methods', link: '/manual/methods' },
{ text: 'Constructors', link: '/manual/constructors' },
{ text: 'Conversion and Promotion', link: '/manual/conversion-and-promotion' },
{ text: 'Interfaces', link: '/manual/interfaces' },
{ text: 'Modules', link: '/manual/modules' },
{ text: 'Documentation', link: '/manual/documentation' },
{ text: 'Metaprogramming', link: '/manual/metaprogramming' },
{ text: 'Single- and multi-dimensional Arrays', link: '/manual/arrays' },
{ text: 'Missing Values', link: '/manual/missing' },
{ text: 'Networking and Streams', link: '/manual/networking-and-streams' },
{ text: 'Parallel Computing', link: '/manual/parallel-computing' },
{ text: 'Asynchronous Programming', link: '/manual/asynchronous-programming' },
{ text: 'Multi-Threading', link: '/manual/multi-threading' },
{ text: 'Multi-processing and Distributed Computing', link: '/manual/distributed-computing' },
{ text: 'Running External Programs', link: '/manual/running-external-programs' },
{ text: 'Calling C and Fortran Code', link: '/manual/calling-c-and-fortran-code' },
{ text: 'Handling Operating System Variation', link: '/manual/handling-operating-system-variation' },
{ text: 'Environment Variables', link: '/manual/environment-variables' },
{ text: 'Embedding Julia', link: '/manual/embedding' },
{ text: 'Code Loading', link: '/manual/code-loading' },
{ text: 'Stack Traces', link: '/manual/stacktraces' },
{ text: 'Performance Tips', link: '/manual/performance-tips' },
{ text: 'Workflow Tips', link: '/manual/workflow-tips' },
{ text: 'Style Guide', link: '/manual/style-guide' },
{ text: 'Frequently Asked Questions', link: '/manual/faq' },
{ text: 'Noteworthy Differences from other Languages', link: '/manual/noteworthy-differences' },
{ text: 'Unicode Input', link: '/manual/unicode-input' },
{ text: 'Command-line Interface', link: '/manual/command-line-interface' }]
 },
{ text: 'Base', items: [
{ text: 'Essentials', link: '/base/base' },
{ text: 'Collections and Data Structures', link: '/base/collections' },
{ text: 'Mathematics', link: '/base/math' },
{ text: 'Numbers', link: '/base/numbers' },
{ text: 'Strings', link: '/base/strings' },
{ text: 'Arrays', link: '/base/arrays' },
{ text: 'Tasks', link: '/base/parallel' },
{ text: 'Multi-Threading', link: '/base/multi-threading' },
{ text: 'Scoped Values', link: '/base/scopedvalues' },
{ text: 'Constants', link: '/base/constants' },
{ text: 'Filesystem', link: '/base/file' },
{ text: 'I/O and Network', link: '/base/io-network' },
{ text: 'Punctuation', link: '/base/punctuation' },
{ text: 'Sorting and Related Functions', link: '/base/sort' },
{ text: 'Iteration utilities', link: '/base/iterators' },
{ text: 'Reflection and introspection', link: '/base/reflection' },
{ text: 'C Interface', link: '/base/c' },
{ text: 'C Standard Library', link: '/base/libc' },
{ text: 'StackTraces', link: '/base/stacktraces' },
{ text: 'SIMD Support', link: '/base/simd-types' }]
 },
{ text: 'Standard Library', items: [
{ text: 'ArgTools', link: '/stdlib/ArgTools' },
{ text: 'Artifacts', link: '/stdlib/Artifacts' },
{ text: 'Base64', link: '/stdlib/Base64' },
{ text: 'CRC32c', link: '/stdlib/CRC32c' },
{ text: 'Dates', link: '/stdlib/Dates' },
{ text: 'Delimited Files', link: '/stdlib/DelimitedFiles' },
{ text: 'Distributed Computing', link: '/stdlib/Distributed' },
{ text: 'Downloads', link: '/stdlib/Downloads' },
{ text: 'File Events', link: '/stdlib/FileWatching' },
{ text: 'Future', link: '/stdlib/Future' },
{ text: 'Interactive Utilities', link: '/stdlib/InteractiveUtils' },
{ text: 'Julia Syntax Highlighting', link: '/stdlib/JuliaSyntaxHighlighting' },
{ text: 'Lazy Artifacts', link: '/stdlib/LazyArtifacts' },
{ text: 'LibCURL', link: '/stdlib/LibCURL' },
{ text: 'LibGit2', link: '/stdlib/LibGit2' },
{ text: 'Dynamic Linker', link: '/stdlib/Libdl' },
{ text: 'Linear Algebra', link: '/stdlib/LinearAlgebra' },
{ text: 'Logging', link: '/stdlib/Logging' },
{ text: 'Markdown', link: '/stdlib/Markdown' },
{ text: 'Memory-mapped I/O', link: '/stdlib/Mmap' },
{ text: 'Network Options', link: '/stdlib/NetworkOptions' },
{ text: 'Pkg', link: '/stdlib/Pkg' },
{ text: 'Printf', link: '/stdlib/Printf' },
{ text: 'Profiling', link: '/stdlib/Profile' },
{ text: 'The Julia REPL', link: '/stdlib/REPL' },
{ text: 'Random Numbers', link: '/stdlib/Random' },
{ text: 'SHA', link: '/stdlib/SHA' },
{ text: 'Serialization', link: '/stdlib/Serialization' },
{ text: 'Shared Arrays', link: '/stdlib/SharedArrays' },
{ text: 'Sockets', link: '/stdlib/Sockets' },
{ text: 'Sparse Arrays', link: '/stdlib/SparseArrays' },
{ text: 'Statistics', link: '/stdlib/Statistics' },
{ text: 'StyledStrings', link: '/stdlib/StyledStrings' },
{ text: 'TOML', link: '/stdlib/TOML' },
{ text: 'Tar', link: '/stdlib/Tar' },
{ text: 'Unit Testing', link: '/stdlib/Test' },
{ text: 'UUIDs', link: '/stdlib/UUIDs' },
{ text: 'Unicode', link: '/stdlib/Unicode' }]
 },
{ text: 'Tutorials', items: [
{ text: 'Creating Packages', link: '/tutorials/creating-packages' },
{ text: 'Profiling', link: '/tutorials/profile' },
{ text: 'External Tutorials', link: '/tutorials/external' }]
 },
{ text: 'Developer Documentation', items: [
{ text: 'Documentation of Julia s Internals', items: [
{ text: 'Initialization of the Julia runtime', link: '/devdocs/init' },
{ text: 'Julia ASTs', link: '/devdocs/ast' },
{ text: 'More about types', link: '/devdocs/types' },
{ text: 'Memory layout of Julia Objects', link: '/devdocs/object' },
{ text: 'Eval of Julia code', link: '/devdocs/eval' },
{ text: 'Calling Conventions', link: '/devdocs/callconv' },
{ text: 'High-level Overview of the Native-Code Generation Process', link: '/devdocs/compiler' },
{ text: 'Julia Functions', link: '/devdocs/functions' },
{ text: 'Base.Cartesian', link: '/devdocs/cartesian' },
{ text: 'Talking to the compiler', link: '/devdocs/meta' },
{ text: 'SubArrays', link: '/devdocs/subarrays' },
{ text: 'isbits Union Optimizations', link: '/devdocs/isbitsunionarrays' },
{ text: 'System Image Building', link: '/devdocs/sysimg' },
{ text: 'Package Images', link: '/devdocs/pkgimg' },
{ text: 'Custom LLVM Passes', link: '/devdocs/llvm-passes' },
{ text: 'Working with LLVM', link: '/devdocs/llvm' },
{ text: 'printf() and stdio in the Julia runtime', link: '/devdocs/stdio' },
{ text: 'Bounds checking', link: '/devdocs/boundscheck' },
{ text: 'Proper maintenance and care of multi-threading locks', link: '/devdocs/locks' },
{ text: 'Arrays with custom indices', link: '/devdocs/offset-arrays' },
{ text: 'Module loading', link: '/devdocs/require' },
{ text: 'Inference', link: '/devdocs/inference' },
{ text: 'Julia SSA-form IR', link: '/devdocs/ssair' },
{ text: 'EscapeAnalysis', link: '/devdocs/EscapeAnalysis' },
{ text: 'Ahead of Time Compilation', link: '/devdocs/aot' },
{ text: 'Static analyzer annotations for GC correctness in C code', link: '/devdocs/gc-sa' },
{ text: 'Garbage Collection in Julia', link: '/devdocs/gc' },
{ text: 'JIT Design and Implementation', link: '/devdocs/jit' },
{ text: 'Core.Builtins', link: '/devdocs/builtins' },
{ text: 'Fixing precompilation hangs due to open tasks or IO', link: '/devdocs/precompile_hang' }]
 },
{ text: 'Developing/debugging Julia s C code', items: [
{ text: 'Reporting and analyzing crashes (segfaults)', link: '/devdocs/backtraces' },
{ text: 'gdb debugging tips', link: '/devdocs/debuggingtips' },
{ text: 'Using Valgrind with Julia', link: '/devdocs/valgrind' },
{ text: 'External Profiler Support', link: '/devdocs/external_profilers' },
{ text: 'Sanitizer support', link: '/devdocs/sanitizers' },
{ text: 'Instrumenting Julia with DTrace, and bpftrace', link: '/devdocs/probes' }]
 },
{ text: 'Building Julia', items: [
{ text: 'Building Julia (Detailed)', link: '/devdocs/build/build' },
{ text: 'Linux', link: '/devdocs/build/linux' },
{ text: 'macOS', link: '/devdocs/build/macos' },
{ text: 'Windows', link: '/devdocs/build/windows' },
{ text: 'FreeBSD', link: '/devdocs/build/freebsd' },
{ text: 'ARM (Linux)', link: '/devdocs/build/arm' },
{ text: 'Binary distributions', link: '/devdocs/build/distributing' }]
 }]
 }
]
,
    sidebar: [
      { text: 'Home', link: '/index' },
      { text: 'Manual', collapsed: true, items: [
      { text: 'Getting Started', link: '/manual/getting-started' },
      { text: 'Installation', link: '/manual/installation' },
      { text: 'Variables', link: '/manual/variables' },
      { text: 'Integers and Floating-Point Numbers', link: '/manual/integers-and-floating-point-numbers' },
      { text: 'Mathematical Operations and Elementary Functions', link: '/manual/mathematical-operations' },
      { text: 'Complex and Rational Numbers', link: '/manual/complex-and-rational-numbers' },
      { text: 'Strings', link: '/manual/strings' },
      { text: 'Functions', link: '/manual/functions' },
      { text: 'Control Flow', link: '/manual/control-flow' },
      { text: 'Scope of Variables', link: '/manual/variables-and-scoping' },
      { text: 'Types', link: '/manual/types' },
      { text: 'Methods', link: '/manual/methods' },
      { text: 'Constructors', link: '/manual/constructors' },
      { text: 'Conversion and Promotion', link: '/manual/conversion-and-promotion' },
      { text: 'Interfaces', link: '/manual/interfaces' },
      { text: 'Modules', link: '/manual/modules' },
      { text: 'Documentation', link: '/manual/documentation' },
      { text: 'Metaprogramming', link: '/manual/metaprogramming' },
      { text: 'Single- and multi-dimensional Arrays', link: '/manual/arrays' },
      { text: 'Missing Values', link: '/manual/missing' },
      { text: 'Networking and Streams', link: '/manual/networking-and-streams' },
      { text: 'Parallel Computing', link: '/manual/parallel-computing' },
      { text: 'Asynchronous Programming', link: '/manual/asynchronous-programming' },
      { text: 'Multi-Threading', link: '/manual/multi-threading' },
      { text: 'Multi-processing and Distributed Computing', link: '/manual/distributed-computing' },
      { text: 'Running External Programs', link: '/manual/running-external-programs' },
      { text: 'Calling C and Fortran Code', link: '/manual/calling-c-and-fortran-code' },
      { text: 'Handling Operating System Variation', link: '/manual/handling-operating-system-variation' },
      { text: 'Environment Variables', link: '/manual/environment-variables' },
      { text: 'Embedding Julia', link: '/manual/embedding' },
      { text: 'Code Loading', link: '/manual/code-loading' },
      { text: 'Stack Traces', link: '/manual/stacktraces' },
      { text: 'Performance Tips', link: '/manual/performance-tips' },
      { text: 'Workflow Tips', link: '/manual/workflow-tips' },
      { text: 'Style Guide', link: '/manual/style-guide' },
      { text: 'Frequently Asked Questions', link: '/manual/faq' },
      { text: 'Noteworthy Differences from other Languages', link: '/manual/noteworthy-differences' },
      { text: 'Unicode Input', link: '/manual/unicode-input' },
      { text: 'Command-line Interface', link: '/manual/command-line-interface' }]
      },
      { text: 'Base', collapsed: true, items: [
      { text: 'Essentials', link: '/base/base' },
      { text: 'Collections and Data Structures', link: '/base/collections' },
      { text: 'Mathematics', link: '/base/math' },
      { text: 'Numbers', link: '/base/numbers' },
      { text: 'Strings', link: '/base/strings' },
      { text: 'Arrays', link: '/base/arrays' },
      { text: 'Tasks', link: '/base/parallel' },
      { text: 'Multi-Threading', link: '/base/multi-threading' },
      { text: 'Scoped Values', link: '/base/scopedvalues' },
      { text: 'Constants', link: '/base/constants' },
      { text: 'Filesystem', link: '/base/file' },
      { text: 'I/O and Network', link: '/base/io-network' },
      { text: 'Punctuation', link: '/base/punctuation' },
      { text: 'Sorting and Related Functions', link: '/base/sort' },
      { text: 'Iteration utilities', link: '/base/iterators' },
      { text: 'Reflection and introspection', link: '/base/reflection' },
      { text: 'C Interface', link: '/base/c' },
      { text: 'C Standard Library', link: '/base/libc' },
      { text: 'StackTraces', link: '/base/stacktraces' },
      { text: 'SIMD Support', link: '/base/simd-types' }]
      },
      { text: 'Standard Library', collapsed: true, items: [
      { text: 'ArgTools', link: '/stdlib/ArgTools' },
      { text: 'Artifacts', link: '/stdlib/Artifacts' },
      { text: 'Base64', link: '/stdlib/Base64' },
      { text: 'CRC32c', link: '/stdlib/CRC32c' },
      { text: 'Dates', link: '/stdlib/Dates' },
      { text: 'Delimited Files', link: '/stdlib/DelimitedFiles' },
      { text: 'Distributed Computing', link: '/stdlib/Distributed' },
      { text: 'Downloads', link: '/stdlib/Downloads' },
      { text: 'File Events', link: '/stdlib/FileWatching' },
      { text: 'Future', link: '/stdlib/Future' },
      { text: 'Interactive Utilities', link: '/stdlib/InteractiveUtils' },
      { text: 'Julia Syntax Highlighting', link: '/stdlib/JuliaSyntaxHighlighting' },
      { text: 'Lazy Artifacts', link: '/stdlib/LazyArtifacts' },
      { text: 'LibCURL', link: '/stdlib/LibCURL' },
      { text: 'LibGit2', link: '/stdlib/LibGit2' },
      { text: 'Dynamic Linker', link: '/stdlib/Libdl' },
      { text: 'Linear Algebra', link: '/stdlib/LinearAlgebra' },
      { text: 'Logging', link: '/stdlib/Logging' },
      { text: 'Markdown', link: '/stdlib/Markdown' },
      { text: 'Memory-mapped I/O', link: '/stdlib/Mmap' },
      { text: 'Network Options', link: '/stdlib/NetworkOptions' },
      { text: 'Pkg', link: '/stdlib/Pkg' },
      { text: 'Printf', link: '/stdlib/Printf' },
      { text: 'Profiling', link: '/stdlib/Profile' },
      { text: 'The Julia REPL', link: '/stdlib/REPL' },
      { text: 'Random Numbers', link: '/stdlib/Random' },
      { text: 'SHA', link: '/stdlib/SHA' },
      { text: 'Serialization', link: '/stdlib/Serialization' },
      { text: 'Shared Arrays', link: '/stdlib/SharedArrays' },
      { text: 'Sockets', link: '/stdlib/Sockets' },
      { text: 'Sparse Arrays', link: '/stdlib/SparseArrays' },
      { text: 'Statistics', link: '/stdlib/Statistics' },
      { text: 'StyledStrings', link: '/stdlib/StyledStrings' },
      { text: 'TOML', link: '/stdlib/TOML' },
      { text: 'Tar', link: '/stdlib/Tar' },
      { text: 'Unit Testing', link: '/stdlib/Test' },
      { text: 'UUIDs', link: '/stdlib/UUIDs' },
      { text: 'Unicode', link: '/stdlib/Unicode' }]
      },
      { text: 'Tutorials', collapsed: false, items: [
      { text: 'Creating Packages', link: '/tutorials/creating-packages' },
      { text: 'Profiling', link: '/tutorials/profile' },
      { text: 'External Tutorials', link: '/tutorials/external' }]
      },
      { text: 'Developer Documentation', collapsed: false, items: [
      { text: 'Documentation of Julia s Internals', collapsed: true, items: [
      { text: 'Initialization of the Julia runtime', link: '/devdocs/init' },
      { text: 'Julia ASTs', link: '/devdocs/ast' },
      { text: 'More about types', link: '/devdocs/types' },
      { text: 'Memory layout of Julia Objects', link: '/devdocs/object' },
      { text: 'Eval of Julia code', link: '/devdocs/eval' },
      { text: 'Calling Conventions', link: '/devdocs/callconv' },
      { text: 'High-level Overview of the Native-Code Generation Process', link: '/devdocs/compiler' },
      { text: 'Julia Functions', link: '/devdocs/functions' },
      { text: 'Base.Cartesian', link: '/devdocs/cartesian' },
      { text: 'Talking to the compiler', link: '/devdocs/meta' },
      { text: 'SubArrays', link: '/devdocs/subarrays' },
      { text: 'isbits Union Optimizations', link: '/devdocs/isbitsunionarrays' },
      { text: 'System Image Building', link: '/devdocs/sysimg' },
      { text: 'Package Images', link: '/devdocs/pkgimg' },
      { text: 'Custom LLVM Passes', link: '/devdocs/llvm-passes' },
      { text: 'Working with LLVM', link: '/devdocs/llvm' },
      { text: 'printf() and stdio in the Julia runtime', link: '/devdocs/stdio' },
      { text: 'Bounds checking', link: '/devdocs/boundscheck' },
      { text: 'Proper maintenance and care of multi-threading locks', link: '/devdocs/locks' },
      { text: 'Arrays with custom indices', link: '/devdocs/offset-arrays' },
      { text: 'Module loading', link: '/devdocs/require' },
      { text: 'Inference', link: '/devdocs/inference' },
      { text: 'Julia SSA-form IR', link: '/devdocs/ssair' },
      { text: 'EscapeAnalysis', link: '/devdocs/EscapeAnalysis' },
      { text: 'Ahead of Time Compilation', link: '/devdocs/aot' },
      { text: 'Static analyzer annotations for GC correctness in C code', link: '/devdocs/gc-sa' },
      { text: 'Garbage Collection in Julia', link: '/devdocs/gc' },
      { text: 'JIT Design and Implementation', link: '/devdocs/jit' },
      { text: 'Core.Builtins', link: '/devdocs/builtins' },
      { text: 'Fixing precompilation hangs due to open tasks or IO', link: '/devdocs/precompile_hang' }]
      },
      { text: 'Developing/debugging Julia s C code', collapsed: true, items: [
      { text: 'Reporting and analyzing crashes (segfaults)', link: '/devdocs/backtraces' },
      { text: 'gdb debugging tips', link: '/devdocs/debuggingtips' },
      { text: 'Using Valgrind with Julia', link: '/devdocs/valgrind' },
      { text: 'External Profiler Support', link: '/devdocs/external_profilers' },
      { text: 'Sanitizer support', link: '/devdocs/sanitizers' },
      { text: 'Instrumenting Julia with DTrace, and bpftrace', link: '/devdocs/probes' }]
      },
      { text: 'Building Julia', collapsed: true, items: [
      { text: 'Building Julia (Detailed)', link: '/devdocs/build/build' },
      { text: 'Linux', link: '/devdocs/build/linux' },
      { text: 'macOS', link: '/devdocs/build/macos' },
      { text: 'Windows', link: '/devdocs/build/windows' },
      { text: 'FreeBSD', link: '/devdocs/build/freebsd' },
      { text: 'ARM (Linux)', link: '/devdocs/build/arm' },
      { text: 'Binary distributions', link: '/devdocs/build/distributing' }]
      }]
      }
    ]
,
    editLink: { pattern: "https://github.com/JuliaLang/julia/edit/master/doc/src/:path" },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/JuliaLang/docs.julialang.org.git' }
    ],
    footer: {
      message: 'Made with <a href="https://luxdl.github.io/DocumenterVitepress.jl/dev/" target="_blank"><strong>DocumenterVitepress.jl</strong></a><br>',
      copyright: `© Copyright ${new Date().getUTCFullYear()}.`
    }
  }
})
