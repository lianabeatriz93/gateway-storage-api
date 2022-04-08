describe("Gateway test", () => {
  const testData = require("../data.json");
  const dotenv = require("dotenv");
  dotenv.config();
  test("Test if api/gateways endpoint workerd", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.getGateways();
    expect(result.status).toBe(200);
  });

  test("Test create new gateway", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.postGateway(testData.gateway);
    expect(result.status).toBe(200);
  });

  test("Test create gateway with the same serialId failed", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.postGateway(testData.gateway);
    expect(result.status).toBe(400);
  });

  test("Test create gateway with bad ipAddress failed", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.postGateway({
      ...testData.gateway,
      ipAddress: "345.0.0.-1",
    });
    expect(result.status).toBe(400);
  });

  test("Test create new peripheral gateway", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.postPeripheralGateway(
      { serialId: testData.gateway.serialId },
      testData.peripheral
    );
    expect(result.status).toBe(200);
  });

  test("Test create new peripheral with the same uid failed", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.postPeripheralGateway(
      { serialId: testData.gateway.serialId },
      testData.peripheral
    );
    expect(result.status).toBe(400);
  });

  test(`Test peripheral length of '${testData.gateway.name}'`, async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.getGatewayDetail({
      serialId: testData.gateway.serialId,
    });
    expect(result.status).toBe(200);
    expect(result.data.result.peripherals.length).toBe(1);
  });

  test("Test delete peripheral", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.deletePeripheralGateway({
      uid: testData.peripheral.uid,
    });
    expect(result.status).toBe(200);
  });

  test(`Test peripheral length of '${testData.gateway.name}'`, async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.getGatewayDetail({
      serialId: testData.gateway.serialId,
    });
    expect(result.status).toBe(200);
    expect(result.data.result.peripherals.length).toBe(0);
  });

  test("Test delete gateway", async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.deleteGateway({
      serialId: testData.gateway.serialId,
    });
    expect(result.data.result).toBeTruthy();
  });

  test(`Test gateway '${testData.gateway.name}' don't exist`, async () => {
    const services = require("../../services/GatewayService.ts");
    const result = await services.GatewayService.getGatewayDetail({
      serialId: testData.gateway.serialId,
    });
    expect(result.status).toBe(400);
  });
});
