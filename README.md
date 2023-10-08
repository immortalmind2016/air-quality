## Description

The goal of this project is to create a REST API responsible for exposing “the air
quality information” of a nearest city to GPS coordinates using iqair
## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
## Create new air information provider
### We are using strategy pattern here in order to apply open-closed principle
### So You can create new air information provider by following these steps:

- Create new file in /src/air-information/external-providers
- Create a class implements the AirInformationProvider interface

## What next?
- Add a discriminator field to the AirInformation entity in order to distinguish between different providers.
- Add a new field to the pollution entity to store the provider name.


