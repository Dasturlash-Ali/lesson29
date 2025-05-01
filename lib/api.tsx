import axios from 'axios';

export const updateTodo = async (todo: { id: number; title: string; completed: boolean }) => {
  const response = await axios.put('/api/todos', todo);
  return response.data;
};
