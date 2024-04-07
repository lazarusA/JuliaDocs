


# Sockets {#Sockets}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.Sockets' href='#Sockets.Sockets'>#</a>&nbsp;<b><u>Sockets.Sockets</u></b> &mdash; <i>Module</i>.




Support for sockets. Provides [`IPAddr`](/stdlib/Sockets#Sockets.IPAddr) and subtypes, [`TCPSocket`](/stdlib/Sockets#Sockets.TCPSocket), and [`UDPSocket`](/stdlib/Sockets#Sockets.UDPSocket).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L3-L5)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.connect-Tuple{TCPSocket, Integer}' href='#Sockets.connect-Tuple{TCPSocket, Integer}'>#</a>&nbsp;<b><u>Sockets.connect</u></b> &mdash; <i>Method</i>.




```julia
connect([host], port::Integer) -> TCPSocket
```


Connect to the host `host` on port `port`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L539-L543)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.connect-Tuple{AbstractString}' href='#Sockets.connect-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Sockets.connect</u></b> &mdash; <i>Method</i>.




```julia
connect(path::AbstractString) -> PipeEndpoint
```


Connect to the named pipe / UNIX domain socket at `path`.

::: tip Note

Path length on Unix is limited to somewhere between 92 and 108 bytes (cf. `man unix`).

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/PipeServer.jl#L95-L102)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.listen-Tuple{Any}' href='#Sockets.listen-Tuple{Any}'>#</a>&nbsp;<b><u>Sockets.listen</u></b> &mdash; <i>Method</i>.




```julia
listen([addr, ]port::Integer; backlog::Integer=BACKLOG_DEFAULT) -> TCPServer
```


