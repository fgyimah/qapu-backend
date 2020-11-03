import mongoose from 'mongoose';

export class DuplicateDocumentError extends mongoose.Error {
  public code = 409;
}

export class DocumentNotFoundError extends mongoose.Error.DocumentNotFoundError {
  public code = 404;

  constructor(message: string, filter?: any) {
    super(filter);
    this.message = message;
  }
}

export class MongooseGenericError extends mongoose.Error {
  public code = 500;
}

export function parseValidationErrors(error: mongoose.Error.ValidationError): string[] {
  return Object.keys(error.errors).map((key) => error.errors[key].message);
}

export type MongooseError = MongooseGenericError | DuplicateDocumentError | DocumentNotFoundError;

export type MongooseValidationError = mongoose.Error.ValidationError;
