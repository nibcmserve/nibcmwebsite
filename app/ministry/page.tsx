const COUNTRIES = [
  {
    name: "태국",
    flag: "🇹🇭",
    region: "방콕 · 우본",
    since: "1991",
    ministries: ["교회 사역", "공동체 사역", "유치원/학교 사역", "청년 리더십 사역"],
  },
  {
    name: "미얀마",
    flag: "🇲🇲",
    region: "미얀청 · 양곤 · 만달레이",
    since: "1995",
    ministries: ["교회 사역", "공동체 사역", "현지 제자훈련"],
  },
  {
    name: "캄보디아",
    flag: "🇰🇭",
    region: "씨엠립",
    since: "1999",
    ministries: ["교회 사역", "학교 사역", "공동체 사역", "예수 마을 공동체"],
  },
  {
    name: "방글라데시",
    flag: "🇧🇩",
    region: "반다바리",
    since: "2004",
    ministries: ["교회 사역", "공동체 사역", "학교 사역"],
  },
  {
    name: "라오스",
    flag: "🇱🇦",
    region: "팍세",
    since: "2006",
    ministries: ["교회 사역", "공동체 사역", "초등학교"],
  },
  {
    name: "인도네시아",
    flag: "🇮🇩",
    region: "자카르타 · 칼리만탄",
    since: "2014",
    ministries: ["신학교육", "목회자 재교육", "어린이 사역"],
  },
  {
    name: "뉴질랜드",
    flag: "🇳🇿",
    region: "테 아와무트",
    since: "2002",
    ministries: ["선교사 훈련", "안식년 지원 사역"],
  },
  {
    name: "영국",
    flag: "🇬🇧",
    region: "웨일즈",
    since: "2014",
    ministries: ["공동체 사역", "농장 사역"],
  },
  {
    name: "한국",
    flag: "🇰🇷",
    region: "포항 · 서울",
    since: "2000",
    ministries: ["대학생 사역 (한동대 NIBC)", "선교본부"],
  },
];

export default function MinistryPage() {
  return (
    <main className="bg-white min-h-screen text-gray-900">

      {/* 상단 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">Ministry</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">사역 소개</h1>
        <p className="text-blue-200 text-lg">그리스도의 사랑이 닿는 곳, NIBCM이 함께합니다</p>
      </section>

      {/* ── 섹션 1: 국가별 사역 ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Global Mission</p>
          <h2 className="text-3xl font-bold mb-4">국가별 사역</h2>
          <p className="text-gray-500 mb-12 text-base">
            NIBCM은 아시아와 세계 여러 나라 가운데 복음을 전하며 예수제자공동체를 세워가고 있습니다.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUNTRIES.map((c) => (
              <div key={c.name} className="bg-white border rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{c.flag}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                    <p className="text-xs text-gray-400">{c.region} · {c.since}년~</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.ministries.map((m) => (
                    <span key={m} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 2: 한동대학교 NIBC ── */}
      <section id="nibc" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Campus Ministry</p>
              <h2 className="text-3xl font-bold mb-6">한동대학교 NIBC</h2>
              <p className="text-gray-700 leading-8 mb-4">
                한동대학교 NIBC는 함께 예배하고, 함께 식사하며, 삶을 나누고 함께 자라가는
                <strong className="text-blue-950"> 가족 공동체</strong>를 세워가고 있습니다.
              </p>
              <p className="text-gray-700 leading-8">
                우리는 청년들이 예수 그리스도 안에서 하나되고, 함께 살아가는
                제자 공동체로 세워지기를 꿈꿉니다.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["청년 공동체", "가족 공동체", "예배", "식사 교제", "삶의 나눔", "다음세대"].map((k) => (
                  <span key={k} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-blue-950 rounded-2xl p-10 text-white text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-2">한동대학교 NIBC</h3>
              <p className="text-blue-200 text-sm leading-6">
                Not I But Christ<br />
                청년 예수제자공동체
              </p>
              <div className="mt-6 text-xs text-blue-400">포항 · 한동대학교</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 섹션 3: 캄보디아 드림빌 ── */}
      <section id="dreamville" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-amber-50 rounded-2xl p-10 text-center md:order-1">
              <div className="text-5xl mb-4">🏘️</div>
              <h3 className="text-xl font-bold mb-2 text-blue-950">씨엠립 드림빌</h3>
              <p className="text-gray-600 text-sm leading-6">
                캄보디아 씨엠립<br />
                예수 마을 공동체
              </p>
              <div className="mt-6 text-xs text-gray-400">캄보디아 · 씨엠립</div>
            </div>
            <div className="md:order-2">
              <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Community Mission</p>
              <h2 className="text-3xl font-bold mb-6">캄보디아 씨엠립 드림빌</h2>
              <p className="text-gray-700 leading-8 mb-4">
                씨엠립 드림빌은 교회와 학교를 중심으로 함께 살아가는
                <strong className="text-blue-950"> 예수 마을 공동체</strong>를 세워가고 있습니다.
              </p>
              <p className="text-gray-700 leading-8">
                우리는 다음세대를 세우고, 복음 안에서 함께 살아가는 공동체를 꿈꾸며
                지역 가운데 지속적인 선교를 이어가고 있습니다.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["예수 마을", "공동체", "학교 사역", "다음세대", "지속 가능한 선교"].map((k) => (
                  <span key={k} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-950 text-white py-16 text-center">
        <h2 className="text-2xl font-bold mb-3">사역에 함께해 주세요</h2>
        <p className="text-blue-200 text-sm mb-6">기도와 후원으로 선교사들의 사역에 동참할 수 있습니다.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/donate" className="bg-amber-400 text-blue-950 px-7 py-3 rounded-xl font-bold hover:bg-amber-300 transition text-sm">
            후원하기
          </a>
          <a href="mailto:nibcm.serve@gmail.com" className="border border-white/40 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition text-sm">
            문의하기
          </a>
        </div>
      </section>
    </main>
  );
}
