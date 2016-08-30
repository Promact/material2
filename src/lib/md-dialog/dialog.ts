import {
  Component,
  Output,
  Input,
  ContentChild,
  EventEmitter,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectionStrategy,
  provide,
  Directive,
  ViewContainerRef,
  TemplateRef,
  NgModule
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Overlay, OVERLAY_CONTAINER_TOKEN} from './overlay/overlay';
import {createOverlayContainer} from './overlay/overlay-container';
import {OverlayState} from './overlay/overlay-state';
import {OverlayRef} from './overlay/overlay-ref';
import {Animate} from './animate';

import {TemplatePortal} from './portal/portal';

@Directive({ selector: '[mdDialogPortal]' })
export class MdDialogPortal extends TemplatePortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

// TODO(jd): behavioral tests
// TODO(jd): backdrop and clickToClose options

@Component({
  selector: 'md-dialog',
  encapsulation: ViewEncapsulation.None,
  template: `
    <template mdDialogPortal>
      <div class="md-dialog" [class.open]="isOpened">
        <div class="md-dialog-container">
          <div class="md-dialog-header">
            <button type="button" class="close" aria-label="Close" (click)="close()">&times;</button>
            <h2 *ngIf="dialogTitle" class="md-dialog-title" id="myDialogLabel" [innerHtml]="dialogTitle"></h2>
            <ng-content select="md-dialog-title"></ng-content>
          </div>
          <ng-content></ng-content>
          <ng-content select="md-dialog-footer"></ng-content>
        </div>
      </div>
    </template>
  `,
  styles: [`
    .md-dialog-open { overflow-y: hidden; }
    .md-dialog { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1050; background-color: rgba(33, 33, 33, 0.48); display: none; overflow-x: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch; outline: 0; }
    .md-dialog.open { display: block; }
    .md-dialog .md-dialog-container { position: relative; width: auto; margin: 15px; background-color: #fff; -webkit-background-clip: padding-box; -moz-background-clip: padding-box; background-clip: padding-box; border-radius: 4px; outline: 0; -webkit-box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 13px 19px 2px rgba(0,0,0,.14),0 5px 24px 4px rgba(0,0,0,.12); box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 13px 19px 2px rgba(0,0,0,.14),0 5px 24px 4px rgba(0,0,0,.12); -webkit-transition: .3s; -o-transition: .3s; -moz-transition: .3s; transition: .3s; -webkit-transform: scale(0.1); -ms-transform: scale(0.1); -o-transform: scale(0.1); -moz-transform: scale(0.1); transform: scale(0.1); }
    .md-dialog.open .md-dialog-container { -webkit-transform: scale(1); -ms-transform: scale(1); -o-transform: scale(1); -moz-transform: scale(1); transform: scale(1); }
    @media (min-width: 768px) {
      .md-dialog .md-dialog-container { width: 600px; margin: 30px auto; }
    }
    .md-dialog-header { background: #2196f3; color: #fff; font-size: 25px; line-height: 1.1; font-weight: 500; padding: 0 16px; border-bottom: 1px solid #e5e5e5; }
    .md-dialog-header .close { position: absolute; top: 21px; right: 16px; display: inline-block; width: 18px; height: 18px; overflow: hidden; -webkit-appearance: none; padding: 0; cursor: pointer; background: 0 0; border: 0; outline: 0; opacity: 0.8; font-size: 0; z-index: 1; }
    .md-dialog-header .close::before,
    .md-dialog-header .close::after { content: ''; position: absolute; top: 50%; left: 0; height: 2px; width: 100%; margin-top: -1px;background: #ccc;border-radius: 2px;height: 2px;}
    .md-dialog-header .close::before {-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);-ms-transform: rotate(45deg);-o-transform: rotate(45deg);transform: rotate(45deg);}
    .md-dialog-header .close::after {-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);-ms-transform: rotate(-45deg);-o-transform: rotate(-45deg);transform: rotate(-45deg);}
    .md-dialog-header .close:hover { opacity: 1; }
    .md-dialog-header .md-dialog-title { margin: 0; font-size: 25px; line-height: 60px; font-weight: 500; }
    .md-dialog-header dialog-header { line-height: 33px; }
    .md-dialog-body { position: relative; padding: 16px; }
    .md-dialog-footer, md-dialog-footer { padding: 16px; text-align: right; border-top: 1px solid rgba(0,0,0,0.12); }
  `],
  host: {
    'tabindex': '0',
    '(body:keydown)': 'onDocumentKeypress($event)'
  }
})
export class MdDialog implements OnDestroy {
  constructor(private overlay: Overlay) {
  }

  @Output() onShow: EventEmitter<MdDialog> = new EventEmitter<MdDialog>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  /** The portal to send the dialog content through */
  @ViewChild(MdDialogPortal) private portal: MdDialogPortal;

  /** Is the dialog active? */
  private isOpened: boolean = false;

  @Input('title') dialogTitle: string;

  /** Overlay configuration for positioning the dialog */
  @Input() config = new OverlayState();

  /** @internal */
  private overlayRef: OverlayRef = null;

  ngOnDestroy(): any {
    return this.close();
  }

  /** Show the dialog */
  show(): Promise<MdDialog> {
    return this.close()
      .then(() => this.overlay.create(this.config))
      .then((ref: OverlayRef) => {
        this.overlayRef = ref;
        return ref.attach(this.portal);
      })
      .then(() => Animate.wait())
      .then(() => {
        this.isOpened = true;
        this.onShow.emit(this);
        return this;
      });
  }

  /** Close the dialog */
  close(result: any = true, cancel: boolean = false): Promise<MdDialog> {
    if (!this.overlayRef) {
      return Promise.resolve<MdDialog>(this);
    }
    this.isOpened = false;
    // TODO(jd): this is terrible, use animate states
    return Animate.wait(100)
      .then(() => this.overlayRef.detach())
      .then(() => {
        this.overlayRef.dispose();
        this.overlayRef = null;
        if (cancel) {
          this.onCancel.emit(result);
        } else {
          this.onClose.emit(result);
        }
        return this;
      });
  }

  private onDocumentKeypress(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      this.close();
    }
  }
}

export const MD_DIALOG_DIRECTIVES: any[] = [MdDialog, MdDialogPortal];

export const MD_DIALOG_PROVIDERS: any[] = [Overlay, provide(OVERLAY_CONTAINER_TOKEN, { useValue: createOverlayContainer() })];

@NgModule({
  imports: [CommonModule],
  exports: MD_DIALOG_DIRECTIVES,
  declarations: MD_DIALOG_DIRECTIVES,
  providers: MD_DIALOG_PROVIDERS,
})
export class MdDialogModule { }