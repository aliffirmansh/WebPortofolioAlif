<!-- src/components/Navbar.vue -->
<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <header
    class="bg-white/90 header-blur fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300"
  >
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold gradient-text"
        >Alif Firmansyah Putra
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <a
          href="#profile"
          class="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Profile</a
        >
        <a
          href="#skills"
          class="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Skills</a
        >
        <a
          href="#pendidikan"
          class="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Pendidikan</a
        >
        <a
          href="#sertifikasi"
          class="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Sertifikasi</a
        >
        <a
          href="#proyek"
          class="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Proyek</a
        >
        <a
          href="#kontak"
          class="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Kontak</a
        >
      </nav>

      <!-- Download CV Button -->
      <a
        href="https://iruhxnptjagrwggwgtib.supabase.co/storage/v1/object/public/public-assets/CV%20Alif%20Firmansyah%20Putra%20ATS.pdf"
        download="CV Alif Firmansyah Putra.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden md:inline-block btn-primary"
      >
        Unduh CV
      </a>

      <!-- Mobile Menu Button -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden text-gray-800 focus:outline-none"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div
      :class="{ block: isMobileMenuOpen, hidden: !isMobileMenuOpen }"
      class="md:hidden px-6 pb-4 bg-white/95 backdrop-blur-sm"
    >
      <div class="space-y-2">
        <a
          href="#profile"
          class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Profile</a
        >
        <a
          href="#skills"
          class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Skills</a
        >
        <a
          href="#pendidikan"
          class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Pendidikan</a
        >
        <a
          href="#sertifikasi"
          class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Sertifikasi</a
        >
        <a
          href="#proyek"
          class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Proyek</a
        >
        <a
          href="#kontak"
          class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors"
          >Kontak</a
        >
      </div>
      <a
        href="/CV_Alif Firmansyah Putra.pdf"
        download="CV Alif Firmansyah Putra.pdf"
        class="btn-primary block mt-4 text-center"
      >
        <i class="fas fa-download mr-2"></i>Unduh CV
      </a>
    </div>
  </header>
</template>
