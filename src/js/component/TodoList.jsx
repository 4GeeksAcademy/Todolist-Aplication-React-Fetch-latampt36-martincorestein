import React from 'react';

const TodoList = ({ tasks, deleteTask }) => {
    if (!Array.isArray(tasks)) {
        return (
            <div className="error-message">
                Error: la lista de tareas no es válida.
            </div>
        );
    }

    return (
        <ul className="todo-list">
            {tasks.map((task) => {
                // Verificamos si existe el ID
                const taskId = task.id || task._id || task.todo_id;
                
                if (!taskId) {
                    console.error('Tarea sin ID:', task);
                    return null;
                }

                return (
                    <li key={taskId} className="todo-item">
                        {task.label} 
                        <span 
                            className="delete-icon" 
                            onClick={() => deleteTask(taskId)}
                        ><b>X</b></span>
                    </li>
                );
            })}
        </ul>
    );
};

export default TodoList;

