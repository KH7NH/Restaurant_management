# 🍽️ Restaurant Management – Fullstack Project  
### FE: HTML + Bootstrap • BE: NodeJS (Express) • Database: SQL Server  

---

## 📌 Introducing the project

**Restaurant Management** project is built to simulate the basic management system for a small restaurant. 

The system includes a customer interface and an administrative interface, performing basic CRUD functions: 

- Food management 
- Menu management 
- User management (Manager - Staff - Kitchen) 
- Bill management 
- Login, function display authorization 

The project is built with the goal of learning and practicing, not integrating advanced functions such as middleware, JWT or complex security.

---

## 🏗️ Technology used

### **Frontend**
- Pure HTML5
- CSS
- Bootstrap 4/5 (CDN)
- Pure JavaScript (fetch API)

### **Backend**
- NodeJS (Express framework)
- Body-parser, CORS
- Mssql (SQL Server connection)

### **Database**
- SQL Server  
-Main tables: `NhanVien`, `MonAn`, `Menu`, `HoaDon`, `ChiTietDonHang`

---

## 📁 Directory structure

├── Backend/
│ ├── src/
│ │ ├── config/ # Configure SQL Server connection
│ │ ├── controllers/ # Handle API logic
│ │ ├── routes/ # Routes Express
│ ├── server.js # Start the backend
│ ├── package.json
│ └── .env

├── Frontend/
│ ├── pages/ # HTML interface files
│ ├── assets/ # Images, custom CSS
│ ├── package.json

└── README.md



## 🚀 Main function

### 🔐 **Login & authorization**
- Management
- Staff
- Kitchen

> Delegation works simply on the Frontend using localStorage (not using JWT yet).

---

### 👥 **User Management**
- View employee list
- Add / edit / delete (CRUD)
- Employee permissions are managed by the Management account

---

### 🍽️ **Manage dishes**
- View dish list
- Add / edit / delete dishes
- Each dish has:
- Dish name
- Description
- Price
- Image
- Dish type

---

### 📜 **Menu**
- List of dishes served in the restaurant
- Add / remove dishes from the Menu

---

### 🧾 **Invoice Management**
- Create Invoice
- Show Details
- Calculate Total

---

## ⚙️ How to run the project

Database: https://docs.google.com/document/d/1FpRIxIlkjL14CpASPxyaEmZfi10_-rcIsfZzZBqXwoM/edit?usp=sharing

### 1️⃣ Setting Backend
cd Backend
npm install
Create file .env:


DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
DB_SERVER=your_server
PORT=3000

Run the server:

node server.js
2️⃣ Run Frontend

No build required – run directly:

Frontend/pages/dashboard.html
or
Frontend/pages/login.html
Just open it with Live Server or a regular browser.

🔮 Future Development Directions
JWT Authentication Integration

Authorization Checking Middleware

Cloud Image Upload (Cloudinary / Firebase)

Moving Frontend to React / Vue

More Complete REST API

👨‍💻 Author
Hoàng Đức Khánh (Mouse)

