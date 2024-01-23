import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./database";

const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const companyId = event.pathParameters?.companyId;
  console.log("companyId", companyId);

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

  prismaDb.$disconnect();

  return {
    statusCode: 200,
    body: JSON.stringify(company),
  };
};

export default handler;
