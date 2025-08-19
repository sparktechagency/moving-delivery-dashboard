import React from "react";
import InfoCard from "../../Components/Dashboard/InfoCard";
import UserOverviewChart from "../../Components/Dashboard/UserOverviewChart";
import EarningOverviewChart from "../../Components/Dashboard/EarningOverviewChart";
import UsersTable from "../../Components/Dashboard/UsersTable";
import { DollarSign, Users } from "lucide-react";
import { useGetEarningsOverviewQuery, useGetRecentUsersStatusQuery } from "../../features/api/dashboardApi";
import TotalEarnings from "../../Components/Dashboard/TotalEarnings";

const Dashboard = () => {
  // Fetch recent users
  const { data: usersData, isLoading, error } = useGetRecentUsersStatusQuery();

    const { data, error:earningError, isLoading:earningLoading } = useGetEarningsOverviewQuery();

    const totalAmt = data.data.totalAmount
    // console.log(data.data.totalAmount)
  
  // Safely extract users
  const users = usersData?.data?.users || [];


  return (
    <div className="min-h-screen bg-[#C9E6ED]">
      <div className="container p-4 mx-auto">
        <div className="mt-16">
          {/* Info Cards */}
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <InfoCard
              title="Total Users"
              value={users.length}
              icon={<Users className="w-6 h-6 text-white" />}
            />
            <TotalEarnings
              title="Total Earnings"
              value={totalAmt}
              icon={<DollarSign className="w-6 h-6 text-white" />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div className="bg-[#4BADC9] p-4 rounded-md">
              <UserOverviewChart />
            </div>
            <div className="bg-[#4BADC9] p-4 rounded-md">
              <EarningOverviewChart />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-md shadow">
            <UsersTable users={users} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
