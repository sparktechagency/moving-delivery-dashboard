import React from "react";
import InfoCard from "../../Components/Dashboard/InfoCard";
import UserOverviewChart from "../../Components/Dashboard/UserOverviewChart";
import EarningOverviewChart from "../../Components/Dashboard/EarningOverviewChart";
import { DollarSign, Users } from "lucide-react";
import UsersTable from "../../Components/Dashboard/UsersTable";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#C9E6ED]">
      <div className="container p-4 mx-auto ">
    
      <div className="mt-16">
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <InfoCard
            title="Total Users"
            value="18"
            icon={<Users className="w-6 h-6 text-white" />}
          />
          <InfoCard
            title="Total Earnings"
            value="$1,846"
            icon={<DollarSign className="w-6 h-6 text-white" />}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <div className="bg-[#4BADC9] p-4 rounded-md">
            <UserOverviewChart  />
          </div>
          <div className="bg-[#4BADC9] p-4 rounded-md">
            <EarningOverviewChart />
          </div>
        </div>

        <div className="bg-white rounded-md shadow">
          <UsersTable />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
