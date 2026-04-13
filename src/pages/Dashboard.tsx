import { useFarmData } from "@/contexts/FarmDataContext";
import { Bird, Egg, Wheat, ShoppingCart, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <div className="bg-card rounded-xl shadow-card border border-border p-5 animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-heading font-bold text-foreground mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { batches, eggRecords, feedRecords, sales, expenses } = useFarmData();

  const totalChickens = batches.reduce((sum, b) => sum + b.quantity, 0);
  const todayEggs = eggRecords.filter(r => r.date === "2026-03-11").reduce((sum, r) => sum + r.numberOfEggs, 0);

  const totalFeedStock = feedRecords
    .filter(f => f.type === "stock").reduce((s, f) => s + f.quantity, 0) -
    feedRecords.filter(f => f.type === "consumption").reduce((s, f) => s + f.quantity, 0);

  const totalSalesAmount = sales.reduce((s, r) => s + r.totalAmount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalSalesAmount - totalExpenses;

  // Egg production chart data
  const eggChartData = eggRecords.reduce((acc, r) => {
    const existing = acc.find(a => a.date === r.date);
    if (existing) existing.eggs += r.numberOfEggs;
    else acc.push({ date: r.date.slice(5), eggs: r.numberOfEggs });
    return acc;
  }, [] as { date: string; eggs: number }[]);

  // Sales chart data
  const salesChartData = sales.reduce((acc, s) => {
    const existing = acc.find(a => a.date === s.date.slice(5));
    if (existing) existing.amount += s.totalAmount;
    else acc.push({ date: s.date.slice(5), amount: s.totalAmount });
    return acc;
  }, [] as { date: string; amount: number }[]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Farm Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Today's summary of your poultry farm</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Chickens" value={totalChickens.toLocaleString()} icon={Bird} color="bg-accent text-accent-foreground" />
        <StatCard title="Today's Eggs" value={todayEggs} icon={Egg} color="bg-secondary/20 text-secondary" />
        <StatCard title="Feed Stock (kg)" value={totalFeedStock} icon={Wheat} color="bg-accent text-accent-foreground" />
        <StatCard title="Total Sales" value={`₹${totalSalesAmount.toLocaleString()}`} icon={ShoppingCart} color="bg-secondary/20 text-secondary" />
        <StatCard
          title={profit >= 0 ? "Profit" : "Loss"}
          value={`₹${Math.abs(profit).toLocaleString()}`}
          icon={profit >= 0 ? TrendingUp : TrendingDown}
          color={profit >= 0 ? "bg-accent text-accent-foreground" : "bg-destructive/20 text-destructive"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Egg Production Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={eggChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Bar dataKey="eggs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-border p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Line type="monotone" dataKey="amount" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--secondary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
