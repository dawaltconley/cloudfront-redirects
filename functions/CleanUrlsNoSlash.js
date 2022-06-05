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
    var uri = request.uri;

    if (uri.endsWith('/')) {
        // trim trailing slash
        uri = uri.slice(0, -1);
    } else if (uri.endsWith('/' + indexDocument)) {
        // trim index document
        uri = uri.slice(0, -indexDocument.length - 1);
        if (!uri) uri = '/';
    }

    if (uri && uri !== request.uri) {
        return redirect(uri);
    }

    if (!request.uri.includes('.')) {
        // add index document and return properly-formatted requests
        request.uri = `${uri}/${indexDocument}`;
    }
    return request;
}
