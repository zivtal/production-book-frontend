export default class RegexPattern {
  public static readonly LETTERS_WITH_SPACES = /^[a-zA-Z\s]*$/;
  public static readonly PERCENTS = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{0,2})?$)/;
  public static readonly EMAIL_ADDRESS = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  public static readonly NUMBER = /^\d+$/;
  public static readonly NAME = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  public static readonly TIMESTAMP = /^\d{13}(.0)?$/;
  public static readonly COORDINATE = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
  public static readonly DATE_TIME: Record<string, RegExp> = {
    ['DD/MM/YYYY']: /^([1-9]|0[1-9]|[12][0-9]|3[01])\/([1-9]|0[1-9]|1[012])\/(19|20)\d\d$/,
  };
  public static readonly PHONE: Record<string, RegExp> = {
    HE: /^[05]\d{9}$|^[02|03|04|07|08|09]\d{8}|^[180]\d{9}$/,
  };

  public static readonly URL: Record<string, RegExp> = {
    YOUTUBE: /\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_]+)/i,
    VIMEO: /\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i,
  };

  public static readonly PASSWORD: Record<string, RegExp> = {
    LOWERCASE: /(?=.*[a-z])/,
    UPPERCASE: /(?=.*[A-Z])/,
    NUMERIC: /(?=.*[0-9])/,
    SPECIAL: /(?=.*[!@#$%^&*])/,
  };
}
