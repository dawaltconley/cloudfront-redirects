const rewire = require('rewire')
const { RedirectTests, mkEvent, mkRedirect } = require('./utilities')

const fn = rewire('../functions/WWWDomain.js')
const handler = fn.__get__('handler')

const { itProduces } = new RedirectTests(handler)

describe('WWWDomain', () => {
    describe('should redirect to the primary subdomain', () => {
        itProduces('example.com', '/', mkRedirect('https://www.example.com/'))
        itProduces('api.example.com', '/foo', mkRedirect('https://www.example.com/foo'))
        itProduces('www.foo.example.com', '/index.html', mkRedirect('https://www.example.com/index.html'))
        itProduces('www.m.example.com', '/assets/img.jpeg', mkRedirect('https://www.example.com/assets/img.jpeg'))
    })
})
