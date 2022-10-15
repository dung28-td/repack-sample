import { ScriptManager, Script } from '@callstack/repack/client'
import chunks from '../../chunks.config.js'

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
  })
}