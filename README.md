# ShopEZ - Modern Full-Stack E-Commerce Platform

ShopEZ is a fully-featured, dynamically responsive MERN stack E-Commerce application. It provides complete end-to-end purchasing flows, robust product cataloging, secure user authentication, dummy data seeding, and an exhaustive Admin Dashboard.

## 🚀 Features

- **Storefront & Catalog:** Browse products dynamically parsed into categories (Fashion, Electronics, Mobiles), with support for search, sorting, and rich image carousels.
- **Cart & Checkout Flow:** Interactive shopping cart with persistent real-time total calculation. Fully integrated with Razorpay (Test Mode) SDK for credit/debit card mockup payments.
- **Role-Based Authentication:** Secure JWT-based architecture. Includes encrypted user login/registration and distinct environments for regular `users` vs `admin`.
- **In-Memory Database Fallback:** Fails over to `mongodb-memory-server` ensuring 100% crash-free portability whether MongoDB is installed or not.
- **Admin Dashboard:** Total site control. Monitor active users, edit/delete orders, perform full CRUD operations on all products, and automatically Seed the database via external FakeStore API integration.

---

## 📸 Screenshots

*(Add your screenshots here by replacing the placeholder links!)*

1. **Homepage**
   ![Homepage](./homepage-placeholder.png)

2. **Product Catalog & Details**
   ![Products Page](./products-placeholder.png)

3. **User Profile & Order History**
   ![User Profile](./profile-placeholder.png)

4. **Cart & Secure Checkout (Razorpay)**
   ![Checkout Flow](./checkout-placeholder.png)

5. **Admin Control Dashboard**
   ![Admin Dashboard](./admin-dashboard-placeholder.png)

---

## 💻 Tech Stack
- **Frontend**: React.js, Vite, Axios, React Router, Context API, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose), `mongodb-memory-server` fallback.
- **Security**: JWT (JSON Web Tokens), `bcryptjs`.
- **Payment Gateway**: Razorpay Integration.

## 🔧 Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/ANAND-JATOTHU/ShopEZ.git
   ```
2. **Install Server Dependencies**
   ```bash
   cd ShopEZ/Server
   npm install
   ```
3. **Install Client Dependencies**
   ```bash
   cd ../Client
   npm install
   ```
4. **Boot Both Servers**
   - Head to `Server/` and run `npm run dev`
   - Head to `Client/` and run `npm run dev`
5. **Access the App**
   Open `http://localhost:5174/` or `http://localhost:5173/` in your browser.

> Note: To access the Admin panel, login using `admin@shopez.com` (password: `admin123`). The store will automatically seed itself with products from FakeStoreAPI on boot!
