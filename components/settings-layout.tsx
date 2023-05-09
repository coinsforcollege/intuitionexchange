import {
  PercentageOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import { useRouter } from "next/router";

export enum SettingsSidebar {
  Profile,
  Security,
  Fees,
}

interface Item {
  icon: JSX.Element;
  id: SettingsSidebar;
  title: string;
  url: string;
}

const SidebarItems: Item[] = [
  {
    id: SettingsSidebar.Profile,
    title: "Profile",
    url: "/settings/profile",
    icon: <UserOutlined style={{ fontSize: "20px" }} />,
  },
  {
    id: SettingsSidebar.Security,
    title: "Account Security",
    url: "/settings/security",
    icon: <UnlockOutlined style={{ fontSize: "20px" }} />,
  },
  {
    id: SettingsSidebar.Fees,
    title: "Fees",
    url: "/settings/fees",
    icon: <PercentageOutlined style={{ fontSize: "20px" }} />,
  },
];

interface Props {
  children: any;
  selected: SettingsSidebar;
}

export function SettingsLayout({ children, selected }: Props) {
  const router = useRouter();
  const selectedItem = SidebarItems.find((i) => i.id === selected) as Item;

  return (
    <div className="settings">
      <div className="setting-sidebar-mobile">
        <Select
          style={{ width: "100%" }}
          options={SidebarItems.map((i) => ({ label: i.title, value: i.id }))}
          value={selected}
          onSelect={(value) => {
            router.push(
              SidebarItems.find((i) => i.id === value)?.url ??
                "/settings/profile"
            );
          }}
        />
      </div>
      <div className="settings-wrapper">
        <div className="settings-sidebar">
          <div className="settings-sidebar-heading">
            <span className="setting-sidebar-heading-title">
              Account Settings
            </span>
          </div>
          <div className="settings-sidebar-nav">
            {SidebarItems.map((item, _index) => (
              <div
                onClick={() => router.push(item.url)}
                key={`sidebar-${_index}`}
                className={[
                  "settings-sidebar-nav-item",
                  selectedItem.id === item.id ? "selected" : "",
                ].join(" ")}
              >
                <div className="settings-sidebar-nav-item-wrapper">
                  <span style={{ color: "#3067F0" }}>{item.icon}</span>
                  <span className="settings-sidebar-nav-item-title">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="settings-container">
          <div className="settings-section" data-private="true">
            <div className="settings-section-header">
              <span style={{ color: "#3067F0" }}> {selectedItem.icon}</span>
              <span className="settings-section-header-title">
                {selectedItem.title}
              </span>
            </div>
            <div className="settings-section-body">
              <div className="settings-section-body-panel">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
