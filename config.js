/* =========================================================
   KONFIGURASI PICIQUW
   Cukup ubah file ini untuk mengganti nomor WA, rekening,
   dan gambar QRIS. Halaman lain otomatis ikut berubah.
   ========================================================= */
window.PICIQUW = {
  storeName: "PICIQUW",

  // ID LINE admin untuk konfirmasi pembayaran.
  // - LINE Official Account: tulis dengan @ di depan, contoh "@piciquw".
  //   Pesan konfirmasi langsung terisi otomatis di chat.
  // - LINE pribadi: tulis ID-nya saja tanpa @, contoh "piciquw.admin".
  //   Profil LINE terbuka, dan pesan otomatis disalin supaya pembeli tinggal tempel.
  lineId: "nadaatha",

  // Username Instagram tanpa @ (kosongkan "" kalau tidak mau ditampilkan)
  instagram: "", // <-- GANTI (opsional)

  // Gambar QRIS toko
  qrisImage: "assets/qris.png",

  // Batas maksimal pembayaran lewat QRIS (Rupiah). Tagihan di atas ini tidak bisa pakai QRIS.
  // Isi 0 kalau tidak ada batas.
  qrisMax: 200000,

  // Rekening / e-wallet untuk transfer.
  // "bank" juga dipakai sebagai nama metode saat admin membuat tagihan,
  // jadi jangan ada dua baris dengan nama "bank" yang sama.
  banks: [
    { bank: "SeaBank",   number: "901051381944", holder: "Nada Grace" },
    { bank: "ShopeePay", number: "085173216182", holder: "Nadaatha" },
    { bank: "DANA",      number: "085173216182", holder: "Nada Grace" },
  ],

  // Awalan kode pembayaran, contoh hasil: PQ-7KX2M9
  codePrefix: "PQ",

  // Database (sama dengan yang dipakai piciquw tracker)
  supabaseUrl: "https://cwpyhgasbmauesacdiag.supabase.co",
  supabaseKey: "sb_publishable_ouDVGuaX-Ogc8zFBPXryhA_CoBNWK46",

  // Kode contoh untuk mencoba tampilan tanpa database. Biarkan "" di website asli.
  demoCode: "",
};
