import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import { firebase as config } from './config'

export default firebase.initializeApp(config)

export const db = firebase.firestore()
export const auth = firebase.auth()
export const functions = firebase.functions()

export interface DBUser {
  subscriptionStatus?: null | 'active' | 'incomplete' | 'trialing'
}
