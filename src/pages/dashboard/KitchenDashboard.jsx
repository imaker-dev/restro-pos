import React from "react";
import PageHeader from "../../layout/PageHeader";
import DashboardBanner from "../../partial/dashboard/WelcomeBanner";

const KitchenDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title={"Kitchen Dashboard"}
        description="Overview of your account activity, statistics, and recent updates."
      />

      <DashboardBanner />
    </div>
  );
};

export default KitchenDashboard;
