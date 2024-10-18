import React from 'react';

const TodoList = ({ tasks, deleteTask }) => {
    return (
        <ul className="todo-list">
            {tasks.map((task, index) => (
                <li key={index} className="todo-item">
                    {task}
                    <span 
                        className="delete-icon" 
                        onClick={() => deleteTask(index)}
                    ><b>X</b></span>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
