import { AzureFunction, Context } from "@azure/functions"
import { Registry } from "azure-iothub";

const activityFunction: AzureFunction = async function (context: Context): Promise<any[]> {
    const registry = Registry.fromConnectionString(process.env.IOTHUB_CONNECTION_STRING);
    let twins: any[] = [];
    let devices = (await registry.list()).responseBody;
    for (let d of devices) {
        let twin = (await registry.getTwin(d.deviceId)).responseBody
        if (!twin.properties.desired.mzr) twin.properties.desired.mzr = "not set"
        if (!twin.properties.desired.verificationCode) twin.properties.desired.verificationCode = "not set"
        if (!twin.properties.desired.state) twin.properties.desired.state = "not set"
        twins.push({ deviceId: twin.deviceId, mzr: twin.properties.desired.mzr, verificationCode: twin.properties.desired.verificationCode, state: twin.properties.desired.state });
    }
    return twins;
};

export default activityFunction;
