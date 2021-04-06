// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// Mal
import { IAPurchaseService } from 'ionic-firebase-iap';
// Ionic
import { IonicModule } from '@ionic/angular';
// Translate
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
// Angular Fire
// Fakes
import { FakeIAPurchaseService } from './fakes';
export const MODULES = [
    CommonModule,
    IonicModule,
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
];
export class AuthTestingModule {
}
AuthTestingModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    ...MODULES,
                    TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                    })
                ],
                exports: [
                    ...MODULES,
                    TranslateModule
                ],
                providers: [
                    // mal fakes
                    { provide: IAPurchaseService, useClass: FakeIAPurchaseService }
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0aW5nL3NyYy90ZXN0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDNUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFOUQsTUFBTTtBQUNOLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXZELFFBQVE7QUFDUixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsWUFBWTtBQUNaLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFNUYsZUFBZTtBQUVmLFFBQVE7QUFDUixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFaEQsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHO0lBQ3JCLFlBQVk7SUFDWixXQUFXO0lBQ1gsb0JBQW9CO0lBQ3BCLHVCQUF1QjtJQUN2QixtQkFBbUI7Q0FDcEIsQ0FBQztBQWtCRixNQUFNLE9BQU8saUJBQWlCOzs7WUFoQjdCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsR0FBRyxPQUFPO29CQUNWLGVBQWUsQ0FBQyxPQUFPLENBQUM7d0JBQ3RCLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFO3FCQUNwRSxDQUFDO2lCQUNIO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxHQUFHLE9BQU87b0JBQ1YsZUFBZTtpQkFDaEI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULFlBQVk7b0JBQ1osRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUFFO2lCQUNoRTthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQW5ndWxhclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOb29wQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50VGVzdGluZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwL3Rlc3RpbmcnO1xuaW1wb3J0IHsgUm91dGVyVGVzdGluZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlci90ZXN0aW5nJztcblxuLy8gTWFsXG5pbXBvcnQgeyBJQVB1cmNoYXNlU2VydmljZSB9IGZyb20gJ2lvbmljLWZpcmViYXNlLWlhcCc7XG5cbi8vIElvbmljXG5pbXBvcnQgeyBJb25pY01vZHVsZSB9IGZyb20gJ0Bpb25pYy9hbmd1bGFyJztcblxuLy8gVHJhbnNsYXRlXG5pbXBvcnQgeyBUcmFuc2xhdGVGYWtlTG9hZGVyLCBUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuXG4vLyBBbmd1bGFyIEZpcmVcblxuLy8gRmFrZXNcbmltcG9ydCB7IEZha2VJQVB1cmNoYXNlU2VydmljZSB9IGZyb20gJy4vZmFrZXMnO1xuXG5leHBvcnQgY29uc3QgTU9EVUxFUyA9IFtcbiAgQ29tbW9uTW9kdWxlLFxuICBJb25pY01vZHVsZSxcbiAgTm9vcEFuaW1hdGlvbnNNb2R1bGUsXG4gIEh0dHBDbGllbnRUZXN0aW5nTW9kdWxlLFxuICBSb3V0ZXJUZXN0aW5nTW9kdWxlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIC4uLk1PRFVMRVMsXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xuICAgICAgbG9hZGVyOiB7IHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlciwgdXNlQ2xhc3M6IFRyYW5zbGF0ZUZha2VMb2FkZXIgfVxuICAgIH0pXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICAuLi5NT0RVTEVTLFxuICAgIFRyYW5zbGF0ZU1vZHVsZVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICAvLyBtYWwgZmFrZXNcbiAgICB7IHByb3ZpZGU6IElBUHVyY2hhc2VTZXJ2aWNlLCB1c2VDbGFzczogRmFrZUlBUHVyY2hhc2VTZXJ2aWNlIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBBdXRoVGVzdGluZ01vZHVsZSB7IH1cbiJdfQ==