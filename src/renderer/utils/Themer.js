import andromeda from '../../../static/themes/andromeda.json'
import ayu from '../../../static/themes/ayu.json'
import dracula from '../../../static/themes/dracula.json'
import dva from '../../../static/themes/dva.json'
import github from '../../../static/themes/github.json'
/**
 * Themer provides custom application styling.
 */
class Themer {
  constructor() {
    this.themes = [ayu, andromeda, dracula, dva, github]
  }

  /**
   * Apply a theme with the given name. The name should correspond to the
   * filename _without_ its extension. For example, 'dracula'.
   *
   * @param string themeName - The name of the theme.
   */
  apply(themeName) {
    const theme = this.getTheme(themeName)
    if (!theme || !theme.colors) {
      console.warn('未找到主题或主题无colors字段:', themeName)
      return
    }
    for (const k in theme.colors) {
      document.documentElement.style.setProperty(k, theme.colors[k])
    }
  }

  /**
   * Get a theme by name.
   *
   * @param string themeName - The name of the theme.
   */
  getTheme(themeName) {
    return this.themes.find(e => {
      return e.name === themeName || this._normalizeName(e.name) === themeName
    })
  }

  _normalizeName(name) {
    return name.replace(/\s+/g, '').toLowerCase()
  }

  /**
   * Get the name of a given theme.
   *
   * @param {object} theme - The theme.
   */
  getThemeName(theme) {
    return theme.name
  }

  /**
   * Get the value of a given theme's color property.
   *
   * @param {object} theme - The theme.
   * @param string value - The theme key to query.
   */
  getThemeValue(theme, value) {
    return theme.colors[value]
  }

  /**
   * Get the i18n key for a given theme name.
   *
   * @param {string} themeName - The raw theme name (e.g., "Midnight Violet").
   */
  getI18nKeyForThemeName(themeName) {
    return themeName.split(' ').map((word, index) => {
      if (index === 0) {
        return word.toLowerCase()
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
    }).join('')
  }
}

export default new Themer()
