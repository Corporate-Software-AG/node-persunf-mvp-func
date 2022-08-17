import { AzureFunction, Context } from "@azure/functions"

const activityFunction: AzureFunction = async function (context: Context, summary: any[]): Promise<string> {

    const appInsights = require('applicationinsights')
    appInsights.setup();
    const appInsightsClient = appInsights.defaultClient;

    let offlineDevices = summary.filter(e => e.status === 'offline')

    if (offlineDevices.length > 0) {
        appInsightsClient.trackEvent({ name: "OFFLINE DEVICES", devices: offlineDevices })
        return "OFFLINE DEVICES"
    } else {
        appInsightsClient.trackEvent({ name: "ALL DEVICES ONLINE" })
        return "ALL DEVICES ONLINE"
    }
};

export default activityFunction;
