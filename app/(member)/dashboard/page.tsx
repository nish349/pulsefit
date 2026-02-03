"use client";

import WelcomeHeader from "@/components/member/dashboard/WelcomeHeader";
import StatsGrid from "@/components/member/dashboard/StatsGrid";
import CheckInScanner from "@/components/member/dashboard/CheckInScanner";
import QuickActions from "@/components/member/dashboard/QuickActions";
import UpcomingClasses from "@/components/member/dashboard/UpcomingClasses";
import AnnouncementBanner from "@/components/member/dashboard/AnnouncementBanner";
import PRCard from "@/components/member/dashboard/PRCard";

export default function MemberDashboard() {
    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Announcement Banner */}
            <AnnouncementBanner />

            {/* Header Section */}
            <WelcomeHeader />

            {/* Primary Action - Scan to Check In */}
            <section>
                <CheckInScanner />
            </section>

            {/* Stats Overview */}
            <section>
                <StatsGrid />
            </section>

            {/* Personal Record Spotlight */}
            <section>
                <PRCard />
            </section>

            {/* Secondary Actions */}
            <section>
                <QuickActions />
            </section>

            {/* Schedule Preview */}
            <section>
                <UpcomingClasses />
            </section>
        </div>
    );
}
