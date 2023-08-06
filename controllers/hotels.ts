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

hotelsRouter.get('/hotelratings', async (request: Request, response: Response, next: NextFunction) => {
    const {hotelIds}: {hotelIds: string} = request.body;

    // What travelers think about this hotel?
    amadeus.eReputation.hotelSentiments.get({
        hotelIds: hotelIds
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.get('/hotelnameautocomplete', async (request: Request, response: Response, next: NextFunction) => {
    const {searchString, subType}: {searchString: string, subType: string} = request.body;

    // Hotel name autocomplete for keyword 'PARI' using  HOTEL_GDS category of search
    amadeus.referenceData.locations.hotel.get({
        keyword: searchString,
        subType: subType
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.get('/locationrating', async (request: Request, response: Response, next: NextFunction) => {
    const {lat, long}: {lat: number, long: number} = request.body;

    //What are the location scores for the given coordinates?
    amadeus.location.analytics.categoryRatedAreas.get({
        latitude: lat,
        longitude: long
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.get('/pointsofinterest', async (request: Request, response: Response, next: NextFunction) => {
    const {lat, long}: {lat: number, long: number} = request.body;

    // What are the popular places in Barcelona (based on a geo location and a radius)
    amadeus.referenceData.locations.pointsOfInterest.get({
        latitude: lat,
        longitude: long
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.get('/poiinfo', async (request: Request, response: Response, next: NextFunction) => {
    const {poiId}: {poiId: string} = request.body;

    // Extract the information about point of interest with ID '9CB40CB5D0'
    amadeus.referenceData.locations.pointOfInterest(poiId).get()
    .then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.get('/safetyrating', async (request: Request, response: Response, next: NextFunction) => {
    const {lat, long}: {lat: number, long: number} = request.body;

    // How safe is Barcelona? (based a geo location and a radius)
    amadeus.safety.safetyRatedLocations.get({
        latitude: lat,
        longitude: long
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.get('/toursandactivities', async (request: Request, response: Response, next: NextFunction) => {
    const {lat, long}: {lat: number, long: number} = request.body;

    // Returns activities for a location in Barcelona based on geolocation coordinates
    amadeus.shopping.activities.get({
        latitude: lat,
        longitude: long
    }).then((res: AmadeusResponse) => {
        console.log(res.body)
        return response.status(200).json(res.body)
    }).catch((e: any) => {
        return next(e);
    });
});

hotelsRouter.get('/touroractivityinfo', async (request: Request, response: Response, next: NextFunction) => {
    const {id}: {id: string } = request.body;

    // Extract the information about an activity with ID '56777'
    amadeus.shopping.activity(id).get()
    .then((res: AmadeusResponse) => {
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