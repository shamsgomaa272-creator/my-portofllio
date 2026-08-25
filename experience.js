const express = require('express');
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Experience title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: String,
      required: [true, 'Date string is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    icon: {
      type: String,
      trim: true,
      default: ''
    },
    type: {
      type: String,
      enum: {
        values: ['Experience', 'Education', 'Learning'],
        message: '{VALUE} is not a valid experience type'
      },
      default: 'Experience'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Experience = mongoose.model('Experience', experienceSchema);

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: experience
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

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid experience ID format'
      });
    }

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: experience
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
        message: 'Invalid experience ID format'
      });
    }

    const existingExperience = await Experience.findById(id);
    if (!existingExperience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    const updatedExperience = await Experience.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      status: 'success',
      data: updatedExperience
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
        message: 'Invalid experience ID format'
      });
    }

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found'
      });
    }

    await Experience.findByIdAndDelete(id);

    return res.status(200).json({
      status: 'success',
      message: 'Experience deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

router.Experience = Experience;

module.exports = router;
