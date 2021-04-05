import { hash, compare } from 'bcrypt';

export class Helper {
  static hashPassword(password: string, salt: number): Promise<string> {
    return hash(password, salt);
  }

  static passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }
}
