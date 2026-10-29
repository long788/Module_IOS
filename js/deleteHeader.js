/***********************************************
> deleteHeader - Strip ETag & If-None-Match for RevenueCat & Firebase Remote Config
***********************************************/	

const version = 'V1.0.3';

function setHeaderValue(e, a, d) {
    var r = a.toLowerCase();
    if (r in e) e[r] = d;
    else e[a] = d;
}

var modifiedHeaders = $request.headers;
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");
delete modifiedHeaders["If-None-Match"];
delete modifiedHeaders["if-none-match"];
delete modifiedHeaders["If-Modified-Since"];
delete modifiedHeaders["if-modified-since"];
$done({ headers: modifiedHeaders });
