import { useEffect, useMemo, useState } from 'react';

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

const STAGE4_SECTIONS = [
  {
    id: 'base',
    title: 'Base System',
    hint: 'Drop components that define foundational behavior.',
    business: 'Corporate governance and non-negotiable policy.'
  },
  {
    id: 'tools',
    title: 'Tool Definitions',
    hint: 'Drop capability-related components here.',
    business: 'Operations team and specialist vendors.'
  },
  {
    id: 'workspace',
    title: 'Workspace Files',
    hint: 'Drop reference material used across sessions.',
    business: 'Company handbook and playbooks.'
  },
  {
    id: 'context',
    title: 'Dynamic Context',
    hint: 'Drop components describing what is happening right now.',
    business: 'Live meeting brief and current operating conditions.'
  },
  {
    id: 'final',
    title: 'Final Prompt',
    hint: 'Drop components that define this turn’s task packet.',
    business: 'Final board memo sent for execution.'
  }
];

const STAGE4_COMPONENTS = [
  { id: 'pi-core', label: 'Pi Agent Core', section: 'base', color: 'base', tip: 'Core runtime instructions, like company charter rules.', example: 'Example: Always follow safety boundaries and escalation rules.' },
  { id: 'built-in-tools', label: 'Built-in Tools', section: 'tools', color: 'tools', tip: 'Default operational capabilities the AI can use.', example: 'Example: Run calculations, browse docs, and read files.' },
  { id: 'plugin-tools', label: 'Plugin Tools', section: 'tools', color: 'tools', tip: 'Custom capabilities, like hiring specialist contractors.', example: 'Example: Pull CRM records or query finance systems.' },
  { id: 'agents-md', label: 'AGENTS.md', section: 'workspace', color: 'workspace', tip: 'Core behavior guidance, similar to operating policy.', example: 'Example: Prioritize risk checks before recommendations.' },
  { id: 'soul-md', label: 'SOUL.md', section: 'workspace', color: 'workspace', tip: 'Voice and tone guidance, like brand communication style.', example: 'Example: Use concise executive tone with clear actions.' },
  { id: 'tools-md', label: 'TOOLS.md', section: 'workspace', color: 'workspace', tip: 'Tool usage conventions for your local environment.', example: 'Example: Use finance plugin for P&L, not browser scraping.' },
  { id: 'session-history', label: 'Session History', section: 'context', color: 'context', tip: 'Recent chat context, like latest meeting notes.', example: 'Example: User already asked for Q4 margin breakdown.' },
  { id: 'memory-search', label: 'Memory Search', section: 'context', color: 'context', tip: 'Relevant past context, like pulling prior case files.', example: 'Example: Last quarter plan used to compare performance.' },
  { id: 'conversation-history', label: 'Conversation History', section: 'final', color: 'final', tip: 'Conversation packet included in the final request.', example: 'Example: Prior prompts, constraints, and clarifications.' },
  { id: 'user-message', label: 'User Message', section: 'final', color: 'final', tip: 'The immediate task request for this turn.', example: 'Example: “Draft a board-ready growth strategy memo.”' }
];

const COMPONENT_MAP = Object.fromEntries(STAGE4_COMPONENTS.map((item) => [item.id, item]));

function formatCount(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0';
  return value.toLocaleString();
}

