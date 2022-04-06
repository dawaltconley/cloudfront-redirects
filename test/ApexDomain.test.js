const rewire = require('rewire')
const assert = require('assert').strict

const fn = rewire('../functions/ApexDomain.js')
const handler = fn.__get__('handler')

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

const produces = (host, uri, result) => assert.deepEqual(handler(mkEvent(host, uri)), result)

describe('ApexDomain', () => {
    it('should redirect to the apex domain', () => {
        produces('www.example.com', '/', mkRedirect('https://example.com/'))
        produces('api.example.com', '/foo', mkRedirect('https://example.com/foo'))
        produces('www.foo.example.com', '/index.html', mkRedirect('https://example.com/index.html'))
        produces('www.m.example.com', '/assets/img.jpeg', mkRedirect('https://example.com/assets/img.jpeg'))
    })
})
