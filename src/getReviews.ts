import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prismaDb } from "./database";
import { ApifyClient } from "apify-client";
import { minimalScrapeSchema, scrapeSchema } from "./utils/schemas";
import { z } from "zod";
import { Review } from "@prisma/client";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const client = new ApifyClient({
    token: process.env.APIFY_ACCESS_TOKEN,
  });

  try {
    const companies = [
      {
        url: "https://maps.app.goo.gl/eW4pSUbBSoqShZMM9",
        title: "Nema - Visconde de Pirajá | Padaria de Fermentação Natural",
      },
      {
        url: "https://maps.app.goo.gl/ygVaxUJHR6zZcWqS9",
        title: "Nema - Botafogo | Padaria de Fermentação Natural",
      },
      {
        url: "https://maps.app.goo.gl/KUbFispshk2vE55E7",
        title: "Nema Padaria - Leblon | Padaria de Fermentação Natural",
      },
    ];

    const getCountReviewsBody = {
      deeperCityScrape: false,
      includeWebResults: false,
      language: "pt-BR",
      maxCrawledPlacesPerSearch: 1,
      maxImages: 0,
      maxReviews: 0,
      onlyDataFromSearchPage: true,
      scrapeDirectories: false,
      scrapeResponseFromOwnerText: false,
      scrapeReviewId: false,
      scrapeReviewUrl: false,
      scrapeReviewerId: false,
      scrapeReviewerName: false,
      scrapeReviewerUrl: false,
      skipClosedPlaces: false,
      startUrls: [
        ...companies.map((company) => ({
          url: company.url,
        })),
      ],
    };

    const run = await client
      .actor("nwua9Gu5YrADL7ZDj")
      .call(getCountReviewsBody);

    let companiesOptionsSearch: Array<{
      url: string;
      searchReviewCount: number;
    }> = [];
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    const validItems = minimalScrapeSchema.safeParse(items);

    if (!validItems.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error to parse items",
          error: validItems.error,
        }),
      };
    }

    for await (const item of validItems.data) {
      const company = await prismaDb.company.findUnique({
        where: {
          placeId: item.placeId,
        },
        include: {
          reviews: {
            orderBy: {
              publishedAt: "desc",
            },
          },
        },
      });
      if (!company) {
        await prismaDb.company.create({
          data: {
            placeId: item.placeId,
            name: item.title,
            address: item.address,
            googleMapsUrl: item.url,
            phone: item.phone,
            postalCode: item.postalCode,
          },
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
      const getReviewsBody = {
        deeperCityScrape: false,
        includeWebResults: false,
        maxCrawledPlacesPerSearch: 1,
        maxImages: 0,
        reviewsSort: "newest",
        maxReviews: search.searchReviewCount,
        onlyDataFromSearchPage: false,
        scrapeDirectories: false,
        scrapeResponseFromOwnerText: false,
        scrapeReviewId: false,
        scrapeReviewUrl: false,
        scrapeReviewerId: false,
        scrapeReviewerName: true,
        scrapeReviewerUrl: false,
        skipClosedPlaces: false,
        startUrls: [
          {
            url: search.url,
          },
        ],
      };

      const reviewsRun = await client
        .actor("nwua9Gu5YrADL7ZDj")
        .call(getReviewsBody);

      const reviews = await client
        .dataset(reviewsRun.defaultDatasetId)
        .listItems();

      const validReviews = scrapeSchema.safeParse(reviews.items);

      if (!validReviews.success) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Error to parse reviews",
            error: validReviews.error,
          }),
        };
      }

      companiesReviews.push(validReviews.data[0]);
    }

    for await (const companyReview of companiesReviews) {
      await prismaDb.company.update({
        where: {
          placeId: companyReview.placeId,
        },
        data: {
          fiveStars: companyReview.reviewsDistribution.fiveStar,
          fourStars: companyReview.reviewsDistribution.fourStar,
          threeStars: companyReview.reviewsDistribution.threeStar,
          twoStars: companyReview.reviewsDistribution.twoStar,
          oneStars: companyReview.reviewsDistribution.oneStar,
          totalScore: companyReview.totalScore,
        },
      });

      console.log("Quantidade de reviews", companyReview.reviews.length);

      const orderedReviews = companyReview.reviews.sort(
        (a, b) => Date.parse(a.publishedAtDate) - Date.parse(b.publishedAtDate)
      );

      for await (const review of orderedReviews) {
        console.log("review", review.text);
        let reviewExists: Review | null = null;
        if (!review.reviewId) {
          reviewExists = await prismaDb.review.findFirst({
            where: {
              content: review.text,
              stars: review.stars,
              likesCount: review.likesCount,
              reviewUrl: review.reviewUrl,
              publishedAt: review.publishedAtDate,
              company: {
                placeId: companyReview.placeId,
              },
            },
          });
        } else {
          reviewExists = await prismaDb.review.findUnique({
            where: {
              externalReviewId: review.reviewId,
            },
          });
        }
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error to scrape reviews", error }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Reviews scraped successfully" }),
  };
};
