import React, { useState } from 'react';
import TodoList from './TodoList';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const addTask = (event) => {
        if (event.key === "Enter" && inputValue.trim()) {
            setTasks([...tasks, inputValue]);
            setInputValue("");
        }
    };

    const deleteTask = (index) => {
        const newTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
        setTasks(newTasks);
    };

    return (
        
        <div className="app-container">

            <div className="page-layer"></div>
            <div className="page-layer"></div>
            <div className="page-layer"></div>

            <div className="content">
                <h1 className="title">todos</h1>
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    onKeyDown={addTask}
                    placeholder="What needs to be done?"
                    className="task-input"
                />
                <TodoList tasks={tasks} deleteTask={deleteTask} />
                <div className="task-counter">
                    {tasks.length === 0 ? "No hay tareas, añadir tareas" : `${tasks.length} item left`}
                </div>
            </div>
        </div>
    );
};

export default App;
