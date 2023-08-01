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

export default flightsRouter;