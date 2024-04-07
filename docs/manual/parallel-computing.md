
# Parallel Computing {#Parallel-Computing}

Julia supports these four categories of concurrent and parallel programming:
1. **Asynchronous &quot;tasks&quot;, or coroutines**:
  Julia Tasks allow suspending and resuming computations  for I/O, event handling, producer-consumer processes, and similar patterns.  Tasks can synchronize through operations like [`wait`](/base/parallel#Base.wait) and [`fetch`](/base/parallel#Base.fetch-Tuple{Task}), and  communicate via [`Channel`](/base/parallel#Base.Channel)s. While strictly not parallel computing by themselves,  Julia lets you schedule [`Task`](/base/parallel#Core.Task)s on several threads.
  
1. **Multi-threading**:
  Julia&#39;s [multi-threading](/manual/multi-threading#man-multithreading) provides the ability to schedule Tasks  simultaneously on more than one thread or CPU core, sharing memory. This is usually the easiest way  to get parallelism on one&#39;s PC or on a single large multi-core server. Julia&#39;s multi-threading  is composable. When one multi-threaded function calls another multi-threaded function, Julia  will schedule all the threads globally on available resources, without oversubscribing.
  
1. **Distributed computing**:
  Distributed computing runs multiple Julia processes with separate memory spaces. These can be on the same  computer or multiple computers. The [`Distributed`](/stdlib/Distributed#man-distributed) standard library provides the capability for remote execution  of a Julia function. With this basic building block, it is possible to build many different kinds of  distributed computing abstractions. Packages like [`DistributedArrays.jl`](https://github.com/JuliaParallel/DistributedArrays.jl)  are an example of such an abstraction. On the other hand, packages like [`MPI.jl`](https://github.com/JuliaParallel/MPI.jl) and  [`Elemental.jl`](https://github.com/JuliaParallel/Elemental.jl) provide access to the existing MPI ecosystem of libraries.
  
1. **GPU computing**:
  The Julia GPU compiler provides the ability to run Julia code natively on GPUs. There  is a rich ecosystem of Julia packages that target GPUs. The [JuliaGPU.org](https://juliagpu.org)  website provides a list of capabilities, supported GPUs, related packages and documentation.
  
