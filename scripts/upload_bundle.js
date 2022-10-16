const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { getFirestore } = require('firebase-admin/firestore')
const { readdirSync } = require('fs');

const serviceAccount = require('../secrets/firebase_sak.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const bucket = getStorage().bucket();
const db = getFirestore();

const version = process.env.GITHUB_REF_NAME

const uploadBundle = (file, destination) => {
  console.log("Start upload", file)

  return bucket.upload(file, {
    gzip: true,
    destination,
    ...(file.endsWith('.bundle') && {
      metadata: {
        contentType: 'text/javascript'
      }
    })
  })
    .then(() => console.log(`Upload file "${file}" successfully!`))
    .catch(err => console.error(`Failed to upload file "${file}"`, err))
}

const uploadBundles = platform => {
  const dir = `build/output/${platform}/remote`

  return Promise.all(readdirSync(dir).map(filename => {
    const file = `${dir}/${filename}`
    const destination = `${version}/${platform}/${filename}`

    return uploadBundle(file, destination)
  }))
}

const main = async () => {
  console.log('Start upload bundles')
  await uploadBundles('ios'),
  await uploadBundles('android')
  console.log("Upload bundles successfully!")

  console.log("Updating app version ...")
  await db.doc('settings/appConfig').update({ version })
}

main()