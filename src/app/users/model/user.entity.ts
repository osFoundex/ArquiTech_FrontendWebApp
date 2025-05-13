export class UserEntity {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  profile_picture: string;


  constructor(user:{user_id: number, name: string, email: string, password: string, role: string, profile_picture: string}) {
    this.user_id = user.user_id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.profile_picture = user.profile_picture;
  }
}
