var primarySubdomain = 'www';
var indexDocument = 'index.html';

function redirect(uri) {
    return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: { location: { value: uri } },
    };
}

function handler(event) {
    var request = event.request;
    var uri = request.uri || '/';
    var host = request.headers.host.value;
    var subdomains = host.split('.');

    if (subdomains[subdomains.length - 3] !== primarySubdomain) {
        // redirect to primary subdomain
        var apex = subdomains.slice(-2).join('.');
        uri = `https://${primarySubdomain}.${apex + uri}`;
        if (uri.endsWith('/')) {
            return redirect(uri);
        }
    }

    if (uri.endsWith('/')) {
        // add index document and return properly-formatted requests
        request.uri = uri + indexDocument;
        return request;
    } else if (uri.endsWith('/' + indexDocument)) {
        // trim index document
        uri = uri.slice(0, -indexDocument.length);
    } else if (!request.uri.includes('.')) {
        // add trailing slash
        uri += '/';
    }

    if (uri !== request.uri) {
        // redirect if uri has changed
        return redirect(uri);
    }

    return request;
}
