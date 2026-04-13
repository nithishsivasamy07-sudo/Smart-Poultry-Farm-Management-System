import { useState } from "react";
import { useFarmData } from "@/contexts/FarmDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const FeedPage = () => {
  const { feedRecords, addFeedRecord } = useFarmData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ feedType: "", quantity: "", date: "", cost: "", type: "stock" as "stock" | "consumption" });

  const totalStock = feedRecords.filter(f => f.type === "stock").reduce((s, f) => s + f.quantity, 0);
  const totalConsumed = feedRecords.filter(f => f.type === "consumption").reduce((s, f) => s + f.quantity, 0);
  const remaining = totalStock - totalConsumed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedRecord({ feedType: form.feedType, quantity: Number(form.quantity), date: form.date, cost: Number(form.cost), type: form.type });
    setForm({ feedType: "", quantity: "", date: "", cost: "", type: "stock" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Feed Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Remaining stock: <span className="font-semibold text-foreground">{remaining} kg</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Record</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Feed Record</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v: "stock" | "consumption") => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock In</SelectItem>
                    <SelectItem value="consumption">Consumption</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Feed Type</Label><Input required value={form.feedType} onChange={e => setForm(f => ({ ...f, feedType: e.target.value }))} placeholder="e.g. Layer Mash" /></div>
              <div className="space-y-2"><Label>Quantity (kg)</Label><Input required type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Date</Label><Input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Cost (₹)</Label><Input type="number" min="0" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Add Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Feed</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Qty (kg)</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cost</th>
            </tr></thead>
            <tbody>
              {feedRecords.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${r.type === "stock" ? "bg-accent text-accent-foreground" : "bg-secondary/20 text-secondary"}`}>{r.type === "stock" ? "Stock In" : "Used"}</span></td>
                  <td className="px-4 py-3 text-foreground">{r.feedType}</td>
                  <td className="px-4 py-3 text-foreground">{r.quantity}</td>
                  <td className="px-4 py-3 text-foreground">{r.date}</td>
                  <td className="px-4 py-3 text-foreground">₹{r.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
