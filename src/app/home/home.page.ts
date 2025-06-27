import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton, 
  IonIcon,
  IonText,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOut, person, people, refresh } from 'ionicons/icons';

import { AuthService, Usuario } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonText,
    IonAvatar,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner
  ]
})
export class HomePage implements OnInit {
  currentUser: Usuario | null = null;
  users: Usuario[] = [];
  isLoadingUsers: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ logOut, person, people, refresh });
  }

  ngOnInit() {
    // Obtener usuario actual
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Cargar lista de usuarios
    this.loadUsers();
  }

  // Cargar lista de usuarios registrados
  async loadUsers() {
    this.isLoadingUsers = true;
    
    try {
      const users = await this.authService.getUsers().toPromise();
      this.users = users || [];
    } catch (error) {
      this.showToast('Error al cargar usuarios', 'danger');
      this.users = [];
    } finally {
      this.isLoadingUsers = false;
    }
  }

  // Cerrar sesión
  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
            this.showToast('Sesión cerrada correctamente', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  // Mostrar toast
  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}