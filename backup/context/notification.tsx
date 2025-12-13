import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import React from "react";

type AuthContext = {
  api: NotificationInstance;
};

export const NotificationContext = React.createContext<AuthContext>(
  {} as AuthContext
);

export function NotificationProvider({ children }: { children: any }) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <>
      {contextHolder}
      <NotificationContext.Provider value={{ api }}>
        {children}
      </NotificationContext.Provider>
    </>
  );
}
