const rewire = require('rewire')
const { RedirectTests, mkEvent, mkRedirect } = require('./utilities')

const fn = rewire('../functions/ApexDomain.js')
const handler = fn.__get__('handler')

const { itProduces } = new RedirectTests(handler)

describe('ApexDomain', () => {
    describe('should redirect to the apex domain', () => {
        itProduces('www.example.com', '/', mkRedirect('https://example.com/'))
        itProduces('api.example.com', '/foo', mkRedirect('https://example.com/foo'))
        itProduces('www.foo.example.com', '/index.html', mkRedirect('https://example.com/index.html'))
        itProduces('www.m.example.com', '/assets/img.jpeg', mkRedirect('https://example.com/assets/img.jpeg'))
    })
})
