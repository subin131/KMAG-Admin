//buit-in
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { BiLogOut } from "react-icons/bi";
import { Dropdown } from "react-bootstrap";

//custom
import "../DashboardLayout/DashboardLayout.css";
import { contributorRoutes } from "../../routes";
import { useAuth } from "../../auth/useAuth";

export default function ContributorDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Content, Sider } = Layout;
 
  const auth = useAuth();
   const getUser =localStorage.getItem("user");

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
 
  const handleLogout = () => {
    auth.logout();
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu theme="dark" mode="inline">
          <Menu.Item className="brand" icon={<span className="text-danger" style={{ fontSize: "32px" }}>K</span>}>
            <span className="text-decoration-underline">MAG</span>{" "}
          </Menu.Item>
          {contributorRoutes.map((item, i) => (
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
          <div className="title">Contributor Dashboard</div>
          <div className="avatar-section">
          

          <Dropdown className="dd-header" >
            <Dropdown.Toggle  className="dd-wrapper"  >
              <img src="" alt="avatar" className="avatar-pic" />
              <h6>Hello, {!getUser.firstName?getUser.email:getUser.firstName}</h6>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dd-menu">
              <Dropdown.Item className="dd-item" href="/contributor/dashboard/profile">Profile</Dropdown.Item>
              <Dropdown.Item className="dd-item" onClick={() => handleLogout()}>Logout</Dropdown.Item>
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




