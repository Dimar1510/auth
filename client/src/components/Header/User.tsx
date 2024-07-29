import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/app/hooks";
import { useCurrentQuery } from "src/app/services/userApi";
import { logout } from "src/app/userSlice";

const User = () => {
  const { data } = useCurrentQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          size="sm"
          src={data?.avatar ? data.avatar : "src/assets/images/profile.png"}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="light"
        disabledKeys={["user", "email"]}
      >
        <DropdownItem key="user" className="text-center">
          {data?.username}
        </DropdownItem>
        <DropdownItem key="email" className="text-center">
          {data?.email}
        </DropdownItem>
        <DropdownItem key="profile" textValue="Profile" href="/profile">
          Profile
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
