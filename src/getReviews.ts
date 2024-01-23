import { APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./db/database";
import { scrapeSchema } from "./utils/schemas";
import { z } from "zod";
import { apifyFunctions } from "./providers/api";
import { companyPrismaQuery } from "./db/company";
import { reviewPrismaQuery } from "./db/review";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    let companiesOptionsSearch: Array<{
      url: string;
      searchReviewCount: number;
    }> = [];

    const { data: companiesInformation, error } =
      await apifyFunctions.getCountReviewsBody();

    if (!companiesInformation) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Error to scrape companies information`,
          error: `Error: ${error?.errors}`,
        }),
      };
    }
    for await (const item of companiesInformation) {
      const company = await companyPrismaQuery.findCompanyByPlaceId(
        item.placeId
      );
      if (!company) {
        await companyPrismaQuery.createCompany({
          placeId: item.placeId,
          name: item.title,
          address: item.address,
          googleMapsUrl: item.url,
          phone: item.phone,
          postalCode: item.postalCode,
        });
        companiesOptionsSearch.push({
          url: item.url,
          searchReviewCount: item.reviewsCount,
        });
      } else if (company.reviews.length !== item.reviewsCount) {
        console.log("company.reviews.length", company.reviews.length);
        console.log("item.reviewsCount", item.reviewsCount);
        const searchReviewCount = item.reviewsCount - company.reviews.length;

        companiesOptionsSearch.push({
          url: item.url,
          searchReviewCount,
        });
      }
    }

    console.log("companiesUrl", companiesOptionsSearch);
    if (companiesOptionsSearch.length === 0)
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No new reviews" }),
      };

    let companiesReviews: z.infer<typeof scrapeSchema> = [];
    for await (const search of companiesOptionsSearch) {
      const { data: review, error } = await apifyFunctions.getReviews({
        searchReviewCount: search.searchReviewCount,
        companyUrl: search.url,
      });

      if (!review) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Error to parse reviews",
            error: `Error: ${error?.errors}`,
          }),
        };
      }

      companiesReviews.push(review[0]);
    }

    for await (const companyReview of companiesReviews) {
      await companyPrismaQuery.updateCompany({
        placeId: companyReview.placeId,
        fiveStars: companyReview.reviewsDistribution.fiveStar,
        fourStars: companyReview.reviewsDistribution.fourStar,
        threeStars: companyReview.reviewsDistribution.threeStar,
        twoStars: companyReview.reviewsDistribution.twoStar,
        oneStars: companyReview.reviewsDistribution.oneStar,
        totalScore: companyReview.totalScore,
      });

      console.log("Quantidade de reviews", companyReview.reviews.length);

      const orderedReviews = companyReview.reviews.sort(
        (a, b) => Date.parse(a.publishedAtDate) - Date.parse(b.publishedAtDate)
      );

      for await (const review of orderedReviews) {
        console.log("review", review.text);
        let reviewExists = await reviewPrismaQuery.findReview({
          placeId: companyReview.placeId,
          text: review.text,
          textTranslated: review.textTranslated,
          stars: review.stars,
          likesCount: review.likesCount,
          reviewUrl: review.reviewUrl,
          publishedAtDate: review.publishedAtDate,
          reviewId: review.reviewId,
        });

        if (reviewExists) {
          console.count("A avaliacao existe");
          await prismaDb.review.update({
            where: {
              id: reviewExists.id,
            },
            data: {
              content: review.text,
              stars: review.stars,
              likesCount: review.likesCount,
              reviewer: review.reviewerId
                ? {
                    connectOrCreate: {
                      where: {
                        externalReviewerId: review.reviewerId,
                      },
                      create: {
                        externalReviewerId: review.reviewerId,
                        name: review.name,
                      },
                    },
                  }
                : { create: { name: review.name } },
            },
          });
        } else {
          console.count("A avaliacao nao existe");
          await prismaDb.review.create({
            data: {
              externalReviewId: review.reviewId,
              content: review.text,
              stars: review.stars,
              publishedAt: review.publishedAtDate,
              likesCount: review.likesCount,
              reviewUrl: review.reviewUrl,
              responseOwnerContent: review.responseFromOwnerText,
              reviewer: review.reviewerId
                ? {
                    connectOrCreate: {
                      where: {
                        externalReviewerId: review.reviewerId,
                      },
                      create: {
                        externalReviewerId: review.reviewerId,
                        name: review.name,
                      },
                    },
                  }
                : { create: { name: review.name } },
              company: {
                connect: {
                  placeId: companyReview.placeId,
                },
              },
            },
          });
        }
      }
    }

    await prismaDb.$disconnect();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reviews scraped successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error to scrape reviews", error }),
    };
  }
};
