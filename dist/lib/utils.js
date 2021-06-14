"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStartAt = exports.createRequestLog = exports.setHeaders = void 0;
const perf_hooks_1 = require("perf_hooks");
function setHeaders(res, context) {
    context.res = context.res || {};
    context.res.headers = Object.assign(res.getHeaders() || {}, context.res.headers);
}
exports.setHeaders = setHeaders;
function createRequestLog(req, res, context) {
    var _a;
    const reqMethod = req.method.toUpperCase();
    const reqSegments = ((_a = context.req) === null || _a === void 0 ? void 0 : _a.params.segments) || '';
    const reqQuery = Object.keys(req.query)
        .map((key) => `${key}=${req.query[key]}`)
        .join('&');
    const reqUri = '/' + reqSegments + (reqQuery ? '?' + reqQuery : '');
    const resStatusCode = res.statusCode;
    const logs = [reqMethod, reqUri, resStatusCode];
    const { startAt } = context.bindingData.sys;
    if (startAt) {
        const elapsedTime = Math.round((perf_hooks_1.performance.now() - startAt) * 1000) / 1000;
        logs.push(`${elapsedTime}msec`);
    }
    context.log.info(logs.join(' '));
}
exports.createRequestLog = createRequestLog;
function setStartAt(context) {
    context.bindingData.sys['startAt'] = perf_hooks_1.performance.now();
}
exports.setStartAt = setStartAt;
