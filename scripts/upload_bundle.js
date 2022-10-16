const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { readdirSync } = require('fs');

const serviceAccount = require('../secrets/firebase_sak.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const bucket = getStorage().bucket();
const version = process.env.GITHUB_REF_NAME

const uploadBundle = (file, destination) => {
  console.log("Start upload", file)

  return bucket.upload(file, {
    gzip: true,
    destination,
    public: true
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

const main = () => {
  console.log('Start upload bundles')

  return Promise.all(uploadBundles('ios'), uploadBundles('android'))
    .then(() => console.log("Upload bundles successfully!"))
    .catch(err => console.error("Failed to upload bundles.", err))
}

main()