import {Router, Request, Response, NextFunction} from 'express';
const Amadeus = require('amadeus');

var amadeus = new Amadeus();

const flightsRouter: Router = Router();

type AmadeusResponse = {
    body: {
        data: {}
    },
    data: {},
    status: number,
}

flightsRouter.get('/getflights', async (request: Request, response: Response, next: NextFunction) => {
    const {originLocationCode, destinationLocationCode, departureDate, adults, max} = request.query;
    amadeus.shopping.flightOffersSearch.get({
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults,
        max,
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

flightsRouter.post('/confirmflightprice', async (request: Request, response: Response, next: NextFunction) => {
    const {body} = request.body;
    amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
          'data': {
            'type': 'flight-offers-pricing',
            'flightOffers': [body]
          }
        })
      ).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.post('/bookflight', async (request: Request, response: Response, next: NextFunction) => {
    const {flightOffer, travellers} = request.body;

    amadeus.booking.flightOrders.post(
        JSON.stringify({
          'data': {
            'type': 'flight-order',
            'flightOffers': [flightOffer],
            'travelers': travellers
            }
        })
    ).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.post('/flightupsell', async (request: Request, response: Response, next: NextFunction) => {
    const {flightOffer, binNumber, flightOfferId} = request.body;

    amadeus.shopping.flightOffers.upselling.post(
        JSON.stringify({
        "data": {
            "type": "flight-offers-upselling",
            "flightOffers": [flightOffer],
            "payments": [
                {
                    "brand": "VISA_IXARIS",
                    "binNumber": binNumber,
                    "flightOfferIds": [flightOfferId]
                }
            ]
        }
    })).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.post('/flightseatmap', async (request: Request, response: Response, next: NextFunction) => {
    const {flightOffer} = request.body;

    amadeus.shopping.seatmaps.post(
        JSON.stringify({
            'data': [flightOffer]
        })
    ).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.get('/closestairport', async (request: Request, response: Response, next: NextFunction) => {
    const {lat, long} = request.body;

    amadeus.referenceData.locations.airports.get({
        longitude: long, //number
        latitude: lat, //number
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.get('/cheapestdates', async (request: Request, response: Response, next: NextFunction) => {
    const {origin, destination} = request.body;

    // Find cheapest dates to fly
    amadeus.shopping.flightDates.get({
        origin: origin, //string
        destination: destination //string
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.get('/priceanalysis', async (request: Request, response: Response, next: NextFunction) => {
    const {originIataCode , destinationIataCode, departureDate} = request.body;

    // Am I getting a good deal on this flight?
    amadeus.analytics.itineraryPriceMetrics.get({
        originIataCode: originIataCode, //string
        destinationIataCode: destinationIataCode, //string
        departureDate: departureDate, //string e.g. '2022-01-13'
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.get('/checkinlink', async (request: Request, response: Response, next: NextFunction) => {
    const {airlineCode} = request.body;

    // What is the URL to my online check-in?
    amadeus.referenceData.urls.checkinLinks.get({
        airlineCode: airlineCode // string e.g. 'BA'
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.get('/searchcity', async (request: Request, response: Response, next: NextFunction) => {
    const {searchString} = request.body;

    // finds cities that match a specific word or string of letters.
    amadeus.referenceData.locations.cities.get({
        keyword: searchString // string e.g. 'Paris'
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.get('/fetchbooking', async (request: Request, response: Response, next: NextFunction) => {
    const {flightOrderId} = request.body;

    // retrieve a booked flight
    amadeus.booking.flightOrder(flightOrderId).get().then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.delete('/deletebooking', async (request: Request, response: Response, next: NextFunction) => {
    const {flightOrderId} = request.body;

    // delete a booked flight
    amadeus.booking.flightOrder(flightOrderId).delete().then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

flightsRouter.get('/airlinenamelookup', async (request: Request, response: Response, next: NextFunction) => {
    const {airlineCode} = request.body;

    // What's the airline name for the IATA code BA?
    amadeus.referenceData.airlines.get({
        airlineCodes: airlineCode // string e.g. 'BA'
    }).catch((e: any) => {
        return next(e);
    });
})

export default flightsRouter;