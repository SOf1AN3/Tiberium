import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
   return (
      <div className='sidebar'>
         <ul>
            <li><Link href="/offers">Offers</Link></li>
            <li><Link href="/chat">Messages</Link></li>
            <li><Link href="/profile">Settings</Link></li>
            <li><Link href="/">Home</Link></li>
         </ul>
      </div>
   );
};

export default Sidebar;
