export default function MemberDashboard() {
  return (
    <div className="container mx-auto py-10 px-4">
       <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-bold">Welcome Back, Alex!</h1>
         <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Edit Profile
         </button>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
               {/* Progress Chart Placeholder */}
               <div className="p-8 bg-slate-900 rounded-3xl border border-white/10 h-80 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-slate-400 font-medium">Weight Progress Chart Loading...</p>
               </div>
               
               {/* Recent Activity */}
               <div className="p-8 bg-slate-900 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                           <div>
                              <p className="font-bold text-white">Upper Body Power</p>
                              <p className="text-xs text-slate-400">2 days ago • 45 mins</p>
                           </div>
                           <span className="text-neon text-sm font-bold">+350 XP</span>
                        </div>
                     ))}
                  </div>
               </div>
           </div>
           
           <div className="space-y-8">
              {/* Stats */}
              <div className="p-6 bg-slate-900 rounded-3xl border border-white/10">
                 <h3 className="text-slate-400 text-sm font-medium mb-1">Current Streak</h3>
                 <p className="text-4xl font-black text-white">12 <span className="text-lg text-slate-500 font-normal">days</span></p>
              </div>
              
              <div className="p-6 bg-neon rounded-3xl border border-neonShadow shadow-[0_0_30px_rgba(190,242,100,0.2)]">
                 <h3 className="text-slate-900 text-sm font-bold mb-1 opacity-80">Next Session</h3>
                 <p className="text-2xl font-black text-slate-950">Leg Day</p>
                 <p className="text-slate-900 font-medium text-sm mt-2">Tomorrow, 10:00 AM</p>
              </div>
           </div>
       </div>
    </div>
  )
}
