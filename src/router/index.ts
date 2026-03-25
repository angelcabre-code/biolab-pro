import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import AthletesView from '../views/AthletesView.vue';
import SessionView from '../views/SessionView.vue';
import RecordsView from '../views/RecordsView.vue';
import DocsView from '../views/DocsView.vue';
import AnalysisView from '../views/AnalysisView.vue';
import SettingsView from '../views/SettingsView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/athletes',
      name: 'athletes',
      component: AthletesView
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionView
    },
    {
      path: '/records',
      name: 'records',
      component: RecordsView
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisView
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ]
});

export default router;
