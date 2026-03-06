import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export function useSocket(onTaskMoved: Function) {
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("taskMoved", (data) => {
      console.log("📢 Real-time update: A task was moved!", data);
      onTaskMoved(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [onTaskMoved]);
}
