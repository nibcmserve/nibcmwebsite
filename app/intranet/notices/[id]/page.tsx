"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

interface Notice {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  attachment_url: string;
  created_at: string;
}

export default function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("notices")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setNotice(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-gray-400">불러오는 중...</div>;
  if (!notice) return (
    <div className="p-8 text-center">
      <p className="text-gray-500">공지를 찾을 수 없습니다.</p>
      <a href="/intranet/notices" className="text-blue-700 hover:underline text-sm mt-3 inline-block">← 목록으로</a>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-3xl">

      {/* 뒤로가기 */}
      <a href="/intranet/notices" className="text-sm text-blue-700 hover:underline mb-6 inline-block">
        ← 공지사항 목록
      </a>

      <div className="bg-white rounded-2xl border p-8">
        {notice.is_pinned && (
          <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded font-medium mb-4 inline-block">
            📌 중요 공지
          </span>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{notice.title}</h1>
        <p className="text-sm text-gray-400 mb-8 pb-6 border-b">
          {new Date(notice.created_at).toLocaleDateString("ko-KR", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>

        <div className="text-gray-700 leading-9 whitespace-pre-wrap">
          {notice.content}
        </div>

        {notice.attachment_url && (
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm font-semibold text-gray-700 mb-3">첨부파일</p>
            <a
              href={notice.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              📎 첨부파일 다운로드
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
