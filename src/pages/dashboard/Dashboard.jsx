import React from 'react';
import { BarChart3, Clock, Users, DollarSign } from 'lucide-react';
import StatCard from '../../partial/dashboard/StatCard';
import TopItems from '../../partial/dashboard/TopItems';
import FloorAnalytics from '../../partial/dashboard/FloorAnalytics';
import WelcomeBanner from '../../partial/dashboard/WelcomeBanner';
import StaffPerformance from '../../partial/dashboard/StaffPerformance';

export default function Page() {
  return (
    <div className='space-y-6'>
      <WelcomeBanner />


      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="₹1,45,230"
          description="Today's total sales"
          icon={<DollarSign size={24} />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Total Orders"
          value="284"
          description="Orders placed today"
          icon={<BarChart3 size={24} />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatCard
          title="Active Tables"
          value="18/28"
          description="Current occupancy"
          icon={<Users size={24} />}
          trend={{ value: 5, direction: 'down' }}
        />
        <StatCard
          title="Avg Check"
          value="₹511"
          description="Per table average"
          icon={<Clock size={24} />}
          trend={{ value: 3, direction: 'up' }}
        />
      </div>

      {/* Charts Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart />
        <PeakHours />
      </div> */}

      {/* Analytics Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FloorAnalytics />
        <TopItems />
      </div> */}

      {/* Staff & Satisfaction */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StaffPerformance />
        <CustomerSatisfaction />
      </div> */}

    </div>
  );
}
