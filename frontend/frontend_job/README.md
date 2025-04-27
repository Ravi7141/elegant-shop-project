# E-Commerce Frontend

This is a frontend application for an e-commerce website built with React, TypeScript, and Material UI.

## Features

- Landing page with welcome message and start button
- Home page displaying products from the backend
- Product search functionality
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend API

This frontend is designed to work with a Spring Boot backend. Make sure your backend server is running and accessible at the URL specified in `src/services/api.ts`.

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components
- `src/services`: API services
- `src/types`: TypeScript type definitions
- `src/assets`: Static assets

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Technologies Used

- React
- TypeScript
- Material UI
- React Router
- Axios
