'use client';

import axios from "axios";
import { useState, useEffect } from 'react';
import styles from './AddTransaction.module.css';

const currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'ALL', name: 'Albanian Lek' },
    { code: 'AMD', name: 'Armenian Dram' },
    { code: 'ANG', name: 'Netherlands Antillian Guilder' },
    { code: 'AOA', name: 'Angolan Kwanza' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'AWG', name: 'Aruban Florin' },
    { code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'BAM', name: 'Bosnia and Herzegovina Mark' },
    { code: 'BBD', name: 'Barbados Dollar' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'BIF', name: 'Burundian Franc' },
    { code: 'BMD', name: 'Bermudian Dollar' },
    { code: 'BND', name: 'Brunei Dollar' },
    { code: 'BOB', name: 'Bolivian Boliviano' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'BSD', name: 'Bahamian Dollar' },
    { code: 'BTN', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', name: 'Botswana Pula' },
    { code: 'BYN', name: 'Belarusian Ruble' },
    { code: 'BZD', name: 'Belize Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CDF', name: 'Congolese Franc' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'CNY', name: 'Chinese Renminbi' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'CRC', name: 'Costa Rican Colon' },
    { code: 'CUP', name: 'Cuban Peso' },
    { code: 'CVE', name: 'Cape Verdean Escudo' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'DJF', name: 'Djiboutian Franc' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'DOP', name: 'Dominican Peso' },
    { code: 'DZD', name: 'Algerian Dinar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'ERN', name: 'Eritrean Nakfa' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'EUR', name: 'Euro' },
    { code: 'FJD', name: 'Fiji Dollar' },
    { code: 'FKP', name: 'Falkland Islands Pound' },
    { code: 'FOK', name: 'Faroese Króna' },
    { code: 'GBP', name: 'Pound Sterling' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'GGP', name: 'Guernsey Pound' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'GIP', name: 'Gibraltar Pound' },
    { code: 'GMD', name: 'Gambian Dalasi' },
    { code: 'GNF', name: 'Guinean Franc' },
    { code: 'GTQ', name: 'Guatemalan Quetzal' },
    { code: 'GYD', name: 'Guyanese Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'HNL', name: 'Honduran Lempira' },
    { code: 'HRK', name: 'Croatian Kuna' },
    { code: 'HTG', name: 'Haitian Gourde' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'IMP', name: 'Manx Pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'IQD', name: 'Iraqi Dinar' },
    { code: 'IRR', name: 'Iranian Rial' },
    { code: 'ISK', name: 'Icelandic Króna' },
    { code: 'JEP', name: 'Jersey Pound' },
    { code: 'JMD', name: 'Jamaican Dollar' },
    { code: 'JOD', name: 'Jordanian Dinar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'KGS', name: 'Kyrgyzstani Som' },
    { code: 'KHR', name: 'Cambodian Riel' },
    { code: 'KID', name: 'Kiribati Dollar' },
    { code: 'KMF', name: 'Comorian Franc' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'KYD', name: 'Cayman Islands Dollar' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'LAK', name: 'Lao Kip' },
    { code: 'LBP', name: 'Lebanese Pound' },
    { code: 'LKR', name: 'Sri Lanka Rupee' },
    { code: 'LRD', name: 'Liberian Dollar' },
    { code: 'LSL', name: 'Lesotho Loti' },
    { code: 'LYD', name: 'Libyan Dinar' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'MDL', name: 'Moldovan Leu' },
    { code: 'MGA', name: 'Malagasy Ariary' },
    { code: 'MKD', name: 'Macedonian Denar' },
    { code: 'MMK', name: 'Burmese Kyat' },
    { code: 'MNT', name: 'Mongolian Tögrög' },
    { code: 'MOP', name: 'Macanese Pataca' },
    { code: 'MRU', name: 'Mauritanian Ouguiya' },
    { code: 'MUR', name: 'Mauritian Rupee' },
    { code: 'MVR', name: 'Maldivian Rufiyaa' },
    { code: 'MWK', name: 'Malawian Kwacha' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'MZN', name: 'Mozambican Metical' },
    { code: 'NAD', name: 'Namibian Dollar' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'NIO', name: 'Nicaraguan Córdoba' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'PAB', name: 'Panamanian Balboa' },
    { code: 'PEN', name: 'Peruvian Sol' },
    { code: 'PGK', name: 'Papua New Guinean Kina' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'PLN', name: 'Polish Złoty' },
    { code: 'PYG', name: 'Paraguayan Guaraní' },
    { code: 'QAR', name: 'Qatari Riyal' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'RSD', name: 'Serbian Dinar' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'SBD', name: 'Solomon Islands Dollar' },
    { code: 'SCR', name: 'Seychellois Rupee' },
    { code: 'SDG', name: 'Sudanese Pound' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'SHP', name: 'Saint Helena Pound' },
    { code: 'SLE', name: 'Sierra Leonean Leone' },
    { code: 'SOS', name: 'Somali Shilling' },
    { code: 'SRD', name: 'Surinamese Dollar' },
    { code: 'SSP', name: 'South Sudanese Pound' },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra' },
    { code: 'SYP', name: 'Syrian Pound' },
    { code: 'SZL', name: 'Eswatini Lilangeni' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TJS', name: 'Tajikistani Somoni' },
    { code: 'TMT', name: 'Turkmenistan Manat' },
    { code: 'TND', name: 'Tunisian Dinar' },
    { code: 'TOP', name: 'Tongan Paʻanga' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar' },
    { code: 'TVD', name: 'Tuvaluan Dollar' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'USD', name: 'United States Dollar' },
    { code: 'UYU', name: 'Uruguayan Peso' },
    { code: 'UZS', name: 'Uzbekistani So\'m' },
    { code: 'VES', name: 'Venezuelan Bolívar Soberano' },
    { code: 'VND', name: 'Vietnamese Đồng' },
    { code: 'VUV', name: 'Vanuatu Vatu' },
    { code: 'WST', name: 'Samoan Tālā' },
    { code: 'XAF', name: 'Central African CFA Franc' },
    { code: 'XCD', name: 'East Caribbean Dollar' },
    { code: 'XDR', name: 'Special Drawing Rights' },
    { code: 'XOF', name: 'West African CFA franc' },
    { code: 'XPF', name: 'CFP Franc' },
    { code: 'YER', name: 'Yemeni Rial' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
    { code: 'ZWL', name: 'Zimbabwean Dollar' }
];

const AddTransaction = () => {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [usdAmount, setUsdAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [categories, setCategories] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = response.data;

                if (data.income && data.expense) {
                    const formattedCategories = [
                        ...data.income.map((name) => ({ name, type: 'income' })),
                        ...data.expense.map((name) => ({ name, type: 'expense' })),
                    ];
                    setCategories(formattedCategories);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            }
        };

        fetchCategories();
    }, [token, type]);

    useEffect(() => {
        if (amount && currency !== 'USD') {
            const fetchConversion = async () => {
                try {
                    const response = await fetch(
                        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/pair/${currency}/USD`
                    );

                    const data = await response.json();
                    if (data.result === 'success') {
                        setUsdAmount((amount * data.conversion_rate).toFixed(2));
                    } else {
                        setUsdAmount('');
                    }
                } catch (error) {
                    console.error('Error fetching conversion rate:', error);
                    setUsdAmount('');
                }
            };
            fetchConversion();
        } else {
            setUsdAmount(amount);
        }
    }, [amount, currency]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usdAmount || !currency || !date || !category) {
            setErrorMessage('Please fill in all the required fields.');
            return;
        }

        const transactionData = {
            type,
            amount: usdAmount,  // Send the USD amount instead of the original amount
            date,
            category: category,  // Use the new category if provided, otherwise the selected one
            note,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            const result = await response.json();

            if (response.ok) {
                // Handle successful submission, e.g., show success message or reset form
                console.log('Transaction added:', result);
                setErrorMessage('');
                // Optionally reset the form fields here
            } else {
                // Handle error in adding transaction
                setErrorMessage(result.message || 'Failed to add transaction.');
            }
        } catch (error) {
            console.error('Error submitting transaction:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };


    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            // Add the new category to the backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, category: newCategory }),
            });

            const data = await response.json();

            // Close the popup
            setIsPopupOpen(false);

            // Re-fetch the categories after adding the new one
            const fetchCategories = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    if (data.income && data.expense) {
                        const formattedCategories = [
                            ...data.income.map((name) => ({ name, type: 'income' })),
                            ...data.expense.map((name) => ({ name, type: 'expense' })),
                        ];
                        setCategories(formattedCategories);
                    } else {
                        setCategories([]);
                    }
                } catch (error) {
                    setCategories([]);
                }
            };

            fetchCategories();  // Fetch categories again after adding a new one

        } catch (error) {
            console.error('Error adding category:', error);
        }
    };


    const handleCategoryChange = (e) => {
        if (e.target.value === "add-new") {
            setIsPopupOpen(true);
        } else {
            setCategory(e.target.value);
        }
    };

    return (
        <div className={styles.addTransaction}>
            <h2>Add a New Transaction</h2>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="type">Transaction Type</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="currency">Currency</label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        {currencies.map(({ code, name }) => (
                            <option key={code} value={code}>
                                {code} - {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="usdAmount">Amount in USD</label>
                    <input
                        type="text"
                        id="usdAmount"
                        value={usdAmount}
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select Category</option>
                        {categories
                            .filter((cat) => cat.type === type)
                            .map((cat, index) => (
                                <option key={index} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        <option value="add-new">+ Add New Category</option>
                    </select>
                </div>

                {isPopupOpen && (
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <h3>Add New Category</h3>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter category name"
                            />
                            <button onClick={handleAddCategory}>Add</button>
                            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="note">Note</label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
                <button type="submit">Add Transaction</button>
            </form>
        </div>
    );
};

export default AddTransaction;
