import { useRouter } from "next/router";
import { useEffect } from "react";
import type { ComponentType, JSX } from "react";

export function withAuth<P extends JSX.IntrinsicAttributes>(Component: ComponentType<P>, allowedRole: "user" | "admin") {
  return function ProtectedComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo") || "null");
      if (!loginInfo || loginInfo.role !== allowedRole) {
        router.push(allowedRole === "admin" ? "/admin/login" : "/login");
      }
    }, [router]);

    return <Component {...props} />;
  };
}