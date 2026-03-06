import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "New Task",
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      default: "To Do",
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Task", TaskSchema);
