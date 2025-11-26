import { selector } from "recoil";
import { verifyAuth } from "../../services/authService";
import { authUserState } from "../atoms/authAtoms";

export const verifyAuthSelector = selector({
  key: "verifyAuthSelector",
  get: async ({ set }) => {
    const res = await verifyAuth();
    set(authUserState, res.user);
    return res.user;
  },
});


