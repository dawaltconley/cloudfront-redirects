const rewire = require('rewire')
const assert = require('assert').strict

const fn = rewire('../functions/WWWDomain.js')
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

describe('WWWDomain', () => {
    it('should redirect to the primary subdomain', () => {
        produces('example.com', '/', mkRedirect('https://www.example.com/'))
        produces('api.example.com', '/foo', mkRedirect('https://www.example.com/foo'))
        produces('www.foo.example.com', '/index.html', mkRedirect('https://www.example.com/index.html'))
        produces('www.m.example.com', '/assets/img.jpeg', mkRedirect('https://www.example.com/assets/img.jpeg'))
    })
})
