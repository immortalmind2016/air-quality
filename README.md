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

## Runnin the app using Docker
- We have created a docker file to containerize our application
- using command ```docker build -t air-information .``` to build the image
- using command ```docker run -p 3000:3000 air-information``` to run the container


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
#### 2- AirInformationInternalController: responsible for exposing our APIs internally (for example: cron job in kubernetes)

## Data transfer objects (DTOs)
- We have 1 DTO: 
1- AirInformationDto: responsible for defining the data structure of the air information

## Cron job
- We are using cron job to update the air information every 1 minute
- You can change the cron job schedule in the ```./src/air-information/jobs/get-air-info.ts``` file
- To run the cron job, you can run the command ```yarn run:job```
### We have 2 approaches for the cron job:
#### 1- Using internal cron jobs (using node-cron module)
#### 2- Using kubernetes cron jobs, To invoke the endpoint called ```/air-information.internal/execute-air-info-job```

## How to use the API
- Just check the swagger documentation at ```http://localhost:3000/api```


## Pre commit 
- We are using husky to run the tests before commiting the code


## Database
- We have created a db cluster in MongoDB Atlas instead of doing it locally and spin up a docker container for the database, Just for the sake of simplicity.

## What next?
- Add a discriminator field to the AirInformation entity in order to distinguish between different providers.
- Add a new field to the pollution entity to store the provider name.


