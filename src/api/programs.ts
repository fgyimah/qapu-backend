import { Router } from 'express';
import { NotAcceptable } from 'http-errors';
import { uploadFile } from '../middlewares/upload';
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

router.get('/:id/program', async (req, res, next) => {
  try {
    const program = await Model.getProgramById(req.params.id);
    res.json(program);
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

router.post(
  '/:id/materials',
  secure(AuthRole.SUPER_ADMIN),
  uploadFile({ single: true, field: 'materials' }),
  async (req, res, next) => {
    try {
      const programId = req.params.id;

      if (!req.file) {
        throw new NotAcceptable('Must specify file');
      }

      const material = req.file.path;
      const program = await Model.addAccreditationMaterial(programId, material);

      res.json(program);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id/materials/:material', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    const { id, material } = req.params;

    const program = await Model.deleteAccreditationMaterial(id, material);

    res.json(program);
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
