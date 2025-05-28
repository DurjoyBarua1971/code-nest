"use client";

import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { api } from "../lib/api";

type Stat = {
  label: string;
  value: string | number;
  icon: string;
  color: string;
};

export default function Dashboard() {
  const [barData, setBarData] = useState({});
  const [barOptions, setBarOptions] = useState({});
  const [doughnutData, setDoughnutData] = useState({});
  const [lineData, setLineData] = useState({});
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard", {
        headers: {
          Accept: "application/json",
        },
      });

      const { stats, chartData } = response.data;

      setStats(stats);
      setBarData(chartData.problemDifficulty);
      setDoughnutData(chartData.userInteraction);
      setLineData(chartData.weeklySubmissions);

      setBarOptions({
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      });
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-gray-800">
        Platform Admin Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-6 text-lg">
        Overview of user activity, content, and platform performance for Code
        Nest.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-row items-center gap-4">
              <span
                className={`rounded-full ${stat.color} p-4 flex items-center justify-center`}
              >
                <i className={`${stat.icon} text-3xl`} />
              </span>
              <div>
                <div className="text-2xl font-semibold text-gray-700">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-md">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Divider />
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Platform Analytics
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Problem Distribution by Difficulty" className="shadow-lg">
          <Chart
            type="bar"
            data={barData}
            options={barOptions}
            className="w-full h-80"
          />
        </Card>
        <Card title="User Problem Interaction Status" className="shadow-lg">
          <Chart
            type="doughnut"
            data={doughnutData}
            options={{ plugins: { legend: { position: "bottom" } } }}
            className="w-full h-80"
          />
        </Card>
        <Card title="Weekly Submission Trends" className="shadow-lg">
          <Chart
            type="line"
            data={lineData}
            options={{ scales: { y: { beginAtZero: true } } }}
            className="w-full h-80"
          />
        </Card>
      </div>
    </div>
  );
}
