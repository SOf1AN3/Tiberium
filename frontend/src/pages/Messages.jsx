import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import notificationSound from '../assets/notification.wav';
import '../styles/messages.css';

const Messages = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [socket, setSocket] = useState(null);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [users, setUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);
   const [unreadMessages, setUnreadMessages] = useState({});
   const [processedMessages, setProcessedMessages] = useState(new Set());
   const messagesEndRef = useRef(null);
   const audioRef = useRef(new Audio(notificationSound));

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   useEffect(() => {
      if (!user) return;

      const apiUrl = 'http://localhost:5000';
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const newSocket = io(apiUrl, {
         auth: { token }
      });

      newSocket.on('connect', () => {
         console.log('Connected to socket');
      });

      newSocket.on('error', (error) => {
         console.error('Socket error:', error);
      });

      newSocket.on('receiveMessage', (message) => {
         const messageId = message._id || `${message.senderId}-${message.timestamp}`;

         if (processedMessages.has(messageId)) {
            return;
         }

         setProcessedMessages(prev => new Set([...prev, messageId]));

         setMessages(prev => {
            const isDuplicate = prev.some(m =>
               (m._id === message._id) ||
               (m.content === message.content &&
                  m.timestamp === message.timestamp &&
                  m.senderId === message.senderId)
            );

            if (isDuplicate) return prev;

            const senderId = typeof message.senderId === 'object'
               ? message.senderId._id
               : message.senderId;

            if (senderId !== user._id) {
               audioRef.current.play().catch(err => console.error('Error playing sound:', err));
               if (!selectedUser || selectedUser._id !== senderId) {
                  setUnreadMessages(prev => ({
                     ...prev,
                     [senderId]: (prev[senderId] || 0) + 1
                  }));
               }
            }

            return [...prev, message];
         });
      });

      setSocket(newSocket);

      return () => newSocket.close();
   }, [user, selectedUser, processedMessages]);

   useEffect(() => {
      if (user) {
         loadUsers();
      }
   }, [user]);

   useEffect(() => {
      if (selectedUser) {
         loadMessages();
         setUnreadMessages(prev => ({
            ...prev,
            [selectedUser._id]: 0
         }));
      }
   }, [selectedUser]);

   const loadUsers = async () => {
      try {
         const token = localStorage.getItem('token') || sessionStorage.getItem('token');
         const response = await fetch('http://localhost:5000/auth/users', {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         if (response.ok) {
            const data = await response.json();
            const filteredUsers = user.type === 'admin'
               ? data.users
               : data.users.filter(u => u.type === 'admin');
            setUsers(filteredUsers);
         }
      } catch (error) {
         console.error('Error loading users:', error);
      }
   };

   const loadMessages = async () => {
      if (!selectedUser?._id) return;

      try {
         const token = localStorage.getItem('token') || sessionStorage.getItem('token');
         const response = await fetch(`http://localhost:5000/messages/history/${selectedUser._id}`, {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });

         if (response.ok) {
            const data = await response.json();
            setMessages(data);
         }
      } catch (error) {
         console.error('Error loading messages:', error);
      }
   };

   const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !selectedUser || !socket) return;

      try {
         const messageData = {
            receiverId: selectedUser._id,
            content: newMessage
         };

         socket.emit('sendMessage', messageData);
         setNewMessage('');
      } catch (error) {
         console.error('Error sending message:', error);
      }
   };

   const formatMessageDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   };

   const getMessageClass = (message) => {
      const senderId = typeof message.senderId === 'object'
         ? message.senderId._id
         : message.senderId;
      return senderId === user._id ? 'sent' : 'received';
   };

   return (
      <div className="messages-container">
         <div className="users-list">
            <div className="users-header">
               <h3>Users</h3>
               <button className="home-button" onClick={() => navigate('/')}>
                  Home
               </button>
            </div>
            {users.map((u) => (
               <div
                  key={u._id}
                  className={`user-item ${selectedUser?._id === u._id ? 'selected' : ''}`}
                  onClick={() => setSelectedUser(u)}
               >
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                     {u.name} {u.type === 'admin' ? '(Admin)' : ''}
                     {unreadMessages[u._id] > 0 && (
                        <span className="unread-badge">
                           {unreadMessages[u._id] / 2}
                        </span>
                     )}
                  </div>
               </div>
            ))}
         </div>

         <div className="chat-section">
            {selectedUser ? (
               <>
                  <div className="chat-header">
                     <h3>Chat with {selectedUser.name}</h3>
                  </div>
                  <div className="messages-display">
                     {messages.length === 0 ? (
                        <div className="no-messages">No messages yet</div>
                     ) : (
                        messages.map((message, index) => (
                           <div
                              key={index}
                              className={`message ${getMessageClass(message)}`}
                           >
                              <div className="message-content">{message.content}</div>
                              <div className="message-timestamp">
                                 {formatMessageDate(message.timestamp)}
                              </div>
                           </div>
                        ))
                     )}
                     <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="message-form">
                     <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="message-input"
                        placeholder="Type your message..."
                     />
                     <button type="submit" className="send-button">Send</button>
                  </form>
               </>
            ) : (
               <div className="no-user-selected">
                  Select a user to start chatting
               </div>
            )}
         </div>
      </div>
   );
};

export default Messages;