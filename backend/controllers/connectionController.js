import Connection from '../models/Connection.js';
import User from '../models/User.js';

// Send connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { message = '' } = req.body;
    const requesterId = req.user.id;

    if (requesterId === recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself'
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingConnection) {
      let message = 'Connection already exists';
      if (existingConnection.status === 'pending') {
        message = 'Connection request already sent';
      } else if (existingConnection.status === 'accepted') {
        message = 'Already connected';
      } else if (existingConnection.status === 'declined') {
        message = 'Connection request was declined';
      }
      
      return res.status(400).json({
        success: false,
        message
      });
    }

    const connection = new Connection({
      requester: requesterId,
      recipient: recipientId,
      message: message.trim()
    });

    await connection.save();
    await connection.populate('requester', 'name profilePic role bio');
    await connection.populate('recipient', 'name profilePic role bio');

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send connection request',
      error: error.message
    });
  }
};

// Respond to connection request (accept/decline)
export const respondToConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body; // 'accept' or 'decline'
    const userId = req.user.id;

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "accept" or "decline"'
      });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    // Check if user is the recipient
    if (connection.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this request'
      });
    }

    // Check if request is still pending
    if (connection.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Connection request is no longer pending'
      });
    }

    connection.status = action === 'accept' ? 'accepted' : 'declined';
    await connection.save();

    await connection.populate('requester', 'name profilePic role bio');
    await connection.populate('recipient', 'name profilePic role bio');

    res.status(200).json({
      success: true,
      message: `Connection request ${action}ed successfully`,
      data: connection
    });
  } catch (error) {
    console.error('Respond to connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to connection request',
      error: error.message
    });
  }
};

// Get connection requests (received)
export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await Connection.find({
      recipient: userId,
      status: 'pending'
    })
    .populate('requester', 'name profilePic role bio')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Add mutual connections count
    const requestsWithMutuals = await Promise.all(
      requests.map(async (request) => {
        const mutualConnections = await Connection.getMutualConnections(
          userId,
          request.requester._id
        );
        
        const requestObj = request.toObject();
        requestObj.mutualConnections = mutualConnections.length;
        return requestObj;
      })
    );

    const totalRequests = await Connection.countDocuments({
      recipient: userId,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      data: {
        requests: requestsWithMutuals,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalRequests / limit),
          totalRequests,
          hasMore: skip + requests.length < totalRequests
        }
      }
    });
  } catch (error) {
    console.error('Get connection requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connection requests',
      error: error.message
    });
  }
};

// Get user's connections
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { 'bio': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const connections = await Connection.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
    .populate({
      path: 'requester',
      select: 'name profilePic role bio',
      match: userId.toString() !== userId ? searchQuery : null
    })
    .populate({
      path: 'recipient',
      select: 'name profilePic role bio',
      match: userId.toString() !== userId ? searchQuery : null
    })
    .sort({ acceptedAt: -1 })
    .skip(skip)
    .limit(limit);

    // Format connections to show the other user
    const formattedConnections = connections
      .filter(conn => conn.requester && conn.recipient) // Filter out null populated fields
      .map(conn => {
        const otherUser = conn.requester._id.toString() === userId ? conn.recipient : conn.requester;
        return {
          _id: conn._id,
          user: otherUser,
          connectedAt: conn.acceptedAt,
          status: 'Active now' // This could be enhanced with real online status
        };
      });

    const totalConnections = await Connection.countDocuments({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        connections: formattedConnections,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalConnections / limit),
          totalConnections,
          hasMore: skip + formattedConnections.length < totalConnections
        }
      }
    });
  } catch (error) {
    console.error('Get user connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connections',
      error: error.message
    });
  }
};

// Get connection suggestions
export const getConnectionSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user's existing connections
    const existingConnections = await Connection.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    }).select('requester recipient');

    const connectedUserIds = existingConnections.map(conn => 
      conn.requester.toString() === userId ? conn.recipient : conn.requester
    );
    connectedUserIds.push(userId); // Exclude self

    // Find users not connected to current user
    const suggestions = await User.find({
      _id: { $nin: connectedUserIds }
    })
    .select('name profilePic role bio')
    .limit(limit)
    .skip(skip);

    // Add mutual connections and reasons for each suggestion
    const suggestionsWithDetails = await Promise.all(
      suggestions.map(async (user) => {
        const mutualConnections = await Connection.getMutualConnections(userId, user._id);
        
        let reason = 'Similar background';
        if (mutualConnections.length > 0) {
          reason = `You both know ${mutualConnections.length} mutual connection${mutualConnections.length > 1 ? 's' : ''}`;
        }

        return {
          ...user.toObject(),
          mutualConnections: mutualConnections.length,
          reason
        };
      })
    );

    const totalSuggestions = await User.countDocuments({
      _id: { $nin: connectedUserIds }
    });

    res.status(200).json({
      success: true,
      data: {
        suggestions: suggestionsWithDetails,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalSuggestions / limit),
          totalSuggestions,
          hasMore: skip + suggestions.length < totalSuggestions
        }
      }
    });
  } catch (error) {
    console.error('Get connection suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connection suggestions',
      error: error.message
    });
  }
};

// Get network statistics
export const getNetworkStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's existing connections (including all statuses)
    const existingConnections = await Connection.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    }).select('requester recipient status');

    const connectedUserIds = existingConnections.map(conn => 
      conn.requester.toString() === userId ? conn.recipient : conn.requester
    );
    connectedUserIds.push(userId); // Exclude self

    const [connectionsCount, pendingRequestsCount, suggestionsCount] = await Promise.all([
      Connection.countDocuments({
        $or: [
          { requester: userId, status: 'accepted' },
          { recipient: userId, status: 'accepted' }
        ]
      }),
      Connection.countDocuments({
        recipient: userId,
        status: 'pending'
      }),
      User.countDocuments({
        _id: { $nin: connectedUserIds } // Use same logic as getConnectionSuggestions
      })
    ]);

    console.log('Network stats for user', userId, ':', {
      connections: connectionsCount,
      pendingRequests: pendingRequestsCount,
      suggestions: suggestionsCount,
      excludedUsers: connectedUserIds.length
    });

    res.status(200).json({
      success: true,
      data: {
        connections: connectionsCount,
        pendingRequests: pendingRequestsCount,
        suggestions: suggestionsCount
      }
    });
  } catch (error) {
    console.error('Get network stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch network statistics',
      error: error.message
    });
  }
};

// Remove connection
export const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Check if user is part of this connection
    if (connection.requester.toString() !== userId && connection.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove this connection'
      });
    }

    await Connection.findByIdAndDelete(connectionId);

    res.status(200).json({
      success: true,
      message: 'Connection removed successfully'
    });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove connection',
      error: error.message
    });
  }
};