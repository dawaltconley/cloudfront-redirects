var primarySubdomain = 'www';
var indexDocument = 'index.html';

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host.value;
    var subdomains = host.split('.');

    if (subdomains[subdomains.length - 3] !== primarySubdomain) {
        // redirect to primary subdomain
        var apex = subdomains.slice(-2).join('.');
        uri = `https://${primarySubdomain}.${apex + uri}`;
    }

    if (uri.endsWith('/')) {
        // trim trailing slash
        uri = uri.slice(0, -1);
    } else if (uri.endsWith('/' + indexDocument)) {
        // trim index document
        uri = uri.slice(0, -indexDocument.length - 1);
    }

    if (uri !== request.uri) {
        // redirect if uri has changed
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: { location: { value: uri } },
        };
    }

    if (!request.uri.includes('.')) {
        // add trailing slash
        request.uri += `/${indexDocument}`;
    }
    return request;
}
