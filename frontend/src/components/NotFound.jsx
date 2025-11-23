import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Utilisez useNavigate à la place de useHistory
import backgroundImage from '../assets/background.jpg';

const NotFound = () => {
     const navigate = useNavigate(); // Utilisez useNavigate pour la redirection

     useEffect(() => {
          const timer = setTimeout(() => {
               navigate('/'); // Utilisez navigate pour rediriger
          }, 5000); // 5000 millisecondes = 5 secondes

          return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté
     }, [navigate]);

     return (
          <div className="services-wrapper">
               <img
                    src={backgroundImage}
                    className="background-fixe"
                    alt="Background"
               />
               <div className="not-found-message">
                    <h1>404 Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <a className='link' href="/"><p>Click here to go back to the homepage.</p></a>
               </div>
          </div>
     );
};

export default NotFound;