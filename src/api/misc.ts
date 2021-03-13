import { Router } from 'express';
import { sendTestAccreditationAlert } from './../services/mailer-service';
import { AuthRole, secure } from './../middlewares/auth';

const router = Router();

router.post('/test-email', secure(AuthRole.SUPER_ADMIN), async (req, res, next) => {
  try {
    const data = req.body;

    await sendTestAccreditationAlert(data);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default { path: '/misc', router };
