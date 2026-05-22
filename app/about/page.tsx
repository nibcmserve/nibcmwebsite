const TIMELINE = [
  {
    year: "1991",
    badge: "태국",
    region: "방콕 · 우본",
    content: "교회사역, 공동체 사역, 유치원, 초등학교, 고아원 사역, 청년 리더십 사역",
  },
  {
    year: "1995",
    badge: "미얀마",
    region: "미얀청 · 양곤 · 만달레이 · 바간 · 몰레마인",
    content: "교회 사역, 공동체 사역",
  },
  {
    year: "1999",
    badge: "캄보디아",
    region: "씨엠립",
    content: "교회사역, 공동체 사역, 유치원, 초등학교, 청년 리더십 사역",
  },
  {
    year: "2000",
    badge: "한국",
    region: "포항 · 서울",
    content: "대학생 사역, 선교본부 설립",
  },
  {
    year: "2001",
    badge: "NIBC 창립",
    region: "",
    content: "한동대학교 동남아시아지역 연구팀이 NIBC라는 이름을 갖게 됨",
  },
  {
    year: "2002",
    badge: "뉴질랜드",
    region: "테 아와무트",
    content: "선교사 훈련 사역, 영어 및 학위 사역, 안식년 지원 사역",
  },
  {
    year: "2004",
    badge: "방글라데시 · 캄보디아",
    region: "반다바리 · 씨엠립",
    content: "방글라데시 교회·공동체·학교 사역 / 캄보디아 씨엠립 NIBC NGO 센터 설립, 장기선교사 파송, 교육 선교 본격화",
  },
  {
    year: "2006",
    badge: "라오스",
    region: "팍세",
    content: "교회 사역, 공동체 사역, 초등학교",
  },
  {
    year: "2012",
    badge: "NIBCM 출범",
    region: "",
    content: "NIBCM이라는 선교단체로 공식 활동 시작",
  },
  {
    year: "2014",
    badge: "인도네시아 · 영국",
    region: "자카르타 · 칼리만탄 · 웨일즈",
    content: "신학교육, 목회자 재교육, 어린이 사역, 고등학교 사역 / 영국 공동체 사역, 농장사역",
  },
];

const BOARD = [
  {
    group: "이사회",
    members: [
      { role: "이사장", name: "손성찬" },
    ],
  },
  {
    group: "사역케어분과",
    members: [
      { role: "", name: "김규철" },
      { role: "", name: "김승훈" },
      { role: "", name: "양바울" },
      { role: "", name: "류영희" },
      { role: "", name: "한현진" },
      { role: "", name: "임희재" },
    ],
  },
  {
    group: "멤버케어분과",
    members: [
      { role: "", name: "조성천" },
      { role: "", name: "정갑신" },
      { role: "", name: "하태욱" },
      { role: "", name: "이경" },
      { role: "", name: "김병훈" },
      { role: "", name: "김주환" },
    ],
  },
  {
    group: "본부",
    members: [
      { role: "대표", name: "조성천" },
      { role: "사무국장", name: "김혜민" },
      { role: "본부간사", name: "조한나" },
      { role: "필드간사", name: "김수영" },
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* 상단 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
          NIBC Mission
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">NIBCM 국제선교회</h1>
        <p className="text-blue-200 text-lg">
          Not I But Christ — 내가 아닌 예수 그리스도가 드러나는 선교
        </p>
      </section>

      {/* 선교회 역사 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">History</p>
        <h2 className="text-3xl font-bold mb-8">선교회 역사</h2>
        <div className="prose prose-gray max-w-none text-gray-700 leading-8 space-y-5 text-base">
          <p>
            NIBC(Not I But Christ) 운동은 양병화 선교사와 김학철 교수의 협력으로 시작되었습니다.
            양병화 선교사는 태국을 중심으로 동남아시아에서 선교 사역(기숙사 사역, 한센병 환우 사역 등)을
            진행하였고, 김학철 교수는 한동대학교 교수로 재직하며 학생들과 함께 동남아시아지역 연구팀을
            조직하였습니다.
          </p>
          <p>
            2001년 한동대학교 동남아시아지역 연구팀은 NIBC라는 이름을 갖게 되었으며 동남아시아 나라들
            (태국, 캄보디아, 라오스 등)에서 지역 연구 및 선교사역 보조들을 진행하였습니다.
          </p>
          <p>
            2004년 캄보디아 씨엠립에 NIBC NGO 센터가 세워지게 되고 장기선교사가 파송되면서
            교육을 통한 선교가 본격적으로 시작되었으며, 2012년부터 NIBCM이라는 선교단체로 활동을
            이어가고 있습니다.
          </p>
        </div>
      </section>

      {/* 비전과 말씀 */}
      <section className="bg-amber-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-6">Vision</p>
          <h2 className="text-3xl font-bold text-blue-950 leading-snug mb-8">
            &lsquo;Not I But Christ&rsquo;를 실천하여<br />
            사도적 세계화의 사명을 감당하는<br />
            예수제자공동체를 구축한다.
          </h2>
          <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-8" />
          <p className="text-gray-600 leading-8 italic text-sm md:text-base">
            &ldquo;내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요<br className="hidden md:block" />
            오직 내 안에 그리스도께서 사시는 것이라 이제 내가 육체 가운데 사는 것은<br className="hidden md:block" />
            나를 사랑하사 나를 위하여 자기 자신을 버리신 하나님의 아들을 믿는 믿음 안에서 사는 것이라&rdquo;
          </p>
          <p className="text-amber-600 font-semibold mt-4">갈라디아서 2:20</p>
        </div>
      </section>

      {/* 연혁 타임라인 */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Timeline</p>
          <h2 className="text-3xl font-bold mb-14">사역 연혁</h2>

          <div className="relative">
            {/* 세로선 */}
            <div className="absolute left-16 top-0 bottom-0 w-px bg-blue-100 hidden md:block" />

            <div className="space-y-8">
              {TIMELINE.map((item, idx) => (
                <div key={idx} className="flex gap-6 md:gap-10 group">
                  {/* 연도 */}
                  <div className="shrink-0 w-14 md:w-14 text-right">
                    <span className="text-blue-950 font-bold text-sm md:text-base">{item.year}</span>
                  </div>

                  {/* 점 */}
                  <div className="hidden md:flex shrink-0 w-4 items-start pt-1">
                    <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow" />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100 group-hover:border-blue-100 transition">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-950 text-white px-2.5 py-1 rounded-full font-medium">
                        {item.badge}
                      </span>
                      {item.region && (
                        <span className="text-xs text-gray-500">{item.region}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-6">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 조직도 */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Organization</p>
          <h2 className="text-3xl font-bold mb-14">조직도</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {BOARD.map((group) => (
              <div key={group.group} className="bg-white rounded-2xl border p-7">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-5">
                  {group.group}
                </h3>
                <div className="space-y-2">
                  {group.members.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm"
                    >
                      {m.role && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium shrink-0">
                          {m.role}
                        </span>
                      )}
                      <span className="text-gray-800 font-medium">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="py-16 text-center bg-blue-950 text-white">
        <h2 className="text-2xl font-bold mb-3">NIBCM과 함께해 주세요</h2>
        <p className="text-blue-200 text-sm mb-6">기도와 후원으로 사역에 동참하실 수 있습니다.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/donate" className="bg-amber-400 text-blue-950 px-7 py-3 rounded-xl font-bold hover:bg-amber-300 transition text-sm">
            후원하기
          </a>
          <a href="/contact" className="border border-white/40 text-white px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition text-sm">
            문의하기
          </a>
        </div>
      </section>

    </main>
  );
}
