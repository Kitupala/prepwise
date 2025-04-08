"use client";

import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleLogout}
      className="group flex-center relative cursor-pointer opacity-75 transition-opacity duration-200 hover:opacity-100"
    >
      <span className="tech-tooltip">Logout</span>
      <Image src="/logout.svg" alt="logout" width={30} height={30} />
    </button>
  );
};

export default LogoutButton;
