export interface ResponsePayload {
  statusCode: number;
  // body: string;
  body: {
    html?: string;
    error?: string;
    input: any;
  };
}

export interface QueryParameters {
  url: string;
}

export interface EventPayload {
  method: string;
  queryStringParameters: QueryParameters;
}

export interface Callback {
  (error: any, result?: ResponsePayload): void;
}