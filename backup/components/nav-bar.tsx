import { Button, Row, Space } from "antd";
import { UserAuthContext } from "context/protect-route-user";
import { useRouter } from "next/router";
import React from "react";
import { Flags } from "types";

export enum NavEnum {
  Wallet,
  Invest,
  Users,
  Settings,
}

const navList = [
  {
    id: NavEnum.Wallet,
    title: "Wallet",
    url: "/",
    isAdmin: false,
  },
  {
    id: NavEnum.Invest,
    title: "Invest",
    url: "/invest",
    isAdmin: false,
  },
  {
    id: NavEnum.Users,
    title: "Manage Users",
    url: "/users",
    isAdmin: true,
  },
  {
    id: NavEnum.Settings,
    title: "Settings",
    url: "/settings",
    isAdmin: true,
  },
];

export default function NavBar({ active }: { active: NavEnum }) {
  const router = useRouter();
  const { user } = React.useContext(UserAuthContext);

  return (
    <Row style={{ paddingBottom: "2rem" }}>
      <Space>
        {navList
          .filter((item) => (item.isAdmin ? user.flags & Flags.Admin : true))
          .map((n) => (
            <Button
              key={`nav-${n.id}`}
              type={active === n.id ? "primary" : "default"}
              onClick={() => router.push(n.url)}
            >
              {n.title}
            </Button>
          ))}
      </Space>
    </Row>
  );
}
