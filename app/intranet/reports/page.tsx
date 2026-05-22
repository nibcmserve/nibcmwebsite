"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Report {
  id: string;
  title: string;
  report_type: string;
  status: string;
  admin_feedback: string;
  created_at: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  draft:     { label: "임시저장", color: "bg-gray-100 text-gray-500" },
  submitted: { label: "제출완료", color: "bg-blue-100 text-blue-700" },
  reviewed:  { label: "검토완료", color: "bg-yellow-100 text-yellow-700" },
  published: { label: "게시됨",  color: "bg-green-100 text-green-700" },
};

const TYPE_LABEL: Record<string, string> = {
  ministry:        "사역 보고서",
  support_result:  "지원 결과 보고서",
  settlement:      "정산 보고서",
  prayer_letter:   "기도편지",
  monthly:         "월간 보고서",
  quarterly:       "분기 보고서",
  annual:          "연간 보고서",
  other:           "기타",
};

export default function IntranetReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: m } = await supabase
        .from("missionaries").select("id").eq("user_id", user.id).single();
      if (!m) { setLoading(false); return; }

      const { data } = await supabase
        .from("reports")
        .select("id, title, report_type, status, admin_feedback, created_at")
        .eq("missionary_id", m.id)
        .order("created_at", { ascending: false });
      if (data) setReports(data);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">보고서</h1>
          <p className="text-sm text-gray-500 mt-1">제출한 보고서와 피드백을 확인하세요.</p>
        </div>
        <a href="/intranet/reports/new"
          className="bg-blue-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition">
          + 보고서 제출
        </a>
      </div>

      {loading ? (
        <p className="text-gray-400 py-10 text-center">불러오는 중...</p>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <p className="text-gray-400 mb-4">제출한 보고서가 없습니다.</p>
          <a href="/intranet/reports/new"
            className="text-sm bg-blue-950 text-white px-5 py-2.5 rounded-lg font-semibold inline-block">
            보고서 제출하기
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const s = STATUS[r.status] ?? { label: r.status, color: "bg-gray-100 text-gray-500" };
            return (
              <div key={r.id} className="bg-white rounded-2xl border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{r.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {TYPE_LABEL[r.report_type] ?? r.report_type} ·{" "}
                      {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${s.color}`}>
                    {s.label}
                  </span>
                </div>
                {r.admin_feedback && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold text-blue-700 mb-1">관리자 피드백</p>
                    <p className="text-sm text-gray-600">{r.admin_feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
