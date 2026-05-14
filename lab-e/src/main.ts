interface AppState {
  currentStyle: string;
  styles: Record<string, string>;
}

const appState: AppState = {
  currentStyle: "Style 1",
  styles: {
    "Style 1": "style1.css",
    "Style 2": "style2.css",
    "Style 3": "style3.css"
  }
};

function addStyleLink(href: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function removeStyleLink(href: string): void {
  const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
  links.forEach(link => link.remove());
}

function changeStyle(styleName: string): void {
  if (styleName === appState.currentStyle) return;
  const oldHref = appState.styles[appState.currentStyle];
  const newHref = appState.styles[styleName];
  removeStyleLink(oldHref);
  addStyleLink(newHref);
  appState.currentStyle = styleName;
}

function createStyleSwitcher(): void {
  const switcher = document.getElementById('style-switcher');
  if (!switcher) return;

  const title = document.createElement('h3');
  title.textContent = 'Wybierz styl:';
  switcher.appendChild(title);

  Object.keys(appState.styles).forEach(styleName => {
    const button = document.createElement('button');
    button.textContent = styleName;
    button.onclick = () => changeStyle(styleName);
    switcher.appendChild(button);
  });
}

// Inicjalizacja
addStyleLink(appState.styles[appState.currentStyle]);
createStyleSwitcher();
