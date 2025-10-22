// src/stores/project.js
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    loading: false,
    error: null,
  }),
  actions: {
    // ambil semua project, urut berdasarkan created_at desc
    async fetchProjects() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.projects = data ?? []
      } catch (err) {
        this.error = err
        console.error('fetchProjects error', err)
      } finally {
        this.loading = false
      }
    },

    // tambah project: payload = { title, description, link }
    async addProject(payload) {
      this.loading = true
      this.error = null
      try {
        const { error } = await supabase
          .from('projects')
          .insert([payload])

        if (error) throw error
        await this.fetchProjects()
      } catch (err) {
        this.error = err
        console.error('addProject error', err)
      } finally {
        this.loading = false
      }
    },

    // update: id + payload
    async updateProject(id, payload) {
      this.loading = true
      this.error = null
      try {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', id)

        if (error) throw error
        await this.fetchProjects()
      } catch (err) {
        this.error = err
        console.error('updateProject error', err)
      } finally {
        this.loading = false
      }
    },

    // delete
    async deleteProject(id) {
      this.loading = true
      this.error = null
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)

        if (error) throw error
        await this.fetchProjects()
      } catch (err) {
        this.error = err
        console.error('deleteProject error', err)
      } finally {
        this.loading = false
      }
    }
  }
})
