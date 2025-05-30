import React from 'react';

interface TerminalLogProps {
    logs: Log[];
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
    return (
        <div className="col-span-3 h-[200px] overflow-y-auto rounded-md border border-green-900 p-4 font-mono text-xs text-green-800 shadow-inner dark:bg-black">
            {logs.map((log, index) => (
                <div key={index}>
                    <span className="dark:text-green-300">[{log.created_at}]</span> <b className="dark:text-green-400">{log.module}</b>:{' '}
                    <span className="dark:text-green-200">{log.description}</span>
                </div>
            ))}
        </div>
    );
};

export default TerminalLog;
