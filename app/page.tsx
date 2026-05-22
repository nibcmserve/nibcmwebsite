"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase/client";

interface NewsItem {
  id: string;
  title_ko: string;
  content_ko: string;
  category: string;
  published_at: string;
}

interface Missionary {
  id: string;
  korean_name: string;
  country: string;
  ministry_type: string;
  profile_image_url: string;
}

const HOW_TO_JOIN = [
  {
    icon: "🙏",
    title: "기도로 함께",
    desc: "선교사와 사역지, 그리고 열방 가운데 이루어지는 복음 사역을 위해 함께 기도해주세요.",
    btn: "기도제목 보기",
    href: "/news",
  },
  {
    icon: "💛",
    title: "후원으로 함께",
    desc: "여러분의 후원은 선교사의 삶과 사역을 지속하게 하는 힘이 됩니다.",
    btn: "후원하기",
    href: "/donate",
  },
  {
    icon: "✈️",
    title: "선교로 함께",
    desc: "선교는 특별한 사람만의 일이 아니라, 함께 부르심에 응답하는 공동체의 사명입니다.",
    btn: "문의하기",
    href: "mailto:nibcm.serve@gmail.com",
  },
];

const MINISTRIES = [
  {
    icon: "🌏",
    title: "국가별 사역",
    desc: "NIBCM은 아시아와 세계 여러 나라 가운데 복음을 전하며 예수제자공동체를 세워가고 있습니다.",
    keywords: ["글로벌 선교", "다양한 국가", "현장 중심"],
    href: "/ministry",
  },
  {
    icon: "🎓",
    title: "한동대학교 NIBC",
    desc: "다음세대를 세우기 위한 가족 공동체를 세워가고 있습니다. 매주 함께 식사하고 예배드리며 삶을 나누고 함께 자라가는 공동체입니다.",
    keywords: ["청년", "예배와 교제", "다음세대"],
    href: "/ministry#nibc",
  },
  {
    icon: "🏘️",
    title: "캄보디아 드림빌",
    desc: "캄보디아 씨엠립 지역 가운데 교회와 학교를 중심으로 하는 예수 마을을 만들어가고 있습니다.",
    keywords: ["예수 마을", "교회와 학교", "지속 가능한 선교"],
    href: "/ministry#dreamville",
  },
];

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);

  useEffect(() => {
    supabase
      .from("news")
      .select("id, title_ko, content_ko, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setNews(data); });

    supabase
      .from("missionaries")
      .select("id, korean_name, country, ministry_type, profile_image_url")
      .eq("status", "사역 중")
      .limit(3)
      .then(({ data }) => { if (data) setMissionaries(data); });
  }, []);

  return (
    <main className="bg-white text-gray-900">

      {/* 히어로 */}
      <section className="relative bg-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/globe.svg')] bg-center bg-cover" />
        <div className="relative max-w-5xl mx-auto px-6 py-36 text-center">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-6">
            NIBCM 국제선교회
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Not I But Christ
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto leading-8">
            &lsquo;Not I But Christ&rsquo;를 실천하여<br />
            사도적 세계화의 사명을 감당하는<br />
            예수제자공동체를 구축합니다.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/about" className="bg-amber-400 text-blue-950 px-8 py-3.5 rounded-xl font-bold hover:bg-amber-300 transition">
              선교회 소개
            </a>
            <a href="/donate" className="border border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition">
              후원하기
            </a>
          </div>
        </div>
      </section>

      {/* About NIBCM */}
      <section className="bg-amber-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-6">About NIBCM</p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-950 leading-snug mb-6">
            NIBCM은 &lsquo;Not I But Christ&rsquo;를 실천하며<br />
            열방 가운데 예수제자를 세우는 선교공동체입니다.
          </h2>
          <p className="text-gray-600 leading-8 mb-8">
            사도적 세계화의 사명을 감당하며 복음이 필요한 곳에 선교사를 파송하고,<br />
            예수제자공동체를 세워갑니다.
          </p>
          <a href="/about" className="inline-block border border-blue-900 text-blue-900 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
            선교회 소개 보기 →
          </a>
        </div>
      </section>

      {/* 함께 동역하기 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Get Involved</p>
          <h2 className="text-3xl font-bold text-center mb-14">함께 동역하기</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_TO_JOIN.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm border text-center hover:shadow-md transition flex flex-col">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-7 mb-6 flex-1">{item.desc}</p>
                <a href={item.href} className="text-sm font-semibold text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                  {item.btn}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 주요 사역 */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">NIBCM Ministries</p>
          <h2 className="text-3xl font-bold text-center mb-14">주요 사역 소개</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {MINISTRIES.map((m) => (
              <a key={m.title} href={m.href} className="group bg-white rounded-2xl border p-7 hover:shadow-md hover:border-blue-200 transition flex flex-col">
                <div className="text-4xl mb-4">{m.icon}</div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-blue-900 transition">{m.title}</h3>
                <p className="text-sm text-gray-500 leading-7 flex-1">{m.desc}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {m.keywords.map((k) => (
                    <span key={k} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{k}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 선교사 하이라이트 */}
      {missionaries.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">Our Missionaries</p>
                <h2 className="text-3xl font-bold">함께하는 선교사님들</h2>
              </div>
              <a href="/about" className="text-sm text-blue-700 hover:underline hidden md:block">전체 보기 →</a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {missionaries.map((m) => (
                <div key={m.id} className="bg-white border rounded-2xl p-6 text-center hover:shadow-md transition">
                  {m.profile_image_url ? (
                    <img src={m.profile_image_url} alt={m.korean_name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-blue-700 text-2xl font-bold">
                      {m.korean_name[0]}
                    </div>
                  )}
                  <h3 className="font-bold text-lg">{m.korean_name} 선교사</h3>
                  <p className="text-sm text-blue-700 mt-1">{m.country}</p>
                  {m.ministry_type && <p className="text-xs text-gray-400 mt-1">{m.ministry_type}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 최근 소식 */}
      {news.length > 0 && (
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">News &amp; Prayer</p>
                <h2 className="text-3xl font-bold">최근 소식</h2>
              </div>
              <a href="/news" className="text-sm text-blue-700 hover:underline hidden md:block">전체 보기 →</a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item) => (
                <a key={item.id} href={`/news/${item.id}`} className="bg-white rounded-2xl border p-5 hover:shadow-sm transition">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {item.category === "news" ? "소식" : item.category === "testimony" ? "간증" : item.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-3 mb-2 line-clamp-2">{item.title_ko}</h3>
                  {item.content_ko && (
                    <p className="text-sm text-gray-500 line-clamp-2">{item.content_ko}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString("ko-KR") : ""}
                  </p>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/news" className="text-sm text-blue-700 border border-blue-200 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition font-medium">
                모든 소식 보기 →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 후원 CTA */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">선교사의 삶과 사역에 함께해 주세요</h2>
          <p className="text-blue-200 mb-8 leading-7">
            함께 기도하고, 함께 후원하며, 함께 선교하는 동역으로 초대합니다.
          </p>
          <a href="/donate" className="bg-amber-400 text-blue-950 px-8 py-3 rounded-xl font-bold hover:bg-amber-300 transition">
            후원하기
          </a>
        </div>
      </section>
    </main>
  );
}
