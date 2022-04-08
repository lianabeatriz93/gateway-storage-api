import { connectToDatabase } from "../utils";
import {
  GATEWAYDB,
  IGatewayModel,
  IIdGatewayInput,
  IIdPeripheralInput,
  IPeripheralModel,
  PERIPHERALDB,
  PeripheralEnum,
} from "./models";
import { Db, ObjectId } from "mongodb";
import { FialResult, SuccessResult } from "./ResultClass";
import { isIPv4 } from "net";

export class GatewayModel {
  async getAllGateways(): Promise<SuccessResult<IGatewayModel[]> | FialResult> {
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);
    const gateways = await db.collection(GATEWAYDB).find().toArray();
    const result: IGatewayModel[] = [];
    for (var gtw of gateways) {
      const peripherals = await this.getPeripheralsGateway(
        db,
        gtw._id.toString()
      );
      result.push({
        ...gtw,
        _id: gtw._id.toString(),
        peripherals: peripherals,
      } as IGatewayModel);
    }
    return new SuccessResult(result);
  }

  async getGatewayDetail(
    data: IIdGatewayInput
  ): Promise<SuccessResult<IGatewayModel> | FialResult> {
    const input = this.getInputId(data) as any;
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);
    const searchGW = await this.findOneInCollection(
      db,
      GATEWAYDB,
      (input._id as ObjectId) || null,
      "serialId",
      `"${input.serialId}"`
    );

    if (!searchGW) return new FialResult("Gateway don't exist", 400);
    const gatewayModel = {
      ...searchGW,
      _id: searchGW._id.toString(),
    } as IGatewayModel;
    gatewayModel.peripherals = gatewayModel
      ? await this.getPeripheralsGateway(db, gatewayModel._id || "")
      : [];
    return new SuccessResult(gatewayModel);
  }

  async addGateway(data: IGatewayModel) {
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);
    const verify = await this.validateGateway(data, db);
    if (!verify.success) return verify as FialResult;
    const verifyPeripherals = await this.validatePeripheralList(
      data.peripherals,
      db
    );
    if (!verifyPeripherals.success) return verifyPeripherals as FialResult;
    const _id = await this.addGatewayQuery(db, data);
    return await this.getGatewayDetail({ serialId: data.serialId, _id });
  }

  async editGateway(data: IGatewayModel) {
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);
    const verify = await this.validateGateway(data, db, false);
    if (!verify.success) return verify as FialResult;

    await this.editGatewayQuery(db, data);
    return await this.getGatewayDetail({ serialId: data.serialId });
  }

  async addGatewayPeripheral(data: {
    gateway: IIdGatewayInput;
    peripheral: IPeripheralModel;
  }) {
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);
    const searchGW = await this.getGatewayDetail(data.gateway);

    if (!searchGW.success || !searchGW.result?._id)
      return new FialResult("Gateway don't exist", 400);
    const _idGateway = searchGW.result._id;

    const verify = await this.validatePeripheral(
      data.peripheral,
      db,
      _idGateway,
      []
    );
    if (!verify.success) return verify as FialResult;

    await this.addPeripheralQuery(db, data.peripheral, _idGateway);
    return await this.getGatewayDetail(data.gateway);
  }

  async editGatewayPeripheral(data: IPeripheralModel) {
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);

    const verify = await this.validatePeripheral(data, db, "", [], false);
    if (!verify.success) return verify as FialResult;

    await this.editPeripheralQuery(db, data);
    const peripheral = await this.getPeripheral(db, { uid: data.uid });
    const gateway = await this.getGatewayDetail({
      _id: peripheral?.gateway_id,
    });
    return gateway;
  }

  async removeGateway(data: IIdGatewayInput) {
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);
    const input = this.getInputId(data);
    const gateway = await this.getGatewayDetail(input);
    if (!gateway.success) return gateway as FialResult;
    if (gateway.result?.peripherals && gateway.result.peripherals.length > 0) {
      const peripheral = { gateway_id: gateway.result._id };
      await db.collection(PERIPHERALDB).deleteMany(peripheral);
    }
    await db.collection(GATEWAYDB).deleteOne(input);
    return new SuccessResult(true);
  }

  async removeGatewayPeripheral(data: IIdPeripheralInput) {
    const { client, db, error } = await connectToDatabase();
    if (error || !db)
      return new FialResult(error || "Connection to database fail", 500);
    const input = this.getInputId(data);

    const peripheral = await this.getPeripheral(db, input);
    if (!peripheral || !peripheral._id)
      return new FialResult("Peripheral don't exist", 400);

    const gatewey = { _id: peripheral.gateway_id };

    await db.collection(PERIPHERALDB).deleteOne(input);

    return await this.getGatewayDetail(gatewey);
  }

  async addGatewayQuery(db: Db, data: IGatewayModel) {
    const gatewayDoc = {
      name: data.name,
      ipAddress: data.ipAddress,
      peripherals: [],
      serialId: data.serialId,
    };

    const result = await db.collection(GATEWAYDB).insertOne(gatewayDoc);
    const gatewId = result.insertedId.toString();

    for (var peripheral of data.peripherals || []) {
      const result = await this.addPeripheralQuery(db, peripheral, gatewId);
    }
    return gatewId;
  }

  async editGatewayQuery(db: Db, data: IGatewayModel) {
    const props = {
      ipAddress: data.ipAddress,
      name: data.name,
    };

    const result = await db
      .collection(GATEWAYDB)
      .updateOne({ serialId: data.serialId }, { $set: props });

    return true;
  }

  async addPeripheralQuery(db: Db, data: IPeripheralModel, _idGateway: string) {
    const peripheral = {
      date: data.date || new Date(),
      status: data.status || PeripheralEnum.offline,
      uid: data.uid,
      vendor: data.vendor,
      gateway_id: _idGateway,
    };

    const result = await db.collection(PERIPHERALDB).insertOne(peripheral);
    return result.insertedId.toString();
  }

  async editPeripheralQuery(db: Db, data: IPeripheralModel) {
    const peripheral = {
      date: data.date || new Date(),
      status: data.status || PeripheralEnum.offline,
      vendor: data.vendor,
    };

    const result = await db
      .collection(PERIPHERALDB)
      .updateOne({ uid: data.uid }, { $set: peripheral });
    return true;
  }

  async getPeripheral(db: Db, peripheral: IIdPeripheralInput) {
    const input = this.getInputId(peripheral) as any;
    const peripheralDoc = await this.findOneInCollection(
      db,
      PERIPHERALDB,
      (input._id as ObjectId) || null,
      "uid",
      `${input.uid}`
    );

    return peripheralDoc
      ? ({
          ...peripheralDoc,
          _id: peripheralDoc._id.toString(),
        } as IPeripheralModel)
      : null;
  }

  async getPeripheralsGateway(db: Db, idGateway: string) {
    const peripherals = await db
      .collection(PERIPHERALDB)
      .find({
        $where: `this.gateway_id == "${idGateway}"`,
      })
      .toArray();

    return peripherals.map((ph) => ph as any as IPeripheralModel);
  }

  async getPeripheralsGatewayCount(db: Db, idGateway: string) {
    const count = await db
      .collection(PERIPHERALDB)
      .countDocuments({ gateway_id: idGateway });
    return count || 0;
  }

  getInputId(input: IIdPeripheralInput | IIdGatewayInput) {
    const result = { ...input };
    if (result._id && typeof result._id === "string") {
      result._id = new ObjectId(result._id);
    }
    return result;
  }

  async validateGateway(
    data: IGatewayModel,
    db: Db,
    verifyDontExist: boolean = true
  ) {
    if (!data) return new FialResult("Invalid parameter", 400);
    if (data.peripherals?.length > 10)
      return new FialResult(
        "No more that 10 peripheral devices are allowed for a gateway",
        400
      );
    if (!isIPv4(data.ipAddress))
      return new FialResult("IPv4 address is invalid", 400);

    if (!data.serialId) return new FialResult("Serial number is required", 400);
    const searchSerial = await this.findOneInCollection(
      db,
      GATEWAYDB,
      null,
      "serialId",
      `"${data.serialId}"`
    );
    if (verifyDontExist && !!searchSerial)
      return new FialResult("Serial id already exist", 400);
    if (!verifyDontExist && !searchSerial)
      return new FialResult("Serial id don't exist", 400);
    return new SuccessResult(true);
  }

  async validatePeripheral(
    peripheral: IPeripheralModel,
    db: Db,
    _idPeripheral: string,
    uidToInsert: string[],
    verifyDontExist: boolean = true
  ) {
    if (Number.isNaN(parseFloat(`${peripheral.uid}`))) {
      return new FialResult("Peripheral uid need to be a number", 400);
    }

    const searchPh = await this.findOneInCollection(
      db,
      PERIPHERALDB,
      null,
      "uid",
      `${peripheral.uid}`
    );

    if (!!verifyDontExist && !!searchPh)
      return new FialResult("Peripheral uid already exist", 400);
    if (!verifyDontExist && !searchPh)
      return new FialResult("Peripheral don't exist", 400);

    if (!PeripheralEnum[peripheral.status])
      return new FialResult(
        "Peripheral status need to be 'online' or 'offline'",
        400
      );

    const peripheralsByGateways =
      (await this.getPeripheralsGatewayCount(db, _idPeripheral)) || 0;
    if (peripheralsByGateways === 10) {
      return new FialResult(
        "No more that 10 peripheral devices are allowed for a gateway",
        400
      );
    }

    if (
      uidToInsert.filter((uid) => `${uid}` === `${peripheral.uid}`).length > 1
    )
      return new FialResult("Peripheral list contain equals uid values", 400);

    return new SuccessResult(true);
  }

  async validatePeripheralList(peripherals: IPeripheralModel[], db: Db) {
    const uidToInsert = peripherals.map((periph) => `${periph.uid}`);
    let resultVerify: FialResult | SuccessResult<boolean> = new SuccessResult(
      true
    );
    for (var peripheral of peripherals || []) {
      const verifyPeripheral = await this.validatePeripheral(
        peripheral,
        db,
        "",
        uidToInsert
      );
      if (!verifyPeripheral.success) {
        resultVerify = verifyPeripheral;
        break;
      }
    }
    return resultVerify;
  }

  async findOneInCollection(
    db: Db,
    collection: string,
    _id: ObjectId | null,
    prop?: string,
    value?: string
  ) {
    if (_id) {
      return await db.collection(collection).findOne(_id);
    } else {
      return await db
        .collection(collection)
        .findOne({ $where: `this.${prop} == ${value}` });
    }
  }
}
