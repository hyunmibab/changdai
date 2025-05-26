// pages/signup.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = () => {
    setError("");
    if (!name || !username || !password || !photo) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: { username: string }) => u.username === username)) {
      setError("이미 존재하는 아이디입니다.");
      return;
    }

    users.push({ name, username, password, photo });
    localStorage.setItem("users", JSON.stringify(users));
    alert("회원가입이 완료되었습니다.");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <Image src="/signup.svg" alt="signup" width={100} height={100} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">회원가입</h1>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">아이디</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">프로필 사진</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {photo && (
            <Image
              src={photo}
              alt="preview"
              width={80}
              height={80}
              className="mt-3 rounded-full mx-auto"
            />
          )}
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
