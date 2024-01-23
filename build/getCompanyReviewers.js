"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const database_1 = require("./database");
const handler = async (event) => {
    const companyId = event.pathParameters?.companyId;
    if (!companyId)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing companyId" }),
        };
    const reviewers = await database_1.prismaDb.reviewer.findMany({
        where: {
            reviews: {
                some: {
                    companyId: Number(companyId),
                },
            },
        },
        include: {
            reviews: {
                include: {
                    company: true,
                },
            },
        },
    });
    database_1.prismaDb.$disconnect();
    return {
        statusCode: 200,
        body: JSON.stringify(reviewers),
    };
};
exports.handler = handler;
//# sourceMappingURL=getCompanyReviewers.js.map