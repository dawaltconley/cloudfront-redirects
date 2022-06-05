const assert = require('assert').strict

const mkRedirect = (uri) => ({
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: uri } },
})

const mkEvent = (host, uri) => ({
    request: {
        uri: uri,
        headers: {
            host: {
                value: host
            }
        }
    }
})

class RedirectTests {
    constructor(handler) {
        this.handler = handler
        this.itProduces = this.itProduces.bind(this);
    }

    itProduces(host, uri, result) {
        let resultDescription = result.uri || result.headers.location.value
        it(`${host + uri} => ${resultDescription}`, () => 
            assert.deepEqual(this.handler(mkEvent(host, uri)), result))
    }
}

module.exports = {
    RedirectTests,
    mkEvent,
    mkRedirect,
}
