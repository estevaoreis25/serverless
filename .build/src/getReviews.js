"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var database_1 = require("./database");
var apify_client_1 = require("apify-client");
var schemas_1 = require("./utils/schemas");
var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var client, companies, getCountReviewsBody, run, companiesOptionsSearch, items, validItems, _a, _b, _c, item, company, searchReviewCount, e_1_1, companiesReviews, _d, companiesOptionsSearch_1, companiesOptionsSearch_1_1, search, getReviewsBody, reviewsRun, reviews, validReviews, e_2_1, _e, companiesReviews_1, companiesReviews_1_1, companyReview, orderedReviews, _f, orderedReviews_1, orderedReviews_1_1, review, reviewExists, e_3_1, e_4_1, error_1;
    var _g, e_1, _h, _j, _k, e_2, _l, _m, _o, e_4, _p, _q, _r, e_3, _s, _t;
    return __generator(this, function (_u) {
        switch (_u.label) {
            case 0:
                client = new apify_client_1.ApifyClient({
                    token: process.env.APIFY_ACCESS_TOKEN,
                });
                _u.label = 1;
            case 1:
                _u.trys.push([1, 63, , 64]);
                companies = [
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
                getCountReviewsBody = {
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
                    startUrls: __spreadArray([], companies.map(function (company) { return ({
                        url: company.url,
                    }); }), true),
                };
                return [4 /*yield*/, client
                        .actor("nwua9Gu5YrADL7ZDj")
                        .call(getCountReviewsBody)];
            case 2:
                run = _u.sent();
                companiesOptionsSearch = [];
                return [4 /*yield*/, client.dataset(run.defaultDatasetId).listItems()];
            case 3:
                items = (_u.sent()).items;
                validItems = schemas_1.minimalScrapeSchema.safeParse(items);
                if (!validItems.success) {
                    return [2 /*return*/, {
                            statusCode: 500,
                            body: JSON.stringify({
                                message: "Error to parse items",
                                error: validItems.error,
                            }),
                        }];
                }
                _u.label = 4;
            case 4:
                _u.trys.push([4, 12, 13, 18]);
                _a = true, _b = __asyncValues(validItems.data);
                _u.label = 5;
            case 5: return [4 /*yield*/, _b.next()];
            case 6:
                if (!(_c = _u.sent(), _g = _c.done, !_g)) return [3 /*break*/, 11];
                _j = _c.value;
                _a = false;
                item = _j;
                return [4 /*yield*/, database_1.prismaDb.company.findUnique({
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
                    })];
            case 7:
                company = _u.sent();
                if (!!company) return [3 /*break*/, 9];
                return [4 /*yield*/, database_1.prismaDb.company.create({
                        data: {
                            placeId: item.placeId,
                            name: item.title,
                            address: item.address,
                            googleMapsUrl: item.url,
                            phone: item.phone,
                            postalCode: item.postalCode,
                        },
                    })];
            case 8:
                _u.sent();
                companiesOptionsSearch.push({
                    url: item.url,
                    searchReviewCount: item.reviewsCount,
                });
                return [3 /*break*/, 10];
            case 9:
                if (company.reviews.length !== item.reviewsCount) {
                    console.log("company.reviews.length", company.reviews.length);
                    console.log("item.reviewsCount", item.reviewsCount);
                    searchReviewCount = item.reviewsCount - company.reviews.length;
                    companiesOptionsSearch.push({
                        url: item.url,
                        searchReviewCount: searchReviewCount,
                    });
                }
                _u.label = 10;
            case 10:
                _a = true;
                return [3 /*break*/, 5];
            case 11: return [3 /*break*/, 18];
            case 12:
                e_1_1 = _u.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 18];
            case 13:
                _u.trys.push([13, , 16, 17]);
                if (!(!_a && !_g && (_h = _b.return))) return [3 /*break*/, 15];
                return [4 /*yield*/, _h.call(_b)];
            case 14:
                _u.sent();
                _u.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 17: return [7 /*endfinally*/];
            case 18:
                console.log("companiesUrl", companiesOptionsSearch);
                if (companiesOptionsSearch.length === 0)
                    return [2 /*return*/, {
                            statusCode: 200,
                            body: JSON.stringify({ message: "No new reviews" }),
                        }];
                companiesReviews = [];
                _u.label = 19;
            case 19:
                _u.trys.push([19, 26, 27, 32]);
                _d = true, companiesOptionsSearch_1 = __asyncValues(companiesOptionsSearch);
                _u.label = 20;
            case 20: return [4 /*yield*/, companiesOptionsSearch_1.next()];
            case 21:
                if (!(companiesOptionsSearch_1_1 = _u.sent(), _k = companiesOptionsSearch_1_1.done, !_k)) return [3 /*break*/, 25];
                _m = companiesOptionsSearch_1_1.value;
                _d = false;
                search = _m;
                getReviewsBody = {
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
                return [4 /*yield*/, client
                        .actor("nwua9Gu5YrADL7ZDj")
                        .call(getReviewsBody)];
            case 22:
                reviewsRun = _u.sent();
                return [4 /*yield*/, client
                        .dataset(reviewsRun.defaultDatasetId)
                        .listItems()];
            case 23:
                reviews = _u.sent();
                validReviews = schemas_1.scrapeSchema.safeParse(reviews.items);
                if (!validReviews.success) {
                    return [2 /*return*/, {
                            statusCode: 500,
                            body: JSON.stringify({
                                message: "Error to parse reviews",
                                error: validReviews.error,
                            }),
                        }];
                }
                companiesReviews.push(validReviews.data[0]);
                _u.label = 24;
            case 24:
                _d = true;
                return [3 /*break*/, 20];
            case 25: return [3 /*break*/, 32];
            case 26:
                e_2_1 = _u.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 32];
            case 27:
                _u.trys.push([27, , 30, 31]);
                if (!(!_d && !_k && (_l = companiesOptionsSearch_1.return))) return [3 /*break*/, 29];
                return [4 /*yield*/, _l.call(companiesOptionsSearch_1)];
            case 28:
                _u.sent();
                _u.label = 29;
            case 29: return [3 /*break*/, 31];
            case 30:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 31: return [7 /*endfinally*/];
            case 32:
                _u.trys.push([32, 56, 57, 62]);
                _e = true, companiesReviews_1 = __asyncValues(companiesReviews);
                _u.label = 33;
            case 33: return [4 /*yield*/, companiesReviews_1.next()];
            case 34:
                if (!(companiesReviews_1_1 = _u.sent(), _o = companiesReviews_1_1.done, !_o)) return [3 /*break*/, 55];
                _q = companiesReviews_1_1.value;
                _e = false;
                companyReview = _q;
                return [4 /*yield*/, database_1.prismaDb.company.update({
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
                    })];
            case 35:
                _u.sent();
                console.log("Quantidade de reviews", companyReview.reviews.length);
                orderedReviews = companyReview.reviews.sort(function (a, b) { return Date.parse(a.publishedAtDate) - Date.parse(b.publishedAtDate); });
                _u.label = 36;
            case 36:
                _u.trys.push([36, 48, 49, 54]);
                _f = true, orderedReviews_1 = (e_3 = void 0, __asyncValues(orderedReviews));
                _u.label = 37;
            case 37: return [4 /*yield*/, orderedReviews_1.next()];
            case 38:
                if (!(orderedReviews_1_1 = _u.sent(), _r = orderedReviews_1_1.done, !_r)) return [3 /*break*/, 47];
                _t = orderedReviews_1_1.value;
                _f = false;
                review = _t;
                console.log("review", review.text);
                reviewExists = null;
                if (!!review.reviewId) return [3 /*break*/, 40];
                return [4 /*yield*/, database_1.prismaDb.review.findFirst({
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
                    })];
            case 39:
                reviewExists = _u.sent();
                return [3 /*break*/, 42];
            case 40: return [4 /*yield*/, database_1.prismaDb.review.findUnique({
                    where: {
                        externalReviewId: review.reviewId,
                    },
                })];
            case 41:
                reviewExists = _u.sent();
                _u.label = 42;
            case 42:
                if (!reviewExists) return [3 /*break*/, 44];
                console.count("A avaliacao existe");
                return [4 /*yield*/, database_1.prismaDb.review.update({
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
                    })];
            case 43:
                _u.sent();
                return [3 /*break*/, 46];
            case 44:
                console.count("A avaliacao nao existe");
                return [4 /*yield*/, database_1.prismaDb.review.create({
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
                    })];
            case 45:
                _u.sent();
                _u.label = 46;
            case 46:
                _f = true;
                return [3 /*break*/, 37];
            case 47: return [3 /*break*/, 54];
            case 48:
                e_3_1 = _u.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 54];
            case 49:
                _u.trys.push([49, , 52, 53]);
                if (!(!_f && !_r && (_s = orderedReviews_1.return))) return [3 /*break*/, 51];
                return [4 /*yield*/, _s.call(orderedReviews_1)];
            case 50:
                _u.sent();
                _u.label = 51;
            case 51: return [3 /*break*/, 53];
            case 52:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
            case 53: return [7 /*endfinally*/];
            case 54:
                _e = true;
                return [3 /*break*/, 33];
            case 55: return [3 /*break*/, 62];
            case 56:
                e_4_1 = _u.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 62];
            case 57:
                _u.trys.push([57, , 60, 61]);
                if (!(!_e && !_o && (_p = companiesReviews_1.return))) return [3 /*break*/, 59];
                return [4 /*yield*/, _p.call(companiesReviews_1)];
            case 58:
                _u.sent();
                _u.label = 59;
            case 59: return [3 /*break*/, 61];
            case 60:
                if (e_4) throw e_4.error;
                return [7 /*endfinally*/];
            case 61: return [7 /*endfinally*/];
            case 62: return [3 /*break*/, 64];
            case 63:
                error_1 = _u.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ message: "Error to scrape reviews", error: error_1 }),
                    }];
            case 64: return [2 /*return*/, {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Reviews scraped successfully" }),
                }];
        }
    });
}); };
exports.handler = handler;
//# sourceMappingURL=getReviews.js.map