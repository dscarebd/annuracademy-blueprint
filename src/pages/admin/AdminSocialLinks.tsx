import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Edit, Trash2, Loader2, Facebook, Youtube, Send, Mail, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminSocialLinks,
  useCreateSocialLink,
  useUpdateSocialLink,
  useDeleteSocialLink,
  SocialLink,
  SocialLinkInsert,
} from "@/hooks/useSocialLinks";

const iconOptions = [
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "Youtube", label: "YouTube", icon: Youtube },
  { value: "Send", label: "Telegram", icon: Send },
  { value: "Mail", label: "Email", icon: Mail },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Twitter", label: "Twitter/X", icon: Twitter },
];

const colorOptions = [
  { value: "bg-blue-600 hover:bg-blue-700", label: "Blue (Facebook)" },
  { value: "bg-red-600 hover:bg-red-700", label: "Red (YouTube)" },
  { value: "bg-sky-500 hover:bg-sky-600", label: "Sky (Telegram)" },
  { value: "bg-emerald-600 hover:bg-emerald-700", label: "Green (Email)" },
  { value: "bg-pink-600 hover:bg-pink-700", label: "Pink (Instagram)" },
  { value: "bg-gray-800 hover:bg-gray-900", label: "Dark (Twitter/X)" },
];

interface SocialLinkFormData {
  name: string;
  icon: string;
  url: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

const emptyFormData: SocialLinkFormData = {
  name: "",
  icon: "Facebook",
  url: "",
  color: "bg-blue-600 hover:bg-blue-700",
  sort_order: 0,
  is_active: true,
};

export default function AdminSocialLinks() {
  const { data: socialLinks, isLoading, error } = useAdminSocialLinks();
  const createSocialLink = useCreateSocialLink();
  const updateSocialLink = useUpdateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();
  const { toast } = useToast();

  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (formData: SocialLinkFormData) => {
    try {
      if (editingLink) {
        await updateSocialLink.mutateAsync({
          id: editingLink.id,
          ...formData,
        });
        toast({
          title: "সফল!",
          description: "সোশ্যাল লিংক আপডেট করা হয়েছে",
        });
      } else {
        await createSocialLink.mutateAsync(formData as SocialLinkInsert);
        toast({
          title: "সফল!",
          description: "নতুন সোশ্যাল লিংক যোগ করা হয়েছে",
        });
      }
      setIsDialogOpen(false);
      setEditingLink(null);
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "সোশ্যাল লিংক সেভ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSocialLink.mutateAsync(deleteId);
      toast({
        title: "সফল!",
        description: "সোশ্যাল লিংক ডিলিট করা হয়েছে",
      });
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "সোশ্যাল লিংক ডিলিট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName);
    return iconOption?.icon || Facebook;
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
          সোশ্যাল লিংক লোড করতে সমস্যা হয়েছে
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">সোশ্যাল মিডিয়া লিংক</h2>
            <p className="text-muted-foreground">
              সোশ্যাল মিডিয়া লিংকগুলো ম্যানেজ করুন
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingLink(null)}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন লিংক
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLink ? "লিংক এডিট করুন" : "নতুন লিংক যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <SocialLinkForm
                link={editingLink}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={createSocialLink.isPending || updateSocialLink.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks?.map((link) => {
            const IconComponent = getIconComponent(link.icon);
            return (
              <Card key={link.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg text-white ${link.color.split(' ')[0]}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{link.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${link.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-muted-foreground">Order: {link.sort_order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingLink(link);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>লিংক ডিলিট করতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              এই কাজটি ফিরিয়ে নেওয়া যাবে না। লিংকটি স্থায়ীভাবে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteSocialLink.isPending ? (
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

function SocialLinkForm({
  link,
  onSave,
  onCancel,
  isLoading,
}: {
  link: SocialLink | null;
  onSave: (data: SocialLinkFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<SocialLinkFormData>(
    link
      ? {
          name: link.name,
          icon: link.icon,
          url: link.url,
          color: link.color,
          sort_order: link.sort_order,
          is_active: link.is_active,
        }
      : emptyFormData
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>নাম</Label>
        <Input
          value={formData.name}
          placeholder="Facebook"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Label>আইকন</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
        >
          {iconOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>URL</Label>
        <Input
          value={formData.url}
          placeholder="https://facebook.com/yourpage"
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
      </div>
      <div>
        <Label>কালার</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        >
          {colorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>সর্ট অর্ডার</Label>
        <Input
          type="number"
          value={formData.sort_order}
          onChange={(e) =>
            setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
          }
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">সক্রিয়</Label>
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
