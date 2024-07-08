# To-Do List Backend

This is the backend for the To-Do List application, built using Node.js and TypeScript with PostgreSQL. The backend API allows users to read, create, update, and delete duties.



## Table of Contents
- [To-Do List Backend](#to-do-list-backend)
  - [Table of Contents](#table-of-contents)
  - [Technology Stack](#technology-stack)
  - [Prerequisites](#prerequisites)
  - [Running the Server](#running-the-server)
    - [1. Database Setup](#1-database-setup)
    - [2. Backend Server](#2-backend-server)
  - [Testing](#testing)
  - [API Endpoints](#api-endpoints)
    - [Create a new duty](#create-a-new-duty)
    - [Get all duties](#get-all-duties)
    - [Get a duty](#get-a-duty)
    - [Update a duty](#update-a-duty)
    - [Delete a duty](#delete-a-duty)

## Technology Stack

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js.
- **TypeScript**: Superset of JavaScript that adds static types.
- **PostgreSQL**: Relational database for storing duties.
- **Docker**: Containerization platform.
- **Express-validator**: Library for validating and sanitizing input.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v18.x or higher)
- Docker
- Docker Compose

## Running the Server

### 1. Database Setup
- Navigate to the root folder directory

- Edit the configuration in docker-compose.yaml if necessary


Build and start the Docker containers using Docker Compose:
```
docker compose up --build
```

- The Postgres SQL database will start on PORT 5432

### 2. Backend Server
- Edit the configuration in docker-compose.yaml if necessary
- The backend server will start on http://localhost:8080.


## Testing
The backend tests are written using Jest and supertest. To run the tests, execute the following command:
```bash
npm run test
```


## API Endpoints
### Create a new duty
- URL: /duties
- Method: POST
- Body: { "name": "string"}
- Response: 201 Created

### Get all duties
- URL: /duties
- Method: GET
- Response: 200 OK

### Get a duty
- URL: /duties/:id
- Method: GET
- Response: 200 OK

### Update a duty
- URL: /duties/:id
- Method: PUT
- Body: { "name": "string" }
- Response: 200 OK

### Delete a duty
- URL: /duties/:id
- Method: DELETE
- Response: 200 OK

