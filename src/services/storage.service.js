import { storage } from "@/firebase";

const downloadFile = async(referencePath) => {
    storage.ref().child(referencePath).getDownloadURL()
        .then((url) => {
            return url;
        })
        .catch((error) => {
            console.log(error)
            return null;
        });
}

const uploadFile = async(file, reference) => {
    storage.ref().child(reference).put(file)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

export {
    uploadFile,
    downloadFile
}
