import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../usersSlice";
import UserCard from "./UserCard";
import QueueAnim from "rc-queue-anim";
import "./UsersList.less";

function UserList() {
  const users = useSelector(selectAllUsers);

  return (
    <div className="users-list">
      <QueueAnim type="scale">
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </QueueAnim>
    </div>
  );
}

export default UserList;
