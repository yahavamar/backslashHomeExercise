
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
## Installation and Setup

### Requirements
* Node.js
* Neo4J
* Docker Compose

### Installation

1. Clone the repository: 
```
git clone https://github.com/yahavamar/backslashHomeExercise.git
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


Navigate to http://localhost:3000/graphql.


## API Documentation

### Example

```
{
  returnAllRoutesEndsInSink {
    source
    dest
    segments {
      source {
        name
        kind
      }
      dest {
        name
        kind
      }
    }
  }
}
```