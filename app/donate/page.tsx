const FAQS = [
  {
    q: "세금공제 영수증은 어떻게 받나요?",
    a: "입금 후 nibcm.serve@gmail.com 으로 성함, 입금액, 연락처를 보내주시면 연말정산용 영수증을 발급해 드립니다.",
  },
  {
    q: "특정 선교사를 지정해서 후원할 수 있나요?",
    a: "네, 가능합니다. 입금 시 선교사 성함을 메모에 남겨주시거나 이메일로 알려주시면 해당 선교사에게 전달됩니다.",
  },
  {
    q: "후원을 중단하고 싶을 때는 어떻게 하나요?",
    a: "nibcm.serve@gmail.com 으로 연락해 주시면 빠르게 처리해 드립니다.",
  },
];

export default function DonatePage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen">

      {/* 헤더 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">Support</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">후원 안내</h1>
        <p className="text-blue-200 text-lg">여러분의 후원이 선교의 불씨가 됩니다</p>
      </section>

      {/* 후원의 의미 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Why Support</p>
        <h2 className="text-3xl font-bold mb-8">왜 후원해야 하나요?</h2>
        <div className="space-y-5 text-gray-700 leading-8 text-base">
          <p>
            NIBCM 선교사들은 복음이 없는 곳에서 자신의 삶 전체를 드려 사역합니다.
            이들이 사역에만 집중할 수 있도록 생활비, 사역비, 의료비 등을 지원하는 것이
            후원의 핵심입니다.
          </p>
          <p>
            여러분의 후원은 단순한 기부가 아니라, 선교사와 함께 그 땅에 복음을 전하는
            <strong className="text-blue-950"> 동역</strong>입니다. 한 분 한 분의 기도와
            후원이 모여 열방에 그리스도의 사랑이 전해집니다.
          </p>
        </div>
      </section>

      {/* 후원 방법 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">How to Give</p>
          <h2 className="text-3xl font-bold mb-10">후원 방법</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 text-xl mb-5">
                🔄
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-950">정기 후원</h3>
              <p className="text-gray-600 leading-7 mb-5">
                매월 일정 금액을 정기적으로 후원하는 방식입니다.
                선교사의 안정적인 사역을 위한 가장 좋은 방법입니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 매월 자동이체 가능
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 연말 세금공제 영수증 발급
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 선교사 기도 편지 수령
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-xl mb-5">
                💝
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-950">일시 후원</h3>
              <p className="text-gray-600 leading-7 mb-5">
                특별한 사역이나 필요를 위해 일회성으로 후원하는 방식입니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 금액 제한 없음
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 특정 선교사 지정 후원 가능
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span> 특정 사역 프로젝트 후원 가능
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 계좌 정보 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">Account Info</p>
        <h2 className="text-3xl font-bold mb-10">계좌 정보</h2>

        <div className="bg-blue-950 text-white rounded-2xl p-10 text-center">
          <p className="text-blue-300 text-sm mb-2">후원 계좌</p>
          <p className="text-2xl md:text-3xl font-bold mb-2">
            ○○은행 000-0000-0000-00
          </p>
          <p className="text-blue-200 text-lg">예금주: NIBCM 국제선교회</p>
          <div className="w-16 h-px bg-blue-700 mx-auto my-6" />
          <p className="text-sm text-blue-300 leading-6">
            입금 후 아래 이메일로 성함과 후원 목적을 알려주시면<br />
            영수증을 발급해 드립니다.
          </p>
          <a
            href="mailto:nibcm.serve@gmail.com"
            className="inline-block mt-3 text-amber-400 font-semibold hover:underline"
          >
            nibcm.serve@gmail.com
          </a>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          * 계좌번호는 곧 업데이트됩니다. 문의하기를 통해 확인하실 수 있습니다.
        </p>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl font-bold mb-10">자주 묻는 질문</h2>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border p-7">
                <p className="font-bold text-gray-900 mb-3 flex items-start gap-3">
                  <span className="text-amber-500 shrink-0">Q.</span>
                  {faq.q}
                </p>
                <p className="text-gray-600 text-sm leading-7 flex items-start gap-3">
                  <span className="text-blue-700 font-bold shrink-0">A.</span>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="bg-amber-50 border-t py-16 text-center">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">후원 관련 문의</h2>
        <p className="text-gray-600 mb-6 text-sm">
          궁금한 점이 있으시면 언제든지 문의해 주세요.
        </p>
        <a
          href="/contact"
          className="inline-block bg-blue-950 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition text-sm"
        >
          문의하기
        </a>
      </section>

    </main>
  );
}
