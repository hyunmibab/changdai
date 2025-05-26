// pages/main.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "../utils/group";

export default function MainPage() {
  const router = useRouter();
  const [myGroup, setMyGroup] = useState<string | null>(null);

  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") || "null");
    if (!loginInfo || loginInfo.role !== "user") {
      router.push("/login");
      return;
    }

    const groups = JSON.parse(localStorage.getItem("groups") || "{}") as Record<string, User[]>;
    const foundGroup = Object.entries(groups).find(([, members]) =>
      members.some((m) => m.username === loginInfo.username)
    );
    setMyGroup(foundGroup?.[0] || null);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">일반 사용자 메인 페이지</h1>
      {myGroup ? (
        <p className="text-lg">당신은 <strong>{myGroup}</strong>입니다.</p>
      ) : (
        <p className="text-gray-500">아직 조가 배정되지 않았습니다.</p>
      )}
    </div>
  );
}