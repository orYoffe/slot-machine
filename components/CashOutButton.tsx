import debounce from "debounce";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { cashOut } from "../utils/apis";
import { getRandomInt } from "../utils/getRandomInt";
import Button from "../components/Button";

interface Props {
  setdidCashout: Dispatch<SetStateAction<boolean>>;
  isSpinning?: boolean;
}

export default function CashOutButton({ setdidCashout, isSpinning }: Props) {
  const [cashOutStyle, setcashOutStyle] = useState<{} | undefined>();
  const [canCashout, setCanCashout] = useState(true);
  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);
  const onCashoutMouseEnter = useCallback(
    debounce(() => {
      if (!isMounted) {
        return;
      }
      // there is 50% chance that button moves in a random direction by 300px
      const shouldMove = getRandomInt(1) === 0;
      // 40% chance that it becomes unclickable (this roll should be done on client side)
      const shouldBeDisabled = getRandomInt(10) < 4;

      if (shouldMove) {
        const direction = getRandomInt(4);
        let style = { transform: "" };
        switch (direction) {
          case 0:
            style.transform = "translateX(300px)";
            break;
          case 1:
            style.transform = "translateX(-300px)";
            break;
          case 2:
            style.transform = "translateY(300px)";
            break;

          default:
            style.transform = "translateY(-300px)";
            break;
        }

        setcashOutStyle(style);

        setTimeout(() => {
          setcashOutStyle(undefined);
        }, 250);
      }

      if (shouldBeDisabled) {
        setCanCashout(false);
        setTimeout(() => {
          setCanCashout(true);
        }, 250);
      }
    }, 500),
    []
  );

  return (
    <Button
      disabled={isSpinning || !canCashout}
      style={cashOutStyle}
      onMouseEnter={onCashoutMouseEnter}
      onClick={async () => {
        if (isSpinning || !canCashout) {
          return;
        }
        setdidCashout(true);
        cashOut();
      }}
    >
      CASH OUT 💰
    </Button>
  );
}
