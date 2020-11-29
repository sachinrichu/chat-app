import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnChanges,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import firebase from "firebase";
import { DatePipe } from "@angular/common";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit {
  @ViewChild("chatcontent", { read: ElementRef, static: false })
  chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  userName = "";
  chatStore = "";
  message = "";
  users = [];
  chats = [];
  matcher = new MyErrorStateMatcher();
  currentUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.userName = localStorage.getItem("userName");
    this.chats = [];
    firebase
      .database()
      .ref("users/")
      .orderByChild("userName")
      .equalTo(this.userName)
      .on("value", (resp: any) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        this.currentUser = roomuser.find((x) => x.userName === this.userName);
        if (this.currentUser !== undefined) {
          const userRef = firebase
            .database()
            .ref("users/" + this.currentUser.key);
          userRef.update({ status: "online" });
        }
      });

    firebase
      .database()
      .ref("users/")
      .orderByChild("status")
      .equalTo("online")
      .on("value", (resp2: any) => {
        this.users = snapshotToArray(resp2).filter(
          (user) => user.userName !== this.currentUser.userName
        );
      });
  }

  ngOnInit() {
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }
  startChat(userKey: any) {
    if (this.currentUser.key > userKey)
      this.chatStore = userKey.concat(this.currentUser.key);
    else this.chatStore = this.currentUser.key.concat(userKey);

    firebase
      .database()
      .ref("chats/" + this.chatStore)
      .on("value", (resp) => {
        this.chats = snapshotToArray(resp);
        setTimeout(
          () => (this.scrolltop = this.chatcontent.nativeElement.scrollHeight),
          500
        );
      });
  }
  onFormSubmit(form: any) {
    const chat = form;
    chat.userName = this.userName;
    chat.date = this.datepipe.transform(new Date(), "dd/MM/yyyy HH:mm:ss");
    chat.type = "message";
    const newMessage = firebase
      .database()
      .ref("chats/" + this.chatStore)
      .push();
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }

  exitChat() {
    const chat = { userName: "", message: "", date: "", type: "" };
    chat.userName = this.userName;
    chat.date = this.datepipe.transform(new Date(), "dd/MM/yyyy HH:mm:ss");
    chat.message = `${this.userName} went offline`;
    chat.type = "exit";
    const newMessage = firebase
      .database()
      .ref("chats/" + this.chatStore)
      .push();
    newMessage.set(chat);

    firebase
      .database()
      .ref("users/")
      .orderByChild("userName")
      .equalTo(this.userName)
      .on("value", (resp: any) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        this.currentUser = roomuser.find((x) => x.userName === this.userName);
        if (this.currentUser !== undefined) {
          const userRef = firebase
            .database()
            .ref("users/" + this.currentUser.key);
          userRef.update({ status: "offline" });
        }
      });
      this.router.navigate([''])
  }

}
