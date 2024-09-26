import { Environment } from './environment.model';

export class environment extends Environment {
  public override apiUrl: string = 'http://localhost:3360/';
  public override firebase: any = {
    apiKey: 'AIzaSyASp7PujepIKyF80AaFfKxEDsJ_8Fazkmg',
    authDomain: 'productshowing-708f8.firebaseapp.com',
    databaseURL: 'https://productshowing-708f8-default-rtdb.firebaseio.com',
    projectId: 'productshowing-708f8',
    storageBucket: 'productshowing-708f8.appspot.com',
    messagingSenderId: '557274771127',
    appId: '1:557274771127:web:b3e7f352f876479553a732',
    measurementId: 'G-R11XTVEBY5',
  };
}

export const ENV: Environment = new environment();
