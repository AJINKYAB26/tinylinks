const mongoose = require('mongoose');
const { isURL } = require('validator');

const LinkSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    match: /^[A-Za-z0-9]{6,8}$/
  },
  target: {
    type: String,
    required: true,
    validate: {
      validator: v => isURL(v, { require_protocol: true }),
      message: props => `${props.value} is not a valid URL (must include protocol, e.g., http:// or https://)`
    }
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastClickedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique index
LinkSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('Link', LinkSchema);
