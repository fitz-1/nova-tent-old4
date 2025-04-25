// You can expand interactivity here in the future.
// For now, simple logging of overlay icon clicks.

document.querySelectorAll('.overlay-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      console.log('Icon clicked:', icon);
      alert('This could lead to more info or interaction!');
    });
  });
  