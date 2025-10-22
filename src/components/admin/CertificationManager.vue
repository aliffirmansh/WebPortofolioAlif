<!-- src/components/admin/CertificationManager.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../lib/supabaseClient'

// State & UI Feedback LOKAL
const loading = ref(false)
const successMsg = ref(null)
const errorMsg = ref(null)

// State untuk Form & Daftar Sertifikasi
const certifications = ref([])
const listLoading = ref(true)
const newCertification = ref({ title: '', issuer: '', date: '', description: '', image: '', display_order: 1 })
const imageFile = ref(null)
const editingCertification = ref(null)
const isEditing = computed(() => !!editingCertification.value)

// Fungsi CRUD untuk Sertifikasi
async function fetchCertifications() {
  try {
    listLoading.value = true
    const { data, error } = await supabase.from('certifications').select('*').order('display_order', { ascending: true })
    if (error) throw error
    certifications.value = data
  } catch (error) {
    console.error('Error fetching certifications:', error.message)
    errorMsg.value = 'Gagal memuat sertifikasi.'
  } finally {
    listLoading.value = false
  }
}

function handleFileChange(event) {
  imageFile.value = event.target.files[0]
  if (imageFile.value) {
    newCertification.value.image = URL.createObjectURL(imageFile.value)
  }
}

function handleEditClick(cert) {
  editingCertification.value = cert
  newCertification.value = { ...cert }
}

function cancelEdit() {
  editingCertification.value = null
  newCertification.value = { title: '', issuer: '', date: '', description: '', image: '', display_order: 1 }
  imageFile.value = null
  if (document.getElementById('cert-image')) {
    document.getElementById('cert-image').value = ''
  }
}

async function deleteCertification(cert) {
  if (!confirm(`Yakin ingin menghapus "${cert.title}"?`)) return;
  try {
    const fileName = cert.image.split('/').pop()
    await supabase.storage.from('certification-images').remove([fileName])
    await supabase.from('certifications').delete().eq('id', cert.id)
    certifications.value = certifications.value.filter(c => c.id !== cert.id)
    successMsg.value = `Sertifikasi "${cert.title}" berhasil dihapus.`
  } catch (error) {
    console.error('Error deleting certification:', error.message)
    errorMsg.value = `Gagal menghapus sertifikasi: ${error.message}`
  }
}

async function handleSubmit() {
  if (!newCertification.value.title || (!imageFile.value && !isEditing.value)) {
    errorMsg.value = 'Judul dan Gambar Sertifikasi wajib diisi.'; return;
  }
  try {
    loading.value = true; errorMsg.value = null; successMsg.value = null;
    if (isEditing.value) {
      let imageUrl = editingCertification.value.image
      if (imageFile.value) {
        const oldFileName = editingCertification.value.image.split('/').pop(); await supabase.storage.from('certification-images').remove([oldFileName]);
        const newFile = imageFile.value; const newFileName = `${Date.now()}_${newFile.name}`; await supabase.storage.from('certification-images').upload(newFileName, newFile);
        const { data: publicUrlData } = supabase.storage.from('certification-images').getPublicUrl(newFileName); imageUrl = publicUrlData.publicUrl;
      }
      await supabase.from('certifications').update({ title: newCertification.value.title, issuer: newCertification.value.issuer, date: newCertification.value.date, description: newCertification.value.description, display_order: newCertification.value.display_order, image: imageUrl }).eq('id', editingCertification.value.id);
      successMsg.value = 'Sertifikasi berhasil diperbarui!';
    } else {
      const file = imageFile.value; const fileName = `${Date.now()}_${file.name}`; await supabase.storage.from('certification-images').upload(fileName, file);
      const { data: publicUrlData } = supabase.storage.from('certification-images').getPublicUrl(fileName); const imageUrl = publicUrlData.publicUrl;
      await supabase.from('certifications').insert({ title: newCertification.value.title, issuer: newCertification.value.issuer, date: newCertification.value.date, description: newCertification.value.description, display_order: newCertification.value.display_order, image: imageUrl });
      successMsg.value = 'Sertifikasi berhasil ditambahkan!';
    }
    cancelEdit();
    await fetchCertifications();
  } catch (error) {
    console.error('Error submitting certification:', error.message);
    errorMsg.value = `Terjadi kesalahan: ${error.message}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCertifications();
});
</script>

<template>
  <section>
    <!-- Pesan Feedback Lokal -->
    <div v-if="successMsg" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{{ successMsg }}</p></div>
    <div v-if="errorMsg" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{{ errorMsg }}</p></div>

    <!-- Form Sertifikasi -->
    <form @submit.prevent="handleSubmit" class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">{{ isEditing ? `Edit Sertifikasi: ${editingCertification.title}` : 'Tambah Sertifikasi Baru' }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2"><label for="cert-title" class="block text-sm font-medium text-gray-700">Judul Sertifikasi</label><input v-model="newCertification.title" type="text" id="cert-title" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div><label for="cert-issuer" class="block text-sm font-medium text-gray-700">Penerbit</label><input v-model="newCertification.issuer" type="text" id="cert-issuer" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div><label for="cert-date" class="block text-sm font-medium text-gray-700">Tanggal</label><input v-model="newCertification.date" type="text" id="cert-date" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div class="md:col-span-2"><label for="cert-desc" class="block text-sm font-medium text-gray-700">Deskripsi</label><textarea v-model="newCertification.description" id="cert-desc" rows="2" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea></div>
        <div class="md:col-span-2">
          <label for="cert-image" class="block text-sm font-medium text-gray-700">Gambar Sertifikat</label>
          <input @change="handleFileChange" type="file" id="cert-image" accept="image/*" :required="!isEditing" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100">
          <div v-if="newCertification.image" class="mt-4">
            <p class="text-sm text-gray-500">Preview Gambar:</p>
            <img :src="newCertification.image" alt="Preview" class="w-48 h-auto object-cover rounded-md border p-1">
          </div>
        </div>
        <div><label for="cert-order" class="block text-sm font-medium text-gray-700">Urutan Tampil</label><input v-model="newCertification.display_order" type="number" id="cert-order" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
      </div>
      <div class="text-right space-x-4 mt-4"><button v-if="isEditing" @click.prevent="cancelEdit" type="button" class="px-6 py-2 text-base bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button><button type="submit" :disabled="loading" class="btn-primary px-6 py-2 text-base disabled:bg-gray-400">{{ loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Sertifikasi') }}</button></div>
    </form>
    <div class="space-y-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Daftar Sertifikasi Saat Ini</h2>
      <div v-if="listLoading" class="text-center text-gray-500">Memuat daftar sertifikasi...</div>
      <div v-else class="space-y-4">
        <div v-for="cert in certifications" :key="cert.id" class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div class="flex items-center gap-4">
            <img :src="cert.image" :alt="cert.title" class="w-16 h-10 object-contain rounded-md bg-gray-200 p-1">
            <div>
              <p class="font-medium text-gray-800">{{ cert.title }}</p>
              <p class="text-sm text-gray-500">{{ cert.issuer }}</p>
            </div>
          </div>
          <div class="space-x-2"><button @click="handleEditClick(cert)" class="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">Edit</button><button @click="deleteCertification(cert)" class="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200">Hapus</button></div>
        </div>
      </div>
    </div>
  </section>
</template>