import { useRef, useState } from "react";
import { useSocketContext } from "../contexts/socketContext";

export const useChatSearch = () => {
  const { socket } = useSocketContext();
  const [searchInput, setSearchInput] = useState("");
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);

    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      socket.emit("search", { query: value });
    }, 300);
  };

  return { searchInput, handleSearchInput };
};
