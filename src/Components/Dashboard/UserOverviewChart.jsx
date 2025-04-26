import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// UserOverviewChart Component
function UserOverviewChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Sample data that mimics the chart in the image
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Users',
          data: [85, 80, 75, 65, 40, 45, 60, 75, 95, 85, 90, 75],
          fill: true,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.8)',
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#4BADC9',
            bodyColor: '#4BADC9',
            borderColor: '#4BADC9',
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12,
              },
              stepSize: 20,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-[250px]">
      <canvas ref={chartRef} />
    </div>
  );
}

// Main Dashboard Component
function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
       
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-medium">User Overview</h2>
            <div className="flex items-center gap-6">
              <span className="text-white">Account Type</span>
              <div className="relative">
                <select
                  className="appearance-none bg-[#5CBAD3] text-white px-4 py-1 pr-8 rounded-md border border-white/30 focus:outline-none"
                  defaultValue="2024"
                >
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <UserOverviewChart />
      
      </div>
    </div>
  );
}

export default DashboardPage;