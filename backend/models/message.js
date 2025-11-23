const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
     senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     content: {
          type: String,
          required: true
     },
     timestamp: {
          type: Date,
          default: Date.now
     }
});

module.exports = mongoose.model('Message', messageSchema);

// Supprimer tous les index existants
messageSchema.indexes().forEach(index => {
     messageSchema.index(index.fields, { unique: false });
});

const Message = mongoose.model('Message', messageSchema);

// Supprimer l'index email s'il existe
Message.collection.dropIndex('email_1').catch(err => {
     // Ignorer l'erreur si l'index n'existe pas
     if (err.code !== 27) {
          console.error('Erreur lors de la suppression de l\'index:', err);
     }
});

module.exports = Message;