import BoardModel from "../Models/BoardModel.js"; // Use the correct Model name

// Get the existing board layout
export const getBoard = async (req, res) => {
  try {
    const board = await BoardModel.findOne();
    if (!board) {
      return res.status(404).json({ message: "No board found." });
    }
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: "Error fetching board", error: error.message });
  }
};

// Setup the board if it's the first time running
export const createInitialBoard = async () => {
  try {
    const boardExists = await BoardModel.findOne();
    if (!boardExists) {
      const newBoard = new BoardModel({
        name: "Project Kanban Board",
        columns: [
          { title: "To Do", id: "todo" },
          { title: "In Progress", id: "doing" },
          { title: "Done", id: "done" },
        ],
      });
      await newBoard.save();
      console.log("📦 Initial Board structure created.");
    }
  } catch (error) {
    console.error("Error creating initial board:", error.message);
  }
};