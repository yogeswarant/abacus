import { getSavedUserSettings, saveUserSettings } from './storage'

const defaultUserSettings = {
  totalTime: 10,
  totalPages: 10,
  quesPerPage: 20,
  config: [null,
    {digits:1, rows: 4},
    {digits:2, rows: 3},
    {digits:2, rows: 4},
    {digits:2, rows: 4},
    {digits:2, rows: 5},
    {digits:2, rows: 5},
    {digits:2, rows: 6},
    {digits:2, rows: 6},
    {digits:2, rows: 7},
    {digits:2, rows: 8}
  ]
}

function getUserSettings() {
  const savedUserSettings = getSavedUserSettings()
  if (savedUserSettings === null) {
    return defaultUserSettings
  }
  return savedUserSettings
}

function setUserSettings(userSettings) {
  saveUserSettings(userSettings)
}

function resetUserSettings() {
  saveUserSettings(defaultUserSettings)
}

export {
  getUserSettings,
  setUserSettings,
  resetUserSettings
} 