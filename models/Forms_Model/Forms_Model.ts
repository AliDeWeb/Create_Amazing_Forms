import mongoose from "mongoose";
const { Schema } = mongoose;

const formsSchema = new Schema(
  {
    data: [
      {
        question: {
          type: String,
          required: [true, "متن سوال را وارد نمایید."],
        },
        options: [
          {
            value: {
              type: Schema.Types.Mixed,
              validate: {
                validator: function (value: string | number | boolean) {
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
          },
        ],
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  },
);

const formsModel = mongoose.model(`Forms`, formsSchema);

export default formsModel;
