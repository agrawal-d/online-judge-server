import { Request } from "express";
import { UserClass } from "./models";

export interface AuthorizedReq extends Request {
  user: UserClass;
}

/**

Profile {
  id: '103030061536658575074',
  displayName: 'Divyanshu Agrawal',
  name: { familyName: 'Agrawal', givenName: 'Divyanshu' },
  emails: [ { value: 'hereisdx@gmail.com', verified: true } ],
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a-/AOh14Gj9srHEJ3toipxRjBOY_gyYTQ_4ZgXAse2ni2tb4g=s96-c'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "103030061536658575074",\n' +
    '  "name": "Divyanshu Agrawal",\n' +
    '  "given_name": "Divyanshu",\n' +
    '  "family_name": "Agrawal",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a-/AOh14Gj9srHEJ3toipxRjBOY_gyYTQ_4ZgXAse2ni2tb4g\\u003ds96-c",\n' +
    '  "email": "hereisdx@gmail.com",\n' +
    '  "email_verified": true,\n' +
    '  "locale": "en-GB"\n' +
    '}',
  _json: {
    sub: '103030061536658575074',
    name: 'Divyanshu Agrawal',
    given_name: 'Divyanshu',
    family_name: 'Agrawal',
    picture: 'https://lh3.googleusercontent.com/a-/AOh14Gj9srHEJ3toipxRjBOY_gyYTQ_4ZgXAse2ni2tb4g=s96-c',
    email: 'hereisdx@gmail.com',
    email_verified: true,
    locale: 'en-GB'
  }
}

 */
