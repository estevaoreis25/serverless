import { ApifyClient } from "apify-client";
import { GoogleMapsCompanies } from "./constants";
import { minimalScrapeSchema, scrapeSchema } from "../utils/schemas";
import { ZodError, z } from "zod";

const client = new ApifyClient({
  token: process.env.APIFY_ACCESS_TOKEN,
});

type GetCountReviewsResponse = {
  data?: z.infer<typeof minimalScrapeSchema>;
  error?: ZodError | null;
};

type GetReviewsResponse = {
  data?: z.infer<typeof scrapeSchema>;
  error?: ZodError | null;
};

type getReviewsBody = {
  searchReviewCount: number;
  companyUrl: string;
};

async function getCountReviewsBody(): Promise<GetCountReviewsResponse> {
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
      ...GoogleMapsCompanies.map((company) => ({
        url: company.url,
      })),
    ],
  };

  const run = await client.actor("nwua9Gu5YrADL7ZDj").call(getCountReviewsBody);

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  const validItems = minimalScrapeSchema.safeParse(items);

  if (!validItems.success) {
    return {
      error: validItems.error,
    };
  }

  return { data: validItems.data };
}

async function getReviews(props: getReviewsBody): Promise<GetReviewsResponse> {
  const { searchReviewCount, companyUrl } = props;
  const getReviewsBody = {
    deeperCityScrape: false,
    includeWebResults: true,
    language: "pt-BR",
    maxCrawledPlacesPerSearch: 1,
    maxImages: 0,
    reviewsSort: "newest",
    maxReviews: searchReviewCount,
    onlyDataFromSearchPage: false,
    scrapeDirectories: false,
    scrapeResponseFromOwnerText: true,
    scrapeReviewId: true,
    scrapeReviewUrl: true,
    scrapeReviewerId: true,
    scrapeReviewerName: true,
    scrapeReviewerUrl: true,
    skipClosedPlaces: false,
    startUrls: [
      {
        url: companyUrl,
      },
    ],
  };

  const reviewsRun = await client
    .actor("nwua9Gu5YrADL7ZDj")
    .call(getReviewsBody);

  const reviews = await client.dataset(reviewsRun.defaultDatasetId).listItems();

  const validReviews = scrapeSchema.safeParse(reviews.items);

  if (!validReviews.success) {
    return {
      error: validReviews.error,
    };
  }

  return { data: validReviews.data };
}

export const apifyFunctions = Object.freeze({
  getCountReviewsBody,
  getReviews,
});
