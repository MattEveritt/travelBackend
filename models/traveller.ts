import mongoose, { Date, Document, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface TravellerDocument extends Document {
  name: string,
  surname: string,
  birthdate: Date,
  user: string,
  travellerId: string,
  userId: string,
}

const travellerSchema = new mongoose.Schema<TravellerDocument>({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  surname: {
    type: String,
    required: true,
    minlength: 1
  },
  birthdate: Date,
  user: String,
});

travellerSchema.plugin(uniqueValidator);

travellerSchema.set('toJSON', {
  transform: (document: Document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Traveller: Model<TravellerDocument> = mongoose.model<TravellerDocument>('Traveller', travellerSchema);

export default Traveller;