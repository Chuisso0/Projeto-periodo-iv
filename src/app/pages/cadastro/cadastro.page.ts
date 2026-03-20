import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonItem } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
// import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonItem, CommonModule, FormsModule, RouterModule]
})
export class CadastroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
