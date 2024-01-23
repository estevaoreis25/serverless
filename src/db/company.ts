import { prismaDb } from "./database";

async function findCompanyByPlaceId(placeId: string) {
  return await prismaDb.company.findUnique({
    where: {
      placeId,
    },
    include: {
      reviews: {
        orderBy: {
          publishedAt: "desc",
        },
      },
    },
  });
}

async function createCompany(props: {
  placeId: string;
  name: string;
  address?: string;
  googleMapsUrl?: string;
  phone?: string;
  postalCode?: string;
}) {
  return await prismaDb.company.create({
    data: props,
  });
}

async function updateCompany(props: {
  placeId: string;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStars: number;
  totalScore: number;
}) {
  const { placeId, ...rest } = props;
  return await prismaDb.company.update({
    where: {
      placeId: props.placeId,
    },
    data: rest,
  });
}

export const companyPrismaQuery = Object.freeze({
  findCompanyByPlaceId,
  createCompany,
  updateCompany,
});
