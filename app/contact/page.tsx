"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase/client";

const CONTACT_INFO = [
  {
    icon: "✉️",
    label: "이메일",
    value: "nibcm.serve@gmail.com",
    href: "mailto:nibcm.serve@gmail.com",
  },
  {
    icon: "📍",
    label: "주소",
    value: "서울특별시 강남구 역삼로 166, 301호\n(역삼동, 세현빌딩)",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("contacts").insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      },
    ]);

    if (error) {
      setError("전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  };

  return (
    <main className="bg-white text-gray-900 min-h-screen">

      {/* 헤더 배너 */}
      <section className="bg-blue-950 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">문의하기</h1>
        <p className="text-blue-200 text-lg">
          궁금한 점이 있으시면 언제든지 연락해 주세요
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">

          {/* 연락처 정보 */}
          <div>
            <h2 className="text-xl font-bold mb-6">연락처</h2>
            <div className="space-y-6">
              {CONTACT_INFO.map((info) => (
                <div key={info.label} className="flex gap-4">
                  <span className="text-2xl shrink-0">{info.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm text-blue-700 hover:underline font-medium"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700 leading-6 whitespace-pre-line">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 rounded-xl p-5 border border-amber-100">
              <p className="text-sm text-amber-800 font-semibold mb-1">카카오톡 상담</p>
              <p className="text-xs text-amber-700 leading-5">
                화면 우측 하단의 카카오톡 버튼을 통해<br />
                빠르게 상담하실 수 있습니다.
              </p>
            </div>
          </div>

          {/* 문의 폼 */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-6">
                  ✓
                </div>
                <h2 className="text-2xl font-bold mb-4">문의가 접수되었습니다</h2>
                <p className="text-gray-600 mb-8">
                  빠른 시일 내에 답변드리겠습니다. 감사합니다.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", phone: "", message: "" });
                  }}
                  className="text-blue-950 underline text-sm"
                >
                  다시 문의하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                    placeholder="문의 내용을 입력해 주세요"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-50"
                >
                  {loading ? "전송 중..." : "문의 보내기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
