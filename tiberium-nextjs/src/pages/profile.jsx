import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PrivateRoute from '../components/PrivateRoute';
import ProfileSettings from '../components/ProfileSettings';

const Profile = () => {
   return (
      <PrivateRoute>
         <ProfileSettings />
      </PrivateRoute>
   );
};

export async function getStaticProps({ locale }) {
   return {
      props: {
         ...(await serverSideTranslations(locale, ['common', 'translation'])),
      },
   };
}

export default Profile;
