import React, { useState } from 'react';
import '../styles/expats.css';
import { useTranslation } from 'react-i18next';

const ExpatsServices = () => {
     const { t } = useTranslation();
     const [activeIndex, setActiveIndex] = useState(null);

     const questions = [
          {
               question: t('expats_question_1'),
               answer: t('expats_answer_1')
          },
          {
               question: t('expats_question_2'),
               answer: t('expats_answer_2')
          },
          {
               question: t('expats_question_3'),
               answer: t('expats_answer_3')
          },
          {
               question: t('expats_question_4'),
               answer: t('expats_answer_4')
          },
          {
               question: t('expats_question_5'),
               answer: t('expats_answer_5')
          },
          {
               question: t('expats_question_6'),
               answer: t('expats_answer_6')
          }
     ];

     const toggleQuestion = (index) => {
          setActiveIndex(activeIndex === index ? null : index);
     };

     const formatAnswer = (answer) => {
          return answer.split('\n').map((line, index) => (
               <React.Fragment key={index}>
                    {line}
                    <br />
               </React.Fragment>
          ));
     };

     return (
          <div className="container-qst">
               <h1 className='title'>{t('expats_title')}</h1>
               <h2>{t('expats_welcome')}</h2>
               <h1>{t('expats_mission_title')}</h1>
               <p>{t('expats_mission_desc')}</p>
               <h1>{t('expats_services_title')}</h1>
               <div className="question-list">
                    {questions.map((item, index) => (
                         <div key={index} className={`question ${activeIndex === index ? 'active' : ''}`}>
                              <div className="question-header" onClick={() => toggleQuestion(index)}>
                                   {item.question}
                              </div>
                              <div className="answer">
                                   {formatAnswer(item.answer)}
                              </div>
                         </div>
                    ))}
               </div>
               <h1 className='contactez-h1'>{t('expats_contact_title')}</h1>
               <p>{t('expats_contact_desc')} <a className='contactez-nous' href='/contact'>{t('expats_contact_title')}</a></p>
          </div>
     );
};

export default ExpatsServices;