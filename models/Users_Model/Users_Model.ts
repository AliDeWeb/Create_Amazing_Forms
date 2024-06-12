import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "phone number is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "password should have 8 char at leaset"],
  },
  confirmPassword: {
    type: String,
  },
  profileImg: {
    type: String,
  },
});

const usersModel = mongoose.model(`Users`, usersSchema);

export default usersModel;