const SCENARIOS = {
  finance: {
    label: 'Finance',
    stage0Line: 'You will learn how architecture improves financial decision quality and risk control.',
    stage1Line: 'In finance, architecture ensures policy and controls are applied before analysis.',
    stage2Line: 'The CFO asks for a board-ready margin and cash-flow briefing.',
    stage3Line: 'Finance flow: governance and tools should shape analysis before final recommendations.',
    stage4Line: 'Assemble the stack to generate a coherent board-style finance response.',
    itemExamples: {
      'pi-core': 'Example: Never disclose sensitive financial data.',
      'built-in-tools': 'Example: Read reports and run calculations.',
      'plugin-tools': 'Example: Query ERP and planning systems.',
      'agents-md': 'Example: Check risk policy before recommendations.',
      'soul-md': 'Example: Use concise boardroom financial language.',
      'tools-md': 'Example: Use approved finance tools first.',
      'session-history': 'Example: User asked for Q4 margin variance.',
      'memory-search': 'Example: Prior quarter assumptions for comparison.',
      'conversation-history': 'Example: Prior constraints and board context.',
      'user-message': 'Example: "Draft a board-ready margin action memo."'
    }
  },
  sales: {
    label: 'Sales',
    stage0Line: 'You will learn how architecture improves pipeline decisions and execution consistency.',
    stage1Line: 'In sales, architecture ensures customer context and policy are applied before outreach guidance.',
    stage2Line: 'The CRO asks for a regional pipeline health and recovery plan.',
    stage3Line: 'Sales flow: rules and capabilities should shape customer strategy before final messaging.',
    stage4Line: 'Assemble the stack to generate a reliable sales action plan.',
    itemExamples: {
      'pi-core': 'Example: Protect customer data and compliance boundaries.',
      'built-in-tools': 'Example: Parse pipeline sheets and summarize deals.',
      'plugin-tools': 'Example: Pull CRM opportunities and account notes.',
      'agents-md': 'Example: Follow pricing and discount guardrails.',
      'soul-md': 'Example: Use confident customer-facing language.',
      'tools-md': 'Example: Use CRM plugin before manual lookup.',
      'session-history': 'Example: User asked about stalled enterprise deals.',
      'memory-search': 'Example: Last quarter win-loss themes.',
      'conversation-history': 'Example: Prior account constraints and targets.',
      'user-message': 'Example: "Draft a regional pipeline recovery plan."'
    }
  },
  ops: {
    label: 'Operations',
    stage0Line: 'You will learn how architecture improves execution reliability and process decisions.',
    stage1Line: 'In operations, architecture ensures standards and current conditions are applied before action planning.',
    stage2Line: 'The COO asks for a weekly execution risk and mitigation brief.',
    stage3Line: 'Operations flow: policy and live context should shape execution priorities before final output.',
    stage4Line: 'Assemble the stack to generate a practical operations briefing.',
    itemExamples: {
      'pi-core': 'Example: Enforce safety and escalation policies.',
      'built-in-tools': 'Example: Read SOPs and summarize incidents.',
      'plugin-tools': 'Example: Pull ticketing and fulfillment data.',
      'agents-md': 'Example: Follow operational reliability standards.',
      'soul-md': 'Example: Use direct execution-first language.',
      'tools-md': 'Example: Use monitoring tools before manual checks.',
      'session-history': 'Example: User asked about delivery delays.',
      'memory-search': 'Example: Past incident retrospectives.',
      'conversation-history': 'Example: Prior workflow constraints and blockers.',
      'user-message': 'Example: "Draft a weekly execution risk update."'
    }
  }
};

function stage2Examples(scenarioKey, layerId) {
  const matrix = {
    finance: {
      tools: {
        component: 'Finance component example: approved capabilities to pull P&L and variance data.',
        subs: {
          'Built-in Tools': 'Built-in Tools: calculate margin deltas from uploaded sheets.',
          'Plugin Tools': 'Plugin Tools: query ERP for latest actuals.'
        }
      },
      context: {
        component: 'Finance component example: current quarter briefing context.',
        subs: {
          'Session History': 'Session History: CFO asked for Q4 margin shortfall diagnosis.',
          Skills: 'Skills: apply the finance-analysis playbook.',
          'Memory Search': 'Memory Search: retrieve last quarter assumptions and outcomes.'
        }
      },
      workspace: {
        component: 'Finance component example: reference files for policy and communication.',
        subs: {
          'AGENTS.md': 'AGENTS.md: enforce risk checks before advice.',
          'SOUL.md': 'SOUL.md: keep response boardroom concise.',
          'TOOLS.md': 'TOOLS.md: use ERP plugin before manual browsing.'
        }
      },
      base: {
        component: 'Finance component example: immutable governance baseline.',
        subs: {
          'Pi Agent Core': 'Pi Agent Core: never expose confidential financial data.'
        }
      },
      final: {
        component: 'Finance component example: final board request packet.',
        subs: {
          Conversation: 'Conversation History: prior constraints and scope.',
          'User Message': 'User Message: "Draft a board-ready margin recovery memo."',
          'System Prompt': 'System Prompt: enforce structure, risk framing, and actions.'
        }
      }
    },
    sales: {
      tools: {
        component: 'Sales component example: capabilities to inspect pipeline and accounts.',
        subs: {
          'Built-in Tools': 'Built-in Tools: summarize stage conversion rates.',
          'Plugin Tools': 'Plugin Tools: pull CRM opportunity details.'
        }
      },
      context: {
        component: 'Sales component example: live regional pipeline status.',
        subs: {
          'Session History': 'Session History: CRO asked about stalled enterprise deals.',
          Skills: 'Skills: apply pipeline-recovery playbook.',
          'Memory Search': 'Memory Search: retrieve last quarter win-loss patterns.'
        }
      },
      workspace: {
        component: 'Sales component example: reference files for policy and voice.',
        subs: {
          'AGENTS.md': 'AGENTS.md: enforce discount and compliance guardrails.',
          'SOUL.md': 'SOUL.md: keep tone decisive and customer-focused.',
          'TOOLS.md': 'TOOLS.md: prioritize CRM plugin workflows.'
        }
      },
      base: {
        component: 'Sales component example: baseline data and conduct rules.',
        subs: {
          'Pi Agent Core': 'Pi Agent Core: protect customer data by default.'
        }
      },
      final: {
        component: 'Sales component example: final action-plan request packet.',
        subs: {
          Conversation: 'Conversation History: prior account constraints and goals.',
          'User Message': 'User Message: "Draft a regional pipeline recovery plan."',
          'System Prompt': 'System Prompt: require clear actions and ownership.'
        }
      }
    },
    ops: {
      tools: {
        component: 'Capabilities to monitor execution reliability.',
        subs: {
          'Built-in Tools': 'Built-in Tools: summarize delays and bottlenecks.',
          'Plugin Tools': 'Plugin Tools: pull ticketing and fulfillment metrics.'
        }
      },
      context: {
        component: 'Current execution status briefing.',
        subs: {
          'Session History': 'Session History: COO asked about delivery delays.',
          Skills: 'Skills: apply incident-triage playbook.',
          'Memory Search': 'Memory Search: retrieve similar incident retrospectives.'
        }
      },
      workspace: {
        component: 'Process and policy reference set.',
        subs: {
          'AGENTS.md': 'AGENTS.md: enforce reliability standards.',
          'SOUL.md': 'SOUL.md: keep language direct and execution-first.',
          'TOOLS.md': 'TOOLS.md: use monitoring tools before manual checks.'
        }
      },
      base: {
        component: 'Non-negotiable safety baseline.',
        subs: {
          'Pi Agent Core': 'Pi Agent Core: enforce escalation and safety constraints.'
        }
      },
      final: {
        component: 'Final risk-brief request packet.',
        subs: {
          Conversation: 'Conversation History: prior blockers and constraints.',
          'User Message': 'User Message: "Draft a weekly execution risk update."',
          'System Prompt': 'System Prompt: require risk table and mitigation steps.'
        }
      }
    }
  };

  return matrix[scenarioKey]?.[layerId] ?? { component: '', subs: {} };
}

