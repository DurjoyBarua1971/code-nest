"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { signOut } from "@/app/lib/action";
import createClientForBrowser from "@/app/lib/supabase/client";
import type { MenuItem } from 'primereact/menuitem';
import type { User } from '@supabase/supabase-js';

export default function FullScreenDemo() {
  const [visible, setVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const supabase = createClientForBrowser();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User data:", user);
      if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, [supabase]);

  const items: MenuItem[] = [
    {
      label: "Admin Panel",
      items: [
        {
          label: "Dashboard",
          icon: "pi pi-th-large",
          command: () => {
            router.push("/dashboard");
          },
        },
        {
          label: "Problems",
          icon: "pi pi-list",
          command: () => {
            router.push("/dashboard/problems");
          },
        },
        {
          label: "Create Problem",
          icon: "pi pi-plus-circle",
          command: () => {
            router.push("/dashboard/create-problem");
          },
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: async () => {
            await signOut();
          },
        },
      ],
    },
  ];

  const userName = user?.user_metadata?.full_name || user?.email || "User";
  // const userAvatar = user?.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp";
  const userAvatar = "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp";

  console.log("User name:", userName);
  console.log("User avatar:", userAvatar);

  return (
    <div className="card flex">
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-col items-center justify-between h-[85vh]">
          <div>
            <Toast ref={toast} />
            <Menu model={items} />
          </div>
          <div className="w-full flex flex-col items-center">
            <Divider />
            <Avatar
              image={userAvatar}
              size="xlarge"
              shape="circle"
            />
            <p className="mt-2 text-lg font-medium text-gray-700">{userName}</p>
          </div>
        </div>
      </Sidebar>
      <Button icon="pi pi-window-maximize" onClick={() => setVisible(true)} />
      <style>{`
        .p-menu {
          border: none;
          background: none;
        }
        .p-sidebar .card {     
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
}