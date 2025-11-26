import { atom } from "recoil";
import type { Level, Language } from "../../types";

export type UserState = {
  email: string | null;
  name: string | null;
  preferences: {
    levels: Level[];
    languages: Language[];
  };
};

export const userState = atom<UserState>({
  key: "userState",
  default: {
    email: null,
    name: null,
    preferences: {
      levels: [],
      languages: [],
    },
  },
});


