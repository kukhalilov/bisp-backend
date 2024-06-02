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
  experience: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
});

const Doctor = model("Doctor", doctorSchema);

export default Doctor;
