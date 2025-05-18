import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { FinanceProvider } from "@/context/FinanceContext";

const FinanceDashBoard = () => {
  return (
    <FinanceProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </FinanceProvider>
  );
};

export default FinanceDashBoard;
