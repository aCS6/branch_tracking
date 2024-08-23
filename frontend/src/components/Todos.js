import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/todos.css'; // Import the CSS file

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://0.0.0.0:9000/todos', {
        headers: { 'Authorization': `${token}` },
      });
      if(response.status == 403){
        // Todo: Handle Logout
        console.log("Access token not valid")
      }
      setTodos(response.data);
    } catch (error) {
      toast.error('Failed to fetch todos');
    }
  };

  const handleCreateTodo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://0.0.0.0:9000/todos', newTodo, {
        headers: { 'Authorization': `${token}` },
      });
      fetchTodos();
      setNewTodo({ title: '', description: '' });
      toast.success('Todo created successfully');
    } catch (error) {
      toast.error('Failed to create todo');
    }
  };

  const handleUpdateTodo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://0.0.0.0:9000/todos/${editTodo.id}`, editTodo, {
        headers: { 'Authorization': `${token}` },
      });
      fetchTodos();
      setEditTodo(null);
      toast.success('Todo updated successfully');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://0.0.0.0:9000/todos/${id}`, {
        headers: { 'Authorization': `${token}` },
      });
      fetchTodos();
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  return (
    <div className="todos-container">
      <h2>Todos</h2>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <button onClick={handleCreateTodo}>Add Todo</button>
      </div>

      {editTodo && (
        <div className="todo-form">
          <input
            type="text"
            placeholder="Title"
            value={editTodo.title}
            onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={editTodo.description}
            onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
          />
          <input
            type="checkbox"
            checked={editTodo.completed}
            onChange={(e) => setEditTodo({ ...editTodo, completed: e.target.checked })}
          />
          <button onClick={handleUpdateTodo}>Update Todo</button>
        </div>
      )}

        <table className="todo-table">
        <thead>
            <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {todos.map((todo) => (
            <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.completed ? 'Completed' : 'Incomplete'}</td>
                <td>
                <button onClick={() => setEditTodo(todo)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>

    </div>
  );
};

export default Todos;
