import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Agar dapat digunakan di parent component, custom event yang 
  // akan digunakan oleh parent component
 @Output() featureSelected = new EventEmitter<string>();

 onSelect(feature:string){
  //  Mempublish argument feature ke luar component
   this.featureSelected.emit(feature);
 }

}
