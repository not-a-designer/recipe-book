import { EventEmitter, Injectable } from '@angular/core';


@Injectable()
export class MenuHelperService {
    tabChanged: EventEmitter<string> = new EventEmitter<string>();
}