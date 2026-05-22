"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function NewNoticePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", is_pinned: false, attachment_url: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("notices").insert({
      title:          form.title,
      content:        form.content,
      is_pinned:      form.is_pinned,
      attachment_url: form.attachment_url || null,
      created_by:     user?.id ?? null,
    });
    if (err) setError("저장 실패: " + err.message);
    else router.push("/admin/notices");
    setSaving(false);
  };

  return (
    <main className="p-8 max-w-3xl">
      <div className="mb-6">
        <a href="/admin/notices" className="text-sm text-blue-700 hover:underline mb-3 inline-block">← 공지 목록</a>
        <h1 className="text-2xl font-bold">공지 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        <div>
          <label className={LABEL}>제목 <span className="text-red-500">*</span></label>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required className={INPUT} placeholder="공지 제목" />
        </div>

        <div>
          <label className={LABEL}>내용</label>
          <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            rows={10} className={INPUT} placeholder="공지 내용을 입력하세요." />
        </div>

        <div>
          <label className={LABEL}>첨부파일 URL (선택)</label>
          <input value={form.attachment_url} onChange={(e) => setForm((p) => ({ ...p, attachment_url: e.target.value }))}
            className={INPUT} placeholder="https://..." />
          <p className="text-xs text-gray-400 mt-1">Supabase Storage에 업로드 후 URL을 입력하세요.</p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_pinned}
            onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-medium text-gray-700">📌 중요 공지로 상단 고정</span>
        </label>

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-blue-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-900 transition">
            {saving ? "저장 중..." : "공지 등록"}
          </button>
          <a href="/admin/notices" className="border px-6 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">취소</a>
        </div>
      </form>
    </main>
  );
}
