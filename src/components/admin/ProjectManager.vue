<!-- src/components/admin/ProjectManager.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../lib/supabaseClient'

// --- State & UI Feedback LOKAL untuk komponen ini ---
const loading = ref(false)
const successMsg = ref(null)
const errorMsg = ref(null)

// --- State untuk Form & Daftar Proyek ---
const projects = ref([])
const listLoading = ref(true)
const newProject = ref({ title: '', description: '', link: '', image: '' })
const imageFile = ref(null)
const editingProject = ref(null)
const isEditing = computed(() => !!editingProject.value)

// --- Fungsi CRUD Proyek ---
async function fetchExistingProjects() {
  try {
    listLoading.value = true
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) throw error
    projects.value = data
  } catch (error) {
    console.error('Error fetching projects list:', error.message)
    errorMsg.value = 'Gagal memuat daftar proyek.'
  } finally {
    listLoading.value = false
  }
}

async function deleteProject(project) {
  if (!confirm(`Yakin ingin menghapus "${project.title}"?`)) return;
  try {
    const fileName = project.image.split('/').pop()
    await supabase.storage.from('project-images').remove([fileName])
    await supabase.from('projects').delete().eq('id', project.id)
    projects.value = projects.value.filter(p => p.id !== project.id)
    successMsg.value = `Proyek "${project.title}" berhasil dihapus.`
  } catch (error) {
    console.error('Error deleting project:', error.message)
    errorMsg.value = `Gagal menghapus proyek: ${error.message}`
  }
}

function handleFileChange(event) {
  imageFile.value = event.target.files[0]
  if (imageFile.value) {
    newProject.value.image = URL.createObjectURL(imageFile.value)
  }
}

function handleEditClick(project) {
  editingProject.value = project
  newProject.value = { ...project }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingProject.value = null
  newProject.value = { title: '', description: '', link: '', image: '' }
  imageFile.value = null
  if (document.getElementById('image')) {
    document.getElementById('image').value = ''
  }
}

async function handleSubmit() {
  if (!newProject.value.title || (!imageFile.value && !isEditing.value)) {
    errorMsg.value = 'Judul dan Gambar Proyek wajib diisi.'; return;
  }
  try {
    loading.value = true; errorMsg.value = null; successMsg.value = null;
    if (isEditing.value) {
      let imageUrl = editingProject.value.image
      if (imageFile.value) {
        const oldFileName = editingProject.value.image.split('/').pop();
        await supabase.storage.from('project-images').remove([oldFileName]);
        const newFile = imageFile.value; const newFileName = `${Date.now()}_${newFile.name}`;
        await supabase.storage.from('project-images').upload(newFileName, newFile);
        const { data: publicUrlData } = supabase.storage.from('project-images').getPublicUrl(newFileName);
        imageUrl = publicUrlData.publicUrl
      }
      const { error } = await supabase.from('projects').update({ title: newProject.value.title, description: newProject.value.description, link: newProject.value.link, image: imageUrl }).eq('id', editingProject.value.id)
      if (error) throw error; successMsg.value = 'Proyek berhasil diperbarui!';
    } else {
      const file = imageFile.value; const fileName = `${Date.now()}_${file.name}`;
      await supabase.storage.from('project-images').upload(fileName, file);
      const { data: publicUrlData } = supabase.storage.from('project-images').getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl
      await supabase.from('projects').insert({ title: newProject.value.title, description: newProject.value.description, link: newProject.value.link, image: imageUrl })
      successMsg.value = 'Proyek berhasil ditambahkan!';
    }
    cancelEdit();
    await fetchExistingProjects()
  } catch (error) {
    console.error('Error:', error.message); errorMsg.value = `Terjadi kesalahan: ${error.message}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchExistingProjects();
});
</script>

<template>
  <section>
    <!-- Pesan Feedback Lokal -->
    <div v-if="successMsg" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{{ successMsg }}</p></div>
    <div v-if="errorMsg" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{{ errorMsg }}</p></div>

    <!-- Form Proyek -->
    <form @submit.prevent="handleSubmit" class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">{{ isEditing ? `Edit Proyek: ${editingProject.title}` : 'Tambah Proyek Baru' }}</h2>
      <div class="space-y-4">
        <div><label for="title" class="block text-sm font-medium text-gray-700">Judul Proyek</label><input v-model="newProject.title" type="text" id="title" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div><label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label><textarea v-model="newProject.description" id="description" rows="3" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea></div>
        <div><label for="link" class="block text-sm font-medium text-gray-700">Link Proyek (URL)</label><input v-model="newProject.link" type="url" id="link" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></div>
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700">Gambar Proyek</label>
          <input @change="handleFileChange" type="file" id="image" accept="image/*" :required="!isEditing" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100">
          <div v-if="newProject.image" class="mt-4">
            <p class="text-sm text-gray-500">Preview Gambar:</p>
            <img :src="newProject.image" alt="Preview" class="w-48 h-auto object-cover rounded-md border p-1">
          </div>
        </div>
        <div class="text-right space-x-4">
          <button v-if="isEditing" @click.prevent="cancelEdit" type="button" class="px-6 py-2 text-base bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
          <button type="submit" :disabled="loading" class="btn-primary px-6 py-2 text-base disabled:bg-gray-400">{{ loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Proyek') }}</button>
        </div>
      </div>
    </form>

    <!-- Daftar Proyek -->
    <div class="space-y-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Daftar Proyek Saat Ini</h2>
      <div v-if="listLoading" class="text-center text-gray-500">Memuat daftar proyek...</div>
      <div v-else class="space-y-4">
        <div v-for="project in projects" :key="project.id" class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div class="flex items-center gap-4">
            <img :src="project.image" :alt="project.title" class="w-20 h-12 object-cover rounded-md">
            <span class="font-medium text-gray-800">{{ project.title }}</span>
          </div>
          <div class="space-x-2">
            <button @click="handleEditClick(project)" class="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">Edit</button>
            <button @click="deleteProject(project)" class="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200">Hapus</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>