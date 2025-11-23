// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
   const { user } = useAuth();
   const token = localStorage.getItem('token') || sessionStorage.getItem('token');

   if (!token) {
      return <Navigate to="/connexion" />;
   }

   return children;
};

export default PrivateRoute;