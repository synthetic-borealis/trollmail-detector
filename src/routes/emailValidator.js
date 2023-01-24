const {
  validate: validateEmail,
  EmailValidationStatus: ValidationStatus,
} = require('../validation/email-validator');

const emailValidator = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      status: 'Missing parameter',
    });
  } else {
    const validationStatus = validateEmail(email);
    switch (validationStatus) {
      case ValidationStatus.Valid:
        res.json({
          email,
          status: 'Valid',
        });
        break;

      case ValidationStatus.NotAnEmail:
        res.status(401).json({
          email,
          status: 'NotAnEmail',
        });
        break;

      case ValidationStatus.Blacklisted:
        res.status(401).json({
          email,
          status: 'Blacklisted',
        });
        break;

      default:
        res.json({
          email,
          status: 'UnknownError',
        });
    }
  }
};

module.exports = emailValidator;