Listen on port on the address specified by `addr`. By default this listens on `localhost` only. To listen on all interfaces pass `IPv4(0)` or `IPv6(0)` as appropriate. `backlog` determines how many connections can be pending (not having called [`accept`](/stdlib/Sockets#Sockets.accept)) before the server will begin to reject them. The default value of `backlog` is 511.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L612-L621)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.listen-Tuple{AbstractString}' href='#Sockets.listen-Tuple{AbstractString}'>#</a>&nbsp;<b><u>Sockets.listen</u></b> &mdash; <i>Method</i>.




```julia
listen(path::AbstractString) -> PipeServer
```


Create and listen on a named pipe / UNIX domain socket.

::: tip Note

Path length on Unix is limited to somewhere between 92 and 108 bytes (cf. `man unix`).

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/PipeServer.jl#L69-L76)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.getaddrinfo' href='#Sockets.getaddrinfo'>#</a>&nbsp;<b><u>Sockets.getaddrinfo</u></b> &mdash; <i>Function</i>.




```julia
getaddrinfo(host::AbstractString, IPAddr) -> IPAddr
```


Gets the first IP address of the `host` of the specified `IPAddr` type. Uses the operating system&#39;s underlying getaddrinfo implementation, which may do a DNS lookup.

**Examples**

```julia
julia> getaddrinfo("localhost", IPv6)
ip"::1"

julia> getaddrinfo("localhost", IPv4)
ip"127.0.0.1"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L124-L139)



```julia
getaddrinfo(host::AbstractString) -> IPAddr
```


Gets the first available IP address of `host`, which may be either an `IPv4` or `IPv6` address. Uses the operating system&#39;s underlying getaddrinfo implementation, which may do a DNS lookup.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L151-L157)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.getipaddr' href='#Sockets.getipaddr'>#</a>&nbsp;<b><u>Sockets.getipaddr</u></b> &mdash; <i>Function</i>.




```julia
getipaddr() -> IPAddr
```


Get an IP address of the local machine, preferring IPv4 over IPv6. Throws if no addresses are available.

```
getipaddr(addr_type::Type{T}) where T<:IPAddr -> T
```


Get an IP address of the local machine of the specified type. Throws if no addresses of the specified type are available.

This function is a backwards-compatibility wrapper around [`getipaddrs`](/stdlib/Sockets#Sockets.getipaddrs). New applications should use [`getipaddrs`](/stdlib/Sockets#Sockets.getipaddrs) instead.

**Examples**

```julia
julia> getipaddr()
ip"192.168.1.28"

julia> getipaddr(IPv6)
ip"fe80::9731:35af:e1c5:6e49"
```


See also [`getipaddrs`](/stdlib/Sockets#Sockets.getipaddrs).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L258-L282)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.getipaddrs' href='#Sockets.getipaddrs'>#</a>&nbsp;<b><u>Sockets.getipaddrs</u></b> &mdash; <i>Function</i>.




```julia
getipaddrs(addr_type::Type{T}=IPAddr; loopback::Bool=false) where T<:IPAddr -> Vector{T}
```


Get the IP addresses of the local machine.

Setting the optional `addr_type` parameter to `IPv4` or `IPv6` causes only addresses of that type to be returned.

The `loopback` keyword argument dictates whether loopback addresses (e.g. `ip"127.0.0.1"`, `ip"::1"`) are included.

::: tip Julia 1.2

This function is available as of Julia 1.2.

:::

**Examples**

```julia
julia> getipaddrs()
5-element Array{IPAddr,1}:
 ip"198.51.100.17"
 ip"203.0.113.2"
 ip"2001:db8:8:4:445e:5fff:fe5d:5500"
 ip"2001:db8:8:4:c164:402e:7e3c:3668"
 ip"fe80::445e:5fff:fe5d:5500"

julia> getipaddrs(IPv6)
3-element Array{IPv6,1}:
 ip"2001:db8:8:4:445e:5fff:fe5d:5500"
 ip"2001:db8:8:4:c164:402e:7e3c:3668"
 ip"fe80::445e:5fff:fe5d:5500"
```


See also [`islinklocaladdr`](/stdlib/Sockets#Sockets.islinklocaladdr).


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L297-L327)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.islinklocaladdr' href='#Sockets.islinklocaladdr'>#</a>&nbsp;<b><u>Sockets.islinklocaladdr</u></b> &mdash; <i>Function</i>.




```julia
islinklocaladdr(addr::IPAddr)
```


Tests if an IP address is a link-local address. Link-local addresses are not guaranteed to be unique beyond their network segment, therefore routers do not forward them. Link-local addresses are from the address blocks `169.254.0.0/16` or `fe80::/10`.

**Examples**

```julia
filter(!islinklocaladdr, getipaddrs())
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L357-L369)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.getalladdrinfo' href='#Sockets.getalladdrinfo'>#</a>&nbsp;<b><u>Sockets.getalladdrinfo</u></b> &mdash; <i>Function</i>.




```julia
getalladdrinfo(host::AbstractString) -> Vector{IPAddr}
```


Gets all of the IP addresses of the `host`. Uses the operating system&#39;s underlying `getaddrinfo` implementation, which may do a DNS lookup.

**Examples**

```julia
julia> getalladdrinfo("google.com")
2-element Array{IPAddr,1}:
 ip"172.217.6.174"
 ip"2607:f8b0:4000:804::200e"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L52-L65)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.DNSError' href='#Sockets.DNSError'>#</a>&nbsp;<b><u>Sockets.DNSError</u></b> &mdash; <i>Type</i>.




```julia
DNSError
```


The type of exception thrown when an error occurs in DNS lookup. The `host` field indicates the host URL string. The `code` field indicates the error code based on libuv.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L3-L9)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.getnameinfo' href='#Sockets.getnameinfo'>#</a>&nbsp;<b><u>Sockets.getnameinfo</u></b> &mdash; <i>Function</i>.




```julia
getnameinfo(host::IPAddr) -> String
```


Performs a reverse-lookup for IP address to return a hostname and service using the operating system&#39;s underlying `getnameinfo` implementation.

**Examples**

```julia
julia> getnameinfo(IPv4("8.8.8.8"))
"google-public-dns-a.google.com"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/addrinfo.jl#L183-L194)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.getsockname' href='#Sockets.getsockname'>#</a>&nbsp;<b><u>Sockets.getsockname</u></b> &mdash; <i>Function</i>.




```julia
getsockname(sock::Union{TCPServer, TCPSocket}) -> (IPAddr, UInt16)
```


Get the IP address and port that the given socket is bound to.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L793-L797)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.getpeername' href='#Sockets.getpeername'>#</a>&nbsp;<b><u>Sockets.getpeername</u></b> &mdash; <i>Function</i>.




```julia
getpeername(sock::TCPSocket) -> (IPAddr, UInt16)
```


Get the IP address and port of the remote endpoint that the given socket is connected to. Valid only for connected TCP sockets.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L801-L806)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.IPAddr' href='#Sockets.IPAddr'>#</a>&nbsp;<b><u>Sockets.IPAddr</u></b> &mdash; <i>Type</i>.




```julia
IPAddr
```


