import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useGetEarningsOverviewQuery } from "../../features/api/dashboardApi";

Chart.register(...registerables);

function EarningOverviewChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  const { data, error, isLoading } = useGetEarningsOverviewQuery(selectedYear);

  useEffect(() => {
    if (!data?.data?.monthlyStats) return;

    const years = data.data.monthlyStats.map((item) => item.year);
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a); 
    setAvailableYears(uniqueYears);

    if (!selectedYear && uniqueYears.length > 0) setSelectedYear(uniqueYears[0]); 
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || !data?.data?.monthlyStats) return;

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    const earnings = Array(12).fill(0);

    data.data.monthlyStats.forEach(item => {
      earnings[item.month - 1] = item.totalAmount || 0;
    });

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [
          {
            label: "Earnings",
            data: earnings,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: 3,
            barThickness: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } },
          x: { ticks: { color: "white" }, grid: { display: false } },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [data]);

  return (
    <div className="w-full h-[300px] bg-[#4BADC9] p-4 rounded-md">
      <div className="flex items-center justify-between ">
        <h2 className="text-lg font-medium text-white">Earnings Overview</h2>
        <div className="relative">
          <select
            className="appearance-none bg-[#5CBAD3] text-white px-4 py-1 pr-8 rounded-md border border-white/30 focus:outline-none"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
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

      {isLoading && <p className="text-white">Loading earnings...</p>}
      {error && <p className="text-red-500">Error loading earnings</p>}

      <canvas ref={chartRef} />
    </div>
  );
}

export default EarningOverviewChart;
