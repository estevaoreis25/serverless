import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./db/database";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const reviewerId = event.pathParameters?.reviewerId;

    if (!reviewerId)
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing reviewerId" }),
      };

    const reviewer = await prismaDb.reviewer.findUnique({
      where: {
        id: Number(reviewerId),
      },
      include: {
        reviews: {
          include: {
            company: true,
          },
          orderBy: {
            publishedAt: "desc",
          },
        },
      },
    });

    await prismaDb.$disconnect();

    if (!reviewer)
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Reviewer not found" }),
      };

    return {
      statusCode: 200,
      body: JSON.stringify(reviewer),
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
