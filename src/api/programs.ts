import { Router } from 'express';
import { AuthRole, secure } from '../middlewares/auth';
import * as Model from '../models/programModel';
import * as validation from '../validations/program-validation';

const router = Router();

router.get('/:id', async (req, res, next) => {
  try {
    const programs = await Model.getAllPrograms(req.params.id);
    res.json(programs);
  } catch (error) {
    next(error);
  }
});

router.post('/', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    await validation.validateProgram(req.body);

    const program = await Model.addProgram(req.body);
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    await validation.validateProgram(req.body);

    const program = await Model.updateProgram(req.params.id, req.body);
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    const program = await Model.deleteProgram(req.params.id);
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
});

export default { path: '/programs', router };
