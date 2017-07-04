import { Pipe } from '@angular/core';


@Pipe({
	name: 'distancePipe'
})
export class DistancePipe {
	transform(data, format){

    if(format == "miles"){
      // let distance: number = Number(Number(data / 1.60934).toPrecision(2));
      let distance: number = Number(data / 1.60934);

      if(distance < 1){
        // Convert distance in miles to foot if less then 1 mile
        let dist = Math.floor(distance * 5280).toString();
        dist = dist + " feet";
        return dist;
      }else{
        let dist = Math.floor(distance) + " miles";
        return dist;
      }
      
    }

	}
}