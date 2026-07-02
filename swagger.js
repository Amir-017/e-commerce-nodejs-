import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation",
    },
  servers: [
  {
    url: "http://localhost:3000",
    description: "Development",
  },
  {
    url: "https://e-commerce-nodejs-blush.vercel.app",
    description: "Production",
  },
],
  },

  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);

export default specs;