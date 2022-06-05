const rewire = require('rewire')
const { RedirectTests, mkEvent, mkRedirect } = require('./utilities')

const fn = rewire('../functions/ApexDomainCleanUrls.js')
const handler = fn.__get__('handler')

const { itProduces } = new RedirectTests(handler)

describe('ApexDomainCleanUrls', () => {
    describe('should return the index document for valid urls', () => {
        itProduces('example.com', '/', mkEvent('example.com', '/index.html').request)
        itProduces('example.com', '/foo/', mkEvent('example.com', '/foo/index.html').request)
        itProduces('example.com', '/bar/baz/', mkEvent('example.com', '/bar/baz/index.html').request)
    })
    describe('should trim an index document from the uri', () => {
        itProduces('example.com', '/index.html', mkRedirect('/'))
        itProduces('example.com', '/foo/index.html', mkRedirect('/foo/'))
        itProduces('example.com', '/bar/baz/index.html', mkRedirect('/bar/baz/'))
    })
    describe('should add a missing trailing slash', () => {
        itProduces('example.com', '', mkRedirect('/'))
        itProduces('example.com', '/foo', mkRedirect('/foo/'))
        itProduces('example.com', '/bar/baz', mkRedirect('/bar/baz/'))
    })
    describe('should not affect file uris', () => {
        let args = [ 'example.com', '/main.css' ];
        itProduces(...args, mkEvent(...args).request)
        args = [ 'example.com', '/js/foo.js' ];
        itProduces(...args, mkEvent(...args).request)
        args = [ 'example.com', '/assets/generated/test.jpeg' ];
        itProduces(...args, mkEvent(...args).request)
    })
    describe('should redirect to the apex domain', () => {
        itProduces('www.example.com', '/', mkRedirect('https://example.com/'))
        itProduces('api.example.com', '/', mkRedirect('https://example.com/'))
        itProduces('www.foo.example.com', '/', mkRedirect('https://example.com/'))
    })
    describe('should redirect to the apex domain and trim an index document from the uri', () => {
        itProduces('www.example.com', '/index.html', mkRedirect('https://example.com/'))
        itProduces('api.example.com', '/foo/index.html', mkRedirect('https://example.com/foo/'))
        itProduces('www.foo.example.com', '/bar/baz/index.html', mkRedirect('https://example.com/bar/baz/'))
    })
    describe('should redirect to the apex domain and add a missing trailing slash', () => {
        itProduces('www.example.com', '', mkRedirect('https://example.com/'))
        itProduces('api.example.com', '/foo', mkRedirect('https://example.com/foo/'))
        itProduces('www.foo.example.com', '/bar/baz', mkRedirect('https://example.com/bar/baz/'))
    })
    describe('should redirect to the apex domain and not affect file uris', () => {
        itProduces('www.m.example.com', '/main.js', mkRedirect('https://example.com/main.js'))
        itProduces('home.example.com', '/assets/foo.png', mkRedirect('https://example.com/assets/foo.png'))
    })
})
