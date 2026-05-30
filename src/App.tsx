import { FormEvent, useState } from 'react';

type FormKind = 'pilot' | 'demo' | 'contact';

const pageLoadedAt = Date.now();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDEav42yJMTwu_ctC7QaETuaW_-6SdKfWAqoeuBSXqa0jfiBfTQr0Xy985Pxwii2Y9HKNUCD8WyQIXZdE1bBEHtESHM6Tlce2jKELwlBz2lPGNCmuKyK7rMDBaFYYBb6nStsCzAqgx-46Kp4z06VNMvSZGoLMYl3AJvqpKKeubziVZmfBcDJggWJIxcVZG6-WlGRdxgQ3oG9eOrEnMhY_z52DgR2UNEdJQXAtTKgMDYDILmHmtd19to17DG4Q-vDXSa9gVpRWez40qK';
const helmetImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSXaynfIWs47feU-UR0AatJPS-MbLqD-mrlbdPlPaa6wVmQUnNzo6AqDLUf-1dr8SOD5W-1UcsPtMD-HEaDPLCYwbEkDvPIq-TZ0tAc07uI2jP701fywm9lSattL7AmE9Yhx6eD1ZkTNBjzKXMboeLf8Gu4bIJGu1OfOcQBtbgHlxqReBheBj7ZpdIsc_4AJQ17-UPuQW0pvpEyaHvStd4Qk37tKIls-4pgBMSX66X60rzBj5riGRbOgo2uyhe7fwOuDc0HnUYO59X';
const relayImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0dmpP47eRsDdIDbWN2NhAyC0oT1jOlkSut9uc9faBxLqwbAOKA-fOos4ThzsooQI5s1n05j9EHv3VgRwNSwQtueeSskyCeXX1FE-3DTSc7VPZQiZdit9Sc1EDVeDYCIEHgZz3LCiZIs0ohhFlqtRSTwS1az1I85075mF9XCBmNX6fTYjbkTMjIKYx8Gli8O6LQGlcoR9G7TyiX7wOUV8E-lYnhqhvpxjneLrlJ19bMs9sDR5OWljE0AJg3t8VFEZNGfB0pJJ_M66s';

