import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    dateOfJoining: {
      type: Date,
      required: [true, 'Date of joining is required']
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'On Leave', 'Inactive'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

// Add index on name, email, department for search queries
employeeSchema.index({ name: 'text', email: 'text', department: 'text' });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
