import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  pic: {
    type: String,
    set: (value: string) => {
      if (!value || value.trim() === "") {
        return "https://firebasestorage.googleapis.com/v0/b/med-ease-00012256.appspot.com/o/default.jpg?alt=media&token=966ca7ed-bc8f-47f4-baca-7a7b4e7bcda3";
      }
      return value;
    },
  },
  status: {
    type: String,
    default: "pending",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  mobile: {
    type: Number,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  address: {
    type: String,
  },
});

const User = model("User", userSchema);

export default User;
