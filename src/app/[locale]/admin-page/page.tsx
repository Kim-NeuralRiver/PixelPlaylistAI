"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status]);

  if (status === "loading") return <div>Loading...</div>;

  return <div>Welcome, Admin!</div>;
};

export default AdminPage;
