"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";

interface Missionary {
  id: string;
  korean_name: string;
  english_name: string;
  country: string;
  city: string;
  ministry_type: string;
  started_at: string;
  bio_ko: string;
}

interface Family {
  id?: string;
  relationship: string;
  name_ko: string;
  name_en: string;
  birth_date: string;
}

export default function IntranetProfilePage() {
  const [missionary, setMissionary] = useState<Missionary | null>(null);
  const [families, setFamilies]     = useState<Family[]>([]);
  const [missionaryId, setMissionaryId] = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: m } = await supabase
        .from("missionaries")
        .select("id, korean_name, english_name, country, city, ministry_type, started_at, bio_ko")
        .eq("user_id", user.id)
        .single();

      if (m) {
        setMissionary(m);
        setMissionaryId(m.id);

        const { data: fams } = await supabase
          .from("missionary_families")
          .select("id, relationship, name_ko, name_en, birth_date")
          .eq("missionary_id", m.id);
        if (fams) setFamilies(fams);
      }
    };
    init();
  }, []);

  const setField = (key: keyof Missionary, val: string) =>
    setMissionary((p) => p ? { ...p, [key]: val } : p);

  const setFamilyField = (idx: number, key: keyof Family, val: string) => {
    setFamilies((p) => p.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  };

  const addFamily = () => {
    setFamilies((p) => [...p, { relationship: "배우자", name_ko: "", name_en: "", birth_date: "" }]);
  };

  const removeFamily = (idx: number) => {
    setFamilies((p) => p.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!missionary || !missionaryId) return;
    setSaving(true);
    setError("");

    const { error: e1 } = await supabase.from("missionaries").update({
      korean_name:  missionary.korean_name,
      english_name: missionary.english_name,
      country:      missionary.country,
      city:         missionary.city,
      ministry_type: missionary.ministry_type,
      started_at:   missionary.started_at || null,
      bio_ko:       missionary.bio_ko,
      updated_at:   new Date().toISOString(),
    }).eq("id", missionaryId);

    if (e1) { setError("저장 실패: " + e1.message); setSaving(false); return; }

    // 가족 정보 저장
    await supabase.from("missionary_families").delete().eq("missionary_id", missionaryId);
    const toInsert = families.filter((f) => f.name_ko.trim());
    if (toInsert.length > 0) {
      await supabase.from("missionary_families").insert(
        toInsert.map((f) => ({
          missionary_id: missionaryId,
          relationship:  f.relationship,
          name_ko:       f.name_ko,
          name_en:       f.name_en || null,
          birth_date:    f.birth_date || null,
        }))
      );
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  if (!missionary) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">선교사 정보를 찾을 수 없습니다.</p>
        <p className="text-xs text-gray-300 mt-2">관리자에게 계정 연결을 요청해 주세요.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">내 정보</h1>
        <p className="text-sm text-gray-500 mt-1">내 프로필과 가족 정보를 수정합니다.</p>
      </div>

      <div className="space-y-6">

        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl border p-7">
          <h2 className="font-bold text-gray-900 mb-5">기본 정보</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>한국어 이름 <span className="text-red-500">*</span></label>
              <input className={INPUT} value={missionary.korean_name}
                onChange={(e) => setField("korean_name", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>영문 이름</label>
              <input className={INPUT} value={missionary.english_name ?? ""}
                onChange={(e) => setField("english_name", e.target.value)} placeholder="Hong Gildong" />
            </div>
            <div>
              <label className={LABEL}>사역 국가</label>
              <input className={INPUT} value={missionary.country ?? ""}
                onChange={(e) => setField("country", e.target.value)} placeholder="태국" />
            </div>
            <div>
              <label className={LABEL}>사역 도시</label>
              <input className={INPUT} value={missionary.city ?? ""}
                onChange={(e) => setField("city", e.target.value)} placeholder="방콕" />
            </div>
            <div>
              <label className={LABEL}>사역 분야</label>
              <input className={INPUT} value={missionary.ministry_type ?? ""}
                onChange={(e) => setField("ministry_type", e.target.value)} placeholder="교회 개척, 청소년 사역" />
            </div>
            <div>
              <label className={LABEL}>파송일</label>
              <input type="date" className={INPUT} value={missionary.started_at ?? ""}
                onChange={(e) => setField("started_at", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <label className={LABEL}>소개글</label>
            <textarea
              className={INPUT}
              rows={4}
              value={missionary.bio_ko ?? ""}
              onChange={(e) => setField("bio_ko", e.target.value)}
              placeholder="간단한 자기소개를 입력해 주세요."
            />
          </div>
        </div>

        {/* 가족 정보 */}
        <div className="bg-white rounded-2xl border p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">가족 정보</h2>
            <button
              type="button"
              onClick={addFamily}
              className="text-sm text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
            >
              + 가족 추가
            </button>
          </div>

          {families.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              등록된 가족 정보가 없습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {families.map((f, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">가족 {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFamily(idx)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>관계</label>
                      <select
                        className={INPUT}
                        value={f.relationship}
                        onChange={(e) => setFamilyField(idx, "relationship", e.target.value)}
                      >
                        <option value="배우자">배우자</option>
                        <option value="자녀">자녀</option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>이름 (한국어)</label>
                      <input className={INPUT} value={f.name_ko}
                        onChange={(e) => setFamilyField(idx, "name_ko", e.target.value)} />
                    </div>
                    <div>
                      <label className={LABEL}>이름 (영문)</label>
                      <input className={INPUT} value={f.name_en}
                        onChange={(e) => setFamilyField(idx, "name_en", e.target.value)} />
                    </div>
                    <div>
                      <label className={LABEL}>생년월일</label>
                      <input type="date" className={INPUT} value={f.birth_date}
                        onChange={(e) => setFamilyField(idx, "birth_date", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 저장 버튼 */}
        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
        {saved  && <p className="text-green-600 text-sm bg-green-50 px-4 py-3 rounded-lg">✓ 저장되었습니다.</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-50"
        >
          {saving ? "저장 중..." : "변경사항 저장"}
        </button>
      </div>
    </div>
  );
}
