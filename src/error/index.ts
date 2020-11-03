import { ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';
import httpErrors from 'http-errors';
import { MongoError } from 'mongodb';
import { MulterError } from 'multer';
import refactorMongoError from './mongo';
import { MongooseError, MongooseValidationError, parseValidationErrors } from './mongoose';

/**
 * Final step of error parsing. This catches the error if no other error yield method is utilised.
 * If no error is returned, simply return an internal server error
 */
function parseIsHttpError(error: Error) {
  const errors = Object.keys(httpErrors)
    .filter((elem) => Number.isNaN(Number.parseInt(elem)))
    .map((err) => `${err}Error`);

  const isHttpError = errors.indexOf(error.name) !== -1;

  if (isHttpError) {
    return error;
  }

  console.error(error);
  return httpErrors(500, 'Internal server error');
}

/**
 * Validate if an error passed is a Joi validation error.
 *
 * Because the Joi error validates input from the client, it is generally recommended
 * to throw an error 400 (Bad Request) and pass the details down to the client.
 */
function parseJoiError(error: Error & ValidationError) {
  if (error.name !== 'ValidationError') {
    return undefined;
  }

  const data: string[] = [];
  error.details.forEach((detail) => data.push(detail.message));
  return httpErrors(400, 'Invalid parameters', { data });
}

/** Validate if an error is from a bad or expired JWT token */
function parseJwtError(error: Error) {
  if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError') {
    return undefined;
  }

  const code = error.name === 'JsonWebTokenError' ? 403 : 410;
  return httpErrors(code, error.message);
}

function parseMongoError(error: Error & MongoError) {
  if (error.name !== 'MongoError') {
    return undefined;
  }

  const refactored = refactorMongoError(error);
  return httpErrors(refactored.code, refactored.message, {
    mongoErrorCode: refactored.mongoErrorCode,
  });
}

/**
 * Parse Mongoose errors
 * Most mongoose errors will be overwritten to include codes for better error handling
 * @param error
 */
function parseMongooseError(error: MongooseError) {
  const errorNames = ['DocumentRestrictedError', 'DocumentNotFoundError', 'MongooseError'];

  if (!errorNames.includes(error.name)) {
    return undefined;
  }

  const code = error.code;
  return httpErrors(code, error.message);
}

function parseMongooseValidationError(error: MongooseValidationError) {
  if (!(error.name === 'ValidationError' && error.errors)) {
    return undefined;
  }

  const messages = parseValidationErrors(error);
  return httpErrors(
    400,
    'Error inserting data into database. Possibly caused by bad parameters',
    messages
  );
}

function parseMulterError(error: MulterError) {
  if (!(error instanceof MulterError)) {
    return undefined;
  }

  let msg = '';
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      msg = 'File too large to upload';
      break;
    case 'LIMIT_UNEXPECTED_FILE':
      msg = 'Only valid image formats are accepted';
      break;
    default:
      msg = 'Error uploading file';
      break;
  }

  return httpErrors(400, msg);
}

/**
 * Generator function to iterate through the various error parsers and return a valid HTTP error.
 * The order in which the yield methods are arranged is very important
 * @param error
 */
function* errorGenerator(error: Error) {
  // Since they both have ValidationError, we put Mongoose error first
  yield parseMongooseValidationError(error as MongooseValidationError);

  yield parseJoiError(error as ValidationError);
  yield parseJwtError(error);
  yield parseMongooseError(error as MongooseError);
  yield parseMongoError(error as MongoError);
  yield parseMulterError(error as MulterError);

  yield parseIsHttpError(error);
}

export function handleError(_: Request, __: Response, next: NextFunction) {
  const error = new httpErrors.NotFound('API Endpoint not found');
  next(error);
}

/**
 * Create a conventional HTTP error.
 *
 * Detects which kind of errors known to the system and returns a conventional
 * error object that can be used for debugging and logging.
 */
export function renderError(err: Error, _: Request, res: Response, __: NextFunction) {
  const generator = errorGenerator(err);
  let value = undefined;

  // eslint-disable-next-line
  while (true) {
    value = generator.next().value;

    if (typeof value !== 'undefined') {
      // An error object has been obtained. Exit
      break;
    }
  }

  res.status((value as httpErrors.HttpError).statusCode).json({
    error: true,
    date: Date.now(),
    ...value,
  });
}
