import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
   const { user, loading } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!loading && !user) {
         router.push('/connexion');
      }
   }, [user, loading, router]);

   if (loading) {
      return <div>Loading...</div>;
   }

   return user ? children : null;
};

export default PrivateRoute;
