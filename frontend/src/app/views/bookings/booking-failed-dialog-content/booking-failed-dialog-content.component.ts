import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    template: `
        <div class="additional-content margin-top">
            <div class="additional-content-line1">
                <ng-container *ngFor="let error of data.errors; let idx = index">{{error }}
                    <ng-container *ngIf="data.errors && data.errors.length > 1 && idx < data.errors.length - 1">,</ng-container>
                </ng-container>
            </div>
        </div>`,
    encapsulation: ViewEncapsulation.None,
})
export class BookingFailedDialogContentComponent {
    @Input()
    public data: any;
}
