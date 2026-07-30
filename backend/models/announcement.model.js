import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  important: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;