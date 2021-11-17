const getSavedUserSettings = () => {
  const usStr = localStorage.getItem('user-settings')
  if (usStr !== null) {
    return JSON.parse(usStr)
  } 
  return null
}

const saveUserSettings = (userSettings) => {
  return localStorage.setItem('user-settings', JSON.stringify(userSettings))
}

export {
  getSavedUserSettings,
  saveUserSettings
}