const {
  validate: validateEmail,
  EmailValidationStatus: ValidationStatus,
} = require('../email-validator');

const validEmail = 'albus.dumbledore@hogwarts.ac.uk';
const invalidEmail = 'albus.dumbledore#hogwarts.ac.uk';
const blacklistedEmail = 'albus.dumbledore@sharklasers.com';

describe('E-mail validator tests', () => {
  test('Should accept valid e-mail', () => {
    expect(validateEmail(validEmail)).toBe(ValidationStatus.Valid);
  });

  test('Should return NotAnEmail for an invalid e-mail', () => {
    expect(validateEmail(invalidEmail)).toBe(ValidationStatus.NotAnEmail);
  });

  test('Should return Blacklisted for a blacklisted e-mail', () => {
    expect(validateEmail(blacklistedEmail)).toBe(ValidationStatus.Blacklisted);
  });
});
