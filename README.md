# E-Commerce Website
vist this link ->
```
[Link]https://famous-sawine-ac1312.netlify.app
```

Welcome to the E-Commerce Website project! This project is built using modern web technologies to provide a seamless shopping experience for users and robust management features for admins.

---

## Features

### User Features:

- Browse products by category, search, filter, and sort.
- Detailed product pages with high-quality images and reviews.
- Add products to the cart and proceed to checkout.
- Secure payment options and order tracking.
- User account management with order history and wishlists.

### Admin Features:

- Manage products (add, edit, delete) and their details.
- Handle orders: view, update status, and process.
- Manage users and their roles.
- View website analytics (e.g., sales, user activity).
- Notification system for orders and user activities.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Hosting:** Netlify (Frontend), Railway (Backend)

---

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/pawansuthar01/E-Commerce-website.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd ecommerce-website
    ```

3.  Install dependencies for both frontend and backend:

    ```bash
    cd Client
    npm install
    cd ../server
    npm install
    ```

4.  Configure environment variables:

    - Create a `.env` file in the `server` folder.
    - Add the following variables:

```env
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    JWT_EXPIRY=your-jwt-Exp
    PORT = 50XX
    NODE_ENV=XXxxxx
    KEY_ID=razorpay_Kd
    SECRET_ID=razorpay_secret
    CLOUDINARY_CLOUD_NAME=cloudinary_name
    CLOUDINARY_API_KEY=cloudinary_api
    CLOUDINARY_API_SECRET=cloudinary_secret
    SMTP_HOST=email_xxx
    SMTP_PORT=58Xxx
    MAIL=your_email_@gmail.com
    SMTP_USERNAME=your_email_@gmail.com
    SMTP_PASS=your_smtp_pass_xxx
    FRONTEND_URL=frontend_url

```

5. Start the development servers:
   - Frontend:
     ```bash
     cd Client
     npm run dev
     ```
   - Backend:
     ```bash
     cd server
     npm run dev
     ```

---

## Scripts

### client

- `npm run dev`: Start the React development server.
- `npm run build`: Build the project for production.

### server

- `npm run dev`: Start the backend server in development mode.
- `npm start`: Start the backend server in production mode.

---

## Folder Structure

### client:

- `src/components`: Reusable React components.
- `src/pages`: Pages for the website (e.g., Home, Product, Cart).
- `src/context`: Context API setup for global state management.

### server:

- `routes`: API routes for products, orders, users, etc.
- `models`: Mongoose schemas for MongoDB.
- `controllers`: Business logic for routes.

---

## Contribution Guidelines

1. Fork the repository and clone it locally.
2. Create a new branch for your feature/bug fix.
3. Commit your changes with clear messages.
4. Push the changes and create a pull request.

---

## License

This project is licensed under the MIT License. Feel free to use and contribute!

---

## Contact

For any queries or suggestions, please contact:

- **Name:** Pawan Kumar
- **Email:** paw.kum.2111@gmail.com
- **GitHub:** [pawansuthar01](https://github.com/pawansuthar01)

```

```
