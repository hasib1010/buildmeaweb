// src/models/Order.js
import mongoose from 'mongoose';

const TimelineEventSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['pending', 'requirements', 'design', 'development', 'revision', 'completed', 'cancelled']
  },
  date: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: true
  }
});

const DeliveredFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'other',
    enum: ['design', 'code', 'image', 'document', 'other']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    plan: {
      type: String,
      required: true,
      enum: ['starter', 'growth', 'elite']
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'requirements', 'design', 'development', 'revision', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentIntentId: {
      type: String
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer', 'other'],
      default: 'card'
    },
    requirements: {
      websiteName: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      requiredPages: {
        type: String,
        default: ''
      },
      preferredColors: {
        type: String,
        default: ''
      },
      references: {
        type: String,
        default: ''
      },
      contactInfo: {
        name: String,
        email: String,
        phone: String
      }
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    timeline: [TimelineEventSchema],
    estimatedDeliveryDate: {
      type: Date
    },
    deliveredFiles: [DeliveredFileSchema],
    adminNotes: {
      type: String,
      default: ''
    },
    websiteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website'
    }
  },
  { timestamps: true }
);

// Add initial timeline event on order creation
OrderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.timeline = [{
      status: 'pending',
      date: new Date(),
      message: 'Order received'
    }];
  }
  next();
});

// Update timeline when status changes
OrderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    const statusMessages = {
      'requirements': 'Gathering requirements',
      'design': 'Design phase started',
      'development': 'Development phase started',
      'revision': 'Revisions in progress',
      'completed': 'Website completed',
      'cancelled': 'Order cancelled'
    };
    
    // Only add to timeline if we have a default message for this status
    if (statusMessages[this.status]) {
      this.timeline.push({
        status: this.status,
        date: new Date(),
        message: statusMessages[this.status]
      });
    }
    
    // Update progress based on status
    const progressMap = {
      'pending': 5,
      'requirements': 20,
      'design': 40,
      'development': 60,
      'revision': 80,
      'completed': 100,
      'cancelled': this.progress // Keep current progress if cancelled
    };
    
    if (progressMap[this.status] !== undefined) {
      this.progress = progressMap[this.status];
    }
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);