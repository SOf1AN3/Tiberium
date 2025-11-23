import React from 'react'
import '../styles/admin.css'
import UserList from '../components/UserList'
import Header from '../components/Header'

const AdminPanel = () => {
     return (
          <>
               <Header />
               <div className="admin-container">

                    <div className="main-content">
                         <UserList />
                    </div>
               </div>
          </>
     )
}

export default AdminPanel