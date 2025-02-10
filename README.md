# Octane

A modern Node.js application for tracking and managing your reading progress, built with NestJS and PostgreSQL.

## 🚀 Quick Start with Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/omarellakany/octane.git
cd octane
```

2. Build and run the application:

```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`

## 📚 Features

- User authentication and authorization
- Book management system
- Reading progress tracking
- Reading intervals logging
- RESTful API

// ... existing README content ...

## Authentication

The application comes with two pre-seeded user accounts for testing:

### Admin Account

- Email: `admin@octane.com`
- Password: `admin123`
- Role: Admin

### Regular User Account

- Email: `user@octane.com`
- Password: `user123`
- Role: User

To authenticate:

1. Send a POST request to `/auth/login` with the following body:

```
{
"email": "admin@octane.com",
"password": "admin123"
}
```

2. The response will include a JWT token that should be included in subsequent requests in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🔧 Technology Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Container**: Docker
- **Testing**: Jest
- **API Documentation**: Swagger/OpenAPI

## 📝 API Documentation

### Authentication

- `POST /auth/login` - Login and receive JWT token

### Books

- `GET /books/best-five` - Get best five books
- `PATCH /books/:id` - Update book details
- `POST /books/reading-intervals` - Add reading interval

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Set up your local environment variables (see `.env` section above)

3. Start the development server:

Consider adding `.env` file to the root of the project.

```bash
npm run start:dev
```

## 🧪 Testing

````bash
# Run all tests
npm run test


## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

- `Dockerfile` - Production-ready Node.js container
- `docker-compose.yml` - Development environment setup

### Building the Docker Image

```bash
docker build -t octane .
````

### Running with Docker Compose

```bash
# Development mode
docker compose up

# Rebuild containers
docker compose up --build

# Run in background
docker compose up -d
```
