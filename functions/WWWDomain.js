var primarySubdomain = 'www';

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host.value;
    var subdomains = host.split('.');

    if (subdomains[subdomains.length - 3] !== primarySubdomain) {
        // redirect to primary subdomain
        var apex = subdomains.slice(-2).join('.');
        uri = `https://${primarySubdomain}.${apex + uri}`;
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: { location: { value: uri } },
        };
    }

    return request;
}
