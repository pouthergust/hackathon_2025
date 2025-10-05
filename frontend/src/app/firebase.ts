
import { Injectable } from '@angular/core';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

@Injectable({
  providedIn: 'root'
})
export class Firebase {
  // Your web app's Firebase configuration
  private firebaseConfig = {
    apiKey: "AIzaSyAQbCyGzxEvRNvuajsaiRRdnQx-zK9PQpg",
    authDomain: "hackthon-nasa-2025.firebaseapp.com",
    projectId: "hackthon-nasa-2025",
    storageBucket: "hackthon-nasa-2025.firebasestorage.app",
    messagingSenderId: "259960336947",
    appId: "1:259960336947:web:9e76d6a499ebdb573d2946",
    measurementId: "G-0LTKE8W5WS"
  };

  public app;
  public analytics;

  constructor() {
    // Initialize Firebase
    this.app = initializeApp(this.firebaseConfig);
    this.analytics = getAnalytics(this.app);
  }
}
