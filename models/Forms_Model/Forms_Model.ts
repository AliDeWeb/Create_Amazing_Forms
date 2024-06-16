import mongoose from "mongoose";
const { Schema } = mongoose;

// Interface for schema
interface Option {
  value: string | number | boolean;
  isTrue?: boolean;
}
interface Question {
  question: string;
  options: Option[];
}
interface Form {
  data: Question[];
  user: mongoose.Types.ObjectId;
}
interface FormDocument extends Document, Form {}

const optionSchema = new Schema<Option>({
  value: {
    type: Schema.Types.Mixed,
    validate: {
      validator: function (value: any) {
        return (
          typeof value === "boolean" ||
          typeof value === "string" ||
          typeof value === "number"
        );
      },
      message: "گزینه ها را به درستی وارد نمایید!",
    },
  },
  isTrue: Boolean,
});

const questionSchema = new Schema<Question>({
  question: {
    type: String,
    required: [true, "متن سوال را وارد نمایید."],
  },
  options: [optionSchema],
});

const formsSchema = new Schema<FormDocument>(
  {
    data: [questionSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  },
);

formsSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate({
    path: "user",
    select: "-__v -createdAt -updatedAt",
  });

  next();
});

const formsModel = mongoose.model<FormDocument>(`Forms`, formsSchema);

export default formsModel;