Abstract supertype for IP addresses. [`IPv4`](/stdlib/Sockets#Sockets.IPv4) and [`IPv6`](/stdlib/Sockets#Sockets.IPv6) are subtypes of this.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/IPAddr.jl#L3-L7)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.IPv4' href='#Sockets.IPv4'>#</a>&nbsp;<b><u>Sockets.IPv4</u></b> &mdash; <i>Type</i>.




```julia
IPv4(host::Integer) -> IPv4
```


Return an IPv4 object from IP address `host` formatted as an [`Integer`](/base/numbers#Core.Integer).

**Examples**

```julia
julia> IPv4(3223256218)
ip"192.30.252.154"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/IPAddr.jl#L31-L41)



```julia
IPv4(str::AbstractString) -> IPv4
```


Parse an IPv4 address string into an `IPv4` object.

**Examples**

```julia
julia> IPv4("127.0.0.1")
ip"127.0.0.1"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/IPAddr.jl#L52-L62)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.IPv6' href='#Sockets.IPv6'>#</a>&nbsp;<b><u>Sockets.IPv6</u></b> &mdash; <i>Type</i>.




```julia
IPv6(host::Integer) -> IPv6
```


Return an IPv6 object from IP address `host` formatted as an [`Integer`](/base/numbers#Core.Integer).

**Examples**

```julia
julia> IPv6(3223256218)
ip"::c01e:fc9a"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/IPAddr.jl#L94-L104)



```julia
IPv6(str::AbstractString) -> IPv6
```


Parse an IPv6 address string into an `IPv6` object.

**Examples**

```julia
julia> IPv6("::1")
ip"::1"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/IPAddr.jl#L117-L127)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.@ip_str' href='#Sockets.@ip_str'>#</a>&nbsp;<b><u>Sockets.@ip_str</u></b> &mdash; <i>Macro</i>.




```julia
@ip_str str -> IPAddr
```


Parse `str` as an IP address.

**Examples**

```julia
julia> ip"127.0.0.1"
ip"127.0.0.1"

julia> @ip_str "2001:db8:0:0:0:0:2:1"
ip"2001:db8::2:1"
```



[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/IPAddr.jl#L275-L288)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.TCPSocket' href='#Sockets.TCPSocket'>#</a>&nbsp;<b><u>Sockets.TCPSocket</u></b> &mdash; <i>Type</i>.




```julia
TCPSocket(; delay=true)
```


Open a TCP socket using libuv. If `delay` is true, libuv delays creation of the socket&#39;s file descriptor till the first [`bind`](/stdlib/Sockets#Base.bind) call. `TCPSocket` has various fields to denote the state of the socket as well as its send/receive buffers.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L51-L57)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.UDPSocket' href='#Sockets.UDPSocket'>#</a>&nbsp;<b><u>Sockets.UDPSocket</u></b> &mdash; <i>Type</i>.




```julia
UDPSocket()
```


Open a UDP socket using libuv. `UDPSocket` has various fields to denote the state of the socket.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L169-L174)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.accept' href='#Sockets.accept'>#</a>&nbsp;<b><u>Sockets.accept</u></b> &mdash; <i>Function</i>.




```julia
accept(server[, client])
```


Accepts a connection on the given server and returns a connection to the client. An uninitialized client stream may be provided, in which case it will be used instead of creating a new stream.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L142-L148)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.listenany' href='#Sockets.listenany'>#</a>&nbsp;<b><u>Sockets.listenany</u></b> &mdash; <i>Function</i>.




```julia
listenany([host::IPAddr,] port_hint; backlog::Integer=BACKLOG_DEFAULT) -> (UInt16, TCPServer)
```


Create a `TCPServer` on any port, using hint as a starting point. Returns a tuple of the actual port that the server was created on and the server itself. The backlog argument defines the maximum length to which the queue of pending connections for sockfd may grow.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L715-L721)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Base.bind' href='#Base.bind'>#</a>&nbsp;<b><u>Base.bind</u></b> &mdash; <i>Function</i>.




```julia
bind(socket::Union{TCPServer, UDPSocket, TCPSocket}, host::IPAddr, port::Integer; ipv6only=false, reuseaddr=false, kws...)
```


Bind `socket` to the given `host:port`. Note that `0.0.0.0` will listen on all devices.
- The `ipv6only` parameter disables dual stack mode. If `ipv6only=true`, only an IPv6 stack is created.
  
- If `reuseaddr=true`, multiple threads or processes can bind to the same address without error if they all set `reuseaddr=true`, but only the last to bind will receive any traffic.
  


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L245-L253)



