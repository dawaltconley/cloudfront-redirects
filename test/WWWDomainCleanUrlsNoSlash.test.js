const rewire = require('rewire')
const { RedirectTests, mkEvent, mkRedirect } = require('./utilities')

const fn = rewire('../functions/WWWDomainCleanUrlsNoSlash.js')
const handler = fn.__get__('handler')

const { itProduces } = new RedirectTests(handler)

describe('WWWDomainCleanUrlsNoSlash', () => {
    describe('should return the index document for valid urls', () => {
        itProduces('www.example.com', '', mkEvent('www.example.com', '/index.html').request)
        itProduces('www.example.com', '/foo', mkEvent('www.example.com', '/foo/index.html').request)
        itProduces('www.example.com', '/bar/baz', mkEvent('www.example.com', '/bar/baz/index.html').request)
    })
    describe('should trim an index document from the uri', () => {
        itProduces('www.example.com', '/index.html', mkRedirect(''))
        itProduces('www.example.com', '/foo/index.html', mkRedirect('/foo'))
        itProduces('www.example.com', '/bar/baz/index.html', mkRedirect('/bar/baz'))
    })
    describe('should trim a trailing slash', () => {
        itProduces('www.example.com', '/', mkRedirect(''))
        itProduces('www.example.com', '/foo/', mkRedirect('/foo'))
        itProduces('www.example.com', '/bar/baz/', mkRedirect('/bar/baz'))
    })
    describe('should not affect file uris', () => {
        let args = [ 'www.example.com', '/main.css' ];
        itProduces(...args, mkEvent(...args).request)
        args = [ 'www.example.com', '/js/foo.js' ];
        itProduces(...args, mkEvent(...args).request)
        args = [ 'www.example.com', '/assets/generated/test.jpeg' ];
        itProduces(...args, mkEvent(...args).request)
    })
    describe('should redirect to the primary subdomain', () => {
        itProduces('example.com', '', mkRedirect('https://www.example.com'))
        itProduces('api.example.com', '', mkRedirect('https://www.example.com'))
        itProduces('www.foo.example.com', '', mkRedirect('https://www.example.com'))
    })
    describe('should redirect to the primary subdomain and trim an index document from the uri', () => {
        itProduces('example.com', '/index.html', mkRedirect('https://www.example.com'))
        itProduces('api.example.com', '/foo/index.html', mkRedirect('https://www.example.com/foo'))
        itProduces('www.foo.example.com', '/bar/baz/index.html', mkRedirect('https://www.example.com/bar/baz'))
    })
    describe('should redirect to the primary subdomain and trim a trailing slash', () => {
        itProduces('example.com', '/', mkRedirect('https://www.example.com'))
        itProduces('api.example.com', '/foo/', mkRedirect('https://www.example.com/foo'))
        itProduces('www.foo.example.com', '/bar/baz/', mkRedirect('https://www.example.com/bar/baz'))
    })
    describe('should redirect to the primary subdomain and not affect file uris', () => {
        itProduces('www.m.example.com', '/main.js', mkRedirect('https://www.example.com/main.js'))
        itProduces('home.example.com', '/assets/foo.png', mkRedirect('https://www.example.com/assets/foo.png'))
    })
})
