"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Application {
  id: string;
  title: string;
  application_type: string;
  status: string;
  created_at: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "접수완료", color: "bg-gray-100 text-gray-600" },
  reviewing: { label: "검토중",  color: "bg-blue-100 text-blue-700" },
  approved:  { label: "승인완료", color: "bg-green-100 text-green-700" },
  rejected:  { label: "반려",    color: "bg-red-100 text-red-600" },
  cancelled: { label: "취소",    color: "bg-gray-100 text-gray-400" },
};

const TYPE_LABEL: Record<string, string> = {
  sabbatical_flight: "안식년 항공권 지원",
  health_checkup:    "건강검진",
  sabbatical_loan:   "안식년 대출 지원",
  mission_house:     "선교관 사용",
  vehicle:           "차량 사용",
  travel:            "여행 신청",
};

export default function IntranetApplicationsPage() {
  const [apps, setApps]     = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: m } = await supabase
        .from("missionaries").select("id").eq("user_id", user.id).single();
      if (!m) { setLoading(false); return; }

      const { data } = await supabase
        .from("applications")
        .select("id, title, application_type, status, created_at")
        .eq("missionary_id", m.id)
        .order("created_at", { ascending: false });
      if (data) setApps(data);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내 신청 현황</h1>
          <p className="text-sm text-gray-500 mt-1">제출한 신청서의 진행 상황을 확인하세요.</p>
        </div>
        <a href="/intranet/applications/new"
          className="bg-blue-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition">
          + 신청하기
        </a>
      </div>

      {loading ? (
        <p className="text-gray-400 py-10 text-center">불러오는 중...</p>
      ) : apps.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <p className="text-gray-400 mb-4">신청 내역이 없습니다.</p>
          <a href="/intranet/applications/new"
            className="text-sm bg-blue-950 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-900 transition inline-block">
            첫 신청하기
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => {
            const s = STATUS[a.status] ?? { label: a.status, color: "bg-gray-100 text-gray-500" };
            return (
              <div key={a.id} className="flex items-center gap-4 bg-white rounded-2xl border p-5">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{a.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {TYPE_LABEL[a.application_type] ?? a.application_type} ·{" "}
                    {new Date(a.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${s.color}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
