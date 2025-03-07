import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

const Clock: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Format time for Yangon (GMT+6:30)
  const formatYangonTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Yangon',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return time.toLocaleTimeString('en-US', options);
  };
  
  const formatYangonDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Yangon',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return time.toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <div className="flex items-center mb-4">
        <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Yangon Time</h2>
      </div>
      <div className="text-4xl font-bold text-blue-600 mb-2">{formatYangonTime()}</div>
      <div className="text-gray-600">{formatYangonDate()}</div>
      <div className="mt-2 text-xs text-gray-500">GMT+6:30</div>
    </div>
  );
};

export default Clock;