import { useMemo, useState } from 'react';

const LAYERS = [
  {
    id: 'base',
    title: 'Base System',
    description: 'The core rules that define how the AI should behave.',
    caption: 'Core rules.',
    example: 'e.g., protect private data.',
    what: 'Non-negotiable guardrails.',
    why: 'Keeps behavior safe and consistent.',
    risk: 'Without it, reliability and risk control break down.',
    x: 44,
    y: 54,
    w: 188,
    h: 78
  },
  {
    id: 'tools',
    title: 'Tool Definitions',
    description: 'The capabilities the AI is allowed to use.',
    caption: 'What the AI can use.',
    example: 'e.g., pull sales reports.',
    what: 'The AI toolkit.',
    why: 'Defines which actions are possible.',
    risk: 'Without it, the AI can talk but cannot execute.',
    x: 252,
    y: 54,
    w: 208,
    h: 78
  },
  {
    id: 'workspace',
    title: 'Workspace Files',
    description: 'Reference material the AI can consult.',
    caption: 'Reference material.',
    example: 'e.g., pricing and brand guide.',
    what: 'Company handbook.',
    why: 'Aligns answers with your standards.',
    risk: 'Without it, output feels inconsistent.',
    x: 480,
    y: 54,
    w: 208,
    h: 78
  },
  {
    id: 'context',
    title: 'Dynamic Context',
    description: 'What is happening right now in the conversation.',
    caption: 'What is happening right now.',
    example: 'e.g., quarter is below target.',
    what: 'Live situation briefing.',
    why: 'Keeps responses tied to this moment.',
    risk: 'Without it, answers can be off-topic.',
    x: 708,
    y: 54,
    w: 216,
    h: 78
  },
  {
    id: 'final',
    title: 'Final Prompt',
    description: 'The specific task being asked.',
    caption: 'The task.',
    example: 'e.g., draft investor update.',
    what: 'Final assignment packet.',
    why: 'This is what gets executed.',
    risk: 'Without it, goals are unclear.',
    x: 350,
    y: 235,
    w: 270,
    h: 86
  }
];

const STAGE2_LAYERS = [
  {
    id: 'tools',
    title: 'Tool Definitions',
    description: 'The capabilities the AI is allowed to use.',
    businessAnalogy: 'This is your company operations team and specialist vendors.',
    importance: 'It defines what actions can actually happen after a decision.',
    risk: 'Weak tool design creates strategy with no execution.',
    subs: ['Built-in Tools', 'Plugin Tools'],
    group: { x: 26, y: 40, w: 220, h: 92 },
    subBoxes: [
      { x: 36, y: 66, w: 95, h: 52, label: 'Built-in Tools' },
      { x: 141, y: 66, w: 95, h: 52, label: 'Plugin Tools' }
    ]
  },
  {
    id: 'context',
    title: 'Dynamic Context',
    description: 'What is happening right now in the conversation.',
    businessAnalogy: 'This is your live meeting brief before leadership responds.',
    importance: 'It keeps output relevant to the current situation.',
    risk: 'Without it, responses drift into generic advice.',
    subs: ['Session History', 'Skills', 'Memory Search'],
    group: { x: 266, y: 40, w: 286, h: 92 },
    subBoxes: [
      { x: 276, y: 66, w: 86, h: 52, label: 'Session History' },
      { x: 372, y: 66, w: 86, h: 52, label: 'Skills' },
      { x: 468, y: 66, w: 74, h: 52, label: 'Memory Search' }
    ]
  },
  {
    id: 'workspace',
    title: 'Workspace Files',
    description: 'Reference material the AI can consult.',
    businessAnalogy: 'This is your internal policy shelf and brand handbook.',
    importance: 'It aligns the answer with your organization style.',
    risk: 'Without it, responses can be accurate but off-brand.',
    subs: ['AGENTS.md', 'SOUL.md', 'TOOLS.md'],
    group: { x: 572, y: 40, w: 286, h: 92 },
    subBoxes: [
      { x: 582, y: 66, w: 86, h: 52, label: 'AGENTS.md' },
      { x: 678, y: 66, w: 86, h: 52, label: 'SOUL.md' },
      { x: 774, y: 66, w: 74, h: 52, label: 'TOOLS.md' }
    ]
  },
  {
    id: 'base',
    title: 'Base System',
    description: 'The core rules that define how the AI should behave.',
    businessAnalogy: 'This is corporate governance that applies in every meeting.',
    importance: 'It enforces non-negotiable guardrails.',
    risk: 'Without it, reliability and trust collapse.',
    subs: ['Pi Agent Core'],
    group: { x: 876, y: 40, w: 118, h: 92 },
    subBoxes: [{ x: 886, y: 66, w: 98, h: 52, label: 'Pi Agent Core' }]
  },
  {
    id: 'final',
    title: 'Final Prompt',
    description: 'The specific task being asked.',
    businessAnalogy: 'This is the final board memo sent for execution.',
    importance: 'It merges layers into one actionable instruction packet.',
    risk: 'Without it, execution is unclear and inconsistent.',
    subs: ['Conversation History', 'User Message', 'System Prompt'],
    group: { x: 330, y: 212, w: 370, h: 108 },
    subBoxes: [
      { x: 340, y: 248, w: 112, h: 56, label: 'Conversation' },
      { x: 462, y: 248, w: 112, h: 56, label: 'User Message' },
      { x: 584, y: 248, w: 106, h: 56, label: 'System Prompt' }
    ]
  }
];

