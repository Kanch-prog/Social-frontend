import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import CreatePost from './CreatePost';
import Login from './Login'; 
import Registration from './Registration'; 
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Check for authentication token in local storage
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            // Token found, user is logged in
            setIsLoggedIn(true);
            setUsername(username); // Set the actual username from local storage
            // Fetch additional user information if needed
            // For simplicity, let's assume we don't need to fetch user info here
        }
    }, []);

    const handleLogout = () => {
        // Clear the authentication token from local storage
        localStorage.removeItem('token');
        // Update isLoggedIn state to false
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="app">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/create">Create Post</Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link to="/profile">Welcome {username}!</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} username={username} />} />
                    <Route path="/create" element={isLoggedIn ? <CreatePost /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
