import React from 'react';

interface TerminalLogProps {
  logs: Log[];
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  return (
    <div className="bg-black text-green-800 col-span-2 font-mono p-4 text-sm rounded-md h-[200px] overflow-y-auto border border-green-900 shadow-inner">
      {logs.map((log, index) => (
        <div key={index}>
          <span className="text-green-300">[{log.created_at}]</span> <b className='text-green-400'>{log.module}</b>: <span className="text-green-200">{log.description}</span>
        </div>
      ))}
    </div>
  );
};

export default TerminalLog;
