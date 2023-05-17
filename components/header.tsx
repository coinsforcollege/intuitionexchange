import { BulbOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  MenuProps,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { NotificationContext } from "context/notification";
import { AuthContext } from "context/protect-route";
import { ResponsiveContext } from "context/responsive";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { axiosInstance } from "util/axios";

import LogoImg from "../public/logo.svg";
import useMediaQuery from "./useMediaQuery";

export default function Header({ fullWidth }: { fullWidth?: boolean }) {
  const responsive = React.useContext(ResponsiveContext);
  const { api: notification } = React.useContext(NotificationContext);
  const { user, RemoveToken } = React.useContext(AuthContext);
  const [isPhone, setIsPhone] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const router = useRouter();

  const isPhoneCheck = useMediaQuery("(max-width: 768px)");

  const isDrawerOpen = isPhone && drawer;

  React.useEffect(() => {
    setIsPhone(isPhoneCheck);
  }, [isPhoneCheck]);

  const logout = () => {
    axiosInstance.user
      .post("/api/account/logout")
      .then((res) => {
        notification.success({ content: res.data.message });
        RemoveToken();
      })
      .catch((err: AxiosError<{ errors?: string[] }>) => {
        if (err.response?.data.errors?.length) {
          err.response.data.errors.forEach((err) => notification.error(err));
        } else {
          notification.error({
            content: err.message ?? "An error occurred, please try again later",
          });
        }
      });
  };

  function switchTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      !responsive.isDarkMode ? "dark" : "light"
    );
    responsive.setDarkMode(!responsive.isDarkMode);
  }

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "account") {
      router.push("/settings/profile");
    }

    if (e.key === "logout") {
      logout();
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "account",
      label: "Manage Account",
      icon: <UserOutlined />,
      disabled: false,
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
      <div className="header">
        <div
          className="container"
          style={fullWidth ? { maxWidth: "100%" } : {}}
        >
          <div
            className={css({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            })}
          >
            <div className={css({ paddingRight: "1rem" })}>
              <Space>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <Image
                    alt="InTuition Exchange Logo"
                    src={LogoImg}
                    className={css({
                      maxWidth: "150px",
                      width: "100%",
                      minHeight: 36,
                    })}
                  />
                </Link>
              </Space>
            </div>
            <div>
              <Space>
                {user && !isPhone && (
                  <>
                    <Link href="/exchange">
                      <Button type="text" style={{ color: "white" }}>
                        Exchange
                      </Button>
                    </Link>
                    <Link href="/p2p">
                      <Button type="text" style={{ color: "white" }}>
                        P2P
                      </Button>
                    </Link>
                    <Link href="/wallet">
                      <Button type="text" style={{ color: "white" }}>
                        Wallet
                      </Button>
                    </Link>
                  </>
                )}
                <Tooltip
                  title={responsive.isDarkMode ? "Light mode" : "Dark mode"}
                >
                  <Button
                    style={{ color: "white" }}
                    type="text"
                    onClick={switchTheme}
                    shape="circle"
                    icon={<BulbOutlined />}
                  />
                </Tooltip>
                <Typography
                  className={css({
                    opacity: 0.8,
                    padding: "4px 15px",
                    color: "white",
                  })}
                >
                  |
                </Typography>
                {!user && (
                  <Link href="/login">
                    <Button type="primary" style={{ color: "white" }}>
                      Login
                    </Button>
                  </Link>
                )}
                {user && (
                  <>
                    <Typography.Text style={{ color: "white" }}>
                      Hello, {user.firstName ?? "User"}
                    </Typography.Text>
                    {!isPhone && (
                      <div>
                        <Dropdown
                          menu={{ items, onClick: handleMenuClick }}
                          placement="bottomRight"
                        >
                          <div
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <Avatar
                              style={{
                                color: "#f56a00",
                                backgroundColor: "#fde3cf",
                              }}
                            >
                              {user.firstName?.charAt(0).toUpperCase() ?? "U"}
                            </Avatar>
                          </div>
                        </Dropdown>
                      </div>
                    )}
                    {isPhone && (
                      <Icon
                        icon="material-symbols:menu-rounded"
                        fontSize="24"
                        onClick={() => setDrawer(true)}
                        style={{ display: "flex", cursor: "pointer" }}
                      />
                    )}
                    <Drawer
                      title="Intuition Exchange"
                      placement="right"
                      onClose={() => setDrawer(false)}
                      open={isDrawerOpen}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Link href="/exchange">
                          <Button
                            type="text"
                            style={{ width: "100%", textAlign: "start" }}
                            onClick={() => setDrawer(false)}
                          >
                            Exchange
                          </Button>
                        </Link>
                        <Link href="/p2p">
                          <Button
                            type="text"
                            style={{ width: "100%", textAlign: "start" }}
                            onClick={() => setDrawer(false)}
                          >
                            P2P
                          </Button>
                        </Link>
                        <Link href="/wallet">
                          <Button
                            type="text"
                            style={{ width: "100%", textAlign: "start" }}
                            onClick={() => setDrawer(false)}
                          >
                            Wallet
                          </Button>
                        </Link>
                        <Button
                          type="text"
                          style={{ width: "100%", textAlign: "start" }}
                          onClick={() => {
                            setDrawer(false);
                            logout();
                          }}
                        >
                          Logout
                        </Button>
                      </Space>
                    </Drawer>
                  </>
                )}
              </Space>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
