# Shopify Workflow PoC

This is a Proof of Concept of workflow with different environments using Github and GitHub Actions.

[Workflow](#workflow)

[GitHub Actions](#cicd-with-github-actions)

Pre-requisites : 
- GitHub account and repository
- Shopify store of production
- Shopify store of staging (development)

## Shopify stores

We're using 2 stores for our workflow with multiple themes : 
- Production store
  - Production theme
  - Pre-production theme
- Staging store
  - Staging theme
  - n theme(s) for developers

## Branches

- `master` (for production theme on production environment)
- `preprod` (for pre-production theme on production environment)
- `develop` (for staging theme on development environment)

## Philosophy

Production and staging store have same configuration. But we often have the same content between the two environments.
- In production store, we have all real products and collections.
- In staging store, we have ~10 or less products and one or two collections (for testing).

## Workflow

Workflow is pretty simple, based on GitFlow but with no release branch nor tags.

`master`, `preprod` and `develop` branches are protected. It's not possible to push directly on them.
The best way is to use pull requests.

### Principal

1. Create a new branch from `master` (eg. `feature/store-locator`)
    - Best practice : prefix branch with `fix/` for a fix or `feature/` for a new feature
2. Apply commit(s) to this branch
3. Merge `feature/store-locator` into `develop`
    - It will deploy on staging theme, then test your changes
4. If changes are not good, return to step 2. Otherwise, merge `feature/store-locator` into `preprod`
    - It will deploy on pre-production theme, then test your changes 
5. If changes are not good, return to step 2. Otherwise, merge `feature/store-locator` into `master`
    - It will deploy on production theme, your changes are now live!

![Basic workflow](https://user-images.githubusercontent.com/1866496/80381771-b66e1000-88a1-11ea-8039-7deb5842c772.png)

### Workflow with multiple branches

![Workflow with fix](https://user-images.githubusercontent.com/1866496/80384661-73ae3700-88a5-11ea-862c-faf6abbb5b5a.png)

**New branch always start from `master` one, even if the purpose is a new feature or a fix.**

## Local development

We're using Theme Kit for local developers : https://shopify.github.io/themekit/
_We created a template on development store for each developer._

## CI/CD with GitHub Actions

### Actions

Workflow files are available [here](https://github.com/freyum/shopify-workflow-poc/tree/master/.github/workflows).
They used the Deploy Shopify theme Actions : https://github.com/marketplace/actions/deploy-shopify-theme

### Secrets

First you have to generate a private app to get an API KEY on Shopify. [Get API Access](https://shopify.github.io/themekit/#get-api-access).

Then you'll need to provide some secrets : 

* **SHOPIFY_STAGING_PASSWORD**: Your password from your private app previously created.
* **SHOPIFY_STAGING_STORE_URL**: Your development store url. (e.g. `demo-staging.myshopify.com`).
* **SHOPIFY_STAGING_THEME_ID**: Your theme id on your Shopify development Store.


* **SHOPIFY_PRODUCTION_PASSWORD**: Your password from your private app previously created.
* **SHOPIFY_PRODUCTION_STORE_URL**: Your production store url. (e.g. `demo.myshopify.com`).
* **SHOPIFY_PREPRODUCTION_THEME_ID**: Your preproduction theme id on your Shopify production Store.
* **SHOPIFY_PRODUCTION_THEME_ID**: Your production theme id on your Shopify production Store.


* **THEME_PATH**: Path of your theme on your GitHub repository. If your theme is at the root of your repository, just use `./`.


![env vars](https://user-images.githubusercontent.com/1866496/80392807-e3292400-88af-11ea-9547-20d35c5b1978.png)

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).
