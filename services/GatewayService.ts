import {
  IGatewayModel,
  IIdGatewayInput,
  IIdPeripheralInput,
  IPeripheralModel,
} from "../models/models";
import ApiServiceInstance from "./ApiService";

export const GatewayService = {
  getGateways: async () => {
    return await ApiServiceInstance.get("/api/gateways", {});
  },
  getGatewayDetail: async (data: IIdGatewayInput) => {
    return await ApiServiceInstance.get("/api/gateways/details", {
      params: data,
    });
  },
  postGateway: async (data: IGatewayModel) => {
    return await ApiServiceInstance.post("/api/gateways/add", {
      ...data,
    });
  },
  putGateway: async (data: IGatewayModel) => {
    return await ApiServiceInstance.put("/api/gateways/edit", {
      ...data,
    });
  },
  postPeripheralGateway: async (
    gateway: IIdGatewayInput,
    peripheral: IPeripheralModel
  ) => {
    return await ApiServiceInstance.post("/api/gateways/peripherals/add", {
      gateway,
      peripheral,
    });
  },
  putPeripheralGateway: async (peripheral: IPeripheralModel) => {
    return await ApiServiceInstance.put("/api/gateways/peripherals/edit", {
      ...peripheral,
    });
  },
  deleteGateway: async (data: IIdGatewayInput) => {
    return await ApiServiceInstance.delete("/api/gateways/delete", {
      data: JSON.stringify(data),
    });
  },
  deletePeripheralGateway: async (data: IIdPeripheralInput) => {
    return await ApiServiceInstance.delete("/api/gateways/peripherals/delete", {
      data: JSON.stringify(data),
    });
  },
};
