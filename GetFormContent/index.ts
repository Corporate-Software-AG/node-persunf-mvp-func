import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, formContentIn): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    context.log(formContentIn);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: formContentIn
    };

};

export default httpTrigger;