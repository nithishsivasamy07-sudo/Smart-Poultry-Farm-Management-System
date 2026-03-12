import { useFarmData } from "@/contexts/FarmDataContext";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const ProfitLossPage = () => {
  const { sales, expenses, feedRecords } = useFarmData();

  const totalSales = sales.reduce((s, r) => s + r.totalAmount, 0);
  const feedCost = feedRecords.filter(f => f.type === "stock").reduce((s, f) => s + f.cost, 0);
  const medicineCost = expenses.filter(e => e.category === "Medicine").reduce((s, e) => s + e.amount, 0);
  const operationalCost = expenses.filter(e => e.category === "Operations").reduce((s, e) => s + e.amount, 0);
  const otherExpenses = expenses.filter(e => !["Feed", "Medicine", "Operations"].includes(e.category)).reduce((s, e) => s + e.amount, 0);
  const totalExpenses = feedCost + medicineCost + operationalCost + otherExpenses;
  const profit = totalSales - totalExpenses;
  const isProfit = profit >= 0;

  const expenseBreakdown = [
    { name: "Feed", value: feedCost, color: "hsl(var(--chart-green))" },
    { name: "Medicine", value: medicineCost, color: "hsl(var(--chart-blue))" },
    { name: "Operations", value: operationalCost, color: "hsl(var(--chart-amber))" },
    { name: "Other", value: otherExpenses, color: "hsl(var(--chart-red))" },
  ].filter(e => e.value > 0);

  const summaryData = [
    { name: "Revenue", amount: totalSales },
    { name: "Expenses", amount: totalExpenses },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Profit & Loss</h1>
        <p className="text-sm text-muted-foreground mt-1">Financial summary of your farm</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-heading font-bold text-foreground mt-1">₹{totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-heading font-bold text-foreground mt-1">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className={`rounded-xl shadow-card border p-5 ${isProfit ? "bg-accent border-primary/20" : "bg-destructive/10 border-destructive/20"}`}>
          <div className="flex items-center gap-2">
            {isProfit ? <TrendingUp className="w-5 h-5 text-primary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
            <p className="text-sm text-muted-foreground">{isProfit ? "Net Profit" : "Net Loss"}</p>
          </div>
          <p className={`text-2xl font-heading font-bold mt-1 ${isProfit ? "text-primary" : "text-destructive"}`}>₹{Math.abs(profit).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses bar */}
        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                <Cell fill="hsl(var(--primary))" />
                <Cell fill="hsl(var(--chart-red))" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense breakdown pie */}
        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                {expenseBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {expenseBreakdown.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
                {e.name}: ₹{e.value.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense details table */}
      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">Expense Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
            </tr></thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{e.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.description}</td>
                  <td className="px-4 py-3 text-foreground">{e.date}</td>
                  <td className="px-4 py-3 font-medium text-foreground">₹{e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossPage;
