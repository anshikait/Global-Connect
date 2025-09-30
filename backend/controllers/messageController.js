import { Conversation, Message } from '../models/Message.js';
import User from '../models/User.js';
import Connection from '../models/Connection.js';

// Get user's conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name profilePic role')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    })
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(limit);

    // Format conversations to show other participant info
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== userId);
      const convObj = conv.toObject();
      
      // Check if last message is unread by current user
      const isUnread = conv.lastMessage && 
        conv.lastMessage.sender._id.toString() !== userId &&
        !conv.lastMessage.readBy.some(read => read.user.toString() === userId);

      return {
        ...convObj,
        otherParticipant,
        unread: isUnread
      };
    });

    const totalConversations = await Conversation.countDocuments({
      participants: userId
    });

    res.status(200).json({
      success: true,
      data: {
        conversations: formattedConversations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalConversations / limit),
          totalConversations,
          hasMore: skip + conversations.length < totalConversations
        }
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

// Get or create conversation
export const getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.params;
    const userId = req.user.id;

    console.log('Get/Create conversation request:', { userId, participantId });

    if (userId === participantId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }

    // Check if users are connected
    const areConnected = await Connection.areConnected(userId, participantId);
    console.log('Users connected check:', { userId, participantId, areConnected });
    
    if (!areConnected) {
      return res.status(403).json({
        success: false,
        message: 'You can only message your connections. Please send a connection request first.'
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId], $size: 2 },
      isGroup: false
    })
    .populate('participants', 'name profilePic role')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [userId, participantId],
        isGroup: false
      });
      await conversation.save();
      await conversation.populate('participants', 'name profilePic role');
    }

    const otherParticipant = conversation.participants.find(p => p._id.toString() !== userId);

    res.status(200).json({
      success: true,
      data: {
        ...conversation.toObject(),
        otherParticipant
      }
    });
  } catch (error) {
    console.error('Get or create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get or create conversation',
      error: error.message
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation'
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false
    })
    .populate('sender', 'name profilePic')
    .populate('replyTo', 'content sender')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      },
      {
        $push: {
          readBy: {
            user: userId,
            readAt: new Date()
          }
        }
      }
    );

    const totalMessages = await Message.countDocuments({
      conversation: conversationId,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasMore: skip + messages.length < totalMessages
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, messageType = 'text', replyTo } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Check if user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message to this conversation'
      });
    }

    const message = new Message({
      conversation: conversationId,
      sender: userId,
      content: content.trim(),
      messageType,
      replyTo: replyTo || null,
      readBy: [{ user: userId }] // Mark as read by sender
    });

    await message.save();
    await message.populate('sender', 'name profilePic');
    
    if (replyTo) {
      await message.populate('replyTo', 'content sender');
    }

    // Emit socket event for real-time messaging
    const io = req.app.get('io');
    if (io) {
      conversation.participants.forEach(participantId => {
        if (participantId.toString() !== userId) {
          io.to(`user_${participantId}`).emit('new_message', {
            message,
            conversationId
          });
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Edit message
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this message'
      });
    }

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    await message.populate('sender', 'name profilePic');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      const conversation = await Conversation.findById(message.conversation);
      conversation.participants.forEach(participantId => {
        io.to(`user_${participantId}`).emit('message_edited', {
          message,
          conversationId: message.conversation
        });
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit message',
      error: error.message
    });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = 'This message has been deleted';
    await message.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      const conversation = await Conversation.findById(message.conversation);
      conversation.participants.forEach(participantId => {
        io.to(`user_${participantId}`).emit('message_deleted', {
          messageId,
          conversationId: message.conversation
        });
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      },
      {
        $push: {
          readBy: {
            user: userId,
            readAt: new Date()
          }
        }
      }
    );

    // Emit socket event for message read
    const io = req.app.get('io');
    if (io) {
      io.to(userId.toString()).emit('messageRead', {
        conversationId,
        userId
      });
    }

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all conversations where user is participant
    const conversations = await Conversation.find({
      participants: userId
    }).populate('lastMessage');

    let totalUnreadCount = 0;

    // Count unread messages in each conversation
    for (const conv of conversations) {
      if (conv.lastMessage && 
          conv.lastMessage.sender.toString() !== userId.toString() &&
          !conv.lastMessage.readBy.some(read => read.user.toString() === userId.toString())) {
        
        // Count all unread messages in this conversation
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: userId },
          'readBy.user': { $ne: userId }
        });
        
        totalUnreadCount += unreadCount;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        unreadCount: totalUnreadCount
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};