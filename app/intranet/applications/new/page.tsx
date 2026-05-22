"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

const INPUT = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900";
const LABEL = "block text-sm font-semibold text-gray-700 mb-1.5";
const SECTION = "bg-gray-50 rounded-xl p-5 space-y-4";

const APP_TYPES = [
  { value: "sabbatical_flight", label: "안식년 항공권 지원 신청" },
  { value: "health_checkup",    label: "건강검진 신청" },
  { value: "sabbatical_loan",   label: "안식년 대출 지원 신청" },
  { value: "mission_house",     label: "선교관 사용 신청" },
  { value: "vehicle",           label: "차량 사용 신청" },
  { value: "travel",            label: "선교사 여행 신청" },
];

export default function NewApplicationPage() {
  const router = useRouter();
  const [missionaryId, setMissionaryId] = useState<string | null>(null);
  const [appType, setAppType] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: m } = await supabase
        .from("missionaries").select("id").eq("user_id", user.id).single();
      if (m) setMissionaryId(m.id);
    });
  }, []);

  const set = (key: string, val: string) =>
    setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionaryId || !appType) return;
    setSaving(true);
    setError("");

    const title = APP_TYPES.find((t) => t.value === appType)?.label ?? appType;
    const { error: err } = await supabase.from("applications").insert({
      missionary_id:    missionaryId,
      application_type: appType,
      title,
      form_data:        formData,
      status:           "pending",
    });

    if (err) setError("제출 실패: " + err.message);
    else router.push("/intranet/applications");
    setSaving(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <a href="/intranet/applications" className="text-sm text-blue-700 hover:underline mb-3 inline-block">← 신청 목록</a>
        <h1 className="text-2xl font-bold text-gray-900">신청서 제출</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 신청 종류 선택 */}
        <div className="bg-white rounded-2xl border p-6">
          <label className={LABEL}>신청 종류 <span className="text-red-500">*</span></label>
          <div className="grid sm:grid-cols-2 gap-3">
            {APP_TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => { setAppType(t.value); setFormData({}); }}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                  appType === t.value
                    ? "bg-blue-950 text-white border-blue-950 font-semibold"
                    : "bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 신청 종류별 폼 */}
        {appType === "sabbatical_flight" && (
          <div className={SECTION}>
            <h3 className="font-bold text-gray-800 mb-2">안식년 항공권 지원 신청</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={LABEL}>안식년 기간</label><input className={INPUT} placeholder="예) 2026.06 ~ 2026.12" onChange={(e) => set("sabbatical_period", e.target.value)} /></div>
              <div><label className={LABEL}>출국일</label><input type="date" className={INPUT} onChange={(e) => set("departure_date", e.target.value)} /></div>
              <div><label className={LABEL}>귀국 예정일</label><input type="date" className={INPUT} onChange={(e) => set("return_date", e.target.value)} /></div>
              <div><label className={LABEL}>출발 국가</label><input className={INPUT} placeholder="예) 태국" onChange={(e) => set("departure_country", e.target.value)} /></div>
              <div><label className={LABEL}>도착 국가</label><input className={INPUT} placeholder="예) 한국" onChange={(e) => set("arrival_country", e.target.value)} /></div>
              <div><label className={LABEL}>가족 동반 여부</label>
                <select className={INPUT} onChange={(e) => set("family_included", e.target.value)}>
                  <option value="">선택</option>
                  <option value="본인만">본인만</option>
                  <option value="배우자 포함">배우자 포함</option>
                  <option value="자녀 포함">자녀 포함</option>
                  <option value="전 가족">전 가족</option>
                </select>
              </div>
              <div><label className={LABEL}>항공권 예상 금액</label><input className={INPUT} placeholder="예) 150만원" onChange={(e) => set("estimated_cost", e.target.value)} /></div>
            </div>
            <div><label className={LABEL}>신청 사유</label><textarea className={INPUT} rows={4} onChange={(e) => set("reason", e.target.value)} /></div>
          </div>
        )}

        {appType === "health_checkup" && (
          <div className={SECTION}>
            <h3 className="font-bold text-gray-800 mb-2">건강검진 신청</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={LABEL}>검진 희망 지역</label><input className={INPUT} placeholder="예) 서울" onChange={(e) => set("checkup_region", e.target.value)} /></div>
              <div><label className={LABEL}>검진 희망 일정</label><input type="date" className={INPUT} onChange={(e) => set("checkup_date", e.target.value)} /></div>
              <div><label className={LABEL}>가족 포함 여부</label>
                <select className={INPUT} onChange={(e) => set("family_included", e.target.value)}>
                  <option value="">선택</option>
                  <option value="본인만">본인만</option>
                  <option value="가족 포함">가족 포함</option>
                </select>
              </div>
            </div>
            <div><label className={LABEL}>건강 관련 참고사항</label><textarea className={INPUT} rows={3} onChange={(e) => set("health_notes", e.target.value)} /></div>
          </div>
        )}

        {appType === "sabbatical_loan" && (
          <div className={SECTION}>
            <h3 className="font-bold text-gray-800 mb-2">안식년 대출 지원 신청</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={LABEL}>안식년 기간</label><input className={INPUT} placeholder="예) 2026.06 ~ 2026.12" onChange={(e) => set("sabbatical_period", e.target.value)} /></div>
              <div><label className={LABEL}>신청 금액</label><input className={INPUT} placeholder="예) 500만원" onChange={(e) => set("loan_amount", e.target.value)} /></div>
            </div>
            <div><label className={LABEL}>사용 목적</label><textarea className={INPUT} rows={3} onChange={(e) => set("purpose", e.target.value)} /></div>
            <div><label className={LABEL}>상환 계획</label><textarea className={INPUT} rows={3} onChange={(e) => set("repayment_plan", e.target.value)} /></div>
            <div><label className={LABEL}>추가 설명</label><textarea className={INPUT} rows={2} onChange={(e) => set("notes", e.target.value)} /></div>
          </div>
        )}

        {appType === "mission_house" && (
          <div className={SECTION}>
            <h3 className="font-bold text-gray-800 mb-2">선교관 사용 신청</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={LABEL}>사용 시작일</label><input type="date" className={INPUT} onChange={(e) => set("start_date", e.target.value)} /></div>
              <div><label className={LABEL}>사용 종료일</label><input type="date" className={INPUT} onChange={(e) => set("end_date", e.target.value)} /></div>
              <div><label className={LABEL}>사용 인원</label><input className={INPUT} placeholder="예) 3명" onChange={(e) => set("occupants", e.target.value)} /></div>
              <div><label className={LABEL}>가족 동반 여부</label>
                <select className={INPUT} onChange={(e) => set("family_included", e.target.value)}>
                  <option value="">선택</option>
                  <option value="본인만">본인만</option>
                  <option value="가족 포함">가족 포함</option>
                </select>
              </div>
            </div>
            <div><label className={LABEL}>사용 목적</label><textarea className={INPUT} rows={3} onChange={(e) => set("purpose", e.target.value)} /></div>
            <div><label className={LABEL}>요청 사항</label><textarea className={INPUT} rows={2} onChange={(e) => set("requests", e.target.value)} /></div>
          </div>
        )}

        {appType === "vehicle" && (
          <div className={SECTION}>
            <h3 className="font-bold text-gray-800 mb-2">차량 사용 신청</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={LABEL}>사용 날짜</label><input type="date" className={INPUT} onChange={(e) => set("use_date", e.target.value)} /></div>
              <div><label className={LABEL}>사용 시간</label><input className={INPUT} placeholder="예) 오전 10시 ~ 오후 3시" onChange={(e) => set("use_time", e.target.value)} /></div>
              <div><label className={LABEL}>목적지</label><input className={INPUT} placeholder="예) 인천공항" onChange={(e) => set("destination", e.target.value)} /></div>
              <div><label className={LABEL}>동승 인원</label><input className={INPUT} placeholder="예) 2명" onChange={(e) => set("passengers", e.target.value)} /></div>
            </div>
            <div><label className={LABEL}>사용 목적</label><textarea className={INPUT} rows={3} onChange={(e) => set("purpose", e.target.value)} /></div>
          </div>
        )}

        {appType === "travel" && (
          <div className={SECTION}>
            <h3 className="font-bold text-gray-800 mb-2">선교사 여행 신청</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={LABEL}>여행 종류</label>
                <select className={INPUT} onChange={(e) => set("travel_type", e.target.value)}>
                  <option value="">선택</option>
                  <option value="사역">사역</option>
                  <option value="업무">업무</option>
                  <option value="휴가">휴가</option>
                  <option value="안식월">안식월</option>
                </select>
              </div>
              <div><label className={LABEL}>출발일</label><input type="date" className={INPUT} onChange={(e) => set("departure_date", e.target.value)} /></div>
              <div><label className={LABEL}>복귀일</label><input type="date" className={INPUT} onChange={(e) => set("return_date", e.target.value)} /></div>
              <div><label className={LABEL}>방문 국가/지역</label><input className={INPUT} placeholder="예) 태국 방콕" onChange={(e) => set("destination", e.target.value)} /></div>
              <div><label className={LABEL}>긴급 연락처</label><input className={INPUT} placeholder="010-0000-0000" onChange={(e) => set("emergency_contact", e.target.value)} /></div>
            </div>
            <div><label className={LABEL}>여행 목적</label><textarea className={INPUT} rows={3} onChange={(e) => set("purpose", e.target.value)} /></div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        {appType && (
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-950 text-white px-7 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-900 transition"
            >
              {saving ? "제출 중..." : "신청서 제출"}
            </button>
            <a href="/intranet/applications" className="border px-6 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              취소
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
