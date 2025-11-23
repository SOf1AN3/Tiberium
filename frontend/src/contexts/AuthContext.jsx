import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';
const AuthContext = createContext();

export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
};

export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const checkAuth = async () => {
               const token = localStorage.getItem('token') || sessionStorage.getItem('token');

               if (token) {
                    try {
                         const response = await fetch(`${API_BASE_URL}/auth/check`, {
                              headers: {
                                   'Authorization': `Bearer ${token}`
                              },
                              credentials: 'include'
                         });

                         if (response.ok) {
                              const data = await response.json();
                              setUser(data.user);
                         } else {
                              // Si le token n'est plus valide, le supprimer
                              localStorage.removeItem('token');
                              sessionStorage.removeItem('token');
                              setUser(null);
                         }
                    } catch (error) {
                         console.error('Auth check error:', error);
                         localStorage.removeItem('token');
                         sessionStorage.removeItem('token');
                         setUser(null);
                    }
               }

               setLoading(false);
          };

          checkAuth();
     }, []);

     const signup = async (name, email, password, confirmPassword) => {
          try {
               const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                         name,
                         email,
                         password,
                         confirmPassword
                    })
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || 'Signup failed');
               }

               // On ne set pas automatiquement l'utilisateur après l'inscription
               // L'utilisateur devra se connecter après avoir confirmé son email
               return data;
          } catch (error) {
               throw error;
          }
     };

     const login = async (email, password, rester) => {
          try {
               const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                         email,
                         password,
                         rester
                    })
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
               }

               // Stocker le token dans le bon storage selon le choix de l'utilisateur
               if (data.token) {
                    if (rester) {
                         localStorage.setItem('token', data.token);
                    } else {
                         sessionStorage.setItem('token', data.token);
                    }
                    setUser(data.user);
               }

               return data;
          } catch (error) {
               throw error;
          }
     };

     const logout = () => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
     };

     // Fonction utilitaire pour vérifier si l'utilisateur est admin
     const isAdmin = () => {
          return user?.type === 'admin';
     };

     // Fonction utilitaire pour obtenir le token courant
     const getToken = () => {
          return localStorage.getItem('token') || sessionStorage.getItem('token');
     };

     // Fonction pour mettre à jour les informations utilisateur
     const updateUserInfo = (newUserInfo) => {
          setUser(prev => ({
               ...prev,
               ...newUserInfo
          }));
     };

     if (loading) {
          return null;
     }

     const value = {
          user,
          signup,
          login,
          logout,
          isAdmin,
          getToken,
          updateUserInfo,
          isAuthenticated: !!user,
          loading
     };

     return (
          <AuthContext.Provider value={value}>
               {children}
          </AuthContext.Provider>
     );
};

export default AuthProvider;