const STAGE4_BLOCKS = [
  { id: 'base', label: 'Base System' },
  { id: 'tools', label: 'Tool Definitions' },
  { id: 'workspace', label: 'Workspace Files' },
  { id: 'context', label: 'Dynamic Context' },
  { id: 'final', label: 'Final Prompt' }
];

const LAYER_LABELS = Object.fromEntries(STAGE4_BLOCKS.map((block) => [block.id, block.label]));

function evaluateAssembly(slots) {
  const required = STAGE4_BLOCKS.map((block) => block.id);
  const missing = required.filter((id) => !slots.includes(id));

  if (missing.length > 0) {
    const missingLayer = LAYER_LABELS[missing[0]];
    return {
      state: 'missing',
      output:
        'I can provide a general summary, but I cannot deliver a structured business analysis with this setup.',
      explanation: `Missing layer: ${missingLayer}. Structural consequence: the system loses a required decision input. Reasoning impact: output becomes generic and shallow.`
    };
  }

  const index = Object.fromEntries(required.map((id) => [id, slots.indexOf(id)]));
  const violations = [];

  if (index.base > index.final) {
    violations.push('Base System was placed after Final Prompt.');
  }
  if (index.tools > index.final) {
    violations.push('Tool Definitions was placed after Final Prompt.');
  }
  if (index.context > index.final) {
    violations.push('Dynamic Context was placed after Final Prompt.');
  }
  if (index.final < 3) {
    violations.push('Final Prompt was not near the bottom of the stack.');
  }
  if (!(index.base < index.tools && index.tools < index.workspace && index.workspace < index.context && index.context < index.final)) {
    violations.push('Layer sequencing does not follow foundational-to-task order.');
  }

  if (violations.length > 0) {
    return {
      state: 'misordered',
      output:
        'The response is partly coherent, but tone and execution are inconsistent. Some instructions conflict, and tool use is unreliable.',
      explanation: `Misordered layer: ${violations[0]} Structural consequence: interpretation happens with the wrong priority stack. Reasoning impact: the answer may contradict itself or ignore capabilities.`
    };
  }

  return {
    state: 'correct',
    output:
      'Based on the provided tools and context, here is the structured business analysis with clear assumptions, constraints, and execution steps.',
    explanation:
      'You placed foundational rules before context and task. Structural consequence: constraints were applied before interpretation. Reasoning impact: output stayed coherent, aligned, and actionable.'
  };
}

