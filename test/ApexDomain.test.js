function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host.value;
    var subdomains = host.split('.');

    if (subdomains.length > 2) {
        // redirect to apex domain
        var apex = subdomains.slice(-2).join('.');
        uri = 'https://' + apex + uri;
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: { location: { value: uri } },
        };
    }

    return request;
}
