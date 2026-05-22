"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

interface NewsDetail {
  id: string;
  title_ko: string;
  content_ko: string;
  category: string;
  thumbnail_url: string;
  published_at: string;
  country: string;
  prayer_requests: string;
  missionaries?: { korean_name: string } | null;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const [item, setItem]     = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("news")
      .select("*, missionaries(korean_name)")
      .eq("id", id)
      .eq("status", "published")
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setItem(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </main>
    );
  }

  if (notFound || !item) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">게시물을 찾을 수 없습니다.</p>
        <a href="/news" className="text-blue-700 hover:underline text-sm">← 목록으로</a>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen text-gray-900">

      {/* 썸네일 헤더 */}
      {item.thumbnail_url ? (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <img
            src={item.thumbnail_url}
            alt={item.title_ko}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="text-xs bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full">
              {item.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-3 leading-tight">
              {item.title_ko}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-blue-950 text-white py-24 px-6 text-center">
          <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">{item.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">{item.title_ko}</h1>
        </div>
      )}

      {/* 본문 */}
      <article className="max-w-3xl mx-auto px-6 py-14">

        {/* 메타 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-10 pb-6 border-b">
          <a href="/news" className="text-blue-700 hover:underline font-medium">← 목록으로</a>
          <span>|</span>
          {item.country && <span>📍 {item.country}</span>}
          {item.missionaries?.korean_name && (
            <span>✍️ {item.missionaries.korean_name} 선교사</span>
          )}
          {item.published_at && (
            <span>
              {new Date(item.published_at).toLocaleDateString("ko-KR", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          )}
        </div>

        {/* 본문 내용 */}
        <div className="text-gray-700 leading-9 whitespace-pre-wrap text-base">
          {item.content_ko}
        </div>

        {/* 기도제목 섹션 */}
        {item.prayer_requests && (
          <div className="mt-14 bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
              🙏 기도제목
            </h2>
            <div className="text-amber-900 text-sm leading-8 whitespace-pre-wrap">
              {item.prayer_requests}
            </div>
          </div>
        )}

        {/* 하단 링크 */}
        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <a href="/news" className="text-sm text-blue-700 hover:underline">
            ← 목록으로 돌아가기
          </a>
          <a href="/donate" className="text-sm bg-blue-950 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition font-medium">
            후원으로 응답하기
          </a>
        </div>
      </article>
    </main>
  );
}
