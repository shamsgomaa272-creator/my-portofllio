const express = require('express');
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    availability: {
      type: String,
      enum: {
        values: ['ONLINE', 'BUSY', 'OFFLINE'],
        message: '{VALUE} is not a valid availability status'
      },
      default: 'ONLINE'
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    tagline: {
      type: String,
      trim: true,
      default: ''
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email address'
      ]
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    github: {
      type: String,
      trim: true,
      default: ''
    },
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
    cv: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model('Profile', profileSchema);

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    return res.status(200).json({
      status: 'success',
      data: profile || null
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      return res.status(400).json({
        status: 'error',
        message: 'Profile already exists. Use PUT /api/profile to update.'
      });
    }

    const profile = await Profile.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: profile
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

router.put('/', async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(updateData);
      return res.status(200).json({
        status: 'success',
        data: profile
      });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      status: 'success',
      data: updatedProfile
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

router.Profile = Profile;

module.exports = router;
