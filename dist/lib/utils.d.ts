import { Context } from '@azure/functions';
import { Request, Response } from 'express';
export declare function setHeaders(res: Response, context: Context): void;
export declare function createRequestLog(req: Request, res: Response, context: Context): void;
export declare function setStartAt(context: Context): void;
