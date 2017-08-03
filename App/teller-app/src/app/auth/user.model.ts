export class User {
  public fullname:string;
  public email:string;
  public userID:string;

  constructor(fullname: string, email:string, userid:string){
    this.fullname = fullname;
    this.email = email;
    this.userID = userid;
  }

}
