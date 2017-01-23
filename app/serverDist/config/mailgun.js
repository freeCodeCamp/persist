'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

// Create and export function to send emails through Mailgun API
var sendEmail = exports.sendEmail = function sendEmail(recipient, message) {
    var data = {
        from: 'NYC Outward Bound <info@nycoutwardbound.org>',
        to: recipient,
        subject: message.subject,
        text: message.text,
        html: message.html
    };

    mailgun.messages().send(data, function (error, body) {
        console.log('mailgun error', error);
        //  console.log(body);
    });
};

var contactForm = exports.contactForm = function contactForm(sender, message) {
    var data = {
        from: sender,
        to: 'contact@nycoutwardbound.org',
        subject: message.subject,
        text: message.text,
        html: message.html
    };

    mailgun.messages().send(data, function (error, body) {
        //  console.log(body);
    });
};