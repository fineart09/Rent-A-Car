import { createRouteHandler } from "uploadthing/next";
import { driverImageRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: driverImageRouter,
});
