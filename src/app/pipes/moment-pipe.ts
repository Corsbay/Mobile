import { Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'momentPipe'
})
export class MomentPipe implements PipeTransform {
  transform(data, format) {
  	// if input data format is provided
    if(format == 'to'){
        let mNow = moment();
        return mNow.to(data);
    }
  	else if(format[1]){
  		if(format[1] == "timestamp"){
  			return moment(data, 'x').format(format[0]);
  		}else{
  			return moment(data, format[1]).format(format[0]);
  		}
  	}else{
  		return moment(data).format(format);
  	}
	}
}