import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import '../styles/footer.css';
import '../styles/about.css';
import '../styles/connexion.css';
import '../styles/contact.css';
import '../styles/expats.css';
import '../styles/services.css';
import '../styles/admin.css';
import '../styles/messages.css';
import '../styles/profileSettings.css';
import '../styles/sidebar.css';
import '../styles/userList.css';
import '../styles/userProfiles.css';
import '../styles/dashboard.css';
import '../styles/notfound.css';

function MyApp({ Component, pageProps }) {
   return (
      <AuthProvider>
         <Component {...pageProps} />
      </AuthProvider>
   );
}

export default appWithTranslation(MyApp);
