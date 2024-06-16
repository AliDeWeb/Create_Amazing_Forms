import mongoose from "mongoose";

const { Schema } = mongoose;

const responsesSchema = new Schema({
  value: {
    type: String,
    required: [true, "لطفا پاسخ را وارد نمایید!"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Forms",
    required: [true, "شناسه سوال را وارد نمایید!"],
  },
  form: {
    type: Schema.Types.ObjectId,
    required: [true, "شناسه فرم را وارد نمایید!"],
  },
});

const responsesModel = mongoose.model("Responses", responsesSchema);

export default responsesModel;
