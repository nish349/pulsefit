import MemberSidebar from "@/components/member/MemberSidebar";
import MobileNav from "@/components/member/MobileNav";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-neon/30">
      {/* 
        Mobile Navigation 
        - Hidden on desktop (md:hidden)
        - Fixed at top 
      */}
      <MobileNav />

      {/* 
        Desktop Sidebar 
        - Hidden on mobile (hidden md:flex)
        - Fixed at left
      */}
      <MemberSidebar />

      {/* 
        Main Content Area 
        - Pushes content down on mobile (pt-16) to account for MobileNav
        - Pushes content right on desktop (md:pl-[250px]) to account for Sidebar
      */}
      <main className="flex-1 pt-16 md:pt-0 md:pl-[250px] transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
