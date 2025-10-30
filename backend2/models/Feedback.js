const mongoose = require('mongoose');

const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    class: { type: String },
    section: { type: String },
    subject: { type: String },
    q1: { type: String },
    q2: { type: String },
    message: { type: String },
    // allow storing any extra fields if provided
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false }, strict: false }
);

module.exports = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
