export type AmadeusResponse = {
  body: {
    data: {};
  };
  data: {};
  status: number;
};

export interface GetFlightsQuery {
  originLocationCodes: string | string[];
  destinationLocationCodes: string | string[];
  departureDates: string[];
  adults: number;
  max: number;
  currencyCode: string;
  fareOptions: string;
  children?: number;
  seniors?: number;
  young?: number;
  heldInfants?: number;
  seatedInfants?: number;
  students?: number;
  associatedAdultIds?: number;
}
