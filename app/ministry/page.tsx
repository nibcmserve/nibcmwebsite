"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

interface Missionary {
  id: string;
  korean_name: string;
  country: string;
  city: string;
  ministry_type: string;
  profile_image_url: string;
}

interface CountryGroup {
  country: string;
  missionaries: Missionary[];
}

const MINISTRY_AREAS = [
  { icon: "⛪", title: "교회 개척", desc: "복음이 닿지 않은 지역에 현지 교회를 세우고 지역 사회를 변화시킵니다." },
  { icon: "📖", title: "교육 사역", desc: "학교, 도서관, 장학 사업을 통해 다음 세대에 복음과 지식을 전합니다." },
  { icon: "🏥", title: "의료·구제", desc: "의료 혜택이 부족한 지역에서 몸과 마음의 치유를 전합니다." },
  { icon: "🌱", title: "지역 개발", desc: "자립 가능한 공동체를 세워 지속 가능한 선교의 기반을 만듭니다." },
  { icon: "👨‍👩‍👧", title: "가정 사역", desc: "선교사 가정과 현지 가정을 돌보며 건강한 공동체를 만들어갑니다." },
  { icon: "🎶", title: "미디어·문화", desc: "음악, 영상, SNS를 통해 복음을 현대적으로 전합니다." },
];

export default function MinistryPage() {
  const [groups, setGroups] = useState<CountryGroup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("missionaries")
      .select("id, korean_name, country, city, ministry_type, profile_image_url")
      .eq("status", "사역 중")
      .order("country")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setTotalCount(data.length);
          const map = new Map<string, Missionary[]>();
          data.forEach((m) => {
            const key = m.country || "기타";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(m);
          });
          setGroups(Array.from(map.entries()).map(([country, missionaries]) => ({ country, missionaries })));
        }
        setLoading(false);
      });
  }, []);

  return (
    <main className="bg-white min-h-screen text-gray-900">
      {/* 헤더 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">사역 소개</h1>
        <p className="text-blue-200 text-lg">NIBCM 국제선교회의 선교 사역을 소개합니다</p>
      </section>

      {/* 사역 분야 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">Ministry Areas</p>
            <h2 className="text-3xl font-bold">주요 사역 분야</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {MINISTRY_AREAS.map((area) => (
              <div key={area.title} className="bg-white rounded-2xl p-7 shadow-sm border hover:shadow-md transition">
                <div className="text-3xl mb-4">{area.icon}</div>
                <h3 className="text-lg font-bold mb-2">{area.title}</h3>
                <p className="text-sm text-gray-500 leading-6">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 국가별 사역 현황 */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">Global Presence</p>
            <h2 className="text-3xl font-bold">국가별 사역 현황</h2>
            {totalCount > 0 && (
              <p className="text-gray-500 mt-3 text-sm">
                현재 <span className="font-bold text-blue-950">{groups.length}개국</span>에서{" "}
                <span className="font-bold text-blue-950">{totalCount}명</span>의 선교사가 사역 중입니다
              </p>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-10">불러오는 중...</p>
          ) : groups.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-400">사역 정보를 준비 중입니다.</p>
              <p className="text-sm text-gray-300 mt-2">관리자에서 선교사를 등록하면 자동으로 표시됩니다.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {groups.map(({ country, missionaries }) => (
                <div key={country}>
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="text-xl font-bold text-gray-900">{country}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {missionaries.length}명
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {missionaries.map((m) => (
                      <div key={m.id} className="flex items-center gap-4 bg-white border rounded-xl p-4 hover:shadow-sm transition">
                        {m.profile_image_url ? (
                          <img src={m.profile_image_url} alt={m.korean_name} className="w-12 h-12 rounded-full object-cover border shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                            {m.korean_name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{m.korean_name} 선교사</p>
                          {m.city && <p className="text-xs text-gray-400 mt-0.5">{m.city}</p>}
                          {m.ministry_type && (
                            <p className="text-xs text-blue-700 mt-0.5 truncate">{m.ministry_type}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 후원 CTA */}
      <section className="bg-amber-50 border-t py-16 text-center">
        <h2 className="text-2xl font-bold mb-3">사역에 함께해 주세요</h2>
        <p className="text-gray-600 mb-6 text-sm">기도와 후원으로 선교사들의 사역에 동참할 수 있습니다.</p>
        <div className="flex justify-center gap-4">
          <a href="/donate" className="bg-blue-950 text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-blue-900 transition">후원하기</a>
          <a href="/missionaries" className="border border-gray-300 text-gray-700 px-7 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">선교사 보기</a>
        </div>
      </section>
    </main>
  );
}
