import express from "express";
import session from "express-session";
import next from "next";
import { sessionSyncMiddleware } from "./helpers";
import { rollRoute } from "./routes/roll";
import { cashOutRoute } from "./routes/cashOut";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(
    session({
      secret: "wheel of fortune",
    })
  );

  server.use(sessionSyncMiddleware);

  server.get("/api/roll", rollRoute);

  server.get("/api/cash-out", cashOutRoute);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
