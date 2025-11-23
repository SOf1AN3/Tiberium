import React from 'react'
import '../styles/sidebar.css'

const Sidebar = () => {
   return (
      <div className='sidebar'>
         <ul>
            <li><a href="/offers">Offers</a></li>
            <li><a href="/dashboard/chat">Messages</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/home">Home</a></li>
         </ul>
      </div>
   )
}

export default Sidebar