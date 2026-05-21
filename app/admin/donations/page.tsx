"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  currency: string;
  donated_at: string;
  memo: string;
  missionaries?: { korean_name: string };
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ donor_name: "", amount: "", currency: "KRW", donated_at: "", memo: "" });
  const [saving, setSaving] = useState(false);

  const fetchDonations = async () => {
    const { data } = await supabase
      .from("donations")
      .select("*, missionaries(korean_name)")
      .order("donated_at", { ascending: false });
    if (data) {
      setDonations(data);
      setTotal(data.reduce((sum, d) => sum + Number(d.amount), 0));
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("donations").insert([{
      donor_name: form.donor_name,
      amount: Number(form.amount),
      currency: form.currency,
      donated_at: form.donated_at,
      memo: form.memo || null,
    }]);
    if (error) alert("저장 실패: " + error.message);
    else {
      setForm({ donor_name: "", amount: "", currency: "KRW", donated_at: "", memo: "" });
      fetchDonations();
    }
    setSaving(false);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency }).format(amount);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-1">후원 통계</h1>
      <p className="text-sm text-gray-500 mb-6">후원 내역을 기록하고 관리합니다.</p>

      {/* 총계 카드 */}
      <div className="bg-blue-950 text-white rounded-2xl p-6 mb-6">
        <p className="text-blue-300 text-sm mb-1">전체 후원 합계 (KRW)</p>
        <p className="text-3xl font-bold">{total.toLocaleString("ko-KR")}원</p>
        <p className="text-blue-400 text-xs mt-1">총 {donations.length}건</p>
      </div>

      {/* 등록 폼 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">후원 내역 등록</h2>
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <input value={form.donor_name} onChange={(e) => setForm((p) => ({ ...p, donor_name: e.target.value }))} required placeholder="후원자 이름" className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required placeholder="금액" className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm">
            <option value="KRW">KRW (원)</option>
            <option value="USD">USD (달러)</option>
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <input type="date" value={form.donated_at} onChange={(e) => setForm((p) => ({ ...p, donated_at: e.target.value }))} required className="border rounded-lg px-3 py-2 text-sm" />
          <input value={form.memo} onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))} placeholder="메모 (선택)" className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="mt-3 bg-blue-950 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
          {saving ? "저장 중..." : "등록"}
        </button>
      </form>

      {/* 목록 */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {donations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">등록된 후원이 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">후원자</th>
                <th className="text-left px-4 py-3">금액</th>
                <th className="text-left px-4 py-3">일자</th>
                <th className="text-left px-4 py-3">메모</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{d.donor_name}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{formatAmount(d.amount, d.currency)}</td>
                  <td className="px-4 py-3 text-gray-400">{d.donated_at}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.memo ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
