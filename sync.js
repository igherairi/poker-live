// Minimal cloud-sync UI + helpers (POC)
(function(){
  if(window.pokerSync) return;
  window.pokerSync = {};

  const STORAGE_KEY = 'poker_live_cloud_config';

  function saveConfig(cfg){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); }
  function loadConfig(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); }catch(e){return {};}}

  function createUI(){
    const btn = document.createElement('button');
    btn.textContent = 'Cloud Sync';
    btn.style.position = 'fixed';
    btn.style.right = '12px';
    btn.style.top = '12px';
    btn.style.zIndex = 9999;
    btn.style.padding = '8px 10px';
    btn.style.borderRadius = '8px';
    btn.style.border = 'none';
    btn.style.background = '#ffb84d';
    btn.style.color = '#082033';
    btn.style.fontWeight = '700';
    btn.onclick = openModal;
    document.body.appendChild(btn);
  }

  function openModal(){
    const existing = document.getElementById('poker-sync-modal');
    if(existing){ existing.remove(); return; }
    const cfg = loadConfig();

    const modal = document.createElement('div');
    modal.id = 'poker-sync-modal';
    Object.assign(modal.style,{position:'fixed',right:'12px',top:'54px',zIndex:9999,width:'320px',background:'#0d2230',color:'#fff',padding:'12px',borderRadius:'10px',boxShadow:'0 6px 20px rgba(0,0,0,0.4)'});

    modal.innerHTML = `
      <div style="font-weight:700;margin-bottom:8px">Cloud Sync (POC)</div>
      <div style="font-size:12px;margin-bottom:6px;color:#c7d2da">Supabase example: set URL and anon key (or bearer token), then Push/Pull. Use with care; this is an opt-in tool.</div>
      <label style="font-size:12px">Supabase URL</label>
      <input id="poker-sync-url" style="width:100%;margin-bottom:6px;padding:6px;border-radius:6px;border:1px solid #234;" value="${cfg.url||''}" />
      <label style="font-size:12px">Supabase Anon Key</label>
      <input id="poker-sync-key" style="width:100%;margin-bottom:6px;padding:6px;border-radius:6px;border:1px solid #234;" value="${cfg.key||''}" />
      <label style="font-size:12px">Bearer token (optional)</label>
      <input id="poker-sync-token" style="width:100%;margin-bottom:6px;padding:6px;border-radius:6px;border:1px solid #234;" value="${cfg.token||''}" />
      <div style="display:flex;gap:6px;margin-top:6px;">
        <button id="poker-sync-save" style="flex:1;padding:8px;border-radius:6px">Save</button>
        <button id="poker-sync-clear" style="flex:1;padding:8px;border-radius:6px">Clear</button>
      </div>
      <hr style="border:none;height:1px;background:#123;margin:8px 0" />
      <div style="display:flex;gap:6px;">
        <button id="poker-export-json" style="flex:1;padding:8px;border-radius:6px">Export JSON</button>
        <button id="poker-import-json" style="flex:1;padding:8px;border-radius:6px">Import JSON</button>
      </div>
      <div style="display:flex;gap:6px;margin-top:8px;">
        <button id="poker-push" style="flex:1;padding:8px;border-radius:6px;background:#2a9d8f;color:#021">Push (upsert)</button>
        <button id="poker-pull" style="flex:1;padding:8px;border-radius:6px;background:#e76f51;color:#021">Pull (merge)</button>
      </div>
      <div style="font-size:11px;color:#9fb6c9;margin-top:8px">Push/Pull will upsert by id and prefer records with newer <code>updated_at</code> timestamps. Review console for conflict details.</div>
      <div style="text-align:right;margin-top:8px"><button id="poker-sync-close" style="padding:6px 8px;border-radius:6px">Close</button></div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#poker-sync-save').onclick = ()=>{
      const url = modal.querySelector('#poker-sync-url').value.trim();
      const key = modal.querySelector('#poker-sync-key').value.trim();
      saveConfig({url,key});
      alert('Config saved (localStorage).');
    };
    modal.querySelector('#poker-sync-clear').onclick = ()=>{ saveConfig({}); modal.querySelector('#poker-sync-url').value=''; modal.querySelector('#poker-sync-key').value=''; alert('Config cleared'); };

    modal.querySelector('#poker-export-json').onclick = async ()=>{
      const payload = await gatherLocalData();
      const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'poker-live-export.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    };

    modal.querySelector('#poker-import-json').onclick = ()=>{
      const inp = document.createElement('input'); inp.type='file'; inp.accept='application/json';
      inp.onchange = async (e)=>{
        const f = e.target.files[0]; if(!f) return; const txt = await f.text();
        try{ const data = JSON.parse(txt); await applyImportedData(data); alert('Imported data applied to local storage.'); modal.remove(); render(); }
        catch(er){ alert('Invalid JSON: '+er.message); }
      };
      inp.click();
    };

    modal.querySelector('#poker-push').onclick = async ()=>{
      const cfg = loadConfig();
      const payload = await gatherLocalData();
      console.log('Cloud push payload (preview):', payload);
      if(!cfg.url || !cfg.key){ alert('Set Supabase URL and anon key first.'); return; }
      if(!confirm('This will attempt network requests to your Supabase instance. Proceed?')) return;
      await pushToSupabase(cfg, payload);
    };

    modal.querySelector('#poker-pull').onclick = async ()=>{
      const cfg = loadConfig();
      if(!cfg.url || !cfg.key){ alert('Set Supabase URL and anon key first.'); return; }
      if(!confirm('This will attempt to fetch data from your Supabase instance and overwrite local data. Proceed?')) return;
      await pullFromSupabase(cfg);
      alert('Pull finished (see console).');
      modal.remove(); render();
    };

    modal.querySelector('#poker-sync-close').onclick = ()=> modal.remove();
  }

  async function gatherLocalData(){
    // mirrors the app storage keys used in index.html
    const keys = ['ltdv_players','ltdv_games','ltdv_staff','ltdv_community_chat','ltdv_dm_messages','ltdv_app_url'];
    const out = {};
    for(const k of keys){ try{ const v = await window.storage.get ? window.storage.get(k,true) : null; out[k]= v ? (typeof v.value==='string'? JSON.parse(v.value): v.value) : (localStorage.getItem(k) ? JSON.parse(localStorage.getItem(k)) : null); }catch(e){ out[k]=null; } }
    return out;
  }

  async function applyImportedData(obj){
    // write into window.storage if available, else localStorage fallback
    for(const k of Object.keys(obj)){
      try{
        const v = obj[k];
        if(window.storage && window.storage.set){ await window.storage.set(k, typeof v==='string'? v : JSON.stringify(v), true); }
        else { localStorage.setItem(k, JSON.stringify(v)); }
      }catch(e){ console.error('write failed',k,e); }
    }
  }

  async function pushToSupabase(cfg, payload){
    // Upsert players and games to Supabase/PostgREST using on_conflict=id and Prefer resolution
    try{
      const base = cfg.url.replace(/\/$/, '');
      const tokenHeader = cfg.token ? { 'Authorization': 'Bearer '+cfg.token } : {};
      const headers = Object.assign({ 'apikey': cfg.key, 'Content-Type':'application/json', 'Prefer': 'resolution=merge-duplicates,return=representation' }, tokenHeader);

      function genId(prefix){ return prefix+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
      function ensureRecords(arr, prefix){ return (arr||[]).map(r=>{ const rec = typeof r==='string'? JSON.parse(r): r || {}; if(!rec.id) rec.id = genId(prefix); if(!rec.updated_at) rec.updated_at = new Date().toISOString(); return rec; }); }

      if(Array.isArray(payload.ltdv_players) && payload.ltdv_players.length){
        const recs = ensureRecords(payload.ltdv_players, 'player');
        const res = await fetch(base+'/rest/v1/players?on_conflict=id', { method:'POST', headers, body: JSON.stringify(recs) });
        if(!res.ok) console.error('players upsert failed', await res.text()); else console.log('players upserted', await res.json());
      }

      if(Array.isArray(payload.ltdv_games) && payload.ltdv_games.length){
        const recs = ensureRecords(payload.ltdv_games, 'game');
        const res = await fetch(base+'/rest/v1/games?on_conflict=id', { method:'POST', headers, body: JSON.stringify(recs) });
        if(!res.ok) console.error('games upsert failed', await res.text()); else console.log('games upserted', await res.json());
      }

      console.log('Push complete (check supabase console and response logs).');
    }catch(err){ console.error('push error',err); alert('Push error: '+err.message); }
  }

  async function pullFromSupabase(cfg){
    try{
      const base = cfg.url.replace(/\/$/, '');
      const tokenHeader = cfg.token ? { 'Authorization': 'Bearer '+cfg.token } : {};
      const headers = Object.assign({ 'apikey': cfg.key, 'Content-Type':'application/json' }, tokenHeader);

      const playersRes = await fetch(base+'/rest/v1/players?select=*', { headers });
      const gamesRes = await fetch(base+'/rest/v1/games?select=*', { headers });
      const players = playersRes.ok ? await playersRes.json() : [];
      const games = gamesRes.ok ? await gamesRes.json() : [];

      // merge remote into local using updated_at when present
      const local = await gatherLocalData();
      const localPlayers = Array.isArray(local.ltdv_players)? local.ltdv_players : (localStorage.getItem('ltdv_players') ? JSON.parse(localStorage.getItem('ltdv_players')) : []);
      const localGames = Array.isArray(local.ltdv_games)? local.ltdv_games : (localStorage.getItem('ltdv_games') ? JSON.parse(localStorage.getItem('ltdv_games')) : []);

      function mergeByUpdatedAt(localArr, remoteArr){
        const map = new Map();
        (localArr||[]).forEach(it=>{ if(it && it.id) map.set(it.id, it); });
        (remoteArr||[]).forEach(r=>{
          if(!r || !r.id){ return; }
          const l = map.get(r.id);
          if(!l){ map.set(r.id, r); }
          else{
            const lr = l.updated_at || l.updatedAt || '1970-01-01T00:00:00Z';
            const rr = r.updated_at || r.updatedAt || '1970-01-01T00:00:00Z';
            if(new Date(rr) > new Date(lr)) map.set(r.id, r);
          }
        });
        return Array.from(map.values());
      }

      const mergedPlayers = mergeByUpdatedAt(localPlayers, players);
      const mergedGames = mergeByUpdatedAt(localGames, games);

      await applyImportedData({ 'ltdv_players': mergedPlayers, 'ltdv_games': mergedGames });
      console.log('Pulled and merged players/games into local storage.');
    }catch(e){ console.error('pull failed', e); alert('Pull failed: '+e.message); }
  }

  // expose
  window.pokerSync.saveConfig = saveConfig;
  window.pokerSync.loadConfig = loadConfig;
  window.pokerSync.gatherLocalData = gatherLocalData;
  window.pokerSync.applyImportedData = applyImportedData;
  window.pokerSync.pushToSupabase = pushToSupabase;
  window.pokerSync.pullFromSupabase = pullFromSupabase;

  // init UI when DOM ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', createUI); else createUI();
})();
