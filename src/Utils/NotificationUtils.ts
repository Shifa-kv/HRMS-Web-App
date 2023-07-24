import { Timestamp, firestore } from "../Firebase/Config";

const AddNotification = (title: string, user:string, message?: string, linkTo?: string, linkPage?: string):any => {

    firestore.collection("notifications").add({
        title,
        message,
        linkTo,
        linkPage,
        timestamp: Timestamp.now(),
        read:false,
        user:user
    }).then((res) => {
        return console.log('notify',res);
    }).catch((error) => {
        return console.log("Error adding notification : ", error);
    });
}

export default AddNotification