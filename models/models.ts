import { ObjectId } from "mongodb";

export const GATEWAYDB = "gateways";
export const PERIPHERALDB = "peripherals";

export enum PeripheralEnum {
  online = "online",
  offline = "offline",
}

export interface IPeripheralModel {
  _id?: string;
  uid: number;
  vendor: string;
  date: Date;
  status: PeripheralEnum;
  gateway_id: string;
}

export interface IGatewayModel {
  _id?: string;
  serialId: string;
  name: string;
  ipAddress: string;
  peripherals: IPeripheralModel[];
}

export interface IIdInput {
  _id?: string | ObjectId;
}
export interface IIdGatewayInput extends IIdInput {
  serialId?: string;
}

export interface IIdPeripheralInput extends IIdInput {
  uid?: number;
}
