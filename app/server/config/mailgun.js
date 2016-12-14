const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

// Create and export function to send emails through Mailgun API
export const sendEmail = (recipient, message) => {
    const data = {
        from: 'NYC Outward Bound <info@nycoutwardbound.org>',
        to: recipient,
        subject: message.subject,
        text: message.text,
        html: message.html
    };

    mailgun.messages().send(data, (error, body) => {
        console.log('mailgun error', error);
        //  console.log(body);
    });
};

export const contactForm = (sender, message) => {
    const data = {
        from: sender,
        to: 'contact@nycoutwardbound.org',
        subject: message.subject,
        text: message.text,
        html: message.html
    };

    mailgun.messages().send(data, (error, body) => {
        //  console.log(body);
    });
};
