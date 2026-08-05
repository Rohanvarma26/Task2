# Employee Management System (MERN)

A full-stack Employee Management System built using **React + Vite** for the frontend and **Node.js + Express + MongoDB** for the backend. The application provides complete employee management with validation, search, filtering, pagination, and centralized error handling.

---

# 🚀 Features

* Employee CRUD Operations
* Search Employees
* Filter by Department & Status
* Sorting & Pagination
* Dashboard Statistics
* Backend Validation using `express-validator`
* RESTful API using Express & MongoDB
* **Centralized Error Handling Middleware**
* Consistent JSON Error Responses

---

# 🛠 Tech Stack

## Frontend

* React 19
* Vite
* Axios
* Lucide React

## Backend

* Node.js
* Express 5
* MongoDB
* Mongoose
* express-validator
* dotenv

---

# 📁 Project Structure

```text
task2/
│
├── backend/
│   ├── config/
│   │     database.js
│   │
│   ├── controllers/
│   │     employeeController.js
│   │
│   ├── middleware/
│   │     errorHandler.js
│   │     validateRequest.js
│   │
│   ├── models/
│   │     Employee.js
│   │
│   ├── routes/
│   │     employeeRoutes.js
│   │
│   ├── server.js
│   └── seed.js
│
└── frontend/
    ├── public/
    ├── src/
    │    ├── components/
    │    ├── pages/
    │    ├── services/
    │    ├── App.jsx
    │    └── main.jsx
    │
    ├── package.json
    └── vite.config.js
```

---

# ⚙️ Prerequisites

* Node.js v18+
* npm
* MongoDB

---

# 🔧 Installation

## Clone Repository

```bash
git clone <repository-url>
cd task2
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_db
NODE_ENV=development
```

(Optional)

```bash
npm run seed
```

Run backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 📡 API Endpoints

Base URL

```
/api/employees
```

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | /api/employees     | Get all employees  |
| GET    | /api/employees/:id | Get employee by ID |
| POST   | /api/employees     | Create employee    |
| PUT    | /api/employees/:id | Update employee    |
| DELETE | /api/employees/:id | Delete employee    |

---

# 🔍 Query Parameters

```
page
limit
search
department
status
sortField
sortOrder
```

Example

```
GET /api/employees?page=1&limit=10&search=john
```

---

# 🛡 Centralized Error Handling

The backend uses a centralized error handling middleware to ensure all errors return a consistent JSON response.

It handles:

* Validation Errors
* Authentication Errors
* MongoDB Errors
* Server Errors
* Invalid Routes

---

## Validation Error

If request validation fails using `express-validator`, the API returns:

```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

Status Code

```
400 Bad Request
```

---

## Authentication Error

If authentication fails or an invalid token is provided:

```json
{
  "success": false,
  "message": "Unauthorized Access"
}
```

Status Code

```
401 Unauthorized
```

---

## Database Error

For MongoDB or Mongoose-related errors:

```json
{
  "success": false,
  "message": "Database Error"
}
```

Status Code

```
500 Internal Server Error
```

---

## Duplicate Key Error

If an employee with the same unique value already exists:

```json
{
  "success": false,
  "message": "Duplicate Record"
}
```

Status Code

```
409 Conflict
```

---

## Invalid ObjectId

If an invalid MongoDB ObjectId is provided:

```json
{
  "success": false,
  "message": "Invalid Employee ID"
}
```

Status Code

```
400 Bad Request
```

---

## Resource Not Found

```json
{
  "success": false,
  "message": "Employee Not Found"
}
```

Status Code

```
404 Not Found
```

---

## Internal Server Error

Unexpected server errors are handled globally:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

Status Code

```
500 Internal Server Error
```

---

# ✅ Consistent API Response Format

Successful Response

```json
{
  "success": true,
  "data": {}
}
```

Error Response

```json
{
  "success": false,
  "message": "Error Message"
}
```

---

# 📌 Development Notes

* Run backend and frontend simultaneously.
* Ensure MongoDB is running before starting the backend.
* All API errors are handled through a centralized middleware.
* Validation is implemented using `express-validator`.
* Error responses follow a consistent JSON structure for easier frontend integration.

---

# 👨‍💻 Author

**Rohan Varma**

MERN Stack Developer
