# Deployment

This directory contains configurations to deploy application on different environments
(Kubernetes, Docker, OS and cloud providers).
Neuronek is not aimed for a huge amount of people and will never get into place where scalability will be issue,
in the result I've decided to bundle all of the dependencies into single container
(Next.js application will be served through `nestjs` server which will be gateway for whole could application).

## Table of Contents

- [Kubernetes](kubernetes/README.md)
- [Docker](docker/README.md)
- [Local](local/README.md)
- [Cloud Providers](cloud-providers/README.md)

## Tasklist

- [ ] Add deployment configurations for Kubernetes
- [ ] Add deployment configurations for Docker
- [ ] Add deployment configurations for Local
- [ ] Add deployment configurations for Cloud Providers
