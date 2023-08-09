export enum RegexStrings {
  PERCENTS = '(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{0,2})?$)',
  THREE_DIGIT_WITH_TWO_DECIMAL = '(^([0-9]{1,3})((\\.|\\.\\d{0,2})?)$)',
  ID_NUMBER = '^\\d{0,9}$',
  NUMBER = '^\\d+$',
  LETTERS_WITH_SPACES = '^[a-zA-Z\\s]*$',
}
