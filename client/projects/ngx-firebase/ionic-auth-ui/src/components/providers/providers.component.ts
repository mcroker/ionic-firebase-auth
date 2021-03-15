import { Component, Input, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { AuthProcessService, AuthProvider, MalSharedConfigToken, MalSharedConfig, UiService } from 'ngx-firebase';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NgxAuthFirebaseuiAnimations } from '../../animations';

export enum Layout {
  ROW = 'row',
  COLUMN = 'column'
}

export interface DisplayProvider {
  name: AuthProvider;
  icon?: string;
  label: string;
}
const displayProviders: { [key: string]: DisplayProvider } = {
  google: { name: AuthProvider.Google, icon: 'logo-google', label: 'Google' },
  apple: { name: AuthProvider.Apple, icon: 'logo-apple', label: 'Apple' },
  facebook: { name: AuthProvider.Facebook, icon: 'logo-facebook', label: 'Facebook' },
  twitter: { name: AuthProvider.Twitter, icon: 'logo-twitter', label: 'Twitter' },
  github: { name: AuthProvider.Github, icon: 'logo-github', label: 'GitHub' },
  microsoft: { name: AuthProvider.Microsoft, label: 'Microsoft' },
  yahoo: { name: AuthProvider.Yahoo, icon: 'logo-yahoo', label: 'Yahoo' }
};

declare type ProviderType = AuthProvider[] | AuthProvider;

@Component({
  selector: 'mal-authui-providers',
  templateUrl: 'providers.component.html',
  styleUrls: ['providers.component.scss', '../../ionic-auth-ui.scss'],
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthProvidersComponent {

  @Input() layout: string = Layout.ROW;

  @Input()
  get providers(): ProviderType | AuthProvider.ALL { return this.providers$.value; }
  set providers(val: ProviderType | AuthProvider.ALL) { this.providers$.next(val); }
  private providers$: BehaviorSubject<ProviderType | AuthProvider.ALL> = new BehaviorSubject<ProviderType>(AuthProvider.ALL);

  @Output() providerClick: EventEmitter<AuthProvider> = new EventEmitter<AuthProvider>();

  readonly displayProviders$: Observable<DisplayProvider[]> = this.providers$.pipe(
    // Filter for those in config
    map(providerOrArray => {
      if (providerOrArray === AuthProvider.ALL) {
        providerOrArray = this.config.authUi.supportedProviders;
      }
      const providers = Array.isArray(providerOrArray) ? providerOrArray : [providerOrArray];
      return providers.filter(item => this.providers === AuthProvider.ALL || this.providers.includes(item));
    }),
    // Filter for those valid on platform
    switchMap(async providers => {
      const providerFilter = await Promise.all(providers.map(item => this.aps.isProviderSupported(item)));
      return providers.filter((_item, index) => providerFilter[index]);
    }),
    // Map to display type
    map(providers => providers.map(item => displayProviders[item])),
    catchError(error => {
      this.ui.logError(error);
      return of([]);
    })
  );

  constructor(
    public aps: AuthProcessService,
    public ui: UiService,
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig
  ) {
  }

}
