import { selector } from "recoil";
import { userState } from "../atoms/userAtom";

export const isLoggedInSelector = selector({
  key: "isLoggedInSelector",
  get: ({ get }) => {
    const user = get(userState);
    return Boolean(user.email);
  },
});

export const userPreferencesSelector = selector({
  key: "userPreferencesSelector",
  get: ({ get }) => {
    const user = get(userState);
    return user.preferences;
  },
});


