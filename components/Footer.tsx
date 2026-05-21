export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* 브랜드 */}
          <div>
            <h2 className="text-xl font-bold mb-1">NIBCM</h2>
            <p className="text-blue-300 text-sm mb-4">Not I But Christ</p>
            <p className="text-blue-400 text-xs leading-6">
              NIBCM 국제선교회는 그리스도의 이름이<br />
              열방에 전해지도록 선교사들과 함께합니다.
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h3 className="text-sm font-semibold text-blue-200 mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              {[
                { href: "/about", label: "선교회 소개" },
                { href: "/missionaries", label: "선교사 소개" },
                { href: "/news", label: "소식 / 간증" },
                { href: "/donate", label: "후원 안내" },
                { href: "/contact", label: "문의하기" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-sm font-semibold text-blue-200 mb-4">연락처</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              <li>이메일: contact@nibcm.org</li>
              <li>주소: 추후 입력 예정</li>
              <li>전화: 추후 입력 예정</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-blue-400">
            © 2026 NIBCM International Mission. All rights reserved.
          </p>
          <a href="/admin" className="text-xs text-blue-600 hover:text-blue-400 transition">
            관리자
          </a>
        </div>
      </div>
    </footer>
  );
}
