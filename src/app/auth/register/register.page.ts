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
  IonProgressBar,
  IonBackButton,
  IonButtons,
  LoadingController,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, mail, camera, image, checkmarkCircle, arrowBack } from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { CameraService } from '../../services/camera.service';

interface RegistrationStep {
  step: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonSpinner,
    IonProgressBar,
    IonBackButton,
    IonButtons
  ]
})
export class RegisterPage {
  // Datos del formulario
  nombre: string = '';
  email: string = '';
  
  // Control del flujo
  currentStep: number = 1;
  isLoading: boolean = false;
  userId: string = '';
  
  // Pasos del registro
  steps: RegistrationStep[] = [
    {
      step: 1,
      title: 'Datos Personales',
      description: 'Ingresa tu nombre y email'
    },
    {
      step: 2,
      title: 'Foto de Perfil',
      description: 'Registra tu rostro para el reconocimiento facial'
    },
    {
      step: 3,
      title: 'Completado',
      description: '¡Registro exitoso!'
    }
  ];

  constructor(
    private authService: AuthService,
    private cameraService: CameraService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ person, mail, camera, image, checkmarkCircle, arrowBack });
  }

  // Obtener progreso actual
  get progress(): number {
    return this.currentStep / this.steps.length;
  }

  // Paso 1: Registrar datos básicos
  async registerBasicData() {
    if (!this.nombre.trim() || !this.email.trim()) {
      this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.showToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.authService.registerUser(this.nombre.trim(), this.email.trim()).toPromise();
      
      if (response?.id) {
        this.userId = response.id;
        this.currentStep = 2;
        this.showToast('Datos registrados correctamente', 'success');
      }
    } catch (error: any) {
      const errorMsg = error.error?.error || 'Error al registrar usuario';
      this.showToast(errorMsg, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // Paso 2: Capturar foto con cámara
  async capturePhoto() {
    const loading = await this.loadingController.create({
      message: 'Accediendo a la cámara...'
    });
    await loading.present();

    try {
      const imageFile = await this.cameraService.capturePhoto();
      await loading.dismiss();
      
      if (imageFile) {
        await this.uploadPhoto(imageFile);
      }
    } catch (error) {
      await loading.dismiss();
      this.showToast('Error al acceder a la cámara', 'danger');
    }
  }

  // Paso 2: Seleccionar archivo de imagen
  async selectPhotoFile() {
    try {
      const imageFile = await this.cameraService.selectImageFile();
      if (imageFile) {
        await this.uploadPhoto(imageFile);
      }
    } catch (error) {
      this.showToast('Error al seleccionar la imagen', 'danger');
    }
  }

  // Subir foto al servidor
  private async uploadPhoto(imageFile: File) {
    const loading = await this.loadingController.create({
      message: 'Subiendo foto...'
    });
    await loading.present();

    try {
      await this.authService.uploadPhoto(this.userId, imageFile).toPromise();
      await loading.dismiss();
      
      this.currentStep = 3;
      this.showToast('¡Foto registrada exitosamente!', 'success');
    } catch (error: any) {
      await loading.dismiss();
      const errorMsg = error.error?.error || 'Error al subir la foto';
      this.showToast(errorMsg, 'danger');
    }
  }

  // Saltar el paso de la foto (opcional)
  async skipPhotoStep() {
    const alert = await this.alertController.create({
      header: 'Saltar registro de foto',
      message: 'Si no registras tu foto, no podrás usar el reconocimiento facial para iniciar sesión. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Saltar',
          handler: () => {
            this.currentStep = 3;
          }
        }
      ]
    });

    await alert.present();
  }

  // Finalizar registro e ir al login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Volver al paso anterior
  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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