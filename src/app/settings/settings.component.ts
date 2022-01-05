import {Component, OnInit} from '@angular/core';
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons/faArrowLeft";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    leftIcon = faArrowLeft;

    constructor() {
    }

    ngOnInit(): void {
    }

}
