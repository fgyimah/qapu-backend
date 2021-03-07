import { CronJob } from 'cron';
import { ProgramModel } from '../models/programModel';
import { sendAccreditationAlert } from './../services/mailer-service';

const job = new CronJob('* * 1 * *', async () => {
  // check if a program is near accreditation date;
  const programs = await ProgramModel.find({
    nextAccreditationDate: { $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) },
  });
  // send auto emails to the respective programs
  programs.forEach(async (program) => {
    await sendAccreditationAlert(program);
  });
});

export default job;
