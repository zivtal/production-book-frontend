import { CoreValidators } from '@/shared/services/validator/service/record-validator/models';
import { ValidationMessage } from '@/shared/services/validator/service/record-validator/constants/validation.message.enum';
import RegexPattern from '@/shared/constants/regex-pattern';

export const PasswordRegexValidator: CoreValidators['regex'] = [
  [
    [RegexPattern.PASSWORD.LOWERCASE, ValidationMessage.MISSING_LOWERCASE_CHARACTER],
    [RegexPattern.PASSWORD.UPPERCASE, ValidationMessage.MISSING_UPPERCASE_CHARACTER],
    [RegexPattern.PASSWORD.NUMERIC, ValidationMessage.MISSING_NUMERIC_CHARACTER],
    [RegexPattern.PASSWORD.SPECIAL, ValidationMessage.MISSING_SPECIAL_CHARACTER],
  ],
  ValidationMessage.WEAK_PASSWORD,
  { checkMode: 'every' },
];
