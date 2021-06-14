"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLifecycleHooks = void 0;
function addLifecycleHooks(createApp, options) {
    async function createAppLifecycleHooks() {
        const app = await createApp();
        await app.init();
        function pseudoInstanse(req, res) {
            const done = req.context.done;
            req.context.done = function (err, result) {
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
        return { getHttpAdapter };
    }
    return createAppLifecycleHooks;
}
exports.addLifecycleHooks = addLifecycleHooks;
