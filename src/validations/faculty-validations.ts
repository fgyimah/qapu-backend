import Joi from 'joi';

export async function validateFaculty(data: any) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return await schema.validateAsync(data);
}
