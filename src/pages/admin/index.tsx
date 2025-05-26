// pages/admin/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { assignGroups, User } from "../../utils/group";
import Image from "next/image";

export default function AdminPage() {
  const router = useRouter();
  const [groupCount, setGroupCount] = useState(3);
  const [groups, setGroups] = useState<Record<string, User[]>>({});
  const [editGroupName, setEditGroupName] = useState<Record<string, string>>(
    {}
  );
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") || "null");
    if (!loginInfo || loginInfo.role !== "admin") {
      router.push("/admin/login");
    } else {
      const saved = localStorage.getItem("groups");
      if (saved) setGroups(JSON.parse(saved));
      const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(savedUsers);
    }
  }, [router]);

  const handleAssign = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const result = assignGroups(users, groupCount);
    localStorage.setItem("groups", JSON.stringify(result));
    setGroups(result);
  };

  const handleRenameGroup = (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;
    const newGroups: Record<string, User[]> = {};
    Object.entries(groups).forEach(([name, members]) => {
      newGroups[name === oldName ? newName : name] = members;
    });
    setGroups(newGroups);
    localStorage.setItem("groups", JSON.stringify(newGroups));
  };

  const handleMoveMember = (fromGroup: string, user: User, toGroup: string) => {
    if (fromGroup === toGroup) return;
    const updatedGroups = { ...groups };
    updatedGroups[fromGroup] = updatedGroups[fromGroup].filter(
      (u) => u.username !== user.username
    );
    updatedGroups[toGroup] = [...(updatedGroups[toGroup] || []), user];
    setGroups(updatedGroups);
    localStorage.setItem("groups", JSON.stringify(updatedGroups));
  };

  const handleUpdateUser = (username: string, updated: Partial<User>) => {
    const newUsers = users.map((u) =>
      u.username === username ? { ...u, ...updated } : u
    );
    setUsers(newUsers);
    localStorage.setItem("users", JSON.stringify(newUsers));
  };

  const handleDeleteUser = (username: string) => {
    const newUsers = users.filter((u) => u.username !== username);
    setUsers(newUsers);
    localStorage.setItem("users", JSON.stringify(newUsers));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">관리자 메인 페이지</h1>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">조 개수</label>
        <input
          type="number"
          value={groupCount}
          onChange={(e) => setGroupCount(Number(e.target.value))}
          className="border px-3 py-1 rounded w-24"
        />
      </div>
      <button
        onClick={handleAssign}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        조 편성 실행
      </button>

      {Object.keys(groups).length > 0 && (
        <div className="space-y-4">
          {Object.entries(groups).map(([group, members]) => (
            <div key={group} className="bg-white p-4 rounded shadow">
              <div className="flex items-center mb-2">
                <input
                  className="text-lg font-bold border px-2 py-1 mr-2 rounded"
                  value={editGroupName[group] ?? group}
                  onChange={(e) =>
                    setEditGroupName({
                      ...editGroupName,
                      [group]: e.target.value,
                    })
                  }
                />
                <button
                  className="bg-gray-200 px-2 py-1 rounded"
                  onClick={() => handleRenameGroup(group, editGroupName[group])}
                >
                  변경
                </button>
              </div>
              <ul className="space-y-2">
                {members.map((user) => (
                  <li key={user.username} className="flex items-center gap-2">
                    <Image
                      src={user.photo}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>
                      {user.name} ({user.username})
                    </span>
                    <select
                      value={group}
                      onChange={(e) =>
                        handleMoveMember(group, user, e.target.value)
                      }
                      className="ml-auto border rounded px-2"
                    >
                      {Object.keys(groups).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2">전체 사용자</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.username}
              className="bg-white p-3 rounded shadow flex items-center gap-2"
            >
              <Image
                src={user.photo}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <input
                className="border px-2 py-1 rounded"
                value={user.name}
                onChange={(e) =>
                  handleUpdateUser(user.username, { name: e.target.value })
                }
              />
              <span className="text-sm text-gray-500">{user.username}</span>
              <span className="text-sm text-gray-500">{user.password}</span>
              <button
                className="ml-auto text-red-600 hover:underline"
                onClick={() => handleDeleteUser(user.username)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