```julia
bind(chnl::Channel, task::Task)
```


Associate the lifetime of `chnl` with a task. `Channel` `chnl` is automatically closed when the task terminates. Any uncaught exception in the task is propagated to all waiters on `chnl`.

The `chnl` object can be explicitly closed independent of task termination. Terminating tasks have no effect on already closed `Channel` objects.

When a channel is bound to multiple tasks, the first task to terminate will close the channel. When multiple channels are bound to the same task, termination of the task will close all of the bound channels.

**Examples**

```julia
julia> c = Channel(0);

julia> task = @async foreach(i->put!(c, i), 1:4);

julia> bind(c,task);

julia> for i in c
           @show i
       end;
i = 1
i = 2
i = 3
i = 4

julia> isopen(c)
false
```


```julia
julia> c = Channel(0);

julia> task = @async (put!(c, 1); error("foo"));

julia> bind(c, task);

julia> take!(c)
1

julia> put!(c, 1);
ERROR: TaskFailedException
Stacktrace:
[...]
    nested task error: foo
[...]
```



[source](https://github.com/JuliaLang/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/base/channels.jl#L237-L288)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.send' href='#Sockets.send'>#</a>&nbsp;<b><u>Sockets.send</u></b> &mdash; <i>Function</i>.




```julia
send(socket::UDPSocket, host::IPAddr, port::Integer, msg)
```


Send `msg` over `socket` to `host:port`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L430-L434)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.recv' href='#Sockets.recv'>#</a>&nbsp;<b><u>Sockets.recv</u></b> &mdash; <i>Function</i>.




```julia
recv(socket::UDPSocket)
```


Read a UDP packet from the specified socket, and return the bytes received. This call blocks.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L318-L322)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.recvfrom' href='#Sockets.recvfrom'>#</a>&nbsp;<b><u>Sockets.recvfrom</u></b> &mdash; <i>Function</i>.




```julia
recvfrom(socket::UDPSocket) -> (host_port, data)
```


Read a UDP packet from the specified socket, returning a tuple of `(host_port, data)`, where `host_port` will be an InetAddr{IPv4} or InetAddr{IPv6}, as appropriate.

::: tip Julia 1.3

Prior to Julia version 1.3, the first returned value was an address (`IPAddr`). In version 1.3 it was changed to an `InetAddr`.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L330-L339)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.setopt' href='#Sockets.setopt'>#</a>&nbsp;<b><u>Sockets.setopt</u></b> &mdash; <i>Function</i>.




```julia
setopt(sock::UDPSocket; multicast_loop=nothing, multicast_ttl=nothing, enable_broadcast=nothing, ttl=nothing)
```


Set UDP socket options.
- `multicast_loop`: loopback for multicast packets (default: `true`).
  
- `multicast_ttl`: TTL for multicast packets (default: `nothing`).
  
- `enable_broadcast`: flag must be set to `true` if socket will be used for broadcast messages, or else the UDP system will return an access error (default: `false`).
  
- `ttl`: Time-to-live of packets sent on the socket (default: `nothing`).
  


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L286-L296)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.nagle' href='#Sockets.nagle'>#</a>&nbsp;<b><u>Sockets.nagle</u></b> &mdash; <i>Function</i>.




```julia
nagle(socket::Union{TCPServer, TCPSocket}, enable::Bool)
```


Nagle&#39;s algorithm batches multiple small TCP packets into larger ones. This can improve throughput but worsen latency. Nagle&#39;s algorithm is enabled by default. This function sets whether Nagle&#39;s algorithm is active on a given TCP server or socket. The opposite option is called `TCP_NODELAY` in other languages.

::: tip Julia 1.3

This function requires Julia 1.3 or later.

:::


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L567-L578)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Sockets.quickack' href='#Sockets.quickack'>#</a>&nbsp;<b><u>Sockets.quickack</u></b> &mdash; <i>Function</i>.




```julia
quickack(socket::Union{TCPServer, TCPSocket}, enable::Bool)
```


On Linux systems, the TCP_QUICKACK is disabled or enabled on `socket`.


[source](https://github.com/lazarusA/julia/blob/ad044fee2e4ee6365c524c10a5d8c6d07c12e3f0/stdlib/Sockets/src/Sockets.jl#L589-L593)

</div>
<br>
