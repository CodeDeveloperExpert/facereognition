import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  imagen?: string;
}

export interface AuthResponse {
  mensaje: string;
  token?: string;
  usuario?: Usuario;
  foto_perfil?: string;
}

export interface RegisterResponse {
  message: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Registro de usuario con datos básicos
  registerUser(nombre: string, email: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/usuarios/registro`, {
      nombre,
      email
    });
  }

  // Subir imagen para reconocimiento facial
  uploadPhoto(userId: string, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    
    return this.http.post(`${this.apiUrl}/usuarios/photoupload/${userId}`, formData);
  }

  // Login con reconocimiento facial
  loginWithFace(imageFile: File): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/usuarios/validate-photo`, formData)
      .pipe(
        map(response => {
          if (response.token && response.usuario) {
            this.setCurrentUser(response.usuario, response.token);
          }
          return response;
        })
      );
  }

  // Login con email (simulado - tu backend no lo tiene implementado)
  loginWithEmail(email: string, password: string): Observable<AuthResponse> {
    // Nota: Esta funcionalidad no está implementada en tu backend
    // Aquí simularemos la respuesta o podrías implementarla en Flask
    return new Observable(observer => {
      observer.error({ mensaje: 'Login con email no implementado en el backend' });
    });
  }

  // Obtener lista de usuarios
  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/listar`);
  }

  // Establecer usuario actual
  private setCurrentUser(user: Usuario, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    this.currentUserSubject.next(user);
  }

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }
}