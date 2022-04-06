const rewire = require('rewire')
const assert = require('assert').strict

const fn = rewire('../functions/ApexDomainCleanUrls.js')
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

describe('ApexDomainCleanUrls', () => {
    it('should return the index document for valid urls', () => {
        produces('example.com', '/', mkEvent('example.com', '/index.html').request)
        produces('example.com', '/foo/', mkEvent('example.com', '/foo/index.html').request)
        produces('example.com', '/bar/baz/', mkEvent('example.com', '/bar/baz/index.html').request)
    })
    it('should trim an index document from the uri', () => {
        produces('example.com', '/index.html', mkRedirect('/'))
        produces('example.com', '/foo/index.html', mkRedirect('/foo/'))
        produces('example.com', '/bar/baz/index.html', mkRedirect('/bar/baz/'))
    })
    it('should add a missing trailing slash', () => {
        produces('example.com', '', mkRedirect('/'))
        produces('example.com', '/foo', mkRedirect('/foo/'))
        produces('example.com', '/bar/baz', mkRedirect('/bar/baz/'))
    })
    it('should not affect file uris', () => {
        let args = [ 'example.com', '/main.css' ];
        produces(...args, mkEvent(...args).request)
        args = [ 'example.com', '/js/foo.js' ];
        produces(...args, mkEvent(...args).request)
        args = [ 'example.com', '/assets/generated/test.jpeg' ];
        produces(...args, mkEvent(...args).request)
    })
    it('should redirect to the apex domain', () => {
        produces('www.example.com', '/', mkRedirect('https://example.com/'))
        produces('api.example.com', '/', mkRedirect('https://example.com/'))
        produces('www.foo.example.com', '/', mkRedirect('https://example.com/'))
    })
    it('should redirect to the apex domain and trim an index document from the uri', () => {
        produces('www.example.com', '/index.html', mkRedirect('https://example.com/'))
        produces('api.example.com', '/foo/index.html', mkRedirect('https://example.com/foo/'))
        produces('www.foo.example.com', '/bar/baz/index.html', mkRedirect('https://example.com/bar/baz/'))
    })
    it('should redirect to the apex domain and add a missing trailing slash', () => {
        produces('www.example.com', '', mkRedirect('https://example.com/'))
        produces('api.example.com', '/foo', mkRedirect('https://example.com/foo/'))
        produces('www.foo.example.com', '/bar/baz', mkRedirect('https://example.com/bar/baz/'))
    })
    it('should redirect to the apex domain and not affect file uris', () => {
        produces('www.m.example.com', '/main.js', mkRedirect('https://example.com/main.js'))
        produces('home.example.com', '/assets/foo.png', mkRedirect('https://example.com/assets/foo.png'))
    })
})
