import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [300, 'Connection message cannot exceed 300 characters'],
    default: ''
  },
  acceptedAt: {
    type: Date
  },
  declinedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate connection requests
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Index for better query performance
connectionSchema.index({ recipient: 1, status: 1 });
connectionSchema.index({ requester: 1, status: 1 });

// Pre-save middleware to set accepted/declined timestamps
connectionSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'accepted' && !this.acceptedAt) {
      this.acceptedAt = new Date();
    } else if (this.status === 'declined' && !this.declinedAt) {
      this.declinedAt = new Date();
    }
  }
  next();
});

// Static method to check if users are connected
connectionSchema.statics.areConnected = async function(userId1, userId2) {
  console.log('Checking connection between users:', { userId1, userId2 });
  
  const connection = await this.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: 'accepted' },
      { requester: userId2, recipient: userId1, status: 'accepted' }
    ]
  });
  
  console.log('Connection found:', connection);
  return !!connection;
};

// Static method to get mutual connections
connectionSchema.statics.getMutualConnections = async function(userId1, userId2) {
  const user1Connections = await this.find({
    $or: [
      { requester: userId1, status: 'accepted' },
      { recipient: userId1, status: 'accepted' }
    ]
  });

  const user1ConnectedUsers = user1Connections.map(conn => 
    conn.requester.toString() === userId1 ? conn.recipient : conn.requester
  );

  const user2Connections = await this.find({
    $or: [
      { requester: userId2, status: 'accepted' },
      { recipient: userId2, status: 'accepted' }
    ]
  });

  const user2ConnectedUsers = user2Connections.map(conn => 
    conn.requester.toString() === userId2 ? conn.recipient : conn.requester
  );

  // Find mutual connections
  const mutualConnectionIds = user1ConnectedUsers.filter(id =>
    user2ConnectedUsers.some(userId => userId.toString() === id.toString())
  );

  return mutualConnectionIds;
};

const Connection = mongoose.model('Connection', connectionSchema);

export default Connection;