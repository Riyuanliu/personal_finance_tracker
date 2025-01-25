'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/app/components/navbar";
import AddTransaction from '@/app/dashboard/AddTransaction/AddTransaction';
import History from './History/History';
import Reports from './Reports/Reports';
import Home from './Home/Home'; // Import the new Home component
import LoadingScreen from '../components/loading';
import styles from './page.module.css';

export default function Dashboard() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('Home'); // Default section is Home

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            router.push('/login');
            return;
        }

        setIsLoggedIn(true);
        setLoading(false);
    }, [router]);

    const handleSectionClick = (section) => {
        setActiveSection(section);
        router.push(`/dashboard?section=${section.toLowerCase()}`);
    };

    if (loading) {
        return <div className={styles.dashboardLoading}><Navbar /><LoadingScreen title='Dashboard' /></div>;
    }

    if (!isLoggedIn) return null;

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.dashboardContainer}>
                <div className={styles.sidebar}>
                    <h2 className={styles.sidebarLogo}>Dashboard</h2>
                    <ul className={styles.sidebarLinks}>
                        <li
                            onClick={() => handleSectionClick('Home')}
                            className={activeSection === 'Home' ? styles.active : styles.notActive}
                        >
                            Home
                        </li>
                        <li
                            onClick={() => handleSectionClick('AddExpense')}
                            className={activeSection === 'AddExpense' ? styles.active : styles.notActive}
                        >
                            Add Expense
                        </li>
                        <li
                            onClick={() => handleSectionClick('History')}
                            className={activeSection === 'History' ? styles.active : styles.notActive}
                        >
                            History
                        </li>
                        <li
                            onClick={() => handleSectionClick('Reports')}
                            className={activeSection === 'Reports' ? styles.active : styles.notActive}
                        >
                            Reports
                        </li>
                    </ul>
                </div>
                <div className={styles.contentArea}>
                    <div className={styles.sectionContent}>
                        {activeSection === 'Home' && <Home onSectionChange={handleSectionClick} />}
                        {activeSection === 'AddExpense' && <AddTransaction />}
                        {activeSection === 'History' && <History />}
                        {activeSection === 'Reports' && <Reports />}
                    </div>
                </div>
            </div>
        </div>
    );
}
