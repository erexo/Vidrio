import { FormControlType } from "@core/enums/form/form-control-type.enum";

export class FormControl {
  constructor(
    public type: FormControlType,
    public name: string,
    public value: any,
    public title?: string,
    public placeholder?: string,
    public selectType?: any
  ) {}
}