# Ticket Box

A comprehensive ticket management system built with Node.js, Express, PostgreSQL, and Svelte.

## Overview

Ticket Box is a full-stack web application designed to help teams manage support tickets, bug reports, and task assignments. It features user authentication, role-based access control, ticket creation/tracking, and a responsive UI.

## Features

- **User Management**
  - User registration and authentication
  - Role-based access control (Admin and regular users)
  - Profile management and password change functionality
  - First login detection

- **Ticket Management**
  - Create, view, edit, and delete tickets
  - Different ticket types: Ticket, Bug, Task
  - Ticket status workflow: Open → In Progress → Resolved → Closed
  - Parent-child ticket relationships
  - Ticket assignment to users

- **Comment System**
  - Add comments to tickets
  - View comment history
  - Delete comments (Admin only)

- **Search and Filtering**
  - Search tickets by various fields (summary, status, reporter, assignee, ID, type)
  - Pagination for ticket and user lists

- **Status Tracking**
  - Automatic status change logging
  - Ticket transition history

- **Responsive UI**
  - Clean, modern interface
  - Mobile-friendly design

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database modeling and operations
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Winston** - Logging

### Frontend
- **Svelte** - Component-based UI framework
- **SvelteRouting** - Client-side routing
- **Bootstrap** - CSS framework for responsive design
- **Svelte-French-Toast** - Toast notifications
- **Svelte-Confirm** - Confirmation dialogs

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Database Setup
1. Create a PostgreSQL database named `ticketbox`:
```sql
CREATE DATABASE ticketbox;
```

2. Configure database connection in `backend/config/config.env`:
```
DB_HOST=localhost
DB_NAME=ticketbox
DB_USER=postgres
DB_PASSWORD=password
DB_PORT=5432
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Seed the admin user:
```bash
npm run seed:admin
```

4. Start the server:
```bash
npm start
```

The backend server will run on http://localhost:8000.

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will run on http://localhost:8080.

## Default Admin Credentials
- Username: admin
- Password: admin@123

## API Endpoints

### Authentication
- `POST /user/logIn` - User login
- `GET /user/logOut` - User logout

### User Management
- `GET /user/` - Get current user
- `PATCH /user/` - Edit current user
- `POST /user/admin/createUser` - Create a new user (Admin only)
- `PATCH /user/admin/editUser/:id` - Edit a user (Admin only)
- `GET /user/admin/getUsers` - Get all users (Admin only)
- `DELETE /user/admin/delete/:id` - Delete a user (Admin only)
- `PATCH /user/changePassword` - Change password

### Ticket Management
- `GET /ticket/` - Get all tickets
- `POST /ticket/` - Create a new ticket
- `GET /ticket/:id` - Get a specific ticket
- `PATCH /ticket/editTicket/:id` - Edit a ticket
- `DELETE /ticket/admin/:id` - Delete a ticket (Admin only)
- `GET /ticket/searchByField/` - Search tickets by field

### Comment Management
- `POST /comment/` - Add a comment to a ticket
- `DELETE /comment/:id` - Delete a comment (Admin only)

## Project Structure

### Backend
- `config/` - Configuration files
- `controllers/` - API route controllers
- `middleware/` - Authentication middleware
- `models/` - Database models
- `routes/` - API routes
- `services/` - Business logic
- `utils/` - Utility functions
- `seeders/` - Database seeders

### Frontend
- `public/` - Static assets
- `src/` - Source code
  - `components/` - Reusable UI components
  - `controllers/` - Business logic
  - `services/` - API service calls
  - `utils/` - Utility functions
  - `views/` - Page components
  - `routes/` - Client-side routing

## License
ISC

## Author
Ankitsingh Bisht