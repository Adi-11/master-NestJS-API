import { hash, compare } from 'bcrypt';

export class Helper {
  static hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  static passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }
}
