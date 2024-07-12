
# Downloads
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Downloads.download' href='#Downloads.download'>#</a>&nbsp;<b><u>Downloads.download</u></b> &mdash; <i>Function</i>.




```julia
download(url, [ output = tempname() ];
    [ method = "GET", ]
    [ headers = <none>, ]
    [ timeout = <none>, ]
    [ progress = <none>, ]
    [ verbose = false, ]
    [ debug = <none>, ]
    [ downloader = <default>, ]
) -> output

    url        :: AbstractString
    output     :: Union{AbstractString, AbstractCmd, IO}
    method     :: AbstractString
    headers    :: Union{AbstractVector, AbstractDict}
    timeout    :: Real
    progress   :: (total::Integer, now::Integer) --> Any
    verbose    :: Bool
    debug      :: (type, message) --> Any
    downloader :: Downloader
```


Download a file from the given url, saving it to `output` or if not specified, a temporary path. The `output` can also be an `IO` handle, in which case the body of the response is streamed to that handle and the handle is returned. If `output` is a command, the command is run and output is sent to it on stdin.

If the `downloader` keyword argument is provided, it must be a `Downloader` object. Resources and connections will be shared between downloads performed by the same `Downloader` and cleaned up automatically when the object is garbage collected or there have been no downloads performed with it for a grace period. See `Downloader` for more info about configuration and usage.

If the `headers` keyword argument is provided, it must be a vector or dictionary whose elements are all pairs of strings. These pairs are passed as headers when downloading URLs with protocols that supports them, such as HTTP/S.

The `timeout` keyword argument specifies a timeout for the download to complete in seconds, with a resolution of milliseconds. By default no timeout is set, but this can also be explicitly requested by passing a timeout value of `Inf`. Separately, if 20 seconds elapse without receiving any data, the download will timeout. See extended help for how to disable this timeout.

If the `progress` keyword argument is provided, it must be a callback function which will be called whenever there are updates about the size and status of the ongoing download. The callback must take two integer arguments: `total` and `now` which are the total size of the download in bytes, and the number of bytes which have been downloaded so far. Note that `total` starts out as zero and remains zero until the server gives an indication of the total size of the download (e.g. with a `Content-Length` header), which may never happen. So a well-behaved progress callback should handle a total size of zero gracefully.

If the `verbose` option is set to true, `libcurl`, which is used to implement the download functionality will print debugging information to `stderr`. If the `debug` option is set to a function accepting two `String` arguments, then the verbose option is ignored and instead the data that would have been printed to `stderr` is passed to the `debug` callback with `type` and `message` arguments. The `type` argument indicates what kind of event has occurred, and is one of: `TEXT`, `HEADER IN`, `HEADER OUT`, `DATA IN`, `DATA OUT`, `SSL DATA IN` or `SSL DATA OUT`. The `message` argument is the description of the debug event.

**Extended Help**

