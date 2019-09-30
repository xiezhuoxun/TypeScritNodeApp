import { Response, Request, NextFunction } from "express";
import * as core from "express-serve-static-core";
import { Api, send2Client, StatusCode } from "../util";

const Codes = Api.map(item => item.code);

const routes = (app: core.Express) => {
  app.post("/", (req: Request, res: Response) => {
    try {
      const { actionCode, timestamp } = req.body;
      if (!actionCode) {
        send2Client(res, 200, StatusCode.EMPTY_METHOD);
        return;
      }
      if (!timestamp) {
        send2Client(res, 200, StatusCode.EMPTY_TIMESTAMP);
        return;
      }
      if (Codes.includes(actionCode)) {
        const apiAction = Api.find(item => item.code === actionCode);
        // const { action, needData } = apiAction;
        const { needData } = apiAction;
        const { data } = req.body;
        if (needData && (data === undefined || data === null || data === "" || Object.keys(data).length === 0)) {
          send2Client(res, 200, StatusCode.EMPTY_REQ_DATA);
          return;
        }
        send2Client(res, 200, StatusCode.OK);
        // action(req, res);
      } else {
        send2Client(res, 200, StatusCode.NO_METHOD);
      }
    } catch (error) {
      send2Client(res, 200, { code: 500, message: error.toString() });
    }
  });
};

export default routes;
