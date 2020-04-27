# Shopify Workflow PoC

This is a Proof of Concept of workflow with different environments using Github and GitHub Actions.

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

### Workflow with fix branch

![Workflow with fix](https://user-images.githubusercontent.com/1866496/80384661-73ae3700-88a5-11ea-862c-faf6abbb5b5a.png)

**New branch always start from `master` one, even if the purpose is a new feature or a fix.

## CI/CD with GitHub Actions

Configurations
