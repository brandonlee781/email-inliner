export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface ResponsePayload {
  headers: any;
  statusCode: number;
  body: string;
}

export interface ContextPayload {
  fail: (error: string) => void;
}

export interface EventPayload {
  method: string;
  headers: EventHeaders;
  path: string;
  pathParameters: EventParameters;
  requestContext: EventRequestContext;
  resource: string;
  httpMethod: HTTPMethod;
  queryStringParameters: EventParameters;
  stageVariables: any;
  // body: EventParameters;
  body: any;
  isOffline: boolean;
  json: (key: string) => void;
}

export interface EventHeaders {
  [key: string]: string;
}

export interface EventParameters {
  [key: string]: string;
}

export interface EventRequestContext {
  accountId: string;
  resourceId: string;
  apiId: string;
  stage: string;
  requestId: string;
  identity: EventRequestContextIdentity;
  authorizer: EventRequestContextAuthorizer;
  resourcePath: string;
  httpMethod: HTTPMethod;
}

export interface EventRequestContextIdentity {
  cognitoIdentityPoolId: string;
  accountId: string;
  cognitoIdentityId: string;
  caller: string;
  apiKey: string;
  sourceIp: string;
  cognitoAuthenticationType: string;
  cognitoAuthenticationProvider: string;
  userArn: string;
  userAgent: string;
  user: string;
}

export interface EventRequestContextAuthorizer {
  principalId: string;
}

export type Callback = (error: any, result?: ResponsePayload | string) => void;