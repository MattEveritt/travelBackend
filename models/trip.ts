import mongoose, { Document, Model } from 'mongoose';

interface TripDocument extends Document {
  type: string;
  departureAirport: {},
  destinations: [];
  dates: string[];
  travellers: Array<Object>;
  transport: string;
  userId: string,
}

const tripSchema = new mongoose.Schema<TripDocument>({
  type: {
    type: String,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  transport: {
    type: String,
    required: true,
    minLength: 1,
  },
  userId: String,
});

tripSchema.set('toJSON', {
  transform: (document: Document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Trip: Model<TripDocument> = mongoose.model<TripDocument>('Trip', tripSchema);

export default Trip;