import React, { useState } from 'react';
import { X } from 'lucide-react';
import DemoLayout from '../components/layout/DemoLayout';
import VBCSuperAgentTools from '../components/tools/VBCSuperAgentTools';
import MedOptiTool from '../components/tools/MedOptiTool';
import PolicyPulseTool from '../components/tools/PolicyPulseTool';
import ReimburseRightTool from '../components/tools/ReimburseRightTool';
import AdvocateIQTool from '../components/tools/AdvocateIQTool';
import ClaimsTool from '../components/tools/ClaimsTool';
import PersonalizeVBC from '../components/tools/PersonalizeVBC';

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
  };

  const handleCloseModal = () => {
    setActiveTool(null);
  };

  return (
    <DemoLayout>
      <VBCSuperAgentTools onToolClick={handleToolClick} />

      {/* Tool Modal Overlay */}
      {activeTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <h2 className="text-lg sm:text-xl font-semibold">{activeTool}</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="h-full overflow-auto pb-20">
              {activeTool === 'MedOpti™' && <MedOptiTool />}
              {activeTool === 'PolicyPulse™' && <PolicyPulseTool />}
              {activeTool === 'ReimburseRight™' && <ReimburseRightTool />}
              {activeTool === 'AdvocateIQ™' && <AdvocateIQTool />}
              {activeTool === 'CLAIMS™' && <ClaimsTool />}
              {activeTool === 'Personalize VBC™' && <PersonalizeVBC onBack={handleCloseModal} />}
            </div>
          </div>
        </div>
      )}
    </DemoLayout>
  );
};

export default Tools;
