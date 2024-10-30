import React, { useState, useEffect } from 'react';
import TodoList from './TodoList';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const API_URL = 'https://playground.4geeks.com/todo';
    const USER = 'martincorestein';

    // Función para crear usuario
    const createUser = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${USER}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error('Error al crear usuario');
            return true;
        } catch (error) {
            console.error("Error creating user:", error);
            return false;
        }
    };
                   
    // CARGAR TAREAS al cargar la aplicación
    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            let response = await fetch(`${API_URL}/users/${USER}`);
            
            // Si el usuario no existe, intentamos crearlo
            if (response.status === 404) {
                const userCreated = await createUser();
                if (userCreated) {
                    response = await fetch(`${API_URL}/users/${USER}`);
                } else {
                    throw new Error('No se pudo crear el usuario');
                }
            }

            if (!response.ok) throw new Error('Error al cargar las tareas');
            
            const data = await response.json();
            if (data.todos && Array.isArray(data.todos)) {
                setTasks(data.todos);

                console.log('Estructura de las tareas:', data.todos);

            } else {
                throw new Error('Formato de datos incorrecto');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Error al cargar las tareas');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Función AGREGAR TAREAS
    const addTask = (event) => {
        if (event.key === "Enter" && inputValue.trim()) {
            setIsLoading(true);
            setError(null);
            
            const newTask = { label: inputValue, done: false };
            
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

    // Función ELIMINAR TODAS las tareas
    const deleteAllTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            
            const deleteResponse = await fetch(`${API_URL}/users/${USER}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!deleteResponse.ok) throw new Error('Error al eliminar usuario');

            
            const createResponse = await createUser();
            if (!createResponse) throw new Error('Error al recrear usuario');

            
            setTasks([]);
            console.log('Estructura de las tareas después de eliminar todas:', []);
            setError(null);
        } catch (error) {
            console.error("Error clearing all tasks:", error);
            setError('Error al eliminar todas las tareas');
            
            fetchTasks();
        } finally {
            setIsLoading(false);
        }
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
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <TodoList 
                            tasks={tasks} 
                            deleteTask={deleteTask} 
                        />
                        <div className="task-footer">
                            <div className="task-counter">
                                {tasks.length === 0 ? 
                                    "No Tasks, Add Tasks." : 
                                    `${tasks.length} ${tasks.length === 1 ? 'item' : 'items'} left`}
                            </div>
                            {tasks.length > 0 && (
                                <button 
                                    onClick={deleteAllTasks}
                                    className="delete-all-button"
                                >
                                    Delete all Tasks
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default App;