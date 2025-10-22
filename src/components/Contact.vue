<!-- src/components/Contact.vue -->
<script setup>
// Data untuk link kontak
const contactLinks = [
  {
    name: 'GitHub',
    description: 'Lihat kode saya',
    link: 'https://github.com/aliffirmansh',
    iconClass: 'fab fa-github',
    bgClass: 'bg-gray-800 group-hover:bg-gray-700'
  },
  {
    name: 'WhatsApp',
    description: 'Chat langsung',
    link: 'https://wa.me/+6281272033601',
    iconClass: 'fab fa-whatsapp',
    bgClass: 'bg-green-500 group-hover:bg-green-600'
  },
  {
    name: 'LinkedIn',
    description: 'Koneksi profesional',
    link: 'https://www.linkedin.com/in/alif-firmansyah-putra-910b69241',
    iconClass: 'fab fa-linkedin',
    bgClass: 'bg-blue-600 group-hover:bg-blue-700'
  },
  {
    name: 'Email',
    description: 'Kirim pesan',
    link: 'mailto:aliffirmansh@gmail.com',
    iconClass: 'fas fa-envelope',
    bgClass: 'bg-red-500 group-hover:bg-red-600'
  }
];
</script>

<template>
  <section id="kontak" class="py-20 px-6 text-center fade-in-section is-visible">
    <div class="container mx-auto">
      <h2 class="text-4xl md:text-5xl font-bold font-heading mb-4 gradient-text">Mari Berkolaborasi</h2>
      <p class="text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
        Saya terbuka untuk diskusi mengenai proyek, peluang kerja, atau sekadar bertukar pikiran tentang teknologi.
      </p>

      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <!-- Loop untuk setiap link kontak -->
          <a v-for="contact in contactLinks" :key="contact.name"
             :href="contact.link" target="_blank" rel="noopener noreferrer"
             class="card-hover bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group">
            
            <div :class="contact.bgClass" 
                 class="text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors flex items-center justify-center">
              <i :class="contact.iconClass" class="text-3xl"></i>
            </div>
            
            <h3 class="font-semibold text-gray-800 mb-2">{{ contact.name }}</h3>
            <p class="text-gray-600 text-sm">{{ contact.description }}</p>
          </a>

        </div>
      </div>
    </div>
  </section>
</template>