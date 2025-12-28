
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ElvishShell } from './components/ElvishShell';
import { MediaHub } from './components/MediaHub';
import { ThinkingSurface } from './components/ThinkingSurface';
import { CognitiveIndex } from './components/CognitiveIndex';
import { TaskManifest } from './components/TaskManifest';
import { SubstrateConfig } from './components/SubstrateConfig';
import { NexusState, ElvishValue, MediaArtifact, AspectRatio, ImageSize, GraphNode, GraphEdge, TaskLog } from './types';
import { geminiService } from './services/geminiService';
import { LiveCognition } from './services/liveService';

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<NexusState>(NexusState.LEARN);
  const [viewMode, setViewMode] = useState<'artifacts' | 'index' | 'tasks' | 'config'>('artifacts');
  const [selectedDocId, setSelectedDocId] = useState<number | undefined>(undefined);
  const [logs, setLogs] = useState<ElvishValue[]>([]);
  const [artifacts, setArtifacts] = useState<MediaArtifact[]>([]);
  const [tasks, setTasks] = useState<TaskLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executingTaskName, setExecutingTaskName] = useState<string | undefined>(undefined);
  
  // System Dynamics (Physics)
  const [viscosity, setViscosity] = useState(0.1);
  const [aberration, setAberration] = useState(0.0);
  
  // Live session state
  const [isLive, setIsLive] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const liveRef = useRef<LiveCognition | null>(null);

  // Graph state
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  // Initial setup
  useEffect(() => {
    addLog('system', 'Nexus ontological substrate materialized.');
    
    const initialNodes: GraphNode[] = [
      { id: 'learn', label: 'LEARN', type: 'state', x: 150, y: 150, color: '#60a5fa' },
      { id: 'build', label: 'BUILD', type: 'state', x: 450, y: 150, color: '#facc15' },
      { id: 'debug', label: 'DEBUG', type: 'state', x: 300, y: 350, color: '#f87171' },
      { id: 'refactor', label: 'REFACTOR', type: 'state', x: 550, y: 350, color: '#c084fc' },
      { id: 'explore', label: 'EXPLORE', type: 'state', x: 100, y: 400, color: '#22d3ee' },
      { id: 'archive', label: 'ARCHIVE', type: 'state', x: 650, y: 100, color: '#64748b' },
    ];
    setNodes(initialNodes);
    setEdges([
      { from: 'learn', to: 'build' },
      { from: 'build', to: 'debug' },
      { from: 'debug', to: 'learn' },
      { from: 'build', to: 'refactor' },
      { from: 'learn', to: 'explore' },
      { from: 'explore', to: 'archive' },
    ]);
  }, []);

  // Update physics based on system load
  useEffect(() => {
    let targetViscosity = 0.1;
    if (isLoading) targetViscosity += 0.4;
    if (activeState === NexusState.BUILD) targetViscosity += 0.2;
    if (activeState === NexusState.DEBUG) targetViscosity += 0.3;
    setViscosity(Math.min(0.95, targetViscosity));
  }, [isLoading, activeState]);

  const addLog = useCallback((type: ElvishValue['type'], content: any) => {
    setLogs(prev => [...prev, { type, content, timestamp: Date.now() }]);
  }, []);

  const updateGraphWithArtifact = (artifact: MediaArtifact) => {
    const newNode: GraphNode = {
      id: artifact.id,
      label: artifact.type.toUpperCase(),
      type: 'artifact',
      x: 150 + Math.random() * 300,
      y: 150 + Math.random() * 300,
      color: '#818cf8'
    };
    setNodes(prev => [...prev, newNode]);
    setEdges(prev => [...prev, { from: activeState, to: artifact.id }]);
  };

  const handleError = (err: any) => {
    const msg = err.message || 'System error';
    setAberration(0.85);
    setTimeout(() => setAberration(0), 2000);
    addLog('string', `[ERROR:RETINA_FAULT] ${msg}`);
  };

  const handleToolCall = async (fc: any) => {
    try {
      if (fc.name === 'transition_state') {
        const { targetState, reason } = fc.args;
        addLog('agent-proposal', { targetState, reason });
        return `Transition to ${targetState} proposed. Reason: ${reason}`;
      }
      if (fc.name === 'propose_elvish_logic') {
        const { logic, intent } = fc.args;
        addLog('logic-proposal', { logic, intent });
        return `Functional logic proposed: ${intent}`;
      }
    } catch (err) {
      handleError(err);
    }
    return "Unknown tool invoked.";
  };

  const simulateJustTask = async (recipe: string) => {
    const id = Math.random().toString(36).substr(2, 4);
    const newTask: TaskLog = { id, recipe, status: 'running', timestamp: Date.now() };
    setTasks(prev => [newTask, ...prev]);
    setExecutingTaskName(recipe);
    await new Promise(resolve => setTimeout(resolve, 2200));
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', output: `SUCCESS: recipe ${recipe} executed in 2.1s` } : t));
    setExecutingTaskName(undefined);
  };

  const handleToggleLive = async () => {
    if (isLive) {
      liveRef.current?.disconnect();
      setIsLive(false);
      setLiveTranscription('');
      addLog('system', 'Cognitive agent detached from Retina.');
    } else {
      setIsLive(true);
      if (!liveRef.current) liveRef.current = new LiveCognition();
      try {
        await liveRef.current.connect({
          onMessage: (text) => setLiveTranscription(prev => prev + text),
          onInterrupted: () => setLiveTranscription(''),
          onClose: () => {
            setIsLive(false);
            setLiveTranscription('');
          },
          onToolCall: handleToolCall
        });
        addLog('system', 'Cognitive agent co-habiting functional substrate.');
      } catch (err) {
        setIsLive(false);
        handleError(err);
      }
    }
  };

  const handleCommand = async (cmd: string) => {
    addLog('string', `~/${activeState} > ${cmd}`);
    
    if (cmd.startsWith('enter ')) {
      const newState = cmd.split(' ')[1] as NexusState;
      if (Object.values(NexusState).includes(newState)) {
        await simulateJustTask(`spine::enter_${newState}`);
        setActiveState(newState);
        addLog('map', { transition: 'success', from: activeState, to: newState });
        return;
      }
    }
    
    if (cmd.startsWith('just ')) {
      await simulateJustTask(cmd.replace('just ', ''));
      return;
    }

    setIsLoading(true);
    try {
      const response = await geminiService.cognitiveReasoning(cmd, activeState);
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.functionCall) {
            await handleToolCall(part.functionCall);
          }
        }
      }
      const text = response.text;
      if (text) {
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          const sources = response.candidates[0].groundingMetadata.groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Source',
            uri: chunk.web?.uri || '',
          })).filter((s: any) => s.uri);
          addLog('grounding', { text, sources });
        } else {
          addLog('string', text);
        }
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (prompt: string, ratio: AspectRatio, size: ImageSize) => {
    setIsLoading(true);
    await simulateJustTask(`hands::synthesis_v1`);
    try {
      const url = await geminiService.generateProImage(prompt, ratio, size);
      const newArtifact: MediaArtifact = {
        id: Math.random().toString(36).substr(2, 6),
        type: 'image',
        url,
        prompt,
        timestamp: Date.now()
      };
      setArtifacts(prev => [newArtifact, ...prev]);
      updateGraphWithArtifact(newArtifact);
      addLog('map', { artifact: 'materialized', id: newArtifact.id });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    // If it's a state node, switch to that state
    if (Object.values(NexusState).includes(nodeId as NexusState)) {
      handleCommand(`enter ${nodeId}`);
      return;
    }
    // If it's an artifact node, switch view and focus it
    const artifact = artifacts.find(a => a.id === nodeId);
    if (artifact) {
      setViewMode('artifacts');
      // Potential selectedArtifact logic could go here if exposed
    }
  };

  const renderLeftPanel = () => {
    switch (viewMode) {
      case 'index':
        return <CognitiveIndex 
                 selectedId={selectedDocId} 
                 onSelect={setSelectedDocId} 
                 onExecuteVerb={(cmd) => {
                   handleCommand(cmd);
                   // Switch to tasks view if it's a "just" command to bring execution into focus
                   if (cmd.startsWith('just ')) setViewMode('tasks');
                 }}
               />;
      case 'tasks':
        return <TaskManifest tasks={tasks} />;
      case 'config':
        return <SubstrateConfig />;
      default:
        return <MediaHub 
                 artifacts={artifacts} 
                 loading={isLoading}
                 onGenerate={handleGenerate}
                 onEdit={() => {}} 
                 onAnimate={() => {}}
                 onAnalyze={() => {}}
               />;
    }
  };

  return (
    <Layout 
      activeState={activeState} 
      viewMode={viewMode}
      onViewChange={setViewMode}
      onStateChange={(state) => {
        setActiveState(state);
        handleCommand(`enter ${state}`);
      }}
    >
      <div className="flex h-full">
        {/* Left Control Plane */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-hidden relative">
            {renderLeftPanel()}
          </div>
          <div className="h-72">
            <ThinkingSurface 
              nodes={nodes} 
              edges={edges} 
              focusNodeId={selectedDocId ? 'learn' : activeState} 
              viscosity={viscosity}
              aberration={aberration}
              onNodeClick={handleNodeClick}
            />
          </div>
        </div>

        {/* Right Execution Plane (Brain) */}
        <div className="w-full md:w-[450px] lg:w-[500px] xl:w-[600px] h-full shadow-2xl z-20 flex flex-col">
          <ElvishShell 
            logs={logs} 
            activeState={activeState} 
            isLive={isLive}
            liveTranscription={liveTranscription}
            executingTask={executingTaskName}
            onCommand={handleCommand} 
            onToggleLive={handleToggleLive}
          />
        </div>
      </div>
    </Layout>
  );
};

export default App;
