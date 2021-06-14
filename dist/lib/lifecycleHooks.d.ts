import { Context } from '@azure/functions';
import { INestApplication } from '@nestjs/common';
import { Request, Response } from 'express';
export interface AddLifecycleHooksOptions {
    onRequest?: (req: Request, res: Response, context: Context) => Promise<void> | void;
    onResponse?: (req: Request, res: Response, context: Context) => Promise<void> | void;
}
export declare function addLifecycleHooks(createApp: () => Promise<INestApplication>, options: AddLifecycleHooksOptions): () => Promise<INestApplication>;
