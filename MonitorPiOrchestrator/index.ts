import * as df from "durable-functions"

const orchestrator = df.orchestrator(function* (context) {
    let devices: any[] = yield context.df.callActivity("GetDeviceTwinsActivity");
    const parallelTasks = [];

    for (let i of devices) {
        let deviceStatus = yield context.df.callActivity("GetPiStatusActivity", i.deviceId);
        deviceStatus.mzr = i.mzr;
        deviceStatus.verificationCode = i.verificationCode;
        parallelTasks.push(context.df.callActivity("UpdateDeviceStatus", deviceStatus));
    }

    yield context.df.Task.all(parallelTasks);
    const sum = parallelTasks.map((i) => i.result);

    context.log("Summary: ", sum);
    //yield context.df.callActivity("F3", sum);
});

export default orchestrator;
