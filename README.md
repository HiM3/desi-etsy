# Desi Etsy

A full-stack e-commerce platform built with modern web technologies, inspired by Etsy but focused on South Asian (Desi) products and artisans.

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- React Hook Form
- Framer Motion
- React Hot Toast
- Stripe Integration
- React Slick (for carousels)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Stripe Payment Integration
- Nodemailer
- Multer (for file uploads)
- Bcrypt (for password hashing)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd desi-etsy
```

2. Install root dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
```

4. Install server dependencies:
```bash
cd ../server
npm install
```

5. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 🚀 Running the Application

### Development Mode

To run both client and server concurrently:
```bash
npm run dev
```

To run client only:
```bash
npm run client
```

To run server only:
```bash
npm run server
```

### Production Build

1. Build the client:
```bash
cd client
npm run build
```

2. Start the server:
```bash
cd ../server
npm start
```

## 🌟 Features

- User authentication and authorization
- Product listing and search
- Shopping cart functionality
- Secure payment processing with Stripe
- Order management
- User profiles
- Admin dashboard
- Responsive design
- Email notifications
- Image upload and management

## 📁 Project Structure

```
desi-etsy/
├── client/                 # Frontend React application
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔒 Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `EMAIL_USER`: Email address for notifications
- `EMAIL_PASS`: Email password for notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Meet - The Backend Developer
- Prena - The Frontend Developer
- Sauban - The Frontend Developer

## 🙏 Acknowledgments

- Etsy for inspiration
- All the open-source libraries and tools used in this project 