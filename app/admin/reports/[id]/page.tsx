"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";

interface Missionary { id: string; korean_name: string; country: string; }

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    missionary_id: "", title: "", content: "",
    report_type: "monthly", period_start: "", period_end: "", status: "draft",
  });

  useEffect(() => {
    Promise.all([
      supabase.from("missionaries").select("id, korean_name, country").order("korean_name"),
      supabase.from("reports").select("*").eq("id", id).single(),
    ]).then(([{ data: mData }, { data: rData, error: rError }]) => {
      if (mData) setMissionaries(mData);
      if (rError || !rData) { setError("데이터를 불러올 수 없습니다."); setLoading(false); return; }
      setForm({
        missionary_id: rData.missionary_id ?? "",
        title: rData.title ?? "",
        content: rData.content ?? "",
        report_type: rData.report_type ?? "monthly",
        period_start: rData.period_start ?? "",
        period_end: rData.period_end ?? "",
        status: rData.status ?? "draft",
      });
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase.from("reports").update({
      missionary_id: form.missionary_id || null,
      title: form.title,
      content: form.content || null,
      report_type: form.report_type,
      period_start: form.period_start || null,
      period_end: form.period_end || null,
      status: form.status,
      updated_at: new Date().toISOString(),
    }).eq("id", id);

    if (error) setError("저장 실패: " + error.message);
    else router.push("/admin/reports");
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-gray-400">불러오는 중...</div>;

  return (
    <main className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">보고서 수정</h1>
        <p className="text-sm text-gray-500 mt-1">보고서 내용을 수정합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>선교사</label>
            <select name="missionary_id" value={form.missionary_id} onChange={handleChange} className={INPUT}>
              <option value="">— 선택하세요 —</option>
              {missionaries.map((m) => (
                <option key={m.id} value={m.id}>{m.korean_name} ({m.country})</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>보고서 유형</label>
            <select name="report_type" value={form.report_type} onChange={handleChange} className={INPUT}>
              <option value="monthly">월간 보고서</option>
              <option value="quarterly">분기 보고서</option>
              <option value="annual">연간 보고서</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>기간 시작</label>
            <input type="date" name="period_start" value={form.period_start} onChange={handleChange} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>기간 종료</label>
            <input type="date" name="period_end" value={form.period_end} onChange={handleChange} className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>제목 <span className="text-red-500">*</span></label>
          <input name="title" value={form.title} onChange={handleChange} required className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>내용</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={10} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>상태</label>
          <select name="status" value={form.status} onChange={handleChange} className={INPUT}>
            <option value="draft">초안</option>
            <option value="submitted">제출됨</option>
            <option value="reviewed">검토완료</option>
            <option value="published">게시됨</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-blue-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-900 transition">
            {saving ? "저장 중..." : "수정 저장"}
          </button>
          <a href="/admin/reports" className="border px-6 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">취소</a>
        </div>
      </form>
    </main>
  );
}
