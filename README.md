# CloudFront Redirects

This provides a number of CloudFront Functions for handling the most common URL redirects.

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

## Commands

You can change the stack name by editing the `config.json` file.

`npm run create` creates a new stack.

`npm run update` updates an existing stack.

`npm run write [filename]` writes the template to a json file.
