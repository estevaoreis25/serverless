import { prismaDb } from "./database";

async function findReview(props: {
  placeId: string;
  text?: string | null;
  textTranslated?: string | null;
  stars?: number;
  likesCount?: number;
  reviewUrl?: string | null;
  publishedAtDate?: string;
  reviewId?: string | null;
}) {
  let reviewExists;
  const {
    likesCount,
    placeId,
    publishedAtDate,
    reviewUrl,
    stars,
    text,
    reviewId,
    textTranslated,
  } = props;

  if (!reviewId) {
    reviewExists = await prismaDb.review.findFirst({
      where: {
        content: textTranslated ?? text,
        stars: stars,
        likesCount: likesCount,
        reviewUrl: reviewUrl,
        publishedAt: publishedAtDate,
        company: {
          placeId,
        },
      },
    });
  } else {
    reviewExists = await prismaDb.review.findUnique({
      where: {
        externalReviewId: reviewId,
      },
    });
  }

  return reviewExists;
}

export const reviewPrismaQuery = Object.freeze({ findReview });
