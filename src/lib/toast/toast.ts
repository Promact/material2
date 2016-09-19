import {
  Injectable,
  ComponentRef,
  DynamicComponentLoader,
  ApplicationRef,
  Inject,
  ReflectiveInjector,
  ViewContainerRef,
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ViewContainerRef_ } from '@angular/core/src/linker/view_container_ref';
import { Md2ToastComponent } from './toast.component';

@Injectable()
export class Md2Toast {
  private hideDelay: number = 3000;
  private index: number = 0;

  container: ComponentRef<any>;

  private appRef: any;

  constructor(private loader: DynamicComponentLoader, appRef: ApplicationRef) {
    this.appRef = appRef;
  }

  /**
   * show toast
   * @param toastObj string or object with message and other properties of toast
   */
  show(toastObj: string | { message: string, hideDelay: number }) {
    let toast: Toast;
    if (typeof toastObj === 'string') {
      toast = new Toast(toastObj);
    } else if (typeof toastObj === 'object') {
      toast = new Toast(toastObj.message);
      this.hideDelay = toastObj.hideDelay;
    }
    if (toast) {
      if (!this.container) {
        let appElement: ViewContainerRef = new ViewContainerRef_(this.appRef['_rootComponents'][0]._hostElement);
        let bindings = ReflectiveInjector.resolve([]);
        this.loader.loadNextToLocation(Md2ToastComponent, appElement, bindings).then((ref: any) => {
          this.container = ref;
          this.setupToast(toast);
        });
      } else {
        this.setupToast(toast);
      }
    }
  }

  /**
   * toast timeout
   * @param toastId
   */
  startTimeout(toastId: number) {
    setTimeout(() => {
      this.clear(toastId);
    }, this.hideDelay);
  }

  /**
   * setup toast
   * @param toast
   */
  setupToast(toast: Toast) {
    toast.id = ++this.index;
    this.container.instance.add(toast);
    this.startTimeout(toast.id);
  }

  /**
   * clear all toast
   * @param toastId
   */
  clear(toastId: number) {
    if (this.container) {
      let instance = this.container.instance;
      instance.remove(toastId);
      if (!instance.isToast()) { this.hide(); }
    }
  }

  /**
   * hide all or specific toasts
   */
  hide() {
    this.container.destroy();
    this.container = null;
  }
}

export class Toast {
  id: number;
  message: string;
  constructor(message: string) { this.message = message; }
}

export const MD2_TOAST_DIRECTIVES: any[] = [Md2ToastComponent];

@NgModule({
  declarations: MD2_TOAST_DIRECTIVES,
  imports: [CommonModule],
  exports: MD2_TOAST_DIRECTIVES,
})
export class Md2ToastModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Md2ToastModule,
      providers: [Md2Toast]
    };
  }
}