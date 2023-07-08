import mongoose, { Document, Model } from 'mongoose';

interface TripDocument extends Document {
  destination: string;
  budget?: number;
  dates: Date;
  travellers: Array<Object>;
  userId: string,
}

const tripSchema = new mongoose.Schema<TripDocument>({
  destination: {
    type: String,
    required: true,
    minlength: 1
  },
  budget: Number,
  dates: Date,
  travellers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
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