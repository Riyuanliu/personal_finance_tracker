'use client';

import { useState, useEffect } from 'react';
import styles from './History.module.css';

const History = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch the transaction history from the backend
        const fetchHistory = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/history`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
                }
            });
            const data = await response.json();
            setTransactions(data);
        };

        fetchHistory();
    }, []);

    // Calculate total balance (income + expenses, where expenses are negative)
    const totalBalance = transactions.reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

    return (
        <div className={styles.history}>
            <h2>Transaction History</h2>
            <table>
                <thead>
                <tr>
                    <th>Amount</th>
                    <th>Note</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <tr
                        key={transaction.id}
                        className={transaction.category_type === 'expense' ? styles.expenseRow : styles.incomeRow}
                    >
                        <td>${transaction.amount}</td>
                        <td>{transaction.note}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.category_type}</td>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.summary}>
                <h3>Summary</h3>
                <p>Total Balance: ${totalBalance.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default History;
