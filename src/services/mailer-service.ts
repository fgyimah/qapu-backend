import SGMail from '@sendgrid/mail';
import { Program } from './../schemas/Program';

SGMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * A method for sending emails to officials when
 * a course accreditation period is almost up
 * @param program - Program with accreditation period almost up
 * @param nextAccreditationDate - Date which the program will be required to submit another accreditation response
 */
export const sendAccreditationAlert = async (program: Program) => {
  const mails: string[] = [process.env.SUPER_ADMIN_EMAIL!, 'bkommey.coe@knust.edu.gh'];
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
        } will be expired on ${program.nextAccreditationDate?.toDateString()}
              
You are hereby advised to begin the necessary steps to ensure the program has all accreditation measures in place for the process to begin

Thank you!`,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendTestAccreditationAlert = async (data: {
  program: string;
  to: string;
  bcc: string;
  cc: string;
  dueDate: string;
}) => {
  const mails: string[] = [process.env.SUPER_ADMIN_EMAIL!, 'bkommey.coe@knust.edu.gh', data.to];

  try {
    mails.forEach(async (mail) => {
      await SGMail.send({
        from: 'admin@qapu.com',
        to: mail,
        cc: data.cc,
        bcc: data.bcc,
        subject: `Reminder on Accreditation Status of ${data.program}`,
        text: `Good day
This email is to notify you that the accreditation of ${data.program} will be expired on ${new Date(
          data.dueDate
        ).toDateString()}
              
You are hereby advised to begin the necessary steps to ensure the program has all accreditation measures in place for the process to begin

Thank you!`,
      });
    });
  } catch (error) {
    console.error(error);
  }
};
