import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
   const { user, loading } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!loading) {
         if (!user) {
            router.push('/connexion');
         } else if (user.type !== 'admin') {
            router.push('/');
         }
      }
   }, [user, loading, router]);

   if (loading) {
      return <div>Loading...</div>;
   }

   return user && user.type === 'admin' ? children : null;
};

export default AdminRoute;
