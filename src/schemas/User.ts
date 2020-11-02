import { Document, Schema } from 'mongoose';
import { Faculty, COLLECTION as FACULTY } from './Faculty';

export const COLLECTION = 'users';

export interface User extends Document {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  password: string;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpires?: Date;
  faculty?: Faculty | Faculty['_id'];
  isSuperAdmin: boolean;
}

export const User = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: FACULTY,
    required: false,
  },
  forgotPasswordToken: {
    type: String,
    required: false,
  },
  forgotPasswordTokenExpires: {
    type: Date,
    required: false,
  },
});
