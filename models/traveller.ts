import mongoose, { Date, Document, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface TravellerDocument extends Document {
  firstName: string,
  lastName: string,
  middleNames: string,
  birthdate: Date,
  user: {},
  travellerId: string,
  userId: string,
}

const travellerSchema = new mongoose.Schema<TravellerDocument>({
  firstName: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 1
  },
  lastName: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 1
  },
  middleNames: {
    type: mongoose.Schema.Types.String,
    minlength: 1
  },
  birthdate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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