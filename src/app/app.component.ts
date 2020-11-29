import { Component } from "@angular/core";
import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBNrdhFjZOr6imMjlSt-_CyDPCsW73wxwI",
  authDomain: "angularchatapp-c08e5.firebaseapp.com",
  databaseURL: "https://angularchatapp-c08e5.firebaseio.com",
  projectId: "angularchatapp-c08e5",
  storageBucket: "angularchatapp-c08e5.appspot.com",
  messagingSenderId: "1002417456845",
  appId: "1:1002417456845:web:8025cdd74849048fa14b84"
};
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "chat-app";

  constructor() {
    firebase.initializeApp(firebaseConfig);
  }
}
