import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./database";
import { ApifyClient } from "apify-client";
import { minimalScrapeSchema, scrapeSchema } from "./utils/schemas";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const client = new ApifyClient({
    token: process.env.APIFY_ACCESS_TOKEN,
  });

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
          stars: "asc",
        },
      },
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Reviews scraped successfully" }),
  };
};
