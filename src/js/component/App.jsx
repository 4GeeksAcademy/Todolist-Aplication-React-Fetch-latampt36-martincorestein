import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const API_URL = 'https://playground.4geeks.com/todo';
    const USER = 'martincorestein';
                   
    // CARGAR TAREAS al cargar la aplicación
    const fetchTasks = () => {
        setIsLoading(true);
        setError(null);
        
        fetch(`${API_URL}/users/${USER}`)
            .then((resp) => {
                if (!resp.ok) throw new Error('Error al cargar las tareas');
                return resp.json();
            })
            .then((data) => {
                console.log('Estructura de las tareas:', data.todos); 
                if (data.todos && Array.isArray(data.todos)) {
                    setTasks(data.todos);
                } else {
                    throw new Error('Formato de datos incorrecto');
                }
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error);
                setError('Error al cargar las tareas');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Función AGREGAR TAREAS
    const addTask = (event) => {
        if (event.key === "Enter" && inputValue.trim()) {
            setIsLoading(true);
            setError(null);
            
            const newTask = { label: inputValue, is_done: false };
            
            fetch(`${API_URL}/todos/${USER}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(resp => {
                if (!resp.ok) throw new Error('Error al agregar la tarea');
                setInputValue("");
                fetchTasks();
            })
            .catch(error => {
                console.error("Error adding task:", error);
                setError('Error al agregar la tarea');
            })
            .finally(() => {
                setIsLoading(false);
            });
        }
    };

    // Funcion ELIMINAR TAREAS
    const deleteTask = (todoId) => {
        setIsLoading(true);
        setError(null);

        fetch(`${API_URL}/todos/${todoId}`, { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => {
            if (!resp.ok) throw new Error('Error al eliminar la tarea');
            fetchTasks();
        })
        .catch(error => {
            console.error("Error deleting task:", error);
            setError('Error al eliminar la tarea');
        })
        .finally(() => {
            setIsLoading(false);
        });
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
                    disabled={isLoading}
                />
                {error && <div className="error-message">{error}</div>}
                {isLoading ? (
                    <div className="loading">Cargando...</div>
                ) : (
                    <>
                        <TodoList 
                            tasks={tasks} 
                            deleteTask={deleteTask} 
                        />
                        <div className="task-counter">
                            {tasks.length === 0 ? 
                                "No hay tareas, añadir tareas" : 
                                `${tasks.length} ${tasks.length === 1 ? 'item' : 'items'} left`}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default App;