import { login } from "./api/authApi";
import { useState, useMemo, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  type Product,
  type ProductRequest,
} from "./api/productApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type Module = "dashboard" | "products" | "warehouses" | "inventory" | "orders" | "demand" | "alerts" | "users" | "api";
type IconComponent = () => React.ReactElement;

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon: Record<string, IconComponent> = {
  dashboard: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  product:   () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  warehouse: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  inventory: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  order:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  demand:    () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  alert:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  users:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  api:       () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  logout:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:         () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  search:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chip:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="6" height="6"/><path d="M15 2v3M9 2v3M2 9h3M2 15h3M9 22v-3M15 22v-3M22 9h-3M22 15h-3"/><rect x="2" y="2" width="20" height="20" rx="2"/></svg>,
  copy:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
};

// ─── Category metadata ────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "Mobile":           "bg-blue-50 text-blue-700",
  "Laptop":           "bg-violet-50 text-violet-700",
  "Air Conditioner":  "bg-cyan-50 text-cyan-700",
  "Refrigerator":     "bg-teal-50 text-teal-700",
  "Headphones":       "bg-orange-50 text-orange-700",
  "Office Supplies":  "bg-slate-100 text-slate-600",
  "Tools":            "bg-amber-50 text-amber-700",
};

const CATEGORIES: Category[] = ["Mobile", "Laptop", "Air Conditioner", "Refrigerator", "Headphones"];

// ─── Login ────────────────────────────────────────────────────────────────────

