# Infrastructure

This module is dedicated to infrastructure provisioning through Terraform. It handles everything related to the infrastructure of our project. The key tools used in this repository are GitHub, Vercel, and Infisical.

---

## Tools & Services

### GitHub
Here we are using GitHub as our Version Control System (VCS). It is a development platform inspired by the way you work. It's designed for developers to work together on projects from anywhere ([GitHub](https://github.com/)).

### Vercel
We chose Vercel for serverless deployments. It is primarily used here for deploying frontend bundles as the backend does not necessarily need to be deployed as serverless on Vercel. Vercel is an all-in-one platform with Global Deployments, Serverless Functions, and Static & Jamstack deployment capabilities all under a single roof ([Vercel](https://vercel.com/)).

### Infisical
Infisical is our Secret Management tool. It's where we store all the secrets for our multiple environments. Secret management refers to the tools and methods for managing digital authentication credentials (secrets), including passwords, keys, APIs, and tokens.

---

## Atlantis
We use Atlantis for `terraform`. Atlantis is a self-hosted golang application that listens for Terraform pull request events via webhooks. Comments on pull requests can be used to plan and apply Terraform designs ([Atlantis GitHub](https://github.com/runatlantis/atlantis)).

---

## Getting Started

Before you begin, make sure you have Terraform installed on your local machine. If you don't have it installed, you can find the download instructions on the [Terraform website](https://www.terraform.io/downloads.html).

TBA
