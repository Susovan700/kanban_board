import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "My Kanban Board",
  },
  columns: [
    {
      title: {
        type: String,
        required: true,
        default: "To Do",
      },
      id: {
        type: String,
        required: true,
        default: "column-1",
      },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Board", BoardSchema);