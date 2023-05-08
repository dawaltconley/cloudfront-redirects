# CloudFront Redirects

This provides a number of AWS CloudFront Functions for handling the most common URL redirects.

## Functions

- **ApexDomain** redirects all subdomains to the apex domain.
- **WWWDomain** redirects all subdomains _and_ the apex domain to the `www` subdomain.
- **CleanUrls** provides redirects to enforce clean URLs with a trailing slash.
- **CleanUrlsNoSlash** provides redirects to enforce clean URLs _without_ a trailing slash.

This stack also provides the following functions, which combine the functionality of the above:

- ApexDomainCleanUrls
- ApexDomainCleanUrlsNoSlash
- WWWDomainCleanUrls
- WWWDomainCleanUrlsNoSlash

## Usage

Install by cloning this repo or downloading the latest [release](https://github.com/dawaltconley/cloudfront-redirects/releases).

```sh
git clone https://github.com/dawaltconley/cloudfront-redirects.git
cd cloudfront-redirects
npm install
npm run create
```

By default, this will create a new AWS CloudFormation stack named `UrlRedirects` containing all of the included functions. You can change the stack name by editing the `config.json` file.

### Commands

`npm run create` creates a new stack.

`npm run update` updates an existing stack.

`npm run write [filename]` writes the template to a json file.
