// pages/admin/login.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") || "null");
    if (loginInfo?.role === "admin") router.push("/admin");
  }, [router]);

  const handleLogin = () => {
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    if (username === "admin" && password === "changdai") {
      const now = new Date();
      const expiresAt = now.getTime() + 60 * 60 * 1000;
      localStorage.setItem(
        "loginInfo",
        JSON.stringify({ username, role: "admin", expiresAt })
      );
      router.push("/admin");
    } else {
      setError("관리자 계정이 아닙니다.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">관리자 로그인</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
