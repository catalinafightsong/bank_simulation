const layers = { people: false, process: false, tech: false };
let dualState = 'idle';
let sodState = 0;
let disclosureMode = 'open';

function showSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  section.classList.add('active');
  document.querySelectorAll('nav button').forEach(b => {
    b.classList.toggle('active', b.dataset.section === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});

function log(el, msg, type = '') {
  const line = document.createElement('div');
  line.className = 'log-line ' + type;
  const time = new Date().toLocaleTimeString();
  line.innerHTML = `<span class="t">[${time}]</span> ${msg}`;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

function runComplexitySim() {
  const logEl = document.getElementById('complexLog');
  logEl.innerHTML = '';
  log(logEl, 'Checking the path with many steps...', 'info');
  setTimeout(() => log(logEl, 'Legacy Adapter: unpatched interface detected', 'warn'), 400);
  setTimeout(() => log(logEl, 'Manual Review Queue: single-operator bottleneck', 'warn'), 800);
  setTimeout(() => log(logEl, 'Exception Desk: elevated privileges without dual control', 'err'), 1200);
  setTimeout(() => {
    log(logEl, 'Complex path exposure score: HIGH (9 components)', 'err');
    document.getElementById('complexMeter').style.width = '12%';
    document.getElementById('complexScore').textContent = '12%';
  }, 1600);
  setTimeout(() => log(logEl, 'Checking the simpler path...', 'info'), 2000);
  setTimeout(() => {
    log(logEl, 'Simplified path: 4 components, clear ownership', 'ok');
    document.getElementById('simpleMeter').style.width = '88%';
    document.getElementById('simpleScore').textContent = '88%';
    log(logEl, 'Recommendation: reduce hops and enforce dual control on remaining high-risk steps', 'ok');
  }, 2600);
}

function resetComplexity() {
  document.getElementById('complexLog').innerHTML = '';
  document.getElementById('complexMeter').style.width = '18%';
  document.getElementById('complexScore').textContent = '18%';
  document.getElementById('simpleMeter').style.width = '82%';
  document.getElementById('simpleScore').textContent = '82%';
}

function calcBusinessCase() {
  const asset = Number(document.getElementById('assetValue').value);
  const cost = Number(document.getElementById('controlCost').value);
  const reduction = Number(document.getElementById('riskReduction').value);
  const result = document.getElementById('bizResult');
  const meter = document.getElementById('roiMeter');
  const label = document.getElementById('roiLabel');
  result.className = 'sim-result show';
  if (!Number.isFinite(asset) || !Number.isFinite(cost) || !Number.isFinite(reduction) ||
      asset <= 0 || cost <= 0 || reduction < 0 || reduction > 100) {
    result.classList.add('fail');
    result.textContent = 'Enter positive values. Risk reduction must be between 0 and 100%.';
    meter.style.width = '0%';
    meter.style.background = 'var(--danger)';
    label.textContent = 'Waiting for valid numbers';
    return;
  }
  if (cost > asset) {
    result.classList.add('fail');
    result.innerHTML = `<strong>Not justified.</strong> Control cost ($${cost.toLocaleString()}) exceeds asset value ($${asset.toLocaleString()}). Principle 7 / 10: never spend more than the asset is worth.`;
    meter.style.width = '15%';
    meter.style.background = 'var(--danger)';
    label.textContent = 'ROI indicator: Poor';
  } else {
    const expectedValue = asset * (reduction / 100);
    const ratio = expectedValue / cost;
    result.classList.add('success');
    result.innerHTML = `<strong>This looks worthwhile.</strong> Expected protected value is about $${Math.round(expectedValue).toLocaleString()}. The value-to-cost ratio is about ${ratio.toFixed(2)}. Use these numbers instead of fear.`;
    const pct = Math.min(100, Math.round(ratio * 40));
    meter.style.width = pct + '%';
    meter.style.background = 'var(--accent2)';
    label.textContent = 'ROI indicator: Acceptable';
  }
}

function toggleLayer(name) {
  layers[name] = !layers[name];
  document.getElementById('layer' + name.charAt(0).toUpperCase() + name.slice(1)).classList.toggle('on', layers[name]);
  const count = Object.values(layers).filter(Boolean).length;
  const pct = Math.round((count / 3) * 100);
  document.getElementById('controlStrength').textContent = pct + '%';
  document.getElementById('strengthMeter').style.width = pct + '%';
  const msg = document.getElementById('strengthMsg');
  if (pct === 100) msg.textContent = 'All layers active. Payment release path is protected.';
  else if (pct === 0) msg.textContent = 'Activate all three layers to secure the payment release path.';
  else msg.textContent = 'Partial coverage. Missing layers leave the control weak.';
}

function testPaymentRelease() {
  const result = document.getElementById('p11Result');
  result.className = 'sim-result show';
  const ok = layers.people && layers.process && layers.tech;
  if (ok) {
    result.classList.add('success');
    result.innerHTML = '<strong>Release allowed.</strong> People (trained checker), Process (maker-checker rule) and Technology (payment system gate) are all present.';
  } else {
    result.classList.add('fail');
    const missing = [];
    if (!layers.people) missing.push('People');
    if (!layers.process) missing.push('Process');
    if (!layers.tech) missing.push('Technology');
    result.innerHTML = `<strong>Release blocked.</strong> Missing: ${missing.join(', ')}. Principle 11 requires all three.`;
  }
}

function setDisclosureMode(mode) {
  disclosureMode = mode;
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', (mode === 'open' && i === 0) || (mode === 'secret' && i === 1));
  });
  resetDisclosure();
}

