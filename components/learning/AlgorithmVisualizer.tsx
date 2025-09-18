import React, { useState } from 'react';
import { Icon } from '../shared/Icon';

const StackItem: React.FC<{ value: string; isNew: boolean }> = ({ value, isNew }) => {
    const animationClass = isNew ? 'animate-stack-push' : '';
    return (
        <div className={`w-24 h-12 bg-brand-primary text-white flex items-center justify-center font-bold text-lg rounded-md shadow-lg border-2 border-blue-400 ${animationClass}`}>
            {value}
        </div>
    );
};

export const AlgorithmVisualizer: React.FC = () => {
    const [stack, setStack] = useState<string[]>(['10', '25', '5']);
    const [inputValue, setInputValue] = useState<string>('');
    const [justAdded, setJustAdded] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handlePush = () => {
        if (!inputValue.trim()) {
            setError('Input cannot be empty.');
            return;
        }
        if (stack.length >= 7) {
             setError('Stack is full for this visualization.');
             return;
        }
        setError('');
        const newItem = inputValue.trim();
        setStack(prev => [...prev, newItem]);
        setJustAdded(newItem + Date.now()); // Unique key to trigger animation
        setInputValue('');
    };

    const handlePop = () => {
        if (stack.length === 0) {
            setError('Stack is empty.');
            return;
        }
        setError('');
        setStack(prev => prev.slice(0, -1));
        setJustAdded(null);
    };

    return (
        <div className="my-8 p-6 bg-background-dark rounded-lg border border-gray-700">
            <style>
                {`
                @keyframes stack-push {
                    0% { transform: translateY(-50px) scale(0.8); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
                .animate-stack-push {
                    animation: stack-push 0.4s ease-out;
                }
                `}
            </style>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Stack Visualizer</h3>
            <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Controls */}
                <div className="w-full md:w-1/3 space-y-4">
                    <p className="text-sm text-text-secondary">Interact with the stack. The last element added (pushed) is the first one to be removed (popped) - LIFO.</p>
                    <div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            maxLength={5}
                            placeholder="Enter a value"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={handlePush} className="flex-1 bg-accent-green text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                            <Icon name="plus" className="h-4 w-4 mr-1" /> Push
                        </button>
                        <button onClick={handlePop} className="flex-1 bg-accent-red text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center">
                            <Icon name="trash" className="h-4 w-4 mr-1" /> Pop
                        </button>
                    </div>
                    {error && <p className="text-xs text-accent-red mt-2">{error}</p>}
                </div>
                {/* Visualization */}
                <div className="w-full md:w-2/3 h-96 bg-gray-900/50 rounded-lg p-4 flex justify-center items-end">
                    <div className="relative flex flex-col-reverse items-center space-y-2 space-y-reverse">
                        {stack.map((item, index) => (
                             <StackItem key={`${item}-${index}`} value={item} isNew={`${item}${Date.now()}` === justAdded} />
                        ))}
                         {stack.length > 0 && <div className="absolute top-0 right-full mr-2 text-yellow-400 text-sm font-mono whitespace-nowrap">&lt;-- TOP</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
