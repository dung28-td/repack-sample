import { ScriptManager, Script } from '@callstack/repack/client'
import chunks from '../../chunks.config.js'
import { bucket, db } from './firebase'
import { Platform } from 'react-native'

export const manageScript = () => {
  ScriptManager.shared.addResolver(async scriptId => {
    if (__DEV__) {
      return {
        url: Script.getDevServerURL(scriptId),
        cache: false
      }
    }

    if (chunks.local.includes(scriptId)) {
      return {
        url: Script.getFileSystemURL(scriptId),
      };
    }

    const appConfig = await db.doc('settings/appConfig').get()
    const { version } = appConfig.data()
    const bundle = bucket.ref(`${version}/${Platform.OS}/${scriptId}.chunk.bundle`)
    const url = await bundle.getDownloadURL()
    return { url }
  })
}