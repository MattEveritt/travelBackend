import { Document, Model, Schema, model} from 'mongoose';

interface TripDocument extends Document {
  type: string;
  departureAirport: {},
  destinations: [];
  dates: string[];
  travellers: Array<Object>;
  transport: string[];
  userId: string,
  includeAccomodation: boolean,
}

const tripSchema = new Schema<TripDocument>({
  type: {
    type: Schema.Types.String,
    required: true,
    minLength: 1,
  },
  departureAirport: {
    type: {},
    required: true,
  },
  destinations: {
    type: [],
    required: true,
    minlength: 1
  },
  dates: {
    type: [],
    required: true,
    minlength: 1
  },
  travellers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  transport: {
    type: [],
    required: true,
  },
  includeAccomodation: {
    type: Schema.Types.Boolean,
    required: true,
  },
  userId: Schema.Types.String,
});

tripSchema.set('toJSON', {
  transform: (document: Document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Trip: Model<TripDocument> = model<TripDocument>('Trip', tripSchema);

export default Trip;