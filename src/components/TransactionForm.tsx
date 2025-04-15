import React, { useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { dataTagErrorSymbol } from "@tanstack/react-query";

// Form validation schema
const formSchema = z.object({
  amount: z.coerce.number().refine((val) => val !== 0, {
    message: "Amount cannot be zero",
  }),
  description: z.string().min(2, "Description must be at least 2 characters"),
  date: z.date(), // not passed to backend, only used for display
  categoryId: z.string().min(1, "Please select a category"),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transactionId?: string;
  onComplete?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transactionId,
  onComplete,
}) => {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
  } = useFinance();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date(),
      categoryId: "",
    },
  });

  // Load transaction data if editing
  useEffect(() => {
    if (transactionId) {
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
        form.reset({
          amount: transaction.amount,
          description: transaction.description,
          date: new Date(), // we use current date, since date is not used in mutation
          categoryId: transaction.category.id,
        });
      }
    }
  }, [transactionId, transactions, form]); 
  const onSubmit = async (data: FormValues) => {
    try
    {
      console.log(data); 
      console.log(transactionId); 
      if (transactionId) {
        updateTransaction(transactionId , {
          amount: data.amount,
          description: data.description, 
          categoryId : data.categoryId
        });
        toast({
          title: "Transaction updated",
          description: "Your transaction has been updated successfully.",
        });
      } else {
        await addTransaction({
          amount: data.amount,
          description: data.description,
          categoryId : data.categoryId,
        });
        toast({
          title: "Transaction added",
          description: "Your transaction has been added successfully.",
        });
        form.reset({
          amount: 0,
          description: "",
          date: new Date(),
          categoryId: "",
        });
      }
      if (onComplete) onComplete();
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
        {transactionId ? "Edit Transaction" : "Add Transaction"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <Input
                      placeholder="0.00"
                      className="pl-7"
                      {...field}
                      type="number"
                      step="0.01"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Grocery shopping" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
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

          <div className="flex gap-3 pt-2">
            {onComplete && (
              <Button type="button" variant="outline" onClick={onComplete}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {transactionId ? "Update Transaction" : "Add Transaction"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
