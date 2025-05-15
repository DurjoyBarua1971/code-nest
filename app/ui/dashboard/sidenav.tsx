"use client";

import React, { useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { supabase } from "@/app/lib/supabase";

export default function FullScreenDemo() {
  const [visible, setVisible] = useState<boolean>(false);
  const toast = useRef(null);
  const router = useRouter();
  const items = [
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
          label: "Create",
          icon: "pi pi-plus",
          command: () => {
            router.push("/create");
          },
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: async () => {
            await supabase.auth.signOut();
            router.push("/login");
          },
        },
      ],
    },
  ];

  return (
    <div className="card flex ">
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-col items-center justify-between h-[85vh]">
          <div>
            <Toast ref={toast} />
            <Menu model={items} />
          </div>
          <div className="w-full flex flex-col items-center">
            <Divider />
            <Avatar
              image={
                "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp"
              }
              size="xlarge"
            />
          </div>
        </div>
      </Sidebar>
      <Button icon="pi pi-window-maximize" onClick={() => setVisible(true)} />
      <style>{`
        .p-menu {
          border: none;
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
