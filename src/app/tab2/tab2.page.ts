import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonInput, IonTitle, IonContent, IonIcon, IonItem } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonInput, IonIcon, IonTitle, IonItem, IonContent, ExploreContainerComponent]
})
export class Tab2Page {

  constructor() {
    addIcons({
      searchOutline
    });
  }

}
