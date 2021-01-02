import Joi from 'joi';

export async function validateLoginUser(data: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
  });

  return await schema.validateAsync(data, { abortEarly: false });
}

export async function validateRegisterUser(data: any) {
  const schema = Joi.object({
    username: Joi.string().required(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
  });

  return await schema.validateAsync(data, { abortEarly: false });
}

export async function validateUpdatePassword(data: any) {
  const schema = Joi.object({
    newPassword: Joi.string().min(8).max(32).required(),
    oldPassword: Joi.string().required(),
  });
  return await schema.validateAsync(data, { abortEarly: false });
}
