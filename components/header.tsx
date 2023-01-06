import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from "antd";
import { AxiosError } from "axios";
import { NotificationContext } from "context/notification";
import { AuthContext } from "context/protect-route";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useUserStore } from "store/user-store";
import { axiosInstance } from "util/axios";

import LogoImg from "../public/logo.svg";

export default function Header() {
  const { api: notification } = React.useContext(NotificationContext);
  const userStore = useUserStore();
  const { user } = React.useContext(AuthContext);
  const router = useRouter();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "account") {
      router.push("/");
    }

    if (e.key === "logout") {
      axiosInstance.user
        .post("/api/account/logout")
        .then((res) => {
          notification.success({ content: res.data.message });
          userStore.setUser(null);
        })
        .catch((err: AxiosError<{ errors?: string[] }>) => {
          if (err.response?.data.errors?.length) {
            err.response.data.errors.forEach((err) => notification.error(err));
          } else {
            notification.error({
              content: err.message ?? "Unknown error, please try again",
            });
          }
        });
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "account",
      label: "Manage Account",
      icon: <UserOutlined />,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <>
      <div className="container">
        <div
          style={{
            display: "flex",
            padding: "1rem 0",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ paddingRight: "1rem" }}>
            <Space>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Image
                  alt="InTuition Exchange Logo"
                  src={LogoImg}
                  style={{ maxWidth: "200px", width: "100%" }}
                />
              </Link>
            </Space>
          </div>
          <div>
            {!user && (
              <Link href="/login">
                <Button type="primary">Login</Button>
              </Link>
            )}
            {user && (
              <Space>
                <Link href="/exchange">
                  <Button type="text">Exchange</Button>
                </Link>
                <Link href="/assets">
                  <Button type="text">Assets</Button>
                </Link>
                <Link href="/fiat">
                  <Button type="text">Fiat</Button>
                </Link>
                <Typography.Text>Hello, {user.firstName}</Typography.Text>
                <div>
                  <Dropdown menu={{ items, onClick: handleMenuClick }}>
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Avatar
                        style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                      >
                        {user.firstName.charAt(0).toUpperCase()}
                      </Avatar>
                    </div>
                  </Dropdown>
                </div>
              </Space>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
