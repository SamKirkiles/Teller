export class User {
  public fullname:string;
  public email:string;
  public userID:string;
  public facebookID:string;

  constructor(fullname: string, email:string, userid:string, facebookID:string){
    this.fullname = fullname;
    this.email = email;
    this.userID = userid;
    this.facebookID = facebookID;
  }

}
