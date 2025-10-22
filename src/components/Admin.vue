<!-- src/components/Admin.vue -->
<script setup>
import { ref } from "vue";
import ProjectManager from "./admin/ProjectManager.vue";
import EducationManager from "./admin/EducationManager.vue";
import CertificationManager from "./admin/CertificationManager.vue";
import SkillsManager from "./admin/SkillsManager.vue";

const sections = ["projects", "education", "certifications", "skills"];
const currentSection = ref("projects");

function changeSection(section) {
  currentSection.value = section;
}
</script>

<template>
  <div class="pt-20 fade-in-section visible relative  bg-gray-100 min-h-screen p-8">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 class="text-3xl font-bold font-heading mb-6 gradient-text">
        Admin Panel
      </h1>

      <!-- Navigasi Section -->
      <div class="mb-8 border-b border-gray-200">
        <nav class="-mb-px flex space-x-6">
          <button
            v-for="section in sections"
            :key="section"
            @click="changeSection(section)"
            :class="[
              currentSection === section
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize',
            ]"
          >
            {{ section }}
          </button>
        </nav>
      </div>

      <!-- Tampilkan komponen manajer yang sesuai -->
      <ProjectManager v-if="currentSection === 'projects'" />
      <EducationManager v-if="currentSection === 'education'" />
      <CertificationManager v-if="currentSection === 'certifications'" />
      <SkillsManager v-if="currentSection === 'skills'" />

      <!-- Placeholder untuk section lain -->
      <div v-if="currentSection === 'skills'">Skills Manager will go here.</div>
    </div>
  </div>
</template>
```
