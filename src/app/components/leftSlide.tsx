"use client";

import Image from "next/image";
import styles from "../styles/leftSlide.module.css";
import {
  Group as GroupIcon,
  Campaign as CampaignIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  Bookmark as BookmarkIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { MenuChooseProps } from "../interfaces/interfaces";

import React, { useState, useReducer } from "react";
import Switch from "@mui/material/Switch";

const label = { inputProps: { "aria-label": "Dark Mode Switch" } };
const initialState = { isSelected: false };

function reducer(state: { isSelected: boolean }, action: { type: "toggle" }) {
  switch (action.type) {
    case "toggle":
      return { isSelected: !state.isSelected };
    default:
      return state;
  }
}

const LeftSlideBox: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDarkModeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDarkMode(event.target.checked);
    if (event.target.checked) {
      // document.body.classList.add("dark-mode");
    } else {
      // document.body.classList.remove("dark-mode");
    }
  };
  const data = {
    imgURL: "/favicon.png",
    userName: "User Name",
  };

  return (
    <div className={`${styles.leftSlideBox} ${styles.visible}`}>
      <header className={styles.slideHeader}>
        <CloseIcon sx={{ fontSize: 34, color: "black" }} onClick={onClose} />
        <Image
          src={data.imgURL}
          alt="Profile Image"
          width={56}
          height={56}
          className={styles.profileImage}
        />
        <p>{data.userName}</p>
      </header>
      <div className={styles.menuBox}>
        <MenuChoose
          icon={<GroupIcon sx={{ fontSize: 34, color: "black" }} />}
          text="Create new Group"
        />

        <MenuChoose
          icon={<CampaignIcon sx={{ fontSize: 36, color: "black" }} />}
          text="Create new Channel"
        />

        <MenuChoose
          icon={<BookmarkIcon sx={{ fontSize: 32, color: "black" }} />}
          text="Saved Messages"
        />

        <MenuChoose
          icon={<SettingsIcon sx={{ fontSize: 32, color: "black" }} />}
          text="Settings"
        />

        <div className={styles.menuChooseBox}>
          <DarkModeIcon
            sx={{ fontSize: 32, color: isDarkMode ? "yellow" : "black" }}
          />
          <p>Dark Mode</p>
          <Switch
            checked={isDarkMode}
            onChange={handleDarkModeToggle}
            {...label}
          />
        </div>
      </div>
    </div>
  );
};

const MenuChoose: React.FC<MenuChooseProps> = ({ icon, text }) => {
  return (
    <div className={styles.menuChooseBox}>
      {icon}
      <p>{text}</p>
    </div>
  );
};

export const LeftSlide = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      {state.isSelected ? (
        <LeftSlideBox onClose={() => dispatch({ type: "toggle" })} />
      ) : (
        <Image
          src={"/menu-menu.svg"}
          alt={"menu"}
          width={32}
          height={32}
          onClick={() => dispatch({ type: "toggle" })}
        />
      )}
    </>
  );
};
