import { AzureFunction, Context } from "@azure/functions"
import * as df from "durable-functions"

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);

    const client = df.getClient(context);
    const instanceId = await client.startNew("MonitorPiOrchestrator", undefined, null);

    context.log(`Started orchestration with ID = '${instanceId}'.`);
};

export default timerTrigger;
