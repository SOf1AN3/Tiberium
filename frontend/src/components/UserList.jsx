import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/userList.css'; // Import the CSS file

const UserList = () => {
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchUsers = async () => {
               try {
                    const response = await axios.get('http://localhost:5000/api/users'); // Adjust the URL as needed
                    setUsers(response.data);
                    setLoading(false);
               } catch (error) {
                    console.error('Error fetching users:', error);
                    setLoading(false);
               }
          };

          fetchUsers();
     }, []);

     if (loading) {
          return <div className="loading">Loading...</div>;
     }

     return (
          <div className="user-list-container">
               <h1>User List</h1>
               <ul className="user-list">
                    {users.map(user => (
                         <li key={user._id}>{user.email}</li>
                    ))}
               </ul>
          </div>
     );
};

export default UserList;