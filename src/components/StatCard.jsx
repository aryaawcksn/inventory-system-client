import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, trendColor, trendIcon: TrendIcon }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className={`text-sm flex items-center mt-1 ${trendColor}`}>
            {TrendIcon ? <TrendIcon className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-6 h-6" style={{ color: color }} />
      </div>
    </div>
  </div>
);

export default StatCard;
