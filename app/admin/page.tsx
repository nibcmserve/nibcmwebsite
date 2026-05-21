"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

interface Stats {
  missionaries: number;
  pendingApplications: number;
  contacts: number;
}

interface RecentApplication {
  id: string;
  title: string;
  application_type: string;
  status: string;
  submitted_at: string;
}

interface RecentContact {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: "대기",   color: "bg-yellow-100 text-yellow-700" },
  reviewing: { label: "검토중", color: "bg-blue-100 text-blue-700" },
  approved:  { label: "승인",   color: "bg-green-100 text-green-700" },
  rejected:  { label: "반려",   color: "bg-red-100 text-red-700" },
  cancelled: { label: "취소",   color: "bg-gray-100 text-gray-500" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ missionaries: 0, pendingApplications: 0, contacts: 0 });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        { count: mCount },
        { count: aCount },
        { count: cCount },
        { data: apps },
        { data: contacts },
      ] = await Promise.all([
        supabase.from("missionaries").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contacts").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("applications").select("id, title, application_type, status, submitted_at").order("submitted_at", { ascending: false }).limit(5),
        supabase.from("contacts").select("id, name, message, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({ missionaries: mCount ?? 0, pendingApplications: aCount ?? 0, contacts: cCount ?? 0 });
      setRecentApplications(apps ?? []);
      setRecentContacts(contacts ?? []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">불러오는 중...</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">관리자 대시보드</h1>
      <p className="text-sm text-gray-500 mb-8">NIBCM 국제선교회 내부 시스템</p>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard label="전체 선교사" value={stats.missionaries} icon="✦" color="bg-blue-50 text-blue-700" href="/admin/missionaries" />
        <StatCard label="대기 중 신청" value={stats.pendingApplications} icon="✉" color="bg-yellow-50 text-yellow-700" href="/admin/applications" />
        <StatCard label="새 문의" value={stats.contacts} icon="💬" color="bg-green-50 text-green-700" href="/admin/contacts" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 최근 신청 */}
        <section className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">최근 신청</h2>
            <a href="/admin/applications" className="text-xs text-blue-700 hover:underline">전체 보기</a>
          </div>
          {recentApplications.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">접수된 신청이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {recentApplications.map((app) => {
                const s = STATUS_LABEL[app.status] ?? { label: app.status, color: "bg-gray-100 text-gray-500" };
                return (
                  <li key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{app.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {app.application_type} · {new Date(app.submitted_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* 최근 문의 */}
        <section className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">최근 문의</h2>
            <a href="/admin/contacts" className="text-xs text-blue-700 hover:underline">전체 보기</a>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">새로운 문의가 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {recentContacts.map((c) => (
                <li key={c.id} className="py-2 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("ko-KR")}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{c.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 빠른 이동 */}
      <section className="mt-6 bg-white rounded-2xl border p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">빠른 이동</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/missionaries/new", label: "선교사 등록" },
            { href: "/admin/applications/new", label: "신청 등록" },
            { href: "/admin/documents", label: "문서 관리" },
            { href: "/admin/reports", label: "보고서 관리" },
            { href: "/", label: "공개 사이트 ↗", external: true },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              className="text-sm bg-gray-50 hover:bg-gray-100 border rounded-lg px-4 py-2 text-gray-700 transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, icon, color, href }: { label: string; value: number; icon: string; color: string; href: string }) {
  return (
    <a href={href} className="bg-white rounded-2xl border p-5 hover:shadow-sm transition block">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </a>
  );
}
