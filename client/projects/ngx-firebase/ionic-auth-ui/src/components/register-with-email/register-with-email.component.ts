// Angular & Inionc
import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, OnDestroy, Output, ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// RxJS
import { Observable, Subject } from 'rxjs';

// Mal
import { NgxAuthFirebaseuiAnimations } from '../../animations';
import { AuthProcessService, UiService, MalSharedConfig, MalSharedConfigToken } from 'ngx-firebase';

export interface CreateAccountFormData {
  name: string,
  email: string,
  password: string,
  terms: boolean
}

@Component({
  selector: 'mal-authui-register-with-email',
  templateUrl: './register-with-email.component.html',
  styleUrls: ['../../ionic-auth-ui.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: NgxAuthFirebaseuiAnimations
})
export class AuthUIRegisterWithEmailComponent implements OnDestroy, AfterViewInit {

  @Output() createAccountClick: EventEmitter<CreateAccountFormData> = new EventEmitter<CreateAccountFormData>();

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    terms: new FormControl(true, []),
  });

  // Prevent somebody already logged in as guest - relogging in as gyest
  guestEnabled$: Observable<boolean> = this.aps.canSignInAsGuest$;

  // Private
  private destroy$: Subject<void> = new Subject<void>();

  // tslint:disable-next-line @typescript-eslint/ban-types
  constructor(
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
    public aps: AuthProcessService,
    private ui: UiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async doCreateAccount(): Promise<void> {
    this.createAccountClick.emit(this.registerForm.value);
  }

}
