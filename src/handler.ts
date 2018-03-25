import { ResponsePayload, QueryParameters, EventPayload, Callback } from './types';
import { InlinerController } from './controllers/InlinerController';

export async function hello(event: EventPayload, context: QueryParameters, callback: Callback) {
  const url = event.queryStringParameters.url;
  const inliner = new InlinerController();
  const html = await inliner.getIndex(url);
  let response: ResponsePayload;

  if (html.error) {
    callback(html.error, null);
  }

  response = {
    statusCode: 200,
    body: {
      html: html.html,
      input: event,
    },
  };

  callback(null, response);
}
