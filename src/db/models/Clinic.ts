import { Schema, model } from "mongoose";

const clinicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  workingDays: {
    type: [Number],
    required: true,
  },
  openingHour: {
    type: String,
    required: true,
  },
  closingHour: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctors: [{
    type: Schema.Types.ObjectId,
    ref: "Doctor"
  }]
});

const Clinic = model("Clinic", clinicSchema);

export default Clinic;