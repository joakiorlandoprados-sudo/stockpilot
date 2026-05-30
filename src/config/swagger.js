const path = require("path");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "StockPilot API",
      version: "1.0.0",
      description: "Professional REST API for inventory, products, categories, and JWT authentication."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Products", description: "Inventory and product management" },
      { name: "Categories", description: "Category management endpoints" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6643844f3d7f95fb678e4147" },
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", format: "email", example: "jane@stockpilot.dev" },
            role: { type: "string", enum: ["admin", "user"], example: "admin" },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", format: "email", example: "jane@stockpilot.dev" },
            password: { type: "string", format: "password", example: "secret123" },
            role: { type: "string", enum: ["admin", "user"], example: "admin" }
          }
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "jane@stockpilot.dev" },
            password: { type: "string", format: "password", example: "secret123" }
          }
        },
        Category: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664383f53d7f95fb678e4144" },
            name: { type: "string", example: "Electronics" },
            description: { type: "string", example: "Devices and gadgets" },
            slug: { type: "string", example: "electronics" },
            active: { type: "boolean", example: true }
          }
        },
        CategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Electronics" },
            description: { type: "string", example: "Devices and gadgets" },
            active: { type: "boolean", example: true }
          }
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6643851a3d7f95fb678e4148" },
            name: { type: "string", example: "Mechanical Keyboard" },
            description: { type: "string", example: "Compact 75% wireless keyboard" },
            sku: { type: "string", example: "KEY-001" },
            price: { type: "number", example: 129.99 },
            stock: { type: "integer", example: 25 },
            category: {
              oneOf: [
                { type: "string", example: "664383f53d7f95fb678e4144" },
                { $ref: "#/components/schemas/Category" }
              ]
            },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["electronics", "offer"]
            },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        ProductInput: {
          type: "object",
          required: ["name", "sku", "price", "stock"],
          properties: {
            name: { type: "string", example: "Mechanical Keyboard" },
            description: { type: "string", example: "Compact 75% wireless keyboard" },
            sku: { type: "string", example: "KEY-001" },
            price: { type: "number", example: 129.99 },
            stock: { type: "integer", example: 25 },
            category: { type: "string", example: "664383f53d7f95fb678e4144" },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["electronics", "offer"]
            },
            active: { type: "boolean", example: true }
          }
        },
        StockUpdateInput: {
          type: "object",
          required: ["stock"],
          properties: {
            stock: { type: "integer", minimum: 0, example: 42 }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Request completed successfully" },
            data: { type: "object" }
          }
        },
        PaginatedProductsResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" }
            },
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer", example: 120 },
                page: { type: "integer", example: 2 },
                limit: { type: "integer", example: 10 },
                totalPages: { type: "integer", example: 12 }
              }
            }
          }
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", example: "field" },
                  msg: { type: "string", example: "El nombre es obligatorio" },
                  path: { type: "string", example: "name" },
                  location: { type: "string", example: "body" }
                }
              }
            }
          }
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                message: { type: "string", example: "Descripcion del error" },
                code: { type: "integer", example: 404 },
                stack: { type: "string", example: "Visible only in development" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string", example: "email" },
                      message: { type: "string", example: "El email es obligatorio" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, "../routes/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};

module.exports = { setupSwagger, swaggerSpec };
