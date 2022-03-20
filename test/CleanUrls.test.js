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
        // add index document and return properly-formatted requests
        request.uri += indexDocument;
        return request;
    }

    if (uri.endsWith('/' + indexDocument)) {
        // trim index document
        return redirect(uri.slice(0, -indexDocument.length));
    }

    if (!request.uri.includes('.')) {
        // add trailing slash
        return redirect(uri + '/');
    }

    return request;
}
