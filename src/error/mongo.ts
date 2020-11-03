import { MongoError } from 'mongodb';

export type ParsedMongoError = {
  code: number;
  mongoErrorCode?: number;
  message: string;
};

type OmittedProps = Omit<ParsedMongoError, 'mongoErrorCode' | 'message'>;

export default function refactorMongoError(error: MongoError): ParsedMongoError {
  const parsedMongoErrors: Record<any, OmittedProps> = {
    '11000': {
      code: 409,
    },
    '-1': {
      code: 500,
    },
  };

  const parsedMongoError = parsedMongoErrors[error.code || -1];
  return {
    ...parsedMongoError,
    mongoErrorCode: error.code,
    message: error.message,
  };
}
