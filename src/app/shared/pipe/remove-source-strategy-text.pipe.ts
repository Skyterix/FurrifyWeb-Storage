import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'removeSourceStrategyText'
})
export class RemoveSourceStrategyTextPipe implements PipeTransform {

    transform(value: string, ...args: string[]): unknown {
        let newValue = value.replace('SourceStrategy', '');

        // Remove versioning from strategy
        return newValue.substring(0, newValue.lastIndexOf("V"));
    }

}
