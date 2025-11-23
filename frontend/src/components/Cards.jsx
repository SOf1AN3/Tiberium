import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/services.css';
import exitIcon from '../assets/exit.png';
import image1 from '../assets/1.jpg';
import image2 from '../assets/2.jpg';
import image3 from '../assets/3.jpg';
import image4 from '../assets/4.jpg';

const LazyImage = lazy(() => import('./LazyImage'));

const Cards = () => {
     const { t } = useTranslation();
     const [expandedCard, setExpandedCard] = useState(null);
     const services = [
          {
               title: t('cards_consulting_title'),
               content: t('cards_consulting_content'),
               image: image1
          },
          {
               title: t('cards_market_title'),
               content: t('cards_market_content'),
               image: image2
          },
          {
               title: t('cards_training_title'),
               content: t('cards_training_content'),
               image: image3
          },
          {
               title: t('cards_digital_title'),
               content: t('cards_digital_content'),
               image: image4
          }
     ];

     const handleCardClick = (index) => {
          if (expandedCard === null) {
               setExpandedCard(index);
          }
     };

     const handleCloseClick = (e) => {
          e.stopPropagation();
          setExpandedCard(null);
     };

     return (
          <div className="services-wrapper">
               <h1 className="services-title no-select">{t('cards_title')}</h1>
               <div className={`services-container ${expandedCard !== null ? 'expanded' : ''}`}>
                    {services.map((service, index) => (
                         <div
                              key={index}
                              className={`service-card ${expandedCard === index ? 'expanded' : ''}`}
                              onClick={() => handleCardClick(index)}
                              style={{ backgroundColor: `rgb(${index * 20}, ${index * 20}, ${index * 20})` }}
                         >
                              {expandedCard !== index && <h2>{service.title}</h2>}
                              {expandedCard === index && (
                                   <>
                                        <div className="card-image">
                                             <Suspense fallback={<div>Loading...</div>}>
                                                  <LazyImage src={service.image} alt={service.title} />
                                             </Suspense>
                                        </div>
                                        <div className="card-content">
                                             <h2>{service.title}</h2>
                                             <p className="service-content">{service.content}</p>
                                        </div>
                                        <button className="close-button" onClick={handleCloseClick}>
                                             <img src={exitIcon} alt="Close" />
                                        </button>
                                   </>
                              )}
                         </div>
                    ))}
               </div>
          </div>
     );
};

export default Cards;