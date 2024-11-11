import { model, Schema } from "mongoose";
const ReelSchema = new Schema(
  {
    title: {
      type: "string",
      required: [true, "title is required.."],
      minlength: [5, "title is most be 5 char"],
      trim: true,
    },
    description: {
      type: "string",
      required: [true, "title is required.."],
      minlength: [5, "title is most be 5 char"],
      trim: true,
    },
    Reel: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);
const Reel = model("Reel", ReelSchema);
export default Reel;
