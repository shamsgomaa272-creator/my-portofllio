const express = require('express');
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    category: {
      type: String,
      trim: true,
      default: 'Web App'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    techStack: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      trim: true,
      default: ''
    },
    demoUrl: {
      type: String,
      trim: true,
      default: '#'
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '#'
    },
    status: {
      type: String,
      enum: {
        values: ['Completed', 'In Progress'],
        message: '{VALUE} is not a valid status option'
      },
      default: 'Completed'
    },
    featured: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

const stripHtml = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/<[^>]*>?/gm, '').trim();
};

const sanitizeProjectBody = (body) => {
  const sanitized = { ...body };
  if (sanitized.title) sanitized.title = stripHtml(sanitized.title);
  if (sanitized.category) sanitized.category = stripHtml(sanitized.category);
  if (sanitized.description) sanitized.description = stripHtml(sanitized.description);
  if (sanitized.image) sanitized.image = stripHtml(sanitized.image);
  if (sanitized.demoUrl) sanitized.demoUrl = stripHtml(sanitized.demoUrl);
  if (sanitized.githubUrl) sanitized.githubUrl = stripHtml(sanitized.githubUrl);
  if (Array.isArray(sanitized.techStack)) {
    sanitized.techStack = sanitized.techStack.map((tech) => stripHtml(tech));
  }
  return sanitized;
};

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: 'success',
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const sanitizedBody = sanitizeProjectBody(req.body);
    const project = await Project.create(sanitizedBody);

    return res.status(201).json({
      status: 'success',
      data: project
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
        message: 'Invalid project ID format'
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: project
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
        message: 'Invalid project ID format'
      });
    }

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    const sanitizedBody = sanitizeProjectBody(req.body);
    delete sanitizedBody._id;
    delete sanitizedBody.createdAt;
    delete sanitizedBody.updatedAt;
    delete sanitizedBody.__v;

    const updatedProject = await Project.findByIdAndUpdate(id, sanitizedBody, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      status: 'success',
      data: updatedProject
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
        message: 'Invalid project ID format'
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
});

router.Project = Project;

module.exports = router;
