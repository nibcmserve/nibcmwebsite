export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* 상단 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          NIBCM 국제선교회
        </h1>
        <p className="text-lg text-blue-200">
          Not I But Christ
        </p>
      </section>

      {/* 소개 */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-6">
          선교회 소개
        </h2>

        <p className="text-gray-700 leading-8 mb-6">
          NIBCM 국제선교회는 “Not I But Christ”라는 고백 위에 세워진 선교회입니다.
          우리는 사람의 이름이 아니라 그리스도의 이름이 드러나는 선교를 지향합니다.
        </p>

        <p className="text-gray-700 leading-8">
          선교 현장에서 사역하는 선교사들과 함께하며, 그들의 삶과 사역을
          지속적으로 지원하고 돕는 것을 사명으로 삼고 있습니다.
        </p>
      </section>

      {/* 비전 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">
            우리의 비전
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">복음 중심</h3>
              <p className="text-gray-600 leading-7">
                모든 사역의 중심에 그리스도의 복음을 두고 나아갑니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">선교사 중심</h3>
              <p className="text-gray-600 leading-7">
                선교사 가정의 삶과 사역을 함께 돌보고 지원합니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">지속 가능성</h3>
              <p className="text-gray-600 leading-7">
                지속 가능한 선교 구조를 만들어 미래를 준비합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 스토리 */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-6">
          우리의 이야기
        </h2>

        <p className="text-gray-700 leading-8 mb-6">
          (여기에 나중에 선교회가 시작된 배경과 역사 넣으면 됨)
        </p>

        <p className="text-gray-700 leading-8">
          (왜 이 선교회가 시작되었는지, 어떤 마음으로 시작되었는지 작성)
        </p>
      </section>

    </main>
  );
}