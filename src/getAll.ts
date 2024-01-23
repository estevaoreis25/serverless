import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./db/database";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const reviewers = await prismaDb.review.findMany({
    include: {
      company: true,
      reviewer: true,
    },
  });

  prismaDb.$disconnect();

  return {
    statusCode: 200,
    body: JSON.stringify(reviewers),
  };
};
