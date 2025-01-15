# Tiberium Project

## Overview
Tiberium is a full-stack web application built with React + Vite for the frontend and a backend server architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/SOf1AN3/Tiberium
```

2. Install dependencies for both frontend and backend:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## 🏗️ Project Structure
```
tiberium/
├── frontend/          # React + Vite frontend
├── backend/           # Backend server
├── documentation/     # Project documentation
│   ├── docs/
│   │   ├── content.md
│   │   └── index.md
│   └── assets/
└── package.json
```

## 🛠️ Development

To start the development servers:

```bash
npm start
```

This will concurrently run:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 📚 Documentation

Detailed documentation can be found in the 

documentation

 folder:
- Overview and features in 

content.md


- API documentation and technical details in `docs/index.md`

## 🔧 Technologies Used

### Frontend
- React
- Vite
- ESLint
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

### Backend
- Node.js
- Express (or your backend framework)

## 📝 License

ISC

## 👥 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request