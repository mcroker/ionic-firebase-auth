import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, OnChanges, OnInit, Output,
  SimpleChanges, TemplateRef, ViewChild
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthProcessService, FirebaseService, MalSharedConfig, MalSharedConfigToken, UiService } from 'ngx-firebase';

interface VerifyEmailContext {
  email: string;
  goBackURL: string;
}

@Component({
  selector: 'mal-authui-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailConfirmationComponent implements OnInit, OnChanges {

  @Input() email?: string;
  @Input() goBackURL?: string;

  // Template to use in place of default template
  @Input() template?: TemplateRef<any>;

  @Output() signOut = new EventEmitter();

  // Final template
  verifyEmailTemplate?: TemplateRef<any>;
  // Context hash to use for verifyEmailTemplate.
  verifyEmailContext: VerifyEmailContext = this.createTemplateContext();

  isLoading: boolean = false;

  @ViewChild('defaultVerifyEmail', { static: true }) defaultTemplate?: TemplateRef<any>;

  constructor(
    private aps: AuthProcessService,
    private changeDetectorRef: ChangeDetectorRef,
    private navController: NavController,
    private fire: FirebaseService,
    private ui: UiService,
    @Inject(forwardRef(() => MalSharedConfigToken)) public config: MalSharedConfig,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.verifyEmailTemplate && changes.verifyEmailTemplate.currentValue == null) {
      this.verifyEmailTemplate = this.defaultTemplate;
      // console.log('ngOnChanges - defaultTemplate:', this.verifyEmailTemplate);
    }
    this.verifyEmailContext = this.createTemplateContext();
  }

  ngOnInit(): void {
    if (!this.verifyEmailTemplate) {
      // console.log('ngOnInit - defaultTemplate');
      this.verifyEmailTemplate = this.defaultTemplate;
    }
    this.verifyEmailContext = this.createTemplateContext();
    // console.log('verifyEmailTemplate:', this.verifyEmailTemplate);
    // console.log('verifyEmailContext:', this.verifyEmailContext);
  }

  async continue() {
    try {
      await this.aps.reloadUserInfo();
      await this.navController.navigateBack([this.goBackURL]);
    } catch (error) {
      this.notifyError(error);
    }
  }

  async sendNewVerificationEmail() {
    try {
      this.isLoading = true;
      this.changeDetectorRef.markForCheck();
      await this.aps.sendNewVerificationEmail();
      this.ui.toast('auth.emailConfirmation.onConfirmationSuccess');
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  private createTemplateContext(): any {
    return {
      email: this.email,
      goBackURL: this.goBackURL,
    };
  }

  private notifyError(error: any) {
    this.fire.recordException(error);
    if (this.config.authUi.toastMessageOnAuthError) {
      const message = error.toString() || 'Sorry, something went wrong. Please retry later.';
      this.ui.toast(message, { duration: this.config.authUi.toastDefaultDurationMil });
    }
  }
}
