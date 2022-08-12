import { AzureFunction, Context } from "@azure/functions"
import { CosmosClient, PatchOperation } from "@azure/cosmos";

const activityFunction: AzureFunction = async function (context: Context, deviceStatus: any): Promise<any> {
    const client = new CosmosClient(process.env.armasuisse_COSMOSDB);
    const container = client.database("mvp_persunf").container("pistatus")
    const operations: PatchOperation[] = [
        { op: 'replace', path: '/status', value: deviceStatus.running ? "online" : "offline" }
    ]
    const { resource: updated } = await container.item(deviceStatus.deviceId, deviceStatus.deviceId).patch(operations);
    return { updatedDevice: updated };
};

export default activityFunction;
