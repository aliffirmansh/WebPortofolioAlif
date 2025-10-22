<!-- src/components/admin/EducationManager.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../lib/supabaseClient'

// State & UI Feedback LOKAL
const loading = ref(false)
const successMsg = ref(null)
const errorMsg = ref(null)

// State untuk Form & Daftar Pendidikan
const educationHistory = ref([])
const listLoading = ref(true)
const newEducation = ref({ institution: '', major: '', years: '', description: '', display_order: 1 })
const editingEducation = ref(null)
const isEditing = computed(() => !!editingEducation.value)

// Fungsi CRUD untuk Pendidikan
async function fetchEducation() {
  try {
    listLoading.value = true
    const { data, error } = await supabase.from('education').select('*').order('display_order', { ascending: true })
    if (error) throw error
    educationHistory.value = data
  } catch (error) {
    console.error('Error fetching education:', error.message)
    errorMsg.value = 'Gagal memuat riwayat pendidikan.'
  } finally {
    listLoading.value = false
  }
}

function handleEditClick(edu) {
  editingEducation.value = edu
  newEducation.value = { ...edu }
}

function cancelEdit() {
  editingEducation.value = null
  newEducation.value = { institution: '', major: '', years: '', description: '', display_order: 1 }
}

async function deleteEducation(edu) {
  if (!confirm(`Yakin ingin menghapus "${edu.institution}"?`)) return;
  try {
    await supabase.from('education').delete().eq('id', edu.id)
    educationHistory.value = educationHistory.value.filter(e => e.id !== edu.id)
    successMsg.value = `Pendidikan "${edu.institution}" berhasil dihapus.`
  } catch (error) {
    console.error('Error deleting education:', error.message)
    errorMsg.value = `Gagal menghapus pendidikan: ${error.message}`
  }
}

async function handleSubmit() {
  if (!newEducation.value.institution) {
    errorMsg.value = 'Nama institusi wajib diisi.'; return;
  }
  try {
    loading.value = true; errorMsg.value = null; successMsg.value = null;
    const dataToSubmit = { ...newEducation.value };
    if (isEditing.value) {
      await supabase.from('education').update(dataToSubmit).eq('id', editingEducation.value.id)
      successMsg.value = 'Pendidikan berhasil diperbarui!';
    } else {
      await supabase.from('education').insert(dataToSubmit)
      successMsg.value = 'Pendidikan berhasil ditambahkan!';
    }
    cancelEdit();
    await fetchEducation();
  } catch (error) {
    console.error('Error submitting education:', error.message)
    errorMsg.value = `Terjadi kesalahan: ${error.message}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEducation();
});
</script>

<template>
  <section>
    <!-- Pesan Feedback Lokal -->
    <div v-if="successMsg" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{{ successMsg }}</p></div>
    <div v-if="errorMsg" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{{ errorMsg }}</p></div>

    <!-- Form Pendidikan -->
    <form @submit.prevent="handleSubmit" class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">{{ isEditing ? `Edit Pendidikan: ${editingEducation.institution}` : 'Tambah Pendidikan Baru' }}</h2>
      <div class="space-y-4">
        <div><label for="edu-institution" class="block text-sm font-medium text-gray-700">Nama Institusi</label><input v-model="newEducation.institution" type="text" id="edu-institution" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div><label for="edu-major" class="block text-sm font-medium text-gray-700">Jurusan / Program</label><input v-model="newEducation.major" type="text" id="edu-major" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div><label for="edu-years" class="block text-sm font-medium text-gray-700">Tahun</label><input v-model="newEducation.years" type="text" id="edu-years" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div><label for="edu-desc" class="block text-sm font-medium text-gray-700">Deskripsi</label><textarea v-model="newEducation.description" id="edu-desc" rows="2" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea></div>
        <div><label for="edu-order" class="block text-sm font-medium text-gray-700">Urutan Tampil</label><input v-model="newEducation.display_order" type="number" id="edu-order" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div class="text-right space-x-4"><button v-if="isEditing" @click.prevent="cancelEdit" type="button" class="px-6 py-2 text-base bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button><button type="submit" :disabled="loading" class="btn-primary px-6 py-2 text-base disabled:bg-gray-400">{{ loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Pendidikan') }}</button></div>
      </div>
    </form>

    <!-- Daftar Pendidikan -->
    <div class="space-y-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Daftar Pendidikan Saat Ini</h2>
      <div v-if="listLoading" class="text-center text-gray-500">Memuat daftar pendidikan...</div>
      <div v-else class="space-y-4">
        <div v-for="edu in educationHistory" :key="edu.id" class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div>
            <p class="font-medium text-gray-800">{{ edu.institution }}</p>
            <p class="text-sm text-gray-500">{{ edu.major }} | {{ edu.years }}</p>
          </div>
          <div class="space-x-2"><button @click="handleEditClick(edu)" class="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">Edit</button><button @click="deleteEducation(edu)" class="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200">Hapus</button></div>
        </div>
      </div>
    </div>
  </section>
</template>