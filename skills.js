const express = require('express');
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: {
        values: ['Frontend', 'Backend', 'Tools', 'SoftSkills'],
        message: '{VALUE} is not a valid category'
      },
      default: 'Frontend'
    },
    icon: {
      type: String,
      default: '',
      trim: true
    },
    percent: {
      type: Number,
      min: [0, 'Percent must be at least 0'],
      max: [100, 'Percent cannot exceed 100'],
      default: 80
    },
    highlights: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Skill = mongoose.model('Skill', skillSchema);

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: skills.length,
      data: skills
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: skill
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
        message: 'Invalid skill ID format'
      });
    }

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: skill
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
        message: 'Invalid skill ID format'
      });
    }

    const existingSkill = await Skill.findById(id);
    if (!existingSkill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    const updatedSkill = await Skill.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      status: 'success',
      data: updatedSkill
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
        message: 'Invalid skill ID format'
      });
    }

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    await Skill.findByIdAndDelete(id);

    return res.status(200).json({
      status: 'success',
      message: 'Skill deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

router.Skill = Skill;

module.exports = router;
