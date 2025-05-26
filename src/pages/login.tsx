// pages/login.tsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") || "null");
    if (loginInfo?.role === "user") router.push("/main");
  }, [router]);

  const handleLogin = () => {
    setError("");
    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find(
        (user: { username: string; password: string }) =>
          user.username === username && user.password === password
      );

      if (!found) {
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
        setLoading(false);
        return;
      }

      const now = new Date();
      const expiresAt = now.getTime() + 60 * 60 * 1000; // 1시간 세션 유지

      localStorage.setItem(
        "loginInfo",
        JSON.stringify({ username, role: "user", expiresAt })
      );
      router.push("/main");
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          일반 사용자 로그인
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">아이디</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">비밀번호</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          disabled={loading}
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p className="mt-4 text-sm text-center">
          계정이 없으신가요?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
