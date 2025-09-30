import Post from '../models/Post.js';
import User from '../models/User.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, tags, visibility = 'public' } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    const postData = {
      author: userId,
      content: content.trim(),
      visibility,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };

    const post = new Post(postData);
    await post.save();

    // Populate author information
    await post.populate('author', 'name profilePic role bio');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

// Get feed posts
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts from public visibility or user's connections
    const posts = await Post.find({
      $or: [
        { visibility: 'public' },
        { author: userId }
      ]
    })
    .populate('author', 'name profilePic role bio')
    .populate('comments.user', 'name profilePic')
    .populate('likes.user', 'name')
    .populate('shares.user', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Add user interaction flags
    const postsWithInteractions = posts.map(post => {
      const postObj = post.toObject();
      postObj.isLikedByUser = post.likes.some(like => like.user._id.toString() === userId);
      postObj.isSharedByUser = post.shares.some(share => share.user._id.toString() === userId);
      return postObj;
    });

    const totalPosts = await Post.countDocuments({
      $or: [
        { visibility: 'public' },
        { author: userId }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithInteractions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasMore: skip + posts.length < totalPosts
        }
      }
    });
  } catch (error) {
    console.error('Get feed posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
};

// Like/Unlike a post
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const existingLikeIndex = post.likes.findIndex(
      like => like.user.toString() === userId
    );

    let action;
    if (existingLikeIndex > -1) {
      // Unlike the post
      post.likes.splice(existingLikeIndex, 1);
      action = 'unliked';
    } else {
      // Like the post
      post.likes.push({ user: userId });
      action = 'liked';
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: `Post ${action} successfully`,
      data: {
        action,
        likeCount: post.likes.length,
        isLiked: action === 'liked'
      }
    });
  } catch (error) {
    console.error('Toggle like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message
    });
  }
};

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = {
      user: userId,
      content: content.trim()
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.user', 'name profilePic');
    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: newComment,
        commentCount: post.comments.length
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Share a post
export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const existingShareIndex = post.shares.findIndex(
      share => share.user.toString() === userId
    );

    if (existingShareIndex > -1) {
      return res.status(400).json({
        success: false,
        message: 'Post already shared'
      });
    }

    post.shares.push({ user: userId });
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post shared successfully',
      data: {
        shareCount: post.shares.length
      }
    });
  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share post',
      error: error.message
    });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId)
      .populate('author', 'name profilePic role bio')
      .populate('comments.user', 'name profilePic')
      .populate('likes.user', 'name')
      .populate('shares.user', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const postObj = post.toObject();
    postObj.isLikedByUser = post.likes.some(like => like.user._id.toString() === userId);
    postObj.isSharedByUser = post.shares.some(share => share.user._id.toString() === userId);

    res.status(200).json({
      success: true,
      data: postObj
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: userId })
      .populate('author', 'name profilePic role bio')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const postsWithInteractions = posts.map(post => {
      const postObj = post.toObject();
      postObj.isLikedByUser = post.likes.some(like => like.user.toString() === currentUserId);
      postObj.isSharedByUser = post.shares.some(share => share.user.toString() === currentUserId);
      return postObj;
    });

    const totalPosts = await Post.countDocuments({ author: userId });

    res.status(200).json({
      success: true,
      data: {
        posts: postsWithInteractions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasMore: skip + posts.length < totalPosts
        }
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user posts',
      error: error.message
    });
  }
};