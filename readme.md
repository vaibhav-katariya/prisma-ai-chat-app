
# Prisma AI Chat App

This is a chat application built using the MERN stack (MongoDB, Express, React, Node.js) with Prisma as the ORM and Socket.IO for real-time communication. The application also integrates with Google's Generative AI for generating content.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/vaibhav-katariya/prisma-ai-chat-app
    cd prisma-ai-chat-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=8000
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    NODE_ENV=development
    ```

4. Run the application:
    ```bash
    npm start
    ```

## Usage

- The server will start on `http://localhost:8000`.
- Use Postman or any API client to interact with the endpoints.

## API Endpoints

### User Routes

- **Sign Up**
  ```http
  POST /api/user/sign-up
  ```
  Request Body:
  ```json
  {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
  }
  ```

- **Sign In**
  ```http
  POST /api/user/sign-in
  ```
  Request Body:
  ```json
  {
     "email": "john@example.com",
     "password": "password123"
  }
  ```

- **Sign Out**
  ```http
  POST /api/user/sign-out
  ```

- **Get User**
  ```http
  GET /api/user/me
  ```

- **Update User**
  ```http
  PUT /api/user/update-user
  ```
  Request Body:
  ```json
  {
     "email": "john_new@example.com",
     "name": "John Doe Updated"
  }
  ```

- **Delete User**
  ```http
  DELETE /api/user/delete-user
  ```

### Project Routes

- **Create Project**
  ```http
  POST /api/project/create
  ```
  Request Body:
  ```json
  {
     "name": "New Project",
     "description": "Project description"
  }
  ```

- **Add Users to Project**
  ```http
  POST /api/project/add-users
  ```
  Request Body:
  ```json
  {
     "projectId": "project_id",
     "userIds": ["user_id1", "user_id2"]
  }
  ```

- **Get Projects**
  ```http
  GET /api/project/get-projects
  ```

- **Get Project**
  ```http
  GET /api/project/get-project/:projectId
  ```

- **Remove User from Project**
  ```http
  DELETE /api/project/remove-user
  ```
  Request Body:
  ```json
  {
     "projectId": "project_id",
     "userId": "user_id"
  }
  ```

- **Delete Project**
  ```http
  DELETE /api/project/delete-project
  ```
  Request Body:
  ```json
  {
     "projectId": "project_id"
  }
  ```

### AI Routes

- **Generate AI Content**
  ```http
  POST /api/ai/gen-content
  ```
  Request Body:
  ```json
  {
     "prompt": "Generate some content about MERN stack."
  }
  ```

## Project Structure

```
prisma-ai-chat-app/
├── controllers/
│   ├── ai.controller.js
│   ├── project.controller.js
│   └── user.controller.js
├── db/
│   └── db.config.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── ai.route.js
│   ├── project.route.js
│   └── user.route.js
├── utils/
│   └── apiResponce.js
├── .env
├── package.json
├── server.js
└── README.md
```

## License

This project is licensed under the MIT License.