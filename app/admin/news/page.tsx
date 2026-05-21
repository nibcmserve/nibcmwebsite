"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface NewsItem {
  id: string;
  title_ko: string;
  category: string;
  status: string;
  published_at: string;
  created_at: string;
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title_ko: "", title_en: "", content_ko: "", content_en: "",
    category: "news", status: "draft",
  });

  const fetchNews = async () => {
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { fetchNews(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const slug = form.title_ko
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, "-")
      .replace(/-+/g, "-")
      + "-" + Date.now();

    const { error } = await supabase.from("news").insert([{
      ...form,
      slug,
      published_at: form.status === "published" ? new Date().toISOString() : null,
    }]);

    if (error) alert("저장 실패: " + error.message);
    else {
      setForm({ title_ko: "", title_en: "", content_ko: "", content_en: "", category: "news", status: "draft" });
      setShowForm(false);
      fetchNews();
    }
    setSaving(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === "published" ? "draft" : "published";
    await supabase.from("news").update({
      status: next,
      published_at: next === "published" ? new Date().toISOString() : null,
    }).eq("id", id);
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("news").delete().eq("id", id);
    fetchNews();
  };

  const INPUT = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">소식 / 뉴스 관리</h1>
          <p className="text-sm text-gray-500 mt-1">공개 사이트에 표시될 소식을 작성합니다.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition"
        >
          {showForm ? "닫기" : "새 소식 작성"}
        </button>
      </div>

      {/* 작성 폼 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">제목 (한국어) *</label>
              <input name="title_ko" value={form.title_ko} onChange={handleChange} required className={INPUT} placeholder="소식 제목" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">제목 (영문)</label>
              <input name="title_en" value={form.title_en} onChange={handleChange} className={INPUT} placeholder="News title in English" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">카테고리</label>
              <select name="category" value={form.category} onChange={handleChange} className={INPUT}>
                <option value="news">소식/뉴스</option>
                <option value="testimony">간증/사역보고</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">상태</label>
              <select name="status" value={form.status} onChange={handleChange} className={INPUT}>
                <option value="draft">초안 (비공개)</option>
                <option value="published">게시 (공개)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">내용 (한국어) *</label>
            <textarea name="content_ko" value={form.content_ko} onChange={handleChange} required rows={8} className={INPUT} placeholder="소식 내용을 입력하세요" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">내용 (영문)</label>
            <textarea name="content_en" value={form.content_en} onChange={handleChange} rows={4} className={INPUT} placeholder="Content in English (optional)" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-blue-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50">
              {saving ? "저장 중..." : "저장하기"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2.5 rounded-lg text-sm text-gray-600">
              취소
            </button>
          </div>
        </form>
      )}

      {/* 목록 */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">작성된 소식이 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">제목</th>
                <th className="text-left px-4 py-3">카테고리</th>
                <th className="text-left px-4 py-3">상태</th>
                <th className="text-left px-4 py-3">게시일</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800 max-w-xs truncate">{item.title_ko}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category === "news" ? "소식" : "간증"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.status === "published" ? "게시됨" : "초안"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString("ko-KR") : "-"}
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button
                      onClick={() => toggleStatus(item.id, item.status)}
                      className="text-xs text-blue-700 hover:underline"
                    >
                      {item.status === "published" ? "비공개로" : "게시하기"}
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 hover:underline">삭제</button>
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
