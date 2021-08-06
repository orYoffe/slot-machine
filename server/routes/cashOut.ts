import { Request, Response } from "express";
import { SessionWithUid } from "../helpers";
import { deleteUser } from "../usersStore";

// The instructions said to move the credits to the user's account so keeping it in this variable seemed to be the simplest solution
const accounts: { [key: string]: number } = {};

export const cashOutRoute = (req: Request, res: Response) => {
  const { creditsLeft, userId } = req.session as SessionWithUid;

  accounts[userId] = creditsLeft;
  deleteUser(userId);

  req.session.destroy(function (err: Error) {
    if (err) {
      throw err;
    }
    res.json({ message: "ok" });
  });
};
