const rewire = require('rewire')
const assert = require('assert').strict

const fn = rewire('../functions/WWWDomainCleanUrls.js')
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

describe('WWWDomainCleanUrls', () => {
    it('should return the index document for valid urls', () => {
        produces('www.example.com', '/', mkEvent('www.example.com', '/index.html').request)
        produces('www.example.com', '/foo/', mkEvent('www.example.com', '/foo/index.html').request)
        produces('www.example.com', '/bar/baz/', mkEvent('www.example.com', '/bar/baz/index.html').request)
    })
    it('should trim an index document from the uri', () => {
        produces('www.example.com', '/index.html', mkRedirect('/'))
        produces('www.example.com', '/foo/index.html', mkRedirect('/foo/'))
        produces('www.example.com', '/bar/baz/index.html', mkRedirect('/bar/baz/'))
    })
    it('should add a missing trailing slash', () => {
        produces('www.example.com', '', mkRedirect('/'))
        produces('www.example.com', '/foo', mkRedirect('/foo/'))
        produces('www.example.com', '/bar/baz', mkRedirect('/bar/baz/'))
    })
    it('should not affect file uris', () => {
        let args = [ 'www.example.com', '/main.css' ];
        produces(...args, mkEvent(...args).request)
        args = [ 'www.example.com', '/js/foo.js' ];
        produces(...args, mkEvent(...args).request)
        args = [ 'www.example.com', '/assets/generated/test.jpeg' ];
        produces(...args, mkEvent(...args).request)
    })
    it('should redirect to the primary subdomain', () => {
        produces('example.com', '/', mkRedirect('https://www.example.com/'))
        produces('api.example.com', '/', mkRedirect('https://www.example.com/'))
        produces('www.foo.example.com', '/', mkRedirect('https://www.example.com/'))
    })
    it('should redirect to the primary subdomain and trim an index document from the uri', () => {
        produces('example.com', '/index.html', mkRedirect('https://www.example.com/'))
        produces('api.example.com', '/foo/index.html', mkRedirect('https://www.example.com/foo/'))
        produces('www.foo.example.com', '/bar/baz/index.html', mkRedirect('https://www.example.com/bar/baz/'))
    })
    it('should redirect to the primary subdomain and add a missing trailing slash', () => {
        produces('example.com', '', mkRedirect('https://www.example.com/'))
        produces('api.example.com', '/foo', mkRedirect('https://www.example.com/foo/'))
        produces('www.foo.example.com', '/bar/baz', mkRedirect('https://www.example.com/bar/baz/'))
    })
    it('should redirect to the primary subdomain and not affect file uris', () => {
        produces('www.m.example.com', '/main.js', mkRedirect('https://www.example.com/main.js'))
        produces('home.example.com', '/assets/foo.png', mkRedirect('https://www.example.com/assets/foo.png'))
    })
})
