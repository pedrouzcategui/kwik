import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Building2, GlassesIcon, Heart, LucideIcon, Monitor, Moon, SlackIcon, Sun, Table2Icon } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Claro' },
        { value: 'dark', icon: Moon, label: 'Obscuro' },
        { value: 'slack', icon: SlackIcon, label: 'Slack' },
        { value: 'matrix', icon: GlassesIcon, label: 'Matrix' },
        { value: 'synthwave', icon: Table2Icon, label: 'Synthwave' },
        { value: 'honeymustard', icon: Heart, label: 'Honey Mustard' },
        { value: 'pixie', icon: Building2, label: 'Pixie' },
        { value: 'system', icon: Monitor, label: 'Sistema' },
    ];

    return (
        <div className={cn('0 grid grid-cols-3 gap-2 rounded-lg p-2', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <div
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'min-h-[100px] cursor-pointer rounded-md px-3.5 py-2 transition-colors select-none',
                        appearance === value
                            ? 'bg-card text-card-foreground shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            updateAppearance(value);
                        }
                    }}
                >
                    <div className="flex items-center">
                        <Icon className="-ml-1 h-4 w-4" />
                        <span className="ml-1.5 text-sm">{label}</span>
                    </div>
                    <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{appearance === value ? 'Activo' : 'Inactivo'}</div>
                </div>
            ))}
        </div>
    );
}
