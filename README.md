## Description

The goal of this project is to create a REST API responsible for exposing “the air
quality information” of a nearest city to GPS coordinates using iqair




## Project main components
#### Default flow running the nodejs application
#### The cronjob
- The cronjob is responsible for fetching the air information from the external provider every 1 minute and store it in the database.


![Alt text](https://i.ibb.co/kSPBtQx/image.png "cronjob flow")


check it on drowl.io: https://drive.google.com/file/d/1E8TPRBTn8VuTRyP0uevB9eljm7RvoQAC/view?usp=sharing



## Requirements
- Nodejs
- Yarn
- Docker [optional]
- Enable Kubernetes in docker [optional]
- Change kubectl context to docker-desktop [optional] ```bash kubectl config use-context docker-desktop```

## Running the app without docker

- you have to run redis
  - using docker is  [OPTIONAL]
  ```bash
  $ docker run -d -p 6379:6379 redis
  ```
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
- using command ```docker-compose -up d``` to build the image
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

It runs the test suits sequentially.

### We are using ioredis-mock to mock the redis client in our tests
### We are using mongodb-memory-server to mock the mongodb connection in our tests



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
│   │   │   ├── air-information.internal.controller.ts
│   │   ├── dto
│   │   │   ├── air-information.dto.ts
│   │   ├── external-providers
│   │   │   ├── iq-air.provider.ts
│   │   │   ├── air-info-provider-factory
│   │   ├── jobs
│   │   │   ├── get-air-info.ts
│   │   │   ├── get-air-info-v2.ts
│   │   ├── queue
│   │   │   ├── air-info-queue-consumer.ts
│   │   ├── test
│   │   │   ├── air-info-provider-factory.spec.ts
│   │   │   ├── air-info-service-integration.spec.ts
│   │   │   ├── air-information-internal.controller.spec.ts
│   │   │   ├── air-information-service-unit.spec.ts
│   │   │   ├── air-information.controller.spec.ts
│   │   │   ├── iq-air-provider-unit.spec.ts
│   │   ├── air-information.service.ts
│   │   ├── air-information.module.ts
│   │   ├── utils
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   ├── common
│   │   ├── exceptions
│   │   │   ├── api-key-exception.ts
│   │   │   ├── external-call-exception.ts
│   │   │   ├── database-exception.ts
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
#### We have 2 controllers:
- AirInformationController: responsible for exposing the air information to the client/external consumer
- AirInformationInternalController: responsible for exposing our APIs internally (for example: cron job) [ <b>NOT USED FOR NOW</b> ]

## Data transfer objects (DTOs)
#### We have 1 DTO: 
- AirInformationDto: responsible for defining the data structure of the air information

## Cron job

To run the cron jobs we have in kubernetes, you can run the command ```yarn k8s:apply```
### We have 2 approaches for the cron job:
- Using internal cron jobs (using node-cron module).
- Using kubernetes cron jobs.

### Our Cron job is responsible for:
[Look at the recommendations section for better approach]
#### Fetching the air information from the external provider every 1 minute
- You can change the cron job schedule in the ```./src/air-information/jobs/get-air-info.ts``` file 
- To run the cron job directly, you can run the command ```yarn run:job```

#### Checking the status of the air information provider every 30 minutes [INSIDE PAUSE EVENT HANDLER OF THE QUEUE]
- It's something like a health check for the external provider to make sure that it's up and running
- implementation is close to circuit breaker pattern

#### flow
- The cron job will push a job to the queue every 1 minute.
- The queue consumer will invoke the job and fetch the air information from the external provider.
- If the external provider is up, the queue consumer will store the air information in the database.
- If the external provider is down, the queue consumer will pause the queue.
- We will check the status of the external provider every 30 minutes.
  - If the external provider is up, we will resume the queue.
  - If the external provider is down, we will keep the queue paused.


## Redis Queue
- We are using bull queue based on redis to handle the cron jobs.
- We have created a queue called ```air-information-queue``` to handle the cron jobs
### How we are using the queue.
- Our cron job will push a job to the queue every 1 minute.
- The queue consumer will invoke the job and fetch the air information from the external provider.

## Kubernetes
#### we are using kubernetes to deploy our cron job
- We have created a cron job in kubernetes to invoke the script ```/src/air-information/jobs/get-air-info-v2.ts``` every 1 minute
#### How to run the cron job in kubernetes
- First, you need to deploy the docker image to the registry using ```yarn docker:deploy```
- Then, Use ```yarn k8s:apply``` [Using yarn script]

### Deployments
- inside the `deployments` folder


## How to use the API
- Just check the swagger documentation at ```http://localhost:3000/docs```


## Pre commit 
- We are using husky to run the linting before committing the code


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
-----------------------------------------|---------|----------|---------|---------|-------------------
File                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                        
-----------------------------------------|---------|----------|---------|---------|-------------------
All files                                |   55.06 |    36.84 |   56.75 |   53.12 | 
 src                                     |   40.74 |        0 |   66.66 |   33.33 | 
  app.controller.ts                      |     100 |      100 |     100 |     100 | 
  app.module.ts                          |       0 |      100 |     100 |       0 | 1-11
  app.service.ts                         |     100 |      100 |     100 |     100 | 
  main.ts                                |       0 |        0 |       0 |       0 | 1-20
 src/air-information                     |   59.25 |    66.66 |   77.77 |      60 | 
  air-information-service.ts             |   82.35 |      100 |     100 |   81.25 | 50-51,67-68,83-84
  air-information.module.ts              |       0 |        0 |       0 |       0 | 1-56
  types.ts                               |     100 |      100 |     100 |     100 | 
 src/air-information/controller          |   68.75 |        0 |      60 |   64.28 | 
  air-information-internal.controller.ts |      75 |      100 |      50 |      70 | 21-23
  air-information.controller.ts          |      65 |        0 |   66.66 |   61.11 | 33-34,62-70      
 src/air-information/dto                 |       0 |      100 |     100 |       0 | 
  air-information.dto.ts                 |       0 |      100 |     100 |       0 | 1-8
 src/air-information/external-providers  |     100 |      100 |     100 |     100 | 
  air-info-provider-factory.ts           |     100 |      100 |     100 |     100 | 
  iq-air-provider.ts                     |     100 |      100 |     100 |     100 | 
 src/air-information/jobs                |       0 |        0 |       0 |       0 | 
  get-air-info-v2.ts                     |       0 |      100 |     100 |       0 | 2-4
  get-air-info.ts                        |       0 |      100 |       0 |       0 | 1-30
 src/air-information/queue               |   53.57 |        0 |   16.66 |      50 | 
  air-info-queue.ts                      |   53.57 |        0 |   16.66 |      50 | 25,32-49,56,61,66
 src/air-information/schema              |     100 |      100 |     100 |     100 | 
  pollution.schema.ts                    |     100 |      100 |     100 |     100 | 
 src/common/exceptions                   |   88.88 |      100 |   66.66 |   88.88 | 
  api-key-exception.ts                   |     100 |      100 |     100 |     100 | 
  database-exception.ts                  |   66.66 |      100 |       0 |   66.66 | 5
  external-call-exception.ts             |     100 |      100 |     100 |     100 | 
-----------------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 7 passed, 7 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        9.907 s, estimated 63 s
Ran all test suites.
```


## What next?
- Add a discriminator field to the AirInformation entity in order to distinguish between different providers.
- Add a new field to the pollution entity to store the provider name.
- Create kubernetes deployment file for the application to orchestrate the application.
- Adding hash for each docker image as a tag based on the git commit hash [useful in rollback].
- End to end test to test our endpoints.
- Using vault to store our secrets (e.g. API_KEY). [on production]




