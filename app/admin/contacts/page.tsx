"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
  new:     "bg-blue-100 text-blue-700",
  read:    "bg-gray-100 text-gray-500",
  replied: "bg-green-100 text-green-700",
};

const STATUS_LABEL: Record<string, string> = {
  new: "새 문의", read: "읽음", replied: "답변완료",
};

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setContacts(data);
  };

  useEffect(() => { fetchContacts(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("contacts").update({ status }).eq("id", id);
    fetchContacts();
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-1">문의 관리</h1>
      <p className="text-sm text-gray-500 mb-6">외부에서 접수된 문의를 확인합니다.</p>

      <div className="flex gap-6">
        {/* 목록 */}
        <div className="w-80 shrink-0 space-y-2">
          {contacts.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">문의가 없습니다.</p>
          )}
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelected(c); updateStatus(c.id, c.status === "new" ? "read" : c.status); }}
              className={`w-full text-left p-4 rounded-xl border transition ${selected?.id === c.id ? "border-blue-500 bg-blue-50" : "bg-white hover:bg-gray-50"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{c.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{c.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(c.created_at).toLocaleDateString("ko-KR")}</p>
            </button>
          ))}
        </div>

        {/* 상세 */}
        {selected ? (
          <div className="flex-1 bg-white rounded-2xl border p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selected.email && <span className="mr-3">{selected.email}</span>}
                  {selected.phone && <span>{selected.phone}</span>}
                </p>
                <p className="text-xs text-gray-400 mt-1">{new Date(selected.created_at).toLocaleString("ko-KR")}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(selected.id, "replied")}
                  className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg"
                >
                  답변완료
                </button>
                <button
                  onClick={() => updateStatus(selected.id, "new")}
                  className="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg"
                >
                  새 문의로
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-7 whitespace-pre-wrap">
              {selected.message}
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border flex items-center justify-center text-gray-400 text-sm">
            왼쪽에서 문의를 선택하세요
          </div>
        )}
      </div>
    </main>
  );
}
