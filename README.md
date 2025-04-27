# Elegant Shop Project

Elegant Shop Project is a full-stack e-commerce web application that allows users to browse products, view detailed information, add products to their cart, and manage products efficiently.

## Features

- **Browse Products**: See a list of available products.
- **Product Details**: Click on a product to view detailed information.
- **Add to Cart**: Add products to your shopping cart.
- **Product Management**: Manage product details, including adding, updating, and deleting products.

## Project Structure

The project is divided into two main parts:

1. **Frontend**: Built with React and TypeScript, located in the `frontend` folder.
2. **Backend**: Built with Spring Boot, located in the `backend` folder.

The project uses **PostgreSQL** as its database to store product information, including images and properties.

## How to Run the Project

To run the project, you need to start both the frontend and backend servers separately. Follow the steps below:

### Prerequisites

- Node.js (v14 or higher) and npm (v6 or higher) for the frontend
- Java Development Kit (JDK) for the backend
- PostgreSQL database

### Backend (Spring Boot)

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Configure the database connection in the `application.properties` file.
3. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend (React)

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

### Access the Application

- The backend server will run on [http://localhost:8080](http://localhost:8080) by default.
- The frontend server will run on [http://localhost:3000](http://localhost:3000) by default.
- Ensure both servers are running for the website to function.

## Technologies Used

### Frontend

- React
- TypeScript
- Material UI
- React Router
- Axios

### Backend

- Spring Boot
- PostgreSQL

## Contributing

Contributions are welcome! If you want to contribute, please fork the repository and create a pull request.



