Here’s an updated **README.md** file for **Food Junction**, including the URLs for both frontend and backend sites, along with the comprehensive information you’ve shared:

---

# Food Junction

**Food Junction** is a full-featured restaurant web application, designed to enhance the customer experience and streamline restaurant management. The project consists of a client-facing site for users to browse, order food, subscribe, and make reservations, along with a secure admin site for restaurant staff to manage orders, tables, menu items, and more.

- **Frontend URL**: [Food Junction Client Site](https://foodjunction-1.onrender.com/)
- **Backend URL**: [Food Junction Client Site](https://foodjunction.onrender.com/)
- **Admin URL**: [Food Junction Backend API](https://foodjunction-2.onrender.com/)

## Table of Contents

- [Features](#features)
  - [Client Site](#client-site)
  - [Admin Site](#admin-site)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
  - [Client Site](#client-site-usage)
  - [Admin Site](#admin-site-usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Client Site

- **User Account Creation**: Users can create accounts for food ordering, subscriptions, and table bookings.
- **Food Ordering**: Customers can browse the menu and place orders with delivery options. Orders above $300 qualify for free delivery.
- **Promo Code Discounts**: Apply promo codes at checkout for discounts.
- **Subscription Plans**: Users can subscribe to receive exclusive weekly menus, discounts, and priority table booking.
- **Table Reservations**: Users can book tables in advance, reducing wait times.
- **Weekly Menu Access**: Subscribers can view the weekly breakfast, lunch, and dinner menus.
- **Payment Options**: Customers can select between Cash on Delivery (COD) and Stripe for secure payments; Stripe is mandatory for subscriptions.
- **Password Recovery**: Users can recover their password through the client site if forgotten.

### Admin Site

- **Admin Promotion**: Admin access is granted to specific users, promoted through the backend.
- **Secure Login**: Admins log in with email and password, managed through the client site.
- **Menu Management**: Admins can add, update, edit, and delete menu items on the menu management page.
- **Order Management**: View, update, and manage orders, subscriptions, and reservations.
- **Delivery Management**: Update delivery statuses for orders.
- **Table Management**: Add, update, and manage tables from a dedicated management page.

---

## Technologies Used

### Frontend

- **React**: ^18.2.0
- **React DOM**: ^18.2.0
- **React Router DOM**: ^6.22.0
- **Axios**: ^1.6.7, for HTTP requests
- **React Toastify**: ^10.0.4, for notifications
- **React Icons**: ^5.3.0, for iconography
- **@stripe/stripe-js**: ^3.0.3, for Stripe payment integration
- **Validator**: ^13.12.0, for form and input validation

### Backend

- **Node.js** and **Express**: Backend server and API
- **bcrypt**: ^5.1.1, for password encryption
- **Body-parser**: ^1.20.2, for parsing request bodies
- **CORS**: ^2.8.5, for handling cross-origin requests
- **Dotenv**: ^16.4.1, for environment variables
- **JWT**: ^9.0.2, for user authentication
- **Moment.js**: ^2.30.1, for date and table management
- **Mongoose**: ^8.1.1, for MongoDB interaction
- **Multer**: ^1.4.5-lts.1, for file uploads
- **Nodemailer**: ^6.9.15, for sending emails
- **Nodemon**: ^3.0.3, for live server reloading in development
- **Stripe**: ^14.17.0, server-side integration for payments
- **Validator**: ^13.11.0, for backend form validation

---

## Installation

### Prerequisites

- Node.js and npm installed on your machine.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/22Mca014/food-junction.git
   ```
   
2. **Navigate to the project directory**:
   ```bash
   cd food-junction
   ```

3. **Install dependencies for frontend and backend**:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
    cd ../admin
   npm install
   ```

4. **Start the frontend and backend servers**:
   - Frontend: `npm run dev` from the frontend directory
   - Backend: `npm run server` from the backend directory
   - Admin: `npm run dev` from the Admin directory
     

---

## Usage

### Client Site Usage

1. **Register**: Users, including potential admins, create accounts here.
2. **Order Food**: Browse the menu and place orders with delivery options.
3. **Apply Promo Codes**: Enter promo codes at checkout for special discounts.
4. **Subscription and Reservations**: Subscribe for weekly menus and reserve tables.
5. **Password Reset**: Reset password if forgotten.

### Admin Site Usage

1. **Login**: Access admin features with an approved account.
2. **Menu Management**: Add, edit, update, and delete items.
3. **Order and Subscription Management**: Track and manage orders, subscriptions, and reservations.
4. **Delivery Management**: Update delivery statuses as needed.
5. **Table Management**: Add, update, and view table details.

---

## Folder Structure

### Client Site

```
frontend/
├── public/
├── src/
│   ├── Context/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── README.md
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

### Admin Site

```
admin/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── README.md
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

### Backend

```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── utils/
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── server.js
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for exploring **Food Junction**! For questions, feedback, or support, please reach out.
