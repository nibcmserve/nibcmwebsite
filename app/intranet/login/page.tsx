"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function IntranetLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("이메일 또는 비밀번호를 확인해 주세요.");
    } else {
      window.location.href = "/intranet/dashboard";
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* 로고 */}
        <div className="text-center mb-10">
          <a href="/" className="inline-block">
            <span className="text-3xl font-bold text-blue-950">NIBCM</span>
            <p className="text-xs text-gray-500 mt-1">선교사 인트라넷</p>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">로그인</h1>
          <p className="text-sm text-gray-500 mb-7">
            관리자가 발급한 계정으로 로그인하세요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="비밀번호 입력"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-50 mt-2"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t text-center">
            <p className="text-xs text-gray-400">
              계정이 없으신가요?<br />
              관리자에게 문의해 주세요.
            </p>
            <a
              href="mailto:nibcm.serve@gmail.com"
              className="text-xs text-blue-700 hover:underline mt-1 inline-block"
            >
              nibcm.serve@gmail.com
            </a>
          </div>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">
            ← NIBCM 홈페이지로
          </a>
        </p>
      </div>
    </main>
  );
}
