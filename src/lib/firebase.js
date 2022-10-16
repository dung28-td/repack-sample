import storage from "@react-native-firebase/storage"
import firestore from '@react-native-firebase/firestore'

export const bucket = storage()
export const db = firestore()
