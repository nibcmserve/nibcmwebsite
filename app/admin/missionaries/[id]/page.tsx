"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function EditMissionaryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    korean_name: "", english_name: "", country: "", city: "",
    ministry_type: "", status: "사역 중", bio_ko: "", bio_en: "", started_at: "",
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("missionaries").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) { setError("데이터를 불러올 수 없습니다."); setLoading(false); return; }
      setForm({
        korean_name: data.korean_name ?? "",
        english_name: data.english_name ?? "",
        country: data.country ?? "",
        city: data.city ?? "",
        ministry_type: data.ministry_type ?? "",
        status: data.status ?? "사역 중",
        bio_ko: data.bio_ko ?? "",
        bio_en: data.bio_en ?? "",
        started_at: data.started_at ?? "",
      });
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase.from("missionaries").update({
      korean_name: form.korean_name,
      english_name: form.english_name || null,
      country: form.country || null,
      city: form.city || null,
      ministry_type: form.ministry_type || null,
      status: form.status,
      bio_ko: form.bio_ko || null,
      bio_en: form.bio_en || null,
      started_at: form.started_at || null,
      updated_at: new Date().toISOString(),
    }).eq("id", id);

    if (error) {
      setError("수정 중 오류가 발생했습니다: " + error.message);
    } else {
      router.push("/admin/missionaries");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-gray-400">불러오는 중...</div>;

  return (
    <main className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">선교사 정보 수정</h1>
        <p className="text-sm text-gray-500 mt-1">선교사 정보를 수정합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-8 space-y-6">
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">기본 정보</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>한국어 이름 <span className="text-red-500">*</span></label>
              <input name="korean_name" value={form.korean_name} onChange={handleChange} required className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>영문 이름</label>
              <input name="english_name" value={form.english_name} onChange={handleChange} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>국가</label>
              <input name="country" value={form.country} onChange={handleChange} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>도시</label>
              <input name="city" value={form.city} onChange={handleChange} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>사역 분야</label>
              <input name="ministry_type" value={form.ministry_type} onChange={handleChange} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>파송일</label>
              <input type="date" name="started_at" value={form.started_at} onChange={handleChange} className={INPUT} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">상태</h2>
          <select name="status" value={form.status} onChange={handleChange} className={INPUT}>
            <option value="사역 중">사역 중</option>
            <option value="안식년">안식년</option>
            <option value="안식월">안식월</option>
            <option value="귀국">귀국</option>
            <option value="대기">대기</option>
          </select>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">소개</h2>
          <div className="space-y-4">
            <div>
              <label className={LABEL}>소개 (한국어)</label>
              <textarea name="bio_ko" value={form.bio_ko} onChange={handleChange} rows={4} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>소개 (영문)</label>
              <textarea name="bio_en" value={form.bio_en} onChange={handleChange} rows={4} className={INPUT} />
            </div>
          </div>
        </section>

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-blue-950 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-900 transition">
            {saving ? "저장 중..." : "수정 저장"}
          </button>
          <a href="/admin/missionaries" className="border px-6 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            취소
          </a>
        </div>
      </form>
    </main>
  );
}
