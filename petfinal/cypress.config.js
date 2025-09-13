import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174',          // trỏ đúng dev server của Vite
    supportFile: 'cypress/support/e2e.js',
    video: false,
    env: {
      apiHost: 'http://localhost:8000',        // API backend của bạn
      adminEmail: 'admin@example.com',
      adminPass: 'yourAdminPass',
      pictureUrl: 'https://via.placeholder.com/300x300?text=No+Image',
      catProId: 1,
      catPetId: 1
    }
  }
})
