import React, { useState } from "react";
import Layout from "@/components/Layout";
import BudgetChart from "@/components/BudgetChart";
import BudgetForm from "@/components/BudgetForm";
import { Category, FinanceProvider, useFinance } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCategoryColor } from "@/utils";

// BudgetTableBody component to fix the type issue
const BudgetTableBody = () => {
  const { budgets, getCategory } = useFinance();
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  if (budgets.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
          No budgets set. Click "Add Budget" to create your first budget.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {[...budgets]
        .sort((a, b) => {
          if (a.month !== b.month) {
            return b.month - a.month;
          }
          const categoryA = getCategory(a.categoryId)?.name || "";
          const categoryB = getCategory(b.categoryId)?.name || "";
          return categoryA.localeCompare(categoryB);
        })
        .map((budget) => {
          const category = getCategory(budget.category.id);
          // console.log(budget.category.id)// ✅ FIXED here
          const year = budget.year;
          const month = budget.month;
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          const monthName = monthNames[month - 1];

          return (
            <TableRow key={budget.id}>
              <TableCell>{monthName} {year}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(category.name) }}
                  ></div>
                  {category?.name || "Unknown Category"}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${budget.amount}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedBudget(budget.id);
                      setIsDialogOpen(true);
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setBudgetToDelete(budget.id);
                        setIsDeleteDialogOpen(true);
                      }}
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

      {/* Add/Edit Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <BudgetForm
            budgetId={selectedBudget || undefined}
            onComplete={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (budgetToDelete) {
                  setBudgetToDelete(null);
                }
              }}
              className="bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Budget = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  return (
    <FinanceProvider>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Budget</h1>
            <Button onClick={() => {
              setSelectedBudget(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </div>

          <BudgetChart />

          <div className="rounded-xl border bg-card">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Budget Settings</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <BudgetTableBody />
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Add Budget Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <BudgetForm
                budgetId={selectedBudget || undefined}
                onComplete={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </FinanceProvider>
  );
};

export default Budget;
