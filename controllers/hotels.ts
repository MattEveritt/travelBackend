import {Router, Request, Response, NextFunction} from 'express';
const Amadeus = require('amadeus');

var amadeus = new Amadeus();

const hotelsRouter: Router = Router();

type AmadeusResponse = {
    body: {
        data: {}
    },
    data: {},
    status: number,
}

hotelsRouter.get('/gethotels', async (request: Request, response: Response, next: NextFunction) => {
    const {searchType = 'city', cityCode = undefined, lat = undefined, long = undefined} = request.query;

    if (searchType === 'city') {
        amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode  
        }).then((res: AmadeusResponse) => {
            console.log(res.body)
            return response.status(200).json(res.body)
        }).catch((e: any) => {
            return next(e);
        });
    } else if (searchType === 'geocode' && lat && long) {
        //Get List of hotels by Geocode
        amadeus.referenceData.locations.hotels.byGeocode.get({
            latitude: lat,
            longitude: long
        }).then((res: AmadeusResponse) => {
            console.log(res.body)
            return response.status(200).json(res.body)
        }).catch((e: any) => {
            return next(e);
        });
    } else {
        return next(new Error('Incorrect search type or lat and long values'))
    }
});

hotelsRouter.get('/gethoteloffers', async (request: Request, response: Response, next: NextFunction) => {
    const {hotelIds, numberOfAdults, numberOfChildren, checkInDate, checkOutDate} = request.body;
    // Get list of available offers in specific hotels by hotel ids
    amadeus.shopping.hotelOffersSearch.get({
        hotelIds: hotelIds,
        adults: numberOfAdults,
        children: numberOfChildren,
        'checkInDate': checkInDate,
        'checkOutDate': checkOutDate,
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.post('/bookhotel', async (request: Request, response: Response, next: NextFunction) => {
    const {body} = request;

    // Hotel Booking API
    amadeus.booking.hotelBookings.post(
        JSON.stringify(body)
    ).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

export default hotelsRouter;

// body = {
//     'data': {
//       'offerId': pricingResponse.data[0].offers[0].id,
//       'guests': [{
//         'id': 1,
//         'name': {
//           'title': 'MR',
//           'firstName': 'BOB',
//           'lastName': 'SMITH'
//         },
//         'contact': {
//           'phone': '+33679278416',
//           'email': 'bob.smith@email.com'
//         }
//       }],
//       'payments': [{
//         'id': 1,
//         'method': 'creditCard',
//         'card': {
//           'vendorCode': 'VI',
//           'cardNumber': '4151289722471370',
//           'expiryDate': '2022-08'
//         }
//       }]
//     }
//   }