const GLOSSARY = [
  { term: 'Context', def: 'What is happening right now in the conversation.' },
  { term: 'Constraints', def: 'Rules that limit what the AI should or should not do.' },
  { term: 'Execution', def: 'How the system turns instructions into a response.' },
  { term: 'Capabilities', def: 'Tools and actions the AI is allowed to use.' },
  { term: 'Governance', def: 'Policy and control rules for consistent behavior.' },
  { term: 'Prompt Packet', def: 'The full instruction bundle sent for this turn.' },
  { term: 'Static Inputs', def: 'Stable references like policies and playbooks.' },
  { term: 'Dynamic Inputs', def: 'Live signals like recent messages and retrieved memory.' }
];

const CONFIDENCE_OPTIONS = [1, 2, 3, 4, 5];

function flattenPlacement(placement) {
  return STAGE4_SECTIONS.flatMap((section) => placement[section.id]);
}

function evaluateAssembly(placement) {
  const allPlaced = flattenPlacement(placement);
  const requiredIds = STAGE4_COMPONENTS.map((item) => item.id);
  const missing = requiredIds.filter((id) => !allPlaced.includes(id));

  if (missing.length > 0) {
    const missingItem = COMPONENT_MAP[missing[0]].label;
    return {
      state: 'missing',
      output:
        'The answer is generic and thin. It does not use strong capabilities, context, or policy grounding.',
      explanation: `Missing component: ${missingItem}. Structural consequence: a required input never reaches execution. Reasoning impact: decisions become shallow and under-informed.`
    };
  }

  for (const section of STAGE4_SECTIONS) {
    for (const itemId of placement[section.id]) {
      const item = COMPONENT_MAP[itemId];
      if (item.section !== section.id) {
        return {
          state: 'misordered',
          output:
            'The response is partly coherent, but tone and execution conflict. Some parts ignore tools or context.',
          explanation: `You placed ${item.label} inside ${section.title}. ${item.label} belongs in ${STAGE4_SECTIONS.find((s) => s.id === item.section).title}. Structural consequence: the wrong layer is consulted at the wrong time. Reasoning impact: interpretation quality drops.`
        };
      }
    }
  }

  const baseHasCore = placement.base.includes('pi-core');
  const toolsHaveCapabilities = placement.tools.includes('built-in-tools') || placement.tools.includes('plugin-tools');
  const dynamicAfterStatic = placement.context.length > 0 && placement.workspace.length > 0;
  const finalNearBottom = placement.final.length >= 2;

  if (!baseHasCore) {
    return {
      state: 'missing',
      output: 'The response sounds unconstrained and inconsistent.',
      explanation:
        'Missing component: Pi Agent Core in Base System. Structural consequence: foundational behavior is undefined. Reasoning impact: responses drift and violate policy expectations.'
    };
  }

  if (!toolsHaveCapabilities) {
    return {
      state: 'missing',
      output: 'The response is generic and cannot execute practical business actions.',
      explanation:
        'Missing capability layer: Tool Definitions has no usable tools. Structural consequence: the system cannot perform structured operations. Reasoning impact: advice stays high-level and non-executable.'
    };
  }

  if (!dynamicAfterStatic || !finalNearBottom) {
    return {
      state: 'misordered',
      output:
        'The response has partial logic but misses situational precision. It reads like a template, not a grounded decision.',
      explanation:
        'Ordering issue detected between static references, dynamic context, and final task packet. Structural consequence: context arrives with weak priority. Reasoning impact: task interpretation loses precision.'
    };
  }

  return {
    state: 'correct',
    output:
      'Based on available tools, live context, and policy references, here is a structured business analysis with aligned tone and actionable next steps.',
    explanation:
      'All components were placed in the correct layer order. Structural consequence: capabilities, policy, and context were integrated before execution. Reasoning impact: output remained coherent, reliable, and operationally useful.'
  };
}

