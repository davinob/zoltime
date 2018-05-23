import {ElementRef, HostListener, Directive, OnInit} from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Directive({
  selector: 'ion-textarea[autosize]'
})

export class Autosize implements OnInit{

  @HostListener('input', ['$event.target'])
  onInput(textArea:HTMLTextAreaElement):void {
    this.adjust();
  }

  
  constructor(public element:ElementRef) {
  }

  @HostListener('change')
  onChange():void {
    setTimeout(() => this.adjust(), 0);
  }

  ngOnInit():void {
    setTimeout(() => this.adjust(), 0);
  }

  adjust():void {
    let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + "px";
  }
}