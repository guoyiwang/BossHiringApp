import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavBar, TabBar } from "antd-mobile";
import { selectCurrentUser } from "../users/currentUser/currentUserSlice";
import UserInfo from "../users/currentUser/UserInfo/UserInfo";
import UserList from "../users/UsersList/UsersList";
import MessageList from "../messages/MessageList/MessageList";
import "./Home.less";

export default function Home() {
  const user = useSelector(selectCurrentUser);
  const userHead = user.type === "recruiter" ? "Job Seekers" : "Recruiters";
  const [title, setTilte] = useState(userHead);
  const [currentTab, setCurrentTab] = useState("first");
  const [unread, setUnread] = useState(0);
  
  const tabs = [
    {
      head: userHead,
      key: "users",
      iconTitle: userHead,
      name: "first",
      badge: 0,
      children: UserList,
    },
    {
      head: "Chats",
      key: "chats",
      iconTitle: "Chats",
      name: "second",
      badge: unread,
      children: MessageList,
    },
    {
      head: "Profile",
      key: "profile",
      iconTitle: "Profile",
      name: "third",
      badge: 0,
      children: UserInfo,
    },
  ];

  return (
    <div className="home-page">
      <NavBar className="sticky-header">{title}</NavBar>
      <TabBar
        barTintColor="white"
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
      >
        {tabs.map((tab) => (
          <TabBar.Item
            title={tab.iconTitle}
            key={tab.key}
            icon={{
              uri: require(`./images/${tab.key}.png`),
              style: {
                width: "22px",
                height: "22px",
                background: `center center /  21px 21px no-repeat`,
              },
            }}
            selectedIcon={{
              uri: require(`./images/${tab.key}-selected.png`),
              style: {
                width: "22px",
                height: "22px",
                background: `center center /  21px 21px no-repeat`,
              },
            }}
            badge={tab.badge}
            selected={tab.name === currentTab}
            onPress={() => {
              setCurrentTab(tab.name);
              setTilte(tab.head);
            }}
          >
            {tab.key === 'chats' ? <tab.children setUnread={setUnread} /> : <tab.children />}
          </TabBar.Item>
        ))}
      </TabBar>
    </div>
  );
}
