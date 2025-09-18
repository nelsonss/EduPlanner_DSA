import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillNode, SkillStatus, getSkillStatus } from '../../types';
import { Modal } from '../shared/Modal';
import { Icon } from '../shared/Icon';
import { generateSkillFeedback } from '../../services/geminiService';
import { useSearch } from '../../App';
import { useSkills } from '../../contexts/SkillContext';
import { useUser } from '../../contexts/UserContext';

const statusColors: { [key in SkillStatus]: string } = {
    [SkillStatus.NotStarted]: 'bg-accent-red/20 border-accent-red text-accent-red',
    [SkillStatus.InProgress]: 'bg-accent-yellow/20 border-accent-yellow text-accent-yellow',
    [SkillStatus.Mastered]: 'bg-accent-green/20 border-accent-green text-accent-green',
    [SkillStatus.Reinforcement]: 'bg-accent-blue/20 border-accent-blue text-accent-blue',
};

const statusBgColors: { [key in SkillStatus]: string } = {
    [SkillStatus.NotStarted]: 'bg-accent-red',
    [SkillStatus.InProgress]: 'bg-accent-yellow',
    [SkillStatus.Mastered]: 'bg-accent-green',
    [SkillStatus.Reinforcement]: 'bg-accent-blue',
};

interface CalculatedSkillNode extends SkillNode {
    calculatedPosition: { x: number; y: number };
    isVisible: boolean;
    isHighlighted: boolean;
    status: SkillStatus;
}

// Helper function to determine the hierarchical level of each node in a DAG
const calculateNodeLevels = (
    nodes: SkillNode[], 
    skillMap: Map<string, SkillNode>
): Map<string, number> => {
    const nodeIds = new Set(nodes.map(n => n.id));
    const levels = new Map<string, number>();
    const memo = new Map<string, number>();

    const getLevel = (nodeId: string): number => {
        if (memo.has(nodeId)) return memo.get(nodeId)!;

        const node = skillMap.get(nodeId)!;
        const parentIds = node.prerequisites.filter(pId => nodeIds.has(pId));

        if (parentIds.length === 0) {
            memo.set(nodeId, 0);
            return 0;
        }

        const maxParentLevel = Math.max(...parentIds.map(pId => getLevel(pId)));
        const level = maxParentLevel + 1;
        memo.set(nodeId, level);
        return level;
    };

    nodes.forEach(node => {
        levels.set(node.id, getLevel(node.id));
    });
    return levels;
};


