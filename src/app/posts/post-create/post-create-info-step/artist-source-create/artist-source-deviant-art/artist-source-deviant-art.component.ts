import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../../../../store/app.reducer";
import {URL_REGEX} from "../../../../../shared/config/common.constats";
import {updateSourceData} from "../../../store/post-create.actions";

@Component({
    selector: 'app-artist-source-deviant-art',
    templateUrl: './artist-source-deviant-art.component.html',
    styleUrls: ['./artist-source-deviant-art.component.css']
})
export class ArtistSourceDeviantArtComponent implements OnInit {

    artistSourceForm!: FormGroup;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.artistSourceForm = new FormGroup({
            artistUrl: new FormControl(null, [Validators.pattern(URL_REGEX)])
        });
    }

    onChange(): void {
        let url = this.artistSourceForm.controls.artistUrl.value;
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
