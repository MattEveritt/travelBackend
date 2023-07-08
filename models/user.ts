import mongoose, { Document, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface UserDocument extends Document{
  email: string,
  username: string,
  name: string,
  passwordHash: string,
  trips: Array<Object>,
  travellers: Array<Object>,
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  trips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    }
  ],
  travellers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traveller'
    }
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document: Document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export default User;