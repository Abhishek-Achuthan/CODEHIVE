import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../shared/ui/dialog/Dialog';
import { Plus, Trash2, HelpCircle, Calendar, CheckSquare } from 'lucide-react';
import type { CreatePollRequest } from '../../../shared/types/api/room';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (poll: CreatePollRequest) => void;
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [expiryHours, setExpiryHours] = useState('24');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || options.some(opt => !opt.trim())) return;

    setIsLoading(true);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(expiryHours));

    onSubmit({
      question: question.trim(),
      options: options.map(text => ({ text: text.trim() })),
      allowMultiple,
      expiresAt: expiresAt.toISOString(),
    });

    // Reset and close
    setTimeout(() => {
      setIsLoading(false);
      setQuestion('');
      setOptions(['', '']);
      setAllowMultiple(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0d1117] border-gray-800 text-white max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="bg-[#161b22] px-6 py-4 border-b border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" /> Create New Poll
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Question */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Question
            </label>
            <textarea
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full bg-[#161b22] border border-gray-800 rounded-xl p-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                Options
              </label>
              <span className="text-[10px] text-gray-600 font-medium">
                {options.length}/6 options
              </span>
            </div>
            
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    required
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 bg-[#161b22] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-gray-400 hover:text-white border border-dashed border-gray-800 hover:border-gray-600 rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Option
              </button>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Duration
              </label>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                className="w-full bg-[#161b22] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none"
              >
                <option value="1">1 Hour</option>
                <option value="6">6 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
                <option value="72">3 Days</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <CheckSquare className="w-3 h-3" /> Choices
              </label>
              <button
                type="button"
                onClick={() => setAllowMultiple(!allowMultiple)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${
                  allowMultiple 
                    ? 'border-blue-500/50 bg-blue-500/5 text-blue-400' 
                    : 'border-gray-800 bg-[#161b22] text-gray-500'
                }`}
              >
                Multiple
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                  allowMultiple ? 'bg-blue-500 border-blue-500' : 'border-gray-700'
                }`}>
                  {allowMultiple && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-gray-400 hover:text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[1.5] bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-2.5 px-4 text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              {isLoading ? 'Creating...' : 'Launch Poll'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollModal;
