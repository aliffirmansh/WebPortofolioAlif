<!-- src/components/Footer.vue -->
<script setup>
// Data untuk link sosial di footer
const socialLinks = [
  { 
    name: 'GitHub', 
    href: 'https://github.com/aliffirmansh', 
    iconClass: 'fab fa-github' 
  },
  { 
    name: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/alif-firmansyah-putra-910b69241', 
    iconClass: 'fab fa-linkedin' 
  },
  { 
    name: 'Email', 
    href: 'mailto:aliffirmansh@gmail.com', 
    iconClass: 'fas fa-envelope' 
  }
];
</script>

<template>
  <footer class="bg-gray-800 text-white py-8 px-6">
    <div class="container mx-auto text-center">
      <div class="flex justify-center items-center space-x-6 mb-4">
        
        <!-- Loop untuk setiap link sosial -->
        <a v-for="social in socialLinks" :key="social.name"
           :href="social.href" 
           :target="social.name !== 'Email' ? '_blank' : '_self'" 
           rel="noopener noreferrer"
           class="text-gray-400 hover:text-white transition-colors">
          <i :class="social.iconClass" class="text-xl"></i>
        </a>

      </div>
      <p class="text-gray-400">&copy; 2025 Alif Firmansyah Putra. Built with passion and dedication.</p>
    </div>
  </footer>
</template>