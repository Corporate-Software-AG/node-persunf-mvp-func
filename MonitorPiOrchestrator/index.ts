import * as df from "durable-functions"

const orchestrator = df.orchestrator(function* (context) {

    let devices: any[] = yield context.df.callActivity("GetDevicesActivity");
    const outputs = [];

    for (let i of devices) {
        let deviceStatus = yield context.df.callActivity("MonitorPiActivity", i.deviceId);
        outputs.push(yield context.df.callActivity("UpdateDeviceStatus", deviceStatus));
    }

    context.log("Output: ", outputs)
    return outputs;
});

export default orchestrator;
