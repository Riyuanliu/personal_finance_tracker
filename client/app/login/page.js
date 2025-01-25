'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Use next/navigation for Next.js 13
import styles from './page.module.css';
import Navbar from "@/app/components/navbar"; // Import the CSS module for the login form

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if the user is logged in
    const router = useRouter(); // Initialize the router

    // Check if the user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);  // If token exists, user is logged in
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setIsLoggedIn(true);  // Mark user as logged in
            window.location.href = '/'; // Redirect on success
        } else {
            setError(data.message); // Display error message if login fails
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');  // Remove token from localStorage
        setIsLoggedIn(false);  // Mark user as logged out
        window.location.href = '/';  // Redirect to home page or login page
    };

    const handleRegisterRedirect = () => {
        router.push('/register'); // Redirect to the register page
    };

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.formContainer}>
                {isLoggedIn ? (
                    // Show logout button if logged in
                    <div>
                        <h2>Welcome back!</h2>
                        <button onClick={handleLogout} className={styles.submitButton}>
                            Log out
                        </button>
                    </div>
                ) : (
                    // Show login form if not logged in
                    <div>
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    className={styles.inputField}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.inputField}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit" className={styles.submitButton}>Login</button>
                        </form>
                        <p>
                            Don't have an account?
                            <span
                                className={styles.toggleLink}
                                onClick={handleRegisterRedirect} // Link to register page
                            >
                                Register
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
