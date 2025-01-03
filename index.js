import express from "express";
import connectToMongoDB from "./app/configuration/mongoDBconn.js";
//importing database routes
import userRoutes from "./app/routes/userRoutes.js";
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import planRoutes from "./app/routes/planRoutes.js";
import swaggerUi from 'swagger-ui-express'; // Import swagger-ui-express
import swaggerJsdoc from 'swagger-jsdoc'; // Import swagger-jsdoc

const app = express();
app.use(express.json());

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechCrush Subscription Management App',
      version: '1.0.0',
      description: 'TechCrush Subscription Management App Database API',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./app/routes/*.js'], // references all jsdoc comments in all files under routes
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); 

// Use the other routes
app.use("/users", userRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/plans", planRoutes);

const startServer = async () => {
  await connectToMongoDB();

  // Start server
  app.listen(3000, () => {
    console.log("Server started on port 3000. Swagger UI available at /api-docs"); // Helpful message
  });
};

startServer();