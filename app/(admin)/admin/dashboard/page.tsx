export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-slate-900 rounded-2xl border border-white/10">
            <h3 className="text-slate-400 mb-2 font-medium">Total Members</h3>
            <p className="text-4xl font-bold text-white">1,240</p>
         </div>
         <div className="p-6 bg-slate-900 rounded-2xl border border-white/10">
            <h3 className="text-slate-400 mb-2 font-medium">Active Now</h3>
            <p className="text-4xl font-bold text-neon">42</p>
         </div>
         <div className="p-6 bg-slate-900 rounded-2xl border border-white/10">
            <h3 className="text-slate-400 mb-2 font-medium">Monthly Revenue</h3>
            <p className="text-4xl font-bold text-white">$45.2k</p>
         </div>
      </div>
    </div>
  )
}
