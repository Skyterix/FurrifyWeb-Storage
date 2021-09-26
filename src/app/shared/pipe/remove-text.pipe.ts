import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'removeText'
})
export class RemoveTextPipe implements PipeTransform {

    transform(value: string, ...args: string[]): unknown {
        return value.replace(args[0], '');
    }

}
