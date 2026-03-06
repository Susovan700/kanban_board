"use client";

import { useEffect, useState } from "react";
import {
  fetchAllTasks,
  createNewTask,
  removeTask,
  updateTaskPosition,
} from "../app/services/api";
import { useSocket } from "../app/hooks/useSocket";
import { 
  DndContext, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTask } from "./components/SortableTask";
import "./page.css";

export default function KanbanPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

 
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    })
  );

  const loadData = async () => {
    try {
      const data = await fetchAllTasks();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useSocket(() => {
    loadData();
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const taskData = { title: newTaskTitle, status: "todo" };
      await createNewTask(taskData);
      setNewTaskTitle("");
      loadData();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await removeTask(id);
        loadData();
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;


    let newStatus = overId;
    const overTask = tasks.find((t) => t._id === overId);
    
    
    if (overTask) {
      newStatus = overTask.status;
    }

    const draggedTask = tasks.find((t) => t._id === taskId);
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        await updateTaskPosition(taskId, newStatus, 0);
        loadData();
      } catch (err) {
        console.error("Move failed", err);
      }
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const doingTasks = filteredTasks.filter((t) => t.status === "doing");
  const doneTasks = filteredTasks.filter((t) => t.status === "done");

  if (loading)
    return <div className="loading-screen">Connecting to Database...</div>;

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Kanban Dashboard</h1>
        <div className="controls">
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              placeholder="+ Add Task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="task-input"
            />
            <button type="submit" className="add-button">Create</button>
          </form>
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
        <div className="board-layout">
          <div className="column" id="todo">
            <h2 className="column-title">To Do</h2>
            <SortableContext items={todoTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
              <div className="task-list">
                {todoTasks.map((task) => (
                  <SortableTask key={task._id} task={task} onDelete={handleDeleteTask} />
                ))}
              </div>
            </SortableContext>
          </div>

          <div className="column" id="doing">
            <h2 className="column-title">In Progress</h2>
            <SortableContext items={doingTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
              <div className="task-list">
                {doingTasks.map((task) => (
                  <SortableTask key={task._id} task={task} onDelete={handleDeleteTask} />
                ))}
              </div>
            </SortableContext>
          </div>

          <div className="column" id="done">
            <h2 className="column-title">Done</h2>
            <SortableContext items={doneTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
              <div className="task-list">
                {doneTasks.map((task) => (
                  <SortableTask key={task._id} task={task} onDelete={handleDeleteTask} />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}