// src/models/Website.js
import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  isHomePage: {
    type: Boolean,
    default: false
  },
  content: {
    type: Object,
    default: {}
  },
  seo: {
    title: String,
    description: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const WebsiteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a website name'],
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    template: {
      type: String,
      required: true,
      enum: ['Personal', 'Business', 'E-commerce', 'Portfolio', 'Blog', 'Custom']
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    domain: {
      type: String
    },
    customDomain: {
      type: String
    },
    subdomain: {
      type: String,
      unique: true,
      sparse: true
    },
    pages: [PageSchema],
    settings: {
      colors: {
        primary: {
          type: String,
          default: '#3B82F6' // Default blue color
        },
        secondary: {
          type: String,
          default: '#6B7280' // Default gray color
        },
        accent: {
          type: String,
          default: '#8B5CF6' // Default purple color
        },
        text: {
          type: String,
          default: '#1F2937' // Default dark text
        },
        background: {
          type: String,
          default: '#FFFFFF' // Default white background
        }
      },
      fonts: {
        heading: {
          type: String,
          default: 'Inter'
        },
        body: {
          type: String,
          default: 'Inter'
        }
      },
      logo: {
        url: String,
        width: Number,
        height: Number
      },
      favicon: String,
      analytics: {
        googleAnalyticsId: String,
        facebookPixelId: String
      }
    },
    thumbnail: {
      type: String
    },
    isCreatedByOrder: {
      type: Boolean,
      default: false
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  },
  { timestamps: true }
);

// Create a default home page when a new website is created
WebsiteSchema.pre('save', function(next) {
  if (this.isNew && this.pages.length === 0) {
    this.pages.push({
      title: 'Home',
      slug: 'home',
      isHomePage: true,
      content: {
        sections: []
      },
      seo: {
        title: this.name,
        description: `Welcome to ${this.name}`,
        keywords: ''
      }
    });
  }
  next();
});

// Generate thumbnail URL if it doesn't exist
WebsiteSchema.pre('save', function(next) {
  if (!this.thumbnail) {
    // In a real app, you might generate a real thumbnail
    this.thumbnail = `/api/website-thumbnail/${this._id}`;
  }
  next();
});

export default mongoose.models.Website || mongoose.model('Website', WebsiteSchema);