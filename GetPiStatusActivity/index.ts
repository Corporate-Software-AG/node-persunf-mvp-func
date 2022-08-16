import { AzureFunction, Context } from "@azure/functions"
import { Client } from "azure-iothub";
import { setUncaughtExceptionCaptureCallback } from "process";

const activityFunction: AzureFunction = async function (context: Context, deviceId): Promise<any> {
    const client = Client.fromConnectionString(process.env.IOTHUB_CONNECTION_STRING);
    try {
        const response = await client.invokeDeviceMethod(deviceId, { methodName: "onHealthCheck" });
        if (response.result.status === 200) {
            return { deviceId: deviceId, running: response.result.payload.result };
        } else {
            throw setUncaughtExceptionCaptureCallback(response.result.status);
        }
    } catch (e) {
        if (e.response.statusCode === 404) {
            return { deviceId: deviceId, running: false };
        } else {
            throw setUncaughtExceptionCaptureCallback(e.response.statusCode);
        }
    }
};

export default activityFunction;
