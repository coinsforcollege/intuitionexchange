import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import React from "react";

type AuthContext = {
  api: MessageInstance;
};

export const NotificationContext = React.createContext<AuthContext>(
  {} as AuthContext
);

export function NotificationProvider({ children }: { children: any }) {
  const [api, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <NotificationContext.Provider value={{ api }}>
        {children}
      </NotificationContext.Provider>
    </>
  );
}
