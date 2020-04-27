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
- In staging store, we have ~10 or less products and one or two collections (for tests).

## Workflow

Workflow is pretty simple, based on GitFlow but without release branch nor tags.

### Principal

![Basic workflow](https://user-images.githubusercontent.com/1866496/80381771-b66e1000-88a1-11ea-8039-7deb5842c772.png)

### With fix branch

![Workflow with fix](https://user-images.githubusercontent.com/1866496/80384661-73ae3700-88a5-11ea-862c-faf6abbb5b5a.png)

If you have any fix to apply to a WIP feature after test in staging theme : 

## CI/CD with GitHub Actions

Configurations
