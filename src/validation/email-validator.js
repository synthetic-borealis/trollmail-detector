const domainBlacklist = require('../utils/domain-blacklist');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RFC5322 compliant e-mail address RegEx pattern                                                                                  //
// Source: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression#answer-201378 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const EmailValidationStatus = {
  Valid: 0,
  NotAnEmail: 1,
  Blacklisted: 2,
};

const validate = (email) => {
  if (!emailRegex.test(email)) {
    return EmailValidationStatus.NotAnEmail;
  }

  const emailHost = email.split('@')[1];
  return domainBlacklist.find((host) => host === emailHost) ? EmailValidationStatus.Blacklisted : EmailValidationStatus.Valid;
};

module.exports = {
  EmailValidationStatus,
  validate,
};
