import * as df from "durable-functions"

const orchestrator = df.orchestrator(function* (context) {
    let devices: any[] = yield context.df.callActivity("GetDeviceTwinsActivity");
    const parallelTasks = [];

    const appInsights = require('applicationinsights')
    appInsights.setup();
    const appInsightsClient = appInsights.defaultClient;

    for (let i of devices) {
        let deviceStatus = yield context.df.callActivity("GetPiStatusActivity", i.deviceId);
        deviceStatus.mzr = i.mzr;
        deviceStatus.verificationCode = i.verificationCode;
        deviceStatus.state = i.state;
        appInsightsClient.trackEvent({ name: "Monitor Pi Status", properties: { deviceId: deviceStatus.deviceId, status: deviceStatus.running ? "online" : "offline", location: deviceStatus.mzr ? deviceStatus.mzr : "not set", verificationCode: deviceStatus.verificationCode ? deviceStatus.verificationCode : "not set", state: deviceStatus.state ? deviceStatus.state : "not set" } });
        parallelTasks.push(context.df.callActivity("UpdateDeviceStatus", deviceStatus));
    }

    yield context.df.Task.all(parallelTasks);
    const sum = parallelTasks.map((i) => i.result);
    context.log("Summary: ", sum);
    yield context.df.callActivity("SendAppInsights", sum);
});

export default orchestrator;
