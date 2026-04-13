import { useState } from "react";
import { useFarmData } from "@/contexts/FarmDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const EggsPage = () => {
  const { eggRecords, addEggRecord } = useFarmData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", batchId: "", numberOfEggs: "" });

  const totalEggs = eggRecords.reduce((s, r) => s + r.numberOfEggs, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEggRecord({ date: form.date, batchId: form.batchId, numberOfEggs: Number(form.numberOfEggs) });
    setForm({ date: "", batchId: "", numberOfEggs: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Egg Production</h1>
          <p className="text-sm text-muted-foreground mt-1">Total eggs recorded: <span className="font-semibold text-foreground">{totalEggs.toLocaleString()}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Entry</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Egg Production</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Date</Label><Input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Batch ID</Label><Input required value={form.batchId} onChange={e => setForm(f => ({ ...f, batchId: e.target.value }))} placeholder="e.g. Batch-1" /></div>
              <div className="space-y-2"><Label>Number of Eggs</Label><Input required type="number" min="0" value={form.numberOfEggs} onChange={e => setForm(f => ({ ...f, numberOfEggs: e.target.value }))} /></div>
              <Button type="submit" className="w-full">Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Batch ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Eggs</th>
            </tr></thead>
            <tbody>
              {eggRecords.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{r.date}</td>
                  <td className="px-4 py-3 text-foreground">{r.batchId}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.numberOfEggs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EggsPage;
