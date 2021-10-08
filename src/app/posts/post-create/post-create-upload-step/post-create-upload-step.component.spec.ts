import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostCreateUploadStepComponent} from './post-create-upload-step.component';

describe('PostCreateUploadStepComponent', () => {
    let component: PostCreateUploadStepComponent;
    let fixture: ComponentFixture<PostCreateUploadStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PostCreateUploadStepComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PostCreateUploadStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
