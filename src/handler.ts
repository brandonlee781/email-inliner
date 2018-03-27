import { ResponsePayload, EventPayload, Callback, ContextPayload } from './types';
import { InlinerController } from './controllers/InlinerController';

/**
 * Takes a URL to a website and returns that site's html with inlined css and minified.
 * @param {EventPayload} event Response event that triggers the running of this function
 * @param {ContextPayload} context All variables surrounding the execution of this function
 * @param {Callback} callback - Callback function to end the executions of this function
 * takes two parameters, an optional error and 'stringifiable' response
 * @returns {ResponsePayload}
 */
export async function urlInliner(event: EventPayload, context: ContextPayload, callback: Callback): Promise<void> {
  try {
    const url = event.queryStringParameters.url;

    const inliner = new InlinerController();
    const html = await inliner.fromUrl(url);
    const response: ResponsePayload = createResponse(200, { html });

    callback(null, response);
  } catch (err) {
    callback(null, createResponse(400, { error: err.message, stack: JSON.stringify(err.stack) }));
  }
}

/**
 * Takes a HTML string, inlines CSS, minfies it and returns it.
 * @param {EventPayload} event Response event that triggers the running of this function
 * @param {ContextPayload} context All variables surrounding the execution of this function
 * @param {Callback} callback - Callback function to end the executions of this function
 * takes two parameters, an optional error and 'stringifiable' response
 * @returns {ResponsePayload}
 */
export async function htmlInliner(event: EventPayload, context: ContextPayload, callback: Callback): Promise<void> {
  try {
    const contentType = event.headers['Content-Type'];
    let html;

    if (contentType === 'application/json') {
      html = JSON.parse(event.body);
    } else if (contentType === 'application/x-www-form-urlencoded') {
      html = decodeURI(event.body.replace('html=', ''));
    } else {
      html = event.body;
    }

    const inliner = new InlinerController();
    const inlinedHtml = await inliner.fromHtml(html);

    callback(null, createResponse(200, { html: inlinedHtml }));
  } catch (err) {
    callback(null, createResponse(400, { error: err.message, stack: JSON.stringify(err.stack) }));
  }
}

/**
 * Creates a response object with the HTTP status code and response object
 * @private
 * @param {number} status - Response Status Code
 * @param {any} body - Stringifiable response
 * @returns {ResponsePayload}
 */
function createResponse(status: number, body: any): ResponsePayload {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body,
  };
}
