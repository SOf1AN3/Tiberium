import { useState } from 'react';
import emailjs from 'emailjs-com';
import '../styles/contact.css';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setError(t('contact_form_error_empty_fields'));
            return;
        }

        if (!validateEmail(formData.email)) {
            setError(t('contact_form_error_invalid_email'));
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const templateParams = {
                name: formData.name,
                email: formData.email,
                message: formData.message
            };

            const response = await emailjs.send(
                'service_iqzkqli',
                'template_v30jien',
                templateParams,
                'PhEjtk0uNwcdZjdHp'
            );

            if (response.status === 200) {
                setFormData({ name: '', email: '', message: '' });
                setIsLoading(false);
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 3000);
            } else {
                setError(`Erreur lors de l'envoi du message: ${response.text}`);
                setIsLoading(false);
            }
        } catch (error) {
            setError('Erreur lors de l\'envoi du message: ' + error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <div className='contact-form'>
                <form onSubmit={handleSubmit} className=''>
                    <h1>{t('contact_form_title')}</h1>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="text"
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className='text-input'
                        placeholder={t('contact_form_name_placeholder')}
                        disabled={isLoading}
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className='text-input'
                        placeholder={t('contact_form_email_placeholder')}
                        disabled={isLoading}
                    />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className='text-input'
                        placeholder={t('contact_form_message_placeholder')}
                        disabled={isLoading}
                    ></textarea>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="loading-spinner"></div>
                        ) : isSubmitted ? (
                            t('contact_form_button_sent')
                        ) : (
                            t('contact_form_button_send')
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
