// swagger.js
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Ecommerce API",
    description: "REST API for Ecommerce app with Auth, Products, Cart, and Admin features",
    version: "1.0.0",
  },
  host: "localhost:3000", // change when deploying
  basePath: "/",
  schemes: ["http"], // use "https" in production
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter JWT token like: Bearer <token>",
    },
  },
  security: [{ BearerAuth: [] }],
};

// Generated file
const outputFile = "./swagger-output.json";

// All your route entry points
const endpointsFiles = ["./server.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
