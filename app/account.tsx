import {createContext,useContext} from 'react';
export type Account={uid:string;ministryId:string;name:string};
export const AccountContext=createContext<Account|null>(null);
export function useAccount(){const account=useContext(AccountContext);if(!account)throw new Error('Account access has not been verified.');return account;}
