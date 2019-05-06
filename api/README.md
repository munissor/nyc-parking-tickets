## Api to serve the dataset

### Architecture

The Application is divided in layers
- clients: clients for external services
- repositories: repositories for each domain entity
- services: wrap repositories with business logic
- controllers: consume service and handle HTTP requests / responses

Each of this layer could be independently testable.

### DB Schema
The database schema can be inferred from `migration/initial.js`.
It contains a main `tickets` table with linked models for 
- plate
- plate type
- us states
- vehicle make
- vehicle colors
- vehicle body types
- streets

### API
The api supports GET / POST / PUT / PATCH and DELETE for all the entities above, available at http://localhost:3000/api/...
Exact routes can be inferred from `./routes/*.js`

Each routes accept a model which is the flattened version (with all the linked model flattened into a single object) and takes care of creating
missing models.

Few examples can be found in `test.sh`

### Installing dependencies
`npm install`

### Building
`docker-composer build`

### Running
`docker-composer up`
The server is then available at http://localhost:3000

### Dependency monitoring
I added an hystrix circuit breaker implementation for memcached (it's quite generic so it can be added to any class that requires CB)
The dashboard is available at  http://localhost:9090

When adding the backend stream (http://backend:3000/hystrix) should show a dashboard similar to [this](https://user-images.githubusercontent.com/1422437/57228381-96e43480-700b-11e9-8e8b-4d1068bfa2a0.png)

