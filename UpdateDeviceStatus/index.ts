import { AzureFunction, Context } from "@azure/functions"
import { CosmosClient, PatchOperation } from "@azure/cosmos";

const activityFunction: AzureFunction = async function (context: Context, deviceStatus: any): Promise<any> {
    const client = new CosmosClient(process.env.armasuisse_COSMOSDB);
    const container = client.database(process.env.DB_NAME).container("pistatus")

    const { resources } = await container.items
        .query({
            query: `SELECT * from c WHERE c.id = "${deviceStatus.deviceId}"`,
        })
        .fetchAll();

    if (resources.length === 0) {
        const { resource: updated } = await container.items.create({ id: deviceStatus.deviceId, status: deviceStatus.running ? "online" : "offline", location: deviceStatus.mzr ? deviceStatus.mzr : "not set", verificationCode: deviceStatus.verificationCode ? deviceStatus.verificationCode : "not set" });
        return { id: updated.id, status: updated.status, location: updated.location, verificationCode: updated.verificationCode }

    } else {
        const operations: PatchOperation[] = [
            { op: 'add', path: '/status', value: deviceStatus.running ? "online" : "offline" },
            { op: 'add', path: '/location', value: deviceStatus.mzr ? deviceStatus.mzr : "not set" },
            { op: 'add', path: '/verificationCode', value: deviceStatus.verificationCode ? deviceStatus.verificationCode : "not set" },
            { op: 'add', path: '/state', value: deviceStatus.state ? deviceStatus.state : "inactive" },
        ]
        const { resource: updated } = await container.item(deviceStatus.deviceId, deviceStatus.deviceId).patch(operations);
        return { id: updated.id, status: updated.status, location: updated.location, verificationCode: updated.verificationCode };
    }
};

export default activityFunction;
