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
  slug: string;
}

const CATEGORIES = ["전체", "news", "testimony"];
const CATEGORY_LABEL: Record<string, string> = { news: "소식", testimony: "간증" };

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [filtered, setFiltered] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("news")
        .select("id, title_ko, content_ko, category, thumbnail_url, published_at, slug")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (data) {
        setItems(data);
        setFiltered(data);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleFilter = (cat: string) => {
    setCategory(cat);
    setFiltered(cat === "전체" ? items : items.filter((i) => i.category === cat));
    setSelected(null);
  };

  return (
    <main className="bg-white min-h-screen text-gray-900">
      <section className="bg-blue-950 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">소식 / 간증</h1>
        <p className="text-blue-200 text-lg">선교 현장의 소식과 하나님의 역사를 전합니다</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => handleFilter(c)}
              className={`text-sm px-4 py-2 rounded-full border transition ${
                category === c
                  ? "bg-blue-950 text-white border-blue-950"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {c === "전체" ? "전체" : CATEGORY_LABEL[c] ?? c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-20">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">등록된 소식이 없습니다.</p>
          </div>
        ) : selected ? (
          /* 상세 보기 */
          <div>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-blue-700 hover:underline mb-6 flex items-center gap-1"
            >
              ← 목록으로
            </button>
            <article className="max-w-3xl">
              <span className="text-xs text-blue-700 font-semibold uppercase">
                {CATEGORY_LABEL[selected.category] ?? selected.category}
              </span>
              <h2 className="text-3xl font-bold mt-2 mb-3 text-gray-900">{selected.title_ko}</h2>
              <p className="text-sm text-gray-400 mb-8">
                {selected.published_at
                  ? new Date(selected.published_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
                  : ""}
              </p>
              {selected.thumbnail_url && (
                <img
                  src={selected.thumbnail_url}
                  alt={selected.title_ko}
                  className="w-full rounded-2xl object-cover mb-8 max-h-80"
                />
              )}
              <div className="text-gray-700 leading-8 whitespace-pre-wrap">{selected.content_ko}</div>
            </article>
          </div>
        ) : (
          /* 목록 */
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="text-left bg-white border rounded-2xl overflow-hidden hover:shadow-md transition"
              >
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title_ko} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-4xl opacity-30">✦</span>
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs text-blue-700 font-semibold">
                    {CATEGORY_LABEL[item.category] ?? item.category}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-1 mb-2 line-clamp-2">{item.title_ko}</h3>
                  {item.content_ko && (
                    <p className="text-sm text-gray-500 line-clamp-2">{item.content_ko}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("ko-KR")
                      : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
