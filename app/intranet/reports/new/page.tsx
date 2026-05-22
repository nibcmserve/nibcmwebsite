"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";

const REPORT_TYPES = [
  { value: "ministry",       label: "사역 보고서" },
  { value: "support_result", label: "지원 결과 보고서" },
  { value: "settlement",     label: "정산 보고서" },
  { value: "prayer_letter",  label: "기도편지" },
  { value: "monthly",        label: "월간 보고서" },
  { value: "quarterly",      label: "분기 보고서" },
  { value: "annual",         label: "연간 보고서" },
  { value: "other",          label: "기타" },
];

export default function NewReportPage() {
  const router = useRouter();
  const [missionaryId, setMissionaryId] = useState<string | null>(null);
  const [form, setForm] = useState({
    report_type: "",
    title: "",
    content: "",
    period_start: "",
    period_end: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: m } = await supabase
        .from("missionaries").select("id").eq("user_id", user.id).single();
      if (m) setMissionaryId(m.id);
    });
  }, []);

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionaryId) return;
    setSaving(true);
    setError("");

    const { error: err } = await supabase.from("reports").insert({
      missionary_id: missionaryId,
      report_type:   form.report_type,
      title:         form.title,
      content:       form.content,
      period_start:  form.period_start || null,
      period_end:    form.period_end   || null,
      status:        "submitted",
    });

    if (err) setError("제출 실패: " + err.message);
    else router.push("/intranet/reports");
    setSaving(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <a href="/intranet/reports" className="text-sm text-blue-700 hover:underline mb-3 inline-block">← 보고서 목록</a>
        <h1 className="text-2xl font-bold text-gray-900">보고서 제출</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>보고서 종류 <span className="text-red-500">*</span></label>
            <select
              value={form.report_type}
              onChange={(e) => set("report_type", e.target.value)}
              required
              className={INPUT}
            >
              <option value="">— 선택하세요 —</option>
              {REPORT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>제출 기간 (시작)</label>
            <input type="date" className={INPUT} onChange={(e) => set("period_start", e.target.value)} />
          </div>
          <div className="sm:col-start-2">
            <label className={LABEL}>제출 기간 (종료)</label>
            <input type="date" className={INPUT} onChange={(e) => set("period_end", e.target.value)} />
          </div>
        </div>

        <div>
          <label className={LABEL}>제목 <span className="text-red-500">*</span></label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            className={INPUT}
            placeholder="보고서 제목을 입력하세요"
          />
        </div>

        <div>
          <label className={LABEL}>내용 <span className="text-red-500">*</span></label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            required
            rows={12}
            className={INPUT}
            placeholder="보고서 내용을 입력하세요&#10;&#10;사역 내용, 감사 제목, 기도 제목 등을 자유롭게 작성해 주세요."
          />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-950 text-white px-7 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-900 transition"
          >
            {saving ? "제출 중..." : "보고서 제출"}
          </button>
          <a href="/intranet/reports" className="border px-6 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            취소
          </a>
        </div>
      </form>
    </div>
  );
}
