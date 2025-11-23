import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AdminRoute from '../../components/AdminRoute';
import Users from '../../components/Users';

const AdminPanel = () => {
   return (
      <AdminRoute>
         <Users />
      </AdminRoute>
   );
};

export async function getStaticProps({ locale }) {
   return {
      props: {
         ...(await serverSideTranslations(locale, ['common', 'translation'])),
      },
   };
}

export default AdminPanel;
