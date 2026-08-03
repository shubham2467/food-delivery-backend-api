const swaggerJsdoc = require("swagger-jsdoc");

const objectId = {
  type: "string",
  pattern: "^[a-fA-F0-9]{24}$",
  example: "507f1f77bcf86cd799439011",
};

const requestBody = (schema, required = true) => ({
  required,
  content: { "application/json": { schema } },
});

const idParameter = (name = "id", description = "MongoDB object ID") => ({
  name,
  in: "path",
  required: true,
  description,
  schema: objectId,
});

const standardResponses = {
  400: { description: "Invalid or missing request data" },
  401: { description: "Authentication is required or the token is invalid" },
  403: { description: "Administrator access is required" },
  404: { description: "Requested resource was not found" },
  500: { description: "Unexpected server error" },
};

const withErrors = (responses) => ({ ...responses, ...standardResponses });

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Food Delivery Backend API",
    version: "1.0.0",
    description: "Interactive API documentation for the Food Delivery backend.",
  },
  // A relative URL keeps Try it out pointed at whichever Northflank domain serves this UI.
  servers: [
    { url: "/", description: "Current deployment" },
    ...(process.env.PUBLIC_API_URL
      ? [{ url: process.env.PUBLIC_API_URL, description: "Configured public API URL" }]
      : []),
  ],
  tags: [
    { name: "Test" },
    { name: "Authentication" },
    { name: "Users" },
    { name: "Restaurants" },
    { name: "Categories" },
    { name: "Foods" },
    { name: "Orders" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Error: {
        type: "object",
        properties: { success: { type: "boolean", example: false }, message: { type: "string" } },
      },
      User: {
        type: "object",
        properties: {
          _id: objectId, firstName: { type: "string" }, lastName: { type: "string" },
          email: { type: "string", format: "email" }, phone: { type: "string" },
          address: { type: "array", items: { type: "string" } },
          usertype: { type: "string", enum: ["client", "admin", "vendor", "driver"] },
          profile: { type: "string", format: "uri" },
        },
      },
      Restaurant: {
        type: "object",
        required: ["title", "coords"],
        properties: {
          _id: objectId, title: { type: "string", example: "Pizza Hub" }, imageUrl: { type: "string", format: "uri" },
          foods: { type: "array", items: objectId }, time: { type: "string", example: "30 mins" },
          pickup: { type: "boolean", default: true }, delivery: { type: "boolean", default: true }, isOpen: { type: "boolean", default: true },
          logoUrl: { type: "string", format: "uri" }, rating: { type: "number", minimum: 1, maximum: 5 }, ratingCount: { type: "string" }, code: { type: "string" },
          coords: { type: "object", properties: { latitude: { type: "number" }, longitude: { type: "number" }, address: { type: "string" } } },
        },
      },
      Category: { type: "object", required: ["title"], properties: { _id: objectId, title: { type: "string", example: "Veg" }, imageUrl: { type: "string", format: "uri" } } },
      Food: {
        type: "object",
        required: ["title", "description", "price", "category", "code"],
        properties: {
          _id: objectId, title: { type: "string", example: "Paneer Pizza" }, description: { type: "string" }, price: { type: "number", example: 299 },
          imgUrl: { type: "string", format: "uri" }, foodTags: { type: "string", example: "cheese,spicy" }, category: objectId,
          code: { type: "string", example: "FD001" }, isAvailable: { type: "boolean", default: true }, restaurant: objectId,
          rating: { type: "number", minimum: 1, maximum: 5 }, ratingCount: { type: "string" },
        },
      },
      Order: { type: "object", properties: { _id: objectId, foods: { type: "array", items: objectId }, payment: { type: "number" }, buyer: objectId, status: { type: "string", enum: ["preparing", "prepare", "on the way", "deliverd"] } } },
    },
  },
  paths: {
    "/api/v1/test/test-user": { get: { tags: ["Test"], summary: "Test API", responses: { 200: { description: "Test response" } } } },
    "/api/v1/auth/register": { post: { tags: ["Authentication"], summary: "Register a user", requestBody: requestBody({ type: "object", required: ["firstName", "lastName", "email", "password", "phone", "address", "answer"], properties: { firstName: { type: "string" }, lastName: { type: "string" }, email: { type: "string", format: "email" }, password: { type: "string", format: "password" }, phone: { type: "string" }, address: { type: "array", items: { type: "string" } }, answer: { type: "string" }, usertype: { type: "string", enum: ["client", "admin", "vendor", "driver"] } } }), responses: withErrors({ 201: { description: "User registered" }, 409: { description: "Email already registered" } }) } },
    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Log in and receive a JWT",
        requestBody: requestBody({ type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string", format: "password" } } }),
        responses: withErrors({
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean" }, token: { type: "string" }, user: { "$ref": "#/components/schemas/User" } },
                },
              },
            },
          },
        }),
      },
    },
    "/api/v1/auth/logout": { post: { tags: ["Authentication"], summary: "Invalidate the current JWT", security: [{ bearerAuth: [] }], responses: withErrors({ 200: { description: "Logged out" } }) } },
    "/api/v1/user": {
      get: { tags: ["Users"], summary: "Get the current user", security: [{ bearerAuth: [] }], responses: withErrors({ 200: { description: "User returned" } }) },
      put: { tags: ["Users"], summary: "Update the current user", security: [{ bearerAuth: [] }], requestBody: requestBody({ type: "object", properties: { username: { type: "string" }, address: { type: "array", items: { type: "string" } }, phone: { type: "string" } } }), responses: withErrors({ 200: { description: "User updated" } }) },
    },
    "/api/v1/user/password": { put: { tags: ["Users"], summary: "Change the current user's password", security: [{ bearerAuth: [] }], requestBody: requestBody({ type: "object", required: ["oldPassword", "newPassword"], properties: { oldPassword: { type: "string", format: "password" }, newPassword: { type: "string", format: "password" } } }), responses: withErrors({ 200: { description: "Password updated" } }) } },
    "/api/v1/user/{id}": { delete: { tags: ["Users"], summary: "Delete a user profile", security: [{ bearerAuth: [] }], parameters: [idParameter()], responses: withErrors({ 200: { description: "Profile deleted" } }) } },
    "/api/v1/user/role/{id}": { put: { tags: ["Users"], summary: "Update a user's role (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], requestBody: requestBody({ type: "object", required: ["usertype"], properties: { usertype: { type: "string", enum: ["client", "admin", "vendor", "driver"] } } }), responses: withErrors({ 200: { description: "Role updated" } }) } },
    "/api/v1/restaurant": {
      get: { tags: ["Restaurants"], summary: "List restaurants", security: [{ bearerAuth: [] }], responses: withErrors({ 200: { description: "Restaurants returned" } }) },
      post: { tags: ["Restaurants"], summary: "Create a restaurant (admin)", security: [{ bearerAuth: [] }], requestBody: requestBody({ "$ref": "#/components/schemas/Restaurant" }), responses: withErrors({ 201: { description: "Restaurant created" } }) },
    },
    "/api/v1/restaurant/{id}": { get: { tags: ["Restaurants"], summary: "Get a restaurant", parameters: [idParameter()], responses: withErrors({ 200: { description: "Restaurant returned" } }) }, put: { tags: ["Restaurants"], summary: "Update a restaurant (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], requestBody: requestBody({ "$ref": "#/components/schemas/Restaurant" }, false), responses: withErrors({ 200: { description: "Restaurant updated" } }) }, delete: { tags: ["Restaurants"], summary: "Delete a restaurant (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], responses: withErrors({ 200: { description: "Restaurant deleted" } }) } },
    "/api/v1/category": { get: { tags: ["Categories"], summary: "List categories", responses: withErrors({ 200: { description: "Categories returned" } }) }, post: { tags: ["Categories"], summary: "Create a category (admin)", security: [{ bearerAuth: [] }], requestBody: requestBody({ "$ref": "#/components/schemas/Category" }), responses: withErrors({ 201: { description: "Category created" } }) } },
    "/api/v1/category/{id}": { put: { tags: ["Categories"], summary: "Update a category (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], requestBody: requestBody({ "$ref": "#/components/schemas/Category" }, false), responses: withErrors({ 200: { description: "Category updated" } }) }, delete: { tags: ["Categories"], summary: "Delete a category (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], responses: withErrors({ 200: { description: "Category deleted" } }) } },
    "/api/v1/food": { get: { tags: ["Foods"], summary: "List foods", responses: withErrors({ 200: { description: "Foods returned (from Redis or MongoDB)" } }) }, post: { tags: ["Foods"], summary: "Create a food item (admin)", security: [{ bearerAuth: [] }], requestBody: requestBody({ "$ref": "#/components/schemas/Food" }), responses: withErrors({ 201: { description: "Food created" } }) } },
    "/api/v1/food/{id}": { get: { tags: ["Foods"], summary: "Get a food item", parameters: [idParameter()], responses: withErrors({ 200: { description: "Food returned" } }) }, put: { tags: ["Foods"], summary: "Update a food item (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], requestBody: requestBody({ "$ref": "#/components/schemas/Food" }, false), responses: withErrors({ 200: { description: "Food updated" } }) }, delete: { tags: ["Foods"], summary: "Delete a food item (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], responses: withErrors({ 200: { description: "Food deleted" } }) } },
    "/api/v1/food/category/{title}": { get: { tags: ["Foods"], summary: "List foods by category title", parameters: [{ name: "title", in: "path", required: true, schema: { type: "string" }, example: "Veg" }], responses: withErrors({ 200: { description: "Foods returned" } }) } },
    "/api/v1/food/restaurant/{id}": { get: { tags: ["Foods"], summary: "List foods by restaurant", parameters: [idParameter()], responses: withErrors({ 200: { description: "Foods returned" } }) } },
    "/api/v1/food/place-order": { post: { tags: ["Orders"], summary: "Place an order", security: [{ bearerAuth: [] }], requestBody: requestBody({ type: "object", required: ["cart"], properties: { cart: { type: "array", items: { type: "object", required: ["id", "price"], properties: { id: objectId, price: { type: "number" } } } } } }), responses: withErrors({ 200: { description: "Order placed" } }) } },
    "/api/v1/food/order-status/{id}": { put: { tags: ["Orders"], summary: "Update an order status (admin)", security: [{ bearerAuth: [] }], parameters: [idParameter()], requestBody: requestBody({ type: "object", required: ["status"], properties: { status: { type: "string", enum: ["preparing", "prepare", "on the way", "deliverd"] } } }), responses: withErrors({ 200: { description: "Order status updated" } }) } },
  },
};

module.exports = swaggerJsdoc({ definition: swaggerDefinition, apis: [] });
