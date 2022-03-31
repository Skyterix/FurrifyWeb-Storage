import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../store/app.reducer";
import {URL_REGEX} from "../../../../shared/config/common.constats";
import {updateSourceData} from "../../store/post-create.actions";

@Component({
    selector: 'app-media-source-patreon',
    templateUrl: './media-source-patreon.component.html',
    styleUrls: ['./media-source-patreon.component.css']
})
export class MediaSourcePatreonComponent implements OnInit {

    mediaSourceForm!: FormGroup;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.mediaSourceForm = new FormGroup({
            postUrl: new FormControl(null, [Validators.pattern(URL_REGEX)])
        });
    }

    onChange(): void {
        let url = this.mediaSourceForm.controls.postUrl.value;
        // If id is empty set it to null to prevent form from being valid
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
