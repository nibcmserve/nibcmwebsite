"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function EditNoticePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", is_pinned: false, attachment_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!id) return;
    supabase.from("notices").select("*").eq("id", id).single()
      .then(({ data }) => {
        if (data) setForm({
          title:          data.title ?? "",
          content:        data.content ?? "",
          is_pinned:      data.is_pinned ?? false,
          attachment_url: data.attachment_url ?? "",
        });
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error: err } = await supabase.from("notices").update({
      title:          form.title,
      content:        form.content,
      is_pinned:      form.is_pinned,
      attachment_url: form.attachment_url || null,
      updated_at:     new Date().toISOString(),
    }).eq("id", id);
    if (err) setError("저장 실패: " + err.message);
    else router.push("/admin/notices");
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-gray-400">불러오는 중...</div>;

  return (
    <main className="p-8 max-w-3xl">
      <div className="mb-6">
        <a href="/admin/notices" className="text-sm text-blue-700 hover:underline mb-3 inline-block">← 공지 목록</a>
        <h1 className="text-2xl font-bold">공지 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        <div>
          <label className={LABEL}>제목 <span className="text-red-500">*</span></label>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>내용</label>
          <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            rows={10} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>첨부파일 URL</label>
          <input value={form.attachment_url} onChange={(e) => setForm((p) => ({ ...p, attachment_url: e.target.value }))}
            className={INPUT} placeholder="https://..." />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_pinned}
            onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))}
            className="w-4 h-4 rounded" />
          <span className="text-sm font-medium text-gray-700">📌 중요 공지로 상단 고정</span>
        </label>
        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-blue-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-900 transition">
            {saving ? "저장 중..." : "수정 저장"}
          </button>
          <a href="/admin/notices" className="border px-6 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">취소</a>
        </div>
      </form>
    </main>
  );
}
