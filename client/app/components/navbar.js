'use client';

import { useRouter, usePathname } from 'next/navigation'; // Use next/navigation for pathname tracking
import Link from 'next/link'; // Import Link from next/link for navigation
import styles from './navbar.module.css';

export default function Navbar() {
    const router = useRouter();  // Initialize useRouter
    const pathname = usePathname();  // Get the current pathname


    const handleLoginClick = () => {
        router.push('/login');  // Navigate to the login page
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');  // Remove token from localStorage
        router.push('/');  // Redirect to home page after logout
    };

    const isActiveLink = (path) => {
        return pathname === path;  // Check if the current path matches the given one
    };

    // Check if the user is logged in by checking localStorage for a token
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>Expense Tracker</div>
            <ul className={styles.navLinks}>
                <li>
                    <Link href="/" className={isActiveLink("/") ? styles.activeLink : ""}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className={isActiveLink("/dashboard") ? styles.activeLink : ""}>
                        dashboard
                    </Link>
                </li>
            </ul>
            {isLoggedIn ? (
                <button className={styles.loginButton} onClick={handleLogoutClick}>
                    Log out
                </button>
            ) : (
                <button className={styles.loginButton} onClick={handleLoginClick}>
                    Login
                </button>
            )}
        </nav>
    );
}
