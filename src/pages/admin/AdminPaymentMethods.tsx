import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, CreditCard, Upload, X, Image } from "lucide-react";
import {
  useAllPaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
  PaymentMethod,
} from "@/hooks/usePaymentMethods";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const colorOptions = [
  { value: "bg-pink-500", label: "পিংক" },
  { value: "bg-orange-500", label: "কমলা" },
  { value: "bg-purple-600", label: "বেগুনি" },
  { value: "bg-blue-500", label: "নীল" },
  { value: "bg-green-500", label: "সবুজ" },
  { value: "bg-red-500", label: "লাল" },
  { value: "bg-yellow-500", label: "হলুদ" },
  { value: "bg-teal-500", label: "টিল" },
];

const AdminPaymentMethods = () => {
  const { data: paymentMethods, isLoading } = useAllPaymentMethods();
  const createPaymentMethod = useCreatePaymentMethod();
  const updatePaymentMethod = useUpdatePaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    color: "bg-pink-500",
    is_active: true,
    sort_order: 0,
    icon_url: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      number: "",
      color: "bg-pink-500",
      is_active: true,
      sort_order: 0,
      icon_url: "",
    });
    setEditingMethod(null);
  };

  const openEditDialog = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      number: method.number,
      color: method.color,
      is_active: method.is_active,
      sort_order: method.sort_order,
      icon_url: method.icon_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "শুধুমাত্র ইমেজ ফাইল আপলোড করুন",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "ফাইল সাইজ ২MB এর বেশি হতে পারবে না",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('payment-icons')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-icons')
        .getPublicUrl(filePath);

      setFormData({ ...formData, icon_url: publicUrl });
      toast({ title: "আইকন আপলোড হয়েছে" });
    } catch (error: any) {
      toast({
        title: "আইকন আপলোড ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeIcon = () => {
    setFormData({ ...formData, icon_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMethod) {
      await updatePaymentMethod.mutateAsync({
        id: editingMethod.id,
        ...formData,
      });
    } else {
      await createPaymentMethod.mutateAsync(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত এই পেমেন্ট মেথড মুছে ফেলতে চান?")) {
      await deletePaymentMethod.mutateAsync(id);
    }
  };

  const toggleActive = async (method: PaymentMethod) => {
    await updatePaymentMethod.mutateAsync({
      id: method.id,
      is_active: !method.is_active,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">পেমেন্ট মেথড</h1>
            <p className="text-muted-foreground">
              চেকআউট পেজে প্রদর্শিত পেমেন্ট মেথডগুলো পরিচালনা করুন
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                নতুন পেমেন্ট মেথড
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMethod ? "পেমেন্ট মেথড সম্পাদনা" : "নতুন পেমেন্ট মেথড"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">নাম</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: বিকাশ"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="number">নম্বর</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>

                {/* Icon Upload Section */}
                <div>
                  <Label>আইকন (ঐচ্ছিক)</Label>
                  <div className="mt-2">
                    {formData.icon_url ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.icon_url}
                          alt="Payment icon"
                          className="w-20 h-20 object-contain rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeIcon}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                      >
                        {isUploading ? (
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                            <span className="text-sm text-muted-foreground">আইকন আপলোড করুন</span>
                            <span className="text-xs text-muted-foreground">PNG, JPG (সর্বোচ্চ 2MB)</span>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="color">ফলব্যাক রঙ (আইকন না থাকলে)</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`h-10 rounded-md ${color.value} ${
                          formData.color === color.value
                            ? "ring-2 ring-offset-2 ring-foreground"
                            : ""
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="sort_order">ক্রম</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">সক্রিয়</Label>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createPaymentMethod.isPending || updatePaymentMethod.isPending}
                >
                  {(createPaymentMethod.isPending || updatePaymentMethod.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingMethod ? "আপডেট করুন" : "যোগ করুন"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : paymentMethods && paymentMethods.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>আইকন</TableHead>
                  <TableHead>নাম</TableHead>
                  <TableHead>নম্বর</TableHead>
                  <TableHead>ক্রম</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell>
                      {method.icon_url ? (
                        <img
                          src={method.icon_url}
                          alt={method.name}
                          className="w-10 h-10 object-contain rounded-lg"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full ${method.color} flex items-center justify-center text-white font-bold`}>
                          {method.name.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell>{method.number}</TableCell>
                    <TableCell>{method.sort_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={method.is_active}
                        onCheckedChange={() => toggleActive(method)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(method)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(method.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">কোনো পেমেন্ট মেথড নেই</h3>
              <p className="text-muted-foreground">
                নতুন পেমেন্ট মেথড যোগ করুন
              </p>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentMethods;
