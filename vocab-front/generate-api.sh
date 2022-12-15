rm -rf ./gen ./core-api.yaml \
&& curl http://localhost:8080/q/openapi\?format\=yaml -o core-api.yaml \
&& npx @openapitools/openapi-generator-cli generate -i core-api.yaml -g typescript-axios -o ./gen/schemas/core
