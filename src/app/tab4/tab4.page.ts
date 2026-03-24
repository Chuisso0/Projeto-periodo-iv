import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonItem, IonButton, IonList, IonIcon, IonAvatar, IonLabel, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonItem, IonButton, IonList, IonIcon, IonAvatar, IonLabel, IonToolbar, CommonModule, FormsModule]
})
export class Tab4Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
