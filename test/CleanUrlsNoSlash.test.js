const rewire = require('rewire')
const assert = require('assert').strict

const fn = rewire('../functions/CleanUrlsNoSlash.js')
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

describe('CleanUrlsNoSlash', () => {
    it('should return the index document for valid urls', () => {
        produces('www.example.com', '', mkEvent('www.example.com', '/index.html').request)
        produces('example.com', '/foo', mkEvent('example.com', '/foo/index.html').request)
        produces('m.example.com', '/bar/baz', mkEvent('m.example.com', '/bar/baz/index.html').request)
    })
    it('should trim an index document from the uri', () => {
        produces('example.com', '/index.html', mkRedirect(''))
        produces('api.example.com', '/foo/index.html', mkRedirect('/foo'))
        produces('www.example.com', '/bar/baz/index.html', mkRedirect('/bar/baz'))
    })
    it('should trim a trailing slash', () => {
        produces('www.example.com', '/', mkRedirect(''))
        produces('m.example.com', '/foo/', mkRedirect('/foo'))
        produces('example.com', '/bar/baz/', mkRedirect('/bar/baz'))
    })
    it('should not affect file uris', () => {
        let args = [ 'example.com', '/main.css' ]
        produces(...args, mkEvent(...args).request)
        args = [ 'm.example.com', '/js/foo.js' ]
        produces(...args, mkEvent(...args).request)
        args = [ 'www.example.com', '/assets/generated/test.jpeg' ];
        produces(...args, mkEvent(...args).request)
    })
})
