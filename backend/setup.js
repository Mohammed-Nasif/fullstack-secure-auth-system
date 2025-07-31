"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidationPipe = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
};
const createValidationPipe = () => new common_1.ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
});
exports.createValidationPipe = createValidationPipe;
