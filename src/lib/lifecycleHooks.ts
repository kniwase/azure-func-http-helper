import { Context } from '@azure/functions';
import { INestApplication } from '@nestjs/common';
import { Request, Response } from 'express';

export interface AddLifecycleHooksOptions {
  onRequest?: (
    req: Request,
    res: Response,
    context: Context,
  ) => Promise<void> | void;
  onResponse?: (
    req: Request,
    res: Response,
    context: Context,
  ) => Promise<void> | void;
}

export function addLifecycleHooks(
  createApp: () => Promise<INestApplication>,
  options: AddLifecycleHooksOptions,
): () => Promise<INestApplication> {
  async function createAppLifecycleHooks(): Promise<INestApplication> {
    const app = await createApp();
    await app.init();

    function pseudoInstanse(req: any, res: any) {
      const done = req.context.done;
      req.context.done = function (err?: string | Error, result?: any) {
        async function onResponse() {
          if (options.onResponse) {
            const ret = options.onResponse(req, res, req.context);
            if (ret instanceof Promise) {
              await ret;
            }
          }
          done(err, result);
        }
        onResponse();
      };

      async function onRequest() {
        if (options.onRequest) {
          const ret = options.onRequest(req, res, req.context);
          if (ret instanceof Promise) {
            await ret;
          }
        }
        app.getHttpAdapter().getInstance()(req, res);
      }
      onRequest();
    }

    function getInstance() {
      return pseudoInstanse;
    }

    function getHttpAdapter() {
      return { getInstance };
    }

    return { getHttpAdapter } as INestApplication;
  }

  return createAppLifecycleHooks;
}
