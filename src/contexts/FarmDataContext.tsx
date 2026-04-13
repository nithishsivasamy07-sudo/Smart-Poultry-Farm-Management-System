import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface ChickenBatch {
  id: string;
  breed: string;
  quantity: number;
  arrivalDate: string;
  age: number;
}

export interface EggRecord {
  id: string;
  date: string;
  batchId: string;
  numberOfEggs: number;
}

export interface FeedRecord {
  id: string;
  feedType: string;
  quantity: number;
  date: string;
  cost: number;
  type: "stock" | "consumption";
}

export interface HealthRecord {
  id: string;
  batchId: string;
  disease: string;
  medicine: string;
  vaccinationDate: string;
  notes: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  productType: "Eggs" | "Chicken";
  quantity: number;
  price: number;
  totalAmount: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface FarmDataContextType {
  batches: ChickenBatch[];
  addBatch: (b: Omit<ChickenBatch, "id">) => Promise<void>;
  updateBatch: (b: ChickenBatch) => Promise<void>;
  deleteBatch: (id: string) => Promise<void>;
  eggRecords: EggRecord[];
  addEggRecord: (r: Omit<EggRecord, "id">) => Promise<void>;
  feedRecords: FeedRecord[];
  addFeedRecord: (r: Omit<FeedRecord, "id">) => Promise<void>;
  healthRecords: HealthRecord[];
  addHealthRecord: (r: Omit<HealthRecord, "id">) => Promise<void>;
  sales: SaleRecord[];
  addSale: (s: Omit<SaleRecord, "id">) => Promise<void>;
  expenses: Expense[];
  addExpense: (e: Omit<Expense, "id">) => Promise<void>;
  loading: boolean;
}

const FarmDataContext = createContext<FarmDataContextType | null>(null);

export const useFarmData = () => {
  const ctx = useContext(FarmDataContext);
  if (!ctx) throw new Error("useFarmData must be within FarmDataProvider");
  return ctx;
};

export const FarmDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<ChickenBatch[]>([]);
  const [eggRecords, setEggRecords] = useState<EggRecord[]>([]);
  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      supabase.from("chicken_batches").select("*").eq("user_id", userId),
      supabase.from("egg_production").select("*").eq("user_id", userId),
      supabase.from("feed_management").select("*").eq("user_id", userId),
      supabase.from("health_records").select("*").eq("user_id", userId),
      supabase.from("sales").select("*").eq("user_id", userId),
      supabase.from("expenses").select("*").eq("user_id", userId),
    ]).then(([b, e, f, h, s, ex]) => {
      setBatches((b.data || []).map(r => ({ id: r.id, breed: r.breed, quantity: r.quantity, arrivalDate: r.arrival_date, age: r.age })));
      setEggRecords((e.data || []).map(r => ({ id: r.id, date: r.date, batchId: r.batch_id, numberOfEggs: r.number_of_eggs })));
      setFeedRecords((f.data || []).map(r => ({ id: r.id, feedType: r.feed_type, quantity: Number(r.quantity), date: r.date, cost: Number(r.cost), type: r.type as "stock" | "consumption" })));
      setHealthRecords((h.data || []).map(r => ({ id: r.id, batchId: r.batch_id, disease: r.disease, medicine: r.medicine, vaccinationDate: r.vaccination_date, notes: r.notes || "" })));
      setSales((s.data || []).map(r => ({ id: r.id, date: r.date, productType: r.product_type as "Eggs" | "Chicken", quantity: r.quantity, price: Number(r.price), totalAmount: Number(r.total_amount) })));
      setExpenses((ex.data || []).map(r => ({ id: r.id, category: r.category, amount: Number(r.amount), date: r.date, description: r.description || "" })));
      setLoading(false);
    });
  }, [userId]);

  const addBatch = useCallback(async (b: Omit<ChickenBatch, "id">) => {
    const { data, error } = await supabase.from("chicken_batches").insert({ user_id: userId!, breed: b.breed, quantity: b.quantity, arrival_date: b.arrivalDate, age: b.age }).select().single();
    if (!error && data) setBatches(p => [...p, { id: data.id, breed: data.breed, quantity: data.quantity, arrivalDate: data.arrival_date, age: data.age }]);
  }, [userId]);

  const updateBatch = useCallback(async (b: ChickenBatch) => {
    const { error } = await supabase.from("chicken_batches").update({ breed: b.breed, quantity: b.quantity, arrival_date: b.arrivalDate, age: b.age }).eq("id", b.id);
    if (!error) setBatches(p => p.map(x => x.id === b.id ? b : x));
  }, []);

  const deleteBatch = useCallback(async (id: string) => {
    const { error } = await supabase.from("chicken_batches").delete().eq("id", id);
    if (!error) setBatches(p => p.filter(x => x.id !== id));
  }, []);

  const addEggRecord = useCallback(async (r: Omit<EggRecord, "id">) => {
    const { data, error } = await supabase.from("egg_production").insert({ user_id: userId!, date: r.date, batch_id: r.batchId, number_of_eggs: r.numberOfEggs }).select().single();
    if (!error && data) setEggRecords(p => [...p, { id: data.id, date: data.date, batchId: data.batch_id, numberOfEggs: data.number_of_eggs }]);
  }, [userId]);

  const addFeedRecord = useCallback(async (r: Omit<FeedRecord, "id">) => {
    const { data, error } = await supabase.from("feed_management").insert({ user_id: userId!, feed_type: r.feedType, quantity: r.quantity, date: r.date, cost: r.cost, type: r.type }).select().single();
    if (!error && data) setFeedRecords(p => [...p, { id: data.id, feedType: data.feed_type, quantity: Number(data.quantity), date: data.date, cost: Number(data.cost), type: data.type as "stock" | "consumption" }]);
  }, [userId]);

  const addHealthRecord = useCallback(async (r: Omit<HealthRecord, "id">) => {
    const { data, error } = await supabase.from("health_records").insert({ user_id: userId!, batch_id: r.batchId, disease: r.disease, medicine: r.medicine, vaccination_date: r.vaccinationDate, notes: r.notes }).select().single();
    if (!error && data) setHealthRecords(p => [...p, { id: data.id, batchId: data.batch_id, disease: data.disease, medicine: data.medicine, vaccinationDate: data.vaccination_date, notes: data.notes || "" }]);
  }, [userId]);

  const addSale = useCallback(async (s: Omit<SaleRecord, "id">) => {
    const { data, error } = await supabase.from("sales").insert({ user_id: userId!, date: s.date, product_type: s.productType, quantity: s.quantity, price: s.price, total_amount: s.totalAmount }).select().single();
    if (!error && data) setSales(p => [...p, { id: data.id, date: data.date, productType: data.product_type as "Eggs" | "Chicken", quantity: data.quantity, price: Number(data.price), totalAmount: Number(data.total_amount) }]);
  }, [userId]);

  const addExpense = useCallback(async (e: Omit<Expense, "id">) => {
    const { data, error } = await supabase.from("expenses").insert({ user_id: userId!, category: e.category, amount: e.amount, date: e.date, description: e.description }).select().single();
    if (!error && data) setExpenses(p => [...p, { id: data.id, category: data.category, amount: Number(data.amount), date: data.date, description: data.description || "" }]);
  }, [userId]);

  return (
    <FarmDataContext.Provider value={{
      batches, addBatch, updateBatch, deleteBatch,
      eggRecords, addEggRecord,
      feedRecords, addFeedRecord,
      healthRecords, addHealthRecord,
      sales, addSale,
      expenses, addExpense,
      loading,
    }}>
      {children}
    </FarmDataContext.Provider>
  );
};
