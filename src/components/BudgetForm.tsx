import React, { useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getCategoryColor } from "@/utils";

const formSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  amount: z.coerce.number().min(0, "Budget amount cannot be negative"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  budgetId?: string;
  onComplete?: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budgetId, onComplete }) => {
  const { categories, budgets, addBudget, updateBudget } = useFinance();

  // Generate current month in YYYY-MM format
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  // Generate previous and next months
  const getMonthOptions = () => {
    const options = [];
    for (let i = -2; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() + i);
      const monthValue = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      options.push({ value: monthValue, label: monthLabel });
    }
    return options;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      amount: 0,
      month: currentMonth,
    },
  });

  // Load budget data if editing
  useEffect(() => {
    if (budgetId) {
      const budget = budgets.find((b) => b.id === budgetId);
      if (budget) {
        const monthStr = `${budget.year}-${String(budget.month).padStart(2, "0")}`;
        form.reset({
          categoryId: budget.categoryId,
          amount: budget.amount,
          month: monthStr,
        });
      }
    }
  }, [budgetId, budgets, form]);

  const onSubmit = (data: FormValues) => {
    try {
      // Parse year and month from the YYYY-MM string
      const [yearStr, monthStr] = data.month.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      // Check if a budget already exists for this category and month/year
      const existingBudget = budgets.find(
        (b) =>
          b.categoryId === data.categoryId &&
          b.year === year &&
          b.month === month &&
          b.id !== budgetId
      );

      if (existingBudget) {
        toast({
          title: "Budget already exists",
          description: "A budget for this category and month already exists",
          variant: "destructive",
        });
        return;
      }

      if (budgetId) {
        updateBudget({
          id: budgetId,
          amount: data.amount,
          categoryId: data.categoryId,
          month, 
          year,
        });
        toast({
          title: "Budget updated",
          description: "Your budget has been updated successfully",
        });
      } else {
        addBudget({
          categoryId: data.categoryId,
          amount: data.amount,
          year,
          month,
        });
        toast({
          title: "Budget added",
          description: "Your budget has been added successfully",
        });
        // Reset form after adding
        form.reset({
          categoryId: "",
          amount: 0,
          month: currentMonth,
        });
      }
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {budgetId ? "Edit Budget" : "Add Budget"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getMonthOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories
                      .filter((c) => c.id !== "income") // Exclude income category
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: getCategoryColor(category.name)}}
                            ></div>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <Input
                      placeholder="0.00"
                      className="pl-7"
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-2">
            {onComplete && (
              <Button type="button" variant="outline" onClick={onComplete}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {budgetId ? "Update Budget" : "Add Budget"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BudgetForm;