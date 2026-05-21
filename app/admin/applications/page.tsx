"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Application {
  id: string;
  title: string;
  application_type: string;
  content: string;
  status: string;
  admin_comment: string;
  submitted_at: string;
  missionaries?: { korean_name: string };
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "대기",   color: "bg-yellow-100 text-yellow-700" },
  reviewing: { label: "검토중", color: "bg-blue-100 text-blue-700" },
  approved:  { label: "승인",   color: "bg-green-100 text-green-700" },
  rejected:  { label: "반려",   color: "bg-red-100 text-red-700" },
  cancelled: { label: "취소",   color: "bg-gray-100 text-gray-500" },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("applications")
      .select("*, missionaries(korean_name)")
      .order("submitted_at", { ascending: false });
    if (data) setApplications(data);
  };

  useEffect(() => { fetchApplications(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    const { error } = await supabase.from("applications").update({
      status,
      admin_comment: comment || null,
      reviewed_at: new Date().toISOString(),
    }).eq("id", id);

    if (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    } else {
      fetchApplications();
      setSelected(null);
      setComment("");
    }
    setSaving(false);
  };

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">신청 관리</h1>
          <p className="text-sm text-gray-500 mt-1">선교사 신청을 검토하고 처리합니다.</p>
        </div>
        <a href="/admin/applications/new" className="bg-blue-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition">
          신청 등록
        </a>
      </div>

      <div className="flex gap-6">
        {/* 목록 */}
        <div className="w-80 shrink-0 space-y-2">
          {applications.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">등록된 신청이 없습니다.</p>
          )}
          {applications.map((app) => {
            const s = STATUS[app.status] ?? { label: app.status, color: "bg-gray-100 text-gray-500" };
            return (
              <button
                key={app.id}
                onClick={() => { setSelected(app); setComment(app.admin_comment ?? ""); }}
                className={`w-full text-left p-4 rounded-xl border transition ${selected?.id === app.id ? "border-blue-500 bg-blue-50" : "bg-white hover:bg-gray-50"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-700">{app.application_type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{app.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {app.missionaries?.korean_name ?? "선교사 미지정"} · {new Date(app.submitted_at).toLocaleDateString("ko-KR")}
                </p>
              </button>
            );
          })}
        </div>

        {/* 상세 */}
        {selected ? (
          <div className="flex-1 bg-white rounded-2xl border p-6">
            <div className="mb-5">
              <span className="text-xs font-semibold text-blue-700">{selected.application_type}</span>
              <h2 className="text-xl font-bold mt-1">{selected.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {selected.missionaries?.korean_name ?? "선교사 미지정"} · {new Date(selected.submitted_at).toLocaleDateString("ko-KR")}
              </p>
            </div>

            {selected.content && (
              <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-7 whitespace-pre-wrap mb-5">
                {selected.content}
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">관리자 코멘트</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="승인/반려 사유 등 코멘트를 입력하세요"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button onClick={() => updateStatus(selected.id, "approved")} disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">승인</button>
              <button onClick={() => updateStatus(selected.id, "reviewing")} disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">검토중</button>
              <button onClick={() => updateStatus(selected.id, "rejected")} disabled={saving}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">반려</button>
              <button onClick={() => updateStatus(selected.id, "pending")} disabled={saving}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">대기로</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border flex items-center justify-center text-gray-400 text-sm">
            왼쪽에서 신청 건을 선택하세요
          </div>
        )}
      </div>
    </main>
  );
}
