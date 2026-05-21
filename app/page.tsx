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
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Not I But Christ
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            NIBCM<br />국제선교회
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            열방을 향한 그리스도의 사랑을 전하는 선교회입니다.
            선교사들의 삶과 사역을 함께 지원합니다.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/donate"
              className="bg-amber-400 text-blue-950 px-7 py-3 rounded-xl font-bold hover:bg-amber-300 transition"
            >
              후원하기
            </a>
            <a
              href="/about"
              className="border border-white/40 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              선교회 소개
            </a>
          </div>
        </div>
      </section>

      {/* 비전 3가지 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Our Vision</p>
          <h2 className="text-3xl font-bold text-center mb-14">우리가 추구하는 가치</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "복음 중심", desc: "모든 사역의 중심에 그리스도의 복음을 두고 나아갑니다.", icon: "✝" },
              { title: "선교사 돌봄", desc: "파송된 선교사 가정의 삶과 사역을 함께 돌보고 지원합니다.", icon: "✦" },
              { title: "지속 가능성", desc: "세대를 이어가는 지속 가능한 선교 구조를 만들어갑니다.", icon: "◎" },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 text-2xl mx-auto mb-5">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-7">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 선교사 하이라이트 */}
      {missionaries.length > 0 && (
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">Our Missionaries</p>
                <h2 className="text-3xl font-bold">함께하는 선교사님들</h2>
              </div>
              <a href="/missionaries" className="text-sm text-blue-700 hover:underline hidden md:block">
                전체 보기 →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {missionaries.map((m) => (
                <div key={m.id} className="border rounded-2xl p-6 text-center hover:shadow-md transition">
                  {m.profile_image_url ? (
                    <img
                      src={m.profile_image_url}
                      alt={m.korean_name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-blue-700 text-2xl font-bold">
                      {m.korean_name[0]}
                    </div>
                  )}
                  <h3 className="font-bold text-lg">{m.korean_name} 선교사</h3>
                  <p className="text-sm text-blue-700 mt-1">{m.country}</p>
                  {m.ministry_type && (
                    <p className="text-xs text-gray-400 mt-1">{m.ministry_type}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <a href="/missionaries" className="text-sm text-blue-700 hover:underline">전체 보기 →</a>
            </div>
          </div>
        </section>
      )}

      {/* 최근 소식 */}
      {news.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">News & Testimony</p>
                <h2 className="text-3xl font-bold">최근 소식</h2>
              </div>
              <a href="/news" className="text-sm text-blue-700 hover:underline hidden md:block">전체 보기 →</a>
            </div>
            <div className="space-y-4">
              {news.map((item) => (
                <a
                  key={item.id}
                  href="/news"
                  className="flex items-start gap-5 bg-white rounded-2xl p-5 border hover:shadow-sm transition"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.title_ko}</h3>
                    {item.content_ko && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.content_ko}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString("ko-KR") : ""}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 후원 CTA */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">선교 사역에 함께해 주세요</h2>
          <p className="text-blue-200 mb-8 leading-7">
            여러분의 기도와 후원이 선교사들에게 큰 힘이 됩니다.<br />
            그리스도의 사랑이 열방에 전해지도록 동참해 주세요.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/donate"
              className="bg-amber-400 text-blue-950 px-8 py-3 rounded-xl font-bold hover:bg-amber-300 transition"
            >
              후원하기
            </a>
            <a
              href="/contact"
              className="border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              문의하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
