import { Request, Response } from "express";
import { SessionWithUid, roll } from "../helpers";
import { getRandomInt } from "../../utils/getRandomInt";
import { getUserCredits, updateUserCredits } from "../usersStore";

/*
10 - cherry
20 - lemon
30 - orange
40 - watermelon
*/
const winningMap = [10, 20, 30, 40];

export const rollRoute = (req: Request, res: Response) => {
  const { creditsLeft, userId } = req.session as SessionWithUid;

  if (creditsLeft === 0) {
    return res.json({ creditsLeft, results: [], didWin: false });
  }

  // reduce cost of one role
  updateUserCredits(userId, creditsLeft - 1);

  let results = roll();
  let didWin = results[0] === results[1] && results[2] === results[1];

  if (didWin) {
    if (creditsLeft < 40) {
      const creditRewards = winningMap[results[0]];
      updateUserCredits(userId, creditRewards + getUserCredits(userId));
    } else {
      const rollAgainPrecentage = creditsLeft < 60 ? 3 : 6;
      const shouldRollAgain = getRandomInt(10) < rollAgainPrecentage;
      if (shouldRollAgain) {
        results = roll();
        didWin = results[0] === results[1] && results[2] === results[1];
      }

      if (didWin) {
        const creditRewards = winningMap[results[0]];
        updateUserCredits(userId, creditRewards + getUserCredits(userId));
      }
    }
  }

  return res.json({ creditsLeft: getUserCredits(userId), results, didWin });
};