const fields = [
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
  const [status, setStatus] = useState<Record<FormKind, string>>({ pilot: '', demo: '', contact: '' });

  function jumpToForm(kind: FormKind) {
    setActiveForm(kind);
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

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

  return (
    <>
      <nav className="top-nav">
        <a className="brand" href="#home">SubMapify</a>
        <div className="nav-links">
          <a href="#problem">Problem</a>
          <a href="#solution">Solution</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#use-cases">Use Cases</a>
          <a href="#pilot">Pilot Program</a>
        </div>
        <button className="industrial-button nav-cta" onClick={() => jumpToForm('pilot')}>
          Request a Pilot <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </nav>

      <main>
        <section className="hero industrial-grid" id="home">
          <div className="page-grid hero-grid">
            <div className="hero-copy">
              <div className="system-chip"><span />System: Online / Tactical Dashboard</div>
              <h1>Know where every miner is — <em>from shaft to working face.</em></h1>
              <p>Offline underground worker tracking and emergency response for deep mines using smart helmets, relay nodes, UWB anchors, and a surface dashboard.</p>
              <div className="hero-actions">
                <button className="industrial-button" onClick={() => jumpToForm('pilot')}>Request a Pilot <span className="material-symbols-outlined">rocket_launch</span></button>
                <button className="ghost-button" onClick={() => jumpToForm('demo')}>Book a Demo <span className="material-symbols-outlined">calendar_today</span></button>
              </div>
              <div className="hero-proof">
                <span><span className="material-symbols-outlined">verified</span>SIL-2 Compliant</span>
                <span><span className="material-symbols-outlined">speed</span>&lt; 10ms Latency</span>
              </div>
            </div>
            <div className="hero-visual">
              <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
              <img src={heroImage} alt="Technical operational graphic of an underground mine network." />
            </div>
          </div>
        </section>

        <section className="section section-dark" id="problem">
          <div className="section-inner">
            <SectionHeader title="Why Traditional Networks Fail Underground" align="left" />
            <div className="problem-grid">
              <ProblemCard icon="satellite_alt" index="01 / FAIL" title="GPS Dependency">
                Signal blockage is absolute in deep shaft environments. GPS cannot penetrate rock, leaving operations completely blind to worker locations the moment they enter the decline.
              </ProblemCard>
              <ProblemCard icon="wifi_off" index="02 / FAIL" title="Wi-Fi & BLE Limitations">
                Short-range technologies require dense, expensive infrastructure. They suffer from high maintenance burdens in harsh, dusty environments and fail rapidly during power losses.
              </ProblemCard>
              <ProblemCard icon="assignment_late" index="03 / FAIL" title="Manual Check-ins">
                Tag boards and radio check-ins are prone to human error and introduce critical delays during emergency evacuations. The data is instantly outdated.
              </ProblemCard>
            </div>
          </div>
        </section>

        <section className="section" id="solution">
          <div className="section-inner">
            <SectionHeader
              title="Integrated Safety Infrastructure"
              subtitle="A multi-layered hardware ecosystem designed specifically for the physics of deep underground environments."
            />
            <div className="hardware-grid">
              <HardwareCard
                label="Node: Mobile Endpoint"
                image={helmetImage}
                title="Smart Helmet Unit"
                points={['Integrated UWB for precise local positioning.', 'LoRa antenna for long-range telemetry.', 'Tactile SOS Panic Button.']}
              />
              <HardwareCard
                label="Node: Fixed Infrastructure"
                image={relayImage}
                title="LoRa Relay Node"
                points={['Ruggedized IP68 enclosure for harsh zones.', 'Self-healing long-range mesh network.', 'Battery-backed up to 72 hours.']}
              />
            </div>
          </div>
        </section>

        <section className="section section-dark" id="outcomes">
          <div className="section-inner">
            <SectionHeader title="Operational Outcomes for Mine Teams" subtitle="Designed for practical deployment, procurement review, and emergency workflows." />
            <div className="outcome-grid">
              {[
                ['offline_bolt', 'Works Fully Offline', 'No GPS, internet, or mobile network dependency underground.'],
                ['route', 'Deep Mine Coverage', 'Relay-based architecture for shafts, levels, junctions, and long drifts.'],
                ['emergency', 'Fast SOS Awareness', 'Panic events move toward surface visibility through redundant paths.'],
                ['monitoring', 'Supervisor Dashboard', 'Surface teams see worker position, route, node health, and incidents.'],
              ].map(([icon, title, copy]) => <FeatureCard key={title} icon={icon} title={title} copy={copy} />)}
            </div>
          </div>
        </section>

        <section className="section" id="use-cases">
          <div className="section-inner">
            <SectionHeader title="Use Cases" subtitle="Built around real underground mining risk conditions." />
            <div className="use-case-grid">
              {['Fire-prone coal operations', 'Methane and gas-risk zones', 'Flooding and inundation risk', 'Legacy tunnel systems', 'Blind spots and long drifts', 'Rescue coordination'].map((item) => (
                <div className="use-case" key={item}><span className="material-symbols-outlined">radio_button_checked</span>{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="pilot">
          <div className="section-inner">
            <SectionHeader title="Pilot Program" subtitle="Start with one section. Prove visibility underground." />
            <div className="pilot-grid">
              {['Site assessment', 'Tunnel mapping', 'Limited rollout', 'Dashboard setup', 'Field validation'].map((step, index) => (
                <div className="pilot-step" key={step}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-inner contact-grid">
            <div>
              <div className="system-chip"><span />Lead Capture / Field Evaluation</div>
              <h2>Request access to a pilot conversation.</h2>
              <p>These forms preserve your existing backend flow while matching the Stitch industrial UI direction.</p>
            </div>
            <div className="form-console">
              <div className="form-tabs">
                {(['pilot', 'demo', 'contact'] as FormKind[]).map((kind) => (
                  <button key={kind} className={activeForm === kind ? 'active' : ''} onClick={() => setActiveForm(kind)}>
                    {kind === 'pilot' ? 'Request a Pilot' : kind === 'demo' ? 'Book a Demo' : 'Contact Us'}
                  </button>
                ))}
              </div>
              <LeadForm kind={activeForm} status={status[activeForm]} onSubmit={submitLead} />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">SubMapify Industrial Systems</div>
          <div className="founders">
            <span>Founder - Anmol Srivastava</span>
            <span>Co-Founder - Pranjal Shrivastav</span>
          </div>
          <div>© 2024 SubMapify Industrial Systems. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}

function SectionHeader({ title, subtitle, align = 'center' }: { title: string; subtitle?: string; align?: 'left' | 'center' }) {
  return (
    <div className={`section-header ${align}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      <div className="tech-line" />
    </div>
  );
}

function ProblemCard({ icon, index, title, children }: { icon: string; index: string; title: string; children: string }) {
  return (
    <article className="problem-card">
      <div className="card-top">
        <span className="material-symbols-outlined danger-icon">{icon}</span>
        <span className="fail-tag">{index}</span>
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function HardwareCard({ label, image, title, points }: { label: string; image: string; title: string; points: string[] }) {
  return (
    <article className="hardware-card">
      <div className="hardware-label"><span>{label}</span><i /></div>
      <div className="hardware-body">
        <img src={image} alt={title} />
        <div>
          <h3>{title}</h3>
          <ul>
            {points.map((point, index) => (
              <li key={point}>
                <span className="material-symbols-outlined">{index === 2 && title.includes('Helmet') ? 'emergency' : 'check_circle'}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function FeatureCard({ icon, title, copy }: { icon: string; title: string; copy: string }) {
  return (
    <article className="feature-card">
      <span className="material-symbols-outlined">{icon}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

function LeadForm({ kind, status, onSubmit }: { kind: FormKind; status: string; onSubmit: (event: FormEvent<HTMLFormElement>, kind: FormKind) => void }) {
  return (
    <form className="lead-form" onSubmit={(event) => onSubmit(event, kind)}>
      <input type="text" name="website" className="hidden-field" tabIndex={-1} autoComplete="off" />
      {fields.map(([name, label, type, required]) => (
        <label key={name}>
          <span>{label}</span>
          <input type={type} name={name} required={required} min={type === 'number' ? 0 : undefined} />
        </label>
      ))}
      {kind === 'demo' && <label><span>Preferred Date</span><input name="preferred_date" placeholder="Next Tuesday afternoon" /></label>}
      {kind === 'contact' && (
        <label>
          <span>Inquiry Type</span>
          <select name="inquiry_type">
            <option value="general">General</option>
            <option value="pilot">Pilot</option>
            <option value="demo">Demo</option>
            <option value="partnership">Partnership</option>
            <option value="procurement">Procurement</option>
          </select>
        </label>
      )}
      <label className="wide"><span>Main Challenge</span><textarea name="main_challenge" required={kind === 'contact'} /></label>
      <label><span>Timeline</span><input name="timeline" /></label>
      {kind === 'pilot' && <label><span>Pilot Scope</span><input name="pilot_scope" /></label>}
      <label className="wide"><span>Notes</span><textarea name="notes" /></label>
      <button className="industrial-button wide" type="submit">
        {kind === 'pilot' ? 'Submit Pilot Request' : kind === 'demo' ? 'Submit Demo Request' : 'Contact Us'}
      </button>
      <p className="form-status wide">{status}</p>
    </form>
  );
}

export default App;
