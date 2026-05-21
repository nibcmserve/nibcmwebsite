"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

const ROLES = ["missionary", "staff", "admin", "board", "super_admin"];
const ROLE_LABEL: Record<string, { label: string; color: string }> = {
  super_admin: { label: "최고관리자", color: "bg-red-100 text-red-700" },
  admin:       { label: "관리자",    color: "bg-blue-100 text-blue-700" },
  staff:       { label: "스태프",    color: "bg-yellow-100 text-yellow-700" },
  board:       { label: "이사",      color: "bg-purple-100 text-purple-700" },
  missionary:  { label: "선교사",    color: "bg-green-100 text-green-700" },
};

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data);
  };

  useEffect(() => { fetchProfiles(); }, []);

  const updateRole = async (id: string, role: string) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchProfiles();
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-1">사용자 관리</h1>
      <p className="text-sm text-gray-500 mb-6">사용자 역할을 관리합니다.</p>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {profiles.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">등록된 사용자가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">이름</th>
                <th className="text-left px-4 py-3">이메일</th>
                <th className="text-left px-4 py-3">역할</th>
                <th className="text-left px-4 py-3">가입일</th>
                <th className="px-4 py-3">역할 변경</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.map((p) => {
                const r = ROLE_LABEL[p.role] ?? { label: p.role, color: "bg-gray-100 text-gray-500" };
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">{p.name || "(이름 없음)"}</td>
                    <td className="px-4 py-3 text-gray-500">{p.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.color}`}>{r.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString("ko-KR")}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.role}
                        onChange={(e) => updateRole(p.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]?.label ?? r}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        새 사용자는 Supabase Authentication에서 직접 추가하세요.
      </p>
    </main>
  );
}
