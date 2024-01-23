import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./db/database";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const companyId = event.pathParameters?.companyId;

  if (!companyId)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing companyId" }),
    };

  const reviewers = await prismaDb.reviewer.findMany({
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

  prismaDb.$disconnect();

  return {
    statusCode: 200,
    body: JSON.stringify(reviewers),
  };
};
