import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {updateSourceData} from "../../store/post-create.actions";
import {URL_REGEX} from "../../../../shared/config/common.constats";

@Component({
    selector: 'app-attachment-source-deviant-art',
    templateUrl: './attachment-source-deviant-art.component.html',
    styleUrls: ['./attachment-source-deviant-art.component.css']
})
export class AttachmentSourceDeviantArtComponent implements OnInit {

    attachmentSourceForm!: FormGroup;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.attachmentSourceForm = new FormGroup({
            deviationUrl: new FormControl(null, [Validators.pattern(URL_REGEX)])
        });
    }

    onChange(): void {
        let url = this.attachmentSourceForm.controls.deviationUrl.value;
        // If url is empty set it to null to prevent form from being valid
        if (url === "") {
            url = null;
        }

        this.store.dispatch(updateSourceData({
            data: {
                url: url
            }
        }));
    }

}
