import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; // Import Bar chart component from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './Home.module.css'; // Create a CSS module for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = ({ onSectionChange }) => {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        // Fetch the income and expenses data from the backend
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/income-expenses`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
                    }
                });
                const data = await response.json();
                setIncome(data.income);
                setExpenses(data.expenses);

                // Calculate the total income and total expenses
                const totalIncome = data.income.reduce((sum, item) => sum + item.total, 0);
                const totalExpenses = data.expenses.reduce((sum, item) => sum + item.total, 0);

                // Prepare the graph data for the bar chart
                setGraphData({
                    labels: ['Income', 'Expenses'], // Only Income and Expenses as the labels
                    datasets: [
                        {
                            label: 'Total Income',
                            data: [totalIncome, 0], // Total income is represented by the first value
                            backgroundColor: 'green',
                            borderColor: 'green',
                            borderWidth: 1,
                        },
                        {
                            label: 'Total Expenses',
                            data: [0, totalExpenses], // Total expenses is represented by the second value
                            backgroundColor: 'red',
                            borderColor: 'red',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching income and expenses data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once when the component mounts

    return (
        <div className={styles.homeContainer}>
            <div className={styles.row}>
                <div className={styles.card}>
                    <h3>Income</h3>
                    <ul>
                        {income.map((item, index) => (
                            <li key={index}>
                                {item.category}: ${item.total}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.card}>
                    <h3>Expenses</h3>
                    <ul>
                        {expenses.map((item, index) => (
                            <li key={index}>
                                {item.category}: ${item.total}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.quickAccess}>
                    <h4>Quick Access</h4>
                    <ul className={styles.quickaccessbar}>
                        <li onClick={() => onSectionChange('AddExpense')}>Add Expense</li>
                        <li onClick={() => onSectionChange('History')}>History</li>
                        <li onClick={() => onSectionChange('Reports')}>Reports</li>
                    </ul>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.graph}>
                    <h3>Monthly Report</h3>
                    <div className={styles.chart}>
                        <h4>Income vs Expenses</h4>
                        <div className={styles.barChart}>
                            {/* Rendering the Bar chart using react-chartjs-2 */}
                            <Bar
                                data={graphData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: 'Income vs Expenses',
                                        },
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        x: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
