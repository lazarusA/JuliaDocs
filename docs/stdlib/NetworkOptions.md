


# Network Options {#Network-Options}
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ca_roots' href='#NetworkOptions.ca_roots'>#</a>&nbsp;<b><u>NetworkOptions.ca_roots</u></b> &mdash; <i>Function</i>.




```julia
ca_roots() :: Union{Nothing, String}
```


The `ca_roots()` function tells the caller where, if anywhere, to find a file or directory of PEM-encoded certificate authority roots. By default, on systems like Windows and macOS where the built-in TLS engines know how to verify hosts using the system&#39;s built-in certificate verification mechanism, this function will return `nothing`. On classic UNIX systems (excluding macOS), root certificates are typically stored in a file in `/etc`: the common places for the current UNIX system will be searched and if one of these paths exists, it will be returned; if none of these typical root certificate paths exist, then the path to the set of root certificates that are bundled with Julia is returned.

The default value returned by `ca_roots()` may be overridden by setting the `JULIA_SSL_CA_ROOTS_PATH`, `SSL_CERT_DIR`, or `SSL_CERT_FILE` environment variables, in which case this function will always return the value of the first of these variables that is set (whether the path exists or not). If `JULIA_SSL_CA_ROOTS_PATH` is set to the empty string, then the other variables are ignored (as if unset); if the other variables are set to the empty string, they behave is if they are not set.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ca_roots.jl#L3-L23)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ca_roots_path' href='#NetworkOptions.ca_roots_path'>#</a>&nbsp;<b><u>NetworkOptions.ca_roots_path</u></b> &mdash; <i>Function</i>.




```julia
ca_roots_path() :: String
```


The `ca_roots_path()` function is similar to the `ca_roots()` function except that it always returns a path to a file or directory of PEM-encoded certificate authority roots. When called on a system like Windows or macOS, where system root certificates are not stored in the file system, it will currently return the path to the set of root certificates that are bundled with Julia. (In the future, this function may instead extract the root certificates from the system and save them to a file whose path would be returned.)

If it is possible to configure a library that uses TLS to use the system certificates that is generally preferable: i.e. it is better to use `ca_roots()` which returns `nothing` to indicate that the system certs should be used. The `ca_roots_path()` function should only be used when configuring libraries which _require_ a path to a file or directory for root certificates.

The default value returned by `ca_roots_path()` may be overridden by setting the `JULIA_SSL_CA_ROOTS_PATH`, `SSL_CERT_DIR`, or `SSL_CERT_FILE` environment variables, in which case this function will always return the value of the first of these variables that is set (whether the path exists or not). If `JULIA_SSL_CA_ROOTS_PATH` is set to the empty string, then the other variables are ignored (as if unset); if the other variables are set to the empty string, they behave is if they are not set.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ca_roots.jl#L26-L50)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ssh_dir' href='#NetworkOptions.ssh_dir'>#</a>&nbsp;<b><u>NetworkOptions.ssh_dir</u></b> &mdash; <i>Function</i>.




```julia
ssh_dir() :: String
```


The `ssh_dir()` function returns the location of the directory where the `ssh` program keeps/looks for configuration files. By default this is `~/.ssh` but this can be overridden by setting the environment variable `SSH_DIR`.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ssh_options.jl#L10-L16)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ssh_key_pass' href='#NetworkOptions.ssh_key_pass'>#</a>&nbsp;<b><u>NetworkOptions.ssh_key_pass</u></b> &mdash; <i>Function</i>.




```julia
ssh_key_pass() :: String
```


The `ssh_key_pass()` function returns the value of the environment variable `SSH_KEY_PASS` if it is set or `nothing` if it is not set. In the future, this may be able to find a password by other means, such as secure system storage, so packages that need a password to decrypt an SSH private key should use this API instead of directly checking the environment variable so that they gain such capabilities automatically when they are added.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ssh_options.jl#L19-L28)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ssh_key_name' href='#NetworkOptions.ssh_key_name'>#</a>&nbsp;<b><u>NetworkOptions.ssh_key_name</u></b> &mdash; <i>Function</i>.




```julia
ssh_key_name() :: String
```


The `ssh_key_name()` function returns the base name of key files that SSH should use for when establishing a connection. There is usually no reason that this function should be called directly and libraries should generally use the `ssh_key_path` and `ssh_pub_key_path` functions to get full paths. If the environment variable `SSH_KEY_NAME` is set then this function returns that; otherwise it returns `id_rsa` by default.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ssh_options.jl#L31-L40)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ssh_key_path' href='#NetworkOptions.ssh_key_path'>#</a>&nbsp;<b><u>NetworkOptions.ssh_key_path</u></b> &mdash; <i>Function</i>.




```julia
ssh_key_path() :: String
```


The `ssh_key_path()` function returns the path of the SSH private key file that should be used for SSH connections. If the `SSH_KEY_PATH` environment variable is set then it will return that value. Otherwise it defaults to returning

```
joinpath(ssh_dir(), ssh_key_name())
```


This default value in turn depends on the `SSH_DIR` and `SSH_KEY_NAME` environment variables.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ssh_options.jl#L43-L54)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ssh_pub_key_path' href='#NetworkOptions.ssh_pub_key_path'>#</a>&nbsp;<b><u>NetworkOptions.ssh_pub_key_path</u></b> &mdash; <i>Function</i>.




```julia
ssh_pub_key_path() :: String
```


