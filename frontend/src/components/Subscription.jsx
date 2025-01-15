import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/subscription.css';

const Subscription = () => {
   const [selectedPlan, setSelectedPlan] = useState(null);
   const navigate = useNavigate();

   const plans = [
      {
         id: 'simple',
         name: 'Simple',
         price: '9.99',
         features: [
            'Basic features access',
            'Email support',
            'Up to 5 projects',
            '1GB storage'
         ]
      },
      {
         id: 'advanced',
         name: 'Advanced',
         price: '19.99',
         features: [
            'All Simple features',
            'Priority email support',
            'Up to 15 projects',
            '10GB storage',
            'Advanced analytics'
         ]
      },
      {
         id: 'premium',
         name: 'Premium',
         price: '29.99',
         features: [
            'All Advanced features',
            '24/7 phone support',
            'Unlimited projects',
            '100GB storage',
            'Custom analytics',
            'API access',
            'Dedicated account manager'
         ]
      }
   ];

   const handleSelectPlan = (planId) => {
      setSelectedPlan(planId);
      // Here you would typically handle the subscription process
      // For now, we'll just console.log
      console.log(`Selected plan: ${planId}`);
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
