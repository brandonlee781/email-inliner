import { ResponsePayload, EventPayload, Callback, ContextPayload } from './types';
import { InlinerController } from './controllers/InlinerController';

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

function createResponse(status: number, body: any): ResponsePayload {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body,
  };
}
