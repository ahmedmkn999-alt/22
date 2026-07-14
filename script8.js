
    ]
  };

  function renderSubjects(track, name){
    document.getElementById('subjectsTrackBadge').textContent = TRACK_NAMES_LOGIN[track] || '';
    const grid = document.getElementById('subjectsGrid');
    const subjects = SUBJECTS_BY_TRACK[track] || [];
    grid.innerHTML = subjects.map(s => `
      <button class="subject-card" data-subject="${s.name}">
        <span class="subject-card-title">${s.name}</span>
        <span class="subject-card-imgbox ${s.img ? '' : 'empty'}">
          ${s.img ? `<img src="${s.img}" alt="${s.name}">` : (s.icon || '📄')}
        </span>
      </button>
    `).join('');
  }

  document.getElementById('subjectsGrid').addEventListener('click', e=>{
    const card = e.target.closest('.subject-card');
    if(!card) return;
    showSecurityToastSafe(`مادة "${card.dataset.subject}" — المحتوى بيتضاف قريب`);
  });

  function doLogout(){
    loggedInTrack = null; loggedInName = null; loggedInCode = null; loggedInExpiresAt = null;
    input.value = '';
    formState.classList.remove('hidden');
    countdownState.classList.remove('active');
    ringWrap.style.display = 'flex';
    ringNum.style.display = 'flex';
    successCheck.style.display = 'none';
    closeSidebar();
    showView('login');
  }

  // toast صغير محايد لصفحة المواد (المحاولات الأمنية بتستخدم toast تاني بالفعل جوه lockAccount)
  function showSecurityToastSafe(msg){
    let t = document.getElementById('miniToast');
    if(!t){
      t = document.createElement('div');
      t.id = 'miniToast';
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0d1826;border:1px solid rgba(111,201,255,.35);color:#e3e8ee;padding:12px 22px;border-radius:12px;font-size:.85rem;z-index:999;font-family:Tajawal,sans-serif;box-shadow:0 0 20px rgba(111,201,255,.2);transition:opacity .3s;opacity:0;text-align:center;max-width:88vw;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(()=>{ t.style.opacity='0'; }, 2200);
  }

  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(href === 'login.html'){ e.preventDefault(); showView('login'); }
  });

  /* ================= SECURITY: 3 attempts to open devtools = auto-lock ================= */
  /* ملحوظة مهمة: ده رادع بسيط شغال بالمتصفح بس، ومش حماية حقيقية — أي حد شاطر يقدر يتجاوزه.
     والحظر ده بيفضل بس في نفس الجلسة (لو عمل Refresh هيترفع)، لأن مفيش قاعدة بيانات لسه.
     الحظر الحقيقي والدائم للكود لازم يتعمل من السيرفر (Firebase) في المرحلة الجاية. */
  let devToolsAttempts = 0;
  let accountLocked = false;

  function registerDevToolsAttempt(reason){
    if(accountLocked) return;
    devToolsAttempts++;
    if(devToolsAttempts < 3){
      showSecurityToast(`⚠️ محاولة ${devToolsAttempts} من 3 — ${reason}`);
    } else {
      lockAccount();
    }
  }

  function showSecurityToast(msg){
    let t = document.getElementById('securityToast');
    if(!t){
      t = document.createElement('div');
      t.id = 'securityToast';
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0d1826;border:1px solid rgba(255,107,107,.4);color:#e3e8ee;padding:12px 22px;border-radius:12px;font-size:.85rem;z-index:999;font-family:Tajawal,sans-serif;box-shadow:0 0 20px rgba(255,107,107,.25);transition:opacity .3s;opacity:0;text-align:center;max-width:88vw;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(()=>{ t.style.opacity='0'; }, 2600);
  }

  function lockAccount(){
    accountLocked = true;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(5,7,12,.96);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:Cairo,sans-serif;';
    overlay.innerHTML = `
      <div style="max-width:380px;">
        <div style="font-size:3rem;margin-bottom:14px;">🚫</div>
        <h2 style="color:#ff6b6b;font-size:1.4rem;margin-bottom:12px;">تم حظر الوصول</h2>
        <p style="color:#8d97a6;line-height:1.9;font-size:.95rem;margin-bottom:20px;font-family:Tajawal,sans-serif;">
          حاولت تفتح أدوات المطور 3 مرات، فتم حظر الكود ده تلقائياً كإجراء أمان.
          تواصل مع الأدمن لو محتاج تلغي الحظر.
        </p>
        <a href="https://t.me/DevAhmedmo" target="_blank" rel="noopener" style="display:inline-block;background:#6fc9ff;color:#04101c;padding:12px 26px;border-radius:999px;font-weight:800;text-decoration:none;font-size:.9rem;font-family:Cairo,sans-serif;">تواصل مع الأدمن</a>
      </div>
    `;
    document.body.appendChild(overlay);
    document.querySelectorAll('button, input, select, a').forEach(el=>{
      if(!overlay.contains(el)) el.setAttribute('disabled','true');
    });
  }

  document.addEventListener('keydown', function(e){
    const blocked =
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U');
    if(blocked){
      e.preventDefault();
      registerDevToolsAttempt('محاولة فتح أدوات المطور بلوحة المفاتيح');
    }
  });

  document.addEventListener('contextmenu', function(e){
    e.preventDefault();
    registerDevToolsAttempt('محاولة فتح قائمة الزر الأيمن');
  });

  let devtoolsFlagPage = false;
  setInterval(function(){
    const isOpen = (window.outerWidth - window.innerWidth > 160) || (window.outerHeight - window.innerHeight > 160);
    if(isOpen && !devtoolsFlagPage){
      devtoolsFlagPage = true;
      registerDevToolsAttempt('احتمال إن أدوات المطور اتفتحت');
    } else if(!isOpen){
      devtoolsFlagPage = false;
    }
  }, 1500);

  /* ================= SIDEBAR MENU ================= */
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  function openSidebar(){ sidebar.classList.add('open'); sidebarOverlay.classList.add('show'); }
  function closeSidebar(){ sidebar.classList.remove('open'); sidebarOverlay.classList.remove('show'); }

  document.getElementById('menuOpenBtn').addEventListener('click', openSidebar);
  document.getElementById('sidebarCloseBtn').addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  document.getElementById('sidebarLogoutBtn').addEventListener('click', doLogout);
  document.getElementById('sidebarProfileBtn').addEventListener('click', ()=>{
    closeSidebar();
    openProfile();
  });

  /* ================= PROFILE PAGE ================= */
  let profileTimerInterval = null;

  function openProfile(){
    document.getElementById('profileName').textContent = loggedInName || 'طالب SMART ZONE';
    document.getElementById('profileTrackBadge').textContent = TRACK_NAMES_LOGIN[loggedInTrack] || '';
    document.getElementById('profileStatusExtra').textContent = loggedInName ? 'اشتراك شهري' : 'كود تجربة';
    document.getElementById('profileCode').textContent = loggedInCode || '------';
    startProfileCountdown();
    showView('profile');
  }

  document.getElementById('profileOpenBtn').addEventListener('click', openProfile);
  document.getElementById('profileCloseBtn').addEventListener('click', ()=>{
    if(profileTimerInterval) clearInterval(profileTimerInterval);
    showView('subjects');
  });
  document.getElementById('profileBackBtn').addEventListener('click', ()=>{
    if(profileTimerInterval) clearInterval(profileTimerInterval);
    showView('subjects');
  });

  function startProfileCountdown(){
    if(profileTimerInterval) clearInterval(profileTimerInterval);
    const countdownEl = document.getElementById('profileCountdown');
    const fillEl = document.getElementById('profileProgressFill');
    if(!loggedInExpiresAt){
      countdownEl.textContent = '--:--:--:--';
      fillEl.style.width = '0%';
      return;
    }
    const totalWindowMs = 30*24*60*60*1000; // تقريبي لعرض شريط التقدم بس (شهر)
    function tick(){
      const diff = loggedInExpiresAt.getTime() - Date.now();
      if(diff <= 0){
        countdownEl.textContent = 'انتهت الصلاحية';
        fillEl.style.width = '0%';
        clearInterval(profileTimerInterval);
        return;
      }
      const d = Math.floor(diff / (1000*60*60*24));
      const h = Math.floor((diff / (1000*60*60)) % 24);
      const m = Math.floor((diff / (1000*60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      countdownEl.textContent = `${d} : ${h} : ${m} : ${s}`;
      const pct = Math.max(0, Math.min(100, (diff / totalWindowMs) * 100));
      fillEl.style.width = pct + '%';
    }
    tick();
    profileTimerInterval = setInterval(tick, 1000);
  }
