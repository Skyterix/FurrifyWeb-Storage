import {Component, OnInit} from '@angular/core';
import {PostCreateService} from "./post-create.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    isFetching = false;
    errorMessage: string | null = null;

    constructor(private postCreateService: PostCreateService) {
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.postCreateService.postCreateCloseEvent.emit();
    }
}
