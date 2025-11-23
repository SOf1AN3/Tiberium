import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/userProfiles.css';

const Users = () => {
   const { user, getToken } = useAuth();
   const navigate = useNavigate();
   const [users, setUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);
   const [showManageModal, setShowManageModal] = useState(false);
   const [userToManage, setUserToManage] = useState(null);

   const USER_TYPES = ['simple', 'advanced', 'premium', 'admin'];

   useEffect(() => {
      loadUsers();
   }, [user]);

   const loadUsers = async () => {
      try {
         const token = getToken();
         const response = await fetch('http://localhost:5000/auth/users', {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         if (response.ok) {
            const data = await response.json();
            setUsers(data.users);
         }
      } catch (error) {
         console.error('Error loading users:', error);
      }
   };

   const handleManageUser = (selectedUser) => {
      setUserToManage(selectedUser);
      setShowManageModal(true);
   };

   const changeUserType = async (newType) => {
      try {
         const token = getToken();
         const response = await fetch(`http://localhost:5000/auth/users/${userToManage._id}/type`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type: newType })
         });

         if (response.ok) {
            const updatedUser = await response.json();

            // Mise à jour de la liste des utilisateurs
            setUsers(users.map(u =>
               u._id === userToManage._id ? { ...u, type: newType } : u
            ));

            // Mise à jour de l'utilisateur sélectionné si c'est celui qui a été modifié
            if (selectedUser && selectedUser._id === userToManage._id) {
               setSelectedUser({ ...selectedUser, type: newType });
            }

            // Mise à jour de l'utilisateur en cours de gestion
            setUserToManage({ ...userToManage, type: newType });
         } else {
            const errorData = await response.json();
            console.error('Error changing user type:', errorData);
         }
      } catch (error) {
         console.error('Network or unexpected error:', error);
      }
   };

   const deleteUser = async () => {
      try {
         const token = getToken();
         const response = await fetch(`http://localhost:5000/auth/users/${userToManage._id}`, {
            method: 'DELETE',
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         if (response.ok) {
            setUsers(users.filter(u => u._id !== userToManage._id));
            setShowManageModal(false);
            setSelectedUser(null);
         }
      } catch (error) {
         console.error('Error deleting user:', error);
      }
   };

   const renderManageModal = () => {
      if (!showManageModal || !userToManage) return null;

      return (
         <div className="modal-overlay">
            <div className="modal-content">
               <h2>Manage User: {userToManage.name}</h2>
               <div className="modal-actions">
                  <select
                     value={userToManage.type}
                     onChange={(e) => changeUserType(e.target.value)}
                     className="form-control"
                  >
                     {USER_TYPES.map(type => (
                        <option key={type} value={type}>
                           {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                     ))}
                  </select>
                  <button
                     onClick={deleteUser}
                     className="btn btn-danger"
                  >
                     Delete User
                  </button>
                  <button
                     onClick={() => setShowManageModal(false)}
                     className="btn btn-secondary"
                  >
                     Ok
                  </button>
               </div>
            </div>
         </div>
      );
   };

   const renderUserProfile = () => {
      if (!selectedUser) return null;

      return (
         <div className="user-profile-card">
            <div className="user-profile-header">
               <div className="user-avatar">
                  {selectedUser.name.charAt(0).toUpperCase()}
               </div>
               <div className="user-header-info">
                  <h2>{selectedUser.name}</h2>
                  <p>{selectedUser.type.charAt(0).toUpperCase() + selectedUser.type.slice(1)}</p>
               </div>
            </div>
            <div className="user-profile-content">
               <p><strong>Email:</strong> {selectedUser.email}</p>
               <p><strong>Type:</strong> {selectedUser.type.charAt(0).toUpperCase() + selectedUser.type.slice(1)}</p>
            </div>
            <div className="user-profile-footer">
               <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
               >
                  Back to Users
               </button>
               {user.type === 'admin' && (
                  <button
                     className="btn btn-danger"
                     onClick={() => handleManageUser(selectedUser)}
                  >
                     Manage User
                  </button>
               )}
            </div>
         </div>
      );
   };

   return (
      <div className="users-container">
         <div className="users-list">
            <div className="users-header">
               <h3>Users</h3>
               <button
                  className="home-button"
                  onClick={() => navigate('/')}
               >
                  Home
               </button>
            </div>
            {users.map((u) => (
               <div
                  key={u._id}
                  className={`user-item ${selectedUser?._id === u._id ? 'selected' : ''}`}
                  onClick={() => setSelectedUser(u)}
               >
                  <div className="user-item-avatar">
                     {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-item-info">
                     <p>{u.name}</p>
                     <p className="user-type">
                        {u.type.charAt(0).toUpperCase() + u.type.slice(1)}
                     </p>
                  </div>
               </div>
            ))}
         </div>

         <div className="profile-section">
            {selectedUser ? (
               renderUserProfile()
            ) : (
               <div className="no-user-selected">
                  Select a user to view their profile
               </div>
            )}
         </div>

         {renderManageModal()}
      </div>
   );
};

export default Users;