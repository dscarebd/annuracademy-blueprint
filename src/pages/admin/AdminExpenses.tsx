import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Edit, Trash2, Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  Expense,
  ExpenseInsert,
} from "@/hooks/useExpenses";

interface ExpenseFormData {
  name: string;
  amount: number;
  expense_date: string;
}

const emptyFormData: ExpenseFormData = {
  name: "",
  amount: 0,
  expense_date: format(new Date(), "yyyy-MM-dd"),
};

export default function AdminExpenses() {
  const { data: expenses, isLoading, error } = useExpenses();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const { toast } = useToast();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

  const handleSave = async (formData: ExpenseFormData) => {
    try {
      if (editingExpense) {
        await updateExpense.mutateAsync({
          id: editingExpense.id,
          ...formData,
        });
        toast({
          title: "সফল!",
          description: "ব্যয় আপডেট করা হয়েছে",
        });
      } else {
        await createExpense.mutateAsync(formData as ExpenseInsert);
        toast({
          title: "সফল!",
          description: "নতুন ব্যয় যোগ করা হয়েছে",
        });
      }
      setIsDialogOpen(false);
      setEditingExpense(null);
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "ব্যয় সেভ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExpense.mutateAsync(deleteId);
      toast({
        title: "সফল!",
        description: "ব্যয় ডিলিট করা হয়েছে",
      });
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "ব্যয় ডিলিট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-destructive">
          ব্যয় লোড করতে সমস্যা হয়েছে
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">ব্যয় ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">
              সকল ব্যয় দেখুন ও নতুন ব্যয় যোগ করুন
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingExpense(null)}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন ব্যয়
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? "ব্যয় এডিট করুন" : "নতুন ব্যয় যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <ExpenseForm
                expense={editingExpense}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={createExpense.isPending || updateExpense.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Expenses Card */}
        <Card className="p-6 bg-gradient-to-r from-red-500/10 to-red-500/5 border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">মোট ব্যয়</p>
              <p className="text-3xl font-bold text-red-600">
                ৳{totalExpenses.toLocaleString()}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        {/* Expenses Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            {expenses?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                এখনো কোনো ব্যয় নেই
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      নাম
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                      তারিখ
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                      পরিমাণ
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenses?.map((expense) => (
                    <tr key={expense.id} className="border-b last:border-0">
                      <td className="py-3 px-2 text-sm font-medium">
                        {expense.name}
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">
                        {format(new Date(expense.expense_date), "dd/MM/yyyy")}
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-medium text-red-600">
                        ৳{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingExpense(expense);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setDeleteId(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ব্যয় ডিলিট করতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              এই কাজটি ফিরিয়ে নেওয়া যাবে না। ব্যয়টি স্থায়ীভাবে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteExpense.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "ডিলিট করুন"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

function ExpenseForm({
  expense,
  onSave,
  onCancel,
  isLoading,
}: {
  expense: Expense | null;
  onSave: (data: ExpenseFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<ExpenseFormData>(
    expense
      ? {
          name: expense.name,
          amount: expense.amount,
          expense_date: expense.expense_date,
        }
      : emptyFormData
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>ব্যয়ের নাম</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="যেমন: অফিস ভাড়া"
        />
      </div>
      <div>
        <Label>পরিমাণ (৳)</Label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })
          }
        />
      </div>
      <div>
        <Label>তারিখ</Label>
        <Input
          type="date"
          value={formData.expense_date}
          onChange={(e) =>
            setFormData({ ...formData, expense_date: e.target.value })
          }
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          বাতিল
        </Button>
        <Button onClick={() => onSave(formData)} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          সেভ করুন
        </Button>
      </div>
    </div>
  );
}
