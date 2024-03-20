import React, { useState } from 'react';
import axios from 'axios';

function Login({ setIsLoggedIn, setUsername }) {
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');

    // Handle login
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username: usernameInput, // Use the username input
                password: password, // Use the password input
            });
            const { token, username } = response.data;
            
            // Store token and username in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            
            // Set isLoggedIn state to true and username state to the logged-in username
            setIsLoggedIn(true);
            setUsername(username);
            
            // Perform other actions after successful login
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };


    return (
        <div className="login">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
