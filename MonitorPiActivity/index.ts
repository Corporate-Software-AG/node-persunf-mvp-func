/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context } from "@azure/functions"
import { Client } from "azure-iothub";

const activityFunction: AzureFunction = async function (context: Context): Promise<any> {
    const client = Client.fromConnectionString(process.env.IOTHUB_CONNECTION_STRING);
    const response = await client.invokeDeviceMethod(context.bindings.deviceId, { methodName: "onHealthCheck" });
    if (response.result.status === 200) {
        context.log("Response: ", response.result.payload.result)
        return { deviceId: context.bindings.deviceId, running: response.result.payload.result };
    } else {
        return { deviceId: context.bindings.deviceId, running: false };
    }

};

export default activityFunction;
