"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";

const APPLICATION_TYPES = ["휴가", "안식년", "안식월", "항공권 지원", "건강지원", "가족여행", "선교관", "차량"];

interface Missionary { id: string; korean_name: string; country: string; }

export default function NewApplicationPage() {
  const router = useRouter();
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    missionary_id: "", application_type: "휴가", title: "", content: "",
  });

  useEffect(() => {
    supabase.from("missionaries").select("id, korean_name, country").order("korean_name")
      .then(({ data }) => { if (data) setMissionaries(data); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase.from("applications").insert([{
      missionary_id: form.missionary_id || null,
      application_type: form.application_type,
      title: form.title,
      content: form.content || null,
      status: "pending",
    }]);

    if (error) {
      setError("저장 실패: " + error.message);
    } else {
      router.push("/admin/applications");
    }
    setSaving(false);
  };

  return (
    <main className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">신청 등록</h1>
        <p className="text-sm text-gray-500 mt-1">선교사 신청을 대신 등록합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-5">
        <div>
          <label className={LABEL}>선교사 선택</label>
          <select name="missionary_id" value={form.missionary_id} onChange={handleChange} className={INPUT}>
            <option value="">— 선교사를 선택하세요 —</option>
            {missionaries.map((m) => (
              <option key={m.id} value={m.id}>{m.korean_name} ({m.country})</option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL}>신청 유형 <span className="text-red-500">*</span></label>
          <select name="application_type" value={form.application_type} onChange={handleChange} className={INPUT}>
            {APPLICATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={LABEL}>제목 <span className="text-red-500">*</span></label>
          <input name="title" value={form.title} onChange={handleChange} required className={INPUT} placeholder="예: 2026년 안식년 항공권 신청" />
        </div>

        <div>
          <label className={LABEL}>신청 내용</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={6} className={INPUT} placeholder="신청 내용, 일정, 사유 등을 입력하세요" />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-blue-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-900 transition">
            {saving ? "저장 중..." : "신청 등록"}
          </button>
          <a href="/admin/applications" className="border px-6 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">취소</a>
        </div>
      </form>
    </main>
  );
}
