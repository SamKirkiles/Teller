export class User {
  public fullname:string;
  public email:string;
  public userID:string;
  public messengerID:string;

  constructor(fullname:string, email:string, userid:string, messengerID:string){
    this.fullname = fullname;
    this.email = email;
    this.userID = userid;
    this.messengerID = messengerID;
  }

}
