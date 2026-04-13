import { useState } from "react";
import { useFarmData } from "@/contexts/FarmDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const SalesPage = () => {
  const { sales, addSale } = useFarmData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", productType: "Eggs" as "Eggs" | "Chicken", quantity: "", price: "" });

  const totalRevenue = sales.reduce((s, r) => s + r.totalAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(form.quantity);
    const price = Number(form.price);
    addSale({ date: form.date, productType: form.productType, quantity: qty, price, totalAmount: qty * price });
    setForm({ date: "", productType: "Eggs", quantity: "", price: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Sales Report</h1>
          <p className="text-sm text-muted-foreground mt-1">Total revenue: <span className="font-semibold text-foreground">₹{totalRevenue.toLocaleString()}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Record Sale</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Sale</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Date</Label><Input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={form.productType} onValueChange={(v: "Eggs" | "Chicken") => setForm(f => ({ ...f, productType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eggs">Eggs</SelectItem>
                    <SelectItem value="Chicken">Chicken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Quantity</Label><Input required type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Price per Unit (₹)</Label><Input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Record Sale</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Qty</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total</th>
            </tr></thead>
            <tbody>
              {sales.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{r.date}</td>
                  <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${r.productType === "Eggs" ? "bg-secondary/20 text-secondary" : "bg-accent text-accent-foreground"}`}>{r.productType}</span></td>
                  <td className="px-4 py-3 text-foreground">{r.quantity}</td>
                  <td className="px-4 py-3 text-foreground">₹{r.price.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-foreground">₹{r.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
