"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Document {
  id: string;
  title: string;
  category: string;
  file_url: string;
  visibility: string;
  created_at: string;
}

const CATEGORIES = ["전체", "일반", "선교", "재정", "보고서", "기타"];
const VISIBILITY_LABEL: Record<string, string> = {
  private: "비공개", staff: "스태프", admin: "관리자", public: "공개",
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [filter, setFilter] = useState("전체");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("일반");
  const [visibility, setVisibility] = useState("private");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    const query = supabase.from("documents").select("*").order("created_at", { ascending: false });
    const { data } = filter === "전체" ? await query : await query.eq("category", filter);
    if (data) setDocs(data);
  };

  useEffect(() => { fetchDocs(); }, [filter]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title) return;

    setUploading(true);
    const path = `documents/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);

    if (uploadError) {
      alert("파일 업로드 실패: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);

    const { error } = await supabase.from("documents").insert([{
      title, category, file_url: publicUrl, visibility,
    }]);

    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      setTitle("");
      setCategory("일반");
      setVisibility("private");
      if (fileRef.current) fileRef.current.value = "";
      fetchDocs();
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("documents").delete().eq("id", id);
    fetchDocs();
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-1">문서 관리</h1>
      <p className="text-sm text-gray-500 mb-6">파일을 업로드하고 관리합니다.</p>

      {/* 업로드 폼 */}
      <form onSubmit={handleUpload} className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">파일 업로드</h2>
        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="문서 제목" className="border rounded-lg px-3 py-2 text-sm md:col-span-2" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {CATEGORIES.filter((c) => c !== "전체").map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {Object.entries(VISIBILITY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" ref={fileRef} required className="text-sm flex-1" />
          <button type="submit" disabled={uploading} className="bg-blue-950 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        </div>
      </form>

      {/* 필터 */}
      <div className="flex gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${filter === c ? "bg-blue-950 text-white border-blue-950" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* 문서 목록 */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {docs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">등록된 문서가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">제목</th>
                <th className="text-left px-4 py-3">카테고리</th>
                <th className="text-left px-4 py-3">공개 범위</th>
                <th className="text-left px-4 py-3">등록일</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{doc.title}</td>
                  <td className="px-4 py-3 text-gray-500">{doc.category}</td>
                  <td className="px-4 py-3 text-gray-500">{VISIBILITY_LABEL[doc.visibility] ?? doc.visibility}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(doc.created_at).toLocaleDateString("ko-KR")}</td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <a href={doc.file_url} target="_blank" className="text-blue-700 hover:underline text-xs">다운로드</a>
                    <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:underline text-xs">삭제</button>
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
