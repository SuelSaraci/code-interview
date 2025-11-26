import { atom } from "recoil";
import type { AuthUser } from "../../services/types";

export const authUserState = atom<AuthUser | null>({
  key: "authUserState",
  default: null,
});


