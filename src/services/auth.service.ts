import firebase from 'firebase';


export class AuthService {
    private token: string = '';

    signup(email: string, password: string) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }


    signin(email: string, password: string) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    logout() {
        firebase.auth().signOut();
    }

    getCurrentUser() {
        firebase.auth().currentUser.getIdToken(true)
            .then(
                (token) => {
                    return this.token = token;
                }
            );
        console.log(this.token);
        let user = firebase.auth().currentUser;
        console.log('user ' + user);
        return user;
        
        
    }
}
