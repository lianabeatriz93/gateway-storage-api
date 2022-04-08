// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GatewayModel } from "../../../../models/GatewayModel";
import { IGatewayModel } from "../../../../models/models";
import { FialResult, SuccessResult } from "../../../../models/ResultClass";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResult<IGatewayModel> | FialResult>
) {
  if (req.method === "PUT") {
    try {
      const gatewayModel = new GatewayModel();
      const gateway = await gatewayModel.editGatewayPeripheral({
        ...req.query,
        ...req.body,
      });
      res.status(gateway.code).json(gateway);
    } catch (e) {
      res.status(500).json(new FialResult((e as Error).message, 500));
    }
  } else res.status(400);
}
