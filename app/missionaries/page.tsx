"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

interface Missionary {
  id: string;
  korean_name: string;
  country: string;
  city: string;
  ministry_type: string;
  status: string;
  bio_ko: string;
  profile_image_url: string;
}

export default function MissionariesPage() {
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [filtered, setFiltered] = useState<Missionary[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("전체");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("missionaries")
        .select("id, korean_name, country, city, ministry_type, status, bio_ko, profile_image_url")
        .eq("status", "사역 중")
        .order("korean_name");

      if (data) {
        setMissionaries(data);
        setFiltered(data);
        const unique = ["전체", ...Array.from(new Set(data.map((m) => m.country).filter(Boolean)))];
        setCountries(unique);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleFilter = (country: string) => {
    setSelectedCountry(country);
    setFiltered(country === "전체" ? missionaries : missionaries.filter((m) => m.country === country));
  };

  return (
    <main className="bg-white min-h-screen text-gray-900">
      {/* 헤더 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">선교사 소개</h1>
        <p className="text-blue-200 text-lg">NIBCM과 함께 열방을 섬기는 선교사님들</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* 국가 필터 */}
        {countries.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => handleFilter(c)}
                className={`text-sm px-4 py-2 rounded-full border transition ${
                  selectedCountry === c
                    ? "bg-blue-950 text-white border-blue-950"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 py-20">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">등록된 선교사가 없습니다.</p>
            <p className="text-gray-300 text-sm">관리자에게 문의해 주세요.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m) => (
              <div key={m.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                {/* 프로필 이미지 */}
                <div className="flex items-center gap-4 mb-4">
                  {m.profile_image_url ? (
                    <img
                      src={m.profile_image_url}
                      alt={m.korean_name}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
                      {m.korean_name[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{m.korean_name} 선교사</h2>
                    <p className="text-sm text-blue-700 font-medium">
                      {[m.country, m.city].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>

                {m.ministry_type && (
                  <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg inline-block mb-3">
                    {m.ministry_type}
                  </p>
                )}

                {m.bio_ko && (
                  <p className="text-sm text-gray-600 leading-6 line-clamp-3">{m.bio_ko}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
