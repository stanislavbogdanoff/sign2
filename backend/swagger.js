const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description: "A simple Todo API with CRUD operations",
      contact: {
        name: "API Support",
        url: "http://localhost:5000",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);
module.exports = specs;
