import { AzureFunction, Context } from "@azure/functions"
import { Registry } from "azure-iothub";

const activityFunction: AzureFunction = async function (context: Context): Promise<any[]> {
    const registry = Registry.fromConnectionString(process.env.IOTHUB_CONNECTION_STRING);
    let twins: any[] = [];
    let devices = (await registry.list()).responseBody;
    for (let d of devices) {
        let twin = (await registry.getTwin(d.deviceId)).responseBody
        twins.push({ deviceId: twin.deviceId, mzr: twin.properties.desired.mzr });
    }
    return twins;
};

export default activityFunction;
