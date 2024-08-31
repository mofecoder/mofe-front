export const passwordRules = [
  'required: lower',
  'required: upper',
  'required: digit',
  'allowed: special',
  'minlength: 8',
  'maxlength: 128'
].join(', ')
