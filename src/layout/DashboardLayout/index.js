//buit-in
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { BiLogOut } from "react-icons/bi";
import { Dropdown } from "react-bootstrap";

//custom
import "./DashboardLayout.css";
import { routes } from "../../routes";
import { useAuth } from "../../auth/useAuth";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Content, Sider } = Layout;
  const [getUser, setUser] = useState();
  const auth = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    auth.logout();
  };

  const goHome = () => {
    navigate("/admin/dashboard");
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width="220px">
        <Menu theme="dark" mode="inline">
          <div className="brand m-2 pointer" onClick={() => goHome()}>
            {collapsed ? (
              <span
                className="text-danger"
                style={{ fontSize: "32px", padding: "10px" }}
              >
                K
              </span>
            ) : (
              <img src="/kmag.png" />
            )}
          </div>
          {routes.map((item, i) => (
            <Menu.Item key={i} icon={item.icon}>
              <Link to={item.path} style={{ textDecoration: "none" }}>
                {item.name}
              </Link>
            </Menu.Item>
          ))}
          <Menu.Item
            className="logout"
            icon={<BiLogOut style={{ fontSize: "22px" }} />}
          >
            <a onClick={() => handleLogout()}>Log Out</a>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background header">
          <div>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: onCollapse,
              }
            )}
          </div>
          <div className="title">
            <span
              className="pointer"
              onClick={() => goHome()}
              style={{ width: "fit-content" , textDecoration:"none"}}
            >
              Dashboard
            </span>
          </div>
          <div className="avatar-section">
            <Dropdown className="dd-header">
              <Dropdown.Toggle className="dd-wrapper">
                <img
                  src="/img/kmag.png"
                  alt="avatar"
                  className="profile-image"
                />
                <h6>
                  {!getUser?.firstName ? getUser?.email : getUser?.firstName}
                </h6>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dd-menu">
                <Dropdown.Item
                  className="dd-item"
                  href="/admin/dashboard/profile"
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  className="dd-item"
                  onClick={() => handleLogout()}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "0px",
            padding: 25,
            minHeight: "92vh",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
