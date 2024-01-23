"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const handler = async (event) => {
    const companyId = event.pathParameters?.companyId;
    console.log("companyId", companyId);
    if (!companyId)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing companyId" }),
        };
    const company = await database_1.prismaDb.company.findUnique({
        where: {
            id: Number(companyId),
        },
        include: {
            reviews: {
                include: {
                    reviewer: true,
                },
                orderBy: {
                    publishedAt: "desc",
                },
            },
        },
    });
    database_1.prismaDb.$disconnect();
    return {
        statusCode: 200,
        body: JSON.stringify(company),
    };
};
exports.default = handler;
//# sourceMappingURL=getCompanyReviews.js.map