The `ssh_pub_key_path()` function returns the path of the SSH public key file that should be used for SSH connections. If the `SSH_PUB_KEY_PATH` environment variable is set then it will return that value. If that isn&#39;t set but `SSH_KEY_PATH` is set, it will return that path with the `.pub` suffix appended. If neither is set, it defaults to returning

```
joinpath(ssh_dir(), ssh_key_name() * ".pub")
```


This default value in turn depends on the `SSH_DIR` and `SSH_KEY_NAME` environment variables.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ssh_options.jl#L61-L74)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ssh_known_hosts_files' href='#NetworkOptions.ssh_known_hosts_files'>#</a>&nbsp;<b><u>NetworkOptions.ssh_known_hosts_files</u></b> &mdash; <i>Function</i>.




```julia
ssh_known_hosts_files() :: Vector{String}
```


The `ssh_known_hosts_files()` function returns a vector of paths of SSH known hosts files that should be used when establishing the identities of remote servers for SSH connections. By default this function returns

```
[joinpath(ssh_dir(), "known_hosts"), bundled_known_hosts]
```


where `bundled_known_hosts` is the path of a copy of a known hosts file that is bundled with this package (containing known hosts keys for `github.com` and `gitlab.com`). If the environment variable `SSH_KNOWN_HOSTS_FILES` is set, however, then its value is split into paths on the `:` character (or on `;` on Windows) and this vector of paths is returned instead. If any component of this vector is empty, it is expanded to the default known hosts paths.

Packages that use `ssh_known_hosts_files()` should ideally look for matching entries by comparing the host name and key types, considering the first entry in any of the files which matches to be the definitive identity of the host. If the caller cannot compare the key type (e.g. because it has been hashes) then it must approximate the above algorithm by looking for all matching entries for a host in each file: if a file has any entries for a host then one of them must match; the caller should only continue to search further known hosts files if there are no entries for the host in question in an earlier file.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ssh_options.jl#L83-L107)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.ssh_known_hosts_file' href='#NetworkOptions.ssh_known_hosts_file'>#</a>&nbsp;<b><u>NetworkOptions.ssh_known_hosts_file</u></b> &mdash; <i>Function</i>.




```julia
ssh_known_hosts_file() :: String
```


The `ssh_known_hosts_file()` function returns a single path of an SSH known hosts file that should be used when establishing the identities of remote servers for SSH connections. It returns the first path returned by `ssh_known_hosts_files` that actually exists. Callers who can look in more than one known hosts file should use `ssh_known_hosts_files` instead and look for host matches in all the files returned as described in that function&#39;s docs.


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/ssh_options.jl#L126-L135)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='NetworkOptions.verify_host' href='#NetworkOptions.verify_host'>#</a>&nbsp;<b><u>NetworkOptions.verify_host</u></b> &mdash; <i>Function</i>.




```julia
verify_host(url::AbstractString, [transport::AbstractString]) :: Bool
```


The `verify_host` function tells the caller whether the identity of a host should be verified when communicating over secure transports like TLS or SSH. The `url` argument may be:
1. a proper URL staring with `proto://`
  
1. an `ssh`-style bare host name or host name prefixed with `user@`
  
1. an `scp`-style host as above, followed by `:` and a path location
  

In each case the host name part is parsed out and the decision about whether to verify or not is made based solely on the host name, not anything else about the input URL. In particular, the protocol of the URL does not matter (more below).

The `transport` argument indicates the kind of transport that the query is about. The currently known values are `SSL`/`ssl` (alias `TLS`/`tls`) and `SSH`/`ssh`. If the transport is omitted, the query will return `true` only if the host name should not be verified regardless of transport.

The host name is matched against the host patterns in the relevant environment variables depending on whether `transport` is supplied and what its value is:
- `JULIA_NO_VERIFY_HOSTS` — hosts that should not be verified for any transport
  
- `JULIA_SSL_NO_VERIFY_HOSTS` — hosts that should not be verified for SSL/TLS
  
- `JULIA_SSH_NO_VERIFY_HOSTS` — hosts that should not be verified for SSH
  
- `JULIA_ALWAYS_VERIFY_HOSTS` — hosts that should always be verified
  

The values of each of these variables is a comma-separated list of host name patterns with the following syntax — each pattern is split on `.` into parts and each part must one of:
1. A literal domain name component consisting of one or more ASCII letter, digit, hyphen or underscore (technically not part of a legal host name, but sometimes used). A literal domain name component matches only itself.
  
1. A `**`, which matches zero or more domain name components.
  
1. A `*`, which match any one domain name component.
  

When matching a host name against a pattern list in one of these variables, the host name is split on `.` into components and that sequence of words is matched against the pattern: a literal pattern matches exactly one host name component with that value; a `*` pattern matches exactly one host name component with any value; a `**` pattern matches any number of host name components. For example:
- `**` matches any host name
  
- `**.org` matches any host name in the `.org` top-level domain
  
- `example.com` matches only the exact host name `example.com`
  
- `*.example.com` matches `api.example.com` but not `example.com` or `v1.api.example.com`
  
- `**.example.com` matches any domain under `example.com`, including `example.com` itself, `api.example.com` and `v1.api.example.com`
  


[source](https://github.com/JuliaLang/NetworkOptions.jl/blob/8eec5cb0acec4591e6db3c017f7499426cd8e352/src/verify_host.jl#L3-L54)

</div>
<br>
