import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { roll } from "../utils/apis";
import resultsMapping from "../utils/resultsMapping";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import styles from "./SlotMachine.module.css";

interface Props {
  setisSpinning: Dispatch<SetStateAction<boolean>>;
  creditsLeft: number;
  isSpinning?: boolean;
}

export default function SlotMachine({
  creditsLeft,
  isSpinning,
  setisSpinning,
}: Props) {
  const [credits, setcredits] = useState(creditsLeft);
  const [results, setresults] = useState([0, 0, 0]);
  const [didWin, setdidWin] = useState(false);
  const [resultsCameIn, setresultsCameIn] = useState(false);

  return (
    <>
      <h2
        data-testid="credits-left"
        style={{
          color: !resultsCameIn ? "#222" : didWin ? "#2d2" : "#a22",
          transform: resultsCameIn && didWin ? "scale(1.2)" : "",
          transition: "all 0.25s",
        }}
      >
        Credits Left: {credits}
      </h2>
      <div className={styles.row}>
        {isSpinning
          ? Spinner
          : results.map((result, index) => (
              <Image
                key={`${result}_${index}`}
                src={resultsMapping[result]}
                alt="Picture of the author"
                width={200}
                height={200}
              />
            ))}
      </div>
      {credits === 0 && !isSpinning && <h1>You ran out of money!!!</h1>}
      {didWin && !isSpinning && <h1>🎉🎉🎉 You WON!!! 🎉🎉🎉</h1>}
      <Button
        disabled={isSpinning}
        onClick={async () => {
          if (isSpinning) {
            return;
          }

          setisSpinning(true);
          const res = await roll();

          setTimeout(() => {
            setisSpinning(false);
            setresults(res.results);

            setTimeout(() => {
              setcredits(res.creditsLeft);
              setdidWin(res.didWin);
              setresultsCameIn(true);

              setTimeout(() => {
                setresultsCameIn(false);
              }, 250);
            }, 150);
          }, 750);
        }}
      >
        Roll 🎰
      </Button>
    </>
  );
}
