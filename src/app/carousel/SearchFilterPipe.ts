import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})

export class SearchFilterPipe implements PipeTransform {
    transform(value: any, rName: string): any {
        if (rName === "") {
            return value;
        }
        const restaurantArray: any[] = [];
        for (let i = 0; i < value.length; i++) {
            let restName: string = value[i].restaurantName;
            if (restName.toUpperCase().startsWith(rName.toUpperCase())) {
                restaurantArray.push(value[i])
            }
        }
        return restaurantArray;
    }

}