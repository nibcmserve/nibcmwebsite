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
    desc: "선교사와 그 가정을 위해 기도해 주세요. 기도는 선교의 가장 큰 힘입니다.",
    btn: "기도 제목 받기",
    href: "/contact",
  },
  {
    icon: "💛",
    title: "후원으로 함께",
    desc: "정기 후원으로 선교사 가정의 생활과 사역을 안정적으로 지원할 수 있습니다.",
    btn: "후원하기",
    href: "/donate",
  },
  {
    icon: "✈️",
    title: "사역으로 함께",
    desc: "선교사로 파송받거나, 단기 선교로 현장을 직접 경험해 보세요.",
    btn: "문의하기",
    href: "/contact",
  },
  {
    icon: "📢",
    title: "알리기",
    desc: "NIBCM의 소식을 주변에 알려주세요. 더 많은 기도와 후원이 이어집니다.",
    btn: "소식 보기",
    href: "/news",
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
          <p className="text-blue-200 text-lg mb-4 max-w-2xl mx-auto">
            내가 죽고 예수 그리스도가 사는 삶
          </p>
          <p className="text-blue-300 text-base mb-10 max-w-2xl mx-auto leading-8">
            사도적 세계화의 사명을 감당하는<br />예수제자공동체를 구축합니다.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/donate"
              className="bg-amber-400 text-blue-950 px-8 py-3.5 rounded-xl font-bold hover:bg-amber-300 transition"
            >
              후원하기
            </a>
            <a
              href="/about"
              className="border border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              선교회 소개
            </a>
          </div>
        </div>
      </section>

      {/* 핵심 미션 & 말씀 */}
      <section className="bg-amber-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-6">
            Our Mission
          </p>
          <blockquote className="text-2xl md:text-3xl font-bold text-blue-950 leading-snug mb-8">
            &lsquo;Not I But Christ&rsquo;를 실천하여<br />
            사도적 세계화의 사명을 감당하는<br />
            예수제자공동체를 구축한다.
          </blockquote>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-8" />
          <p className="text-gray-600 text-sm md:text-base leading-8 italic">
            &ldquo;내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요<br className="hidden md:block" />
            오직 내 안에 그리스도께서 사시는 것이라&rdquo;
          </p>
          <p className="text-amber-600 text-sm font-semibold mt-3">갈라디아서 2:20</p>
        </div>
      </section>

      {/* 함께하는 방법 */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">
            Get Involved
          </p>
          <h2 className="text-3xl font-bold text-center mb-14">함께하는 방법</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_TO_JOIN.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-7 shadow-sm border text-center hover:shadow-md transition flex flex-col"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-6 mb-6 flex-1">{item.desc}</p>
                <a
                  href={item.href}
                  className="text-sm font-semibold text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  {item.btn}
                </a>
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
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">
                  Our Missionaries
                </p>
                <h2 className="text-3xl font-bold">함께하는 선교사님들</h2>
              </div>
              <a href="/missionaries" className="text-sm text-blue-700 hover:underline hidden md:block">
                전체 보기 →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {missionaries.map((m) => (
                <div
                  key={m.id}
                  className="border rounded-2xl p-6 text-center hover:shadow-md transition"
                >
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
              <a href="/missionaries" className="text-sm text-blue-700 hover:underline">
                전체 보기 →
              </a>
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
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">
                  News &amp; Testimony
                </p>
                <h2 className="text-3xl font-bold">최근 소식</h2>
              </div>
              <a href="/news" className="text-sm text-blue-700 hover:underline hidden md:block">
                전체 보기 →
              </a>
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
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("ko-KR")
                      : ""}
                  </p>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href="/news"
                className="text-sm text-blue-700 border border-blue-200 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition font-medium"
              >
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
            여러분의 기도와 후원이 열방에 복음을 전하는 힘이 됩니다.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
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
