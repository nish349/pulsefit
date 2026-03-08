import React from 'react';
import { MemberDirectory } from '@/components/admin/members/MemberDirectory';

export const metadata = {
    title: 'Member Directory | PulseAdmin',
    description: 'Manage gym members, view statuses, and handle memberships.',
};

export default function MembersPage() {
    return (
        <div className="min-h-screen bg-[#0d1117]">
            <MemberDirectory />
        </div>
    );
}
