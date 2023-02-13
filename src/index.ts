import express from "express";
import * as http from "http";
import routes from "./http/routes/routes";
import {getLogger} from "./helpers/logger";
import {getEnvironment} from "./http/DB/config/dbConfig";
import {Environments} from "./http/DB/config/enums";
import {doDBConnection} from "./http/DB/config";

const logger = getLogger("APP == INDEX");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);
export const ioServer = http.createServer(app);

const port = Number(process.env.PORT);
const isReset = process.argv[2] === "--reset";
console.log(isReset);

(async function() {
   if (isReset && getEnvironment() === Environments.development) {
      await doDBConnection(true);
      logger.log("Database connection reset.");
   } else {
      let successfulConnection = false;
      try {
         successfulConnection = await doDBConnection(false);
      } catch (e) {
         logger.error("Couldn't connect to DB'");
         logger.error(e);
      }
      if (successfulConnection) {
         app.listen(port, () => {
            logger.log("Listening on port " + port);
         });
      }
   }
})();