const Node: React.FC<{ 
    node: CalculatedSkillNode; 
    onClick: () => void; 
    onMouseDown: (e: React.MouseEvent) => void;
    isExpanded: boolean;
    onToggleExpand: (e: React.MouseEvent) => void;
    index: number; 
}> = ({ node, onClick, onMouseDown, isExpanded, onToggleExpand, index }) => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsRendered(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const initialTransform = `translate(${node.calculatedPosition.x}px, ${node.calculatedPosition.y + 15}px) scale(0.9)`;
    const finalTransform = `translate(${node.calculatedPosition.x}px, ${node.calculatedPosition.y}px) scale(${node.isVisible ? 1 : 0.8})`;
    const highlightClass = node.isHighlighted ? 'ring-2 ring-brand-primary ring-offset-2 ring-offset-white dark:ring-offset-background-light' : '';
    const nodeWidth = node.isParent ? '144px' : '128px';
    const nodeHeight = node.isParent ? '88px' : '80px';
    const cursorClass = node.isVisible ? 'grab' : 'default';

    return (
        <div
            className="absolute transition-all duration-500 ease-in-out hover:!scale-110 group"
             style={{
                width: nodeWidth,
                height: nodeHeight,
                transform: isRendered ? finalTransform : initialTransform,
                opacity: isRendered ? (node.isVisible ? 1 : 0.2) : 0,
                transitionDelay: `${index * 40}ms`,
                cursor: cursorClass,
                pointerEvents: node.isVisible ? 'auto' : 'none',
                zIndex: node.isParent ? 10 : 5,
            }}
            onClick={onClick}
            onMouseDown={onMouseDown}
        >
            <div className={`w-full h-full p-2 flex flex-col items-center justify-center rounded-lg shadow-lg border-2 ${statusColors[node.status]} ${highlightClass} transition-all duration-300 relative`}>
                <span className={`text-sm font-bold text-center text-gray-900 dark:text-text-primary ${node.isParent ? 'text-base' : ''}`}>{node.name}</span>
                <div className="text-xs mt-2 opacity-80">{node.status}</div>
                {node.isParent && (
                    <button 
                        onClick={onToggleExpand}
                        className="absolute -bottom-3.5 -right-3.5 bg-background-light border-2 border-gray-600 rounded-full w-7 h-7 flex items-center justify-center hover:bg-brand-primary transition-colors z-20"
                        aria-label={isExpanded ? 'Collapse sub-skills' : 'Expand sub-skills'}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

const filterOptions: (SkillStatus | 'all')[] = ['all', SkillStatus.Mastered, SkillStatus.InProgress, SkillStatus.NotStarted, SkillStatus.Reinforcement];
const filterLabels: { [key in SkillStatus | 'all']: string } = { 'all': 'All', [SkillStatus.Mastered]: 'Mastered', [SkillStatus.InProgress]: 'In Progress', [SkillStatus.NotStarted]: 'Not Started', [SkillStatus.Reinforcement]: 'Needs Reinforcement' };

export const SkillTree: React.FC<{ skills: SkillNode[], skillMap: Map<string, SkillNode> }> = ({ skills, skillMap }) => {
    const { searchQuery } = useSearch();
    const { user } = useUser();
    const navigate = useNavigate();
    const [selectedNode, setSelectedNode] = useState<CalculatedSkillNode | null>(null);
    const [aiFeedback, setAiFeedback] = useState<string>('');
    const [isFeedbackLoading, setIsFeedbackLoading] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState({ x: 20, y: 20, scale: 1 });
    const [activeFilter, setActiveFilter] = useState<SkillStatus | 'all'>('all');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => new Set(skills.filter(n => n.isParent).map(n => n.id)));

    const isPanning = useRef(false);
    const panStart = useRef({ x: 0, y: 0 });
    const dragInfo = useRef<{ nodeId: string | null; startNodePos: {x: number, y: number}, startMousePos: {x: number, y: number} }>({ nodeId: null, startNodePos: {x:0, y:0}, startMousePos: {x:0,y:0} });
    const hasDragged = useRef(false);

    const { defaultPositions, containerSize } = useMemo(() => {
        const NODE_WIDTH = 144, NODE_HEIGHT = 88;
        const PADDING = 50;
    
        // 1. Separate "macro" nodes (parents, standalone skills) from sub-skills
        const macroNodes = skills.filter(n => n.isParent || !n.prerequisites.some(p => skillMap.get(p)?.isParent));
        
        // 2. Calculate levels and positions for macro nodes hierarchically
        const macroLevelsMap = calculateNodeLevels(macroNodes, skillMap);
        const levels = new Map<number, string[]>();
        macroLevelsMap.forEach((level, nodeId) => {
            if (!levels.has(level)) levels.set(level, []);
            levels.get(level)!.push(nodeId);
        });

        const HORIZONTAL_GAP_MACRO = 280, VERTICAL_GAP_MACRO = 160;
        const macroPositions = new Map<string, { x: number; y: number }>();
        const levelEntries = Array.from(levels.entries()).sort((a, b) => a[0] - b[0]);

        levelEntries.forEach(([level, nodesInLevel]) => {
            const y = level * VERTICAL_GAP_MACRO;
            nodesInLevel.sort((a, b) => a.localeCompare(b)); // Stable sorting
            nodesInLevel.forEach((nodeId, index) => {
                const numNodes = nodesInLevel.length;
                const x = (index - (numNodes - 1) / 2) * HORIZONTAL_GAP_MACRO;
                macroPositions.set(nodeId, { x, y });
            });
        });

        // 4. Start building final positions map
        const finalPositions = new Map(macroPositions);

        // 5. Position sub-skills relative to their parents
        const SUB_NODE_OFFSET_X = NODE_WIDTH + 50;
        const SUB_NODE_HEIGHT = 80;
        const SUB_NODE_VERTICAL_GAP = 15;

        skills.filter(n => n.isParent).forEach(parent => {
            const parentPos = macroPositions.get(parent.id);
            if (parentPos && parent.subSkillIds) {
                const totalHeight = parent.subSkillIds.length * (SUB_NODE_HEIGHT + SUB_NODE_VERTICAL_GAP) - SUB_NODE_VERTICAL_GAP;
                parent.subSkillIds.forEach((subSkillId, index) => {
                    const x = parentPos.x + SUB_NODE_OFFSET_X;
                    const y = parentPos.y - (totalHeight / 2) + (SUB_NODE_HEIGHT / 2) + (index * (SUB_NODE_HEIGHT + SUB_NODE_VERTICAL_GAP));
                    finalPositions.set(subSkillId, { x, y });
                });
            }
        });
        
        // 6. Center the entire layout and calculate container size
        if (finalPositions.size === 0) {
            return { defaultPositions: new Map(), containerSize: { width: 500, height: 500 } };
        }

        const allX = Array.from(finalPositions.values()).map(p => p.x);
        const allY = Array.from(finalPositions.values()).map(p => p.y);
        const minX = Math.min(...allX);
        const minY = Math.min(...allY);
        const maxX = Math.max(...allX);
        const maxY = Math.max(...allY);

        for (const [nodeId, pos] of finalPositions.entries()) {
            finalPositions.set(nodeId, { x: pos.x - minX + PADDING, y: pos.y - minY + PADDING });
        }

        const containerSize = { width: maxX - minX + NODE_WIDTH + PADDING * 2 + SUB_NODE_OFFSET_X, height: maxY - minY + NODE_HEIGHT + PADDING * 2 };
        return { defaultPositions: finalPositions, containerSize };

    }, [skills, skillMap]);
    
    const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(() => {
        try {
            const savedLayout = localStorage.getItem('skillTreeLayout');
            return savedLayout ? new Map(JSON.parse(savedLayout)) : defaultPositions;
        } catch (error) { return defaultPositions; }
    });
    
    useEffect(() => {
        localStorage.setItem('skillTreeLayout', JSON.stringify(Array.from(nodePositions.entries())));
    }, [nodePositions]);

    const handleToggleExpand = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) newSet.delete(nodeId);
            else newSet.add(nodeId);
            return newSet;
        });
    }, []);

    const visibleNodeIds = useMemo(() => {
        const visibleIds = new Set<string>();
        const statusFilteredIds = new Set<string>();

        if (activeFilter !== 'all') {
            skills.forEach(node => {
                if (getSkillStatus(node.proficiency) === activeFilter) {
                    statusFilteredIds.add(node.id);
                }
            });
        }

        const getPrerequisitesRecursive = (nodeId: string) => {
            if (visibleIds.has(nodeId)) return;
            const node = skillMap.get(nodeId);
            if (node) {
                visibleIds.add(node.id);
                node.prerequisites.forEach(getPrerequisitesRecursive);
            }
        };

        skills.forEach(node => {
            if (activeFilter === 'all' || statusFilteredIds.has(node.id)) {
                getPrerequisitesRecursive(node.id);
            }
        });

        // Ensure sub-skills are only visible if their parent is expanded
        skills.forEach(node => {
            const parentId = node.prerequisites.find(p => skillMap.get(p)?.isParent);
            if (parentId && !expandedNodes.has(parentId)) {
                visibleIds.delete(node.id);
            }
        });

        return visibleIds;

    }, [activeFilter, skills, skillMap, expandedNodes]);

    const highlightedNodeIds = useMemo(() => {
        if (!searchQuery.trim()) return new Set<string>();
        const lowercasedQuery = searchQuery.toLowerCase();
        return new Set(skills.filter(n => n.name.toLowerCase().includes(lowercasedQuery) || n.description.toLowerCase().includes(lowercasedQuery)).map(n => n.id));
    }, [searchQuery, skills]);

    const { positionedNodes, nodeMapWithCalcPos, edges } = useMemo(() => {
        const nodesWithStatus = skills.map(node => ({
            ...node,
            status: getSkillStatus(node.proficiency),
        }));

        const positionedNodes: CalculatedSkillNode[] = nodesWithStatus.map(node => ({
             ...node, 
             calculatedPosition: nodePositions.get(node.id) || { x: 0, y: 0 },
             isVisible: visibleNodeIds.has(node.id),
             isHighlighted: highlightedNodeIds.has(node.id),
        }));

        const nodeMapWithCalcPos = new Map<string, CalculatedSkillNode>();
        positionedNodes.forEach(node => nodeMapWithCalcPos.set(node.id, node));

        const edges: { from: CalculatedSkillNode; to: CalculatedSkillNode; isVisible: boolean, type: 'prereq' | 'subskill' }[] = [];
        positionedNodes.forEach(node => {
            node.prerequisites.forEach(prereqId => {
                const prereqNode = nodeMapWithCalcPos.get(prereqId);
                if (prereqNode) {
                    const isSubskillEdge = prereqNode.isParent && prereqNode.subSkillIds?.includes(node.id);
                    edges.push({ 
                        from: prereqNode, 
                        to: node,
                        isVisible: visibleNodeIds.has(node.id) && visibleNodeIds.has(prereqNode.id),
                        type: isSubskillEdge ? 'subskill' : 'prereq'
                    });
                }
            });
        });
        return { positionedNodes, nodeMapWithCalcPos, edges };
    }, [skills, nodePositions, visibleNodeIds, highlightedNodeIds]);
    
    const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        hasDragged.current = false;
        const startNodePos = nodePositions.get(nodeId);
        if (!startNodePos) return;
        dragInfo.current = { nodeId, startNodePos, startMousePos: { x: e.clientX, y: e.clientY } };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    }, [nodePositions]);

    const handleNodeClick = useCallback(async (node: CalculatedSkillNode) => {
        if (hasDragged.current) return;
        setSelectedNode(node);
        setAiFeedback('');
        setIsFeedbackLoading(true);
        try {
            const feedback = await generateSkillFeedback(node, skills, user);
            setAiFeedback(feedback);
        } catch (error) {
            setAiFeedback("Could not generate AI feedback. The backend service might be unavailable.");
            console.error("Error generating skill feedback:", error);
        } finally {
            setIsFeedbackLoading(false);
        }
    }, [skills, user]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0 || dragInfo.current.nodeId) return;
        e.preventDefault();
        panStart.current = { x: e.clientX - view.x, y: e.clientY - view.y };
        isPanning.current = true;
        if (containerRef.current) containerRef.current.classList.add('cursor-grabbing');
    };
    const handleMouseUp = () => {
        isPanning.current = false;
        if (dragInfo.current.nodeId && containerRef.current) containerRef.current.style.cursor = 'grab';
        dragInfo.current.nodeId = null;
        if (containerRef.current) containerRef.current.classList.remove('cursor-grabbing');
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragInfo.current.nodeId) {
            const { nodeId, startNodePos, startMousePos } = dragInfo.current;
            const dx = e.clientX - startMousePos.x;
            const dy = e.clientY - startMousePos.y;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged.current = true;
            const newPos = { x: startNodePos.x + dx / view.scale, y: startNodePos.y + dy / view.scale };
            setNodePositions(prev => new Map(prev).set(nodeId, newPos));
        } else if (isPanning.current) {
            setView(prev => ({ ...prev, x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }));
        }
    };
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;
        const zoomIntensity = 0.1;
        const delta = e.deltaY > 0 ? -1 : 1;
        const scaleAmount = 1 + delta * zoomIntensity;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setView(prev => {
            const newScale = Math.max(0.25, Math.min(prev.scale * scaleAmount, 2.5));
            const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
            const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);
            return { scale: newScale, x: newX, y: newY };
        });
    };
    const handleZoom = (direction: 'in' | 'out') => {
        setView(prev => {
            const scaleAmount = direction === 'in' ? 1.25 : 0.8;
            const newScale = Math.max(0.25, Math.min(prev.scale * scaleAmount, 2.5));
            const centerX = containerRef.current ? containerRef.current.clientWidth / 2 : 0;
            const centerY = containerRef.current ? containerRef.current.clientHeight / 2 : 0;
            const newX = centerX - (centerX - prev.x) * (newScale / prev.scale);
            const newY = centerY - (centerY - prev.y) * (newScale / prev.scale);
            return { scale: newScale, x: newX, y: newY };
        });
    };
    const handleAutoArrange = () => setNodePositions(defaultPositions);
    const resetLayoutAndZoom = () => {
        setView({ x: 20, y: 20, scale: 1 });
        setNodePositions(defaultPositions);
        localStorage.removeItem('skillTreeLayout');
    };

    return (
        <div 
            className="relative w-full h-[600px] bg-gray-50 dark:bg-background-light/50 rounded-lg overflow-hidden cursor-grab"
            ref={containerRef}
            onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onMouseMove={handleMouseMove} onWheel={handleWheel}
        >
             <div className="absolute top-4 left-4 z-10 flex space-x-1 bg-white dark:bg-background-light p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                {filterOptions.map(option => <button key={option} onClick={() => setActiveFilter(option)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeFilter === option ? 'bg-brand-primary text-white' : 'text-gray-600 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>{filterLabels[option]}</button>)}
             </div>
             <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 bg-white dark:bg-background-light p-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <button onClick={() => handleZoom('in')} className="p-2 text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors" aria-label="Zoom in"><Icon name="zoomIn" /></button>
                <button onClick={() => handleZoom('out')} className="p-2 text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors" aria-label="Zoom out"><Icon name="zoomOut" /></button>
                <button onClick={handleAutoArrange} className="p-2 text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors" aria-label="Auto-arrange layout"><Icon name="autoArrange" /></button>
                <button onClick={resetLayoutAndZoom} className="p-2 text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors" aria-label="Reset view"><Icon name="reset" /></button>
            </div>
            <div
                className="transition-transform duration-200"
                style={{ width: containerSize.width, height: containerSize.height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, transformOrigin: '0 0', pointerEvents: 'none' }}
            >
                <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                    <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#a0aec0" /></marker></defs>
                    {edges.map(({ from, to, isVisible, type }, index) => {
                        const fromWidth = from.isParent ? 144 : 128; const fromHeight = from.isParent ? 88 : 80;
                        const toWidth = to.isParent ? 144 : 128; const toHeight = to.isParent ? 88 : 80;
                        const fromX = from.calculatedPosition.x + fromWidth; const fromY = from.calculatedPosition.y + fromHeight / 2;
                        const toX = to.calculatedPosition.x; const toY = to.calculatedPosition.y + toHeight / 2;
                        const controlOffsetX = Math.max(50, Math.abs(toX - fromX) * 0.4);
                        return <path key={index} d={`M ${fromX} ${fromY} C ${fromX + controlOffsetX} ${fromY}, ${toX - controlOffsetX} ${toY}, ${toX} ${toY}`} stroke="#a0aec0" strokeWidth="2" strokeDasharray={type === 'subskill' ? '4 4' : 'none'} fill="transparent" markerEnd="url(#arrow)" className="transition-opacity duration-500" style={{ opacity: isVisible ? 1 : 0.15 }} />;
                    })}
                </svg>
                <div style={{ pointerEvents: 'auto', position: 'relative', width: '100%', height: '100%' }}>
                    {positionedNodes.map((node, index) => <Node key={node.id} node={node} onClick={() => handleNodeClick(node)} onMouseDown={(e) => handleNodeMouseDown(e, node.id)} index={index} isExpanded={expandedNodes.has(node.id)} onToggleExpand={(e) => handleToggleExpand(e, node.id)} />)}
                </div>
            </div>
            {selectedNode && (
                <Modal title={selectedNode.name} onClose={() => setSelectedNode(null)}>
                    <div className="p-4 text-gray-600 dark:text-text-secondary">
                        <div className={`flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full text-white ${statusBgColors[selectedNode.status]} w-fit mb-4`}>{selectedNode.status}</div>
                        <p className="mb-4">{selectedNode.description}</p>
                        
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-900/50 rounded-md border-l-2 border-accent-blue">
                            <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2 flex items-center"><Icon name="suggestion" className="h-5 w-5 mr-2 text-accent-blue" /> AI Analyst Feedback</h4>
                            {isFeedbackLoading ? <p className="text-sm italic animate-pulse">Analyzing your progress...</p> : <p className="text-sm">{aiFeedback}</p>}
                        </div>

                        {selectedNode.isParent && selectedNode.subSkillIds && (
                           <div className="mt-4">
                               <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2 mt-4">Sub-Skills:</h4>
                               <ul className="space-y-2">
                                   {selectedNode.subSkillIds.map(subId => {
                                       const subNode = nodeMapWithCalcPos.get(subId);
                                       if (!subNode) return null;
                                       const progress = Math.round(subNode.proficiency * 100);
                                       return <li key={subId}><div className="flex justify-between items-baseline mb-1"><p className="text-sm font-medium text-text-primary">{subNode.name}</p><p className="text-xs text-text-secondary">{progress}%</p></div><div className="w-full bg-background-dark rounded-full h-1.5"><div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div></div></li>
                                   })}
                               </ul>
                           </div>
                        )}

                        <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2 mt-4">Prerequisites:</h4>
                        {selectedNode.prerequisites.length > 0 ? ( <ul className="list-disc list-inside">{selectedNode.prerequisites.map(prereqId => <li key={prereqId}>{nodeMapWithCalcPos.get(prereqId)?.name || prereqId}</li>)}</ul>) : ( <p>None</p> )}
                        <button onClick={() => { if (selectedNode) { navigate(`/learn?skill=${selectedNode.id}`); setSelectedNode(null); }}} className="mt-6 w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">Start Learning</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};