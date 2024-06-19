import { Schema, model } from "mongoose";

const doctorSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  experience: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  clinic: {
    type: Schema.Types.ObjectId,
    ref: "Clinic",
  },
  location: {
    type: String,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  appointments: [
    {
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      }
    },
  ],
});

const Doctor = model("Doctor", doctorSchema);

export default Doctor;
