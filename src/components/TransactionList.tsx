import React, { useState } from "react";
import { format } from "date-fns";
import {
  useTransactions,
  useDeleteTransaction,
} from "../hooks/transaction";

import {useCategories} from "../hooks/budget"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import TransactionForm from "./TransactionForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Category, Transaction } from "@/context/FinanceContext";
import { getCategoryColor } from "@/utils";

const TransactionList: React.FC = () => {
  const { data: transactionsData = [] } = useTransactions();
  const { data: categoriesData = [] } = useCategories();
  const deleteTransactionMutation = useDeleteTransaction();
  const transactions: Transaction[] = Array.isArray(transactionsData)
  ? transactionsData.flat()
    : Object.values(transactionsData ?? {}).flat();
    const Categories: Category[] = Array.isArray(categoriesData)
  ? categoriesData.flat()
  : Object.values(categoriesData ?? {}).flat();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete)
    {
      console.log(transactionToDelete); 
      deleteTransactionMutation.mutate(transactionToDelete);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleEditClick = (id: string) => {
    setSelectedTransaction(id); 
    setIsEditDialogOpen(true);
    console.log(selectedTransaction);
  };

  const getCategory = (id: string) => Categories.find((cat) => cat.id === id);
  const sortedTransactions = [...transactions].sort(
    (a, b) => (b.month) - (a.month)
  );

  // console.log(sortedTransactions); 
  return (
    <div className="rounded-xl border bg-card">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => {
                // console.log(transaction.id); 
                const category = getCategory(transaction.category?.id);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                    {transaction.month} {transaction.year}
                    </TableCell>
                    <TableCell>{transaction?.description || "No description"}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getCategoryColor(category.name) }}></div>
                        {category?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                      {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(transaction?.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(transaction.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <TransactionForm
            transactionId={selectedTransaction || undefined}
            onComplete={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the transaction from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionList;
