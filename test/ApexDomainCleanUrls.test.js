var indexDocument = 'index.html';

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host.value;
    var subdomains = host.split('.');

    if (subdomains.length > 2) {
        // redirect to apex domain
        var apex = subdomains.slice(-2).join('.');
        uri = 'https://' + apex + uri;
    } else if (uri.endsWith('/')) {
        // add index document and return properly-formatted requests
        request.uri += indexDocument;
        return request;
    }

    if (uri.endsWith('/' + indexDocument)) {
        // trim index document
        uri = uri.slice(0, -indexDocument.length);
    } else if (!request.uri.includes('.')) {
        // add trailing slash
        uri += '/';
    }

    if (uri !== request.uri) {
        // redirect if uri has changed
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: { location: { value: uri } },
        };
    }

    return request;
}
