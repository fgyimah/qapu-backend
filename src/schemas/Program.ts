import { Schema, Document } from 'mongoose';

export const COLLECTION = 'programmes';

export interface Program extends Document {
  name: string;
  accredited: boolean;
  nextAccreditationDate?: Date;
  accreditationMaterials?: string[];
  accreditationRequirements?: string;
}

export const Program = new Schema({
  name: {
    type: String,
    required: true,
  },
  accredited: {
    type: Boolean,
    default: false,
  },
  nextAccreditationDate: Date,
  accreditationMaterials: [String],
  accreditationRequirements: String,
});
