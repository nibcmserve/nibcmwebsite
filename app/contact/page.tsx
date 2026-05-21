"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase/client";

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

      <section className="max-w-2xl mx-auto px-6 py-20">
        {submitted ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">✓</div>
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
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
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
      </section>
    </main>
  );
}
