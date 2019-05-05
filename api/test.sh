curl -X POST --header "Content-Type: application/json" -d '{"name": "test"}' http://localhost:3000/api/county
curl -X PUT --header "Content-Type: application/json" -d '{"name": "test2"}' http://localhost:3000/api/county/1
curl -X PATCH --header "Content-Type: application/json" -d '{"name": "test4"}' http://localhost:3000/api/county/1
curl -X DELETE http://localhost:3000/api/county/1
curl -X GET http://localhost:3000/api/county/1
