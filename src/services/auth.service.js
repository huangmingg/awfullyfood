import { authService } from "@/firebase";
import { router } from "@/routes";

const signOut = async () => {
    await authService.signOut();
    await router.push('/login');
}

export {
    signOut
}
