import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';

type FormKind = 'pilot' | 'demo' | 'contact';

const pageLoadedAt = Date.now();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

const commonFields = [
  ['name', 'Full Name', 'text', true],
  ['company', 'Company', 'text', true],
  ['role', 'Role', 'text', true],
  ['email', 'Email', 'email', true],
  ['phone', 'Phone', 'text', false],
  ['mine_operation', 'Mine / Operation', 'text', false],
  ['state', 'State', 'text', false],
  ['underground_workers', 'Underground Workers', 'number', false],
] as const;

function App() {
  const [activeForm, setActiveForm] = useState<FormKind>('pilot');
  const [status, setStatus] = useState<Record<FormKind, string>>({
    pilot: '',
    demo: '',
    contact: '',
  });

  async function submitLead(event: FormEvent<HTMLFormElement>, kind: FormKind) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, string | number | null> = {
      name: String(data.get('name') || '').trim(),
      company: String(data.get('company') || '').trim(),
      role: String(data.get('role') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      mine_operation: String(data.get('mine_operation') || '').trim(),
      state: String(data.get('state') || '').trim(),
      underground_workers: Number(data.get('underground_workers') || 0) || null,
      main_challenge: String(data.get('main_challenge') || '').trim(),
      timeline: String(data.get('timeline') || '').trim(),
      notes: String(data.get('notes') || '').trim(),
      website: String(data.get('website') || ''),
      _loadedAt: pageLoadedAt,
    };

    if (kind === 'pilot') payload.pilot_scope = String(data.get('pilot_scope') || '').trim();
    if (kind === 'demo') payload.preferred_date = String(data.get('preferred_date') || '').trim();
    if (kind === 'contact') payload.inquiry_type = String(data.get('inquiry_type') || 'general').trim();

    setStatus((current) => ({ ...current, [kind]: `Submitting ${kind} request...` }));

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/leads/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.detail || 'Request failed');
      setStatus((current) => ({ ...current, [kind]: `${kind[0].toUpperCase()}${kind.slice(1)} request submitted successfully.` }));
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      setStatus((current) => ({ ...current, [kind]: `Error: ${message}` }));
    }
  }

  function openForm(kind: FormKind) {
    setActiveForm(kind);
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label="SubMapify home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14H52V22H20V50H12V14Z" fill="currentColor" />
                <path d="M28 30H52V38H36V50H28V30Z" fill="currentColor" opacity=".7" />
                <path d="M44 42H52V50H44V42Z" fill="currentColor" opacity=".45" />
              </svg>
            </span>
            <span>SubMapify</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#use-cases">Use Cases</a>
            <a href="#pilot">Pilot</a>
            <a href="#proof">Proof</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="btn btn-secondary" onClick={() => openForm('demo')}>Book a Demo</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow"><span className="pulse" /> Offline mine safety network</span>
              <h1>Know where every miner is — from shaft to working face.</h1>
              <p className="hero-lede">SubMapify is an offline underground worker tracking and emergency response system for deep, GPS-denied mines using smart helmets, LoRa relay nodes, UWB anchors, and a surface supervisor dashboard.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => openForm('pilot')}>Request a Pilot</button>
                <button className="btn btn-secondary" onClick={() => openForm('demo')}>Book a Demo</button>
              </div>
              <div className="hero-metrics">
                <Metric value="3,000 m" label="Target deep-mine operating profile" />
                <Metric value="< 10 sec" label="Target underground-to-surface visibility" />
                <Metric value="Offline" label="No GPS, mobile network, or internet dependency" />
              </div>
            </div>
            <MineConsole />
          </div>
        </section>

        <InfoSection
          id="problem"
          kicker="The underground visibility gap"
          title="Conventional tracking breaks where mine risk is highest."
          copy="Deep operations need a system built around rock, distance, blind drifts, and emergency response pressure."
        >
          <div className="problem-grid">
            <Card code="GPS" title="GPS underground" copy="Satellite signals disappear below the surface, removing reliable location awareness once workers enter the mine." />
            <Card code="BLE" title="BLE alone" copy="Short-range tags cannot cover long drifts or move reliable data back to supervisors at surface level." />
            <Card code="WiFi" title="Wi-Fi burden" copy="Dense powered infrastructure is expensive, fragile, and hard to maintain across complex underground layouts." />
            <Card code="LOG" title="Manual check-ins" copy="Paper and voice updates become stale quickly during shift movement or high-pressure rescue events." />
            <Card code="SOS" title="Slow response" copy="Without a last-known path and local alert flow, emergency coordination loses precious minutes." />
          </div>
        </InfoSection>

        <InfoSection
          id="solution"
          kicker="System architecture"
          title="A local tracking layer for deep, GPS-denied mines."
          copy="SubMapify combines wearable location data, local correction points, relay communication, and a supervisor dashboard into one pilot-ready system."
        >
          <div className="solution-grid">
            <div className="flow-stack">
              {['Smart helmet units', 'LoRa relay path', 'UWB correction anchors', 'Surface dashboard'].map((title, index) => (
                <div className="flow-step" key={title}>
                  <span className="flow-num">{String(index + 1).padStart(2, '0')}</span>
                  <div><strong>{title}</strong><span>{['Worker identity, movement signals, shift battery, and emergency trigger input.', 'Low-power underground relay nodes move worker and SOS events through long drifts.', 'Selected junctions add higher-confidence position fixes where decisions matter.', 'Supervisors see worker positions, tunnel activity, network health, and emergency events.'][index]}</span></div>
                </div>
              ))}
            </div>
            <div className="dashboard-panel">
              <div className="console-top"><span>Supervisor dashboard</span><span>Control layer · Pilot mode</span></div>
              <div className="dash-row">
                <div className="dash-widget wide"><div className="widget-title"><span>Worker movement trace</span><span>Level -3</span></div><div className="trace"><span className="trace-line" /><span className="trace-dot td1" /><span className="trace-dot td2" /><span className="trace-dot td3" /></div></div>
                <DashboardList title="Network status" rows={[['Node 03', 'Online'], ['Node 07', 'Online'], ['Node 18', 'Weak'], ['Gateway', 'Online']]} />
                <DashboardList title="Emergency queue" rows={[['Helmet 28', 'SOS'], ['Zone B-4', 'Gas watch'], ['Rescue team', 'Assigned'], ['ETA', '04 min']]} />
              </div>
            </div>
          </div>
        </InfoSection>

        <InfoSection kicker="Operational outcomes" title="Built for mine teams evaluating a real pilot." copy="The website speaks to operators, safety heads, and leadership teams who need practical deployment value.">
          <div className="outcome-grid">
            {[
              ['01', 'Works fully offline', 'Runs where GPS, internet, and mobile networks are unavailable or unreliable.'],
              ['02', 'Built for depth', 'Designed for underground deployments far beyond surface-linked systems.'],
              ['03', 'Layered precision', 'Combines movement estimation, relay correction, and UWB anchors.'],
              ['04', 'Fast SOS awareness', 'Critical alerts are designed to reach supervisors quickly.'],
              ['05', 'Rapid pilot deployment', 'Fits active mines where field testing must avoid disruption.'],
              ['06', 'Lower infrastructure load', 'A lighter architecture can reduce cost and complexity.'],
            ].map(([code, title, copy]) => <Card key={title} code={code} title={title} copy={copy} />)}
          </div>
        </InfoSection>

        <InfoSection id="use-cases" kicker="Use cases" title="Shaped by Indian underground mining realities." copy="The strongest early fit is in mines facing communication gaps, fire risk, gas exposure, flooding, and legacy tunnel complexity.">
          <div className="use-grid">
            {['Fire-prone coal operations', 'Methane and gas-risk zones', 'Flooding and inundation risk', 'Legacy tunnel systems', 'Blind spots and long drifts', 'Rescue coordination'].map((title) => <article className="panel-card" key={title}><h3>{title}</h3><p>Provides a more actionable visibility layer for high-risk underground sections and response teams.</p></article>)}
          </div>
        </InfoSection>

        <InfoSection id="pilot" kicker="Pilot program" title="Start with one section. Prove it underground." copy="SubMapify enters through tightly scoped underground pilots that feel practical and evaluation-ready for mine leadership.">
          <div className="pilot-grid">
            {['Assessment', 'Mapping', 'Rollout', 'Dashboard', 'Validation'].map((step, index) => <article className="pilot-step" key={step}><strong>{String(index + 1).padStart(2, '0')} {step}</strong><p>{['Identify tunnel constraints and priority use cases.', 'Plan relay spacing, critical junctions, and worker paths.', 'Deploy helmets, relay nodes, and selected precision points.', 'Set up supervisor visibility and event monitoring.', 'Report on coverage, workflows, feedback, and next steps.'][index]}</p></article>)}
          </div>
        </InfoSection>

        <InfoSection id="proof" kicker="Proof points" title="Technical signals for procurement conversations." copy="Clear operational facts support qualification without burying buyers in engineering detail.">
          <div className="proof-band">
            {[
              ['3,000 m', 'Target depth profile.'],
              ['< 10 sec', 'Target visibility.'],
              ['12+ hr', 'Helmet battery target.'],
              ['50-100 m', 'Relay spacing model.'],
              ['Offline', 'No internet dependency.'],
              ['Redundant SOS', 'Multiple paths to surface.'],
            ].map(([value, label]) => <div className="proof-card" key={value}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </InfoSection>

        <section id="contact">
          <div className="container contact-shell">
            <aside className="contact-aside">
              <div className="section-kicker">Ready for a mine pilot</div>
              <h2>Bring visibility to the section that needs it first.</h2>
              <p>Use the forms to request a pilot or start a procurement conversation.</p>
              <div className="contact-list">
                <div><strong>Best fit</strong> Underground operations with communication blind spots.</div>
                <div><strong>Pilot scope</strong> One mine section, selected relay route, dashboard visibility.</div>
                <div><strong>Decision team</strong> Operators, safety heads, leadership, and procurement.</div>
              </div>
            </aside>
            <div className="form-surface">
              <div className="form-tabs">
                {(['pilot', 'demo', 'contact'] as FormKind[]).map((kind) => <button key={kind} className={`form-tab ${activeForm === kind ? 'active' : ''}`} onClick={() => setActiveForm(kind)}>{kind === 'pilot' ? 'Request a Pilot' : kind === 'demo' ? 'Book a Demo' : 'Contact Us'}</button>)}
              </div>
              {activeForm === 'pilot' && <LeadForm kind="pilot" status={status.pilot} onSubmit={submitLead} />}
              {activeForm === 'demo' && <LeadForm kind="demo" status={status.demo} onSubmit={submitLead} />}
              {activeForm === 'contact' && <LeadForm kind="contact" status={status.contact} onSubmit={submitLead} />}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>SubMapify · Underground positioning and emergency response for deep mines</div>
          <div className="founder-line">
            <span>Founder - Anmol Srivastava</span>
            <span>Co-Founder - Pranjal Shrivastav</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="metric-tile"><strong>{value}</strong><span>{label}</span></div>;
}

function Card({ code, title, copy }: { code: string; title: string; copy: string }) {
  return <article className="panel-card"><div className="icon-box">{code}</div><h3>{title}</h3><p>{copy}</p></article>;
}

function InfoSection({ id, kicker, title, copy, children }: { id?: string; kicker: string; title: string; copy: string; children: ReactNode }) {
  return <section id={id}><div className="container"><div className="section-head"><div><div className="section-kicker">{kicker}</div><h2>{title}</h2></div><p>{copy}</p></div>{children}</div></section>;
}

function MineConsole() {
  return <div className="ops-console"><div className="console-top"><span>Mine visibility overview</span><span className="status"><span className="pulse" /> Local network active</span></div><div className="console-body"><div className="mine-map"><i className="tunnel t1" /><i className="tunnel t2" /><i className="tunnel t3" /><i className="tunnel t4" /><i className="node-point gateway" /><i className="node-point relay-a" /><i className="node-point relay-b" /><i className="node-point anchor-a" /><i className="node-point helmet-a" /><span className="map-label ml1">Surface gateway</span><span className="map-label ml2">Relay node 07</span><span className="map-label ml3">Relay node 18</span><span className="map-label ml4">UWB correction</span><span className="map-label ml5">Helmet unit SOS</span></div><aside className="console-side"><SideCard title="Tracked crew" value="42" width="76%" /><SideCard title="Relay health" value="96%" width="96%" /><SideCard title="Last SOS" value="00:08" width="38%" red /></aside></div></div>;
}

function SideCard({ title, value, width, red }: { title: string; value: string; width: string; red?: boolean }) {
  return <div className="side-card"><span>{title}</span><strong>{value}</strong><div className="bar"><i style={{ width, background: red ? 'var(--red)' : 'var(--amber)' }} /></div></div>;
}

function DashboardList({ title, rows }: { title: string; rows: string[][] }) {
  return <div className="dash-widget"><div className="widget-title"><span>{title}</span><span>Live</span></div><div className="alert-list">{rows.map(([name, value]) => <div className="alert-item" key={name}><strong>{name}</strong><span>{value}</span></div>)}</div></div>;
}

function LeadForm({ kind, status, onSubmit }: { kind: FormKind; status: string; onSubmit: (event: FormEvent<HTMLFormElement>, kind: FormKind) => void }) {
  return (
    <form className="lead-form" onSubmit={(event) => onSubmit(event, kind)}>
      <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      {commonFields.map(([name, label, type, required]) => <div className="form-row" key={name}><label htmlFor={`${kind}-${name}`}>{label}</label><input id={`${kind}-${name}`} type={type} name={name} required={required} min={type === 'number' ? 0 : undefined} /></div>)}
      {kind === 'demo' && <div className="form-row"><label htmlFor="demo-preferred-date">Preferred Date</label><input id="demo-preferred-date" name="preferred_date" placeholder="Example: next Tuesday afternoon" /></div>}
      {kind === 'contact' && <div className="form-row"><label htmlFor="contact-inquiry-type">Inquiry Type</label><select id="contact-inquiry-type" name="inquiry_type"><option value="general">General</option><option value="pilot">Pilot</option><option value="demo">Demo</option><option value="partnership">Partnership</option><option value="procurement">Procurement</option></select></div>}
      <div className="form-row full"><label htmlFor={`${kind}-main-challenge`}>Main Challenge</label><textarea id={`${kind}-main-challenge`} name="main_challenge" required={kind === 'contact'} /></div>
      <div className="form-row"><label htmlFor={`${kind}-timeline`}>Timeline</label><input id={`${kind}-timeline`} name="timeline" /></div>
      {kind === 'pilot' && <div className="form-row"><label htmlFor="pilot-scope">Pilot Scope</label><input id="pilot-scope" name="pilot_scope" /></div>}
      <div className="form-row full"><label htmlFor={`${kind}-notes`}>Notes</label><textarea id={`${kind}-notes`} name="notes" /></div>
      <div className="form-row full"><button className="btn btn-primary" type="submit">{kind === 'pilot' ? 'Submit Pilot Request' : kind === 'demo' ? 'Submit Demo Request' : 'Contact Us'}</button></div>
      <p className="form-status full" aria-live="polite">{status}</p>
    </form>
  );
}

export default App;
