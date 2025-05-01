// pages/api/todos.ts
import { NextApiRequest, NextApiResponse } from 'next';

let todos = [
  { id: 1, title: 'First todo', completed: false },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(todos);
  }

  if (req.method === 'POST') {
    const { title } = req.body;
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
    };
    todos.push(newTodo);
    return res.status(201).json(newTodo);
  }

  if (req.method === 'PUT') {
    const { id, title, completed } = req.body;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todos[todoIndex] = { id, title, completed };
    return res.status(200).json(todos[todoIndex]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    todos = todos.filter((todo) => todo.id !== id);
    return res.status(200).json({ message: 'Deleted' });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}