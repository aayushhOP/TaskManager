import express from 'express';
import Task, { STAGES } from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, stage } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (stage && !STAGES.includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage.' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      stage: stage || 'todo',
      user: req.user._id,
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ task });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { title, description, stage } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (!title?.trim()) {
        return res.status(400).json({ message: 'Title cannot be empty.' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (stage !== undefined) {
      if (!STAGES.includes(stage)) {
        return res.status(400).json({ message: 'Invalid stage.' });
      }
      updates.stage = stage;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
