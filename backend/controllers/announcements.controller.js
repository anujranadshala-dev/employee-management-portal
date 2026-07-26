import Announcement from '../models/announcement.model.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all announcements
// @route   GET /api/announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    let announcements = await Announcement.find({}).sort({ date: -1 });

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// @desc    Create a new announcement
// @route   POST /api/announcements
export const createAnnouncement = async (req, res) => {
  try {
    const newAnnouncement = new Announcement({
      ...req.body,
      id: `ANN-${uuidv4().split('-')[0]}`, // Generate a unique ID
      date: new Date(),
    });
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    // This will catch validation errors from the model
    res.status(400).json({ message: 'Error creating announcement', error: error.message });
  }
};
