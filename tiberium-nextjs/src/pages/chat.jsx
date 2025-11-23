import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PrivateRoute from '../components/PrivateRoute';
import Messages from '../components/Messages';

const Chat = () => {
   return (
      <PrivateRoute>
         <Messages />
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

export default Chat;
