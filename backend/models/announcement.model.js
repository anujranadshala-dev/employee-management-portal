import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  id: { type: String, required: true, unique: true }, // Added for consistency with frontend
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;