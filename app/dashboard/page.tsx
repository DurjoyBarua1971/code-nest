"use client";

import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";

export default function Dashboard() {
  const [barData, setBarData] = useState({});
  const [barOptions, setBarOptions] = useState({});
  const [doughnutData, setDoughnutData] = useState({});
  const [lineData, setLineData] = useState({});

  useEffect(() => {
    setBarData({
      labels: ["Easy", "Medium", "Hard"],
      datasets: [
        {
          label: "Problems by Difficulty",
          data: [140, 300, 250],
          backgroundColor: [
            "rgba(75, 192, 192, 0.7)",
            "rgba(255, 159, 64, 0.7)",
            "rgba(255, 99, 132, 0.7)",
          ],
          borderColor: [
            "rgb(75, 192, 192)",
            "rgb(255, 159, 64)",
            "rgb(255, 99, 132)",
          ],
          borderWidth: 1,
        },
      ],
    });
    setBarOptions({
      plugins: {
        legend: { display: true, position: "top" },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    });
    setBarOptions({
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    });

    setDoughnutData({
      labels: [
        "Attempted & Solved",
        "Attempted & Unsolved",
        "Not Yet Attempted",
      ],
      datasets: [
        {
          data: [4500, 2400, 3100],
          backgroundColor: [
            "rgba(40, 167, 69, 0.7)",
            "rgba(255, 193, 7, 0.7)",
            "rgba(108, 117, 125, 0.7)",
          ],
          borderColor: [
            "rgb(40, 167, 69)",
            "rgb(255, 193, 7)",
            "rgb(108, 117, 125)",
          ],
          borderWidth: 1,
        },
      ],
    });

    setLineData({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "New Submissions This Week",
          data: [250, 400, 320, 500, 610, 450, 700],
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          tension: 0.4,
        },
      ],
    });
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: "12,545",
      icon: "pi pi-users",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Users (Today)",
      value: "1,830",
      icon: "pi pi-user-plus",
      color: "bg-teal-100 text-teal-600",
    },
    {
      label: "Total Problems",
      value: "690",
      icon: "pi pi-book",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Total Submissions",
      value: "150,320",
      icon: "pi pi-code",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Avg. Success Rate",
      value: "58%",
      icon: "pi pi-check-circle",
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "New Problems (Month)",
      value: "25",
      icon: "pi pi-plus-circle",
      color: "bg-purple-100 text-purple-600",
    },
  ];

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
