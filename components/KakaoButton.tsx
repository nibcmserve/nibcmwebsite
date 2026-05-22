"use client";

// TODO: 카카오톡 채널 개설 후 아래 URL을 실제 채널 URL로 교체하세요.
// 형식: https://pf.kakao.com/_[채널ID]
const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_nibcm";

export default function KakaoButton() {
  return (
    <a
      href={KAKAO_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡 상담"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        bg-[#FEE500] text-[#191919]
        pl-3 pr-4 py-2.5
        rounded-full shadow-lg
        hover:shadow-xl hover:scale-105
        transition-all duration-200
        font-semibold text-sm
      "
    >
      {/* 카카오 로고 (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fill="#191919"
          d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.656 5.08 4.168 6.55L5.1 21l4.287-2.62A11.7 11.7 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3Z"
        />
      </svg>
      카카오톡 문의
    </a>
  );
}
