import { Component, HostBinding, Input, forwardRef, OnInit, ViewChild, NgModule} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isBlank } from '@angular/common/src/facade/lang';

const KEYS = {
    backspace: 8,
    comma: 188,
    enter: 13,
    space: 32
};

export const MD2_CHIPS_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Md2Chips),
    multi: true
};

@Component({
    selector: 'md2-chips',
    template:
    `<span *ngFor="let chip of chipItemList; let i = index" class="md2-chip" [class.chip-input-disabled]="isReadonly" [class.chip-input-selected]="selectedChip === i">
        <span>{{chip}}</span>  
        <ng-content select=".template-content"></ng-content>
        <span class="chip-remove" (click)="removeSelectedChip(i)" *ngIf="isChipRemovable">&times;</span>
     </span>      
     <form #chipInputForm="ngForm" class="chip-input-form" *ngIf="!isReadonly">
         <input class="chip-input" type="text" [(ngModel)]="inputValue" name="chipInput" [placeholder]="placeholder" (paste)="inputPaste($event)" (keydown)="inputChanged($event)" (blur)="inputBlurred($event)" (focus)="inputFocused()"/>
     </form>`,

    styles: [`
    .template-content{display:inline;}
    :host {display: block;box-shadow: 0 1px #ccc;padding: 5px 0;}
    :host.chip-input-focus {box-shadow: 0 2px #0d8bff;}
    .md2-chip{display: inline-block;background: #e0e0e0;padding: 6px;margin: 8px 8px 0 0;border-radius: 90px;line-height: 22px;height: 32px;box-sizing: border-box;font-size: 16px;}
    .chip-input-selected {color: white;background: #0d8bff;}
    .chip-input-disabled{    pointer-events: none;}
    .chip-input-form {display: inline-block;height:32px;margin: 8px 8px 0 0;}
    .chip-remove {cursor: pointer;display: inline-block;padding: 0 3px;color: #616161;font-size: 30px;vertical-align: top;line-height: 21px;font-family: serif;}
    .chip-input {display: inline-block;width: auto;box-shadow: none;border: 0;outline:none;height: 32px;line-height: 32px;font-size: 16px;}
  `],
    providers: [MD2_CHIPS_CONTROL_VALUE_ACCESSOR]
})

export class Md2Chips implements ControlValueAccessor, OnInit {
  @Input() addOnBlur: boolean = true;
  @Input() addOnComma: boolean = true;
  @Input() addOnEnter: boolean = true;
  @Input() addOnPaste: boolean = true;
  @Input() addOnSpace: boolean = false;
  @Input() allowedPattern: RegExp = /.+/;
  @Input() ngModel: string[];
  @Input() pasteSplitPattern: string = ',';
  @Input() placeholder: string = 'Add New';
  @HostBinding('class.chip-input-focus') isFocused: boolean;
  @ViewChild('chipInputForm') chipInputForm: NgForm;
  @Input() isRemovable: boolean = true;
  @Input() isReadonly: boolean=false;

  public chipItemList: string[] = [];
  public inputValue: string = '';
  public selectedChip: number;
  private splitRegExp: RegExp;
  public isChipRemovable: boolean;
   
  constructor() { }

  ngOnInit() {
      if (this.ngModel) { this.chipItemList = this.ngModel; }
      this.onChange(this.chipItemList);
      this.splitRegExp = new RegExp(this.pasteSplitPattern);
      this.isChipRemovable = this.isRemovable;        
  }

  inputChanged(event: KeyboardEvent): void {
      let key = event.keyCode;
      switch (key) {
          case KEYS.backspace:
              this.backspaceEvent();
              break;

          case KEYS.enter:
              if (this.addOnEnter) {
                  this.addNewChip([this.inputValue]);
                  event.preventDefault();
              }
              break;

          case KEYS.comma:
              if (this.addOnComma) {
                  this.addNewChip([this.inputValue]);
                  event.preventDefault();
              }
              break;

          case KEYS.space:
              if (this.addOnSpace) {
                  this.addNewChip([this.inputValue]);
                  event.preventDefault();
              }
              break;

          default:
              break;
      }
  }

  inputBlurred(event: Event): void {
      if (this.addOnBlur) { this.addNewChip([this.inputValue]); }
      this.isFocused = false;
  }

  inputFocused(event: Event): void {
      this.isFocused = true;
  }

  inputPaste(event: any): void {
      let clipboardData = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData);
      let pastedString = clipboardData.getData('text/plain');
      let chips = this.addRegExpString(pastedString);
      let chipsToAdd = chips.filter((chip) => this._isValid(chip));
      this.addNewChip(chipsToAdd);
      setTimeout(() => this._resetInput());
  }

  private addRegExpString(chipInputString: string): string[] {
      chipInputString = chipInputString.trim();
      let chips = chipInputString.split(this.splitRegExp);
      return chips.filter((chip) => !!chip);
  }

  private _isValid(chipString: string): boolean {
      if (this.chipItemList.indexOf(chipString) === -1)
          return this.allowedPattern.test(chipString);
  }

  private addNewChip(chips: string[]): void {
      let validInput = chips.filter((chip) => this._isValid(chip));
      this.chipItemList = this.chipItemList.concat(validInput.map(chip => chip.trim()));
      this._resetSelected();
      this._resetInput();
      this.onChange(this.chipItemList);
  }

  private removeSelectedChip(chipIndexToRemove: number): void {
      this.chipItemList.splice(chipIndexToRemove, 1);
      this._resetSelected();
      this.onChange(this.chipItemList);
  }

  private backspaceEvent(): void {
      if (!this.inputValue.length && this.chipItemList.length && this.isChipRemovable) {
          if (!isBlank(this.selectedChip)) {
              this.removeSelectedChip(this.selectedChip);
          } else {
              this.selectedChip = this.chipItemList.length - 1;
          }
      }
  }

  private _resetSelected(): void {
      this.selectedChip = null;
  }

  private _resetInput(): void {
      this.chipInputForm.controls['chipInput'].setValue('');
  }

  onChange: (value: any) => any = () => { };
  onTouched: () => any = () => { };
  writeValue(value: any) { }
  registerOnChange(fn: any) {this.onChange = fn;}
  registerOnTouched(fn: any) {this.onTouched = fn; }
}

export const MD2_CHIPS_DIRECTIVES: any[] = [Md2Chips];

@NgModule({
  imports: [CommonModule,FormsModule],
  declarations: [MD2_CHIPS_DIRECTIVES],
  exports: [MD2_CHIPS_DIRECTIVES]
})
export class Md2ChipsModule { }
