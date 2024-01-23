import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./db/database";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const companyId = event.pathParameters?.companyId;

    if (!companyId)
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing companyId" }),
      };

    const company = await prismaDb.company.findUnique({
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

    await prismaDb.$disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify(company),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error to get company reviews",
        error: JSON.stringify(error, null, 2),
        env: process.env.DATABASE_URL,
      }),
    };
  }
};
