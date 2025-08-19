import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useGetTotalUsersGraphQuery } from "../../features/api/dashboardApi";

Chart.register(...registerables);

function UserOverviewChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  // Fetch data for the selected year
  const { data, error, isLoading } = useGetTotalUsersGraphQuery(selectedYear);

  // Populate available years dynamically
  useEffect(() => {
    if (!data?.data?.monthlyStats) return;

    const years = data.data.monthlyStats.map((item) => item.year);
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a); // descending
    setAvailableYears(uniqueYears);

    if (!selectedYear) setSelectedYear(uniqueYears[0]); // default to latest year
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || !data?.data?.monthlyStats) return;

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    const monthlyCounts = Array(12).fill(0);

    data.data.monthlyStats.forEach((item) => {
      monthlyCounts[item.month - 1] = item.count;
    });

    const chartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Users",
          data: monthlyCounts,
          fill: true,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderColor: "rgba(255, 255, 255, 0.8)",
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#4BADC9",
            bodyColor: "#4BADC9",
            borderColor: "#4BADC9",
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: {
              color: "rgba(255, 255, 255, 0.8)",
              stepSize: 20,
              font: { size: 12 },
            },
          },
          x: {
            grid: { display: false },
            ticks: { color: "rgba(255, 255, 255, 0.8)", font: { size: 15 } },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  return (
    <div className="w-full h-[300px] bg-[#4BADC9] p-4 rounded-md">
      <div className="flex items-center bg-[#4BADC9]  justify-between ">
          <h2 className="text-lg font-medium text-white">User Overview</h2>
        <div className="relative">
          <select
            className="appearance-none bg-[#5CBAD3] text-white px-4 py-1 pr-8 rounded-md border border-white/30 focus:outline-none"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
            
          </select>
           <div className="absolute inset-y-0 right-0 flex items-center px-2 text-white pointer-events-none">
            <svg
              className="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
         
        </div>
      </div>
      <canvas ref={chartRef} />

      {isLoading && <p className="text-white">Loading chart...</p>}
      {error && <p className="text-red-500">Error fetching data</p>}
    </div>
  );
}

export default UserOverviewChart;
