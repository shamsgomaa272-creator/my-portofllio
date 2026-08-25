const express = require('express');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ]
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Inquiry'
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, message, subject } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Message content is required'
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    return res.status(201).json({
      status: 'success',
      data: newMessage
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message ID format'
      });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message ID format'
      });
    }

    const existingMessage = await Message.findById(id);
    if (!existingMessage) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    const updatedMessage = await Message.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      status: 'success',
      data: updatedMessage
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message ID format'
      });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    await Message.findByIdAndDelete(id);

    return res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

router.Message = Message;

module.exports = router;
