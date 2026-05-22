"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Notice {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  attachment_url: string;
  created_at: string;
}

export default function IntranetNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("notices")
      .select("id, title, content, is_pinned, attachment_url, created_at")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setNotices(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
        <p className="text-sm text-gray-500 mt-1">본부에서 전달하는 중요 공지를 확인하세요.</p>
      </div>

      {loading ? (
        <p className="text-gray-400 py-10 text-center">불러오는 중...</p>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <p className="text-gray-400">등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <a
              key={n.id}
              href={`/intranet/notices/${n.id}`}
              className="flex items-start gap-4 bg-white rounded-2xl border p-5 hover:shadow-sm hover:border-blue-200 transition"
            >
              {n.is_pinned && (
                <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded font-medium shrink-0 mt-0.5">
                  📌 중요
                </span>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{n.title}</h3>
                {n.content && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{n.content}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                {n.attachment_url && (
                  <span className="text-xs text-blue-600 block mb-1">📎 첨부파일</span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
