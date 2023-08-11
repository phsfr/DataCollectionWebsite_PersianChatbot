import React, { useEffect, useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../context/auth";

const MenuBar = () => {
  const { user, logout } = useContext(AuthContext);

  let location = useLocation();
  const path = location.pathname === "/" ? "home" : location.pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  useEffect(() => {
    setActiveItem(path);
  }, [location, path]);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name={`لابی`}
        active={activeItem === "chatlobby"}
        onClick={handleItemClick}
        as={Link}
        to="/chatlobby"
      />{" "}
      <Menu.Item
        name={`چت‌های من`}
        active={activeItem === "profile"}
        onClick={handleItemClick}
        as={Link}
        to="/profile"
      />
      <Menu.Menu position="right">
        <Menu.Item name="خروج" onClick={logout} />
        <Menu.Item
          name={`راهنما`}
          active={activeItem === "help"}
          onClick={handleItemClick}
          as={Link}
          to="/help"
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name={`لابی`}
        active={activeItem === "chatlobby"}
        onClick={handleItemClick}
        as={Link}
        to="/chatlobby"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="ثبت نام"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
        <Menu.Item
          name="ورود"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name={`راهنما`}
          active={activeItem === "help"}
          onClick={handleItemClick}
          as={Link}
          to="/help"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
};

export default MenuBar;
