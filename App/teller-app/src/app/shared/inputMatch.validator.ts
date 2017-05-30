import {ValidatorFn, AbstractControl, FormControl, FormGroup} from "@angular/forms";


export function passwordMatchValidator(g: FormGroup){
  console.log()
  return g.get('pass').value === g.get('passcheck').value ? null : {'mismatch': true};
}
