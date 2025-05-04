import React from 'react';

const TerminalLog: React.FC = () => {
  return (
    <div className="bg-black text-green-800 col-span-2 font-mono p-4 text-sm rounded-md h-[200px] overflow-y-auto border border-green-900 shadow-inner">
      <div><span className="text-green-300">[17:42:05]</span> Operation created: <span className="text-green-200">"Transfer to Savings" ($250.00)</span></div>
      <div><span className="text-green-300">[17:42:05]</span> Operation created: <span className="text-green-200">"Transfer to Savings" ($250.00)</span></div>
      <div><span className="text-green-300">[17:42:05]</span> Operation created: <span className="text-green-200">"Transfer to Savings" ($250.00)</span></div>
      <div><span className="text-green-300">[17:43:10]</span> Budget updated: <span className="text-green-200">"Groceries" now $300.00</span></div>
      <div><span className="text-green-300">[17:45:27]</span> Account balance recalculated: <span className="text-green-200">"Checking" → $1,420.00</span></div>
      <div><span className="text-green-300">[17:50:02]</span> Alert dismissed: <span className="text-green-200">"Exceeded Entertainment Budget"</span></div>
      <div><span className="text-green-300">[17:51:58]</span> Budget created: <span className="text-green-200">"Travel Plan Summer '25"</span></div>
      <div><span className="text-green-300">[17:52:34]</span> Operation deleted: <span className="text-green-200">"Spotify Subscription" (-$10.00)</span></div>
    </div>
  );
};

export default TerminalLog;
