## Description

The goal of this project is to create a REST API responsible for exposing “the air
quality information” of a nearest city to GPS coordinates using iqair


## Requirements
- Nodejs
- Yarn
- Docker [optional]
- Enable Kubernetes in docker [optional]
- Change kubectl context to docker-desktop [optional] ```bash kubectl config use-context docker-desktop```

## Installation

```bash
$ yarn install
```

## Running the app without docker

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Running the app using Docker and Kubernetes
- We have created a docker file to containerize our application
- using command ```yarn docker:start``` to build the image
- deploying our docker image to the registry ```yarn docker:deploy``` [Optional]
- Applying kubernetes deployment file ```yarn k8s:apply``` [Optional]


## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```



## Architecture
- We are using NestJS framework to build our application
- We are using moongoose as an DRM to connect to MongoDB
- We are using swagger to document our APIs
- We are using jest as a testing framework
- We are using node-cron to create cron jobs
- We are using kubernetes cron jobs to create cron jobs
- We are using docker to containerize our application

## Folder structure
```bash
├── src
│   ├── air-information
│   │   ├── controller
│   │   │   ├── air-information.controller.ts
│   │   │   ├── air-information.controller.spec.ts
│   │   │   ├── air-information.internal.controller.spec.ts
│   │   │   ├── air-information.internal.controller.ts
│   │   ├── dto
│   │   │   ├── air-information.dto.ts
│   │   ├── external-providers
│   │   │   ├── iq-air.provider.ts
│   │   │   ├── iq-air.provider.spec.ts
│   │   ├── jobs
│   │   │   ├── get-air-info.ts
│   │   ├── air-information.controller.spec.ts
│   │   ├── air-information.service.ts
│   │   ├── air-information.module.ts
│   ├── common
│   ├── app.module.ts
│   ├── main.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.controller.spec.ts
```

## Create new air information provider
We are using strategy pattern here in order to apply open-closed principle
So You can create new air information provider by following these steps:

- Create new file in ```/src/air-information/external-providers```
- Create a class implements the AirInformationProvider interface


## Controllers
- We have 2 controllers:
#### 1- AirInformationController: responsible for exposing the air information to the client/external consumer
#### 2- AirInformationInternalController: responsible for exposing our APIs internally (for example: cron job) [ NOT USED FOR NOW ]

## Data transfer objects (DTOs)
- We have 1 DTO: 
1- AirInformationDto: responsible for defining the data structure of the air information

## Cron job

- To run the cron jobs we have in kubernetes, you can run the command ```yarn k8s:apply```
### We have 2 approaches for the cron job:
#### 1- Using internal cron jobs (using node-cron module).
#### 2- Using kubernetes cron jobs.

##### Our Cron job is responsible for:
[Look at the recommended approach section for better approach]
##### 1- Fetching the air information from the external provider every 1 minute
- You can change the cron job schedule in the ```./src/air-information/jobs/get-air-info.ts``` file 
- To run the cron job directly, you can run the command ```yarn run:job```

##### 2- Checking the status of the air information provider every 2 minutes
- To run the cron job directly, you can run the command ```yarn run:status-job```


## Redis Queue
- We are using bull queue based on redis to handle the cron jobs.
- We have created a queue called ```air-information-queue``` to handle the cron jobs

## Kubernetes
#### we are using kubernetes to deploy our cron job
- We have created a cron job in kubernetes to invoke the script ```/src/air-information/jobs/get-air-info-v2.ts``` every 1 minute
#### How to run the cron job in kubernetes
- First, you need to deploy the docker image to the registry using ```yarn docker:deploy```
- Then, Use ```yarn k8s:apply``` [Using yarn script]

### Deployments
- inside the `deployments` folder


## How to use the API
- Just check the swagger documentation at ```http://localhost:3000/api```


## Pre commit 
- We are using husky to run the linting before commiting the code


## Database
- We have created a db cluster in MongoDB Atlas instead of doing it locally and spin up a docker container for the database, Just for the sake of simplicity.

## CI/CD 
- We are using github actions to run the tests and build the docker image and push it to the registry


## Recommendations
- Use kubernetes to deploy the cron job instead of using node-cron module.
- Use docker to run the application.


## Test coverage
NOTE: We won't test the cronjobs as we already tested the logic in our tests
##### The most important files to test are: [controllers,services,external-providers]
```bash
-----------------------------------------|---------|----------|---------|---------|----------------------
File                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------------------|---------|----------|---------|---------|----------------------
All files                                |   52.54 |    26.31 |   51.35 |   50.23 |
 src                                     |   40.74 |        0 |   66.66 |   33.33 |
  app.controller.ts                      |     100 |      100 |     100 |     100 |
  app.module.ts                          |       0 |      100 |     100 |       0 | 1-11
  app.service.ts                         |     100 |      100 |     100 |     100 |
  main.ts                                |       0 |        0 |       0 |       0 | 1-20
 src/air-information                     |   62.79 |    66.66 |   77.77 |    64.1 |
  air-information-service.ts             |     100 |      100 |     100 |     100 |
  air-information.module.ts              |       0 |        0 |       0 |       0 | 1-56
  types.ts                               |     100 |      100 |     100 |     100 |
 src/air-information/controller          |   68.75 |        0 |      60 |   64.28 |
  air-information-internal.controller.ts |      75 |      100 |      50 |      70 | 21-23
  air-information.controller.ts          |      65 |        0 |   66.66 |   61.11 | 33-34,62-70
 src/air-information/dto                 |       0 |      100 |     100 |       0 |
  air-information.dto.ts                 |       0 |      100 |     100 |       0 | 1-8
 src/air-information/external-providers  |   84.84 |    33.33 |     100 |   83.87 |
  air-info-provider-factory.ts           |   92.85 |        0 |     100 |   91.66 | 25
  iq-air-provider.ts                     |   78.94 |       50 |     100 |   78.94 | 24-25,42-43
 src/air-information/jobs                |       0 |        0 |       0 |       0 |
  check-air-info-provider-status.ts      |       0 |        0 |       0 |       0 | 1-39
  get-air-info-v2.ts                     |       0 |      100 |     100 |       0 | 1-3
  get-air-info.ts                        |       0 |      100 |       0 |       0 | 1-30
 src/air-information/queue               |   54.83 |        0 |   14.28 |   51.72 |
  air-info-queue.ts                      |   54.83 |        0 |   14.28 |   51.72 | 27,34-51,58,62,67,72
 src/air-information/schema              |     100 |      100 |     100 |     100 |
  pollution.schema.ts                    |     100 |      100 |     100 |     100 |
 src/common/exceptions                   |   66.66 |      100 |       0 |   66.66 |
  api-key-exception.ts                   |   66.66 |      100 |       0 |   66.66 | 5
  external-call-exception.ts             |   66.66 |      100 |       0 |   66.66 | 5
-----------------------------------------|---------|----------|---------|---------|----------------------

```


## What next?
- Add a discriminator field to the AirInformation entity in order to distinguish between different providers.
- Add a new field to the pollution entity to store the provider name.
- Using bull queue based on redis to handle the cron jobs.
- Create kubernetes deployment file for the application.
- Adding hash for each docker image based on the git commit hash [useful in rollback].




