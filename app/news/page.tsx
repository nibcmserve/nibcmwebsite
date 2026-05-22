"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

interface NewsItem {
  id: string;
  title_ko: string;
  content_ko: string;
  category: string;
  thumbnail_url: string;
  published_at: string;
  country: string;
}

const CATEGORIES = [
  { value: "전체",    label: "전체" },
  { value: "선교회 소식", label: "선교회 소식" },
  { value: "사역지 소식", label: "사역지 소식" },
  { value: "기도제목",   label: "기도제목" },
  { value: "선교사 이야기", label: "선교사 이야기" },
  { value: "news",      label: "소식" },
  { value: "testimony", label: "간증" },
];

const CATEGORY_COLOR: Record<string, string> = {
  "기도제목":     "bg-amber-50 text-amber-700",
  "선교사 이야기": "bg-purple-50 text-purple-700",
  "사역지 소식":  "bg-green-50 text-green-700",
  "선교회 소식":  "bg-blue-50 text-blue-700",
  "testimony":    "bg-purple-50 text-purple-700",
  "news":         "bg-blue-50 text-blue-700",
};

export default function NewsPage() {
  const [items, setItems]       = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState("전체");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase
      .from("news")
      .select("id, title_ko, content_ko, category, thumbnail_url, published_at, country")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (data) { setItems(data); setFiltered(data); }
        setLoading(false);
      });
  }, []);

  const handleFilter = (cat: string) => {
    setCategory(cat);
    setFiltered(cat === "전체" ? items : items.filter((i) => i.category === cat));
  };

  return (
    <main className="bg-white min-h-screen text-gray-900">

      {/* 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">News &amp; Prayer</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">소식</h1>
        <p className="text-blue-200 text-lg">선교 현장의 소식과 기도제목을 나눕니다</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => handleFilter(c.value)}
              className={`text-sm px-4 py-2 rounded-full border transition ${
                category === c.value
                  ? "bg-blue-950 text-white border-blue-950"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-20">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">등록된 소식이 없습니다.</p>
            <p className="text-gray-300 text-sm mt-2">관리자에서 소식을 등록하면 자동으로 표시됩니다.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <a
                key={item.id}
                href={`/news/${item.id}`}
                className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition group"
              >
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title_ko}
                    className="w-full h-44 object-cover group-hover:opacity-95 transition"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-4xl opacity-20">✦</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLOR[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {item.category}
                    </span>
                    {item.country && (
                      <span className="text-xs text-gray-400">{item.country}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition">
                    {item.title_ko}
                  </h3>
                  {item.content_ko && (
                    <p className="text-sm text-gray-500 line-clamp-2">{item.content_ko}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("ko-KR")
                      : ""}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
