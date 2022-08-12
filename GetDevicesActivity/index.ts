import { AzureFunction, Context } from "@azure/functions"
import { Registry } from "azure-iothub";

const activityFunction: AzureFunction = async function (context: Context): Promise<any[]> {
    const registry = Registry.fromConnectionString(process.env.IOTHUB_CONNECTION_STRING);
    return (await registry.list()).responseBody;
};

export default activityFunction;
