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
          required: true,
          minlength: 1,
          maxlength: 1000,
          trim: true
     },
     timestamp: {
          type: Date,
          default: Date.now
     },
     seen: {
          type: Boolean,
          default: false
     }
});

// Index pour optimiser les requêtes de conversation
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: 1 });
messageSchema.index({ receiverId: 1, seen: 1 });

module.exports = mongoose.model('Message', messageSchema);