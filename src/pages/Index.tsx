
import React from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { FinanceProvider } from "@/context/FinanceContext";

const Index = () => {
  return (
    <FinanceProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </FinanceProvider>
  );
};

export default Index;
