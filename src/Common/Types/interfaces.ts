import { UserType } from '../../DB/Models';

export interface IAuthUser {
  user: UserType;
  token: object;
}
