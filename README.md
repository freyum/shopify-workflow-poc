# Shopify Workflow PoC

This is a Proof of Concept of workflow with different environments using Github and GitHub Actions.

Pre-requisites : 
- GitHub account and repository
- Shopify store of production
- Shopify store of staging

## Shopify stores

We're using 2 stores for our workflow with multiple themes : 
- Production store
  - Production theme
  - Pre-production theme
- Staging store
  - Staging theme
  - n theme(s) for developers

## Branches

- `master` (for production)
- `staging` (for staging )
