import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {DemoApp, Home} from './demo-app/demo-app';
import {RouterModule} from '@angular/router';
import {Md2Module} from 'md2/all/all';
import {MdButtonModule} from 'md2/button/button';
import {MdSidenavModule} from 'md2/sidenav/sidenav';
import {MdListModule} from 'md2/list/list';
import {MdIconModule} from 'md2/icon/icon';
import {MdToolbarModule} from 'md2/toolbar/toolbar';
import {MdRippleModule} from 'md2/core/ripple/ripple';
import {PortalModule} from 'md2/core/portal/portal-directives';
import {OverlayModule} from 'md2/core/overlay/overlay-directives';
import {RtlModule} from 'md2/core/rtl/dir';

import {AccordionDemo} from './accordion/accordion-demo';
import {AutocompleteDemo} from './autocomplete/autocomplete-demo';
import {ChipsDemo} from './chips/chips-demo';
import {CollapseDemo} from './collapse/collapse-demo';
import {ColorpickerDemo} from './colorpicker/colorpicker-demo';
import {DatepickerDemo} from './datepicker/datepicker-demo';
import {DialogDemo} from './md-dialog/dialog-demo';
import {MenuDemo} from './md-menu/menu-demo';
import {MultiselectDemo} from './multiselect/multiselect-demo';
import {SelectDemo} from './select/select-demo';
import {TabsDemo} from './md-tabs/tabs-demo';
import {TagsDemo} from './tags/tags-demo';
import {ToastDemo} from './toast/toast-demo';
import {TooltipDemo} from './md-tooltip/tooltip-demo';

import {DEMO_APP_ROUTES} from './demo-app/routes';
//import {ProgressBarDemo} from './progress-bar/progress-bar-demo';
//import {JazzDialog, DialogDemo} from './dialog/dialog-demo';
//import {RippleDemo} from './ripple/ripple-demo';
//import {IconDemo} from './icon/icon-demo';
//import {GesturesDemo} from './gestures/gestures-demo';
//import {InputDemo} from './input/input-demo';
//import {CardDemo} from './card/card-demo';
//import {RadioDemo} from './radio/radio-demo';
//import {ButtonToggleDemo} from './button-toggle/button-toggle-demo';
//import {ProgressCircleDemo} from './progress-circle/progress-circle-demo';
//import {TooltipDemo} from './tooltip/tooltip-demo';
//import {ListDemo} from './list/list-demo';
//import {BaselineDemo} from './baseline/baseline-demo';
//import {GridListDemo} from './grid-list/grid-list-demo';
//import {LiveAnnouncerDemo} from './live-announcer/live-announcer-demo';
//import {OverlayDemo, SpagettiPanel, RotiniPanel} from './overlay/overlay-demo';
//import {SlideToggleDemo} from './slide-toggle/slide-toggle-demo';
//import {ToolbarDemo} from './toolbar/toolbar-demo';
//import {ButtonDemo} from './button/button-demo';
//import {MdCheckboxDemoNestedChecklist, CheckboxDemo} from './checkbox/checkbox-demo';
//import {SliderDemo} from './slider/slider-demo';
//import {SidenavDemo} from './sidenav/sidenav-demo';
//import {PortalDemo, ScienceJoke} from './portal/portal-demo';
//import {MenuDemo} from './menu/menu-demo';
//import {TabsDemo} from './tabs/tab-group-demo';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(DEMO_APP_ROUTES),
    Md2Module.forRoot(),
    MdButtonModule,
    MdListModule,
    MdSidenavModule,
    MdRippleModule,
    MdToolbarModule,
    PortalModule,
    RtlModule,
    MdIconModule.forRoot(),
    OverlayModule.forRoot(),
  ],
  declarations: [
    AccordionDemo,
    AutocompleteDemo,
    ChipsDemo,
    CollapseDemo,
    ColorpickerDemo,
    DatepickerDemo,
    DialogDemo,
    MenuDemo,
    MultiselectDemo,
    SelectDemo,
    TabsDemo,
    TagsDemo,
    ToastDemo,
    TooltipDemo,

    //BaselineDemo,
    //ButtonDemo,
    //ButtonToggleDemo,
    //CardDemo,
    //CheckboxDemo,
    //DemoApp,
    //DialogDemo,
    //GesturesDemo,
    //GridListDemo,
    //Home,
    //IconDemo,
    //InputDemo,
    //JazzDialog,
    //ListDemo,
    //LiveAnnouncerDemo,
    //MdCheckboxDemoNestedChecklist,
    //MenuDemo,
    //OverlayDemo,
    //PortalDemo,
    //ProgressBarDemo,
    //ProgressCircleDemo,
    //RadioDemo,
    //RippleDemo,
    //RotiniPanel,
    //ScienceJoke,
    //SidenavDemo,
    //SliderDemo,
    //SlideToggleDemo,
    //SpagettiPanel,
    //TabsDemo,
    //ToolbarDemo,
    //TooltipDemo,
  ],
  entryComponents: [
    DemoApp,
    //JazzDialog,
    //RotiniPanel,
    //ScienceJoke,
    //SpagettiPanel,
  ],
})
export class DemoAppModule {
  constructor(private _appRef: ApplicationRef) { }

  ngDoBootstrap() {
    this._appRef.bootstrap(DemoApp);
  }
}
