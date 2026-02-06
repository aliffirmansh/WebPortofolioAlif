<template>
  <section id="profile" class="min-h-screen flex flex-col items-center justify-center text-center px-6 fade-in-section visible relative">
    <div class="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <img src="/assets/images/profile.jpg" alt="Alif Firmansyah Putra"
           class="rounded-full w-72 h-72 object-cover mb-8 shadow-2xl border-4 border-white mx-auto">
    </div>
    <div class="max-w-4xl mx-auto pt-[400px]">
      <h1 class="text-5xl md:text-6xl font-bold font-heading mb-4 gradient-text">Alif Firmansyah Putra</h1>
      <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
        Mahasiswa aktif <span class="font-semibold text-cyan-600">Teknik Informatika</span> di UIN Bandung
        dengan minat kuat pada pengembangan sistem berbasis AI dan pemrograman full-stack. Saya ingin
        menjadi engineer yang mampu membangun solusi digital berdampak luas, efisien, dan berkelanjutan.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <a href="#proyek" class="btn-primary text-lg px-8 py-4">
          <i class="fas fa-code mr-2"></i>Lihat Proyek
        </a>
        <a href="#kontak"
          class="bg-white text-cyan-600 border-2 border-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-50 transition-colors">
          <i class="fas fa-envelope mr-2"></i>Hubungi Saya
        </a>
      </div>
    </div>
  </section>
</template>