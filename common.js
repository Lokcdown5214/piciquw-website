/* ===== Fungsi bersama PICIQUW ===== */
(function () {
  const C = window.PICIQUW || {};

  // Format angka ke Rupiah: 150000 -> "Rp150.000"
  window.pqRupiah = function (n) {
    const v = Math.round(Number(n) || 0);
    return "Rp" + v.toLocaleString("id-ID");
  };

  // Ambil angka saja dari teks: "Rp 150.000" -> 150000
  window.pqNumber = function (text) {
    return Number(String(text || "").replace(/[^\d]/g, "")) || 0;
  };

  // Notifikasi kecil di bawah layar
  let toastEl, toastTimer;
  window.pqToast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  };

  // Salin teks ke clipboard
  window.pqCopy = async function (text, label) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const t = document.createElement("textarea");
      t.value = text; document.body.appendChild(t); t.select();
      document.execCommand("copy"); t.remove();
    }
    pqToast((label || "Teks") + " disalin");
  };

  // ===== LINE =====
  // Official Account (ID diawali @) bisa membuka chat dengan pesan terisi.
  // Akun pribadi hanya bisa membuka profil, jadi pesannya disalin dulu.
  window.pqLineId = function () { return String(C.lineId || "").trim(); };
  window.pqIsLineOA = function () { return pqLineId().startsWith("@"); };
  window.pqLineLink = function (message) {
    const id = pqLineId();
    if (!id) return "#";
    if (pqIsLineOA()) return "https://line.me/R/oaMessage/" + encodeURIComponent(id) + "/?" + encodeURIComponent(message || "");
    return "https://line.me/ti/p/~" + encodeURIComponent(id);
  };
  // Pasang ke tombol/link: buka LINE admin, salin pesan kalau perlu
  window.pqBindLine = function (el, getMessage) {
    el.target = "_blank"; el.rel = "noopener";
    const refresh = () => { el.href = pqLineLink(getMessage()); };
    refresh();
    el.addEventListener("click", (e) => {
      const msg = getMessage();
      if (!pqLineId()) { e.preventDefault(); pqToast("ID LINE admin belum diisi"); return; }
      el.href = pqLineLink(msg);
      if (!pqIsLineOA() && msg) pqCopy(msg, "Pesan");
    });
    return refresh;
  };
  // Link LINE "bagikan": admin memilih chat customer, pesan sudah terisi
  window.pqLineShare = function (message) {
    return "https://line.me/R/share?text=" + encodeURIComponent(message || "");
  };

  // Ambil daftar batch dari database tracker (hanya baca)
  window.pqFetchBatches = async function () {
    if (window.supabase && C.supabaseUrl) {
      try {
        const { data } = await pqSupabase().from("batches").select("name,country,status");
        return data || [];
      } catch (e) { return []; }
    }
    if (!C.supabaseUrl || !C.supabaseKey) return [];
    try {
      const res = await fetch(C.supabaseUrl + "/rest/v1/batches?select=name,country,status", {
        headers: { apikey: C.supabaseKey },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  };

  // Satu koneksi Supabase untuk semua halaman (butuh supabase-js)
  let sbClient = null;
  window.pqSupabase = function () {
    if (!sbClient && window.supabase && C.supabaseUrl && C.supabaseKey) {
      sbClient = window.supabase.createClient(C.supabaseUrl, C.supabaseKey);
    }
    return sbClient;
  };

  // Amankan teks sebelum dimasukkan ke HTML
  window.pqEsc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  };

  // Buat kode pembayaran acak, contoh: PQ-7KX2M9 (tanpa huruf/angka yang mirip seperti O/0, I/1)
  window.pqNewCode = function () {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const buf = new Uint32Array(6);
    crypto.getRandomValues(buf);
    return (C.codePrefix || "PQ") + "-" + Array.from(buf, (n) => chars[n % chars.length]).join("");
  };

  // Isi footer & link WA umum
  function fillCommon() {
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    document.querySelectorAll("[data-line]").forEach((el) => {
      if (el.dataset.bound) return;
      el.dataset.bound = "1";
      pqBindLine(el, () => el.getAttribute("data-line") || "Halo PICIQUW, saya mau tanya.");
    });
    const ig = document.querySelector("[data-ig]");
    if (ig) {
      if (C.instagram) { ig.href = "https://instagram.com/" + C.instagram; ig.textContent = "@" + C.instagram; ig.target = "_blank"; ig.rel = "noopener"; }
      else ig.remove();
    }
    if (window.lucide) window.lucide.createIcons();
  }
  window.pqFillCommon = fillCommon;
})();
