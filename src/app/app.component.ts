import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NzNotificationService, NzNotificationPlacement } from 'ng-zorro-antd/notification';
import { MAX_DOWN, MAX_RIGHT, MIN_LEFT, MIN_UP, MOVE_THRESHOLD } from './app.constant';
import { IBoxesInfo, ISelectedBox } from './app.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'movable-box-flytbase';
  public selectedBox: ISelectedBox = {
    id: -1,
    box: undefined
  }
  public boxesInfo: IBoxesInfo = {
    boxes: [],
    isFocused: false,
    toggleEnable: true,
    boxContainer: undefined
  }

  constructor(
    private notification: NzNotificationService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.boxesInfo.boxContainer = document.getElementById("container");
  }

  ngAfterViewInit() {
    this.KeyListener();
  }
  
  public generateId(): number {
    return Math.round(Date.now() + Math.random());
  }

  public KeyListener() {
    let global = this;

    this.document.addEventListener('keydown', function (event) {
      let KeyPressed = event.key ? event.key.toLocaleLowerCase() : null;

      if(global.boxesInfo.isFocused && global.boxesInfo.toggleEnable) {
        switch(KeyPressed){
          case 'delete':
            global.deleteBox();
            break;
          
          case 'a':
            if(global.selectedBox.box.offsetLeft > MIN_LEFT) global.moveLeft();
            break;
          
          case 'd':
            if(global.selectedBox.box.offsetLeft < MAX_RIGHT) global.moveRight();
            break;
          
          case 's':
            if(global.selectedBox.box.offsetTop < MAX_DOWN) global.moveDown();
            break;
          
          case 'w':
            if(global.selectedBox.box.offsetTop > MIN_UP) global.moveUp();
            break;
        }
      }
    });
  }

  public moveLeft(): void {
    let selectedStyle = this.selectedBox.box?.style;
    let pixels = selectedStyle.right?.split('px')[0];
    let SelectedLeft = selectedStyle.left?.split('px')[0];

    selectedStyle.right = `${Number(pixels) + MOVE_THRESHOLD}px`;
    selectedStyle.left = `${Number(SelectedLeft) - MOVE_THRESHOLD}px`;
  }

  public moveUp(): void {
    let selectedStyle = this.selectedBox.box?.style;
    let pixels = selectedStyle.bottom?.split('px')[0];
    let SelectedTop = selectedStyle.top.split('px')[0];

    selectedStyle.bottom = `${Number(pixels) + MOVE_THRESHOLD}px`;
    selectedStyle.top = `${Number(SelectedTop) - MOVE_THRESHOLD}px`;
  }

   public moveRight(): void {
    let selectedStyle = this.selectedBox.box?.style;
    let pixels = selectedStyle.left?.split('px')[0];
    let SelectedRight = selectedStyle.right.split('px')[0];

    selectedStyle.right = `${Number(SelectedRight) - MOVE_THRESHOLD}px`;
    selectedStyle.left = `${Number(pixels) + MOVE_THRESHOLD}px`;
  }

  public moveDown(): void {
    let selectedStyle = this.selectedBox.box?.style;
    let pixels = selectedStyle.top?.split('px')[0];
    let SelectedBottom = selectedStyle.bottom.split('px')[0];

    selectedStyle.bottom = `${Number(SelectedBottom) - MOVE_THRESHOLD}px`;
    selectedStyle.top = `${Number(pixels) + MOVE_THRESHOLD}px`;
  }

  public deleteBox(): void {
    const boxId = this.boxesInfo.boxes.indexOf(this.selectedBox.box);
    this.boxesInfo.boxes.splice(boxId, 1);
    this.boxesInfo.isFocused = false;
    this.selectedBox = {
      id: -1,
      box: undefined
    }
    this.notification.create(
      'success',
      'Success',
      'Box Deleted Successfully.',
      { nzPlacement: 'top' }
    );
  }

  public clearBoxes(): void {
    this.boxesInfo.boxes = [];
    this.boxesInfo.isFocused = false;
    this.selectedBox = {
      id: -1,
      box: undefined
    }
  }

  public selectBox(id: number): void {
    this.selectedBox.id = id;
    this.boxesInfo.isFocused = true;
    this.selectedBox.box = document.getElementById(`${id}`);
  }

  public addBox(): void {
    try {
      if(this.boxesInfo.boxes.length === 40) throw "size exceeded";
      let Id = this.generateId();
      this.boxesInfo.boxes.push(Id);
      this.notification.create(
        'success',
        'Success',
        'Box Added Successfully.',
        { nzPlacement: 'top' }
      );
    } catch (e) {
      this.notification.create(
        'error',
        'Error',
        'Maximum boxes reached.',
        { nzPlacement: 'top' }
      );
    }
  }
}
