import { AzureFunction, Context } from "@azure/functions"

const activityFunction: AzureFunction = async function (context: Context, summary: any[]): Promise<string> {

    const appInsights = require('applicationinsights')
    appInsights.setup();
    const appInsightsClient = appInsights.defaultClient;

    let offlineDevices = summary.filter(e => e.status === 'offline')
    let onlineDevices = summary.filter(e => e.status === 'online')

    appInsightsClient.trackMetric({ name: "TOTAL DEVICES", value: summary.length })
    appInsightsClient.trackMetric({ name: "ONLINE DEVICES", value: onlineDevices.length })
    appInsightsClient.trackMetric({ name: "OFFLINE DEVICES", value: offlineDevices.length })

    if (offlineDevices.length > 0) {
        appInsightsClient.trackEvent({ name: "OFFLINE DEVICES" })
        return "OFFLINE DEVICES"
    } else {
        appInsightsClient.trackEvent({ name: "ALL DEVICES ONLINE" })
        return "ALL DEVICES ONLINE"
    }
};

export default activityFunction;
