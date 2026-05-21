export default function DonatePage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* 헤더 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">후원 안내</h1>
        <p className="text-blue-200 text-lg">
          선교 사역에 동참해주세요
        </p>
      </section>

      {/* 후원 목적 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-6 text-center">왜 후원해야 하나요?</h2>
        <p className="text-gray-700 leading-8 text-center max-w-2xl mx-auto">
          NIBCM 선교사들은 복음이 닿지 않은 곳에서 매일 삶을 드려 사역합니다.
          여러분의 후원은 선교사 가정의 생활, 사역 경비, 교육 등 실질적인 지원이 됩니다.
        </p>
      </section>

      {/* 후원 방법 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">후원 방법</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-bold mb-4 text-blue-950">정기 후원</h3>
              <p className="text-gray-600 leading-7 mb-4">
                매월 일정 금액을 정기적으로 후원하는 방식입니다.
                선교사의 안정적인 사역을 위한 가장 좋은 방법입니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• 월 3만원 이상 권장</li>
                <li>• 연말 세금공제 영수증 발급</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-bold mb-4 text-blue-950">일시 후원</h3>
              <p className="text-gray-600 leading-7 mb-4">
                특별한 사역이나 필요를 위해 일회성으로 후원하는 방식입니다.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• 금액 제한 없음</li>
                <li>• 특정 선교사 지정 후원 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 계좌 정보 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">계좌 정보</h2>

        <div className="bg-blue-950 text-white rounded-2xl p-8 text-center">
          <p className="text-blue-300 text-sm mb-2">후원 계좌</p>
          <p className="text-2xl font-bold mb-1">국민은행 000-0000-0000-00</p>
          <p className="text-blue-200">예금주: NIBCM 국제선교회</p>
          <p className="text-sm text-blue-400 mt-6">
            입금 후 아래 연락처로 성함과 후원 목적을 알려주시면 영수증을 발급해 드립니다.
          </p>
          <p className="text-blue-300 mt-2 font-medium">contact@nibcm.org</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-50 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">문의가 있으신가요?</h2>
        <p className="text-gray-600 mb-6">후원 관련 궁금한 점은 문의하기를 통해 연락해 주세요.</p>
        <a
          href="/contact"
          className="inline-block bg-blue-950 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
        >
          문의하기
        </a>
      </section>
    </main>
  );
}
