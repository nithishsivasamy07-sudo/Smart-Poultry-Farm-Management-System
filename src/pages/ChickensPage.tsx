import { useState } from "react";
import { useFarmData, ChickenBatch } from "@/contexts/FarmDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

const ChickensPage = () => {
  const { batches, addBatch, updateBatch, deleteBatch } = useFarmData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ChickenBatch | null>(null);
  const [form, setForm] = useState({ breed: "", quantity: "", arrivalDate: "", age: "" });

  const resetForm = () => { setForm({ breed: "", quantity: "", arrivalDate: "", age: "" }); setEditing(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { breed: form.breed, quantity: Number(form.quantity), arrivalDate: form.arrivalDate, age: Number(form.age) };
    if (editing) updateBatch({ ...data, id: editing.id });
    else addBatch(data);
    resetForm();
    setOpen(false);
  };

  const startEdit = (b: ChickenBatch) => {
    setEditing(b);
    setForm({ breed: b.breed, quantity: String(b.quantity), arrivalDate: b.arrivalDate, age: String(b.age) });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Chicken Batches</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your chicken inventory</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Batch</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Batch" : "Add New Batch"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Breed</Label><Input required value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Quantity</Label><Input required type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Arrival Date</Label><Input required type="date" value={form.arrivalDate} onChange={e => setForm(f => ({ ...f, arrivalDate: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Age (weeks)</Label><Input required type="number" min="0" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} /></div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Add"} Batch</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Breed</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Arrival Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Age (weeks)</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {batches.map(b => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{b.breed}</td>
                  <td className="px-4 py-3 text-foreground">{b.quantity}</td>
                  <td className="px-4 py-3 text-foreground">{b.arrivalDate}</td>
                  <td className="px-4 py-3 text-foreground">{b.age}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(b)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteBatch(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChickensPage;
