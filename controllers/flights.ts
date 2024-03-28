import { Router, Request, Response, NextFunction } from 'express';
import {
    getTravelersArray,
    getOriginDestinationsArray,
    callAmadeusService,
} from './utils';
import { GetFlightsQuery, AmadeusResponse } from './types';
const Amadeus = require('amadeus');

var amadeus = new Amadeus();

const flightsRouter: Router = Router();

flightsRouter.get(
    '/getflights',
    async (request: Request, response: Response, next: NextFunction) => {
        let {
            originLocationCodes,
            destinationLocationCodes,
            departureDates,
            adults,
            children,
            seniors,
            young,
            heldInfants,
            associatedAdultIds,
            seatedInfants,
            students,
            currencyCode = 'USD',
        }: GetFlightsQuery = request.query as unknown as GetFlightsQuery;

        // Ensure originLocationCodes and destinationLocationCodes are arrays
        if (typeof originLocationCodes === 'string') {
            originLocationCodes = [originLocationCodes];
        }
        if (typeof destinationLocationCodes === 'string') {
            destinationLocationCodes = [destinationLocationCodes];
        }

        const originDestinations = getOriginDestinationsArray(
            originLocationCodes,
            destinationLocationCodes,
            departureDates,
        );

        const travelers = getTravelersArray(
            adults,
            children,
            seniors,
            young,
            heldInfants,
            seatedInfants,
            students,
            associatedAdultIds,
        );

        const searchCriteria = {
            addOneWayOffers: originDestinations.length === 2 ? true : false,
            maxFlightOffers: 50,
            allowAlternativeFareOptions: true,
            additionalInformation: {
                chargeableCheckedBags: true,
                brandedFares: true,
            },
        };
        const sources = ['GDS'];

        const getFlightOffersBody = {
            originDestinations,
            currencyCode,
            travelers,
            searchCriteria,
            sources,
        };

        callAmadeusService(
            amadeus.shopping.flightOffersSearch,
            'post',
            JSON.stringify(getFlightOffersBody),
            response,
            next,
        );
    },
);

flightsRouter.post(
    '/confirmflightprice',
    async (request: Request, response: Response, next: NextFunction) => {
        const { body } = request.body;
        const confirmFlightBody = {
            data: {
                type: 'flight-offers-pricing',
                flightOffers: [body],
            },
        };
        callAmadeusService(
            amadeus.shopping.flightOffers.pricing,
            'post',
            confirmFlightBody,
            response,
            next,
        );
    },
);

flightsRouter.post(
    '/bookflight',
    async (request: Request, response: Response, next: NextFunction) => {
        const { flightOffer, travellers } = request.body;

        const flightOrderBody = {
            data: {
                type: 'flight-order',
                flightOffers: [flightOffer],
                travellers: travellers,
            },
        };

        callAmadeusService(
            amadeus.booking.flightOrders,
            'post',
            flightOrderBody,
            response,
            next,
        );
    },
);

flightsRouter.post(
    '/flightupsell',
    async (request: Request, response: Response, next: NextFunction) => {
        const { flightOffer, binNumber, flightOfferId } = request.body;

        const flightOffersUpsellingBody = {
            data: {
                type: 'flight-offers-upselling',
                flightOffers: [flightOffer],
                payments: [
                    {
                        brand: 'VISA_IXARIS',
                        binNumber: binNumber,
                        flightOfferIds: [flightOfferId],
                    },
                ],
            },
        };

        callAmadeusService(
            amadeus.shopping.flightOffers.upselling,
            'post',
            flightOffersUpsellingBody,
            response,
            next,
        );
    },
);