For further customization, use a [`Downloader`](/stdlib/Downloads#Downloads.Downloader) and [`easy_hook`s](https://github.com/JuliaLang/Downloads.jl#mutual-tls-using-downloads). For example, to disable the 20 second timeout when no data is received, you may use the following:

```jl
downloader = Downloads.Downloader()
downloader.easy_hook = (easy, info) -> Downloads.Curl.setopt(easy, Downloads.Curl.CURLOPT_LOW_SPEED_TIME, 0)

Downloads.download("https://httpbingo.julialang.org/delay/30"; downloader)
```



[source](https://github.com/JuliaLang/Downloads.jl/blob/a9d274ff6588cc5dbfa90e908ee34c2408bab84a/src/Downloads.jl#L172-L245)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Downloads.request' href='#Downloads.request'>#</a>&nbsp;<b><u>Downloads.request</u></b> &mdash; <i>Function</i>.




```julia
request(url;
    [ input = <none>, ]
    [ output = <none>, ]
    [ method = input ? "PUT" : output ? "GET" : "HEAD", ]
    [ headers = <none>, ]
    [ timeout = <none>, ]
    [ progress = <none>, ]
    [ verbose = false, ]
    [ debug = <none>, ]
    [ throw = true, ]
    [ downloader = <default>, ]
) -> Union{Response, RequestError}

    url        :: AbstractString
    input      :: Union{AbstractString, AbstractCmd, IO}
    output     :: Union{AbstractString, AbstractCmd, IO}
    method     :: AbstractString
    headers    :: Union{AbstractVector, AbstractDict}
    timeout    :: Real
    progress   :: (dl_total, dl_now, ul_total, ul_now) --> Any
    verbose    :: Bool
    debug      :: (type, message) --> Any
    throw      :: Bool
    downloader :: Downloader
```


Make a request to the given url, returning a `Response` object capturing the status, headers and other information about the response. The body of the response is written to `output` if specified and discarded otherwise. For HTTP/S requests, if an `input` stream is given, a `PUT` request is made; otherwise if an `output` stream is given, a `GET` request is made; if neither is given a `HEAD` request is made. For other protocols, appropriate default methods are used based on what combination of input and output are requested. The following options differ from the `download` function:
- `input` allows providing a request body; if provided default to `PUT` request
  
- `progress` is a callback taking four integers for upload and download progress
  
- `throw` controls whether to throw or return a `RequestError` on request error
  

Note that unlike `download` which throws an error if the requested URL could not be downloaded (indicated by non-2xx status code), `request` returns a `Response` object no matter what the status code of the response is. If there is an error with getting a response at all, then a `RequestError` is thrown or returned.


[source](https://github.com/JuliaLang/Downloads.jl/blob/a9d274ff6588cc5dbfa90e908ee34c2408bab84a/src/Downloads.jl#L276-L319)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Downloads.Response' href='#Downloads.Response'>#</a>&nbsp;<b><u>Downloads.Response</u></b> &mdash; <i>Type</i>.




```julia
struct Response
    proto   :: String
    url     :: String
    status  :: Int
    message :: String
    headers :: Vector{Pair{String,String}}
end
```


`Response` is a type capturing the properties of a successful response to a request as an object. It has the following fields:
- `proto`: the protocol that was used to get the response
  
- `url`: the URL that was ultimately requested after following redirects
  
- `status`: the status code of the response, indicating success, failure, etc.
  
- `message`: a textual message describing the nature of the response
  
- `headers`: any headers that were returned with the response
  

The meaning and availability of some of these responses depends on the protocol used for the request. For many protocols, including HTTP/S and S/FTP, a 2xx status code indicates a successful response. For responses in protocols that do not support headers, the headers vector will be empty. HTTP/2 does not include a status message, only a status code, so the message will be empty.


[source](https://github.com/JuliaLang/Downloads.jl/blob/a9d274ff6588cc5dbfa90e908ee34c2408bab84a/src/Downloads.jl#L77-L100)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Downloads.RequestError' href='#Downloads.RequestError'>#</a>&nbsp;<b><u>Downloads.RequestError</u></b> &mdash; <i>Type</i>.




```julia
struct RequestError <: ErrorException
    url      :: String
    code     :: Int
    message  :: String
    response :: Response
end
```


`RequestError` is a type capturing the properties of a failed response to a request as an exception object:
- `url`: the original URL that was requested without any redirects
  
- `code`: the libcurl error code; `0` if a protocol-only error occurred
  
- `message`: the libcurl error message indicating what went wrong
  
- `response`: response object capturing what response info is available
  

The same `RequestError` type is thrown by `download` if the request was successful but there was a protocol-level error indicated by a status code that is not in the 2xx range, in which case `code` will be zero and the `message` field will be the empty string. The `request` API only throws a `RequestError` if the libcurl error `code` is non-zero, in which case the included `response` object is likely to have a `status` of zero and an empty message. There are, however, situations where a curl-level error is thrown due to a protocol error, in which case both the inner and outer code and message may be of interest.


[source](https://github.com/JuliaLang/Downloads.jl/blob/a9d274ff6588cc5dbfa90e908ee34c2408bab84a/src/Downloads.jl#L111-L135)

</div>
<br>
<div style='border-width:1px; border-style:solid; border-color:black; padding: 1em; border-radius: 25px;'>
<a id='Downloads.Downloader' href='#Downloads.Downloader'>#</a>&nbsp;<b><u>Downloads.Downloader</u></b> &mdash; <i>Type</i>.




```julia
Downloader(; [ grace::Real = 30 ])
```


`Downloader` objects are used to perform individual `download` operations. Connections, name lookups and other resources are shared within a `Downloader`. These connections and resources are cleaned up after a configurable grace period (default: 30 seconds) since anything was downloaded with it, or when it is garbage collected, whichever comes first. If the grace period is set to zero, all resources will be cleaned up immediately as soon as there are no more ongoing downloads in progress. If the grace period is set to `Inf` then resources are not cleaned up until `Downloader` is garbage collected.


[source](https://github.com/JuliaLang/Downloads.jl/blob/a9d274ff6588cc5dbfa90e908ee34c2408bab84a/src/Downloads.jl#L27-L38)

</div>
<br>
