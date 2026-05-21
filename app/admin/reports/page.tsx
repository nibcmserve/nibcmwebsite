"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Report {
  id: string;
  title: string;
  report_type: string;
  period_start: string;
  period_end: string;
  status: string;
  created_at: string;
  missionaries?: { korean_name: string };
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:     { label: "초안",    color: "bg-gray-100 text-gray-500" },
  submitted: { label: "제출됨",  color: "bg-blue-100 text-blue-700" },
  reviewed:  { label: "검토완료", color: "bg-yellow-100 text-yellow-700" },
  published: { label: "게시됨",  color: "bg-green-100 text-green-700" },
};

const TYPE_LABEL: Record<string, string> = {
  monthly: "월간", quarterly: "분기", annual: "연간",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*, missionaries(korean_name)")
      .order("created_at", { ascending: false });
    if (data) setReports(data);
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("reports").update({ status }).eq("id", id);
    fetchReports();
  };

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">보고서 관리</h1>
          <p className="text-sm text-gray-500 mt-1">선교사 보고서를 검토하고 관리합니다.</p>
        </div>
        <a href="/admin/reports/new" className="bg-blue-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition">
          보고서 등록
        </a>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {reports.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">등록된 보고서가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">제목</th>
                <th className="text-left px-4 py-3">선교사</th>
                <th className="text-left px-4 py-3">유형</th>
                <th className="text-left px-4 py-3">기간</th>
                <th className="text-left px-4 py-3">상태</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((r) => {
                const s = STATUS_LABEL[r.status] ?? { label: r.status, color: "bg-gray-100 text-gray-500" };
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">{r.title}</td>
                    <td className="px-4 py-3 text-gray-500">{r.missionaries?.korean_name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{TYPE_LABEL[r.report_type] ?? r.report_type}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {r.period_start && r.period_end ? `${r.period_start} ~ ${r.period_end}` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        {Object.entries(STATUS_LABEL).map(([v, { label }]) => (
                          <option key={v} value={v}>{label}</option>
                        ))}
                      </select>
                      <a href={`/admin/reports/${r.id}`} className="text-xs text-blue-700 hover:underline whitespace-nowrap">수정</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
