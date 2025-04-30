// src/models/Meeting.js
import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a meeting title'],
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    date: {
      type: Date,
      required: [true, 'Please provide a meeting date and time']
    },
    duration: {
      type: Number,
      required: [true, 'Please provide meeting duration'],
      min: [15, 'Meeting must be at least 15 minutes'],
      max: [180, 'Meeting cannot be more than 180 minutes']
    },
    developer: {
      type: String,
      default: 'Assigned Developer'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    type: {
      type: String,
      enum: ['discovery', 'design-review', 'progress-update', 'technical', 'other'],
      default: 'other'
    },
    notes: {
      type: String,
      default: ''
    },
    meetingUrl: {
      type: String
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    relatedWebsite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website'
    }
  },
  { timestamps: true }
);

// Generate meeting URL before saving if it doesn't exist
MeetingSchema.pre('save', function(next) {
  if (!this.meetingUrl && this.status === 'scheduled') {
    // In a real application, you would integrate with a video conferencing API
    // This is a placeholder for demonstration
    this.meetingUrl = `https://meet.yourplatform.com/${this._id}`;
  }
  next();
});

export default mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema);