"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaDb = void 0;
const client_1 = require("./generated/client");
const prismaDb = new client_1.PrismaClient();
exports.prismaDb = prismaDb;
//# sourceMappingURL=database.js.map