import SGMail from '@sendgrid/mail';
import { Program } from './../schemas/Program';

SGMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * A method for sending emails to officials when
 * a course accreditation period is almost up
 * @param program - Program with accreditation period almost up
 * @param nextAccreditationDate - Date which the program will be required to submit another accreditation response
 */
export const sendAccreditationAlert = async (program: Program, nextAccreditationDate: Date) => {
  const mails: string[] = [process.env.SUPER_ADMIN_EMAIL!];
  if (program.email) mails.push(program.email);

  try {
    mails.forEach(async (mail) => {
      await SGMail.send({
        from: 'admin@qapu.com',
        to: mail,
        subject: `Reminder on Accreditation Status of ${program.name}`,
        text: `Good day
              This email is to notify you that the accreditation of ${
                program.name
              } will be expired on ${nextAccreditationDate.toDateString()}
              
              You are hereby advised to begin the necessary steps to ensure the program has all accreditation measures in place for the process to begin
              
              Thank you!`,
      });
    });
  } catch (error) {
    console.error(error);
  }
};