function resetDisclosure() {
  document.getElementById('disclosureTimeline').innerHTML = '';
}

function runDisclosure() {
  const tl = document.getElementById('disclosureTimeline');
  tl.innerHTML = '';
  if (disclosureMode === 'open') {
    const steps = [
      { t: 'Day 0', d: 'Researcher privately reports flaw to bank security team' },
      { t: 'Day 2', d: 'Bank confirms issue and begins patch development' },
      { t: 'Day 9', d: 'Patch tested and staged for production' },
      { t: 'Day 12', d: 'Fix deployed across critical systems' },
      { t: 'Day 14', d: 'Coordinated public disclosure with CVE and guidance' },
      { t: 'Outcome', d: 'Customers protected. Attackers had no public exploit window.' }
    ];
    steps.forEach((s, i) => {
      setTimeout(() => {
        const item = document.createElement('div');
        item.className = 'tl-item done';
        item.innerHTML = `<strong>${s.t}</strong><div class="timeline-text">${s.d}</div>`;
        tl.appendChild(item);
      }, i * 450);
    });
  } else {
    const steps = [
      { t: 'Day 0', d: 'Flaw discovered internally, kept confidential' },
      { t: 'Day 18', d: 'Independent researcher finds same issue and publishes details' },
      { t: 'Day 19', d: 'Exploit code appears on public forums' },
      { t: 'Day 20', d: 'Multiple institutions hit before patches exist' },
      { t: 'Outcome', d: 'Longer exposure window. Higher breach probability.' }
    ];
    steps.forEach((s, i) => {
      setTimeout(() => {
        const item = document.createElement('div');
        item.className = 'tl-item';
        item.innerHTML = `<strong>${s.t}</strong><div class="timeline-text">${s.d}</div>`;
        tl.appendChild(item);
      }, i * 450);
    });
  }
}

function dualLog(msg, type) {
  log(document.getElementById('dualLog'), msg, type);
}

function setDualStep(id, state) {
  const el = document.getElementById(id);
  el.classList.remove('active', 'done', 'blocked');
  if (state) el.classList.add(state);
}

function makerAction() {
  if (dualState !== 'idle' && dualState !== 'rejected') return;
  const amt = Number(document.getElementById('payAmt').value);
  const ben = document.getElementById('payBen').value;
  const ref = document.getElementById('payRef').value;
  dualState = 'maker';
  setDualStep('stepEnter', 'done');
  setDualStep('stepMaker', 'active');
  document.getElementById('dualStatus').textContent = 'Status: Awaiting checker';
  document.getElementById('checkerView').innerHTML = `
    <strong>Pending payment</strong><br>
    Beneficiary: ${ben}<br>
    Amount: $${amt.toLocaleString()}<br>
    Reference: ${ref}<br>
    <span class="warning-text">Requires independent checker approval</span>`;
  document.getElementById('btnMaker').disabled = true;
  document.getElementById('btnChecker').disabled = false;
  document.getElementById('btnReject').disabled = false;
  dualLog(`Maker Sara submitted payment ${ref} for $${amt.toLocaleString()} to ${ben}`, 'info');
  dualLog('Safety check active - a second person is required', 'warn');
}

