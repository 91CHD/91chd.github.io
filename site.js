'use strict';
const root = document.documentElement;
const themeButton = document.getElementById('theme-toggle');
const preferredTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
let explicitTheme = null;
try { const saved = localStorage.getItem('tian-theme'); if (saved === 'dark' || saved === 'light') explicitTheme = saved; } catch {}
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'dark' ? '切换为浅色模式' : '切换为深色模式');
  themeButton.title = themeButton.getAttribute('aria-label');
}
applyTheme(explicitTheme || preferredTheme());
themeButton.addEventListener('click', () => {
  explicitTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(explicitTheme);
  try { localStorage.setItem('tian-theme', explicitTheme); } catch {}
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!explicitTheme) applyTheme(preferredTheme()); });
document.getElementById('year').textContent = new Date().getFullYear();
const profileDialog = document.getElementById('profile-dialog');
const profileTrigger = document.getElementById('profile-open');
profileTrigger.addEventListener('click', () => profileDialog.showModal());
document.getElementById('profile-close').addEventListener('click', () => profileDialog.close());
profileDialog.addEventListener('close', () => profileTrigger.focus());
profileDialog.addEventListener('click', (event) => {
  if (event.target !== profileDialog) return;
  const bounds = profileDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) profileDialog.close();
});
const statusLabels = { done: '已完成', doing: '进行中', todo: '待做' };
const dialog = document.getElementById('project-dialog');
let dialogTrigger;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function openProject(project, trigger) {
  dialogTrigger = trigger;
  const values = { 'dialog-title': project.title, 'dialog-status': project.status, 'dialog-summary': project.summary, 'dialog-role': project.role, 'dialog-progress': project.progress, 'dialog-next': project.next };
  Object.entries(values).forEach(([id, value]) => document.getElementById(id).textContent = value);
  dialog.showModal();
}
document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => dialogTrigger?.focus());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
function renderProjects(projects) {
  const list = document.getElementById('project-list'); list.replaceChildren();
  projects.forEach((project) => {
    const article = element('article', 'project-card');
    const top = element('div', 'project-card-top');
    top.append(element('span', 'project-symbol', project.symbol), element('span', 'project-status', project.status));
    const tags = element('div', 'tags'); project.tags.forEach((tag) => tags.append(element('span', '', tag)));
    const bottom = element('div', 'project-bottom');
    const button = element('button', 'detail-button', '项目详情'); button.type = 'button'; button.setAttribute('aria-label', `查看${project.title}的详情`);
    button.addEventListener('click', () => openProject(project, button));
    bottom.append(element('span', '', project.category), button);
    article.append(top, element('h3', '', project.title), element('p', '', project.summary), tags, bottom); list.append(article);
  });
}
function renderTasks(tasks, updated) {
  const list = document.getElementById('task-list'); list.replaceChildren();
  tasks.forEach((task) => {
    const status = Object.hasOwn(statusLabels, task.status) ? task.status : 'todo';
    const row = element('article', 'task'); row.dataset.status = status;
    const indicator = element('span', 'task-indicator', status === 'done' ? '✓' : status === 'doing' ? '·' : ''); indicator.setAttribute('aria-hidden', 'true');
    const copy = element('div'); copy.append(element('h3', '', task.title), element('p', '', task.note));
    row.append(indicator, copy, element('span', 'task-status', statusLabels[status])); list.append(row);
  });
  document.getElementById('todo-count').textContent = tasks.filter((task) => task.status !== 'done').length;
  document.getElementById('last-updated').textContent = `最后更新 ${updated}`;
}
function renderJournal(entries) {
  const list = document.getElementById('journal-list'); list.replaceChildren();
  entries.forEach((entry) => {
    const row = element('article', 'journal-entry');
    const time = entry.date ? element('time', '', entry.date.replaceAll('-', '.')) : element('span', 'journal-date', '');
    if (entry.date) time.dateTime = entry.date;
    const copy = element('div'); copy.append(element('h3', '', entry.title));
    if (entry.body) copy.append(element('p', '', entry.body));
    row.append(time, copy);
    if (entry.tag) row.append(element('span', 'journal-tag', entry.tag));
    list.append(row);
  });
}
async function init() {
  try {
    const response = await fetch('./content.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Content response ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.projects) || !Array.isArray(data.tasks) || !Array.isArray(data.journal)) throw new Error('Invalid content structure');
    renderProjects(data.projects); renderTasks(data.tasks, data.updated); renderJournal(data.journal);
    if (typeof data.github === 'string' && /^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(data.github)) {
      const link = document.getElementById('github-link'); link.href = data.github; link.hidden = false;
    }
  } catch (error) {
    document.getElementById('data-error').hidden = false;
    document.querySelectorAll('.loading-note').forEach((node) => node.textContent = '记录暂时无法读取。');
    console.error('Unable to load public site content:', error);
  }
}
init();
