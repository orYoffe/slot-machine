import React from "react";
import { act, render, fireEvent } from "@testing-library/react";
import Home from "../pages/index";

const expectWithTimeout = (callback, timeout) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        callback();
        resolve(null);
      } catch (error) {
        reject(error);
      }
    }, timeout); // skip all the setTimeouts
  });

global.fetch = jest.fn();

describe("<Home/>", () => {
  describe("Cashing out", () => {
    it("Show the right text before cashing out", () => {
      const { queryByTestId } = render(<Home creditsLeft={10} />);

      expect(queryByTestId("cashout-text")).not.toBeInTheDocument();
      expect(queryByTestId("credits-left")).toBeInTheDocument();
    });

    it("remove the game after cashing out and change the header", () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            message: "ok",
          }),
      } as any);
      const { getByText, queryByTestId } = render(<Home creditsLeft={10} />);
      act(() => {
        fireEvent(
          getByText(/cash out/gi),
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          })
        );
      });

      expect(queryByTestId("cashout-text")).toBeInTheDocument();
      expect(queryByTestId("credits-left")).not.toBeInTheDocument();
    });
  });

  describe("Playing", () => {
    it("should show credits left", () => {
      const { getByText } = render(<Home creditsLeft={10} />);

      expect(getByText("Credits Left: 10")).toBeInTheDocument();
    });

    it("should show message when out of credits", () => {
      const { getByText } = render(<Home creditsLeft={0} />);

      expect(getByText("Credits Left: 0")).toBeInTheDocument();
      expect(getByText(/You ran out of money/gi)).toBeInTheDocument();
    });

    it("should update credits and results after clicking roll", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            creditsLeft: 9,
            results: [1, 2, 0],
            didWin: false,
          }),
      } as any);
      const { getByText, queryByTestId } = render(<Home creditsLeft={10} />);

      act(() => {
        fireEvent(
          getByText(/roll/i),
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          })
        );
      });

      expect(queryByTestId("spinner")).toBeInTheDocument();

      return expectWithTimeout(() => {
        expect(queryByTestId("spinner")).not.toBeInTheDocument();
        expect(getByText("Credits Left: 9")).toBeInTheDocument();
      }, 1900);
    });

    it("should show results when player won", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            creditsLeft: 19,
            results: [0, 0, 0],
            didWin: true,
          }),
      } as any);
      const { getByText } = render(<Home creditsLeft={10} />);

      act(() => {
        fireEvent(
          getByText(/roll/i),
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          })
        );
      });

      return expectWithTimeout(() => {
        expect(getByText(/You WON/gi)).toBeInTheDocument();
        expect(getByText("Credits Left: 19")).toBeInTheDocument();
      }, 1900);
    });
  });
});
