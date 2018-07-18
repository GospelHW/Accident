import {AbstractControl, ValidatorFn} from '@angular/forms';

export function NumberValidator(): ValidatorFn {
  let isNumber = true;
  return (control: AbstractControl): { [key: string]: any } => {
    const rep = new RegExp('^[1-9]d*|0$');
    const numStrs = control.value && control.value.toString().split('');
    if (numStrs && numStrs.length > 1 && numStrs[0] == 0) {
      isNumber = false;
    } else if (numStrs) {
      numStrs.every(e => {
        isNumber = rep.test(e);
        return isNumber;
      });
    } else {
      isNumber = true;
    }
    return isNumber ? null : {'isNumber': ''};
  };
}

export function moneyValidator(): ValidatorFn {
  let isNumber = true;
  return (control: AbstractControl): { [key: string]: any } => {
    const rep = new RegExp('^(([1-9]\\d*)|\\d)(\\.\\d{1,2})?$');
    const numStrs = control.value && control.value.toString().split('');
    if (numStrs && numStrs.length > 1 && numStrs[0] == 0) {
      isNumber = false;
    } else if (numStrs) {
      isNumber = rep.test(control.value);
    }
    return isNumber ? null : {'isNumber': ''};
  };
}