function ConfidenceCheck({ title, answers, onAnswer, gain = null }) {
  const questions = [
    {
      id: 'order',
      label: 'How confident are you in explaining why architecture order changes AI behavior?'
    },
    {
      id: 'roles',
      label: 'How confident are you in explaining each layer’s role in business terms?'
    }
  ];

  return (
    <section className="confidence-card" aria-label={title}>
      <h3>{title}</h3>
      {questions.map((question) => (
        <div key={question.id} className="confidence-row">
          <p>{question.label}</p>
          <div className="confidence-options">
            {CONFIDENCE_OPTIONS.map((value) => (
              <button
                key={`${question.id}-${value}`}
                type="button"
                className={answers[question.id] === value ? 'confidence-btn active' : 'confidence-btn'}
                onClick={() => onAnswer(question.id, value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
      {gain ? (
        <p className="confidence-gain">
          Learning gain: +{gain.order} on order understanding, +{gain.roles} on layer-role clarity.
        </p>
      ) : null}
    </section>
  );
}

function GlossaryDrawer({ open, onToggle }) {
  return (
    <div className={open ? 'glossary open' : 'glossary'}>
      <button type="button" className="glossary-toggle" onClick={onToggle}>
        {open ? 'Close Glossary' : 'Glossary'}
      </button>
      {open ? (
        <div className="glossary-panel">
          <h4>Quick Glossary</h4>
          <ul>
            {GLOSSARY.map((item) => (
              <li key={item.term}>
                <strong>{item.term}:</strong> {item.def}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function StageTwoStory({ scenarioKey, onContinue }) {
  const [activeLayerId, setActiveLayerId] = useState('tools');
  const [visited, setVisited] = useState(new Set(['tools']));
  const activeLayer = useMemo(
    () => STAGE2_LAYERS.find((layer) => layer.id === activeLayerId) ?? STAGE2_LAYERS[0],
    [activeLayerId]
  );
  const activeExamples = useMemo(() => stage2Examples(scenarioKey, activeLayerId), [scenarioKey, activeLayerId]);

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
      <p className="business-line">Why this matters in business: {SCENARIOS[scenarioKey].stage2Line}</p>
      <p className="stage-subtitle">
        Reference: OpenClaw System Prompt Architecture overview by Paolo Perazzo.
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
          <p className="lead-line">{activeLayer.description}</p>

          <div className="insight-grid">
            <article className="insight-card analogy">
              <h4>Business analogy</h4>
              <p>{activeLayer.businessAnalogy}</p>
            </article>
            <article className="insight-card importance">
              <h4>Why this layer matters</h4>
              <p>{activeLayer.importance}</p>
            </article>
            <article className="insight-card risk">
              <h4>If this layer is weak</h4>
              <p>{activeLayer.risk}</p>
            </article>
          </div>

          <article className="insight-card full includes">
            <h4>Includes</h4>
            <p>{activeLayer.subs.join(', ')}</p>
            <p className="panel-line compact"><strong>Component example:</strong> {activeExamples.component}</p>
          </article>

          <article className="insight-card full subexamples">
            <h4>Subcomponent examples</h4>
            <ul className="subexample-list">
              {activeLayer.subs.map((sub) => (
                <li key={`sub-${sub}`}>{activeExamples.subs[sub] ?? `${sub}: context-specific input for this layer.`}</li>
              ))}
            </ul>
          </article>

          <p className="panel-line compact"><strong>Business example:</strong> {SCENARIOS[scenarioKey].stage2Line}</p>
          <p className="causal">Earlier layers shape how later instructions are interpreted.</p>
        </aside>
      </div>
      <div className="stage-footer-nav">
        <button type="button" className="action-btn primary" onClick={onContinue}>
          Continue to Stage 3
        </button>
      </div>
    </section>
  );
}

function StageOneIntro({ onContinue, scenarioKey }) {
  return (
    <section className="stage-card" aria-label="Stage 1 mental model">
      <h2>This is the environment the AI operates inside.</h2>
      <p className="stage-subtitle">
        Think of this like running a company: outcomes depend on systems, not just one request.
      </p>
      <p className="stage-subtitle">
        The AI does not see only your question. It sees the full operating environment first.
      </p>
      <p className="business-line">Why this matters in business: {SCENARIOS[scenarioKey].stage1Line}</p>
      <p className="anchor-line">AI output depends on everything that comes before the question.</p>
      <p className="stage-subtitle">
        Reference model: OpenClaw System Prompt Architecture overview by Paolo Perazzo.
      </p>

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

function StageThreePipeline({ scenarioKey, onContinue }) {
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
      <p className="business-line">Why this matters in business: {SCENARIOS[scenarioKey].stage3Line}</p>

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
      <div className="stage-footer-nav">
        <button type="button" className="action-btn primary" onClick={onContinue}>
          Continue to Stage 4
        </button>
      </div>
    </section>
  );
}

function StageZeroIntro({ onStart, onPreview, preConfidence, onPreAnswer, scenarioKey, sessionCount }) {
  const whyPoints = [
    'Composable architecture: teams can update behavior without rebuilding the full system.',
    'Controllable behavior: clear layers create predictable responses under pressure.',
    'Enterprise relevance: architecture decisions map directly to policy, risk, and execution.'
  ];

  const timeline = [
    { stage: 'Stage 1', purpose: 'Understand the environment the AI operates inside.' },
    { stage: 'Stage 2', purpose: 'Learn what each architecture layer is responsible for.' },
    { stage: 'Stage 3', purpose: 'See the top-to-bottom flow before execution.' },
    { stage: 'Stage 4', purpose: 'Assemble the brain and validate your understanding.' }
  ];

  const outcomes = [
    'Identify all five architecture layers and explain each role.',
    'Diagnose how misplacement or missing layers degrade output quality.',
    'Explain why architecture drives behavior in business language.'
  ];

  return (
    <section className="stage-card stage0" aria-label="Stage 0 orientation">
      <div className="stage0-hero">
        <p className="stage0-kicker">Stage 0: Orientation</p>
        <h2>Build the Brain. Run the Company.</h2>
        <p className="stage0-subtitle">A business simulation of OpenClaw System Prompt Architecture.</p>
        <p className="stage0-anchor">Architecture drives behavior.</p>
        <p className="session-count-line">Sessions started: {formatCount(sessionCount)}</p>
      </div>

      <div className="stage0-grid">
        <article className="stage0-panel">
          <h3>Why OpenClaw Matters</h3>
          <ul>
            {whyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="stage0-panel">
          <h3>What You’ll Do</h3>
          <div className="stage0-timeline">
            {timeline.map((item) => (
              <div key={item.stage} className="stage0-step">
                <strong>{item.stage}</strong>
                <span>{item.purpose}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="stage0-strip">
        <strong>Who This Is For:</strong> MBA students, product leaders, and strategy teams.
      </div>

      <article className="stage0-panel">
        <h3>What You’ll Leave With</h3>
        <ul>
          {outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </article>

      <p className="business-line">Why this matters in business: {SCENARIOS[scenarioKey].stage0Line}</p>

      <ConfidenceCheck title="Pre-Check (Before Stage 1)" answers={preConfidence} onAnswer={onPreAnswer} />

      <div className="stage0-actions">
        <button type="button" className="action-btn primary" onClick={onStart}>
          Start Stage 1
        </button>
        <button type="button" className="action-btn" onClick={onPreview}>
          Preview Stages
        </button>
      </div>
    </section>
  );
}

function StageFourAssemble({ postConfidence, onPostAnswer, preConfidence, scenarioKey, onOpenShare }) {
  const [placement, setPlacement] = useState({
    base: [],
    tools: [],
    workspace: [],
    context: [],
    final: []
  });
  const [draggedId, setDraggedId] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(STAGE4_COMPONENTS[0].id);
  const [selectedSection, setSelectedSection] = useState(STAGE4_SECTIONS[0].id);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const inventory = STAGE4_COMPONENTS.filter((item) => !flattenPlacement(placement).includes(item.id));

  function removeFromSections(nextPlacement, id) {
    const cleaned = {};
    for (const section of STAGE4_SECTIONS) {
      cleaned[section.id] = nextPlacement[section.id].filter((itemId) => itemId !== id);
    }
    return cleaned;
  }

  function handleDropToSection(sectionId) {
    if (!draggedId) return;
    setPlacement((current) => {
      const cleaned = removeFromSections({ ...current }, draggedId);
      return { ...cleaned, [sectionId]: [...cleaned[sectionId], draggedId] };
    });
  }

  function handleDropToInventory() {
    if (!draggedId) return;
    setPlacement((current) => removeFromSections({ ...current }, draggedId));
  }

  function moveComponentKeyboard() {
    if (!selectedComponent) return;
    setPlacement((current) => {
      const cleaned = removeFromSections({ ...current }, selectedComponent);
      return { ...cleaned, [selectedSection]: [...cleaned[selectedSection], selectedComponent] };
    });
  }

  function returnToInventoryKeyboard() {
    if (!selectedComponent) return;
    setPlacement((current) => removeFromSections({ ...current }, selectedComponent));
  }

  function runAI() {
    setResult(evaluateAssembly(placement));
  }

  function reassemble() {
    setResult(null);
  }

  function resetAll() {
    setPlacement({
      base: [],
      tools: [],
      workspace: [],
      context: [],
      final: []
    });
    setResult(null);
  }

  return (
    <section className="stage-card" aria-label="Stage 4 assemble the brain">
      <h2>Stage 4 tests whether you can assemble the brain correctly.</h2>
      <p className="stage-subtitle">
        Drag components into the right sections, then click Run AI to see deterministic behavior.
      </p>
      <p className="stage-subtitle">
        Support: Hover components to see business analogies while assembling.
      </p>
      <p className="business-line">Why this matters in business: {SCENARIOS[scenarioKey].stage4Line}</p>

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
          <p>Drag specific components into the correct architecture section.</p>
          <div className="inv-list">
            {inventory.map((item) => (
              <article
                key={item.id}
                className={`inv-item inv-${item.color}`}
                draggable
                onDragStart={() => setDraggedId(item.id)}
                onDragEnd={() => setDraggedId(null)}
                title={item.tip}
              >
                <strong>{item.label}</strong>
                <span>{SCENARIOS[scenarioKey].itemExamples[item.id] ?? item.example}</span>
              </article>
            ))}
          </div>
          <div className="keyboard-toggle-row">
            <button
              type="button"
              className="action-btn"
              onClick={() => setShowKeyboard((value) => !value)}
              aria-expanded={showKeyboard}
            >
              {showKeyboard ? 'Hide Keyboard Placement' : 'Show Keyboard Placement (Accessibility)'}
            </button>
          </div>
          {showKeyboard ? (
            <div className="keyboard-controls">
              <p className="keyboard-note">
                Drag and drop is the default interaction. This keyboard placement panel is provided as
                an accessibility option.
              </p>
              <h4>Keyboard Placement</h4>
              <label>
                Component
                <select value={selectedComponent} onChange={(event) => setSelectedComponent(event.target.value)}>
                  {STAGE4_COMPONENTS.map((item) => (
                    <option key={`pick-${item.id}`} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Section
                <select value={selectedSection} onChange={(event) => setSelectedSection(event.target.value)}>
                  {STAGE4_SECTIONS.map((section) => (
                    <option key={`drop-${section.id}`} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="keyboard-actions">
                <button type="button" className="action-btn" onClick={moveComponentKeyboard}>
                  Place
                </button>
                <button type="button" className="action-btn" onClick={returnToInventoryKeyboard}>
                  Return
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="stage4-stack">
          <h3>Architecture Sections</h3>
          <p>Group correctly, then run the system.</p>
          <div className="section-list">
            {STAGE4_SECTIONS.map((section) => (
              <div
                key={section.id}
                className={`section-slot ${placement[section.id].length > 0 ? 'filled' : 'empty'}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDropToSection(section.id);
                }}
                title={section.business}
              >
                <span className="section-label">{section.title}</span>
                <span className="section-hint">{section.hint}</span>
                <div className="section-items">
                  {placement[section.id].length > 0 ? (
                    placement[section.id].map((itemId) => {
                      const item = COMPONENT_MAP[itemId];
                      return (
                        <article
                          key={itemId}
                          className={`inv-item inv-${item.color}`}
                          draggable
                          onDragStart={() => setDraggedId(itemId)}
                          onDragEnd={() => setDraggedId(null)}
                          title={item.tip}
                        >
                          <strong>{item.label}</strong>
                          <span>{SCENARIOS[scenarioKey].itemExamples[item.id] ?? item.example}</span>
                        </article>
                      );
                    })
                  ) : (
                    <span className="slot-empty-text">Drop components here</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-guide">
        <h4>Quick Business Guide</h4>
        <ul>
          {STAGE4_SECTIONS.map((section) => (
            <li key={`guide-${section.id}`}>
              <strong>{section.title}:</strong> {section.business}
            </li>
          ))}
        </ul>
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

      <ConfidenceCheck
        title="Post-Check (After Stage 4)"
        answers={postConfidence}
        onAnswer={onPostAnswer}
        gain={
          preConfidence.order && preConfidence.roles && postConfidence.order && postConfidence.roles
            ? {
                order: postConfidence.order - preConfidence.order,
                roles: postConfidence.roles - preConfidence.roles
              }
            : null
        }
      />
      <div className="share-prompt-card">
        <h4>Was this helpful?</h4>
        <p>If this helped you, consider sharing it with a friend or one person in your network.</p>
        <button type="button" className="action-btn primary" onClick={onOpenShare}>
          Open Share & About
        </button>
      </div>
      {result?.state === 'correct' ? (
        <div className="completion-summary">
          <h4>You can now explain:</h4>
          <ul>
            <li>Which components belong to each architecture layer.</li>
            <li>Why static and dynamic inputs must be sequenced correctly.</li>
            <li>How architecture quality changes output quality in business terms.</li>
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export default function App() {
  const [stage, setStage] = useState(0);
  const [scenarioKey, setScenarioKey] = useState('finance');
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [preConfidence, setPreConfidence] = useState({ order: null, roles: null });
  const [postConfidence, setPostConfidence] = useState({ order: null, roles: null });
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = 'Explore this business simulation of OpenClaw System Prompt Architecture.';
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const xShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const emailShare = `mailto:?subject=${encodeURIComponent('Build the Brain. Run the Company.')}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  useEffect(() => {
    const savedStage = Number.parseInt(localStorage.getItem('openclaw_stage') ?? '0', 10);
    if (!Number.isNaN(savedStage) && savedStage >= 0 && savedStage <= 4) {
      setStage(savedStage);
    }
    const savedScenario = localStorage.getItem('openclaw_scenario');
    if (savedScenario && SCENARIOS[savedScenario]) {
      setScenarioKey(savedScenario);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('openclaw_stage', String(stage));
  }, [stage]);

  useEffect(() => {
    localStorage.setItem('openclaw_scenario', scenarioKey);
  }, [scenarioKey]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') setPresenterOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    async function trackAndFetchSessions() {
      const tabSessionKey = 'openclaw_tab_session_started';
      const sessionIdKey = 'openclaw_tab_session_id';

      let sessionId = sessionStorage.getItem(sessionIdKey);
      if (!sessionId) {
        sessionId =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        sessionStorage.setItem(sessionIdKey, sessionId);
      }

      if (!sessionStorage.getItem(tabSessionKey)) {
        sessionStorage.setItem(tabSessionKey, '1');
        try {
          await fetch('/api/session-start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
        } catch {
          // Do not block app flow if tracking endpoint is unavailable.
        }
      }

      try {
        const response = await fetch('/api/session-count');
        const data = await response.json();
        if (typeof data?.count === 'number') {
          setSessionCount(data.count);
        }
      } catch {
        setSessionCount(0);
      }
    }

    trackAndFetchSessions();
  }, []);

  function updatePreConfidence(id, value) {
    setPreConfidence((prev) => ({ ...prev, [id]: value }));
  }

  function updatePostConfidence(id, value) {
    setPostConfidence((prev) => ({ ...prev, [id]: value }));
  }

  async function handleCopyShare() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareCopied(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-topbar">
          <button type="button" className="presenter-menu-btn" onClick={() => setPresenterOpen(true)}>
            Share & About
          </button>
        </div>
        <p className="eyebrow">
          {stage === 1
            ? 'Stage 1: Mental Model'
            : stage === 2
              ? 'Stage 2: The Architecture Story'
              : stage === 3
                ? 'Stage 3: Visual Pipeline'
                : stage === 4
                  ? 'Stage 4: Assemble the Brain'
                  : 'Stage 0: Orientation'}
        </p>
        <h1>Build the Brain. Run the Company.</h1>
        <p>
          {stage === 1
            ? 'Start with the mental model, then move to the architecture story.'
            : stage === 2
              ? 'Explore each layer to understand business meaning before testing.'
              : stage === 3
                ? 'Read the stack as top-to-bottom causality before interactive exercises.'
                : stage === 4
                  ? 'Assemble the layers yourself to validate whether order changes behavior.'
                  : 'Understand the purpose, motive, and outcomes before entering the learning path.'}
        </p>
        <p className="source-line">
          Grounded in: <a href="https://ppaolo.substack.com/p/openclaw-system-architecture-overview" target="_blank" rel="noreferrer">OpenClaw System Architecture Overview</a>
        </p>
        <div className="scenario-row">
          <label>
            Scenario
            <select value={scenarioKey} onChange={(event) => setScenarioKey(event.target.value)}>
              {Object.entries(SCENARIOS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="stage-nav">
          <button
            type="button"
            className={stage === 0 ? 'stage-btn active' : 'stage-btn'}
            onClick={() => setStage(0)}
          >
            Stage 0
          </button>
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
      {stage === 0 ? (
        <StageZeroIntro
          onStart={() => setStage(1)}
          onPreview={() => setStage(3)}
          preConfidence={preConfidence}
          onPreAnswer={updatePreConfidence}
          scenarioKey={scenarioKey}
          sessionCount={sessionCount}
        />
      ) : null}
      {stage === 1 ? <StageOneIntro onContinue={() => setStage(2)} scenarioKey={scenarioKey} /> : null}
      {stage === 2 ? <StageTwoStory key="stage-two" scenarioKey={scenarioKey} onContinue={() => setStage(3)} /> : null}
      {stage === 3 ? <StageThreePipeline scenarioKey={scenarioKey} onContinue={() => setStage(4)} /> : null}
      {stage === 4 ? (
        <StageFourAssemble
          postConfidence={postConfidence}
          onPostAnswer={updatePostConfidence}
          preConfidence={preConfidence}
          scenarioKey={scenarioKey}
          onOpenShare={() => setPresenterOpen(true)}
        />
      ) : null}
      <GlossaryDrawer open={glossaryOpen} onToggle={() => setGlossaryOpen((value) => !value)} />

      {presenterOpen ? (
        <div className="presenter-modal" onClick={() => setPresenterOpen(false)}>
          <aside
            className="presenter-panel open"
            aria-label="Share and about"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="presenter-close" onClick={() => setPresenterOpen(false)}>
              X
            </button>
            <h3>Share & About</h3>

            <section className="presenter-section">
              <h4>Share This App</h4>
              <p>If this helped you, share it with one person in your network.</p>
              <p className="session-count-line">Sessions started: {formatCount(sessionCount)}</p>
              <div className="share-row">
                <input type="text" readOnly value={shareUrl} aria-label="Share link" />
                <button type="button" className="action-btn" onClick={handleCopyShare}>
                  {shareCopied ? 'Copied' : 'Copy Link'}
                </button>
              </div>
              <div className="share-links">
                <a href={linkedinShare} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={xShare} target="_blank" rel="noreferrer">X</a>
                <a href={whatsappShare} target="_blank" rel="noreferrer">WhatsApp</a>
                <a href={emailShare}>Email</a>
              </div>
            </section>

            <div className="presenter-avatar">N</div>
            <h3>Nishchay Vishwanath</h3>
            <p className="presenter-role">Prefers to be called Nish.</p>

            <section className="presenter-section presenter-links">
              <h4>Profile Links</h4>
              <p className="profile-subtitle">Please do connect with me on LinkedIn</p>
              <a href="https://www.linkedin.com/in/nishchay-v/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href="mailto:nv268@cornell.edu">Email</a>
            </section>

            <section className="presenter-section">
              <h4>Who I Am</h4>
              <p>
                I’m exploring how AI systems are structured under the hood. This project is part of
                that learning.
              </p>
            </section>

            <section className="presenter-section">
              <h4>What This Is</h4>
              <ul>
                <li>A walkthrough of how system layers shape AI behavior.</li>
                <li>A small drag-and-drop experiment to test if order matters.</li>
                <li>An attempt to make something technical easier to reason about.</li>
              </ul>
            </section>

            <section className="presenter-section">
              <h4>What I’m Curious About</h4>
              <ul>
                <li>Why reliable systems behave differently from chaotic ones.</li>
                <li>How structure shapes decisions.</li>
                <li>How businesses can be educated on AI systems.</li>
              </ul>
            </section>

            <section className="presenter-section">
              <h4>Now</h4>
              <p>Learning in public.</p>
            </section>

            <section className="presenter-section">
              <h4>Next</h4>
              <p>Improving this once I understand it better.</p>
            </section>

            <section className="presenter-section">
              <h4>Fun Fact</h4>
              <p>I keep a list of failed ideas. Most of them come back stronger.</p>
              <p>Then I go on tilt playing poker.</p>
            </section>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
