# Serverless REST API with DynamoDB and offline support

This example demonstrates how to run a service locally, using the
[serverless-offline](https://github.com/dherault/serverless-offline) plugin. It
provides a REST API to manage Todos stored in a DynamoDB, similar to the
[aws-node-rest-api-with-dynamodb](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb)
example. A local DynamoDB instance is provided by the
[serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)
plugin.

## Setup

```bash
npm install
serverless dynamodb install
serverless offline start
serverless dynamodb migrate

cd ./frontend
npm install
```

## Start App

```bash
serverless offline start

cd ./frontend
npm start
```

## Usage

Once the app is started, go to http://localhost:3001 to access it. You can send message and delete them.
