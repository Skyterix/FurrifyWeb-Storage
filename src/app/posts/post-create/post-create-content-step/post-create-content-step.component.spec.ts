import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostCreateContentStepComponent} from './post-create-content-step.component';

describe('PostCreateContentStepComponent', () => {
    let component: PostCreateContentStepComponent;
    let fixture: ComponentFixture<PostCreateContentStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PostCreateContentStepComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PostCreateContentStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
