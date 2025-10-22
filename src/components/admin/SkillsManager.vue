<!-- src/components/admin/SkillManager.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../lib/supabaseClient'

// State & UI Feedback LOKAL
const loading = ref(false)
const successMsg = ref(null)
const errorMsg = ref(null)

// State untuk Form & Daftar Kategori Skill
const skillCategories = ref([])
const listLoading = ref(true)
const newSkillCategory = ref({ title: '', skills: '[]' })
const editingSkillCategory = ref(null)
const isEditing = computed(() => !!editingSkillCategory.value)

// Fungsi CRUD untuk Kategori Skill
async function fetchSkillCategories() {
  try {
    listLoading.value = true
    const { data, error } = await supabase.from('skill_categories').select('*').order('created_at', { ascending: true })
    if (error) throw error
    skillCategories.value = data
  } catch (error) {
    console.error('Error fetching skills:', error.message)
    errorMsg.value = 'Gagal memuat kategori skill.'
  } finally {
    listLoading.value = false
  }
}

function handleEditClick(cat) {
  editingSkillCategory.value = cat
  const skillsJsonString = JSON.stringify(cat.skills, null, 2)
  newSkillCategory.value = { title: cat.title, skills: skillsJsonString }
}

function cancelEdit() {
  editingSkillCategory.value = null
  newSkillCategory.value = { title: '', skills: '[]' }
}

async function deleteSkillCategory(cat) {
  if (!confirm(`Yakin ingin menghapus kategori "${cat.title}"?`)) return;
  try {
    await supabase.from('skill_categories').delete().eq('id', cat.id)
    skillCategories.value = skillCategories.value.filter(c => c.id !== cat.id)
    successMsg.value = `Kategori "${cat.title}" berhasil dihapus.`
  } catch (error) {
    console.error('Error deleting skill category:', error.message)
    errorMsg.value = `Gagal menghapus kategori: ${error.message}`
  }
}

async function handleSubmit() {
  if (!newSkillCategory.value.title) {
    errorMsg.value = 'Judul kategori wajib diisi.'; return;
  }
  let skillsJson;
  try {
    skillsJson = JSON.parse(newSkillCategory.value.skills)
  } catch (e) {
    errorMsg.value = 'Format JSON di dalam daftar skills tidak valid. Harap periksa kembali sintaksnya.'; return;
  }
  
  try {
    loading.value = true; errorMsg.value = null; successMsg.value = null;
    const dataToSubmit = { title: newSkillCategory.value.title, skills: skillsJson };
    if (isEditing.value) {
      await supabase.from('skill_categories').update(dataToSubmit).eq('id', editingSkillCategory.value.id)
      successMsg.value = 'Kategori skill berhasil diperbarui!';
    } else {
      await supabase.from('skill_categories').insert(dataToSubmit)
      successMsg.value = 'Kategori skill berhasil ditambahkan!';
    }
    cancelEdit();
    await fetchSkillCategories();
  } catch (error) {
    console.error('Error submitting skill category:', error.message)
    errorMsg.value = `Terjadi kesalahan: ${error.message}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSkillCategories();
});
</script>

<template>
  <section>
    <!-- Pesan Feedback Lokal -->
    <div v-if="successMsg" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{{ successMsg }}</p></div>
    <div v-if="errorMsg" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{{ errorMsg }}</p></div>

    <!-- Form Kategori Skill -->
    <form @submit.prevent="handleSubmit" class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">{{ isEditing ? `Edit Kategori: ${editingSkillCategory.title}` : 'Tambah Kategori Skill Baru' }}</h2>
      <div class="space-y-4">
        <div>
          <label for="skill-cat-title" class="block text-sm font-medium text-gray-700">Judul Kategori</label>
          <input v-model="newSkillCategory.title" type="text" id="skill-cat-title" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
        </div>
        <div>
          <label for="skill-cat-json" class="block text-sm font-medium text-gray-700">Daftar Skills (dalam format JSON)</label>
          <textarea v-model="newSkillCategory.skills" id="skill-cat-json" rows="8" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm"></textarea>
          <p class="mt-2 text-xs text-gray-500">
            Gunakan format: <code>[{"name": "Nama Skill", "iconClass": "kelas-ikon-fa"}]</code>
          </p>
        </div>
        <div class="text-right space-x-4">
          <button v-if="isEditing" @click.prevent="cancelEdit" type="button" class="px-6 py-2 text-base bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
          <button type="submit" :disabled="loading" class="btn-primary px-6 py-2 text-base disabled:bg-gray-400">{{ loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Kategori') }}</button>
        </div>
      </div>
    </form>

    <!-- Daftar Kategori Skill -->
    <div class="space-y-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Daftar Kategori Skill Saat Ini</h2>
      <div v-if="listLoading" class="text-center text-gray-500">Memuat daftar kategori...</div>
      <div v-else class="space-y-4">
        <div v-for="cat in skillCategories" :key="cat.id" class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <p class="font-medium text-gray-800">{{ cat.title }}</p>
          <div class="space-x-2">
            <button @click="handleEditClick(cat)" class="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">Edit</button>
            <button @click="deleteSkillCategory(cat)" class="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200">Hapus</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>