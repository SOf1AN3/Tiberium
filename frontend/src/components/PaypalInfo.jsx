import React from 'react';
import '../styles/paypalinfo.css';

const PaypalInfo = () => {
   return (
      <div className="paypal-container">
         <div className="paypal-card">
            <div className="paypal-header">
               <div className="paypal-avatar">
                  <i className="fab fa-paypal"></i>
               </div>
               <div className="paypal-header-info">
                  <h2>PayPal Payment Information</h2>
                  <p>Send payments securely</p>
               </div>
            </div>

            <div className="paypal-content">
               <div className="info-item">
                  <strong>PayPal Email:</strong>
                  <p>your.email@example.com</p>
               </div>

               <div className="info-item">
                  <strong>Account Holder:</strong>
                  <p>Abdelkrim Oudina</p>
               </div>

               <div className="qr-section">
                  <strong>Scan QR Code:</strong>
                  <div className="qr-placeholder">
                     [QR Code Placeholder]
                  </div>
               </div>
            </div>

            <div className="paypal-footer">
               <button className="btn btn-secondary" onClick={() => window.history.back()}>
                  Go Back
               </button>
               <a
                  href="https://paypal.me/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary">
                  Send Money
               </a>
            </div>
         </div>
      </div>
   );
};

export default PaypalInfo;
