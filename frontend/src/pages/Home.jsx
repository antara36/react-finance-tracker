import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import { useTransactions } from "../context/TransactionContext";

const Home = () => {
  const { transactions } = useTransactions();
  const [stats, setStats] = useState({
    total: 0,
    income: 0,
    expenses: 0,
    balance: 0,
    categories: {},
    recentTransactions: [],
    trend: { income: 0, expenses: 0 },
  });

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setStats({
        total: 0,
        income: 0,
        expenses: 0,
        balance: 0,
        categories: {},
        recentTransactions: [],
        trend: { income: 0, expenses: 0 },
      });
      return;
    }

    const total = transactions.length;

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expenses;

    const categories = transactions.reduce((acc, t) => {
      const category = t.category.toLowerCase();
      if (!acc[category]) acc[category] = 0;
      acc[category] += Number(t.amount);
      return acc;
    }, {});

    const recentTransactions = transactions
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const thisMonthTransactions = transactions.filter(
      (t) => new Date(t.id).getMonth() === currentMonth
    );
    const lastMonthTransactions = transactions.filter(
      (t) => new Date(t.id).getMonth() === lastMonth
    );

    const trend = {
      income:
        (thisMonthTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0) /
          (lastMonthTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 1) -
          1) *
        100,
      expenses:
        (thisMonthTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0) /
          (lastMonthTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 1) -
          1) *
        100,
    };

    setStats({
      total,
      income,
      expenses,
      balance,
      categories,
      recentTransactions,
      trend,
    });
  }, [transactions]);

  return (
    <div className="main-container" style={{ padding: "20px" }}>
      <Navbar/>
      <h1 className="sub-heading-large">Welcome to Your Finance Tracker</h1>
      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Balance Card */}
        <Card className="card">
          <CardHeader
            className="flex-container"
            style={{ justifyContent: "space-between" }}
          >
            <span className="sub-text" style={{ fontWeight: 600 }}>
              Total Balance
            </span>
            <TrendingUp className="sub-container-icon-medium" color="#666" />
          </CardHeader>
          <CardContent>
            <div className="sub-heading-medium">
              ${stats.balance.toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              From {stats.total} transactions
            </p>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="card">
          <CardHeader
            className="flex-container"
            style={{ justifyContent: "space-between" }}
          >
            <span className="sub-text" style={{ fontWeight: 600 }}>
              Income
            </span>
            {stats.trend.income > 0 ? (
              <TrendingUp className="sub-container-icon-medium" color="green" />
            ) : (
              <TrendingDown className="sub-container-icon-medium" color="red" />
            )}
          </CardHeader>
          <CardContent>
            <div className="sub-heading-medium text-green-500" color="green">
              ${stats.income.toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              {stats.trend.income.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="card">
          <CardHeader
            className="flex-container"
            style={{ justifyContent: "space-between" }}
          >
            <span className="sub-text" style={{ fontWeight: 600 }}>
              Expenses
            </span>
            {stats.trend.expenses > 0 ? (
              <TrendingUp className="sub-container-icon-medium" color="green" />
            ) : (
              <TrendingDown className="sub-container-icon-medium" color="red" />
            )}
          </CardHeader>
          <CardContent>
            <div className="sub-heading-medium text-red-500">
              ${stats.expenses.toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              {stats.trend.expenses.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
      }}>
        {/* Recent Transactions */}
        <Card className="card">
          <CardHeader>
            <div
              className="flex-container"
              style={{ justifyContent: "space-between" }}
            >
              <h2 className="sub-heading-small">Recent Transactions</h2>
              <Clock className="sub-container-icon-medium text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              {stats.recentTransactions.length === 0 ? (
                <p className="text-muted-foreground">No transactions yet.</p>
              ) : (
                stats.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="sub-container p-2 rounded-md hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="sub-text" style={{ fontWeight: 600 }}>
                        {transaction.description}
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(transaction.id).toLocaleDateString()} —
                        {new Date(transaction.id).toLocaleTimeString()}
                      </p>
                    </div>
                    <div
                      className={`sub-text style={{fontWeight: 600}} ${transaction.type === "expense"
                          ? "text-red-500"
                          : "text-green-500"
                        }`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}$
                      {Number(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}

export default Home