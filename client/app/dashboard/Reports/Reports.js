'use client';

import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './Reports.module.css';

const Reports = () => {
    const [dailyData, setDailyData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);

    useEffect(() => {
        // Function to fetch daily expenses
        const fetchDailyData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/report/daily`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use the actual token from local storage
                    },
                });
                const data = await response.json();
                setDailyData(data);
            } catch (error) {
                console.error('Error fetching daily data:', error);
            }
        };

        // Function to fetch monthly expenses
        const fetchMonthlyData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/report/monthly`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use the actual token from local storage
                    },
                });
                const data = await response.json();
                setMonthlyData(data);
            } catch (error) {
                console.error('Error fetching monthly data:', error);
            }
        };

        // Fetch the data
        fetchDailyData();
        fetchMonthlyData();
    }, []);

    const prepareDailyChartData = (data) => {
        // Step 1: Prepare the labels (days of the week, e.g., "Mon", "Tue")
        const labels = data.map(item => item.label);  // Extract the day labels (e.g., "Mon", "Tue")

        // Step 2: Extract the required data for each dataset
        const incomeData = data.map(item => parseFloat(item.total_income));  // Convert total_income to numbers
        const expenseData = data.map(item => parseFloat(item.total_expense));  // Convert total_expense to numbers

        // Step 3: Return the chart data in the correct format
        return {
            labels: labels,  // Days as x-axis labels
            datasets: [
                {
                    label: 'Income ($)',
                    data: incomeData,  // Total income for each day
                    backgroundColor: 'rgba(75, 192, 75, 0.6)',  // Green color for income
                    borderColor: 'rgba(75, 192, 75, 1)',
                    borderWidth: 1,
                    fill: false,  // No filling under the line
                },
                {
                    label: 'Expense ($)',
                    data: expenseData,  // Total expense for each day
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',  // Red color for expense
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false,  // No filling under the line
                }
            ],
        };
    };



    const prepareMonthlyChartData = (data) => {
        // Step 1: Prepare the labels (months)
        const labels = data.map(item => item.month);  // Use the 'month' field as the x-axis labels

        // Step 2: Extract the required data for each dataset
        const incomeData = data.map(item => item.total_income);  // Total income for each month
        const expenseData = data.map(item => item.total_expense);  // Total expense for each month
        const netIncomeData = data.map(item => item.net_income);  // Net income for each month

        // Step 3: Return the chart data in the correct format
        return {
            labels: labels,  // Months as x-axis labels
            datasets: [
                {
                    label: 'Income ($)',
                    data: incomeData,  // Total income for each month
                    backgroundColor: 'rgba(75, 192, 75, 0.6)',  // Green color for income
                    borderColor: 'rgba(75, 192, 75, 1)',
                    borderWidth: 1,
                    fill: false,  // No filling under the line
                },
                {
                    label: 'Expense ($)',
                    data: expenseData,  // Total expense for each month
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',  // Red color for expense
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false,  // No filling under the line
                },
                {
                    label: 'Net Income ($)',
                    data: netIncomeData,  // Net income for each month (income - expense)
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',  // Blue color for net income
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false,  // No filling under the line
                }
            ],
        };
    };




    return (
        <div className={styles.reports}>
            <h2>Expense Reports</h2>
            <div>
                {/* Daily Expenses Bar Chart */}
                <div className={styles.chartContainer}>
                    <h3>Daily Expenses</h3>
                    {!dailyData ? (
                        <p>Loading daily data...</p>
                    ) : (
                        <Bar
                            data={prepareDailyChartData(dailyData)}  // Use the function for daily data
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true },
                                    title: { display: true, text: 'Daily Expense Overview' },
                                },
                            }}
                        />
                    )}
                </div>

                {/* Monthly Expenses Line Chart */}
                <div className={styles.chartContainer}>
                    <h3>Monthly Expenses</h3>
                    {!monthlyData ? (
                        <p>Loading monthly data...</p>
                    ) : (
                        <Line
                            data={prepareMonthlyChartData(monthlyData)}  // Use the function for monthly data
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true },
                                    title: { display: true, text: 'Monthly Expense Trends' },
                                },
                                scales: {
                                    y: { beginAtZero: true },
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