function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("jagadish.p@invtrack.com");
  const [password, setPassword] = useState("Jagadish@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const data = await login({
        email: email.trim(),
        password,
      });

      // Save JWT
      localStorage.setItem("token", data.token);

      const loggedInUser: User = {
        id: String(data.id),
        name: data.name,
        email: data.email,
        password: "",
        role: data.role.toLowerCase() as "admin" | "employee",
      };

      onLogin(loggedInUser);

    } catch (err) {
      console.error("Login failed:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#060E1C]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 60% 0%, #0F2D1A 0%, transparent 60%)",
      }}
    >
      <div className="w-full max-w-sm px-4">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-[#10B981] rounded-lg flex items-center justify-center">
              <Icon.chip />
            </div>

            <span
              className="text-white text-2xl font-bold"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              InvTrack
            </span>
          </div>

          <p className="text-slate-500 text-sm">
            Smart Inventory & Order Management
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-[#0F1B2D] rounded-xl p-7 border border-slate-800"
        >
          <h2
            className="text-white font-semibold text-base mb-5"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Sign in
          </h2>

          <div className="space-y-4">

            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5 uppercase tracking-widest">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-[#060E1C] border border-slate-700 rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5 uppercase tracking-widest">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-[#060E1C] border border-slate-700 rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

          </div>

          {error && (
            <p className="text-red-400 text-xs mt-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
}
// function Login({ onLogin }: { onLogin: (u: User) => void }) {
//   const [email, setEmail] = useState("jagadish.p@invtrack.com");
//   const [password, setPassword] = useState("Jagadish@123");
//   const [error, setError] = useState("");
//
//   const submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const user = USERS.find(u => u.email === email && u.password === password);
//     if (user) onLogin(user);
//     else setError("Invalid email or password.");
//   };
//
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#060E1C]"
//       style={{ backgroundImage: "radial-gradient(ellipse at 60% 0%, #0F2D1A 0%, transparent 60%)" }}>
//       <div className="w-full max-w-sm px-4">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2.5 mb-3">
//             <div className="w-9 h-9 bg-[#10B981] rounded-lg flex items-center justify-center">
//               <Icon.chip />
//             </div>
//             <span className="text-white text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>InvTrack</span>
//           </div>
//           <p className="text-slate-500 text-sm">Smart Inventory & Order Management</p>
//         </div>
//
//         <form onSubmit={submit} className="bg-[#0F1B2D] rounded-xl p-7 border border-slate-800">
//           <h2 className="text-white font-semibold text-base mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>Sign in</h2>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-slate-400 text-[11px] font-medium mb-1.5 uppercase tracking-widest">Email</label>
//               <input type="email" value={email} onChange={e => setEmail(e.target.value)}
//                 className="w-full bg-[#060E1C] border border-slate-700 rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-600" />
//             </div>
//             <div>
//               <label className="block text-slate-400 text-[11px] font-medium mb-1.5 uppercase tracking-widest">Password</label>
//               <input type="password" value={password} onChange={e => setPassword(e.target.value)}
//                 className="w-full bg-[#060E1C] border border-slate-700 rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#10B981] transition-colors" />
//             </div>
//           </div>
//           {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
//           <button type="submit" className="w-full mt-5 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
//             Sign In
//           </button>
//           <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-600 space-y-0.5">
//             <p className="text-slate-500 mb-1">Demo accounts</p>
//             <p>Admin — jagadish.p@invtrack.com / Jagadish@123</p>
//             <p>Employee — arnash.d@invtrack.com / Arnash@123</p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { id: Module; label: string; icon: IconComponent; adminOnly?: boolean }[] = [
  { id: "dashboard",  label: "Dashboard",         icon: Icon.dashboard },
  { id: "products",   label: "Products",           icon: Icon.product },
  { id: "warehouses", label: "Warehouses",         icon: Icon.warehouse },
  { id: "inventory",  label: "Inventory",          icon: Icon.inventory },
  { id: "orders",     label: "Orders",             icon: Icon.order },
  { id: "alerts",     label: "Low Stock Alerts",   icon: Icon.alert },
  { id: "demand",     label: "Demand Prediction",  icon: Icon.demand },
  { id: "users",      label: "User Management",    icon: Icon.users, adminOnly: true },
  //{ id: "api",        label: "API Reference",      icon: Icon.api },
];

function Sidebar({ active, onNav, user, onLogout }: {
  active: Module; onNav: (m: Module) => void; user: User; onLogout: () => void;
}) {
  const lowCount = 0;
  return (
    <aside className="w-56 flex-shrink-0 bg-[#0A1628] flex flex-col h-full border-r border-slate-800/60">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-slate-800/60">
        <div className="w-7 h-7 bg-[#10B981] rounded-md flex items-center justify-center flex-shrink-0">
          <Icon.chip />
        </div>
        <span className="text-white font-bold text-base" style={{ fontFamily: "Outfit, sans-serif" }}>InvTrack</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {NAV.filter(n => !n.adminOnly || user.role === "admin").map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all relative
              ${active === item.id
                ? "bg-[#10B981]/12 text-[#10B981] font-medium"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}>
            <item.icon />
            <span style={{ fontFamily: "Outfit, sans-serif" }}>{item.label}</span>
            {item.id === "alerts" && lowCount > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {lowCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800/60">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] text-xs font-bold flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.name}</p>
            <p className="text-slate-500 text-[11px] capitalize">{user.role}</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors rounded-lg hover:bg-white/5">
          <Icon.logout /> Sign out
        </button>
      </div>
    </aside>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`} onClick={onClick}>{children}</div>;
}

function KpiCard({ label, value, sub, color = "slate" }: { label: string; value: string | number; sub?: string; color?: "slate" | "green" | "amber" | "red" | "violet" }) {
  const colors = { slate: "text-slate-900", green: "text-emerald-600", amber: "text-amber-600", red: "text-red-600", violet: "text-violet-600" };
  return (
    <Card className="p-5">
      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-2">{label}</p>
      <p className={`text-2xl font-bold mono ${colors[color]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </Card>
  );
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:   "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_STYLES[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all
        ${active ? "bg-[#0A1628] text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
      {children}
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "Outfit, sans-serif" }}>{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"><Icon.x /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8081/api/products", {
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load products: ${response.status}`);
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load dashboard products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(
        product.quantity ??
        product.stock ??
        product.available ??
        0
      ),
    0
  );

  const lowStockItems = products.filter((product) => {
    const stock = Number(
      product.quantity ??
      product.stock ??
      product.available ??
      0
    );

    const reorderLevel = Number(
      product.reorderLevel ??
      product.reorderPoint ??
      10
    );

    return stock <= reorderLevel;
  });

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Operational overview"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

        <KpiCard
          label="Total SKUs"
          value={loading ? "..." : totalProducts}
          sub="products"
        />

        <KpiCard
          label="Total Stock"
          value={loading ? "..." : totalStock.toLocaleString()}
          sub="units available"
          color="green"
        />

        <KpiCard
          label="Low Stock"
          value={loading ? "..." : lowStockItems.length}
          sub="items need reorder"
          color="amber"
        />

        <KpiCard
          label="Active Orders"
          value="0"
          sub="orders"
          color="violet"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Card className="p-5">
          <p
            className="text-sm font-bold text-slate-700 mb-4"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Inventory Overview
          </p>

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total Products
              </span>

              <span className="mono font-bold text-slate-800">
                {loading ? "..." : totalProducts}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Available Stock
              </span>

              <span className="mono font-bold text-emerald-600">
                {loading ? "..." : totalStock.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Low Stock Items
              </span>

              <span className="mono font-bold text-amber-600">
                {loading ? "..." : lowStockItems.length}
              </span>
            </div>

          </div>
        </Card>

        <Card className="p-5">

          <p
            className="text-sm font-bold text-slate-700 mb-4"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            System Status
          </p>

          <div className="space-y-3">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Backend API
              </span>

              <span className="text-xs font-medium text-emerald-600">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Authentication
              </span>

              <span className="text-xs font-medium text-emerald-600">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Product API
              </span>

              <span className="text-xs font-medium text-emerald-600">
                Connected
              </span>
            </div>

          </div>

        </Card>

      </div>

      {lowStockItems.length > 0 && (
        <Card className="mt-4 p-5">

          <p
            className="text-sm font-bold text-slate-700 mb-4"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Low Stock Items
          </p>

          <div className="space-y-2">

            {lowStockItems.slice(0, 5).map((product, index) => (

              <div
                key={product.id ?? index}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >

                <span className="text-sm text-slate-700">
                  {product.name ?? product.productName ?? "Product"}
                </span>

                <span className="text-sm font-bold text-amber-600">
                  {product.quantity ??
                    product.stock ??
                    product.available ??
                    0}{" "}
                  units
                </span>

              </div>

            ))}

          </div>

        </Card>
      )}

    </div>
  );
}
// ─── Products ─────────────────────────────────────────────────────────────────

// function Products({ isAdmin }: { isAdmin: boolean }) {
//   const [products, setProducts] = useState(PRODUCTS);
//   const [search, setSearch] = useState("");
//   const [catFilter, setCatFilter] = useState<Category | "all">("all");
//   const [brandFilter, setBrandFilter] = useState("all");
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState({ name: "", sku: "", brand: "", model: "", category: "Mobile" as Category, price: "", unit: "pcs", specs: "" });
//   const [page, setPage] = useState(1);
//   const PER_PAGE = 20;
//
//   const brands = useMemo(() => {
//     if (catFilter === "all") return [];
//     return BRANDS_BY_CATEGORY[catFilter] ?? [];
//   }, [catFilter]);
//
//   const filtered = useMemo(() => products.filter(p => {
//     const q = search.toLowerCase();
//     const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
//     const matchCat = catFilter === "all" || p.category === catFilter;
//     const matchBrand = brandFilter === "all" || p.brand === brandFilter;
//     return matchSearch && matchCat && matchBrand;
//   }), [products, search, catFilter, brandFilter]);
//
//   const totalPages = Math.ceil(filtered.length / PER_PAGE);
//   const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
//
//   const handleCatChange = (cat: Category | "all") => { setCatFilter(cat); setBrandFilter("all"); setPage(1); };
//
//   const addProduct = () => {
//     if (!form.name || !form.sku || !form.price) return;
//     const np: Product = { id: `p${Date.now()}`, name: form.name, sku: form.sku, brand: form.brand, model: form.model, category: form.category, price: parseFloat(form.price), unit: form.unit, specs: form.specs };
//     setProducts(prev => [np, ...prev]);
//     setShowModal(false);
//   };
//
//   return (
//     <div>
//       <PageHeader
//         title="Product Catalog"
//         subtitle={`${filtered.length} of ${products.length} products`}
//         action={isAdmin && (
//           <button onClick={() => setShowModal(true)}
//             className="flex items-center gap-2 bg-[#0A1628] hover:bg-slate-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium">
//             <Icon.plus /> Add Product
//           </button>
//         )}
//       />
//
//       {/* Category filter */}
//       <div className="flex flex-wrap gap-2 mb-3">
//         <FilterPill active={catFilter === "all"} onClick={() => handleCatChange("all")}>All Categories</FilterPill>
//         {CATEGORIES.map(c => (
//           <FilterPill key={c} active={catFilter === c} onClick={() => handleCatChange(c)}>{c}</FilterPill>
//         ))}
//       </div>
//
//       {/* Brand + search row */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Icon.search /></span>
//           <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products, SKU, brand..."
//             className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#10B981] transition-colors w-64" />
//         </div>
//         {catFilter !== "all" && brands.length > 0 && (
//           <select value={brandFilter} onChange={e => { setBrandFilter(e.target.value); setPage(1); }}
//             className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981]">
//             <option value="all">All Brands</option>
//             {brands.map(b => <option key={b}>{b}</option>)}
//           </select>
//         )}
//       </div>
//
//       <Card>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-slate-100 text-left bg-slate-50/50">
//                 {["SKU", "Brand", "Model", "Category", "Specs", "Price"].map(h => (
//                   <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {paged.map(p => (
//                 <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
//                   <td className="px-4 py-3 text-[11px] mono text-slate-400">{p.sku}</td>
//                   <td className="px-4 py-3 text-sm font-semibold text-slate-800">{p.brand}</td>
//                   <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px]">{p.model}</td>
//                   <td className="px-4 py-3">
//                     <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[p.category] || "bg-slate-100 text-slate-600"}`}>
//                       {p.category}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-[11px] text-slate-400 max-w-[220px] truncate">{p.specs ?? "—"}</td>
//                   <td className="px-4 py-3 text-sm mono font-bold text-slate-800">${p.price.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {totalPages > 1 && (
//           <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
//             <span className="text-xs text-slate-400">{filtered.length} results · page {page} of {totalPages}</span>
//             <div className="flex gap-1">
//               <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
//                 className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">Prev</button>
//               <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
//                 className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors">Next</button>
//             </div>
//           </div>
//         )}
//       </Card>
//
//       {showModal && (
//         <Modal title="Add New Product" onClose={() => setShowModal(false)}>
//           <div className="space-y-3 max-h-[60vh] overflow-y-auto">
//             {[
//               { label: "Brand", key: "brand", placeholder: "e.g. Samsung" },
//               { label: "Model", key: "model", placeholder: "e.g. Galaxy S25 Ultra 256GB" },
//               { label: "Product Full Name", key: "name", placeholder: "e.g. Samsung Galaxy S25 Ultra 256GB" },
//               { label: "SKU", key: "sku", placeholder: "e.g. MOB-SAM-GS25U256" },
//               { label: "Unit Price ($)", key: "price", placeholder: "0.00" },
//               { label: "Specs (optional)", key: "specs", placeholder: "e.g. 6.9\" AMOLED, Snapdragon 8 Elite" },
//             ].map(f => (
//               <div key={f.key}>
//                 <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">{f.label}</label>
//                 <input type={f.key === "price" ? "number" : "text"} placeholder={f.placeholder}
//                   value={(form as Record<string, string>)[f.key]}
//                   onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
//                   className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors" />
//               </div>
//             ))}
//             <div>
//               <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Category</label>
//               <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value as Category }))}
//                 className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981]">
//                 {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//           </div>
//           <div className="flex gap-3 mt-5">
//             <button onClick={addProduct} className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white text-sm py-2.5 rounded-lg transition-colors font-semibold">Add Product</button>
//             <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 text-sm py-2.5 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

function Products({ isAdmin }: { isAdmin: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string | "all">("all");
  const [brandFilter, setBrandFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    brand: "",
    model: "",
    category: "Mobile",
    price: "",
    quantity: "0",
    specifications: "",
  });

  const [page, setPage] = useState(1);

  const PER_PAGE = 20;

  // ─────────────────────────────────────────────────────────────────────────
  // Load products from Spring Boot / MySQL
  // ─────────────────────────────────────────────────────────────────────────

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Categories
  // ─────────────────────────────────────────────────────────────────────────

  const categories = useMemo(() => {
    const values = products
      .map(product => product.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  // ─────────────────────────────────────────────────────────────────────────
  // Brands
  // ─────────────────────────────────────────────────────────────────────────

  const brands = useMemo(() => {
    if (catFilter === "all") {
      return [];
    }

    const values = products
      .filter(product => product.category === catFilter)
      .map(product => product.brand)
      .filter(Boolean);

    return [...new Set(values)];
  }, [products, catFilter]);

  // ─────────────────────────────────────────────────────────────────────────
  // Filtering
  // ─────────────────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter(product => {
      const matchSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q) ||
        product.model?.toLowerCase().includes(q);

      const matchCategory =
        catFilter === "all" ||
        product.category === catFilter;

      const matchBrand =
        brandFilter === "all" ||
        product.brand === brandFilter;

      return matchSearch && matchCategory && matchBrand;
    });
  }, [products, search, catFilter, brandFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PER_PAGE)
  );

  const paged = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Category filter
  // ─────────────────────────────────────────────────────────────────────────

  const handleCatChange = (cat: string | "all") => {
    setCatFilter(cat);
    setBrandFilter("all");
    setPage(1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Reset form
  // ─────────────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      brand: "",
      model: "",
      category: categories[0] || "Mobile",
      price: "",
      quantity: "0",
      specifications: "",
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Open Add Product modal
  // ─────────────────────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      sku: "",
      brand: "",
      model: "",
      category: categories[0] || "Mobile",
      price: "",
      quantity: "0",
      specifications: "",
    });

    setError("");
    setShowModal(true);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Open Edit Product modal
  // ─────────────────────────────────────────────────────────────────────────

  const openEditModal = (product: Product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      sku: product.sku || "",
      brand: product.brand || "",
      model: product.model || "",
      category: product.category || "Mobile",
      price: String(product.price ?? ""),
      quantity: String(product.quantity ?? 0),
      specifications: product.specifications || "",
    });

    setError("");
    setShowModal(true);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Save Product
  // ─────────────────────────────────────────────────────────────────────────

  const saveProduct = async () => {
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!form.quantity || Number(form.quantity) < 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    const request: ProductRequest = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      category: form.category,
      specifications: form.specifications.trim(),
    };

    try {
      setSaving(true);
      setError("");

      if (editingProduct) {
        // PUT /api/products/{id}
        const updated = await updateProduct(
          editingProduct.id,
          request
        );

        setProducts(prev =>
          prev.map(product =>
            product.id === updated.id
              ? updated
              : product
          )
        );
      } else {
        // POST /api/products
        const created = await createProduct(request);

        setProducts(prev => [
          created,
          ...prev,
        ]);
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (err: any) {
      console.error("Failed to save product:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to save product.";

      setError(String(message));
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Delete Product
  // ─────────────────────────────────────────────────────────────────────────

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      // DELETE /api/products/{id}
      await deleteProduct(product.id);

      setProducts(prev =>
        prev.filter(item =>
          item.id !== product.id
        )
      );
    } catch (err: any) {
      console.error("Failed to delete product:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to delete product.";

      setError(String(message));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Search
  // ─────────────────────────────────────────────────────────────────────────

  const handleSearchChange = async (value: string) => {
    setSearch(value);
    setPage(1);

    if (!value.trim()) {
      loadProducts();
      return;
    }

    /*
     * We use the backend search endpoint here.
     *
     * GET /api/products/search?name=...
     */
    try {
      setLoading(true);
      setError("");

      const data = await searchProducts(value);

      setProducts(data);
    } catch (err) {
      console.error("Product search failed:", err);
      setError("Failed to search products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Product Catalog"
        subtitle={`${filtered.length} of ${products.length} products`}
        action={
          isAdmin && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-[#0A1628] hover:bg-slate-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              <Icon.plus />
              Add Product
            </button>
          )
        }
      />

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        <FilterPill
          active={catFilter === "all"}
          onClick={() => handleCatChange("all")}
        >
          All Categories
        </FilterPill>

        {categories.map(category => (
          <FilterPill
            key={category}
            active={catFilter === category}
            onClick={() => handleCatChange(category)}
          >
            {category}
          </FilterPill>
        ))}
      </div>

      {/* Search + Brand */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon.search />
          </span>

          <input
            value={search}
            onChange={e =>
              handleSearchChange(e.target.value)
            }
            placeholder="Search products, SKU, brand..."
            className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#10B981] transition-colors w-64"
          />
        </div>

        {catFilter !== "all" && brands.length > 0 && (
          <select
            value={brandFilter}
            onChange={e => {
              setBrandFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#10B981]"
          >
            <option value="all">
              All Brands
            </option>

            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left bg-slate-50/50">
                {[
                  "SKU",
                  "Brand",
                  "Model",
                  "Category",
                  "Quantity",
                  "Specs",
                  "Price",
                  ...(isAdmin ? ["Actions"] : []),
                ].map(header => (
                  <th
                    key={header}
                    className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 8 : 7}
                    className="px-4 py-10 text-center text-sm text-slate-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 8 : 7}
                    className="px-4 py-10 text-center text-sm text-slate-400"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paged.map(product => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-4 py-3 text-[11px] mono text-slate-400">
                      {product.sku || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      {product.brand || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px]">
                      {product.model || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                          CATEGORY_COLORS[product.category] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.category || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm mono font-semibold text-slate-700">
                      {product.quantity ?? 0}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-400 max-w-[220px] truncate">
                      {product.specifications || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm mono font-bold text-slate-800">
                      ${Number(product.price).toLocaleString()}
                    </td>

                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              openEditModal(product)
                            }
                            className="px-2.5 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(product)
                            }
                            className="px-2.5 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {filtered.length} results · page {page} of {totalPages}
            </span>

            <div className="flex gap-1">
              <button
                onClick={() =>
                  setPage(p => Math.max(1, p - 1))
                }
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setPage(p =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <Modal
          title={
            editingProduct
              ? "Edit Product"
              : "Add New Product"
          }
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
            resetForm();
          }}
        >
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">

            {/* Brand */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                Brand
              </label>

              <input
                type="text"
                placeholder="e.g. Samsung"
                value={form.brand}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    brand: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                Model
              </label>

              <input
                type="text"
                placeholder="e.g. Galaxy S25 Ultra 256GB"
                value={form.model}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    model: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                Product Full Name
              </label>

              <input
                type="text"
                placeholder="e.g. Samsung Galaxy S25 Ultra 256GB"
                value={form.name}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                SKU
              </label>

              <input
                type="text"
                placeholder="e.g. MOB-SAM-GS25U256"
                value={form.sku}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    sku: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                Unit Price ($)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                Quantity
              </label>

              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.quantity}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                Specifications
              </label>

              <input
                type="text"
                placeholder='e.g. 6.9" AMOLED, Snapdragon 8 Elite'
                value={form.specifications}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    specifications: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                Category
              </label>

              <select
                value={form.category}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981]"
              >
                {categories.map(category => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}

                {categories.length === 0 && (
                  <>
                    <option value="Mobile">
                      Mobile
                    </option>
                    <option value="Laptop">
                      Laptop
                    </option>
                    <option value="Air Conditioner">
                      Air Conditioner
                    </option>
                    <option value="Refrigerator">
                      Refrigerator
                    </option>
                    <option value="Headphones">
                      Headphones
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-5">
            <button
              onClick={saveProduct}
              disabled={saving}
              className="flex-1 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white text-sm py-2.5 rounded-lg transition-colors font-semibold"
            >
              {saving
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Add Product"}
            </button>

            <button
              onClick={() => {
                setShowModal(false);
                setEditingProduct(null);
                resetForm();
              }}
              disabled={saving}
              className="flex-1 border border-slate-200 text-slate-600 text-sm py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Warehouses ───────────────────────────────────────────────────────────────

function Warehouses() {
  return (
    <div>
      <PageHeader title="Warehouses" subtitle="Storage locations and utilisation" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {WAREHOUSES.map(wh => {
          const items = INVENTORY.filter(i => i.warehouseId === wh.id);
          const totalUnits = items.reduce((a, i) => a + i.available + i.reserved, 0);
          const pct = Math.min(Math.round((totalUnits / wh.capacity) * 100), 100);
          return (
            <Card key={wh.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{wh.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{wh.location}</p>
                </div>
                <span className="text-[11px] mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{wh.id.toUpperCase()}</span>
              </div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Capacity used</span>
                <span className={`mono font-bold ${pct > 80 ? "text-red-600" : "text-slate-700"}`}>{pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? "#EF4444" : "#10B981" }} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[["SKUs", items.length], ["Units", totalUnits.toLocaleString()], ["Cap", wh.capacity.toLocaleString()]].map(([label, val]) => (
                  <div key={label as string} className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-bold mono text-slate-800 mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "Outfit, sans-serif" }}>Inventory by Warehouse</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                {["Warehouse", "Brand", "Product", "Category", "Available", "Reserved", "Total"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {INVENTORY.slice(0, 40).map(item => {
                const prod = PRODUCTS.find(p => p.id === item.productId);
                const wh = WAREHOUSES.find(w => w.id === item.warehouseId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{wh?.name}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{prod?.brand}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[180px] truncate">{prod?.model}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[prod?.category ?? ""] || "bg-slate-100 text-slate-600"}`}>
                        {prod?.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm mono font-semibold text-emerald-700">{item.available}</td>
                    <td className="px-4 py-3 text-sm mono text-amber-700">{item.reserved}</td>
                    <td className="px-4 py-3 text-sm mono font-bold text-slate-800">{item.available + item.reserved}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Inventory ────────────────────────────────────────────────────────────────

function Inventory() {
  const [inv, setInv] = useState(INVENTORY);
  const [catFilter, setCatFilter] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");

  const adjust = (id: string, delta: number) =>
    setInv(prev => prev.map(i => i.id === id ? { ...i, available: Math.max(0, i.available + delta) } : i));

  const filtered = useMemo(() => inv.filter(item => {
    const prod = PRODUCTS.find(p => p.id === item.productId);
    const matchCat = catFilter === "all" || prod?.category === catFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || prod?.name.toLowerCase().includes(q) || prod?.brand.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [inv, catFilter, search]);

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Available and reserved stock across all warehouses" />
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterPill active={catFilter === "all"} onClick={() => setCatFilter("all")}>All</FilterPill>
        {CATEGORIES.map(c => <FilterPill key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>{c}</FilterPill>)}
        <div className="relative ml-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Icon.search /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#10B981] w-48" />
        </div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                {["Brand", "Model", "Category", "Warehouse", "Available", "Reserved", "Reorder Level", "Status", "Adjust"].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(item => {
                const prod = PRODUCTS.find(p => p.id === item.productId);
                const wh = WAREHOUSES.find(w => w.id === item.warehouseId);
                const isLow = item.available <= item.reorderLevel;
                return (
                  <tr key={item.id} className={`hover:bg-slate-50/70 transition-colors ${isLow ? "bg-amber-50/20" : ""}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{prod?.brand}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[160px] truncate">{prod?.model}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[prod?.category ?? ""] || "bg-slate-100 text-slate-600"}`}>{prod?.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{wh?.name}</td>
                    <td className="px-4 py-3 text-sm mono font-bold text-slate-800">{item.available}</td>
                    <td className="px-4 py-3 text-sm mono text-amber-700">{item.reserved}</td>
                    <td className="px-4 py-3 text-sm mono text-slate-500">{item.reorderLevel}</td>
                    <td className="px-4 py-3">
                      {isLow
                        ? <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-medium">Low Stock</span>
                        : <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">OK</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => adjust(item.id, -10)} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 text-sm transition-colors font-bold">−</button>
                        <button onClick={() => adjust(item.id, +10)} className="w-6 h-6 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 rounded text-emerald-700 text-sm transition-colors font-bold">+</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-100">
          <p className="text-xs text-slate-400">{filtered.length} items shown</p>
        </div>
      </Card>
    </div>
  );
}

// ─── Orders ───────────────────────────────────────────────────────────────────

function Orders({ isAdmin }: { isAdmin: boolean }) {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} total orders`} />
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "pending", "confirmed", "shipped", "cancelled"] as const).map(s => (
          <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </FilterPill>
        ))}
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                {["Order ID", "Customer", "Date", "Items", "Total", "Status", ...(isAdmin ? ["Actions"] : [])].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(order => (
                <>
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    <td className="px-4 py-3 text-sm mono font-bold text-slate-800">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{order.customerName}</td>
                    <td className="px-4 py-3 text-xs mono text-slate-400">{order.createdAt}</td>
                    <td className="px-4 py-3 text-xs mono text-slate-500">{order.items.length}</td>
                    <td className="px-4 py-3 text-sm mono font-bold text-slate-800">${order.total.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          {order.status === "pending" && (
                            <button onClick={() => updateStatus(order.id, "confirmed")}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] rounded-md transition-colors">
                              <Icon.check /> Confirm
                            </button>
                          )}
                          {order.status === "confirmed" && (
                            <button onClick={() => updateStatus(order.id, "shipped")}
                              className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] rounded-md transition-colors">
                              <Icon.check /> Ship
                            </button>
                          )}
                          {(order.status === "pending" || order.status === "confirmed") && (
                            <button onClick={() => updateStatus(order.id, "cancelled")}
                              className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] rounded-md transition-colors">
                              <Icon.x /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                  {expanded === order.id && (
                    <tr key={`${order.id}-exp`}>
                      <td colSpan={isAdmin ? 7 : 6} className="px-6 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Line Items</p>
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => {
                            const prod = PRODUCTS.find(p => p.id === item.productId);
                            return (
                              <div key={idx} className="flex items-center justify-between max-w-lg text-sm">
                                <span className="text-slate-700">{prod?.brand} {prod?.model}</span>
                                <span className="mono text-slate-500 ml-4">{item.quantity} × ${item.unitPrice.toLocaleString()}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Low Stock Alerts ─────────────────────────────────────────────────────────

function Alerts() {
  const [catFilter, setCatFilter] = useState<Category | "all">("all");
  const lowStock = INVENTORY.filter(i => {
    const prod = PRODUCTS.find(p => p.id === i.productId);
    return i.available <= i.reorderLevel && (catFilter === "all" || prod?.category === catFilter);
  });
  const critical = lowStock.filter(i => i.available < i.reorderLevel * 0.5);
  const warning = lowStock.filter(i => i.available >= i.reorderLevel * 0.5);

  const AlertRow = ({ item }: { item: InventoryItem }) => {
    const prod = PRODUCTS.find(p => p.id === item.productId);
    const wh = WAREHOUSES.find(w => w.id === item.warehouseId);
    const pct = Math.round((item.available / item.reorderLevel) * 100);
    const isCrit = item.available < item.reorderLevel * 0.5;
    return (
      <Card className={`p-4 border-l-4 ${isCrit ? "border-l-red-500" : "border-l-amber-400"}`}>
        <div className="flex items-start justify-between mb-2.5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[prod?.category ?? ""] || "bg-slate-100 text-slate-600"}`}>{prod?.category}</span>
              <span className="text-[11px] text-slate-400">{prod?.sku}</span>
            </div>
            <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>{prod?.brand} {prod?.model}</p>
            <p className="text-xs text-slate-400">{wh?.name}</p>
          </div>
          <div className="text-right">
            <p className={`mono text-lg font-bold ${isCrit ? "text-red-600" : "text-amber-600"}`}>{item.available}</p>
            <p className="text-[10px] text-slate-400">units left</p>
          </div>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
          <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: isCrit ? "#EF4444" : "#F59E0B" }} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Reorder at <span className="mono font-semibold text-slate-600">{item.reorderLevel}</span></span>
          <span className={`font-bold ${isCrit ? "text-red-500" : "text-amber-500"}`}>{isCrit ? "CRITICAL" : "WARNING"}</span>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <PageHeader title="Low Stock Alerts" subtitle={`${lowStock.length} products need attention`} />
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterPill active={catFilter === "all"} onClick={() => setCatFilter("all")}>All Categories</FilterPill>
        {CATEGORIES.map(c => <FilterPill key={c} active={catFilter === c} onClick={() => setCatFilter(c)}>{c}</FilterPill>)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard label="Critical" value={critical.length} color="red" />
        <KpiCard label="Warning" value={warning.length} color="amber" />
        <KpiCard label="Total Alerts" value={lowStock.length} />
        <KpiCard label="Categories Affected" value={[...new Set(lowStock.map(i => PRODUCTS.find(p => p.id === i.productId)?.category))].length} />
      </div>
      {critical.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Critical — Immediate Action Required</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {critical.map(item => <AlertRow key={item.id} item={item} />)}
          </div>
        </div>
      )}
      {warning.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Warning — Plan Restocking Soon</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {warning.map(item => <AlertRow key={item.id} item={item} />)}
          </div>
        </div>
      )}
      {lowStock.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-400 text-sm">All products are sufficiently stocked for this category.</p>
        </Card>
      )}
    </div>
  );
}

// ─── Demand Prediction ────────────────────────────────────────────────────────

function DemandPrediction() {
  const [selectedId, setSelectedId] = useState("m01");

  const predictions = useMemo(() => {
    const productIds = [...new Set(SALES_HISTORY.map(r => r.productId))];
    return productIds.map(pid => {
      const prod = PRODUCTS.find(p => p.id === pid)!;
      const records = SALES_HISTORY.filter(r => r.productId === pid);
      const avg = records.reduce((a, r) => a + r.unitsSold, 0) / records.length;
      const recent = records.slice(-3);
      const recentAvg = recent.reduce((a, r) => a + r.unitsSold, 0) / recent.length;
      const trend = recentAvg > avg * 1.05 ? "up" : recentAvg < avg * 0.95 ? "down" : "stable";
      const predicted = Math.round(recentAvg * 1.06);
      const inv = INVENTORY.find(i => i.productId === pid);
      const daysOut = inv ? Math.round((inv.available / predicted) * 30) : null;
      return { prod, records, avg: Math.round(avg), predicted, trend, daysOut };
    });
  }, []);

  const sel = predictions.find(p => p.prod.id === selectedId) ?? predictions[0];
  const chartData = sel.records.map(r => ({ month: r.month.slice(5), actual: r.unitsSold, avg: sel.avg }));
  const withPredicted = [...chartData, { month: "Sep*", actual: null, avg: sel.predicted }];

  return (
    <div>
      <PageHeader title="Demand Prediction" subtitle="6-month trend analysis with next-month forecast" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {predictions.filter(p => p.daysOut !== null && p.daysOut < 30).slice(0, 4).map(p => (
          <Card key={p.prod.id} className="p-4 cursor-pointer hover:border-emerald-300 transition-colors"
            onClick={() => setSelectedId(p.prod.id)}>
            <div className="flex items-start justify-between mb-1">
              <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[p.prod.category] || ""}`}>{p.prod.category}</span>
              <span className={`text-xs font-bold ${p.trend === "up" ? "text-emerald-600" : p.trend === "down" ? "text-red-500" : "text-slate-400"}`}>
                {p.trend === "up" ? "↑" : p.trend === "down" ? "↓" : "→"}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>{p.prod.brand}</p>
            <p className="text-xs text-slate-500 truncate">{p.prod.model}</p>
            <div className={`mt-2 text-xs px-2 py-1 rounded-md text-center font-semibold ${
              (p.daysOut ?? 99) < 14 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
              Stockout ~{p.daysOut}d
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "Outfit, sans-serif" }}>Sales History + Sep Forecast</p>
              <p className="text-xs text-slate-400">{sel.prod.brand} {sel.prod.model}</p>
            </div>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#10B981] max-w-[180px]">
              {predictions.map(p => <option key={p.prod.id} value={p.prod.id}>{p.prod.brand} {p.prod.model.slice(0, 20)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Avg/Month</p>
              <p className="mono font-bold text-slate-800 text-xl mt-1">{sel.avg}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-[10px] text-emerald-500 uppercase tracking-widest">Predicted Sep</p>
              <p className="mono font-bold text-emerald-700 text-xl mt-1">{sel.predicted}</p>
            </div>
            <div className={`${(sel.daysOut ?? 99) < 14 ? "bg-red-50" : "bg-amber-50"} rounded-lg p-3 text-center`}>
              <p className={`text-[10px] uppercase tracking-widest ${(sel.daysOut ?? 99) < 14 ? "text-red-400" : "text-amber-500"}`}>Days to Stockout</p>
              <p className={`mono font-bold text-xl mt-1 ${(sel.daysOut ?? 99) < 14 ? "text-red-700" : "text-amber-700"}`}>
                {sel.daysOut ?? "—"}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={withPredicted} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0A1628", border: "none", borderRadius: 8, fontSize: 12, color: "#fff" }} />
              <Bar dataKey="actual" fill="#6366F1" radius={[4, 4, 0, 0]} name="Actual" />
              <Bar dataKey="avg" fill="#10B981" radius={[4, 4, 0, 0]} name="Forecast" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-slate-400 mt-2">* Sep column shows predicted demand based on weighted trend analysis</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-bold text-slate-700 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>All Tracked Products</p>
          <div className="space-y-1 overflow-y-auto max-h-80">
            {predictions.map(p => (
              <div key={p.prod.id}
                onClick={() => setSelectedId(p.prod.id)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedId === p.prod.id ? "bg-emerald-50 border border-emerald-200" : "hover:bg-slate-50"}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{p.prod.brand}</p>
                  <p className="text-[11px] text-slate-400 truncate">{p.prod.model.slice(0, 22)}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="mono text-xs font-bold text-emerald-700">{p.predicted}</p>
                  <p className={`text-[10px] font-bold ${p.trend === "up" ? "text-emerald-500" : p.trend === "down" ? "text-red-400" : "text-slate-400"}`}>
                    {p.trend === "up" ? "↑ up" : p.trend === "down" ? "↓ down" : "→ stable"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── User Management ──────────────────────────────────────────────────────────

function UserManagement() {
  return (
    <div>
      <PageHeader title="User Management" subtitle="System access and role configuration" />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                {["User", "Email", "Role", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {USERS.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#10B981]/15 flex items-center justify-center text-[#10B981] text-sm font-bold">{u.name.charAt(0)}</div>
                      <span className="text-sm font-semibold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500 mono">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${u.role === "admin" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3"><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

//------------------------------
//------------------------------

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [module, setModule] = useState<Module>("dashboard");

  if (!user) return <Login onLogin={setUser} />;
  const isAdmin = user.role === "admin";

  const render = () => {
    switch (module) {
      case "dashboard":  return <Dashboard />;
      case "products":   return <Products isAdmin={isAdmin} />;
      case "warehouses": return <Warehouses />;
      case "inventory":  return <Inventory />;
      case "orders":     return <Orders isAdmin={isAdmin} />;
      case "alerts":     return <Alerts />;
      case "demand":     return <DemandPrediction />;
      case "users":      return isAdmin ? <UserManagement /> : <Dashboard />;
      case "api":        return <ApiReference />;
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar active={module} onNav={setModule} user={user} onLogout={() => setUser(null)} />
      <main className="flex-1 overflow-y-auto bg-[#F0F2F7]">
        <div className="max-w-6xl mx-auto px-6 py-7">
          {render()}
        </div>
      </main>
    </div>
  );
}
