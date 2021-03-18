import { storage } from "@/firebase";

const downloadFile = async(referencePath) => {
    return storage.ref().child(referencePath).getDownloadURL()
        .then((url) => {
            return url;
        })
        .catch((error) => {
            console.log(error)
            return null;
        });
}

const uploadFile = async(file, reference) => {
    return storage.ref().child(reference).put(file)
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
