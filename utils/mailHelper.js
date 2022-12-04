import transporter from "../config/transpoter.config";
import config from "../config/index";


const mailHelper = async(options) =>{
    let message ={
        from: config.SMTP_MAIL_EMAIL, // sender address
        to: options.email, // list of receivers
        subject:options.subject, // Subject line
        text: options.text, // plain text body
        //html: "<b>Hello world?</b>", // html body
      };

}


export default mailHelper;
