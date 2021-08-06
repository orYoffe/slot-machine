import { Request, Response } from "express";
import { Session } from "express-session";
import uid from "uid-safe";
import { getUserCredits, updateUserCredits } from "./usersStore";
import { getRandomInt } from "../utils/getRandomInt";

export interface SessionWithUid extends Session {
  userId: string;
  creditsLeft: number;
}

const emptyRoll = [0, 0, 0];
export const roll = (max: number = 3): number[] => {
  const getNumberWithMax = getRandomInt.bind(null, max);
  return emptyRoll.map(getNumberWithMax);
};

export const sessionSyncMiddleware = (
  req: Request,
  _res: Response,
  next: () => void
) => {
  const session = req.session as SessionWithUid;
  if (!session.userId) {
    session.userId = uid.sync(18);
  }

  const creditsLeft = getUserCredits(session.userId);
  if (!creditsLeft && creditsLeft !== 0) {
    updateUserCredits(session.userId, 10);
  }

  session.creditsLeft = getUserCredits(session.userId);
  next();
};
