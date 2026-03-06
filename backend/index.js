import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Keep this one!
import dotenv from 'dotenv';
import connectDB from './Helper/ConnectDB.js';
import boardRoutes from './Routes/BoardRoutes.js';
import taskRoutes from './Routes/TaskRoutes.js';
import { createInitialBoard } from './Controller/BoardController.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// Use ONLY this CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/api/board', boardRoutes);
app.use('/api/tasks', taskRoutes);

connectDB().then(() => {
    createInitialBoard();
});

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Better to match your frontend URL here too
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`👤 User Connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log('👤 User Disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});