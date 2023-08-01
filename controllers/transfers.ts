import {Router, Request, Response, NextFunction} from 'express';
const Amadeus = require('amadeus');

var amadeus = new Amadeus();

const transfersRouter: Router = Router();

type AmadeusResponse = {
    body: {
        data: {}
    },
    data: {},
    status: number,
}

transfersRouter.post('/gettransfers', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    amadeus.shopping.transferOffers.post(JSON.stringify(body)
    ).then((res: AmadeusResponse) => {
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

transfersRouter.post('/booktransfer', async (request: Request, response: Response, next: NextFunction) => {
    const {offerBody, offerId} = request.body;
    // Transfer Book API: Book a transfer based on the offer id
    amadeus.ordering.transferOrders.post(JSON.stringify(offerBody), offerId
    ).then((res: AmadeusResponse) => {
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

transfersRouter.post('/canceltransfer', async (request: Request, response: Response, next: NextFunction) => {
    const {orderId, confirmationNumber} = request.body;
    // Transfer Management API: Cancel a transfer based on the order id & confirmation number
    amadeus.ordering.transferOrder(orderId).transfers.cancellation.post(JSON.stringify({}), confirmationNumber
    ).then((res: AmadeusResponse) => {
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
})

export default transfersRouter;