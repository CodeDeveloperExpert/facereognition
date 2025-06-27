import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  // Capturar foto usando la cámara web
  async capturePhoto(): Promise<File | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });

      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Esperar un momento para que la cámara se estabilice
          setTimeout(() => {
            if (context) {
              context.drawImage(video, 0, 0);
              
              canvas.toBlob((blob) => {
                // Detener el stream
                stream.getTracks().forEach(track => track.stop());
                
                if (blob) {
                  const file = new File([blob], 'face-photo.jpg', { type: 'image/jpeg' });
                  resolve(file);
                } else {
                  reject(new Error('No se pudo capturar la imagen'));
                }
              }, 'image/jpeg', 0.8);
            } else {
              reject(new Error('No se pudo obtener el contexto del canvas'));
            }
          }, 1000);
        };

        video.onerror = () => {
          stream.getTracks().forEach(track => track.stop());
          reject(new Error('Error al acceder a la cámara'));
        };
      });

    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      throw new Error('No se pudo acceder a la cámara');
    }
  }

  // Seleccionar archivo de imagen
  selectImageFile(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        resolve(file || null);
      };
      
      input.oncancel = () => {
        resolve(null);
      };
      
      input.click();
    });
  }
}