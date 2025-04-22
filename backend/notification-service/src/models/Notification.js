import mongoose from 'mongoose';

const { Schema } = mongoose;

const payloadSchema = new Schema({
  title:   { type: String, required: true },
  message: { type: String, required: true },
  link:    { type: String }
}, { _id: false });

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['email', 'sms', 'in-app'], required: true },
  payload:   { type: payloadSchema, required: true },
  isRead:    { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