function StageTwoStory() {
  const [activeLayerId, setActiveLayerId] = useState('tools');
  const [visited, setVisited] = useState(new Set(['tools']));
  const activeLayer = useMemo(
    () => STAGE2_LAYERS.find((layer) => layer.id === activeLayerId) ?? STAGE2_LAYERS[0],
    [activeLayerId]
  );

  function activateLayer(layerId) {
    setActiveLayerId(layerId);
    setVisited((prev) => new Set([...prev, layerId]));
  }

  function handleKeyPick(event, layerId) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateLayer(layerId);
    }
  }

  return (
    <section className="stage-card" aria-label="Stage 2 architecture story">
      <h2>Stage 2 explains what each layer does before execution.</h2>
      <p className="stage-subtitle">
        Click any layer in the diagram. You will see its role, business analogy, and why placement
        matters.
      </p>

      <div className="story-layout">
        <div className="diagram-shell">
          <svg
            viewBox="0 0 1020 440"
            className="diagram stage2-diagram"
            role="img"
            aria-label="Interactive system environment"
          >
            <defs>
              <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#90b2d8" />
              </marker>
            </defs>

            {STAGE2_LAYERS.map((layer) => {
              const isActive = layer.id === activeLayerId;
              return (
                <g
                  key={`s2-${layer.id}`}
                  className={`layer clickable ${isActive ? 'active' : 'dim'}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${layer.title}`}
                  onClick={() => activateLayer(layer.id)}
                  onKeyDown={(event) => handleKeyPick(event, layer.id)}
                >
                  <rect
                    x={layer.group.x}
                    y={layer.group.y}
                    width={layer.group.w}
                    height={layer.group.h}
                    rx="10"
                    className="layer-box"
                  />
                  <text x={layer.group.x + layer.group.w / 2} y={layer.group.y + 20} className="layer-subtitle">
                    {layer.title}
                  </text>
                  {layer.subBoxes.map((box) => (
                    <g key={`${layer.id}-${box.label}`}>
                      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="6" className="sub-box" />
                      <text x={box.x + box.w / 2} y={box.y + box.h / 2 + 3} className="sub-label">
                        {box.label}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })}

            <g className="flow-lines">
              <path d="M136 118 L136 168 L420 168 L420 212" className="flow-line" markerEnd="url(#flowArrow)" />
              <path d="M410 118 L410 160 L480 160 L480 212" className="flow-line" markerEnd="url(#flowArrow)" />
              <path d="M716 118 L716 160 L540 160 L540 212" className="flow-line" markerEnd="url(#flowArrow)" />
              <path d="M936 118 L936 168 L600 168 L600 212" className="flow-line" markerEnd="url(#flowArrow)" />
            </g>

            <g>
              <rect x="440" y="346" width="170" height="44" rx="8" className="invoke-box" />
              <text x="525" y="372" className="invoke-label">
                Model Invocation
              </text>
              <path d="M392 304 L392 336 L475 336 L475 346" className="flow-line" markerEnd="url(#flowArrow)" />
              <path d="M518 304 L518 346" className="flow-line" markerEnd="url(#flowArrow)" />
              <path d="M638 304 L638 336 L560 336 L560 346" className="flow-line" markerEnd="url(#flowArrow)" />
            </g>
          </svg>
        </div>

        <aside className="explain-panel" aria-live="polite">
          <p className="explain-step">
            Stage 2 Progress: {visited.size}/{STAGE2_LAYERS.length} layers explored
          </p>
          <h3>{activeLayer.title}</h3>
          <p>{activeLayer.description}</p>
          <p className="panel-line">
            <strong>Business analogy:</strong> {activeLayer.businessAnalogy}
          </p>
          <p className="panel-line">
            <strong>Why this layer matters:</strong> {activeLayer.importance}
          </p>
          <p className="panel-line">
            <strong>If this layer is weak:</strong> {activeLayer.risk}
          </p>
          <p className="panel-line">
            <strong>Includes:</strong> {activeLayer.subs.join(', ')}
          </p>
          <p className="causal">Earlier layers shape how later instructions are interpreted.</p>
          <p className="next-line">Now try assembling the brain yourself.</p>
        </aside>
      </div>
    </section>
  );
}

function StageOneIntro({ onContinue }) {
  return (
    <section className="stage-card" aria-label="Stage 1 mental model">
      <h2>This is the environment the AI operates inside.</h2>
      <p className="stage-subtitle">
        Think of this like running a company: outcomes depend on systems, not just one request.
      </p>
      <p className="stage-subtitle">
        The AI does not see only your question. It sees the full operating environment first.
      </p>
      <p className="anchor-line">AI output depends on everything that comes before the question.</p>

      <div className="diagram-shell">
        <svg viewBox="0 0 970 390" className="diagram stage1-diagram" role="img" aria-label="Stage 1 environment overview">
          <defs>
            <marker id="stage1Arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#8daecf" />
            </marker>
          </defs>

          {LAYERS.map((layer) => (
            <g key={`s1-${layer.id}`} className="stage1-layer">
              <rect x={layer.x} y={layer.y} width={layer.w} height={layer.h} rx="12" className="stage1-box" />
              <text x={layer.x + layer.w / 2} y={layer.y + 34} className="stage1-title">
                {layer.title}
              </text>
              <rect x={layer.x + 14} y={layer.y + 44} width={layer.w - 28} height="28" rx="6" className="stage1-chip" />
              <text x={layer.x + layer.w / 2} y={layer.y + 56} className="stage1-chip-text">
                <tspan x={layer.x + layer.w / 2}>{layer.caption}</tspan>
                <tspan x={layer.x + layer.w / 2} dy="11">
                  {layer.example}
                </tspan>
              </text>
            </g>
          ))}

          <g className="stage1-flow">
            <path d="M138 132 L138 185 L430 185 L430 235" className="flow-line" markerEnd="url(#stage1Arrow)" />
            <path d="M356 132 L356 180 L470 180 L470 235" className="flow-line" markerEnd="url(#stage1Arrow)" />
            <path d="M584 132 L584 180 L510 180 L510 235" className="flow-line" markerEnd="url(#stage1Arrow)" />
            <path d="M816 132 L816 185 L550 185 L550 235" className="flow-line" markerEnd="url(#stage1Arrow)" />
          </g>
        </svg>
      </div>

      <div className="stage1-grid">
        {LAYERS.map((layer) => (
          <article key={`s1-card-${layer.id}`} className="stage1-card">
            <h3>{layer.title}</h3>
            <p>
              <strong>What it is:</strong> {layer.what}
            </p>
            <p>
              <strong>Why it matters:</strong> {layer.why}
            </p>
            <p>
              <strong>If missing:</strong> {layer.risk}
            </p>
          </article>
        ))}
      </div>

      <button type="button" className="continue-btn" onClick={onContinue}>
        Continue to Stage 2
      </button>
    </section>
  );
}

function StageThreePipeline() {
  const pipeline = [
    { id: 'base', label: 'Base System' },
    { id: 'tools', label: 'Tool Definitions' },
    { id: 'workspace', label: 'Workspace Files' },
    { id: 'context', label: 'Dynamic Context' },
    { id: 'final', label: 'Final Prompt' }
  ];

  return (
    <section className="stage-card" aria-label="Stage 3 vertical pipeline">
      <h2>Stage 3 shows the full stack in one clear flow.</h2>
      <p className="stage-subtitle">
        This is a simplified execution view. Top layers shape how lower layers are interpreted.
      </p>

      <div className="stage3-shell">
        {pipeline.map((item, index) => (
          <div key={item.id} className={`stage3-block stage3-${item.id}`}>
            {item.label}
            {index < pipeline.length - 1 ? (
              <div className="stage3-arrow" aria-hidden="true">
                ↓
              </div>
            ) : null}
          </div>
        ))}

        <div className="stage3-execution">Model Execution</div>
      </div>

      <p className="stage3-note">
        All of these layers combine before the task is executed. If the order changes,
        interpretation changes.
      </p>
    </section>
  );
}

function StageFourAssemble() {
  const [slots, setSlots] = useState([null, null, null, null, null]);
  const [draggedId, setDraggedId] = useState(null);
  const [result, setResult] = useState(null);

  const inventory = STAGE4_BLOCKS.filter((block) => !slots.includes(block.id));

  function removeFromSlots(nextSlots, id) {
    return nextSlots.map((slot) => (slot === id ? null : slot));
  }

  function handleDropToSlot(slotIndex) {
    if (!draggedId) return;
    setSlots((current) => {
      const cleaned = removeFromSlots([...current], draggedId);
      const replaced = cleaned[slotIndex];
      cleaned[slotIndex] = draggedId;
      if (replaced && replaced !== draggedId) {
        const empty = cleaned.findIndex((slot) => slot === null && slot !== draggedId);
        if (empty >= 0) cleaned[empty] = replaced;
      }
      return cleaned;
    });
  }

  function handleDropToInventory() {
    if (!draggedId) return;
    setSlots((current) => removeFromSlots([...current], draggedId));
  }

  function runAI() {
    setResult(evaluateAssembly(slots));
  }

  function reassemble() {
    setResult(null);
  }

  function resetAll() {
    setSlots([null, null, null, null, null]);
    setResult(null);
  }

  return (
    <section className="stage-card" aria-label="Stage 4 assemble the brain">
      <h2>Stage 4 tests whether you can assemble the brain correctly.</h2>
      <p className="stage-subtitle">
        Drag blocks from inventory into Slot 1-5, then click Run AI to see deterministic behavior.
      </p>

      <div className="stage4-layout">
        <div
          className="stage4-inventory"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleDropToInventory();
          }}
        >
          <h3>Inventory</h3>
          <p>Drag from here into the stack.</p>
          <div className="inv-list">
            {inventory.map((block) => (
              <article
                key={block.id}
                className={`inv-item inv-${block.id}`}
                draggable
                onDragStart={() => setDraggedId(block.id)}
                onDragEnd={() => setDraggedId(null)}
              >
                {block.label}
              </article>
            ))}
          </div>
        </div>

        <div className="stage4-stack">
          <h3>Assembly Stack</h3>
          <p>Place one layer per slot.</p>
          <div className="slot-list">
            {slots.map((slot, index) => (
              <div
                key={`slot-${index + 1}`}
                className={`slot ${slot ? 'filled' : 'empty'}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDropToSlot(index);
                }}
              >
                <span className="slot-label">Slot {index + 1}</span>
                {slot ? (
                  <article
                    className={`inv-item inv-${slot}`}
                    draggable
                    onDragStart={() => setDraggedId(slot)}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    {LAYER_LABELS[slot]}
                  </article>
                ) : (
                  <span className="slot-empty-text">Drop layer here</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stage4-actions">
        <button type="button" className="action-btn primary" onClick={runAI}>
          Run AI
        </button>
        <button type="button" className="action-btn" onClick={reassemble}>
          Reassemble
        </button>
        <button type="button" className="action-btn" onClick={resetAll}>
          Reset
        </button>
      </div>

      {result ? (
        <div className={`stage4-result ${result.state}`}>
          {result.state === 'correct' ? <p className="confirm-line">Brain assembled correctly.</p> : null}
          <h4>Output</h4>
          <p>{result.output}</p>
          <h4>What happened?</h4>
          <p>{result.explanation}</p>
          {result.state === 'correct' ? (
            <p className="causal">Earlier layers shaped how the task was interpreted.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default function App() {
  const [stage, setStage] = useState(1);

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">
          {stage === 1
            ? 'Stage 1: Mental Model'
            : stage === 2
              ? 'Stage 2: The Architecture Story'
              : stage === 3
                ? 'Stage 3: Visual Pipeline'
                : 'Stage 4: Assemble the Brain'}
        </p>
        <h1>Build the Brain. Run the Company.</h1>
        <p>
          {stage === 1
            ? 'Start with the mental model, then move to the architecture story.'
            : stage === 2
              ? 'Explore each layer to understand business meaning before testing.'
              : stage === 3
                ? 'Read the stack as top-to-bottom causality before interactive exercises.'
                : 'Assemble the layers yourself to validate whether order changes behavior.'}
        </p>
        <div className="stage-nav">
          <button
            type="button"
            className={stage === 1 ? 'stage-btn active' : 'stage-btn'}
            onClick={() => setStage(1)}
          >
            Stage 1
          </button>
          <button
            type="button"
            className={stage === 2 ? 'stage-btn active' : 'stage-btn'}
            onClick={() => setStage(2)}
          >
            Stage 2
          </button>
          <button
            type="button"
            className={stage === 3 ? 'stage-btn active' : 'stage-btn'}
            onClick={() => setStage(3)}
          >
            Stage 3
          </button>
          <button
            type="button"
            className={stage === 4 ? 'stage-btn active' : 'stage-btn'}
            onClick={() => setStage(4)}
          >
            Stage 4
          </button>
        </div>
      </header>
      {stage === 1 ? <StageOneIntro onContinue={() => setStage(2)} /> : null}
      {stage === 2 ? <StageTwoStory key="stage-two" /> : null}
      {stage === 3 ? <StageThreePipeline /> : null}
      {stage === 4 ? <StageFourAssemble /> : null}
    </div>
  );
}
