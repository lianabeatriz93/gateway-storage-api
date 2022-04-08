// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GatewayModel } from "../../../models/GatewayModel";
import { IGatewayModel } from "../../../models/models";
import { FialResult, SuccessResult } from "../../../models/ResultClass";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResult<IGatewayModel[]> | FialResult>
) {
  if (req.method === "GET") {
    try {
      const gatewayModel = new GatewayModel();
      const gateways = await gatewayModel.getAllGateways();

      res.status(gateways.code).json(gateways);
    } catch (e) {
      res.status(500).json(new FialResult((e as Error).message, 500));
    }
  } else res.status(400);
}
