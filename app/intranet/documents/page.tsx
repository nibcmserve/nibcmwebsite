"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Doc {
  id: string;
  title: string;
  category: string;
  file_url: string;
  created_at: string;
}

const CATEGORIES = [
  "전체",
  "지원 신청 양식",
  "보고서 양식",
  "정산 서류",
  "기도편지 양식",
  "내부 규정",
  "안내 자료",
  "기타",
];

export default function IntranetDocumentsPage() {
  const [docs, setDocs]       = useState<Doc[]>([]);
  const [filtered, setFiltered] = useState<Doc[]>([]);
  const [category, setCategory] = useState("전체");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase
      .from("documents")
      .select("id, title, category, file_url, created_at")
      .in("visibility", ["staff", "public"])
      .order("category")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) { setDocs(data); setFiltered(data); }
        setLoading(false);
      });
  }, []);

  const handleFilter = (cat: string) => {
    setCategory(cat);
    setFiltered(cat === "전체" ? docs : docs.filter((d) => d.category === cat));
  };

  const ext = (url: string) => url?.split(".").pop()?.toUpperCase() ?? "파일";

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">자료실</h1>
        <p className="text-sm text-gray-500 mt-1">필요한 양식과 자료를 다운로드하세요.</p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => handleFilter(c)}
            className={`text-sm px-3 py-1.5 rounded-full border transition ${
              category === c
                ? "bg-blue-950 text-white border-blue-950"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 py-10 text-center">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <p className="text-gray-400">등록된 자료가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 bg-white rounded-2xl border p-5 hover:border-blue-200 transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                {ext(doc.file_url)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {doc.category && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{doc.category}</span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(doc.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-semibold text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                다운로드
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
