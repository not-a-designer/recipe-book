import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-db-options',
    template: `
        <ion-grid>
            <ion-row>
                <ion-col text-center>
                    <h3>Save & Load</h3>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col text-center>
                    <button ion-button outline (click)="onAction('load')">Load List</button>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col text-center>
                    <button ion-button outline (click)="onAction('save')">Save List</button>
                </ion-col>
            </ion-row>
        </ion-grid>
    `
})
export class DbOptionsPage {

    constructor(private viewCtrl: ViewController) {

    }

    onAction(action: string) {
        this.viewCtrl.dismiss({action: action});
    }
}