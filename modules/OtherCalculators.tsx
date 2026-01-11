
import React from 'react';
import { Card } from '../components/Shared';
import { Construction } from 'lucide-react';

const PlaceholderModule: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
      <Construction size={40} />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <p className="text-slate-500 mt-2">This module is coming soon in the next update!</p>
    </div>
    <Card className="max-w-md bg-slate-50">
      <p className="text-sm text-slate-600 italic">
        "We are currently refining the algorithms for {title} to ensure the highest level of accuracy for your financial planning."
      </p>
    </Card>
  </div>
);

export default PlaceholderModule;
