import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  massageType: {
    type: String,
    required: true
  },
  sessionTime: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);