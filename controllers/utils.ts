import { NextFunction, Response } from 'express';

export const getTravelersArray = (
    adults: number,
    children: number | undefined,
    seniors: number | undefined,
    young: number | undefined,
    heldInfants: number | undefined,
    seatedInfants: number | undefined,
    students: number | undefined,
    associatedAdultId: number | undefined,
) => {
    const travelers = [];

    if (adults) {
        for (let i = 0; i < adults; i++) {
            travelers.push({
                id: i,
                travelerType: 'ADULT',
            });
        }
    }
    if (children) {
        for (let i = travelers.length; i < children + travelers.length; i++) {
            travelers.push({
                id: i,
                travelerType: 'CHILD',
            });
        }
    }
    if (seniors) {
        for (let i = travelers.length; i < seniors + travelers.length; i++) {
            travelers.push({
                id: i,
                travelerType: 'SENIOR',
            });
        }
    }
    if (young) {
        for (let i = travelers.length; i < young + travelers.length; i++) {
            travelers.push({
                id: i,
                travelerType: 'YOUTH',
            });
        }
    }
    if (heldInfants) {
        for (
            let i = travelers.length;
            i < heldInfants + travelers.length;
            i++
        ) {
            travelers.push({
                id: i,
                travelerType: 'HOLD_INFANT',
                associatedAdultId: associatedAdultId,
            });
        }
    }
    if (seatedInfants) {
        for (
            let i = travelers.length;
            i < seatedInfants + travelers.length;
            i++
        ) {
            travelers.push({
                id: i,
                travelerType: 'SEAT_INFANT',
            });
        }
    }
    if (students) {
        for (let i = travelers.length; i < students + travelers.length; i++) {
            travelers.push({
                id: i,
                travelerType: 'STUDENT',
            });
        }
    }
    return travelers;
};

export const getOriginDestinationsArray = (
    originLocationCodes: string[],
    destinationLocationCodes: string[],
    departureDates: string[],
) => {
    return originLocationCodes.map((key: string, index: number) => {
        const isoDate = new Date(departureDates[index])
            .toISOString()
            .split('T')[0];
        return {
            id: index + 1,
            originLocationCode: key,
            destinationLocationCode: destinationLocationCodes[index],
            departureDateTimeRange: {
                date: isoDate,
            },
        };
    });
};

export const callAmadeusService = async (
    service: any,
    method: string,
    body: any,
    response: Response,
    next: NextFunction,
) => {
    try {
        const res = await service[method](body);
        const extractedData = JSON.parse(JSON.stringify(res.body));
        return response.status(200).json(extractedData);
    } catch (e) {
        return next(e);
    }
};
