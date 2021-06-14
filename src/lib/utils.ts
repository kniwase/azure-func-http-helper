import { performance } from 'perf_hooks';
import { Context } from '@azure/functions';
import { Request, Response } from 'express';

export function setHeaders(res: Response, context: Context) {
  context.res = context.res || ({} as Record<string, any>);
  context.res.headers = Object.assign(
    res.getHeaders() || {},
    context.res.headers,
  );
}

export function createRequestLog(
  req: Request,
  res: Response,
  context: Context,
) {
  const reqMethod = req.method.toUpperCase();
  const reqSegments = context.req?.params.segments || '';
  const reqQuery = Object.keys(req.query)
    .map((key) => `${key}=${req.query[key]}`)
    .join('&');
  const reqUri = '/' + reqSegments + (reqQuery ? '?' + reqQuery : '');
  const resStatusCode = res.statusCode;

  const logs: (string | number)[] = [reqMethod, reqUri, resStatusCode];
  const { startAt }: { startAt: number } = context.bindingData.sys;
  if (startAt) {
    const elapsedTime = Math.round((performance.now() - startAt) * 1000) / 1000;
    logs.push(`${elapsedTime}msec`);
  }

  context.log.info(logs.join(' '));
}

export function setStartAt(context: Context) {
  context.bindingData.sys['startAt'] = performance.now();
}
