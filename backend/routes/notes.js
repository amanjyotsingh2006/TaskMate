const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// GET /api/notes - get all notes for current user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/notes - create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title is required' });

    const note = new Note({ title, content, user: req.user.id });
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/notes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/notes/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await note.remove();
    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
