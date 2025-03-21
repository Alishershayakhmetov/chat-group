import React, { useState } from "react";
import Image from "next/image";
import {
  Group as GroupIcon,
  Campaign as CampaignIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import { SelectGroupChannel } from "./selectGroupChannel";
import styles from "../styles/leftSlide.module.css";
import useDarkMode from "../hooks/useDarkMode";
import { useSocketContext } from "../contexts/socketContext";

const label = { inputProps: { "aria-label": "Dark Mode Switch" } };

const LeftSlideBox: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onSelect: (entity: string) => void;
}> = ({ isVisible, onClose, onSelect }) => {
  const socket = useSocketContext();
  const [isDarkMode, setIsDarkMode] = useDarkMode();

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
    if (!isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const data = {
    imgURL: "/favicon.png",
    userName: "User Name",
  };

  return (
    <div
      className={`${styles.leftSlideBox} ${
        isVisible ? styles.visible : styles.hidden
      }`}
    >
      <header className={styles.slideHeader}>
        <CloseIcon
          className="SVGColorController"
          sx={{ fontSize: 40 }}
          onClick={onClose}
        />
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
          icon={
            <GroupIcon className="SVGColorController" sx={{ fontSize: 34 }} />
          }
          text="Create new Group"
          onClick={() => onSelect("group")}
        />
        <MenuChoose
          icon={
            <CampaignIcon
              className="SVGColorController"
              sx={{ fontSize: 36 }}
            />
          }
          text="Create new Channel"
          onClick={() => onSelect("channel")}
        />
        <MenuChoose
          icon={
            <BookmarkIcon
              className="SVGColorController"
              sx={{ fontSize: 32 }}
            />
          }
          onClick={() => {
            socket.emit("enterChat", "savedMessages");
          }}
          text="Saved Messages"
        />
        <MenuChoose
          icon={
            <SettingsIcon
              className="SVGColorController"
              sx={{ fontSize: 32 }}
            />
          }
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

const MenuChoose: React.FC<{
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}> = ({ icon, text, onClick }) => {
  return (
    <div className={styles.menuChooseBox} onClick={onClick}>
      {icon}
      <p>{text}</p>
    </div>
  );
};

export const LeftSlide = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setSelectedEntity(null);
    setIsExiting(false);
  };

  return (
    <div>
      <Image
        src={"/menu-menu.svg"}
        alt={"menu"}
        width={32}
        height={32}
        onClick={() => setIsVisible(true)}
      />
      {selectedEntity ? (
        <div
          className={`${styles.centeredContainer} ${
            isExiting ? styles.fadeOut : styles.fadeIn
          }`}
        >
          <SelectGroupChannel entity={selectedEntity} onClose={handleClose} />
        </div>
      ) : (
        <LeftSlideBox
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          onSelect={(entity) => {
            setSelectedEntity(entity);
            setIsVisible(false);
          }}
        />
      )}
    </div>
  );
};
