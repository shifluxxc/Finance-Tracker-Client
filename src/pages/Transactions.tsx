
import React, { useState } from "react";
import Layout from "@/components/Layout";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import { FinanceProvider } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const Transactions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <FinanceProvider>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Transactions</h1>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>

          <TransactionList />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <TransactionForm onComplete={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </FinanceProvider>
  );
};

export default Transactions;
