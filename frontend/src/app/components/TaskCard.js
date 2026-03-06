import React from 'react';
export default function TaskCard({ task, onDelete }) {
  const handleDeleteClick = (e) => {
    // These two lines are CRUCIAL to prevent conflicts with Drag & Drop
    e.preventDefault();
    e.stopPropagation(); 
    
    onDelete(task._id);
  };

  return (
    <div className="task-card">
      <div className="task-content">
        <p className="task-title">{task.title}</p>
        <button 
          className="delete-btn" 
          onClick={handleDeleteClick}
          onPointerDown={(e) => e.stopPropagation()} // Prevents the drag library from hijacking the click
        >
          ×
        </button>
      </div>
    </div>
  );
}