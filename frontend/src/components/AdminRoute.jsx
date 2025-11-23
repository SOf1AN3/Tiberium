// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
   const { user } = useAuth();
   const token = localStorage.getItem('token') || sessionStorage.getItem('token');

   if (!token) {
      return <Navigate to="/connexion" />;
   }

   // Changez role par type
   if (user?.type !== 'admin') {
      return <Navigate to="/" />;
   }

   return children;
};

export default AdminRoute;