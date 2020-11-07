import Joi from 'joi';

export async function validateProgram(data: any) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return await schema.validateAsync(data);
}
