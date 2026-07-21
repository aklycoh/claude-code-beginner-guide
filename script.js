const copyButtons = document.querySelectorAll('[data-copy]');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
}

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      showToast('已复制到剪贴板');
    } catch {
      showToast('复制失败，请手动选择文字');
    }
  });
});

document.querySelectorAll('.os-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.os-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.classList.toggle('hidden', panel.dataset.panel !== tab.dataset.os);
    });
  });
});

const lessonButtons = [...document.querySelectorAll('.lesson-check')];
const lessonProgress = document.querySelector('#lesson-progress');
const progressLabel = document.querySelector('#progress-label');
const savedLessons = new Set(JSON.parse(localStorage.getItem('claude-guide-progress') || '[]'));

function updateLessonProgress() {
  lessonButtons.forEach((button) => {
    const id = button.closest('[data-lesson]').dataset.lesson;
    const done = savedLessons.has(id);
    button.classList.toggle('done', done);
    button.textContent = done ? '✓ 已完成' : '完成本课';
  });
  lessonProgress.value = savedLessons.size;
  progressLabel.textContent = `${savedLessons.size} / 9`;
  localStorage.setItem('claude-guide-progress', JSON.stringify([...savedLessons]));
}

lessonButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.closest('[data-lesson]').dataset.lesson;
    savedLessons.has(id) ? savedLessons.delete(id) : savedLessons.add(id);
    updateLessonProgress();
  });
});
updateLessonProgress();

const progressBar = document.querySelector('#reading-progress-bar');
const lessonLinks = [...document.querySelectorAll('.lesson-nav a')];
const lessons = [...document.querySelectorAll('.lesson')];

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  let current = lessons[0]?.id;
  lessons.forEach((lesson) => {
    if (lesson.getBoundingClientRect().top <= 150) current = lesson.id;
  });
  lessonLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${current}`));
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();
