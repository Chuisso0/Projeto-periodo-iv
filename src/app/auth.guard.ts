import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);

    // O authState "escuta" o Firebase para ver se existe um usuário válido
    return authState(auth).pipe(
        map(user => {
            if (user) {
                return true; // O usuário está logado! A porta se abre.
            } else {
                router.navigate(['/login']); // Não está logado? Vai direto pro Login!
                return false;
            }
        })
    );
};