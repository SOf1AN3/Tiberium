import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/subscription.css';

const Subscription = () => {
   const [selectedPlan, setSelectedPlan] = useState(null);
   const navigate = useNavigate();

   const plans = [
      {
         id: 'administrative',
         name: 'Assistance administrative',
         price: '30.99',
         features: [
            'Aide aux démarches administratives',
            'Support par email et téléphone',
            'Suivi personnalisé',
            'Aide à la rédaction de documents'
         ]
      },
      {
         id: 'legal',
         name: 'Assistance légale',
         price: '59.99',
         features: [
            'Conseil juridique',
            'Révision de documents légaux',
            'Assistance contentieux',
            'Support juridique prioritaire',
            'Consultation avec des experts'
         ]
      },
      {
         id: 'moving',
         name: 'Assistance déménagement',
         price: '10.99',
         features: [
            'Planification du déménagement',
            'Recherche de prestataires',
            'Conseils organisation',
            'Check-list personnalisée'
         ]
      },
      {
         id: 'buyingselling',
         name: 'Assistance achat et vente',
         price: '10.99',
         features: [
            'Conseil en négociation',
            'Vérification des documents',
            'Accompagnement transaction',
            'Évaluation de biens'
         ]
      },
      {
         id: 'travel',
         name: 'Assistance Séjour',
         price: '10.99',
         features: [
            'Planification de voyage',
            'Réservations',
            'Assistance 24/7',
            'Conseils locaux',
            'Support urgence'
         ]
      }
   ];

   const handleSelectPlan = (planId) => {
      setSelectedPlan(planId);
      navigate('/payment');
   };

   return (
      <>
         <div className="subscription-container">
            <div className="subscription-header">
               <h1>Choose Your Plan</h1>
               <p>Select the perfect plan for your needs</p>
            </div>

            <div className="plans-container">
               {plans.map((plan) => (
                  <div
                     key={plan.id}
                     className={`plan-card ${selectedPlan === plan.id ? 'selected-plan' : ''}`}
                  >
                     <h2 className="plan-name">{plan.name}</h2>
                     <div className="plan-price">${plan.price}/mo</div>
                     <ul className="plan-features">
                        {plan.features.map((feature, index) => (
                           <li key={index}>{feature}</li>
                        ))}
                     </ul>
                     <button
                        className="select-plan-btn"
                        onClick={() => handleSelectPlan(plan.id)}
                     >
                        {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                     </button>
                  </div>
               ))}
            </div>
         </div ></>
   );
};

export default Subscription;
