"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function MissionariesAdminPage() {
  const [missionaries, setMissionaries] = useState<any[]>([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("missionaries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMissionaries(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("missionaries")
      .delete()
      .eq("id", id);

    if (error) {
      alert("삭제 중 오류가 발생했습니다.");
      console.log(error);
    } else {
      alert("삭제되었습니다.");
      fetchData();
    }
  };

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">선교사 관리</h1>
          <p className="text-gray-500 mt-2">선교사 정보를 관리합니다.</p>
        </div>

        <a
          href="/admin/missionaries/new"
          className="bg-blue-900 text-white px-5 py-3 rounded-lg font-semibold"
        >
          선교사 등록
        </a>
      </div>

      <div className="space-y-4">
        {missionaries.length === 0 && (
          <div className="text-gray-500">데이터가 없습니다.</div>
        )}

        {missionaries.map((m) => (
          <div
            key={m.id}
            className="p-5 border rounded-xl shadow-sm bg-white flex items-center justify-between"
          >
            <div>
              <div className="text-lg font-bold">{m.korean_name}</div>
              <div className="text-sm text-gray-500 mt-1">{m.country}</div>
              <div className="text-sm mt-1">{m.ministry_type}</div>
              <div className="text-sm text-blue-600 mt-1">{m.status}</div>
            </div>

            <div className="flex gap-2">
              <a
                href={`/admin/missionaries/${m.id}`}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                수정
              </a>

              <button
                onClick={() => handleDelete(m.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}