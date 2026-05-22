"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Notice {
  id: string;
  title: string;
  is_pinned: boolean;
  attachment_url: string;
  created_at: string;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  const fetch = async () => {
    const { data } = await supabase
      .from("notices")
      .select("id, title, is_pinned, attachment_url, created_at")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (data) setNotices(data);
  };

  useEffect(() => { fetch(); }, []);

  const togglePin = async (id: string, current: boolean) => {
    await supabase.from("notices").update({ is_pinned: !current }).eq("id", id);
    fetch();
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("공지를 삭제하시겠습니까?")) return;
    await supabase.from("notices").delete().eq("id", id);
    fetch();
  };

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">공지사항 관리</h1>
          <p className="text-sm text-gray-500 mt-1">선교사 인트라넷 공지를 등록하고 관리합니다.</p>
        </div>
        <a href="/admin/notices/new"
          className="bg-blue-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition">
          + 공지 등록
        </a>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {notices.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">등록된 공지가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">제목</th>
                <th className="text-left px-4 py-3">첨부</th>
                <th className="text-left px-4 py-3">등록일</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {n.is_pinned && <span className="text-red-500 mr-2 text-xs">📌</span>}
                    {n.title}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {n.attachment_url ? "📎 있음" : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(n.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3 justify-end">
                    <button
                      onClick={() => togglePin(n.id, n.is_pinned)}
                      className={`text-xs px-2 py-1 rounded border transition ${n.is_pinned ? "border-red-200 text-red-600 hover:bg-red-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                    >
                      {n.is_pinned ? "고정 해제" : "고정"}
                    </button>
                    <a href={`/admin/notices/${n.id}`} className="text-xs text-blue-700 hover:underline">수정</a>
                    <button onClick={() => deleteNotice(n.id)} className="text-xs text-red-500 hover:underline">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
