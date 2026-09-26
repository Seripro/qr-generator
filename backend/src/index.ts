import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { generateQrMatrix } from "./qr/qrCode.js";
import { renderSvg } from "./qr/renderer.js";

const app = new Hono();

app.use(
  "/qr",
  cors({
    origin: "http://localhost:5173",
  }),
);

app.post("/qr", async (c) => {
  const body = await c.req.json<{ text: string }>();

  if (!body.text) {
    return c.json(
      {
        error: "text is required",
      },
      400,
    );
  }

  try {
    const matrix = generateQrMatrix(body.text);
    const svg = renderSvg(matrix);

    return c.json({
      svg,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Data too long") {
      return c.json(
        {
          error: "Data too long",
        },
        400,
      );
    }

    throw error;
  }
});

export default app;

serve({
  fetch: app.fetch,
  port: 3000,
});
