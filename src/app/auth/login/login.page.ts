import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonText,
  IonSpinner,
  IonAlert,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, mail, lockClosed, person, image } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  loginMethod: 'email' | 'face' = 'email';

  constructor(
    private authService: AuthService,
    private cameraService: CameraService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({ camera, mail, lockClosed, person, image });
  }

  // Cambiar método de login
  toggleLoginMethod() {
    this.loginMethod = this.loginMethod === 'email' ? 'face' : 'email';
  }

  // Login con email
  async loginWithEmail() {
    if (!this.email || !this.password) {
      this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    this.isLoading = true;
    
    try {
      await this.authService.loginWithEmail(this.email, this.password).toPromise();
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.showToast(error.mensaje || 'Error al iniciar sesión', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // Login con reconocimiento facial - capturar foto
  async loginWithFaceCapture() {
    const loading = await this.loadingController.create({
      message: 'Accediendo a la cámara...'
    });
    await loading.present();

    try {
      const imageFile = await this.cameraService.capturePhoto();
      await loading.dismiss();
      
      if (imageFile) {
        await this.processeFaceLogin(imageFile);
      }
    } catch (error) {
      await loading.dismiss();
      this.showToast('Error al acceder a la cámara', 'danger');
    }
  }

  // Login con reconocimiento facial - seleccionar archivo
  async loginWithFaceFile() {
    try {
      const imageFile = await this.cameraService.selectImageFile();
      if (imageFile) {
        await this.processeFaceLogin(imageFile);
      }
    } catch (error) {
      this.showToast('Error al seleccionar la imagen', 'danger');
    }
  }

  // Procesar login facial
  private async processeFaceLogin(imageFile: File) {
    const loading = await this.loadingController.create({
      message: 'Procesando reconocimiento facial...'
    });
    await loading.present();

    try {
      const response = await this.authService.loginWithFace(imageFile).toPromise();
      await loading.dismiss();
      
      if (response?.token) {
        this.showToast('¡Bienvenido! Login exitoso', 'success');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      await loading.dismiss();
      this.showToast(error.error?.mensaje || 'No se pudo autenticar', 'danger');
    }
  }

  // Ir a registro
  goToRegister() {
    this.router.navigate(['/register']);
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