flightsRouter.post(
    '/flightofferseatmap',
    async (request: Request, response: Response, next: NextFunction) => {
        const { flightOffer } = request.body;

        console.log(flightOffer);
        callAmadeusService(
            amadeus.shopping.seatmaps,
            'post',
            JSON.stringify({
                data: [flightOffer],
            }),
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/closestairport',
    async (request: Request, response: Response, next: NextFunction) => {
        const { lat, lng } = request.query;

        const getNearestAirportBody = {
            latitude: lat, //number
            longitude: lng, //number
        };

        callAmadeusService(
            amadeus.referenceData.locations.airports,
            'get',
            getNearestAirportBody,
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/cheapestdates',
    async (request: Request, response: Response, next: NextFunction) => {
        const { origin, destination } = request.body;

        const getCheapestDatesBody = {
            origin: origin, //string
            destination: destination, //string
        };

        callAmadeusService(
            amadeus.shopping.flightDates,
            'get',
            getCheapestDatesBody,
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/priceanalysis',
    async (request: Request, response: Response, next: NextFunction) => {
        const { originIataCode, destinationIataCode, departureDate } =
            request.body;

        const getPriceAnalysisBody = {
            originIataCode: originIataCode, //string
            destinationIataCode: destinationIataCode, //string
            departureDate: departureDate, //string e.g. '2022-01-13'
        };
        callAmadeusService(
            amadeus.shopping.flightDates,
            'get',
            getPriceAnalysisBody,
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/checkinlink',
    async (request: Request, response: Response, next: NextFunction) => {
        const { airlineCode }: { airlineCode: string } = request.body;

        callAmadeusService(
            amadeus.referenceData.urls.checkinLinks,
            'get',
            { airlineCode },
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/airportinfo',
    async (request: Request, response: Response, next: NextFunction) => {
        const { iataCode }: { iataCode?: string } = request.query;

        // What's the city name for the IATA code PAR?
        amadeus.referenceData
            .location(`A${iataCode}`)
            .get()
            .then((res: AmadeusResponse) => {
                return response.status(200).json(res.body);
            })
            .catch((e: any) => {
                return next(e);
            });
    },
);

flightsRouter.get(
    '/searchcity',
    async (request: Request, response: Response, next: NextFunction) => {
        const { searchString }: { searchString: string } = request.body;

        callAmadeusService(
            amadeus.referenceData.locations.cities,
            'get',
            { keyword: searchString },
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/searchairport',
    async (request: Request, response: Response, next: NextFunction) => {
        const { searchString }: { searchString?: string } = request.body;

        const getAirportBody = {
            keyword: searchString, // string e.g. 'Paris'
            subType: Amadeus.location.any,
        };

        callAmadeusService(
            amadeus.referenceData.locations,
            'get',
            getAirportBody,
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/fetchbooking',
    async (request: Request, response: Response, next: NextFunction) => {
        const { flightOrderId }: { flightOrderId: string } = request.body;

        // retrieve a booked flight
        amadeus.booking
            .flightOrder(flightOrderId)
            .get()
            .then((res: AmadeusResponse) => {
                return response.status(200).json(res.body);
            })
            .catch((e: any) => {
                return next(e);
            });
    },
);

flightsRouter.delete(
    '/deletebooking',
    async (request: Request, response: Response, next: NextFunction) => {
        const { flightOrderId }: { flightOrderId: string } = request.body;

        // delete a booked flight
        amadeus.booking
            .flightOrder(flightOrderId)
            .delete()
            .then((res: AmadeusResponse) => {
                return response.status(200).json(res.body);
            })
            .catch((e: any) => {
                return next(e);
            });
    },
);

flightsRouter.get(
    '/airlinenamelookup',
    async (request: Request, response: Response, next: NextFunction) => {
        const { airlineCode }: { airlineCode: string } = request.body;

        callAmadeusService(
            amadeus.referenceData.airlines,
            'get',
            { airlineCodes: airlineCode },
            response,
            next,
        );
    },
);

flightsRouter.get(
    '/recommendedlocation',
    async (request: Request, response: Response, next: NextFunction) => {
        const {
            cityCodes,
            travelerCountryCode,
        }: { cityCodes: string; travelerCountryCode: string } = request.body;

        const getRecommendedLocationBody = {
            cityCodes: cityCodes, // string e.g. 'PAR'
            travelerCountryCode: travelerCountryCode, // string e.g. 'FR'
        };
        callAmadeusService(
            amadeus.referenceData.recommendedLocations,
            'get',
            getRecommendedLocationBody,
            response,
            next,
        );
    },
);

export default flightsRouter;
