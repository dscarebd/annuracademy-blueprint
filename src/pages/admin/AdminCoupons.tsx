import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Tag } from "lucide-react";
import {
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  Coupon,
  CouponInsert,
} from "@/hooks/useCoupons";
import { format } from "date-fns";

const defaultCoupon: CouponInsert = {
  code: "",
  discount_type: "percentage",
  discount_value: 0,
  min_order_amount: 0,
  max_uses: null,
  is_active: true,
  expires_at: null,
};

const AdminCoupons = () => {
  const { toast } = useToast();
  const { data: coupons, isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponInsert>(defaultCoupon);

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount,
        max_uses: coupon.max_uses,
        is_active: coupon.is_active,
        expires_at: coupon.expires_at,
      });
    } else {
      setEditingCoupon(null);
      setFormData(defaultCoupon);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      toast({ title: "কুপন কোড দিন", variant: "destructive" });
      return;
    }

    if (formData.discount_value <= 0) {
      toast({ title: "ডিসকাউন্ট ভ্যালু দিন", variant: "destructive" });
      return;
    }

    try {
      if (editingCoupon) {
        await updateCoupon.mutateAsync({ id: editingCoupon.id, ...formData });
        toast({ title: "কুপন আপডেট হয়েছে" });
      } else {
        await createCoupon.mutateAsync(formData);
        toast({ title: "কুপন তৈরি হয়েছে" });
      }
      setIsDialogOpen(false);
      setFormData(defaultCoupon);
      setEditingCoupon(null);
    } catch (error: any) {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;

    try {
      await deleteCoupon.mutateAsync(id);
      toast({ title: "কুপন ডিলিট হয়েছে" });
    } catch (error: any) {
      toast({
        title: "ডিলিট করতে সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">কুপন ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">ডিসকাউন্ট কুপন তৈরি ও ম্যানেজ করুন</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                নতুন কুপন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? "কুপন এডিট করুন" : "নতুন কুপন"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>কুপন কোড *</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="SAVE20"
                    className="uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ডিসকাউন্ট টাইপ</Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, discount_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">শতাংশ (%)</SelectItem>
                        <SelectItem value="fixed">নির্দিষ্ট (৳)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ডিসকাউন্ট ভ্যালু *</Label>
                    <Input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) =>
                        setFormData({ ...formData, discount_value: Number(e.target.value) })
                      }
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>সর্বনিম্ন অর্ডার (৳)</Label>
                    <Input
                      type="number"
                      value={formData.min_order_amount || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_order_amount: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>সর্বোচ্চ ব্যবহার</Label>
                    <Input
                      type="number"
                      value={formData.max_uses || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_uses: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="সীমাহীন"
                    />
                  </div>
                </div>

                <div>
                  <Label>মেয়াদ শেষ</Label>
                  <Input
                    type="date"
                    value={formData.expires_at || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expires_at: e.target.value || null,
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active ?? true}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                  <Label>সক্রিয়</Label>
                </div>

                <Button type="submit" className="w-full" disabled={createCoupon.isPending || updateCoupon.isPending}>
                  {(createCoupon.isPending || updateCoupon.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingCoupon ? "আপডেট করুন" : "তৈরি করুন"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : coupons && coupons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কোড</TableHead>
                  <TableHead>ডিসকাউন্ট</TableHead>
                  <TableHead>ব্যবহার</TableHead>
                  <TableHead>মেয়াদ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="font-mono font-semibold">{coupon.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : `${coupon.discount_value}৳`}
                    </TableCell>
                    <TableCell>
                      {coupon.used_count || 0}
                      {coupon.max_uses ? `/${coupon.max_uses}` : ""}
                    </TableCell>
                    <TableCell>
                      {coupon.expires_at
                        ? format(new Date(coupon.expires_at), "dd/MM/yyyy")
                        : "সীমাহীন"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          coupon.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(coupon)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(coupon.id)}
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
            <div className="text-center py-12 text-muted-foreground">
              কোনো কুপন নেই
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
