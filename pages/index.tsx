import { GetServerSideProps } from "next";
import Head from "next/head";
import { Request } from "express";
import { useState } from "react";
import { SessionWithUid } from "../server/helpers";
import SlotMachine from "../components/SlotMachine";
import CashOutButton from "../components/CashOutButton";
import styles from "./styles.module.css";

interface Props {
  creditsLeft: SessionWithUid["creditsLeft"];
}

export default function Home({ creditsLeft }: Props) {
  const [didCashout, setdidCashout] = useState(false);
  const [isSpinning, setisSpinning] = useState(false);

  return (
    <main className={styles.main}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Righteous"
          rel="stylesheet"
        />
      </Head>
      <style global jsx>{`
        body,
        button {
          font-family: Righteous;
        }
      `}</style>
      {didCashout && (
        <h1 data-testid="cashout-text">
          💰💰💰 You cashed out! Refresh to play again 💰💰💰
        </h1>
      )}
      {!didCashout && (
        <>
          <SlotMachine
            isSpinning={isSpinning}
            setisSpinning={setisSpinning}
            creditsLeft={creditsLeft}
          />
          <CashOutButton
            isSpinning={isSpinning}
            setdidCashout={setdidCashout}
          />
        </>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const creditsLeft = (context.req as Request & { session: SessionWithUid })
    .session.creditsLeft;

  return {
    props: {
      creditsLeft,
    },
  };
};
