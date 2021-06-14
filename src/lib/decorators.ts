import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AzureFuncContext = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().context;
  },
)();
