# MERN Portfolio Tracker – Stocks & Crypto Dashboard

A modern portfolio tracking dashboard built using the MERN stack. Users can track crypto and stock holdings, view real-time prices, charts, profit/loss analytics, and manage their portfolio in a clean admin-style UI.

---

## ⭐ Features

### 🔐 User Authentication
- Register and login system
- JWT-based authentication
- Protected backend routes
- Password encryption with Bcrypt

### 📊 Dashboard Analytics
- Total investment value
- Current portfolio value
- Total profit/loss calculation
- Number of holdings
- BTC hourly price chart
- Recent activities widget
- Portfolio performance metrics

### 💹 Live Price Fetching
- Crypto prices from CoinGecko API
- Stock prices from Finnhub API
- Auto-updating P/L calculations
- Real-time market data refresh
- Multiple asset support

### 📁 Portfolio Management
- Add stocks or crypto assets
- Enter buy price & quantity
- Delete assets
- View detailed portfolio table
- Edit asset details
- Track investment history

### 🎨 Modern UI / Layout
- Fixed sidebar navigation
- Dark neon theme
- Responsive grid design
- Recharts line & area charts
- Smooth animations
- Mobile-friendly interface

---

## 🛠 Tech Stack

### Frontend
- React 18 (Vite)
- Axios
- Recharts
- Custom CSS
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication
- Bcrypt Hashing
- CoinGecko API
- Finnhub API

---

## 📁 Project Structure

```
MERN-Portfolio-Tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── PortfolioTable.jsx
│   │   │   ├── ChartWidget.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── AddAsset.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   └── MainLayout.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   │   ├── priceController.js
│   │   └── chartController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── portfolio.js
│   │   ├── prices.js
│   │   └── charts.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   └── Activity.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── db.js
│   ├── index.js
│   ├── package.json
│   └── .env
├── README.md
└── .gitignore
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas Account (free tier)
- Finnhub API Key (free tier)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/KrishKyada/stocks-portfolio-tracker.git
cd mern-portfolio-tracker
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 4: Setup Environment Variables

Create `.env` file in the `server` folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-tracker
JWT_SECRET=your_super_secret_jwt_key_here
FINNHUB_KEY=your_finnhub_api_key_here
```

**Get these values:**
- **MONGO_URI**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **FINNHUB_KEY**: [Finnhub](https://finnhub.io/)
- **JWT_SECRET**: Any random secure string

### Step 5: Start Backend Server
```bash
cd server
npm run dev
```
Backend runs at: `http://localhost:5000`

### Step 6: Start Frontend Server
In a new terminal:
```bash
cd client
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Step 7: Access Application
Open browser and go to `http://localhost:5173`

---

## 📡 API Routes

### Authentication Routes
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
```

### Portfolio Routes
```
GET    /api/portfolio
POST   /api/portfolio/add
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id
```

### Price Routes
```
GET    /api/prices/crypto/:symbol
GET    /api/prices/stock/:symbol
GET    /api/prices/multiple
```

### Chart Routes
```
GET    /api/chart/btc-24h
GET    /api/chart/portfolio
```

---

## 🔐 Authentication

- **Registration**: Create account with email & password
- **Password Hashing**: Bcrypt encryption for security
- **JWT Token**: Issued upon successful login
- **Protected Routes**: Token required for API access
- **Token Storage**: Stored in localStorage

---

## 💾 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Portfolio Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  assetName: String,
  assetType: String (crypto/stock),
  symbol: String,
  quantity: Number,
  buyPrice: Number,
  currentPrice: Number,
  totalInvested: Number,
  currentValue: Number,
  profitLoss: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Key Components

### Pages
- Dashboard - Analytics overview
- Portfolio - Holdings management
- Add Asset - New investment form
- Login - User authentication
- Register - Account creation

### Components
- Sidebar Navigation
- Header/Navbar
- Portfolio Table
- Chart Widgets
- Statistics Cards
- Forms (Add/Edit/Delete)

---

## 🔮 Future Improvements

- Watchlist feature
- WebSocket real-time updates
- Export data to CSV/PDF
- More chart types (candlestick, MA)
- Multi-theme support
- Performance alerts
- Portfolio comparisons
- Dividend tracking
- Tax reports generation
- Mobile app (iOS/Android)
- Social sharing features
- AI recommendations

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
- Verify MONGO_URI in .env
- Check MongoDB Atlas IP whitelist
- Ensure cluster is active

### API Key Issues
- Verify Finnhub API key
- Check rate limits
- Confirm .env variables are set

### CORS Issues
- Add frontend URL to CORS whitelist
- Check Axios configuration

---

## 📝 Available Scripts

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start server
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📧 Support

For issues and questions:
- Open a GitHub issue
- Check existing issues for solutions
- Provide detailed bug reports

---

## 🌟 Acknowledgments

- CoinGecko API
- Finnhub API
- MongoDB
- React Community
- Express.js

---

**Author : Krish Kyada**

⭐ If you found this helpful, please star the repository!
