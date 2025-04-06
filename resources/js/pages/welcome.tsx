import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@inertiajs/react';
import { Calendar1Icon, Megaphone, PencilIcon } from 'lucide-react';

const MENU_ITEMS = [
    {
        path: '/login',
        label: 'Login',
    },
];

export default function Welcome() {
    return (
        <>
            {/* // Menu */}
            <nav className="absolute flex w-full items-center justify-between px-8 py-3">
                <div>
                    <img src="/assets/logo.png" alt="Logo Rubikate" width={50} />
                </div>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link className="text-white" href="/dashboard">
                                <NavigationMenuLink>Login</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
            {/* // End Menu  */}
            {/* // Banner */}
            <div
                className="flex flex-col items-center gap-5 bg-amber-100 bg-cover py-52 text-center *:text-white"
                style={{ backgroundImage: "url('/assets/Capacitaciones-Rubikate.png')" }}
            >
                <h1 className="text-7xl font-bold">Impulsamos tu marca y tu talento</h1>
                <h2 className="text-2xl">Posicionamiento digital, eventos memorables y formación transformadora, todo en un solo lugar.</h2>
                <Button size={'lg'} className="w-fit bg-indigo-900 text-xl">
                    Escríbenos al Whatsapp
                </Button>
            </div>
            {/* // End Banner */}
            {/* Who are we */}
            <div>
                <div className="grid grid-cols-2 gap-20 *:p-24 [&>*>*]:mb-4">
                    <div className="*:text-justify">
                        <h2 className="text-2xl font-semibold">¿Quiénes Somos?</h2>
                        <p>En Rubikate, nos especializamos en crear experiencias significativas tanto en el mundo digital como en el presencial.</p>
                        <p>
                            Nuestro propósito es ayudarte a crecer: ya sea posicionando tu marca en plataformas digitales, fortaleciendo el talento
                            humano de tu empresa o produciendo eventos que marquen la diferencia.
                        </p>
                        <p>Creemos en el poder de las ideas, en la creatividad aplicada y en el valor de cada cliente que confía en nosotros.</p>
                    </div>
                    <div className="bg-teal-100 text-teal-900 *:text-right">
                        <h2 className="text-2xl font-semibold">Misión</h2>
                        <p className="text-justify">
                            <i>Somos una empresa dedicada al posicionamiento digital de pequeñas, medianas y grandes organizaciones.</i>
                        </p>
                        <p>
                            <i>
                                Nuestra misión es proporcionar espacios digitales adaptados a la medida, así como también impulsar el desarrollo
                                individual y colectivo del talento humano en las empresas de nuestro país.
                            </i>
                        </p>
                    </div>
                </div>
            </div>
            {/* End Who Are We */}
            {/* Servicios */}
            <div className="bg-indigo-100 py-24 text-center text-indigo-900">
                <h2 className="mb-20 text-7xl font-bold">Servicios</h2>
                <div className="mx-auto grid w-4/5 grid-cols-3 gap-10">
                    <div className="flex flex-col items-center">
                        <Calendar1Icon className="mb-4" size={100} />
                        <h3 className="mb-4 text-2xl font-bold">Eventos y Actividades</h3>
                        <ul className="list-inside list-disc text-left">
                            <li>Planificación y Producción de eventos.</li>
                            <li>Actividades recreativas para corporaciones.</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center">
                        <PencilIcon className="mb-4" size={100} />
                        <h3 className="mb-4 text-2xl font-bold">Consultoría y Formación</h3>
                        <ul className="list-inside list-disc text-left">
                            <li>Consultoría en gestión de proyectos.</li>
                            <li>Formación personalizada para personas, empresas y emprendedores</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center">
                        <Megaphone className="mb-4" size={100} />
                        <h3 className="mb-4 text-2xl font-bold">Marketing y Medios</h3>
                        <ul className="list-inside list-disc text-left">
                            <li>Manejo de redes sociales y marketing digital.</li>
                            <li>
                                Publicidad paga <i>(Ads).</i>
                            </li>
                            <li>Producción audiovisual.</li>
                            <li>Sesiones de fotografía.</li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* End Servicios */}
            {/* Contact */}
            <div className="bg-amber-100 px-20 py-24 text-amber-900">
                {/* Contact Banner */}
                <div className="mb-16 flex flex-col items-center gap-5 text-center">
                    <h1 className="mb-5 text-7xl font-bold">¿Listo para dar el siguiente paso con tu marca o proyecto?</h1>
                    <Button size={'lg'} className="w-fit bg-amber-700 text-xl">
                        Escríbenos al Whatsapp
                    </Button>
                </div>
                {/* End Contact Banner */}
                <h3 className="mb-8 text-center">O también puedes rellenar un formulario de contacto</h3>
                {/* Contact Form */}
                <form className="space-y-6 rounded-4xl bg-white p-16">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" type="text" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" rows={4} />
                    </div>

                    <Button className="w-full bg-amber-700" type="submit">
                        Enviar Formulario
                    </Button>
                </form>
                {/* End Contact Form */}
            </div>
            {/* End Contact */}
        </>
    );
}
