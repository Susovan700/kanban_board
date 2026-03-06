export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
}

export interface Board {
  _id: string;
  name: string;
  columns: Column[];
}