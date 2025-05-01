// pages/index.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    const res = await axios.get('/api/todos');
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await axios.post('/api/todos', { title: newTodo });
    setNewTodo('');
    fetchTodos();
  };

  const toggleComplete = async (id: number) => {
    await axios.put('/api/todos', { id });
    fetchTodos();
  };

  const handleUpdate = async () => {
    if (editingId === null || !editText.trim()) return;
    const todo = todos.find((t) => t.id === editingId);
    if (!todo) return;

    await axios.put('/api/todos', {
      id: editingId,
      title: editText,
      completed: todo.completed,
    });

    setEditingId(null);
    setEditText('');
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await axios.delete('/api/todos', { data: { id } });
    fetchTodos();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Yangi todo..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Qoshish
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border-b py-2"
          >
            {editingId === todo.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="bg-gray-300 px-2 py-1 rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <span
                onClick={() => toggleComplete(todo.id)}
                className={`cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
              >
                {todo.title}
              </span>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(todo.id);
                  setEditText(todo.title);
                }}
                className="text-yellow-500"
              >
                ✎
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};