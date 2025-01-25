'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // Use next/navigation for Next.js 13
import styles from './page.module.css';
import Navbar from "@/app/components/navbar"; // Import the CSS module for register form

export default function Page() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();  // Initialize the router

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Example API call for registration
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/'; // Redirect on successful registration
        } else {
            setError(data.message); // Display error message if registration fails
        }
    };

    const handleBackToLogin = () => {
        router.push('/login');  // Navigate back to the login page
    };

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.formContainer}>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.inputField}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
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
                    <button type="submit" className={styles.submitButton}>Register</button>
                </form>
                {/* Back to Login Button */}
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={handleBackToLogin}>
                    Back to Login
                </button>
            </div>
        </div>
    );
}
