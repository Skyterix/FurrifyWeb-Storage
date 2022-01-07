import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {updateSourceData} from "../../../store/posts.actions";

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
            deviationId: new FormControl(null, [Validators.required])
        });
    }

    onChange(): void {
        let id = this.attachmentSourceForm.controls.deviationId.value;
        // If id is empty set it to null to prevent form from being valid
        if (id === "") {
            id = null;
        }

        this.store.dispatch(updateSourceData({
            data: {
                id: id
            }
        }));
    }

}
