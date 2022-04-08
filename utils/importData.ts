import { writeJSONSync, readJSONSync } from "fs-extra";
import { GatewayModel } from "../models/GatewayModel";

export async function importData() {
  const importData: boolean = process.env.IMPORT_DATA === "true" || false;
  const jsonData = readJSONSync("runImport.json", { throws: false }) || {
    run: true,
  };
  if (importData && !!jsonData.run) {
    console.log("Import db data");
    const data = require("./data.json");
    const gatewayModel = new GatewayModel();
    for (var gateway of data.gateways) {
      await gatewayModel.addGateway(gateway);
    }

    writeJSONSync("runImport.json", { run: false });
  }
}
