const rewire = require('rewire')
const { RedirectTests, mkEvent, mkRedirect } = require('./utilities')

const fn = rewire('../functions/CleanUrls.js')
const handler = fn.__get__('handler')

const { itProduces } = new RedirectTests(handler)

describe('CleanUrls', () => {
    describe('should return the index document for valid urls', () => {
        itProduces('www.example.com', '/', mkEvent('www.example.com', '/index.html').request)
        itProduces('example.com', '/foo/', mkEvent('example.com', '/foo/index.html').request)
        itProduces('m.example.com', '/bar/baz/', mkEvent('m.example.com', '/bar/baz/index.html').request)
    })
    describe('should trim an index document from the uri', () => {
        itProduces('example.com', '/index.html', mkRedirect('/'))
        itProduces('api.example.com', '/foo/index.html', mkRedirect('/foo/'))
        itProduces('www.example.com', '/bar/baz/index.html', mkRedirect('/bar/baz/'))
    })
    describe('should add a missing trailing slash', () => {
        itProduces('www.example.com', '', mkRedirect('/'))
        itProduces('m.example.com', '/foo', mkRedirect('/foo/'))
        itProduces('example.com', '/bar/baz', mkRedirect('/bar/baz/'))
    })
    describe('should not affect file uris', () => {
        let args = [ 'example.com', '/main.css' ]
        itProduces(...args, mkEvent(...args).request)
        args = [ 'm.example.com', '/js/foo.js' ]
        itProduces(...args, mkEvent(...args).request)
        args = [ 'www.example.com', '/assets/generated/test.jpeg' ];
        itProduces(...args, mkEvent(...args).request)
    })
})
