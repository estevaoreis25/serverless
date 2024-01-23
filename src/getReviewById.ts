import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./db/database";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const reviewId = event.pathParameters?.reviewId;

  if (!reviewId)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing reviewId" }),
    };

  const review = await prismaDb.review.findUnique({
    where: {
      id: Number(reviewId),
    },
    include: {
      company: true,
      reviewer: true,
    },
  });

  prismaDb.$disconnect();

  if (!review)
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Review not found" }),
    };

  return {
    statusCode: 200,
    body: JSON.stringify(review),
  };
};
