'use client';

import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";

export default function Home() {
    const [htmlContent, setHtmlContent] = useState("Loading...");
    const token = localStorage.getItem('token'); // Assume token is stored in localStorage

    useEffect(() => {
        if (!token) {
            setHtmlContent("<p>Unauthorized: Please log in</p>");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/home`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.text()) // Get raw HTML content as a string
            .then((html) => {
                setHtmlContent(html);
            })
            .catch((error) => {
                console.error("Error fetching HTML content:", error);
                setHtmlContent("<p>Failed to load content</p>");
            });
    }, [token]);

    return (
        <div className={styles.page}>
            {/* Navigation Bar */}
            <Navbar />

            {/* Hero Section */}
            <header className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Simplify Your Finances</h1>
                <p className={styles.heroSubtitle}>
                    Track expenses, manage budgets, and achieve your financial goals effortlessly.
                </p>
                <button className={styles.ctaButton}>Get Started</button>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.messageContainer}>
                    <h2>Return Message from Server</h2>
                    <div
                        className={styles.serverMessage}
                        dangerouslySetInnerHTML={{ __html: htmlContent }} // Render HTML content
                    />
                </div>
            </main>
        </div>
    );
}
