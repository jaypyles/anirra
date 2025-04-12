# SaaS Template with Authentication

This is a template for a SaaS application with authentication.

The frontend is built with Next.js and Tailwind CSS.

The backend is built with FastAPI and SQLAlchemy.

This template allows for a user to sign up, sign in, and sign out. It comes with a prebuilt user store made in redux. All of the session logic is handled in the backend.

This template focuses on a credit system where users can purchase credits to use the application, with the ability to make an API key to use the application without the frontend. Though this can be easily modified to use a subscription model, by forcing the `requires_credit` function to not decrement the user's credit balance, to act as a subscription.

## Environment Variables

The following environment variables are required:

- `JWT_SECRET`: A secret key for signing and verifying JWT tokens
- `NEXTAUTH_SECRET`: A secret key for signing and verifying NextAuth tokens
- `DATABASE_URL`: A URL for the database

The `JWT_SECRET` on the frontend and backend must be the same.

## Getting Started

1. Clone the repository
2. Run `pdm install` to install the backend dependencies
3. Run `cd frontend` and then `npm install` to install the frontend dependencies

## Running the Application

1. Run `make build up` to build and start the containers
2. Visit `http://localhost:3000` to view the frontend
