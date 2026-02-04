import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
  </div>
);

export default Loader;
