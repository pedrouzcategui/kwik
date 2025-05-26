import { SVGAttributes } from 'react';
import RubikateLogo from './rubikate-logo.png';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img src={RubikateLogo} className="w-[300px]" />;
}
