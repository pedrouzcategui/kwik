import { User } from './user';

declare module '@inertiajs/core' {
    interface PageProps extends Page<PageProps> {
        auth: {
            status: number | null;
            user: User;
        };
        route: {
            name: string;
        };
    }
}