function checkerAction() {
  if (dualState !== 'maker') return;
  dualState = 'released';
  setDualStep('stepMaker', 'done');
  setDualStep('stepChecker', 'done');
  setDualStep('stepRelease', 'done');
  document.getElementById('dualStatus').textContent = 'Status: Released';
  document.getElementById('btnChecker').disabled = true;
  document.getElementById('btnReject').disabled = true;
  dualLog('Checker Omar independently reviewed details', 'ok');
  dualLog('Both people confirmed the details - payment released safely', 'ok');
  document.getElementById('checkerView').innerHTML = '<span class="success-text">Payment released successfully under dual control.</span>';
}

function rejectPayment() {
  if (dualState !== 'maker') return;
  dualState = 'rejected';
  setDualStep('stepChecker', 'blocked');
  setDualStep('stepRelease', 'blocked');
  document.getElementById('dualStatus').textContent = 'Status: Rejected by checker';
  document.getElementById('btnChecker').disabled = true;
  document.getElementById('btnReject').disabled = true;
  document.getElementById('btnMaker').disabled = false;
  dualLog('The checker rejected the payment - process stopped', 'err');
  document.getElementById('checkerView').textContent = 'Payment rejected. Maker may correct and resubmit.';
}

function trySinglePerson() {
  dualLog('Attempt: one person tried to release the payment...', 'warn');
  setTimeout(() => {
    dualLog('BLOCKED - two different people are required', 'err');
    dualLog('System logged unauthorized single-person attempt', 'err');
  }, 500);
}

function resetDual() {
  dualState = 'idle';
  ['stepEnter', 'stepMaker', 'stepChecker', 'stepRelease'].forEach(id => setDualStep(id, ''));
  document.getElementById('dualStatus').textContent = 'Status: Waiting for makers';
  document.getElementById('checkerView').textContent = 'Waiting for the first person...';
  document.getElementById('btnMaker').disabled = false;
  document.getElementById('btnChecker').disabled = true;
  document.getElementById('btnReject').disabled = true;
  document.getElementById('dualLog').innerHTML = '';
}

function sodLog(msg, type) {
  log(document.getElementById('sodLog'), msg, type);
}

function setSodStep(n, state) {
  const map = { 1: 'sod1', 2: 'sod2', 3: 'sod3' };
  const el = document.getElementById(map[n]);
  el.classList.remove('active', 'done', 'blocked');
  if (state) el.classList.add(state);
}

function sodRequest() {
  if (sodState !== 0) return;
  sodState = 1;
  setSodStep(1, 'done');
  setSodStep(2, 'active');
  document.getElementById('btnReq').disabled = true;
  document.getElementById('btnApp').disabled = false;
  sodLog('Requester Lina raised change request CR-4417', 'info');
  sodLog('Request queued for independent approval', 'info');
}

function sodApprove() {
  if (sodState !== 1) return;
  sodState = 2;
  setSodStep(2, 'done');
  setSodStep(3, 'active');
  document.getElementById('btnApp').disabled = true;
  document.getElementById('btnExec').disabled = false;
  sodLog('Approver Yousef reviewed and approved CR-4417', 'ok');
  sodLog('Execution gate unlocked for Platform Ops only', 'ok');
}

function sodExecute() {
  if (sodState !== 2) return;
  sodState = 3;
  setSodStep(3, 'done');
  document.getElementById('btnExec').disabled = true;
  sodLog('Executor Hana deployed change to production', 'ok');
  sodLog('The work was split between three different roles', 'ok');
}

function sodConflict() {
  sodLog('Conflict test: same identity attempted request + approve + execute', 'warn');
  setTimeout(() => {
    sodLog('BLOCKED by SoD policy (NIST AC-5 style rule)', 'err');
    sodLog('No single person may complete the full sensitive workflow', 'err');
  }, 600);
}

function resetSod() {
  sodState = 0;
  [1, 2, 3].forEach(n => setSodStep(n, ''));
  document.getElementById('btnReq').disabled = false;
  document.getElementById('btnApp').disabled = true;
  document.getElementById('btnExec').disabled = true;
  document.getElementById('sodLog').innerHTML = '';
}
