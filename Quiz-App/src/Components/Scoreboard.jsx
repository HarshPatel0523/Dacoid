/* eslint-disable react/prop-types */
import { Trophy, Star } from 'lucide-react';

const Scoreboard = ({ score, total }) => {
    const percentage = (score / total) * 100;
    
    const getMessage = () => {
        if (percentage === 100) return "Perfect Score! Brilliant!";
        if (percentage >= 80) return "Outstanding Work!";
        if (percentage >= 60) return "Good Job!";
        return "Keep Practicing!";
    };

    return (
        <div className="w-full max-w-md mx-auto rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl p-6">
            <div className="flex justify-center mb-6">
                {percentage >= 60 ? (
                    <Trophy className="w-16 h-16 text-yellow-500" />
                ) : (
                    <Star className="w-16 h-16 text-blue-500" />
                )}
            </div>
            
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                Quiz Complete!
            </h2>
            
            <p className="text-center text-gray-600 mb-6">
                {getMessage()}
            </p>
            
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div className="text-2xl font-bold text-indigo-600">
                        {score}/{total}
                    </div>
                    <div className="text-xl text-indigo-600">
                        {percentage.toFixed(0)}%
                    </div>
                </div>
                
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                    <div 
                        style={{ width: `${percentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-in-out"
                    />
                </div>
            </div>
        </div>
    );
};

export default Scoreboard;