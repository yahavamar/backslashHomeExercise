
# Home Exercise - Backslash

The goal of this project is to create a RESTful API for querying a system architecture, loaded from a provided JSON file. The API should provide a way to filter the routes between the service.


## Data Description

The provided JSON file contains a list of "nodes" which are individual components of the system, along with their properties such as their name, kind (whether it is a service or a database, for example), language, path, and whether it is publicly exposed. Some nodes also have a "vulnerabilities" section which lists potential security issues, including the file name and severity level of each vulnerability.

In addition, there are "edges" which represent the connections between the nodes. Each edge specifies the starting node and the ending node or nodes it connects to.
## Technologies Used

* TypeScript 
* Node.js - Express
* Neo4J
* Docker
* Swagger
## Installation and Setup

### Requirements
* Node.js
* Neo4J
* Docker Compose

### Installation

1. Clone the repository: 
```
git clone https://github.com/your_username/node-express-typescript.git
```
2. Navigate to the project directory: 
```
cd backslash
```
3. Build and start the Docker containers: 
```
docker-compose up -d
```
4. Install the dependencies: 
```
npm install
```


### Running the Application

To run the application, execute the following commands:

```
npx tsc
```
The compiled files will be located in the dist directory.
```
npx ts-node-dev dist/server.js
```


The application will start running on http://localhost:3000.

Navigate to http://localhost:3000/api-docs/ for use Swagger API.


## API Documentation

### Endpoints

- `GET /routes/sinks` - Get list of GraphPath object contains all the routes that ends in Sink

- `GET /routes/sinks/{sinkKind}` - Get list of GraphPath object contains all the routes that ends in Sink by filter kind

- `GET /routes/vulnerabilities` - Get list of GraphPath object contains all the routes that have vulnerabilities

- `GET /routes/publicServiceToSink` - Get list of GraphPath object contains all the routes  that start in a public service and ends in Sink

- `GET /routes/publicServiceToSink/{isPublic}/{sinkKind}` - Get list of GraphPath object contains all the routes that ends in Sink by filter kind





